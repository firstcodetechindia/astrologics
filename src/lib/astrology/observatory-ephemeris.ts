/**
 * Cosmic Observatory 3D positions — SEPARATE from the Kundli chart path.
 *
 * Uses astronomy-engine HelioVector / GeoVector / Ecliptic / EclipticGeoMoon.
 * Do not import computeKundli, getSiderealPlanets, or JPL Horizons here.
 * Chart calculation in planets.ts / compute.ts stays longitude-only and untouched.
 */
import * as Astronomy from "astronomy-engine";

export type ObservatoryFrame = "heliocentric" | "geocentric";

export type ObservatoryBodyId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export type ObservatoryBody = {
  id: ObservatoryBodyId;
  name: { en: string; hi: string };
  distanceAu: number;
  eclipticLon: number;
  eclipticLat: number;
  /** Artistic scene coords (log scale). Three.js: y = ecliptic north. */
  x: number;
  y: number;
  z: number;
  visualRadius: number;
  isOuter: boolean;
  vedicGraha: boolean;
};

const NAMES: Record<ObservatoryBodyId, { en: string; hi: string }> = {
  sun: { en: "Sun", hi: "सूर्य" },
  moon: { en: "Moon", hi: "चंद्र" },
  mercury: { en: "Mercury", hi: "बुध" },
  venus: { en: "Venus", hi: "शुक्र" },
  earth: { en: "Earth", hi: "पृथ्वी" },
  mars: { en: "Mars", hi: "मंगल" },
  jupiter: { en: "Jupiter", hi: "गुरु" },
  saturn: { en: "Saturn", hi: "शनि" },
  uranus: { en: "Uranus", hi: "अरुण" },
  neptune: { en: "Neptune", hi: "वरुण" },
};

const AE_BODY: Record<ObservatoryBodyId, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  earth: Astronomy.Body.Earth,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
};

const CLASSICAL: ObservatoryBodyId[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
];

const OUTER: ObservatoryBodyId[] = ["uranus", "neptune"];

const VEDIC = new Set<ObservatoryBodyId>([
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
]);

/** Moon ~0.00257 AU → Neptune ~30 AU, mapped to scene 1.6–17.6 */
export function artisticRadius(distanceAu: number): number {
  const minAu = 0.0024;
  const maxAu = 32;
  const d = Math.min(Math.max(distanceAu, minAu), maxAu);
  const t =
    (Math.log10(d) - Math.log10(minAu)) /
    (Math.log10(maxAu) - Math.log10(minAu));
  return 1.6 + t * 16;
}

function toScene(ex: number, ey: number, ez: number, visualR: number) {
  const len = Math.hypot(ex, ey, ez) || 1;
  const s = visualR / len;
  return { x: ex * s, y: ez * s, z: ey * s };
}

function bodyFromEcliptic(
  id: ObservatoryBodyId,
  ecl: Astronomy.EclipticCoordinates,
  distanceAu: number
): ObservatoryBody {
  const visualRadius = artisticRadius(distanceAu);
  const p = toScene(ecl.vec.x, ecl.vec.y, ecl.vec.z, visualRadius);
  return {
    id,
    name: NAMES[id],
    distanceAu,
    eclipticLon: ecl.elon,
    eclipticLat: ecl.elat,
    ...p,
    visualRadius,
    isOuter: id === "uranus" || id === "neptune",
    vedicGraha: VEDIC.has(id),
  };
}

function originBody(id: ObservatoryBodyId): ObservatoryBody {
  return {
    id,
    name: NAMES[id],
    distanceAu: 0,
    eclipticLon: 0,
    eclipticLat: 0,
    x: 0,
    y: 0,
    z: 0,
    visualRadius: 0,
    isOuter: false,
    vedicGraha: VEDIC.has(id),
  };
}

function helioEcliptic(body: Astronomy.Body, date: Date) {
  const vec = Astronomy.HelioVector(body, date);
  return { ecl: Astronomy.Ecliptic(vec), dist: vec.Length() };
}

function geoEcliptic(body: Astronomy.Body, date: Date) {
  const vec = Astronomy.GeoVector(body, date, true);
  return { ecl: Astronomy.Ecliptic(vec), dist: vec.Length() };
}

function moonBesideEarth(
  date: Date,
  earth: ObservatoryBody
): ObservatoryBody {
  const time = Astronomy.MakeTime(date);
  const eVec = Astronomy.HelioVector(Astronomy.Body.Earth, date);
  const mVec = Astronomy.HelioVector(Astronomy.Body.Moon, date);
  const rel = new Astronomy.Vector(
    mVec.x - eVec.x,
    mVec.y - eVec.y,
    mVec.z - eVec.z,
    time
  );
  const ecl = Astronomy.Ecliptic(rel);
  const offset = 0.55;
  const p = toScene(ecl.vec.x, ecl.vec.y, ecl.vec.z, offset);
  return {
    id: "moon",
    name: NAMES.moon,
    distanceAu: rel.Length(),
    eclipticLon: ecl.elon,
    eclipticLat: ecl.elat,
    x: earth.x + p.x,
    y: earth.y + p.y,
    z: earth.z + p.z,
    visualRadius: earth.visualRadius,
    isOuter: false,
    vedicGraha: true,
  };
}

export function queryObservatoryScene(
  date: Date,
  frame: ObservatoryFrame,
  includeOuter = false
): ObservatoryBody[] {
  const ids: ObservatoryBodyId[] = includeOuter
    ? [...CLASSICAL, "earth", ...OUTER]
    : [...CLASSICAL, "earth"];

  if (frame === "heliocentric") {
    const out: ObservatoryBody[] = [];
    let earth: ObservatoryBody | null = null;
    for (const id of ids) {
      if (id === "sun") {
        out.push(originBody("sun"));
        continue;
      }
      if (id === "moon") continue;
      const { ecl, dist } = helioEcliptic(AE_BODY[id], date);
      const row = bodyFromEcliptic(id, ecl, dist);
      if (id === "earth") earth = row;
      out.push(row);
    }
    if (earth) out.push(moonBesideEarth(date, earth));
    return out;
  }

  const out: ObservatoryBody[] = [];
  for (const id of ids) {
    if (id === "earth") {
      out.push(originBody("earth"));
      continue;
    }
    if (id === "moon") {
      const sph = Astronomy.EclipticGeoMoon(date);
      const eq = Astronomy.GeoVector(Astronomy.Body.Moon, date, true);
      const ecl = Astronomy.Ecliptic(eq);
      out.push(bodyFromEcliptic("moon", ecl, sph.dist));
      continue;
    }
    const { ecl, dist } = geoEcliptic(AE_BODY[id], date);
    out.push(bodyFromEcliptic(id, ecl, dist));
  }
  return out;
}
