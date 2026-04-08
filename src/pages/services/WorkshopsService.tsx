
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, CheckCircle } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const WorkshopsService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Workshops & Keynotes | Organizational Change & Leadership | Erik Bohjort"
        description="Interactive workshops and keynotes on organizational change, behavioral design, and leadership development. Tailored to your audience by licensed psychologist Erik Bohjort."
        path="/services/workshops"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Workshops & Keynote Speaking",
          "description": "Interactive workshops and keynotes on organizational change, behavioral design, and leadership",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort", "jobTitle": "Licensed Psychologist" },
          },
          "serviceType": ["Workshops", "Keynote Speaking"],
          "areaServed": ["Europe", "Scandinavia"],
          "url": "https://clear-framework.com/services/workshops",
        }}
      />

      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Workshops & Keynotes</div>
          <h1 className="heading-xl mb-6">
            Workshops That Change Behavior, Not Just Awareness
          </h1>
          <p className="body-lg max-w-3xl">
            Keynotes and interactive workshops on organizational change, behavioral design,
            systems thinking, and the CLEAR framework. Each session is designed by a licensed
            psychologist and tailored to your audience and context — whether it's a 200-person
            conference or a 12-person leadership offsite.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-6">Workshop Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "The Psychology of Organizational Change",
                desc: "Why people resist change, how to design interventions that work with human nature, and what the research actually says about making transformation stick.",
                format: "Keynote (45-60 min) or Half-day workshop",
              },
              {
                title: "Introduction to the CLEAR Framework",
                desc: "A practical walkthrough of the five CLEAR phases with hands-on exercises. Participants leave with a diagnostic of their own organizational challenge and a first-draft action plan.",
                format: "Half-day or Full-day workshop",
              },
              {
                title: "Behavioral Design for Leaders",
                desc: "How to apply behavioral science principles to everyday leadership challenges — from nudging team behavior to designing meetings that produce real decisions.",
                format: "Keynote (45-60 min) or Half-day workshop",
              },
              {
                title: "Leading Through Complexity",
                desc: "Systems thinking for leaders who are tired of linear plans that don't survive contact with reality. How to find leverage points, run experiments, and navigate adaptive challenges.",
                format: "Half-day or Full-day workshop",
              },
              {
                title: "Building a Listening Organization",
                desc: "Based on the Simple Listening Framework. How structured listening practices at every level of an organization can surface hidden insights, build trust, and accelerate change.",
                format: "Keynote (45-60 min) or Half-day workshop",
              },
              {
                title: "Custom / Tailored Session",
                desc: "Every organization has a unique context. Erik designs bespoke workshops that address your specific challenges, using the CLEAR framework as the backbone but adapted to your industry, culture, and goals.",
                format: "Any format",
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-foreground/70 text-sm mb-3">{item.desc}</p>
                <p className="text-xs text-foreground/50">{item.format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-6">What Makes These Different</h2>
          <div className="space-y-4">
            {[
              "Designed by a licensed psychologist — grounded in behavioral science, not pop frameworks",
              "Interactive and applied — participants work on their own real challenges, not hypothetical cases",
              "Evidence-based content — every claim is backed by research, every tool is field-tested",
              "Tailored to your context — no off-the-shelf slide decks, every session is customized",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="heading-md mb-4">Inquire About Availability</h2>
            <p className="body-md text-foreground/70 mb-8 max-w-xl mx-auto">
              Whether you're planning a conference keynote, a leadership offsite, or a
              team development day — let's discuss what would make the biggest impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Check Availability
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <Link to="/services" className="btn-secondary">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkshopsService;
