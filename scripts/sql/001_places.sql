-- CosmicGPT / Astrologics primary Postgres schema (Neon via Vercel)
-- Places search is the first consumer; future tables (users, charts, etc.)
-- should live in this same database.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS places (
  id text PRIMARY KEY,
  name text NOT NULL,
  ascii_name text NOT NULL DEFAULT '',
  alternate_names text[] NOT NULL DEFAULT '{}',
  -- Flattened alternates for efficient word_similarity / gin_trgm indexing
  alternate_names_text text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'India',
  country_code text NOT NULL DEFAULT 'IN',
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  population integer NOT NULL DEFAULT 0,
  feature_code text NOT NULL DEFAULT 'PPL'
);

CREATE INDEX IF NOT EXISTS places_name_trgm
  ON places USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS places_ascii_name_trgm
  ON places USING gin (ascii_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS places_alternate_names_text_trgm
  ON places USING gin (alternate_names_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS places_state_trgm
  ON places USING gin (state gin_trgm_ops);

CREATE INDEX IF NOT EXISTS places_population_idx
  ON places (population DESC);
CREATE INDEX IF NOT EXISTS places_feature_code_idx
  ON places (feature_code);
