import { fileURLToPath } from "node:url";
import { defineNitroConfig } from "nitro/config";

/**
 * Newer nitro version runs through vite, but here I've working
 * setup still using nitro's config.
 */
export default defineNitroConfig({
	alias: {
		"~": fileURLToPath(new URL("./src", import.meta.url)),
	},
	compatibilityDate: "latest",
	preset: "vercel",
	serverDir: "src",
	serverEntry: "./src/server.ts",
});
