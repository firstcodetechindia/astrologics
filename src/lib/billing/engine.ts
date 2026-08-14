import { getSql } from "@/lib/db";
import { commissionSplit, gstBreakdown, rupees } from "@/lib/billing/gst";
import { resolvePaymentGateway } from "@/lib/billing/resolve-gateway";
import { siteConfig } from "@/lib/site-config";
import { writeAuditLog } from "@/lib/platform/audit";
import type { AdminStaff } from "@/lib/auth/admin-session";

export type BillingSettings = {
  id: string;
  legal_name: string;
  gstin: string;
  pan: string;
  address_line: string;
  city: string;
  state_code: string;
  state_name: string;
  pincode: string;
  gst_rate_bps: number;
  sac_code: string;
  hsn_code: string;
  global_commission_bps: number;
  consult_rate_min_minor: number;
  consult_rate_max_minor: number;
  invoice_prefix: string;
  next_invoice_seq: number;
  credit_note_prefix: string;
  next_credit_note_seq: number;
};

export async function getBillingSettings(): Promise<BillingSettings> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM billing_settings WHERE id = ${"default"} LIMIT 1`;
  if (!rows[0]) throw new Error("billing_settings missing — run db:migrate:platform");
  const r = rows[0];
  return {
    id: "default",
    legal_name: String(r.legal_name),
    gstin: String(r.gstin),
    pan: String(r.pan),
    address_line: String(r.address_line),
    city: String(r.city),
    state_code: String(r.state_code),
    state_name: String(r.state_name),
    pincode: String(r.pincode),
    gst_rate_bps: Number(r.gst_rate_bps),
    sac_code: String(r.sac_code),
    hsn_code: String(r.hsn_code),
    global_commission_bps: Number(r.global_commission_bps),
    consult_rate_min_minor: Number(r.consult_rate_min_minor ?? 500),
    consult_rate_max_minor: Number(r.consult_rate_max_minor ?? 50000),
    invoice_prefix: String(r.invoice_prefix),
    next_invoice_seq: Number(r.next_invoice_seq),
    credit_note_prefix: String(r.credit_note_prefix || "CG-CN"),
    next_credit_note_seq: Number(r.next_credit_note_seq || 0),
  };
}

export async function updateBillingSettings(
  patch: Partial<BillingSettings>,
  actor: AdminStaff
) {
  const cur = await getBillingSettings();
  const next = { ...cur, ...patch };
  const sql = getSql();
  await sql`
    UPDATE billing_settings SET
      legal_name = ${next.legal_name},
      gstin = ${next.gstin},
      pan = ${next.pan},
      address_line = ${next.address_line},
      city = ${next.city},
      state_code = ${next.state_code},
      state_name = ${next.state_name},
      pincode = ${next.pincode},
      gst_rate_bps = ${next.gst_rate_bps},
      sac_code = ${next.sac_code},
      hsn_code = ${next.hsn_code},
      global_commission_bps = ${next.global_commission_bps},
      consult_rate_min_minor = ${next.consult_rate_min_minor},
      consult_rate_max_minor = ${next.consult_rate_max_minor},
      invoice_prefix = ${next.invoice_prefix},
      updated_at = now()
    WHERE id = ${"default"}
  `;
  await writeAuditLog({
    actor,
    action: "billing.settings",
    entityType: "billing_settings",
    entityId: "default",
    summary: "Updated GST / commission settings",
  });
  return getBillingSettings();
}

export async function upsertCustomer(input: {
  phone?: string;
  email?: string;
  displayName: string;
  stateCode?: string;
}) {
  const sql = getSql();
  const phone = input.phone?.replace(/\D/g, "") || null;
  if (phone) {
    const existing = await sql`SELECT id FROM billing_customers WHERE phone = ${phone} LIMIT 1`;
    if (existing[0]) {
      await sql`
        UPDATE billing_customers
        SET display_name = ${input.displayName},
            email = ${input.email || null},
            state_code = ${input.stateCode || "MH"}
        WHERE id = ${existing[0].id}
      `;
      return String(existing[0].id);
    }
  }
  const rows = await sql`
    INSERT INTO billing_customers (phone, email, display_name, state_code)
    VALUES (${phone}, ${input.email || null}, ${input.displayName}, ${input.stateCode || "MH"})
    RETURNING id
  `;
  return String(rows[0]!.id);
}

/**
 * Allocate + insert the tax invoice in one SQL statement so a failed insert
 * rolls back the sequence increment (no gaps, no reuse).
 */
async function insertTaxInvoice(input: {
  paymentId: string;
  buyerName: string;
  buyerState: string;
  description: string;
  gst: ReturnType<typeof gstBreakdown>;
  gateway: string;
  sandbox: boolean;
}) {
  const sql = getSql();
  const settings = await getBillingSettings();
  const year = new Date().getFullYear();
  const issuedAt = new Date().toISOString();
  const rows = await sql`
    WITH next AS (
      UPDATE billing_settings
      SET next_invoice_seq = next_invoice_seq + 1
      WHERE id = ${"default"}
      RETURNING next_invoice_seq, invoice_prefix, gstin
    )
    INSERT INTO invoices (
      payment_id, invoice_no, buyer_name, buyer_state, seller_gstin, line_description, html, voided
    )
    SELECT
      ${input.paymentId},
      next.invoice_prefix || ${`-${year}-`} || lpad(CAST(next.next_invoice_seq AS text), 4, '0'),
      ${input.buyerName},
      ${input.buyerState},
      next.gstin,
      ${input.description},
      ${""},
      ${false}
    FROM next
    RETURNING invoice_no, seller_gstin
  `;
  const invoiceNo = String(rows[0]!.invoice_no);
  const html = invoiceHtml({
    invoiceNo,
    settings: { ...settings, gstin: String(rows[0]!.seller_gstin) },
    buyerName: input.buyerName,
    buyerState: input.buyerState,
    description: input.description,
    gst: input.gst,
    gateway: input.gateway,
    sandbox: input.sandbox,
    issuedAt,
  });
  await sql`UPDATE invoices SET html = ${html} WHERE invoice_no = ${invoiceNo}`;
  return invoiceNo;
}

async function insertCreditNote(input: {
  refundRequestId: string;
  paymentId: string;
  originalInvoiceNo: string;
  buyerName: string;
  buyerState: string;
  gst: {
    amountMinor: number;
    taxableMinor: number;
    gstMinor: number;
    cgstMinor: number;
    sgstMinor: number;
    igstMinor: number;
    gstRateBps: number;
    split: "cgst_sgst" | "igst";
  };
}) {
  const sql = getSql();
  const settings = await getBillingSettings();
  const year = new Date().getFullYear();
  const issuedAt = new Date().toISOString();
  const rows = await sql`
    WITH next AS (
      UPDATE billing_settings
      SET next_credit_note_seq = next_credit_note_seq + 1
      WHERE id = ${"default"}
      RETURNING next_credit_note_seq, credit_note_prefix, gstin, legal_name, sac_code
    )
    INSERT INTO credit_notes (
      refund_request_id, payment_id, original_invoice_no, credit_note_no,
      buyer_name, buyer_state, seller_gstin,
      taxable_minor, gst_minor, cgst_minor, sgst_minor, igst_minor, amount_minor, html
    )
    SELECT
      ${input.refundRequestId},
      ${input.paymentId},
      ${input.originalInvoiceNo},
      next.credit_note_prefix || ${`-${year}-`} || lpad(CAST(next.next_credit_note_seq AS text), 4, '0'),
      ${input.buyerName},
      ${input.buyerState},
      next.gstin,
      ${input.gst.taxableMinor},
      ${input.gst.gstMinor},
      ${input.gst.cgstMinor},
      ${input.gst.sgstMinor},
      ${input.gst.igstMinor},
      ${input.gst.amountMinor},
      ${""}
    FROM next
    RETURNING credit_note_no, seller_gstin
  `;
  const creditNoteNo = String(rows[0]!.credit_note_no);
  const html = creditNoteHtml({
    creditNoteNo,
    originalInvoiceNo: input.originalInvoiceNo,
    settings: { ...settings, gstin: String(rows[0]!.seller_gstin) },
    buyerName: input.buyerName,
    buyerState: input.buyerState,
    gst: input.gst,
    issuedAt,
  });
  await sql`UPDATE credit_notes SET html = ${html} WHERE credit_note_no = ${creditNoteNo}`;
  return creditNoteNo;
}

function creditNoteHtml(input: {
  creditNoteNo: string;
  originalInvoiceNo: string;
  settings: BillingSettings;
  buyerName: string;
  buyerState: string;
  gst: {
    amountMinor: number;
    taxableMinor: number;
    gstMinor: number;
    cgstMinor: number;
    sgstMinor: number;
    igstMinor: number;
    gstRateBps: number;
    split: "cgst_sgst" | "igst";
  };
  issuedAt: string;
}) {
  const taxRows =
    input.gst.split === "igst"
      ? `<tr><td>IGST (${(input.gst.gstRateBps / 100).toFixed(2)}%)</td><td style="text-align:right">${rupees(input.gst.igstMinor)}</td></tr>`
      : `<tr><td>CGST (${(input.gst.gstRateBps / 200).toFixed(2)}%)</td><td style="text-align:right">${rupees(input.gst.cgstMinor)}</td></tr>
         <tr><td>SGST (${(input.gst.gstRateBps / 200).toFixed(2)}%)</td><td style="text-align:right">${rupees(input.gst.sgstMinor)}</td></tr>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${input.creditNoteNo}</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px;color:#111} table{width:100%;border-collapse:collapse} td,th{padding:8px;border-bottom:1px solid #ddd}</style>
  </head><body>
  <h1>${input.settings.legal_name}</h1>
  <p>GSTIN: ${input.settings.gstin || "—"} · ${input.settings.address_line} ${input.settings.city} ${input.settings.state_name} ${input.settings.pincode}</p>
  <h2>Credit Note ${input.creditNoteNo}</h2>
  <p>Date: ${input.issuedAt}</p>
  <p><strong>Against Tax Invoice ${input.originalInvoiceNo}</strong></p>
  <p>Bill to: ${input.buyerName} · Place of supply: ${input.buyerState}</p>
  <table>
    <tr><th>Description</th><th style="text-align:right">Amount credited</th></tr>
    <tr><td>Refund of taxable value (SAC ${input.settings.sac_code})</td><td style="text-align:right">${rupees(input.gst.taxableMinor)}</td></tr>
    ${taxRows}
    <tr><th>Total credit (incl. GST)</th><th style="text-align:right">${rupees(input.gst.amountMinor)}</th></tr>
  </table>
  <p>This credit note reverses Tax Invoice ${input.originalInvoiceNo} for GST reporting. Merchant of record: ${input.settings.legal_name}.</p>
  <p>This is a computer-generated credit note.</p>
  </body></html>`;
}

export async function fillInvoiceSeriesVoids() {
  const sql = getSql();
  const settings = await getBillingSettings();
  const year = new Date().getFullYear();
  const rows = await sql`
    SELECT invoice_no FROM invoices
    WHERE invoice_no LIKE ${`${settings.invoice_prefix}-${year}-%`}
  `;
  const issued = new Set(
    rows.map((r) => Number(String(r.invoice_no).split("-").pop()))
  );
  const max = Math.max(0, ...issued);
  const filled: string[] = [];
  for (let n = 1; n <= max; n += 1) {
    if (issued.has(n)) continue;
    const invoiceNo = `${settings.invoice_prefix}-${year}-${String(n).padStart(4, "0")}`;
    const html = `<!doctype html><html><body>
      <h1>${settings.legal_name}</h1>
      <h2>Tax Invoice ${invoiceNo} — CANCELLED</h2>
      <p>This number was reserved but never issued to a customer. It is cancelled to keep the GST invoice series consecutive. It is not a tax invoice for a supply.</p>
    </body></html>`;
    await sql`
      INSERT INTO invoices (
        payment_id, invoice_no, buyer_name, buyer_state, seller_gstin, line_description, html, voided, void_reason
      ) VALUES (
        ${null}, ${invoiceNo}, ${"VOID"}, ${settings.state_code}, ${settings.gstin},
        ${"Cancelled unused serial"}, ${html}, ${true},
        ${"Serial reserved by a failed capture; cancelled so the GST series has no gap."}
      )
      ON CONFLICT (invoice_no) DO NOTHING
    `;
    filled.push(invoiceNo);
  }
  return filled;
}

function invoiceHtml(input: {
  invoiceNo: string;
  settings: BillingSettings;
  buyerName: string;
  buyerState: string;
  description: string;
  gst: ReturnType<typeof gstBreakdown>;
  gateway: string;
  sandbox: boolean;
  issuedAt: string;
}) {
  const taxRows =
    input.gst.split === "igst"
      ? `<tr><td>IGST (${(input.gst.gstRateBps / 100).toFixed(2)}%)</td><td style="text-align:right">${rupees(input.gst.igstMinor)}</td></tr>`
      : `<tr><td>CGST (${(input.gst.gstRateBps / 200).toFixed(2)}%)</td><td style="text-align:right">${rupees(input.gst.cgstMinor)}</td></tr>
         <tr><td>SGST (${(input.gst.gstRateBps / 200).toFixed(2)}%)</td><td style="text-align:right">${rupees(input.gst.sgstMinor)}</td></tr>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${input.invoiceNo}</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px;color:#111} table{width:100%;border-collapse:collapse} td,th{padding:8px;border-bottom:1px solid #ddd}</style>
  </head><body>
  <h1>${input.settings.legal_name}</h1>
  <p>GSTIN: ${input.settings.gstin || "—"} · ${input.settings.address_line} ${input.settings.city} ${input.settings.state_name} ${input.settings.pincode}</p>
  <h2>Tax Invoice ${input.invoiceNo}</h2>
  <p>Date: ${input.issuedAt}${input.sandbox ? " · SANDBOX" : ""}</p>
  <p>Bill to: ${input.buyerName} · Place of supply: ${input.buyerState}</p>
  <table>
    <tr><th>Description</th><th style="text-align:right">Amount</th></tr>
    <tr><td>${input.description} (SAC ${input.settings.sac_code})</td><td style="text-align:right">${rupees(input.gst.taxableMinor)}</td></tr>
    ${taxRows}
    <tr><th>Total (incl. GST)</th><th style="text-align:right">${rupees(input.gst.amountMinor)}</th></tr>
  </table>
  <p>Collected via ${input.gateway}. Merchant of record: ${input.settings.legal_name}.</p>
  <p>This is a computer-generated invoice.</p>
  </body></html>`;
}

export async function createCheckout(input: {
  purpose: "consultation" | "subscription" | "product" | "wallet_topup";
  amountMinor: number;
  customer: { phone?: string; email?: string; displayName: string; stateCode?: string };
  astrologerId?: string;
  planId?: string;
  productId?: string;
  description: string;
}) {
  if (!Number.isFinite(input.amountMinor) || input.amountMinor < 1) {
    throw new Error("amountMinor must be a positive amount in paise");
  }
  const settings = await getBillingSettings();
  const gw = await resolvePaymentGateway();
  const customerId = await upsertCustomer(input.customer);
  const gst = gstBreakdown({
    amountMinorInclGst: input.amountMinor,
    gstRateBps: settings.gst_rate_bps,
    sellerStateCode: settings.state_code,
    buyerStateCode: input.customer.stateCode || "MH",
  });
  const receipt = `rcpt_${Date.now().toString(36)}`;
  const order = await gw.gateway.createOrder(
    {
      amountMinor: gst.amountMinor,
      currency: "INR",
      receipt,
      notes: { purpose: input.purpose },
    },
    gw.ctx
  );
  const sql = getSql();
  const rows = await sql`
    INSERT INTO payments (
      customer_id, astrologer_id, plan_id, product_id, purpose, gateway, transport, sandbox,
      currency, amount_minor, taxable_minor, gst_minor, cgst_minor, sgst_minor, igst_minor,
      gst_rate_bps, place_of_supply, gst_split, gateway_order_id, status, receipt, notes
    ) VALUES (
      ${customerId},
      ${input.astrologerId || null},
      ${input.planId || null},
      ${input.productId || null},
      ${input.purpose},
      ${gw.slotKey},
      ${gw.transport},
      ${gw.ctx.sandbox},
      ${"INR"},
      ${gst.amountMinor},
      ${gst.taxableMinor},
      ${gst.gstMinor},
      ${gst.cgstMinor},
      ${gst.sgstMinor},
      ${gst.igstMinor},
      ${gst.gstRateBps},
      ${gst.placeOfSupply},
      ${gst.split},
      ${order.orderId},
      ${"created"},
      ${receipt},
      ${JSON.stringify({ description: input.description })}
    )
    RETURNING id
  `;
  const paymentId = String(rows[0]!.id);
  if (input.purpose === "subscription" && input.planId) {
    const planRows = await sql`SELECT name, cycle, amount_minor FROM subscription_plans WHERE id = ${input.planId} LIMIT 1`;
    const plan = planRows[0];
    if (plan) {
      const sub = await gw.gateway.createSubscription(
        {
          planName: String(plan.name),
          amountMinor: Number(plan.amount_minor),
          currency: "INR",
          cycle: String(plan.cycle) === "annual" ? "annual" : "monthly",
        },
        gw.ctx
      );
      await sql`
        INSERT INTO subscriptions (customer_id, plan_id, payment_id, gateway, gateway_subscription_id, status, cycle)
        VALUES (${customerId}, ${input.planId}, ${paymentId}, ${gw.slotKey}, ${sub.subscriptionId}, ${"created"}, ${String(plan.cycle)})
      `;
      await sql`UPDATE payments SET gateway_subscription_id = ${sub.subscriptionId} WHERE id = ${paymentId}`;
    }
  }
  return {
    paymentId,
    orderId: order.orderId,
    gateway: gw.slotKey,
    transport: gw.transport,
    sandbox: gw.ctx.sandbox,
    gst,
    receipt,
  };
}

export async function capturePayment(
  paymentId: string,
  gatewayPaymentId?: string
) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM payments WHERE id = ${paymentId} LIMIT 1`;
  const pay = rows[0];
  if (!pay) throw new Error("Payment not found");
  const existingInv = await sql`
    SELECT invoice_no FROM invoices WHERE payment_id = ${paymentId} AND voided = ${false} LIMIT 1
  `;
  if (String(pay.status) === "captured" || existingInv[0]) {
    if (String(pay.status) !== "captured") {
      await sql`
        UPDATE payments
        SET status = ${"captured"},
            gateway_payment_id = ${gatewayPaymentId || String(pay.gateway_payment_id || "")},
            captured_at = COALESCE(captured_at, now())
        WHERE id = ${paymentId}
      `;
    }
    return {
      paymentId,
      invoiceNo: existingInv[0] ? String(existingInv[0].invoice_no) : undefined,
      alreadyCaptured: true,
    };
  }
  const settings = await getBillingSettings();
  const customerRows = await sql`SELECT * FROM billing_customers WHERE id = ${pay.customer_id} LIMIT 1`;
  const customer = customerRows[0];
  const notes = (() => {
    try {
      return JSON.parse(String(pay.notes || "{}")) as { description?: string };
    } catch {
      return {};
    }
  })();
  const gst = {
    amountMinor: Number(pay.amount_minor),
    taxableMinor: Number(pay.taxable_minor),
    gstMinor: Number(pay.gst_minor),
    cgstMinor: Number(pay.cgst_minor),
    sgstMinor: Number(pay.sgst_minor),
    igstMinor: Number(pay.igst_minor),
    gstRateBps: Number(pay.gst_rate_bps),
    split: String(pay.gst_split) as "cgst_sgst" | "igst",
    placeOfSupply: String(pay.place_of_supply),
  };
  const invoiceNo = await insertTaxInvoice({
    paymentId,
    buyerName: String(customer?.display_name || "Customer"),
    buyerState: String(pay.place_of_supply),
    description: notes.description || String(pay.purpose),
    gst,
    gateway: String(pay.gateway),
    sandbox: Boolean(pay.sandbox),
  });
  const gwPayId = gatewayPaymentId || `pay_sandbox_${Date.now()}`;
  await sql`
    UPDATE payments
    SET status = ${"captured"}, gateway_payment_id = ${gwPayId}, captured_at = now()
    WHERE id = ${paymentId}
  `;

  if (String(pay.purpose) === "wallet_topup" && pay.customer_id) {
    await creditWallet(String(pay.customer_id), Number(pay.amount_minor), paymentId, "topup");
  }
  if (String(pay.purpose) === "product" && pay.product_id) {
    await sql`
      INSERT INTO shop_orders (customer_id, payment_id, product_id, quantity, shipping_status)
      VALUES (${pay.customer_id}, ${paymentId}, ${pay.product_id}, ${1}, ${"paid"})
    `;
    await sql`
      UPDATE catalog_products
      SET inventory = CASE WHEN inventory IS NULL THEN NULL ELSE GREATEST(inventory - 1, 0) END
      WHERE id = ${pay.product_id}
    `;
  }
  if (String(pay.purpose) === "subscription") {
    await sql`UPDATE subscriptions SET status = ${"active"} WHERE payment_id = ${paymentId}`;
  }

  let commission = null;
  if (pay.astrologer_id && String(pay.purpose) === "consultation") {
    const astro = await sql`SELECT * FROM billing_astrologers WHERE id = ${pay.astrologer_id} LIMIT 1`;
    const bps =
      astro[0]?.commission_bps != null
        ? Number(astro[0].commission_bps)
        : settings.global_commission_bps;
    const split = commissionSplit(gst.taxableMinor, gst.gstMinor, bps);
    const cRows = await sql`
      INSERT INTO commission_ledger (
        payment_id, astrologer_id, gross_minor, taxable_minor, gst_minor,
        commission_bps, platform_minor, astrologer_minor, status
      ) VALUES (
        ${paymentId}, ${pay.astrologer_id}, ${gst.amountMinor}, ${gst.taxableMinor}, ${gst.gstMinor},
        ${split.commissionBps}, ${split.platformMinor}, ${split.astrologerMinor}, ${"pending"}
      )
      RETURNING id
    `;
    commission = {
      id: String(cRows[0]!.id),
      ...split,
      astrologerName: String(astro[0]?.display_name || ""),
    };
  }

  if (customer?.email || customer?.phone) {
    try {
      const { dispatchEvent } = await import("@/lib/comms/engine");
      const { rupees } = await import("@/lib/billing/gst");
      await dispatchEvent({
        eventKey: "payment_receipt",
        vars: {
          user_name: String(customer.display_name || "Customer"),
          invoice_no: invoiceNo,
          amount: rupees(gst.amountMinor),
        },
        to: {
          email: customer.email ? String(customer.email) : undefined,
          phone: customer.phone ? String(customer.phone) : undefined,
        },
      });
    } catch {
      /* comms must not roll back a captured payment */
    }
  }

  return {
    paymentId,
    invoiceNo,
    gatewayPaymentId: gwPayId,
    gst,
    commission,
    alreadyCaptured: false,
  };
}

