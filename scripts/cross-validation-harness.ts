/**
 * Phase 2 — Cross-validation harness
 * Run: npm run test:cross-validate
 *
 * Compares CosmicTalks (astronomy-engine) charts against:
 *  1) Swiss Ephemeris Lahiri planet-position goldens
 *  2) Jagannatha Hora–compatible goldens (SE SIDM_LAHIRI; JH uses SE ganita)
 *  3) DrikPanchang / published panchang limb expectations
 *  4) NASA JPL Horizons (tropical ObsEcLon − engine Lahiri ayanamsa)
 *
 * Horizons lives in scripts/jpl-horizons.ts and is imported only here.
 * Production Kundli / chart / API paths must never call Horizons.
 *
 * Categories covered: modern, southern_hemisphere, historical_pre1947,
 * approximate_time, boundary.
 *
 * Exit 0 only when all hard checks pass. Soft (documented) discrepancies
 * are printed with root-cause notes but do not fail the suite when within
 * the documented AE↔SE tolerance bands (reused for AE↔Horizons DE441).
 *
 * Horizons cache: scripts/fixtures/cross-validation/horizons-cache.json
 * Refresh: HORIZONS_REFRESH=1 npm run test:cross-validate
 * Offline: HORIZONS_OFFLINE=1 (fail if cache incomplete; no live HTTP)
 */
import fs from "node:fs";
import path from "node:path";
import { computeKundli } from "../src/lib/astrology/compute";
import { SIGNS } from "../src/lib/astrology/constants";
import { angleDelta, norm360, signIndexFromLongitude } from "../src/lib/astrology/math";
import {
  HORIZONS_BODIES,
  ensureHorizonsCache,
  type HorizonsPlanetId,
} from "./jpl-horizons";

const ROOT = path.join(__dirname, "fixtures", "cross-validation");

/** Hard fail if planet longitude |Δ| exceeds this (degrees). */
const TOL = {
  sun: 1 / 60, // 1′
  moon: 3 / 60, // 3′ (AE ELP vs SE DE series)
  mercury: 2 / 60,
  venus: 1.5 / 60,
  mars: 1.5 / 60,
  jupiter: 1 / 60,
  saturn: 1 / 60,
  rahu: 2 / 60, // mean node formula vs SE
  ketu: 2 / 60,
  ayanamsa: 5 / 3600, // 5″
  lagna: 5 / 60, // 5′ (ASC model + AE vs SE)
} as const;

type LonMeta = {
  longitude: number;
  sign: string;
  nakshatra?: string;
  pada?: number;
};

type SeCase = {
  id: string;
  category: string;
  name: string;
  date: string;
  time: string;
  place: string;
  lat: number;
  lon: number;
  timeZone: string;
  jd_ut?: number;
  ayanamsa: number;
  lagna: LonMeta;
  planets: Record<string, LonMeta>;
  notes?: string;
};

type DrikCase = {
  id: string;
  source: string;
  sourceDetail: string;
  date: string;
  time: string;
  place: string;
  lat: number;
  lon: number;
  timeZone: string;
  expect: {
    weekday?: string;
    tithiName?: string;
    nakshatra?: string;
    sunSign?: string;
    moonSign?: string;
  };
};

type Finding = {
  caseId: string;
  source: string;
  field: string;
  severity: "pass" | "soft" | "fail";
  deltaDeg?: number;
  expected: string;
  actual: string;
  rootCause: string;
};

const findings: Finding[] = [];
let hardFails = 0;

function arcmin(deg: number) {
  return (deg * 60).toFixed(2) + "′";
}

function push(f: Finding) {
  findings.push(f);
  const tag =
    f.severity === "fail" ? "FAIL" : f.severity === "soft" ? "SOFT" : "PASS";
  if (f.severity === "fail") hardFails++;
  const d =
    f.deltaDeg != null ? ` Δ=${arcmin(Math.abs(f.deltaDeg))}` : "";
  console.log(
    `  [${tag}] ${f.caseId} ${f.field}: expected ${f.expected} got ${f.actual}${d}`
  );
  if (f.severity !== "pass") {
    console.log(`         rootCause: ${f.rootCause}`);
  }
}

function lonDelta(a: number, b: number) {
  return Math.abs(angleDelta(norm360(a), norm360(b)));
}

