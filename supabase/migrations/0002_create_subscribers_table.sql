CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing_page',
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscribers_email_idx ON subscribers (email);
