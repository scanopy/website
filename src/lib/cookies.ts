/**
 * Shared cookie utilities for use across main site and docs.
 */

export const GDPR_COOKIE_NAME = 'scanopy_gdpr';
export const GDPR_COOKIE_DAYS = 365;

/**
 * Get the cookie domain based on hostname.
 * Returns '.scanopy.net' in production for cross-subdomain sharing.
 */
export function getCookieDomain(): string {
	if (typeof window === 'undefined') return '';
	return window.location.hostname.includes('scanopy.net') ? '.scanopy.net' : '';
}

/**
 * Get a cookie value by name.
 */
export function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Set a cookie with the given name, value, and expiration days.
 */
export function setCookie(name: string, value: string, days: number, domain?: string): void {
	if (typeof document === 'undefined') return;
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	const domainStr = domain ? `; domain=${domain}` : '';
	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domainStr}; SameSite=Lax`;
}

export interface CookiePreferences {
	necessary: boolean;
	analytics: boolean;
}

/**
 * Get the saved GDPR cookie preferences.
 */
export function getGdprPreferences(): CookiePreferences | null {
	const saved = getCookie(GDPR_COOKIE_NAME);
	if (!saved) return null;
	try {
		return JSON.parse(saved) as CookiePreferences;
	} catch {
		return null;
	}
}

/**
 * Save GDPR cookie preferences.
 */
export function saveGdprPreferences(prefs: CookiePreferences): void {
	setCookie(GDPR_COOKIE_NAME, JSON.stringify(prefs), GDPR_COOKIE_DAYS, getCookieDomain());
}

/**
 * Check if user has consented to analytics.
 */
export function hasAnalyticsConsent(): boolean {
	const prefs = getGdprPreferences();
	return prefs?.analytics ?? false;
}

/**
 * Check if user has made any GDPR decision.
 */
export function hasGdprDecision(): boolean {
	return getGdprPreferences() !== null;
}
