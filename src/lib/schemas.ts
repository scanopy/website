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
		const price =
			plan.metadata.custom_price === 'Free'
				? '0'
				: plan.metadata.custom_price
					? undefined
					: (plan.metadata.base_cents / 100).toFixed(2);

		return {
			'@type': 'Offer',
			name: plan.name,
			description: plan.description,
			...(price && { price, priceCurrency: 'USD' }),
			...(price && price !== '0' && { priceValidUntil: '2026-12-31' }),
			availability: 'https://schema.org/InStock'
		};
	});
}

/**
 * Generate feature list from product features fixture
 */
function generateFeatureList(): string[] {
	return productFeatures.map((f) => f.schemaLabel);
}

/**
 * SoftwareApplication schema for homepage
 * @see https://schema.org/SoftwareApplication
 */
export function getSoftwareApplicationSchema() {
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
		screenshot: 'https://scanopy.net/hero-network.jpeg',
		softwareVersion: '1.0',
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
		brand: {
			'@type': 'Brand',
			name: 'Scanopy'
		},
		offers: generateOffers()
	};
}

/**
 * FAQ schema for pricing page
 * @see https://schema.org/FAQPage
 */
export function getFAQSchema() {
	const faqs = [
		{
			question: 'Is there a free version of Scanopy?',
			answer:
				'Yes! The Community edition is completely free and self-hosted. You can scan unlimited networks with no restrictions. All of the paid hosted plans also offer a free trial.'
		},
		{
			question: "What's the difference between cloud and self-hosted?",
			answer:
				"Cloud plans run on Scanopy's infrastructure - just install the agent and connect. Self-hosted plans let you run the entire Scanopy server on your own infrastructure for full data control."
		},
		{
			question: 'How many devices can Scanopy discover?',
			answer:
				"There's no limit on the number of devices discovered per network. Scanopy can handle everything from small homelabs to enterprise networks with thousands of devices."
		},
		{
			question: 'Do I need to install anything on every device?',
			answer:
				'No. Scanopy uses agentless discovery - you only install one lightweight scanner agent that discovers all devices on your network automatically.'
		}
	];

	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};
}

/**
 * Export product features for use in components
 */
export function getProductFeatures() {
	return productFeatures;
}
