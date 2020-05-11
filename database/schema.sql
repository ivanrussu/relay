CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY,
    description TEXT,
    webhook TEXT,
    api_key TEXT UNIQUE,
    client_id TEXT UNIQUE
);
