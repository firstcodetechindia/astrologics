"use client";

import { X } from "lucide-react";
import type { ObservatoryBody } from "@/lib/astrology/observatory-ephemeris";
import {
  ORBITAL_PERIOD_DAYS,
  formatAu,
  queryObservatoryChartPlacement,
  type ObservatoryChartPlacement,
} from "@/lib/astrology/observatory-kundli";
import { BODY_COLOR } from "./observatory-colors";

function periodLabel(days: number | undefined, hi: boolean) {
  if (days == null) return hi ? "—" : "—";
  if (days < 40) return hi ? `${days.toFixed(2)} दिन` : `${days.toFixed(2)} days`;
  const years = days / 365.256;
  if (years >= 1.5) return hi ? `${years.toFixed(2)} वर्ष` : `${years.toFixed(2)} years`;
  return hi ? `${days.toFixed(1)} दिन` : `${days.toFixed(1)} days`;
}

export function ObservatoryDetailPanel({
  hi,
  body,
  date,
  frameLabel,
  onClose,
}: {
  hi: boolean;
  body: ObservatoryBody;
  date: Date;
  frameLabel: string;
  onClose: () => void;
}) {
  const place: ObservatoryChartPlacement = queryObservatoryChartPlacement(
    date,
    body.id
  );
  const color = BODY_COLOR[body.id] ?? "#fff";

  return (
    <aside
      className="rounded-2xl border border-white/[0.08] bg-[#151a33] p-4 sm:p-5"
      aria-labelledby="observatory-detail-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {hi ? "विवरण" : "Detail"}
          </p>
          <h2
            id="observatory-detail-title"
            className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-ink"
          >
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: color }}
              aria-hidden
            />
            {hi ? body.name.hi : body.name.en}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/12 text-white/80 hover:bg-white/[0.06]"
          aria-label={hi ? "बंद करें" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <section className="mt-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cosmic-gold">
          {hi ? "कुंडली स्थिति (गणना)" : "Chart placement (calculated)"}
        </h3>
        <p className="mt-1 text-[12px] text-ink-muted">
          {hi
            ? "वही इंजन जो जन्म कुंडली में ग्रह देशांतर निकालता है — व्याख्या नहीं।"
            : "Same engine as janam kundali longitudes — placement only, not a reading."}
        </p>
        {place.available ? (
          <dl className="mt-2 grid grid-cols-1 gap-1.5 text-[14px] sm:grid-cols-2">
            <div>
              <dt className="text-ink-muted">{hi ? "राशि" : "Sign"}</dt>
              <dd className="font-medium text-ink">
                {hi ? place.sign.hi : place.sign.en} {place.degreeInSign.toFixed(2)}°
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">{hi ? "नक्षत्र" : "Nakshatra"}</dt>
              <dd className="font-medium text-ink">
                {hi ? place.nakshatra.hi : place.nakshatra.en}
                {place.pada ? ` · ${hi ? "पाद" : "pada"} ${place.pada}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">{hi ? "गति" : "Motion"}</dt>
              <dd className="font-medium text-ink">
                {place.isRetrograde == null
                  ? hi
                    ? "लागू नहीं"
                    : "n/a"
                  : place.isRetrograde
                    ? hi
                      ? "वक्री"
                      : "Retrograde"
                    : hi
                      ? "मार्गी"
                      : "Direct"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">{hi ? "वैदिक ग्रह?" : "Vedic graha?"}</dt>
              <dd className="font-medium text-ink">
                {place.vedicGraha ? (hi ? "हाँ" : "Yes") : hi ? "नहीं" : "No"}
              </dd>
            </div>
          </dl>
        ) : null}
        {place.note ? (
          <p className="mt-2 text-[13px] text-ink-muted">
            {hi ? place.note.hi : place.note.en}
          </p>
        ) : null}
      </section>

      <section className="mt-4 border-t border-white/[0.08] pt-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cosmic-gold">
          {hi ? "खगोलीय तथ्य" : "Astronomical facts"}
        </h3>
        <p className="mt-1 text-[12px] text-ink-muted">
          {hi
            ? "दूरी इस दृश्य के फ्रेम से है। कक्षीय अवधि संदर्भ स्थिरांक है, कुंडली आउटपुट नहीं।"
            : "Distance is from this view’s frame origin. Orbital period is a reference constant, not chart output."}
        </p>
        <dl className="mt-2 grid grid-cols-1 gap-1.5 text-[14px] sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">{hi ? "दूरी" : "Distance"}</dt>
            <dd className="font-medium text-ink">{formatAu(body.distanceAu, hi)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">
              {hi ? "कक्षीय अवधि" : "Orbital period"}
            </dt>
            <dd className="font-medium text-ink">
              {periodLabel(ORBITAL_PERIOD_DAYS[body.id], hi)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-ink-muted">{hi ? "फ्रेम" : "Frame"}</dt>
            <dd className="font-medium text-ink">{frameLabel}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
