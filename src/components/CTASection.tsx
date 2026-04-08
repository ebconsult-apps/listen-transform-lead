
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
        if (entry.isIntersecting && sectionRef.current) {
          // First make visible
          sectionRef.current.style.opacity = '1';
          
          // Then add animation class after a short delay
          setTimeout(() => {
            sectionRef.current?.classList.add('animate-fade-in');
          }, 50);
          
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
      <div ref={sectionRef} className="section-container" style={{ opacity: '0' }}>
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="heading-lg mb-6">Ready to Break the Cycle of Failed Change?</h2>
            <p className="body-md mb-10">
              Find out where your organization stands with a free 2-minute assessment,
              or book a conversation with Erik to discuss your specific challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/assessment" className="btn-primary">
                Take the Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Book a Discovery Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
