-- Vault recovery metadata, admin lockout, forced password change.

ALTER TABLE vault_meta
  ADD COLUMN IF NOT EXISTS kek_fingerprint text,
  ADD COLUMN IF NOT EXISTS backup_downloaded_at timestamptz;

ALTER TABLE admin_staff
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS failed_login_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_until timestamptz;

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip text NOT NULL,
  success boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_login_attempts_lookup_idx
  ON admin_login_attempts (email, ip, created_at DESC);

-- Bootstrap rotation is set once in createFirstSuperAdmin (mustChangePassword: true).
-- Do not UPDATE must_change_password here: this file is re-applied on every
-- phase evidence migrate and used to force a password change after each phase.
