import { expect, type BrowserContext, type Locator, type Page } from '@playwright/test';

/**
 * Sentinel convention for production form monitoring.
 *
 * Every submission this suite makes is marked so Brevo segments, Gmail
 * filters, and humans reading the lead list can identify and discard it.
 * See README "Form Monitoring" before changing any of these values —
 * downstream filters key on them.
 */
/** The site under test: production unless E2E_BASE_URL points elsewhere (e.g. a local preview). */
export const BASE_URL = process.env.E2E_BASE_URL ?? 'https://scanopy.net';
const IS_PRODUCTION = new URL(BASE_URL).hostname.endsWith('scanopy.net');

export const SENTINEL_NAME = 'AUTOMATED TEST';
export const SENTINEL_MESSAGE = 'AUTOMATED TEST - weekly production form monitor. Please ignore.';

/** formtest+YYYYMMDD@scanopy.net (UTC date). */
export function sentinelEmail(): string {
	const d = new Date();
	const ymd = [
		d.getUTCFullYear(),
		String(d.getUTCMonth() + 1).padStart(2, '0'),
		String(d.getUTCDate()).padStart(2, '0')
	].join('');
	return `formtest+${ymd}@scanopy.net`;
}

/**
 * Pre-seed the GDPR consent cookie so the cookie banner (fixed, z-index 9999,
 * bottom of viewport) never renders and can't intercept clicks on the footer
 * newsletter form. analytics:false also keeps PostHog from recording monitor
 * traffic. Cookie name/format must match src/lib/cookies.ts. On production the
 * cookie is set for .scanopy.net; on any other BASE_URL, for that host.
 */
export async function seedCookieConsent(context: BrowserContext): Promise<void> {
	const name = 'scanopy_gdpr';
	const value = encodeURIComponent(
		JSON.stringify({ necessary: true, analytics: false, marketing: false, version: 2 })
	);
	await context.addCookies([
		IS_PRODUCTION
			? { name, value, domain: '.scanopy.net', path: '/' }
			: { name, value, url: BASE_URL }
	]);
}

/**
 * Navigate and wait until the page has settled (network idle). The site is
 * prerendered static HTML: forms are VISIBLE before SvelteKit hydration has
 * attached their submit handlers, and a click in that window silently does
 * nothing — which would false-positive the exact failure mode this suite
 * monitors for. Network idle is a reliable proxy for "hydration finished"
 * here (analytics is disabled by the seeded consent cookie, so no long-poll
 * traffic keeps the network busy).
 */
export async function gotoHydrated(page: Page, path: string): Promise<void> {
	await page.goto(path);
	await page.waitForLoadState('networkidle');
}

/**
 * Click submit and assert the full happy path against Brevo:
 *   1. a POST to sibforms.com/serve actually fires (the June 2026 failure was
 *      "click does nothing" — this catches broken/unwired submit handlers),
 *   2. it returns HTTP 2xx,
 *   3. the JSON body says success:true.
 *
 * The response listener is armed BEFORE the click so the response can't be
 * missed, and matches ANY status so a 4xx/5xx produces a status assertion
 * instead of an opaque timeout. Each failure mode gets a distinct message so
 * a red CI run is diagnosable from the assertion text alone.
 */
