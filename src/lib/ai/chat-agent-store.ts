/**
 * Phase 4 — AI personas, visual chatbot flows, conversation log.
 * Every AI turn MUST pass filterAiAgainstFactSheet. There is no unfiltered path.
 */
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { getOrComputeChart } from "@/lib/ai/chart-fact-cache";
import { filterAiAgainstFactSheet } from "@/lib/ai/ai-post-filter";
import {
  resolveProvider,
  streamAi,
  systemPrompt,
  type ChatMessage,
} from "@/lib/ai/providers";
import { getProviderBySlot } from "@/lib/platform/integrations/store";
import { decryptProviderSecrets } from "@/lib/platform/secrets/vault";
import { resolveTransport } from "@/lib/platform/integrations/transport";
import type { BirthInput } from "@/lib/astrology/types";
import { writeAuditLog } from "@/lib/platform/audit";
import type { AdminStaff } from "@/lib/auth/admin-session";
import {
  type FlowGraph,
  type FlowNode,
} from "@/lib/ai/chat-flow-types";
import { BROKEN_FLOW_FALLBACK, validateFlowGraph } from "@/lib/ai/flow-validate";
import {
  filterAiScope,
  IMMUTABLE_PERSONA_GUARD,
  sanitizePersonaPrompt,
} from "@/lib/ai/persona-guard";
import { redactSupportText, redactVars } from "@/lib/ai/support-redact";

export type { FlowGraph, FlowNode };
export { FLOW_NODE_TYPES } from "@/lib/ai/chat-flow-types";

export type AiPersona = {
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

export type ChatFlow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  kind: string;
  personaId: string | null;
  published: boolean;
  graph: FlowGraph;
  updatedAt: string;
};

export type ConversationEvent = {
  id: string;
  nodeKey: string;
  nodeType: string;
  role: string;
  content: string;
  filterFlagged: boolean;
  filterViolations: unknown[];
  createdAt: string;
};

export const PLAYGROUND_BIRTH: BirthInput = {
  name: "Phase4 Native",
  date: "1990-05-15",
  time: "06:30",
  place: "New Delhi",
  lat: 28.6139,
  lon: 77.209,
  timeZone: "Asia/Kolkata",
  timezoneOffsetMinutes: 330,
};

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emptyGraph(): FlowGraph {
  return { nodes: [], edges: [] };
}

function mapPersona(row: Record<string, unknown>): AiPersona {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    kind: String(row.kind),
    systemPrompt: String(row.system_prompt || ""),
    tone: String(row.tone || "warm"),
    llmSlot: String(row.llm_slot || "openai"),
    llmModel: String(row.llm_model || ""),
    allowedTopics: parseJson<string[]>(row.allowed_topics_json, []),
    escalateToHuman: Boolean(row.escalate_to_human),
    factFilterRequired: true,
    enabled: Boolean(row.enabled),
  };
}

function mapFlow(row: Record<string, unknown>): ChatFlow {
  const graph = parseJson<FlowGraph>(row.graph_json, emptyGraph());
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description || ""),
    kind: String(row.kind),
    personaId: row.persona_id ? String(row.persona_id) : null,
    published: Boolean(row.published),
    graph: {
      nodes: Array.isArray(graph.nodes) ? graph.nodes : [],
      edges: Array.isArray(graph.edges) ? graph.edges : [],
    },
    updatedAt: String(row.updated_at || ""),
  };
}

export function interpolate(text: string, vars: Record<string, string>) {
  return text.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => vars[key] ?? "");
}

function outgoing(graph: FlowGraph, key: string, label?: string) {
  const edges = graph.edges.filter((e) => e.source === key);
  if (label) {
    const hit = edges.find((e) => e.label.toLowerCase() === label.toLowerCase());
    if (hit) return hit;
  }
  return (
    edges.find((e) => !e.label || e.label.toLowerCase() === "default") ||
    edges[0] ||
    null
  );
}

function nodeByKey(graph: FlowGraph, key: string) {
  return graph.nodes.find((n) => n.key === key) || null;
}

function startKey(graph: FlowGraph) {
  return graph.nodes.find((n) => n.type === "start")?.key || graph.nodes[0]?.key || "";
}

