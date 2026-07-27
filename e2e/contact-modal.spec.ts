import { expect, test, type Page } from '@playwright/test';
import {
	expectContactSuccess,
	fillContactModal,
	gotoHydrated,
	seedCookieConsent,
	submitAndExpectBrevoSuccess
} from './helpers';

/**
 * Contact/quote modal (Brevo) — ContactModal.svelte. One component, but three
 * separate trigger wirings across two pages and two modal instances:
 * /commercial's own <ContactModal> (commercial/+page.svelte), and the one
 * PricingSection renders for itself, reached via two different CTA branches
 * (Enterprise "Request Information" and the contact-flow "Get a license").
 * A page- or branch-specific JS error can break one while the others keep
 * working (the June 2026 silent failure was on /commercial), so each trigger
 * path gets a full real submission.
 *
 * NOTE: each test submits a real (sentinel) inquiry to production Brevo.
 */

async function openFillAndSubmit(page: Page) {
	const dialog = page.getByRole('dialog');
	await expect(dialog, 'contact modal did not open').toBeVisible();
	await fillContactModal(dialog);
	await submitAndExpectBrevoSuccess(page, () =>
		dialog.getByRole('button', { name: 'Submit' }).click()
	);
	await expectContactSuccess(dialog);
}

test.beforeEach(async ({ context }) => {
	await seedCookieConsent(context);
});

test('/commercial "Request a Quote" form submits to Brevo and shows success state', async ({
	page
}) => {
	// The exact form that silently failed in June 2026 (planType CommercialSelfHosted).
	await gotoHydrated(page, '/commercial');
	await page.getByRole('button', { name: 'Request a Quote' }).first().click();
	await openFillAndSubmit(page);
});

test('/pricing Enterprise "Request Information" form submits to Brevo and shows success state', async ({
	page
}) => {
	// Enterprise is on the default (Cloud) tab of the pricing widget.
	await gotoHydrated(page, '/pricing');
	await page.getByRole('button', { name: 'Request Information' }).click();
	await openFillAndSubmit(page);
});

test('/pricing Self-Hosted "Get a license" form submits to Brevo and shows success state', async ({
	page
}) => {
	// The widget's contact-flow CTA (purchase_flow 'contact') — a different branch from
	// Enterprise's "Request Information", and a self-hosted planType. It sits behind the
	// hosting toggle, so this exercises the toggle too. Two cards render on that tab
	// (SelfHostedStandard, SelfHostedPlus), hence .first().
	await gotoHydrated(page, '/pricing');
	await page.getByRole('button', { name: 'Self-Hosted' }).click();
	await page.getByRole('button', { name: 'Get a license' }).first().click();
	await openFillAndSubmit(page);
});
