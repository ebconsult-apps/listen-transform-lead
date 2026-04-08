import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { ArrowRight, Check, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { trackFormSubmission } from "@/utils/analytics";
import { z } from "zod";
import type { AssessmentData } from "./AssessmentQuiz";

interface AssessmentResultsProps {
  data: AssessmentData;
}

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
});

const dimensionMeta: Record<
  string,
  { label: string; recommendation: string }
> = {
  clarity: {
    label: "Clarity",
    recommendation:
      "Consider running structured goal-setting workshops with cross-functional teams to establish shared objectives. Use OKRs (Objectives and Key Results) to translate vision into measurable targets that everyone understands and can rally behind.",
  },
  leverage: {
    label: "Leverage",
    recommendation:
      "Invest in systems mapping sessions to visualize the interconnections within your organization. Identifying key leverage points will help you focus resources where small changes can produce the greatest systemic impact.",
  },
  experimentation: {
    label: "Experimentation",
    recommendation:
      "Build a culture of safe-to-fail experiments by starting with low-risk pilot projects. Create a structured framework for rapid prototyping that allows teams to test assumptions quickly before committing to large-scale rollouts.",
  },
  analysis: {
    label: "Analysis",
    recommendation:
      "Establish regular reflection cycles with structured review meetings after every initiative. Implement dashboards that track key metrics and create feedback loops so insights are captured systematically rather than anecdotally.",
  },
  refinement: {
    label: "Refinement",
    recommendation:
      "Create formal learning loops that connect insights from analysis back into your planning process. Develop clear criteria for scaling successful experiments and build institutional memory so organizational learning compounds over time.",
  },
};

const dimensionKeys = [
  "clarity",
  "leverage",
  "experimentation",
  "analysis",
  "refinement",
] as const;

const inputClasses =
  "w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const AssessmentResults = ({ data }: AssessmentResultsProps) => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Build radar data
  const radarData = dimensionKeys.map((key) => ({
    dimension: dimensionMeta[key].label,
    score: data[key],
    fullMark: 5,
  }));

  // Interpretation
  const total = data.totalScore;
  let badge: { label: string; color: string; description: string };
  if (total <= 12) {
    badge = {
      label: "Significant Opportunity",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      description:
        "Your organization has considerable room for improvement in change management. A structured approach like the CLEAR framework could help build the foundations you need.",
    };
  } else if (total <= 18) {
    badge = {
      label: "Building Momentum",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      description:
        "You have some elements in place but gaps remain. Targeted interventions in your weaker areas could unlock significant progress.",
    };
  } else {
    badge = {
      label: "Strong Foundation",
      color: "bg-green-100 text-green-800 border-green-200",
      description:
        "Your organization demonstrates strong change readiness. Fine-tuning your approach with the CLEAR framework could help you reach the next level.",
    };
  }

  // Find 2 lowest dimensions
  const sorted = [...dimensionKeys].sort((a, b) => data[a] - data[b]);
  const lowestTwo = sorted.slice(0, 2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = contactSchema.safeParse(contactForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: contactForm.name,
        email: contactForm.email,
        company: contactForm.company,
        orgSize: data.orgSize,
        role: data.role,
        challenge: data.challenge,
        clarity: data.clarity,
        leverage: data.leverage,
        experimentation: data.experimentation,
        analysis: data.analysis,
        refinement: data.refinement,
        totalScore: data.totalScore,
      };

      const response = await fetch("/assessment-handler.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit form.");
      }

      setIsSubmitted(true);
      trackFormSubmission("assessment_report");
      toast({
        title: "Report request sent!",
        description: "Check your inbox for your full change readiness report.",
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Radar Chart */}
      <div className="glass-card p-8 md:p-10">
        <h2 className="heading-md mb-2 text-center">Your CLEAR Readiness Profile</h2>
        <p className="text-foreground/60 text-center mb-6">
          Based on your responses across the five CLEAR dimensions
        </p>
        <div className="w-full max-w-[400px] mx-auto" style={{ aspectRatio: "1" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
              <PolarGrid stroke="hsl(220 16% 90%)" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "hsl(220 20% 10%)", fontSize: 12, fontWeight: 500 }}
                tickMargin={8}
              />
              <PolarRadiusAxis
                domain={[0, 5]}
                tickCount={6}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(220 80% 48%)"
                fill="hsl(220 80% 48%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overall Score */}
      <div className="glass-card p-8 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-foreground/60 mb-1">Overall Score</p>
            <p className="text-4xl font-bold">{total}<span className="text-lg font-normal text-foreground/50">/25</span></p>
          </div>
          <div className={`inline-flex self-start sm:self-center px-4 py-1.5 rounded-full text-sm font-semibold border ${badge.color}`}>
            {badge.label}
          </div>
        </div>
        <p className="body-md">{badge.description}</p>
      </div>

      {/* Dimension Breakdown */}
      <div className="glass-card p-8 md:p-10">
        <h3 className="text-xl font-bold mb-6">Dimension Breakdown</h3>
        <div className="space-y-5">
          {dimensionKeys.map((key) => {
            const score = data[key];
            const meta = dimensionMeta[key];
            const isLow = lowestTwo.includes(key);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{meta.label}</span>
                  <span className="text-sm font-semibold">{score}/5</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(score / 5) * 100}%`,
                      backgroundColor: score <= 2 ? "hsl(25 95% 53%)" : score <= 3 ? "hsl(45 93% 47%)" : "hsl(142 71% 45%)",
                    }}
                  />
                </div>
                {isLow && (
                  <div className="mt-3 p-4 bg-muted/40 rounded-xl">
                    <p className="text-sm font-medium text-primary mb-1">Recommendation</p>
                    <p className="text-sm text-foreground/70">{meta.recommendation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Gate */}
      <div className="glass-card p-8 md:p-10">
        <h3 className="text-xl font-bold mb-2">Get Your Full Change Readiness Report</h3>
        <p className="text-foreground/70 mb-6">
          Your report includes detailed recommendations, benchmark comparisons, and suggested next steps.
        </p>

        {submitError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
            {submitError}
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-medium text-lg">Report request sent!</p>
            <p className="text-foreground/60 text-sm mt-1">Check your inbox shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="assess-name" className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="assess-name"
                name="name"
                value={contactForm.name}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="assess-email" className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                id="assess-email"
                name="email"
                value={contactForm.email}
                onChange={handleChange}
                className={inputClasses}
                placeholder="your.email@company.com"
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="assess-company" className="block text-sm font-medium text-foreground mb-2">
                Company <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="assess-company"
                name="company"
                value={contactForm.company}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Your organization"
              />
              {errors.company && <p className="mt-1 text-sm text-destructive">{errors.company}</p>}
            </div>
            <button
              type="submit"
              className="btn-primary w-full justify-center relative overflow-hidden"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <span className={`inline-flex items-center whitespace-nowrap ${isSubmitting ? "opacity-0" : ""}`}>
                Send My Report
                <Send className="ml-2 h-4 w-4 flex-shrink-0" />
              </span>
            </button>
          </form>
        )}
      </div>

      {/* CTA */}
      <div className="glass-card p-8 md:p-10 text-center">
        <h3 className="text-xl font-bold mb-3">Discuss Your Results with Erik</h3>
        <p className="text-foreground/70 mb-6">
          Book a free discovery call to explore how the CLEAR framework can address your organization's specific challenges.
        </p>
        <a
          href={BOOKINGS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Book a Free Discovery Call
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default AssessmentResults;
