
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Layers, UserCircle, Mic, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL = "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Services | CLEAR Change Framework | Erik Bohjort"
        description="Organizational change consulting powered by the CLEAR Change Framework. Diagnostic workshops, implementation programs, executive coaching, and keynote speaking."
        path="/services"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "CLEAR Change Framework Services",
          "description": "Organizational transformation consulting using the CLEAR Change Framework",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort" }
          },
          "serviceType": ["Organizational Change Management", "Leadership Development", "Systems Thinking Consulting"],
          "url": "https://clear-framework.com/services"
        }}
      />

      {/* Hero */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Services</div>
          <h1 className="heading-xl mb-6">How We Work Together</h1>
          <p className="body-lg max-w-3xl">
            Every engagement is built on the <Link to="/methodology" className="text-primary hover:text-primary/80 font-medium">CLEAR Change Framework</Link> and
            led by founder Erik Bohjort. Depending on scope, our team of senior consultants
            can scale to match your organization's needs — from a focused diagnostic to a
            multi-country transformation program.
          </p>
        </div>
      </section>

      {/* Engagement Types */}
      <section className="pb-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-xl font-bold">Diagnostic Workshop</h2>
                <span className="text-sm text-foreground/50 font-medium">1-2 days</span>
              </div>
              <p className="text-foreground/70 mb-4 flex-grow">
                A focused deep-dive into your organization's challenges. We map your system
                dynamics, identify leverage points, and create an actionable roadmap for change.
              </p>
              <p className="text-sm text-foreground/50 mb-6">
                Best for: organizations that know something needs to change but aren't sure where to start.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                  Book a Discovery Call
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <Link to="/services/change-management" className="text-foreground/50 hover:text-foreground/70 text-sm transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-xl font-bold">Leadership Development</h2>
                <span className="text-sm text-foreground/50 font-medium">Tailored programs</span>
              </div>
              <p className="text-foreground/70 mb-4 flex-grow">
                Psychology-backed programs that change how leaders think and act. Psychometric
                assessment, structured coaching, and applied practice — not another workshop
                they'll forget by Monday.
              </p>
              <p className="text-sm text-foreground/50 mb-6">
                Best for: leadership teams, executive cohorts, and individual senior leaders.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                  Book a Discovery Call
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <Link to="/services/leadership-development" className="text-foreground/50 hover:text-foreground/70 text-sm transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-xl font-bold">Executive Coaching & Advisory</h2>
                <span className="text-sm text-foreground/50 font-medium">Ongoing</span>
              </div>
              <p className="text-foreground/70 mb-4 flex-grow">
                Strategic guidance for leaders navigating complex change. Regular sessions
                combining psychological insight with systems thinking — a sounding board
                with substance.
              </p>
              <p className="text-sm text-foreground/50 mb-6">
                Best for: executives and leaders who want ongoing support, not a one-off engagement.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                  Book a Discovery Call
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <Link to="/services/executive-coaching" className="text-foreground/50 hover:text-foreground/70 text-sm transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-xl font-bold">Keynote Speaking & Workshops</h2>
                <span className="text-sm text-foreground/50 font-medium">Event-based</span>
              </div>
              <p className="text-foreground/70 mb-4 flex-grow">
                Keynotes and interactive workshops on organizational change, behavioral design,
                systems thinking, and the CLEAR framework. Tailored to your audience and context.
              </p>
              <p className="text-sm text-foreground/50 mb-6">
                Best for: conferences, leadership offsites, and team development events.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                  Inquire About Availability
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <Link to="/services/workshops" className="text-foreground/50 hover:text-foreground/70 text-sm transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Not sure? */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center">
            <h2 className="heading-md mb-4">Not Sure Where to Start?</h2>
            <p className="body-md mb-6 max-w-xl mx-auto">
              Take the Change Readiness Assessment to identify where your organization's
              biggest gaps are, or book a free discovery call to talk it through.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment" className="btn-primary">
                Take the Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/methodology" className="btn-secondary">
                Learn the Methodology
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
