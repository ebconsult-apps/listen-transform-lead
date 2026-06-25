/**
 * Floating dev/QA control panel + a persistent "mock data" banner. Rendered only
 * when DEV_ACCESS_ENABLED (gated again in App.tsx so it never mounts in prod).
 *
 * It lets you enter/exit the fully-mocked mode, pick a seeded dataset, flip the
 * AI stub/live toggle, and jump into the app from a logged-out state — the whole
 * self-serve product becomes walkable with no backend, login, or Stripe.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  DEV_ACCESS_ENABLED,
  type DatasetId,
  enterDevMode,
  exitDevMode,
  setDevAiMode,
  setDevDataset,
  useDevState,
} from "@/lib/dev/config";
import { resetMockDb } from "@/lib/dev/mock-store";

export default function DevPanel() {
  const dev = useDevState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!DEV_ACCESS_ENABLED) return null;

  // Quick-links auto-enter dev mode so one click takes you into the app.
  const go = (path: string) => {
    if (!dev.active) enterDevMode();
    setOpen(false);
    navigate(path);
  };

  const changeDataset = (id: DatasetId) => {
    resetMockDb(id);
    setDevDataset(id);
    if (!dev.active) enterDevMode(id);
    navigate("/app");
  };

  return (
    <>
      {dev.active && (
        <div className="no-print fixed inset-x-0 top-0 z-[100] flex justify-center pointer-events-none">
          <div className="rounded-b-md bg-amber-500 px-3 py-1 text-[11px] font-semibold tracking-wide text-black shadow">
            DEV / QA MODE — mock data · {dev.dataset} · AI: {dev.aiMode}
          </div>
        </div>
      )}

      <div className="no-print fixed bottom-4 right-4 z-[100]">
        {open ? (
          <div className="w-72 space-y-4 rounded-xl border border-border bg-background p-4 text-sm shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <FlaskConical className="h-4 w-4 text-amber-500" /> Dev / QA mode
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-foreground/40 hover:text-foreground"
                aria-label="Close dev panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                Mock mode
                {dev.active && <Badge variant="secondary">on</Badge>}
              </span>
              <Switch
                checked={dev.active}
                onCheckedChange={(v) => (v ? enterDevMode() : exitDevMode())}
              />
            </label>

            <div className="space-y-1.5">
              <span className="text-foreground/60">Dataset</span>
              <Select value={dev.dataset} onValueChange={(v) => changeDataset(v as DatasetId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seeded">Seeded (all states)</SelectItem>
                  <SelectItem value="empty">Empty dashboard</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => changeDataset(dev.dataset)}
                className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" /> Reset data
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center justify-between">
                <span>AI: live</span>
                <Switch
                  checked={dev.aiMode === "live"}
                  disabled={!isSupabaseConfigured}
                  onCheckedChange={(v) => setDevAiMode(v ? "live" : "stub")}
                />
              </label>
              <p className="text-[11px] leading-snug text-foreground/45">
                Mock mode is stub-only. Live AI needs a real login (the mock session can't call the
                edge function) — runs will error otherwise.
              </p>
            </div>

            <div className="space-y-1.5 border-t border-border pt-3">
              <span className="text-foreground/60">Open</span>
              <div className="grid gap-1.5">
                <Button variant="secondary" size="sm" onClick={() => go("/app")}>
                  Dashboard
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => go("/app/projects/proj-full")}
                >
                  Full report (unlocked)
                </Button>
                <Button variant="secondary" size="sm" onClick={() => go("/app/projects/new")}>
                  New project
                </Button>
              </div>
            </div>

            {dev.active && (
              <Button variant="ghost" size="sm" className="w-full" onClick={() => exitDevMode()}>
                Exit dev mode
              </Button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-2 text-xs font-semibold text-black shadow-lg hover:bg-amber-400"
          >
            <FlaskConical className="h-4 w-4" /> DEV
          </button>
        )}
      </div>
    </>
  );
}
