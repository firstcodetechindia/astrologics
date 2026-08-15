/**
 * Observatory clock display only.
 * Positions always come from queryObservatoryScene at a real instant —
 * live wall-clock time, or a user-picked snapshot. No acceleration.
 */

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
