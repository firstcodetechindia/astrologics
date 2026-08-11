/** Soft device vibration when supported (iOS Safari often ignores this). */
export function vibrate(...pattern: number[]) {
  if (typeof navigator === "undefined") return;
  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern.length === 1 ? pattern[0] : pattern);
    }
  } catch {
    /* ignore unsupported / blocked */
  }
}
