/**
 * Unified schema generation utilities.
 * Single source of truth for structured data across the site.
 */

import billingPlansData from '$lib/fixtures/billing-plans.json';
import productFeaturesData from '$lib/fixtures/product-features.json';

interface BillingPlan {
	id: string;
	name: string;
	description: string;
	metadata: {
		base_cents: number;
		rate: string;
		custom_price: string | null;
		included_networks: number | null;
		included_seats: number | null;
		hosting: string;
	};
}

interface ProductFeature {
	id: string;
	title: string;
	description: string;
	icon: string;
	schemaLabel: string;
	group: 'how_it_works' | 'what_you_get';
}

const billingPlans = billingPlansData as BillingPlan[];
const productFeatures = productFeaturesData as ProductFeature[];

/**
 * Get unique monthly billing plans (deduplicated by id)
 */
function getUniqueMonthlyPlans(): BillingPlan[] {
	const monthlyPlans = billingPlans.filter((p) => p.metadata.rate === 'Month');
	const seenPlanIds = new Set<string>();
	return monthlyPlans.filter((p) => {
		if (seenPlanIds.has(p.id)) return false;
		seenPlanIds.add(p.id);
		return true;
	});
}

/**
 * Generate offers array for schema.org Product/SoftwareApplication
 */
function generateOffers() {
	return getUniqueMonthlyPlans().map((plan) => {
		const isFree = plan.metadata.custom_price === 'Free';
		const isContactUs = plan.metadata.custom_price && !isFree;
		const price = isFree ? '0' : isContactUs ? undefined : (plan.metadata.base_cents / 100).toFixed(2);

		const offer: Record<string, unknown> = {
			'@type': 'Offer',
			name: plan.name,
			description: plan.description,
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock',
			url: 'https://scanopy.net/pricing',
			seller: {
				'@type': 'Organization',
				name: 'Scanopy'
			}
		};

		if (price !== undefined) {
			offer.price = price;
			offer.priceValidUntil = '2026-12-31';
		}

		return offer;
	});
}

/**
 * Generate feature list from product features fixture
 */
function generateFeatureList(): string[] {
	return productFeatures.map((f) => f.schemaLabel);
}

/**
 * Parse frontmatter from a markdown string
 */
function parseFrontmatter(content: string): Record<string, string> {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	const fm: Record<string, string> = {};
	match[1].split('\n').forEach((line) => {
		const [key, ...valueParts] = line.split(':');
		if (key && valueParts.length) {
			fm[key.trim()] = valueParts.join(':').trim();
		}
	});
	return fm;
}

/**
 * Get the latest software version from changelog markdown files
 */
async function getLatestVersion(): Promise<string> {
	const changelogFiles = import.meta.glob('/src/lib/changelog/*.md', {
		query: '?raw',
		import: 'default'
	});

	let latestVersion = '0.14.17';
	let latestDate = '';

	for (const [, loader] of Object.entries(changelogFiles)) {
		const raw = (await loader()) as string;
		const fm = parseFrontmatter(raw);
		if (fm.date && fm.version && fm.date > latestDate) {
			latestDate = fm.date;
			latestVersion = fm.version;
		}
	}

	return latestVersion;
}

/**
 * SoftwareApplication schema for homepage
 * @see https://schema.org/SoftwareApplication
 */
export async function getSoftwareApplicationSchema() {
	const version = await getLatestVersion();

	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Scanopy',
		applicationCategory: 'NetworkApplication',
		operatingSystem: 'Linux, Docker',
		description:
			'Automatic network discovery and documentation software. Create live, auto-updating network diagrams with one-time setup and zero upkeep.',
		url: 'https://scanopy.net',
		image: 'https://scanopy.net/scanopy-logo.png',
		screenshot: 'https://scanopy.net/topology-hero.png',
		softwareVersion: version,
		author: {
			'@type': 'Organization',
			name: 'Scanopy',
			url: 'https://scanopy.net'
		},
		offers: generateOffers(),
		featureList: generateFeatureList()
	};
}

/**
 * Product schema for pricing page
 * @see https://schema.org/Product
 */
export function getProductSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Scanopy',
		description:
			'Automatic network discovery and documentation software. Create live, auto-updating network diagrams.',
		image: 'https://scanopy.net/scanopy-logo.png',
		brand: {
			'@type': 'Brand',
			name: 'Scanopy'
		},
		offers: generateOffers()
	};
}

/**
 * Export product features for use in components
 */
export function getProductFeatures() {
	return productFeatures;
}
