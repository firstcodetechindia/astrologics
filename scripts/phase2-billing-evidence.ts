/**
 * Phase 2 evidence: GST math, Razorpay-primary checkout (mock sandbox transport),
 * invoice + commission, wallet, commerce, refunds, internal UPI/bank payout.
 *
 * Usage: npm run test:billing
 *
 * Mock transport is expected until real rzp_test_ keys are pasted in the vault.
 * The same adapter then hits Razorpay's sandbox API.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { gstBreakdown, commissionSplit, rupees } from "../src/lib/billing/gst.ts";
import { preferredPaymentSlot } from "../src/lib/platform/integrations/adapters/payment.ts";

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

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`ASSERT: ${msg}`);
}

const AMOUNT = 49900; // ₹499.00 incl. GST
const GST_BPS = 1800;
const COMM_BPS = 2000;
const ASTRO_PHONE = "9876500001";

function gstMathChecks() {
  const igst = gstBreakdown({
    amountMinorInclGst: AMOUNT,
    gstRateBps: GST_BPS,
    sellerStateCode: "MH",
    buyerStateCode: "KA",
  });
  assert(igst.split === "igst", "KA vs MH seller must be IGST");
  assert(igst.taxableMinor === 42288, `taxable expected 42288 got ${igst.taxableMinor}`);
  assert(igst.gstMinor === 7612, `gst expected 7612 got ${igst.gstMinor}`);
  assert(igst.igstMinor === 7612 && igst.cgstMinor === 0 && igst.sgstMinor === 0, "IGST split");
  const intra = gstBreakdown({
    amountMinorInclGst: AMOUNT,
    gstRateBps: GST_BPS,
    sellerStateCode: "MH",
    buyerStateCode: "MH",
  });
  assert(intra.split === "cgst_sgst", "same state must be CGST+SGST");
  assert(intra.cgstMinor + intra.sgstMinor === intra.gstMinor, "CGST+SGST equals GST");
  const split = commissionSplit(igst.taxableMinor, igst.gstMinor, COMM_BPS);
  assert(split.platformMinor === 8458, `platform expected 8458 got ${split.platformMinor}`);
  assert(split.astrologerMinor === 33830, `astrologer expected 33830 got ${split.astrologerMinor}`);
  assert(preferredPaymentSlot(["stripe", "razorpay"]) === "razorpay", "Razorpay is primary");
  assert(preferredPaymentSlot(["stripe"]) === "stripe", "Stripe is fallback");
  return { igst, intra, split };
}

async function main() {
  loadEnvLocal();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";

  const outDir = path.join(process.cwd(), "scripts/fixtures/phase2-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const math = gstMathChecks();

  const migrate = spawnSync("npx", ["tsx", "scripts/db-migrate-platform.ts"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
  if (migrate.status !== 0) process.exit(migrate.status ?? 1);

  const { seedSandboxSecrets } = await import(
    "../src/lib/platform/integrations/seed-sandbox.ts"
  );
  const { getSql } = await import("../src/lib/db.ts");
  const {
    createCheckout,
    capturePayment,
    requestRefund,
    decideRefund,
    schedulePayout,
    markPayoutPaid,
    getBillingSettings,
    updateBillingSettings,
    spendWallet,
  } = await import("../src/lib/billing/engine.ts");
  const { resolvePaymentGateway } = await import(
    "../src/lib/billing/resolve-gateway.ts"
  );
  const { getPaymentGateway } = await import(
    "../src/lib/platform/integrations/adapters/payment.ts"
  );

  await seedSandboxSecrets();
  const sql = getSql();

  const staffRows = await sql`
    SELECT id, email, display_name, role, must_change_password FROM admin_staff LIMIT 1
  `;
  const actor = staffRows[0]
    ? {
        id: String(staffRows[0].id),
        email: String(staffRows[0].email),
        display_name: String(staffRows[0].display_name),
        role: String(staffRows[0].role),
        must_change_password: Boolean(staffRows[0].must_change_password),
      }
    : null;

  if (actor) {
    await updateBillingSettings(
      {
        legal_name: "CosmicGyan Technologies",
        gstin: "27AABCU9603R1ZX",
        pan: "AABCU9603R",
        address_line: "Phase 2 evidence address",
        city: "Mumbai",
        state_code: "MH",
        state_name: "Maharashtra",
        pincode: "400001",
        gst_rate_bps: GST_BPS,
        sac_code: "998399",
        global_commission_bps: COMM_BPS,
      },
      actor
    );
  } else {
    await sql`
      UPDATE billing_settings SET
        legal_name = ${"CosmicGyan Technologies"},
        gstin = ${"27AABCU9603R1ZX"},
        pan = ${"AABCU9603R"},
        address_line = ${"Phase 2 evidence address"},
        city = ${"Mumbai"},
        state_code = ${"MH"},
        state_name = ${"Maharashtra"},
        pincode = ${"400001"},
        gst_rate_bps = ${GST_BPS},
        sac_code = ${"998399"},
        global_commission_bps = ${COMM_BPS},
        updated_at = now()
      WHERE id = ${"default"}
    `;
  }

  const existingAstro = await sql`
    SELECT id FROM billing_astrologers WHERE phone = ${ASTRO_PHONE} LIMIT 1
  `;
  let astrologerId: string;
  if (existingAstro[0]) {
    astrologerId = String(existingAstro[0].id);
    await sql`
      UPDATE billing_astrologers
      SET display_name = ${"Pandit Sharma"},
          commission_bps = ${COMM_BPS},
          payout_upi = ${"pandit@upi"},
          active = ${true}
      WHERE id = ${astrologerId}
    `;
  } else {
    const inserted = await sql`
      INSERT INTO billing_astrologers (display_name, phone, kind, commission_bps, payout_upi)
      VALUES (${"Pandit Sharma"}, ${ASTRO_PHONE}, ${"REAL_HUMAN"}, ${COMM_BPS}, ${"pandit@upi"})
      RETURNING id
    `;
    astrologerId = String(inserted[0]!.id);
  }

  const planRows = await sql`
    INSERT INTO subscription_plans (name, description, amount_minor, cycle, features_json, active)
    VALUES (
      ${"Monthly Insight"},
      ${"Sandbox monthly plan"},
      ${49900},
      ${"monthly"},
      ${JSON.stringify(["Daily horoscope", "Priority chat"])},
      ${true}
    )
    RETURNING id
  `;
  const planId = String(planRows[0]!.id);

  const productRows = await sql`
    INSERT INTO catalog_products (name, slug, kind, description, amount_minor, inventory, active)
    VALUES (
      ${"Rudraksha kit"},
      ${"rudraksha-kit-" + Date.now().toString(36)},
      ${"physical"},
      ${"Sandbox physical SKU"},
      ${149900},
      ${10},
      ${true}
    )
    RETURNING id
  `;
  const productId = String(productRows[0]!.id);

  const gw = await resolvePaymentGateway();
  assert(gw.slotKey === "razorpay", `primary gateway must be razorpay, got ${gw.slotKey}`);
  assert(gw.transport === "mock", `sandbox vault keys should use mock transport, got ${gw.transport}`);

  const stripeGw = getPaymentGateway("stripe");
  const stripeOrder = await stripeGw.createOrder(
    { amountMinor: 10000, currency: "INR", receipt: "stripe_secondary" },
    {
      secrets: { secret_key: "sandbox_stripe_sk_TEST" },
      config: {},
      sandbox: true,
    }
  );
  assert(stripeOrder.gateway === "stripe", "Stripe adapter stays in the abstraction");
  assert(stripeOrder.orderId.startsWith("pi_sandbox_"), "Stripe mock checkout");

  const checkout = await createCheckout({
    purpose: "consultation",
    amountMinor: AMOUNT,
    customer: {
      displayName: "Asha Sharma",
      phone: "9876543210",
      stateCode: "KA",
    },
    astrologerId,
    description: "Mock consultation (30 min)",
  });
  assert(checkout.gateway === "razorpay", "consultation checkout uses Razorpay");
  assert(checkout.gst.split === "igst", "KA buyer vs MH seller → IGST");
  assert(checkout.gst.taxableMinor === 42288, "checkout taxable");
  assert(checkout.orderId.startsWith("order_sandbox_"), "Razorpay mock Orders API");

  const captured = await capturePayment(checkout.paymentId);
  assert(captured.invoiceNo, "invoice number assigned");
  assert(captured.commission, "commission ledger row created");
  assert(captured.commission!.platformMinor === 8458, "20% of taxable");
  assert(captured.commission!.astrologerMinor === 33830, "astrologer share");

  const invoiceRows = await sql`
    SELECT html, invoice_no, seller_gstin FROM invoices WHERE invoice_no = ${captured.invoiceNo} LIMIT 1
  `;
  const invoiceHtml = String(invoiceRows[0]?.html || "");
  assert(invoiceHtml.includes("27AABCU9603R1ZX"), "invoice includes GSTIN");
  assert(invoiceHtml.includes("IGST"), "invoice shows IGST");
  assert(invoiceHtml.includes("Tax Invoice"), "GST tax invoice heading");
  assert(invoiceHtml.includes(rupees(42288)), "taxable line");
  fs.writeFileSync(path.join(outDir, "invoice.html"), invoiceHtml);

  const earnings = await sql`
    SELECT l.*, i.invoice_no
    FROM commission_ledger l
    JOIN invoices i ON i.payment_id = l.payment_id
    WHERE l.astrologer_id = ${astrologerId}
    ORDER BY l.created_at DESC
  `;
  assert(earnings.length >= 1, "astrologer earnings has at least one row");
  assert(String(earnings[0]!.invoice_no) === captured.invoiceNo, "earnings linked to invoice");

  const intraCheckout = await createCheckout({
    purpose: "consultation",
    amountMinor: AMOUNT,
    customer: {
      displayName: "Rohan Mehta",
      phone: "9876543211",
      stateCode: "MH",
    },
    astrologerId,
    description: "Same-state consultation",
  });
  assert(intraCheckout.gst.split === "cgst_sgst", "MH buyer → CGST+SGST");
  const intraCap = await capturePayment(intraCheckout.paymentId);
  const intraHtml = String(
    (
      await sql`SELECT html FROM invoices WHERE invoice_no = ${intraCap.invoiceNo} LIMIT 1`
    )[0]?.html || ""
  );
  assert(intraHtml.includes("CGST") && intraHtml.includes("SGST"), "intra-state invoice");

  const subCheckout = await createCheckout({
    purpose: "subscription",
    amountMinor: 49900,
    customer: { displayName: "Asha Sharma", phone: "9876543210", stateCode: "KA" },
    planId,
    description: "Monthly Insight",
  });
  const subCap = await capturePayment(subCheckout.paymentId);
  const subRows = await sql`
    SELECT status, gateway_subscription_id FROM subscriptions WHERE payment_id = ${subCheckout.paymentId} LIMIT 1
  `;
  assert(String(subRows[0]?.status) === "active", "subscription activated");
  assert(
    String(subRows[0]?.gateway_subscription_id || "").startsWith("sub_sandbox_"),
    "Razorpay Subscriptions API mock"
  );

  const walletCheckout = await createCheckout({
    purpose: "wallet_topup",
    amountMinor: 100000,
    customer: { displayName: "Asha Sharma", phone: "9876543210", stateCode: "KA" },
    description: "Wallet top-up",
  });
  await capturePayment(walletCheckout.paymentId);
  const wallet = await sql`
    SELECT w.balance_minor, c.phone
    FROM wallets w
    JOIN billing_customers c ON c.id = w.customer_id
    WHERE c.phone = ${"9876543210"}
    LIMIT 1
  `;
  assert(Number(wallet[0]?.balance_minor) >= 100000, "wallet credited");
  const customerId = String(
    (await sql`SELECT id FROM billing_customers WHERE phone = ${"9876543210"} LIMIT 1`)[0]!.id
  );
  await spendWallet(customerId, 2500, "sandbox_spend");

  const productCheckout = await createCheckout({
    purpose: "product",
    amountMinor: 149900,
    customer: { displayName: "Asha Sharma", phone: "9876543210", stateCode: "KA" },
    productId,
    description: "Rudraksha kit",
  });
  await capturePayment(productCheckout.paymentId);
  const order = await sql`
    SELECT shipping_status FROM shop_orders WHERE product_id = ${productId} LIMIT 1
  `;
  assert(String(order[0]?.shipping_status) === "paid", "shop order created");
  await sql`UPDATE shop_orders SET shipping_status = ${"shipped"} WHERE product_id = ${productId}`;

  const refundId = await requestRefund(intraCap.paymentId, "sandbox user request");
  let decided: { status: string; gatewayRefundId?: string } = { status: "skipped_no_admin" };
  if (actor) {
    decided = await decideRefund(refundId, "approved", actor);
    assert(decided.status === "processed", "gateway refund processed");
    assert(String(decided.gatewayRefundId || "").startsWith("rfnd_sandbox_"), "Razorpay refund mock");
  }

  let payout: { batchId: string; count: number } | null = null;
  let reportPayout: Record<string, unknown> | null = null;
  if (actor) {
    payout = await schedulePayout(astrologerId, actor);
    assert(payout.count >= 1, "pending commission scheduled");
    await markPayoutPaid(payout.batchId, "UPI/COSMICGYAN/PHASE2", actor);
    const batch = await sql`SELECT method, status, notes FROM payout_batches WHERE id = ${payout.batchId} LIMIT 1`;
    assert(String(batch[0]?.method) === "upi_bank", "payout is UPI/bank not Razorpay Route");
    assert(String(batch[0]?.status) === "paid", "payout marked paid");
    reportPayout = {
      batchId: payout.batchId,
      method: batch[0]?.method,
      status: batch[0]?.status,
      notes: batch[0]?.notes,
    };
  }

  const settings = await getBillingSettings();
  const report = {
    ok: true,
    phase: 2,
    gateway: {
      primary: gw.slotKey,
      transport: gw.transport,
      sandbox: gw.ctx.sandbox,
      stripeSecondaryMockOrder: stripeOrder.orderId,
    },
    gstMath: {
      amountIncl: rupees(AMOUNT),
      igst: math.igst,
      intra: math.intra,
      commission: math.split,
    },
    consultation: {
      paymentId: checkout.paymentId,
      orderId: checkout.orderId,
      invoiceNo: captured.invoiceNo,
      gst: captured.gst,
      commission: captured.commission,
    },
    subscription: {
      paymentId: subCheckout.paymentId,
      invoiceNo: subCap.invoiceNo,
      gatewaySubscriptionId: subRows[0]?.gateway_subscription_id,
    },
    refund: decided,
    payout: reportPayout,
    settings: {
      gstin: settings.gstin,
      sac: settings.sac_code,
      commissionBps: settings.global_commission_bps,
    },
    earningsPreview: earnings.slice(0, 5).map((row) => ({
      invoice: row.invoice_no,
      astrologerShare: rupees(Number(row.astrologer_minor)),
      status: row.status,
    })),
  };

  const reportPath = path.join(outDir, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  const earningsHtml = `<!doctype html><html><head><meta charset="utf-8"><title>Astrologer earnings</title>
  <style>body{font-family:system-ui;padding:24px} td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}</style></head>
  <body><h1>Pandit Sharma — earnings</h1>
  <p>Phone ${ASTRO_PHONE}. Commission ${COMM_BPS / 100}% of taxable. GST retained by merchant of record.</p>
  <table><tr><th>Invoice</th><th>Share</th><th>Status</th></tr>
  ${(
    await sql`
      SELECT l.*, i.invoice_no FROM commission_ledger l
      LEFT JOIN invoices i ON i.payment_id = l.payment_id
      WHERE l.astrologer_id = ${astrologerId}
      ORDER BY l.created_at DESC
    `
  )
    .map(
      (row) =>
        `<tr><td>${row.invoice_no || "—"}</td><td>${rupees(Number(row.astrologer_minor))}</td><td>${row.status}</td></tr>`
    )
    .join("")}
  </table></body></html>`;
  fs.writeFileSync(path.join(outDir, "earnings.html"), earningsHtml);

  console.log(JSON.stringify({ ok: true, reportPath, invoice: captured.invoiceNo }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
