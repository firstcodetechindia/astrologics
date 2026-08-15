"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const SRC = "/audio/observatory-ambient.mp3";
const LS_ON = "ct.observatory.ambient.on";
const LS_POS = "ct.observatory.ambient.pos";
const SIZE = 44;
const PAD = 12;
const TAP_PX = 8;
const NAV_H = 84; // 5.25rem mobile bottom nav

type Edge = "left" | "right";
type StoredPos = { edge: Edge; y: number };

function readWantOn(): boolean {
  try {
    return window.localStorage.getItem(LS_ON) !== "0";
  } catch {
    return true;
  }
}

function writeOn(on: boolean) {
  try {
    window.localStorage.setItem(LS_ON, on ? "1" : "0");
  } catch {
    /* ignore quota / private mode */
  }
}

function readPos(): StoredPos | null {
  try {
    const raw = window.localStorage.getItem(LS_POS);
    if (!raw) return null;
    const p = JSON.parse(raw) as StoredPos;
    if (p.edge !== "left" && p.edge !== "right") return null;
    if (typeof p.y !== "number" || Number.isNaN(p.y)) return null;
    return p;
  } catch {
    return null;
  }
}

function writePos(p: StoredPos) {
  try {
    window.localStorage.setItem(LS_POS, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function headerPx() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-header-h")
    .trim();
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return 84;
  return raw.endsWith("rem") ? n * 16 : n;
}

function bounds() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const lg = vw >= 1024;
  const minTop = headerPx() + PAD;
  const maxTop = vh - (lg ? PAD : NAV_H + PAD) - SIZE;
  return {
    minLeft: PAD,
    maxLeft: Math.max(PAD, vw - PAD - SIZE),
    minTop,
    maxTop: Math.max(minTop, maxTop),
  };
}

function clamp(left: number, top: number) {
  const b = bounds();
  return {
    left: Math.min(b.maxLeft, Math.max(b.minLeft, left)),
    top: Math.min(b.maxTop, Math.max(b.minTop, top)),
  };
}

function snap(left: number, top: number): { left: number; top: number; edge: Edge } {
  const c = clamp(left, top);
  const vw = window.innerWidth;
  const edge: Edge = c.left + SIZE / 2 < vw / 2 ? "left" : "right";
  const b = bounds();
  return {
    edge,
    left: edge === "left" ? b.minLeft : b.maxLeft,
    top: c.top,
  };
}

function defaultCssPos(): { left: number; top: number; edge: Edge } {
  const b = bounds();
  // Sit on the lower-left edge, one row above the extreme corner so the
  // control is not buried under the Next.js dev indicator or bottom nav.
  return { edge: "left", left: b.minLeft, top: Math.max(b.minTop, b.maxTop - 56) };
}

export function ObservatoryAmbient({ hi }: { hi: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origLeft: number;
    origTop: number;
    moved: boolean;
  } | null>(null);

  const [mounted, setMounted] = useState(false);
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; edge: Edge } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const wantOnRef = useRef(true);
  const unlockRef = useRef<(() => void) | null>(null);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const a = new Audio();
    a.preload = "none";
    a.loop = true;
    a.hidden = true;
    a.setAttribute("data-observatory-ambient-el", "");
    a.src = SRC;
    document.body.appendChild(a);
    audioRef.current = a;
    return a;
  }, []);

  const playSafe = useCallback(async () => {
    const a = ensureAudio();
    a.preload = "auto";
    try {
      await a.play();
    } catch {
      /* autoplay policy — stay quiet, no console */
    }
    return a;
  }, [ensureAudio]);

  const removeUnlock = useCallback(() => {
    unlockRef.current?.();
    unlockRef.current = null;
  }, []);

  const attachUnlock = useCallback(() => {
    if (unlockRef.current) return;
    const onUnlock = (e: Event) => {
      if (!wantOnRef.current) return;
      if (btnRef.current && e.target instanceof Node && btnRef.current.contains(e.target)) {
        return;
      }
      void playSafe();
      removeUnlock();
    };
    const opts = { capture: true, passive: true } as const;
    document.addEventListener("pointerdown", onUnlock, opts);
    document.addEventListener("keydown", onUnlock, opts);
    document.addEventListener("scroll", onUnlock, opts);
    unlockRef.current = () => {
      document.removeEventListener("pointerdown", onUnlock, opts);
      document.removeEventListener("keydown", onUnlock, opts);
      document.removeEventListener("scroll", onUnlock, opts);
    };
  }, [playSafe, removeUnlock]);

  useEffect(() => {
    const stored = readPos();
    const next = stored
      ? snap(stored.edge === "left" ? PAD : window.innerWidth, stored.y)
      : defaultCssPos();
    setPos(next);
    const want = readWantOn();
    wantOnRef.current = want;
    setOn(want);
    setMounted(true);
    if (!want) return;

    let cancelled = false;
    void playSafe().then((a) => {
      if (cancelled || !wantOnRef.current) return;
      if (a.paused) attachUnlock();
    });
    return () => {
      cancelled = true;
      removeUnlock();
    };
  }, [attachUnlock, playSafe, removeUnlock]);

  useEffect(() => {
    const onVis = () => {
      const a = audioRef.current;
      if (!a || !on) return;
      if (document.hidden) a.pause();
      else void playSafe();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [on, playSafe]);

  useEffect(() => {
    const onResize = () => {
      setPos((p) => {
        if (!p) return p;
        const next = snap(p.edge === "left" ? PAD : window.innerWidth, p.top);
        writePos({ edge: next.edge, y: next.top });
        return next;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.remove();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = useCallback(() => {
    if (wantOnRef.current) {
      wantOnRef.current = false;
      audioRef.current?.pause();
      setOn(false);
      writeOn(false);
      removeUnlock();
      return;
    }
    wantOnRef.current = true;
    setOn(true);
    writeOn(true);
    void playSafe();
  }, [playSafe, removeUnlock]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < TAP_PX) return;
    d.moved = true;
    setDragging(true);
    setSnapping(false);
    setPos({
      ...clamp(d.origLeft + dx, d.origTop + dy),
      edge: "left",
    });
    e.preventDefault();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>, commitTap = true) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    dragRef.current = null;
    try {
      btnRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    if (!d.moved) {
      setDragging(false);
      if (commitTap) toggle();
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect();
    const left = rect?.left ?? d.origLeft;
    const top = rect?.top ?? d.origTop;
    const next = snap(left, top);
    setSnapping(true);
    setDragging(false);
    setPos(next);
    writePos({ edge: next.edge, y: next.top });
  };

  const label = on
    ? hi
      ? "पृष्ठभूमि ध्वनि म्यूट करें"
      : "Mute background audio"
    : hi
      ? "पृष्ठभूमि ध्वनि चलाएँ"
      : "Unmute background audio";

  if (!mounted || !pos) return null;

  return createPortal(
    <button
      ref={btnRef}
      type="button"
      data-observatory-ambient
      data-observatory-ambient-on={on ? "1" : "0"}
      aria-label={label}
      aria-pressed={on}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={(e) => onPointerUp(e, false)}
      onClick={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className={cn(
        "fixed z-[75] flex h-11 w-11 min-h-11 min-w-11 touch-none items-center justify-center rounded-full bg-[#0B0F1F]/90 text-cosmic-gold ring-1 ring-white/15 backdrop-blur select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold/70",
        snapping && !dragging ? "motion-safe:transition-[left,top] motion-safe:duration-200" : null,
        dragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{ left: pos.left, top: pos.top }}
    >
      {on ? (
        <Volume2 className="h-5 w-5" aria-hidden />
      ) : (
        <VolumeX className="h-5 w-5" aria-hidden />
      )}
    </button>,
    document.body
  );
}
