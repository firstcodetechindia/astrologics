"use client";

import { useEffect, useState } from "react";

type Persona = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  systemPrompt: string;
  tone: string;
  llmSlot: string;
  llmModel: string;
  allowedTopics: string[];
  escalateToHuman: boolean;
  factFilterRequired: boolean;
  enabled: boolean;
};

type LlmSlot = { slotKey: string; displayName: string };

export function AiPersonasClient() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [slots, setSlots] = useState<LlmSlot[]>([]);
  const [selected, setSelected] = useState<Persona | null>(null);
  const [busy, setBusy] = useState("");
  const [preview, setPreview] = useState("");
  const [filterNote, setFilterNote] = useState("");

  async function reload() {
    const res = await fetch("/api/admin/ai", { cache: "no-store" });
    const json = await res.json();
    if (!json.ok) return;
    setPersonas(json.personas || []);
    setSlots(json.llmSlots || []);
    setSelected((cur) => {
      const next = (json.personas as Persona[]).find((p) => p.id === cur?.id);
      return next || (json.personas[0] as Persona) || null;
    });
  }

  useEffect(() => {
    void reload();
  }, []);

  async function save() {
    if (!selected) return;
    setBusy("Saving…");
    const res = await fetch("/api/admin/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save-persona",
        ...selected,
        allowedTopics: selected.allowedTopics.join(", "),
        factFilterRequired: true,
      }),
    });
    const json = await res.json();
    setBusy(json.ok ? "Saved" : json.error || "Save failed");
    await reload();
  }

  async function previewFilter() {
    if (!selected) return;
    setBusy("Running filtered preview…");
    const res = await fetch("/api/admin/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "persona-preview",
        personaId: selected.id,
        message: "Where is Mars in my chart? Also tell me my Lagna.",
      }),
    });
    const json = await res.json();
    setBusy("");
    setPreview(String(json.text || json.error || ""));
    setFilterNote(
      json.factFilterRan || json.factFilterMandatory
        ? `Fact filter ran. flagged=${Boolean(json.flagged)} violations=${(json.violations || []).length} transport=${json.transport || "?"}`
        : "Filter did not run — unexpected."
    );
  }

  if (!selected) {
    return <p className="text-sm text-ink-muted">Loading personas…</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--admin-accent)]">
          AI &amp; Chat
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">AI Agents / Personas</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          System prompt, vault LLM slot, tone, topics, and human escalation. Every persona is
          hard-wired through the chart fact-cache and post-filter — the filter flag cannot be
          turned off.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="surface-panel space-y-2 p-3">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm ${
                selected.id === p.id ? "bg-white/10 text-white" : "text-ink-muted"
              }`}
            >
              <span className="truncate">{p.name}</span>
              <span className="text-[10px] uppercase">{p.kind}</span>
            </button>
          ))}
        </aside>

        <div className="admin-card-elevated space-y-4 rounded-2xl p-5">
          <label className="block text-sm">
            <span className="text-ink-muted">Name</span>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
              value={selected.name}
              onChange={(e) => setSelected({ ...selected, name: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-muted">Slug</span>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
              value={selected.slug}
              onChange={(e) => setSelected({ ...selected, slug: e.target.value })}
            />
          </label>
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
            <label className="block text-sm">
              <span className="text-ink-muted">Kind</span>
              <select
                className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-[#121833] px-3 text-base text-white"
                value={selected.kind}
                onChange={(e) => setSelected({ ...selected, kind: e.target.value })}
              >
                <option value="guru">AI Guru</option>
                <option value="support">Support / onboarding</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted">Tone</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
                value={selected.tone}
                onChange={(e) => setSelected({ ...selected, tone: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted">LLM slot (vault)</span>
              <select
                className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-[#121833] px-3 text-base text-white"
                value={selected.llmSlot}
                onChange={(e) => setSelected({ ...selected, llmSlot: e.target.value })}
              >
                {slots.map((s) => (
                  <option key={s.slotKey} value={s.slotKey}>
                    {s.displayName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted">Model override</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
                value={selected.llmModel}
                onChange={(e) => setSelected({ ...selected, llmModel: e.target.value })}
                placeholder="vault default"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-ink-muted">Allowed topics (comma-separated)</span>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
              value={selected.allowedTopics.join(", ")}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  allowedTopics: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-muted">System prompt</span>
            <textarea
              className="mt-1 min-h-32 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
              value={selected.systemPrompt}
              onChange={(e) => setSelected({ ...selected, systemPrompt: e.target.value })}
            />
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={selected.escalateToHuman}
              onChange={(e) => setSelected({ ...selected, escalateToHuman: e.target.checked })}
            />
            Escalate off-topic questions to a human astrologer
          </label>
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            Fact-cache + post-filter is mandatory for this persona. The column stays true even if
            a client tries to disable it.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary-cosmic min-h-11 px-4" onClick={() => void save()}>
              Save persona
            </button>
            <button type="button" className="btn-secondary-cosmic min-h-11 px-4" onClick={() => void previewFilter()}>
              Preview with fact filter
            </button>
          </div>
          {busy ? <p className="text-xs text-ink-muted">{busy}</p> : null}
          {preview ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white">
              <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-muted">{filterNote}</p>
              {preview}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
