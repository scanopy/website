import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { externalizeLinks } from '$lib/server/externalize-links';
import { vendors, vendorSources } from '$lib/fixtures/network-diagram-vendors';
import type { Vendor } from '$lib/types';
import {
	parseAlternativesSlug,
	ALT_VENDOR_SLUGS,
	selectAlternatives,
	altBlurb,
	buildAltTitle,
	buildAltMetaDescription,
	buildAltIntro,
	buildAltFaqs
} from '$lib/compare/alternatives-pages';
import { SCANOPY_SLUG, vendorDisplayName, vsSlug } from '$lib/compare/vs-pages';

export const prerender = true;

// Tell the static adapter exactly which `<vendor>-alternatives` pages exist so they
// prerender even if the crawler misses an internal link. ALT_VENDOR_SLUGS is the gated
// set (vendors with a full `versus` writeup).
export function entries() {
	return ALT_VENDOR_SLUGS.map((slug) => ({ slug: `${slug}-alternatives` }));
}

export async function load({ params }) {
	const vendorSlug = parseAlternativesSlug(params.slug);
	if (!vendorSlug) {
		error(404, 'Page not found');
	}

	const vendor = vendors[vendorSlug];
	if (!vendor || !vendor.versus) {
		error(404, 'Page not found');
	}

	const name = vendorDisplayName(vendor);
	const altSlugs = selectAlternatives(vendorSlug);

	// Listicle cards: Scanopy first, then the other competitors, each with a data-derived
	// blurb and a link to its head-to-head vs page (Scanopy links to the product).
	const alternatives = altSlugs.map((slug) => {
		const v = vendors[slug];
		const isScanopy = slug === SCANOPY_SLUG;
		return {
			slug,
			name: vendorDisplayName(v),
			href: v.href,
			blurb: altBlurb(v),
			isScanopy,
			vsHref: isScanopy ? null : vsSlug(slug)
		};
	});

	// "Alternatives compared" table: the target vendor as the baseline row, then every
	// featured alternative. Pass a trimmed vendor record (just these slugs) to the
	// VendorComparison inline table.
	const tableSlugs = [vendorSlug, ...altSlugs];
	const tableVendors: Record<string, Vendor> = {};
	for (const slug of tableSlugs) tableVendors[slug] = vendors[slug];

	// Citations: surface only the sources actually referenced by the table's [n] markers —
	// the columns that render refs in column orientation are discovery, services, pricing.
	const usedSourceIds = new Set<number>();
	for (const slug of tableSlugs) {
		const vd = vendors[slug];
		for (const r of vd.discoverySources || []) usedSourceIds.add(r.id);
		for (const r of vd.services.sources || []) usedSourceIds.add(r.id);
		for (const r of vd.pricing.sources || []) usedSourceIds.add(r.id);
	}
	const sources = vendorSources.filter((s) => usedSourceIds.has(s.id));

	// The hand-written Scanopy-vs-<vendor> prose anchors the page with unique analysis.
	// Off-site reference links open in a new tab; internal scanopy.net links stay same-tab.
	const versusHtml = externalizeLinks((await marked.parse(vendor.versus)) as string);

	return {
		vendorSlug,
		vendorName: name,
		vendorHref: vendor.href,
		title: buildAltTitle(vendor),
		description: buildAltMetaDescription(vendor),
		intro: buildAltIntro(vendor),
		alternatives,
		tableSlugs,
		tableVendors,
		versusHtml,
		faqs: buildAltFaqs(vendor),
		sources
	};
}
