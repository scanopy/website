import { error } from '@sveltejs/kit';
import { vendors, vendorSources, disclosureText } from '$lib/fixtures/network-diagram-vendors';
import { vendorDisplayName } from '$lib/compare/vs-pages';
import {
	parsePairSlug,
	allPairSlugs,
	pairTableSlugs,
	buildPairTitle,
	buildPairMetaDescription,
	buildPairIntro,
	buildPairFit
} from '$lib/compare/pair-pages';
import type { Vendor } from '$lib/types';

export const prerender = true;

// Hand the static adapter every generated pair slug, so the pages prerender even if the
// crawler misses an internal link.
export function entries() {
	return allPairSlugs().map((slug) => ({ slug }));
}

export function load({ params }) {
	const pair = parsePairSlug(params.slug);
	if (!pair) {
		error(404, 'Comparison not found');
	}

	const a = vendors[pair.a];
	const b = vendors[pair.b];
	if (!a || !b) {
		error(404, 'Comparison not found');
	}

	// Table columns: the two compared tools, then Scanopy, matching how the alternatives
	// pages place it. The disclosure names us as an interested party.
	const tableSlugs = pairTableSlugs(pair.a, pair.b);
	const tableVendors: Record<string, Vendor> = {};
	for (const slug of tableSlugs) tableVendors[slug] = vendors[slug];

	// Only cite sources the table's [n] markers actually resolve to.
	const usedSourceIds = new Set<number>();
	for (const slug of tableSlugs) {
		const v = vendors[slug];
		for (const r of v.discoverySources || []) usedSourceIds.add(r.id);
		for (const r of v.services.sources || []) usedSourceIds.add(r.id);
		for (const r of v.viewTypesSources || []) usedSourceIds.add(r.id);
		for (const r of v.pricing.sources || []) usedSourceIds.add(r.id);
	}
	const sources = vendorSources.filter((s) => usedSourceIds.has(s.id));

	return {
		pageSlug: params.slug,
		aSlug: pair.a,
		bSlug: pair.b,
		a,
		b,
		aName: vendorDisplayName(a),
		bName: vendorDisplayName(b),
		title: buildPairTitle(a, b),
		description: buildPairMetaDescription(a, b),
		intro: buildPairIntro(a, b),
		fit: buildPairFit(a, b),
		tableSlugs,
		tableVendors,
		disclosureText,
		sources
	};
}
