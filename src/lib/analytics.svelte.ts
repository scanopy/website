import type { PostHog } from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import { hasAnalyticsConsent } from './cookies';
import { loadPosthogModule, optInAnalytics } from './posthog';

let posthogInstance: PostHog | null = null;

export async function loadPh() {
	// Loaded through the shared module so CookieConsent's opt-in and opt-out
	// ($lib/posthog) act on this same instance.
	const posthog = await loadPosthogModule();
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: 'https://ph.scanopy.net',
		ui_host: 'https://us.posthog.com',
		defaults: '2025-11-30',
		secure_cookie: true,
		persistence: 'memory',
		opt_out_capturing_by_default: true
	});
	posthogInstance = posthog;
	// CookieConsent applies a saved choice on mount, before this idle-time init has run,
	// so a saved analytics grant is applied here as well.
	if (hasAnalyticsConsent()) optInAnalytics();
}

/**
 * PostHog tracking utility for consistent event naming and properties.
 */

function capture(event: string, properties?: Record<string, unknown>) {
	if (browser && posthogInstance) {
		posthogInstance.capture(event, properties);
	}
}

/** Where a CTA sends the visitor. */
export type CtaDestination =
	/** Demo booking (cal.com). */
	| 'talk_to_sales'
	/** The license path: app signup for a self-hosted license (licenseHref in $lib/licensePath.svelte). */
	| 'self_hosted'
	/** The /pricing page. */
	| 'pricing'
	/** Enterprise inquiry through the contact modal. */
	| 'contact_modal'
	/** The demo instance, demo.scanopy.net (navbar, hero, about, compliance). */
	| 'live_demo'
	/** The demo instance, demo.scanopy.net (article and alternatives CTAs). */
	| 'demo'
	/** The /commercial page. */
	| 'commercial';

export const analytics = {
	/**
	 * Track CTA button clicks that lead users toward conversion.
	 * `plan` is set when the CTA belongs to a specific plan (pricing cards, license path).
	 */
	ctaClicked: (props: {
		location: string;
		destination: CtaDestination;
		text: string;
		plan?: string;
	}) => {
		capture('cta_clicked', props);
	},

	/**
	 * Track when the pricing page is viewed
	 */
	pricingViewed: (props?: { referrer?: string }) => {
		capture('pricing_viewed', props);
	},

	/**
	 * Track when user filters plans by type
	 */
	pricingPlanFiltered: (props: { filter: string }) => {
		capture('pricing_plan_filtered', props);
	},

	/**
	 * Track when user toggles billing period
	 */
	pricingPeriodToggled: (props: { period: string }) => {
		capture('pricing_period_toggled', props);
	},

	/**
	 * Track when user selects a plan (clicks the CTA to proceed)
	 */
	pricingPlanSelected: (props: {
		plan: string;
		period: string;
		price_cents: number;
		is_trial: boolean;
	}) => {
		capture('pricing_plan_selected', props);
	},

	/**
	 * Track clicks on external links (community, docs, etc.)
	 */
	externalLinkClicked: (props: { destination: string; location: string; url: string }) => {
		capture('external_link_clicked', props);
	},

	/**
	 * Track newsletter form submissions
	 */
	newsletterSubmitted: (props: { success: boolean; error?: string }) => {
		capture('newsletter_submitted', props);
	},

	/**
	 * Track service catalog searches
	 */
	servicesSearched: (props: {
		query: string;
		results_count: number;
		category_filter?: string | null;
	}) => {
		capture('services_searched', props);
	},

	/**
	 * Track feature request button clicks
	 */
	featureRequestClicked: () => {
		capture('feature_request_clicked');
	},

	/**
	 * Track service request button clicks
	 */
	serviceRequestClicked: () => {
		capture('service_request_clicked');
	},

	/**
	 * Track integration request button clicks
	 */
	integrationRequestClicked: () => {
		capture('integration_request_clicked');
	},

	/**
	 * Track interest in roadmap items (clicks to expand/view details)
	 */
	roadmapItemClicked: (props: { feature_id: string; feature_name: string; category: string }) => {
		capture('roadmap_item_clicked', props);
	},

	/**
	 * Track commercial plan inquiry form submissions
	 */
	planInquirySubmitted: (props: { planType: string; success: boolean }) => {
		capture('plan_inquiry_submitted', props);
	}
};
