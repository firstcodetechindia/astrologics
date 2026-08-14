import {
  randomBytes,
  scrypt,
  timingSafeEqual,
  createHash,
  type BinaryLike,
  type ScryptOptions,
} from "node:crypto";
import { promisify } from "node:util";
import { getSql } from "@/lib/db";

const scryptAsync = promisify(scrypt) as (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
  options?: ScryptOptions
) => Promise<Buffer>;

export const ADMIN_COOKIE = "cg_admin_session";
const SESSION_DAYS = 7;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;

export type AdminStaff = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  must_change_password: boolean;
};

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(
    password,
    salt,
    KEY_LEN,
    { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P }
  )) as Buffer;
  return [
    "scrypt",
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4]!, "base64url");
  const expected = Buffer.from(parts[5]!, "base64url");
  const derived = (await scryptAsync(password, salt, expected.length, { N, r, p })) as Buffer;
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function countAdminStaff(): Promise<number> {
  const sql = getSql();
  const rows = await sql`SELECT count(*)::int AS n FROM admin_staff`;
  return Number(rows[0]?.n ?? 0);
}

export async function createFirstSuperAdmin(input: {
  email: string;
  password: string;
  displayName: string;
  mustChangePassword?: boolean;
}): Promise<AdminStaff> {
  const n = await countAdminStaff();
  if (n > 0) {
    throw new Error("Setup already completed");
  }
  const email = input.email.trim().toLowerCase();
  const hash = await hashPassword(input.password);
  const mustChange = Boolean(input.mustChangePassword);
  const sql = getSql();
  const rows = await sql`
    INSERT INTO admin_staff (email, password_hash, display_name, role, must_change_password)
    VALUES (${email}, ${hash}, ${input.displayName.trim()}, ${"super_admin"}, ${mustChange})
    RETURNING id, email, display_name, role, must_change_password
  `;
  return mapStaff(rows[0]);
}

function mapStaff(row: Record<string, unknown>): AdminStaff {
  return {
    id: String(row.id),
    email: String(row.email),
    display_name: String(row.display_name),
    role: String(row.role),
    must_change_password: Boolean(row.must_change_password),
  };
}

const LOCK_AFTER = 8;

async function recordLoginAttempt(email: string, ip: string, success: boolean) {
  const sql = getSql();
  await sql`
    INSERT INTO admin_login_attempts (email, ip, success)
    VALUES (${email}, ${ip}, ${success})
  `;
}

async function recentFailures(email: string): Promise<number> {
  const sql = getSql();
  const rows = await sql`
    SELECT count(*)::int AS n
    FROM admin_login_attempts
    WHERE email = ${email}
      AND success = false
      AND created_at > now() - interval '15 minutes'
  `;
  return Number(rows[0]?.n ?? 0);
}

export async function authenticateAdmin(
  email: string,
  password: string,
  ip = "unknown"
): Promise<AdminStaff | null> {
  const sql = getSql();
  const normalized = email.trim().toLowerCase();
  const rows = await sql`
    SELECT id, email, display_name, role, password_hash, must_change_password,
           failed_login_count, locked_until
    FROM admin_staff
    WHERE email = ${normalized}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) {
    await recordLoginAttempt(normalized, ip, false);
    return null;
  }
  if (row.locked_until && new Date(String(row.locked_until)).getTime() > Date.now()) {
    await recordLoginAttempt(normalized, ip, false);
    throw new Error("Account locked after too many failed sign-ins. Try again later.");
  }
  const ok = await verifyPassword(password, String(row.password_hash));
  if (!ok) {
    await recordLoginAttempt(normalized, ip, false);
    const failures = await recentFailures(normalized);
    if (failures >= LOCK_AFTER) {
      await sql`
        UPDATE admin_staff
        SET failed_login_count = ${failures},
            locked_until = now() + interval '15 minutes'
        WHERE id = ${row.id}
      `;
    } else {
      await sql`
        UPDATE admin_staff
        SET failed_login_count = ${failures}
        WHERE id = ${row.id}
      `;
    }
    return null;
  }
  await recordLoginAttempt(normalized, ip, true);
  await sql`
    UPDATE admin_staff
    SET last_login_at = now(), failed_login_count = 0, locked_until = NULL
    WHERE id = ${row.id}
  `;
  return mapStaff(row);
}

export async function changeAdminPassword(
  staffId: string,
  currentPassword: string,
  nextPassword: string
): Promise<void> {
  if (nextPassword.length < 12) {
    throw new Error("New password must be at least 12 characters.");
  }
  const sql = getSql();
  const rows = await sql`
    SELECT password_hash FROM admin_staff WHERE id = ${staffId} LIMIT 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Account not found");
  const ok = await verifyPassword(currentPassword, String(row.password_hash));
  if (!ok) throw new Error("Current password is incorrect");
  const hash = await hashPassword(nextPassword);
  await sql`
    UPDATE admin_staff
    SET password_hash = ${hash}, must_change_password = false, failed_login_count = 0, locked_until = NULL
    WHERE id = ${staffId}
  `;
}

