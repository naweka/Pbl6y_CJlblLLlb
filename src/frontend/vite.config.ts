import path from 'path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import tsconfigPath from 'vite-plugin-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react(), tsconfigPath(), checker({ typescript: true })],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
