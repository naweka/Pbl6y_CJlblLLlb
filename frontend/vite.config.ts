import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-eslint2";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [
		react(),
		checker({
			exclude: ["node_modules", "virtual:", "dist"],
			include: ["src/**/*.{ts,tsx}"],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
