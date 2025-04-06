
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Unlock, MoveHorizontal, Headphones, MessageCircle, Users, LightbulbIcon } from "lucide-react";

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
    ],
    listeningPractices: [
      "Ask open-ended questions about current challenges",
      "Reflect back what you hear without judgment",
      "Explore emotions and unspoken concerns",
      "Validate experiences while creating space for new possibilities"
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
    ],
    listeningPractices: [
      "Listen for innovative ideas and emergent solutions",
      "Create dialogue spaces for collaborative exploration",
      "Check in regularly on progress and challenges",
      "Ask questions that expand thinking and possibilities"
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
    ],
    listeningPractices: [
      "Listen for signs of reversion to old patterns",
      "Gather stories of success and positive impact",
      "Facilitate dialogue about sustaining the change",
      "Ask questions about what support is needed going forward"
    ]
  }
];

const Framework = () => {
  const [activeStage, setActiveStage] = useState("unfreeze");
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);

  // Handle stage selection
  const handleStageClick = (id: string) => {
    setActiveStage(id);
    // Smooth scroll to stages section on mobile
    if (window.innerWidth < 768) {
      stagesRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
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
      if (stagesRef.current) {
        stagesRef.current.style.opacity = '1';
        stagesRef.current.classList.add('animate-fade-in');
      }
    }, 500);
  }, []);

  // Find the current stage object
  const currentStage = stages.find(stage => stage.id === activeStage) || stages[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} style={{ opacity: '0' }}>
            <div className="tag mb-4">First Listen</div>
            <h1 className="heading-xl mb-6">Lewin's Change Model</h1>
            <p className="body-lg max-w-3xl">
              A simple, powerful approach that positions listening as the catalyst for transformative change.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pb-20">
        <div className="section-container">
          <div ref={introRef} className="glass-card p-8 md:p-10 max-w-3xl mx-auto" style={{ opacity: '0' }}>
            <h2 className="heading-md mb-6">The Power of Listening in Change</h2>
            <p className="body-md mb-4">
              Kurt Lewin's three-stage model (Unfreeze-Change-Refreeze) has guided successful organizational 
              and personal transformations for decades. What makes this model particularly powerful is 
              understanding that <strong>listening</strong> serves as the critical catalyst at each stage.
            </p>
            <p className="body-md">
              By positioning <strong>listening first</strong> in the change process, we create the psychological 
              safety necessary for meaningful transformation. When we truly listen, we uncover the real 
              challenges, co-create more effective solutions, and establish the support needed to sustain 
              positive change.
            </p>
          </div>
        </div>
      </section>

      {/* Stages Section */}
      <section className="pb-24" id="framework-steps">
        <div ref={stagesRef} className="section-container" style={{ opacity: '0' }}>
          <h2 className="heading-md text-center mb-12">The Three Stages</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Stage List */}
            <div className="lg:col-span-1 space-y-3">
              {stages.map(stage => (
                <button
                  key={stage.id}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-start gap-4 ${
                    activeStage === stage.id ? "glass-card shadow-md" : "hover:bg-white/50"
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

            {/* Right side - Detailed Stage Info */}
            <div className="lg:col-span-2 glass-card p-8 md:p-10">
              <div className="mb-8">
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
                
                <h3 className={`text-2xl font-bold mb-4 ${
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/50 p-6 rounded-xl">
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

                  <div className="bg-white/50 p-6 rounded-xl">
                    <h4 className="flex items-center gap-2 font-medium mb-4">
                      <LightbulbIcon className="h-5 w-5 text-foreground/70" />
                      <span>Listening Practices:</span>
                    </h4>
                    <ul className="space-y-3">
                      {currentStage.listeningPractices.map((practice, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className={`h-1.5 w-1.5 rounded-full mt-2 mr-3 flex-shrink-0 ${
                            activeStage === "unfreeze" ? "bg-blue-500" :
                            activeStage === "change" ? "bg-amber-500" :
                            "bg-green-500"
                          }`}></div>
                          <span className="text-foreground/80">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                    activeStage === "unfreeze" ? "bg-blue-500" :
                    activeStage === "change" ? "bg-amber-500" :
                    "bg-green-500"
                  }`} style={{
                    width: `${activeStage === "unfreeze" ? 33 : activeStage === "change" ? 66 : 100}%`
                  }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setActiveStage(prev => 
                    prev === "unfreeze" ? "refreeze" : 
                    prev === "change" ? "unfreeze" : "change"
                  )} 
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Previous Stage
                </button>
                <button 
                  onClick={() => setActiveStage(prev => 
                    prev === "unfreeze" ? "change" : 
                    prev === "change" ? "refreeze" : "unfreeze"
                  )} 
                  className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center"
                >
                  Next Stage
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
            <h2 className="heading-md mb-6">Apply the Model to Your Challenges</h2>
            <p className="body-md mb-8 max-w-2xl mx-auto">
              Ready to experience how the power of listening can transform your organization or personal journey? 
              Let's explore how Lewin's model can be applied to your specific context.
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
