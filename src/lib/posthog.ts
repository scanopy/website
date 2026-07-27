/**
 * Shared PostHog utilities for use across main site and docs.
 */

import type { PostHog } from 'posthog-js';
import { hasAnalyticsConsent } from './cookies';

let posthogInstance: PostHog | null = null;
let initialized = false;

async function loadPosthogModule(): Promise<PostHog> {
	if (!posthogInstance) {
		const mod = await import('posthog-js');
		posthogInstance = mod.default;
	}
	return posthogInstance;
}

export interface PostHogConfig {
	apiKey: string;
	apiHost?: string;
	uiHost?: string;
}

/**
 * Initialize PostHog with opt-out by default.
 * Call this once on app startup.
 */
export async function initPostHog(config: PostHogConfig): Promise<void> {
	if (initialized || typeof window === 'undefined') return;

	const posthog = await loadPosthogModule();
	posthog.init(config.apiKey, {
		api_host: 'https://ph.scanopy.net',
		ui_host: 'https://us.posthog.com',
		defaults: '2025-11-30',
		secure_cookie: true,
		persistence: 'localStorage+cookie',
		opt_out_capturing_by_default: !hasAnalyticsConsent(),
		opt_out_capturing_persistence_type: 'localStorage',
		capture_pageview: true,
		capture_pageleave: true,

		person_profiles: 'identified_only'
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
	if (!posthogInstance?.__loaded) return;
	posthogInstance.set_config({ persistence: 'localStorage+cookie' });
	posthogInstance.opt_in_capturing();
}

/**
 * Opt out of analytics tracking.
 */
export function optOutAnalytics(): void {
	if (!posthogInstance?.__loaded) return;
	posthogInstance.opt_out_capturing();
}

/**
 * Capture a pageview event.
 */
export function capturePageview(): void {
	if (!posthogInstance?.__loaded) return;
	posthogInstance.capture('$pageview');
}

/**
 * Check if PostHog is loaded and ready.
 */
export function isPostHogLoaded(): boolean {
	return posthogInstance?.__loaded ?? false;
}

/**
 * Get the PostHog instance for advanced usage.
 */
export function getPostHog(): PostHog | null {
	return posthogInstance;
}
