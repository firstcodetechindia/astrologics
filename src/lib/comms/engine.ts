import { getSql } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import { writeAuditLog } from "@/lib/platform/audit";
import { recordUsage } from "@/lib/platform/integrations/store";
import type { AdminStaff } from "@/lib/auth/admin-session";
import { PRESET_TEMPLATES, type Channel } from "@/lib/comms/catalog";
import { renderTemplate, toWhatsAppPositional } from "@/lib/comms/render";
import { resolveEmail, resolveSms, resolveWhatsapp } from "@/lib/comms/resolve";
import {
  isFixturePhone,
  submissionLooksMock,
} from "@/lib/comms/fixtures";

export async function ensureCommTemplates() {
  const sql = getSql();
  const count = await sql`SELECT count(*)::int AS n FROM message_templates`;
  if (Number(count[0]?.n) < PRESET_TEMPLATES.length) {
    for (const seed of PRESET_TEMPLATES) {
    const existing = await sql`
      SELECT id FROM message_templates
      WHERE template_key = ${seed.templateKey} AND channel = ${seed.channel}
      LIMIT 1
    `;
    let templateId: string;
    if (existing[0]) {
      templateId = String(existing[0].id);
    } else {
      const rows = await sql`
        INSERT INTO message_templates (
          template_key, channel, name, description, event_key, variables_json, active
        ) VALUES (
          ${seed.templateKey}, ${seed.channel}, ${seed.name}, ${seed.description},
          ${seed.eventKey}, ${JSON.stringify(seed.variables)}, ${true}
        )
        RETURNING id
      `;
      templateId = String(rows[0]!.id);
    }
    const ver = await sql`
      SELECT id FROM message_template_versions WHERE template_id = ${templateId} LIMIT 1
    `;
    if (!ver[0]) {
      await sql`
        INSERT INTO message_template_versions (
          template_id, version, subject, body, wa_language, wa_category, status
        ) VALUES (
          ${templateId}, ${1}, ${seed.subject}, ${seed.body}, ${"en"},
          ${seed.waCategory || "UTILITY"},
          ${seed.channel === "whatsapp" ? "draft" : "approved"}
        )
      `;
    }
  }
  }
  await ensureDefaultRule({
    name: "3 days before subscription expiry — email",
    eventKey: "subscription_expiry",
    templateKey: "subscription_expiry",
    channel: "email",
    offsetHours: -72,
  });
  await ensureDefaultRule({
    name: "3 days before subscription expiry — SMS",
    eventKey: "subscription_expiry",
    templateKey: "subscription_expiry",
    channel: "sms",
    offsetHours: -72,
  });
  await ensureDefaultRule({
    name: "Payment receipt — email",
    eventKey: "payment_receipt",
    templateKey: "payment_receipt",
    channel: "email",
    offsetHours: 0,
  });
  await ensureDefaultRule({
    name: "Payment receipt — SMS",
    eventKey: "payment_receipt",
    templateKey: "payment_receipt",
    channel: "sms",
    offsetHours: 0,
  });
  await relabelMockWhatsappApprovals();
  const n = await sql`SELECT count(*)::int AS n FROM message_templates`;
  return { seeded: true, count: Number(n[0]?.n) };
}

export async function listTemplates() {
  await ensureCommTemplates();
  const sql = getSql();
  const templates = await sql`
    SELECT t.*,
      (SELECT max(v.version) FROM message_template_versions v WHERE v.template_id = t.id) AS current_version,
      (SELECT v.status FROM message_template_versions v WHERE v.template_id = t.id ORDER BY v.version DESC LIMIT 1) AS status,
      (SELECT v.subject FROM message_template_versions v WHERE v.template_id = t.id ORDER BY v.version DESC LIMIT 1) AS subject,
      (SELECT v.body FROM message_template_versions v WHERE v.template_id = t.id ORDER BY v.version DESC LIMIT 1) AS body,
      (SELECT v.wa_category FROM message_template_versions v WHERE v.template_id = t.id ORDER BY v.version DESC LIMIT 1) AS wa_category
    FROM message_templates t
    ORDER BY t.event_key, t.channel
  `;
  const submissions = await sql`
    SELECT * FROM whatsapp_template_submissions ORDER BY submitted_at DESC LIMIT 40
  `;
  const rules = await sql`
    SELECT r.*, t.name AS template_name, t.template_key
    FROM automation_rules r
    JOIN message_templates t ON t.id = r.template_id
    ORDER BY r.created_at DESC
  `;
  const log = await sql`SELECT * FROM message_log ORDER BY created_at DESC LIMIT 40`;
  const scheduled = await sql`
    SELECT * FROM scheduled_sends ORDER BY fire_at DESC LIMIT 40
  `;
  return { templates, submissions, rules, log, scheduled };
}

