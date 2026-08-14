"use client";

import { useCallback, useEffect, useState } from "react";

type Post = {
  id: string;
  slot_key: string;
  kind: string;
  status: string;
  body: string;
  locale: string;
  scheduled_for: string | null;
  approved_at: string | null;
  published_at: string | null;
  provider_post_id: string | null;
  transport: string | null;
  engagement_json: string;
  error: string;
};

function engagement(raw: string) {
  try {
    return JSON.parse(raw) as { likes?: number; comments?: number; shares?: number; note?: string };
  } catch {
    return {};
  }
}

export function SocialQueueClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [policy, setPolicy] = useState("");
  const [draft, setDraft] = useState("CosmicGyan sandbox test post — calculated Jyotish, not a prediction.");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/social", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) {
      setPosts(json.posts || []);
      setPolicy(json.policy || "");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(body: Record<string, unknown>) {
    setBusy("Working…");
    const res = await fetch("/api/admin/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setBusy(json.ok ? "Saved" : json.error || "Failed");
    if (json.ok) void load();
  }

  return (
    <div className="space-y-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">Communications</p>
      <h1 className="font-display text-2xl font-semibold text-white">Social queue</h1>
      <p className="max-w-2xl text-sm text-ink-muted">{policy}</p>

      <div className="surface-panel max-w-2xl space-y-3 p-4">
        <label className="block text-sm text-ink-muted">
          Compose
          <textarea
            className="field mt-1 min-h-28 text-base"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-grad min-h-11 px-4 text-sm"
            onClick={() => void act({ action: "compose", text: draft })}
          >
            Queue for review
          </button>
          <button
            type="button"
            className="btn-secondary-cosmic min-h-11 px-4 text-sm"
            onClick={() => void act({ action: "generate" })}
          >
            Generate candidates
          </button>
        </div>
        {busy ? <p className="text-xs text-ink-muted">{busy}</p> : null}
      </div>

      <div className="space-y-3">
        {posts.map((p) => {
          const eng = engagement(p.engagement_json);
          return (
            <article key={p.id} className="surface-panel space-y-2 p-4">
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-ink-muted">
                <span className="rounded-full bg-white/10 px-2 py-1 uppercase">{p.status}</span>
                <span>{p.kind}</span>
                <span>{p.slot_key}</span>
                {p.transport ? <span>{p.transport}</span> : null}
              </div>
              <p className="whitespace-pre-wrap break-words text-sm text-white">{p.body}</p>
              {p.provider_post_id ? (
                <p className="text-xs text-ink-muted">
                  Provider id {p.provider_post_id} · ❤ {eng.likes ?? 0} · 💬 {eng.comments ?? 0} · ↗ {eng.shares ?? 0}
                </p>
              ) : null}
              {eng.note ? <p className="text-[11px] text-ink-muted">{eng.note}</p> : null}
              {p.error ? <p className="text-xs text-rose-300">{p.error}</p> : null}
              <div className="flex flex-wrap gap-2">
                {p.status === "pending_review" || p.status === "draft" ? (
                  <>
                    <button
                      type="button"
                      className="btn-grad min-h-11 px-3 text-sm"
                      onClick={() => void act({ action: "review", id: p.id, decision: "approve" })}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn-secondary-cosmic min-h-11 px-3 text-sm"
                      onClick={() => void act({ action: "review", id: p.id, decision: "reject" })}
                    >
                      Reject
                    </button>
                  </>
                ) : null}
                {p.status === "approved" || p.status === "scheduled" ? (
                  <button
                    type="button"
                    className="btn-grad min-h-11 px-3 text-sm"
                    onClick={() => void act({ action: "publish", id: p.id })}
                  >
                    Publish now
                  </button>
                ) : null}
                {p.status === "published" ? (
                  <button
                    type="button"
                    className="btn-secondary-cosmic min-h-11 px-3 text-sm"
                    onClick={() => void act({ action: "engagement", id: p.id })}
                  >
                    Refresh counts
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
