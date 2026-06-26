/**
 * Central query-key factory for react-query. One source of truth so a query and
 * its invalidation can never drift apart (a typo'd raw array would silently fail
 * to invalidate).
 *
 * Tier 11 is a pilot and wires only the two keys its surfaces need. As later
 * tiers adopt react-query, extend this object rather than scattering raw key
 * arrays — the intended namespace for the fast-follows:
 *   project:         (id)        => ["project", id]
 *   projectInput:    (id)        => ["projectInput", id]
 *   runs:            (projectId) => ["runs", projectId]
 *   clarifyApproval: (projectId) => ["clarifyApproval", projectId]
 *   entitlement:     (wsId)      => ["entitlement", wsId]
 *   invitations / contributions / reactions: (projectId) => [name, projectId]
 *   findings / questions:                    (projectId) => [name, projectId]
 *   experimentDesign / candidates / testCards: (projectId) => [name, projectId]
 *   respondent:      (token)     => ["respondent", token]
 */
export const qk = {
  projects: () => ["projects"] as const,
  assumptionGaps: (projectId: string) => ["assumptionGaps", projectId] as const,
  findings: (projectId: string) => ["findings", projectId] as const,
} as const;
