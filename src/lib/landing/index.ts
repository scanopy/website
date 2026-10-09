import { productPages } from './product-pages';
import { solutionPages } from './solutions';
import type { LandingPage, ListedPage } from './types';

export { productPages, solutionPages };
export type { LandingPage, ListedPage } from './types';

/** Solution pages with a bespoke route instead of the template. Listed everywhere the template pages are. */
const bespokeSolutions: ListedPage[] = [
	{
		slug: 'compliance',
		navLabel: 'Compliance',
		navBlurb: 'Audit evidence for NIS2, ISO 27001, HIPAA, and CMMC',
		related: ['device-inventory', 'snapshots', 'sharing-and-exports']
	}
];

/** Product pages that predate the template and live at their own top-level routes. */
const otherProductLinks = [
	{
		href: '/integrations',
		label: 'Integrations',
		blurb: 'SNMP, Docker, UniFi, and the other sources discovery reads'
	},
	{ href: '/services', label: 'Discoverable services', blurb: 'Every service type Scanopy detects' }
];

export interface NavLink {
	href: string;
	label: string;
	blurb: string;
}

export const productNav: NavLink[] = [
	...productPages.map((p) => ({
		href: `/product/${p.slug}`,
		label: p.navLabel,
		blurb: p.navBlurb
	})),
	...otherProductLinks
];

const allSolutions: ListedPage[] = [...bespokeSolutions, ...solutionPages];

// Fail the build on a related slug that names no product page, instead of dropping the link.
for (const p of [...allSolutions, ...productPages]) {
	for (const slug of p.related) {
		if (!productPages.some((pp) => pp.slug === slug)) {
			throw new Error(`"${p.slug}" lists unknown product page "${slug}" in related`);
		}
	}
}

export const solutionNav: NavLink[] = allSolutions.map((s) => ({
	href: `/solutions/${s.slug}`,
	label: s.navLabel,
	blurb: s.navBlurb
}));

export function getProductPage(slug: string): LandingPage | undefined {
	return productPages.find((p) => p.slug === slug);
}

export function getSolutionPage(slug: string): LandingPage | undefined {
	return solutionPages.find((p) => p.slug === slug);
}

function productCard(slug: string): NavLink {
	const p = getProductPage(slug);
	if (!p) throw new Error(`Unknown product page "${slug}" in a related list`);
	return { href: `/product/${p.slug}`, label: p.navLabel, blurb: p.navBlurb };
}

/** The product pages a page links to. */
export function builtOnCards(page: { related: string[] }): NavLink[] {
	return page.related.map(productCard);
}

/** The solutions that list this product page in `related`. */
export function usedByCards(productSlug: string): NavLink[] {
	return allSolutions
		.filter((s) => s.related.includes(productSlug))
		.map((s) => ({ href: `/solutions/${s.slug}`, label: s.navLabel, blurb: s.navBlurb }));
}
