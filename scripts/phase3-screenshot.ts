/**
 * Screenshot Phase 3 communications admin + render/WhatsApp HTML snapshots.
 * Requires Chrome. Live /en/admin/comms if Next is up and admin login still works.
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

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const EMAIL = process.env.PHASE1_EVIDENCE_ADMIN_EMAIL || "phase1-admin@cosmicgyan.local";
const PASSWORD = process.env.PHASE1_EVIDENCE_ADMIN_PASSWORD || "Phase1Admin!vault";

async function main() {
  loadEnvLocal();
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase3-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1280,1100"],
    defaultViewport: { width: 1280, height: 1100 },
  });
  const shots: Record<string, string> = {};
  try {
    const page = await browser.newPage();
    for (const name of ["render-preview", "whatsapp-submission", "automations", "admin-comms"]) {
      const htmlPath = path.join(outDir, `${name}.html`);
      if (!fs.existsSync(htmlPath)) continue;
      await page.setContent(fs.readFileSync(htmlPath, "utf8"), { waitUntil: "domcontentloaded" });
      shots[name] = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: shots[name], fullPage: true });
    }

    const health = await fetch(`${BASE}/en/admin/comms`).then((r) => r.status).catch(() => 0);
    if (health >= 200 && health < 500) {
      const login = await fetch(`${BASE}/api/admin/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: EMAIL, password: PASSWORD }),
      });
      const cookieHeader = login.headers.get("set-cookie") || "";
      const match = cookieHeader.match(/cg_admin_session=([^;]+)/);
      if (match) {
        await page.setCookie({
          name: "cg_admin_session",
          value: decodeURIComponent(match[1]!),
          url: BASE,
          httpOnly: true,
        });
        await page.goto(`${BASE}/en/admin/comms`, {
          waitUntil: "networkidle0",
          timeout: 60000,
        });
        await new Promise((r) => setTimeout(r, 800));
        shots.adminComms = path.join(outDir, "admin-comms.png");
        await page.screenshot({ path: shots.adminComms, fullPage: true });
        const buttons = await page.$$("button");
        for (const btn of buttons) {
          const text = await page.evaluate((el) => el.textContent || "", btn);
          if (text.includes("WhatsApp approval")) {
            await btn.click();
            break;
          }
        }
        await new Promise((r) => setTimeout(r, 600));
        shots.adminWhatsapp = path.join(outDir, "admin-whatsapp.png");
        await page.screenshot({ path: shots.adminWhatsapp, fullPage: true });
      } else {
        shots.adminComms = "skipped (admin login failed — password may have been rotated)";
      }
    } else {
      shots.liveUi = `skipped (Next not reachable at ${BASE})`;
    }
    console.log(JSON.stringify({ ok: true, shots }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
