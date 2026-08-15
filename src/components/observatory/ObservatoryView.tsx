"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CircleHelp, SlidersHorizontal } from "lucide-react";
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
import { ObservatoryAmbient } from "./ObservatoryAmbient";

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

function toDateValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeValue(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDateAndTime(date: string, time: string) {
  const d = new Date(`${date}T${time || "00:00"}`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
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
  const [dateValue, setDateValue] = useState(() => toDateValue(new Date()));
  const [timeValue, setTimeValue] = useState(() => toTimeValue(new Date()));
  const [live, setLive] = useState(true);
  const [clockIso, setClockIso] = useState(() => new Date().toISOString());
  const [viewReset, setViewReset] = useState(0);
  const [frame, setFrame] = useState<ObservatoryFrame>("heliocentric");
  const [includeOuter, setIncludeOuter] = useState(false);
  const [selectedId, setSelectedId] = useState<ObservatoryBodyId | null>(null);
  const [labels, setLabels] = useState<ObservatoryHudLabel[]>([]);
  const [fps, setFps] = useState(0);
  const [showFps, setShowFps] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [optsOpen, setOptsOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);
  const optsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowFps(new URLSearchParams(window.location.search).has("fps"));
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      const now = new Date();
      setDateValue(toDateValue(now));
      setTimeValue(toTimeValue(now));
    }, 30_000);
    return () => window.clearInterval(id);
  }, [live]);

  useEffect(() => {
    if (!includeOuter && (selectedId === "uranus" || selectedId === "neptune")) {
      setSelectedId(null);
    }
  }, [includeOuter, selectedId]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (infoOpen && infoRef.current && !infoRef.current.contains(t)) setInfoOpen(false);
      if (optsOpen && optsRef.current && !optsRef.current.contains(t)) setOptsOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [infoOpen, optsOpen]);

  const dateIso = useMemo(
    () => fromDateAndTime(dateValue, timeValue).toISOString(),
    [dateValue, timeValue]
  );

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
    setLive(true);
    setDateValue(toDateValue(now));
    setTimeValue(toTimeValue(now));
    setClockIso(now.toISOString());
  }, []);

  const fullView = useCallback(() => {
    setSelectedId(null);
    setViewReset((n) => n + 1);
  }, []);

  const pickMoment = useCallback((nextDate: string, nextTime: string) => {
    setLive(false);
    setDateValue(nextDate);
    setTimeValue(nextTime);
    setClockIso(fromDateAndTime(nextDate, nextTime).toISOString());
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

  const help = hi
    ? "दूरियाँ लघुगणकीय कलात्मक पैमाने पर हैं — 1:1 नहीं। ग्रह टैप करें: कैमरा पास जाएगा और तथ्य खुलेंगे। ‘पूरा दृश्य’ पूरे मंडल पर लौटाता है।"
    : "Distances use a logarithmic artistic scale — not 1:1. Tap a planet to fly the camera to it and open facts. Full view returns to the whole mandal.";

  return (
    <div className="space-y-6">
      <ObservatoryAmbient hi={hi} />
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="grid min-w-0 flex-1 basis-[18rem] grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="min-w-0">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {hi ? "तिथि" : "Date"}
            </span>
            <input
              type="date"
              data-observatory-date
              value={dateValue}
              onChange={(e) => pickMoment(e.target.value, timeValue)}
              className="field min-w-0"
              aria-label={hi ? "दृश्य की तिथि" : "Scene date"}
            />
          </label>
          <label className="min-w-0">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {hi ? "समय" : "Time"}
            </span>
            <input
              type="time"
              data-observatory-time
              value={timeValue}
              onChange={(e) => pickMoment(dateValue, e.target.value)}
              className="field min-w-0"
              aria-label={hi ? "दृश्य का समय" : "Scene time"}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {live ? (
            <p
              data-observatory-live
              className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-medium text-cosmic-gold"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cosmic-gold motion-safe:animate-pulse" />
              {hi ? "लाइव" : "Live"}
            </p>
          ) : null}
          <div className="relative" ref={infoRef}>
            <button
              type="button"
              data-observatory-info
              aria-expanded={infoOpen}
              aria-label={hi ? "इस दृश्य के बारे में" : "About this view"}
              onClick={() => {
                setInfoOpen((v) => !v);
                setOptsOpen(false);
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink-muted hover:bg-white/[0.06] hover:text-white"
            >
              <CircleHelp className="h-5 w-5" aria-hidden />
            </button>
            {infoOpen ? (
              <p className="absolute right-0 z-20 mt-2 w-[min(calc(100vw-2rem),18rem)] rounded-xl border border-white/10 bg-[#12172c] p-3 text-[13px] leading-relaxed text-ink-muted shadow-xl">
                {help}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="inline-flex min-w-0 rounded-xl bg-white/[0.04] p-0.5"
          role="group"
          aria-label={hi ? "केंद्र" : "View"}
        >
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
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-[0.65rem] px-3.5 text-sm font-semibold",
                frame === id
                  ? "bg-gradient-to-r from-cosmic-purple to-cosmic-orange text-white"
                  : "text-white/70 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <button
            type="button"
            data-observatory-now
            onClick={jumpToNow}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3.5 text-sm font-medium",
              live
                ? "text-white/55 hover:bg-white/[0.06] hover:text-white"
                : "bg-gradient-to-r from-cosmic-purple to-cosmic-orange font-semibold text-white"
            )}
          >
            {hi ? "अभी जाएँ" : "Jump to now"}
          </button>
          <button
            type="button"
            data-observatory-full-view
            onClick={fullView}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3.5 text-sm font-medium text-white/55 hover:bg-white/[0.06] hover:text-white"
          >
            {hi ? "पूरा दृश्य" : "Full view"}
          </button>
          <div className="relative" ref={optsRef}>
            <button
              type="button"
              data-observatory-options
              aria-expanded={optsOpen}
              aria-label={hi ? "विकल्प" : "Options"}
              onClick={() => {
                setOptsOpen((v) => !v);
                setInfoOpen(false);
              }}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl",
                includeOuter || optsOpen
                  ? "bg-white/[0.08] text-white"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
            </button>
            {optsOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-[min(calc(100vw-2rem),17rem)] rounded-xl border border-white/10 bg-[#12172c] p-2 shadow-xl">
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-[13px] text-white/90">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--saffron,#c45c26)]"
                    checked={includeOuter}
                    onChange={(e) => setIncludeOuter(e.target.checked)}
                  />
                  <span>{hi ? "अरुण / वरुण (वैदिक ग्रह नहीं)" : "Uranus / Neptune (not Vedic grahas)"}</span>
                </label>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={cn("grid gap-4", selected ? "lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]" : "")}>
        <div
          data-observatory-canvas
          data-observatory-live={live ? "1" : "0"}
          className="relative h-[min(72vh,680px)] min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-cosmic-navy"
        >
          <Scene
            dateIso={dateIso}
            live={live}
            frame={frame}
            includeOuter={includeOuter}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onHud={onHud}
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
            className="pointer-events-none absolute left-2 top-2 max-w-[min(calc(100%-5.5rem),22rem)] rounded-lg bg-black/45 px-2.5 py-1.5 text-[12px] font-medium text-white/85"
          >
            {live ? (hi ? "लाइव · " : "Live · ") : ""}
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
        ) : null}
      </div>

      <div className="space-y-2">
        {!selected ? (
          <p className="text-[13px] text-ink-muted">
            {hi
              ? "ग्रह या नाम चुनें — कैमरा पास जाएगा, तथ्य खुलेंगे।"
              : "Select a planet or a name to look closer."}
          </p>
        ) : null}
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
                    : "text-ink-muted hover:bg-white/[0.06] hover:text-white/90"
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
    </div>
  );
}