async function creditWallet(
  customerId: string,
  amountMinor: number,
  paymentId: string | null,
  reason: string,
  actorEmail?: string
) {
  const sql = getSql();
  const w = await sql`
    INSERT INTO wallets (customer_id, balance_minor)
    VALUES (${customerId}, ${0})
    ON CONFLICT (customer_id) DO UPDATE SET updated_at = now()
    RETURNING id, balance_minor
  `;
  const walletId = String(w[0]!.id);
  const next = Number(w[0]!.balance_minor) + amountMinor;
  await sql`UPDATE wallets SET balance_minor = ${next}, updated_at = now() WHERE id = ${walletId}`;
  await sql`
    INSERT INTO wallet_ledger (wallet_id, payment_id, direction, amount_minor, reason, actor_email)
    VALUES (${walletId}, ${paymentId}, ${amountMinor >= 0 ? "credit" : "debit"}, ${Math.abs(amountMinor)}, ${reason}, ${actorEmail || null})
  `;
  return next;
}

export async function adjustWallet(
  customerId: string,
  amountMinor: number,
  reason: string,
  actor: AdminStaff
) {
  const next = await creditWallet(customerId, amountMinor, null, reason, actor.email);
  await writeAuditLog({
    actor,
    action: "wallet.adjust",
    entityType: "wallet",
    entityId: customerId,
    summary: `Wallet ${amountMinor >= 0 ? "credit" : "debit"} ${rupees(Math.abs(amountMinor))}`,
    metadata: { amountMinor, reason },
  });
  return next;
}

