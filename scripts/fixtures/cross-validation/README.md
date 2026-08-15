# Cross-validation fixtures (Phase 2)

Goldens for `npm run test:cross-validate`.

**Isolation:** this directory and `scripts/cross-validation-harness.ts` / `scripts/jpl-horizons.ts` are the only Horizons callers. Production Kundli / chart / API code in `src/` must not import them. astronomy-engine remains the sole live ephemeris.

| File | Source |
|---|---|
| `swiss-ephemeris-goldens.json` | `pyswisseph` SIDM_LAHIRI + mean node (dev-only generator; **not** shipped in the product) |
| `jagannatha-hora-goldens.json` | Same SE Lahiri ganita JH uses — labeled JH-compatible |
| `drikpanchang-goldens.json` | Published Drik-style panchang limbs / sign checks |
| `horizons-cache.json` | NASA JPL Horizons tropical ObsEcLon (QUANTITIES=31, DE441, no API key). Harness subtracts engine Lahiri ayanamsa before comparing. Cached so CI does not hit the live API. |
| `last-report.json` | Last harness run summary (generated; gitignored) |

Regenerate SE/JH goldens (requires local `pip install pyswisseph`):

```bash
python3 scripts/gen-se-goldens.py
```

Refresh Horizons cache (live API; rate-limited):

```bash
HORIZONS_REFRESH=1 npm run test:cross-validate
```

Force cache-only (fail if incomplete):

```bash
HORIZONS_OFFLINE=1 npm run test:cross-validate
```

### When to re-run `HORIZONS_REFRESH=1`

The cache stores tropical longitudes at **fixed historical instants** (the eight goldens). It does **not** go stale because the calendar moved on — 1990-05-15 01:00 UT is the same row next year. Default `npm run test:cross-validate` must keep using the committed cache (no HTTP). CI is `HORIZONS_OFFLINE=1`.

Re-fetch only when the **reference** might have changed, not on a daily/weekly schedule:

1. **Before a major production release** that ships ephemeris or ayanamsa changes (so release notes can cite a fresh 4th-source pass).
2. **After upgrading `astronomy-engine`** — re-compare VSOP87/ELP vs DE441 on the same instants.
3. **After adding or editing a birth case** in `swiss-ephemeris-goldens.json` (new `jd_ut` has no cached row).
4. **If the harness parser breaks** (Horizons CSV/API format change) or JPL publishes a new DE kernel you intend to track.
5. **Otherwise leave it.** Do not refresh on every PR. Optional: at most **once per calendar year** if none of the above fired, so `fetchedAt` in `horizons-cache.json` does not silently age past a year without a conscious check.

Production Kundli / chart / API paths must never call Horizons. Isolation: `scripts/jpl-horizons.ts` is imported only by `scripts/cross-validation-harness.ts`.

Cases cover: modern, southern hemisphere, historical pre-1947 (wartime + LMT), approximate noon time, tropical/sidereal boundary probe. Rahu/Ketu are not compared to Horizons (no classical mean-node target).
