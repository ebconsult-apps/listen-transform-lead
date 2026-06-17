import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import SEO from "@/components/SEO";
import { listProjects, type Project } from "@/lib/db";
import type { ProjectStatus } from "@/lib/clear/types";
import { toast } from "sonner";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: "Draft",
  running: "Running…",
  clarify_ready: "Clarify — review",
  clarify_approved: "Clarify approved",
  teaser_ready: "Teaser ready",
  paid: "Unlocked",
  full_ready: "Full report ready",
  experiment_design: "Designing experiments",
  experiment_active: "Experiments running",
  error: "Error",
};

const STATUS_CLASS: Record<ProjectStatus, string> = {
  draft: "bg-secondary text-foreground/60",
  running: "bg-primary/10 text-primary",
  clarify_ready: "bg-[hsl(var(--phase-c))]/15 text-[hsl(var(--phase-c))]",
  clarify_approved: "bg-[hsl(var(--phase-c))]/15 text-[hsl(var(--phase-c))]",
  teaser_ready: "bg-[hsl(var(--phase-l))]/15 text-[hsl(var(--phase-l))]",
  paid: "bg-[hsl(var(--phase-c))]/15 text-[hsl(var(--phase-c))]",
  full_ready: "bg-[hsl(var(--phase-c))]/15 text-[hsl(var(--phase-c))]",
  experiment_design: "bg-[hsl(var(--phase-e))]/15 text-[hsl(var(--phase-e))]",
  experiment_active: "bg-[hsl(var(--phase-e))]/15 text-[hsl(var(--phase-e))]",
  error: "bg-destructive/10 text-destructive",
};

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Dashboard — CLEAR" description="Your CLEAR projects." path="/app" noindex />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg">Your projects</h1>
          <p className="body-md">Each project runs a Clarify + Leverage analysis.</p>
        </div>
        <Link to="/app/projects/new" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> New project
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse text-foreground/50">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h2 className="heading-md mb-2">No projects yet</h2>
          <p className="body-md mb-6">Create your first project to get a CLEAR analysis.</p>
          <Link to="/app/projects/new" className="btn-primary">
            <Plus className="mr-2 h-4 w-4" /> New project
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/app/projects/${p.id}`}
              className="glass-card p-5 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{p.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_CLASS[p.status]}`}
                >
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <p className="text-sm text-foreground/50 mt-2">
                {p.use_case ? p.use_case.replace(/_/g, " ") : "—"} ·{" "}
                {new Date(p.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
