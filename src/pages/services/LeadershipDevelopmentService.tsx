
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const LeadershipDevelopmentService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Leadership Development Programs | Licensed Psychologist | Evidence-Based"
        description="Leadership development that changes how leaders think and act. Licensed psychologist Erik Bohjort designs evidence-based programs using psychometric assessments and behavioral science."
        path="/services/leadership-development"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Leadership Development Programs",
          "description": "Psychology-based leadership development using psychometric assessments and behavioral science",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort", "jobTitle": "Licensed Psychologist" },
          },
          "serviceType": "Leadership Development",
          "areaServed": ["Europe", "Scandinavia"],
          "url": "https://clear-framework.com/services/leadership-development",
        }}
      />

      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Leadership Development</div>
          <h1 className="heading-xl mb-6">
            Leadership Development That Goes Deeper Than Any Workshop
          </h1>
          <p className="body-lg max-w-3xl">
            Most leadership programs change what leaders know. They don't change how leaders
            lead. Erik Bohjort is a licensed psychologist who designs development programs
            around how people actually change behavior — using psychometric assessment,
            evidence-based coaching, and structured frameworks.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-8">Why Traditional Programs Fall Short</h2>
          <div className="space-y-6">
            {[
              {
                title: "Knowledge doesn't equal behavior change",
                desc: "Leaders attend the workshop, pass the assessment, and return to the same patterns. Knowing about emotional intelligence and practicing it under pressure are fundamentally different capabilities.",
              },
              {
                title: "Generic frameworks ignore individual psychology",
                desc: "Every leader has a unique behavioral profile — different cognitive biases, stress responses, communication defaults, and blind spots. One-size-fits-all programs can't address what makes each leader effective or ineffective.",
              },
              {
                title: "No connection between assessment and development",
                desc: "Psychometric data gets collected, shared in a debrief, and forgotten. Without a structured plan that links assessment insights to specific behavioral goals, the data never translates into growth.",
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 flex gap-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-foreground/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-4">The Psychology-Based Approach</h2>
          <p className="body-md text-foreground/70 mb-8 max-w-3xl">
            Each program is built around three pillars that clinical psychology shows are
            necessary for lasting behavior change.
          </p>
          <div className="space-y-5">
            {[
              { phase: "Psychometric Assessment", desc: "Rigorous profiling of each leader's behavioral patterns, decision-making tendencies, stress responses, and interpersonal dynamics. Not a personality quiz — clinical-grade tools that reveal what drives behavior under real conditions." },
              { phase: "Structured Coaching", desc: "One-on-one and group coaching sessions that connect assessment data to specific, measurable behavioral goals. Each session builds on the last, creating a progression arc — not isolated conversations." },
              { phase: "Applied Practice", desc: "Real organizational challenges become the development vehicle. Leaders practice new behaviors in live situations with structured reflection, feedback loops, and accountability. This is where knowledge becomes capability." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">{item.phase}</h3>
                  <p className="text-foreground/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-6">Program Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">Individual Executive Development</h3>
              <p className="text-foreground/70 text-sm">Psychometric assessment + 6-12 coaching sessions tailored to a single leader's growth edge. Ideal for senior leaders navigating a transition, new role, or high-stakes challenge.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">Leadership Team Program</h3>
              <p className="text-foreground/70 text-sm">Team-level assessment, collective debrief, and facilitated development arc for intact leadership teams. Addresses both individual growth and team dynamics.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">Leadership Cohort</h3>
              <p className="text-foreground/70 text-sm">Cross-functional group of leaders progressing through a structured development journey together. Peer learning, shared assessment insights, and collective accountability.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">Diagnostic Workshop</h3>
              <p className="text-foreground/70 text-sm">1-2 day intensive session for organizations evaluating their leadership development needs. Produces a clear picture of strengths, gaps, and recommended next steps.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="heading-md mb-4">Start With a Conversation</h2>
            <p className="body-md text-foreground/70 mb-8 max-w-xl mx-auto">
              Every program is tailored. Book a free discovery call to discuss your
              leadership team's challenges and what a development arc could look like.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Book a Discovery Call
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <Link to="/assessment" className="btn-secondary">
                Take the Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadershipDevelopmentService;
