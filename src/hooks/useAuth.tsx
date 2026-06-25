import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { DEV_ACCESS_ENABLED, devActive, exitDevMode, useDevState } from "@/lib/dev/config";
import { MOCK_SESSION } from "@/lib/dev/mock-session";

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [realSession, setRealSession] = useState<Session | null>(null);
  const [realLoading, setRealLoading] = useState(true);
  // Re-render whenever dev mode toggles so the mock session swaps in/out live.
  useDevState();

  useEffect(() => {
    if (!supabase) {
      setRealLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setRealSession(data.session);
      setRealLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setRealSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // In dev/QA mode a fake session stands in for a real login (no Supabase needed).
  // Gate on the build-time literal too so MOCK_SESSION tree-shakes out of prod.
  const dev = DEV_ACCESS_ENABLED && devActive();
  const session = dev ? MOCK_SESSION : realSession;
  const loading = dev ? false : realLoading;

  const signOut = async () => {
    if (devActive()) {
      exitDevMode();
      return;
    }
    await supabase?.auth.signOut();
    setRealSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
