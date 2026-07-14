import type { Vendor, VendorFAQ } from '$lib/types';
import { vendors, tableCategories } from '$lib/fixtures/network-diagram-vendors';
import {
	VS_VENDOR_SLUGS,
	SCANOPY_SLUG,
	SCANOPY_CLAIMS,
	REVIEW_YEAR,
	vendorDisplayName,
	trimSentence,
	lowerFirst
} from '$lib/compare/vs-pages';

const ALT_SUFFIX = '-alternatives';

// Vendors that get a dedicated "Best <Vendor> Alternatives" page. THIS IS THE
// THIN-CONTENT GATE: a page only ships for a vendor with a full hand-written `versus`
// writeup, so every alternatives page is anchored by a substantial block of unique,
// vendor-specific analysis (rendered in the "Why Scanopy" section). A vendor added later
// without a `versus` writeup gets no page rather than a thin, name-swapped one.
export const ALT_VENDOR_SLUGS: string[] = VS_VENDOR_SLUGS.filter(
	(slug) => !!vendors[slug]?.versus?.trim()
);

/** Route path for a vendor's alternatives page: `/comparisons/<vendor>-alternatives`. */
export function altSlug(vendorSlug: string): string {
	return `/comparisons/${vendorSlug}${ALT_SUFFIX}`;
}

/** Validate a `/comparisons/[slug=alternatives]` route param, returning the vendor slug
 *  (e.g. `netbox-alternatives` -> `netbox`) or null when it isn't a known alternatives page. */
export function parseAlternativesSlug(param: string): string | null {
	if (!param.endsWith(ALT_SUFFIX)) return null;
	const vendorSlug = param.slice(0, -ALT_SUFFIX.length);
	return ALT_VENDOR_SLUGS.includes(vendorSlug) ? vendorSlug : null;
}

export function allAltPageSlugs(): string[] {
	return ALT_VENDOR_SLUGS.map(altSlug);
}

/** Which table category a vendor sits in (dedicated / monitoring / discovery / manual). */
function categoryOf(slug: string): string | null {
	for (const cat of tableCategories) {
		if (cat.vendors.includes(slug)) return cat.id;
	}
	return null;
}

/**
 * Ordered vendor slugs to feature on a target's alternatives page: Scanopy first (the
 * recommended pick), then the other real competitors, with tools in the SAME category as
 * the target surfaced ahead of the rest so the most relevant alternatives lead the list.
 * Excludes the target itself; the pool is VS_VENDOR_SLUGS (real head-to-head competitors,
 * already filtered to exclude manual/CLI-only tools).
 */
export function selectAlternatives(targetSlug: string): string[] {
	const targetCat = categoryOf(targetSlug);
	const others = VS_VENDOR_SLUGS.filter((s) => s !== targetSlug);
	const sameCat = others.filter((s) => categoryOf(s) === targetCat);
	const rest = others.filter((s) => categoryOf(s) !== targetCat);
	return [SCANOPY_SLUG, ...sameCat, ...rest];
}

