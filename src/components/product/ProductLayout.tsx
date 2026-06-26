import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/** Two-letter monogram from a display name or email for the avatar fallback. */
function initials(source: string): string {
  const letters = (source.match(/[a-zA-Z0-9]/g) ?? []).slice(0, 2);
  return letters.length ? letters.join("").toUpperCase() : "?";
}

/**
 * Chrome for the self-serve product surface (landing, pricing, app, account).
 * Reuses the marketing site's wordmark + nav rhythm; the primary CTA is "Log in"
 * when signed out and switches to Dashboard / Log out when signed in.
 */
const ProductLayout = () => {
  const { session, user, signOut } = useAuth();
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-sm font-semibold">
                        {initials((user?.user_metadata?.name as string) || user?.email || "")}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate font-normal text-foreground/60">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/app")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account")}>Account</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          <p>© {new Date().getFullYear()} CLEAR: Behavioral insights, productized.</p>
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
