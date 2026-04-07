import { useEffect, useRef } from "react";

// Shuffled order, logo-31 (removed) excluded
const logos: { src: string; tall?: boolean }[] = [
  { src: "/logos/logo-17.svg" },
  { src: "/logos/logo-05.png" },
  { src: "/logos/logo-33.svg" },
  { src: "/logos/logo-09.svg" },
  { src: "/logos/logo-22.png" },
  { src: "/logos/logo-14.svg" },
  { src: "/logos/logo-38.png" },
  { src: "/logos/logo-02.svg" },
  { src: "/logos/logo-28.svg", tall: true },
  { src: "/logos/logo-25.svg" },
  { src: "/logos/logo-36.png" },
  { src: "/logos/logo-07.svg" },
  { src: "/logos/logo-20.svg" },
  { src: "/logos/logo-01.png" },
  { src: "/logos/logo-34.png" },
  { src: "/logos/logo-12.svg" },
  { src: "/logos/logo-30.svg" },
  { src: "/logos/logo-04.svg" },
  { src: "/logos/logo-18.png" },
  { src: "/logos/logo-37.svg" },
  { src: "/logos/logo-11.png" },
  { src: "/logos/logo-26.svg" },
  { src: "/logos/logo-08.svg" },
  { src: "/logos/logo-35.png" },
  { src: "/logos/logo-15.svg" },
  { src: "/logos/logo-03.svg" },
  { src: "/logos/logo-21.svg" },
  { src: "/logos/logo-10.svg" },
  { src: "/logos/logo-29.svg" },
  { src: "/logos/logo-06.svg" },
  { src: "/logos/logo-23.svg" },
  { src: "/logos/logo-16.svg" },
  { src: "/logos/logo-32.svg" },
  { src: "/logos/logo-13.svg" },
  { src: "/logos/logo-19.svg" },
  { src: "/logos/logo-24.svg" },
  { src: "/logos/logo-27.svg" },
];

const TrustedBy = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 border-t border-foreground/5">
      <div className="section-container">
        <div ref={sectionRef} className="opacity-0">
          <p className="text-center text-sm font-medium text-foreground/40 uppercase tracking-widest mb-10">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8">
            {logos.map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt=""
                aria-hidden="true"
                className={`w-auto object-contain grayscale opacity-40 ${
                  logo.tall ? "h-12 md:h-16" : "h-7 md:h-9"
                }`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
