import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, AlertTriangle, Quote } from "lucide-react";
import SEO from "@/components/SEO";

interface Challenge {
  title: string;
  description: string;
}

interface Solution {
  title: string;
  description: string;
}

interface CaseStudy {
  title: string;
  context: string;
  approach: string;
  result: string;
}

interface NichePageProps {
  seoTitle: string;
  seoDescription: string;
  seoPath: string;
  headline: string;
  subheadline: string;
  heroTag: string;
  challengeTitle: string;
  challenges: Challenge[];
  solutionTitle: string;
  solutions: Solution[];
  caseStudy?: CaseStudy;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
  structuredData?: object;
}

const NichePage = ({
  seoTitle,
  seoDescription,
  seoPath,
  headline,
  subheadline,
  heroTag,
  challengeTitle,
  challenges,
  solutionTitle,
  solutions,
  caseStudy,
  ctaPrimary,
  ctaSecondary,
  structuredData,
}: NichePageProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const challengeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const solutionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseStudyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (heroRef.current) {
      heroRef.current.classList.remove("opacity-0");
      setTimeout(() => {
        heroRef.current?.classList.add("animate-fade-in");
      }, 100);
    }

    challengeRefs.current.forEach((el, i) => {
      if (el) {
        el.classList.remove("opacity-0");
        setTimeout(() => {
          el?.classList.add("animate-fade-in-up");
        }, 300 + i * 100);
      }
    });

    solutionRefs.current.forEach((el, i) => {
      if (el) {
        el.classList.remove("opacity-0");
        setTimeout(() => {
          el?.classList.add("animate-fade-in-up");
        }, 500 + i * 100);
      }
    });

    if (caseStudyRef.current) {
      caseStudyRef.current.classList.remove("opacity-0");
      setTimeout(() => {
        caseStudyRef.current?.classList.add("animate-fade-in-up");
      }, 700);
    }

    if (ctaRef.current) {
      ctaRef.current.classList.remove("opacity-0");
      setTimeout(() => {
        ctaRef.current?.classList.add("animate-fade-in-up");
      }, 800);
    }
  }, []);

  return (
    <article className="min-h-screen">
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={seoPath}
        structuredData={structuredData as Record<string, unknown>}
      />

      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0 max-w-4xl">
            <div className="tag mb-4">{heroTag}</div>
            <h1 className="heading-xl mb-6">{headline}</h1>
            <p className="body-lg max-w-3xl">{subheadline}</p>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="pb-20">
        <div className="section-container">
          <h2 className="heading-md text-center mb-12">{challengeTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {challenges.map((challenge, i) => (
              <div
                key={i}
                ref={(el) => (challengeRefs.current[i] = el)}
                className="glass-card p-6 md:p-8 opacity-0"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/10 p-2.5 rounded-full flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="pb-20">
        <div className="section-container">
          <h2 className="heading-md text-center mb-12">{solutionTitle}</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {solutions.map((solution, i) => (
              <div
                key={i}
                ref={(el) => (solutionRefs.current[i] = el)}
                className="glass-card p-6 md:p-8 opacity-0 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
                <div className="absolute top-0 left-0 h-16 w-1 bg-primary"></div>
                <div className="ml-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{solution.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      {caseStudy && (
        <section className="pb-20">
          <div className="section-container max-w-4xl mx-auto">
            <div
              ref={caseStudyRef}
              className="glass-card p-8 md:p-10 opacity-0 bg-primary/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2.5 rounded-full">
                  <Quote className="h-5 w-5 text-primary" />
                </div>
                <h2 className="heading-md">{caseStudy.title}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground/90 mb-1">
                    Context
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {caseStudy.context}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground/90 mb-1">
                    Approach
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {caseStudy.approach}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground/90 mb-1">
                    Result
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {caseStudy.result}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="pb-24">
        <div className="section-container max-w-4xl mx-auto">
          <div
            ref={ctaRef}
            className="glass-card p-8 md:p-12 text-center opacity-0"
          >
            <h2 className="heading-md mb-4">Ready to Start Your Transformation?</h2>
            <p className="body-md max-w-2xl mx-auto mb-8">
              Every organization faces unique challenges. Let's discuss how the
              CLEAR framework can be tailored to your specific context and goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={ctaPrimary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-3"
              >
                {ctaPrimary.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <Link
                to={ctaSecondary.href}
                className="btn-secondary text-lg px-8 py-3"
              >
                {ctaSecondary.text}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default NichePage;
