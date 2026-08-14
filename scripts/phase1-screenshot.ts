/**
 * Screenshot the Super Admin Integrations panel for Phase 1 evidence.
 * Requires the Next dev server and a Super Admin (created by the evidence script).
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const key = m[1]!;
    let val = m[2]!;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const EMAIL = process.env.PHASE1_EVIDENCE_ADMIN_EMAIL || "phase1-admin@cosmicgyan.local";
const PASSWORD = process.env.PHASE1_EVIDENCE_ADMIN_PASSWORD || "Phase1Admin!vault";

async function main() {
  loadEnvLocal();
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase1-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,1100"],
    defaultViewport: { width: 1440, height: 1100 },
  });
  try {
    const page = await browser.newPage();
    await page.goto(`${BASE}/en/admin/login`, { waitUntil: "networkidle0", timeout: 60000 });

    const setup = await page.$("input[type=email]");
    if (setup) {
      const nameField = await page.$("input[autocomplete=name]");
      if (nameField) {
        await page.goto(`${BASE}/en/admin/setup`, { waitUntil: "networkidle0" });
        await page.type("input[autocomplete=name]", "Phase 1 Super Admin");
        await page.type("input[type=email]", EMAIL);
        await page.type("input[type=password]", PASSWORD);
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 }).catch(() => null),
          page.click("button[type=submit]"),
        ]);
      } else {
        await page.type("input[type=email]", EMAIL);
        await page.type("input[type=password]", PASSWORD);
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 }).catch(() => null),
          page.click("button[type=submit]"),
        ]);
      }
    }

    await page.goto(`${BASE}/en/admin/integrations`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    await page.waitForSelector("h1", { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 800));
    const panelPath = path.join(outDir, "integrations-panel.png");
    await page.screenshot({ path: panelPath, fullPage: true });

    const proofBtn = await page.$("button");
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent || "", btn);
      if (text.includes("Show DB proof")) {
        await btn.click();
        await new Promise((r) => setTimeout(r, 600));
        break;
      }
    }
    const proofPath = path.join(outDir, "encryption-proof.png");
    await page.screenshot({ path: proofPath, fullPage: true });

    const testButtons = await page.$$("button");
    let tested = 0;
    for (const btn of testButtons) {
      const text = await page.evaluate((el) => el.textContent || "", btn);
      if (text.includes("Test connection") && tested < 3) {
        await btn.click();
        tested += 1;
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    await new Promise((r) => setTimeout(r, 1200));
    const testsPath = path.join(outDir, "test-calls.png");
    await page.screenshot({ path: testsPath, fullPage: true });

    console.log(
      JSON.stringify({ ok: true, panelPath, proofPath, testsPath, url: `${BASE}/en/admin/integrations` }, null, 2)
    );
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
