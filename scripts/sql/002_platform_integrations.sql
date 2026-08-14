-- CosmicGyan platform: Super Admin, encrypted secrets vault, integrations.
-- Vendor API keys NEVER live in this schema as plaintext.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  role text NOT NULL DEFAULT 'super_admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES admin_staff(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_sessions_staff_idx ON admin_sessions (staff_id);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_idx ON admin_sessions (expires_at);

CREATE TABLE IF NOT EXISTS platform_feature_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES admin_staff(id)
);

CREATE TABLE IF NOT EXISTS vault_meta (
  id text PRIMARY KEY,
  encrypted_dek text NOT NULL,
  algorithm text NOT NULL DEFAULT 'aes-256-gcm',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  slot_key text NOT NULL,
  display_name text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  sandbox_mode boolean NOT NULL DEFAULT true,
  is_primary boolean NOT NULL DEFAULT false,
  config_json text NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, slot_key)
);

CREATE TABLE IF NOT EXISTS integration_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
  secret_name text NOT NULL,
  ciphertext text NOT NULL,
  last4 text NOT NULL,
  rotated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, secret_name)
);

CREATE TABLE IF NOT EXISTS integration_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES admin_staff(id),
  actor_email text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  summary text NOT NULL,
  metadata text NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS integration_audit_created_idx
  ON integration_audit_log (created_at DESC);

CREATE TABLE IF NOT EXISTS integration_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  metric text NOT NULL,
  quantity numeric NOT NULL,
  metadata text NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS integration_usage_provider_idx
  ON integration_usage (provider_id, occurred_at DESC);

INSERT INTO platform_feature_flags (key, enabled)
VALUES ('auth0_enabled', false)
ON CONFLICT (key) DO NOTHING;
