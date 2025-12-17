import posthog from 'posthog-js';
import { browser } from '$app/environment';

/**
 * PostHog tracking utility for consistent event naming and properties.
 */

function capture(event: string, properties?: Record<string, unknown>) {
	if (browser && posthog) {
		posthog.capture(event, properties);
	}
}

/**
 * Feature flag state for CTA text experiment
 */
export const featureFlags = $state({
	mainCtaText: 'Start Free Trial' // default/control
});

export function initFeatureFlags() {
	if (browser && posthog) {
		posthog.onFeatureFlags(() => {
			const variant = posthog.getFeatureFlag('website-main-cta');
			if (variant === 'launch') {
				featureFlags.mainCtaText = 'Launch Scanopy';
			} else if (variant === 'get-started') {
				featureFlags.mainCtaText = 'Get Started';
			} else {
				// control or fallback
				featureFlags.mainCtaText = 'Start Free Trial';
			}
		});
	}
}

export const analytics = {
	/**
	 * Track CTA button clicks that lead users toward conversion
	 */
	ctaClicked: (props: {
		location: string;
		destination: string;
		text: string;
	}) => {
		if (browser && posthog) {
			// Call getFeatureFlag to trigger the exposure event ($feature_flag_called)
			const variant = posthog.getFeatureFlag('website-main-cta');

			// Capture with send_feature_flags to ensure proper attribution
			posthog.capture('cta_clicked', props, { send_feature_flags: true });
		}
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
	externalLinkClicked: (props: {
		destination: string;
		location: string;
		url: string;
	}) => {
		capture('external_link_clicked', props);
	},

	/**
	 * Track newsletter form submissions
	 */
	newsletterSubmitted: (props: {
		success: boolean;
		error?: string;
	}) => {
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
	 * Track interest in roadmap items (clicks to expand/view details)
	 */
	roadmapItemClicked: (props: {
		feature_id: string;
		feature_name: string;
		category: string;
	}) => {
		capture('roadmap_item_clicked', props);
	}
};
