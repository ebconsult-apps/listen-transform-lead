
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    quote: "With Erik's guidance, we transformed our HR-data strategy, resulting in a breakthrough deal that exceeded our expectations.",
    author: "CEO",
    company: "International Healthcare Provider"
  },
  {
    id: 2,
    quote: "Through his thorough and empathetic approach, Erik helped our team find a new path forward with our product strategy.",
    author: "CEO",
    company: "Deep Tech Startup"
  },
  {
    id: 3,
    quote: "What sets Erik apart is his ability to combine psychological insight with practical business acumen. Through our project together we created long term solutions for complex sustainability issues, and proved its efficiency.",
    author: "CCO",
    company: "Housing Organisation"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Improved animation approach to prevent disappearing
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    };

    const fadeInSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && sectionRef.current) {
          // Make visible first, then add animation class
          sectionRef.current.style.opacity = '1';
          
          // Add animation class after a short delay
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

  // Ensure testimonial remains visible during transition
  useEffect(() => {
    if (testimonialRef.current) {
      // First make testimonial temporarily less visible but not invisible
      testimonialRef.current.style.opacity = '0.7';
      
      // Then restore full visibility with animation
      setTimeout(() => {
        if (testimonialRef.current) {
          testimonialRef.current.style.opacity = '1';
          testimonialRef.current.classList.add('animate-fade-in');
        }
      }, 50);
      
      // Remove animation class after it completes to allow for next animation
      setTimeout(() => {
        testimonialRef.current?.classList.remove('animate-fade-in');
      }, 500);
    }
  }, [activeIndex]);

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-muted/10">
      <div ref={sectionRef} className="section-container relative" style={{ opacity: '0' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="tag mb-4">Testimonials</div>
          <h2 className="heading-lg mb-6">What Others Say</h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Decorative Quote Icon */}
          <div className="absolute -top-10 left-0 text-primary/10">
            <Quote size={80} />
          </div>
          
          {/* Testimonial Card */}
          <div ref={testimonialRef} className="glass-card p-10 md:p-14 relative z-10">
            <blockquote className="text-xl md:text-2xl font-display font-light italic text-foreground/90 leading-relaxed mb-8">
              "{testimonials[activeIndex].quote}"
            </blockquote>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{testimonials[activeIndex].author}</p>
                <p className="text-sm text-foreground/60">{testimonials[activeIndex].company}</p>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground/70" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-foreground/70" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Testimonial Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-primary w-8" : "bg-primary/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