async function ensureDefaultRule(input: {
  name: string;
  eventKey: string;
  templateKey: string;
  channel: Channel;
  offsetHours: number;
}) {
  const sql = getSql();
  const tpl = await sql`
    SELECT id FROM message_templates
    WHERE template_key = ${input.templateKey} AND channel = ${input.channel}
    LIMIT 1
  `;
  if (!tpl[0]) return;
  const existing = await sql`
    SELECT id FROM automation_rules
    WHERE event_key = ${input.eventKey} AND channel = ${input.channel} AND template_id = ${tpl[0].id}
    LIMIT 1
  `;
  if (existing[0]) return;
  await sql`
    INSERT INTO automation_rules (name, event_key, template_id, channel, offset_hours, enabled)
    VALUES (${input.name}, ${input.eventKey}, ${tpl[0].id}, ${input.channel}, ${input.offsetHours}, ${true})
  `;
}

async function relabelMockWhatsappApprovals() {
  const sql = getSql();
  await sql`
    UPDATE whatsapp_template_submissions
    SET status = ${"sandbox_approved"}
    WHERE status = ${"approved"}
      AND (provider_response LIKE ${'%"mock":true%'} OR provider_response LIKE ${'%"mock": true%'})
  `;
  await sql`
    UPDATE whatsapp_template_submissions
    SET status = ${"sandbox_rejected"}
    WHERE status = ${"rejected"}
      AND (provider_response LIKE ${'%"mock":true%'} OR provider_response LIKE ${'%"mock": true%'})
  `;
  await sql`
    UPDATE message_template_versions v
    SET status = ${"sandbox_approved"}
    WHERE v.status = ${"approved"}
      AND EXISTS (
        SELECT 1 FROM message_templates t
        WHERE t.id = v.template_id AND t.channel = ${"whatsapp"}
      )
      AND EXISTS (
        SELECT 1 FROM whatsapp_template_submissions s
        WHERE s.version_id = v.id
          AND (s.provider_response LIKE ${'%"mock":true%'} OR s.provider_response LIKE ${'%"mock": true%'})
      )
  `;
  await sql`
    UPDATE scheduled_sends
    SET status = ${"cancelled_fixture"}
    WHERE status = ${"scheduled"}
      AND regexp_replace(to_addr, '\\D', '', 'g') IN (${"9999999999"}, ${"919999999999"})
  `;
}

export async function saveTemplateVersion(
  templateId: string,
  patch: { subject?: string; body?: string; waCategory?: string },
  actor: AdminStaff
) {
  const sql = getSql();
  const last = await sql`
    SELECT COALESCE(max(version), 0)::int AS v FROM message_template_versions WHERE template_id = ${templateId}
  `;
  const next = Number(last[0]?.v || 0) + 1;
  const prev = await sql`
    SELECT * FROM message_template_versions WHERE template_id = ${templateId} ORDER BY version DESC LIMIT 1
  `;
  const tpl = await sql`SELECT channel FROM message_templates WHERE id = ${templateId} LIMIT 1`;
  const channel = String(tpl[0]?.channel || "email");
  const rows = await sql`
    INSERT INTO message_template_versions (
      template_id, version, subject, body, wa_language, wa_category, status
    ) VALUES (
      ${templateId},
      ${next},
      ${patch.subject ?? String(prev[0]?.subject || "")},
      ${patch.body ?? String(prev[0]?.body || "")},
      ${"en"},
      ${patch.waCategory ?? String(prev[0]?.wa_category || "UTILITY")},
      ${channel === "whatsapp" ? "draft" : "approved"}
    )
    RETURNING *
  `;
  await writeAuditLog({
    actor,
    action: "comms.template.version",
    entityType: "message_template",
    entityId: templateId,
    summary: `Saved template version ${next}`,
  });
  return rows[0];
}

