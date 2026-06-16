import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Chrome for the self-serve product surface (landing, pricing, app, account).
 * Reuses the marketing site's wordmark + nav rhythm; the primary CTA is "Log in"
 * when signed out and switches to Dashboard / Log out when signed in.
 */
const ProductLayout = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/product");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 py-3 bg-white/95 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/product"
            className="font-display text-2xl font-bold text-foreground flex items-center"
          >
            <span className="text-primary">C</span>LEAR
            <span className="ml-2 text-xs font-medium text-foreground/40 hidden sm:inline">
              self-serve
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/pricing" className="nav-link">
              Pricing
            </NavLink>
            {session ? (
              <>
                <NavLink to="/app" className="nav-link hidden sm:inline-flex">
                  Dashboard
                </NavLink>
                <button onClick={handleSignOut} className="btn-secondary">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Log in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-20 sm:pt-24">
        <Outlet />
      </main>

      <footer className="bg-muted py-10 mt-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-foreground/50">
          <p>© {new Date().getFullYear()} CLEAR — Behavioral insights, productized.</p>
          <div className="flex gap-4">
            <Link to="/framework" className="hover:text-foreground transition-colors">
              Method
            </Link>
            <Link to="/methodology" className="hover:text-foreground transition-colors">
              Methodology
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              clear-framework.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductLayout;
