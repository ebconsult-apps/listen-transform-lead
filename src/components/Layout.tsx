
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link 
            to="/" 
            className="font-display text-2xl font-bold text-foreground flex items-center"
          >
            <span className="mr-1.5 text-primary">S</span>
            <span className="mr-1">L</span>
            <span className="mr-1.5 text-primary">F</span>
          </Link>

          {isMobile ? (
            <>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 glass animate-fade-in py-4 px-4">
                  <nav className="flex flex-col space-y-3">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/about" className="nav-link">About Erik</NavLink>
                    <NavLink to="/resources" className="nav-link">Resources</NavLink>
                    <NavLink to="/services" className="nav-link">Services</NavLink>
                    <NavLink to="/get-the-book" className="nav-link">Get the Book</NavLink>
                    <NavLink to="/contact" className="nav-link">Contact</NavLink>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <nav className="flex items-center space-x-1">
              <NavLink to="/" className="nav-link">Home</NavLink>
              <NavLink to="/about" className="nav-link">About Erik</NavLink>
              <NavLink to="/resources" className="nav-link">Resources</NavLink>
              <NavLink to="/services" className="nav-link">Services</NavLink>
              <NavLink to="/get-the-book" className="nav-link">Get the Book</NavLink>
              <NavLink to="/contact" className="nav-link">Contact</NavLink>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      <footer className="bg-muted py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link 
                to="/" 
                className="font-display text-xl font-bold text-foreground flex items-center"
              >
                <span className="mr-1 text-primary">S</span>
                <span className="mr-0.5">L</span>
                <span className="mr-1 text-primary">F</span>
              </Link>
              <p className="mt-2 text-sm text-foreground/60 max-w-md">
                The Simple Listening Framework helps organizations and individuals transform challenges into opportunities through empathetic listening.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-medium text-sm uppercase tracking-wider text-foreground/70 mb-3">Navigation</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-sm text-foreground/60 hover:text-foreground transition-colors">About</Link></li>
                  <li><Link to="/resources" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Resources</Link></li>
                  <li><Link to="/services" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Services</Link></li>
                  <li><Link to="/get-the-book" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Get the Book</Link></li>
                  <li><Link to="/contact" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-sm uppercase tracking-wider text-foreground/70 mb-3">Contact</h3>
                <address className="not-italic text-sm text-foreground/60">
                  <p>Stockholm, Sweden</p>
                  <p className="mt-2">
                    <a href="mailto:hello@simplelistening.com" className="hover:text-foreground transition-colors">
                      hello@simplelistening.com
                    </a>
                  </p>
                </address>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-foreground/10 flex justify-between items-center text-sm text-foreground/50">
            <p>© {new Date().getFullYear()} SLF. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
