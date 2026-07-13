
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import ServicesPreview from "@/components/ServicesPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookPreview from "@/components/BookPreview";
import CTASection from "@/components/CTASection";
import SEO from "@/components/SEO";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Change Management Built on Clinical Psychology | CLEAR Framework - Erik Bohjort"
        description="Licensed psychologist Erik Bohjort helps organizations beat the 70% failure rate of change initiatives. The CLEAR framework applies behavioral science and systems thinking for lasting transformation."
        path="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "EB Consulting - CLEAR Change Framework",
          "description": "Change management consulting built on clinical psychology. Licensed psychologist Erik Bohjort helps organizations drive lasting transformation through behavioral science and systems thinking.",
          "founder": {
            "@type": "Person",
            "name": "Erik Bohjort",
            "jobTitle": "Licensed Psychologist & Organizational Change Consultant",
            "url": "https://clear-framework.com/about",
            "sameAs": ["https://twitter.com/erikbohjort"]
          },
          "url": "https://clear-framework.com",
          "logo": "https://clear-framework.com/logo-square.png",
          "image": "https://clear-framework.com/og-image.jpg",
          "areaServed": ["Europe", "Scandinavia"],
          "serviceType": [
            "Change Management Consulting",
            "Leadership Development",
            "Psychometric Assessments",
            "Executive Coaching",
            "Behavioral Design",
            "Organizational Psychology"
          ]
        }}
      />
      <Hero />
      <TrustedBy />
      <ServicesPreview />

      {/* Assessment CTA */}
      <section className="section-container py-16">
        <div className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Free Assessment</span>
          </div>
          <h2 className="heading-md mb-4">How Ready Is Your Organization for Change?</h2>
          <p className="body-md text-foreground/70 mb-8 max-w-xl mx-auto">
            Take our 2-minute Change Readiness Assessment based on the CLEAR framework.
            Get instant insights into your organization's strengths and gaps.
          </p>
          <Link to="/assessment" className="btn-primary inline-flex items-center gap-2">
            Start the Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-foreground/50 mt-4">8 questions &middot; 2 minutes &middot; Instant results</p>
        </div>
      </section>

      {/* CLEAR self-serve product banner */}
      <section className="section-container py-16">
        <div className="glass-card overflow-hidden bg-primary/5">
          <div className="grid md:grid-cols-5 gap-8 items-center p-8 md:p-12">
            <div className="md:col-span-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">New: CLEAR self-serve</span>
              </div>
              <h2 className="heading-md mb-4">Generate a behavioral-science change report, try it free</h2>
              <p className="body-md text-foreground/70 mb-8 max-w-xl">
                Not ready for a full engagement? Bring a behavior-change challenge to the CLEAR
                app and get a measurable objective, a systems map, and the highest-leverage
                barriers, grounded in COM-B, in minutes. The teaser is always free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/product" className="btn-primary inline-flex items-center gap-2">
                  Try CLEAR free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/product/sample" className="btn-secondary inline-flex items-center gap-2">
                  See a sample report
                </Link>
              </div>
            </div>
            <div className="md:col-span-2">
              <ul className="space-y-3">
                {[
                  "Measurable OKRs from your challenge",
                  "A systems map of what drives the behavior",
                  "COM-B barriers ranked by leverage",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <BookPreview />
      <CTASection />
    </div>
  );
};

export default Index;
