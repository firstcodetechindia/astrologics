import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { listProvidersPublic, updateProviderFlags } from "@/lib/platform/integrations/store";
import { writeAuditLog } from "@/lib/platform/audit";
import { upsertProviderSecret, deleteProviderSecret } from "@/lib/platform/secrets/vault";
import { slotSpec } from "@/lib/platform/integrations/catalog";
import type { IntegrationCategory } from "@/lib/platform/integrations/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "vault:read");
  if ("response" in auth) return auth.response;
  const providers = await listProvidersPublic();
  return NextResponse.json({ ok: true, providers });
}

export async function PATCH(req: Request) {
  const auth = await requirePermission(req, "vault:rotate");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    providerId?: string;
    enabled?: boolean;
    sandboxMode?: boolean;
    config?: Record<string, unknown>;
  };
  if (!body.providerId) {
    return NextResponse.json({ ok: false, error: "providerId required" }, { status: 400 });
  }
  await updateProviderFlags(body.providerId, {
    enabled: body.enabled,
    sandboxMode: body.sandboxMode,
    config: body.config,
  });
  await writeAuditLog({
    actor: auth.staff,
    action: "integration.update",
    entityType: "integration_provider",
    entityId: body.providerId,
    summary: "Updated provider flags or config",
    metadata: {
      enabled: body.enabled,
      sandboxMode: body.sandboxMode,
      configKeys: body.config ? Object.keys(body.config) : [],
    },
  });
  const providers = await listProvidersPublic();
  return NextResponse.json({ ok: true, providers });
}

export async function PUT(req: Request) {
  const auth = await requirePermission(req, "vault:rotate");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    providerId?: string;
    category?: IntegrationCategory;
    slotKey?: string;
    secretName?: string;
    value?: string;
  };
  if (!body.providerId || !body.secretName || typeof body.value !== "string") {
    return NextResponse.json(
      { ok: false, error: "providerId, secretName and value are required" },
      { status: 400 }
    );
  }
  let plaintext = body.value.trim();
  if (!plaintext) {
    return NextResponse.json({ ok: false, error: "Secret cannot be empty" }, { status: 400 });
  }
  if (body.category && body.slotKey) {
    const spec = slotSpec(body.category, body.slotKey);
    const allowed = spec?.secretFields.some((f) => f.name === body.secretName);
    if (!allowed) {
      return NextResponse.json({ ok: false, error: "Unknown secret field" }, { status: 400 });
    }
  }
  const { last4 } = await upsertProviderSecret({
    providerId: body.providerId,
    secretName: body.secretName,
    plaintext,
  });
  const auditPayload = {
    secretName: body.secretName,
    last4,
  };
  // plaintext must never appear in logs/audit — only last4.
  plaintext = "";
  body.value = "";
  await writeAuditLog({
    actor: auth.staff,
    action: "secret.rotate",
    entityType: "integration_secret",
    entityId: `${body.providerId}:${body.secretName}`,
    summary: `Rotated secret ${body.secretName} (last4 ${last4})`,
    metadata: auditPayload,
  });
  const providers = await listProvidersPublic();
  return NextResponse.json({ ok: true, last4, providers });
}

export async function DELETE(req: Request) {
  const auth = await requirePermission(req, "vault:rotate");
  if ("response" in auth) return auth.response;
  const url = new URL(req.url);
  const providerId = url.searchParams.get("providerId");
  const secretName = url.searchParams.get("secretName");
  if (!providerId || !secretName) {
    return NextResponse.json(
      { ok: false, error: "providerId and secretName are required" },
      { status: 400 }
    );
  }
  await deleteProviderSecret(providerId, secretName);
  await writeAuditLog({
    actor: auth.staff,
    action: "secret.delete",
    entityType: "integration_secret",
    entityId: `${providerId}:${secretName}`,
    summary: `Deleted secret ${secretName}`,
    metadata: { secretName },
  });
  const providers = await listProvidersPublic();
  return NextResponse.json({ ok: true, providers });
}
