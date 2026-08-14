import { getSql } from "@/lib/db";

export const AUTH0_FLAG_KEY = "auth0_enabled";

export async function getFeatureFlag(key: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT enabled FROM platform_feature_flags WHERE key = ${key} LIMIT 1
  `;
  return Boolean(rows[0]?.enabled);
}

export async function setFeatureFlag(
  key: string,
  enabled: boolean,
  updatedBy?: string | null
) {
  const sql = getSql();
  await sql`
    INSERT INTO platform_feature_flags (key, enabled, updated_by, updated_at)
    VALUES (${key}, ${enabled}, ${updatedBy ?? null}, now())
    ON CONFLICT (key)
    DO UPDATE SET
      enabled = EXCLUDED.enabled,
      updated_by = EXCLUDED.updated_by,
      updated_at = now()
  `;
}

export async function listFeatureFlags() {
  const sql = getSql();
  return sql`
    SELECT key, enabled, updated_at
    FROM platform_feature_flags
    ORDER BY key
  `;
}
