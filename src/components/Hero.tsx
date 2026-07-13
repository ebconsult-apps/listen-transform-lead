
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
    subtitle: "70% of change initiatives fail because they ignore how people actually behave. Erik Bohjort applies behavioral design and nudging to help organizations change for real, not just on paper.",
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
    subtitle: "Mandates don't change organizations. Behavioral design does. Erik Bohjort is a licensed psychologist who applies nudging and behavioral economics to help organizations transform the way people actually work.",
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
  const bgPatternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire A/B test event to GA4
    trackEvent("hero_ab_impression", { hero_variant: variant.id });

    // The foreground copy reveals via CSS animations (see JSX below) so it stays
    // visible in the prerendered HTML even before JS runs. Only the decorative
    // ambient background — safe to hide — is faded in from script.
    if (bgPatternRef.current) {
      bgPatternRef.current.style.opacity = '1';
      bgPatternRef.current.classList.add('animate-fade-in');
    }
  }, [variant]);

  return (
    <section className="relative min-h-[70dvh] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div 
        ref={bgPatternRef}
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.5) 0%, transparent 45%),
                            radial-gradient(circle at 80% 70%, hsl(var(--primary) / 0.35) 0%, transparent 45%)`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Content */}
      <div className="section-container relative z-10 flex flex-col items-center text-center">
        <div className="mb-2 tag text-lg md:text-xl motion-safe:animate-fade-in motion-safe:[animation-delay:200ms] motion-safe:[animation-fill-mode:backwards]">
          {variant.tag}
        </div>

        <h1 className="heading-xl motion-safe:animate-fade-in">
          {variant.headline}
        </h1>

        <p className="mt-6 body-lg max-w-2xl motion-safe:animate-fade-in-up motion-safe:[animation-delay:400ms] motion-safe:[animation-fill-mode:backwards]">
          {variant.subtitle}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center motion-safe:animate-fade-in-up motion-safe:[animation-delay:600ms] motion-safe:[animation-fill-mode:backwards]">
          <Link to="/assessment" className="btn-primary" onClick={() => trackCTAClick("hero_assessment")}>
            Take the Free Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/book-call" className="btn-secondary" onClick={() => trackCTAClick("book_discovery_call")}>
            Book a Discovery Call
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Static decorative elements */}
      <div className="absolute bottom-10 left-[10%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
      <div className="absolute top-20 right-[12%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/5 blur-xl pointer-events-none"></div>
    </section>
  );
};

export default Hero;
