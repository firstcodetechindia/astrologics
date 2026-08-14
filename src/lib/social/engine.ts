import { getSql } from "@/lib/db";
import type { AdminStaff } from "@/lib/auth/admin-session";
import { writeAuditLog } from "@/lib/platform/audit";
import { decryptProviderSecrets } from "@/lib/platform/secrets/vault";
import { getProviderBySlot } from "@/lib/platform/integrations/store";
import { getSocialPublisher } from "@/lib/platform/integrations/adapters/social";
import type { IntegrationCategory } from "@/lib/platform/integrations/types";
import { buildSocialCandidates, type CandidateKind } from "@/lib/social/candidates";

export type SocialStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "failed";

const APPROVED_FOR_PUBLISH: SocialStatus[] = ["approved", "scheduled"];

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function listSocialPosts(limit = 60) {
  const sql = getSql();
  return sql`
    SELECT * FROM social_posts
    ORDER BY created_at DESC
    LIMIT ${Math.min(Math.max(limit, 1), 120)}
  `;
}

export async function composeSocialPost(input: {
  body: string;
  slotKey?: string;
  locale?: string;
  scheduledFor?: string | null;
  actor: AdminStaff;
}) {
  const body = input.body.trim();
  if (body.length < 8) throw new Error("Post body is too short");
  const sql = getSql();
  const scheduled = input.scheduledFor ? new Date(input.scheduledFor) : null;
  const rows = await sql`
    INSERT INTO social_posts (slot_key, kind, status, body, locale, scheduled_for)
    VALUES (
      ${input.slotKey || "meta_social"},
      ${"compose"},
      ${"pending_review"},
      ${body.slice(0, 2000)},
      ${input.locale || "en"},
      ${scheduled ? scheduled.toISOString() : null}
    )
    RETURNING *
  `;
  await writeAuditLog({
    actor: input.actor,
    action: "social.compose",
    entityType: "social_post",
    entityId: String(rows[0]?.id),
    summary: "Composed social post (pending human review)",
  });
  return rows[0];
}

export async function generateSocialCandidates(actor: AdminStaff | null, locale: "en" | "hi" = "en") {
  const candidates = buildSocialCandidates(locale);
  const sql = getSql();
  const created = [];
  for (const c of candidates) {
    const rows = await sql`
      INSERT INTO social_posts (slot_key, kind, status, body, locale)
      VALUES (
        ${"meta_social"},
        ${c.kind},
        ${"pending_review"},
        ${c.body.slice(0, 2000)},
        ${c.locale}
      )
      RETURNING *
    `;
    created.push(rows[0]);
  }
  await writeAuditLog({
    actor,
    action: "social.generate_candidates",
    entityType: "social_post",
    summary: `Generated ${created.length} candidates (pending_review — not published)`,
  });
  return created;
}

export async function reviewSocialPost(input: {
  id: string;
  decision: "approve" | "reject";
  body?: string;
  scheduledFor?: string | null;
  actor: AdminStaff;
}) {
  const sql = getSql();
  const existing = await sql`SELECT * FROM social_posts WHERE id = ${input.id} LIMIT 1`;
  if (!existing[0]) throw new Error("Post not found");
  if (String(existing[0].status) === "published") {
    throw new Error("Published posts cannot be re-reviewed");
  }
  if (input.decision === "reject") {
    await sql`
      UPDATE social_posts
      SET status = ${"rejected"}, updated_at = now()
      WHERE id = ${input.id}
    `;
    await writeAuditLog({
      actor: input.actor,
      action: "social.reject",
      entityType: "social_post",
      entityId: input.id,
      summary: "Rejected social candidate",
    });
    return (await sql`SELECT * FROM social_posts WHERE id = ${input.id}`)[0];
  }
  const scheduled = input.scheduledFor ? new Date(input.scheduledFor) : existing[0].scheduled_for;
  const body = (input.body ?? String(existing[0].body)).slice(0, 2000);
  const status = scheduled ? "scheduled" : "approved";
  await sql`
    UPDATE social_posts
    SET status = ${status},
        body = ${body},
        scheduled_for = ${scheduled ? new Date(scheduled).toISOString() : null},
        approved_at = now(),
        approved_by = ${input.actor.id},
        updated_at = now()
    WHERE id = ${input.id}
  `;
  await writeAuditLog({
    actor: input.actor,
    action: "social.approve",
    entityType: "social_post",
    entityId: input.id,
    summary: scheduled ? "Approved and scheduled (will not post before scheduled_for)" : "Approved for publish",
  });
  return (await sql`SELECT * FROM social_posts WHERE id = ${input.id}`)[0];
}

