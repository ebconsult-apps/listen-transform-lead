// Brevo transactional email. Reuses the marketing site's existing, already-verified
// sender (erik@eb-consulting.se) so no new DNS / sender verification is needed.
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const SENDER = { name: "Erik Bohjort", email: "erik@eb-consulting.se" };

export async function sendBrevoEmail(opts: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  if (!BREVO_API_KEY) throw new Error("BREVO_API_KEY is not set on the edge function");
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: opts.to, name: opts.toName ?? opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
      textContent: opts.text,
    }),
  });
  if (!res.ok) {
    throw new Error(`Brevo send failed (${res.status}): ${await res.text()}`);
  }
}
