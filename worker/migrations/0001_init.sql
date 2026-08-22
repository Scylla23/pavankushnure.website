CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  ts INTEGER NOT NULL,
  question TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_ip_ts ON questions (ip_hash, ts);
