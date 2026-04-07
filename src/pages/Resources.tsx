
import { useEffect, useRef, useState } from "react";
import { FileText, Download, ArrowRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import WhitepaperGate from "@/components/WhitepaperGate";

interface Whitepaper {
  id: string;
  title: string;
  description: string;
  takeaways: string[];
  pdfUrl: string;
}

const whitepapers: Whitepaper[] = [
  {
    id: "clear-change-framework",
    title: "The CLEAR Change Framework",
    description:
      "A comprehensive guide to the CLEAR methodology \u2014 from theoretical foundations to practical implementation.",
    takeaways: [
      "Understand the complete 5-step CLEAR process",
      "Learn how to apply systems thinking to organizational challenges",
      "Get actionable templates for running CLEAR workshops",
    ],
    pdfUrl: "/whitepapers/clear-change-framework.pdf",
  },
  {
    id: "clear-comparison",
    title: "Beyond Boundaries: CLEAR vs OBM, BCW & Design Thinking",
    description:
      "How the CLEAR framework compares to and integrates the strengths of established change methodologies.",
    takeaways: [
      "Understand the limits of single-domain approaches",
      "See how CLEAR bridges behavioral science and systems thinking",
      "Learn when to use CLEAR vs other frameworks",
    ],
    pdfUrl: "/whitepapers/clear-comparison.pdf",
  },
  {
    id: "clear-sustainability",
    title: "Driving Sustainable Change Inside and Out",
    description:
      "How organizations can use the CLEAR framework to embed sustainability into operations, culture, and strategy.",
    takeaways: [
      "Align sustainability with business strategy",
      "Use systems mapping to identify ESG leverage points",
      "Build lasting sustainable practices through iterative change",
    ],
    pdfUrl: "/whitepapers/clear-sustainability.pdf",
  },
  {
    id: "clear-clarity",
    title: "Frameworks for Clarifying Purpose and Setting Goals",
    description:
      "A deep dive into the Clarity step \u2014 the most critical foundation for any successful change initiative.",
    takeaways: [
      "Master OKR-setting for change initiatives",
      "Align stakeholders around a shared North Star",
      "Avoid the #1 reason change programs fail",
    ],
    pdfUrl: "/whitepapers/clear-clarity.pdf",
  },
  {
    id: "clear-case-studies",
    title: "Iterative Change: Real-World Success Stories",
    description:
      "How organizations like Domino\u2019s Pizza and others achieved transformation through iterative, listening-based change.",
    takeaways: [
      "Learn from real turnaround stories",
      "See how feedback loops drive business results",
      "Understand why iterative beats linear change",
    ],
    pdfUrl: "/whitepapers/clear-case-studies.pdf",
  },
];

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
        title="CLEAR Framework Resources | Whitepapers & Guides"
        description="Download free whitepapers and guides on the CLEAR Change Framework, systems thinking, and organizational transformation."
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
                      <h3 className="text-lg font-bold mb-2">{wp.title}</h3>
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

                  <button
                    onClick={() => setActiveWhitepaper(wp)}
                    className="btn-primary w-full justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Free
                  </button>
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

            <div className="flex justify-center">
              <Link to="/services" className="btn-primary mr-4">
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
