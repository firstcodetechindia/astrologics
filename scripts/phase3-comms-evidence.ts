/**
 * Phase 3 evidence: template render, SMTP send (vault transport),
 * WhatsApp submission flow, automation schedule vs immediate.
 *
 * Usage: npm run test:comms
 *
 * Live Gmail delivery requires real SMTP in the Super Admin vault.
 * Sandbox seeds (sandbox_smtp_*) stay mock — the script records that honestly.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { renderTemplate, toWhatsAppPositional } from "../src/lib/comms/render.ts";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let val = m[2]!;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]!]) process.env[m[1]!] = val;
  }
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`ASSERT: ${msg}`);
}

const TEST_INBOX = "apps.ananyasoftware@gmail.com";
const TEST_PHONE = "9999999999";

function renderChecks() {
  const source =
    "Hello {{user_name}},\n\nWe received {{amount}}. Tax invoice {{invoice_no}} is attached in your account.\n\n— {{brand_name}}";
  const vars = {
    user_name: "Ananya",
    invoice_no: "CG-INV-2026-0008",
    amount: "₹499.00",
    brand_name: "CosmicGyan",
  };
  const out = renderTemplate(source, vars);
  assert(out.rendered.includes("Ananya"), "user_name not substituted");
  assert(out.rendered.includes("CG-INV-2026-0008"), "invoice_no not substituted");
  assert(out.rendered.includes("₹499.00"), "amount not substituted");
  assert(out.rendered.includes("CosmicGyan"), "brand_name not substituted");
  assert(!out.rendered.includes("{{user_name}}"), "placeholder left in body");
  assert(out.missing.length === 0, `unexpected missing: ${out.missing.join(",")}`);
  const leftover = renderTemplate("Hi {{user_name}} {{missing_key}}", { user_name: "Ananya" });
  assert(leftover.rendered.includes("{{missing_key}}"), "unknown keys must stay visible");
  assert(leftover.missing.includes("missing_key"), "missing_key should be reported");
  const wa = toWhatsAppPositional(
    "Hello {{user_name}}, your consult with {{astrologer_name}} is confirmed at {{appointment_time}}.",
    ["user_name", "astrologer_name", "appointment_time"]
  );
  assert(wa === "Hello {{1}}, your consult with {{2}} is confirmed at {{3}}.", `WA positional got: ${wa}`);
  return { source, vars, rendered: out.rendered, whatsappPositional: wa };
}

function htmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function main() {
  loadEnvLocal();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase3-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const render = renderChecks();

  const migrate = spawnSync("npx", ["tsx", "scripts/db-migrate-platform.ts"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
  if (migrate.status !== 0) process.exit(migrate.status ?? 1);

  const { seedSandboxSecrets } = await import("../src/lib/platform/integrations/seed-sandbox.ts");
  const { getSql } = await import("../src/lib/db.ts");
  const {
    ensureCommTemplates,
    listTemplates,
    saveTemplateVersion,
    previewTemplate,
    sendTemplate,
    submitWhatsappTemplate,
    markWhatsappReview,
    dispatchEvent,
    processDueSends,
  } = await import("../src/lib/comms/engine.ts");
  const { resolveEmail } = await import("../src/lib/comms/resolve.ts");

  await seedSandboxSecrets();
  const seeded = await ensureCommTemplates();
  const sql = getSql();

  const listed = await listTemplates();
  assert(listed.templates.length >= 10, `expected preset templates, got ${listed.templates.length}`);
  const keys = new Set(listed.templates.map((t) => `${t.template_key}:${t.channel}`));
  for (const need of [
    "otp_verification:email",
    "welcome:email",
    "booking_confirmation:email",
    "payment_receipt:email",
    "consultation_reminder:email",
    "astrologer_approval:email",
    "subscription_expiry:email",
    "subscription_expiry:sms",
    "abandoned_cart:email",
    "daily_horoscope:whatsapp",
  ]) {
    assert(keys.has(need), `missing preset ${need}`);
  }
  const expiryRules = listed.rules.filter((r) => String(r.event_key) === "subscription_expiry");
  assert(expiryRules.length >= 2, "expiry email+SMS automation rules missing");
  assert(
    expiryRules.some((r) => Number(r.offset_hours) === -72),
    "3-day ( -72h ) expiry offset missing"
  );

  const receipt = listed.templates.find(
    (t) => String(t.template_key) === "payment_receipt" && String(t.channel) === "email"
  );
  assert(receipt, "payment_receipt email template missing");
  const actorRows = await sql`
    SELECT id, email, display_name, role, must_change_password FROM admin_staff LIMIT 1
  `;
  assert(actorRows[0], "admin_staff row required for audit actor_id FK");
  const actor = {
    id: String(actorRows[0].id),
    email: String(actorRows[0].email),
    display_name: String(actorRows[0].display_name),
    role: String(actorRows[0].role),
    must_change_password: Boolean(actorRows[0].must_change_password),
  };

  const v2 = await saveTemplateVersion(
    String(receipt.id),
    {
      subject: "{{brand_name}} receipt {{invoice_no}}",
      body: "Hello {{user_name}},\n\nWe received {{amount}}. Tax invoice {{invoice_no}} is attached in your account.\n\nThis is versioned copy.\n\n— {{brand_name}}",
    },
    actor
  );
  assert(Number(v2.version) >= 2, `expected version >= 2, got ${v2.version}`);

  const preview = await previewTemplate(String(receipt.id), {
    user_name: "Ananya",
    invoice_no: "CG-INV-2026-0008",
    amount: "₹499.00",
  });
  assert(preview.subject.includes("CG-INV-2026-0008"), "preview subject missing invoice");
  assert(preview.body.includes("Ananya"), "preview body missing user_name");
  assert(!preview.body.includes("{{amount}}"), "preview left {{amount}} unsubstituted");

  const emailResolved = await resolveEmail();
  const send = await sendTemplate({
    templateId: String(receipt.id),
    to: TEST_INBOX,
    vars: {
      user_name: "Ananya",
      invoice_no: "CG-INV-2026-0008",
      amount: "₹499.00",
    },
    actor,
  });
  assert(send.status === "sent", `email send status ${send.status}`);
  assert(send.to === TEST_INBOX, "sent to wrong inbox");
  assert(send.transport === emailResolved.transport, "transport mismatch");
  const liveSmtp = send.transport === "live" || send.transport === "sandbox_api";
  if (liveSmtp) {
    assert(!String(send.messageId).startsWith("smtp_sandbox_"), `expected real SMTP id, got ${send.messageId}`);
    assert(send.body.includes("Ananya"), "live body missing user_name");
    assert(send.body.includes("CG-INV-2026-0008"), "live body missing invoice_no");
    assert(send.body.includes("₹499.00"), "live body missing amount");
    assert(!send.body.includes("{{"), "live body still has unsubstituted placeholders");
  }

  const logRow = await sql`
    SELECT * FROM message_log
    WHERE to_addr = ${TEST_INBOX} AND template_key = ${"payment_receipt"}
    ORDER BY created_at DESC LIMIT 1
  `;
  assert(logRow[0], "message_log row missing");
  assert(String(logRow[0].rendered_body).includes("Ananya"), "log body not rendered");

  const waTpl = listed.templates.find(
    (t) => String(t.template_key) === "booking_confirmation" && String(t.channel) === "whatsapp"
  );
  assert(waTpl, "WhatsApp booking template missing");
  const submitted = await submitWhatsappTemplate(String(waTpl.id), actor);
  assert(submitted.status === "submitted", `WA submit status ${submitted.status}`);
  const subRow = await sql`
    SELECT * FROM whatsapp_template_submissions
    WHERE template_id = ${String(waTpl.id)}
    ORDER BY submitted_at DESC LIMIT 1
  `;
  assert(subRow[0], "whatsapp_template_submissions row missing");
  await markWhatsappReview(String(subRow[0].id), "approved", "Sandbox Meta review for Phase 3 evidence", actor);
  const afterReview = await sql`
    SELECT status, provider_response FROM whatsapp_template_submissions WHERE id = ${String(subRow[0].id)} LIMIT 1
  `;
  assert(String(afterReview[0]?.status) === "sandbox_approved", "sandbox mark must store sandbox_approved, not Meta approved");
  const mockResp = JSON.parse(String(afterReview[0]?.provider_response || "{}")) as { mock?: boolean };
  assert(mockResp.mock === true, "submission must remain mock Graph");
  const verAfter = await sql`
    SELECT status FROM message_template_versions WHERE id = ${String(subRow[0].version_id)} LIMIT 1
  `;
  assert(String(verAfter[0]?.status) === "sandbox_approved", "version must not be Meta-approved after mock review");

  const futureAnchor = new Date(Date.now() + 4 * 24 * 3600_000).toISOString();
  const scheduledDispatch = await dispatchEvent({
    eventKey: "subscription_expiry",
    vars: { user_name: "Ananya", plan_name: "Monthly Insight", expiry_date: "18 Aug 2026" },
    to: { email: TEST_INBOX, phone: TEST_PHONE },
    anchorAt: futureAnchor,
  });
  assert(
    scheduledDispatch.some((r) => r.scheduledFor),
    `expected scheduled row, got ${JSON.stringify(scheduledDispatch)}`
  );
  const queue = await sql`
    SELECT * FROM scheduled_sends WHERE to_addr = ${TEST_INBOX} AND status = ${"scheduled"}
    ORDER BY created_at DESC LIMIT 5
  `;
  assert(queue[0], "scheduled_sends row missing");

  const immediate = await dispatchEvent({
    eventKey: "subscription_expiry",
    vars: { user_name: "Ananya", plan_name: "Monthly Insight", expiry_date: "14 Aug 2026" },
    to: { email: TEST_INBOX, phone: TEST_PHONE },
    anchorAt: new Date().toISOString(),
  });
  assert(
    immediate.some((r) => (r as { sent?: { status?: string } }).sent?.status === "sent"),
    `expected immediate send, got ${JSON.stringify(immediate)}`
  );

  const dueDry = await processDueSends();

  const refreshed = await listTemplates();
  const waHtml = refreshed.templates
    .filter((t) => String(t.channel) === "whatsapp")
    .map(
      (t) =>
        `<article style="border:1px solid #ddd;padding:12px;margin:8px 0">
          <h3>${htmlEscape(String(t.name))}</h3>
          <p>status=${htmlEscape(String(t.status))} category=${htmlEscape(String(t.wa_category))} v${htmlEscape(String(t.current_version))}</p>
          <pre>${htmlEscape(String(t.body))}</pre>
        </article>`
    )
    .join("");
  const subHtml = refreshed.submissions
    .map(
      (s) =>
        `<tr><td>${htmlEscape(String(s.meta_template_name))}</td><td>${htmlEscape(String(s.status))}</td><td>${htmlEscape(String(s.submitted_at))}</td></tr>`
    )
    .join("");

  fs.writeFileSync(
    path.join(outDir, "render-preview.html"),
    `<!doctype html><html><head><meta charset="utf-8"><title>Phase 3 render</title></head>
<body style="font-family:system-ui;padding:24px;max-width:720px">
<h1>Payment receipt — variables substituted</h1>
<h2>Source</h2><pre>${htmlEscape(render.source)}</pre>
<h2>Vars</h2><pre>${htmlEscape(JSON.stringify(render.vars, null, 2))}</pre>
<h2>Rendered (engine preview)</h2>
<p><strong>${htmlEscape(preview.subject)}</strong></p>
<pre>${htmlEscape(preview.body)}</pre>
<p>WhatsApp positional: <code>${htmlEscape(render.whatsappPositional)}</code></p>
</body></html>`
  );
  fs.writeFileSync(
    path.join(outDir, "whatsapp-submission.html"),
    `<!doctype html><html><head><meta charset="utf-8"><title>WhatsApp submission</title></head>
<body style="font-family:system-ui;padding:24px;max-width:900px">
<h1>WhatsApp template submission flow</h1>
<p>Meta-approved templates are required for business-initiated messages outside the 24-hour window. Super Admin tracks submit → pending → <strong>MOCK sandbox_approved</strong> (not Meta) or, after a real Graph callback, <strong>approved</strong>. Graph is not called while the vault token is sandbox.</p>
<h2>Templates</h2>${waHtml}
<h2>Submissions</h2>
<table border="1" cellpadding="8"><thead><tr><th>Name</th><th>Status</th><th>Submitted</th></tr></thead>
<tbody>${subHtml}</tbody></table>
<p>Evidence submission: ${htmlEscape(String(subRow[0].meta_template_name))} → submitted then marked <strong>sandbox_approved (MOCK — not Meta)</strong>.</p>
</body></html>`
  );
  fs.writeFileSync(
    path.join(outDir, "automations.html"),
    `<!doctype html><html><head><meta charset="utf-8"><title>Automations</title></head>
<body style="font-family:system-ui;padding:24px;max-width:900px">
<h1>Automation rules</h1>
<ul>${refreshed.rules.map((r) => `<li>${htmlEscape(String(r.name))} — ${htmlEscape(String(r.event_key))} / ${htmlEscape(String(r.channel))} offset ${htmlEscape(String(r.offset_hours))}h</li>`).join("")}</ul>
<h2>Scheduled queue (4-day expiry anchor, −72h offset)</h2>
<pre>${htmlEscape(JSON.stringify(scheduledDispatch, null, 2))}</pre>
<h2>Immediate (anchor now)</h2>
<pre>${htmlEscape(JSON.stringify(immediate, null, 2))}</pre>
</body></html>`
  );

  const report = {
    ok: true,
    seeded,
    render,
    preview,
    smtp: {
      inbox: TEST_INBOX,
      transport: send.transport,
      slotKey: send.slotKey,
      messageId: send.messageId,
      status: send.status,
      deliveredToGmail: liveSmtp
        ? "attempted via nodemailer/SMTP — check inbox"
        : "NOT delivered — vault SMTP still mock (sandbox_smtp_*). Paste real host + app password in Super Admin → Integrations to reach Gmail.",
      live: liveSmtp,
      host: String(emailResolved.ctx.config.host || "") || null,
      logId: logRow[0].id,
      renderedBody: String(logRow[0].rendered_body),
    },
    whatsapp: {
      template: String(waTpl.template_key),
      submitStatus: submitted.status,
      mockGraph: Boolean((submitted.providerResponse as { mock?: boolean })?.mock),
      afterReview: String(afterReview[0]?.status),
      metaApproved: false,
      note: "sandbox_approved is Super Admin mock review. Live send requires status=approved AND provider_response.mock !== true.",
    },
    automations: {
      rules: refreshed.rules.map((r) => ({
        name: r.name,
        event: r.event_key,
        channel: r.channel,
        offsetHours: r.offset_hours,
      })),
      scheduledDispatch,
      immediate,
      queueCount: queue.length,
      processDue: dueDry,
    },
    templateCount: refreshed.templates.length,
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