export async function spendWallet(customerId: string, amountMinor: number, reason: string) {
  const sql = getSql();
  const w = await sql`SELECT id, balance_minor FROM wallets WHERE customer_id = ${customerId} LIMIT 1`;
  if (!w[0] || Number(w[0].balance_minor) < amountMinor) {
    throw new Error("Insufficient wallet balance");
  }
  return creditWallet(customerId, -amountMinor, null, reason);
}

export async function requestRefund(paymentId: string, reason: string) {
  const sql = getSql();
  const pay = await sql`SELECT * FROM payments WHERE id = ${paymentId} LIMIT 1`;
  if (!pay[0] || String(pay[0].status) !== "captured") {
    throw new Error("Only captured payments can be refunded");
  }
  const rows = await sql`
    INSERT INTO refund_requests (payment_id, amount_minor, reason, status)
    VALUES (${paymentId}, ${Number(pay[0].amount_minor)}, ${reason}, ${"requested"})
    RETURNING id
  `;
  return String(rows[0]!.id);
}

export async function decideRefund(
  refundId: string,
  decision: "approved" | "rejected",
  actor: AdminStaff
) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM refund_requests WHERE id = ${refundId} LIMIT 1`;
  const req = rows[0];
  if (!req || String(req.status) !== "requested") {
    throw new Error("Refund is not awaiting decision");
  }
  if (decision === "rejected") {
    await sql`
      UPDATE refund_requests
      SET status = ${"rejected"}, decided_by = ${actor.email}, decided_at = now()
      WHERE id = ${refundId}
    `;
    await writeAuditLog({
      actor,
      action: "refund.rejected",
      entityType: "refund_request",
      entityId: refundId,
      summary: "Refund rejected",
    });
    return { status: "rejected" };
  }
  const pay = await sql`SELECT * FROM payments WHERE id = ${req.payment_id} LIMIT 1`;
  const gw = await resolvePaymentGateway();
  const result = await gw.gateway.refund(
    String(pay[0]?.gateway_payment_id || "pay_unknown"),
    Number(req.amount_minor),
    gw.ctx
  );
  await sql`
    UPDATE refund_requests
    SET status = ${"processed"}, gateway_refund_id = ${result.refundId},
        decided_by = ${actor.email}, decided_at = now()
    WHERE id = ${refundId}
  `;
  await sql`UPDATE payments SET status = ${"refunded"} WHERE id = ${req.payment_id}`;
  const invoice = await sql`
    SELECT invoice_no, buyer_name, buyer_state FROM invoices
    WHERE payment_id = ${req.payment_id} AND voided = ${false} LIMIT 1
  `;
  let creditNoteNo: string | null = null;
  if (invoice[0]) {
    creditNoteNo = await insertCreditNote({
      refundRequestId: refundId,
      paymentId: String(req.payment_id),
      originalInvoiceNo: String(invoice[0].invoice_no),
      buyerName: String(invoice[0].buyer_name),
      buyerState: String(invoice[0].buyer_state),
      gst: {
        amountMinor: Number(pay[0]?.amount_minor || 0),
        taxableMinor: Number(pay[0]?.taxable_minor || 0),
        gstMinor: Number(pay[0]?.gst_minor || 0),
        cgstMinor: Number(pay[0]?.cgst_minor || 0),
        sgstMinor: Number(pay[0]?.sgst_minor || 0),
        igstMinor: Number(pay[0]?.igst_minor || 0),
        gstRateBps: Number(pay[0]?.gst_rate_bps || 0),
        split: String(pay[0]?.gst_split || "igst") as "cgst_sgst" | "igst",
      },
    });
  }
  const clawback = pay[0]?.astrologer_id
    ? await reverseCommissionForPayment(String(req.payment_id))
    : null;
  await writeAuditLog({
    actor,
    action: "refund.processed",
    entityType: "refund_request",
    entityId: refundId,
    summary: `Refund processed via ${gw.slotKey} (${result.refundId})${creditNoteNo ? `; credit note ${creditNoteNo}` : ""}`,
    metadata: {
      gatewayRefundId: result.refundId,
      last4: result.refundId.slice(-4),
      creditNoteNo,
    },
  });
  return { status: "processed", gatewayRefundId: result.refundId, creditNoteNo, clawback };
}

async function reverseCommissionForPayment(paymentId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM commission_ledger
    WHERE payment_id = ${paymentId} AND entry_kind = ${"earning"}
  `;
  const result: { reversed: string[]; clawbacks: string[] } = { reversed: [], clawbacks: [] };
  for (const row of rows) {
    const status = String(row.status);
    if (status === "pending" || status === "scheduled") {
      await sql`UPDATE commission_ledger SET status = ${"reversed"} WHERE id = ${row.id}`;
      result.reversed.push(String(row.id));
      continue;
    }
    if (status === "paid") {
      const existing = await sql`
        SELECT id FROM commission_ledger
        WHERE related_ledger_id = ${row.id} AND entry_kind = ${"clawback"}
        LIMIT 1
      `;
      if (existing[0]) {
        result.clawbacks.push(String(existing[0].id));
        continue;
      }
      const inserted = await sql`
        INSERT INTO commission_ledger (
          payment_id, astrologer_id, gross_minor, taxable_minor, gst_minor,
          commission_bps, platform_minor, astrologer_minor, status, entry_kind, related_ledger_id
        ) VALUES (
          ${paymentId},
          ${row.astrologer_id},
          ${-Number(row.gross_minor)},
          ${-Number(row.taxable_minor)},
          ${-Number(row.gst_minor)},
          ${Number(row.commission_bps)},
          ${-Number(row.platform_minor)},
          ${-Number(row.astrologer_minor)},
          ${"outstanding"},
          ${"clawback"},
          ${row.id}
        )
        RETURNING id
      `;
      result.clawbacks.push(String(inserted[0]!.id));
    }
  }
  return result;
}

