"use client";

import { useEffect, useState } from "react";
import { rupees } from "@/lib/billing/gst";

export function AdminUsersClient() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setN(Number(json.customers || 0));
    })();
  }, []);
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">People</p>
      <h1 className="font-display text-2xl font-semibold text-white">Users</h1>
      <p className="max-w-xl text-sm text-ink-muted">
        Customer records today come from billing checkout (phone/email on a payment). Public
        localStorage accounts are not in this table until Auth0 is on.
      </p>
      <div className="surface-panel max-w-sm p-4">
        <p className="text-xs uppercase text-ink-muted">Billing customers</p>
        <p className="mt-1 font-display text-2xl text-white">{n == null ? "…" : n}</p>
      </div>
    </div>
  );
}

export function AdminAstrologersClient() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [personas, setPersonas] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [bounds, setBounds] = useState({ minMinor: 500, maxMinor: 50000 });
  const [form, setForm] = useState({
    displayName: "New partner",
    phone: "",
    kind: "REAL_HUMAN" as "REAL_HUMAN" | "AI_PERSONA",
    bio: "",
    rateRupees: "25",
    commissionPct: "20",
    personaId: "",
    payoutUpi: "",
  });
  const [busy, setBusy] = useState("");

  async function load() {
    const res = await fetch("/api/admin/astrologers", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) {
      setRows(json.astrologers || []);
      setPersonas(json.personas || []);
      setBounds(json.rateBounds || bounds);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setBusy("Saving…");
    const res = await fetch("/api/admin/astrologers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.displayName,
        phone: form.phone || null,
        kind: form.kind,
        bio: form.bio,
        rateMinor: Math.round(Number(form.rateRupees || 0) * 100),
        commissionBps: Math.round(Number(form.commissionPct || 0) * 100),
        personaId: form.kind === "AI_PERSONA" ? form.personaId || null : null,
        payoutUpi: form.payoutUpi || null,
      }),
    });
    const json = await res.json();
    setBusy(json.ok ? `Saved ${json.kind} @ ₹${json.rateMinor / 100}/min (clamped to admin bounds)` : json.error);
    if (json.ok) void load();
  }

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">People</p>
      <h1 className="font-display text-2xl font-semibold text-white">Astrologers</h1>
      <p className="max-w-xl text-sm text-ink-muted">
        Same public directory for REAL_HUMAN and AI_PERSONA. AI profiles must use the shared AI
        label. Rates clamp to admin min/max ({rupees(bounds.minMinor)}–{rupees(bounds.maxMinor)} /min).
      </p>
      <div className="surface-panel grid max-w-2xl gap-3 p-4">
        <label className="block text-sm text-ink-muted">
          Name
          <input
            className="field mt-1 text-base"
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Kind
          <select
            className="field mt-1 text-base"
            value={form.kind}
            onChange={(e) =>
              setForm((f) => ({ ...f, kind: e.target.value as "REAL_HUMAN" | "AI_PERSONA" }))
            }
          >
            <option value="REAL_HUMAN">REAL_HUMAN</option>
            <option value="AI_PERSONA">AI_PERSONA</option>
          </select>
        </label>
        {form.kind === "AI_PERSONA" ? (
          <label className="block text-sm text-ink-muted">
            Phase 4 persona
            <select
              className="field mt-1 text-base"
              value={form.personaId}
              onChange={(e) => setForm((f) => ({ ...f, personaId: e.target.value }))}
            >
              <option value="">ai_guru (default)</option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.slug})
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="block text-sm text-ink-muted">
            Phone
            <input
              className="field mt-1 text-base"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>
        )}
        <label className="block text-sm text-ink-muted">
          Bio
          <textarea
            className="field mt-1 min-h-24 text-base"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm text-ink-muted">
            Rate ₹/min
            <input
              className="field mt-1 text-base"
              inputMode="decimal"
              value={form.rateRupees}
              onChange={(e) => setForm((f) => ({ ...f, rateRupees: e.target.value }))}
            />
          </label>
          <label className="block text-sm text-ink-muted">
            Commission %
            <input
              className="field mt-1 text-base"
              inputMode="decimal"
              value={form.commissionPct}
              onChange={(e) => setForm((f) => ({ ...f, commissionPct: e.target.value }))}
            />
          </label>
        </div>
        <label className="block text-sm text-ink-muted">
          Payout UPI
          <input
            className="field mt-1 text-base"
            value={form.payoutUpi}
            onChange={(e) => setForm((f) => ({ ...f, payoutUpi: e.target.value }))}
          />
        </label>
        <button type="button" className="btn-grad min-h-11 px-4 text-sm" onClick={() => void save()}>
          Save directory profile
        </button>
        {busy ? <p className="text-xs text-ink-muted">{busy}</p> : null}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-white/5 text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Kind</th>
              <th className="px-3 py-2 font-medium">Rate</th>
              <th className="px-3 py-2 font-medium">Active</th>
              <th className="px-3 py-2 font-medium">Commission</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)} className="border-t border-white/10">
                <td className="px-3 py-2 text-white">{String(r.display_name)}</td>
                <td className="px-3 py-2 text-white">{String(r.kind)}</td>
                <td className="px-3 py-2 text-white">
                  {r.rate_minor != null ? rupees(Number(r.rate_minor)) : "—"}/min
                </td>
                <td className="px-3 py-2 text-white">{String(r.active)}</td>
                <td className="px-3 py-2 text-white">
                  {r.commission_bps == null ? "global" : `${Number(r.commission_bps) / 100}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminHealthClient() {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [providers, setProviders] = useState<Record<string, unknown>[]>([]);
  const [canFinance, setCanFinance] = useState(false);
  useEffect(() => {
    (async () => {
      const o = await fetch("/api/admin/overview", { cache: "no-store" }).then((r) => r.json());
      if (o.ok) {
        setOverview(o);
        setCanFinance(Boolean(o.canFinance));
      }
      const h = await fetch("/api/admin/health", { cache: "no-store" }).then((r) => r.json());
      if (h.ok) setProviders(h.providers || []);
    })();
  }, []);
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">System</p>
      <h1 className="font-display text-2xl font-semibold text-white">System health</h1>
      <p className="text-sm text-ink-muted">
        Database {overview?.dbOk ? "reachable" : "…"}.
        {canFinance
          ? ` Today ${String(overview?.todayPayments ?? "…")} captured payments (${
              overview ? rupees(Number(overview.todayRevenueMinor || 0)) : "…"
            }).`
          : " Payment totals hidden without finance:read."}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-white/5 text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Slot</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Enabled</th>
              <th className="px-3 py-2 font-medium">Sandbox</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={String(p.id)} className="border-t border-white/10">
                <td className="px-3 py-2 text-white">{String(p.displayName || p.slotKey)}</td>
                <td className="px-3 py-2 text-white">{String(p.category)}</td>
                <td className="px-3 py-2 text-white">{String(p.enabled)}</td>
                <td className="px-3 py-2 text-white">{String(p.sandboxMode)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