async function loadSlotCtx(slotKey: string) {
  const row = await getProviderBySlot("social" as IntegrationCategory, slotKey);
  if (!row) throw new Error(`Social slot ${slotKey} is not configured`);
  const secrets = await decryptProviderSecrets(String(row.id));
  let config: Record<string, unknown> = {};
  try {
    config = JSON.parse(String(row.config_json || "{}")) as Record<string, unknown>;
  } catch {
    config = {};
  }
  return {
    row,
    ctx: {
      secrets,
      config,
      sandbox: Boolean(row.sandbox_mode),
    },
  };
}

export async function publishSocialPost(id: string, actor: AdminStaff | null) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM social_posts WHERE id = ${id} LIMIT 1`;
  const post = rows[0];
  if (!post) throw new Error("Post not found");
  const status = String(post.status) as SocialStatus;
  if (!post.approved_at || !APPROVED_FOR_PUBLISH.includes(status)) {
    throw new Error(
      "Refuse to publish: post is not human-approved. Generate/compose items stay in pending_review until an admin approves."
    );
  }
  if (status === "scheduled" && post.scheduled_for && new Date(String(post.scheduled_for)).getTime() > Date.now() + 2000) {
    throw new Error("Scheduled time has not arrived yet");
  }
  const slotKey = String(post.slot_key || "meta_social");
  const { ctx } = await loadSlotCtx(slotKey);
  const publisher = getSocialPublisher(slotKey);
  try {
    const result = await publisher.publishPost({ body: String(post.body), ctx });
    const engagement = await publisher.fetchEngagement(result.postId, ctx);
    await sql`
      UPDATE social_posts
      SET status = ${"published"},
          published_at = now(),
          provider_post_id = ${result.postId},
          transport = ${result.transport},
          engagement_json = ${JSON.stringify(engagement)},
          error = ${""},
          updated_at = now()
      WHERE id = ${id}
    `;
    await writeAuditLog({
      actor,
      action: "social.publish",
      entityType: "social_post",
      entityId: id,
      summary: `Published via ${slotKey} (${result.transport}) post ${result.postId}`,
    });
    return (await sql`SELECT * FROM social_posts WHERE id = ${id}`)[0];
  } catch (e) {
    const msg = e instanceof Error ? e.message : "publish failed";
    await sql`
      UPDATE social_posts
      SET status = ${"failed"}, error = ${msg}, updated_at = now()
      WHERE id = ${id}
    `;
    throw e;
  }
}

export async function refreshSocialEngagement(id: string) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM social_posts WHERE id = ${id} LIMIT 1`;
  const post = rows[0];
  if (!post?.provider_post_id) throw new Error("Post has no provider id yet");
  const { ctx } = await loadSlotCtx(String(post.slot_key || "meta_social"));
  const engagement = await getSocialPublisher(String(post.slot_key)).fetchEngagement(
    String(post.provider_post_id),
    ctx
  );
  await sql`
    UPDATE social_posts
    SET engagement_json = ${JSON.stringify(engagement)}, updated_at = now()
    WHERE id = ${id}
  `;
  return { ...post, engagement };
}

export async function processDueSocialQueue(actor: AdminStaff | null = null) {
  const sql = getSql();
  const due = await sql`
    SELECT id FROM social_posts
    WHERE status = ${"scheduled"}
      AND approved_at IS NOT NULL
      AND scheduled_for IS NOT NULL
      AND scheduled_for <= now()
    ORDER BY scheduled_for
    LIMIT 10
  `;
  const published = [];
  const errors: string[] = [];
  for (const row of due) {
    try {
      published.push(await publishSocialPost(String(row.id), actor));
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "failed");
    }
  }
  return { published: published.length, errors };
}

export function parseEngagement(raw: unknown) {
  return parseJson(raw, { likes: 0, comments: 0, shares: 0, source: "mock" as const, note: "" });
}

export type { CandidateKind };
