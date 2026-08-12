/**
 * Shared Postgres client (Neon via Vercel).
 * Prefer POSTGRES_URL / DATABASE_URL (pooled) for serverless queries.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

export function getSql() {
  if (sql) return sql;
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;
  if (!url) {
    throw new Error(
      "Missing POSTGRES_URL / DATABASE_URL. Provision Neon via `vercel install neon`."
    );
  }
  sql = neon(url);
  return sql;
}

export function hasDatabaseUrl(): boolean {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL
  );
}
