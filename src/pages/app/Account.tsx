import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import {
  getEntitlement,
  getMyProfile,
  getMyWorkspace,
  updateMyProfile,
  type Entitlement,
  type Profile,
} from "@/lib/db";
import { changePassword } from "@/lib/account";
import { openBillingPortal, startCheckout } from "@/lib/billing";
import { BILLING_ENABLED, PLANS, PRICE_IDS } from "@/config/billing";
import { LoadingState, ErrorState } from "@/components/ui/data-states";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const MIN_PASSWORD = 8;

type PaidTier = "solo" | "team" | "business";

const Account = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Display name
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Password
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // Subscription
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getMyProfile(),
      getMyWorkspace().then((ws) => getEntitlement(ws.id)),
    ])
      .then(([prof, ent]) => {
        if (cancelled) return;
        setProfile(prof);
        setEntitlement(ent);
        setName(prof?.full_name ?? "");
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const saveName = async () => {
    const next = name.trim();
    setSavingName(true);
    try {
      await updateMyProfile({ full_name: next });
      setProfile((p) => (p ? { ...p, full_name: next } : p));
      toast.success("Display name updated.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async () => {
    if (pw1.length < MIN_PASSWORD) {
      toast.error(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (pw1 !== pw2) {
      toast.error("Passwords don't match.");
      return;
    }
    setSavingPw(true);
    try {
      await changePassword(pw1);
      setPw1("");
      setPw2("");
      toast.success("Password updated.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSavingPw(false);
    }
  };

  const portal = async () => {
    try {
      await openBillingPortal();
    } catch {
      toast.error("Couldn't open the billing portal. Is Stripe configured?");
    }
  };

  const subscribe = async (planId: PaidTier) => {
    const priceId = PRICE_IDS[planId];
    if (!BILLING_ENABLED || !priceId) {
      toast.error("Billing isn't configured yet.");
      return;
    }
    setBusy(true);
    try {
      await startCheckout({ mode: "subscription", priceId, tier: planId });
    } catch {
      toast.error("Couldn't start checkout. Is the stripe-checkout function deployed?");
      setBusy(false);
    }
  };

  const tier = entitlement?.tier ?? "free";
  const isPaid = tier !== "free";
  const paidPlans = PLANS.filter((p) => p.id !== "free" && p.id !== "enterprise");
  const joined = profile?.created_at ?? user?.created_at;
  const nameUnchanged = name.trim() === (profile?.full_name ?? "");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Account: CLEAR" description="Manage your CLEAR account." path="/account" noindex />
      <Link
        to="/app"
        className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to projects
      </Link>
      <h1 className="heading-lg mb-6">Account</h1>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : (
        <div className="space-y-6">
          {/* Profile */}
          <div className="glass-card p-8">
            <h2 className="heading-md mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground/60">Email</Label>
                <p className="mt-1">{user?.email}</p>
              </div>
              <div>
                <Label htmlFor="displayName">Display name</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="displayName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName || nameUnchanged}
                    className="btn-primary shrink-0 disabled:opacity-50"
                  >
                    {savingName ? "…" : "Save"}
                  </button>
                </div>
              </div>
              {joined && (
                <div>
                  <Label className="text-foreground/60">Joined</Label>
                  <p className="mt-1">{new Date(joined).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="glass-card p-8">
            <h2 className="heading-md mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pw1">New password</Label>
                <Input
                  id="pw1"
                  type="password"
                  autoComplete="new-password"
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pw2">Confirm new password</Label>
                <Input
                  id="pw2"
                  type="password"
                  autoComplete="new-password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  className="mt-1"
                />
              </div>
              <button
                onClick={savePassword}
                disabled={savingPw || !pw1 || !pw2}
                className="btn-primary disabled:opacity-50"
              >
                {savingPw ? "…" : "Update password"}
              </button>
            </div>
          </div>

          {/* Subscription & billing */}
          <div className="glass-card p-8">
            <h2 className="heading-md mb-4">Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/50">Current plan</p>
                <p className="text-2xl font-bold capitalize">{tier}</p>
              </div>
              <span className={`tag ${isPaid ? "" : "opacity-60"}`}>
                {entitlement?.status ?? "active"}
              </span>
            </div>

            {entitlement?.current_period_end && (
              <p className="text-sm text-foreground/60 mt-4">
                Renews {new Date(entitlement.current_period_end).toLocaleDateString()}.
              </p>
            )}

            {isPaid && (
              <div className="mt-6">
                <button onClick={portal} className="btn-primary">
                  Manage subscription
                </button>
                <p className="text-sm text-foreground/50 mt-3">
                  Invoices, receipts, and payment methods are available in the billing portal.
                </p>
              </div>
            )}
          </div>

          {/* Free users: subscribe inline (the actual subscription checkout). */}
          {!isPaid && (
            <div className="glass-card p-8">
              <h2 className="heading-md mb-1">Subscribe</h2>
              <p className="body-md mb-6">
                Unlock full reports across your projects. Or grab a one-off unlock from any
                project's paywall.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {paidPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-border rounded-xl p-4 flex flex-col"
                  >
                    <p className="font-semibold">{plan.name}</p>
                    <p className="text-2xl font-bold mt-1 mb-3">
                      {plan.price}
                      <span className="text-sm font-normal text-foreground/50"> {plan.cadence}</span>
                    </p>
                    <button
                      onClick={() => subscribe(plan.id as PaidTier)}
                      disabled={busy || !PRICE_IDS[plan.id as PaidTier]}
                      className="btn-primary w-full mt-auto disabled:opacity-50"
                    >
                      {busy ? "…" : "Subscribe"}
                    </button>
                  </div>
                ))}
              </div>
              <Link
                to="/pricing"
                className="inline-block text-sm text-primary hover:underline mt-4"
              >
                Compare plans →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;
