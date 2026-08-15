/**
 * NASA JPL Horizons client — TEST HARNESS ONLY.
 *
 * Imported exclusively by `scripts/cross-validation-harness.ts`
 * (`npm run test:cross-validate`). Do NOT import this module from
 * `src/` — live Kundli generation, chart calculation, and user-facing
 * APIs must keep using astronomy-engine via `src/lib/astrology/planets.ts`.
 *
 * Horizons returns tropical geocentric ecliptic longitudes (DE441).
 * The harness subtracts the engine's Lahiri ayanamsa before comparing
 * to sidereal chart output.
 */
import fs from "node:fs";
import path from "node:path";

export const HORIZONS_ENDPOINT = "https://ssd.jpl.nasa.gov/api/horizons.api";

/** Classical grahas Horizons can return as bodies. Mean Rahu/Ketu are not Horizons targets. */
export const HORIZONS_BODIES = {
  sun: "10",
  moon: "301",
  mercury: "199",
  venus: "299",
  mars: "499",
  jupiter: "599",
  saturn: "699",
} as const;

export type HorizonsPlanetId = keyof typeof HORIZONS_BODIES;

export type HorizonsCaseRow = {
  jd_ut: number;
  tropical: Partial<Record<HorizonsPlanetId, number>>;
};

export type HorizonsCache = {
  source: string;
  endpoint: string;
  ephemeris: string;
  frame: string;
  apiKeyRequired: false;
  fetchedAt: string;
  cases: Record<string, HorizonsCaseRow>;
};

const CACHE_PATH = path.join(
  __dirname,
  "fixtures",
  "cross-validation",
  "horizons-cache.json"
);

const MIN_INTERVAL_MS = 1200;
let lastFetchAt = 0;

export function horizonsCachePath() {
  return CACHE_PATH;
}

export function loadHorizonsCache(): HorizonsCache | null {
  if (!fs.existsSync(CACHE_PATH)) return null;
  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as HorizonsCache;
}

export function saveHorizonsCache(cache: HorizonsCache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
}

function cacheComplete(
  cache: HorizonsCache | null,
  caseIds: string[],
  planets: HorizonsPlanetId[]
): cache is HorizonsCache {
  if (!cache) return false;
  return caseIds.every((id) => {
    const row = cache.cases[id];
    if (!row) return false;
    return planets.every((p) => typeof row.tropical[p] === "number");
  });
}

function q(value: string) {
  return encodeURIComponent(value);
}

function buildUrl(command: string, jds: number[]) {
  const tlist = jds.map((jd) => `'${jd}'`).join(" ");
  return (
    `${HORIZONS_ENDPOINT}?format=json` +
    `&COMMAND=${q(`'${command}'`)}` +
    `&OBJ_DATA=${q("'NO'")}` +
    `&MAKE_EPHEM=${q("'YES'")}` +
    `&EPHEM_TYPE=${q("'OBSERVER'")}` +
    `&CENTER=${q("'500@399'")}` +
    `&TLIST=${q(tlist)}` +
    `&TLIST_TYPE=${q("'JD'")}` +
    `&TIME_TYPE=${q("'UT'")}` +
    `&QUANTITIES=${q("'31'")}` +
    `&ANG_FORMAT=${q("'DEG'")}` +
    `&CSV_FORMAT=${q("'YES'")}` +
    `&CAL_FORMAT=${q("'BOTH'")}`
  );
}

async function rateLimit() {
  const wait = lastFetchAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastFetchAt = Date.now();
}

