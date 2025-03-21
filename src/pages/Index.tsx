
import Hero from "@/components/Hero";
import FrameworkPreview from "@/components/FrameworkPreview";
import AboutPreview from "@/components/AboutPreview";
import ServicesPreview from "@/components/ServicesPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import { useEffect } from "react";

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <AboutPreview />
      <FrameworkPreview />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Index;
