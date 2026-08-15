"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  queryObservatoryScene,
  type ObservatoryBodyId,
  type ObservatoryFrame,
} from "@/lib/astrology/observatory-ephemeris";
import { formatObservatoryClock } from "@/lib/astrology/observatory-time";
import { BODY_COLOR } from "./observatory-colors";
import type { ObservatoryHudLabel } from "./ObservatoryCanvas";
import { ObservatoryDetailPanel } from "./ObservatoryDetailPanel";

const Scene = dynamic(() => import("./ObservatoryCanvas"), {
  ssr: false,
  loading: () => <SceneSkeleton />,
});

function SceneSkeleton() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-cosmic-navy"
      aria-busy="true"
      aria-label="Loading 3D scene"
    >
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cosmic-purple/40 via-cosmic-pink/25 to-cosmic-orange/30 motion-safe:animate-pulse" />
    </div>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalInputValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const LEGEND: { id: ObservatoryBodyId; en: string; hi: string; outer?: boolean }[] = [
  { id: "sun", en: "Sun", hi: "सूर्य" },
  { id: "moon", en: "Moon", hi: "चंद्र" },
  { id: "mercury", en: "Mercury", hi: "बुध" },
  { id: "venus", en: "Venus", hi: "शुक्र" },
  { id: "earth", en: "Earth", hi: "पृथ्वी" },
  { id: "mars", en: "Mars", hi: "मंगल" },
  { id: "jupiter", en: "Jupiter", hi: "गुरु" },
  { id: "saturn", en: "Saturn", hi: "शनि" },
  { id: "uranus", en: "Uranus", hi: "अरुण", outer: true },
  { id: "neptune", en: "Neptune", hi: "वरुण", outer: true },
];

