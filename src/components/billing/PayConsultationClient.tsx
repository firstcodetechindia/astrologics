"use client";

import { useEffect, useState } from "react";
import { rupees } from "@/lib/billing/gst";

type Catalog = {
  gstRateBps: number;
  astrologers: { id: string; display_name: string }[];
  plans: { id: string; name: string; amount_minor: number; cycle: string }[];
};

export function PayConsultationClient() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [name, setName] = useState("Asha Sharma");
  const [phone, setPhone] = useState("9876543210");
  const [stateCode, setStateCode] = useState("KA");
  const [astrologerId, setAstrologerId] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/pay/catalog", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        setCatalog(json);
        if (json.astrologers?.[0]) setAstrologerId(json.astrologers[0].id);
      }
    })();
  }, []);

  const amountMinor = 49900;

  async function pay() {
    setBusy(true);
    setError("");
    const created = await fetch("/api/pay/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purpose: "consultation",
        amountMinor,
        displayName: name,
        phone,
        stateCode,
        astrologerId,
        description: "Mock consultation (30 min)",
      }),
    });
    const order = await created.json();
    if (!order.ok) {
      setBusy(false);
      setError(order.error || "Checkout failed");
      return;
    }
    const captured = await fetch("/api/pay/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "capture", paymentId: order.paymentId }),
    });
    const cap = await captured.json();
    setBusy(false);
    if (!cap.ok) {
      setError(cap.error || "Capture failed");
      return;
    }
    setResult({ ...order, ...cap });
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 py-8">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
          Checkout
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">
          Book a consultation
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Razorpay confirms payment with a signed webhook (HMAC). This sandbox
          path signs a mock <code>payment.captured</code> event with the vault
          webhook secret — the browser cannot mark a payment captured on its own.
        </p>
      </header>
      <label className="block text-sm text-ink-muted">
        Your name
        <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm text-ink-muted">
        Phone
        <input className="field mt-1" inputMode="numeric" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <label className="block text-sm text-ink-muted">
        State (place of supply)
        <select className="field mt-1" value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
          <option value="MH">Maharashtra</option>
          <option value="KA">Karnataka</option>
          <option value="DL">Delhi</option>
        </select>
      </label>
      <label className="block text-sm text-ink-muted">
        Astrologer
        <select className="field mt-1" value={astrologerId} onChange={(e) => setAstrologerId(e.target.value)}>
          {(catalog?.astrologers || []).map((a) => (
            <option key={a.id} value={a.id}>
              {a.display_name}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm text-white">Amount (incl. GST): {rupees(amountMinor)}</p>
      {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
      <button type="button" className="btn-grad min-h-11 w-full px-4 text-sm" disabled={busy} onClick={() => void pay()}>
        {busy ? "Processing…" : "Pay with Razorpay sandbox"}
      </button>
      {result ? (
        <div className="surface-panel space-y-2 p-4 text-sm text-ink-muted">
          <p className="text-white">Payment captured</p>
          <p>Gateway: {String(result.gateway)} · {String(result.transport)}</p>
          <p>Invoice: {String(result.invoiceNo)}</p>
          {result.invoiceNo ? (
            <a
              className="inline-flex min-h-11 items-center text-saffron-deep underline"
              href={`/api/pay/invoice/${result.invoiceNo}`}
              target="_blank"
              rel="noreferrer"
            >
              Download invoice
            </a>
          ) : null}
          {result.commission ? (
            <pre className="overflow-auto text-xs">
              {JSON.stringify(result.commission, null, 2)}
            </pre>
          ) : null}
          {result.creditNoteNo ? (
            <a
              className="inline-flex min-h-11 items-center text-saffron-deep underline"
              href={`/api/pay/credit-note/${result.creditNoteNo}`}
              target="_blank"
              rel="noreferrer"
            >
              Download credit note
            </a>
          ) : null}
          {result.paymentId ? (
            <button
              type="button"
              className="btn-secondary-cosmic min-h-11 px-4 text-sm"
              onClick={async () => {
                const res = await fetch("/api/pay/refund", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paymentId: result.paymentId,
                    reason: "User requested refund from checkout",
                  }),
                });
                const json = await res.json();
                setResult((prev) => ({ ...(prev || {}), refund: json }));
              }}
            >
              Request refund
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
