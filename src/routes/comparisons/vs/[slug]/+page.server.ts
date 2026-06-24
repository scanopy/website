import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { vendors, vendorSources } from '$lib/fixtures/network-diagram-vendors';
import {
	parseVsSlug,
	VS_VENDOR_SLUGS,
	SCANOPY_SLUG,
	vendorDisplayName,
	buildIntro,
	buildTakeaway,
	buildTitle,
	buildMetaDescription
} from '$lib/compare/vs-pages';

export const prerender = true;

// Tell the static adapter exactly which /comparisons/vs/<vendor> pages exist, so they
// prerender even if the crawler misses an internal link. The [slug] param is the vendor
// slug (auvik, netbox, ...), so we hand the adapter the vendor slugs directly.
export function entries() {
	return VS_VENDOR_SLUGS.map((slug) => ({ slug }));
}

export async function load({ params }) {
	const vendorSlug = parseVsSlug(params.slug);
	if (!vendorSlug) {
		error(404, 'Comparison not found');
	}

	const scanopy = vendors[SCANOPY_SLUG];
	const vendor = vendors[vendorSlug];
	if (!scanopy || !vendor) {
		error(404, 'Comparison not found');
	}

	const name = vendorDisplayName(vendor);
	const intro = buildIntro(vendor);
	const takeaway = buildTakeaway(vendor);
	const title = buildTitle(vendor);
	const description = buildMetaDescription(vendor);
	let versusHtml = vendor.versus ? ((await marked.parse(vendor.versus)) as string) : null;
	if (versusHtml) {
		// External (http) reference links open in a new tab.
		versusHtml = versusHtml.replace(
			/<a href="(https?:\/\/[^"]+)"/g,
			'<a href="$1" target="_blank" rel="noopener noreferrer"'
		);
	}

	// Only surface the citations actually referenced on this page (Scanopy + this vendor),
	// keeping the sources list tight and the [n] anchors resolvable.
	const usedSourceIds = new Set<number>();
	for (const v of [scanopy, vendor]) {
		for (const r of v.discoverySources || []) usedSourceIds.add(r.id);
		for (const r of v.services.sources || []) usedSourceIds.add(r.id);
		for (const r of v.viewTypesSources || []) usedSourceIds.add(r.id);
		for (const r of v.pricing.sources || []) usedSourceIds.add(r.id);
	}
	const sources = vendorSources.filter((s) => usedSourceIds.has(s.id));

	return {
		pageSlug: params.slug,
		scanopySlug: SCANOPY_SLUG,
		vendorSlug,
		scanopy,
		vendor,
		vendorName: name,
		title,
		description,
		intro,
		takeaway,
		versusHtml,
		sources
	};
}
