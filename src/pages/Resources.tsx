
import { useEffect, useRef, useState } from "react";
import { FileText, Download, ArrowRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import WhitepaperGate from "@/components/WhitepaperGate";
import { whitepapers, whitepaperPath, type Whitepaper } from "@/content/whitepapers";

const Resources = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filter, setFilter] = useState("");
  const [activeWhitepaper, setActiveWhitepaper] = useState<Whitepaper | null>(null);

  // Scroll to top on page load and setup animations
  useEffect(() => {
    window.scrollTo(0, 0);

    if (heroRef.current) {
      heroRef.current.classList.remove("opacity-0");
      setTimeout(() => {
        heroRef.current?.classList.add("animate-fade-in");
      }, 100);
    }

    if (introRef.current) {
      introRef.current.classList.remove("opacity-0");
      setTimeout(() => {
        introRef.current?.classList.add("animate-fade-in-up");
      }, 300);
    }

    cardRefs.current.forEach((card, index) => {
      if (card) {
        card.classList.remove("opacity-0");
        setTimeout(() => {
          card?.classList.add("animate-fade-in-up");
        }, 500 + index * 100);
      }
    });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeWhitepaper) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeWhitepaper]);

  const filteredWhitepapers = whitepapers.filter(
    (wp) =>
      wp.title.toLowerCase().includes(filter.toLowerCase()) ||
      wp.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <SEO
        title="Behaviour Change & CLEAR Framework Whitepapers | Erik Bohjort"
        description="Free whitepapers by licensed psychologist Erik Bohjort on behaviour change, behavioural design, nudge effect sizes, the OECD LOGIC framework, and the CLEAR Change Framework. Read the overview, then download the PDF."
        path="/resources"
      />
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0">
            <div className="tag mb-4">Resources</div>
            <h1 className="heading-xl mb-6">Knowledge Center</h1>
            <p className="body-lg max-w-3xl">
              Access our collection of whitepapers and guides to deepen your
              understanding of effective change management.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pb-16">
        <div className="section-container">
          <div
            ref={introRef}
            className="glass-card p-8 md:p-10 max-w-3xl mx-auto opacity-0"
          >
            <h2 className="heading-md mb-6">Free Educational Resources</h2>
            <p className="body-md mb-4">
              These whitepapers are designed to help you implement the CLEAR
              Change Framework in your organization. Whether you're a business
              leader, consultant, or change manager, these guides provide
              practical insights for navigating complex change.
            </p>
            <p className="body-md">
              Fill in a short form to access any whitepaper instantly. Share them
              with your team or colleagues who might benefit from this knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="pb-6">
        <div className="section-container max-w-5xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search whitepapers..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl border border-foreground/10 bg-white/50 backdrop-blur-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Whitepapers Grid */}
      <section className="pb-24">
        <div className="section-container max-w-5xl mx-auto">
          {filteredWhitepapers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/60">
                No whitepapers match your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredWhitepapers.map((wp, i) => (
                <div
                  key={wp.id}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="glass-card p-8 opacity-0 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-foreground/50 mb-1">
                        {wp.category}
                      </div>
                      <h3 className="text-lg font-bold mb-2">
                        <Link to={whitepaperPath(wp.id)} className="hover:text-primary transition-colors">
                          {wp.title}
                        </Link>
                      </h3>
                      <p className="text-foreground/70 mb-4">
                        {wp.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {wp.takeaways.map((takeaway, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/70">{takeaway}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setActiveWhitepaper(wp)}
                      className="btn-primary flex-1 justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Free
                    </button>
                    <Link
                      to={whitepaperPath(wp.id)}
                      className="btn-secondary flex-1 justify-center"
                    >
                      {wp.body ? "Read online" : "Read the overview"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10 bg-primary/5">
            <h2 className="heading-md mb-6 text-center">
              Need Personalized Guidance?
            </h2>
            <p className="body-md mb-8 text-center">
              Our team can help you apply these frameworks to your specific
              organizational challenges.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/services" className="btn-primary">
                Explore Our Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Whitepaper Modal */}
      {activeWhitepaper && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveWhitepaper(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveWhitepaper(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <WhitepaperGate
              title={activeWhitepaper.title}
              description={activeWhitepaper.description}
              highlights={activeWhitepaper.takeaways}
              pdfUrl={activeWhitepaper.pdfUrl}
              whitepaperIdentifier={activeWhitepaper.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
