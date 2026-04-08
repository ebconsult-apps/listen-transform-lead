
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const ExecutiveCoachingService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Executive Coaching | Licensed Psychologist | Evidence-Based Approach"
        description="Executive coaching from a licensed psychologist — not a certified coach. Clinically grounded, evidence-based coaching for senior leaders navigating complex challenges."
        path="/services/executive-coaching"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Executive Coaching & Advisory",
          "description": "Psychology-based executive coaching from a licensed psychologist",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort", "jobTitle": "Licensed Psychologist" },
          },
          "serviceType": "Executive Coaching",
          "areaServed": ["Europe", "Scandinavia"],
          "url": "https://clear-framework.com/services/executive-coaching",
        }}
      />

      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Executive Coaching</div>
          <h1 className="heading-xl mb-6">
            Executive Coaching From a Licensed Psychologist
          </h1>
          <p className="body-lg max-w-3xl">
            Anyone can become a certified coach in a weekend. A licensed psychologist spends
            years training to understand how people think, resist change, make decisions under
            pressure, and build — or destroy — trust. Erik Bohjort brings that clinical
            foundation to executive coaching for senior leaders who need more than motivation.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-8">The Difference</h2>
          <div className="space-y-6">
            {[
              {
                title: "Most coaches work with what you tell them",
                desc: "They help you set goals, create accountability, and stay motivated. That's valuable — but it only works with the self-image you present. It doesn't reach the patterns you can't see yourself.",
              },
              {
                title: "A psychologist works with what's underneath",
                desc: "Confirmation bias, defensive routines, attachment patterns, stress responses — these shape how you lead every day, but they're invisible from the inside. Psychological training surfaces what self-reflection alone cannot.",
              },
              {
                title: "The stakes demand rigor",
                desc: "At the executive level, coaching conversations affect strategy, culture, and people's livelihoods. The person in the room with you should have the clinical training to handle what comes up — not just the certification.",
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
          <h2 className="heading-lg mb-4">How It Works</h2>
          <div className="space-y-5">
            {[
              { phase: "Assessment", desc: "We start with a psychometric profile and structured intake. This gives us a shared map of your behavioral patterns, decision-making tendencies, and the specific areas where growth will have the most impact." },
              { phase: "Structured Sessions", desc: "Regular one-on-one sessions (typically bi-weekly) with a clear developmental arc. Each session connects to real challenges you're navigating — not abstract exercises." },
              { phase: "Applied Learning", desc: "Between sessions, you practice specific behavioral shifts in live situations. We design experiments together, then debrief the results. This is where insight becomes capability." },
              { phase: "Honest Feedback", desc: "A psychologist's job is to tell you what you need to hear, not what you want to hear. If the CLEAR approach isn't the right fit, or if a different intervention would serve you better, you'll hear that directly." },
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

      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="heading-md mb-4">Start With a Confidential Conversation</h2>
            <p className="body-md text-foreground/70 mb-8 max-w-xl mx-auto">
              Executive coaching is personal. Book a free 30-minute call to discuss
              your situation confidentially and explore whether this is the right fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Book a Confidential Call
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <Link to="/assessment" className="btn-secondary">
                Start With an Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExecutiveCoachingService;
