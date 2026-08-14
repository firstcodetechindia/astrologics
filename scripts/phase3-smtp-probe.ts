/**
 * Probe vault SMTP transport without re-seeding secrets. Prints host/from only.
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
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]!]) process.env[m[1]!] = val;
  }
}

async function main() {
  loadEnvLocal();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
  const { resolveEmail } = await import("../src/lib/comms/resolve.ts");
  const email = await resolveEmail();
  const password = email.ctx.secrets.password || "";
  const username = email.ctx.secrets.username || "";
  console.log(
    JSON.stringify(
      {
        slotKey: email.slotKey,
        transport: email.transport,
        sandboxMode: email.ctx.sandbox,
        host: email.ctx.config.host || null,
        port: email.ctx.config.port || null,
        from_email: email.ctx.config.from_email || null,
        usernameLooksMock: username.toLowerCase().startsWith("sandbox_"),
        passwordLooksMock:
          !password ||
          password.toLowerCase().startsWith("sandbox_") ||
          password.includes("_sandbox_"),
        passwordLast4: password ? password.slice(-4) : null,
        usernameLast4: username ? username.slice(-4) : null,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
