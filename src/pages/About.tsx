
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Animate elements on page load
    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.classList.add('animate-fade-in-up');
        heroRef.current.style.opacity = '1';
      }
    }, 100);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.classList.add('animate-fade-in-up');
        contentRef.current.style.opacity = '1';
      }
    }, 300);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-24 sm:pt-16 sm:pb-32">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0">
            <div className="tag mb-4">About</div>
            <h1 className="heading-xl mb-6">Erik Bohjort</h1>
            <p className="body-lg max-w-3xl">
              Licensed psychologist and guide to transformative change,
              helping organizations and individuals turn listening into action.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div ref={contentRef} className="lg:col-span-8 opacity-0">
              <div className="glass-card p-8 md:p-10 mb-10">
                <h2 className="heading-md mb-6">My Story</h2>
                <p className="body-md mb-4">
                  My journey into the world of transformative listening began with a simple observation: 
                  in most challenging situations, we do not listen enough. This insight has guided my 
                  professional path from academic and clinical psychology to practical application in the 
                  most demanding environments.
                </p>
                <p className="body-md mb-4">
                  As a licensed psychologist with a passion for solving complex challenges, I've had the privilege 
                  of working with a diverse range of clients – from EU policymakers and global corporations to state 
                  agencies, banks, and deep tech innovative startups.
                </p>
                <p className="body-md">
                  Throughout my career, I've observed that the most effective leaders and organizations share 
                  one critical skill: the ability to listen deeply and transform what they hear into strategic action. 
                  This observation led to the development of the Simple Listening Framework (SLF).
                </p>
              </div>

              <div className="glass-card p-8 md:p-10 mb-10">
                <h2 className="heading-md mb-6">Philosophy & Approach</h2>
                <p className="body-md mb-4">
                  I believe that genuine transformation – whether personal or organizational – begins with listening. 
                  Not the passive hearing we often mistake for listening, but an active, engaged process that refines
                  knowledge and creates new insights, solutions and possibilities.
                </p>
                <p className="body-md mb-4">
                  My approach combines rigorous psychological principles with practical business acumen. I see myself 
                  not as a distant expert, but as your guide – someone walking alongside you through challenges, helping 
                  you navigate complexity with clarity and confidence.
                </p>
                <p className="body-md">
                  The Simple Listening Framework embodies this philosophy, turning the art of listening into a structured 
                  methodology for change that can be applied to virtually any challenge, from high-stakes negotiations to 
                  personal growth.
                </p>
              </div>

              <div className="glass-card p-8 md:p-10">
                <h2 className="heading-md mb-6">Credentials & Experience</h2>
                <ul className="space-y-4 body-md">
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>Licensed Psychologist specialized in behavioral design and psychometric assessments</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>Author of commissioned reports informing policy for the EU Parliament</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>International keynote speaker on psychological design, innovation, and organizational behavior</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>Creator of psychometric tools and frameworks used globally</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>Strategic advisor supporting governmental agencies through complex organizational transformations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>Mentor and advisor to successful tech startups on team development and strategic communication</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="glass-card p-8 mb-8 sticky top-28">
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-secondary to-accent overflow-hidden relative mb-6">
                  <div className="absolute inset-0 bg-pattern opacity-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary/30 text-lg">
                    Portrait Image
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Erik Bohjort</h3>
                <p className="text-foreground/70 text-sm">
                  Licensed Psychologist & Transformative Guide
                </p>
                
                <div className="mt-8">
                  <Link to="/contact" className="btn-primary w-full justify-center">
                    Get In Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
