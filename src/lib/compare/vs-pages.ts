import type { Vendor } from '$lib/types';
import { vendors } from '$lib/fixtures/network-diagram-vendors';

// Real competitor vendors we generate "Scanopy vs <vendor>" head-to-head pages for.
// Excluded by design:
//  - scanopy / scanopy-ce: comparing Scanopy to itself has no value.
//  - drawio / lucidchart: manual diagramming tools with no discovery — they are not
//    head-to-head competitors (no auto-topology), so a vs page would be thin/misleading.
//  - nmap-zenmap: a CLI scanner / discovery layer, not an ongoing-documentation product;
//    not a real head-to-head and low comparison search value.
export const VS_VENDOR_SLUGS = [
	'auvik',
	'netbrain',
	'solarwinds-ntm',
	'domotz',
	'manageengine-opmanager',
	'prtg',
	'librenms',
	'netdisco',
	'faddom',
	'netbox'
] as const;

export type VsVendorSlug = (typeof VS_VENDOR_SLUGS)[number];

export const SCANOPY_SLUG = 'scanopy';

// The year stamped into generated comparison titles as a freshness signal. Bump this
// (deliberately, when you re-verify the vendor data) so every "vs" and "alternatives"
// title moves together instead of drifting across dozens of hardcoded strings. Not derived
// from the current date on purpose — the year should claim recency only when the figures
// were actually re-checked.
export const REVIEW_YEAR = 2026;

// Canonical phrasings of Scanopy's recurring value props. Defined once and reused across
// the generated vs / alternatives prose so the claims stay consistent and update in a
// single place, instead of drifting across the dozens of hand-typed copies they replaced.
// Note: meta descriptions deliberately keep their own compact wording (e.g. bare "flat
// pricing") for length; these constants drive the body prose.
export const SCANOPY_CLAIMS = {
	views: 'L2, L3, workload, and application views',
	viewsParenthetical: 'four switchable views (L2 physical, L3 logical, workloads, and applications)',
	serviceDetection: 'per-host service detection',
	flatPricing: 'flat pricing regardless of host count',
	freeCE: 'a free, self-hostable Community edition',
	alongside: 'It sits alongside your monitoring stack rather than replacing it.'
} as const;

/** Route path for a vendor's head-to-head page: `/comparisons/vs/<vendorSlug>`. */
export function vsSlug(vendorSlug: string): string {
	return `/comparisons/vs/${vendorSlug}`;
}

/** Validate a `/comparisons/vs/[slug]` route param (the vendor slug) against the known
 *  list, returning it unchanged or null. */
export function parseVsSlug(vendorSlug: string): string | null {
	if (!VS_VENDOR_SLUGS.includes(vendorSlug as VsVendorSlug)) return null;
	return vendorSlug;
}

export function allVsPageSlugs(): string[] {
	return VS_VENDOR_SLUGS.map(vsSlug);
}

/** Display name for a vendor (prefer fullName where it differs from the table name). */
export function vendorDisplayName(vendor: Vendor): string {
	return vendor.fullName || vendor.name;
}

// Per-matchup differentiator, phrased as "<Scanopy angle> vs <vendor angle>". Drives
// the unique <title>, the meta description, and the vendor-aware takeaway so every page
// reads differently instead of sharing one boilerplate line.
const VS_DIFFERENTIATORS: Record<string, string> = {
	auvik: 'Documentation vs Monitoring + RMM',
	netbrain: 'Simple Documentation vs Enterprise Automation',
	'solarwinds-ntm': 'Live Maps vs On-Demand Visio Exports',
	domotz: 'Dedicated Maps vs Monitoring + Remote Access',
	'manageengine-opmanager': 'Documentation Tool vs Monitoring Platform',
	prtg: 'Auto Topology vs Sensor-Based Monitoring',
	librenms: 'Automated Docs vs Self-Hosted Monitoring',
	netdisco: 'Four Views vs Layer 2 Discovery',
	faddom: 'Network Topology vs Application Dependency Mapping',
	netbox: 'Topology Visualization vs Source of Truth'
};

// Proper nouns in the differentiator phrases that must keep their capitalization when
// the (Title Case) phrase is lowercased for mid-sentence prose.
const PRESERVE_CASE = new Set(['Visio', 'Paessler']);

