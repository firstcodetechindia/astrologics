import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import {
  ensureCommTemplates,
  listTemplates,
  saveTemplateVersion,
  submitWhatsappTemplate,
  markWhatsappReview,
  upsertAutomationRule,
  previewTemplate,
  sendTemplate,
  dispatchEvent,
  processDueSends,
} from "@/lib/comms/engine";
import type { Channel } from "@/lib/comms/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "comms:write");
  if ("response" in auth) return auth.response;
  await ensureCommTemplates();
  const data = await listTemplates();
  return NextResponse.json({ ok: true, ...data });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "comms:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    templateId?: string;
    subject?: string;
    bodyText?: string;
    waCategory?: string;
    submissionId?: string;
    status?: "approved" | "rejected";
    reason?: string;
    ruleId?: string;
    name?: string;
    eventKey?: string;
    channel?: Channel;
    offsetHours?: number;
    enabled?: boolean;
    to?: string;
    vars?: Record<string, string>;
    previewOnly?: boolean;
    event?: string;
    dest?: { email?: string; phone?: string; whatsapp?: string };
    anchorAt?: string;
  };
  try {
    if (body.action === "save-version" && body.templateId) {
      const ver = await saveTemplateVersion(
        body.templateId,
        { subject: body.subject, body: body.bodyText, waCategory: body.waCategory },
        auth.staff
      );
      return NextResponse.json({ ok: true, version: ver });
    }
    if (body.action === "submit-whatsapp" && body.templateId) {
      const result = await submitWhatsappTemplate(body.templateId, auth.staff);
      return NextResponse.json({ ok: true, ...result });
    }
    if (body.action === "review-whatsapp" && body.submissionId && body.status) {
      await markWhatsappReview(body.submissionId, body.status, String(body.reason || ""), auth.staff);
      return NextResponse.json({ ok: true });
    }
    if (body.action === "save-rule") {
      await upsertAutomationRule(
        {
          id: body.ruleId,
          name: String(body.name || "Rule"),
          eventKey: String(body.eventKey || ""),
          templateId: String(body.templateId),
          channel: body.channel || "email",
          offsetHours: Number(body.offsetHours || 0),
          enabled: body.enabled !== false,
        },
        auth.staff
      );
      return NextResponse.json({ ok: true });
    }
    if (body.action === "preview" && body.templateId) {
      const preview = await previewTemplate(body.templateId, body.vars || {});
      return NextResponse.json({ ok: true, preview });
    }
    if (body.action === "send-test" && body.templateId && body.to) {
      const result = await sendTemplate({
        templateId: body.templateId,
        to: body.to,
        vars: body.vars || {},
        actor: auth.staff,
      });
      return NextResponse.json({ ok: true, ...result });
    }
    if (body.action === "dispatch" && body.event) {
      const results = await dispatchEvent({
        eventKey: body.event,
        vars: body.vars || {},
        to: body.dest || {},
        anchorAt: body.anchorAt,
      });
      return NextResponse.json({ ok: true, results });
    }
    if (body.action === "process-due") {
      const results = await processDueSends();
      return NextResponse.json({ ok: true, results });
    }
    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Comms failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
