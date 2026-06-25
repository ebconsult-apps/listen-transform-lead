import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { devActive, useDevState } from "@/lib/dev/config";

/**
 * Client-side gate for /app/* and /account/*. This is UX only — the real
 * security boundary is Postgres RLS (every query is scoped by membership).
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  useDevState(); // re-evaluate when dev mode toggles

  // Dev/QA mode bypasses the auth gate entirely (mock session + mock data).
  if (devActive()) return <>{children}</>;

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-8 max-w-md text-center">
          <h1 className="heading-md mb-3">Setup required</h1>
          <p className="body-md">
            The self-serve app needs a Supabase project. Add{" "}
            <code className="text-primary">VITE_SUPABASE_URL</code> and{" "}
            <code className="text-primary">VITE_SUPABASE_ANON_KEY</code> to your
            environment, then reload.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-foreground/50">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
