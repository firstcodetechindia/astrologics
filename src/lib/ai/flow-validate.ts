import type { FlowGraph, FlowNodeType } from "@/lib/ai/chat-flow-types";

export type FlowIssue = {
  code: "no_start" | "unreachable" | "dead_end" | "cycle";
  nodeKey?: string;
  detail: string;
};

const TERMINAL: FlowNodeType[] = ["end", "handoff_human", "handoff_ai"];
const AUTO_WALK: FlowNodeType[] = ["start", "message", "condition", "api"];

export function validateFlowGraph(graph: FlowGraph): FlowIssue[] {
  const issues: FlowIssue[] = [];
  const start = graph.nodes.find((n) => n.type === "start");
  if (!start) {
    issues.push({ code: "no_start", detail: "Flow has no start node." });
    return issues;
  }

  const adj = new Map<string, string[]>();
  for (const e of graph.edges) {
    adj.set(e.source, [...(adj.get(e.source) || []), e.target]);
  }

  const reachable = new Set<string>();
  const queue = [start.key];
  while (queue.length) {
    const key = queue.shift()!;
    if (reachable.has(key)) continue;
    reachable.add(key);
    for (const next of adj.get(key) || []) queue.push(next);
  }

  for (const node of graph.nodes) {
    if (node.key !== start.key && !reachable.has(node.key)) {
      issues.push({
        code: "unreachable",
        nodeKey: node.key,
        detail: `Node “${node.key}” is never reachable from start.`,
      });
    }
  }

  for (const node of graph.nodes) {
    if (!reachable.has(node.key)) continue;
    if (TERMINAL.includes(node.type)) continue;
    if (!(adj.get(node.key) || []).length) {
      issues.push({
        code: "dead_end",
        nodeKey: node.key,
        detail: `Node “${node.key}” has no exit path.`,
      });
    }
  }

  const byKey = new Map(graph.nodes.map((n) => [n.key, n]));
  const seenCycles = new Set<string>();
  function walk(key: string, stack: string[]) {
    if (stack.includes(key)) {
      const cycleKey = [...stack.slice(stack.indexOf(key)), key].join("→");
      if (!seenCycles.has(cycleKey)) {
        seenCycles.add(cycleKey);
        issues.push({
          code: "cycle",
          nodeKey: key,
          detail: `Auto-walk loop ${cycleKey} would spin until the hop cap.`,
        });
      }
      return;
    }
    const node = byKey.get(key);
    if (!node || !AUTO_WALK.includes(node.type)) return;
    const nextStack = [...stack, key];
    for (const target of adj.get(key) || []) walk(target, nextStack);
  }
  walk(start.key, []);
  return issues;
}

export const BROKEN_FLOW_FALLBACK =
  "This chat path is incomplete or looping, so I’m connecting you to a human astrologer. You will not be left waiting.";
