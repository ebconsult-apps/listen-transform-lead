import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import {
  getEntitlement,
  getCreditUsage,
  getMyProfile,
  getMyWorkspace,
  updateMyProfile,
  type CreditUsage,
  type Entitlement,
  type Profile,
} from "@/lib/db";
import { LoadingState, ErrorState } from "@/components/ui/data-states";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTACT_EMAIL } from "@/config/site";
import { toast } from "sonner";

const SUPPORT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("CLEAR support")}`;

const Account = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [credit, setCredit] = useState<CreditUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Display name
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getMyProfile(),
      getMyWorkspace().then((ws) => Promise.all([getEntitlement(ws.id), getCreditUsage(ws.id)])),
    ])
      .then(([prof, [ent, usage]]) => {
        if (cancelled) return;
        setProfile(prof);
        setEntitlement(ent);
        setCredit(usage);
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

  const tier = entitlement?.tier ?? "free";
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

          {/* Subscription (summary; full management lives in Billing) */}
          <div className="glass-card p-8">
            <h2 className="heading-md mb-4">Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/50">Current plan</p>
                <p className="text-2xl font-bold capitalize">{tier}</p>
              </div>
              <span className={`tag ${tier !== "free" ? "" : "opacity-60"}`}>
                {entitlement?.status ?? "active"}
              </span>
            </div>
            {entitlement?.current_period_end && (
              <p className="text-sm text-foreground/60 mt-4">
                Renews {new Date(entitlement.current_period_end).toLocaleDateString()}.
              </p>
            )}
            {tier !== "free" && credit && (
              <p className="text-sm text-foreground/60 mt-2">
                {credit.remaining} of {credit.allotment} report credits left this month.
              </p>
            )}
            <Link
              to="/account/billing"
              className="inline-block text-sm text-primary hover:underline mt-4"
            >
              Manage billing →
            </Link>
          </div>

          {/* Help & support — always reachable while signed in (no ticket system) */}
          <div className="glass-card p-8">
            <h2 className="heading-md mb-4">Help &amp; support</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">How long does a report take?</dt>
                <dd className="text-foreground/70 mt-1">
                  Clarify returns in about a minute. The full Leverage report usually finishes in
                  30–60 seconds once you unlock it — you can keep the tab open while it builds.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">What if a run fails?</dt>
                <dd className="text-foreground/70 mt-1">
                  Re-run the phase from the project page — nothing is charged for a failed run, and
                  your inputs are saved. If it keeps failing, email us the project name and we&rsquo;ll
                  look into it.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">How do refunds and cancellations work?</dt>
                <dd className="text-foreground/70 mt-1">
                  Cancel anytime from{" "}
                  <Link to="/account/billing" className="text-primary hover:underline">
                    billing
                  </Link>
                  ; see the{" "}
                  <Link to="/refund" className="text-primary hover:underline">
                    Refund &amp; Cancellation Policy
                  </Link>{" "}
                  for the full details.
                </dd>
              </div>
            </dl>
            <a href={SUPPORT_MAILTO} className="btn-secondary inline-flex mt-6">
              Email support
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
