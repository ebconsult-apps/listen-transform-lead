
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const ChangeManagementService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Change Management Consulting | Licensed Psychologist | CLEAR Framework"
        description="Change management consulting built on clinical psychology. Licensed psychologist Erik Bohjort helps organizations drive transformation that sticks using the CLEAR framework."
        path="/services/change-management"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Change Management Consulting",
          "description": "Psychology-based change management consulting using the CLEAR Change Framework",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort", "jobTitle": "Licensed Psychologist" },
          },
          "serviceType": "Change Management Consulting",
          "areaServed": ["Europe", "Scandinavia"],
          "url": "https://clear-framework.com/services/change-management",
        }}
      />

      {/* Hero */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Change Management</div>
          <h1 className="heading-xl mb-6">
            Change Management Built on Clinical Psychology
          </h1>
          <p className="body-lg max-w-3xl">
            70% of change initiatives fail. Not because the strategy is wrong — but because
            leaders underestimate the psychology of why people resist, disengage, and revert
            to old patterns. Erik Bohjort is a licensed psychologist who brings clinical-level
            understanding of human behavior to organizational transformation.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-8">Why Most Change Programs Fail</h2>
          <div className="space-y-6">
            {[
              {
                title: "They treat symptoms, not root causes",
                desc: "Workshops, town halls, and communication campaigns address the surface. The real barriers — fear, identity threat, loss of status, broken trust — sit underneath and go unaddressed.",
              },
              {
                title: "They assume rational buy-in is enough",
                desc: "People don't resist change because they don't understand it. They resist because change threatens their routines, relationships, and sense of competence. Logical arguments alone don't overcome emotional resistance.",
              },
              {
                title: "They impose top-down mandates on complex systems",
                desc: "Organizations are living systems with feedback loops, power dynamics, and emergent behaviors. Linear project plans can't navigate that complexity — you need an adaptive, evidence-based approach.",
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

      {/* The CLEAR Approach */}
      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-4">How the CLEAR Framework Works</h2>
          <p className="body-md text-foreground/70 mb-8 max-w-3xl">
            CLEAR treats organizational change the way a psychologist treats behavior change — by
            understanding what actually drives people, then designing interventions that work
            with human nature rather than against it.
          </p>
          <div className="space-y-5">
            {[
              { phase: "Clarity", desc: "Map the real dynamics at play — not just the org chart, but the psychological landscape. Who feels threatened? Where is trust broken? What are the hidden incentives maintaining the status quo?" },
              { phase: "Leverage", desc: "Identify the highest-impact intervention points. Systems thinking reveals where small changes create outsized effects — the leverage points that strategy decks miss." },
              { phase: "Experimentation", desc: "Test interventions at small scale before committing. Behavioral design principles ensure experiments are structured to produce genuine learning, not confirmation bias." },
              { phase: "Analysis", desc: "Measure what actually changed — in behavior, not just in survey responses. Evidence-based evaluation using the rigor of psychological research methodology." },
              { phase: "Refinement", desc: "Adapt and scale what works. Discard what doesn't. Build organizational capability for ongoing change, not dependency on external consultants." },
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

      {/* Who It's For */}
      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-6">Who This Is For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Organizations where a change initiative has stalled or failed and you need to understand why",
              "Leadership teams preparing for a major transformation — restructuring, merger, digital shift, culture change",
              "HR and OD leaders who want an evidence-based alternative to conventional change consulting",
              "Executives who sense that the real barriers to change are behavioral, not strategic",
            ].map((item, i) => (
              <div key={i} className="glass-card p-5 flex gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="heading-md mb-4">Start With a Conversation</h2>
            <p className="body-md text-foreground/70 mb-8 max-w-xl mx-auto">
              Book a free 30-minute discovery call. We'll discuss your situation and
              whether the CLEAR approach is the right fit. No commitment, no pitch.
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

export default ChangeManagementService;
