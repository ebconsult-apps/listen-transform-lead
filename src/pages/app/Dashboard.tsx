import { Link } from "react-router-dom";
import { Plus, Target, Network, ClipboardList } from "lucide-react";
import SEO from "@/components/SEO";
import type { ProjectStatus } from "@/lib/clear/types";
import { LoadingState, ErrorState } from "@/components/ui/data-states";
import { useProjects } from "@/hooks/queries/useProjects";
import Pipeline from "@/components/product/Pipeline";

// What a first run actually produces — phrased to match the real Clarify/Leverage
// output so expectations land accurately the moment a project finishes.
const WHAT_YOU_GET = [
  {
    icon: Target,
    token: "--phase-c",
    title: "A measurable objective",
    body: "Clarify turns your challenge into one sharp objective with key results — baselines and targets, not vibes.",
  },
  {
    icon: Network,
    token: "--phase-l",
    title: "Your top leverage points",
    body: "Leverage maps the system and ranks the three points where action moves the number most. Free.",
  },
  {
    icon: ClipboardList,
    token: "--phase-l",
    title: "A plan you can act on",
    body: "The full report adds the COM-B barrier analysis and concrete discovery activities to run this week.",
  },
] as const;

const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: "Draft",
  running: "Running…",
  clarify_ready: "Clarify: review",
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
  const { data: projects = [], isPending, isError, error, refetch } = useProjects();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Dashboard: CLEAR" description="Your CLEAR projects." path="/app" noindex />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg">Your projects</h1>
          <p className="body-md">Each project runs a Clarify + Leverage analysis.</p>
        </div>
        <Link to="/app/projects/new" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> New project
        </Link>
      </div>

      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={(error as Error).message} onRetry={() => refetch()} />
      ) : projects.length === 0 ? (
        <div className="space-y-6">
          <div className="glass-card p-8 sm:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <span className="tag mb-4">Your first project</span>
              <h2 className="heading-lg mb-3">Turn a behavior-change challenge into a measurable plan</h2>
              <p className="body-md mb-10">
                Describe a behavior you want to move. CLEAR clarifies it into a measurable
                objective, maps the highest-leverage points to act on, and builds the full plan
                when you're ready — in minutes, not months.
              </p>
            </div>

            <Pipeline />

            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {WHAT_YOU_GET.map((item) => (
                <div key={item.title}>
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      backgroundColor: `hsl(var(${item.token}) / 0.12)`,
                      color: `hsl(var(${item.token}))`,
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-foreground/60">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold">Ready when you are</h3>
              <p className="text-sm text-foreground/60">
                Start your own, or walk through a finished example first.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link to="/app/projects/sample" className="btn-secondary justify-center">
                Walk through an example
              </Link>
              <Link to="/app/projects/new" className="btn-primary justify-center">
                <Plus className="mr-2 h-4 w-4" /> New project
              </Link>
            </div>
          </div>
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
