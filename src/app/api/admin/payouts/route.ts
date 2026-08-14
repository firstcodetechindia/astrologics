import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { markPayoutPaid, schedulePayout } from "@/lib/billing/engine";
import { writeAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "finance:read");
  if ("response" in auth) return auth.response;
  const sql = getSql();
  const ledger = await sql`
    SELECT l.*, a.display_name, p.receipt, i.invoice_no
    FROM commission_ledger l
    JOIN billing_astrologers a ON a.id = l.astrologer_id
    JOIN payments p ON p.id = l.payment_id
    LEFT JOIN invoices i ON i.payment_id = p.id
    ORDER BY l.created_at DESC
    LIMIT 80
  `;
  const batches = await sql`SELECT * FROM payout_batches ORDER BY created_at DESC LIMIT 40`;
  const astrologers = await sql`SELECT * FROM billing_astrologers ORDER BY display_name`;
  return NextResponse.json({ ok: true, ledger, batches, astrologers });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "finance:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    astrologerId?: string;
    displayName?: string;
    phone?: string;
    commissionBps?: number | null;
    payoutUpi?: string;
    batchId?: string;
    upiRef?: string;
  };
  const sql = getSql();
  try {
    if (body.action === "create-astrologer") {
      const phone = body.phone ? String(body.phone).replace(/\D/g, "") : null;
      if (phone) {
        const existing = await sql`SELECT id FROM billing_astrologers WHERE phone = ${phone} LIMIT 1`;
        if (existing[0]) {
          await sql`
            UPDATE billing_astrologers
            SET display_name = ${String(body.displayName || "Astrologer")},
                commission_bps = ${body.commissionBps ?? null},
                payout_upi = ${body.payoutUpi || null},
                active = ${true}
            WHERE id = ${existing[0].id}
          `;
        } else {
          await sql`
            INSERT INTO billing_astrologers (display_name, phone, kind, commission_bps, payout_upi)
            VALUES (
              ${String(body.displayName || "Astrologer")},
              ${phone},
              ${"REAL_HUMAN"},
              ${body.commissionBps ?? null},
              ${body.payoutUpi || null}
            )
          `;
        }
      } else {
        await sql`
          INSERT INTO billing_astrologers (display_name, phone, kind, commission_bps, payout_upi)
          VALUES (
            ${String(body.displayName || "Astrologer")},
            ${null},
            ${"REAL_HUMAN"},
            ${body.commissionBps ?? null},
            ${body.payoutUpi || null}
          )
        `;
      }
      await writeAuditLog({
        actor: auth.staff,
        action: "astrologer.billing.create",
        entityType: "billing_astrologer",
        summary: `Created billing astrologer ${body.displayName}`,
      });
    } else if (body.action === "schedule") {
      const result = await schedulePayout(body.astrologerId || null, auth.staff);
      return NextResponse.json({ ok: true, ...result });
    } else if (body.action === "mark-paid" && body.batchId) {
      await markPayoutPaid(body.batchId, String(body.upiRef || "UPI-REF"), auth.staff);
    } else {
      return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Payout failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
