"use client";

import { useEffect, useState } from "react";

type Conv = {
  id: string;
  status: string;
  channel: string;
  flow_name: string;
  persona_name: string;
  created_at: string;
  updated_at: string;
};

type EventRow = {
  id: string;
  role: string;
  content: string;
  nodeType: string;
  filterFlagged: boolean;
  filterViolations: unknown[];
  createdAt: string;
};

export function ConversationLogsClient() {
  const [rows, setRows] = useState<Conv[]>([]);
  const [active, setActive] = useState<string>("");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function reload() {
    const res = await fetch("/api/admin/ai", { cache: "no-store" });
    const json = await res.json();
    if (!json.ok) return;
    setRows(json.conversations || []);
    setLoaded(true);
  }

  async function open(id: string) {
    setActive(id);
    const res = await fetch(`/api/admin/ai?conversationId=${id}`, { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setEvents(json.events || []);
  }

  useEffect(() => {
    void reload();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--admin-accent)]">
          AI &amp; Chat
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">Conversation Logs</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Playground and routed chats. Rows tagged filtered ran through the same fact-sheet
          post-filter as AI Guru.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-3 py-2">Flow</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {!loaded ? (
                <tr>
                  <td className="px-3 py-4 text-ink-muted" colSpan={3}>
                    Loading logs…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-ink-muted" colSpan={3}>
                    No conversations yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="min-h-11 text-left text-white"
                        onClick={() => void open(r.id)}
                      >
                        {r.flow_name || "—"}
                        <span className="mt-0.5 block text-[11px] text-ink-muted">
                          {r.persona_name || "no persona"} · PII redacted
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-2 text-ink-muted">{r.status}</td>
                    <td className="px-3 py-2 text-ink-muted">
                      {String(r.updated_at).slice(0, 19).replace("T", " ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="surface-panel min-h-48 space-y-2 p-4">
          {!active ? (
            <p className="text-sm text-ink-muted">Select a conversation.</p>
          ) : (
            events.map((e) => (
              <div key={e.id} className="rounded-xl bg-black/20 p-3 text-sm text-white">
                <p className="text-[10px] uppercase text-ink-muted">
                  {e.role} · {e.nodeType || "—"}
                  {e.filterFlagged ? " · fact-filter flagged" : ""}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{e.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
