// POST /track   (public, verify_jwt=false — anonymous, cookieless site analytics)
//
// The marketing site mirrors every GA4 event into analytics_events through this
// function (see src/utils/analytics.ts → sendFirstParty). Body:
//   { event: "whitepaper_gate_view", props: { whitepaper_id, placement }, path, referrer }
//
// What gets stored: event name, validated scalar props, the path without query
// string, the referrer's host, a derived acquisition source (chatgpt / claude /
// perplexity / google / ...), a coarse device class, and a pseudonymous daily
// visitor key. The IP address is used only to derive that key and is never
// written. Data model + rationale: migrations/20260913120000_analytics_events.sql.
import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders } from "../_shared/cors.ts";
import { safeErrorMessage } from "../_shared/errors.ts";
import {
  PRUNE_PROBABILITY,
  classifySource,
  clientIp,
  deviceType,
  parseTrackPayload,
  referrerHost,
  visitorHash,
} from "../_shared/analytics/track.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Set ANALYTICS_SALT (any long random string) so the visitor key's salt is
// independent of other secrets; until then the service-role key is hashed in.
const SALT = Deno.env.get("ANALYTICS_SALT") ?? SERVICE_KEY;
const SITE_HOST = Deno.env.get("ANALYTICS_SITE_HOST") ?? "clear-framework.com";
const MAX_BODY_BYTES = 8 * 1024;

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function empty(status: number): Response {
  return new Response(null, { status, headers: corsHeaders });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return empty(405);

  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return empty(413);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return empty(400);
    }
    const payload = parseTrackPayload(parsed);
    if (!payload) return empty(400);

    const userAgent = req.headers.get("user-agent") ?? "";
    const host = referrerHost(payload.referrer);
    const source = classifySource(host, userAgent, SITE_HOST);
    const device = deviceType(userAgent);
    const visitor = await visitorHash(clientIp(req.headers), userAgent, SALT);

    const { error } = await admin.from("analytics_events").insert({
      event: payload.event,
      props: payload.props,
      path: payload.path,
      referrer_host: host,
      source,
      device,
      visitor_hash: visitor,
    });
    if (error) throw error;

    // Cheap, scheduler-free retention: prune on a small fraction of requests.
    if (Math.random() < PRUNE_PROBABILITY) {
      const { error: pruneError } = await admin.rpc("analytics_prune");
      if (pruneError) console.error("track: prune failed", pruneError);
    }

    return empty(204);
  } catch (err) {
    // Analytics must never take the site down with it; the client ignores the
    // response. Log for diagnosis and answer with a generic 500.
    const message = safeErrorMessage(err, "track");
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
