/**
 * Seed script — run once to populate gitmood.db with realistic dev entries.
 * Usage: bun src/lib/seed.ts
 */
import { db } from './db'
import type { NewMoodEntry } from './db'

const EMOJIS = ['😊', '🤔', '😤', '🚀', '😴', '🔥', '💡', '🌊', '😎', '⚡', '🐛', '🎯']

const SEEDS: NewMoodEntry[] = [
  // 3 weeks back
  { emoji: '🚀', note: 'Hit a great flow state, knocked out three features before lunch.', tag: '#deepwork', created_at: daysAgo(20) },
  { emoji: '🤔', note: 'Spent most of the day reading RFC docs trying to understand the new auth spec.', tag: '#learning', created_at: daysAgo(19) },
  { emoji: '😤', note: 'Blocked on a flaky CI pipeline for four hours. Not fun.', tag: '#blocked', created_at: daysAgo(18) },
  { emoji: '🔥', note: 'Finally fixed that race condition that has been haunting me for a week.', tag: '#debugging', created_at: daysAgo(17) },
  { emoji: '😎', note: 'Code review day. Left detailed feedback on five PRs. Felt useful.', tag: '#reviewing', created_at: daysAgo(16) },

  // 2 weeks back
  { emoji: '💡', note: 'Had a breakthrough idea for the heatmap layout during morning coffee.', tag: '#planning', created_at: daysAgo(14) },
  { emoji: '😴', note: 'Low energy day. Meetings back to back. Barely wrote 20 lines.', tag: '#meetings', created_at: daysAgo(13) },
  { emoji: '⚡', note: 'Refactored the query layer — everything is faster and cleaner now.', tag: '#refactor', created_at: daysAgo(12) },
  { emoji: '🐛', note: 'Chased a null reference bug across three files. Found it. Fixed it.', tag: '#debugging', created_at: daysAgo(11) },
  { emoji: '🎯', note: 'Shipped the timeline feature. Small win but it feels great.', tag: '#shipping', created_at: daysAgo(10) },

  // 1 week back
  { emoji: '🌊', note: 'Calm, steady day. Cleared the backlog and wrote tests. Solid.', tag: '#deepwork', created_at: daysAgo(7) },
  { emoji: '🤔', note: 'Architecture meeting. Lots of debate, no clear outcome yet.', tag: '#planning', created_at: daysAgo(6) },
  { emoji: '🚀', note: 'Pair programming session with a senior dev — learned a ton.', tag: '#learning', created_at: daysAgo(5) },
  { emoji: '😊', note: 'Relaxed day, wrapped up docs and cleaned up old branches.', tag: '#refactor', created_at: daysAgo(4) },
  { emoji: '🔥', note: 'Demo day. Presented to stakeholders. It went really well.', tag: '#shipping', created_at: daysAgo(3) },

  // Last 2 days
  { emoji: '😤', note: 'Dependency upgrade broke half the test suite. Still fixing it.', tag: '#blocked', created_at: daysAgo(2) },
  { emoji: '💡', note: 'Got unblocked — the issue was a peer dep mismatch. Fixed cleanly.', tag: '#debugging', created_at: daysAgo(1) },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

const insert = db.prepare(`
  INSERT OR IGNORE INTO entries (emoji, note, tag, created_at)
  VALUES ($emoji, $note, $tag, $created_at)
`)

const insertMany = db.transaction((entries: NewMoodEntry[]) => {
  for (const entry of entries) {
    insert.run({
      $emoji: entry.emoji,
      $note: entry.note,
      $tag: entry.tag,
      $created_at: entry.created_at,
    })
  }
})

insertMany(SEEDS)

const count = (db.query('SELECT COUNT(*) as count FROM entries').get() as { count: number }).count
console.log(`✓ Seeded ${count} entries into gitmood.db`)
