/**
 * Centralized Scanopy app URLs and UTM attribution for app-bound links in the
 * docs app. Mirrors `src/lib/config/urls.ts` in the marketing site so links
 * leaving for `app.scanopy.net` carry consistent attribution.
 *
 *   utm_source   = scanopy_site
 *   utm_medium   = docs
 *   utm_campaign = page slug / surface
 *   utm_content  = link position
 */

export const APP_BASE = 'https://app.scanopy.net';

/**
 * Canonical origin of the docs site. Next applies `basePath: '/docs'` to `<Link>`
 * and to metadata automatically, but not to plain strings we write into a Response
 * body (llms.txt, llms-full.txt) or a sitemap entry — those must carry it themselves.
 */
export const DOCS_BASE = 'https://scanopy.net/docs';

/** Absolute, trailing-slashed URL for a page's slugs (the app sets `trailingSlash: true`). */
export function docsUrl(slugs: string[]): string {
	return slugs.length === 0 ? `${DOCS_BASE}/` : `${DOCS_BASE}/${slugs.join('/')}/`;
}

/**
 * Rewrite root-relative markdown links to absolute docs URLs.
 *
 * Content links are authored relative to the fumadocs source (`/quick-start/`) and
 * only resolve because Next prepends the basePath when rendering a page. Plain-text
 * output gets no such rewriting, so those links 404 for anything reading the file.
 * Anchors, external and protocol-relative URLs are left alone.
 */
export function absolutizeDocsLinks(markdown: string): string {
	return markdown.replace(
		/\]\((\/(?!\/)[^)\s]*)\)/g,
		(_full, path: string) => `](${DOCS_BASE}${path})`
	);
}

export const APP = {
	onboarding: `${APP_BASE}/onboarding`,
	login: `${APP_BASE}/login`,
	app: APP_BASE
} as const;

export const UTM_SOURCE = 'scanopy_site';

export interface Utm {
	medium: string;
	campaign: string;
	content: string;
	source?: string;
}

/** Append `utm_*` params to a URL, preserving any existing query string. */
export function withUtm(url: string, utm: Utm): string {
	const u = new URL(url);
	u.searchParams.set('utm_source', utm.source ?? UTM_SOURCE);
	u.searchParams.set('utm_medium', utm.medium);
	u.searchParams.set('utm_campaign', utm.campaign);
	u.searchParams.set('utm_content', utm.content);
	return u.toString();
}
