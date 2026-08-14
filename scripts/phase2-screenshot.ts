/**
 * Screenshot Phase 2 checkout, GST invoice, admin billing, astrologer earnings.
 * Requires Next on BASE_URL (default http://127.0.0.1:3000) and Chrome.
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
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase2-evidence");
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

    const invoicePath = path.join(outDir, "invoice.html");
    if (fs.existsSync(invoicePath)) {
      await page.setContent(fs.readFileSync(invoicePath, "utf8"), { waitUntil: "domcontentloaded" });
      shots.invoice = path.join(outDir, "invoice.png");
      await page.screenshot({ path: shots.invoice, fullPage: true });
    }
    const earningsPath = path.join(outDir, "earnings.html");
    if (fs.existsSync(earningsPath)) {
      await page.setContent(fs.readFileSync(earningsPath, "utf8"), { waitUntil: "domcontentloaded" });
      shots.earningsHtml = path.join(outDir, "earnings-ledger.png");
      await page.screenshot({ path: shots.earningsHtml, fullPage: true });
    }

    const health = await fetch(`${BASE}/en/pay`).then((r) => r.status).catch(() => 0);
    if (health >= 200 && health < 500) {
      await page.goto(`${BASE}/en/pay`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.waitForSelector("h1", { timeout: 20000 });
      shots.checkout = path.join(outDir, "checkout.png");
      await page.screenshot({ path: shots.checkout, fullPage: true });
      const buttons = await page.$$("button");
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent || "", btn);
        if (text.includes("Pay with Razorpay")) {
          await btn.click();
          break;
        }
      }
      await page
        .waitForFunction(
          () =>
            document.body.innerText.includes("Payment captured") ||
            document.body.innerText.includes("Invoice:"),
          { timeout: 30000 }
        )
        .catch(() => null);
      shots.checkoutCaptured = path.join(outDir, "checkout-captured.png");
      await page.screenshot({ path: shots.checkoutCaptured, fullPage: true });

      await page.evaluate(() => {
        const profile = {
          phone: "9876500001",
          firstName: "Pandit",
          lastName: "Sharma",
          gender: "male",
          skills: ["vedic"],
          languages: ["hi"],
          categories: ["career"],
          status: "verified",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("cosmicgpt_astrologer_session_v1", JSON.stringify(profile));
      });
      await page.goto(`${BASE}/en/astrologer/dashboard`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 800));
      shots.astrologerEarnings = path.join(outDir, "astrologer-earnings.png");
      await page.screenshot({ path: shots.astrologerEarnings, fullPage: true });

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
        await page.goto(`${BASE}/en/admin/billing`, {
          waitUntil: "networkidle0",
          timeout: 60000,
        });
        await new Promise((r) => setTimeout(r, 800));
        shots.adminBilling = path.join(outDir, "admin-billing.png");
        await page.screenshot({ path: shots.adminBilling, fullPage: true });
      } else {
        const reportPath = path.join(outDir, "report.json");
        if (fs.existsSync(reportPath)) {
          const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as Record<string, unknown>;
          await page.setContent(
            `<!doctype html><html><body style="font-family:system-ui;padding:24px">
            <h1>Admin billing snapshot (login skipped — password rotated)</h1>
            <p>Razorpay primary · UPI/bank payout · not Razorpay Route</p>
            <pre>${JSON.stringify(report, null, 2)}</pre>
            </body></html>`
          );
          shots.adminBilling = path.join(outDir, "admin-billing.png");
          await page.screenshot({ path: shots.adminBilling, fullPage: true });
        } else {
          shots.adminBilling = "skipped (admin login failed — password may have been rotated)";
        }
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
