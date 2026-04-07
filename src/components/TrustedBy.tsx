import { useEffect, useRef } from "react";

const logoFiles = Array.from({ length: 38 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  const pngNums = [1, 5, 11, 18, 22, 34, 35, 36, 38];
  const ext = pngNums.includes(i + 1) ? "png" : "svg";
  return `/logos/logo-${num}.${ext}`;
});

const TrustedBy = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
            {logoFiles.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                aria-hidden="true"
                className="h-8 md:h-10 w-auto object-contain grayscale opacity-40 hover:opacity-70 transition-opacity duration-300"
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
