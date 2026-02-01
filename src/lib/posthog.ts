/**
 * Shared PostHog utilities for use across main site and docs.
 */

import posthog from 'posthog-js';
import { hasAnalyticsConsent } from './cookies';

let initialized = false;

export interface PostHogConfig {
	apiKey: string;
	apiHost?: string;
	uiHost?: string;
}

/**
 * Initialize PostHog with opt-out by default.
 * Call this once on app startup.
 */
export function initPostHog(config: PostHogConfig): void {
	if (initialized || typeof window === 'undefined') return;

	posthog.init(config.apiKey, {  
		api_host: 'https://ph.scanopy.net',  
		ui_host: 'https://us.posthog.com',  
		defaults: '2025-11-30',  
		secure_cookie: true,  
		persistence: 'localStorage+cookie',
		opt_out_capturing_by_default: !hasAnalyticsConsent(),
		opt_out_capturing_persistence_type: 'localStorage', // Respect opt-out choice  
		capture_pageview: true,  
		capture_pageleave: true,  
		
		// Don't auto-identify until consent  
		person_profiles: 'identified_only', // Only create person profiles after identify  
	});

	initialized = true;

	// If user already consented, opt in immediately
	if (hasAnalyticsConsent()) {
		optInAnalytics();
		capturePageview();
	}
}

/**
 * Opt in to analytics tracking.
 */
export function optInAnalytics(): void {
	if (!posthog.__loaded) return;
	posthog.set_config({ persistence: 'localStorage+cookie' });
	posthog.opt_in_capturing();
}

/**
 * Opt out of analytics tracking.
 */
export function optOutAnalytics(): void {
	if (!posthog.__loaded) return;
	posthog.opt_out_capturing();
}

/**
 * Capture a pageview event.
 */
export function capturePageview(): void {
	if (!posthog.__loaded) return;
	posthog.capture('$pageview');
}

/**
 * Check if PostHog is loaded and ready.
 */
export function isPostHogLoaded(): boolean {
	return posthog.__loaded ?? false;
}

/**
 * Get the PostHog instance for advanced usage.
 */
export function getPostHog(): typeof posthog {
	return posthog;
}
