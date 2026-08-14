import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { rupees } from "@/lib/billing/gst";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const phone = (url.searchParams.get("phone") || "").replace(/\D/g, "");
  const id = url.searchParams.get("astrologerId");
  if (!phone && !id) {
    return NextResponse.json({ ok: false, error: "phone or astrologerId required" }, { status: 400 });
  }
  const sql = getSql();
  const astro = id
    ? await sql`SELECT * FROM billing_astrologers WHERE id = ${id} LIMIT 1`
    : await sql`SELECT * FROM billing_astrologers WHERE phone = ${phone} LIMIT 1`;
  if (!astro[0]) {
    return NextResponse.json({ ok: true, astrologer: null, ledger: [], totals: null });
  }
  const ledger = await sql`
    SELECT l.*, p.receipt, i.invoice_no, p.amount_minor AS paid_minor,
           p.status AS payment_status, cn.credit_note_no
    FROM commission_ledger l
    JOIN payments p ON p.id = l.payment_id
    LEFT JOIN invoices i ON i.payment_id = p.id AND i.voided = false
    LEFT JOIN credit_notes cn ON cn.payment_id = p.id
    WHERE l.astrologer_id = ${astro[0].id}
    ORDER BY l.created_at DESC
  `;
  const totals = ledger.reduce(
    (acc, row) => {
      const kind = String(row.entry_kind || "earning");
      const status = String(row.status);
      if (kind === "clawback") {
        acc.astrologer += Number(row.astrologer_minor);
        acc.clawback += Number(row.astrologer_minor);
        return acc;
      }
      if (status === "reversed") {
        acc.reversed += Number(row.astrologer_minor);
        return acc;
      }
      acc.taxable += Number(row.taxable_minor);
      acc.platform += Number(row.platform_minor);
      acc.astrologer += Number(row.astrologer_minor);
      return acc;
    },
    { taxable: 0, platform: 0, astrologer: 0, reversed: 0, clawback: 0 }
  );
  return NextResponse.json({
    ok: true,
    astrologer: astro[0],
    ledger,
    totals: {
      ...totals,
      taxableLabel: rupees(totals.taxable),
      platformLabel: rupees(totals.platform),
      astrologerLabel: rupees(totals.astrologer),
      reversedLabel: rupees(totals.reversed),
      clawbackLabel: rupees(totals.clawback),
    },
  });
}
