import { NextResponse } from "next/server";
import { requireAdmin, requirePermission } from "@/lib/platform/admin-api";
import { staffHas } from "@/lib/platform/rbac";
import { PROVIDER_SLOTS } from "@/lib/platform/integrations/catalog";
import {
  completePersonaTurn,
  getFlow,
  getPersona,
  listConversationEvents,
  listConversations,
  listFlows,
  listPersonas,
  playFlowTurn,
  saveFlow,
  savePersona,
  type FlowGraph,
} from "@/lib/ai/chat-agent-store";
import { validateFlowGraph } from "@/lib/ai/flow-validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const canLogs = staffHas(auth.staff.role, "conversation_logs:read");
  const canAi = staffHas(auth.staff.role, "ai:write");
  if (!canLogs && !canAi) {
    const denied = await requirePermission(req, "conversation_logs:read");
    if ("response" in denied) return denied.response;
  }
  const url = new URL(req.url);
  const conversationId = url.searchParams.get("conversationId");
  if (conversationId) {
    if (!canLogs) {
      const denied = await requirePermission(req, "conversation_logs:read");
      if ("response" in denied) return denied.response;
    }
    const events = await listConversationEvents(conversationId);
    return NextResponse.json({ ok: true, events });
  }
  const [personas, flows, conversations] = await Promise.all([
    canAi ? listPersonas() : Promise.resolve([]),
    canAi ? listFlows() : Promise.resolve([]),
    canLogs ? listConversations() : Promise.resolve([]),
  ]);
  const llmSlots = canAi
    ? PROVIDER_SLOTS.filter((s) => s.category === "llm").map((s) => ({
        slotKey: s.slotKey,
        displayName: s.displayName,
      }))
    : [];
  return NextResponse.json({
    ok: true,
    personas,
    flows: flows.map((f) => ({
      ...f,
      issues: validateFlowGraph(f.graph),
    })),
    conversations,
    llmSlots,
    access: {
      gate: "requirePermission",
      staffRole: auth.staff.role,
      conversationLogs: canLogs,
      aiWrite: canAi,
    },
  });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "ai:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(body.action || "");

  try {
    if (action === "save-persona") {
      const persona = await savePersona(
        {
          id: body.id ? String(body.id) : undefined,
          slug: String(body.slug || "").trim(),
          name: String(body.name || "").trim(),
          kind: String(body.kind || "guru"),
          systemPrompt: String(body.systemPrompt || ""),
          tone: String(body.tone || "warm"),
          llmSlot: String(body.llmSlot || "openai"),
          llmModel: String(body.llmModel || ""),
          allowedTopics: String(body.allowedTopics || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          escalateToHuman: body.escalateToHuman !== false,
          factFilterRequired: true,
          enabled: body.enabled !== false,
        },
        auth.staff
      );
      return NextResponse.json({ ok: true, persona });
    }

    if (action === "save-flow") {
      const graph = (body.graph || { nodes: [], edges: [] }) as FlowGraph;
      const flow = await saveFlow(
        {
          id: body.id ? String(body.id) : undefined,
          slug: String(body.slug || "").trim(),
          name: String(body.name || "").trim(),
          description: String(body.description || ""),
          kind: String(body.kind || "onboarding"),
          personaId: body.personaId ? String(body.personaId) : null,
          published: Boolean(body.published),
          graph,
        },
        auth.staff
      );
      return NextResponse.json({ ok: true, flow });
    }

    if (action === "play") {
      const result = await playFlowTurn({
        flowId: String(body.flowId || ""),
        conversationId: body.conversationId ? String(body.conversationId) : undefined,
        message: body.message ? String(body.message) : undefined,
        choice: body.choice ? String(body.choice) : undefined,
        channel: "admin_playground",
      });
      return NextResponse.json({ ok: true, ...result, factFilterMandatory: true });
    }

    if (action === "persona-preview") {
      const persona = await getPersona(String(body.personaId || body.slug || "ai_guru"));
      if (!persona) {
        return NextResponse.json({ ok: false, error: "Persona not found" }, { status: 404 });
      }
      const result = await completePersonaTurn({
        persona,
        userMessage: String(body.message || "Where is Mars in my chart?"),
      });
      return NextResponse.json({ ok: true, ...result, factFilterMandatory: true });
    }

    if (action === "get-flow") {
      const flow = await getFlow(String(body.id || body.slug || ""));
      return NextResponse.json({ ok: true, flow });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "AI admin failed" },
      { status: 400 }
    );
  }
}
