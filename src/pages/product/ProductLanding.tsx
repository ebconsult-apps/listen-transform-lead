import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Upload, FileDown } from "lucide-react";
import SEO from "@/components/SEO";

const USE_CASES = [
  { title: "Customer churn", body: "Move at-risk customers back to the behaviours that predict retention." },
  { title: "Onboarding adoption", body: "Get new users to the activating action, and keep them there." },
  { title: "Compliance", body: "Lift adherence without relying on willpower or another reminder email." },
  { title: "Policy uptake", body: "Help citizens take the action a new policy depends on." },
];

/**
 * One connected flow: what you do → what CLEAR gives you, with the C/L/E
 * phase chips mapped onto the steps they belong to (colours from --phase-*).
 * Analyse and Refine are deliberately not steps — they aren't shipped in-app;
 * the footnote under the flow says so honestly instead of a row of dimmed
 * "Later" chips.
 */
interface FlowStep {
  title: string;
  body: string;
  badge?: string;
  icon?: typeof Upload;
  phase?: { letter: string; token: string };
}

const FLOW: FlowStep[] = [
  {
    icon: Upload,
    title: "Describe your challenge",
    body: "The behavior you need to change, stakeholders, timeline — plus any documents you have.",
  },
  {
    phase: { letter: "C", token: "--phase-c" },
    title: "Clarify",
    body: "A measurable objective with key results, so success is defined before you act.",
    badge: "Free",
  },
  {
    phase: { letter: "L", token: "--phase-l" },
    title: "Leverage",
    body: "A systems map of what drives the behavior, and the top leverage points to act on.",
    badge: "Teaser free",
  },
  {
    phase: { letter: "E", token: "--phase-e" },
    title: "Unlock the full report",
    body: "COM-B barriers with evidence, a gap log, cited research, and ready-to-run experiment test cards.",
    badge: "One-off or credits",
  },
  {
    icon: FileDown,
    title: "Export & run",
    body: "Share it as PDF or Markdown, and run the experiments with your team.",
  },
];

const ProductLanding = () => {
  return (
    <div className="bg-background">
      <SEO
        title="CLEAR: Behavioral insights, productized"
        description="Move your target group's behavior, backed by science, without a six-figure consultancy. Self-serve behavioral analysis using the CLEAR framework."
        path="/product"
      />

      {/* Hero */}
      <section className="section-container text-center">
        <span className="tag mb-6">Behavioral insights, productized</span>
        <h1 className="heading-xl max-w-4xl mx-auto mb-6">
          Move your target group's behavior, backed by science, without a
          six-figure consultancy
        </h1>
        <p className="body-lg max-w-2xl mx-auto mb-8">
          Bring a behavior-change challenge, upload what you have, and get a
          clear objective, a systems map, and the highest-leverage points to act
          on, in minutes, not months.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signup" className="btn-primary text-lg px-8 py-3">
            Start free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/product/sample" className="btn-secondary text-lg px-8 py-3">
            See a full sample report
          </Link>
        </div>
        <p className="text-sm text-foreground/50 mt-4">
          No credit card. Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
          .
        </p>
        <p className="text-sm text-foreground/60 mt-6 max-w-2xl mx-auto">
          Built on the{" "}
          <Link to="/methodology" className="text-primary hover:underline">
            CLEAR Change Framework
          </Link>{" "}
          by Erik Bohjort, a licensed psychologist and behavioral-science
          consultant, grounded in the COM-B model of behavior.
        </p>
      </section>

      {/* How it works — one connected flow */}
      <section className="section-container pt-0">
        <div className="glass-card p-8 sm:p-12">
          <h2 className="heading-lg text-center mb-3">How CLEAR works</h2>
          <p className="body-md text-center max-w-2xl mx-auto mb-10">
            From a rough challenge description to an evidence-based action plan,
            in one guided flow.
          </p>
          <ol className="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-0">
            {FLOW.map((s, i) => (
              <li key={s.title} className="flex-1 flex items-start lg:items-stretch">
                <div className="flex-1 text-center px-2">
                  {s.phase ? (
                    <div
                      className="phase-chip mx-auto mb-3"
                      style={{ backgroundColor: `hsl(var(${s.phase.token}))` }}
                      aria-hidden
                    >
                      {s.phase.letter}
                    </div>
                  ) : (
                    <div className="mx-auto h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      {s.icon && <s.icon className="h-4 w-4 text-primary" />}
                    </div>
                  )}
                  <h3 className="font-semibold mb-1">
                    <span className="text-foreground/40 mr-1.5">{i + 1}.</span>
                    {s.title}
                  </h3>
                  {s.badge && (
                    <span className="inline-block rounded-full bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 mb-2">
                      {s.badge}
                    </span>
                  )}
                  <p className="text-sm text-foreground/60">{s.body}</p>
                </div>
                {i < FLOW.length - 1 && (
                  <ChevronRight
                    className="hidden lg:block h-5 w-5 text-foreground/30 shrink-0 self-center"
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ol>
          <p className="text-xs text-foreground/50 text-center mt-8 max-w-2xl mx-auto">
            The CLEAR method closes the loop with Analyse and Refine. Those
            phases are in active development in the app — today your report ends
            with experiment designs ready to run with your team.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="section-container pt-0">
        <h2 className="heading-lg text-center mb-10">Built for behavior that matters</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {USE_CASES.map((u) => (
            <div key={u.title} className="glass-card p-6">
              <h3 className="font-semibold mb-2">{u.title}</h3>
              <p className="text-sm text-foreground/70">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof */}
      <section className="section-container pt-0">
        <div className="glass-card p-8 sm:p-12 text-center bg-primary/5">
          <p className="text-xl sm:text-2xl font-medium max-w-3xl mx-auto">
            Built on the CLEAR Change Framework: the same behavioral-science
            method used in enterprise change programs, now self-serve.
          </p>
          <p className="text-sm text-foreground/50 mt-4">
            Your data is stored in the EU. AI analysis runs on Anthropic's Claude
            under a data-processing agreement, and your documents are never used
            to train models.
          </p>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section-container pt-0 text-center">
        <h2 className="heading-lg mb-4">Start free. Pay when you need the full report.</h2>
        <p className="body-md max-w-xl mx-auto mb-8">
          The teaser is always free. Unlock a single report one-off, or subscribe
          for monthly report credits.
        </p>
        <Link to="/pricing" className="btn-primary text-lg px-8 py-3">
          See pricing
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </section>
    </div>
  );
};

export default ProductLanding;
