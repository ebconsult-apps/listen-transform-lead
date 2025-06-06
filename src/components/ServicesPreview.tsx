
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Lightbulb, ArrowRight, Target, Network, FlaskConical } from "lucide-react";

const services = [
  {
    id: 1,
    icon: <Target className="h-6 w-6" />,
    title: "Clarity of Objectives",
    description: "Establish clear, measurable objectives and key results for organizational change."
  },
  {
    id: 2,
    icon: <Network className="h-6 w-6" />,
    title: "Leverage through Systems Mapping",
    description: "Identify key leverage points in complex organizational systems for maximum impact."
  },
  {
    id: 3,
    icon: <FlaskConical className="h-6 w-6" />,
    title: "Experimentation & Prototyping",
    description: "Rapidly test interventions to validate effectiveness before scaling."
  },
  {
    id: 4,
    icon: <Briefcase className="h-6 w-6" />,
    title: "Business Consulting",
    description: "Apply the CLEAR framework to your specific organizational challenges."
  }
];

const ServicesPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-20px 0px'
    };

    const animateElements = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === sectionRef.current) {
            // Make sure the heading is visible first
            if (headingRef.current) {
              headingRef.current.classList.remove('opacity-0');
              headingRef.current.classList.add('animate-fade-in');
            }
            
            // Animate cards with staggered delay, ensuring they're visible first
            cardsRef.current.forEach((card, index) => {
              if (card) {
                card.classList.remove('opacity-0');
                setTimeout(() => {
                  card?.classList.add('animate-fade-in-up');
                }, 200 + (index * 100));
              }
            });
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
    <section ref={sectionRef} className="py-24" id="services-preview">
      <div className="section-container">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 opacity-0">
          <div className="tag mb-4">Services</div>
          <h2 className="heading-lg mb-6">The CLEAR Change Framework</h2>
          <p className="body-md">
            A systematic approach to organizational change that drives measurable results through 
            clarity, systems thinking, experimentation, analysis, and refinement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((service, i) => (
            <div
              key={service.id}
              ref={el => cardsRef.current[i] = el}
              className="glass-card p-8 opacity-0 h-full flex flex-col"
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
                <div className="text-primary">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-foreground/70 mb-6 flex-grow">{service.description}</p>
              
              <Link 
                to="/services" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium mt-auto transition-colors"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/services" className="btn-primary">
            Explore Our Approach
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
