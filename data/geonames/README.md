# GeoNames India places data

Source dump → JSON → **Neon Postgres** (Vercel Storage) for birth-place autocomplete.

## Architecture

| Layer | Role |
|-------|------|
| `IN.txt` / conversion | Offline: GeoNames dump → `india_places.json` via `geonames_to_json.py` |
| `india_places.json.gz` | Compact source for re-import (optional; uncompressed JSON also works locally) |
| **Neon Postgres** (`cosmicgpt-db`) | System of record — `places` table + `pg_trgm` GIN indexes |
| `GET /api/places/search` | Stateless SQL search (similarity / word_similarity + population ranking) |

**This database is the project’s general Postgres** — future tables (user accounts, saved charts, astrologer profiles, etc.) should be added here, not as a separate database.

FlexSearch / Fly sidecar / prebuilt in-memory indexes are **retired**. The old Fly service is archived at `archive/fly-sidecar-unused/` for reference only.

## Schema & import

```bash
# Apply extension + table + indexes
npm run db:migrate:places

# Bulk load ~557,995 rows (batched inserts)
npm run db:import:places

# Validate delhi / bombay / firozbad
npm run test:places
```

SQL source of truth: `scripts/sql/001_places.sql`.

## Re-import after GeoNames updates

1. Refresh `IN.txt` + run `python3 data/geonames/geonames_to_json.py`
2. Optionally `gzip -c data/geonames/india_places.json > data/geonames/india_places.json.gz`
3. `npm run db:import:places` (truncates + reloads `places`)
4. `npm run test:places`

## Pre-deploy / CI

`npm run test:places` is the gate for places search. Run it manually before any production deploy that changes search SQL, schema, or DB drivers. CI workflow: `.github/workflows/places-search.yml` (needs GitHub secret `DATABASE_URL`).

## Search notes

- Similarity threshold: **0.22** (name / ascii)
- Word-similarity threshold: **0.40** (alternate names), dampened ×0.75 in ranking
- Ranking: composite trigram score + soft population prior, then population, then feature_code
