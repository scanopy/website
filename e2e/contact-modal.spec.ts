import { expect, test, type Page } from '@playwright/test';
import {
	expectContactSuccess,
	fillContactModal,
	gotoHydrated,
	seedCookieConsent,
	submitAndExpectContactSuccess
} from './helpers';

/**
 * Contact modal (Apollo, via /api/contact): ContactModal.svelte, mounted once in the root
 * layout and opened through src/lib/licensePath.svelte.ts. Three trigger wirings reach it:
 * /commercial's "Get a license" buttons and the pricing widget's self-hosted "Get a license"
 * cards (both through startLicensePath), and the pricing widget's Enterprise "Request
 * Information" (openContactModal). A page- or branch-specific JS error can break one while
 * the others keep working (the June 2026 silent failure was on /commercial), so each trigger
 * path gets a full real submission.
 *
 * NOTE: against production each test submits a real (sentinel) inquiry. The function creates
 * an Apollo contact labeled "Form monitor" and skips the owner task. Runs against any other
 * E2E_BASE_URL answer /api/contact locally (see submitAndExpectContactSuccess).
 */

async function openFillAndSubmit(page: Page) {
	const dialog = page.getByRole('dialog');
	await expect(dialog, 'contact modal did not open').toBeVisible();
	await fillContactModal(dialog);
	await submitAndExpectContactSuccess(page, () =>
		dialog.getByRole('button', { name: 'Submit' }).click()
	);
	await expectContactSuccess(dialog);
}

test.beforeEach(async ({ context }) => {
	await seedCookieConsent(context);
});

test('/commercial "Get a license" form submits to Apollo and shows success state', async ({
	page
}) => {
	// The page whose form silently failed in June 2026 (planType CommercialSelfHosted).
	// Four buttons share the name (hero, two plan cards, closing CTA); the hero comes first.
	await gotoHydrated(page, '/commercial');
	await page.getByRole('button', { name: 'Get a license' }).first().click();
	await openFillAndSubmit(page);
});

test('/pricing Enterprise "Request Information" form submits to Apollo and shows success state', async ({
	page
}) => {
	// Enterprise renders on both hosting tabs; the widget opens on Self-Hosted.
	await gotoHydrated(page, '/pricing');
	await page.getByRole('button', { name: 'Request Information' }).click();
	await openFillAndSubmit(page);
});

test('/pricing Self-Hosted "Get a license" form submits to Apollo and shows success state', async ({
	page
}) => {
	// The widget's contact-flow CTA (purchase_flow 'contact'), a different branch from
	// Enterprise's "Request Information", with a self-hosted planType. The widget opens on
	// Self-Hosted, so the test switches to Cloud and back to exercise the hosting toggle.
	// Two cards render on that tab (SelfHostedStandard, SelfHostedPlus), hence .first().
	await gotoHydrated(page, '/pricing');
	await page.getByRole('button', { name: 'Cloud', exact: true }).click();
	await page.getByRole('button', { name: 'Self-Hosted', exact: true }).click();
	await page.getByRole('button', { name: 'Get a license' }).first().click();
	await openFillAndSubmit(page);
});
