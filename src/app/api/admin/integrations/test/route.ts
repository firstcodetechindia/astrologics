import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { runProviderTest } from "@/lib/platform/integrations/test-call";
import { writeAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requirePermission(req, "vault:read");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as { providerId?: string };
  if (!body.providerId) {
    return NextResponse.json({ ok: false, error: "providerId required" }, { status: 400 });
  }
  try {
    const result = await runProviderTest(body.providerId);
    await writeAuditLog({
      actor: auth.staff,
      action: "integration.test",
      entityType: "integration_provider",
      entityId: body.providerId,
      summary: result.ok
        ? `Test call succeeded (${result.transport})`
        : `Test call failed (${result.transport})`,
      metadata: {
        ok: result.ok,
        transport: result.transport,
        latencyMs: result.latencyMs,
        slotKey: result.slotKey,
        category: result.category,
      },
    });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Test failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
