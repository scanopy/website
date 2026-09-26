import type { Vendor } from '$lib/types';
import { vendors } from '$lib/fixtures/network-diagram-vendors';
import { SCANOPY_SLUG, REVIEW_YEAR, vendorDisplayName, trimSentence, lowerFirst } from './vs-pages';

/**
 * Competitor-versus-competitor pages: `/comparisons/<a>-vs-<b>`.
 *
 * Distinct from `/comparisons/vs/<vendor>`, which is always Scanopy against one vendor.
 * These pages compare two other tools to each other, because GSC shows we already rank
 * for those queries (positions 8-21) on pages that answer a different question, and take
 * zero clicks from them.
 *
 * Every pair below is a query with measured impressions in the 28 days to 2026-09-15.
 * The direction is the one with more impressions where both directions appear; one page
 * serves both, since Google matches either ordering.
 *
 * Editorial rules for these pages, which differ from the Scanopy-vs pages:
 *  - The prose compares A and B on platform mechanics only. No judgment about which is
 *    better, in either direction. We are an interested party and the disclosure says so.
 *  - Scanopy appears as a third table column, the same way it appears on the alternatives
 *    pages, and nowhere in the A-vs-B prose.
 */
export const PAIRS: ReadonlyArray<readonly [string, string]> = [
	['opennms', 'librenms'],
	['opennms', 'prtg'],
	['zabbix', 'librenms'],
	['netbox', 'phpipam'],
	['observium', 'prtg'],
	['librenms', 'prtg'],
	['librenms', 'observium'],
	['manageengine-opmanager', 'prtg']
] as const;

/** Route slug for a pair: `<a>-vs-<b>`. No vendor slug contains `-vs-`, so the split is
 *  unambiguous. */
export function pairSlug(a: string, b: string): string {
	return `${a}-vs-${b}`;
}

/** Path for a pair page. */
export function pairHref(a: string, b: string): string {
	return `/comparisons/${pairSlug(a, b)}`;
}

/** All generated pair slugs, for `entries()` and for internal linking. */
export function allPairSlugs(): string[] {
	return PAIRS.map(([a, b]) => pairSlug(a, b));
}

/**
 * Validate a `/comparisons/[slug=pair]` route param. Returns the two vendor slugs, or
 * null when the slug is not one of the generated pairs. Only exact matches from PAIRS
 * resolve, so a reversed or invented pairing 404s rather than generating a thin page.
 */
export function parsePairSlug(slug: string): { a: string; b: string } | null {
	const match = PAIRS.find(([a, b]) => pairSlug(a, b) === slug);
	if (!match) return null;
	const [a, b] = match;
	if (!vendors[a] || !vendors[b]) return null;
	return { a, b };
}

/** Page title. Keyword first, since the query is literally "<a> vs <b>". */
export function buildPairTitle(a: Vendor, b: Vendor): string {
	return `${a.name} vs ${b.name} (${REVIEW_YEAR}): Discovery, Views, and Licensing`;
}

/** Meta description: what the page actually contains, no pitch. */
export function buildPairMetaDescription(a: Vendor, b: Vendor): string {
	return `How ${a.name} and ${b.name} compare on discovery protocols, the topology views they produce, licensing, and pricing. Sourced from vendor documentation.`;
}

/**
 * Data-derived intro built from each vendor's own structured fields, so no pair carries
 * hand-written comparative prose that could drift into judgment. Reads the same shape as
 * the Scanopy-vs intro but never names Scanopy.
 */
export function buildPairIntro(a: Vendor, b: Vendor): string {
	const aName = vendorDisplayName(a);
	const bName = vendorDisplayName(b);
	const parts: string[] = [];

	if (a.bestFor && b.bestFor) {
		parts.push(
			`${aName} is for ${lowerFirst(trimSentence(a.bestFor))}. ${bName} is for ${lowerFirst(
				trimSentence(b.bestFor)
			)}.`
		);
	}

	parts.push(
		`The table below sets them side by side on the protocols each uses to discover a network, the topology views each produces, licensing, and pricing.`
	);

	return parts.join(' ');
}

/**
 * Per-vendor "where it fits" lines, taken from each vendor's own fixture entry rather
 * than written per pair. Returns null for a vendor with no `whereItFits`, so the section
 * renders only when both halves have something factual to say.
 */
export function buildPairFit(
	a: Vendor,
	b: Vendor
): { a: string; b: string } | null {
	if (!a.whereItFits || !b.whereItFits) return null;
	return {
		a: trimSentence(a.whereItFits) + '.',
		b: trimSentence(b.whereItFits) + '.'
	};
}

/** The three vendors rendered in the comparison table, in column order. Scanopy last,
 *  matching how the alternatives pages place it. */
export function pairTableSlugs(a: string, b: string): string[] {
	return [a, b, SCANOPY_SLUG];
}
