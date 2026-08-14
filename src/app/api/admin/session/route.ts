import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hasDatabaseUrl } from "@/lib/db";
import {
  ADMIN_COOKIE,
  authenticateAdmin,
  countAdminStaff,
  createAdminSession,
  createFirstSuperAdmin,
  destroyAdminSession,
  getAdminFromCookies,
  changeAdminPassword,
  sessionCookieOptions,
} from "@/lib/auth/admin-session";
import { writeAuditLog } from "@/lib/platform/audit";
import { ensureProviderSlots } from "@/lib/platform/integrations/store";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { permissionsForRole } from "@/lib/platform/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "Database is not configured" }, { status: 503 });
  }
  const needsSetup = (await countAdminStaff()) === 0;
  const staff = await getAdminFromCookies();
  return NextResponse.json({
    ok: true,
    needsSetup,
    staff: staff
      ? {
          id: staff.id,
          email: staff.email,
          displayName: staff.display_name,
          role: staff.role,
          mustChangePassword: staff.must_change_password,
          permissions: permissionsForRole(staff.role),
        }
      : null,
  });
}

export async function POST(req: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "Database is not configured" }, { status: 503 });
  }
  const ip = clientIp(req);
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
    displayName?: string;
  };
  const action = body.action || "login";

  if (action === "login" || action === "setup") {
    const rl = rateLimit(`admin-login:${ip}`, 12, 60_000);
    if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);
  }

  if (action === "change-password") {
    const current = await getAdminFromCookies();
    if (!current) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
      await changeAdminPassword(
        current.id,
        String(body.currentPassword || ""),
        String(body.password || "")
      );
      await writeAuditLog({
        actor: current,
        action: "admin.password_change",
        entityType: "admin_staff",
        entityId: current.id,
        summary: "Admin password changed",
      });
      return NextResponse.json({ ok: true, mustChangePassword: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Password change failed";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
  }

  if (action === "setup") {
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const displayName = String(body.displayName || "Super Admin").trim();
    if (!email || password.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Email and a password of at least 10 characters are required." },
        { status: 400 }
      );
    }
    try {
      const staff = await createFirstSuperAdmin({ email, password, displayName });
      await ensureProviderSlots();
      const token = await createAdminSession(staff.id);
      const jar = await cookies();
      jar.set(ADMIN_COOKIE, token, sessionCookieOptions());
      await writeAuditLog({
        actor: staff,
        action: "admin.setup",
        entityType: "admin_staff",
        entityId: staff.id,
        summary: "First Super Admin account created",
      });
      return NextResponse.json({ ok: true, staff });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Setup failed";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
  }

  if (action === "logout") {
    const jar = await cookies();
    const token = jar.get(ADMIN_COOKIE)?.value;
    if (token) await destroyAdminSession(token);
    jar.set(ADMIN_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email || "").trim();
  const password = String(body.password || "");
  try {
    const staff = await authenticateAdmin(email, password, ip);
    if (!staff) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }
    await ensureProviderSlots();
    const token = await createAdminSession(staff.id);
    const jar = await cookies();
    jar.set(ADMIN_COOKIE, token, sessionCookieOptions());
    await writeAuditLog({
      actor: staff,
      action: "admin.login",
      entityType: "admin_staff",
      entityId: staff.id,
      summary: "Super Admin signed in",
    });
    return NextResponse.json({
      ok: true,
      staff: {
        id: staff.id,
        email: staff.email,
        displayName: staff.display_name,
        role: staff.role,
        mustChangePassword: staff.must_change_password,
        permissions: permissionsForRole(staff.role),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Login failed";
    const locked = msg.toLowerCase().includes("locked");
    return NextResponse.json({ ok: false, error: msg }, { status: locked ? 429 : 401 });
  }
}
