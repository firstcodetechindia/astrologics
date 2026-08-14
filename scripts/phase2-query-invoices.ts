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
  const { getSql } = await import("../src/lib/db.ts");
  const sql = getSql();
  const invoices = await sql`
    SELECT i.invoice_no, i.payment_id, p.status, p.purpose, p.place_of_supply,
           p.amount_minor, i.issued_at
    FROM invoices i JOIN payments p ON p.id = i.payment_id
    ORDER BY i.invoice_no
  `;
  const comm = await sql`
    SELECT l.id, l.status, l.astrologer_minor, l.taxable_minor, i.invoice_no, p.status AS pay_status
    FROM commission_ledger l
    JOIN payments p ON p.id = l.payment_id
    LEFT JOIN invoices i ON i.payment_id = p.id
    ORDER BY l.created_at
  `;
  const settings = await sql`
    SELECT invoice_prefix, next_invoice_seq FROM billing_settings WHERE id = ${"default"}
  `;
  const dupes = await sql`
    SELECT invoice_no, count(*)::int AS n FROM invoices GROUP BY invoice_no HAVING count(*) > 1
  `;
  console.log(JSON.stringify({ settings: settings[0], dupes, invoices, commission: comm }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
