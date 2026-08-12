/**
 * Persistent in-process chart-fact cache.
 * Calculate once per birth fingerprint; reuse fact-sheet + summary for chat.
 * (Multi-instance Redis can replace the Map later without API changes.)
 */
import { computeKundli } from "@/lib/astrology/compute";
import type { BirthInput, KundliResult } from "@/lib/astrology/types";
import { buildChartSummary } from "@/lib/ai/providers";
import {
  birthFingerprint,
  buildFactSheet,
  type ChartFactSheet,
} from "@/lib/ai/chart-fact-sheet";

export type CachedChart = {
  key: string;
  kundli: KundliResult;
  factSheet: ChartFactSheet;
  summary: string;
  hits: number;
  createdAt: number;
  lastAccessAt: number;
};

const MAX_ENTRIES = 200;
const TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

const store = new Map<string, CachedChart>();

function prune(now = Date.now()) {
  for (const [k, v] of store) {
    if (now - v.lastAccessAt > TTL_MS) store.delete(k);
  }
  if (store.size <= MAX_ENTRIES) return;
  const oldest = [...store.entries()].sort(
    (a, b) => a[1].lastAccessAt - b[1].lastAccessAt
  );
  const drop = store.size - MAX_ENTRIES;
  for (let i = 0; i < drop; i++) {
    const id = oldest[i]?.[0];
    if (id) store.delete(id);
  }
}

export function getCachedChart(key: string): CachedChart | null {
  prune();
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() - hit.lastAccessAt > TTL_MS) {
    store.delete(key);
    return null;
  }
  hit.hits += 1;
  hit.lastAccessAt = Date.now();
  return hit;
}

export function putCachedChart(
  kundli: KundliResult,
  summary?: string
): CachedChart {
  prune();
  const factSheet = buildFactSheet(kundli);
  const key = factSheet.key;
  const entry: CachedChart = {
    key,
    kundli,
    factSheet,
    summary: summary ?? buildChartSummary(kundli),
    hits: 1,
    createdAt: Date.now(),
    lastAccessAt: Date.now(),
  };
  store.set(key, entry);
  return entry;
}

/**
 * Resolve chart from cache key and/or birth input.
 * Never recomputes when a valid cache entry exists for the fingerprint.
 */
export function getOrComputeChart(opts: {
  chartKey?: string | null;
  input?: BirthInput | null;
}): CachedChart {
  prune();
  const keyFromClient = opts.chartKey?.trim();
  if (keyFromClient) {
    const hit = getCachedChart(keyFromClient);
    if (hit) return hit;
  }

  if (!opts.input) {
    throw new Error("Birth details required to build chart facts");
  }

  const fp = birthFingerprint(opts.input);
  const existing = getCachedChart(fp);
  if (existing) return existing;

  const kundli = computeKundli(opts.input);
  return putCachedChart(kundli);
}

export function cacheStats() {
  prune();
  return { size: store.size, max: MAX_ENTRIES, ttlMs: TTL_MS };
}

/** Test helper — clear cache between runs. */
export function clearChartFactCache() {
  store.clear();
}