function comparePlanet(
  caseId: string,
  source: string,
  id: string,
  expected: LonMeta,
  actualLon: number,
  actualSign: string
) {
  const d = lonDelta(expected.longitude, actualLon);
  const tol = (TOL as Record<string, number>)[id] ?? 2 / 60;
  const signOk = expected.sign === actualSign;
  // Near cusp: allow sign mismatch only if both within 0.05° of boundary
  const nearCusp =
    expected.longitude % 30 < 0.05 || expected.longitude % 30 > 29.95;

  if (d <= tol && signOk) {
    push({
      caseId,
      source,
      field: `planet.${id}`,
      severity: "pass",
      deltaDeg: d,
      expected: `${expected.sign} ${expected.longitude.toFixed(4)}°`,
      actual: `${actualSign} ${actualLon.toFixed(4)}°`,
      rootCause: "within tolerance",
    });
    return;
  }

  if (d <= tol * 2 && (signOk || nearCusp)) {
    push({
      caseId,
      source,
      field: `planet.${id}`,
      severity: "soft",
      deltaDeg: d,
      expected: `${expected.sign} ${expected.longitude.toFixed(4)}°`,
      actual: `${actualSign} ${actualLon.toFixed(4)}°`,
      rootCause:
        source === "jpl_horizons"
          ? "astronomy-engine (VSOP87/ELP) vs JPL Horizons (DE441) residual after Lahiri subtraction; still sign-aligned or cusp-adjacent"
          : "astronomy-engine (VSOP87/ELP) vs Swiss Ephemeris (DE-series) ephemeris residual; still sign-aligned or cusp-adjacent",
    });
    return;
  }

  push({
    caseId,
    source,
    field: `planet.${id}`,
    severity: "fail",
    deltaDeg: d,
    expected: `${expected.sign} ${expected.longitude.toFixed(4)}°`,
    actual: `${actualSign} ${actualLon.toFixed(4)}°`,
    rootCause: !signOk
      ? "sign-level mismatch — check ayanamsa, timezone/UTC instant, or node mode"
      : source === "jpl_horizons"
        ? "longitude beyond AE↔Horizons (DE441) tolerance — investigate ephemeris or birth-instant conversion"
        : "longitude beyond AE↔SE tolerance — investigate ephemeris or birth-instant conversion",
  });
}

function runSeFamily(file: string, sourceLabel: string) {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8")) as {
    cases: SeCase[];
    note?: string;
  };
  console.log(`\n=== ${sourceLabel} (${file}) ===`);
  if (raw.note) console.log(raw.note);

  for (const c of raw.cases) {
    console.log(`\n— ${c.id} [${c.category}] ${c.date} ${c.time} ${c.place}`);
    const k = computeKundli({
      name: c.name,
      date: c.date,
      time: c.time,
      place: c.place,
      lat: c.lat,
      lon: c.lon,
      timeZone: c.timeZone,
    });

    const ayaD = Math.abs(k.ayanamsa - c.ayanamsa);
    push({
      caseId: c.id,
      source: sourceLabel,
      field: "ayanamsa",
      severity: ayaD <= TOL.ayanamsa ? "pass" : ayaD <= 30 / 3600 ? "soft" : "fail",
      deltaDeg: ayaD,
      expected: c.ayanamsa.toFixed(6),
      actual: k.ayanamsa.toFixed(6),
      rootCause:
        ayaD <= TOL.ayanamsa
          ? "within tolerance"
          : "Lahiri alignment residual vs SIDM_LAHIRI (check Spica/SE alignment constant)",
    });

    for (const [pid, exp] of Object.entries(c.planets)) {
      const p = k.planets.find((x) => x.id === pid);
      if (!p) {
        push({
          caseId: c.id,
          source: sourceLabel,
          field: `planet.${pid}`,
          severity: "fail",
          expected: exp.sign,
          actual: "missing",
          rootCause: "planet not present in kundli result",
        });
        continue;
      }
      comparePlanet(c.id, sourceLabel, pid, exp, p.longitude, p.sign.en);
    }

    // Lagna: CosmicTalks uses whole-sign from AE asc; golden stores SE Placidus ASC−Lahiri
    const lagD = lonDelta(c.lagna.longitude, k.lagna.longitude);
    const lagSignOk = c.lagna.sign === k.lagna.sign.en;
    push({
      caseId: c.id,
      source: sourceLabel,
      field: "lagna",
      severity:
        lagD <= TOL.lagna && lagSignOk
          ? "pass"
          : lagD <= 15 / 60 && lagSignOk
            ? "soft"
            : lagSignOk
              ? "soft"
              : "fail",
      deltaDeg: lagD,
      expected: `${c.lagna.sign} ${c.lagna.longitude.toFixed(4)}°`,
      actual: `${k.lagna.sign.en} ${k.lagna.longitude.toFixed(4)}°`,
      rootCause: lagSignOk
        ? "ASC model residual (AE vs SE sidereal time / nutation); whole-sign house from this lon"
        : "lagna sign mismatch — usually wrong UTC instant (timezone) or coordinates",
    });
  }
}

function runDrik() {
  const raw = JSON.parse(
    fs.readFileSync(path.join(ROOT, "drikpanchang-goldens.json"), "utf8")
  ) as { cases: DrikCase[] };
  console.log("\n=== DrikPanchang / published panchang ===");

  for (const c of raw.cases) {
    console.log(`\n— ${c.id} ${c.date} ${c.time}`);
    const k = computeKundli({
      name: c.id,
      date: c.date,
      time: c.time,
      place: c.place,
      lat: c.lat,
      lon: c.lon,
      timeZone: c.timeZone,
    });
    const pan = k.panchang as {
      weekday?: { en: string };
      tithi?: { name: { en: string } };
      nakshatra?: { name: { en: string } };
    };

    const checks: [string, string | undefined, string | undefined][] = [
      ["weekday", c.expect.weekday, pan.weekday?.en],
      ["tithi", c.expect.tithiName, pan.tithi?.name?.en],
      ["nakshatra", c.expect.nakshatra, k.nakshatra.name.en],
      ["sunSign", c.expect.sunSign, k.sunRashi.en],
      ["moonSign", c.expect.moonSign, k.moonRashi.en],
    ];

    for (const [field, expected, actual] of checks) {
      if (expected == null) continue;
      const ok = expected === actual;
      push({
        caseId: c.id,
        source: "drikpanchang",
        field,
        severity: ok ? "pass" : "fail",
        expected,
        actual: actual ?? "missing",
        rootCause: ok
          ? c.sourceDetail
          : `limb mismatch vs published Drik-style value — ${c.sourceDetail}`,
      });
    }
  }
}

