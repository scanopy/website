import * as LucideIcons from 'lucide-svelte';
import type { Component } from 'svelte';

export type IconComponent = Component<{ class?: string }>;

export interface ColorStyle {
	text: string;
	bg: string;
	border: string;
	icon: string;
	ring: string;
	stroke: string;
	string: string;
	rgb: string;
}

export const COLOR_MAP: Record<string, ColorStyle> = {
	pink: {
		string: 'pink',
		text: 'text-pink-700 dark:text-pink-400',
		bg: 'bg-pink-100 border-pink-300 dark:bg-pink-900/50 dark:border-pink-600',
		border: 'border-pink-600',
		icon: 'text-pink-600 dark:text-pink-400',
		ring: 'ring-pink-400',
		stroke: 'stroke-pink-400',
		rgb: 'rgb(244, 114, 182)'
	},
	rose: {
		string: 'rose',
		text: 'text-rose-700 dark:text-rose-400',
		bg: 'bg-rose-100 border-rose-300 dark:bg-rose-900/50 dark:border-rose-600',
		border: 'border-rose-600',
		icon: 'text-rose-600 dark:text-rose-400',
		ring: 'ring-rose-400',
		stroke: 'stroke-rose-400',
		rgb: 'rgb(251, 113, 133)'
	},
	red: {
		string: 'red',
		text: 'text-red-700 dark:text-red-400',
		bg: 'bg-red-100 border-red-300 dark:bg-red-900/50 dark:border-red-600',
		border: 'border-red-600',
		icon: 'text-red-600 dark:text-red-400',
		ring: 'ring-red-400',
		stroke: 'stroke-red-400',
		rgb: 'rgb(248, 113, 113)'
	},
	orange: {
		string: 'orange',
		text: 'text-orange-700 dark:text-orange-400',
		bg: 'bg-orange-100 border-orange-300 dark:bg-orange-900/50 dark:border-orange-600',
		border: 'border-orange-600',
		icon: 'text-orange-600 dark:text-orange-400',
		ring: 'ring-orange-400',
		stroke: 'stroke-orange-400',
		rgb: 'rgb(251, 146, 60)'
	},
	amber: {
		string: 'amber',
		text: 'text-amber-700 dark:text-amber-400',
		bg: 'bg-amber-100 border-amber-300 dark:bg-amber-900/50 dark:border-amber-600',
		border: 'border-amber-600',
		icon: 'text-amber-600 dark:text-amber-400',
		ring: 'ring-amber-400',
		stroke: 'stroke-amber-400',
		rgb: 'rgb(251, 191, 36)'
	},
	yellow: {
		string: 'yellow',
		text: 'text-yellow-700 dark:text-yellow-400',
		bg: 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-600',
		border: 'border-yellow-600',
		icon: 'text-yellow-600 dark:text-yellow-400',
		ring: 'ring-yellow-400',
		stroke: 'stroke-yellow-400',
		rgb: 'rgb(250, 204, 21)'
	},
	green: {
		string: 'green',
		text: 'text-green-700 dark:text-green-400',
		bg: 'bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-600',
		border: 'border-green-600',
		icon: 'text-green-600 dark:text-green-400',
		ring: 'ring-green-400',
		stroke: 'stroke-green-400',
		rgb: 'rgb(74, 222, 128)'
	},
	emerald: {
		string: 'emerald',
		text: 'text-emerald-700 dark:text-emerald-400',
		bg: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/50 dark:border-emerald-600',
		border: 'border-emerald-600',
		icon: 'text-emerald-600 dark:text-emerald-400',
		ring: 'ring-emerald-400',
		stroke: 'stroke-emerald-400',
		rgb: 'rgb(52, 211, 153)'
	},
	teal: {
		string: 'teal',
		text: 'text-teal-700 dark:text-teal-400',
		bg: 'bg-teal-100 border-teal-300 dark:bg-teal-900/50 dark:border-teal-600',
		border: 'border-teal-600',
		icon: 'text-teal-600 dark:text-teal-400',
		ring: 'ring-teal-400',
		stroke: 'stroke-teal-400',
		rgb: 'rgb(45, 212, 191)'
	},
	cyan: {
		string: 'cyan',
		text: 'text-cyan-700 dark:text-cyan-400',
		bg: 'bg-cyan-100 border-cyan-300 dark:bg-cyan-900/50 dark:border-cyan-600',
		border: 'border-cyan-600',
		icon: 'text-cyan-600 dark:text-cyan-400',
		ring: 'ring-cyan-400',
		stroke: 'stroke-cyan-400',
		rgb: 'rgb(34, 211, 238)'
	},
	blue: {
		string: 'blue',
		text: 'text-blue-700 dark:text-blue-400',
		bg: 'bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-600',
		border: 'border-blue-600',
		icon: 'text-blue-600 dark:text-blue-400',
		ring: 'ring-blue-400',
		stroke: 'stroke-blue-400',
		rgb: 'rgb(96, 165, 250)'
	},
	indigo: {
		string: 'indigo',
		text: 'text-indigo-700 dark:text-indigo-400',
		bg: 'bg-indigo-100 border-indigo-300 dark:bg-indigo-900/50 dark:border-indigo-600',
		border: 'border-indigo-600',
		icon: 'text-indigo-600 dark:text-indigo-400',
		ring: 'ring-indigo-400',
		stroke: 'stroke-indigo-400',
		rgb: 'rgb(129, 140, 248)'
	},
	purple: {
		string: 'purple',
		text: 'text-purple-700 dark:text-purple-400',
		bg: 'bg-purple-100 border-purple-300 dark:bg-purple-900/50 dark:border-purple-600',
		border: 'border-purple-600',
		icon: 'text-purple-600 dark:text-purple-400',
		ring: 'ring-purple-400',
		stroke: 'stroke-purple-400',
		rgb: 'rgb(196, 181, 253)'
	},
	sky: {
		string: 'sky',
		text: 'text-sky-700 dark:text-sky-400',
		bg: 'bg-sky-100 border-sky-300 dark:bg-sky-900/50 dark:border-sky-600',
		border: 'border-sky-600',
		icon: 'text-sky-600 dark:text-sky-400',
		ring: 'ring-sky-400',
		stroke: 'stroke-sky-400',
		rgb: 'rgb(56, 189, 248)'
	},
	gray: {
		string: 'gray',
		text: 'text-gray-400',
		bg: 'bg-gray-900/50 border-gray-600',
		border: 'border-gray-600',
		icon: 'text-gray-400',
		ring: 'ring-gray-400',
		stroke: 'stroke-gray-400',
		rgb: 'rgb(156, 163, 175)'
	}
};

export function createColorHelper(colorName: string | null): ColorStyle {
	const normalizedName = colorName?.toLowerCase() ?? null;
	const color = normalizedName && COLOR_MAP[normalizedName] ? normalizedName : 'gray';
	return COLOR_MAP[color];
}

export function createIconComponent(iconName: string | null): IconComponent {
	if (!iconName || iconName == null) return LucideIcons.HelpCircle as unknown as IconComponent;

	const componentName = iconName
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');

	const icons = LucideIcons as Record<string, unknown>;
	return (icons[componentName] || LucideIcons.HelpCircle) as IconComponent;
}
