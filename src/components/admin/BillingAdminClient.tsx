"use client";

import { useCallback, useEffect, useState } from "react";
import { rupees } from "@/lib/billing/gst";

type Tab = "settings" | "plans" | "payments" | "wallets" | "commerce" | "refunds" | "payouts";

const TITLES: Record<Tab, { kicker: string; title: string; blurb: string }> = {
  payments: {
    kicker: "Money",
    title: "Transactions",
    blurb: "Captured payments, receipts, and GST invoice numbers.",
  },
  plans: {
    kicker: "Money",
    title: "Billing & plans",
    blurb: "Subscription plans and catalog products. Razorpay is primary.",
  },
  settings: {
    kicker: "Money",
    title: "GST invoices",
    blurb: "Legal entity, GSTIN, SAC, and invoice series used on tax invoices.",
  },
  commerce: {
    kicker: "Money",
    title: "Commerce",
    blurb: "Physical/digital catalog and shop orders.",
  },
  wallets: {
    kicker: "Money",
    title: "Wallets",
    blurb: "Customer wallet balances and ledger adjustments.",
  },
  refunds: {
    kicker: "Money",
    title: "Refunds / credit notes",
    blurb: "Approve or reject refunds. Credit notes issue on captured refunds.",
  },
  payouts: {
    kicker: "Money",
    title: "Commission & payouts",
    blurb: "Internal ledger paid out by UPI/bank — not Razorpay Route.",
  },
};

