import { requireSupabase } from "./supabase";
import { devActive } from "@/lib/dev/config";
import { toast } from "sonner";
const DEV_CAP = import.meta.env.DEV || __DEV_BYPASS__;

/**
 * Account-level auth + lifecycle operations (password, deletion). These touch
 * `auth.users` / an edge function rather than an RLS-scoped table, so they live
 * here instead of db.ts — but they follow the same dev-seam guard so mock/QA mode
 * never makes a real call on a fake session.
 */

/**
 * Change the signed-in user's password. The session is already authenticated, so
 * Supabase doesn't require the current password to set a new one.
 */
export async function changePassword(newPassword: string): Promise<void> {
  if (DEV_CAP && devActive()) {
    toast.message("Dev: password change is stubbed in mock mode.");
    return;
  }
  const sb = requireSupabase();
  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
