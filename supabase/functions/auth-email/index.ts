// Supabase Auth "Send Email" hook (verify_jwt=false; Supabase signs the request).
//
// Replaces Supabase's default, unbranded auth emails — sent from the generic
// noreply@mail.app.supabase.io — with a branded CLEAR email delivered through
// the same already-verified Brevo sender (erik@eb-consulting.se) used for
// respondent invitations. Covers the passwordless login magic link and the
// first-time signup confirmation, which share Supabase's signInWithOtp flow.
import { Webhook } from "npm:standardwebhooks@^1";
import { json } from "../_shared/cors.ts";
import { sendBrevoEmail } from "../_shared/email.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
// Supabase stores the hook secret as "v1,whsec_<base64>"; standardwebhooks wants
// the "whsec_<base64>" part, so drop the Supabase-specific "v1," version prefix.
const HOOK_SECRET = (Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "").replace("v1,", "");

// Supabase Auth hooks expect failures as { error: { http_code, message } } and
// surface `message` to the client (the /login toast) — a plain string error
// renders as an opaque "{}" there, so always use this shape.
function hookError(http_code: number, message: string): Response {
  return json({ error: { http_code, message } }, http_code);
}

interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/** The link Supabase Auth verifies before redirecting back into the app. */
function actionLink(d: EmailData): string {
  const params = new URLSearchParams({
    token: d.token_hash,
    type: d.email_action_type,
    redirect_to: d.redirect_to,
  });
  return `${SUPABASE_URL}/auth/v1/verify?${params.toString()}`;
}

/**
 * Branded magic-link / signup email. Mirrors the respondent invite email
 * (system fonts, teal #0f766e button, paste-the-link fallback) so the product's
 * transactional mail looks consistent.
 */
function magicLinkEmail(d: EmailData) {
  const link = actionLink(d);
  const isSignup = d.email_action_type === "signup";

  const subject = isSignup ? "Confirm your email for CLEAR" : "Your CLEAR sign-in link";
  const heading = isSignup
    ? "Confirm your email to start using CLEAR."
    : "Here's your secure link to sign in to CLEAR.";
  const cta = isSignup ? "Confirm email" : "Sign in to CLEAR";

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;color:#1c1917">
    <p style="font-weight:600;font-size:18px;margin:0 0 16px">CLEAR</p>
    <p>${heading}</p>
    <p>No password needed — just tap the button below. This link is personal to you and expires shortly, so use it soon.</p>
    <p style="margin:24px 0">
      <a href="${link}" style="background:#0f766e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">${cta}</a>
    </p>
    <p style="color:#78716c;font-size:13px">If you didn't request this, you can safely ignore this email. If the button doesn't work, paste this into your browser:<br>${escapeHtml(link)}</p>
  </div>`;

  const text = `${heading}\n\nNo password needed — open your personal link (it expires shortly):\n${link}\n\nIf you didn't request this, you can safely ignore this email.`;

  return { subject, html, text };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return hookError(405, "Method not allowed");
  if (!HOOK_SECRET) return hookError(500, "SEND_EMAIL_HOOK_SECRET is not set");

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  let user: { email: string };
  let email_data: EmailData;
  try {
    const verified = new Webhook(HOOK_SECRET).verify(payload, headers) as {
      user: { email: string };
      email_data: EmailData;
    };
    user = verified.user;
    email_data = verified.email_data;
  } catch (_e) {
    // Bad / missing signature: someone other than Supabase Auth called us.
    return hookError(401, "Invalid signature");
  }

  try {
    await sendBrevoEmail({
      to: user.email,
      fromName: "CLEAR",
      ...magicLinkEmail(email_data),
    });
  } catch (e) {
    // Surface the failure so Supabase reports the email as undeliverable.
    return hookError(500, (e as Error).message);
  }

  return json({}, 200);
});
