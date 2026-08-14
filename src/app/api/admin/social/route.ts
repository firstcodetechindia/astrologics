import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import {
  composeSocialPost,
  generateSocialCandidates,
  listSocialPosts,
  publishSocialPost,
  processDueSocialQueue,
  refreshSocialEngagement,
  reviewSocialPost,
} from "@/lib/social/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "content:write");
  if ("response" in auth) return auth.response;
  const posts = await listSocialPosts();
  return NextResponse.json({
    ok: true,
    posts,
    policy:
      "No post is published until a human approves it. Candidates land in pending_review. Engagement is likes/comments/shares only — Meta reach Insights are not pulled (extra permissions / rate limits).",
  });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "content:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    id?: string;
    text?: string;
    locale?: "en" | "hi";
    slotKey?: string;
    scheduledFor?: string | null;
    decision?: "approve" | "reject";
  };
  try {
    if (body.action === "compose") {
      const post = await composeSocialPost({
        body: String(body.text || ""),
        slotKey: body.slotKey,
        locale: body.locale,
        scheduledFor: body.scheduledFor,
        actor: auth.staff,
      });
      return NextResponse.json({ ok: true, post });
    }
    if (body.action === "generate") {
      const posts = await generateSocialCandidates(auth.staff, body.locale === "hi" ? "hi" : "en");
      return NextResponse.json({ ok: true, posts });
    }
    if (body.action === "review" && body.id && body.decision) {
      const post = await reviewSocialPost({
        id: body.id,
        decision: body.decision,
        body: body.text,
        scheduledFor: body.scheduledFor,
        actor: auth.staff,
      });
      return NextResponse.json({ ok: true, post });
    }
    if (body.action === "publish" && body.id) {
      const post = await publishSocialPost(body.id, auth.staff);
      return NextResponse.json({ ok: true, post });
    }
    if (body.action === "engagement" && body.id) {
      const post = await refreshSocialEngagement(body.id);
      return NextResponse.json({ ok: true, post });
    }
    if (body.action === "process-due") {
      const result = await processDueSocialQueue(auth.staff);
      return NextResponse.json({ ok: true, ...result });
    }
    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "social failed" },
      { status: 400 }
    );
  }
}