export async function submitAndExpectBrevoSuccess(
	page: Page,
	submit: () => Promise<void>,
	{ timeoutMs = 25_000 }: { timeoutMs?: number } = {}
): Promise<void> {
	const responsePromise = page.waitForResponse(
		(r) => r.url().includes('sibforms.com/serve') && r.request().method() === 'POST',
		{ timeout: timeoutMs }
	);

	await submit();

	let response;
	try {
		response = await responsePromise;
	} catch {
		throw new Error(
			`FORM DID NOT SUBMIT: no POST to sibforms.com/serve within ${timeoutMs}ms of clicking ` +
				`submit. This is the "click does nothing" failure mode (broken page JS or unwired ` +
				`submit handler). Check the trace for console errors.`
		);
	}

	const body = await response.text();
	const slice = body.slice(0, 500);

	let json: { success?: boolean; errors?: Record<string, string> };
	try {
		json = JSON.parse(body);
	} catch {
		throw new Error(`BREVO RESPONSE NOT JSON (status ${response.status()}): ${slice}`);
	}

	expect(
		response.ok(),
		`BREVO HTTP ERROR ${response.status()} from ${response.url()}. Body: ${slice}`
	).toBe(true);

	expect(
		json.success,
		`BREVO REJECTED SUBMISSION: ${slice} — a captcha error here means reCAPTCHA enforcement ` +
			`was re-enabled in Brevo, which automated browsers cannot pass; see the README ` +
			`"Form Monitoring" section.`
	).toBe(true);
}

/**
 * Click submit on the contact modal and assert the full happy path against our
 * /api/contact function (functions/api/contact.ts), which creates the Apollo
 * contact:
 *   1. a POST to /api/contact actually fires (catches broken/unwired handlers),
 *   2. it returns HTTP 2xx,
 *   3. the JSON body says success:true.
 *
 * Armed before the click and matching any status, for the same reasons as
 * submitAndExpectBrevoSuccess.
 */
export async function submitAndExpectContactSuccess(
	page: Page,
	submit: () => Promise<void>,
	{ timeoutMs = 25_000 }: { timeoutMs?: number } = {}
): Promise<void> {
	// A static build served locally has no Pages Function behind /api/contact, so runs
	// off production answer it here with the function's success shape. Production
	// runs always reach the real function.
	if (!IS_PRODUCTION) {
		await page.route('**/api/contact', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			})
		);
	}

	const responsePromise = page.waitForResponse(
		(r) => new URL(r.url()).pathname === '/api/contact' && r.request().method() === 'POST',
		{ timeout: timeoutMs }
	);

	await submit();

	let response;
	try {
		response = await responsePromise;
	} catch {
		throw new Error(
			`FORM DID NOT SUBMIT: no POST to /api/contact within ${timeoutMs}ms of clicking ` +
				`submit. This is the "click does nothing" failure mode (broken page JS or unwired ` +
				`submit handler). Check the trace for console errors.`
		);
	}

	const body = await response.text();
	const slice = body.slice(0, 500);

	let json: { success?: boolean; fieldErrors?: Record<string, string> };
	try {
		json = JSON.parse(body);
	} catch {
		throw new Error(`CONTACT API RESPONSE NOT JSON (status ${response.status()}): ${slice}`);
	}

	expect(
		response.ok(),
		`CONTACT API HTTP ERROR ${response.status()}: ${slice}. A 502 means Apollo rejected the ` +
			`contact; check the function logs in Cloudflare Pages.`
	).toBe(true);

	expect(json.success, `CONTACT API REJECTED SUBMISSION: ${slice}`).toBe(true);
}

/**
 * Fill every visible field of the contact modal (ContactModal.svelte) with
 * sentinel data. Locators are scoped to the dialog. Field ids come from the
 * component; if a field is added there, add it here too.
 */
export async function fillContactModal(dialog: Locator): Promise<void> {
	await dialog.locator('#contact-email').fill(sentinelEmail());
	await dialog.locator('#contact-firstname').fill(SENTINEL_NAME);
	await dialog.locator('#contact-lastname').fill(SENTINEL_NAME);
	await dialog.locator('#contact-company').fill(SENTINEL_NAME);
	await dialog.locator('#contact-team-size').selectOption('1-10');
	await dialog.locator('#contact-urgency').selectOption('exploring');
	await dialog.locator('#contact-network-count').fill('1');
	await dialog.locator('#contact-use-case').fill(SENTINEL_MESSAGE);
}

/**
 * Assert the contact modal's success state — what a real prospect would see.
 */
export async function expectContactSuccess(dialog: Locator): Promise<void> {
	await expect(dialog.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
	await expect(dialog.getByText(/We.ve received your inquiry/)).toBeVisible();
}
