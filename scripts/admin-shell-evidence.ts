/**
 * Super Admin visual redesign screenshots — live UI at desktop + mobile widths.
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

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

async function mintSessionToken(): Promise<string | null> {
  const { getSql } = await import("../src/lib/db.ts");
  const { createAdminSession } = await import("../src/lib/auth/admin-session.ts");
  const sql = getSql();
  const rows = await sql`
    SELECT id, must_change_password FROM admin_staff WHERE email = ${EMAIL} LIMIT 1
  `;
  const id = rows[0]?.id ? String(rows[0].id) : "";
  if (!id) return null;
  if (rows[0]?.must_change_password) {
    console.warn("admin has must_change_password=true; dashboard may redirect");
  }
  return createAdminSession(id);
}

async function main() {
  loadEnvLocal();
  const outDir = path.join(process.cwd(), "scripts/fixtures/admin-shell-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const health = await fetch(`${BASE}/en/admin`).then((r) => r.status).catch(() => 0);
  if (health < 200 || health >= 500) {
    console.error(JSON.stringify({ ok: false, error: `Next not reachable at ${BASE} (${health})` }));
    process.exit(1);
  }

  const token = await mintSessionToken();
  if (!token) {
    console.error(JSON.stringify({ ok: false, error: "admin session mint failed" }));
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,1100"],
  });
  const shots: Record<string, string> = {};
  const overflow: Record<string, boolean> = {};
  try {
    const page = await browser.newPage();
    await page.setCookie({
      name: "cg_admin_session",
      value: token,
      url: BASE,
      httpOnly: true,
    });

    async function measureOverflow() {
      return page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 2;
      });
    }

    async function shot(
      name: string,
      width: number,
      height: number,
      url: string,
      after?: () => Promise<void>
    ) {
      await page.setViewport({
        width,
        height,
        deviceScaleFactor: 2,
        isMobile: width < 768,
        hasTouch: width < 768,
      });
      await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () => !document.body.innerText.includes("Loading Super Admin"),
        { timeout: 20000 }
      );
      await page.waitForSelector(".recharts-surface", { timeout: 20000 }).catch(() => undefined);
      if (after) await after();
      await new Promise((r) => setTimeout(r, 800));
      overflow[name] = await measureOverflow();
      const file = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      shots[name] = file;
    }

    await shot("dashboard-desktop-1440", 1440, 1100, "/en/admin");
    await shot("dashboard-768", 768, 1024, "/en/admin");
    await shot("dashboard-430", 430, 932, "/en/admin");
    await shot("dashboard-390", 390, 844, "/en/admin");
    await shot("dashboard-360", 360, 800, "/en/admin");
    for (const [name, width, height] of [
      ["sidebar-drawer-360", 360, 800],
      ["sidebar-drawer-390", 390, 844],
      ["sidebar-drawer-430", 430, 932],
    ] as const) {
      await shot(name, width, height, "/en/admin", async () => {
        const menu = await page.$('button[aria-label="Open menu"]');
        if (menu) await menu.click();
        await new Promise((r) => setTimeout(r, 450));
      });
    }

    const failed = Object.entries(overflow).filter(([, v]) => v).map(([k]) => k);
    console.log(JSON.stringify({ ok: failed.length === 0, shots, overflow, failed }, null, 2));
    if (failed.length) process.exit(2);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
