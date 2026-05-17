const MOODS = [
	{ emoji: "🚀", label: "Focused" },
	{ emoji: "🔥", label: "On fire" },
	{ emoji: "😊", label: "Good" },
	{ emoji: "⚡", label: "Energized" },
	{ emoji: "💡", label: "Inspired" },
	{ emoji: "😎", label: "Confident" },
	{ emoji: "🌊", label: "Flow" },
	{ emoji: "🤔", label: "Thinking" },
	{ emoji: "😴", label: "Tired" },
	{ emoji: "😤", label: "Frustrated" },
	{ emoji: "🐛", label: "Debugging" },
	{ emoji: "🎯", label: "Productive" },
] as const;

type Props = {
	value: string;
	onChange: (emoji: string) => void;
};

export function EmojiPicker({ value, onChange }: Props) {
	return (
		<fieldset className="border-0 p-0 m-0">
			<legend className="sr-only">Select a mood</legend>
			<div className="grid grid-cols-6 gap-2">
				{MOODS.map(({ emoji, label }) => (
					<button
						key={emoji}
						type="button"
						title={label}
						aria-label={label}
						aria-pressed={value === emoji}
						onClick={() => onChange(emoji)}
						className={`flex flex-col items-center gap-1 rounded-xl p-2 text-2xl transition-all ${
							value === emoji
								? "bg-indigo-100 ring-2 ring-indigo-400 dark:bg-indigo-900/40 dark:ring-indigo-500"
								: "hover:bg-slate-100 dark:hover:bg-slate-800"
						}`}
					>
						<span>{emoji}</span>
						<span className="text-[10px] leading-none text-slate-500 dark:text-slate-400">
							{label}
						</span>
					</button>
				))}
			</div>
		</fieldset>
	);
}
