import { useQuery } from "@tanstack/react-query";
import { getUsageSummary } from "@/lib/db";
import { qk } from "@/lib/query-keys";
import { useAuth } from "@/hooks/useAuth";

/**
 * The workspace's usage position (tier, report credits, free-run count) for the
 * Dashboard strip and the header credit pill. Unlike useProjects this is also
 * mounted OUTSIDE ProtectedRoute (ProductLayout renders on public, prerendered
 * pages), so the `enabled` gate is load-bearing: no session → no fetch.
 */
export function useUsage() {
  const { session } = useAuth();
  return useQuery({
    queryKey: qk.usage(),
    queryFn: getUsageSummary,
    enabled: Boolean(session),
  });
}
