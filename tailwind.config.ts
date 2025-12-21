import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#eff6ff',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					900: '#1e3a8a'
				},
				gray: {
					800: '#1f2937',
					900: '#111827'
				},
				rose: {
					400: '#fb7185',
					500: '#f43f5e',
					600: '#e11d48'
				},
				success: '#10b981',
				warning: '#f59e0b',
				error: '#ef4444'
			},
			fontFamily: {
				sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				mono: ['Monaco', 'Consolas', 'Liberation Mono', 'monospace']
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
} satisfies Config;
