import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';

export async function loadPh () {
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: 'https://ph.scanopy.net',
		ui_host: 'https://us.posthog.com',
		defaults: '2025-11-30',
		debug: true,
		secure_cookie: true,
		persistence: 'memory',
		opt_out_capturing_by_default: true,
		// person_profiles: 'identified_only'
	});
	initFeatureFlags();
};

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
	if (browser && posthog && !posthog.has_opted_out_capturing()) {
		// Wait for feature flags to be loaded, then evaluate
		posthog.onFeatureFlags(() => {
			evaluateCtaFlag()
		});
	}
}

/**
 * Evaluate the CTA feature flag and update the text.
 * This triggers the $feature_flag_called exposure event.
 */
export function evaluateCtaFlag() {
	if (browser && posthog) {
		const variant = posthog.getFeatureFlag('website-main-cta');
		
		if (variant === 'launch') {
			featureFlags.mainCtaText = 'Launch Scanopy';
		} else if (variant === 'get-started') {
			featureFlags.mainCtaText = 'Get Started';
		} else {
			featureFlags.mainCtaText = 'Start Free Trial';
		}
	}
}

export const analytics = {
	/**
	 * Track CTA button clicks that lead users toward conversion.
	 * Note: Exposure event is triggered on page load via $effect, not here.
	 */
	ctaClicked: (props: { location: string; destination: string; text: string }) => {
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
	 * Track interest in roadmap items (clicks to expand/view details)
	 */
	roadmapItemClicked: (props: { feature_id: string; feature_name: string; category: string }) => {
		capture('roadmap_item_clicked', props);
	}
};
