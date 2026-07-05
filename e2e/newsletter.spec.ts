import { expect, test } from '@playwright/test';
import {
	gotoHydrated,
	seedCookieConsent,
	sentinelEmail,
	submitAndExpectBrevoSuccess
} from './helpers';

/**
 * Newsletter signup (Brevo) — NewsletterSignup.svelte, rendered in the footer
 * of every page via Footer.svelte. Tested once on the home page since the
 * footer is identical sitewide.
 *
 * Fully end-to-end since July 2026, when reCAPTCHA enforcement was turned off
 * in Brevo (automated browsers can't pass reCAPTCHA v3, so it blocked this
 * monitor). If Brevo ever rejects with a captcha error again, enforcement was
 * re-enabled — see README "Form Monitoring".
 *
 * NOTE: submits a real (sentinel) subscription to production Brevo.
 */
test('footer newsletter signup submits to Brevo and shows success state', async ({
	page,
	context
}) => {
	await seedCookieConsent(context);
	await gotoHydrated(page, '/');

	const footer = page.locator('footer');
	// The email input has no id/name attribute — placeholder is the stable hook.
	const emailInput = footer.getByPlaceholder('Enter your email');
	await expect(emailInput, 'newsletter form missing from footer').toBeVisible();
	await emailInput.fill(sentinelEmail());

	await submitAndExpectBrevoSuccess(page, () =>
		footer.getByRole('button', { name: 'Subscribe' }).click()
	);

	// Success state replaces the form (typographic apostrophe in prod markup).
	await expect(footer.getByText(/You.re subscribed!/)).toBeVisible();
});
