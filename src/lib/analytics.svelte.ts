import type { PostHog } from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';

let posthogInstance: PostHog | null = null;

async function getPosthog(): Promise<PostHog> {
	if (!posthogInstance) {
		const mod = await import('posthog-js');
		posthogInstance = mod.default;
	}
	return posthogInstance;
}

export async function loadPh() {
	const posthog = await getPosthog();
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: 'https://ph.scanopy.net',
		ui_host: 'https://us.posthog.com',
		defaults: '2025-11-30',
		secure_cookie: true,
		persistence: 'memory',
		opt_out_capturing_by_default: true
	});
	initFeatureFlags();
}

/**
 * PostHog tracking utility for consistent event naming and properties.
 */

function capture(event: string, properties?: Record<string, unknown>) {
	if (browser && posthogInstance) {
		posthogInstance.capture(event, properties);
	}
}

const CTA_CACHE_KEY = 'scanopy_cta_variant';

/**
 * Feature flag state for CTA text experiment.
 * Reads cached variant from localStorage to prevent flash on repeat visits.
 */
export const featureFlags = $state({
	mainCtaText: (browser && localStorage.getItem(CTA_CACHE_KEY)) || 'Start Free Trial'
});

export function initFeatureFlags() {
	if (browser && posthogInstance && !posthogInstance.has_opted_out_capturing()) {
		// Wait for feature flags to be loaded, then evaluate
		posthogInstance.onFeatureFlags(() => {
			evaluateCtaFlag();
		});
	}
}

/**
 * Evaluate the CTA feature flag and update the text.
 * This triggers the $feature_flag_called exposure event.
 */
export function evaluateCtaFlag() {
	if (browser && posthogInstance) {
		const variant = posthogInstance.getFeatureFlag('website-main-cta');

		let text: string;
		if (variant === 'launch') {
			text = 'Launch Scanopy';
		} else if (variant === 'get-started') {
			text = 'Get Started';
		} else {
			text = 'Start Free Trial';
		}

		featureFlags.mainCtaText = text;
		try {
			localStorage.setItem(CTA_CACHE_KEY, text);
		} catch {
			/* quota exceeded */
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
