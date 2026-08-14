"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FLOW_NODE_TYPES, type FlowEdge, type FlowGraph, type FlowNode, type FlowNodeType } from "@/lib/ai/chat-flow-types";
import { validateFlowGraph } from "@/lib/ai/flow-validate";

type Flow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  kind: string;
  personaId: string | null;
  published: boolean;
  graph: FlowGraph;
};

type Persona = { id: string; slug: string; name: string };

type PlayMsg = { role: string; content: string; nodeType?: string; filterFlagged?: boolean };

const TYPE_LABEL: Record<FlowNodeType, string> = {
  start: "Start",
  message: "Message",
  input: "User input",
  condition: "Condition",
  api: "API / webhook",
  handoff_human: "Handoff · human",
  handoff_ai: "Handoff · AI persona",
  end: "End",
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export function FlowBuilderClient() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [linkFrom, setLinkFrom] = useState("");
  const [busy, setBusy] = useState("");
  const [convId, setConvId] = useState("");
  const [log, setLog] = useState<PlayMsg[]>([]);
  const [awaiting, setAwaiting] = useState<"input" | "choice" | "ai" | "none">("none");
  const [choices, setChoices] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [filterMeta, setFilterMeta] = useState("");
  const drag = useRef<{ key: string; ox: number; oy: number; x: number; y: number } | null>(null);

  const selected = useMemo(
    () => flow?.graph.nodes.find((n) => n.key === selectedKey) || null,
    [flow, selectedKey]
  );
  const issues = useMemo(() => (flow ? validateFlowGraph(flow.graph) : []), [flow]);

  const reload = useCallback(async () => {
    const res = await fetch("/api/admin/ai", { cache: "no-store" });
    const json = await res.json();
    if (!json.ok) return;
    setPersonas(json.personas || []);
    const list = (json.flows || []) as Flow[];
    setFlows(list);
    setFlow((cur) => list.find((f) => f.id === cur?.id) || list[0] || null);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  function patchGraph(updater: (g: FlowGraph) => FlowGraph) {
    setFlow((cur) => (cur ? { ...cur, graph: updater(cur.graph) } : cur));
  }

  function addNode(type: FlowNodeType) {
    const node: FlowNode = {
      key: uid(type),
      type,
      x: 80 + flow!.graph.nodes.length * 18,
      y: 80 + (flow!.graph.nodes.length % 5) * 28,
      config:
        type === "message"
          ? { text: "New message" }
          : type === "input"
            ? { field: "value", prompt: "Type a reply" }
            : type === "condition"
              ? { field: "value", equals: "Yes" }
              : type === "api"
                ? { url: "https://example.invalid/hook", field: "api" }
                : type === "handoff_ai"
                  ? { personaSlug: "ai_guru", text: "Connecting you to AI Guru." }
                  : type === "handoff_human"
                    ? { text: "Connecting you to a human astrologer." }
                    : type === "end"
                      ? { text: "Conversation ended." }
                      : {},
    };
    patchGraph((g) => ({ ...g, nodes: [...g.nodes, node] }));
    setSelectedKey(node.key);
  }

  function onNodePointerDown(e: React.PointerEvent, node: FlowNode) {
    if ((e.target as HTMLElement).dataset.port) return;
    drag.current = { key: node.key, ox: e.clientX, oy: e.clientY, x: node.x, y: node.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onNodePointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const x = Math.max(8, d.x + (e.clientX - d.ox));
    const y = Math.max(8, d.y + (e.clientY - d.oy));
    patchGraph((g) => ({
      ...g,
      nodes: g.nodes.map((n) => (n.key === d.key ? { ...n, x, y } : n)),
    }));
  }

  function onNodePointerUp() {
    drag.current = null;
  }

  function clickPort(nodeKey: string, dir: "in" | "out") {
    if (dir === "out") {
      setLinkFrom(nodeKey);
      return;
    }
    if (linkFrom && linkFrom !== nodeKey) {
      const edge: FlowEdge = { source: linkFrom, target: nodeKey, label: "" };
      patchGraph((g) => ({
        ...g,
        edges: [...g.edges.filter((x) => !(x.source === edge.source && x.target === edge.target)), edge],
      }));
      setLinkFrom("");
    }
  }

  async function save() {
    if (!flow) return;
    setBusy("Saving…");
    const res = await fetch("/api/admin/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save-flow",
        id: flow.id,
        slug: flow.slug,
        name: flow.name,
        description: flow.description,
        kind: flow.kind,
        personaId: flow.personaId,
        published: flow.published,
        graph: flow.graph,
      }),
    });
    const json = await res.json();
    setBusy(json.ok ? "Saved" : json.error || "Save failed");
    await reload();
  }

  async function play(payload: { message?: string; choice?: string; reset?: boolean }) {
    if (!flow) return;
    const res = await fetch("/api/admin/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "play",
        flowId: flow.id,
        conversationId: payload.reset ? undefined : convId || undefined,
        message: payload.message,
        choice: payload.choice,
      }),
    });
    const json = await res.json();
    if (!json.ok) {
      setBusy(json.error || "Play failed");
      return;
    }
    setConvId(json.conversationId);
    setAwaiting(json.awaiting);
    setChoices(json.choices || []);
    setLog((prev) => (payload.reset ? json.replies : [...prev, ...(json.replies || [])]));
    if (json.filter) {
      setFilterMeta(
        `Fact filter ran=${json.filter.factFilterRan || json.factFilterMandatory} flagged=${json.filter.flagged} violations=${(json.filter.violations || []).length}`
      );
    }
  }

  if (!flow) {
    return <p className="text-sm text-ink-muted">Loading flows…</p>;
  }

  const selectedCfg = selected?.config || {};

  return (
    <div className="space-y-6">
      <header className="flex min-w-0 flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--admin-accent)]">
            AI &amp; Chat
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-white">Chat Flow Builder</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Drag nodes, click an output port then an input port to connect. Seeded onboarding flow
            is published and runnable in the playground.
          </p>
        </div>
        <button type="button" className="btn-secondary-cosmic min-h-11 px-4" onClick={() => void save()}>
          Save flow
        </button>
      </header>
      {issues.length ? (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">This graph is not publishable until these are fixed:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            {issues.map((i) => (
              <li key={`${i.code}-${i.nodeKey || i.detail}`}>{i.detail}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-amber-200/80">
            Playground still runs: incomplete or looping paths escalate to a human instead of hanging.
          </p>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-wrap gap-2">
        <select
          className="min-h-11 rounded-xl border border-white/10 bg-[#121833] px-3 text-base text-white"
          value={flow.id}
          onChange={(e) => {
            const next = flows.find((f) => f.id === e.target.value);
            if (next) {
              setFlow(next);
              setConvId("");
              setLog([]);
            }
          }}
        >
          {flows.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <label className="flex min-h-11 items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={flow.published}
            onChange={(e) => setFlow({ ...flow, published: e.target.checked })}
          />
          Published
        </label>
        <select
          className="min-h-11 rounded-xl border border-white/10 bg-[#121833] px-3 text-base text-white"
          value={flow.personaId || ""}
          onChange={(e) => setFlow({ ...flow, personaId: e.target.value || null })}
        >
          <option value="">Default persona</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 flex-wrap gap-2">
        {FLOW_NODE_TYPES.filter((t) => t !== "start").map((t) => (
          <button
            key={t}
            type="button"
            className="btn-secondary-cosmic min-h-11 px-3 text-xs"
            onClick={() => addNode(t)}
          >
            + {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="admin-flow-canvas relative h-[28rem] w-full min-w-0">
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {flow.graph.edges.map((e) => {
            const a = flow.graph.nodes.find((n) => n.key === e.source);
            const b = flow.graph.nodes.find((n) => n.key === e.target);
            if (!a || !b) return null;
            const x1 = a.x + 216;
            const y1 = a.y + 36;
            const x2 = b.x;
            const y2 = b.y + 36;
            return (
              <g key={`${e.source}-${e.target}-${e.label}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(125,82,255,0.7)" strokeWidth="2" />
                {e.label ? (
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} fill="#94a3b8" fontSize="11">
                    {e.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        {flow.graph.nodes.map((node) => (
          <div
            key={node.key}
            className={`admin-flow-node ${selectedKey === node.key ? "is-selected" : ""}`}
            style={{ left: node.x, top: node.y }}
            onPointerDown={(e) => onNodePointerDown(e, node)}
            onPointerMove={onNodePointerMove}
            onPointerUp={onNodePointerUp}
            onClick={() => setSelectedKey(node.key)}
          >
            <button
              type="button"
              data-port="in"
              className="admin-flow-port is-in"
              aria-label="Input port"
              onClick={(e) => {
                e.stopPropagation();
                clickPort(node.key, "in");
              }}
            />
            <div className="cursor-grab px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-[var(--admin-accent)]">
                {TYPE_LABEL[node.type]}
              </p>
              <p className="truncate text-sm text-white">{node.key}</p>
            </div>
            <button
              type="button"
              data-port="out"
              className="admin-flow-port is-out"
              aria-label="Output port"
              onClick={(e) => {
                e.stopPropagation();
                clickPort(node.key, "out");
              }}
            />
          </div>
        ))}
      </div>
      {linkFrom ? (
        <p className="text-xs text-amber-300">Click an input port to connect from {linkFrom}.</p>
      ) : null}

      {selected ? (
        <div className="surface-panel space-y-3 p-4">
          <p className="text-sm font-semibold text-white">
            {TYPE_LABEL[selected.type]} · {selected.key}
          </p>
          {selected.type !== "start" ? (
            <label className="block text-sm">
              <span className="text-ink-muted">Text / prompt</span>
              <textarea
                className="mt-1 min-h-20 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
                value={String(selectedCfg.text || selectedCfg.prompt || "")}
                onChange={(e) => {
                  const key = selected.type === "input" ? "prompt" : "text";
                  patchGraph((g) => ({
                    ...g,
                    nodes: g.nodes.map((n) =>
                      n.key === selected.key
                        ? { ...n, config: { ...n.config, [key]: e.target.value } }
                        : n
                    ),
                  }));
                }}
              />
            </label>
          ) : null}
          {selected.type === "input" || selected.type === "condition" ? (
            <label className="block text-sm">
              <span className="text-ink-muted">Field</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
                value={String(selectedCfg.field || "")}
                onChange={(e) =>
                  patchGraph((g) => ({
                    ...g,
                    nodes: g.nodes.map((n) =>
                      n.key === selected.key
                        ? { ...n, config: { ...n.config, field: e.target.value } }
                        : n
                    ),
                  }))
                }
              />
            </label>
          ) : null}
          {selected.type === "input" ? (
            <label className="block text-sm">
              <span className="text-ink-muted">Choices (comma, optional)</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
                value={Array.isArray(selectedCfg.choices) ? selectedCfg.choices.join(", ") : ""}
                onChange={(e) =>
                  patchGraph((g) => ({
                    ...g,
                    nodes: g.nodes.map((n) =>
                      n.key === selected.key
                        ? {
                            ...n,
                            config: {
                              ...n.config,
                              choices: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            },
                          }
                        : n
                    ),
                  }))
                }
              />
            </label>
          ) : null}
          {flow.graph.edges.filter((e) => e.source === selected.key).map((edge, i) => (
            <label key={`${edge.target}-${i}`} className="block text-sm">
              <span className="text-ink-muted">Edge to {edge.target}</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white"
                value={edge.label}
                onChange={(e) =>
                  patchGraph((g) => ({
                    ...g,
                    edges: g.edges.map((x) =>
                      x.source === edge.source && x.target === edge.target
                        ? { ...x, label: e.target.value }
                        : x
                    ),
                  }))
                }
              />
            </label>
          ))}
        </div>
      ) : null}

      <div className="admin-card-elevated space-y-3 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg text-white">Live playground</h2>
          <button
            type="button"
            className="btn-secondary-cosmic min-h-11 px-3 text-sm"
            onClick={() => {
              setConvId("");
              setLog([]);
              setFilterMeta("");
              void play({ reset: true });
            }}
          >
            Start onboarding
          </button>
        </div>
        <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl bg-black/20 p-3">
          {log.map((m, i) => (
            <p key={`${i}-${m.content.slice(0, 12)}`} className="text-sm text-white">
              <span className="text-[10px] uppercase text-ink-muted">{m.role}</span>{" "}
              {m.content}
              {m.filterFlagged ? (
                <span className="ml-2 text-[10px] uppercase text-amber-300">filtered</span>
              ) : null}
            </p>
          ))}
        </div>
        {filterMeta ? <p className="text-xs text-emerald-300">{filterMeta}</p> : null}
        {choices.length ? (
          <div className="flex flex-wrap gap-2">
            {choices.map((c) => (
              <button
                key={c}
                type="button"
                className="btn-secondary-cosmic min-h-11 px-4"
                onClick={() => void play({ choice: c })}
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}
        {awaiting === "input" || awaiting === "ai" ? (
          <form
            className="flex min-w-0 flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const message = draft.trim();
              if (!message) return;
              setLog((prev) => [...prev, { role: "user", content: message }]);
              setDraft("");
              void play({ message });
            }}
          >
            <input
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-base text-white"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={awaiting === "ai" ? "Ask AI Guru about the chart…" : "Type a reply"}
            />
            <button type="submit" className="btn-secondary-cosmic min-h-11 px-4">
              Send
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
