
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackCTAClick, trackEvent } from '@/utils/analytics';

// ---------------------------------------------------------------------------
// A/B Test: Hero headline variants
// Each visitor is randomly assigned once (stored in localStorage).
// The variant is sent to GA4 as a custom event so you can compare
// scroll depth, CTA clicks, and bounce rate per variant in GA4.
//
// To analyze: GA4 → Explore → Free-form report
//   Dimension: "hero_variant" (custom dimension — register in GA4 Admin)
//   Metrics: engagement rate, scroll depth, cta_click events
//
// When you've picked a winner, delete this test and hardcode the winner.
// ---------------------------------------------------------------------------

interface HeroVariant {
  id: string;
  tag: string;
  headline: JSX.Element;
  subtitle: string;
}

const HERO_VARIANTS: HeroVariant[] = [
  {
    id: "behavioral_design",
    tag: "The CLEAR Change Framework",
    headline: <>Organizational Change Through <span className="text-primary">Behavioral Design</span></>,
    subtitle: "70% of change initiatives fail because they ignore how people actually behave. Erik Bohjort applies behavioral design and nudging to help organizations change for real — not just on paper.",
  },
  {
    id: "psychological_design",
    tag: "Applied Behavioral Science",
    headline: <><span className="text-primary">Psychological Design</span> for Organizational Change</>,
    subtitle: "Most change programs push strategy. The CLEAR framework designs for behavior. Licensed psychologist Erik Bohjort uses nudging, behavioral economics, and systems thinking to make transformation stick.",
  },
  {
    id: "behavior_change",
    tag: "The CLEAR Change Framework",
    headline: <><span className="text-primary">Behavior Change</span> by Design, Not by Decree</>,
    subtitle: "Mandates don't change organizations — behavioral design does. Erik Bohjort is a licensed psychologist who applies nudging and behavioral economics to help organizations transform the way people actually work.",
  },
  {
    id: "behavioral_economics",
    tag: "Behavioral Science Meets Strategy",
    headline: <>Where <span className="text-primary">Behavioral Economics</span> Meets Change Management</>,
    subtitle: "Change initiatives fail when they ignore how people decide, resist, and adapt. Erik Bohjort applies behavioral economics, psychological design, and the CLEAR framework to make organizational transformation last.",
  },
];

const STORAGE_KEY = "hero_ab_variant";

function getOrAssignVariant(): HeroVariant {
  if (typeof window === "undefined") return HERO_VARIANTS[0];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const found = HERO_VARIANTS.find((v) => v.id === stored);
    if (found) return found;
  }
  const chosen = HERO_VARIANTS[Math.floor(Math.random() * HERO_VARIANTS.length)];
  localStorage.setItem(STORAGE_KEY, chosen.id);
  return chosen;
}

const Hero = () => {
  const [variant] = useState<HeroVariant>(getOrAssignVariant);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire A/B test event to GA4
    trackEvent("hero_ab_impression", { hero_variant: variant.id });

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
  }, [variant]);

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
          {variant.tag}
        </div>

        <h1
          ref={titleRef}
          className="heading-xl"
          style={{ opacity: '0' }}
        >
          {variant.headline}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 body-lg max-w-2xl"
          style={{ opacity: '0' }}
        >
          {variant.subtitle}
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
