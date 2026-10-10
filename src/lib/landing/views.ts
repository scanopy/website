import type { TopologyView } from './types';

/** Topology view screenshots in static/common, with light and dark variants of equal size. */
const VIEW_META: Record<TopologyView, { file: string; label: string; height: number; alt: string }> =
	{
		l2: {
			file: 'l2',
			label: 'Physical (L2)',
			height: 1779,
			alt: 'Scanopy Physical (L2) view showing switch ports, VLANs, and discovered links'
		},
		l3: {
			file: 'l3',
			label: 'Logical (L3)',
			height: 990,
			alt: 'Scanopy Logical (L3) view showing subnets and the hosts on each'
		},
		workloads: {
			file: 'wl',
			label: 'Workloads',
			height: 1216,
			alt: 'Scanopy Workloads view showing VMs and containers nested inside hypervisors and hosts'
		},
		application: {
			file: 'app',
			label: 'Applications',
			height: 1163,
			alt: 'Scanopy Application view showing services grouped by application'
		}
	};

export const VIEW_ORDER: TopologyView[] = ['l2', 'l3', 'workloads', 'application'];

export function viewImage(view: TopologyView, light: boolean) {
	const v = VIEW_META[view];
	const s = light ? '-light' : '';
	return {
		id: view,
		label: v.label,
		alt: v.alt,
		src: `/common/${v.file}${s}-1440w.webp`,
		srcset: `/common/${v.file}${s}-960w.webp 960w, /common/${v.file}${s}-1440w.webp 1440w, /common/${v.file}${s}-2400w.webp 2400w`,
		width: 1440,
		height: v.height
	};
}

/** A product screenshot in static/screenshots, light or dark to match the page theme. */
export function screenshotImage(name: string, width: number, light: boolean) {
	const base = `/screenshots/${name}-${light ? 'light' : 'dark'}`;
	const sizes = [800, 1200].filter((w) => w < width);
	return {
		src: `${base}.webp`,
		srcset: [...sizes.map((w) => `${base}-${w}w.webp ${w}w`), `${base}.webp ${width}w`].join(', ')
	};
}
