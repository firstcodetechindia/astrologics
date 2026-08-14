export const FLOW_NODE_TYPES = [
  "start",
  "message",
  "input",
  "condition",
  "api",
  "handoff_human",
  "handoff_ai",
  "end",
] as const;

export type FlowNodeType = (typeof FLOW_NODE_TYPES)[number];

export type FlowNode = {
  key: string;
  type: FlowNodeType;
  x: number;
  y: number;
  config: Record<string, unknown>;
};

export type FlowEdge = {
  source: string;
  target: string;
  label: string;
};

export type FlowGraph = { nodes: FlowNode[]; edges: FlowEdge[] };
