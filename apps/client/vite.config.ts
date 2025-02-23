import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import { monorepoRootSync } from 'monorepo-root'
import { defineConfig, loadEnv } from 'vite'

const currentDir = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	let server: any

	if (process.env.NODE_ENV === 'development') {
		const rootPath = monorepoRootSync()!
		process.env = { ...process.env, ...loadEnv(mode, rootPath) }

		server = {
			port: process.env.VITE_PORT,
			proxy: {
				'/publicmedia': {
					target: `${process.env.VITE_DOMAIN_URL}`,
					changeOrigin: true,
					rewrite: (path: any) => path.replace(/^\/publicmedia/, ''),
				},
			},
		}
	}

	return {
		plugins: [react()],
		optimizeDeps: {
			include: ['@expedients/shared'],
		},
		build: {
			commonjsOptions: {
				include: [/shared/, /node_modules/],
			},
		},
		css: {
			modules: {
				scopeBehaviour: 'global',
			},
			preprocessorOptions: {
				sass: {},
				scss: {
					silenceDeprecations: ['legacy-js-api'],
					additionalData: `@use "${join(currentDir, './src/assets/styles/_variables.scss')}" as *;`,
				},
			},
		},
		server,
	}
})
