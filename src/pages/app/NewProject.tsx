import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Upload } from "lucide-react";
import SEO from "@/components/SEO";
import DictationButton from "@/components/DictationButton";
import PrepPromptCard from "@/components/product/PrepPromptCard";
import PrivacyPolicyDialog from "@/components/product/PrivacyPolicyDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PRIVACY_POLICY_VERSION } from "@/content/privacy-policy";
import { requireSupabase } from "@/lib/supabase";
import { getMyWorkspace, getMyProfile, recordPrivacyAcceptance } from "@/lib/db";
import { extractText } from "@/lib/extract-text";
import { useAuth } from "@/hooks/useAuth";
import { devActive } from "@/lib/dev/config";
import * as mockStore from "@/lib/dev/mock-store";
import { toast } from "sonner";

const DEV_CAP = import.meta.env.DEV || __DEV_BYPASS__;
const TARGET_GROUPS = ["customers", "citizens", "tenants", "employees", "other"];
const USE_CASES = ["churn", "onboarding", "compliance", "policy_uptake", "other"];
const ACCEPT = ".pdf,.docx,.xlsx,.md,.txt,.csv";
const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

/** Append a dictated segment to existing text without clobbering what's typed. */
function appendTranscript(prev: string, addition: string): string {
  const add = addition.trim();
  if (!add) return prev;
  if (!prev) return add;
  return /\s$/.test(prev) ? prev + add : `${prev} ${add}`;
}

const NewProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [challenge, setChallenge] = useState("");
  const [timeline, setTimeline] = useState("");
  const [targetGroup, setTargetGroup] = useState("customers");
  const [useCase, setUseCase] = useState("churn");
  const [stakeholders, setStakeholders] = useState([{ name: "", role: "" }]);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  // Privacy Policy acceptance — recorded once per account, so the checkbox shows
  // only until the user has accepted; after that, creation proceeds without it.
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [alreadyAccepted, setAlreadyAccepted] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((p) => {
        if (active) setAlreadyAccepted(!!p?.privacy_accepted_at);
      })
      .catch(() => {
        // Best-effort: if the profile can't be read, fall back to asking for consent.
      })
      .finally(() => {
        if (active) setProfileLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const addStakeholder = () => setStakeholders((s) => [...s, { name: "", role: "" }]);
  const removeStakeholder = (i: number) =>
    setStakeholders((s) => s.filter((_, idx) => idx !== i));
  const updateStakeholder = (i: number, field: "name" | "role", value: string) =>
    setStakeholders((s) => s.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, MAX_FILES);
    const total = next.reduce((sum, f) => sum + f.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      toast.error("Total upload exceeds 50 MB.");
      return;
    }
    setFiles(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (DEV_CAP && devActive()) {
        // Mock mode: create the project in-memory, skip storage upload + extract.
        const id = mockStore.createProject({
          name,
          targetGroup,
          useCase,
          challenge,
          stakeholders,
          timeline: timeline || null,
          documents: files.map((f) => ({ filename: f.name, mime: f.type || null, bytes: f.size })),
        });
        navigate(`/app/projects/${id}`);
        return;
      }

      const sb = requireSupabase();
      const ws = await getMyWorkspace();

      const { data: project, error: pErr } = await sb
        .from("projects")
        .insert({
          workspace_id: ws.id,
          name: name || "Untitled project",
          target_group: targetGroup,
          use_case: useCase,
          status: "draft",
          created_by: user!.id,
        })
        .select()
        .single();
      if (pErr) throw pErr;

      // Record Privacy Policy acceptance the first time, tied to a real creation.
      if (!alreadyAccepted) {
        await recordPrivacyAcceptance(PRIVACY_POLICY_VERSION);
      }

      const { error: iErr } = await sb.from("project_inputs").insert({
        project_id: project.id,
        challenge,
        stakeholders: stakeholders.filter((s) => s.role.trim()),
        timeline: timeline || null,
      });
      if (iErr) throw iErr;

      for (const file of files) {
        // Supabase Storage keys reject non-ASCII characters (e.g. "förändra"),
        // so transliterate accents and replace anything else with "_". The real
        // filename is preserved in documents.filename below for display.
        const safeName =
          file.name
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9.\-_]/g, "_")
            .replace(/_{2,}/g, "_")
            .replace(/^_+|_+$/g, "") || "file";
        const path = `${ws.id}/${project.id}/${crypto.randomUUID()}-${safeName}`;
        const { error: upErr } = await sb.storage.from("documents").upload(path, file);
        if (upErr) throw upErr;
        // Extract text so the analysis can actually read the file. Best-effort:
        // a failed/unsupported file just contributes no text, never blocks the run.
        const extracted = await extractText(file);
        if (!extracted) toast.warning(`Couldn't read text from ${file.name}.`);
        const { error: dErr } = await sb.from("documents").insert({
          project_id: project.id,
          storage_path: path,
          filename: file.name,
          mime: file.type || null,
          bytes: file.size,
          extracted_text: extracted,
          status: "uploaded",
        });
        if (dErr) throw dErr;
      }

      navigate(`/app/projects/${project.id}`);
    } catch (err) {
      toast.error((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="New project: CLEAR" description="Create a new CLEAR analysis." path="/app/projects/new" noindex />
      <h1 className="heading-lg mb-6">New project</h1>

      <form onSubmit={submit} className="space-y-6">
        <Field label="Project name" htmlFor="np-name">
          <input id="np-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Reduce trial churn" />
        </Field>

        <Field label="The behavior-change challenge" hint="What behavior do you want to move, and why?" htmlFor="np-challenge">
          <textarea
            id="np-challenge"
            required
            rows={5}
            className="input"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Describe the challenge, the group, and what success looks like. Type, or tap Dictate to speak…"
          />
          <div className="mt-2">
            <DictationButton
              onResult={(text) => setChallenge((c) => appendTranscript(c, text))}
            />
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Target group" htmlFor="np-target">
            <select id="np-target" className="input" value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)}>
              {TARGET_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Use case" htmlFor="np-usecase">
            <select id="np-usecase" className="input" value={useCase} onChange={(e) => setUseCase(e.target.value)}>
              {USE_CASES.map((u) => (
                <option key={u} value={u}>{u.replace(/_/g, " ")}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Timeline" hint="Optional" htmlFor="np-timeline">
          <input id="np-timeline" className="input" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. Pilot within one quarter" />
        </Field>

        <div>
          <span className="block text-sm font-medium mb-2">Stakeholders</span>
          <div className="space-y-2">
            {stakeholders.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  aria-label={`Stakeholder ${i + 1} name`}
                  className="input"
                  placeholder="Name (optional)"
                  value={s.name}
                  onChange={(e) => updateStakeholder(i, "name", e.target.value)}
                />
                <input
                  aria-label={`Stakeholder ${i + 1} role`}
                  className="input"
                  placeholder="Role"
                  value={s.role}
                  onChange={(e) => updateStakeholder(i, "role", e.target.value)}
                />
                {stakeholders.length > 1 && (
                  <button type="button" onClick={() => removeStakeholder(i)} className="px-2 text-foreground/40 hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addStakeholder} className="mt-2 text-sm text-primary hover:underline inline-flex items-center">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add stakeholder
          </button>
        </div>

        {challenge.trim() && (
          <PrepPromptCard
            variant="owner"
            ctx={{
              challenge,
              stakeholders: stakeholders.filter((s) => s.role.trim()),
              timeline: timeline || undefined,
              targetGroup,
              useCase,
            }}
          />
        )}

        <div>
          <span className="block text-sm font-medium mb-2">
            Documents <span className="text-foreground/40 font-normal">(PDF/DOCX/XLSX/MD/TXT/CSV, ≤10 files / 50 MB)</span>
          </span>
          <label className="glass-card border-dashed border-2 border-border flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-6 w-6 text-foreground/40 mb-2" />
            <span className="text-sm text-foreground/60">Click to add files</span>
            <input type="file" multiple accept={ACCEPT} aria-label="Add documents" className="hidden" onChange={(e) => onFiles(e.target.files)} />
          </label>
          {files.length > 0 && (
            <ul className="mt-3 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2">
                  <span className="truncate">{f.name}</span>
                  <button type="button" onClick={() => setFiles((fs) => fs.filter((_, idx) => idx !== i))} className="text-foreground/40 hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {profileLoaded && !alreadyAccepted && (
          <div className="flex items-start gap-3 text-sm">
            <Checkbox
              id="privacy-accept"
              checked={agreeChecked}
              onCheckedChange={(v) => setAgreeChecked(v === true)}
              className="mt-0.5"
            />
            <label htmlFor="privacy-accept" className="text-foreground/80 cursor-pointer select-none">
              I have read and accept the{" "}
              <button
                type="button"
                onClick={() => setPolicyOpen(true)}
                className="text-primary underline hover:no-underline"
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || (!alreadyAccepted && !agreeChecked)}
          className="btn-primary w-full"
        >
          {saving ? "Creating…" : "Create project"}
        </button>
      </form>

      <PrivacyPolicyDialog open={policyOpen} onOpenChange={setPolicyOpen} />
    </div>
  );
};

const Field = ({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-2">
      {label} {hint && <span className="text-foreground/40 font-normal">({hint})</span>}
    </label>
    {children}
  </div>
);

export default NewProject;
