import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import {
  listAdminStaff,
  createAdminStaff,
  updateAdminStaffRole,
} from "@/lib/auth/admin-session";
import { permissionsForRole } from "@/lib/platform/rbac";
import { writeAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicStaff(row: Awaited<ReturnType<typeof listAdminStaff>>[number]) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    mustChangePassword: row.must_change_password,
    permissions: permissionsForRole(row.role),
  };
}

export async function GET(req: Request) {
  const auth = await requirePermission(req, "staff:manage");
  if ("response" in auth) return auth.response;
  const rows = await listAdminStaff();
  return NextResponse.json({ ok: true, staff: rows.map(publicStaff) });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "staff:manage");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    displayName?: string;
    role?: string;
  };
  try {
    const created = await createAdminStaff({
      email: String(body.email || ""),
      password: String(body.password || ""),
      displayName: String(body.displayName || ""),
      role: String(body.role || "support"),
    });
    await writeAuditLog({
      actor: auth.staff,
      action: "staff.create",
      entityType: "admin_staff",
      entityId: created.id,
      summary: `Created ${created.role} ${created.email}`,
    });
    return NextResponse.json({ ok: true, staff: publicStaff(created) });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "create failed" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const auth = await requirePermission(req, "staff:manage");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as { id?: string; role?: string };
  if (!body.id || !body.role) {
    return NextResponse.json({ ok: false, error: "id and role required" }, { status: 400 });
  }
  if (body.id === auth.staff.id) {
    return NextResponse.json(
      { ok: false, error: "You cannot change your own role." },
      { status: 400 }
    );
  }
  try {
    const updated = await updateAdminStaffRole(String(body.id), String(body.role));
    await writeAuditLog({
      actor: auth.staff,
      action: "staff.role_update",
      entityType: "admin_staff",
      entityId: updated.id,
      summary: `${updated.email} role set to ${updated.role}`,
    });
    return NextResponse.json({ ok: true, staff: publicStaff(updated) });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "update failed" },
      { status: 400 }
    );
  }
}
