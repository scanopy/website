/**
 * Shared Apollo.io website tracker utilities for use across main site and docs.
 * Loaded only with marketing consent; see CookieConsent.
 */

export const APOLLO_APP_ID = '6aa40fde642087001040b506';

// Everything the tracker writes to localStorage (it sets no cookies).
const STORAGE_KEYS = [
	'apolloAnonId',
	`${APOLLO_APP_ID}_eventQueue`,
	`${APOLLO_APP_ID}_canTrack`,
	'liveIntentData'
];

declare global {
	interface Window {
		trackingFunctions?: { onLoad: (opts: { appId: string }) => void };
		__scanopyApolloLoaded?: boolean;
	}
}

/**
 * Inject the tracker at most once per page load. Mirrors the snippet from
 * Apollo's install tool, including its cache-busting query param.
 */
export function loadApollo(): void {
	if (typeof window === 'undefined' || window.__scanopyApolloLoaded) return;
	window.__scanopyApolloLoaded = true;

	const nocache = Math.random().toString(36).substring(7);
	const script = document.createElement('script');
	script.src = `https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=${nocache}`;
	script.async = true;
	script.defer = true;
	script.onload = () => window.trackingFunctions?.onLoad({ appId: APOLLO_APP_ID });
	document.head.appendChild(script);
}

/**
 * Check if the tracker was injected during this page load.
 */
export function isApolloLoaded(): boolean {
	return typeof window !== 'undefined' && window.__scanopyApolloLoaded === true;
}

/**
 * Remove the tracker's visitor ID and queued events.
 */
export function clearApolloStorage(): void {
	try {
		for (const key of STORAGE_KEYS) localStorage.removeItem(key);
	} catch {
		/* storage blocked */
	}
}
