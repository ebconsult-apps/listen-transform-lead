import { Link } from "react-router-dom";
import { ArrowRight, Upload, Sparkles, Lock, FileDown } from "lucide-react";
import SEO from "@/components/SEO";
import Pipeline from "@/components/product/Pipeline";

const USE_CASES = [
  { title: "Customer churn", body: "Move at-risk customers back to the behaviours that predict retention." },
  { title: "Onboarding adoption", body: "Get new users to the activating action — and keep them there." },
  { title: "Compliance", body: "Lift adherence without relying on willpower or another reminder email." },
  { title: "Policy uptake", body: "Help citizens take the action a new policy depends on." },
];

const STEPS = [
  { icon: Upload, title: "Describe + upload", body: "Your challenge, stakeholders, timeline, and any documents." },
  { icon: Sparkles, title: "Clarify + Leverage", body: "Get measurable OKRs, a systems map, and the top leverage points." },
  { icon: Lock, title: "Unlock the full report", body: "COM-B barriers with evidence, gap log, and discovery activities." },
  { icon: FileDown, title: "Export", body: "Share as PDF or Markdown — ready for your team." },
];

const ProductLanding = () => {
  return (
    <div className="bg-background">
      <SEO
        title="CLEAR — Behavioral insights, productized"
        description="Move your target group's behavior — backed by science, without a six-figure consultancy. Self-serve behavioral analysis using the CLEAR framework."
        path="/product"
      />

      {/* Hero */}
      <section className="section-container text-center">
        <span className="tag mb-6">Behavioral insights, productized</span>
        <h1 className="heading-xl max-w-4xl mx-auto mb-6">
          Move your target group's behavior — backed by science, without a
          six-figure consultancy
        </h1>
        <p className="body-lg max-w-2xl mx-auto mb-8">
          Bring a behavior-change challenge, upload what you have, and get a
          clear objective, a systems map, and the highest-leverage points to act
          on — in minutes, not months.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/login" className="btn-primary text-lg px-8 py-3">
            Log in
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/signup" className="btn-secondary text-lg px-8 py-3">
            Start free
          </Link>
        </div>
      </section>

      {/* How it works — pipeline */}
      <section className="section-container pt-0">
        <div className="glass-card p-8 sm:p-12">
          <h2 className="heading-lg text-center mb-3">The CLEAR pipeline</h2>
          <p className="body-md text-center max-w-2xl mx-auto mb-10">
            Stage 1 delivers Clarify and Leverage end-to-end. Experiment, Analyse
            and Refine follow.
          </p>
          <Pipeline />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {STEPS.map((s) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-foreground/60">{s.body}</p>
              </div>
            ))}
          </div>
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
            Built on the CLEAR Change Framework — the same behavioral-science
            method used in enterprise change programs, now self-serve.
          </p>
          <p className="text-sm text-foreground/50 mt-4">
            Your documents are processed in the EU and never used to train models.
          </p>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section-container pt-0 text-center">
        <h2 className="heading-lg mb-4">Start free. Pay when you need the full report.</h2>
        <p className="body-md max-w-xl mx-auto mb-8">
          The teaser is always free. Unlock a single report one-off, or subscribe
          for unlimited.
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
