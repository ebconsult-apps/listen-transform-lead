import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

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
      <SEO
        title="About Erik Bohjort | Licensed Psychologist & Change Consultant"
        description="Erik Bohjort is a licensed psychologist, behavioral design specialist, and creator of the CLEAR Change Framework. International keynote speaker and EU Parliament advisor."
        path="/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Erik Bohjort",
          "jobTitle": "Licensed Psychologist & Change Consultant",
          "description": "Creator of the CLEAR Change Framework. Licensed psychologist specializing in organizational transformation.",
          "url": "https://clear-framework.com/about",
          "knowsAbout": ["Organizational Change", "Behavioral Design", "Systems Thinking", "Psychometric Assessment"]
        }}
      />
      {/* Hero Section — two-column: copy left, portrait right */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="tag mb-4">About</div>
              <h1 className="heading-xl mb-6">Erik Bohjort</h1>
              <p className="body-lg max-w-2xl">
                Licensed psychologist, founder of EB Consulting, and creator of the CLEAR Change Framework.
                Leading a team of consultants who help organizations turn insight into lasting transformation.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] w-full max-w-sm mx-auto lg:ml-auto rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/erik-interview.jpg"
                  alt="Portrait of Erik Bohjort"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div ref={contentRef} className="lg:col-span-8 opacity-0 space-y-8">
              {/* Lead story — accented to open the narrative */}
              <div className="glass-card p-8 md:p-10 border-t-4 border-t-primary">
                <h2 className="heading-md mb-6">My Story</h2>
                <p className="body-md mb-4">
                  My focus on transformative listening began with a simple observation:
                  in most challenging situations, we do not listen enough. This insight has guided my
                  professional path from academic and clinical psychology to practical application in the
                  most demanding environments.
                </p>
                <p className="body-md mb-4">
                  As a licensed psychologist with a passion for solving complex challenges, I've had the privilege
                  of working with a diverse range of clients, from EU policymakers and global corporations to state
                  agencies, banks, and deep tech innovative startups.
                </p>
                <p className="body-md">
                  Throughout my career, I've observed that the most effective leaders and organizations share
                  one critical skill: the ability to listen deeply and transform what they hear into strategic action.
                  This observation led to the development of the CLEAR Change Framework.
                </p>
              </div>

              {/* Two-up: Philosophy + Team break the vertical stack */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="glass-card p-8">
                  <h2 className="heading-md mb-6">Philosophy & Approach</h2>
                  <p className="body-md mb-4">
                    I believe that genuine transformation, whether personal or organizational, begins with listening.
                    Not the passive hearing we often mistake for listening, but an active, engaged process that refines
                    knowledge and creates new insights, solutions and possibilities.
                  </p>
                  <p className="body-md mb-4">
                    My approach combines rigorous psychological principles with practical business acumen. I see myself
                    not as a distant expert, but as your guide, someone walking alongside you through challenges, helping
                    you navigate complexity with clarity and confidence.
                  </p>
                  <p className="body-md">
                    The CLEAR Change Framework embodies this philosophy, turning the art of listening into a structured
                    methodology for change that can be applied to virtually any challenge, from high-stakes negotiations to
                    personal growth.
                  </p>
                </div>

                <div className="glass-card p-8">
                  <h2 className="heading-md mb-6">The Team</h2>
                  <p className="body-md mb-4">
                    While I lead every engagement personally, I work with a curated network of
                    senior consultants, each bringing deep expertise in their domain. This means we can
                    scale to match your organization's needs without sacrificing quality or the personal
                    touch that defines our work.
                  </p>
                  <p className="body-md">
                    Our consultants are selected for their combination of practical experience and
                    analytical rigor. Whether your challenge spans multiple countries, requires industry-specific
                    knowledge, or demands parallel workstreams, the team behind the CLEAR framework
                    has the capacity to deliver.
                  </p>
                </div>
              </div>

              {/* Credentials — distinct "facts" module, two-column list */}
              <div className="glass-card p-8 md:p-10">
                <h2 className="heading-md mb-6">Credentials & Experience</h2>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 body-md">
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>Licensed Psychologist specialized in behavioral design and psychometric assessments</span>
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
                    <span>Strategic advisor supporting governmental agencies through complex strategical processes</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                    <span>Mentor and advisor to successful tech startups on team development and strategic communication</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar — slim sticky contact rail (portrait now lives in the hero) */}
            <div className="lg:col-span-4">
              <div className="glass-card p-8 sticky top-28">
                <h3 className="text-xl font-bold mb-1">Erik Bohjort</h3>
                <p className="text-foreground/70 text-sm mb-6">
                  Licensed Psychologist & Transformative Guide
                </p>
                <Link to="/contact" className="btn-primary w-full justify-center">
                  Get in touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center bg-primary/5">
            <h2 className="heading-md mb-6">Ready to Transform Your Organization?</h2>
            <p className="body-md mb-8 max-w-2xl mx-auto">
              Whether you're navigating complex change or looking to build a more adaptive
              organization, let's explore how the CLEAR framework can help.
            </p>
            <Link to="/contact" className="btn-primary">
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
