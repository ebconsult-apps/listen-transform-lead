
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import LewinModel from "@/components/LewinModel";
import AboutPreview from "@/components/AboutPreview";
import ServicesPreview from "@/components/ServicesPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookPreview from "@/components/BookPreview";
import CTASection from "@/components/CTASection";
import SEO from "@/components/SEO";
import { useEffect } from "react";

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="CLEAR Change Framework | Erik Bohjort - Organizational Change Consulting"
        description="The CLEAR Change Framework helps organizations drive meaningful transformation through Clarity, Leverage, Experimentation, Analysis, and Refinement. Created by licensed psychologist Erik Bohjort."
        path="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "EB Consulting - CLEAR Change Framework",
          "description": "Organizational change consulting using the CLEAR Change Framework",
          "founder": { "@type": "Person", "name": "Erik Bohjort" },
          "url": "https://clear-framework.com",
          "areaServed": "Worldwide",
          "serviceType": ["Organizational Change Management", "Leadership Development", "Systems Thinking Consulting"]
        }}
      />
      <Hero />
      <TrustedBy />
      <AboutPreview />
      <LewinModel />
      <ServicesPreview />
      <TestimonialsSection />
      <BookPreview />
      <CTASection />
    </div>
  );
};

export default Index;
