import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { recordTermsAcceptance } from "@/lib/db";
import { takePendingTermsAcceptance } from "@/lib/terms-acceptance";
import { LoadingState, ErrorState } from "@/components/ui/data-states";

/**
 * Supabase appends the session to the URL after a magic-link / OAuth redirect.
 * The client (detectSessionInUrl) exchanges it automatically; we just wait for
 * a session, then forward into the app. If nothing arrives within the timeout,
 * surface an error with a way back instead of spinning forever.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!supabase) {
      navigate("/login", { replace: true });
      return;
    }
    let done = false;
    const enter = async () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      // Persist the Terms acceptance captured at signup, now that the account
      // exists. Best-effort: never block sign-in on it (login has none pending).
      const pending = takePendingTermsAcceptance();
      if (pending) {
        try {
          await recordTermsAcceptance(pending);
        } catch {
          // A missed record just re-prompts later; don't trap the user here.
        }
      }
      navigate("/app", { replace: true });
    };
    const timer = setTimeout(() => setFailed(true), 10000);
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) void enter();
    });
    // Handle the case where the session is already established.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void enter();
    });
    return () => {
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      {failed ? (
        <div className="max-w-md text-center">
          <ErrorState message="We couldn't complete your sign-in. The link may have expired." />
          <Link to="/login" className="btn-secondary mt-4">
            Back to login
          </Link>
        </div>
      ) : (
        <LoadingState label="Signing you in…" />
      )}
    </div>
  );
};

export default AuthCallback;