export function ObservatoryView({ hi }: { hi: boolean }) {
  const [when, setWhen] = useState(() => toLocalInputValue(new Date()));
  const [clockIso, setClockIso] = useState(() => new Date().toISOString());
  const [trailEpoch, setTrailEpoch] = useState(0);
  const [viewReset, setViewReset] = useState(0);
  const [frame, setFrame] = useState<ObservatoryFrame>("heliocentric");
  const [includeOuter, setIncludeOuter] = useState(false);
  const [selectedId, setSelectedId] = useState<ObservatoryBodyId | null>(null);
  const [labels, setLabels] = useState<ObservatoryHudLabel[]>([]);
  const [fps, setFps] = useState(0);
  const [showFps, setShowFps] = useState(false);

  useEffect(() => {
    setShowFps(new URLSearchParams(window.location.search).has("fps"));
  }, []);

  useEffect(() => {
    if (!includeOuter && (selectedId === "uranus" || selectedId === "neptune")) {
      setSelectedId(null);
    }
  }, [includeOuter, selectedId]);

  const dateIso = useMemo(() => {
    const d = new Date(when);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }, [when]);

  const date = useMemo(() => new Date(clockIso), [clockIso]);

  const bodies = useMemo(() => {
    if (!selectedId) return [] as ReturnType<typeof queryObservatoryScene>;
    return queryObservatoryScene(date, frame, includeOuter);
  }, [selectedId, date, frame, includeOuter]);

  const selected = bodies.find((b) => b.id === selectedId) ?? null;

  const onHud = useCallback((next: ObservatoryHudLabel[], nextFps: number) => {
    setLabels(next);
    setFps(nextFps);
  }, []);

  const onSimClock = useCallback((iso: string) => {
    setClockIso(iso);
  }, []);

  const jumpToNow = useCallback(() => {
    const now = new Date();
    setWhen(toLocalInputValue(now));
    setClockIso(now.toISOString());
    setTrailEpoch((n) => n + 1);
  }, []);

  const fullView = useCallback(() => {
    setSelectedId(null);
    setViewReset((n) => n + 1);
  }, []);

  const onPickDate = useCallback((value: string) => {
    setWhen(value);
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) setClockIso(d.toISOString());
    setTrailEpoch((n) => n + 1);
  }, []);

  const onFrame = useCallback((id: ObservatoryFrame) => {
    setFrame(id);
    setSelectedId(null);
    setViewReset((n) => n + 1);
  }, []);

  const frameLabel =
    frame === "heliocentric"
      ? hi
        ? "सूर्य-केंद्र (हेलियोसेंट्रिक)"
        : "Sun-centered (heliocentric)"
      : hi
        ? "पृथ्वी-केंद्र (जियोसेंट्रिक)"
        : "Earth-centered (geocentric)";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="min-w-0 flex-1 basis-[16rem]">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {hi ? "तिथि व समय" : "Date & time"}
          </span>
          <input
            type="datetime-local"
            value={when}
            onChange={(e) => onPickDate(e.target.value)}
            className="field"
            aria-label={hi ? "दृश्य की तिथि और समय" : "Scene date and time"}
          />
        </label>
        <div className="flex min-w-0 flex-1 flex-wrap items-end gap-2">
          <button
            type="button"
            data-observatory-now
            onClick={jumpToNow}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-4 text-sm font-semibold text-white hover:bg-white/[0.08]"
          >
            {hi ? "अभी जाएँ" : "Jump to now"}
          </button>
          <button
            type="button"
            data-observatory-full-view
            onClick={fullView}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-4 text-sm font-semibold text-white hover:bg-white/[0.08]"
          >
            {hi ? "पूरा सौर मंडल" : "Full view"}
          </button>
          <div className="flex min-w-0 flex-wrap gap-2" role="group" aria-label={hi ? "केंद्र" : "Frame"}>
            {(
              [
                ["heliocentric", hi ? "सूर्य केंद्र" : "Sun-centered"],
                ["geocentric", hi ? "पृथ्वी केंद्र" : "Earth-centered"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                data-observatory-frame={id}
                aria-pressed={frame === id}
                onClick={() => onFrame(id)}
                className={cn(
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-4 text-sm font-semibold",
                  frame === id
                    ? "bg-gradient-to-r from-cosmic-purple to-cosmic-orange text-white"
                    : "border border-white/12 bg-white/[0.04] text-white/90 hover:bg-white/[0.08]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={includeOuter}
            onClick={() => setIncludeOuter((v) => !v)}
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold",
              includeOuter
                ? "border border-cosmic-purple/50 bg-cosmic-purple/25 text-white"
                : "border border-white/12 bg-white/[0.04] text-white/90 hover:bg-white/[0.08]"
            )}
          >
            {hi ? "अरुण / वरुण (वैदिक ग्रह नहीं)" : "Uranus / Neptune (not Vedic grahas)"}
          </button>
          <button
            type="button"
            aria-pressed={showFps}
            onClick={() => setShowFps((v) => !v)}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-4 text-sm font-semibold",
              showFps
                ? "border border-cosmic-gold/50 bg-cosmic-gold/15 text-cosmic-gold"
                : "border border-white/12 bg-white/[0.04] text-white/90 hover:bg-white/[0.08]"
            )}
          >
            FPS
          </button>
        </div>
      </div>

      <p className="text-[13px] text-ink-muted">
        {hi
          ? "लघुगणकीय कलात्मक दूरी — वास्तविक 1:1 पैमाना नहीं। ग्रह टैप करें: कैमरा पास जाएगा और तथ्य खुलेंगे। पूरा सौर मंडल पूरे दृश्य पर लौटाता है।"
          : "Logarithmic artistic scale — not 1:1. Tap a planet to fly the camera to it and open its facts. Full view returns to the whole mandal."}
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <div
          data-observatory-canvas
          data-observatory-ambient="1"
          className="relative h-[min(70vh,640px)] min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-cosmic-navy"
        >
          <Scene
            dateIso={dateIso}
            frame={frame}
            includeOuter={includeOuter}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onHud={onHud}
            trailEpoch={trailEpoch}
            viewReset={viewReset}
            onSimClock={onSimClock}
          />
          <div className="pointer-events-none absolute inset-0">
            {labels.map((lab) => {
              if (!lab.visible) return null;
              const meta = LEGEND.find((x) => x.id === lab.id);
              if (!meta) return null;
              if (meta.outer && !includeOuter) return null;
              const active = selectedId === lab.id;
              return (
                <button
                  key={lab.id}
                  type="button"
                  data-observatory-label={lab.id}
                  className={cn(
                    "pointer-events-auto absolute -translate-x-1/2 -translate-y-[120%] whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                    active
                      ? "bg-cosmic-purple text-white"
                      : "bg-[#0b0f1f]/80 text-white/90"
                  )}
                  style={{ left: lab.x, top: lab.y }}
                  onClick={() => setSelectedId(lab.id)}
                >
                  {hi ? meta.hi : meta.en}
                </button>
              );
            })}
          </div>
          {showFps ? (
            <p
              data-observatory-fps-hud
              className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/55 px-2 py-1 font-mono text-[11px] text-cosmic-gold"
            >
              {fps > 0 ? `${fps.toFixed(0)} fps` : "fps…"}
            </p>
          ) : null}
          <p
            data-observatory-clock
            className="pointer-events-none absolute left-2 top-2 max-w-[min(calc(100%-5.5rem),22rem)] rounded-lg bg-black/55 px-2.5 py-1.5 text-[12px] font-medium text-white/90 sm:text-[13px]"
          >
            {formatObservatoryClock(clockIso, hi)}
          </p>
        </div>

        {selected ? (
          <ObservatoryDetailPanel
            hi={hi}
            body={selected}
            date={date}
            frameLabel={frameLabel}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <p className="hidden rounded-2xl border border-dashed border-white/10 p-4 text-[13px] text-ink-muted lg:block">
            {hi
              ? "ग्रह या नाम चुनें — कैमरा पास जाएगा, तथ्य खुलेंगे। व्याख्या यहाँ नहीं है।"
              : "Select a planet or a name — the camera flies to it and facts open. No interpretation on this page."}
          </p>
        )}
      </div>

      <ul className="flex flex-wrap gap-2">
        {LEGEND.filter((item) => includeOuter || !item.outer).map((item) => (
          <li key={item.id}>
            <button
              type="button"
              data-observatory-legend={item.id}
              aria-pressed={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-[13px]",
                selectedId === item.id
                  ? "bg-cosmic-purple/30 text-white"
                  : "bg-white/[0.04] text-ink-muted hover:bg-white/[0.08]"
              )}
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: BODY_COLOR[item.id] }}
                aria-hidden
              />
              <span>{hi ? item.hi : item.en}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
