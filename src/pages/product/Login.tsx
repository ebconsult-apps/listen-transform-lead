import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Passwordless login. Magic link (default) + optional Google OAuth. Signup uses
 * the same flow — Supabase creates the user on first magic-link click — so this
 * component backs both /login and /signup via the `mode` prop.
 */
const AuthForm = ({ mode }: { mode: "login" | "signup" }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  const google = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <SEO
        title={isSignup ? "Start free — CLEAR" : "Log in — CLEAR"}
        description="Access your CLEAR self-serve behavioral analysis workspace."
        path={isSignup ? "/signup" : "/login"}
        noindex
      />
      <Link
        to="/product"
        className="font-display text-2xl font-bold mb-8 flex items-center"
      >
        <span className="text-primary">C</span>LEAR
      </Link>

      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="heading-md mb-2 text-center">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-foreground/60 text-center mb-6">
          {isSignup
            ? "Start free — no credit card. We'll email you a magic link."
            : "We'll email you a secure magic link. No password needed."}
        </p>

        {!isSupabaseConfigured ? (
          <p className="text-sm text-center text-amber-600 bg-amber-50 rounded-lg p-3">
            Supabase isn't configured yet. Set VITE_SUPABASE_URL and
            VITE_SUPABASE_ANON_KEY to enable sign-in.
          </p>
        ) : sent ? (
          <div className="text-center">
            <p className="font-medium mb-1">Check your email</p>
            <p className="text-sm text-foreground/60">
              We sent a magic link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={sendMagicLink} className="space-y-4">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Sending…" : "Email me a magic link"}
              </button>
            </form>
            <div className="my-4 flex items-center gap-3 text-xs text-foreground/40">
              <div className="h-px bg-border flex-grow" /> or{" "}
              <div className="h-px bg-border flex-grow" />
            </div>
            <button onClick={google} className="btn-secondary w-full">
              Continue with Google
            </button>
          </>
        )}

        <p className="text-sm text-center text-foreground/60 mt-6">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Start free
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

const Login = () => <AuthForm mode="login" />;
export default Login;
export { AuthForm };
