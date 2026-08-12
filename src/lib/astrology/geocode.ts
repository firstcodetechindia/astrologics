import { findCity, searchCities, type City } from "./cities";

export { formatPlaceLabel } from "./cities";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  importance?: number;
  class?: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state_district?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

const SETTLEMENT_TYPES = new Set([
  "city",
  "town",
  "village",
  "municipality",
  "hamlet",
  "suburb",
  "county",
  "state_district",
  "administrative",
]);

/** Rough civil timezone from longitude (no DST). India list keeps exact IST. */
export function estimateTimezoneOffsetMinutes(lon: number): number {
  if (!Number.isFinite(lon)) return 0;
  return Math.round(lon / 15) * 60;
}

function cityLabel(hit: NominatimResult, fallback: string): {
  name: string;
  state?: string;
  country?: string;
} {
  const name =
    hit.address?.city ||
    hit.address?.town ||
    hit.address?.village ||
    hit.address?.municipality ||
    hit.name ||
    hit.display_name.split(",")[0]?.trim() ||
    fallback;

  const country = hit.address?.country?.trim();
  const state = hit.address?.state?.trim();

  return {
    name: name.trim(),
    state: state || undefined,
    country: country || undefined,
  };
}

function placeKey(c: City): string {
  return [
    c.name.trim().toLowerCase(),
    (c.state || "").trim().toLowerCase(),
    (c.country || "").trim().toLowerCase(),
  ].join("|");
}

/** Keep one entry per city+region+country */
export function dedupePlaces(places: City[]): City[] {
  const map = new Map<string, City>();
  for (const p of places) {
    if (!p.name?.trim()) continue;
    if (!Number.isFinite(p.lat) || !Number.isFinite(p.lon)) continue;
    const key = placeKey(p);
    if (!map.has(key)) {
      map.set(key, {
        name: p.name.trim(),
        state: p.state?.trim(),
        country: p.country?.trim(),
        lat: p.lat,
        lon: p.lon,
        timezoneOffsetMinutes:
          p.timezoneOffsetMinutes ?? estimateTimezoneOffsetMinutes(p.lon),
      });
    }
  }
  return Array.from(map.values());
}

function toCity(hit: NominatimResult, fallback: string): City | null {
  if (hit.class && hit.class !== "place" && hit.class !== "boundary") {
    return null;
  }
  if (hit.type && !SETTLEMENT_TYPES.has(hit.type)) {
    if (
      !hit.address?.city &&
      !hit.address?.town &&
      !hit.address?.village &&
      !hit.address?.municipality
    ) {
      return null;
    }
  }

  const { name, state, country } = cityLabel(hit, fallback);
  const lat = Number(hit.lat);
  const lon = Number(hit.lon);
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const code = hit.address?.country_code?.toLowerCase();
  const timezoneOffsetMinutes =
    code === "in" ? 330 : estimateTimezoneOffsetMinutes(lon);

  return {
    name,
    state,
    country,
    lat,
    lon,
    timezoneOffsetMinutes,
  };
}

async function nominatimSearch(
  query: string,
  limit: number
): Promise<City[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  // Worldwide — no countrycodes filter
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", String(Math.max(limit * 4, 12)));
  url.searchParams.set("featuretype", "settlement");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "CosmicGPTKundli/1.0 (https://cosmicgpt.in; place search)",
      Accept: "application/json",
    },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];

  const results = (await res.json()) as NominatimResult[];
  const ranked = [...results].sort(
    (a, b) => (b.importance || 0) - (a.importance || 0)
  );

  const cities: City[] = [];
  for (const hit of ranked) {
    const city = toCity(hit, query);
    if (city) cities.push(city);
  }
  return dedupePlaces(cities).slice(0, limit);
}

/** Resolve any world place: offline India list first, then OpenStreetMap */
export async function resolvePlace(query: string): Promise<City | null> {
  const local = findCity(query);
  if (local) return { ...local, country: local.country || "India" };

  const q = query.trim();
  if (q.length < 2) return null;

  try {
    const matches = await nominatimSearch(q, 1);
    return matches[0] || null;
  } catch {
    return null;
  }
}

/** Search places for autocomplete (local India + worldwide Nominatim) */
export async function searchPlaces(query: string, limit = 8): Promise<City[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const local = dedupePlaces(
    searchCities(q, limit * 2).map((c) => ({
      ...c,
      country: c.country || "India",
    }))
  );

  try {
    const remote = await nominatimSearch(q, limit);
    // Prefer exact/local India hits first, then world
    return dedupePlaces([...local, ...remote]).slice(0, limit);
  } catch {
    return local.slice(0, limit);
  }
}