function parseObserverTable(result: string): { jd: number; lon: number }[] {
  const start = result.indexOf("$$SOE");
  const end = result.indexOf("$$EOE");
  if (start < 0 || end < 0) {
    throw new Error("Horizons response missing $$SOE/$$EOE table markers");
  }
  const body = result.slice(start + 5, end);
  const rows: { jd: number; lon: number }[] = [];
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("*")) continue;
    const cols = trimmed.split(",").map((c) => c.trim());
    // CAL, JDUT, empty, empty, ObsEcLon, ObsEcLat
    const jd = Number(cols[1]);
    const lon = Number(cols[4]);
    if (!Number.isFinite(jd) || !Number.isFinite(lon)) {
      throw new Error(`Unparseable Horizons CSV row: ${trimmed}`);
    }
    rows.push({ jd, lon });
  }
  if (rows.length === 0) {
    throw new Error("Horizons table contained no longitude rows");
  }
  return rows;
}

function matchJd(target: number, rows: { jd: number; lon: number }[]) {
  let best = rows[0];
  let bestD = Math.abs(rows[0].jd - target);
  for (const row of rows) {
    const d = Math.abs(row.jd - target);
    if (d < bestD) {
      best = row;
      bestD = d;
    }
  }
  if (bestD > 1e-5) {
    throw new Error(
      `No Horizons row within 1e-5 d of JD ${target} (nearest Δ=${bestD})`
    );
  }
  return best.lon;
}

async function fetchBody(
  command: string,
  jds: number[]
): Promise<{ jd: number; lon: number }[]> {
  await rateLimit();
  const url = buildUrl(command, jds);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "CosmicTalks-cross-validate/1.0 (test harness; cache-first)",
    },
  });
  if (!res.ok) {
    throw new Error(`Horizons HTTP ${res.status} for COMMAND=${command}`);
  }
  const payload = (await res.json()) as {
    result?: string;
    error?: string;
    signature?: { source?: string };
  };
  if (payload.error) {
    throw new Error(`Horizons error for COMMAND=${command}: ${payload.error}`);
  }
  if (!payload.result) {
    throw new Error(`Horizons empty result for COMMAND=${command}`);
  }
  return parseObserverTable(payload.result);
}

export async function ensureHorizonsCache(opts: {
  cases: { id: string; jd_ut: number }[];
  refresh?: boolean;
  offline?: boolean;
}): Promise<{ cache: HorizonsCache; fetched: boolean }> {
  const planets = Object.keys(HORIZONS_BODIES) as HorizonsPlanetId[];
  const ids = opts.cases.map((c) => c.id);
  const existing = loadHorizonsCache();
  const refresh =
    opts.refresh ?? process.env.HORIZONS_REFRESH === "1";
  const offline =
    opts.offline ?? process.env.HORIZONS_OFFLINE === "1";

  if (!refresh && cacheComplete(existing, ids, planets)) {
    return { cache: existing, fetched: false };
  }

  if (offline) {
    throw new Error(
      "Horizons cache incomplete and HORIZONS_OFFLINE=1 — refusing live API calls"
    );
  }

  console.log(
    refresh
      ? "  Fetching JPL Horizons (HORIZONS_REFRESH=1)…"
      : "  Horizons cache incomplete — fetching once and writing cache…"
  );

  const cache: HorizonsCache = {
    source: "NASA JPL Horizons API",
    endpoint: HORIZONS_ENDPOINT,
    ephemeris: "DE441",
    frame:
      "geocentric apparent ecliptic of date (QUANTITIES=31 ObsEcLon), tropical",
    apiKeyRequired: false,
    fetchedAt: new Date().toISOString(),
    cases: {},
  };
  for (const c of opts.cases) {
    cache.cases[c.id] = { jd_ut: c.jd_ut, tropical: {} };
  }

  const jds = opts.cases.map((c) => c.jd_ut);
  for (const [planet, command] of Object.entries(HORIZONS_BODIES) as [
    HorizonsPlanetId,
    string,
  ][]) {
    console.log(`  Horizons COMMAND='${command}' (${planet})`);
    const rows = await fetchBody(command, jds);
    for (const c of opts.cases) {
      cache.cases[c.id].tropical[planet] = matchJd(c.jd_ut, rows);
    }
  }

  saveHorizonsCache(cache);
  console.log(`  Wrote ${CACHE_PATH}`);
  return { cache, fetched: true };
}
