import { useState } from "react";

const PRESET_TAGS = [
	"#deepwork",
	"#onfire",
	"#blocked",
	"#debugging",
	"#reviewing",
	"#planning",
	"#shipping",
	"#learning",
	"#meetings",
	"#refactor",
] as const;

type Props = {
	value: string[];
	onChange: (tags: string[]) => void;
};

export function TagSelector({ value, onChange }: Props) {
	const [custom, setCustom] = useState("");

	function toggleTag(tag: string) {
		if (value.includes(tag)) {
			onChange(value.filter((t) => t !== tag));
		} else {
			onChange([...value, tag]);
		}
	}

	function submitCustom() {
		const trimmed = custom.trim();
		if (!trimmed) return;
		const tag = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
		toggleTag(tag);
		setCustom("");
	}

	return (
		<div className="space-y-3">
			<fieldset className="border-0 m-0 p-0">
				<legend className="sr-only">Select tags</legend>
				<div className="flex flex-wrap gap-2">
					{PRESET_TAGS.map((tag) => (
						<button
							key={tag}
							type="button"
							aria-pressed={value.includes(tag)}
							onClick={() => toggleTag(tag)}
							className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
								value.includes(tag)
									? "bg-indigo-600 text-white dark:bg-indigo-500"
									: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
							}`}
						>
							{tag}
						</button>
					))}
				</div>
			</fieldset>

			<div className="mt-4 flex gap-2">
				<input
					type="text"
					value={custom}
					placeholder="Custom tag…"
					aria-label="Custom tag"
					onChange={(e) => setCustom(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							submitCustom();
						}
					}}
					className="flex-1 rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
				/>
				<button
					type="button"
					onClick={submitCustom}
					className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Add
				</button>
			</div>
		</div>
	);
}
