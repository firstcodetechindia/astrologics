-- Phase 6: social post queue. Nothing publishes without human approval.

CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text NOT NULL DEFAULT 'meta_social',
  kind text NOT NULL,
  status text NOT NULL DEFAULT 'pending_review',
  body text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  scheduled_for timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES admin_staff(id) ON DELETE SET NULL,
  published_at timestamptz,
  provider_post_id text,
  transport text,
  engagement_json text NOT NULL DEFAULT '{}',
  error text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_posts_status_idx
  ON social_posts (status, scheduled_for);
CREATE INDEX IF NOT EXISTS social_posts_created_idx
  ON social_posts (created_at DESC);
