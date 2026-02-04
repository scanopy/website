import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: ''
		},
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore /docs links - handled by separate Astro site
				if (path.startsWith('/docs')) {
					return;
				}
				// Ignore missing gallery images - these are placeholders for community submissions
				if (path.startsWith('/gallery/')) {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
