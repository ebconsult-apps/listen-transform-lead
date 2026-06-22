// One-time CLEAR Stripe setup. Creates the subscription + one-off prices and the
// webhook endpoint via the Stripe API, then prints the env values to set — so you
// don't have to click through the dashboard. Your key stays on your machine.
//
// Node 18+ (uses global fetch), no dependencies. Run in TEST MODE first:
//
//   STRIPE_SECRET_KEY=sk_test_... \
//   WEBHOOK_URL=https://<project-ref>.supabase.co/functions/v1/stripe-webhook \
//   CURRENCY=usd  node scripts/stripe-setup.mjs
//
// Then paste the printed values into `supabase secrets set …` and the GitHub
// Actions → Variables (VITE_*), set VITE_BILLING_ENABLED=true, and test with card
// 4242 4242 4242 4242. Re-run with a live key (sk_live_…) only when you're ready.
//
// Idempotent on prices (matched by lookup_key). The webhook endpoint is reused if
// one already exists for the URL — but Stripe only returns the signing secret on
// first creation, so for a fresh secret delete the old endpoint first.

const KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const CURRENCY = (process.env.CURRENCY || "usd").toLowerCase();
const LIVE = KEY?.startsWith("sk_live_");

if (!KEY || (!KEY.startsWith("sk_test_") && !LIVE)) {
  console.error("Set STRIPE_SECRET_KEY to a Stripe secret key (sk_test_… recommended first).");
  process.exit(1);
}
if (!WEBHOOK_URL) {
  console.error("Set WEBHOOK_URL to your deployed stripe-webhook URL (…/functions/v1/stripe-webhook).");
  process.exit(1);
}
if (LIVE) console.warn("⚠  Using a LIVE key — this creates real products/prices. Ctrl-C now if unintended.\n");

async function stripe(path, params, method = "POST") {
  const body = new URLSearchParams();
  const add = (k, v) => v != null && body.append(k, String(v));
  for (const [k, v] of Object.entries(params || {})) {
    Array.isArray(v) ? v.forEach((x, i) => add(`${k}[${i}]`, x)) : add(k, v);
  }
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: method === "GET" ? undefined : body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${path}: ${json.error?.message || res.status}`);
  return json;
}

async function ensurePrice({ name, lookup, amount, recurring }) {
  const found = (await stripe(`prices?lookup_keys[0]=${lookup}&limit=1`, null, "GET")).data?.[0];
  if (found) {
    console.log(`reuse  ${lookup} -> ${found.id}`);
    return found.id;
  }
  const product = await stripe("products", { name, "metadata[app]": "clear" });
  const params = { product: product.id, unit_amount: amount, currency: CURRENCY, lookup_key: lookup };
  if (recurring) params["recurring[interval]"] = "month";
  const price = await stripe("prices", params);
  console.log(`create ${lookup} -> ${price.id}`);
  return price.id;
}

// Amounts are in the smallest currency unit (cents). Adjust to your real pricing.
const plans = [
  { name: "CLEAR Solo", lookup: "clear_solo", amount: 4900, recurring: true },
  { name: "CLEAR Team", lookup: "clear_team", amount: 29900, recurring: true },
  { name: "CLEAR Business", lookup: "clear_business", amount: 99900, recurring: true },
  { name: "CLEAR — single report unlock", lookup: "clear_unlock", amount: 20000, recurring: false },
];

const id = {};
for (const pl of plans) id[pl.lookup] = await ensurePrice(pl);

const events = [
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];
const dupe = (await stripe("webhook_endpoints?limit=100", null, "GET")).data.find((w) => w.url === WEBHOOK_URL);
if (dupe) console.log(`\n⚠  A webhook for this URL already exists (${dupe.id}); reusing it. Delete it first if you need a fresh signing secret.`);
const wh = dupe || (await stripe("webhook_endpoints", { url: WEBHOOK_URL, enabled_events: events }));
console.log(`webhook -> ${wh.id}`);

console.log(`
=== supabase secrets set … (edge function secrets) ===
STRIPE_PRICE_SOLO=${id.clear_solo}
STRIPE_PRICE_TEAM=${id.clear_team}
STRIPE_PRICE_BUSINESS=${id.clear_business}${wh.secret ? `
STRIPE_WEBHOOK_SECRET=${wh.secret}` : `
# (reused endpoint — copy STRIPE_WEBHOOK_SECRET from the dashboard)`}

=== GitHub → Settings → Secrets and variables → Actions → Variables ===
VITE_STRIPE_PRICE_SOLO=${id.clear_solo}
VITE_STRIPE_PRICE_TEAM=${id.clear_team}
VITE_STRIPE_PRICE_BUSINESS=${id.clear_business}
VITE_STRIPE_PRICE_UNLOCK=${id.clear_unlock}
# also set VITE_STRIPE_PUBLISHABLE_KEY and VITE_BILLING_ENABLED=true
`);
