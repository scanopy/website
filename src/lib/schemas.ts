/**
 * Unified schema generation utilities.
 * Single source of truth for structured data across the site.
 */

import billingPlansData from '$lib/fixtures/billing-plans.json';
import productFeaturesData from '$lib/fixtures/product-features.json';
import servicesData from '$lib/fixtures/services.json';

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
 * Monthly-equivalent price (in cents) of a plan's annual tier — the yearly base price
 * divided by 12. The pricing page defaults to the annual-billed-monthly figure (e.g.
 * $11.99 rather than the $14.99 month-to-month rate), so advertising this in schema keeps
 * the Offer price matched to the number the visitor actually sees. Returns null when the
 * plan has no paid Cloud yearly tier (free/custom plans fall back to their own price).
 */
function getYearlyMonthlyEquivalentCents(planId: string): number | null {
	const yearly = billingPlans.find(
		(p) =>
			p.id === planId &&
			p.metadata.rate === 'Year' &&
			p.metadata.hosting === 'Cloud' &&
			p.metadata.base_cents > 0
	);
	return yearly ? yearly.metadata.base_cents / 12 : null;
}

/**
 * Generate offers array for schema.org Product/SoftwareApplication.
 * Paid tiers advertise the annual-billed-monthly price to match the pricing page default.
 */
function generateOffers() {
	const futureDate = new Date();
	futureDate.setFullYear(futureDate.getFullYear() + 1);
	const priceValidUntil = futureDate.toISOString().split('T')[0];

	return getUniqueMonthlyPlans()
		.filter((plan) => !plan.metadata.custom_price || plan.metadata.custom_price === 'Free')
		.map((plan) => {
			const priceCents = getYearlyMonthlyEquivalentCents(plan.id) ?? plan.metadata.base_cents;
			const price = plan.metadata.custom_price === 'Free' ? '0' : (priceCents / 100).toFixed(2);

			return {
				'@type': 'Offer',
				name: plan.name,
				description: plan.description,
				priceCurrency: 'USD',
				price,
				priceValidUntil,
				availability: 'https://schema.org/InStock',
				url: 'https://scanopy.net/pricing',
				seller: {
					'@type': 'Organization',
					name: 'Scanopy'
				}
			};
		});
}

/**
 * Aggregate the priced offers into a single AggregateOffer (low/high/count) for the
 * pricing-page Product. Cleaner for merchant evaluation than a repeated Offer[] (which
 * stays on the home SoftwareApplication for the per-plan detail).
 */
function generateAggregateOffer() {
	const offers = generateOffers();
	if (offers.length === 0) return undefined;
	const prices = offers.map((o) => parseFloat(o.price)).filter((n) => !Number.isNaN(n));
	return {
		'@type': 'AggregateOffer',
		priceCurrency: 'USD',
		lowPrice: Math.min(...prices).toFixed(2),
		highPrice: Math.max(...prices).toFixed(2),
		offerCount: offers.length,
		availability: 'https://schema.org/InStock',
		url: 'https://scanopy.net/pricing'
	};
}

/**
 * Generate feature list from product features fixture.
 * Substitutes {{SERVICE_COUNT}} the same way getProductFeatures() does, so the
 * live service count reaches the schema instead of a raw placeholder.
 */
