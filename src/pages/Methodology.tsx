
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  Network,
  FlaskConical,
  LineChart,
  RefreshCw,
  Brain,
  GitCompareArrows,
  CheckCircle,
  Repeat,
  ExternalLink,
} from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL = "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const steps = [
  {
    letter: "C",
    title: "Clarity of Objectives",
    phase: "Unfreeze",
    icon: <Target className="h-6 w-6 text-primary" />,
    description: "Define what success looks like and why the change matters. Align stakeholders around a shared North Star with measurable OKRs. Without clarity, everything that follows is guesswork.",
    activities: [
      "Stakeholder alignment workshops",
      "Measurable OKRs (Objectives and Key Results)",
      "Organizational readiness assessment",
    ],
  },
  {
    letter: "L",
    title: "Leverage through Systems Mapping",
    phase: "Unfreeze",
    icon: <Network className="h-6 w-6 text-primary" />,
    description: "Map the organizational system to find where small, targeted changes create maximum impact. Most change initiatives fail because they target symptoms, not leverage points.",
    activities: [
      "Cross-functional systems mapping",
      "Identify feedback loops and dependencies",
      "Prioritize high-impact intervention points",
    ],
  },
  {
    letter: "E",
    title: "Experimentation through Prototyping",
    phase: "Change",
    icon: <FlaskConical className="h-6 w-6 text-primary" />,
    description: "Test interventions on a small scale before committing. Low-cost experiments at identified leverage points generate real data about what works — and what doesn't — before you go all-in.",
    activities: [
      "Design low-risk pilot projects",
      "Rapid prototyping at leverage points",
      "Gather immediate data and feedback",
    ],
  },
  {
    letter: "A",
    title: "Analysis and Reflection",
    phase: "Refreeze",
    icon: <LineChart className="h-6 w-6 text-primary" />,
    description: "Rigorously evaluate what happened against your key results. What worked? What didn't? What surprised you? Surprises are the most valuable — they reveal gaps in your understanding.",
    activities: [
      "Structured review against key results",
      "Reflective discussions on surprises and failures",
      "Update systems map with new understanding",
    ],
  },
  {
    letter: "R",
    title: "Refinement and Scaling",
    phase: "Refreeze",
    icon: <RefreshCw className="h-6 w-6 text-primary" />,
    description: "Feed learnings back into your objectives, systems understanding, and process. Scale what works. Begin the next cycle with renewed clarity. CLEAR is iterative — each pass gets sharper.",
    activities: [
      "Refine vision and objectives based on evidence",
      "Scale successful interventions organization-wide",
      "Begin the next CLEAR cycle or embed changes",
    ],
  },
];

const comparisons = [
  {
    name: "Kotter's 8-Step Model",
    diff: "Linear and sequential. CLEAR is iterative — each cycle deepens understanding. CLEAR adds systems mapping and experimentation where Kotter prescribes fixed stages.",
  },
  {
    name: "ADKAR",
    diff: "Focuses on individual behavior change. CLEAR operates at the organizational system level — addressing structural dynamics, not just individual readiness.",
  },
  {
    name: "Lean Change Management",
    diff: "Shares the iterative spirit. CLEAR adds systematic leverage analysis through systems mapping and grounds the approach in behavioral science.",
  },
  {
    name: "Design Thinking",
    diff: "Great for product innovation. CLEAR extends the same principles to full organizational change, adding systems mapping and behavioral science foundations.",
  },
  {
    name: "OBM",
    diff: "Applies behavioral analysis to performance. CLEAR adds systems-level mapping and purpose-driven clarity to ensure interventions align with strategic objectives.",
  },
];

const Methodology = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="CLEAR Change Framework Methodology | Erik Bohjort"
        description="The CLEAR Change Framework: a five-step, iterative approach to organizational transformation combining behavioral science, systems thinking, and experimentation. Created by licensed psychologist Erik Bohjort."
        path="/methodology"
      />

      {/* Hero */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Methodology</div>
          <h1 className="heading-xl mb-6">The CLEAR Change Framework</h1>
          <p className="body-lg max-w-3xl">
            A five-step, iterative methodology for organizational change. Built on
            Lewin's Unfreeze-Change-Refreeze model, grounded in behavioral science, and
            designed for organizations where the challenges are too complex for simple prescriptions.
          </p>
        </div>
      </section>

      <article className="pb-24">
        <div className="section-container max-w-4xl mx-auto">

          {/* Foundations — brief */}
          <section className="glass-card p-8 md:p-10 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">Foundations</h2>
            </div>
            <p className="body-md mb-4">
              CLEAR integrates three traditions: <strong>behavioral science</strong> (how people
              and organizations actually change), <strong>systems thinking</strong> (how to find
              leverage in complex, interconnected organizations), and <strong>design thinking</strong> (how
              to learn through rapid prototyping). The framework maps onto Kurt Lewin's
              Unfreeze-Change-Refreeze model, with listening as the catalyst at every stage.
            </p>
            <p className="body-md">
              Created by Erik Bohjort, Licensed Psychologist, and delivered by a team of
              senior consultants, CLEAR bridges the gap between academic research and
              practical organizational needs.
            </p>
          </section>

          {/* The Five Steps */}
          <h2 className="heading-md text-center mb-10">The Five Steps</h2>

          <div className="space-y-6 mb-10">
            {steps.map((step) => (
              <div key={step.letter} className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
                <div className="absolute top-0 left-0 h-16 w-1 bg-primary"></div>
                <div className="ml-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="tag mb-1">{step.phase} Phase</div>
                      <h3 className="text-xl font-bold">{step.letter} — {step.title}</h3>
                    </div>
                  </div>
                  <p className="body-md mb-4">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.activities.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-sm text-foreground/70 bg-muted/50 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Iterative */}
          <section className="glass-card p-8 md:p-10 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Repeat className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">CLEAR Is Cyclical</h2>
            </div>
            <p className="body-md">
              After Refinement, you don't stop — you revisit Clarity with new understanding.
              Each cycle sharpens your objectives, deepens your systems map, and improves your
              experiments. This is what separates CLEAR from linear models: the organization
              gets better at changing, not just at the specific change.
            </p>
          </section>

          {/* Comparisons */}
          <section className="glass-card p-8 md:p-10 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <GitCompareArrows className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">How CLEAR Compares</h2>
            </div>
            <div className="space-y-4">
              {comparisons.map((c) => (
                <div key={c.name} className="bg-muted/30 rounded-xl p-5">
                  <h3 className="font-bold mb-1">vs. {c.name}</h3>
                  <p className="text-sm text-foreground/70">{c.diff}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="glass-card p-8 md:p-10 text-center">
            <h2 className="heading-md mb-4">Ready to Apply CLEAR?</h2>
            <p className="body-md mb-8 max-w-xl mx-auto">
              Start with a free discovery call to discuss your challenges,
              or take the assessment to see where your organization stands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Book a Discovery Call
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <Link to="/assessment" className="btn-secondary">
                Take the Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default Methodology;
