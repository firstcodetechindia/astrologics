/**
 * Dashboard load sequence + CLS on throttled network.
 * LABEL=before|after npx tsx scripts/admin-dashboard-load-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const EMAIL = process.env.PHASE1_EVIDENCE_ADMIN_EMAIL || "phase1-admin@cosmicgyan.local";
const LABEL = process.env.LABEL === "after" ? "after" : "before";

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
  const outDir = path.join(process.cwd(), "scripts/fixtures/admin-load-evidence", LABEL);
  fs.mkdirSync(outDir, { recursive: true });
  const token = await mintSessionToken();

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,1100"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    await page.setCacheEnabled(false);
    const cdp = await page.createCDPSession();
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 562,
      downloadThroughput: Math.floor((1.6 * 1024 * 1024) / 8),
      uploadThroughput: Math.floor((750 * 1024) / 8),
      connectionType: "cellular3g",
    });
    await page.evaluateOnNewDocument(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!e.hadRecentInput) {
              (window as unknown as { __cls: number }).__cls += Number(e.value || 0);
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch {
        /* ignore */
      }
    });
    await page.setCookie({
      name: "cg_admin_session",
      value: token,
      url: BASE,
      path: "/",
      httpOnly: true,
    });

    await page.goto(`${BASE}/en/admin`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForFunction(
      () =>
        document.body.innerText.includes("Dashboard") &&
        Boolean(document.querySelector(".admin-chart-skeleton, .recharts-surface")),
      { timeout: 90000 }
    );

    const frames: string[] = [];
    const t0 = Date.now();
    for (const ms of [0, 200, 450, 800, 1400, 2400, 4000, 6500]) {
      const wait = ms - (Date.now() - t0);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const file = path.join(outDir, `t${String(ms).padStart(4, "0")}.png`);
      await page.screenshot({ path: file });
      frames.push(file);
    }
    await page.waitForSelector(".recharts-surface", { timeout: 60000 }).catch(() => undefined);
    await new Promise((r) => setTimeout(r, 400));
    const settled = path.join(outDir, "settled.png");
    await page.screenshot({ path: settled, fullPage: true });
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls || 0);
    const hasChart = await page.$(".recharts-surface");
    const hasSkeleton = await page.$(".admin-chart-skeleton");
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 400));

    const gif = path.join(outDir, `load-${LABEL}.gif`);
    const py = spawnSync(
      "python3",
      [
        "-c",
        `from PIL import Image
import glob
files=sorted(glob.glob(${JSON.stringify(path.join(outDir, "t*.png"))}))
ims=[Image.open(f).convert("P", palette=Image.ADAPTIVE) for f in files]
ims[0].save(${JSON.stringify(gif)}, save_all=True, append_images=ims[1:], duration=380, loop=0, optimize=True)
print("gif", ${JSON.stringify(gif)})
`,
      ],
      { encoding: "utf8" }
    );

    const report = {
      ok: Boolean(hasChart),
      label: LABEL,
      cls: Number(cls.toFixed(4)),
      hasChart: Boolean(hasChart),
      hasSkeleton: Boolean(hasSkeleton),
      bodyPreview: bodyText.replace(/\s+/g, " ").slice(0, 180),
      frames,
      settled,
      gif: py.status === 0 ? gif : `gif skipped: ${py.stderr?.slice(0, 240)}`,
    };
    fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