/** Lowercase a Title Case phrase for mid-sentence use, preserving all-caps acronyms
 *  (RMM, VLAN) and known proper nouns (Visio). E.g. "Auto Topology vs Sensor-Based
 *  Monitoring" → "auto topology vs sensor-based monitoring". */
function lowerPhrase(text: string): string {
	return text
		.split(' ')
		.map((word) => {
			if (/^[A-Z0-9+]{2,}$/.test(word)) return word; // acronym (RMM, L2)
			if (PRESERVE_CASE.has(word)) return word;
			return word.toLowerCase();
		})
		.join(' ');
}

/** Split a differentiator into its [scanopyAngle, vendorAngle] halves. */
function differentiatorAngles(vendor: Vendor): { scanopy: string | null; vendor: string | null } {
	const diff = VS_DIFFERENTIATORS[vendor.slug];
	if (!diff) return { scanopy: null, vendor: null };
	const [scanopy, vendorAngle] = diff.split(' vs ');
	return { scanopy: scanopy?.trim() || null, vendor: vendorAngle?.trim() || null };
}

// Strip trailing punctuation / a leading "Best for ..." framing from a sentence so it
// can be spliced into the data-derived intro without reading like marketing copy.
// Exported so the alternatives-page generator can reuse the same normalization.
export function trimSentence(text: string): string {
	return text.trim().replace(/\s+/g, ' ').replace(/[.\s]+$/, '');
}

