import { NextResponse } from "next/server";
import { getAdminFromCookies, type AdminStaff } from "@/lib/auth/admin-session";
import { hasDatabaseUrl } from "@/lib/db";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { staffHas, type PermissionId } from "@/lib/platform/rbac";
import { writeAuditLog } from "@/lib/platform/audit";

export async function requireAdmin(
  req: Request,
  opts?: { allowPasswordChangeFlow?: boolean }
): Promise<
  { staff: AdminStaff } | { response: NextResponse }
> {
  if (!hasDatabaseUrl()) {
    return {
      response: NextResponse.json(
        { ok: false, error: "Database is not configured" },
        { status: 503 }
      ),
    };
  }
  const ip = clientIp(req);
  const rl = rateLimit(`admin:${ip}`, 120, 60_000);
  if (!rl.ok) {
    return { response: rateLimitResponse(rl.retryAfterSec) as NextResponse };
  }
  const staff = await getAdminFromCookies();
  if (!staff) {
    return {
      response: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (staff.must_change_password && !opts?.allowPasswordChangeFlow) {
    return {
      response: NextResponse.json(
        {
          ok: false,
          error: "Password change required before using the control plane.",
          mustChangePassword: true,
        },
        { status: 403 }
      ),
    };
  }
  return { staff };
}

export async function requirePermission(
  req: Request,
  permission: PermissionId
): Promise<{ staff: AdminStaff } | { response: NextResponse }> {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth;
  if (!staffHas(auth.staff.role, permission)) {
    await writeAuditLog({
      actor: auth.staff,
      action: "rbac.deny",
      entityType: "permission",
      entityId: permission,
      summary: `Denied ${permission} to role ${auth.staff.role}`,
    });
    return {
      response: NextResponse.json(
        {
          ok: false,
          error: "Forbidden",
          permission,
          role: auth.staff.role,
        },
        { status: 403 }
      ),
    };
  }
  return auth;
}

export async function requireSuperAdmin(
  req: Request
): Promise<{ staff: AdminStaff } | { response: NextResponse }> {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth;
  if (auth.staff.role !== "super_admin") {
    await writeAuditLog({
      actor: auth.staff,
      action: "rbac.deny",
      entityType: "permission",
      entityId: "super_admin",
      summary: `Denied Super Admin-only action to role ${auth.staff.role}`,
    });
    return {
      response: NextResponse.json(
        { ok: false, error: "Forbidden", role: auth.staff.role },
        { status: 403 }
      ),
    };
  }
  return auth;
}

export function parseJsonBody<T>(raw: unknown, fallback: T): T {
  return raw && typeof raw === "object" ? (raw as T) : fallback;
}
