
import { ReactNode } from "react";
import { ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

interface LandingPageProps {
  headline: string;
  subheadline?: string;
  problemStatements: string[];
  solutionText: string;
  testimonial?: Testimonial;
  ctaText: string;
  ctaLink: string;
  showWhitepaperForm: boolean;
  children?: ReactNode;
  seoTitle?: string;
  seoDescription?: string;
  seoPath?: string;
}

const LandingPage = ({
  headline,
  subheadline,
  problemStatements,
  solutionText,
  testimonial,
  ctaText,
  ctaLink,
  showWhitepaperForm,
  children,
  seoTitle,
  seoDescription,
  seoPath,
}: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {seoTitle && (
        <SEO
          title={seoTitle}
          description={seoDescription || ""}
          path={seoPath || ""}
        />
      )}

      {/* Trust link */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          clear-framework.com
        </Link>
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading-xl mb-6">{headline}</h1>
          {subheadline && (
            <p className="body-lg text-foreground/70 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>
      </section>

      {/* Problem Section */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 md:p-10">
            <h2 className="heading-md mb-8 text-center">
              Does this sound familiar?
            </h2>
            <div className="space-y-5">
              {problemStatements.map((problem, index) => (
                <div key={index} className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-lg text-foreground/80">{problem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 md:p-10 bg-primary/5">
            <h2 className="heading-md mb-6 text-center">
              There's a better way
            </h2>
            <p className="body-lg text-center">{solutionText}</p>
          </div>
        </div>
      </section>

      {/* Optional Testimonial */}
      {testimonial && (
        <section className="pb-16 sm:pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card p-8 md:p-10 text-center">
              <blockquote className="text-xl italic text-foreground/80 mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-foreground/60">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Whitepaper form slot or children */}
      {showWhitepaperForm && children && (
        <section className="pb-16 sm:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!showWhitepaperForm && (
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-card p-8 md:p-12">
              <h2 className="heading-md mb-6">Ready to get started?</h2>
              <p className="text-foreground/60 text-sm mb-6">No commitment. No pitch. Just clarity.</p>
              {ctaLink.startsWith("http") ? (
                <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-lg px-8 py-3">
                  {ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              ) : (
                <Link to={ctaLink} className="btn-primary text-lg px-8 py-3">
                  {ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Minimal Footer */}
      <footer className="py-8 border-t border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-foreground/40">
          <Link to="/" className="hover:text-foreground/70 transition-colors">
            clear-framework.com
          </Link>
          <Link
            to="/contact"
            className="hover:text-foreground/70 transition-colors"
          >
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
