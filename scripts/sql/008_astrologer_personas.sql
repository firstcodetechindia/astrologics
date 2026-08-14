-- Phase 5: REAL_HUMAN vs AI_PERSONA directory, fees, consult sessions.

ALTER TABLE billing_settings
  ADD COLUMN IF NOT EXISTS consult_rate_min_minor integer NOT NULL DEFAULT 500;
ALTER TABLE billing_settings
  ADD COLUMN IF NOT EXISTS consult_rate_max_minor integer NOT NULL DEFAULT 50000;

ALTER TABLE billing_astrologers
  ADD COLUMN IF NOT EXISTS persona_id uuid REFERENCES ai_personas(id) ON DELETE SET NULL;
ALTER TABLE billing_astrologers
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
ALTER TABLE billing_astrologers
  ADD COLUMN IF NOT EXISTS specialties_json text NOT NULL DEFAULT '[]';
ALTER TABLE billing_astrologers
  ADD COLUMN IF NOT EXISTS rate_minor integer NOT NULL DEFAULT 2000;
ALTER TABLE billing_astrologers
  ADD COLUMN IF NOT EXISTS available boolean NOT NULL DEFAULT true;
ALTER TABLE billing_astrologers
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS billing_astrologers_slug_uidx
  ON billing_astrologers (slug) WHERE slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS consult_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  astrologer_id uuid NOT NULL REFERENCES billing_astrologers(id),
  customer_id uuid REFERENCES billing_customers(id),
  payment_id uuid REFERENCES payments(id),
  kind text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  minutes integer NOT NULL DEFAULT 5,
  transcript_json text NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS astrologer_client_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  astrologer_id uuid NOT NULL REFERENCES billing_astrologers(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES billing_customers(id) ON DELETE CASCADE,
  note text NOT NULL DEFAULT '',
  repeat_client boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS astrologer_client_notes_astro_idx
  ON astrologer_client_notes (astrologer_id, created_at DESC);

ALTER TABLE billing_astrologers
  ADD COLUMN IF NOT EXISTS verification_docs_json text NOT NULL DEFAULT '[]';

CREATE TABLE IF NOT EXISTS consult_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES consult_sessions(id) ON DELETE SET NULL,
  astrologer_id uuid NOT NULL REFERENCES billing_astrologers(id) ON DELETE CASCADE,
  customer_display_name text NOT NULL DEFAULT '',
  stars integer NOT NULL DEFAULT 5,
  comment text NOT NULL DEFAULT '',
  reply text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS consult_ratings_astro_idx
  ON consult_ratings (astrologer_id, created_at DESC);
