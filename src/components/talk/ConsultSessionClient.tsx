"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { AstrologerKindLabel, isAiPersona } from "@/components/talk/AiAstrologerLabel";
import type { DirectoryAstrologer } from "@/lib/astrologers/directory";

export function ConsultSessionClient({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const hi = locale === "hi";
  const [astro, setAstro] = useState<DirectoryAstrologer | null>(null);
  const [busy, setBusy] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    void fetch(`/api/consult/session?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setAstro(j.astrologer);
      });
  }, [slug]);

  async function complete() {
    setBusy("Running mock session…");
    const res = await fetch("/api/consult/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        astrologerSlug: slug,
        customerName: "Phase5 Client",
        minutes: 5,
      }),
    });
    const json = await res.json();
    setBusy(json.ok ? "Session captured" : json.error || "Failed");
    if (json.ok) setResult(json);
  }

  if (!astro) {
    return <p className="text-sm text-ink-muted">{hi ? "लोड हो रहा है…" : "Loading…"}</p>;
  }

  const ai = isAiPersona(astro.kind);
  const liveBilling = Boolean(astro.billingId);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <p className="text-sm">
        <Link href="/chat-with-astrologer" className="text-[#F06A00] hover:underline">
          {hi ? "← ज्योतिषी सूची" : "← Astrologer directory"}
        </Link>
      </p>
      <h1 className="font-display text-2xl font-semibold text-ink">{astro.name}</h1>
      <AstrologerKindLabel kind={astro.kind} locale={locale} />
      <p className="text-sm text-ink-muted">{astro.bio || astro.skills.join(" · ")}</p>
      <div className="rounded-2xl border border-white/12 bg-surface p-4 text-sm text-ink">
        <p className="text-ink-muted">{hi ? "उपयोगकर्ता" : "You"}</p>
        <p>Hello, this is a 5-minute mock session.</p>
        <p className="mt-3 text-ink-muted">{astro.name}</p>
        <p>
          {ai
            ? "I am Jyoti, an AI astrologer — not a human. I can explain your calculated chart."
            : "Namaste — this is a live human consultation mock."}
        </p>
      </div>
      {liveBilling ? (
        <button type="button" className="btn-secondary-cosmic min-h-11 px-4" onClick={() => void complete()}>
          {hi ? "सत्र पूरा करें (मॉक भुगतान)" : "Complete mock session"}
        </button>
      ) : (
        <p className="text-sm text-ink-muted">
          {hi
            ? "डेमो प्रोफ़ाइल — बिलिंग सत्र लाइव पार्टनर पर उपलब्ध है।"
            : "Demo profile — billed mock sessions run on live partner listings."}
        </p>
      )}
      {busy ? <p className="text-xs text-ink-muted">{busy}</p> : null}
      {result ? (
        <div className="space-y-2">
          <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-ink">
            Review recorded: 5★ — Clear session. Waiting on astrologer reply in partner inbox.
          </p>
          <pre className="overflow-x-auto rounded-xl bg-black/30 p-3 text-xs text-ink">
            {JSON.stringify(result.math || result.commission, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
