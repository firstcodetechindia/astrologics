/**
 * Phase 2 compliance evidence: invoice uniqueness, GST credit notes,
 * Razorpay webhook HMAC reject, commission clawback on refund of paid earnings.
 *
 * Usage: npx tsx scripts/phase2-compliance-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  razorpayWebhookSignature,
  verifyRazorpayWebhookSignature,
  mockPaymentCapturedPayload,
} from "../src/lib/billing/razorpay-webhook.ts";

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

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`ASSERT: ${msg}`);
}

async function main() {
  loadEnvLocal();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
  const outDir = path.join(process.cwd(), "scripts/fixtures/phase2-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const migrate = spawnSync("npx", ["tsx", "scripts/db-migrate-platform.ts"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
  if (migrate.status !== 0) process.exit(migrate.status ?? 1);

  const { seedSandboxSecrets } = await import("../src/lib/platform/integrations/seed-sandbox.ts");
  const { getSql } = await import("../src/lib/db.ts");
  const {
    createCheckout,
    requestRefund,
    decideRefund,
    fillInvoiceSeriesVoids,
  } = await import("../src/lib/billing/engine.ts");
  const { handleRazorpayWebhook, captureMockViaSignedWebhook, webhookSecretFromGateway } =
    await import("../src/lib/billing/razorpay-webhook-handler.ts");
  const { resolvePaymentGateway } = await import("../src/lib/billing/resolve-gateway.ts");

  await seedSandboxSecrets();
  const sql = getSql();
  const voidsFilled = await fillInvoiceSeriesVoids();

  const invoices = await sql`
    SELECT invoice_no, payment_id, voided, issued_at
    FROM invoices
    WHERE invoice_no LIKE ${"CG-INV-2026-%"}
    ORDER BY invoice_no
  `;
  const nos = invoices.map((r) => String(r.invoice_no));
  assert(new Set(nos).size === nos.length, "duplicate invoice numbers in DB");
  const seqs = nos.map((n) => Number(n.split("-").pop()));
  for (let i = 1; i < seqs.length; i += 1) {
    assert(seqs[i] === seqs[i - 1]! + 1, `gap after ${nos[i - 1]} before ${nos[i]}`);
  }
  const row0002 = invoices.find((r) => r.invoice_no === "CG-INV-2026-0002");
  const row0008 = invoices.find((r) => r.invoice_no === "CG-INV-2026-0008");
  assert(row0002 && row0008, "0002 and 0008 both exist");
  assert(
    String(row0002.payment_id) !== String(row0008.payment_id),
    "0002 and 0008 must be different payments"
  );
  const pay0002 = await sql`SELECT status, purpose FROM payments WHERE id = ${row0002.payment_id}`;
  const pay0008 = await sql`SELECT status, purpose FROM payments WHERE id = ${row0008.payment_id}`;
  assert(String(pay0002[0]?.status) === "captured", "0002 original payment still captured (not reused)");
  assert(String(pay0008[0]?.status) === "captured", "0008 is a later distinct capture");

  const secret = "sandbox_rzp_webhook_secret_TEST";
  const sample = JSON.stringify(
    mockPaymentCapturedPayload({ orderId: "order_x", paymentId: "pay_x", amountMinor: 100 })
  );
  const goodSig = razorpayWebhookSignature(sample, secret);
  assert(verifyRazorpayWebhookSignature(sample, goodSig, secret), "valid HMAC accepted");
  assert(
    !verifyRazorpayWebhookSignature(sample, "deadbeef".repeat(8), secret),
    "tampered HMAC rejected"
  );
  assert(!verifyRazorpayWebhookSignature(sample, "", secret), "empty signature rejected");
  const tamperedBody = sample.replace("pay_x", "pay_FORGED");
  assert(
    !verifyRazorpayWebhookSignature(tamperedBody, goodSig, secret),
    "body tamper invalidates signature"
  );

  const gw = await resolvePaymentGateway();
  const vaultSecret = webhookSecretFromGateway(gw);
  assert(vaultSecret === secret, "vault webhook secret seeded");

  const astro = await sql`SELECT id FROM billing_astrologers WHERE phone = ${"9876500001"} LIMIT 1`;
  assert(astro[0], "billing astrologer exists");

  const checkout = await createCheckout({
    purpose: "consultation",
    amountMinor: 49900,
    customer: { displayName: "Webhook User", phone: "9876543299", stateCode: "KA" },
    astrologerId: String(astro[0].id),
    description: "Webhook-signed capture",
  });
  const forged = await handleRazorpayWebhook(
    JSON.stringify(
      mockPaymentCapturedPayload({
        orderId: checkout.orderId,
        paymentId: "pay_forged",
        amountMinor: 49900,
      })
    ),
    "0".repeat(64)
  );
  assert(forged.ok === false && forged.status === 400, "handler rejects invalid signature");
  assert(
    String(forged.error).includes("invalid webhook signature"),
    `unexpected reject reason: ${forged.error}`
  );
  const stillOpen = await sql`SELECT status FROM payments WHERE id = ${checkout.paymentId}`;
  assert(String(stillOpen[0]?.status) === "created", "forged webhook must not capture");

  const captured = await captureMockViaSignedWebhook(checkout.paymentId);
  assert(captured.ok, "signed mock webhook captures");
  assert(captured.invoiceNo, "invoice issued from webhook capture");

  const seqBefore = Number(
    (await sql`SELECT next_invoice_seq FROM billing_settings WHERE id = ${"default"}`)[0]
      ?.next_invoice_seq
  );
  const again = await captureMockViaSignedWebhook(checkout.paymentId);
  assert(again.ok && again.alreadyCaptured, "second webhook is idempotent");
  const seqAfter = Number(
    (await sql`SELECT next_invoice_seq FROM billing_settings WHERE id = ${"default"}`)[0]
      ?.next_invoice_seq
  );
  assert(seqAfter === seqBefore, "idempotent capture must not consume an invoice number");

  const staffRows = await sql`
    SELECT id, email, display_name, role, must_change_password FROM admin_staff LIMIT 1
  `;
  assert(staffRows[0], "admin staff required to approve refund");
  const actor = {
    id: String(staffRows[0].id),
    email: String(staffRows[0].email),
    display_name: String(staffRows[0].display_name),
    role: String(staffRows[0].role),
    must_change_password: Boolean(staffRows[0].must_change_password),
  };

  const pendingRefundId = await requestRefund(checkout.paymentId, "pending-earning refund");
  const pendingDecision = await decideRefund(pendingRefundId, "approved", actor);
  assert(pendingDecision.creditNoteNo, "credit note issued for pending-earning refund");
  assert(pendingDecision.creditNoteNo.startsWith("CG-CN-"), "credit note has own series");
  const cnPending = await sql`
    SELECT original_invoice_no, credit_note_no, html FROM credit_notes
    WHERE credit_note_no = ${pendingDecision.creditNoteNo} LIMIT 1
  `;
  assert(
    String(cnPending[0]?.original_invoice_no) === String(captured.invoiceNo),
    "credit note references the original tax invoice, not a reused invoice number"
  );
  assert(String(cnPending[0]?.html).includes("Credit Note"), "credit note HTML document exists");
  assert(
    String(cnPending[0]?.html).includes(String(captured.invoiceNo)),
    "credit note HTML cites original invoice"
  );
  fs.writeFileSync(path.join(outDir, "credit-note.html"), String(cnPending[0]?.html || ""));

  const paidInvoice = "CG-INV-2026-0002";
  const paidPay = await sql`
    SELECT p.id, p.status, l.status AS comm_status, l.astrologer_minor
    FROM invoices i
    JOIN payments p ON p.id = i.payment_id
    JOIN commission_ledger l ON l.payment_id = p.id AND l.entry_kind = ${"earning"}
    WHERE i.invoice_no = ${paidInvoice}
    LIMIT 1
  `;
  assert(String(paidPay[0]?.comm_status) === "paid", "0002 commission was already paid out");
  assert(String(paidPay[0]?.status) === "captured", "0002 payment still captured before this refund");
  const paidRefundId = await requestRefund(String(paidPay[0]!.id), "clawback of paid earnings");
  const paidDecision = await decideRefund(paidRefundId, "approved", actor);
  assert(paidDecision.creditNoteNo, "credit note for paid-earning refund");
  assert(
    paidDecision.clawback && paidDecision.clawback.clawbacks.length >= 1,
    "clawback ledger row created because commission was already paid"
  );
  const cnPaid = await sql`
    SELECT original_invoice_no, credit_note_no, html FROM credit_notes
    WHERE credit_note_no = ${paidDecision.creditNoteNo} LIMIT 1
  `;
  assert(String(cnPaid[0]?.original_invoice_no) === paidInvoice, "paid refund CN references 0002");
  fs.writeFileSync(path.join(outDir, "credit-note-0002.html"), String(cnPaid[0]?.html || ""));

  const ledger = await sql`
    SELECT l.entry_kind, l.status, l.astrologer_minor, i.invoice_no, cn.credit_note_no
    FROM commission_ledger l
    JOIN payments p ON p.id = l.payment_id
    LEFT JOIN invoices i ON i.payment_id = p.id AND i.voided = false
    LEFT JOIN credit_notes cn ON cn.payment_id = p.id
    JOIN billing_astrologers a ON a.id = l.astrologer_id
    WHERE a.phone = ${"9876500001"}
    ORDER BY l.created_at
  `;
  const paidEarning = ledger.find(
    (r) => r.invoice_no === paidInvoice && r.entry_kind === "earning"
  );
  const clawback = ledger.find(
    (r) => r.invoice_no === paidInvoice && r.entry_kind === "clawback"
  );
  assert(paidEarning && String(paidEarning.status) === "paid", "original 0002 earning row stays paid");
  assert(clawback && Number(clawback.astrologer_minor) === -33830, "clawback is -₹338.30");
  assert(String(clawback.status) === "outstanding", "clawback outstanding until recovered on next payout");
  assert(String(clawback.credit_note_no) === paidDecision.creditNoteNo, "clawback tied to credit note");

  const net0002 = Number(paidEarning.astrologer_minor) + Number(clawback.astrologer_minor);
  assert(net0002 === 0, "net earnings for refunded 0002 are zero after clawback");

  const row0003 = ledger.find((r) => r.invoice_no === "CG-INV-2026-0003" && r.entry_kind === "earning");
  assert(row0003 && String(row0003.status) === "reversed", "0003 was reversed while still pending (never paid out)");

  const report = {
    ok: true,
    invoiceIntegrity: {
      unique: true,
      consecutiveAfterVoidFill: nos,
      voidsFilled,
      original0002PaymentId: row0002.payment_id,
      recapture0008PaymentId: row0008.payment_id,
      samePayment: false,
      logic:
        "Atomic CTE: UPDATE next_invoice_seq + INSERT invoices in one statement. UNIQUE(invoice_no) and UNIQUE(payment_id). Failed insert rolls back the increment so numbers are never reused and no longer skipped. Client recapture of a new checkout issues a new number (0008), it does not reuse 0002.",
    },
    refundCreditNotes: {
      pendingEarning: {
        originalInvoice: captured.invoiceNo,
        creditNoteNo: pendingDecision.creditNoteNo,
        referencesOriginal: true,
      },
      paidEarning: {
        originalInvoice: paidInvoice,
        creditNoteNo: paidDecision.creditNoteNo,
        referencesOriginal: true,
      },
    },
    webhook: {
      validHmacAccepted: true,
      tamperedSignatureRejected: true,
      tamperedBodyRejected: true,
      forgedEventDidNotCapture: true,
      signedMockCaptured: true,
      idempotentReplayDoesNotAllocateInvoice: true,
    },
    commission: {
      invoice0002: {
        earningStatus: "paid",
        earningMinor: 33830,
        clawbackStatus: "outstanding",
        clawbackMinor: -33830,
        netMinor: 0,
        creditNote: paidDecision.creditNoteNo,
      },
      invoice0003: {
        earningStatus: "reversed",
        note: "0003 was a different payment (same-state). Refunded while commission was still pending, so it was reversed before payout — no clawback row needed.",
      },
    },
    openItem: {
      realRazorpaySandboxApi:
        "Still mock transport (rzp_test_sandbox_* vault seeds). A genuine rzp_test_ key + webhook secret against api.razorpay.com is required before production go-live. Does not block Phase 3 start.",
    },
  };
  fs.writeFileSync(path.join(outDir, "compliance-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: true, reportPath: path.join(outDir, "compliance-report.json") }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