function joinList(items: string[]): string {
	if (items.length <= 1) return items.join('');
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/** Strip parenthetical asides, then return the first sentence. Used to lift a tight,
 *  one-line "main limitation" out of a vendor's longer tradeOff prose. */
function firstSentence(text: string): string {
	const cleaned = text
		.replace(/\([^)]*\)/g, '')
		.replace(/\s+([.,;:])/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
	const match = cleaned.match(/^(.*?[.!?])(\s|$)/);
	return (match ? match[1] : cleaned).replace(/[.\s]+$/, '');
}

/** Unique <title>: "Best <Vendor> Alternatives (<REVIEW_YEAR>): N Tools Compared". */
export function buildAltTitle(vendor: Vendor): string {
	const count = selectAlternatives(vendor.slug).length;
	return `Best ${vendor.name} Alternatives (${REVIEW_YEAR}): ${count} Tools Compared`;
}

/** Unique meta description per page: leads with the "alternative" framing the query uses
 *  and positions Scanopy as the top pick. */
export function buildAltMetaDescription(vendor: Vendor): string {
	const name = vendorDisplayName(vendor);
	return (
		`Looking for a ${name} alternative? Compare the best ${name} alternatives for automated network discovery, ` +
		`topology mapping, and documentation. Scanopy leads with automatic ${SCANOPY_CLAIMS.views} ` +
		`at flat pricing, plus a free self-hostable edition.`
	);
}

/** Data-derived intro: the target's bestFor, then its tradeOff, then the list.
 *  Unique per vendor via bestFor/tradeOff. */
export function buildAltIntro(vendor: Vendor): string {
	const name = vendorDisplayName(vendor);
	const parts: string[] = [];

	if (vendor.bestFor) {
		parts.push(`${name} is built for ${lowerFirst(trimSentence(vendor.bestFor))}.`);
	}

	if (vendor.tradeOff) {
		// Colon form handles both noun-phrase trade-offs ("no native topology visualization")
		// and full-clause ones ("mapping is secondary to monitoring") without awkward grammar.
		parts.push(`${name}'s trade-off: ${lowerFirst(firstSentence(vendor.tradeOff))}.`);
	}

	parts.push(
		`These are the best ${name} alternatives for network discovery, topology visualization, and living documentation, starting with the one we build, Scanopy.`
	);

	return parts.join(' ');
}

/** One-line, data-derived blurb for a featured tool's card. Scanopy gets the "pick" line;
 *  every other tool is summarized from its own bestFor (one-sentence who-it's-for). */
export function altBlurb(vendor: Vendor): string {
	if (vendor.slug === SCANOPY_SLUG) {
		return `A dedicated network documentation tool: one scan produces ${SCANOPY_CLAIMS.viewsParenthetical} plus ${SCANOPY_CLAIMS.serviceDetection}, at ${SCANOPY_CLAIMS.flatPricing}, with ${SCANOPY_CLAIMS.freeCE}.`;
	}
	if (vendor.bestFor) {
		return `${vendorDisplayName(vendor)} is for ${lowerFirst(trimSentence(vendor.bestFor))}.`;
	}
	return vendorDisplayName(vendor);
}

/**
 * Vendor-specific FAQ for the FAQPage schema and the visible FAQ block. Answers are
 * derived from the same structured data the page renders (no fabricated claims) and vary
 * per vendor via bestFor/tradeOff and the actual open-source status of the alternatives.
 */
export function buildAltFaqs(vendor: Vendor): VendorFAQ[] {
	const name = vendorDisplayName(vendor);
	const faqs: VendorFAQ[] = [];

	// 1. The headline "best alternative" question.
	const balance = vendor.bestFor
		? ` ${name} itself remains the better choice when you specifically need ${lowerFirst(trimSentence(vendor.bestFor))}.`
		: '';
	faqs.push({
		question: `What is the best alternative to ${name}?`,
		answer:
			`The right alternative depends on what you use ${name} for. If you want automatic network discovery with living ` +
			`${SCANOPY_CLAIMS.views} and ${SCANOPY_CLAIMS.serviceDetection}, Scanopy is the closest dedicated ` +
			`alternative: ${SCANOPY_CLAIMS.flatPricing}, plus ${SCANOPY_CLAIMS.freeCE}.${balance}`
	});

	// 2. Free / open-source options, computed from the featured tools' actual licenses.
	const openNames = selectAlternatives(vendor.slug)
		.filter((s) => vendors[s].openSource.status === 'osi')
		.map((s) => vendors[s].name);
	if (openNames.length) {
		faqs.push({
			question: `Is there a free or open-source ${name} alternative?`,
			answer:
				`Yes. ${joinList(openNames)} are open-source (OSI-licensed). Scanopy's Community edition is free to ` +
				`self-host under AGPL-3.0 and produces the full ${SCANOPY_CLAIMS.views}; the paid plans ` +
				`add cloud hosting and support at flat pricing.`
		});
	}

	// 3. Why teams switch: straight from the target's documented trade-off.
	if (vendor.tradeOff) {
		faqs.push({
			question: `Why do teams look for a ${name} alternative?`,
			answer:
				`One documented limitation: ${lowerFirst(firstSentence(vendor.tradeOff))}. Scanopy produces an ` +
				`up-to-date visual map of what is on the network without a separate monitoring platform, which is ` +
				`why it is compared against ${name}.`
		});
	}

	return faqs;
}

// ---------------------------------------------------------------------------
// Scanopy's own "alternatives to us" page (`/comparisons/scanopy-alternatives`).
// Inverted from the competitor pages: Scanopy is the subject and the competitors are
// the alternatives.
// ---------------------------------------------------------------------------

// Closeness-to-Scanopy ordering for the competitor list: dedicated diagram tools first,
// then monitoring platforms, then discovery tools, then anything uncategorised (NetBox).
const CATEGORY_RANK: Record<string, number> = { dedicated: 0, monitoring: 1, discovery: 2 };

/** The competitors to surface as alternatives to Scanopy, ordered by closeness. Scanopy
 *  itself is excluded; these are the alternatives. */
export function scanopyAlternativeSlugs(): string[] {
	return [...VS_VENDOR_SLUGS].sort((a, b) => {
		const ra = CATEGORY_RANK[categoryOf(a) ?? ''] ?? 3;
		const rb = CATEGORY_RANK[categoryOf(b) ?? ''] ?? 3;
		if (ra !== rb) return ra - rb;
		return VS_VENDOR_SLUGS.indexOf(a) - VS_VENDOR_SLUGS.indexOf(b);
	});
}

const VIEW_LABELS: Record<'l2' | 'l3' | 'workload' | 'application', string> = {
	l2: 'L2 physical',
	l3: 'L3 logical',
	workload: 'workload',
	application: 'application'
};

/**
 * One-line "where Scanopy differs" note for a competitor card. Guard: only count a view as
 * something Scanopy adds when the competitor's support is a DEFINITE `'no'`, never for
 * `'unclear'` (unverified), so we don't overclaim against the tri-state data.
 */
export function scanopyEdge(vendor: Vendor): string {
	const missing = (['l2', 'l3', 'workload', 'application'] as const)
		.filter((k) => vendor.viewTypes?.[k] === 'no')
		.map((k) => VIEW_LABELS[k]);
	if (missing.length) {
		const noun = missing.length > 1 ? 'views' : 'view';
		return `Scanopy also produces the ${joinList(missing)} ${noun} and adds ${SCANOPY_CLAIMS.serviceDetection}, at ${SCANOPY_CLAIMS.flatPricing} with ${SCANOPY_CLAIMS.freeCE}.`;
	}
	return `Scanopy matches its topology coverage and adds ${SCANOPY_CLAIMS.serviceDetection}, at ${SCANOPY_CLAIMS.flatPricing} with ${SCANOPY_CLAIMS.freeCE}.`;
}

export const SCANOPY_ALT_TITLE = `Scanopy Alternatives (${REVIEW_YEAR}): Network Mapping Tools Compared`;

export const SCANOPY_ALT_DESCRIPTION =
	'Comparing alternatives to Scanopy? See the closest network discovery and topology tools, and where ' +
	`Scanopy's four-view mapping, ${SCANOPY_CLAIMS.serviceDetection}, flat pricing, and free self-hostable edition differ.`;

export const SCANOPY_ALT_INTRO =
	'Scanopy is a dedicated tool for automated network discovery and documentation: one scan produces four ' +
	'switchable topology views (L2 physical, L3 logical, workloads, and applications) with per-host service ' +
	'detection. Each of the alternatives below covers a subset of those four views, at different pricing and ' +
	'licensing.';

/** FAQPage items for the Scanopy alternatives page. Open-source names are computed from
 *  the actual licenses so the answer can never drift from the data. */
export function buildScanopyAltFaqs(): VendorFAQ[] {
	const openNames = scanopyAlternativeSlugs()
		.filter((s) => vendors[s].openSource.status === 'osi')
		.map((s) => vendors[s].name);

	return [
		{
			question: 'What is the best alternative to Scanopy?',
			answer:
				'The right alternative depends on what you need most. Auvik and ManageEngine OpManager bundle automatic ' +
				'network maps into a full monitoring platform; LibreNMS and NetDisco are OSI-licensed and free to ' +
				'self-host; NetBox models intended state behind a REST and GraphQL API rather than rendering a visual ' +
				`map. None of them combine all four topology views (L2, L3, workloads, applications), ${SCANOPY_CLAIMS.serviceDetection}, ` +
				'flat pricing, and a free self-hostable edition, so the right alternative comes down to which of those ' +
				'you can do without.'
		},
		{
			question: 'Can Scanopy be self-hosted or deployed on-prem?',
			answer:
				'Yes. Scanopy runs as a single daemon (no per-device agents and no inbound firewall rules), so you ' +
				'can self-host it on your own infrastructure or run the managed cloud. Commercial self-hosted ' +
				'licensing is available for teams that need on-prem deployment across multiple networks and seats.'
		},
		{
			question: 'Is Scanopy open source, and is there a free version?',
			answer:
				'Yes to both. The Scanopy Community edition is open source under the AGPL-3.0 license and free to ' +
				'self-host, limited to one network and one seat.' +
				(openNames.length
					? ` Among the alternatives, ${joinList(openNames)} are also open source; most commercial options are proprietary.`
					: '') +
				' Paid plans remove the caps (a commercial license for self-hosting, or managed cloud hosting) with more networks, seats, and support.'
		}
	];
}
