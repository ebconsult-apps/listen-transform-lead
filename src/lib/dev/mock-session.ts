/**
 * A fake Supabase auth session for dev/QA mode. Only the fields the app actually
 * reads are populated (`session.user.id` / `.email`); the rest is cast so we
 * don't have to enumerate every optional field of the SDK types.
 *
 * The tokens are intentionally fake. A real backend would reject them (401) —
 * which is the honest behavior we want: live AI cannot run on a mock session
 * (see DevPanel + clear/run live-in-mock guard).
 */
import type { Session, User } from "@supabase/supabase-js";

export const MOCK_USER_ID = "dev-user-00000000-0000-4000-8000-000000000001";

export const MOCK_USER = {
  id: MOCK_USER_ID,
  aud: "authenticated",
  role: "authenticated",
  email: "dev@clear.local",
  app_metadata: { provider: "dev" },
  user_metadata: { name: "Dev / QA" },
  created_at: "2026-01-01T00:00:00.000Z",
} as unknown as User;

export const MOCK_SESSION = {
  access_token: "dev-mock-access-token",
  refresh_token: "dev-mock-refresh-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 4102444800, // 2100-01-01, far future so nothing treats it as expired
  user: MOCK_USER,
} as unknown as Session;
