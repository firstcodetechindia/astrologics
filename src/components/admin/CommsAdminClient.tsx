"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { EVENT_KEYS } from "@/lib/comms/catalog";
import { whatsappStatusLabel, submissionLooksMock, isSandboxWhatsappStatus } from "@/lib/comms/fixtures";

type Tab = "templates" | "whatsapp" | "automations" | "log" | "send";

type TemplateRow = {
  id: string;
  template_key: string;
  channel: string;
  name: string;
  description: string;
  event_key: string;
  variables_json: string;
  current_version: number;
  status: string;
  subject: string;
  body: string;
  wa_category: string;
};

type SubmissionRow = {
  id: string;
  template_id: string;
  meta_template_name: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string;
  provider_slot: string;
  provider_response: string;
};

type RuleRow = {
  id: string;
  name: string;
  event_key: string;
  template_id: string;
  template_name: string;
  template_key: string;
  channel: string;
  offset_hours: number;
  enabled: boolean;
};

type LogRow = {
  id: string;
  channel: string;
  template_key: string;
  version: number;
  to_addr: string;
  subject: string;
  rendered_body: string;
  transport: string;
  status: string;
  error: string;
  created_at: string;
};

type ScheduledRow = {
  id: string;
  fire_at: string;
  channel: string;
  to_addr: string;
  status: string;
};

