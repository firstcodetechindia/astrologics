import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const EMAIL = "phase1-admin@cosmicgyan.local";
const PASSWORD = "Phase1Admin!vault";

async function main() {
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase1-evidence");
  const login = await fetch(`${BASE}/api/admin/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email: EMAIL, password: PASSWORD }),
  });
  const setCookie = login.headers.getSetCookie?.() || [];
  const cookieHeader = login.headers.get("set-cookie") || "";
  const match = cookieHeader.match(/cg_admin_session=([^;]+)/);
  if (!match) {
    throw new Error(`Login failed: ${await login.text()}`);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1280,900"],
    defaultViewport: { width: 1280, height: 900 },
  });
  try {
    const page = await browser.newPage();
    await page.setCookie({
      name: "cg_admin_session",
      value: decodeURIComponent(match[1]!),
      url: BASE,
      httpOnly: true,
    });
    await page.goto(`${BASE}/en/admin/integrations`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForFunction(
      () => document.body.innerText.includes("OpenAI") && document.body.innerText.includes("Razorpay"),
      { timeout: 90000 }
    );
    await new Promise((r) => setTimeout(r, 400));
    const text = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(outDir, "panel-text.txt"), text);
    await page.screenshot({
      path: path.join(outDir, "integrations-top.png"),
      clip: { x: 0, y: 0, width: 1280, height: 900 },
    });
    await page.evaluate(() => {
      const el = [...document.querySelectorAll("h3")].find((n) =>
        n.textContent?.includes("Razorpay")
      );
      el?.scrollIntoView({ block: "center" });
    });
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({
      path: path.join(outDir, "integrations-payments.png"),
      clip: { x: 0, y: 0, width: 1280, height: 900 },
    });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        (b.textContent || "").includes("Test connection")
      );
      (btn as HTMLButtonElement | undefined)?.click();
    });
    await page.waitForFunction(
      () => /OK ·|FAIL ·/.test(document.body.innerText),
      { timeout: 20000 }
    ).catch(() => null);
    await page.screenshot({
      path: path.join(outDir, "integrations-test.png"),
      clip: { x: 0, y: 0, width: 1280, height: 900 },
    });
    console.log(JSON.stringify({ preview: text.slice(0, 1200), cookies: setCookie.length }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
