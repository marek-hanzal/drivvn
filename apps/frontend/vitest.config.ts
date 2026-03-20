import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		react(),
	],
	test: {
		environment: "jsdom",
		globals: true,
		include: [
			"test/**/*.test.ts",
			"test/**/*.test.tsx",
		],
		setupFiles: [
			"./test/setup.ts",
		],
		passWithNoTests: true,
		isolate: false,
		sequence: {
			shuffle: false,
		},
		coverage: {
			enabled: false,
		},
		ui: false,
	},
});
