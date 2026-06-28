import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

// Theme-aware color: resolves to a CSS variable holding space-separated RGB
// channels, so Tailwind's opacity modifiers (e.g. bg-gray-800/70) keep working.
// The channel values flip between light (:root) and dark (html.dark) in app.css.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Primary text / headings. Flips to near-black slate in light mode.
				white: v('white'),
				// Fixed white that never flips — use on accent buttons, logo tiles,
				// and badges layered over imagery.
				paper: '#ffffff',
				// Full neutral ramp. The dark ramp position-mirrors onto a slate-tinted
				// light ramp, so backgrounds and text both invert correctly.
				gray: {
					50: v('gray-50'),
					100: v('gray-100'),
					200: v('gray-200'),
					300: v('gray-300'),
					400: v('gray-400'),
					500: v('gray-500'),
					600: v('gray-600'),
					700: v('gray-700'),
					800: v('gray-800'),
					900: v('gray-900'),
					950: v('gray-950')
				},
				// Light-tint accent shades darken in light mode for contrast on white;
				// darker shades (used as fills/borders) stay at Tailwind defaults.
				blue: {
					...colors.blue,
					300: v('blue-300'),
					400: v('blue-400'),
					500: v('blue-500')
				},
				green: { ...colors.green, 400: v('green-400') },
				emerald: { ...colors.emerald, 400: v('emerald-400') },
				red: { ...colors.red, 400: v('red-400') },
				yellow: { ...colors.yellow, 400: v('yellow-400') },
				rose: { ...colors.rose, 400: v('rose-400') },
				primary: {
					50: '#eff6ff',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					900: '#1e3a8a'
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
