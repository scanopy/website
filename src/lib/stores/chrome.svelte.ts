/**
 * Shared reactive state for the fixed "bottom chrome" — the article CTA bottom
 * bar and the cookie-consent banner/toggle. They both live at the bottom of the
 * viewport, so they need to coordinate:
 *   - the article bar hides while the cookie banner is open (no stacked bars)
 *   - the cookie toggle raises above the article bar while it is showing
 */
class ChromeState {
	/** The full-width cookie banner (or its settings modal) is currently open. */
	cookieBannerOpen = $state(false);
	/** The article CTA bottom bar is currently shown. */
	bottomBarVisible = $state(false);
	/** Measured height (px) of the bottom bar, so the cookie toggle can clear it. */
	bottomBarHeight = $state(0);
	/** An opt-out link asked the cookie banner to open its settings panel. */
	cookieSettingsRequested = $state(false);
}

export const chrome = new ChromeState();

/**
 * Open the cookie settings panel (the "Do Not Sell or Share" opt-out).
 */
export function requestCookieSettings(): void {
	chrome.cookieSettingsRequested = true;
}
