-- Phase 2 compliance: GST credit notes, one invoice per payment, commission clawback.

ALTER TABLE billing_settings
  ADD COLUMN IF NOT EXISTS credit_note_prefix text NOT NULL DEFAULT 'CG-CN';

ALTER TABLE billing_settings
  ADD COLUMN IF NOT EXISTS next_credit_note_seq integer NOT NULL DEFAULT 0;

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS voided boolean NOT NULL DEFAULT false;

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS void_reason text NOT NULL DEFAULT '';

ALTER TABLE invoices ALTER COLUMN payment_id DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS invoices_payment_id_uidx ON invoices (payment_id);

CREATE TABLE IF NOT EXISTS credit_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_request_id uuid NOT NULL REFERENCES refund_requests(id),
  payment_id uuid NOT NULL REFERENCES payments(id),
  original_invoice_no text NOT NULL,
  credit_note_no text UNIQUE NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  buyer_name text NOT NULL,
  buyer_state text NOT NULL,
  seller_gstin text NOT NULL,
  taxable_minor integer NOT NULL,
  gst_minor integer NOT NULL,
  cgst_minor integer NOT NULL DEFAULT 0,
  sgst_minor integer NOT NULL DEFAULT 0,
  igst_minor integer NOT NULL DEFAULT 0,
  amount_minor integer NOT NULL,
  html text NOT NULL DEFAULT ''
);

CREATE UNIQUE INDEX IF NOT EXISTS credit_notes_refund_uidx ON credit_notes (refund_request_id);

ALTER TABLE commission_ledger
  ADD COLUMN IF NOT EXISTS entry_kind text NOT NULL DEFAULT 'earning';

ALTER TABLE commission_ledger
  ADD COLUMN IF NOT EXISTS related_ledger_id uuid REFERENCES commission_ledger(id);
