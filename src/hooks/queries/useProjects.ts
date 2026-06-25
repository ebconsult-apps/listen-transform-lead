import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/lib/db";
import { qk } from "@/lib/query-keys";

/**
 * The owner's project list (Dashboard). Replaces the hand-rolled
 * useState/useEffect/load() with a cached query. RLS scopes the rows
 * server-side, and the dev-bypass guard inside listProjects() routes to the
 * in-memory mock store transparently. Mounted only inside ProtectedRoute, so a
 * session is guaranteed — no extra `enabled` guard needed.
 */
export function useProjects() {
  return useQuery({
    queryKey: qk.projects(),
    queryFn: listProjects,
  });
}
