"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  ASTROLOGER_CATEGORIES,
  ASTROLOGER_LANGUAGES,
  ASTROLOGER_SKILLS,
  clearAstrologerSession,
  displayAstrologerName,
  formatPhoneDisplay,
  getAstrologerSession,
  type AstrologerProfile,
} from "@/lib/auth/astrologer-auth";
import { siteConfig } from "@/lib/site-config";
import { rupees } from "@/lib/billing/gst";

function labelFor(
  list: readonly { id: string; en: string; hi: string }[],
  id: string,
  hi: boolean
) {
  const item = list.find((x) => x.id === id);
  if (!item) return id;
  return hi ? item.hi : item.en;
}

export function AstrologerDashboardClient() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const [profile, setProfile] = useState<AstrologerProfile | null>(null);

  useEffect(() => {
    const session = getAstrologerSession();
    if (!session) {
      router.replace("/astrologer/signin");
      return;
    }
    setProfile(session);
  }, [router]);

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-muted">
        {hi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  const pending = profile.status === "pending";

  return (
    <div className="bg-cosmic-navy">
      <div className="container-page py-8 sm:py-10">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] border border-saffron/15 bg-surface shadow-[0_18px_48px_-34px_rgba(42,33,24,0.45)]">
          <div className="border-b border-saffron/10 px-5 py-6 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
                  {siteConfig.brandName} · {hi ? "पार्टनर" : "Partner"}
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                  {hi ? "नमस्ते" : "Welcome"}, {displayAstrologerName(profile)}
                </h1>
                <p className="mt-1 text-sm text-ink-muted">
                  {formatPhoneDisplay(profile.phone)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearAstrologerSession();
                  router.replace("/astrologer/signin");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-saffron/25 px-3 py-2 text-xs font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
              >
                <LogOut className="h-3.5 w-3.5" />
                {hi ? "लॉग आउट" : "Logout"}
              </button>
            </div>

            <div
              className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${
                pending
                  ? "border-saffron/25 bg-cosmic-navy"
                  : "border-emerald-400/30 bg-emerald-500/15"
              }`}
            >
              {pending ? (
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-saffron-deep" />
              ) : (
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              )}
              <div>
                <p className="text-sm font-semibold text-ink">
                  {pending
                    ? hi
                      ? "आवेदन समीक्षाधीन है"
                      : "Application under review"
                    : hi
                      ? "पार्टनर सत्यापित"
                      : "Partner verified"}
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">
                  {pending
                    ? hi
                      ? "हमारी टीम आपके पंजीकरण की जाँच करेगी और जल्द संपर्क करेगी।"
                      : "Our team will review your registration and contact you soon."
                    : hi
                      ? "आप परामर्श उपकरण जल्द उपयोग कर सकेंगे।"
                      : "Consultation tools will be available for you soon."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-5 py-6 sm:px-8">
            <EarningsPanel phone={profile.phone} hi={hi} />
            <PartnerTools phone={profile.phone} hi={hi} />
            <section>
              <h2 className="text-sm font-semibold text-ink">
                {hi ? "कौशल" : "Skills"}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-cosmic-purple/15 px-3 py-1 text-[12px] font-semibold text-saffron-deep"
                  >
                    {labelFor(ASTROLOGER_SKILLS, id, hi)}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-ink">
                {hi ? "भाषाएँ" : "Languages"}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.languages.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-saffron/20 px-3 py-1 text-[12px] font-semibold text-ink"
                  >
                    {labelFor(ASTROLOGER_LANGUAGES, id, hi)}
                  </span>
                ))}
              </div>
            </section>
            {profile.categories.length ? (
              <section>
                <h2 className="text-sm font-semibold text-ink">
                  {hi ? "श्रेणियाँ" : "Categories"}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.categories.map((id) => (
                    <span
                      key={id}
                      className="rounded-full border border-saffron/20 px-3 py-1 text-[12px] font-semibold text-ink"
                    >
                      {labelFor(ASTROLOGER_CATEGORIES, id, hi)}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-2xl! bg-[#F06A00]! px-5! py-3! shadow-none! hover:bg-[#e85d04]!"
              >
                {hi ? "मुख्य साइट पर जाएँ" : "Go to main site"}
              </Button>
              <p className="mt-3 text-[12px] text-ink-muted">
                <Link href="/contact" className="font-semibold text-saffron-deep hover:underline">
                  {hi ? "सहायता से संपर्क करें" : "Contact support"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarningsPanel({ phone, hi }: { phone: string; hi: boolean }) {
  const [data, setData] = useState<{
    astrologer: { display_name: string } | null;
    ledger: Record<string, unknown>[];
    totals: {
      taxableLabel: string;
      platformLabel: string;
      astrologerLabel: string;
      reversedLabel?: string;
      clawbackLabel?: string;
    } | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(
        `/api/astrologer/earnings?phone=${encodeURIComponent(phone)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!cancelled && json.ok) setData(json);
    })();
    return () => {
      cancelled = true;
    };
  }, [phone]);

  if (!data) {
    return (
      <p className="text-sm text-ink-muted">
        {hi ? "कमाई लोड हो रही है…" : "Loading earnings…"}
      </p>
    );
  }
  if (!data.astrologer) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">
          {hi ? "कमाई" : "Earnings"}
        </h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          {hi
            ? "इस फ़ोन के लिए अभी कोई बिलिंग प्रोफ़ाइल नहीं है।"
            : "No billing profile is linked to this phone yet."}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-sm font-semibold text-ink">
        {hi ? "कमाई" : "Earnings"}
      </h2>
      <p className="mt-1 text-[13px] text-ink-muted">
        {hi
          ? "परामर्श पर प्लेटफ़ॉर्म कमीशन काटे बाद आपका हिस्सा।"
          : "Your share after platform commission on consultations. GST stays with the merchant of record. Math: taxable × commission% = platform; remainder = your share."}
      </p>
      {data.totals ? (
        <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="min-w-0 rounded-xl bg-cosmic-navy/60 px-3 py-2">
            <dt className="text-[11px] text-ink-muted">{hi ? "करयोग्य" : "Taxable"}</dt>
            <dd className="text-sm font-semibold text-ink">{data.totals.taxableLabel}</dd>
          </div>
          <div className="min-w-0 rounded-xl bg-cosmic-navy/60 px-3 py-2">
            <dt className="text-[11px] text-ink-muted">{hi ? "प्लेटफ़ॉर्म" : "Platform"}</dt>
            <dd className="text-sm font-semibold text-ink">{data.totals.platformLabel}</dd>
          </div>
          <div className="min-w-0 rounded-xl bg-cosmic-navy/60 px-3 py-2">
            <dt className="text-[11px] text-ink-muted">{hi ? "आपका हिस्सा" : "Your share"}</dt>
            <dd className="text-sm font-semibold text-saffron-deep">
              {data.totals.astrologerLabel}
            </dd>
          </div>
          {data.totals.clawbackLabel && data.totals.clawbackLabel !== "₹0.00" ? (
            <div className="min-w-0 rounded-xl bg-cosmic-navy/60 px-3 py-2">
              <dt className="text-[11px] text-ink-muted">{hi ? "क्लॉबैक" : "Clawback"}</dt>
              <dd className="text-sm font-semibold text-cosmic-pink">{data.totals.clawbackLabel}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-[720px] w-full text-left text-[13px]">
          <thead className="text-ink-muted">
            <tr>
              <th className="py-1 font-medium">{hi ? "चालान" : "Invoice"}</th>
              <th className="py-1 font-medium">{hi ? "करयोग्य" : "Taxable"}</th>
              <th className="py-1 font-medium">{hi ? "कमीशन" : "Comm %"}</th>
              <th className="py-1 font-medium">{hi ? "प्लेटफ़ॉर्म" : "Platform"}</th>
              <th className="py-1 font-medium">{hi ? "आपका हिस्सा" : "Your share"}</th>
              <th className="py-1 font-medium">{hi ? "स्थिति" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {data.ledger.map((row) => (
              <tr key={String(row.id)} className="border-t border-white/10">
                <td className="py-1.5 text-ink">{String(row.invoice_no || "—")}</td>
                <td className="py-1.5 text-ink">{rupees(Number(row.taxable_minor))}</td>
                <td className="py-1.5 text-ink">{Number(row.commission_bps) / 100}%</td>
                <td className="py-1.5 text-ink">{rupees(Number(row.platform_minor))}</td>
                <td className="py-1.5 text-ink">{rupees(Number(row.astrologer_minor))}</td>
                <td className="py-1.5 text-ink-muted">
                  {String(row.entry_kind || "earning")} · {String(row.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type Panel = {
  astrologer: {
    displayName: string;
    available: boolean;
    rateMinor: number;
    commissionBps: number;
    verificationDocs: { filename?: string; uploadedAt?: string }[];
  };
  rateBounds: { minMinor: number; maxMinor: number };
  inbox: { id: string; status: string; minutes: number; createdAt: string; clientName: string }[];
  calendar: { id: string; when: string; title: string }[];
  clients: {
    id: string;
    displayName: string;
    note: string;
    repeatClient: boolean;
    customerId: string;
  }[];
  ratings: { id: string; stars: number; comment: string; reply: string; clientName: string }[];
};

function PartnerTools({ phone, hi }: { phone: string; hi: boolean }) {
  const [panel, setPanel] = useState<Panel | null | undefined>(undefined);
  const [rate, setRate] = useState("");
  const [note, setNote] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState("");

  async function load() {
    const res = await fetch(`/api/astrologer/panel?phone=${encodeURIComponent(phone)}`, {
      cache: "no-store",
    });
    const json = await res.json();
    setPanel(json.ok ? json.panel : null);
    if (json.panel?.astrologer) {
      setRate(String(Math.round(json.panel.astrologer.rateMinor / 100)));
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  async function post(body: Record<string, unknown>) {
    setBusy("Saving…");
    const res = await fetch("/api/astrologer/panel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, ...body }),
    });
    const json = await res.json();
    setBusy(json.ok ? "Saved" : json.error || "Failed");
    if (json.ok) setPanel(json.panel);
  }

  if (panel === undefined) {
    return <p className="text-sm text-ink-muted">{hi ? "पैनल लोड हो रहा है…" : "Loading partner tools…"}</p>;
  }
  if (!panel) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">{hi ? "पार्टनर टूल" : "Partner tools"}</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          {hi
            ? "इस फ़ोन से जुड़ा लाइव बिलिंग प्रोफ़ाइल नहीं है।"
            : "No live billing profile is linked to this phone yet."}
        </p>
      </section>
    );
  }

  const firstClient = panel.clients[0];
  const firstRating = panel.ratings[0];

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">{hi ? "उपलब्धता और दर" : "Availability and rate"}</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          {hi
            ? `दर सीमा ${rupees(panel.rateBounds.minMinor)}–${rupees(panel.rateBounds.maxMinor)}/मिनट। कमीशन ${panel.astrologer.commissionBps / 100}%.`
            : `Admin bounds ${rupees(panel.rateBounds.minMinor)}–${rupees(panel.rateBounds.maxMinor)}/min. Your commission is ${panel.astrologer.commissionBps / 100}%.`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary-cosmic min-h-11 px-4 text-sm"
            onClick={() => void post({ action: "availability", available: !panel.astrologer.available })}
          >
            {panel.astrologer.available
              ? hi
                ? "ऑफ़लाइन करें"
                : "Go offline"
              : hi
                ? "ऑनलाइन करें"
                : "Go online"}
          </button>
        </div>
        <label className="mt-3 block text-sm text-ink-muted">
          {hi ? "₹ प्रति मिनट" : "₹ per minute"}
          <input
            className="field mt-1 w-full text-base"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="btn-grad mt-2 min-h-11 px-4 text-sm"
          onClick={() => void post({ action: "rate", rateMinor: Math.round(Number(rate || 0) * 100) })}
        >
          {hi ? "दर सहेजें" : "Save rate"}
        </button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">{hi ? "इनबॉक्स / कतार" : "Inbox / queue"}</h2>
        <ul className="mt-2 space-y-2 text-[13px] text-ink">
          {panel.inbox.length === 0 ? (
            <li className="text-ink-muted">{hi ? "कोई सत्र नहीं" : "No sessions yet"}</li>
          ) : (
            panel.inbox.slice(0, 6).map((s) => (
              <li key={s.id} className="min-w-0 break-words">
                {s.clientName} · {s.minutes} min · {s.status}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">{hi ? "कैलेंडर" : "Calendar"}</h2>
        <ul className="mt-2 space-y-2 text-[13px] text-ink">
          {panel.calendar.slice(0, 6).map((c) => (
            <li key={c.id} className="min-w-0 break-words">
              {new Date(c.when).toLocaleString()} — {c.title}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">{hi ? "क्लाइंट नोट्स" : "Client notes"}</h2>
        <p className="mt-1 text-[12px] text-ink-muted">
          {hi
            ? "केवल आपके परामर्श — पूरा प्लेटफ़ॉर्म खाता नहीं। ईमेल/फ़ोन यहाँ नहीं दिखते।"
            : "Consultation history only — not a platform account dump. Email/phone are not shown here."}
        </p>
        <ul className="mt-2 space-y-2 text-[13px] text-ink">
          {panel.clients.slice(0, 6).map((c) => (
            <li key={c.id} className="min-w-0 break-words">
              {c.displayName}
              {c.repeatClient ? (hi ? " · पुनरावर्ती" : " · repeat") : ""} — {c.note}
            </li>
          ))}
        </ul>
        {firstClient ? (
          <>
            <textarea
              className="field mt-2 min-h-20 w-full text-base"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={hi ? "नोट लिखें" : "Add a private note"}
            />
            <button
              type="button"
              className="btn-secondary-cosmic mt-2 min-h-11 px-4 text-sm"
              onClick={() =>
                void post({ action: "note", customerId: firstClient.customerId, note }).then(() => setNote(""))
              }
            >
              {hi ? "नोट जोड़ें" : "Add note"}
            </button>
          </>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">{hi ? "रेटिंग उत्तर" : "Rating replies"}</h2>
        <ul className="mt-2 space-y-2 text-[13px] text-ink">
          {panel.ratings.slice(0, 5).map((r) => (
            <li key={r.id} className="min-w-0 break-words">
              {r.stars}★ {r.clientName}: {r.comment}
              {r.reply ? ` — ${hi ? "उत्तर" : "reply"}: ${r.reply}` : ""}
            </li>
          ))}
        </ul>
        {firstRating ? (
          <>
            <textarea
              className="field mt-2 min-h-20 w-full text-base"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={hi ? "सार्वजनिक उत्तर" : "Public reply"}
            />
            <button
              type="button"
              className="btn-secondary-cosmic mt-2 min-h-11 px-4 text-sm"
              onClick={() =>
                void post({ action: "rating-reply", ratingId: firstRating.id, reply }).then(() => setReply(""))
              }
            >
              {hi ? "उत्तर सहेजें" : "Save reply"}
            </button>
          </>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-ink">{hi ? "सत्यापन दस्तावेज़" : "Verification re-upload"}</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          {panel.astrologer.verificationDocs.length
            ? `${panel.astrologer.verificationDocs.length} file(s) on record`
            : hi
              ? "अभी कोई फ़ाइल नहीं।"
              : "No files on record yet."}
        </p>
        <button
          type="button"
          className="btn-secondary-cosmic mt-2 min-h-11 px-4 text-sm"
          onClick={() => void post({ action: "verification", filename: `id-reupload-${Date.now()}.pdf` })}
        >
          {hi ? "दस्तावेज़ पुनः अपलोड (मॉक)" : "Re-upload ID (mock)"}
        </button>
        {busy ? <p className="mt-2 text-xs text-ink-muted">{busy}</p> : null}
      </section>
    </div>
  );
}
