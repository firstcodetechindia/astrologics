/**
 * Observatory ambient clock.
 * Positions always come from queryObservatoryScene — this file only
 * defines how the simulated instant advances vs real seconds.
 *
 * Real elapsed time (1:1) plus a gentle time-lapse so inner planets
 * read as motion over ~10–20 seconds of watching. Not a user-facing speed.
 */

/** One mean day of sky motion every 4 real seconds, plus live 1:1. */
export const AMBIENT_SIM_MS_PER_SEC = 1000 + Math.round(86_400_000 / 4);

export function formatObservatoryClock(iso: string, hi: boolean): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(hi ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
