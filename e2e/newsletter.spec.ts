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
 * CAVEAT: the newsletter form has reCAPTCHA v3 enforcement enabled in Brevo,
 * which (verified July 2026) always rejects automated browsers regardless of
 * headed/headless mode — Brevo's own hosted form uses the same site key and
 * action, so this is score-based bot protection, not a config mismatch. This
 * test therefore verifies everything up to that boundary: the form renders,
 * clicking Subscribe fires the POST (the "click does nothing" failure mode),
 * Brevo receives and parses the submission, and the UI gives the user
 * feedback. If Brevo ever accepts (captcha relaxed), the success UI is
 * asserted too. See README "Form Monitoring".
 */
test('footer newsletter signup reaches Brevo and shows UI feedback', async ({ page, context }) => {
	await seedCookieConsent(context);
	await gotoHydrated(page, '/');

	const footer = page.locator('footer');
	// The email input has no id/name attribute — placeholder is the stable hook.
	const emailInput = footer.getByPlaceholder('Enter your email');
	await expect(emailInput, 'newsletter form missing from footer').toBeVisible();
	await emailInput.fill(sentinelEmail());

	const outcome = await submitAndExpectBrevoSuccess(
		page,
		() => footer.getByRole('button', { name: 'Subscribe' }).click(),
		{ allowCaptchaRejection: true }
	);

	if (outcome === 'accepted') {
		// Success state replaces the form (typographic apostrophe in prod markup).
		await expect(footer.getByText(/You.re subscribed!/)).toBeVisible();
	} else {
		// Brevo's bot protection rejected our automated submission (expected).
		// The user-visible contract still holds: the UI must respond, not sit
		// silent — the component surfaces this as its generic error message.
		await expect(
			footer.getByText('Something went wrong. Please try again.'),
			'no UI feedback after submit — user would see nothing happen'
		).toBeVisible();
	}
});