export async function submitWhatsappTemplate(templateId: string, actor: AdminStaff) {
  const sql = getSql();
  const tpl = await sql`SELECT * FROM message_templates WHERE id = ${templateId} LIMIT 1`;
  if (!tpl[0] || String(tpl[0].channel) !== "whatsapp") {
    throw new Error("Not a WhatsApp template");
  }
  const ver = await sql`
    SELECT * FROM message_template_versions WHERE template_id = ${templateId} ORDER BY version DESC LIMIT 1
  `;
  if (!ver[0]) throw new Error("No version to submit");
  const vars = JSON.parse(String(tpl[0].variables_json || "[]")) as string[];
  const positional = toWhatsAppPositional(String(ver[0].body), vars);
  const wa = await resolveWhatsapp();
  const metaName = String(tpl[0].template_key).replace(/[^a-z0-9_]/g, "_").slice(0, 512);
  const result = await wa.provider.submitTemplate(
    {
      name: metaName,
      language: String(ver[0].wa_language || "en"),
      category: String(ver[0].wa_category || "UTILITY"),
      body: positional,
    },
    wa.ctx
  );
  await sql`
    UPDATE message_template_versions SET status = ${
      result.status === "approved" && wa.transport !== "mock" ? "approved" : "submitted"
    } WHERE id = ${ver[0].id}
  `;
  await sql`
    INSERT INTO whatsapp_template_submissions (
      template_id, version_id, provider_slot, meta_template_name, status, provider_response
    ) VALUES (
      ${templateId}, ${ver[0].id}, ${wa.slotKey}, ${metaName}, ${result.status},
      ${JSON.stringify(result.providerResponse)}
    )
  `;
  await writeAuditLog({
    actor,
    action: "comms.whatsapp.submit",
    entityType: "message_template",
    entityId: templateId,
    summary: `Submitted ${metaName} to ${wa.slotKey} (${result.status})`,
  });
  return result;
}

/** Sandbox-only: Super Admin can simulate Meta's callback. Never writes `approved`. */
export async function markWhatsappReview(
  submissionId: string,
  status: "approved" | "rejected",
  reason: string,
  actor: AdminStaff
) {
  const sql = getSql();
  const row = await sql`
    SELECT * FROM whatsapp_template_submissions WHERE id = ${submissionId} LIMIT 1
  `;
  if (!row[0]) throw new Error("Submission not found");
  const wa = await resolveWhatsapp();
  if (wa.transport !== "mock") {
    throw new Error(
      "Manual WhatsApp review is sandbox-only. Live Meta approval must come from Graph, not Super Admin."
    );
  }
  if (!submissionLooksMock(String(row[0].provider_response || ""))) {
    throw new Error("This submission is not a mock Graph response and cannot be sandbox-approved.");
  }
  const stored = status === "approved" ? "sandbox_approved" : "sandbox_rejected";
  await sql`
    UPDATE whatsapp_template_submissions
    SET status = ${stored}, reviewed_at = now(), rejection_reason = ${reason}
    WHERE id = ${submissionId}
  `;
  await sql`
    UPDATE message_template_versions SET status = ${stored} WHERE id = ${row[0].version_id}
  `;
  await writeAuditLog({
    actor,
    action: "comms.whatsapp.review",
    entityType: "whatsapp_template_submission",
    entityId: submissionId,
    summary: `WhatsApp template ${stored} (mock — not Meta)`,
  });
}

export async function upsertAutomationRule(
  input: {
    id?: string;
    name: string;
    eventKey: string;
    templateId: string;
    channel: Channel;
    offsetHours: number;
    enabled: boolean;
  },
  actor: AdminStaff
) {
  const sql = getSql();
  if (input.id) {
    await sql`
      UPDATE automation_rules SET
        name = ${input.name},
        event_key = ${input.eventKey},
        template_id = ${input.templateId},
        channel = ${input.channel},
        offset_hours = ${input.offsetHours},
        enabled = ${input.enabled}
      WHERE id = ${input.id}
    `;
  } else {
    await sql`
      INSERT INTO automation_rules (name, event_key, template_id, channel, offset_hours, enabled)
      VALUES (${input.name}, ${input.eventKey}, ${input.templateId}, ${input.channel}, ${input.offsetHours}, ${input.enabled})
    `;
  }
  await writeAuditLog({
    actor,
    action: "comms.rule.upsert",
    entityType: "automation_rule",
    summary: `Saved rule ${input.name}`,
  });
}

