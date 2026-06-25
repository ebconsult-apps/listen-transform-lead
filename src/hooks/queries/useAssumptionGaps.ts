import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAssumptionGap,
  deleteAssumptionGap,
  listAssumptionGaps,
  setAssumptionGapStatus,
} from "@/lib/experiment";
import { qk } from "@/lib/query-keys";
import { toast } from "sonner";

/** Cross-phase assumptions/gaps log for one project. */
export function useAssumptionGaps(projectId: string) {
  return useQuery({
    queryKey: qk.assumptionGaps(projectId),
    queryFn: () => listAssumptionGaps(projectId),
    enabled: !!projectId,
  });
}

/**
 * The three writers all invalidate the same key (the project's gap list) and
 * reuse the toast-on-error the component had inline. Kept as separate hooks so
 * each call site gets its own `isPending` (e.g. disable Add while adding).
 */
export function useAddAssumptionGap(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (flag: Parameters<typeof addAssumptionGap>[1]) =>
      addAssumptionGap(projectId, flag),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.assumptionGaps(projectId) }),
    onError: (e) => toast.error((e as Error).message),
  });
}

export function useSetAssumptionGapStatus(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      status: Parameters<typeof setAssumptionGapStatus>[1];
    }) => setAssumptionGapStatus(vars.id, vars.status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.assumptionGaps(projectId) }),
    onError: (e) => toast.error((e as Error).message),
  });
}

export function useDeleteAssumptionGap(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAssumptionGap(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.assumptionGaps(projectId) }),
    onError: (e) => toast.error((e as Error).message),
  });
}
