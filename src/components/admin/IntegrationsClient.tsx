"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Cloud,
  Cpu,
  CreditCard,
  IndianRupee,
  Mail,
  Mailbox,
  MessageCircle,
  MessageSquare,
  Mic,
  Phone,
  Plug,
  Send,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { IntegrationCategory, ProviderPublicView, SecretPublicView, TestCallResult } from "@/lib/platform/integrations/types";
import { CATEGORY_LABELS } from "@/lib/platform/integrations/catalog";
import { cn } from "@/lib/utils";

const INTEGRATION_TABS: { id: string; label: string; categories: IntegrationCategory[] }[] = [
  { id: "llm", label: "LLM Providers", categories: ["llm"] },
  { id: "payment", label: "Payment", categories: ["payment"] },
  { id: "communications", label: "Communications", categories: ["sms", "email", "whatsapp"] },
  { id: "voice", label: "Voice", categories: ["voice"] },
  { id: "social", label: "Social", categories: ["social"] },
  { id: "auth", label: "Auth", categories: ["auth"] },
];

export function IntegrationsClient() {
  const [providers, setProviders] = useState<ProviderPublicView[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [tests, setTests] = useState<Record<string, TestCallResult>>({});
  const [proof, setProof] = useState<Record<string, unknown> | null>(null);
  const [flags, setFlags] = useState<{ auth0: { flag: boolean; credentialsConfigured: boolean; activePath: string } } | null>(null);
  const [tab, setTab] = useState(INTEGRATION_TABS[0]!.id);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/integrations", { cache: "no-store" });
    const data = (await res.json()) as { ok: boolean; providers?: ProviderPublicView[]; error?: string };
    if (!data.ok) {
      setError(data.error || "Failed to load integrations");
      return;
    }
    setProviders(data.providers || []);
    const flagRes = await fetch("/api/admin/flags", { cache: "no-store" });
    const flagData = await flagRes.json();
    if (flagData.ok) setFlags(flagData);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(() => {
    const map = new Map<IntegrationCategory, ProviderPublicView[]>();
    for (const p of providers) {
      const list = map.get(p.category) || [];
      list.push(p);
      map.set(p.category, list);
    }
    return map;
  }, [providers]);

  async function patch(providerId: string, body: Record<string, unknown>) {
    setBusyId(providerId);
    setError("");
    const res = await fetch("/api/admin/integrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, ...body }),
    });
    const data = await res.json();
    setBusyId("");
    if (!data.ok) {
      setError(data.error || "Update failed");
      return;
    }
    setProviders(data.providers);
  }

  async function saveSecret(p: ProviderPublicView, secretName: string) {
    const key = `${p.id}:${secretName}`;
    const value = drafts[key];
    if (!value?.trim()) {
      setError("Paste a value before saving.");
      return;
    }
    setBusyId(key);
    setError("");
    const res = await fetch("/api/admin/integrations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: p.id,
        category: p.category,
        slotKey: p.slotKey,
        secretName,
        value,
      }),
    });
    const data = await res.json();
    setBusyId("");
    if (!data.ok) {
      setError(data.error || "Save failed");
      return;
    }
    setProviders(data.providers);
    setDrafts((d) => ({ ...d, [key]: "" }));
  }

  async function removeSecret(p: ProviderPublicView, secretName: string) {
    if (!confirm(`Delete ${secretName} for ${p.displayName}?`)) return;
    setBusyId(`${p.id}:${secretName}`);
    const res = await fetch(
      `/api/admin/integrations?providerId=${encodeURIComponent(p.id)}&secretName=${encodeURIComponent(secretName)}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    setBusyId("");
    if (!data.ok) {
      setError(data.error || "Delete failed");
      return;
    }
    setProviders(data.providers);
  }

  async function testProvider(p: ProviderPublicView) {
    setBusyId(`test:${p.id}`);
    const res = await fetch("/api/admin/integrations/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId: p.id }),
    });
    const data = await res.json();
    setBusyId("");
    if (!data.ok) {
      setError(data.error || "Test failed");
      return;
    }
    setTests((t) => ({ ...t, [p.id]: data.result }));
  }

  async function loadProof(p: ProviderPublicView, secretName: string) {
    const res = await fetch(
      `/api/admin/integrations/proof?providerId=${encodeURIComponent(p.id)}&secretName=${encodeURIComponent(secretName)}`
    );
    const data = await res.json();
    setProof(data);
  }

  async function toggleAuth0(enabled: boolean) {
    const res = await fetch("/api/admin/flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "auth0_enabled", enabled }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || "Flag update failed");
      return;
    }
    await load();
  }

  const activeTab = INTEGRATION_TABS.find((t) => t.id === tab) || INTEGRATION_TABS[0]!;
  const visibleCategories = activeTab.categories;

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--admin-accent)]">
          System
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-[1.85rem]">
          Integrations & secrets vault
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Vendor keys are entered here, encrypted at rest, and never shown in full again.
          Stored secrets stay masked. Click Rotate to change a value — typing in a locked
          field does nothing.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {INTEGRATION_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={cn(
              "admin-tab min-h-11 rounded-full px-3 text-sm",
              tab === t.id && "is-active"
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "auth" && flags ? (
        <section className="surface-panel p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white">Auth0 feature flag</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Active login path: <span className="text-white">{flags.auth0.activePath}</span>
                {flags.auth0.credentialsConfigured ? " · credentials in vault" : " · credentials not saved yet"}
                . Dummy OTP stays until you flip this on.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary-cosmic min-h-11 shrink-0 px-4 text-sm"
              onClick={() => void toggleAuth0(!flags.auth0.flag)}
            >
              {flags.auth0.flag ? "Turn Auth0 OFF" : "Turn Auth0 ON"}
            </button>
          </div>
        </section>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-cosmic-pink/40 bg-cosmic-pink/10 px-3 py-2 text-sm text-cosmic-pink">
          {error}
        </p>
      ) : null}

      {Array.from(grouped.entries())
        .filter(([category]) => visibleCategories.includes(category))
        .map(([category, list]) => (
        <section key={category} className="space-y-3">
          <h2 className="text-lg font-semibold text-white">{CATEGORY_LABELS[category]}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {list.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                busyId={busyId}
                drafts={drafts}
                test={tests[p.id]}
                onDraft={(k, v) => setDrafts((d) => ({ ...d, [k]: v }))}
                onToggleEnabled={() => void patch(p.id, { enabled: !p.enabled })}
                onToggleSandbox={() => void patch(p.id, { sandboxMode: !p.sandboxMode })}
                onSaveConfig={(config) => void patch(p.id, { config })}
                onSaveSecret={(name) => void saveSecret(p, name)}
                onDeleteSecret={(name) => void removeSecret(p, name)}
                onTest={() => void testProvider(p)}
                onProof={(name) => void loadProof(p, name)}
              />
            ))}
          </div>
        </section>
      ))}

      {proof ? (
        <section className="surface-panel p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Encryption proof</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Raw database ciphertext vs masked UI. Full plaintext is never returned.
          </p>
          <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-black/40 p-3 text-xs leading-relaxed text-ink-muted">
            {JSON.stringify(proof, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  );
}

function ProviderCard({
  provider: p,
  busyId,
  drafts,
  test,
  onDraft,
  onToggleEnabled,
  onToggleSandbox,
  onSaveConfig,
  onSaveSecret,
  onDeleteSecret,
  onTest,
  onProof,
}: {
  provider: ProviderPublicView;
  busyId: string;
  drafts: Record<string, string>;
  test?: TestCallResult;
  onDraft: (key: string, value: string) => void;
  onToggleEnabled: () => void;
  onToggleSandbox: () => void;
  onSaveConfig: (config: Record<string, unknown>) => void;
  onSaveSecret: (name: string) => void;
  onDeleteSecret: (name: string) => void;
  onTest: () => void;
  onProof: (name: string) => void;
}) {
  const [configDraft, setConfigDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(p.config)) {
      next[k] = v == null ? "" : String(v);
    }
    setConfigDraft(next);
  }, [p.id, p.config]);

  return (
    <article className="surface-panel flex min-w-0 flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          <span className={cn("admin-metric-badge shrink-0", providerBadgeTone(p.slotKey, p.category))}>
            <ProviderGlyph slotKey={p.slotKey} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-white">{p.displayName}</h3>
              {p.isPrimary ? (
                <span className="rounded-full bg-cosmic-gold/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cosmic-gold">
                  Primary
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToggleChip
          variant={p.enabled ? "on" : "off"}
          onClick={onToggleEnabled}
          label={p.enabled ? "Enabled" : "Disabled"}
        />
        <ToggleChip
          variant={p.sandboxMode ? "sandbox" : "live"}
          onClick={onToggleSandbox}
          label={p.sandboxMode ? "Sandbox" : "Live"}
        />
      </div>

      <div className="space-y-3">
        {p.secrets.map((s) => (
          <SecretField
            key={s.name}
            secret={s}
            inputType={p.secretFields.find((f) => f.name === s.name)?.inputType}
            draftKey={`${p.id}:${s.name}`}
            draft={drafts[`${p.id}:${s.name}`] || ""}
            busy={busyId === `${p.id}:${s.name}`}
            onDraft={onDraft}
            onSave={() => onSaveSecret(s.name)}
            onDelete={() => onDeleteSecret(s.name)}
            onProof={() => onProof(s.name)}
          />
        ))}
      </div>

      {p.configFields.length > 0 ? (
        <div className="space-y-3">
          {p.configFields.map((field) => (
            <label key={field.name} className="block text-sm text-ink-muted">
              {field.label}
              {field.inputType === "select" ? (
                <select
                  className="field mt-1"
                  value={configDraft[field.name] || ""}
                  onChange={(e) =>
                    setConfigDraft((c) => ({ ...c, [field.name]: e.target.value }))
                  }
                >
                  <option value="">Select…</option>
                  {(field.options || []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="field mt-1"
                  type={field.inputType === "number" ? "number" : "text"}
                  inputMode={field.inputType === "number" ? "numeric" : undefined}
                  placeholder={field.placeholder}
                  value={configDraft[field.name] || ""}
                  onChange={(e) =>
                    setConfigDraft((c) => ({ ...c, [field.name]: e.target.value }))
                  }
                />
              )}
            </label>
          ))}
          <button
            type="button"
            className="btn-secondary-cosmic min-h-11 px-3 text-sm"
            onClick={() => onSaveConfig(configDraft)}
          >
            Save settings (host, port, from — not username/password)
          </button>
        </div>
      ) : null}

      {p.usage.length > 0 ? (
        <p className="text-xs text-ink-muted">
          Last 30 days:{" "}
          {p.usage.map((u) => `${u.metric} ${u.quantity}`).join(" · ")}
        </p>
      ) : null}

      <button
        type="button"
        className="btn-grad min-h-11 px-3 text-sm"
        disabled={busyId === `test:${p.id}`}
        onClick={onTest}
      >
        {busyId === `test:${p.id}` ? "Testing…" : "Test connection"}
      </button>
      {test ? (
        <p
          className={cn(
            "text-sm",
            test.ok ? "text-emerald-400" : "text-cosmic-pink"
          )}
        >
          {test.ok ? "OK" : "FAIL"} · {test.transport} · {test.latencyMs}ms — {test.message}
        </p>
      ) : null}
    </article>
  );
}

function SecretField({
  secret: s,
  inputType,
  draftKey,
  draft,
  busy,
  onDraft,
  onSave,
  onDelete,
  onProof,
}: {
  secret: SecretPublicView;
  inputType?: "password" | "text";
  draftKey: string;
  draft: string;
  busy: boolean;
  onDraft: (key: string, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onProof: () => void;
}) {
  const [rotating, setRotating] = useState(!s.configured);
  const visibleWhileTyping = inputType === "text";

  useEffect(() => {
    if (s.configured) setRotating(false);
    else setRotating(true);
  }, [s.configured, s.masked]);

  const locked = s.configured && !rotating;

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-white">{s.label}</p>
        <p className="font-mono text-xs text-ink-muted">{s.masked}</p>
      </div>
      {locked ? (
        <div className="mt-2 rounded-xl border border-saffron/40 bg-saffron/15 px-3 py-2 text-sm text-saffron">
          Already in vault — click Rotate to change. The stored value is never shown in this box.
        </div>
      ) : (
        <div className="mt-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">
          {s.configured ? "Enter new value, then Save. Cancel keeps the stored secret." : "Not in the vault yet. Paste a value and Save."}
        </div>
      )}
      <div className="relative mt-2">
        <input
          className={cn("field", locked && "cursor-not-allowed pr-3 opacity-60 sm:pr-40")}
          type={locked ? "text" : visibleWhileTyping ? "text" : "password"}
          autoComplete={visibleWhileTyping ? "username" : "new-password"}
          spellCheck={false}
          disabled={locked}
          readOnly={locked}
          placeholder={locked ? s.masked : visibleWhileTyping ? "Username or email — visible while typing" : "Paste secret"}
          value={locked ? "" : draft}
          onChange={(e) => onDraft(draftKey, e.target.value)}
        />
        {locked ? (
          <button
            type="button"
            className="btn-grad mt-2 min-h-11 w-full px-3 text-sm sm:absolute sm:right-1 sm:top-1/2 sm:mt-0 sm:w-auto sm:-translate-y-1/2"
            onClick={() => setRotating(true)}
          >
            Rotate to change
          </button>
        ) : null}
      </div>
      {locked ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn-secondary-cosmic min-h-11 px-3 text-sm" onClick={onProof}>
            Show DB proof
          </button>
          <button type="button" className="min-h-11 rounded-xl px-3 text-sm text-cosmic-pink" onClick={onDelete}>
            Delete
          </button>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn-grad min-h-11 px-3 text-sm" disabled={busy} onClick={onSave}>
            Save
          </button>
          {s.configured ? (
            <button
              type="button"
              className="btn-secondary-cosmic min-h-11 px-3 text-sm"
              onClick={() => {
                onDraft(draftKey, "");
                setRotating(false);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ToggleChip({
  variant,
  onClick,
  label,
}: {
  variant: "on" | "off" | "sandbox" | "live";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "admin-status-pill",
        variant === "on" && "is-on",
        variant === "off" && "is-off",
        variant === "sandbox" && "is-sandbox",
        variant === "live" && "is-live"
      )}
    >
      {label}
    </button>
  );
}

const SLOT_ICONS: Record<string, LucideIcon> = {
  openai: Sparkles,
  anthropic: Cpu,
  custom_llm: Cpu,
  elevenlabs: AudioLines,
  custom_voice: Mic,
  razorpay: IndianRupee,
  stripe: CreditCard,
  generic_sms: Smartphone,
  smtp: Mail,
  sendgrid: Send,
  postmark: Mailbox,
  ses: Cloud,
  meta_whatsapp: MessageCircle,
  gupshup_whatsapp: MessageSquare,
  twilio_whatsapp: Phone,
  meta_social: Share2,
  linkedin: Share2,
  twitter: Share2,
  auth0: Shield,
};

function ProviderGlyph({ slotKey }: { slotKey: string }) {
  const Icon = SLOT_ICONS[slotKey] || Plug;
  return <Icon className="h-5 w-5" aria-hidden />;
}

function providerBadgeTone(slotKey: string, category: IntegrationCategory) {
  if (slotKey === "razorpay" || category === "payment") return "bg-emerald-500/15 text-emerald-400";
  if (category === "email" || category === "sms" || category === "whatsapp") {
    return "bg-sky-500/15 text-sky-400";
  }
  if (category === "llm" || category === "voice") return "bg-[rgba(125,82,255,0.18)] text-[var(--admin-accent)]";
  if (category === "auth") return "bg-amber-500/15 text-amber-400";
  return "bg-white/10 text-white";
}
