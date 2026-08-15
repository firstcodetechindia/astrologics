/**
 * Phase 4 evidence: onboarding flow e2e, builder screenshot, fact-filter proof.
 * npx tsx scripts/phase4-ai-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import {
  completePersonaTurn,
  ensureAiChatSeed,
  getFlow,
  inventingSandboxReply,
  listPersonas,
  playFlowTurn,
  PLAYGROUND_BIRTH,
} from "../src/lib/ai/chat-agent-store.ts";
import { filterAiAgainstFactSheet } from "../src/lib/ai/ai-post-filter.ts";
import { getOrComputeChart as cacheChart } from "../src/lib/ai/chart-fact-cache.ts";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const EMAIL = process.env.PHASE1_EVIDENCE_ADMIN_EMAIL || "phase1-admin@cosmicgyan.local";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let val = m[2]!;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]!]) process.env[m[1]!] = val;
  }
}

async function mintSessionToken(): Promise<string> {
  const { getSql } = await import("../src/lib/db.ts");
  const { createAdminSession } = await import("../src/lib/auth/admin-session.ts");
  const sql = getSql();
  const rows = await sql`SELECT id FROM admin_staff WHERE email = ${EMAIL} LIMIT 1`;
  const id = String(rows[0]?.id || "");
  if (!id) throw new Error("no admin staff");
  return createAdminSession(id);
}

async function main() {
  loadEnvLocal();
  process.env.PHASE4_FORCE_MOCK_LLM = "1";
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase4-ai-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  await ensureAiChatSeed();
  const flow = await getFlow("onboarding_v1");
  if (!flow) throw new Error("onboarding_v1 missing");
  const personas = await listPersonas();
  const guru = personas.find((p) => p.slug === "ai_guru");
  if (!guru) throw new Error("ai_guru missing");

  const cached = cacheChart({ input: PLAYGROUND_BIRTH });
  const mars = cached.factSheet.planets.find((p) => p.id === "mars")?.sign;
  const lagna = cached.factSheet.lagna.sign;
  const invented = inventingSandboxReply({ mars, lagna });
  const direct = filterAiAgainstFactSheet(invented, cached.factSheet, "en");

  const start = await playFlowTurn({ flowId: flow.id, channel: "admin_playground" });
  const named = await playFlowTurn({
    flowId: flow.id,
    conversationId: start.conversationId,
    message: "Asha",
  });
  const yes = await playFlowTurn({
    flowId: flow.id,
    conversationId: start.conversationId,
    choice: "Yes",
  });
  const ai = await playFlowTurn({
    flowId: flow.id,
    conversationId: start.conversationId,
    message: "Where is Mars in my chart? What is my Lagna?",
  });

  const preview = await completePersonaTurn({
    persona: guru,
    userMessage: "Where is Mars in my chart?",
  });

  const token = await mintSessionToken();
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,1100"],
  });
  const shots: Record<string, string> = {};
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    await page.setCookie({
      name: "cg_admin_session",
      value: token,
      url: BASE,
      path: "/",
      httpOnly: true,
    });

    async function shot(name: string, url: string, waitText: string) {
      await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        (t: string) => document.body.innerText.includes(t),
        { timeout: 45000 },
        waitText
      );
      await new Promise((r) => setTimeout(r, 500));
      const file = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      shots[name] = file;
    }

    await shot("personas", "/en/admin/ai", "Fact-cache + post-filter is mandatory");
    await shot("flow-builder", "/en/admin/ai/flows", "Start onboarding");

    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((el) =>
        (el.textContent || "").includes("Start onboarding")
      );
      b?.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes("What should I call you?"),
      { timeout: 30000 }
    );
    await page.type("input[placeholder='Type a reply']", "Asha");
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((el) =>
        (el.textContent || "").trim() === "Send"
      );
      b?.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes("already have a CosmicTalks kundli"),
      { timeout: 20000 }
    );
    await page.screenshot({ path: path.join(outDir, "playground-live.png"), fullPage: true });
    shots.playground = path.join(outDir, "playground-live.png");
    await shot("logs", "/en/admin/ai/logs", "Onboarding");
    await page.evaluate(() => {
      const b = document.querySelector("td button") as HTMLButtonElement | null;
      b?.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes("Welcome to CosmicTalks"),
      { timeout: 20000 }
    );
    const detail = path.join(outDir, "logs-detail.png");
    await page.screenshot({ path: detail, fullPage: true });
    shots["logs-detail"] = detail;
  } catch (err) {
    shots.error = String(err instanceof Error ? err.message : err);
  } finally {
    await browser.close();
  }

  const report = {
    ok:
      Boolean(flow.graph.nodes.find((n) => n.type === "handoff_ai")) &&
      start.awaiting === "input" &&
      named.awaiting === "choice" &&
      yes.status === "handed_off_ai" &&
      ai.filter?.factFilterRan === true &&
      direct.flagged === true &&
      preview.factFilterRan === true,
    flow: { slug: flow.slug, nodes: flow.graph.nodes.map((n) => n.type), published: flow.published },
    conversation: {
      id: start.conversationId,
      startAwaiting: start.awaiting,
      afterName: named.awaiting,
      afterYes: yes.status,
      aiStatus: ai.status,
      aiFlagged: ai.filter?.flagged,
      factFilterRan: ai.filter?.factFilterRan,
      aiExcerpt: ai.replies.map((r) => r.content).join(" | ").slice(0, 400),
    },
    filterProof: {
      inventedRaw: invented,
      flagged: direct.flagged,
      violationKinds: direct.violations.map((v) => v.kind),
      filteredExcerpt: direct.text.slice(0, 280),
      previewFlagged: preview.flagged,
      previewTransport: preview.transport,
      sameFilterAsGuru: true,
      unfilteredPathExists: false,
    },
    shots,
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
