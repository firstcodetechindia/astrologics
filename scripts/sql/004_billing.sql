-- Phase 2: billing, GST invoices, wallet, commerce, refunds, commission ledger.
-- Payouts are internal UPI/bank — not Razorpay Route.

CREATE TABLE IF NOT EXISTS billing_settings (
  id text PRIMARY KEY,
  legal_name text NOT NULL DEFAULT 'CosmicGyan',
  gstin text NOT NULL DEFAULT '',
  pan text NOT NULL DEFAULT '',
  address_line text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state_code text NOT NULL DEFAULT 'MH',
  state_name text NOT NULL DEFAULT 'Maharashtra',
  pincode text NOT NULL DEFAULT '',
  gst_rate_bps integer NOT NULL DEFAULT 1800,
  sac_code text NOT NULL DEFAULT '998399',
  hsn_code text NOT NULL DEFAULT '',
  global_commission_bps integer NOT NULL DEFAULT 2000,
  invoice_prefix text NOT NULL DEFAULT 'CG-INV',
  next_invoice_seq integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO billing_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS billing_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  email text,
  display_name text NOT NULL DEFAULT 'Customer',
  state_code text NOT NULL DEFAULT 'MH',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS billing_customers_phone_idx
  ON billing_customers (phone) WHERE phone IS NOT NULL;

CREATE TABLE IF NOT EXISTS billing_astrologers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  phone text,
  kind text NOT NULL DEFAULT 'REAL_HUMAN',
  commission_bps integer,
  payout_upi text,
  payout_account text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS billing_astrologers_phone_idx
  ON billing_astrologers (phone) WHERE phone IS NOT NULL;

CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  amount_minor integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  cycle text NOT NULL DEFAULT 'monthly',
  features_json text NOT NULL DEFAULT '[]',
  active boolean NOT NULL DEFAULT true,
  razorpay_plan_id text,
  stripe_price_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  kind text NOT NULL DEFAULT 'digital',
  description text NOT NULL DEFAULT '',
  amount_minor integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  inventory integer,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES billing_customers(id),
  astrologer_id uuid REFERENCES billing_astrologers(id),
  plan_id uuid REFERENCES subscription_plans(id),
  product_id uuid REFERENCES catalog_products(id),
  purpose text NOT NULL,
  gateway text NOT NULL,
  transport text NOT NULL DEFAULT 'mock',
  sandbox boolean NOT NULL DEFAULT true,
  currency text NOT NULL DEFAULT 'INR',
  amount_minor integer NOT NULL,
  taxable_minor integer NOT NULL,
  gst_minor integer NOT NULL,
  cgst_minor integer NOT NULL DEFAULT 0,
  sgst_minor integer NOT NULL DEFAULT 0,
  igst_minor integer NOT NULL DEFAULT 0,
  gst_rate_bps integer NOT NULL,
  place_of_supply text NOT NULL,
  gst_split text NOT NULL,
  gateway_order_id text,
  gateway_payment_id text,
  gateway_subscription_id text,
  status text NOT NULL DEFAULT 'created',
  receipt text NOT NULL,
  notes text NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  captured_at timestamptz
);

CREATE INDEX IF NOT EXISTS payments_status_idx ON payments (status, created_at DESC);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  invoice_no text UNIQUE NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  buyer_name text NOT NULL,
  buyer_state text NOT NULL,
  seller_gstin text NOT NULL,
  line_description text NOT NULL,
  html text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES billing_customers(id),
  plan_id uuid NOT NULL REFERENCES subscription_plans(id),
  payment_id uuid REFERENCES payments(id),
  gateway text NOT NULL,
  gateway_subscription_id text,
  status text NOT NULL DEFAULT 'created',
  cycle text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid UNIQUE NOT NULL REFERENCES billing_customers(id) ON DELETE CASCADE,
  balance_minor integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES payments(id),
  direction text NOT NULL,
  amount_minor integer NOT NULL,
  reason text NOT NULL,
  actor_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shop_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES billing_customers(id),
  payment_id uuid REFERENCES payments(id),
  product_id uuid REFERENCES catalog_products(id),
  quantity integer NOT NULL DEFAULT 1,
  shipping_status text NOT NULL DEFAULT 'unfulfilled',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id),
  amount_minor integer NOT NULL,
  reason text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'requested',
  gateway_refund_id text,
  decided_by text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commission_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id),
  astrologer_id uuid NOT NULL REFERENCES billing_astrologers(id),
  gross_minor integer NOT NULL,
  taxable_minor integer NOT NULL,
  gst_minor integer NOT NULL,
  commission_bps integer NOT NULL,
  platform_minor integer NOT NULL,
  astrologer_minor integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payout_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_for date NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  method text NOT NULL DEFAULT 'upi_bank',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE TABLE IF NOT EXISTS payout_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES payout_batches(id) ON DELETE CASCADE,
  commission_id uuid NOT NULL REFERENCES commission_ledger(id),
  astrologer_id uuid NOT NULL REFERENCES billing_astrologers(id),
  amount_minor integer NOT NULL,
  upi_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
