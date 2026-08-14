import { getSql } from "@/lib/db";
import type { AdminStaff } from "@/lib/auth/admin-session";
import { assertNoPlaintextSecret, redactRecord } from "@/lib/platform/secrets/redact";

export async function writeAuditLog(input: {
  actor: AdminStaff | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
}) {
  const metadata = redactRecord(input.metadata ?? {});
  const payload = {
    summary: input.summary,
    metadata,
  };
  if (typeof input.metadata?.value === "string") {
    assertNoPlaintextSecret(payload, input.metadata.value);
  }
  const sql = getSql();
  await sql`
    INSERT INTO integration_audit_log (
      actor_id, actor_email, action, entity_type, entity_id, summary, metadata
    )
    VALUES (
      ${input.actor?.id ?? null},
      ${input.actor?.email ?? "system"},
      ${input.action},
      ${input.entityType},
      ${input.entityId ?? null},
      ${input.summary},
      ${JSON.stringify(metadata)}
    )
  `;
}

export async function listAuditLog(limit = 80) {
  const sql = getSql();
  const cap = Math.min(Math.max(limit, 1), 200);
  return sql`
    SELECT id, actor_email, action, entity_type, entity_id, summary, metadata, created_at
    FROM integration_audit_log
    ORDER BY created_at DESC
    LIMIT ${cap}
  `;
}
