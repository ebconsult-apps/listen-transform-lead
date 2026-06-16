import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

/**
 * Supabase appends the session to the URL after a magic-link / OAuth redirect.
 * The client (detectSessionInUrl) exchanges it automatically; we just wait for
 * a session, then forward into the app.
 */
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) {
      navigate("/login", { replace: true });
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/app", { replace: true });
    });
    // Handle the case where the session is already established.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/app", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-foreground/50">Signing you in…</div>
    </div>
  );
};

export default AuthCallback;
