/**
 * Postgres + pg_trgm places search (Neon).
 */
import { getSql } from "@/lib/db";

export type PlaceSearchHit = {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  timezone: string;
  timezoneOffsetMinutes: number;
  population: number;
  feature_code: string;
  country: string;
};

/** Typo tolerance for name/ascii (`firozbad` → Firozabad ≈ 0.58). */
export const PLACES_SIMILARITY_THRESHOLD = 0.22;
/** Alternate-token match (`bombay` inside long alt string). */
export const PLACES_WORD_SIMILARITY_THRESHOLD = 0.4;

const tzOffsetCache = new Map<string, number>();

export function timezoneOffsetMinutes(tz: string, at = new Date()): number {
  const key = tz || "Asia/Kolkata";
  const cached = tzOffsetCache.get(key);
  if (cached != null) return cached;
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: key,
      timeZoneName: "longOffset",
    });
    const part = fmt
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value;
    const m = part?.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/i);
    if (m) {
      const sign = m[1] === "-" ? -1 : 1;
      const hh = Number(m[2]);
      const mm = Number(m[3] || 0);
      const mins = sign * (hh * 60 + mm);
      tzOffsetCache.set(key, mins);
      return mins;
    }
  } catch {
    /* fall through */
  }
  tzOffsetCache.set(key, 330);
  return 330;
}

export async function searchPlacesDb(
  query: string,
  limit = 10
): Promise<{
  hits: PlaceSearchHit[];
  meta: {
    threshold: number;
    wordThreshold: number;
    queryMs: number;
  };
}> {
  const q = query.trim();
  if (q.length < 2) {
    return {
      hits: [],
      meta: {
        threshold: PLACES_SIMILARITY_THRESHOLD,
        wordThreshold: PLACES_WORD_SIMILARITY_THRESHOLD,
        queryMs: 0,
      },
    };
  }

  const sql = getSql();
  const t0 = performance.now();
  const likeContains = `%${q.replace(/[%_]/g, "\\$&")}%`;
  const likePrefix = `${q.replace(/[%_]/g, "\\$&")}%`;
  const likeNew = `new ${q.replace(/[%_]/g, "\\$&")}`;
  const sim = PLACES_SIMILARITY_THRESHOLD;
  const wsim = PLACES_WORD_SIMILARITY_THRESHOLD;

  // Candidate set via indexed trigram ops (UNION), then score/rank.
  const rows = await sql`
    WITH cand AS (
      SELECT id FROM places WHERE name % ${q}
      UNION
      SELECT id FROM places WHERE ascii_name % ${q}
      UNION
      SELECT id FROM places WHERE alternate_names_text %> ${q}
      UNION
      SELECT id FROM places WHERE name ILIKE ${likePrefix} OR ascii_name ILIKE ${likePrefix}
      UNION
      SELECT id FROM places WHERE alternate_names_text ILIKE ${likeContains}
    )
    SELECT
      p.id,
      p.name,
      p.state,
      p.lat,
      p.lng,
      p.timezone,
      p.population,
      p.feature_code,
      p.country,
      (
        GREATEST(
          CASE WHEN lower(p.name) = lower(${q}) OR lower(p.ascii_name) = lower(${q}) THEN 1.0 ELSE 0 END,
          CASE
            WHEN lower(p.name) = lower(${likeNew}) OR lower(p.ascii_name) = lower(${likeNew})
            THEN 0.97 ELSE 0
          END,
          CASE
            WHEN p.name ILIKE ${likePrefix} OR p.ascii_name ILIKE ${likePrefix}
            THEN 0.9 ELSE 0
          END,
          similarity(p.name, ${q}),
          similarity(p.ascii_name, ${q}),
          -- Dampen alt-only hits so obscure places with noisy alts don't beat metros
          word_similarity(${q}, p.alternate_names_text) * 0.75,
          CASE WHEN p.alternate_names_text ILIKE ${likeContains} THEN 0.88 ELSE 0 END
        )
        + LEAST(0.25, ln(GREATEST(p.population, 1)::float + 1.0) / 25.0)
      ) AS score
    FROM places p
    INNER JOIN cand c ON c.id = p.id
    WHERE
      similarity(p.name, ${q}) >= ${sim}
      OR similarity(p.ascii_name, ${q}) >= ${sim}
      OR word_similarity(${q}, p.alternate_names_text) >= ${wsim}
      OR p.name ILIKE ${likeContains}
      OR p.ascii_name ILIKE ${likeContains}
      OR p.alternate_names_text ILIKE ${likeContains}
      OR lower(p.name) = lower(${q})
      OR lower(p.ascii_name) = lower(${q})
    ORDER BY
      score DESC,
      p.population DESC,
      CASE p.feature_code
        WHEN 'PPLC' THEN 100
        WHEN 'PPLA' THEN 80
        WHEN 'PPLA2' THEN 70
        WHEN 'PPLA3' THEN 60
        WHEN 'PPLA4' THEN 50
        WHEN 'PPLX' THEN 40
        WHEN 'PPL' THEN 20
        ELSE 10
      END DESC
    LIMIT ${limit}
  `;

  const hits: PlaceSearchHit[] = (rows as Array<Record<string, unknown>>).map(
    (r) => {
      const tz = String(r.timezone || "Asia/Kolkata");
      return {
        id: String(r.id),
        name: String(r.name || ""),
        state: String(r.state || ""),
        lat: Number(r.lat),
        lng: Number(r.lng),
        timezone: tz,
        timezoneOffsetMinutes: timezoneOffsetMinutes(tz),
        population: Number(r.population) || 0,
        feature_code: String(r.feature_code || "PPL"),
        country: String(r.country || "India"),
      };
    }
  );

  return {
    hits,
    meta: {
      threshold: sim,
      wordThreshold: wsim,
      queryMs: performance.now() - t0,
    },
  };
}
