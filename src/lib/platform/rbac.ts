import {
  PHASE7_PERMISSIONS,
  type Phase7Permission,
  type Phase7Role,
} from "@/lib/platform/rbac-checklist";

export type PermissionId = Phase7Permission["id"];

const ROLE_SET = new Set<string>(["super_admin", "support", "content", "finance"]);

export function isPhase7Role(role: string): role is Phase7Role {
  return ROLE_SET.has(role);
}

export function permissionsForRole(role: string): PermissionId[] {
  if (role === "super_admin") {
    return PHASE7_PERMISSIONS.map((p) => p.id);
  }
  if (!isPhase7Role(role)) return [];
  return PHASE7_PERMISSIONS.filter((p) => p.defaultRoles.includes(role)).map((p) => p.id);
}

export function staffHas(role: string, permission: PermissionId): boolean {
  if (role === "super_admin") return true;
  return permissionsForRole(role).includes(permission);
}

export function permissionForAdminPath(pathname: string): PermissionId | undefined {
  const path = pathname.replace(/^\/(en|hi)(?=\/|$)/, "") || "/";
  if (path in NAV_PERMISSION) return NAV_PERMISSION[path];
  const keys = Object.keys(NAV_PERMISSION).sort((a, b) => b.length - a.length);
  for (const href of keys) {
    if (href !== "/admin" && (path === href || path.startsWith(`${href}/`))) {
      return NAV_PERMISSION[href];
    }
  }
  return undefined;
}

export function canAccessAdminPath(pathname: string, permissions: readonly string[]): boolean {
  const need = permissionForAdminPath(pathname);
  if (!need) return true;
  return permissions.includes(need);
}

export const NAV_PERMISSION: Record<string, PermissionId | undefined> = {
  "/admin": undefined,
  "/admin/users": "users:read",
  "/admin/astrologers": "users:read",
  "/admin/staff": "staff:manage",
  "/admin/settings": "flags:write",
  "/admin/content": "content:write",
  "/admin/content/horoscope": "content:write",
  "/admin/billing": "finance:read",
  "/admin/transactions": "finance:read",
  "/admin/wallets": "finance:read",
  "/admin/payouts": "finance:read",
  "/admin/refunds": "finance:read",
  "/admin/invoices": "finance:read",
  "/admin/comms": "comms:write",
  "/admin/comms/automations": "comms:write",
  "/admin/comms/log": "comms:write",
  "/admin/social": "content:write",
  "/admin/ai": "ai:write",
  "/admin/ai/flows": "ai:write",
  "/admin/ai/logs": "conversation_logs:read",
  "/admin/integrations": "vault:read",
  "/admin/audit": "audit:read",
  "/admin/health": undefined,
};
