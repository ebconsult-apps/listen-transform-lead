
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, CheckCircle, Users, Globe, Lightbulb } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const SpeakingService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Keynote Speaker: Organizational Change & Behavioral Psychology | Erik Bohjort"
        description="Book licensed psychologist Erik Bohjort for keynotes and conference talks on organizational change, behavioral design, and the psychology of leadership. Evidence-based, not motivational."
        path="/services/speaking"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Erik Bohjort",
          "jobTitle": "Licensed Psychologist & Keynote Speaker",
          "description": "Keynote speaker on organizational change, behavioral design, and the psychology of leadership",
          "url": "https://clear-framework.com/services/speaking",
          "knowsAbout": [
            "Organizational Change",
            "Behavioral Psychology",
            "Leadership Development",
            "Behavioral Design",
            "Systems Thinking",
          ],
          "memberOf": {
            "@type": "Organization",
            "name": "EB Consulting",
          },
        }}
      />

      {/* Hero */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Keynote Speaking</div>
          <h1 className="heading-xl mb-6">
            A Psychologist on Stage, Not a Motivational Speaker
          </h1>
          <p className="body-lg max-w-3xl">
            Erik Bohjort delivers keynotes and conference talks on organizational change,
            behavioral design, and the psychology of leadership. His talks are grounded in
            clinical psychology and real consulting experience — evidence-based, practical,
            and designed to change how your audience thinks about their own organizations.
          </p>
        </div>
      </section>

      {/* Speaker Profile */}
      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <div className="glass-card p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <img
                  src="/erik-portrait.jpg"
                  alt="Erik Bohjort"
                  className="rounded-lg w-full object-cover aspect-[3/4]"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="heading-md mb-4">Erik Bohjort</h2>
                <p className="text-primary font-medium mb-4">
                  Licensed Psychologist &middot; Organizational Change Consultant &middot; Creator of the CLEAR Framework
                </p>
                <p className="text-foreground/70 mb-4">
                  Erik is a licensed psychologist who has spent his career at the intersection
                  of behavioral science and organizational change. He works with corporations,
                  state agencies, and international institutions to drive transformation that
                  accounts for how people actually behave — not how we wish they would.
                </p>
                <p className="text-foreground/70 mb-4">
                  He is the creator of the CLEAR Change Framework, a structured methodology for
                  organizational change built on behavioral psychology and systems thinking. His
                  upcoming book on the framework is in progress.
                </p>
                <p className="text-foreground/70">
                  Erik is based in Stockholm and speaks at events across Europe in English and
                  Swedish. He is available for in-person and virtual engagements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Talks */}
      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-8">Signature Talks</h2>
          <div className="space-y-6">
            {[
              {
                title: "Why 70% of Change Initiatives Fail — And What to Do About It",
                audience: "C-suite, HR leaders, change practitioners",
                duration: "45-60 minutes",
                desc: "The most-cited statistic in change management — unpacked by a psychologist. This talk goes beyond the usual platitudes to explain the behavioral science behind why organizations resist change, why communication campaigns don't work, and what the 30% who succeed do differently. Audiences leave with a new mental model for approaching transformation.",
                icon: <Lightbulb className="h-6 w-6 text-primary" />,
              },
              {
                title: "The Psychology of Leadership: What Science Actually Knows",
                audience: "Leadership teams, executive audiences, HR conferences",
                duration: "45-60 minutes",
                desc: "Strip away the leadership industry's mythology and look at what peer-reviewed research actually tells us about effective leadership. Covers decision-making under uncertainty, the neuroscience of trust, why self-awareness is harder than it sounds, and how psychometric assessment can reveal what reflection alone cannot.",
                icon: <Users className="h-6 w-6 text-primary" />,
              },
              {
                title: "Behavioral Design for Organizations: Nudging at Scale",
                audience: "OD professionals, innovation teams, HR tech conferences",
                duration: "45-60 minutes",
                desc: "How to apply behavioral design principles — the same science behind consumer product design — to organizational systems. From meeting design to performance management to culture change, this talk shows how small design interventions create outsized behavioral shifts.",
                icon: <Globe className="h-6 w-6 text-primary" />,
              },
            ].map((talk, i) => (
              <div key={i} className="glass-card p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    {talk.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{talk.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="text-xs bg-foreground/5 px-2 py-1 rounded text-foreground/60">
                        {talk.audience}
                      </span>
                      <span className="text-xs bg-foreground/5 px-2 py-1 rounded text-foreground/60">
                        {talk.duration}
                      </span>
                    </div>
                    <p className="text-foreground/70">{talk.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="glass-card p-8 bg-primary/5">
              <h3 className="text-xl font-bold mb-2">Custom / Tailored Talk</h3>
              <p className="text-foreground/70">
                Every audience is different. Erik develops custom talks for specific
                industries, organizations, or event themes. If you have a topic in mind
                that sits at the intersection of psychology and organizational life,
                let's discuss it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-6">What to Expect</h2>
          <div className="space-y-4">
            {[
              "Evidence-based — every claim backed by research, every insight field-tested in real organizations",
              "Interactive when appropriate — not a lecture, but a thinking session that engages the room",
              "Actionable — audiences leave with frameworks and mental models they can apply immediately",
              "No fluff — no motivational platitudes, no 'just believe in yourself,' no empty energy",
              "Tailored — Erik researches your audience and adapts content, examples, and depth to fit",
              "Professional logistics — clear communication on tech requirements, timing, and preparation",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-6">Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <h3 className="font-bold mb-2">Conference Keynote</h3>
              <p className="text-foreground/70 text-sm">
                45-60 minute talk for large audiences. Includes pre-event audience
                research and post-talk resource sharing.
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <h3 className="font-bold mb-2">Executive Session</h3>
              <p className="text-foreground/70 text-sm">
                60-90 minute facilitated session for leadership teams or board-level
                audiences. More interactive, more depth, more Q&A.
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <h3 className="font-bold mb-2">Virtual Keynote</h3>
              <p className="text-foreground/70 text-sm">
                Adapted for remote audiences. Professional home studio setup, designed
                for engagement in a virtual format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="heading-md mb-4">Check Availability</h2>
            <p className="body-md text-foreground/70 mb-8 max-w-xl mx-auto">
              Tell me about your event — audience, theme, date — and I'll let you know
              if it's a fit. No obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Inquire About Availability
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

export default SpeakingService;
