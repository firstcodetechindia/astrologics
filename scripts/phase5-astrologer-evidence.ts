/**
 * Phase 5 evidence: REAL_HUMAN + AI_PERSONA labeled directory, mock sessions, commission ledger.
 * npx tsx scripts/phase5-astrologer-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { completeMockConsult, listLiveDirectory } from "../src/lib/astrologers/consult-engine.ts";
import { getSql } from "../src/lib/db.ts";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let val = m[2]!;
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]!]) process.env[m[1]!] = val;
  }
}

async function main() {
  loadEnvLocal();
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase5-astrologer-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const directory = await listLiveDirectory();
  const human = directory.find((a) => a.id === "pandit-vikram-sharma") || directory.find((a) => a.kind === "REAL_HUMAN");
  const ai = directory.find((a) => a.id === "jyoti-ai-guru") || directory.find((a) => a.kind === "AI_PERSONA");
  if (!human || !ai) throw new Error("missing seeded profiles");

  const humanSession = await completeMockConsult({
    astrologerSlug: human.id,
    customerName: "Phase5 Human Client",
    minutes: 5,
  });
  const aiSession = await completeMockConsult({
    astrologerSlug: ai.id,
    customerName: "Phase5 AI Client",
    minutes: 5,
  });

  const sql = getSql();
  const ledger = await sql`
    SELECT l.entry_kind, l.status, l.commission_bps, l.platform_minor, l.astrologer_minor,
           a.display_name, a.kind, p.receipt
    FROM commission_ledger l
    JOIN billing_astrologers a ON a.id = l.astrologer_id
    JOIN payments p ON p.id = l.payment_id
    WHERE p.id IN (${humanSession.paymentId}, ${aiSession.paymentId})
    ORDER BY l.created_at
  `;

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,1100"],
  });
  const shots: Record<string, string> = {};
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/en/chat-with-astrologer`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForFunction(
      () =>
        document.body.innerText.includes("Jyoti — AI Guru") &&
        document.body.innerText.includes("Pandit Vikram Sharma") &&
        document.body.innerText.includes("AI astrologer — not a human"),
      { timeout: 40000 }
    );
    shots.directory = path.join(outDir, "directory.png");
    await page.screenshot({ path: shots.directory, fullPage: true });

    await page.goto(`${BASE}/en/chat-with-astrologer/${ai.id}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForFunction(
      () =>
        document.body.innerText.includes("Jyoti") &&
        document.body.innerText.includes("AI astrologer — not a human"),
      { timeout: 40000 }
    );
    shots.aiChat = path.join(outDir, "ai-chat.png");
    await page.screenshot({ path: shots.aiChat, fullPage: true });

    console.log("evidence ids", { human: human.id, ai: ai.id });
    await page.goto(`${BASE}/en/chat-with-astrologer/${human.id}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    try {
      await page.waitForFunction(
        () => document.body.innerText.includes("Pandit Vikram Sharma"),
        { timeout: 40000 }
      );
    } catch (err) {
      const txt = await page.evaluate(() => document.body.innerText.slice(0, 1500));
      console.error("human chat body:\n", txt);
      shots.humanChatFail = path.join(outDir, "human-chat-fail.png");
      await page.screenshot({ path: shots.humanChatFail, fullPage: true });
      throw err;
    }
    shots.humanChat = path.join(outDir, "human-chat.png");
    await page.screenshot({ path: shots.humanChat, fullPage: true });
  } finally {
    await browser.close();
  }

  const report = {
    ok:
      human.kind === "REAL_HUMAN" &&
      ai.kind === "AI_PERSONA" &&
      humanSession.labeledAi === false &&
      aiSession.labeledAi === true &&
      Boolean(humanSession.captured?.commission) &&
      Boolean(aiSession.captured?.commission) &&
      ledger.length >= 2,
    directory: directory.map((a) => ({ id: a.id, name: a.name, kind: a.kind })),
    sessions: {
      human: { ...humanSession.math, paymentId: humanSession.paymentId, commission: humanSession.captured.commission },
      ai: { ...aiSession.math, paymentId: aiSession.paymentId, commission: aiSession.captured.commission },
    },
    ledger: ledger.map((r) => ({
      name: r.display_name,
      kind: r.kind,
      bps: r.commission_bps,
      platform: r.platform_minor,
      astrologer: r.astrologer_minor,
      receipt: r.receipt,
    })),
    disclosure: "AiAstrologerLabel is required on directory cards and the chat window for AI_PERSONA.",
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