function parseVars(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function CommsAdminClient({ section }: { section?: Tab }) {
  const focused = Boolean(section);
  const [tab, setTab] = useState<Tab>(section || "templates");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [log, setLog] = useState<LogRow[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledRow[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/comms", { cache: "no-store" });
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      templates?: TemplateRow[];
      submissions?: SubmissionRow[];
      rules?: RuleRow[];
      log?: LogRow[];
      scheduled?: ScheduledRow[];
    };
    if (!json.ok) {
      setError(json.error || "Failed to load communications");
      return;
    }
    setError("");
    setTemplates(json.templates || []);
    setSubmissions(json.submissions || []);
    setRules(json.rules || []);
    setLog(json.log || []);
    setScheduled(json.scheduled || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (section) setTab(section);
  }, [section]);

  const titles: Record<Tab, { title: string; blurb: string }> = {
    templates: {
      title: "Templates",
      blurb: "Versioned email, SMS, and WhatsApp copy with {{placeholders}}. Save creates a new version.",
    },
    whatsapp: {
      title: "WhatsApp approval",
      blurb: "Mock Super Admin review is sandbox_approved — not Meta. Live send requires a Graph approval.",
    },
    automations: {
      title: "Automations",
      blurb: "When an event fires, send a template on a channel. Negative offset hours schedule before the anchor.",
    },
    log: {
      title: "Send log",
      blurb: "Recent SMTP / SMS / WhatsApp attempts, including mock vs live transport.",
    },
    send: {
      title: "Send test",
      blurb: "Fire one template through the vault adapter. Default inbox is the SMTP evidence address.",
    },
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "templates", label: "Templates" },
    { id: "whatsapp", label: "WhatsApp approval" },
    { id: "automations", label: "Automations" },
    { id: "log", label: "Send log" },
    { id: "send", label: "Send test" },
  ];

  const meta = titles[tab];
  const showTemplates = tab === "templates";
  const showWhatsapp = tab === "whatsapp" || (focused && section === "templates");
  const showSend = tab === "send" || (focused && section === "templates");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
          Communications
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">{meta.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">{meta.blurb}</p>
      </header>
      {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
      {notice ? <p className="text-sm text-saffron">{notice}</p> : null}
      {focused ? null : (
      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`min-h-11 rounded-full px-3 text-sm ${
              tab === t.id ? "bg-white/15 text-white" : "bg-white/5 text-ink-muted"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      )}
      {showTemplates ? (
        <TemplatesPane
          templates={templates}
          onSaved={() => {
            setNotice("Template version saved.");
            void load();
          }}
        />
      ) : null}
      {showWhatsapp ? (
        <WhatsappPane
          templates={templates.filter((t) => t.channel === "whatsapp")}
          submissions={submissions}
          onChanged={() => {
            setNotice("WhatsApp submission updated.");
            void load();
          }}
        />
      ) : null}
      {tab === "automations" ? (
        <AutomationsPane
          templates={templates}
          rules={rules}
          scheduled={scheduled}
          onChanged={() => {
            setNotice("Automation updated.");
            void load();
          }}
        />
      ) : null}
      {tab === "log" ? <LogPane log={log} /> : null}
      {showSend ? (
        <SendTestPane
          templates={templates}
          onSent={() => {
            setNotice("Test send recorded in the log.");
            void load();
          }}
        />
      ) : null}
    </div>
  );
}

function TemplatesPane({
  templates,
  onSaved,
}: {
  templates: TemplateRow[];
  onSaved: () => void;
}) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id || "");
  const selected = templates.find((t) => t.id === selectedId) || templates[0];
  const [subject, setSubject] = useState(selected?.subject || "");
  const [body, setBody] = useState(selected?.body || "");
  const [preview, setPreview] = useState<{ subject: string; body: string; missing: string[] } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setSelectedId(selected.id);
    setSubject(selected.subject || "");
    setBody(selected.body || "");
    setPreview(null);
  }, [selected?.id]);

  const vars = useMemo(() => parseVars(selected?.variables_json || "[]"), [selected]);

  async function save() {
    if (!selected) return;
    setBusy(true);
    await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save-version",
        templateId: selected.id,
        subject,
        bodyText: body,
        waCategory: selected.wa_category,
      }),
    });
    setBusy(false);
    onSaved();
  }

  async function runPreview() {
    if (!selected) return;
    const sample: Record<string, string> = {};
    for (const v of vars) sample[v] = sampleValue(v);
    const res = await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "preview", templateId: selected.id, vars: sample }),
    });
    const json = await res.json();
    if (json.ok) setPreview(json.preview);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
      <div className="surface-panel max-h-[28rem] space-y-1 overflow-y-auto p-2">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`flex min-h-11 w-full min-w-0 flex-col items-start rounded-xl px-3 py-2 text-left text-sm ${
              selected?.id === t.id ? "bg-white/15 text-white" : "text-ink-muted hover:bg-white/5"
            }`}
            onClick={() => setSelectedId(t.id)}
          >
            <span className="min-w-0 break-words">{t.name}</span>
            <span className="text-[11px] uppercase tracking-wide">
              {t.channel} · v{t.current_version} · {t.status}
            </span>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="surface-panel min-w-0 space-y-3 p-4">
          <p className="text-sm text-ink-muted">{selected.description}</p>
          <p className="text-xs text-ink-muted">
            Variables: {vars.map((v) => `{{${v}}}`).join(" ")}
          </p>
          {selected.channel === "email" ? (
            <label className="block text-sm text-ink-muted">
              Subject
              <input className="field mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
          ) : null}
          <label className="block text-sm text-ink-muted">
            Body
            <textarea
              className="field mt-1 min-h-40"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          {selected.channel === "whatsapp" ? (
            <p className="text-xs text-saffron">
              Saving a WhatsApp edit creates a new draft version. Submit it from the WhatsApp
              approval tab — Meta must approve before business-initiated send.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-grad min-h-11 px-4 text-sm"
              disabled={busy}
              onClick={() => void save()}
            >
              Save new version
            </button>
            <button
              type="button"
              className="btn-secondary-cosmic min-h-11 px-4 text-sm"
              onClick={() => void runPreview()}
            >
              Preview with sample vars
            </button>
          </div>
          {preview ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white">
              {preview.subject ? <p className="font-medium">{preview.subject}</p> : null}
              <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-ink-muted">
                {preview.body}
              </pre>
              {preview.missing.length ? (
                <p className="mt-2 text-cosmic-pink">Missing: {preview.missing.join(", ")}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function WhatsappPane({
  templates,
  submissions,
  onChanged,
}: {
  templates: TemplateRow[];
  submissions: SubmissionRow[];
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState("");
  const [reason, setReason] = useState("Sandbox review recorded from Super Admin.");

  async function submit(templateId: string) {
    setBusy(templateId);
    await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submit-whatsapp", templateId }),
    });
    setBusy("");
    onChanged();
  }

  async function review(submissionId: string, status: "approved" | "rejected") {
    setBusy(submissionId);
    await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review-whatsapp", submissionId, status, reason }),
    });
    setBusy("");
    onChanged();
  }

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-ink-muted">
        Meta requires an approved template for business-initiated WhatsApp outside the 24-hour
        customer-care window. Super Admin can mark a <strong>MOCK</strong> sandbox review while
        the vault token is fake — that is <strong>not</strong> Meta approval. Live Graph send
        only accepts status <code>approved</code> from a non-mock Graph response.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {templates.map((t) => (
          <div key={t.id} className="surface-panel min-w-0 space-y-2 p-4">
            <p className="break-words font-medium text-white">{t.name}</p>
            <p className="text-xs uppercase text-ink-muted">
              {t.wa_category} · {whatsappStatusLabel(t.status)} · v{t.current_version}
            </p>
            {isSandboxWhatsappStatus(t.status) ? (
              <p className="text-xs text-saffron">MOCK approval — Meta Graph was not called.</p>
            ) : null}
            <pre className="whitespace-pre-wrap break-words text-sm text-ink-muted">{t.body}</pre>
            <button
              type="button"
              className="btn-grad min-h-11 w-full px-4 text-sm sm:w-auto"
              disabled={busy === t.id}
              onClick={() => void submit(t.id)}
            >
              Submit to Meta for review
            </button>
          </div>
        ))}
      </div>
      <label className="block max-w-xl text-sm text-ink-muted">
        Sandbox rejection reason (optional)
        <input className="field mt-1" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <Table
        headers={["Template", "Status", "Submitted", "Reviewed", "Actions"]}
        rows={submissions.map((s) => [
          s.meta_template_name,
          whatsappStatusLabel(s.status) +
            (submissionLooksMock(s.provider_response || "") ? " · mock Graph" : ""),
          s.submitted_at.slice(0, 19),
          s.reviewed_at ? String(s.reviewed_at).slice(0, 19) : "—",
          s.status === "submitted" || s.status === "pending" ? s.id : "",
        ])}
        actionFor={(id) =>
          id ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-grad min-h-11 px-3 text-sm"
                disabled={busy === id}
                onClick={() => void review(id, "approved")}
              >
              Mark MOCK approved (not Meta)
            </button>
            <button
              type="button"
              className="btn-secondary-cosmic min-h-11 px-3 text-sm"
              disabled={busy === id}
              onClick={() => void review(id, "rejected")}
            >
              Mark MOCK rejected
            </button>
            </div>
          ) : (
            "—"
          )
        }
      />
    </div>
  );
}

function AutomationsPane({
  templates,
  rules,
  scheduled,
  onChanged,
}: {
  templates: TemplateRow[];
  rules: RuleRow[];
  scheduled: ScheduledRow[];
  onChanged: () => void;
}) {
  const [name, setName] = useState("When booking confirmed — email");
  const [eventKey, setEventKey] = useState<string>("booking_confirmed");
  const [templateId, setTemplateId] = useState(templates.find((t) => t.channel === "email")?.id || "");
  const [offsetHours, setOffsetHours] = useState("0");
  const [busy, setBusy] = useState(false);

  async function save() {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    setBusy(true);
    await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save-rule",
        name,
        eventKey,
        templateId,
        channel: tpl.channel,
        offsetHours: Number(offsetHours),
        enabled: true,
      }),
    });
    setBusy(false);
    onChanged();
  }

  async function toggle(rule: RuleRow) {
    await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save-rule",
        ruleId: rule.id,
        name: rule.name,
        eventKey: rule.event_key,
        templateId: rule.template_id,
        channel: rule.channel,
        offsetHours: rule.offset_hours,
        enabled: !rule.enabled,
      }),
    });
    onChanged();
  }

  async function processDue() {
    await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "process-due" }),
    });
    onChanged();
  }

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-ink-muted">
        When an event fires, each enabled rule sends its template on that channel. Negative
        offset hours schedule before the anchor (expiry at T, offset −72h = send 3 days before).
      </p>
      <div className="surface-panel max-w-xl space-y-3 p-4">
        <label className="block text-sm text-ink-muted">
          Rule name
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm text-ink-muted">
          Event
          <select className="field mt-1" value={eventKey} onChange={(e) => setEventKey(e.target.value)}>
            {EVENT_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-ink-muted">
          Template
          <select className="field mt-1" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-ink-muted">
          Offset hours (negative = before anchor)
          <input
            className="field mt-1"
            inputMode="numeric"
            value={offsetHours}
            onChange={(e) => setOffsetHours(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="btn-grad min-h-11 px-4 text-sm"
          disabled={busy}
          onClick={() => void save()}
        >
          Save automation
        </button>
      </div>
      <Table
        headers={["Rule", "Event", "Channel", "Offset", "Enabled"]}
        rows={rules.map((r) => [
          r.name,
          r.event_key,
          r.channel,
          String(r.offset_hours),
          r.enabled ? "on" : "off",
        ])}
      />
      <div className="flex flex-wrap gap-2">
        {rules.map((r) => (
          <button
            key={r.id}
            type="button"
            className="btn-secondary-cosmic min-h-11 px-3 text-sm"
            onClick={() => void toggle(r)}
          >
            Toggle {r.channel} {r.event_key}
          </button>
        ))}
        <button
          type="button"
          className="btn-grad min-h-11 px-4 text-sm"
          onClick={() => void processDue()}
        >
          Process due sends
        </button>
      </div>
      <h2 className="font-display text-lg text-white">Scheduled queue</h2>
      <Table
        headers={["Fire at", "Channel", "To", "Status"]}
        rows={scheduled.map((s) => [String(s.fire_at).slice(0, 19), s.channel, s.to_addr, s.status])}
      />
    </div>
  );
}

function LogPane({ log }: { log: LogRow[] }) {
  return (
    <Table
      headers={["When", "Channel", "Template", "To", "Transport", "Status"]}
      rows={log.map((r) => [
        String(r.created_at).slice(0, 19),
        r.channel,
        r.template_key,
        r.to_addr,
        r.transport,
        r.status + (r.error ? ` (${r.error})` : ""),
      ])}
    />
  );
}

function SendTestPane({
  templates,
  onSent,
}: {
  templates: TemplateRow[];
  onSent: () => void;
}) {
  const emailTpl = templates.find((t) => t.template_key === "payment_receipt" && t.channel === "email");
  const [templateId, setTemplateId] = useState(emailTpl?.id || templates[0]?.id || "");
  const selected = templates.find((t) => t.id === templateId);
  const [to, setTo] = useState("apps.ananyasoftware@gmail.com");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const vars = parseVars(selected?.variables_json || "[]");
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const v of vars) next[v] = sampleValue(v);
    setValues(next);
  }, [templateId]);

  async function send() {
    setBusy(true);
    setResult("");
    const res = await fetch("/api/admin/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send-test", templateId, to, vars: values }),
    });
    const json = await res.json();
    setBusy(false);
    setResult(JSON.stringify(json, null, 2));
    if (json.ok) onSent();
  }

  return (
    <div className="surface-panel max-w-xl space-y-3 p-4">
      <p className="text-sm text-ink-muted">
        Sends through the Phase 1 vault adapter (SMTP / SMS / WhatsApp). Live Gmail delivery
        needs real SMTP credentials in Integrations — sandbox seeds stay mock.
      </p>
      <label className="block text-sm text-ink-muted">
        Template
        <select className="field mt-1" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-ink-muted">
        Destination
        <input className="field mt-1" value={to} onChange={(e) => setTo(e.target.value)} />
      </label>
      {vars.map((v) => (
        <label key={v} className="block text-sm text-ink-muted">
          {`{{${v}}}`}
          <input
            className="field mt-1"
            value={values[v] || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
          />
        </label>
      ))}
      <button
        type="button"
        className="btn-grad min-h-11 px-4 text-sm"
        disabled={busy}
        onClick={() => void send()}
      >
        Send test
      </button>
      {result ? (
        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-black/30 p-3 text-xs text-ink-muted">
          {result}
        </pre>
      ) : null}
    </div>
  );
}

function sampleValue(key: string) {
  const map: Record<string, string> = {
    user_name: "Ananya",
    astrologer_name: "Pandit Sharma",
    appointment_time: "16 Aug 2026, 4:30 PM IST",
    otp_code: "112233",
    invoice_no: "CG-INV-2026-0008",
    amount: "₹499.00",
    plan_name: "Monthly Insight",
    expiry_date: "17 Aug 2026",
    product_name: "Rudraksha kit",
    brand_name: "CosmicGyan",
  };
  return map[key] || key;
}

function Table({
  headers,
  rows,
  actionFor,
}: {
  headers: string[];
  rows: string[][];
  actionFor?: (lastCell: string) => ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-[640px] w-full text-left text-sm">
        <thead className="bg-white/5 text-ink-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-white/10">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 text-white">
                  {actionFor && j === r.length - 1 ? actionFor(c) : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
