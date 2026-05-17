import { Database } from 'bun:sqlite'
import { join } from 'node:path'

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------

const DB_PATH = join(process.cwd(), 'gitmood.db')

export const db = new Database(DB_PATH, { create: true })

// Performance pragmas — set once at startup
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')
db.exec('PRAGMA synchronous = NORMAL')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MoodEntry = {
  id: number
  emoji: string
  note: string
  tag: string
  created_at: string // YYYY-MM-DD
}

export type NewMoodEntry = Omit<MoodEntry, 'id'>

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    emoji      TEXT    NOT NULL,
    note       TEXT    NOT NULL,
    tag        TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (date('now')),
    UNIQUE (created_at)
  )
`)
