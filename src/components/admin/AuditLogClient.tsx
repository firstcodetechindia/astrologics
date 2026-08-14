"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: string;
  created_at: string;
};

export function AuditLogClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/audit", { cache: "no-store" });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Failed to load audit log");
        return;
      }
      setRows(data.rows || []);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
          Audit
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">Who changed what</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Key rotations, flag flips, test calls, and provider updates.
        </p>
      </header>
      {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-white/5 text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Who</th>
              <th className="px-3 py-2 font-medium">Action</th>
              <th className="px-3 py-2 font-medium">Summary</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="whitespace-nowrap px-3 py-2 text-ink-muted">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-white">{r.actor_email}</td>
                <td className="px-3 py-2 font-mono text-xs text-ink-muted">{r.action}</td>
                <td className="px-3 py-2 text-white">{r.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
