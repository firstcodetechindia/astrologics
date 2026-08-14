-- Phase 3: communications templates, WhatsApp approval, automations, send log.

CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL,
  channel text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_key text NOT NULL,
  variables_json text NOT NULL DEFAULT '[]',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (template_key, channel)
);

CREATE TABLE IF NOT EXISTS message_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES message_templates(id) ON DELETE CASCADE,
  version integer NOT NULL,
  subject text NOT NULL DEFAULT '',
  body text NOT NULL,
  wa_language text NOT NULL DEFAULT 'en',
  wa_category text NOT NULL DEFAULT 'UTILITY',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (template_id, version)
);

CREATE TABLE IF NOT EXISTS whatsapp_template_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES message_templates(id) ON DELETE CASCADE,
  version_id uuid NOT NULL REFERENCES message_template_versions(id) ON DELETE CASCADE,
  provider_slot text NOT NULL DEFAULT 'meta_whatsapp',
  meta_template_name text NOT NULL,
  status text NOT NULL DEFAULT 'submitted',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  rejection_reason text NOT NULL DEFAULT '',
  provider_response text NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  event_key text NOT NULL,
  template_id uuid NOT NULL REFERENCES message_templates(id),
  channel text NOT NULL,
  offset_hours integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheduled_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES automation_rules(id) ON DELETE SET NULL,
  fire_at timestamptz NOT NULL,
  channel text NOT NULL,
  template_id uuid REFERENCES message_templates(id),
  to_addr text NOT NULL,
  vars_json text NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS scheduled_sends_due_idx
  ON scheduled_sends (status, fire_at);

CREATE TABLE IF NOT EXISTS message_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL,
  template_key text NOT NULL DEFAULT '',
  version integer,
  to_addr text NOT NULL,
  subject text NOT NULL DEFAULT '',
  rendered_body text NOT NULL,
  transport text NOT NULL DEFAULT 'mock',
  provider_slot text NOT NULL DEFAULT '',
  message_id text NOT NULL DEFAULT '',
  status text NOT NULL,
  error text NOT NULL DEFAULT '',
  metadata text NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_log_created_idx ON message_log (created_at DESC);

-- Mock Super Admin reviews must never look like Meta-approved.
UPDATE whatsapp_template_submissions
SET status = 'sandbox_approved'
WHERE status = 'approved'
  AND (provider_response LIKE '%"mock":true%' OR provider_response LIKE '%"mock": true%');

UPDATE whatsapp_template_submissions
SET status = 'sandbox_rejected'
WHERE status = 'rejected'
  AND (provider_response LIKE '%"mock":true%' OR provider_response LIKE '%"mock": true%');

UPDATE message_template_versions v
SET status = 'sandbox_approved'
WHERE v.status = 'approved'
  AND EXISTS (
    SELECT 1 FROM message_templates t
    WHERE t.id = v.template_id AND t.channel = 'whatsapp'
  )
  AND EXISTS (
    SELECT 1 FROM whatsapp_template_submissions s
    WHERE s.version_id = v.id
      AND (s.provider_response LIKE '%"mock":true%' OR s.provider_response LIKE '%"mock": true%')
  );

UPDATE scheduled_sends
SET status = 'cancelled_fixture'
WHERE status = 'scheduled'
  AND regexp_replace(to_addr, '\D', '', 'g') IN ('9999999999', '919999999999');
