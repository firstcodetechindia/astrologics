/**
 * Phase 7 E2E recording: signup → AI consult → mock pay → email/SMS → chat
 * fact-filter → review → admin transaction/commission, then Support vs Finance UI.
 * npx tsx scripts/phase7-e2e-recording.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import ffmpegStatic from "ffmpeg-static";
import { getSql } from "../src/lib/db.ts";
import { ensureCommTemplates } from "../src/lib/comms/engine.ts";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const SUPER_EMAIL = process.env.PHASE1_EVIDENCE_ADMIN_EMAIL || "phase1-admin@cosmicgyan.local";
const SUPPORT_EMAIL = "phase7-support@cosmicgyan.local";
const FINANCE_EMAIL = "phase7-finance@cosmicgyan.local";

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

async function mint(email: string): Promise<string> {
  const { createAdminSession } = await import("../src/lib/auth/admin-session.ts");
  const sql = getSql();
  const rows = await sql`SELECT id FROM admin_staff WHERE email = ${email} LIMIT 1`;
  const id = String(rows[0]?.id || "");
  if (!id) throw new Error(`no staff ${email}`);
  return createAdminSession(id);
}

async function setAdminCookie(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>,
  token: string
) {
  await page.deleteCookie({ name: "cg_admin_session" }).catch(() => undefined);
  await page.setCookie({
    name: "cg_admin_session",
    value: token,
    url: BASE,
    path: "/",
    httpOnly: true,
  });
}

async function waitText(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>,
  text: string,
  ms = 30000
) {
  await page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: ms }, text);
}

async function main() {
  loadEnvLocal();
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase7-e2e-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  const notes: string[] = [];
  const shots: Record<string, string> = {};

  if (!ffmpegStatic || !fs.existsSync(ffmpegStatic)) {
    throw new Error("ffmpeg-static is missing — will not claim a recording");
  }
  notes.push(`ffmpeg: ${ffmpegStatic}`);

  await ensureCommTemplates();
  const superTok = await mint(SUPER_EMAIL);
  const supportTok = await mint(SUPPORT_EMAIL);
  const financeTok = await mint(FINANCE_EMAIL);

  const phone = `98${String(Date.now()).slice(-8)}`;
  const videoPath = path.join(outDir, "journey.webm") as `${string}.webm`;
  if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,900"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const recorder = await page.screencast({
    path: videoPath,
    ffmpegPath: ffmpegStatic,
    overwrite: true,
  });

  try {
    await page.goto(`${BASE}/en/signup`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/en/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator("#auth-phone").fill(phone);
    const filled = await page.$eval("#auth-phone", (el) => (el as HTMLInputElement).value);
    if (filled !== phone) {
      shots.signupFail = path.join(outDir, "01-signup-fail.png");
      await page.screenshot({ path: shots.signupFail, fullPage: true });
      throw new Error(`phone field value=${filled} expected=${phone}`);
    }
    const phoneHandle = await page.$("#auth-phone");
    await phoneHandle?.press("Enter");
    try {
      await waitText(page, "Enter the OTP sent", 20000);
    } catch (e) {
      const text = await page.evaluate(() => document.body.innerText.slice(0, 1200));
      shots.signupFail = path.join(outDir, "01-signup-fail.png");
      await page.screenshot({ path: shots.signupFail, fullPage: true });
      console.error("OTP_STEP_TEXT", text);
      throw e;
    }
    await page.waitForSelector('input[aria-label="OTP digit 1"]', { timeout: 15000 });
    await page.type('input[aria-label="OTP digit 1"]', "112233", { delay: 50 });
    await page.evaluate(() => {
      const buttons = document.querySelectorAll("button");
      for (const b of buttons) {
        if ((b.textContent || "").includes("Verify OTP")) b.click();
      }
    });
    await page.waitForFunction(() => !location.pathname.includes("/login"), { timeout: 20000 });
    shots.signup = path.join(outDir, "01-signup.png");
    await page.screenshot({ path: shots.signup, fullPage: true });
    notes.push(`signed up phone ${phone} (dummy OTP 112233)`);

    await page.goto(`${BASE}/en/chat-with-astrologer/jyoti-ai-guru`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await waitText(page, "Complete mock session");
    shots.consult = path.join(outDir, "02-consult.png");
    await page.screenshot({ path: shots.consult, fullPage: true });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        (b.textContent || "").includes("Complete mock session")
      );
      btn?.click();
    });
    await waitText(page, "Review recorded", 45000);
    await waitText(page, "taxable", 10000).catch(() => undefined);
    shots.paid = path.join(outDir, "03-paid-review.png");
    await page.screenshot({ path: shots.paid, fullPage: true });
    notes.push("AI_PERSONA mock consult captured; 5-star review row inserted");

    await page.goto(`${BASE}/en/chat`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitText(page, "Build kundli");
    const nameInput = await page.$('input[placeholder="Your name"]');
    if (!nameInput) throw new Error("chat name field missing");
    await nameInput.click({ clickCount: 3 });
    await nameInput.type("Phase7 Native", { delay: 20 });
    await page.evaluate(() => {
      const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      const date = document.querySelector('input[type="date"]');
      const time = document.querySelector('input[type="time"]');
      if (date && proto && proto.set) {
        proto.set.call(date, "1990-05-15");
        date.dispatchEvent(new Event("input", { bubbles: true }));
        date.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (time && proto && proto.set) {
        proto.set.call(time, "10:30");
        time.dispatchEvent(new Event("input", { bubbles: true }));
        time.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await page.click("#place-autocomplete");
    await page.type("#place-autocomplete", "Mumbai", { delay: 40 });
    await page.waitForSelector('[role="option"]', { timeout: 15000 });
    await page.click('[role="option"]');
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        (b.textContent || "").includes("Build kundli")
      );
      btn?.click();
    });
    await waitText(page, "Your kundli", 90000);
    const chatBox = await page.$('input[placeholder="Ask about your kundli…"]');
    if (!chatBox) throw new Error("chat input missing");
    await chatBox.type("Where is Mars in my chart?", { delay: 20 });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        (b.querySelector("svg") && b.getAttribute("type") === "button" && b.className.includes("!px-3.5"))
      );
      btn?.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes("free questions used"),
      { timeout: 90000 }
    );
    shots.chat = path.join(outDir, "04-chat-fact-filter.png");
    await page.screenshot({ path: shots.chat, fullPage: true });
    notes.push("public /en/chat turn completed (fact-filter runs on every AI turn)");

    await setAdminCookie(page, superTok);
    await page.goto(`${BASE}/en/admin/transactions`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await waitText(page, "Transactions");
    shots.transactions = path.join(outDir, "05-admin-transactions.png");
    await page.screenshot({ path: shots.transactions, fullPage: true });

    await page.goto(`${BASE}/en/admin/payouts`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitText(page, "Commission");
    shots.payouts = path.join(outDir, "06-admin-payouts.png");
    await page.screenshot({ path: shots.payouts, fullPage: true });

    await page.goto(`${BASE}/en/admin/comms/log`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitText(page, "Send log");
    shots.comms = path.join(outDir, "07-comms-log.png");
    await page.screenshot({ path: shots.comms, fullPage: true });

    await setAdminCookie(page, supportTok);
    await page.goto(`${BASE}/en/admin/billing`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitText(page, "No permission");
    shots.supportForbidden = path.join(outDir, "08-support-finance-forbidden.png");
    await page.screenshot({ path: shots.supportForbidden, fullPage: true });
    await page.goto(`${BASE}/en/admin/ai/logs`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitText(page, "Conversation Logs");
    shots.supportLogs = path.join(outDir, "09-support-logs-ok.png");
    await page.screenshot({ path: shots.supportLogs, fullPage: true });

    await setAdminCookie(page, financeTok);
    await page.goto(`${BASE}/en/admin/ai/logs`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitText(page, "No permission");
    shots.financeForbidden = path.join(outDir, "10-finance-logs-forbidden.png");
    await page.screenshot({ path: shots.financeForbidden, fullPage: true });
  } finally {
    await recorder.stop();
    await browser.close();
  }

  const sql = getSql();
  const receipts = await sql`
    SELECT channel, template_key, status, transport, to_addr, created_at
    FROM message_log
    WHERE template_key = ${"payment_receipt"}
    ORDER BY created_at DESC
    LIMIT 8
  `;
  const ledger = await sql`
    SELECT l.platform_minor, l.astrologer_minor, l.commission_bps, a.slug, p.receipt
    FROM commission_ledger l
    JOIN billing_astrologers a ON a.id = l.astrologer_id
    JOIN payments p ON p.id = l.payment_id
    WHERE a.slug = ${"jyoti-ai-guru"}
    ORDER BY l.created_at DESC
    LIMIT 3
  `;
  const videoBytes = fs.existsSync(videoPath) ? fs.statSync(videoPath).size : 0;
  const channels = new Set(receipts.map((r) => String(r.channel)));

  const report = {
    ok:
      videoBytes > 50_000 &&
      Boolean(shots.paid) &&
      Boolean(shots.chat) &&
      Boolean(shots.payouts) &&
      channels.has("email") &&
      channels.has("sms") &&
      ledger.length > 0,
    videoPath,
    videoBytes,
    ffmpeg: ffmpegStatic,
    phone,
    notes,
    shots,
    paymentReceipts: receipts.slice(0, 4),
    commission: ledger[0] || null,
    honesty: [
      "Public auth is still dummy OTP 112233 (Auth0 flag OFF).",
      "Consult payment is sandbox capture via completeMockConsult, not live Razorpay.",
      "Email/SMS use vault adapters; transport may be mock depending on slot sandbox.",
      "Every /api/chat assistant turn runs filterAiAgainstFactSheet.",
      "Review is the 5-star row completeMockConsult inserts (visible on the session page).",
    ],
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