// Lowercase the first letter only when it isn't the start of an acronym (e.g. keep
// "IT teams", "MSPs" intact, but turn "Enterprise IT teams" into "enterprise IT teams").
// Exported so the alternatives-page generator can reuse the same normalization.
export function lowerFirst(text: string): string {
	if (text.length >= 2 && text[1] === text[1].toUpperCase() && /[A-Z]/.test(text[1])) {
		return text;
	}
	return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Build a unique, data-derived intro (no boilerplate) from each vendor's structured
 * fields. Uses bestFor / tradeOff / whereItFits so every page reads differently.
 */
export function buildIntro(vendor: Vendor): string {
	const scanopy = vendors[SCANOPY_SLUG];
	const name = vendorDisplayName(vendor);

	const parts: string[] = [];

	// Sentence 1: who each tool is for, from bestFor.
	if (vendor.bestFor && scanopy.bestFor) {
		parts.push(
			`Scanopy is for ${lowerFirst(trimSentence(scanopy.bestFor))}. ${name} is for ${lowerFirst(
				trimSentence(vendor.bestFor)
			)}.`
		);
	} else if (vendor.bestFor) {
		parts.push(`${name} is for ${lowerFirst(trimSentence(vendor.bestFor))}.`);
	}

	// Sentence 2: the core distinction, drawn from the vendor's own trade-off or fit.
	if (vendor.tradeOff) {
		const rawLabel = (vendor.tradeOffLabel || 'trade-offs').toLowerCase();
		// "What Scanopy doesn't do"-style labels are full clauses; others ("Trade-off",
		// "Trade-offs", "The catch") read as "<Vendor>'s <label>".
		const clause = rawLabel.startsWith('what')
			? rawLabel
			: `${name}'s ${rawLabel}`;
		parts.push(
			`The table below puts the two side by side on discovery, the four topology views, pricing, and licensing, including ${clause}.`
		);
	} else if (vendor.whereItFits) {
		parts.push(
			`The table below puts the two side by side on discovery, the four topology views, pricing, and licensing, so you can see where ${name} fits and where Scanopy does.`
		);
	} else {
		parts.push(
			`The table below puts the two side by side on discovery, the four topology views, pricing, and licensing.`
		);
	}

	return parts.join(' ');
}

/**
 * "When to choose which" takeaway, derived from whereItFits / tradeOff. Honest framing:
 * Scanopy = documentation alongside your stack; the competitor keeps its own strength.
 */
export function buildTakeaway(vendor: Vendor): { scanopy: string; vendor: string } {
	const name = vendorDisplayName(vendor);

	// Lead with the matchup-specific contrast (e.g. "live maps over on-demand Visio
	// exports") so the Scanopy takeaway differs per page, then the shared value props.
	const angles = differentiatorAngles(vendor);
	const contrast =
		angles.scanopy && angles.vendor
			? `${lowerPhrase(angles.scanopy)} over ${lowerPhrase(angles.vendor)}`
			: 'a dedicated, living network-documentation tool';
	const scanopyLine = `You want ${contrast}: automatic ${SCANOPY_CLAIMS.views}, ${SCANOPY_CLAIMS.serviceDetection}, ${SCANOPY_CLAIMS.flatPricing}, and ${SCANOPY_CLAIMS.freeCE}. ${SCANOPY_CLAIMS.alongside}`;

	let vendorLine: string;
	if (vendor.whereItFits) {
		vendorLine = trimSentence(vendor.whereItFits) + '.';
	} else if (vendor.bestFor) {
		vendorLine = `${name} is the better fit when you need ${lowerFirst(trimSentence(vendor.bestFor))}.`;
	} else {
		vendorLine = `${name} is the better fit when its capabilities beyond diagramming are what you are buying for.`;
	}

	return { scanopy: scanopyLine, vendor: vendorLine };
}

/**
 * Data-derived one-line capability recap from a vendor's viewTypes, reusing the same
 * yes/unclear/no logic as VendorComparison's viewTypesText(). Appends viewTypes.note if
 * present. Returns null when the vendor has no viewTypes data.
 */
export function buildCapabilityRecap(vendor: Vendor): string | null {
	if (!vendor.viewTypes) return null;
	const viewOrder: { key: 'l2' | 'l3' | 'workload' | 'application'; label: string }[] = [
		{ key: 'l2', label: 'L2 physical' },
		{ key: 'l3', label: 'L3 logical' },
		{ key: 'workload', label: 'Workloads' },
		{ key: 'application', label: 'Applications' }
	];
	const yes: string[] = [];
	const unclear: string[] = [];
	const no: string[] = [];
	for (const view of viewOrder) {
		const support = vendor.viewTypes[view.key];
		if (support === 'yes') yes.push(view.label);
		else if (support === 'unclear') unclear.push(view.label);
		else no.push(view.label);
	}
	const parts: string[] = [];
	if (yes.length) parts.push(`Produces ${yes.join(', ')}`);
	if (unclear.length) parts.push(`unverified for ${unclear.join(', ')}`);
	if (no.length) parts.push(`no ${no.join(', ')} view`);
	let text = parts.join('; ') + '.';
	if (vendor.viewTypes.note) text += ` ${vendor.viewTypes.note}`;
	return text;
}

/**
 * Prose version of the view coverage, phrased as a grammatical sentence with `subject` as
 * the leading noun (e.g. "Scanopy" or a vendor name). Reuses the same yes/unclear/no split
 * as buildCapabilityRecap but reads as flowing prose, not a labeled list. Appends
 * viewTypes.note if present. Returns null when the vendor has no viewTypes data.
 */
export function buildRecapSentence(subject: string, vendor: Vendor): string | null {
	// The table's Network Views chips already convey coverage; this prose line carries only the
	// per-vendor nuance note (the why/how the chips cannot show), to avoid double-stating it.
	if (!vendor.viewTypes?.note) return null;
	return `${subject}: ${vendor.viewTypes.note}`;
}

function joinList(items: string[]): string {
	if (items.length <= 1) return items.join('');
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/** Unique <title>: "Scanopy vs <Vendor>: <short differentiator> (<REVIEW_YEAR>)". */
export function buildTitle(vendor: Vendor): string {
	const name = vendor.name; // table name is shorter; better for a title
	const diff = VS_DIFFERENTIATORS[vendor.slug] || 'Network Documentation Compared';
	return `Scanopy vs ${name}: ${diff} (${REVIEW_YEAR})`;
}

/** Unique meta description per matchup — leads with the matchup's differentiator and a
 *  vendor-specific fit clause so no two descriptions are the same boilerplate. */
export function buildMetaDescription(vendor: Vendor): string {
	const name = vendorDisplayName(vendor);
	const angles = differentiatorAngles(vendor);

	const lead =
		angles.scanopy && angles.vendor
			? `Scanopy vs ${name}: ${lowerPhrase(angles.scanopy)} vs ${lowerPhrase(angles.vendor)}.`
			: `Scanopy vs ${name}: network documentation compared.`;

	const fit = vendor.bestFor
		? ` ${name} is built for ${lowerFirst(trimSentence(vendor.bestFor))}; Scanopy gives you automatic ${SCANOPY_CLAIMS.views} at flat pricing.`
		: ` Compare discovery, the four topology views (L2, L3, workloads, applications), licensing, and pricing to see which fits your team.`;

	return lead + fit;
}
