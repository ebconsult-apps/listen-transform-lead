import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AboutPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px 0px'
    };

    const animateElements = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === sectionRef.current) {
            // Make elements visible immediately, then add animation classes
            if (imageRef.current) {
              imageRef.current.style.opacity = '1';
              setTimeout(() => {
                imageRef.current?.classList.add('animate-fade-in-right');
              }, 100);
            }

            if (contentRef.current) {
              contentRef.current.style.opacity = '1';
              setTimeout(() => {
                contentRef.current?.classList.add('animate-fade-in');
              }, 300);
            }
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
    <section ref={sectionRef} className="py-24" id="about-preview">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section (Left side) */}
          <div ref={imageRef} className="opacity-0 order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                <img
                  src="/erik-interview.jpg"
                  alt="Portrait of Erik Bohjort"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Content (Right side) */}
          <div ref={contentRef} className="opacity-0 order-1 lg:order-2">
            <div className="tag mb-4">About</div>
            <h2 className="heading-lg mb-6">Erik Bohjort</h2>
            <p className="body-md mb-6">
              Licensed psychologist (Uppsala University) and behavioural design specialist based in
              Stockholm. I work with energy companies, pension and finance providers, news media,
              digital product teams and public agencies on one question: how do we get people to
              actually do the thing the strategy depends on?
            </p>
            <p className="body-md mb-8">
              I sit on the Swedish Energy Agency's expert board on behavioural design and teach the
              subject at specialist level for psychologists. The CLEAR Change Framework is that
              practice written down.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-10">
              <div className="glass p-4 rounded-xl">
                <h3 className="font-medium text-foreground mb-2">Subscriptions more than doubled</h3>
                <p className="text-sm text-foreground/70">
                  For one of the largest newspapers in the EU, by redesigning how readers decide
                </p>
              </div>
              <div className="glass p-4 rounded-xl">
                <h3 className="font-medium text-foreground mb-2">2,500 households studied</h3>
                <p className="text-sm text-foreground/70">
                  The EU's largest behavioural survey on energy demand flexibility, for the Swedish Energy Agency
                </p>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              More about Erik
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
