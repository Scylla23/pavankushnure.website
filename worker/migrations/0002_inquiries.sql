CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  ip_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  launch_date TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  emailed INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inquiries_ip_ts ON inquiries (ip_hash, ts);