export function BillingAdminClient({ section }: { section?: Tab }) {
  const focused = Boolean(section);
  const [tab, setTab] = useState<Tab>(section || "payments");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (section) setTab(section);
  }, [section]);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/billing", { cache: "no-store" });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error || "Failed to load billing");
      return;
    }
    setData(json);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const meta = TITLES[tab];
  const tabs: { id: Tab; label: string }[] = [
    { id: "payments", label: "Payments" },
    { id: "plans", label: "Plans" },
    { id: "settings", label: "GST settings" },
    { id: "commerce", label: "Commerce" },
    { id: "wallets", label: "Wallets" },
    { id: "refunds", label: "Refunds" },
    { id: "payouts", label: "Payouts" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
          {meta.kicker}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">{meta.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{meta.blurb}</p>
      </header>
      {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
      {focused ? null : (
      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`min-h-11 rounded-full px-3 text-sm ${
              tab === t.id ? "bg-white/15 text-white" : "bg-white/5 text-ink-muted"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      )}
      {tab === "settings" && data ? <SettingsPane data={data} onSaved={() => void load()} /> : null}
      {tab === "plans" && data ? <PlansPane data={data} onSaved={() => void load()} /> : null}
      {tab === "payments" && data ? <PaymentsPane data={data} /> : null}
      {tab === "commerce" || (focused && section === "plans") ? <CommercePane /> : null}
      {tab === "wallets" ? <WalletsPane /> : null}
      {tab === "refunds" ? <RefundsPane /> : null}
      {tab === "payouts" ? <PayoutsPane /> : null}
    </div>
  );
}

function SettingsPane({
  data,
  onSaved,
}: {
  data: Record<string, unknown>;
  onSaved: () => void;
}) {
  const s = data.settings as Record<string, unknown>;
  const [form, setForm] = useState({
    legal_name: String(s.legal_name || ""),
    gstin: String(s.gstin || ""),
    state_code: String(s.state_code || "MH"),
    state_name: String(s.state_name || "Maharashtra"),
    city: String(s.city || ""),
    address_line: String(s.address_line || ""),
    gst_rate_bps: String(s.gst_rate_bps || 1800),
    sac_code: String(s.sac_code || ""),
    global_commission_bps: String(s.global_commission_bps || 2000),
    consult_rate_min_minor: String(s.consult_rate_min_minor || 500),
    consult_rate_max_minor: String(s.consult_rate_max_minor || 50000),
  });
  async function save() {
    await fetch("/api/admin/billing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        gst_rate_bps: Number(form.gst_rate_bps),
        global_commission_bps: Number(form.global_commission_bps),
        consult_rate_min_minor: Number(form.consult_rate_min_minor),
        consult_rate_max_minor: Number(form.consult_rate_max_minor),
      }),
    });
    onSaved();
  }
  return (
    <div className="surface-panel max-w-2xl space-y-3 p-4">
      {Object.entries(form).map(([k, v]) => (
        <label key={k} className="block text-sm text-ink-muted">
          {k.replace(/_/g, " ")}
          <input
            className="field mt-1"
            value={v}
            onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
          />
        </label>
      ))}
      <button type="button" className="btn-grad min-h-11 px-4 text-sm" onClick={() => void save()}>
        Save GST settings
      </button>
    </div>
  );
}

function PlansPane({
  data,
  onSaved,
}: {
  data: Record<string, unknown>;
  onSaved: () => void;
}) {
  const plans = (data.plans as Record<string, unknown>[]) || [];
  const [name, setName] = useState("Monthly Insight");
  const [amount, setAmount] = useState("49900");
  const [cycle, setCycle] = useState("monthly");
  async function save() {
    await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        amountMinor: Number(amount),
        cycle,
        features: ["Daily horoscope", "Priority chat"],
      }),
    });
    onSaved();
  }
  return (
    <div className="space-y-4">
      <div className="surface-panel max-w-xl space-y-3 p-4">
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="field" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select className="field" value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>
        <button type="button" className="btn-grad min-h-11 px-4 text-sm" onClick={() => void save()}>
          Add plan (amount in paise)
        </button>
      </div>
      <Table
        rows={plans.map((p) => [
          String(p.name),
          rupees(Number(p.amount_minor)),
          String(p.cycle),
          String(p.active),
        ])}
        headers={["Plan", "Price", "Cycle", "Active"]}
      />
    </div>
  );
}

function PaymentsPane({ data }: { data: Record<string, unknown> }) {
  const payments = (data.payments as Record<string, unknown>[]) || [];
  return (
    <Table
      rows={payments.map((p) => [
        String(p.receipt),
        String(p.purpose),
        String(p.gateway),
        String(p.status),
        rupees(Number(p.amount_minor)),
        String(p.invoice_no || "—"),
        String(p.customer_name || ""),
      ])}
      headers={["Receipt", "Purpose", "Gateway", "Status", "Total", "Invoice", "Customer"]}
    />
  );
}

function CommercePane() {
  const [rows, setRows] = useState<{ products: Record<string, unknown>[]; orders: Record<string, unknown>[] }>({
    products: [],
    orders: [],
  });
  const [name, setName] = useState("Rudraksha kit");
  const [amount, setAmount] = useState("149900");
  const load = useCallback(async () => {
    const res = await fetch("/api/admin/commerce", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setRows({ products: json.products, orders: json.orders });
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <div className="space-y-4">
      <div className="surface-panel flex max-w-xl flex-col gap-3 p-4">
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="field" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button
          type="button"
          className="btn-grad min-h-11 px-4 text-sm"
          onClick={async () => {
            await fetch("/api/admin/commerce", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, amountMinor: Number(amount), kind: "physical", inventory: 10 }),
            });
            void load();
          }}
        >
          Add product
        </button>
      </div>
      <Table
        rows={rows.products.map((p) => [
          String(p.name),
          String(p.kind),
          rupees(Number(p.amount_minor)),
          String(p.inventory ?? "digital"),
        ])}
        headers={["Product", "Kind", "Price", "Inventory"]}
      />
      <Table
        rows={rows.orders.map((o) => [
          String(o.id),
          String(o.product_name),
          String(o.customer_name),
          String(o.shipping_status),
        ])}
        headers={["Order id", "Product", "Customer", "Shipping"]}
      />
      {rows.orders.length ? (
        <div className="flex flex-wrap gap-2">
          {["packed", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              type="button"
              className="btn-secondary-cosmic min-h-11 px-3 text-sm capitalize"
              onClick={async () => {
                const orderId = String(rows.orders[0]?.id || "");
                if (!orderId) return;
                await fetch("/api/admin/commerce", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId, shippingStatus: status }),
                });
                void load();
              }}
            >
              Mark latest {status}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function WalletsPane() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("10000");
  const [reason, setReason] = useState("admin_adjust");
  const load = useCallback(async () => {
    const res = await fetch("/api/admin/wallets", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setRows(json.wallets || []);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <div className="space-y-4">
      <div className="surface-panel flex max-w-xl flex-col gap-3 p-4">
        <label className="block text-sm text-ink-muted">
          Customer id
          <input className="field mt-1" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
        </label>
        <label className="block text-sm text-ink-muted">
          Amount (paise, negative to debit)
          <input className="field mt-1" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label className="block text-sm text-ink-muted">
          Reason
          <input className="field mt-1" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <button
          type="button"
          className="btn-grad min-h-11 px-4 text-sm"
          onClick={async () => {
            await fetch("/api/admin/wallets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerId,
                amountMinor: Number(amount),
                reason,
              }),
            });
            void load();
          }}
        >
          Adjust wallet
        </button>
      </div>
      <Table
        rows={rows.map((w) => [
          String(w.customer_id),
          String(w.display_name),
          String(w.phone || ""),
          rupees(Number(w.balance_minor)),
        ])}
        headers={["Customer id", "Customer", "Phone", "Balance"]}
      />
    </div>
  );
}

function RefundsPane() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const load = useCallback(async () => {
    const res = await fetch("/api/admin/refunds", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setRows(json.refunds || []);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={String(r.id)} className="surface-panel flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-white">
            {String(r.display_name)} · {rupees(Number(r.amount_minor))} · {String(r.status)}
            {r.invoice_no ? ` · inv ${String(r.invoice_no)}` : ""}
            {r.credit_note_no ? ` · CN ${String(r.credit_note_no)}` : ""}
          </p>
          {r.credit_note_no ? (
            <a
              className="inline-flex min-h-11 items-center text-sm text-saffron-deep underline"
              href={`/api/pay/credit-note/${r.credit_note_no}`}
              target="_blank"
              rel="noreferrer"
            >
              Credit note
            </a>
          ) : null}
          {String(r.status) === "requested" ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-grad min-h-11 px-3 text-sm"
                onClick={async () => {
                  await fetch("/api/admin/refunds", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refundId: r.id, decision: "approved" }),
                  });
                  void load();
                }}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn-secondary-cosmic min-h-11 px-3 text-sm"
                onClick={async () => {
                  await fetch("/api/admin/refunds", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refundId: r.id, decision: "rejected" }),
                  });
                  void load();
                }}
              >
                Reject
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PayoutsPane() {
  const [data, setData] = useState<{
    ledger: Record<string, unknown>[];
    batches: Record<string, unknown>[];
  }>({
    ledger: [],
    batches: [],
  });
  const [name, setName] = useState("Pandit Sharma");
  const [phone, setPhone] = useState("9876500001");
  const [upi, setUpi] = useState("pandit@upi");
  const load = useCallback(async () => {
    const res = await fetch("/api/admin/payouts", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setData({ ledger: json.ledger, batches: json.batches });
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <div className="space-y-4">
      <div className="surface-panel flex max-w-xl flex-col gap-3 p-4">
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="field" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="field" value={upi} onChange={(e) => setUpi(e.target.value)} />
        <button
          type="button"
          className="btn-secondary-cosmic min-h-11 px-4 text-sm"
          onClick={async () => {
            await fetch("/api/admin/payouts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "create-astrologer",
                displayName: name,
                phone,
                payoutUpi: upi,
              }),
            });
            void load();
          }}
        >
          Add billing astrologer
        </button>
      </div>
      <button
        type="button"
        className="btn-grad min-h-11 px-4 text-sm"
        onClick={async () => {
          await fetch("/api/admin/payouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "schedule" }),
          });
          void load();
        }}
      >
        Schedule UPI/bank payout
      </button>
      <Table
        rows={data.ledger.map((l) => [
          String(l.display_name),
          rupees(Number(l.taxable_minor)),
          `${Number(l.commission_bps) / 100}%`,
          rupees(Number(l.platform_minor)),
          rupees(Number(l.astrologer_minor)),
          String(l.status),
          String(l.invoice_no || ""),
        ])}
        headers={["Astrologer", "Taxable", "Comm %", "Platform", "Astrologer share", "Status", "Invoice"]}
      />
      <Table
        rows={data.batches.map((b) => [
          String(b.id),
          String(b.method),
          String(b.status),
          String(b.scheduled_for),
          String(b.notes || ""),
        ])}
        headers={["Batch", "Method", "Status", "Scheduled", "Notes"]}
      />
      {data.batches.some((b) => String(b.status) === "scheduled") ? (
        <button
          type="button"
          className="btn-secondary-cosmic min-h-11 px-4 text-sm"
          onClick={async () => {
            const batch = data.batches.find((b) => String(b.status) === "scheduled");
            if (!batch) return;
            await fetch("/api/admin/payouts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "mark-paid",
                batchId: batch.id,
                upiRef: `UPI-EVIDENCE-${Date.now()}`,
              }),
            });
            void load();
          }}
        >
          Mark latest scheduled batch paid
        </button>
      ) : null}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-[640px] w-full text-left text-sm">
        <thead className="bg-white/5 text-ink-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-white/10">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 text-white">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
