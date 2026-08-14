/**
 * Phase 6 evidence: generate candidates, refuse unapproved publish, approve + sandbox post.
 * npx tsx scripts/phase6-social-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { ensureProviderSlots } from "../src/lib/platform/integrations/store.ts";
import { seedSandboxSecrets } from "../src/lib/platform/integrations/seed-sandbox.ts";
import {
  generateSocialCandidates,
  publishSocialPost,
  reviewSocialPost,
} from "../src/lib/social/engine.ts";
import { getSql } from "../src/lib/db.ts";

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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]!]) process.env[m[1]!] = val;
  }
}

async function mintSessionToken(): Promise<string> {
  const { createAdminSession } = await import("../src/lib/auth/admin-session.ts");
  const sql = getSql();
  const rows = await sql`SELECT id FROM admin_staff WHERE email = ${EMAIL} LIMIT 1`;
  const id = String(rows[0]?.id || "");
  if (!id) throw new Error("no admin staff");
  return createAdminSession(id);
}

async function staff() {
  const sql = getSql();
  const rows = await sql`SELECT * FROM admin_staff WHERE email = ${EMAIL} LIMIT 1`;
  if (!rows[0]) throw new Error("no admin staff");
  return {
    id: String(rows[0].id),
    email: String(rows[0].email),
    display_name: String(rows[0].display_name),
    role: String(rows[0].role),
    must_change_password: Boolean(rows[0].must_change_password),
  };
}

async function main() {
  loadEnvLocal();
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase6-social-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  await ensureProviderSlots();
  await seedSandboxSecrets();
  const actor = await staff();
  const generated = await generateSocialCandidates(actor, "en");
  const pending = generated[0];
  if (!pending) throw new Error("no candidates");

  let unapprovedError = "";
  try {
    await publishSocialPost(String(pending.id), actor);
  } catch (e) {
    unapprovedError = e instanceof Error ? e.message : String(e);
  }

  const approved = await reviewSocialPost({
    id: String(pending.id),
    decision: "approve",
    actor,
  });
  const published = await publishSocialPost(String(approved.id), actor);

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
    await page.goto(`${BASE}/en/admin/social`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForFunction(
      () => document.body.innerText.includes("Social queue"),
      { timeout: 30000 }
    );
    shots.queue = path.join(outDir, "queue.png");
    await page.screenshot({ path: shots.queue, fullPage: true });
  } finally {
    await browser.close();
  }

  const report = {
    ok:
      unapprovedError.includes("not human-approved") &&
      String(published.status) === "published" &&
      String(published.transport) === "mock" &&
      Boolean(published.provider_post_id),
    unapprovedBlocked: unapprovedError,
    published: {
      id: published.id,
      status: published.status,
      kind: published.kind,
      transport: published.transport,
      providerPostId: published.provider_post_id,
      engagement: published.engagement_json,
    },
    candidates: generated.map((g) => ({ id: g?.id, kind: g?.kind, status: g?.status })),
    honesty:
      "Sandbox Meta credentials are mock (sandbox_meta_page_*). Publish used mock transport, not live Graph. Reach/impressions Insights are not pulled.",
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
