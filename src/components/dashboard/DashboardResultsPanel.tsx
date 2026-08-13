"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { History, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  DashboardEmpty,
  DashboardPanel,
} from "@/components/dashboard/DashboardPanel";
import { getSession } from "@/lib/auth/client-auth";
import {
  addRememberedResult,
  listRememberedResults,
  removeRememberedResult,
  type RememberedResult,
} from "@/lib/auth/dashboard-store";

export function DashboardResultsPanel() {
  const locale = useLocale();
  const hi = locale === "hi";
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<RememberedResult[]>([]);

  function refresh(p: string) {
    setResults(listRememberedResults(p));
  }

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setPhone(session.phone);
    refresh(session.phone);
  }, []);

  function addSample() {
    if (!phone) return;
    addRememberedResult(phone, {
      title: hi ? "कुंडली सारांश" : "Kundli summary",
      kind: hi ? "कुंडली" : "Kundli",
      summary: hi
        ? "आपने हाल ही में एक जन्म कुंडली जाँची — बाद में देखने के लिए यहाँ याद रखी गई।"
        : "You recently checked a birth chart — remembered here for later.",
      href: "/kundli",
    });
    refresh(phone);
  }

  return (
    <DashboardPanel>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-saffron/10 px-5 py-5 sm:px-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            {hi ? "याद रखे गए रिज़ल्ट्स" : "Remembered Results"}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {hi
              ? "टूल से मिले महत्वपूर्ण परिणाम यहाँ सहेजकर रखें।"
              : "Keep important tool outcomes here for quick revisit."}
          </p>
        </div>
        <Button
          type="button"
          onClick={addSample}
          className="rounded-xl! bg-[#F06A00]! px-4! py-2.5! text-xs! shadow-none! hover:bg-[#e85d04]!"
        >
          {hi ? "नमूना जोड़ें" : "Add sample"}
        </Button>
      </div>

      {results.length === 0 ? (
        <DashboardEmpty
          icon={History}
          title={hi ? "अभी कोई रिज़ल्ट नहीं" : "No results yet"}
          description={
            hi
              ? "जब आप कुंडली या कैलकुलेटर उपयोग करेंगे, महत्वपूर्ण रिज़ल्ट यहाँ याद रखे जा सकेंगे।"
              : "When you use kundli or calculators, key results can be remembered here."
          }
          action={
            <Link
              href="/kundli"
              className="inline-flex rounded-xl bg-[#F06A00] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {hi ? "कुंडली खोलें" : "Open Kundli"}
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-saffron/10">
          {results.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
                  {item.kind}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">
                  {item.title}
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">{item.summary}</p>
                <p className="mt-1 text-[11px] text-ink-muted">
                  {new Date(item.createdAt).toLocaleString(
                    hi ? "hi-IN" : "en-IN"
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="rounded-lg border border-saffron/25 px-3 py-1.5 text-xs font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
                  >
                    {hi ? "खोलें" : "Open"}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    removeRememberedResult(phone, item.id);
                    refresh(phone);
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-muted hover:bg-cosmic-purple/15 hover:text-saffron-deep"
                  aria-label={hi ? "हटाएँ" : "Remove"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
