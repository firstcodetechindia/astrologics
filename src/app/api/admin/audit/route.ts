import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { listAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "audit:read");
  if ("response" in auth) return auth.response;
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") || 80);
  const rows = await listAuditLog(limit);
  return NextResponse.json({ ok: true, rows });
}
