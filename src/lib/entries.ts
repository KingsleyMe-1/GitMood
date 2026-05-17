import { createServerFn } from "@tanstack/react-start";
import type { MoodEntry } from "./db";
import { db, initDb } from "./db";

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

type SaveEntryInput = {
	emoji: string;
	note: string;
	tags: string[];
};

type MonthInput = {
	year: number;
	month: number;
};

// ---------------------------------------------------------------------------
// Day 5 — Save a new check-in
// One entry per day enforced by the UNIQUE (created_at) DB constraint.
// Multiple tags are stored as a comma-separated string in the `tag` column.
// ---------------------------------------------------------------------------

export const saveEntry = createServerFn({ method: "POST" })
	.inputValidator((input: SaveEntryInput) => input)
	.handler(async ({ data }) => {
		await initDb();
		await db.execute({
			sql: `INSERT OR IGNORE INTO entries (emoji, note, tag, created_at)
            VALUES (?, ?, ?, date('now'))`,
			args: [data.emoji, data.note, data.tags.join(",")],
		});
	});

// ---------------------------------------------------------------------------
// Day 6 — Fetch all entries, newest first
// ---------------------------------------------------------------------------

export const fetchAllEntries = createServerFn({ method: "GET" }).handler(
	async () => {
		await initDb();
		const result = await db.execute(
			"SELECT * FROM entries ORDER BY created_at DESC",
		);
		return result.rows as unknown as MoodEntry[];
	},
);

// ---------------------------------------------------------------------------
// Day 6 — Fetch entries for a specific year + month
// Used by the monthly heatmap route (Day 12).
// ---------------------------------------------------------------------------

export const fetchEntriesByMonth = createServerFn({ method: "GET" })
	.inputValidator((input: MonthInput) => input)
	.handler(async ({ data }) => {
		await initDb();
		const pad = (n: number) => String(n).padStart(2, "0");
		const prefix = `${data.year}-${pad(data.month)}`;
		const result = await db.execute({
			sql: "SELECT * FROM entries WHERE created_at LIKE ? ORDER BY created_at ASC",
			args: [`${prefix}-%`],
		});
		return result.rows as unknown as MoodEntry[];
	});
