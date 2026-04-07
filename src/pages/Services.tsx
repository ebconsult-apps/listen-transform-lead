
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Lightbulb, ArrowRight, CheckCircle, Target, Network, FlaskConical, LineChart, RefreshCw, Search, Layers, UserCircle, Mic } from "lucide-react";
import SEO from "@/components/SEO";

const clearSteps = [
  {
    id: 1,
    icon: <Target className="h-6 w-6" />,
    title: "Clarity of Objectives (C)",
    description: "Establish a clear, shared understanding of success and its importance.",
    details: [
      "Conduct stakeholder workshops to define the core purpose clearly",
      "Set measurable objectives to concretely define success",
      "Define key results to objectively measure progress"
    ]
  },
  {
    id: 2,
    icon: <Network className="h-6 w-6" />,
    title: "Leverage through Systems Mapping (L)",
    description: "Identify and prioritize impactful leverage points within the organizational system.",
    details: [
      "Facilitate cross-functional mapping sessions to visualize system dynamics",
      "Identify key system elements and relationships affecting objectives",
      "Prioritize actionable leverage points for maximum systemic impact"
    ]
  },
  {
    id: 3,
    icon: <FlaskConical className="h-6 w-6" />,
    title: "Experimentation through Prototyping (E)",
    description: "Quickly test practical solutions to confirm effectiveness and system understanding.",
    details: [
      "Brainstorm targeted interventions addressing prioritized leverage points",
      "Conduct rapid prototyping or pilot projects within controlled conditions",
      "Gather immediate performance data and feedback to validate effectiveness"
    ]
  },
  {
    id: 4,
    icon: <LineChart className="h-6 w-6" />,
    title: "Analysis and Reflection (A)",
    description: "Evaluate interventions rigorously to deepen system understanding and effectiveness.",
    details: [
      "Schedule structured review meetings shortly after testing interventions",
      "Critically assess outcomes against predefined key results",
      "Document and integrate insights into the systems map"
    ]
  },
  {
    id: 5,
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Refinement and Scaling (R)",
    description: "Continuously improve interventions based on feedback and scale proven solutions.",
    details: [
      "Update objectives and key results based on new insights",
      "Refine interventions informed by reflective analysis outcomes",
      "Set clear criteria for scaling successful interventions across the organization"
    ]
  }
];

const services = [
  {
    id: 1,
    icon: <Briefcase className="h-6 w-6" />,
    title: "Business Consulting & Leadership Development",
    description: "Help leaders navigate change through strategic communication and systems thinking.",
    benefits: [
      "Develop systemic leadership capabilities",
      "Implement effective change management strategies",
      "Create more data-driven decision-making processes",
      "Improve organizational adaptability"
    ]
  },
  {
    id: 2,
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Product Innovation & Design Thinking",
    description: "Leverage systems thinking for breakthrough innovation and product development.",
    benefits: [
      "Gain deeper insights into market systems",
      "Create more human-centered products and services",
      "Improve cross-functional collaboration",
      "Accelerate innovation through better understanding of leverage points"
    ]
  }
];

