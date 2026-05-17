import { createClient } from "@libsql/client";

// ---------------------------------------------------------------------------
// Connection
// Local dev:    DATABASE_URL=file:./gitmood.db  (default — no setup needed)
// Production:   DATABASE_URL=libsql://your-db.turso.io  + DATABASE_AUTH_TOKEN
// ---------------------------------------------------------------------------

const url = process.env.DATABASE_URL ?? "file:./gitmood.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

export const db = createClient({
	url,
	...(authToken ? { authToken } : {}),
});

// ---------------------------------------------------------------------------
// Schema — call initDb() once before any query (idempotent)
// ---------------------------------------------------------------------------

export async function initDb(): Promise<void> {
	await db.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      emoji      TEXT    NOT NULL,
      note       TEXT    NOT NULL,
      tag        TEXT    NOT NULL DEFAULT '',
      created_at TEXT    NOT NULL DEFAULT (date('now')),
      UNIQUE (created_at)
    )
  `);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MoodEntry = {
	id: number;
	emoji: string;
	note: string;
	tag: string;
	created_at: string; // YYYY-MM-DD
};

export type NewMoodEntry = Omit<MoodEntry, "id">;