type SendVars = Record<string, string>;

async function latestVersion(templateId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT v.*, t.template_key, t.channel, t.variables_json
    FROM message_template_versions v
    JOIN message_templates t ON t.id = v.template_id
    WHERE v.template_id = ${templateId}
    ORDER BY v.version DESC LIMIT 1
  `;
  return rows[0] || null;
}

export async function previewTemplate(templateId: string, vars: SendVars) {
  const ver = await latestVersion(templateId);
  if (!ver) throw new Error("Template version missing");
  const merged = { brand_name: siteConfig.brandName, ...vars };
  const subject = renderTemplate(String(ver.subject || ""), merged);
  const body = renderTemplate(String(ver.body || ""), merged);
  return {
    templateKey: String(ver.template_key),
    channel: String(ver.channel),
    version: Number(ver.version),
    status: String(ver.status),
    subject: subject.rendered,
    body: body.rendered,
    missing: [...new Set([...subject.missing, ...body.missing])],
  };
}

export async function sendTemplate(input: {
  templateId: string;
  to: string;
  vars: SendVars;
  actor?: AdminStaff | null;
}) {
  const sql = getSql();
  const preview = await previewTemplate(input.templateId, input.vars);
  const ver = await latestVersion(input.templateId);
  if (!ver) throw new Error("Template missing");
  const channel = preview.channel as Channel;
  let messageId = "";
  let transport = "mock";
  let slotKey = "";
  let status = "sent";
  let error = "";
  try {
    if (channel === "email") {
      const email = await resolveEmail();
      transport = email.transport;
      slotKey = email.slotKey;
      const html = `<pre style="font-family:system-ui;white-space:pre-wrap">${escapeHtml(preview.body)}</pre>`;
      const sent = await email.provider.send({
        to: input.to,
        subject: preview.subject || siteConfig.brandName,
        html,
        text: preview.body,
        ctx: email.ctx,
      });
      messageId = sent.messageId;
      await recordUsage(email.providerId, "emails_sent", 1, { template: preview.templateKey });
    } else if (channel === "sms") {
      const sms = await resolveSms();
      transport = sms.transport;
      slotKey = sms.slotKey;
      if (isFixturePhone(input.to) && transport !== "mock") {
        throw new Error("Refusing live SMS to a fixture test number.");
      }
      const sent = await sms.provider.sendTransactional(input.to, preview.body, sms.ctx);
      messageId = sent.messageId;
      await recordUsage(sms.providerId, "sms_sent", 1, { template: preview.templateKey });
    } else {
      const wa = await resolveWhatsapp();
      transport = wa.transport;
      slotKey = wa.slotKey;
      if (isFixturePhone(input.to) && transport !== "mock") {
        throw new Error("Refusing live WhatsApp to a fixture test number.");
      }
      const metaLive = await whatsappMaySendLive(String(ver.id), preview.status);
      const approved =
        transport === "mock"
          ? preview.status === "sandbox_approved" || preview.status === "approved"
          : metaLive;
      if (!approved && transport !== "mock") {
        throw new Error(
          "WhatsApp template is not Meta-approved. A sandbox/mock Super Admin approval does not count. Business-initiated messages outside the 24-hour window are blocked."
        );
      }
      const sent = await wa.provider.sendTemplate(
        {
          to: input.to,
          templateName: preview.templateKey.replace(/[^a-z0-9_]/g, "_"),
          language: "en",
          body: preview.body,
          approved,
        },
        wa.ctx
      );
      messageId = sent.messageId;
      if (!approved) {
        status = "blocked_unapproved";
      }
      await recordUsage(wa.providerId, "whatsapp_sent", 1, { template: preview.templateKey, approved, metaLive });
    }
  } catch (e) {
    status = "failed";
    error = e instanceof Error ? e.message : "send failed";
  }
  await sql`
    INSERT INTO message_log (
      channel, template_key, version, to_addr, subject, rendered_body,
      transport, provider_slot, message_id, status, error, metadata
    ) VALUES (
      ${channel}, ${preview.templateKey}, ${preview.version}, ${input.to}, ${preview.subject},
      ${preview.body}, ${transport}, ${slotKey}, ${messageId}, ${status}, ${error},
      ${JSON.stringify({ missing: preview.missing })}
    )
  `;
  if (input.actor) {
    await writeAuditLog({
      actor: input.actor,
      action: "comms.send",
      entityType: "message_log",
      summary: `Sent ${preview.templateKey} via ${channel} to ${redactDest(input.to)} (${status})`,
    });
  }
  if (status === "failed") throw new Error(error);
  return { ...preview, messageId, transport, slotKey, status, to: input.to };
}

function redactDest(to: string) {
  if (to.includes("@")) {
    const [u, d] = to.split("@");
    return `${(u || "").slice(0, 2)}***@${d}`;
  }
  return `***${to.slice(-4)}`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function whatsappMaySendLive(versionId: string, status: string): Promise<boolean> {
  if (status !== "approved") return false;
  const sql = getSql();
  const sub = await sql`
    SELECT status, provider_response FROM whatsapp_template_submissions
    WHERE version_id = ${versionId}
    ORDER BY submitted_at DESC LIMIT 1
  `;
  if (!sub[0] || String(sub[0].status) !== "approved") return false;
  return !submissionLooksMock(String(sub[0].provider_response || ""));
}

export async function dispatchEvent(input: {
  eventKey: string;
  vars: SendVars;
  to: { email?: string; phone?: string; whatsapp?: string };
  anchorAt?: string;
}) {
  await ensureCommTemplates();
  const sql = getSql();
  const rules = await sql`
    SELECT * FROM automation_rules WHERE event_key = ${input.eventKey} AND enabled = ${true}
  `;
  const results: Record<string, unknown>[] = [];
  const anchor = input.anchorAt ? new Date(input.anchorAt) : new Date();
  for (const rule of rules) {
    const channel = String(rule.channel) as Channel;
    const dest =
      channel === "email" ? input.to.email : channel === "sms" ? input.to.phone : input.to.whatsapp;
    if (!dest) {
      results.push({ ruleId: rule.id, skipped: "no destination" });
      continue;
    }
    const fireAt = new Date(anchor.getTime() + Number(rule.offset_hours) * 3600_000);
    if (fireAt.getTime() > Date.now() + 5000) {
      await sql`
        INSERT INTO scheduled_sends (rule_id, fire_at, channel, template_id, to_addr, vars_json, status)
        VALUES (
          ${rule.id}, ${fireAt.toISOString()}, ${channel}, ${rule.template_id}, ${dest},
          ${JSON.stringify(input.vars)}, ${"scheduled"}
        )
      `;
      results.push({ ruleId: rule.id, scheduledFor: fireAt.toISOString() });
      continue;
    }
    const sent = await sendTemplate({
      templateId: String(rule.template_id),
      to: dest,
      vars: input.vars,
    });
    results.push({ ruleId: rule.id, sent });
  }
  return results;
}

export async function processDueSends() {
  const sql = getSql();
  const due = await sql`
    SELECT * FROM scheduled_sends
    WHERE status = ${"scheduled"} AND fire_at <= now()
    ORDER BY fire_at
    LIMIT 50
  `;
  const out: Record<string, unknown>[] = [];
  for (const row of due) {
    try {
      const vars = JSON.parse(String(row.vars_json || "{}")) as SendVars;
      const sent = await sendTemplate({
        templateId: String(row.template_id),
        to: String(row.to_addr),
        vars,
      });
      await sql`UPDATE scheduled_sends SET status = ${"sent"} WHERE id = ${row.id}`;
      out.push({ id: row.id, sent });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "failed";
      await sql`UPDATE scheduled_sends SET status = ${"failed"} WHERE id = ${row.id}`;
      out.push({ id: row.id, error: msg });
    }
  }
  return out;
}
