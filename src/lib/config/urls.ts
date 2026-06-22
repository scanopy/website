/**
 * Centralized Scanopy app URLs and UTM attribution for app-bound CTAs.
 *
 * Every link that sends a visitor from the marketing/docs site to the app
 * (`app.scanopy.net`) should be built through {@link appHref} (or {@link withUtm})
 * so the app's analytics can attribute the eventual sign-up back to the site
 * section, page, and CTA that drove it.
 *
 * Taxonomy (see docs/marketing UTM plan):
 *   utm_source   = the property (constant `scanopy_site`)
 *   utm_medium   = section            — home, nav, footer, pricing, blog, docs, guides, comparison, …
 *   utm_campaign = page slug          — derived from the route, scales automatically as content grows
 *   utm_content  = CTA position (+ A/B variant) — hero, navbar, footer-status, article-cta, …
 */

export const APP_BASE = 'https://app.scanopy.net';

export const APP = {
	/** Sign-up / start-trial entry point. */
	onboarding: `${APP_BASE}/onboarding`,
	/** Existing-user login. */
	login: `${APP_BASE}/login`,
	/** App root (dashboard). */
	app: APP_BASE,
	/** App root with the billing-plan modal pre-opened. */
	billingPlan: `${APP_BASE}/?modal=billing-plan`
} as const;

export const UTM_SOURCE = 'scanopy_site';

export interface Utm {
	/** Section of the site (utm_medium): home, nav, footer, pricing, blog, docs, guides, comparison, … */
	medium: string;
	/** Specific page / content unit (utm_campaign): the page slug or id. */
	campaign: string;
	/** CTA position, optionally with an A/B variant suffix (utm_content): hero, navbar, footer-status, … */
	content: string;
	/** Overrides the default `scanopy_site` source. */
	source?: string;
}

/**
 * Append `utm_*` params to a URL, preserving any existing query string
 * (e.g. the `?modal=billing-plan` on {@link APP.billingPlan}).
 */
export function withUtm(url: string, utm: Utm): string {
	const u = new URL(url);
	u.searchParams.set('utm_source', utm.source ?? UTM_SOURCE);
	u.searchParams.set('utm_medium', utm.medium);
	u.searchParams.set('utm_campaign', utm.campaign);
	u.searchParams.set('utm_content', utm.content);
	return u.toString();
}

/** Maps a top-level route segment to a stable `utm_medium` value. */
const SECTION_MEDIUM: Record<string, string> = {
	blog: 'blog',
	comparisons: 'comparison',
	docs: 'docs',
	guides: 'guides',
	pricing: 'pricing',
	about: 'about',
	changelog: 'changelog',
	roadmap: 'roadmap',
	services: 'services',
	community: 'community',
	press: 'press',
	showcase: 'showcase'
};

/**
 * Derive `{ medium (section), campaign (page slug) }` from a route pathname.
 *
 * This is what makes the scheme scale: a new comparison page at
 * `/comparisons/vs-foo` automatically yields `medium=comparison`, `campaign=vs-foo`
 * with no per-page tagging.
 */
export function utmFromPath(pathname: string): { medium: string; campaign: string } {
	const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

	if (segments.length === 0) {
		return { medium: 'home', campaign: 'homepage' };
	}

	const [section, ...rest] = segments;
	const medium = SECTION_MEDIUM[section] ?? section;
	const campaign = rest.length > 0 ? rest.join('/') : section;
	return { medium, campaign };
}

/**
 * Build an app-bound href with UTM attribution derived from the current route.
 *
 * @param dest      one of the {@link APP} URLs
 * @param pathname  the current route (e.g. `page.url.pathname`)
 * @param content   the CTA position, e.g. `hero`, `navbar`, `footer-status`
 * @param mediumOverride forces the section — use for chrome that appears on every
 *                       page (`nav`, `footer`) so the medium reflects the CTA surface
 *                       while the campaign still records the originating page.
 */
export function appHref(
	dest: string,
	pathname: string,
	content: string,
	mediumOverride?: string
): string {
	const { medium, campaign } = utmFromPath(pathname);
	return withUtm(dest, { medium: mediumOverride ?? medium, campaign, content });
}
