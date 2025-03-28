
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Lightbulb, Heart, ArrowRight, CheckCircle } from "lucide-react";

const services = [
  {
    id: 1,
    icon: <Briefcase className="h-6 w-6" />,
    title: "Business Consulting & Leadership Development",
    description: "Help leaders navigate change through strategic communication and deep listening.",
    benefits: [
      "Develop empathetic leadership skills",
      "Improve team communication and collaboration",
      "Navigate organizational change more effectively",
      "Create more inclusive decision-making processes"
    ]
  },
  {
    id: 2,
    icon: <Users className="h-6 w-6" />,
    title: "Negotiation & Conflict Resolution",
    description: "Transform complex conflicts into opportunities for growth and understanding.",
    benefits: [
      "Turn deadlocked negotiations into productive conversations",
      "Resolve long-standing conflicts through structured dialogue",
      "Build stronger relationships through conflict",
      "Create sustainable agreements based on mutual understanding"
    ]
  },
  {
    id: 3,
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Product Innovation & Design Thinking",
    description: "Leverage empathetic listening for breakthrough innovation and product development.",
    benefits: [
      "Gain deeper insights into user needs",
      "Create more human-centered products and services",
      "Improve cross-functional collaboration",
      "Accelerate innovation through better understanding"
    ]
  },
  {
    id: 4,
    icon: <Heart className="h-6 w-6" />,
    title: "Personal Coaching & Relationship Enhancement",
    description: "Transform personal challenges into opportunities for meaningful growth.",
    benefits: [
      "Improve communication in personal relationships",
      "Develop greater self-awareness and emotional intelligence",
      "Navigate life transitions with confidence",
      "Build more authentic connections with others"
    ]
  }
];

const Services = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Animation fixes - make elements visible first, then animate
    if (heroRef.current) {
      heroRef.current.classList.remove('opacity-0');
      setTimeout(() => {
        heroRef.current?.classList.add('animate-fade-in');
      }, 100);
    }
    
    if (introRef.current) {
      introRef.current.classList.remove('opacity-0');
      setTimeout(() => {
        introRef.current?.classList.add('animate-fade-in-up');
      }, 300);
    }
    
    // Animate service cards with staggered delay
    serviceRefs.current.forEach((card, index) => {
      if (card) {
        card.classList.remove('opacity-0');
        setTimeout(() => {
          card?.classList.add('animate-fade-in-up');
        }, 500 + (index * 100));
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0">
            <div className="tag mb-4">Services</div>
            <h1 className="heading-xl mb-6">How SLF Can Serve You</h1>
            <p className="body-lg max-w-3xl">
              Tailored applications of the Simple Listening Framework to address your specific challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pb-20">
        <div className="section-container">
          <div ref={introRef} className="glass-card p-8 md:p-10 max-w-3xl mx-auto opacity-0">
            <h2 className="heading-md mb-6">Transformative Applications</h2>
            <p className="body-md mb-4">
              Whether you are leading a multinational corporation, managing complex change, 
              or seeking personal transformation, our consultancy adapts the Simple Listening Framework 
              to your unique challenges.
            </p>
            <p className="body-md">
              Each service area applies the same core principles – deep listening, 
              empathetic engagement, and collaborative solution-finding – to different contexts. 
              The result is a tailored approach that addresses your specific needs while 
              leveraging the proven power of the SLF methodology.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div
                key={service.id}
                ref={el => serviceRefs.current[i] = el}
                className="glass-card p-8 md:p-10 opacity-0"
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
                  <div className="text-primary">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-foreground/70 mb-8">{service.description}</p>
                
                <div className="bg-muted/30 rounded-xl p-6 mb-8">
                  <h4 className="font-medium mb-4">Key Benefits:</h4>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10">
            <h2 className="heading-md mb-6">Our Approach</h2>
            <p className="body-md mb-6">
              Each engagement begins with a thorough diagnostic process to understand your 
              specific context and challenges. This collaborative assessment forms the foundation 
              for a tailored application of the Simple Listening Framework.
            </p>
            <p className="body-md mb-8">
              Whether working with individuals, teams, or entire organizations, we emphasize 
              practical skills development alongside deeper mindset shifts. This dual focus 
              ensures both immediate improvements and sustainable, long-term change.
            </p>
            
            <div className="mt-6 text-center">
              <Link to="/contact" className="btn-primary">
                Discuss Your Needs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
