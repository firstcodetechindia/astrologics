/**
 * Phase 7 RBAC checklist — source of truth for roles and permissions.
 *
 * Hidden nav is not enough: every admin API must call requirePermission.
 * Super Admin has all permissions. Support reads logs, not vault or finance.
 */

export const PHASE7_ROLES = ["super_admin", "support", "content", "finance"] as const;
export type Phase7Role = (typeof PHASE7_ROLES)[number];

export type Phase7Permission = {
  id: string;
  /** DPDP / least-privilege. P0 must ship with Phase 7, not as follow-up. */
  priority: "P0" | "P1";
  summary: string;
  why: string;
  defaultRoles: Phase7Role[];
};

export const PHASE7_PERMISSIONS: Phase7Permission[] = [
  {
    id: "conversation_logs:read",
    priority: "P0",
    summary:
      "Dedicated permission to open Super Admin Conversation Logs (chat transcripts / flow debug).",
    why: "DPDP. Today any logged-in Super Admin staff can read the same conversation data as vault and finance operators. Support may need logs; vault/finance operators must not get them by default. Logs are already redacted on read, but access is not scoped.",
    defaultRoles: ["super_admin", "support"],
  },
  {
    id: "conversation_logs:write",
    priority: "P1",
    summary: "Delete / export conversation log rows.",
    why: "Erasure and support exports should be explicit, not implied by read.",
    defaultRoles: ["super_admin"],
  },
  {
    id: "vault:read",
    priority: "P0",
    summary: "View integration secret metadata (never raw keys in the UI).",
    why: "Vault operators are not support. Support role must fail API checks here.",
    defaultRoles: ["super_admin"],
  },
  {
    id: "vault:rotate",
    priority: "P0",
    summary: "Paste / rotate provider secrets.",
    why: "Key material is not a support or content task.",
    defaultRoles: ["super_admin"],
  },
  {
    id: "finance:read",
    priority: "P0",
    summary: "Billing, invoices, wallets, payouts, refunds.",
    why: "Support-role staff MUST NOT open finance screens or APIs (original Phase 7 evidence).",
    defaultRoles: ["super_admin", "finance"],
  },
  {
    id: "finance:write",
    priority: "P0",
    summary: "Issue refunds, schedule payouts, change plans / GST settings.",
    why: "Money movement is Super Admin + Finance only.",
    defaultRoles: ["super_admin", "finance"],
  },
  {
    id: "content:write",
    priority: "P1",
    summary: "Blog / Learn / social queue compose (not publish secrets).",
    why: "Content role should not inherit vault or conversation logs.",
    defaultRoles: ["super_admin", "content"],
  },
  {
    id: "users:read",
    priority: "P1",
    summary: "Customer records needed for support — minimized PII, not a full account dump.",
    why: "Same DPDP minimization as conversation log redaction.",
    defaultRoles: ["super_admin", "support"],
  },
  {
    id: "staff:manage",
    priority: "P0",
    summary: "Create/list Super Admin staff and assign roles.",
    why: "Only Super Admin may mint Support/Finance/Content accounts.",
    defaultRoles: ["super_admin"],
  },
  {
    id: "audit:read",
    priority: "P0",
    summary: "Read the control-plane audit log.",
    why: "Who/when/what-changed is not a support transcript view.",
    defaultRoles: ["super_admin"],
  },
  {
    id: "ai:write",
    priority: "P0",
    summary: "Create/edit AI personas and chatbot flows.",
    why: "Prompt text is a privilege surface (persona-guard). Support reads logs; they do not edit agents.",
    defaultRoles: ["super_admin"],
  },
  {
    id: "comms:write",
    priority: "P1",
    summary: "Edit message templates, automations, and send log.",
    why: "Transactional copy is not a finance or support default.",
    defaultRoles: ["super_admin"],
  },
  {
    id: "flags:write",
    priority: "P1",
    summary: "Toggle feature flags / calculator settings.",
    why: "Product flags stay Super Admin until a Content role is explicitly granted.",
    defaultRoles: ["super_admin"],
  },
];

/** DPDP P0 — implemented in Phase 7. Keep the API gate; do not regress to requireAdmin. */
export const PHASE7_DPDP_GAP = {
  id: "conversation_logs:read",
  liveBehavior:
    "Implemented. Conversation list/events on GET /api/admin/ai require conversation_logs:read. Finance and Content receive 403. Support is allowed. Deny events are written to the audit log as rbac.deny.",
  requiredFix:
    "Do not drop this gate. Hidden nav is not sufficient — API 403 is the evidence. Super Admin + Support yes; Finance and Content default no.",
};
