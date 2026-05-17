import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		nitro({
			// Use Vercel output format when deploying — auto-detected via VERCEL env var
			preset: process.env.VERCEL ? "vercel" : undefined,
			rollupConfig: {
				// Externalize @libsql to prevent Rollup bundling native binaries
				external: [/^@sentry\//, /^@libsql\//],
			},
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
