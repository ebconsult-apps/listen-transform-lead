
import { useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackCTAClick } from '@/utils/analytics';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Instead of adding animation classes that cause elements to disappear,
    // let's make elements visible immediately but still animate them in
    if (titleRef.current) {
      titleRef.current.style.opacity = '1';
      titleRef.current.classList.add('animate-fade-in');
    }
    
    setTimeout(() => {
      if (sloganRef.current) {
        sloganRef.current.style.opacity = '1';
        sloganRef.current.classList.add('animate-fade-in');
      }
    }, 200);
    
    setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = '1';
        subtitleRef.current.classList.add('animate-fade-in-up');
      }
    }, 400);
    
    setTimeout(() => {
      if (ctaRef.current) {
        ctaRef.current.style.opacity = '1';
        ctaRef.current.classList.add('animate-fade-in-up');
      }
    }, 600);

    if (bgPatternRef.current) {
      bgPatternRef.current.style.opacity = '1';
      bgPatternRef.current.classList.add('animate-fade-in');
    }
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div 
        ref={bgPatternRef}
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(var(--primary, 0, 0, 255), 0.15) 0%, transparent 40%), 
                            radial-gradient(circle at 80% 70%, rgba(var(--primary, 0, 0, 255), 0.1) 0%, transparent 40%)`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Content */}
      <div className="section-container relative z-10 flex flex-col items-center text-center">
        <div
          ref={sloganRef}
          className="mb-2 tag text-lg md:text-xl"
          style={{ opacity: '0' }}
        >
          The CLEAR Change Framework
        </div>

        <h1
          ref={titleRef}
          className="heading-xl"
          style={{ opacity: '0' }}
        >
          Change Management Built on <span className="text-primary">Clinical Psychology</span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 body-lg max-w-2xl"
          style={{ opacity: '0' }}
        >
          70% of change initiatives fail. Licensed psychologist Erik Bohjort helps organizations beat those odds through the CLEAR framework &mdash; behavioral science and systems thinking that makes transformation stick.
        </p>
        
        <div 
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center"
          style={{ opacity: '0' }}
        >
          <Link to="/assessment" className="btn-primary" onClick={() => trackCTAClick("hero_assessment")}>
            Take the Free Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a href="https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink" target="_blank" rel="noopener noreferrer" className="btn-secondary" onClick={() => trackCTAClick("book_discovery_call")}>
            Book a Discovery Call
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Static decorative elements */}
      <div className="absolute bottom-10 left-[10%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
      <div className="absolute top-20 right-[12%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/5 blur-xl pointer-events-none"></div>
    </section>
  );
};

export default Hero;
