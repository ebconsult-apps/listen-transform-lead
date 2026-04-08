
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const PsychometricAssessmentsService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Psychometric Assessments for Organizations | Licensed Psychologist"
        description="Clinical-grade psychometric assessments for leadership development, team diagnostics, and organizational change. Administered and interpreted by a licensed psychologist."
        path="/services/psychometric-assessments"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Psychometric Assessment Services",
          "description": "Clinical-grade psychometric assessments for organizations, administered by a licensed psychologist",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort", "jobTitle": "Licensed Psychologist" },
          },
          "serviceType": "Psychometric Assessments",
          "areaServed": ["Europe", "Scandinavia"],
          "url": "https://clear-framework.com/services/psychometric-assessments",
        }}
      />

      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Psychometric Assessments</div>
          <h1 className="heading-xl mb-6">
            Assessments That Actually Drive Change
          </h1>
          <p className="body-lg max-w-3xl">
            Most organizations collect psychometric data and never use it. Erik Bohjort
            administers, interprets, and translates assessment results into actionable
            development plans — with the clinical expertise to handle sensitive findings
            appropriately and the organizational experience to make the data matter.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-container max-w-4xl">
          <h2 className="heading-lg mb-8">Common Assessment Pitfalls</h2>
          <div className="space-y-6">
            {[
              {
                title: "Data without interpretation",
                desc: "Teams receive a 30-page report full of scores, graphs, and personality types. Without a psychologist to contextualize the results, the data sits unused. Numbers don't create insight — trained interpretation does.",
              },
              {
                title: "Entertainment, not development",
                desc: "Many assessments become team-building entertainment: 'I'm a blue, you're a red.' Fun for a day, forgotten by Monday. Real psychometric tools reveal patterns that matter — decision-making under pressure, conflict style, cognitive biases — and connect them to specific growth goals.",
              },
              {
                title: "No connection to organizational outcomes",
                desc: "Individual assessments happen in isolation from the organizational context. A leadership profile means nothing without understanding the system the leader operates in — the culture, the politics, the strategic demands.",
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
          <h2 className="heading-lg mb-4">Assessment Applications</h2>
          <div className="space-y-5">
            {[
              { phase: "Leadership Profiling", desc: "Comprehensive assessment of leadership behavioral patterns, decision-making tendencies, stress responses, and interpersonal dynamics. Forms the foundation for targeted development programs." },
              { phase: "Team Diagnostics", desc: "Map how a team functions as a system — communication patterns, role clarity, conflict dynamics, and collective blind spots. Reveals why some teams perform and others struggle despite individual talent." },
              { phase: "Change Readiness", desc: "Measure an organization's capacity for change across multiple dimensions. Identifies specific barriers and enablers before you invest in a transformation initiative. Start with the free online assessment to see the framework in action." },
              { phase: "Selection & Development", desc: "Evidence-based input for hiring, promotion, and succession decisions. Psychometric data provides objective insight that complements interview impressions and track records." },
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
            <h2 className="heading-md mb-4">See the Assessment Framework in Action</h2>
            <p className="body-md text-foreground/70 mb-8 max-w-xl mx-auto">
              Try the free Change Readiness Assessment to experience the CLEAR
              framework's diagnostic approach, or book a call to discuss your
              organization's assessment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment" className="btn-primary">
                Try the Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Book a Discovery Call
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PsychometricAssessmentsService;
