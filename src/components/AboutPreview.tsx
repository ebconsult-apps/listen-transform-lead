
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AboutPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px 0px'
    };

    const animateElements = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === sectionRef.current) {
            setTimeout(() => {
              imageRef.current?.classList.add('animate-fade-in-right');
            }, 100);
            setTimeout(() => {
              contentRef.current?.classList.add('animate-fade-in');
            }, 300);
          }
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(animateElements, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24" id="about-preview">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Placeholder (Left side) */}
          <div ref={imageRef} className="opacity-0 order-2 lg:order-1">
            <div className="relative">
              {/* Main image placeholder */}
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-secondary to-accent overflow-hidden relative">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="absolute inset-0 flex items-center justify-center text-primary/30 text-lg">
                  Portrait Image
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              
              {/* Floating card */}
              <div className="absolute -bottom-8 -right-8 glass-card p-4 rounded-xl shadow-lg max-w-[200px]">
                <p className="text-sm text-foreground/80 italic">
                  "Erik's approach transformed how our organization handles communication challenges."
                </p>
                <p className="mt-2 text-xs text-primary font-medium">— Client Testimonial</p>
              </div>
            </div>
          </div>
          
          {/* Content (Right side) */}
          <div ref={contentRef} className="opacity-0 order-1 lg:order-2">
            <div className="tag mb-4">About</div>
            <h2 className="heading-lg mb-6">Erik Bohjort</h2>
            <p className="body-md mb-6">
              As a licensed psychologist with extensive experience working with EU Parliament 
              policies, global corporations, state agencies, banks, and innovative startups, 
              I bring a unique perspective to solving complex challenges.
            </p>
            <p className="body-md mb-8">
              My passion lies in guiding clients through transformative processes using a 
              human-centered approach that turns listening into a powerful catalyst for change.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-10">
              <div className="glass p-4 rounded-xl">
                <h3 className="font-medium text-foreground mb-2">Global Experience</h3>
                <p className="text-sm text-foreground/70">Working with organizations across continents and industries</p>
              </div>
              <div className="glass p-4 rounded-xl">
                <h3 className="font-medium text-foreground mb-2">Licensed Psychologist</h3>
                <p className="text-sm text-foreground/70">Bringing scientific insight to human-centered solutions</p>
              </div>
            </div>
            
            <Link 
              to="/about" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Learn more about my journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
