import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EmojiPicker } from "../components/EmojiPicker";
import { TagSelector } from "../components/TagSelector";
import { saveEntry } from "../lib/entries";

export const Route = createFileRoute("/")({ component: CheckInPage });

function CheckInPage() {
	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	const [emoji, setEmoji] = useState("");
	const [note, setNote] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [submitted, setSubmitted] = useState(false);

	const isValid = emoji !== "" && note.trim() !== "" && tags.length > 0;

	const mutation = useMutation({
		mutationFn: (input: { emoji: string; note: string; tags: string[] }) =>
			saveEntry({ data: input }),
		onSuccess: () => setSubmitted(true),
	});

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!isValid || mutation.isPending) return;
		mutation.mutate({ emoji, note, tags });
	}

	if (submitted) {
		return (
			<div className="flex flex-col items-center gap-4 py-16 text-center">
				<span className="text-6xl" aria-hidden="true">
					{emoji}
				</span>
				<h2 className="text-2xl font-semibold">Mood logged.</h2>
				<p className="text-slate-500 dark:text-slate-400">
					Come back tomorrow. You&apos;re doing great.
				</p>
				<button
					type="button"
					onClick={() => {
						setEmoji("");
						setNote("");
						setTags([]);
						setSubmitted(false);
					}}
					className="mt-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
				>
					Log another
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<p className="text-sm font-medium text-slate-500 dark:text-slate-400">
					{today}
				</p>
				<h1 className="mt-1 text-2xl font-bold">How are you feeling today?</h1>
				<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
					Commit your feelings. Push through the day.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Emoji picker */}
				<section className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
						Mood
					</p>
					<EmojiPicker value={emoji} onChange={setEmoji} />
				</section>

				{/* Note */}
				<section className="space-y-2">
					<label
						htmlFor="note"
						className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400"
					>
						One sentence
					</label>
					<textarea
						id="note"
						rows={2}
						maxLength={280}
						placeholder="What defined today for you?"
						value={note}
						onChange={(e) => setNote(e.target.value)}
						className="w-full resize-none rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-base placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
					/>
					<p className="text-right text-xs text-slate-400">{note.length}/280</p>
				</section>

				{/* Tag */}
				<section className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
						Tag
					</p>
					<TagSelector value={tags} onChange={setTags} />
				</section>

				{/* Submit */}
				<div className="space-y-2">
					<button
						type="submit"
						disabled={!isValid || mutation.isPending}
						className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-500 dark:hover:bg-indigo-400"
					>
						{mutation.isPending ? "Committing…" : "Commit your feelings →"}
					</button>
					{mutation.isError && (
						<p className="text-sm text-red-500 dark:text-red-400" role="alert">
							Something went wrong. Try again.
						</p>
					)}
				</div>
			</form>
		</div>
	);
}