const ONBOARDING_GRAPH: FlowGraph = {
  nodes: [
    { key: "start", type: "start", x: 40, y: 180, config: {} },
    {
      key: "welcome",
      type: "message",
      x: 220,
      y: 160,
      config: {
        text: "Welcome to CosmicGyan. I can help you get started, then connect you to AI Guru when you have a kundli.",
      },
    },
    {
      key: "ask_name",
      type: "input",
      x: 430,
      y: 150,
      config: { field: "name", prompt: "What should I call you?" },
    },
    {
      key: "ask_kundli",
      type: "input",
      x: 650,
      y: 150,
      config: {
        field: "has_kundli",
        prompt: "Nice to meet you, {name}. Do you already have a CosmicGyan kundli?",
        choices: ["Yes", "No"],
      },
    },
    {
      key: "to_guru",
      type: "handoff_ai",
      x: 880,
      y: 60,
      config: {
        personaSlug: "ai_guru",
        text: "Connecting you to AI Guru. Ask a question about the calculated chart — invented planet claims are stripped by the fact filter.",
      },
    },
    {
      key: "cta",
      type: "message",
      x: 880,
      y: 250,
      config: {
        text: "Create your kundli first at /kundli, then come back and I will route you to AI Guru.",
      },
    },
    {
      key: "end",
      type: "end",
      x: 1100,
      y: 250,
      config: { text: "Onboarding complete. See you after your kundli is ready." },
    },
  ],
  edges: [
    { source: "start", target: "welcome", label: "" },
    { source: "welcome", target: "ask_name", label: "" },
    { source: "ask_name", target: "ask_kundli", label: "" },
    { source: "ask_kundli", target: "to_guru", label: "Yes" },
    { source: "ask_kundli", target: "cta", label: "No" },
    { source: "cta", target: "end", label: "" },
  ],
};

export async function ensureAiChatSeed() {
  if (!hasDatabaseUrl()) throw new Error("Database is not configured");
  const sql = getSql();
  await sql`
    INSERT INTO ai_personas (
      slug, name, kind, system_prompt, tone, llm_slot, llm_model,
      allowed_topics_json, escalate_to_human, fact_filter_required, enabled
    )
    VALUES (
      ${"ai_guru"},
      ${"AI Guru"},
      ${"guru"},
      ${"You are CosmicGyan AI Guru. Explain only the supplied calculated chart fact-sheet. Never invent planet signs, Lagna, dasha, or degrees."},
      ${"warm_authoritative"},
      ${"openai"},
      ${"gpt-4o-mini"},
      ${JSON.stringify(["kundli", "dasha", "career", "marriage", "remedies"])},
      ${true},
      ${true},
      ${true}
    )
    ON CONFLICT (slug) DO NOTHING
  `;
  await sql`
    INSERT INTO ai_personas (
      slug, name, kind, system_prompt, tone, llm_slot, llm_model,
      allowed_topics_json, escalate_to_human, fact_filter_required, enabled
    )
    VALUES (
      ${"support_onboarding"},
      ${"Onboarding support"},
      ${"support"},
      ${"You are the CosmicGyan onboarding assistant. Help users create a kundli and route chart questions to AI Guru. Do not invent astrology facts."},
      ${"friendly"},
      ${"openai"},
      ${""},
      ${JSON.stringify(["onboarding", "account", "kundli"])},
      ${true},
      ${true},
      ${true}
    )
    ON CONFLICT (slug) DO NOTHING
  `;
  const guru = await sql`SELECT id FROM ai_personas WHERE slug = ${"ai_guru"} LIMIT 1`;
  const guruId = String(guru[0]?.id || "");
  await sql`
    INSERT INTO chat_flows (slug, name, description, kind, persona_id, published, graph_json)
    VALUES (
      ${"onboarding_v1"},
      ${"Onboarding"},
      ${"Welcome → name → kundli check → AI Guru or kundli CTA."},
      ${"onboarding"},
      ${guruId || null},
      ${true},
      ${JSON.stringify(ONBOARDING_GRAPH)}
    )
    ON CONFLICT (slug) DO NOTHING
  `;
}

export async function listPersonas(): Promise<AiPersona[]> {
  await ensureAiChatSeed();
  const sql = getSql();
  const rows = await sql`SELECT * FROM ai_personas ORDER BY name`;
  return rows.map((r) => mapPersona(r as Record<string, unknown>));
}

