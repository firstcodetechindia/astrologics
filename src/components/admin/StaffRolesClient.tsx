"use client";

import { useEffect, useState } from "react";
import { PHASE7_PERMISSIONS, PHASE7_ROLES } from "@/lib/platform/rbac-checklist";

type StaffRow = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  mustChangePassword: boolean;
  permissions: string[];
};

export function StaffRolesClient() {
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "support",
  });

  async function load() {
    const res = await fetch("/api/admin/staff", { cache: "no-store" });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error || "Cannot load staff");
      return;
    }
    setError("");
    setRows(json.staff || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    setBusy("Creating…");
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setBusy(json.ok ? `Created ${json.staff.email} (${json.staff.role})` : json.error || "Failed");
    if (json.ok) {
      setForm({ email: "", password: "", displayName: "", role: "support" });
      void load();
    }
  }

  async function setRole(id: string, role: string) {
    setBusy("Updating role…");
    const res = await fetch("/api/admin/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    const json = await res.json();
    setBusy(json.ok ? `${json.staff.email} → ${json.staff.role}` : json.error || "Failed");
    if (json.ok) void load();
  }

  return (
    <div className="max-w-3xl space-y-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">Phase 7</p>
      <h1 className="font-display text-2xl font-semibold text-white">Staff / Roles</h1>
      <p className="text-sm text-ink-muted">
        Super Admin, Support, Content, Finance. Hidden nav is not enough — APIs return 403 and
        write <code className="text-white">rbac.deny</code> to the audit log.
      </p>

      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">
          DPDP P0 — conversation_logs:read
        </p>
        <p className="mt-2 text-sm text-ink">
          Support can open Conversation Logs. Finance and Content receive API 403. Vault remains
          Super Admin only.
        </p>
      </div>

      <div className="surface-panel grid gap-3 p-4">
        <p className="text-sm font-semibold text-white">Invite staff</p>
        <label className="block text-sm text-ink-muted">
          Display name
          <input
            className="field mt-1 text-base"
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Email
          <input
            className="field mt-1 text-base"
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Temporary password (min 12)
          <input
            className="field mt-1 text-base"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Role
          <select
            className="field mt-1 text-base"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            {PHASE7_ROLES.filter((r) => r !== "super_admin").map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value="super_admin">super_admin</option>
          </select>
        </label>
        <button type="button" className="btn-grad min-h-11 px-4 text-sm" onClick={() => void create()}>
          Create staff account
        </button>
        {busy ? <p className="text-xs text-ink-muted">{busy}</p> : null}
        {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-white/5 text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Staff</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Must change password</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 align-top">
                <td className="px-3 py-2">
                  <p className="text-white">{r.displayName}</p>
                  <p className="text-xs text-ink-muted">{r.email}</p>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="field min-h-11 text-base"
                    value={r.role}
                    onChange={(e) => void setRole(r.id, e.target.value)}
                  >
                    {PHASE7_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-white">{r.mustChangePassword ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-white/5 text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Permission</th>
              <th className="px-3 py-2 font-medium">Pri</th>
              <th className="px-3 py-2 font-medium">Default roles</th>
            </tr>
          </thead>
          <tbody>
            {PHASE7_PERMISSIONS.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-3 py-2 font-mono text-xs text-white">{p.id}</td>
                <td className="px-3 py-2 text-white">{p.priority}</td>
                <td className="px-3 py-2 text-ink-muted">{p.defaultRoles.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