const Services = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
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
    
    // Animate model steps with staggered delay
    modelRefs.current.forEach((step, index) => {
      if (step) {
        step.classList.remove('opacity-0');
        setTimeout(() => {
          step?.classList.add('animate-fade-in-up');
        }, 400 + (index * 100));
      }
    });
    
    // Animate service cards with staggered delay
    serviceRefs.current.forEach((card, index) => {
      if (card) {
        card.classList.remove('opacity-0');
        setTimeout(() => {
          card?.classList.add('animate-fade-in-up');
        }, 700 + (index * 150));
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="CLEAR Change Framework Services | Organizational Transformation"
        description="Transform your organization with the CLEAR Change Framework. Five-step methodology combining systems thinking, behavioral science, and iterative experimentation for lasting change."
        path="/services"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "CLEAR Change Framework Services",
          "description": "Organizational transformation consulting using the CLEAR Change Framework",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort" }
          },
          "serviceType": ["Organizational Change Management", "Leadership Development", "Systems Thinking Consulting"],
          "url": "https://clear-framework.com/services"
        }}
      />
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0">
            <div className="tag mb-4">Services</div>
            <h1 className="heading-xl mb-6">The CLEAR Change Framework</h1>
            <p className="body-lg max-w-3xl">
              A systematic approach to organizational change that drives measurable results through clarity, systems thinking, and continuous improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pb-20">
        <div className="section-container">
          <div ref={introRef} className="glass-card p-8 md:p-10 max-w-3xl mx-auto opacity-0">
            <h2 className="heading-md mb-6">Transformative Approach</h2>
            <p className="body-md mb-4">
              The CLEAR Framework integrates Clarity (Objectives and Key Results), Leverage (Systems thinking and mapping), 
              Experimentation (Prototyping interventions), Analysis (Reflective evaluation), and Refinement (Iterative scaling).
            </p>
            <p className="body-md">
              It helps organizations systematically tackle complex challenges through purposeful clarity, 
              informed systemic interventions, rapid experimentation, rigorous analysis, and continuous improvement.
            </p>
          </div>
        </div>
      </section>

      {/* CLEAR Framework Steps */}
      <section className="pb-20">
        <div className="section-container">
          <h2 className="heading-md text-center mb-12">The CLEAR Process</h2>
          
          <div className="space-y-8">
            {clearSteps.map((step, i) => (
              <div 
                key={step.id}
                ref={el => modelRefs.current[i] = el}
                className="glass-card p-8 opacity-0 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
                <div className="absolute top-0 left-0 h-20 w-1 bg-primary"></div>
                
                <div className="ml-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mr-4">
                      <div className="text-primary">
                        {step.icon}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-foreground/70 mb-6">{step.description}</p>
                      
                      <div className="bg-muted/30 rounded-xl p-6">
                        <ul className="space-y-3">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <span className="text-foreground/80">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="pb-24">
        <div className="section-container">
          <h2 className="heading-md text-center mb-12">How We Apply CLEAR</h2>
          
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

      {/* How We Work Together */}
      <section className="pb-24">
        <div className="section-container">
          <h2 className="heading-md text-center mb-4">How We Work Together</h2>
          <p className="body-md text-center max-w-2xl mx-auto mb-12">
            Every organization is different. Choose the engagement format that fits your needs and timeline.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Diagnostic Workshop */}
            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-xl font-bold">Diagnostic Workshop</h3>
                <span className="text-sm text-foreground/50 font-medium">1-2 days</span>
              </div>
              <p className="text-foreground/70 mb-6 flex-grow">
                A focused deep-dive into your organization's challenges. We map your system dynamics,
                identify leverage points, and create an actionable roadmap for change.
              </p>
              <Link to="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* CLEAR Implementation Program */}
            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-xl font-bold">CLEAR Implementation Program</h3>
                <span className="text-sm text-foreground/50 font-medium">3-6 months</span>
              </div>
              <p className="text-foreground/70 mb-6 flex-grow">
                A comprehensive transformation engagement. Multiple CLEAR cycles with hands-on
                facilitation, from initial clarity through scaled refinement.
              </p>
              <Link to="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Executive Coaching & Advisory */}
            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-xl font-bold">Executive Coaching & Advisory</h3>
                <span className="text-sm text-foreground/50 font-medium">Ongoing</span>
              </div>
              <p className="text-foreground/70 mb-6 flex-grow">
                Ongoing strategic guidance for leaders navigating complex change. Regular sessions
                combining psychological insight with systems thinking.
              </p>
              <Link to="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Keynote Speaking & Training */}
            <div className="glass-card p-8 md:p-10 flex flex-col">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-5">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-xl font-bold">Keynote Speaking & Training</h3>
                <span className="text-sm text-foreground/50 font-medium">Event-based</span>
              </div>
              <p className="text-foreground/70 mb-6 flex-grow">
                Inspiring keynotes and interactive workshops on organizational change, listening,
                behavioral design, and the CLEAR framework.
              </p>
              <Link to="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10">
            <h2 className="heading-md mb-6">Business Impact</h2>
            <p className="body-md mb-6">
              The CLEAR framework has been successfully applied across industries, from global 
              corporations seeking to enhance cross-department collaboration to manufacturing SMEs 
              aiming to minimize operational downtime, and technology startups boosting customer retention.
            </p>
            <p className="body-md mb-8">
              Each engagement begins with a thorough diagnostic process to understand your 
              specific context and challenges. This collaborative assessment forms the foundation 
              for a tailored application of the CLEAR framework.
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