export async function getPersona(idOrSlug: string): Promise<AiPersona | null> {
  await ensureAiChatSeed();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM ai_personas
    WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug}
    LIMIT 1
  `;
  return rows[0] ? mapPersona(rows[0] as Record<string, unknown>) : null;
}

export async function savePersona(
  input: Partial<AiPersona> & { name: string; slug: string },
  actor: AdminStaff
): Promise<AiPersona> {
  const sql = getSql();
  const topics = JSON.stringify(input.allowedTopics || []);
  const cleaned = sanitizePersonaPrompt(input.systemPrompt || "");
  const rows = await sql`
    INSERT INTO ai_personas (
      id, slug, name, kind, system_prompt, tone, llm_slot, llm_model,
      allowed_topics_json, escalate_to_human, fact_filter_required, enabled, updated_at
    )
    VALUES (
      ${input.id || crypto.randomUUID()},
      ${input.slug},
      ${input.name},
      ${input.kind || "guru"},
      ${cleaned.text},
      ${input.tone || "warm"},
      ${input.llmSlot || "openai"},
      ${input.llmModel || ""},
      ${topics},
      ${input.escalateToHuman !== false},
      ${true},
      ${input.enabled !== false},
      now()
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      kind = EXCLUDED.kind,
      system_prompt = EXCLUDED.system_prompt,
      tone = EXCLUDED.tone,
      llm_slot = EXCLUDED.llm_slot,
      llm_model = EXCLUDED.llm_model,
      allowed_topics_json = EXCLUDED.allowed_topics_json,
      escalate_to_human = EXCLUDED.escalate_to_human,
      fact_filter_required = true,
      enabled = EXCLUDED.enabled,
      updated_at = now()
    RETURNING *
  `;
  const persona = mapPersona(rows[0] as Record<string, unknown>);
  await writeAuditLog({
    actor,
    action: "ai.persona.save",
    entityType: "ai_personas",
    entityId: persona.id,
    summary: cleaned.stripped
      ? `Saved persona ${persona.slug} (disallowed prompt instructions stripped)`
      : `Saved persona ${persona.slug}`,
    metadata: cleaned.hits.length ? { promptGuardHits: cleaned.hits } : undefined,
  });
  return persona;
}

export async function listFlows(): Promise<ChatFlow[]> {
  await ensureAiChatSeed();
  const sql = getSql();
  const rows = await sql`SELECT * FROM chat_flows ORDER BY name`;
  return rows.map((r) => mapFlow(r as Record<string, unknown>));
}

export async function getFlow(idOrSlug: string): Promise<ChatFlow | null> {
  await ensureAiChatSeed();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM chat_flows
    WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug}
    LIMIT 1
  `;
  return rows[0] ? mapFlow(rows[0] as Record<string, unknown>) : null;
}

export async function saveFlow(
  input: {
    id?: string;
    slug: string;
    name: string;
    description?: string;
    kind?: string;
    personaId?: string | null;
    published?: boolean;
    graph: FlowGraph;
  },
  actor: AdminStaff
): Promise<ChatFlow> {
  const issues = validateFlowGraph(input.graph);
  if (input.published && issues.length) {
    throw new Error(`Cannot publish invalid flow: ${issues.map((i) => i.detail).join(" ")}`);
  }
  const sql = getSql();
  const rows = await sql`
    INSERT INTO chat_flows (
      id, slug, name, description, kind, persona_id, published, graph_json, updated_at
    )
    VALUES (
      ${input.id || crypto.randomUUID()},
      ${input.slug},
      ${input.name},
      ${input.description || ""},
      ${input.kind || "onboarding"},
      ${input.personaId || null},
      ${Boolean(input.published)},
      ${JSON.stringify(input.graph)},
      now()
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      kind = EXCLUDED.kind,
      persona_id = EXCLUDED.persona_id,
      published = EXCLUDED.published,
      graph_json = EXCLUDED.graph_json,
      updated_at = now()
    RETURNING *
  `;
  const flow = mapFlow(rows[0] as Record<string, unknown>);
  await writeAuditLog({
    actor,
    action: "ai.flow.save",
    entityType: "chat_flows",
    entityId: flow.id,
    summary: `Saved flow ${flow.slug}`,
  });
  return flow;
}

