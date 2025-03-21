
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck, HelpCircle, CheckCircle, Compass, Users, Heart, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Prepare Presence and Openness",
    description: "Set aside distractions and preconceptions to create space for genuine connection.",
    details: [
      "Clear your mind of preconceptions and judgments",
      "Create a distraction-free environment",
      "Adopt a mindset of genuine curiosity and openness",
      "Set clear intentions for the conversation"
    ],
    icon: <MessageCircle className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Create Trust and Safety",
    description: "Establish a warm, respectful tone that makes every conversation psychologically safe.",
    details: [
      "Use welcoming body language and tone of voice",
      "Demonstrate respect for all perspectives",
      "Establish clear boundaries and expectations",
      "Acknowledge emotions without judgment"
    ],
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Explore with Curious Questions",
    description: "Ask open, thought-provoking questions to uncover underlying motivations and needs.",
    details: [
      "Focus on open-ended rather than yes/no questions",
      "Ask 'what' and 'how' questions to deepen understanding",
      "Explore interests rather than positions",
      "Follow curiosities and unexpected paths when relevant"
    ],
    icon: <HelpCircle className="h-6 w-6" />
  },
  {
    id: 4,
    title: "Confirm and Summarize Insights",
    description: "Reflect back what you've heard to ensure understanding and build mutual trust.",
    details: [
      "Paraphrase key points in your own words",
      "Verify your understanding of emotions and needs",
      "Summarize patterns and themes you're observing",
      "Ask if your summary is accurate and complete"
    ],
    icon: <CheckCircle className="h-6 w-6" />
  },
  {
    id: 5,
    title: "Deepen and Broaden Perspectives",
    description: "Engage empathetically to explore emotions and consider broader contexts.",
    details: [
      "Explore emotional dimensions of the situation",
      "Consider the broader context and systemic factors",
      "Identify unstated assumptions and mental models",
      "Look for connections between seemingly separate issues"
    ],
    icon: <Compass className="h-6 w-6" />
  },
  {
    id: 6,
    title: "Collaborate on Solutions",
    description: "Work together to transform insights into actionable, practical solutions.",
    details: [
      "Co-create options based on shared understanding",
      "Build on ideas collaboratively rather than critiquing",
      "Focus on practical, actionable next steps",
      "Prioritize solutions that address core needs"
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 7,
    title: "Conclude with Gratitude and Follow-Up",
    description: "Close with appreciation and a clear plan for continued progress and implementation.",
    details: [
      "Express genuine appreciation for the conversation",
      "Summarize key insights and agreed actions",
      "Establish clear next steps and responsibilities",
      "Set expectations for follow-up and continued dialogue"
    ],
    icon: <Heart className="h-6 w-6" />
  }
];

const Framework = () => {
  const [activeStep, setActiveStep] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Handle step selection
  const handleStepClick = (id: number) => {
    setActiveStep(id);
    // Smooth scroll to steps section on mobile
    if (window.innerWidth < 768) {
      stepsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fix animation issues by making elements visible immediately on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Make elements visible immediately but still animate them
    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.style.opacity = '1';
        heroRef.current.classList.add('animate-fade-in');
      }
    }, 100);
    
    setTimeout(() => {
      if (introRef.current) {
        introRef.current.style.opacity = '1';
        introRef.current.classList.add('animate-fade-in-up');
      }
    }, 300);
    
    setTimeout(() => {
      if (stepsRef.current) {
        stepsRef.current.style.opacity = '1';
        stepsRef.current.classList.add('animate-fade-in');
      }
    }, 500);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} style={{ opacity: '0' }}>
            <div className="tag mb-4">The Framework</div>
            <h1 className="heading-xl mb-6">Simple Listening Framework</h1>
            <p className="body-lg max-w-3xl">
              A structured approach to transform listening into meaningful action.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pb-20">
        <div className="section-container">
          <div ref={introRef} className="glass-card p-8 md:p-10 max-w-3xl mx-auto" style={{ opacity: '0' }}>
            <h2 className="heading-md mb-6">The Power of Genuine Listening</h2>
            <p className="body-md mb-4">
              The Simple Listening Framework (SLF) is rooted in one timeless principle: 
              change begins when we listen deeply and with empathy. By understanding the 
              real issues behind every conversation, we pave the way for transformational change.
            </p>
            <p className="body-md">
              Developed through years of practical application across diverse organizational 
              settings, SLF provides a structured yet flexible approach to turning insights 
              into action. The seven steps outlined below form a comprehensive methodology 
              that can be applied to virtually any challenge – from high-stakes negotiations 
              to personal growth.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="pb-24" id="framework-steps">
        <div ref={stepsRef} className="section-container" style={{ opacity: '0' }}>
          <h2 className="heading-md text-center mb-12">The Seven Steps</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            {/* Right side - Detailed Step Info */}
            <div className="lg:col-span-2 glass-card p-8 md:p-10">
              <div className="mb-8">
                <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                  Step {activeStep} of 7
                </span>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {steps[activeStep - 1].title}
                </h3>
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                  {steps[activeStep - 1].description}
                </p>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h4 className="font-medium mb-4">Key Elements:</h4>
                  <ul className="space-y-3">
                    {steps[activeStep - 1].details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-foreground/80">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                    style={{ width: `${(activeStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(prev => prev === 1 ? steps.length : prev - 1)}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Previous Step
                </button>
                <button
                  onClick={() => setActiveStep(prev => prev === steps.length ? 1 : prev + 1)}
                  className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="section-container">
          <div className="glass-card p-8 md:p-10 text-center">
            <h2 className="heading-md mb-6">Apply the Framework to Your Challenges</h2>
            <p className="body-md mb-8 max-w-2xl mx-auto">
              Ready to experience the transformative power of the Simple Listening Framework? 
              Let's explore how these principles can be applied to your specific context.
            </p>
            <Link to="/contact" className="btn-primary">
              Book a Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Framework;