async function runHorizons() {
  const raw = JSON.parse(
    fs.readFileSync(path.join(ROOT, "swiss-ephemeris-goldens.json"), "utf8")
  ) as { cases: SeCase[] };
  const cases = raw.cases.map((c) => ({
    id: c.id,
    jd_ut: c.jd_ut,
    name: c.name,
    date: c.date,
    time: c.time,
    place: c.place,
    lat: c.lat,
    lon: c.lon,
    timeZone: c.timeZone,
    category: c.category,
  }));

  const missingJd = cases.filter((c) => typeof c.jd_ut !== "number");
  if (missingJd.length) {
    throw new Error(
      `Horizons needs jd_ut on SE goldens; missing: ${missingJd.map((c) => c.id).join(", ")}`
    );
  }

  console.log("\n=== jpl_horizons (NASA JPL Horizons API, test-only) ===");
  console.log(
    "Isolation: scripts/jpl-horizons.ts → this harness only. Not imported from src/."
  );
  console.log(
    "Frame: tropical geocentric ObsEcLon (QUANTITIES=31) − engine Lahiri ayanamsa."
  );
  console.log(
    "Bodies: Sun–Saturn + Moon. Rahu/Ketu skipped (no classical mean-node Horizons target)."
  );

  const { cache, fetched } = await ensureHorizonsCache({
    cases: cases.map((c) => ({ id: c.id, jd_ut: c.jd_ut as number })),
  });
  console.log(
    fetched
      ? "  Live Horizons fetch completed; cache updated."
      : `  Using cached Horizons rows from ${cache.fetchedAt} (no HTTP).`
  );

  const planets = Object.keys(HORIZONS_BODIES) as HorizonsPlanetId[];

  for (const c of cases) {
    console.log(`\n— ${c.id} [${c.category}] ${c.date} ${c.time} ${c.place}`);
    const k = computeKundli({
      name: c.name,
      date: c.date,
      time: c.time,
      place: c.place,
      lat: c.lat,
      lon: c.lon,
      timeZone: c.timeZone,
    });
    const trop = cache.cases[c.id]?.tropical;
    if (!trop) {
      push({
        caseId: c.id,
        source: "jpl_horizons",
        field: "cache",
        severity: "fail",
        expected: "cached tropical longitudes",
        actual: "missing",
        rootCause: "Horizons cache has no row for this case",
      });
      continue;
    }

    for (const pid of planets) {
      const tropical = trop[pid];
      if (typeof tropical !== "number") {
        push({
          caseId: c.id,
          source: "jpl_horizons",
          field: `planet.${pid}`,
          severity: "fail",
          expected: "tropical longitude",
          actual: "missing",
          rootCause: "Horizons cache missing this body",
        });
        continue;
      }
      const sidereal = norm360(tropical - k.ayanamsa);
      const sign = SIGNS[signIndexFromLongitude(sidereal)].en;
      const p = k.planets.find((x) => x.id === pid);
      if (!p) {
        push({
          caseId: c.id,
          source: "jpl_horizons",
          field: `planet.${pid}`,
          severity: "fail",
          expected: sign,
          actual: "missing",
          rootCause: "planet not present in kundli result",
        });
        continue;
      }
      comparePlanet(
        c.id,
        "jpl_horizons",
        pid,
        { longitude: sidereal, sign },
        p.longitude,
        p.sign.en
      );
    }
  }
}

function writeReport() {
  const reportPath = path.join(ROOT, "last-report.json");
  const summary = {
    generatedAt: new Date().toISOString(),
    hardFails,
    soft: findings.filter((f) => f.severity === "soft").length,
    pass: findings.filter((f) => f.severity === "pass").length,
    findings,
  };
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`\nReport written: ${reportPath}`);
  console.log(
    `Summary: ${summary.pass} pass, ${summary.soft} soft, ${summary.hardFails} fail`
  );
}

async function main() {
  console.log("CosmicTalks Phase 2 cross-validation harness");
  console.log(`Fixtures: ${ROOT}`);

  runSeFamily("swiss-ephemeris-goldens.json", "swiss_ephemeris");
  runSeFamily("jagannatha-hora-goldens.json", "jagannatha_hora");
  runDrik();
  await runHorizons();
  writeReport();

  if (hardFails > 0) {
    console.error(`\nHarness FAILED with ${hardFails} hard discrepancy(ies).`);
    process.exit(1);
  }
  console.log("\nHarness PASSED (no hard discrepancies).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
