
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import ServicesPreview from "@/components/ServicesPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookPreview from "@/components/BookPreview";
import CTASection from "@/components/CTASection";
import SEO from "@/components/SEO";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowRight } from "lucide-react";

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Behaviour Change Consultant, Stockholm, Sweden | CLEAR Framework - Erik Bohjort"
        description="Licensed psychologist Erik Bohjort, based in Stockholm, Sweden, helps organizations beat the 70% failure rate of change initiatives. The CLEAR framework applies behavioral science, nudging and systems thinking to change what people actually do."
        path="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": "https://clear-framework.com/#organization",
          "name": "EB Consulting - CLEAR Change Framework",
          "alternateName": "CLEAR Change Framework",
          "description": "Behaviour change and change management consulting built on clinical and organizational psychology. Licensed psychologist Erik Bohjort, based in Stockholm, Sweden, helps organizations drive lasting transformation through behavioral science, nudging and systems thinking.",
          "founder": {
            "@type": "Person",
            "@id": "https://clear-framework.com/about#person",
            "name": "Erik Bohjort",
            "jobTitle": "Licensed Psychologist & Behaviour Change Consultant",
            "url": "https://clear-framework.com/about",
            "sameAs": ["https://twitter.com/erikbohjort"]
          },
          "url": "https://clear-framework.com",
          "email": "erik@eb-consulting.se",
          "logo": "https://clear-framework.com/logo-square.png",
          "image": "https://clear-framework.com/og-image.jpg",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Stockholm",
            "addressCountry": "SE"
          },
          "areaServed": [
            { "@type": "Country", "name": "Sweden" },
            { "@type": "Place", "name": "Nordic countries" },
            { "@type": "Place", "name": "Europe" }
          ],
          "availableLanguage": ["sv", "en"],
          "knowsAbout": [
            "Behaviour change",
            "Behavioral science",
            "Behavioral design and nudging",
            "COM-B model",
            "Organizational psychology",
            "Change management",
            "Systems thinking",
            "Psychometric assessment"
          ],
          "serviceType": [
            "Behaviour Change Consulting",
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

      <TestimonialsSection />
      <BookPreview />
      <CTASection />
    </div>
  );
};

export default Index;
