// One-time CLEAR Stripe setup. Creates the subscription + one-off prices and the
// webhook endpoint via the Stripe API, then prints the env values to set — so you
// don't have to click through the dashboard. Your key stays on your machine.
//
// Node 18+ (uses global fetch), no dependencies. Run in TEST MODE first:
//
//   STRIPE_SECRET_KEY=sk_test_... \
//   WEBHOOK_URL=https://<project-ref>.supabase.co/functions/v1/stripe-webhook \
//   node scripts/stripe-setup.mjs
//
// CURRENCY defaults to EUR — the prices the app displays (src/config/billing.ts)
// are in EUR, so the charge must be too. Override with CURRENCY=usd only for a
// legacy USD test account.
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
const CURRENCY = (process.env.CURRENCY || "eur").toLowerCase();
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

// Amounts are in the smallest currency unit (cents). Source of truth for the
// ladder: src/config/billing.ts + docs/research/self-serve-pricing.md (launch
// experiment: Solo €79 / Team €249 / Report Pass €99). Lookup keys embed the
// amount because ensurePrice REUSES an existing price by lookup_key — the old
// keys (clear_solo @ 49, clear_team @ 299, clear_unlock @ 200) would silently
// keep their old amounts. New numbers → new lookup key.
// The public $999 Business tier is retired (legacy subscribers keep it); no
// Business price is created for new setups.
const plans = [
  { name: "CLEAR Solo", lookup: "clear_solo_7900", amount: 7900, recurring: true },
  { name: "CLEAR Team", lookup: "clear_team_24900", amount: 24900, recurring: true },
  { name: "CLEAR Report Pass", lookup: "clear_pass_9900", amount: 9900, recurring: false },
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
STRIPE_PRICE_SOLO=${id.clear_solo_7900}
STRIPE_PRICE_TEAM=${id.clear_team_24900}
# STRIPE_PRICE_BUSINESS: retired tier — only keep an existing value for legacy subscribers.${wh.secret ? `
STRIPE_WEBHOOK_SECRET=${wh.secret}` : `
# (reused endpoint — copy STRIPE_WEBHOOK_SECRET from the dashboard)`}

=== GitHub → Settings → Secrets and variables → Actions → Variables ===
VITE_STRIPE_PRICE_SOLO=${id.clear_solo_7900}
VITE_STRIPE_PRICE_TEAM=${id.clear_team_24900}
VITE_STRIPE_PRICE_UNLOCK=${id.clear_pass_9900}
# also set VITE_STRIPE_PUBLISHABLE_KEY and VITE_BILLING_ENABLED=true
`);
