/**
 * Go-live checklist audit — no plaintext secrets.
 * npx tsx scripts/go-live-audit.ts
 */
import fs from "node:fs";
import path from "node:path";

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

function last4(v: string) {
  return v.slice(-4);
}

async function main() {
  loadEnvLocal();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";

  const { getSql } = await import("../src/lib/db.ts");
  const { getFeatureFlag, AUTH0_FLAG_KEY } = await import("../src/lib/platform/feature-flags.ts");
  const { getAuth0VaultConfig, resolveAuthMode } = await import("../src/lib/auth/auth0.ts");
  const { getVaultRecoveryStatus } = await import("../src/lib/platform/secrets/kek-backup.ts");
  const { getProviderBySlot } = await import("../src/lib/platform/integrations/store.ts");
  const { decryptProviderSecrets } = await import("../src/lib/platform/secrets/vault.ts");
  const { isMockCredential, resolveTransport } = await import(
    "../src/lib/platform/integrations/transport.ts"
  );
  const { resolveEmail, resolveSms } = await import("../src/lib/comms/resolve.ts");

  const sql = getSql();

  async function slotReport(category: "payment" | "email" | "sms" | "whatsapp" | "social" | "auth", slotKey: string) {
    const row = await getProviderBySlot(category, slotKey);
    if (!row) return { slotKey, missing: true };
    const secrets = await decryptProviderSecrets(String(row.id));
    const names = Object.keys(secrets);
    const mockNames = names.filter((n) => isMockCredential(secrets[n]));
    const liveNames = names.filter((n) => secrets[n] && !isMockCredential(secrets[n]));
    const probe = names[0] ? secrets[names[0]] : "";
    return {
      slotKey,
      enabled: Boolean(row.enabled),
      sandboxMode: Boolean(row.sandbox_mode),
      secretCount: names.length,
      mockSecretCount: mockNames.length,
      liveSecretCount: liveNames.length,
      mockSecretNames: mockNames,
      liveSecretNames: liveNames,
      last4: Object.fromEntries(names.map((n) => [n, last4(secrets[n] || "")])),
      transportGuess: resolveTransport(
        { secrets, config: {}, sandbox: Boolean(row.sandbox_mode) },
        probe
      ),
    };
  }

  const auth0Flag = await getFeatureFlag(AUTH0_FLAG_KEY);
  const auth0Cfg = await getAuth0VaultConfig();
  const authMode = await resolveAuthMode();
  const kek = await getVaultRecoveryStatus();
  const email = await resolveEmail();
  const sms = await resolveSms();

  const wa = await sql`
    SELECT status, count(*)::int AS n
    FROM whatsapp_template_submissions
    GROUP BY status
    ORDER BY status
  `;
  const waVersions = await sql`
    SELECT v.status, count(*)::int AS n
    FROM message_template_versions v
    JOIN message_templates t ON t.id = v.template_id
    WHERE t.channel = ${"whatsapp"}
    GROUP BY v.status
  `;

  const rbacPath = path.join(process.cwd(), "scripts/fixtures/phase7-rbac-evidence/report.json");
  const rbac = fs.existsSync(rbacPath)
    ? (JSON.parse(fs.readFileSync(rbacPath, "utf8")) as {
        ok?: boolean;
        checks?: Record<string, { status?: number; permission?: string }>;
      })
    : null;
  const festivalPath = path.join(process.cwd(), "scripts/fixtures/go-live-evidence/festival-panchang.json");
  const festival = fs.existsSync(festivalPath)
    ? (JSON.parse(fs.readFileSync(festivalPath, "utf8")) as { ok?: boolean })
    : null;

  const razorpay = await slotReport("payment", "razorpay");
  const smtp = await slotReport("email", "smtp");
  const smsSlot = await slotReport("sms", "generic_sms");
  const waSlot = await slotReport("whatsapp", "meta_whatsapp");
  const social = await slotReport("social", "meta_social");
  const auth0Slot = await slotReport("auth", "auth0");

  const items = {
    auth0: {
      id: 1,
      status: authMode === "otp" && !auth0Flag && !auth0Cfg ? "open_needs_decision" : authMode === "auth0" ? "closed_auth0" : "open_needs_decision",
      authMode,
      flag: auth0Flag,
      liveVaultConfig: Boolean(auth0Cfg),
      slot: auth0Slot,
      note: "Flag stays OFF. Sandbox Auth0 secrets are not live. Launch-on-OTP is a human decision — not flipped here.",
    },
    razorpay: {
      id: 2,
      status:
        razorpay.liveSecretCount >= 3 && razorpay.sandboxMode === false && razorpay.transportGuess !== "mock"
          ? "closed"
          : "blocked_needs_live_keys",
      slot: razorpay,
      note: "Need live key_id, key_secret, webhook_secret in the vault and sandbox_mode off.",
    },
    smtpSms: {
      id: 3,
      status: email.transport === "live" && sms.transport === "live" ? "closed" : "blocked_needs_live_keys",
      email: {
        slotKey: email.slotKey,
        transport: email.transport,
        sandbox: email.ctx.sandbox,
        host: email.ctx.config.host || null,
        from: email.ctx.config.from_email || null,
        usernameMock: isMockCredential(email.ctx.secrets.username),
        passwordMock: isMockCredential(email.ctx.secrets.password),
      },
      sms: {
        slotKey: sms.slotKey,
        transport: sms.transport,
        sandbox: sms.ctx.sandbox,
        apiKeyMock: isMockCredential(sms.ctx.secrets.api_key),
      },
      smtpSlot: smtp,
      smsSlot,
      note: "Phase 3 Gmail round-trip never closed — last evidence was smtp_sandbox_* mock.",
    },
    kekBackup: {
      id: 4,
      status: kek.backupRecorded ? "partial_db_stamp_only" : "not_done",
      backupRecorded: kek.backupRecorded,
      backupDownloadedAt: kek.backupDownloadedAt,
      fingerprintMatches: kek.fingerprintMatches,
      fingerprintPrefix: kek.fingerprint.slice(0, 12),
      source: kek.source,
      wrapKeyFileExists: fs.existsSync(path.join(process.cwd(), ".vault/wrap.key")),
      note: "Phase 1 proved in-memory round-trip. backup_downloaded_at is the DB stamp that a Super Admin downloaded a file. Offline storage of that file cannot be verified from this repo.",
    },
    festivalPanchang: {
      id: 5,
      status: festival?.ok ? "closed" : "open",
      festivalEvidenceOk: Boolean(festival?.ok),
      liveGraphBlocked: social.transportGuess === "mock" || social.sandboxMode === true || social.liveSecretCount === 0,
      socialSlot: social,
      note: "Hindu festival dates now use tithi+paksha+masa. That date-path is closed. Live Graph is still blocked by sandbox_meta_* — a credential step, not a second calendar.",
    },
    conversationLogsRead: {
      id: 6,
      status: rbac?.ok && rbac.checks?.financeLogs?.status === 403 && rbac.checks?.supportLogs?.status === 200 ? "shipped" : "missing_evidence",
      rbacReportOk: Boolean(rbac?.ok),
      financeLogs: rbac?.checks?.financeLogs || null,
      supportLogs: rbac?.checks?.supportLogs || null,
      note: "Shipped in Phase 7. Finance 403 conversation_logs:read; Support 200.",
    },
    whatsappMeta: {
      id: 7,
      status: "blocked_mock_only",
      submissions: wa,
      versionStatuses: waVersions,
      slot: waSlot,
      note: "sandbox_approved is Super Admin mock review, not Meta. Live send needs Graph-approved templates and live WA token.",
    },
  };

  const blocked = Object.values(items).filter((i) => i.status !== "shipped" && i.status !== "closed" && i.status !== "closed_auth0").map((i) => i.id);
  const report = {
    generatedAt: new Date().toISOString(),
    okForRealUsersAndMoney: blocked.length === 0,
    blockedItemIds: blocked,
    items,
  };

  const outDir = path.join(process.cwd(), "scripts/fixtures/go-live-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "checklist.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.okForRealUsersAndMoney) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
