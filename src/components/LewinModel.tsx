
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Unlock, MoveHorizontal, Headphones, MessageCircle, Users } from "lucide-react";

const stages = [
  {
    id: "unfreeze",
    title: "Unfreeze",
    description: "Create readiness for change by listening deeply to current challenges and building psychological safety.",
    icon: <Unlock className="h-6 w-6" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    listeningRole: "Active listening creates psychological safety and helps identify the true needs for change.",
    details: [
      "Build psychological safety through deep listening",
      "Understand current state and pain points",
      "Create readiness and openness for change",
      "Establish trust through empathetic conversation"
    ]
  },
  {
    id: "change",
    title: "Change",
    description: "Implement the change process by collaboratively exploring new approaches and possibilities.",
    icon: <MoveHorizontal className="h-6 w-6" />,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    listeningRole: "Collaborative listening guides the change process and helps adapt to emerging needs.",
    details: [
      "Explore options and new possibilities together",
      "Implement changes with continuous feedback",
      "Adapt approach based on ongoing listening",
      "Support through transition with empathy"
    ]
  },
  {
    id: "refreeze",
    title: "Refreeze",
    description: "Solidify the new state by listening for integration challenges and reinforcing positive changes.",
    icon: <Lock className="h-6 w-6" />,
    color: "text-green-500",
    bgColor: "bg-green-500",
    listeningRole: "Reflective listening helps identify what's working and where adjustments are needed for stability.",
    details: [
      "Reinforce and celebrate positive changes",
      "Identify and address integration challenges",
      "Establish new norms through collective dialogue",
      "Create sustainable support systems"
    ]
  }
];

const LewinModel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState("unfreeze");

  // Handle stage selection and animation
  const handleStageClick = (id: string) => {
    setActiveStage(id);
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

  // Auto-advance stages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => {
        if (prev === "unfreeze") return "change";
        if (prev === "change") return "refreeze";
        return "unfreeze";
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Find the current stage object
  const currentStage = stages.find(stage => stage.id === activeStage) || stages[0];
  
  // Calculate progress percentage for the progress bar
  const progressPercentage = activeStage === "unfreeze" ? 33 : activeStage === "change" ? 66 : 100;

  return (
    <section className="py-24 bg-muted/50" id="framework-preview">
      <div ref={sectionRef} className="section-container" style={{ opacity: '0' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="tag mb-4">The Model</div>
          <h2 className="heading-lg mb-6">Lewin's Change Model</h2>
          <p className="body-md">
            Kurt Lewin's simple yet powerful model shows how meaningful change happens. 
            At each stage, listening is the critical catalyst that enables progress.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Stage Navigation */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            {stages.map(stage => (
              <button
                key={stage.id}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-start gap-4 ${
                  activeStage === stage.id 
                    ? "glass-card shadow-md" 
                    : "hover:bg-white/50"
                }`}
                onClick={() => handleStageClick(stage.id)}
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${
                  activeStage === stage.id 
                    ? `${stage.bgColor} text-white` 
                    : "bg-secondary text-foreground"
                }`}>
                  {stage.icon}
                </div>
                <div>
                  <h3 className={`font-medium ${
                    activeStage === stage.id ? stage.color : "text-foreground"
                  }`}>
                    {stage.title}
                  </h3>
                  {activeStage === stage.id && (
                    <p className="mt-1 text-sm text-foreground/70 animate-fade-in">
                      {stage.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right side - Stage Details */}
          <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-between min-h-[28rem]">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  activeStage === "unfreeze" ? "bg-blue-100 text-blue-600" :
                  activeStage === "change" ? "bg-amber-100 text-amber-600" :
                  "bg-green-100 text-green-600"
                }`}>
                  {currentStage.title} Stage
                </span>
                
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Listening Role</span>
                </div>
              </div>
              
              <h3 className={`text-2xl font-bold mb-3 ${
                activeStage === "unfreeze" ? "text-blue-500" :
                activeStage === "change" ? "text-amber-500" :
                "text-green-500"
              }`}>
                {currentStage.title}
              </h3>
              
              <div className="mb-6 flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {currentStage.listeningRole}
                </p>
              </div>

              <div className="my-8 bg-white/50 p-6 rounded-xl">
                <h4 className="flex items-center gap-2 font-medium mb-4">
                  <Users className="h-5 w-5 text-foreground/70" />
                  <span>Key Activities:</span>
                </h4>
                <ul className="space-y-3">
                  {currentStage.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className={`h-1.5 w-1.5 rounded-full mt-2 mr-3 flex-shrink-0 ${
                        activeStage === "unfreeze" ? "bg-blue-500" :
                        activeStage === "change" ? "bg-amber-500" :
                        "bg-green-500"
                      }`}></div>
                      <span className="text-foreground/80">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-8">
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                      activeStage === "unfreeze" ? "bg-blue-500" :
                      activeStage === "change" ? "bg-amber-500" :
                      "bg-green-500"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text-right mt-4">
              <Link 
                to="/framework" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Explore the complete model
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LewinModel;
