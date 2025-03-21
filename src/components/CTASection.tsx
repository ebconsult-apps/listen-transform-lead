
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    };

    const fadeInSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(fadeInSection, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24">
      <div ref={sectionRef} className="section-container opacity-0">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="heading-lg mb-6">Ready to Transform Your Approach?</h2>
            <p className="body-md mb-10">
              Start your journey with the Lyssna-Förändra-Framework today. 
              Whether you're facing organizational challenges or seeking personal growth, 
              I'm here to guide you through the transformative power of genuine listening.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="btn-primary">
                Book a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/framework" className="btn-secondary">
                Learn More About LFF
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
