
import { useEffect, useRef, useState } from "react";
import { FileText, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// This would be replaced with actual resource data from a database or CMS
const resources = [
  {
    id: 1,
    title: "The CLEAR Change Framework Whitepaper",
    description: "An in-depth guide to implementing the CLEAR framework in organizational settings",
    fileType: "PDF",
    fileSize: "2.4 MB",
    path: "/resources/clear-change-framework.pdf"
  },
  {
    id: 2,
    title: "Systems Thinking for Business Leaders",
    description: "How to apply systems thinking to identify leverage points in complex organizations",
    fileType: "PDF",
    fileSize: "1.8 MB",
    path: "/resources/systems-thinking-business-leaders.pdf"
  },
  {
    id: 3,
    title: "Experimentation & Prototyping Guide",
    description: "A practical handbook for running effective experiments in organizational settings",
    fileType: "PDF",
    fileSize: "3.2 MB",
    path: "/resources/experimentation-prototyping-guide.pdf"
  },
  {
    id: 4,
    title: "Measuring Change Success",
    description: "Metrics and approaches for evaluating the impact of change initiatives",
    fileType: "PDF",
    fileSize: "1.5 MB",
    path: "/resources/measuring-change-success.pdf"
  }
];

const Resources = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const resourceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filter, setFilter] = useState("");

  // Scroll to top on page load and setup animations
  useEffect(() => {
    window.scrollTo(0, 0);

    // Animation fixes - make elements visible first, then animate
    if (heroRef.current) {
      heroRef.current.classList.remove('opacity-0');
      setTimeout(() => {
        heroRef.current?.classList.add('animate-fade-in');
      }, 100);
    }
    
    if (introRef.current) {
      introRef.current.classList.remove('opacity-0');
      setTimeout(() => {
        introRef.current?.classList.add('animate-fade-in-up');
      }, 300);
    }
    
    // Animate resource cards with staggered delay
    resourceRefs.current.forEach((card, index) => {
      if (card) {
        card.classList.remove('opacity-0');
        setTimeout(() => {
          card?.classList.add('animate-fade-in-up');
        }, 500 + (index * 100));
      }
    });
  }, []);

  // Filter resources based on search input
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(filter.toLowerCase()) || 
    resource.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0">
            <div className="tag mb-4">Resources</div>
            <h1 className="heading-xl mb-6">Knowledge Center</h1>
            <p className="body-lg max-w-3xl">
              Access our collection of whitepapers, guides, and research to deepen your understanding of effective change management.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pb-16">
        <div className="section-container">
          <div ref={introRef} className="glass-card p-8 md:p-10 max-w-3xl mx-auto opacity-0">
            <h2 className="heading-md mb-6">Free Educational Resources</h2>
            <p className="body-md mb-4">
              These resources are designed to help you implement the CLEAR Change Framework 
              in your organization. Whether you're a business leader, consultant, or change manager, 
              these guides provide practical insights for navigating complex change.
            </p>
            <p className="body-md">
              All resources are available for download in PDF format. Feel free to share them 
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
              placeholder="Search resources..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl border border-foreground/10 bg-white/50 backdrop-blur-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="pb-24">
        <div className="section-container max-w-5xl mx-auto">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/60">No resources match your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredResources.map((resource, i) => (
                <div
                  key={resource.id}
                  ref={el => resourceRefs.current[i] = el}
                  className="glass-card p-8 opacity-0 relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                      <p className="text-foreground/70 mb-4">{resource.description}</p>
                      <div className="flex items-center text-sm text-foreground/50 mb-6">
                        <span className="mr-4">{resource.fileType}</span>
                        <span>{resource.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={resource.path}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Resource
                  </Link>
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
            <h2 className="heading-md mb-6 text-center">Need Personalized Guidance?</h2>
            <p className="body-md mb-8 text-center">
              Our team can help you apply these frameworks to your specific organizational challenges.
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
    </div>
  );
};

export default Resources;
