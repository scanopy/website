import { vendors, vendorSources } from '$lib/fixtures/network-diagram-vendors';
import type { Vendor } from '$lib/types';
import { SCANOPY_SLUG, vsSlug, vendorDisplayName } from '$lib/compare/vs-pages';
import {
	scanopyAlternativeSlugs,
	scanopyEdge,
	altBlurb,
	buildScanopyAltFaqs,
	SCANOPY_ALT_TITLE,
	SCANOPY_ALT_DESCRIPTION,
	SCANOPY_ALT_INTRO
} from '$lib/compare/alternatives-pages';

export const prerender = true;

export function load() {
	const slugs = scanopyAlternativeSlugs();

	// One card per competitor: what it's for (blurb), where Scanopy differs (edge), and a
	// link to the head-to-head vs page.
	const alternatives = slugs.map((slug) => {
		const v = vendors[slug];
		return {
			slug,
			name: vendorDisplayName(v),
			href: v.href,
			blurb: altBlurb(v),
			edge: scanopyEdge(v),
			vsHref: vsSlug(slug)
		};
	});

	// "At a glance" table: Scanopy as the baseline, then every alternative.
	const tableSlugs = [SCANOPY_SLUG, ...slugs];
	const tableVendors: Record<string, Vendor> = {};
	for (const slug of tableSlugs) tableVendors[slug] = vendors[slug];

	// Citations: surface only the sources referenced by the table's [n] markers; the
	// columns that render refs in column orientation are discovery, services, pricing.
	const usedSourceIds = new Set<number>();
	for (const slug of tableSlugs) {
		const vd = vendors[slug];
		for (const r of vd.discoverySources || []) usedSourceIds.add(r.id);
		for (const r of vd.services.sources || []) usedSourceIds.add(r.id);
		for (const r of vd.pricing.sources || []) usedSourceIds.add(r.id);
	}
	const sources = vendorSources.filter((s) => usedSourceIds.has(s.id));

	return {
		title: SCANOPY_ALT_TITLE,
		description: SCANOPY_ALT_DESCRIPTION,
		intro: SCANOPY_ALT_INTRO,
		alternatives,
		tableSlugs,
		tableVendors,
		faqs: buildScanopyAltFaqs(),
		sources
	};
}
