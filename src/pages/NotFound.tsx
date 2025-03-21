
import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Animate content on load
    setTimeout(() => {
      contentRef.current?.classList.add('animate-fade-in');
    }, 100);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div ref={contentRef} className="section-container opacity-0 text-center">
        <div className="glass-card p-12 max-w-lg mx-auto">
          <h1 className="heading-lg mb-6">Page Not Found</h1>
          <p className="body-md mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
