import { NextResponse } from "next/server";
import { requirePermission, requireSuperAdmin } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { listPersonas } from "@/lib/ai/chat-agent-store";
import {
  ensurePhase5Astrologers,
  upsertDirectoryAstrologer,
  type AstrologerKind,
} from "@/lib/astrologers/consult-engine";
import { getBillingSettings } from "@/lib/billing/engine";
import { writeAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "users:read");
  if ("response" in auth) return auth.response;
  await ensurePhase5Astrologers();
  const sql = getSql();
  const [astrologers, personas, settings] = await Promise.all([
    sql`SELECT * FROM billing_astrologers ORDER BY kind, display_name`,
    listPersonas(),
    getBillingSettings(),
  ]);
  return NextResponse.json({
    ok: true,
    astrologers,
    personas: personas.map((p) => ({ id: p.id, slug: p.slug, name: p.name })),
    rateBounds: {
      minMinor: settings.consult_rate_min_minor,
      maxMinor: settings.consult_rate_max_minor,
    },
  });
}

export async function POST(req: Request) {
  const auth = await requireSuperAdmin(req);
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    displayName?: string;
    phone?: string | null;
    kind?: AstrologerKind;
    bio?: string;
    specialties?: string[];
    rateMinor?: number;
    commissionBps?: number | null;
    personaId?: string | null;
    slug?: string;
    available?: boolean;
    active?: boolean;
    payoutUpi?: string | null;
  };
  try {
    const saved = await upsertDirectoryAstrologer({
      id: body.id,
      displayName: String(body.displayName || "Astrologer"),
      phone: body.phone,
      kind: body.kind === "AI_PERSONA" ? "AI_PERSONA" : "REAL_HUMAN",
      bio: body.bio,
      specialties: body.specialties,
      rateMinor: Number(body.rateMinor || 2000),
      commissionBps: body.commissionBps ?? null,
      personaId: body.personaId,
      slug: body.slug,
      available: body.available,
      active: body.active,
      payoutUpi: body.payoutUpi,
    });
    await writeAuditLog({
      actor: auth.staff,
      action: body.id ? "astrologer.directory.update" : "astrologer.directory.create",
      entityType: "billing_astrologer",
      entityId: saved.id,
      summary: `${saved.kind} ${body.displayName} @ ₹${saved.rateMinor / 100}/min`,
    });
    return NextResponse.json({ ok: true, ...saved });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "save failed" },
      { status: 400 }
    );
  }
}
