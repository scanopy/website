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
		text: 'text-pink-400',
		bg: 'bg-pink-900/50 border-pink-600',
		border: 'border-pink-600',
		icon: 'text-pink-400',
		ring: 'ring-pink-400',
		stroke: 'stroke-pink-400',
		rgb: 'rgb(244, 114, 182)'
	},
	rose: {
		string: 'rose',
		text: 'text-rose-400',
		bg: 'bg-rose-900/50 border-rose-600',
		border: 'border-rose-600',
		icon: 'text-rose-400',
		ring: 'ring-rose-400',
		stroke: 'stroke-rose-400',
		rgb: 'rgb(251, 113, 133)'
	},
	red: {
		string: 'red',
		text: 'text-red-400',
		bg: 'bg-red-900/50 border-red-600',
		border: 'border-red-600',
		icon: 'text-red-400',
		ring: 'ring-red-400',
		stroke: 'stroke-red-400',
		rgb: 'rgb(248, 113, 113)'
	},
	orange: {
		string: 'orange',
		text: 'text-orange-400',
		bg: 'bg-orange-900/50 border-orange-600',
		border: 'border-orange-600',
		icon: 'text-orange-400',
		ring: 'ring-orange-400',
		stroke: 'stroke-orange-400',
		rgb: 'rgb(251, 146, 60)'
	},
	yellow: {
		string: 'yellow',
		text: 'text-yellow-400',
		bg: 'bg-yellow-900/50 border-yellow-600',
		border: 'border-yellow-600',
		icon: 'text-yellow-400',
		ring: 'ring-yellow-400',
		stroke: 'stroke-yellow-400',
		rgb: 'rgb(250, 204, 21)'
	},
	green: {
		string: 'green',
		text: 'text-green-400',
		bg: 'bg-green-900/50 border-green-600',
		border: 'border-green-600',
		icon: 'text-green-400',
		ring: 'ring-green-400',
		stroke: 'stroke-green-400',
		rgb: 'rgb(74, 222, 128)'
	},
	emerald: {
		string: 'emerald',
		text: 'text-emerald-400',
		bg: 'bg-emerald-900/50 border-emerald-600',
		border: 'border-emerald-600',
		icon: 'text-emerald-400',
		ring: 'ring-emerald-400',
		stroke: 'stroke-emerald-400',
		rgb: 'rgb(52, 211, 153)'
	},
	teal: {
		string: 'teal',
		text: 'text-teal-400',
		bg: 'bg-teal-900/50 border-teal-600',
		border: 'border-teal-600',
		icon: 'text-teal-400',
		ring: 'ring-teal-400',
		stroke: 'stroke-teal-400',
		rgb: 'rgb(45, 212, 191)'
	},
	cyan: {
		string: 'cyan',
		text: 'text-cyan-400',
		bg: 'bg-cyan-900/50 border-cyan-600',
		border: 'border-cyan-600',
		icon: 'text-cyan-400',
		ring: 'ring-cyan-400',
		stroke: 'stroke-cyan-400',
		rgb: 'rgb(34, 211, 238)'
	},
	blue: {
		string: 'blue',
		text: 'text-blue-400',
		bg: 'bg-blue-900/50 border-blue-600',
		border: 'border-blue-600',
		icon: 'text-blue-400',
		ring: 'ring-blue-400',
		stroke: 'stroke-blue-400',
		rgb: 'rgb(96, 165, 250)'
	},
	indigo: {
		string: 'indigo',
		text: 'text-indigo-400',
		bg: 'bg-indigo-900/50 border-indigo-600',
		border: 'border-indigo-600',
		icon: 'text-indigo-400',
		ring: 'ring-indigo-400',
		stroke: 'stroke-indigo-400',
		rgb: 'rgb(129, 140, 248)'
	},
	purple: {
		string: 'purple',
		text: 'text-purple-400',
		bg: 'bg-purple-900/50 border-purple-600',
		border: 'border-purple-600',
		icon: 'text-purple-400',
		ring: 'ring-purple-400',
		stroke: 'stroke-purple-400',
		rgb: 'rgb(196, 181, 253)'
	},
	sky: {
		string: 'sky',
		text: 'text-sky-400',
		bg: 'bg-sky-900/50 border-sky-600',
		border: 'border-sky-600',
		icon: 'text-sky-400',
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
	const color = colorName && COLOR_MAP[colorName] ? colorName : 'gray';
	return COLOR_MAP[color];
}

export function createIconComponent(iconName: string | null): IconComponent {
	if (!iconName || iconName == null)
		return LucideIcons.HelpCircle as unknown as IconComponent;

	const componentName = iconName
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');

	const icons = LucideIcons as Record<string, unknown>;
	return (icons[componentName] || LucideIcons.HelpCircle) as IconComponent;
}
