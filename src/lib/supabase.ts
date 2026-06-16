import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (auth + RLS-scoped data + storage).
 *
 * The self-serve product needs a configured Supabase project. When the env vars
 * are absent (e.g. a fresh clone before setup) we expose `null` rather than
 * throwing at import time, so the marketing site still builds/prerenders. Call
 * `requireSupabase()` inside product code paths to get a friendly runtime error.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local.",
    );
  }
  return supabase;
}
