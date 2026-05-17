import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "GitMood — Commit your feelings." },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
	component: RootLayout,
});

// Minified to avoid layout shift — runs before React hydrates
const darkModeScript = `(function(){try{var t=localStorage.getItem('gitmood-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

function SunIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
		</svg>
	);
}

function MoonIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	);
}

function DarkModeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	function toggle() {
		const next = !isDark;
		setIsDark(next);
		if (next) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("gitmood-theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("gitmood-theme", "light");
		}
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
		>
			{isDark ? <SunIcon /> : <MoonIcon />}
		</button>
	);
}

function RootLayout() {
	return (
		<div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
			<header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
				<div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
					<div className="flex items-center gap-2">
						<span aria-hidden="true" className="text-xl">
							🌊
						</span>
						<span className="font-semibold tracking-tight">GitMood</span>
					</div>
					<DarkModeToggle />
				</div>
			</header>
			<main className="mx-auto max-w-2xl px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
				{/* Prevents dark-mode flash before React hydrates */}
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: intentional theme init script
					dangerouslySetInnerHTML={{ __html: darkModeScript }}
				/>
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
