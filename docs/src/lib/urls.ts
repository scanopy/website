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

export const APP = {
  onboarding: `${APP_BASE}/onboarding`,
  login: `${APP_BASE}/login`,
  app: APP_BASE,
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
