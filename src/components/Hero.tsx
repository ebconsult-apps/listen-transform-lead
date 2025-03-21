
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
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
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = '1';
        subtitleRef.current.classList.add('animate-fade-in-up');
      }
    }, 300);
    
    setTimeout(() => {
      if (ctaRef.current) {
        ctaRef.current.style.opacity = '1';
        ctaRef.current.classList.add('animate-fade-in-up');
      }
    }, 600);

    if (bgPatternRef.current) {
      bgPatternRef.current.style.opacity = '1';
      bgPatternRef.current.classList.add('animate-blur-in');
    }
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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
        <h1 
          ref={titleRef}
          className="heading-xl"
          style={{ opacity: '0' }}
        >
          <span className="text-primary">Listen.</span> Transform. <span className="text-primary">Lead.</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="mt-6 body-lg max-w-2xl"
          style={{ opacity: '0' }}
        >
          I'm Erik Bohjort, licensed psychologist and guide to transformative change. 
          Discover how the Simple Listening Framework turns genuine listening into strategic action.
        </p>
        
        <div 
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center"
          style={{ opacity: '0' }}
        >
          <Link to="/framework" className="btn-primary">
            Discover the Framework
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/contact" className="btn-secondary">
            Book a Consultation
          </Link>
        </div>
      </div>

      {/* Glass element for visual interest */}
      <div className="absolute bottom-10 left-[10%] w-20 h-20 md:w-32 md:h-32 rounded-full glass opacity-40 animate-rotate-slow pointer-events-none"></div>
      <div className="absolute top-20 right-[12%] w-16 h-16 md:w-24 md:h-24 rounded-full glass opacity-30 animate-rotate-slow pointer-events-none" style={{ animationDirection: 'reverse' }}></div>
    </section>
  );
};

export default Hero;