function generateFeatureList(): string[] {
	const serviceCount = getServiceCountLabel();
	return productFeatures.map((f) => f.schemaLabel.replace('{{SERVICE_COUNT}}', serviceCount));
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
			fm[key.trim()] = valueParts
				.join(':')
				.trim()
				.replace(/^["'](.*)["']$/, '$1');
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

	// Fallback only — the real version is parsed from changelog frontmatter below.
	// Kept current so a parse failure still emits a recent version.
	let latestVersion = '0.17.0';
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
			'Automated network diagram and documentation software. Deploy a lightweight scanner to discover and document network architecture, service dependencies, workload placement, and physical topology.',
		url: 'https://scanopy.net',
		image: 'https://scanopy.net/brand/scanopy-logo.webp',
		screenshot: 'https://scanopy.net/og/hero-topology-dark.webp',
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
 * Individual Offers for the published self-hosted commercial tiers. These are annual-only
 * (billingDuration P1Y), so they're kept OUT of the Cloud monthly AggregateOffer band and
 * surfaced as their own Offers instead, keeping the $/mo band clean while still making the
 * self-hosted prices citable by AI answer engines.
 */
function getSelfHostedPaidOffers() {
	const futureDate = new Date();
	futureDate.setFullYear(futureDate.getFullYear() + 1);
	const priceValidUntil = futureDate.toISOString().split('T')[0];

	return billingPlans
		.filter(
			(p) =>
				p.metadata.hosting === 'SelfHosted' &&
				p.metadata.rate === 'Year' &&
				p.metadata.base_cents > 0 &&
				!p.metadata.custom_price
		)
		.map((plan) => {
			const price = (plan.metadata.base_cents / 100).toFixed(2);
			return {
				'@type': 'Offer',
				name: plan.name,
				description: plan.description,
				priceCurrency: 'USD',
				price,
				priceValidUntil,
				availability: 'https://schema.org/InStock',
				url: 'https://scanopy.net/commercial',
				priceSpecification: {
					'@type': 'UnitPriceSpecification',
					price,
					priceCurrency: 'USD',
					billingDuration: 'P1Y'
				},
				seller: {
					'@type': 'Organization',
					name: 'Scanopy'
				}
			};
		});
}

/**
 * Product schema for pricing page
 * @see https://schema.org/Product
 */
export function getProductSchema() {
	const aggregate = generateAggregateOffer();
	const selfHostedOffers = getSelfHostedPaidOffers();
	const offers = aggregate ? [aggregate, ...selfHostedOffers] : selfHostedOffers;

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Scanopy',
		description:
			'Automated network diagram and documentation software. Automatically discover and document network architecture, service dependencies, workload placement, and physical topology.',
		image: 'https://scanopy.net/brand/scanopy-logo.webp',
		brand: {
			'@type': 'Brand',
			name: 'Scanopy'
		},
		offers
	};
}

/**
 * FAQPage schema for AEO / AI answer extraction. Answer text MUST match the visible
 * on-page copy, so callers source it from the same content the page renders.
 * @see https://schema.org/FAQPage
 */
export function getFAQPageSchema(items: { question: string; answer: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	};
}

/**
 * BreadcrumbList schema for site-wide breadcrumb navigation
 * @see https://schema.org/BreadcrumbList
 */
export function getBreadcrumbListSchema(items: { name: string; url: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
}

/**
 * Export product features for use in components
 */
export function getProductFeatures() {
	const serviceCount = getServiceCountLabel();
	return productFeatures.map((f) => ({
		...f,
		description: f.description.replace('{{SERVICE_COUNT}}', serviceCount),
		schemaLabel: f.schemaLabel.replace('{{SERVICE_COUNT}}', serviceCount)
	}));
}

/**
 * Get the count of detected services, rounded down to the nearest 10.
 * Use this everywhere instead of hardcoding "200+".
 */
export function getServiceCountLabel(): string {
	const count = (servicesData as unknown[]).length;
	const rounded = Math.floor(count / 10) * 10;
	return `${rounded}+`;
}

/**
 * Get the lowest cloud starting price (billed yearly, shown as monthly).
 */
export function getStartingMonthlyPrice(): string {
	const yearlyPlans = billingPlans.filter(
		(p) => p.metadata.rate === 'Year' && p.metadata.hosting === 'Cloud' && p.metadata.base_cents > 0
	);
	if (yearlyPlans.length === 0) return '';
	const cheapest = yearlyPlans.reduce((a, b) =>
		a.metadata.base_cents < b.metadata.base_cents ? a : b
	);
	const monthlyPrice = cheapest.metadata.base_cents / 100 / 12;
	return `$${monthlyPrice.toFixed(2)}`;
}
