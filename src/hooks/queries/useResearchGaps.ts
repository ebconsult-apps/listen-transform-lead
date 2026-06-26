import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listFindings } from "@/lib/research";
import { runResearchGaps } from "@/lib/clear/run";
import { qk } from "@/lib/query-keys";
import { toast } from "sonner";

/** All research findings for one project (used to bucket findings under their gaps). */
export function useFindings(projectId: string) {
  return useQuery({
    queryKey: qk.findings(projectId),
    queryFn: () => listFindings(projectId),
    enabled: !!projectId,
  });
}

/**
 * Targeted research over one or several selected open questions (MECE). On
 * success it refreshes both the findings (new linked rows) and the gap list (so
 * a gap's derived "researched" state recomputes).
 */
export function useResearchGaps(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gapIds: string[]) => runResearchGaps(projectId, gapIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.findings(projectId) });
      queryClient.invalidateQueries({ queryKey: qk.assumptionGaps(projectId) });
    },
    onError: (e) => toast.error((e as Error).message),
  });
}