export async function listConversations(limit = 40) {
  await ensureAiChatSeed();
  const sql = getSql();
  const cap = Math.min(Math.max(limit, 1), 100);
  const rows = await sql`
    SELECT c.id, c.status, c.channel, c.current_node_key, c.created_at, c.updated_at,
           c.vars_json,
           f.name AS flow_name, f.slug AS flow_slug,
           p.name AS persona_name, p.slug AS persona_slug
    FROM chat_conversations c
    LEFT JOIN chat_flows f ON f.id = c.flow_id
    LEFT JOIN ai_personas p ON p.id = c.persona_id
    ORDER BY c.updated_at DESC
    LIMIT ${cap}
  `;
  return rows.map((r) => ({
    ...r,
    vars_json: JSON.stringify(redactVars(parseJson(r.vars_json, {}))),
  }));
}

export async function listConversationEvents(conversationId: string): Promise<ConversationEvent[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM chat_conversation_events
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at
  `;
  return rows.map((r) => ({
    id: String(r.id),
    nodeKey: String(r.node_key || ""),
    nodeType: String(r.node_type || ""),
    role: String(r.role),
    content: redactSupportText(String(r.content)),
    filterFlagged: Boolean(r.filter_flagged),
    filterViolations: parseJson(r.filter_violations_json, []),
    createdAt: String(r.created_at),
  }));
}

async function appendEvent(input: {
  conversationId: string;
  nodeKey?: string;
  nodeType?: string;
  role: string;
  content: string;
  filterFlagged?: boolean;
  filterViolations?: unknown[];
}) {
  const sql = getSql();
  await sql`
    INSERT INTO chat_conversation_events (
      conversation_id, node_key, node_type, role, content,
      filter_flagged, filter_violations_json
    )
    VALUES (
      ${input.conversationId},
      ${input.nodeKey || ""},
      ${input.nodeType || ""},
      ${input.role},
      ${input.content},
      ${Boolean(input.filterFlagged)},
      ${JSON.stringify(input.filterViolations || [])}
    )
  `;
}

/**
 * Sandbox / missing-key reply that deliberately invents placements
 * so the post-filter path is exercised in evidence.
 */
export function inventingSandboxReply(sheetSignHint?: { mars?: string; lagna?: string }) {
  const marsWrong = sheetSignHint?.mars === "Leo" ? "Cancer" : "Leo";
  const lagnaWrong = sheetSignHint?.lagna === "Pisces" ? "Aries" : "Pisces";
  return `Your Mars is in ${marsWrong}. Your Lagna is ${lagnaWrong}. You will definitely become rich next month.`;
}

export async function completePersonaTurn(opts: {
  persona: AiPersona;
  userMessage: string;
  birth?: BirthInput | null;
  locale?: "en" | "hi";
  collectedVars?: Record<string, string>;
  rawOverride?: string;
}): Promise<{
  text: string;
  flagged: boolean;
  violations: unknown[];
  transport: "mock" | "live" | "env";
  chartKey: string;
  factFilterRan: true;
  scopeFlagged: boolean;
  usedCollectedVars: string[];
}> {
  const locale = opts.locale === "hi" ? "hi" : "en";
  const cached = getOrComputeChart({ input: opts.birth || PLAYGROUND_BIRTH });
  const mars = cached.factSheet.planets.find((p) => p.id === "mars")?.sign;
  const lagna = cached.factSheet.lagna.sign;
  const collected = opts.collectedVars || {};
  const usedCollectedVars = Object.keys(collected);
  const contextBlock = usedCollectedVars.length
    ? `\nAlready collected in this conversation — do not re-ask: ${JSON.stringify(collected)}`
    : "";

  const topics = opts.persona.allowedTopics || [];
  if (topics.length) {
    const blob = opts.userMessage.toLowerCase();
    const hit = topics.some((t) => blob.includes(t.toLowerCase()));
    const generic = /mars|lagna|kundli|chart|dasha|planet|house|career|marriage|hello|hi|what/i.test(
      blob
    );
    if (!hit && !generic && opts.persona.escalateToHuman) {
      const text =
        locale === "hi"
          ? "यह विषय एजेंट की अनुमति सूची से बाहर है। मैं आपको मानव ज्योतिषी के पास भेज रही हूँ।"
          : "That topic is outside this agent’s allow-list. I am escalating to a human astrologer.";
      return {
        text,
        flagged: false,
        violations: [],
        transport: "mock",
        chartKey: cached.key,
        factFilterRan: true,
        scopeFlagged: false,
        usedCollectedVars,
      };
    }
  }

  let raw = "";
  let transport: "mock" | "live" | "env" = "mock";
  if (opts.rawOverride) {
    raw = opts.rawOverride;
  } else if (process.env.PHASE4_FORCE_MOCK_LLM === "1") {
    const greet = collected.name ? `Hello ${collected.name}, I still have your onboarding details. ` : "";
    raw = `${greet}${inventingSandboxReply({ mars, lagna })}`;
  } else {
  try {
    const slot = await getProviderBySlot("llm", opts.persona.llmSlot as "openai");
    const secrets = slot ? await decryptProviderSecrets(String(slot.id)) : {};
    const apiKey = secrets.api_key || "";
    const cfg = parseJson<Record<string, unknown>>(slot?.config_json, {});
    const mode = resolveTransport(
      { secrets, config: cfg, sandbox: Boolean(slot?.sandbox_mode) },
      apiKey
    );
    if (mode === "live" && apiKey) {
      transport = "live";
      const model = opts.persona.llmModel || String(cfg.model || "gpt-4o-mini");
      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt(locale) },
        {
          role: "system",
          content: `${IMMUTABLE_PERSONA_GUARD}\nPersona (${opts.persona.slug}, tone ${opts.persona.tone}):\n${opts.persona.systemPrompt}${contextBlock}\nFACT FILTER IS MANDATORY. Chart:\n${cached.summary}`,
        },
        { role: "user", content: opts.userMessage },
      ];
      if (opts.persona.llmSlot === "openai") {
        process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || apiKey;
        process.env.OPENAI_MODEL = model;
        await streamAi("openai", messages, (d) => {
          raw += d;
        });
      } else {
        raw = inventingSandboxReply({ mars, lagna });
      }
    } else {
      const envProvider = resolveProvider();
      if (envProvider) {
        transport = "env";
        const messages: ChatMessage[] = [
          { role: "system", content: systemPrompt(locale) },
          {
            role: "system",
            content: `${IMMUTABLE_PERSONA_GUARD}\nPersona (${opts.persona.slug}):\n${opts.persona.systemPrompt}${contextBlock}\nChart:\n${cached.summary}`,
          },
          { role: "user", content: opts.userMessage },
        ];
        await streamAi(envProvider, messages, (d) => {
          raw += d;
        });
      } else {
        raw = inventingSandboxReply({ mars, lagna });
      }
    }
  } catch {
    raw = inventingSandboxReply({ mars, lagna });
    transport = "mock";
  }
  }

  if (opts.rawOverride) raw = opts.rawOverride;
  if (!raw.trim()) raw = inventingSandboxReply({ mars, lagna });

  const filtered = filterAiAgainstFactSheet(raw, cached.factSheet, locale);
  const scoped = filterAiScope(filtered.text, locale);
  return {
    text: scoped.text,
    flagged: filtered.flagged || scoped.flagged,
    violations: [
      ...filtered.violations,
      ...scoped.reasons.map((claim) => ({ kind: "scope" as const, claim, detail: "medical/legal scope" })),
    ],
    transport,
    chartKey: cached.key,
    factFilterRan: true,
    scopeFlagged: scoped.flagged,
    usedCollectedVars,
  };
}

export type PlayResult = {
  conversationId: string;
  status: string;
  currentNodeKey: string;
  vars: Record<string, string>;
  replies: { role: string; content: string; nodeType?: string; filterFlagged?: boolean }[];
  awaiting: "input" | "choice" | "ai" | "none";
  prompt?: string;
  choices?: string[];
  filter?: { flagged: boolean; violations: unknown[]; factFilterRan: true };
  ended: boolean;
  brokenPath?: boolean;
  usedCollectedVars?: string[];
};

export async function playFlowTurn(input: {
  flowId: string;
  conversationId?: string;
  message?: string;
  choice?: string;
  channel?: string;
}): Promise<PlayResult> {
  const flow = await getFlow(input.flowId);
  if (!flow) throw new Error("Flow not found");
  const sql = getSql();
  let convId = input.conversationId || "";
  let status = "active";
  let current = "";
  let vars: Record<string, string> = {};
  let personaId = flow.personaId;

  if (convId) {
    const rows = await sql`
      SELECT * FROM chat_conversations WHERE id = ${convId} LIMIT 1
    `;
    if (!rows[0]) throw new Error("Conversation not found");
    status = String(rows[0].status);
    current = String(rows[0].current_node_key || "");
    vars = parseJson(rows[0].vars_json, {});
    personaId = rows[0].persona_id ? String(rows[0].persona_id) : personaId;
  } else {
    const created = await sql`
      INSERT INTO chat_conversations (
        flow_id, persona_id, channel, status, current_node_key, vars_json
      )
      VALUES (
        ${flow.id},
        ${personaId},
        ${input.channel || "admin_playground"},
        ${"active"},
        ${""},
        ${"{}" }
      )
      RETURNING id
    `;
    convId = String(created[0]?.id);
  }

  const replies: PlayResult["replies"] = [];
  let awaiting: PlayResult["awaiting"] = "none";
  let prompt: string | undefined;
  let choices: string[] | undefined;
  let filter: PlayResult["filter"] | undefined;
  const graph = flow.graph;
  const userText = String(input.choice || input.message || "").trim();
  const graphIssues = validateFlowGraph(graph);
  if (
    !convId ||
    status === "active"
  ) {
    const fatal = graphIssues.filter((i) => i.code === "cycle" || i.code === "no_start");
    if (fatal.length && status !== "handed_off_ai") {
      if (!convId) {
        /* created above */
      }
      status = "handed_off_human";
      replies.push({
        role: "assistant",
        content: BROKEN_FLOW_FALLBACK,
        nodeType: "handoff_human",
      });
      await appendEvent({
        conversationId: convId,
        nodeType: "handoff_human",
        role: "assistant",
        content: BROKEN_FLOW_FALLBACK,
      });
      await sql`
        UPDATE chat_conversations
        SET status = ${status}, updated_at = now()
        WHERE id = ${convId}
      `;
      return {
        conversationId: convId,
        status,
        currentNodeKey: current,
        vars,
        replies,
        awaiting: "none",
        ended: true,
        brokenPath: true,
      };
    }
  }

  if (status === "handed_off_ai" && userText) {
    await appendEvent({
      conversationId: convId,
      role: "user",
      content: userText,
      nodeType: "handoff_ai",
    });
    const persona = personaId ? await getPersona(personaId) : await getPersona("ai_guru");
    if (!persona) throw new Error("Persona missing for AI handoff");
    const result = await completePersonaTurn({
      persona,
      userMessage: userText,
      birth: PLAYGROUND_BIRTH,
      collectedVars: vars,
    });
    await appendEvent({
      conversationId: convId,
      role: "assistant",
      nodeType: "handoff_ai",
      content: result.text,
      filterFlagged: result.flagged,
      filterViolations: result.violations,
    });
    replies.push({
      role: "assistant",
      content: result.text,
      nodeType: "handoff_ai",
      filterFlagged: result.flagged,
    });
    filter = {
      flagged: result.flagged,
      violations: result.violations,
      factFilterRan: true,
    };
    awaiting = "ai";
    await sql`
      UPDATE chat_conversations
      SET vars_json = ${JSON.stringify(vars)}, updated_at = now()
      WHERE id = ${convId}
    `;
    return {
      conversationId: convId,
      status,
      currentNodeKey: current,
      vars,
      replies,
      awaiting,
      filter,
      ended: false,
      usedCollectedVars: result.usedCollectedVars,
    };
  }

  if (userText && current) {
    const node = nodeByKey(graph, current);
    if (node?.type === "input") {
      const field = String(node.config.field || "value");
      vars[field] = userText;
      await appendEvent({
        conversationId: convId,
        nodeKey: node.key,
        nodeType: "input",
        role: "user",
        content: userText,
      });
      const next = outgoing(graph, node.key, input.choice || userText);
      current = next?.target || "";
    }
  }

  if (!current) current = startKey(graph);

  let hops = 0;
  while (current && hops < 24) {
    hops += 1;
    const node = nodeByKey(graph, current);
    if (!node) break;

    if (node.type === "start") {
      current = outgoing(graph, node.key)?.target || "";
      continue;
    }

    if (node.type === "message") {
      const text = interpolate(String(node.config.text || ""), vars);
      replies.push({ role: "assistant", content: text, nodeType: "message" });
      await appendEvent({
        conversationId: convId,
        nodeKey: node.key,
        nodeType: "message",
        role: "assistant",
        content: text,
      });
      current = outgoing(graph, node.key)?.target || "";
      continue;
    }

    if (node.type === "input") {
      const field = String(node.config.field || "value");
      if (vars[field]) {
        current = outgoing(graph, node.key, vars[field])?.target || "";
        continue;
      }
      prompt = interpolate(String(node.config.prompt || "Please reply."), vars);
      const rawChoices = node.config.choices;
      choices = Array.isArray(rawChoices) ? rawChoices.map(String) : undefined;
      awaiting = choices?.length ? "choice" : "input";
      replies.push({ role: "assistant", content: prompt, nodeType: "input" });
      await appendEvent({
        conversationId: convId,
        nodeKey: node.key,
        nodeType: "input",
        role: "assistant",
        content: prompt,
      });
      break;
    }

    if (node.type === "condition") {
      const field = String(node.config.field || "");
      const equals = String(node.config.equals || "");
      const actual = String(vars[field] || "");
      const ok = actual.toLowerCase() === equals.toLowerCase();
      current = outgoing(graph, node.key, ok ? "yes" : "no")?.target || "";
      continue;
    }

    if (node.type === "api") {
      const mock = {
        ok: true,
        sandbox: true,
        url: String(node.config.url || ""),
        at: new Date().toISOString(),
      };
      vars[String(node.config.field || "api")] = JSON.stringify(mock);
      const text = `API call simulated in sandbox: ${mock.url || "(no url)"}`;
      replies.push({ role: "assistant", content: text, nodeType: "api" });
      await appendEvent({
        conversationId: convId,
        nodeKey: node.key,
        nodeType: "api",
        role: "system",
        content: text,
      });
      current = outgoing(graph, node.key)?.target || "";
      continue;
    }

    if (node.type === "handoff_human") {
      const text = interpolate(
        String(node.config.text || "Connecting you to a human astrologer."),
        vars
      );
      status = "handed_off_human";
      replies.push({ role: "assistant", content: text, nodeType: "handoff_human" });
      await appendEvent({
        conversationId: convId,
        nodeKey: node.key,
        nodeType: "handoff_human",
        role: "assistant",
        content: text,
      });
      awaiting = "none";
      break;
    }

    if (node.type === "handoff_ai") {
      const slug = String(node.config.personaSlug || "ai_guru");
      const persona = await getPersona(slug);
      if (persona) personaId = persona.id;
      const text = interpolate(
        String(node.config.text || "Connecting you to the AI astrologer persona."),
        vars
      );
      status = "handed_off_ai";
      replies.push({ role: "assistant", content: text, nodeType: "handoff_ai" });
      await appendEvent({
        conversationId: convId,
        nodeKey: node.key,
        nodeType: "handoff_ai",
        role: "assistant",
        content: text,
      });
      awaiting = "ai";
      break;
    }

    if (node.type === "end") {
      const text = interpolate(String(node.config.text || "Conversation ended."), vars);
      status = "ended";
      replies.push({ role: "assistant", content: text, nodeType: "end" });
      await appendEvent({
        conversationId: convId,
        nodeKey: node.key,
        nodeType: "end",
        role: "assistant",
        content: text,
      });
      awaiting = "none";
      break;
    }

    current = outgoing(graph, node.key)?.target || "";
  }

  if (
    status === "active" &&
    awaiting === "none" &&
    (hops >= 24 || !current || !nodeByKey(graph, current) || !outgoing(graph, current))
  ) {
    status = "handed_off_human";
    replies.push({
      role: "assistant",
      content: BROKEN_FLOW_FALLBACK,
      nodeType: "handoff_human",
    });
    await appendEvent({
      conversationId: convId,
      nodeType: "handoff_human",
      role: "assistant",
      content: BROKEN_FLOW_FALLBACK,
    });
    awaiting = "none";
  }

  await sql`
    UPDATE chat_conversations
    SET status = ${status},
        current_node_key = ${current},
        persona_id = ${personaId},
        vars_json = ${JSON.stringify(vars)},
        updated_at = now()
    WHERE id = ${convId}
  `;

  return {
    conversationId: convId,
    status,
    currentNodeKey: current,
    vars,
    replies,
    awaiting,
    prompt,
    choices,
    filter,
    ended: status === "ended" || status === "handed_off_human",
    brokenPath: status === "handed_off_human" && replies.some((r) => r.content === BROKEN_FLOW_FALLBACK),
  };
}
