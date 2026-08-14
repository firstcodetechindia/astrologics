-- Phase 4: AI personas, chatbot flows, conversation logs.

CREATE TABLE IF NOT EXISTS ai_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'guru',
  system_prompt text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'warm',
  llm_slot text NOT NULL DEFAULT 'openai',
  llm_model text NOT NULL DEFAULT '',
  allowed_topics_json text NOT NULL DEFAULT '[]',
  escalate_to_human boolean NOT NULL DEFAULT true,
  fact_filter_required boolean NOT NULL DEFAULT true,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'onboarding',
  persona_id uuid REFERENCES ai_personas(id) ON DELETE SET NULL,
  published boolean NOT NULL DEFAULT false,
  graph_json text NOT NULL DEFAULT '{"nodes":[],"edges":[]}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid REFERENCES chat_flows(id) ON DELETE SET NULL,
  persona_id uuid REFERENCES ai_personas(id) ON DELETE SET NULL,
  channel text NOT NULL DEFAULT 'admin_playground',
  status text NOT NULL DEFAULT 'active',
  current_node_key text NOT NULL DEFAULT '',
  vars_json text NOT NULL DEFAULT '{}',
  visitor_key text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_conversation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  node_key text NOT NULL DEFAULT '',
  node_type text NOT NULL DEFAULT '',
  role text NOT NULL,
  content text NOT NULL,
  filter_flagged boolean NOT NULL DEFAULT false,
  filter_violations_json text NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_conversation_events_conv_idx
  ON chat_conversation_events (conversation_id, created_at);

CREATE INDEX IF NOT EXISTS chat_conversations_updated_idx
  ON chat_conversations (updated_at DESC);
