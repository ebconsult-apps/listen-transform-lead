
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, X } from "lucide-react";
import FreeChapterForm from "@/components/FreeChapterForm";

const BookPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "-50px 0px",
    };

    const animateElements = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (contentRef.current) {
            contentRef.current.style.opacity = "1";
            contentRef.current.classList.add("animate-fade-in");
          }
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(animateElements, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <>
      <section ref={sectionRef} className="py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="section-container">
          <div
            ref={contentRef}
            className="opacity-0 max-w-3xl mx-auto text-center"
          >
            <div className="glass-card p-8 md:p-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="tag">Coming Soon</div>
                <div className="tag">
                  <BookOpen className="h-3 w-3 mr-1" />
                  The Book
                </div>
              </div>

              <h2 className="heading-lg mb-2">The CLEAR Change Framework</h2>
              <p className="text-lg text-primary/80 font-medium mb-6">
                By Erik Bohjort
              </p>

              <p className="body-md max-w-2xl mx-auto mb-8">
                What if the most powerful tool for organizational transformation was
                something we all do every day — but rarely do well? The Simple
                Listening Framework reveals how genuine, structured listening can
                unlock change in even the most complex organizations. Drawing on
                psychology, systems thinking, and real-world case studies, this book
                gives leaders a practical blueprint for turning listening into
                strategic action.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary"
                >
                  Get a Free Chapter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <Link to="/get-the-book" className="btn-secondary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Chapter Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-background rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="heading-md mb-2">Get a Free Chapter</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your details below and we'll send you a free chapter of
              The CLEAR Change Framework.
            </p>

            <FreeChapterForm onSuccess={() => {}} />
          </div>
        </div>
      )}
    </>
  );
};

export default BookPreview;