export async function listAdminStaff(): Promise<AdminStaff[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, display_name, role, must_change_password
    FROM admin_staff
    ORDER BY created_at
  `;
  return rows.map((r) => mapStaff(r as Record<string, unknown>));
}

export async function createAdminStaff(input: {
  email: string;
  password: string;
  displayName: string;
  role: string;
  mustChangePassword?: boolean;
}): Promise<AdminStaff> {
  const email = input.email.trim().toLowerCase();
  if (!email || input.password.length < 12) {
    throw new Error("Email and a password of at least 12 characters are required.");
  }
  const { isPhase7Role } = await import("@/lib/platform/rbac");
  if (!isPhase7Role(input.role)) {
    throw new Error("Unknown role");
  }
  const hash = await hashPassword(input.password);
  const mustChange = input.mustChangePassword !== false;
  const sql = getSql();
  try {
    const rows = await sql`
      INSERT INTO admin_staff (email, password_hash, display_name, role, must_change_password)
      VALUES (${email}, ${hash}, ${input.displayName.trim() || email}, ${input.role}, ${mustChange})
      RETURNING id, email, display_name, role, must_change_password
    `;
    return mapStaff(rows[0] as Record<string, unknown>);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "create failed";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      throw new Error("A staff account with that email already exists");
    }
    throw e;
  }
}

export async function upsertAdminStaff(input: {
  email: string;
  password: string;
  displayName: string;
  role: string;
  mustChangePassword?: boolean;
}): Promise<AdminStaff> {
  const email = input.email.trim().toLowerCase();
  const sql = getSql();
  const existing = await sql`SELECT id FROM admin_staff WHERE email = ${email} LIMIT 1`;
  if (!existing[0]) {
    return createAdminStaff(input);
  }
  const { isPhase7Role } = await import("@/lib/platform/rbac");
  if (!isPhase7Role(input.role)) throw new Error("Unknown role");
  if (input.password.length < 12) {
    throw new Error("Email and a password of at least 12 characters are required.");
  }
  const hash = await hashPassword(input.password);
  const mustChange = input.mustChangePassword !== false;
  const rows = await sql`
    UPDATE admin_staff
    SET password_hash = ${hash},
        display_name = ${input.displayName.trim() || email},
        role = ${input.role},
        must_change_password = ${mustChange}
    WHERE id = ${String(existing[0].id)}
    RETURNING id, email, display_name, role, must_change_password
  `;
  return mapStaff(rows[0] as Record<string, unknown>);
}

export async function updateAdminStaffRole(id: string, role: string): Promise<AdminStaff> {
  const { isPhase7Role } = await import("@/lib/platform/rbac");
  if (!isPhase7Role(role)) throw new Error("Unknown role");
  const sql = getSql();
  const rows = await sql`
    UPDATE admin_staff SET role = ${role}
    WHERE id = ${id}
    RETURNING id, email, display_name, role, must_change_password
  `;
  if (!rows[0]) throw new Error("Staff not found");
  return mapStaff(rows[0] as Record<string, unknown>);
}

export async function createAdminSession(staffId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const sql = getSql();
  await sql`
    INSERT INTO admin_sessions (staff_id, token_hash, expires_at)
    VALUES (${staffId}, ${tokenHash}, now() + interval '7 days')
  `;
  return token;
}

export async function destroyAdminSession(token: string) {
  const sql = getSql();
  await sql`DELETE FROM admin_sessions WHERE token_hash = ${hashToken(token)}`;
}

export async function getStaffFromToken(token: string): Promise<AdminStaff | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT s.id, s.email, s.display_name, s.role, s.must_change_password
    FROM admin_sessions sess
    JOIN admin_staff s ON s.id = sess.staff_id
    WHERE sess.token_hash = ${hashToken(token)}
      AND sess.expires_at > now()
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return mapStaff(row);
}

export async function getAdminFromCookies(): Promise<AdminStaff | null> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return getStaffFromToken(token);
}

export function sessionCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
