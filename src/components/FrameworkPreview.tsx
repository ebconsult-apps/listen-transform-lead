
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck, HelpCircle, CheckCircle, Compass, Users, Heart } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Prepare Presence and Openness",
    description: "Set aside distractions and preconceptions to create space for genuine connection.",
    icon: <MessageCircle className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Create Trust and Safety",
    description: "Establish a warm, respectful tone that makes every conversation psychologically safe.",
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Explore with Curious Questions",
    description: "Ask open, thought-provoking questions to uncover underlying motivations and needs.",
    icon: <HelpCircle className="h-6 w-6" />
  },
  {
    id: 4,
    title: "Confirm and Summarize Insights",
    description: "Reflect back what you've heard to ensure understanding and build mutual trust.",
    icon: <CheckCircle className="h-6 w-6" />
  },
  {
    id: 5,
    title: "Deepen and Broaden Perspectives",
    description: "Engage empathetically to explore emotions and consider broader contexts.",
    icon: <Compass className="h-6 w-6" />
  },
  {
    id: 6,
    title: "Collaborate on Solutions",
    description: "Work together to transform insights into actionable, practical solutions.",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 7,
    title: "Conclude with Gratitude and Follow-Up",
    description: "Close with appreciation and a clear plan for continued progress and implementation.",
    icon: <Heart className="h-6 w-6" />
  }
];

const FrameworkPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  // Handle step selection and animation
  const handleStepClick = (id: number) => {
    setActiveStep(id);
  };

  // Modified animation approach to prevent disappearing
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    };

    const fadeInSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && sectionRef.current) {
          // First make visible
          sectionRef.current.style.opacity = '1';
          
          // Then add animation class with slight delay
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

  // Auto-advance steps every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => prev === steps.length ? 1 : prev + 1);
    }, 3500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-muted/50" id="framework-preview">
      <div ref={sectionRef} className="section-container" style={{ opacity: '0' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="tag mb-4">The Framework</div>
          <h2 className="heading-lg mb-6">The Simple Listening Framework</h2>
          <p className="body-md">
            Built on the principle that true change begins with genuine listening, 
            SLF provides a structured approach to transform insights into meaningful action.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Step List */}
          <div className="lg:col-span-1 space-y-3">
            {steps.map(step => (
              <button
                key={step.id}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-start gap-4 ${
                  activeStep === step.id 
                    ? "glass-card shadow-md" 
                    : "hover:bg-white/50"
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${
                  activeStep === step.id 
                    ? "bg-primary text-white" 
                    : "bg-secondary text-primary"
                }`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className={`font-medium ${
                    activeStep === step.id ? "text-primary" : "text-foreground"
                  }`}>
                    {step.title}
                  </h3>
                  {activeStep === step.id && (
                    <p className="mt-1 text-sm text-foreground/70 animate-fade-in">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right side - Visual Representation */}
          <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-between min-h-[26rem]">
            <div>
              <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                Step {activeStep} of 7
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {steps[activeStep - 1].title}
              </h3>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                {steps[activeStep - 1].description}
              </p>

              <div className="my-8">
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                    style={{ width: `${(activeStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text-right mt-4">
              <Link 
                to="/framework" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Learn the complete framework
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameworkPreview;
