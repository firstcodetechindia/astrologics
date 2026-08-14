/**
 * Phase 7 RBAC evidence: Support vs Finance vs Super Admin API + UI.
 * npx tsx scripts/phase7-rbac-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { getSql } from "../src/lib/db.ts";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const SUPER_EMAIL = process.env.PHASE1_EVIDENCE_ADMIN_EMAIL || "phase1-admin@cosmicgyan.local";
const SUPPORT_EMAIL = "phase7-support@cosmicgyan.local";
const FINANCE_EMAIL = "phase7-finance@cosmicgyan.local";
const STAFF_PASSWORD = "Phase7RbacPass!";

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

async function probe(
  token: string,
  pathName: string,
  method = "GET"
): Promise<{ status: number; ok: boolean; error?: string; permission?: string; role?: string }> {
  const res = await fetch(`${BASE}${pathName}`, {
    method,
    headers: {
      Cookie: `cg_admin_session=${token}`,
      ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
    },
    body: method !== "GET" ? JSON.stringify({ action: "save-persona" }) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return {
    status: res.status,
    ok: json.ok === true,
    error: json.error ? String(json.error) : undefined,
    permission: json.permission ? String(json.permission) : undefined,
    role: json.role ? String(json.role) : undefined,
  };
}

async function shot(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>,
  token: string,
  href: string,
  file: string,
  waitText: string
) {
  await page.setCookie({
    name: "cg_admin_session",
    value: token,
    url: BASE,
    path: "/",
    httpOnly: true,
  });
  await page.goto(`${BASE}/en${href}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  try {
    await page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 25000 }, waitText);
  } catch (e) {
    const text = await page.evaluate(() => document.body.innerText.slice(0, 800));
    const cookies = await page.cookies();
    console.error("SHOT_FAIL", href, "wanted", waitText, "url", page.url(), "cookies", cookies.map((c) => c.name), "text", text);
    await page.screenshot({ path: file.replace(".png", "-fail.png"), fullPage: true });
    throw e;
  }
  await page.screenshot({ path: file, fullPage: true });
}

async function main() {
  loadEnvLocal();
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase7-rbac-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const { upsertAdminStaff } = await import("../src/lib/auth/admin-session.ts");
  await upsertAdminStaff({
    email: SUPPORT_EMAIL,
    password: STAFF_PASSWORD,
    displayName: "Phase 7 Support",
    role: "support",
    mustChangePassword: false,
  });
  await upsertAdminStaff({
    email: FINANCE_EMAIL,
    password: STAFF_PASSWORD,
    displayName: "Phase 7 Finance",
    role: "finance",
    mustChangePassword: false,
  });

  const supportTok = await mint(SUPPORT_EMAIL);
  const financeTok = await mint(FINANCE_EMAIL);
  const superTok = await mint(SUPER_EMAIL);

  const checks = {
    supportBilling: await probe(supportTok, "/api/admin/billing"),
    supportLogs: await probe(supportTok, "/api/admin/ai"),
    supportVault: await probe(supportTok, "/api/admin/integrations"),
    financeLogs: await probe(financeTok, "/api/admin/ai"),
    financeBilling: await probe(financeTok, "/api/admin/billing"),
    financeVault: await probe(financeTok, "/api/admin/integrations"),
    superLogs: await probe(superTok, "/api/admin/ai"),
    supportAiWrite: await probe(supportTok, "/api/admin/ai", "POST"),
  };

  const sql = getSql();
  const denies = await sql`
    SELECT action, entity_id, summary, actor_email, created_at
    FROM integration_audit_log
    WHERE action = ${"rbac.deny"}
    ORDER BY created_at DESC
    LIMIT 12
  `;

  console.log("API_CHECKS", JSON.stringify(checks, null, 2));

  const shots: Record<string, string> = {};
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,1100"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    shots.supportBillingUi = path.join(outDir, "support-billing-forbidden.png");
    await shot(page, supportTok, "/admin/billing", shots.supportBillingUi, "No permission");
    shots.supportLogsUi = path.join(outDir, "support-conversation-logs.png");
    await shot(page, supportTok, "/admin/ai/logs", shots.supportLogsUi, "Conversation Logs");
    shots.financeLogsUi = path.join(outDir, "finance-logs-forbidden.png");
    await shot(page, financeTok, "/admin/ai/logs", shots.financeLogsUi, "No permission");
    shots.financeBillingUi = path.join(outDir, "finance-billing.png");
    await shot(page, financeTok, "/admin/billing", shots.financeBillingUi, "Billing");
  } finally {
    await browser.close();
  }

  const report = {
    ok:
      checks.supportBilling.status === 403 &&
      checks.supportBilling.permission === "finance:read" &&
      checks.supportLogs.status === 200 &&
      checks.supportVault.status === 403 &&
      checks.financeLogs.status === 403 &&
      checks.financeLogs.permission === "conversation_logs:read" &&
      checks.financeBilling.status === 200 &&
      checks.financeVault.status === 403 &&
      checks.superLogs.status === 200 &&
      checks.supportAiWrite.status === 403 &&
      denies.length > 0,
    checks,
    rbacDenyAuditRows: denies.length,
    latestDenies: denies.slice(0, 6),
    shots,
    honesty:
      "Hidden nav is not the gate. Support 403 on /api/admin/billing and vault; 200 on conversation list. Finance 403 on logs and vault; 200 on billing. rbac.deny is written to audit_log.",
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