export async function schedulePayout(astrologerId: string | null, actor: AdminStaff) {
  const sql = getSql();
  const pending = astrologerId
    ? await sql`
        SELECT * FROM commission_ledger
        WHERE astrologer_id = ${astrologerId}
          AND (
            (entry_kind = ${"earning"} AND status = ${"pending"})
            OR (entry_kind = ${"clawback"} AND status = ${"outstanding"})
          )
      `
    : await sql`
        SELECT * FROM commission_ledger
        WHERE (entry_kind = ${"earning"} AND status = ${"pending"})
           OR (entry_kind = ${"clawback"} AND status = ${"outstanding"})
      `;
  if (!pending.length) throw new Error("No pending commission to pay out");
  const batchRows = await sql`
    INSERT INTO payout_batches (scheduled_for, status, method, notes)
    VALUES (${new Date().toISOString().slice(0, 10)}, ${"scheduled"}, ${"upi_bank"}, ${"Internal UPI/bank payout — not Razorpay Route"})
    RETURNING id
  `;
  const batchId = String(batchRows[0]!.id);
  for (const row of pending) {
    await sql`
      INSERT INTO payout_items (batch_id, commission_id, astrologer_id, amount_minor)
      VALUES (${batchId}, ${row.id}, ${row.astrologer_id}, ${row.astrologer_minor})
    `;
    await sql`UPDATE commission_ledger SET status = ${"scheduled"} WHERE id = ${row.id} AND entry_kind = ${"earning"}`;
    await sql`UPDATE commission_ledger SET status = ${"scheduled"} WHERE id = ${row.id} AND entry_kind = ${"clawback"}`;
  }
  await writeAuditLog({
    actor,
    action: "payout.scheduled",
    entityType: "payout_batch",
    entityId: batchId,
    summary: `Scheduled UPI/bank payout for ${pending.length} commission rows`,
  });
  return { batchId, count: pending.length };
}

export async function markPayoutPaid(batchId: string, upiRef: string, actor: AdminStaff) {
  const sql = getSql();
  await sql`
    UPDATE payout_batches SET status = ${"paid"}, paid_at = now(), notes = ${upiRef}
    WHERE id = ${batchId}
  `;
  await sql`UPDATE payout_items SET upi_ref = ${upiRef} WHERE batch_id = ${batchId}`;
  await sql`
    UPDATE commission_ledger
    SET status = CASE
      WHEN entry_kind = ${"clawback"} THEN ${"recovered"}
      ELSE ${"paid"}
    END
    WHERE id IN (SELECT commission_id FROM payout_items WHERE batch_id = ${batchId})
  `;
  await writeAuditLog({
    actor,
    action: "payout.paid",
    entityType: "payout_batch",
    entityId: batchId,
    summary: "Marked payout paid via UPI/bank",
    metadata: { upiRefLast4: upiRef.slice(-4) },
  });
}

export { rupees };
