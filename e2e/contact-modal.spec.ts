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
 * layout. Its only trigger is the pricing widget's Enterprise "Request Information"
 * (openContactModal in src/lib/licensePath.svelte.ts). Every "Get a license" CTA links to
 * app signup instead, so there is no license form to monitor.
 *
 * NOTE: against production the test submits a real (sentinel) inquiry. The function creates
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

test('/pricing Enterprise "Request Information" form submits to Apollo and shows success state', async ({
	page
}) => {
	// Enterprise renders on both hosting tabs; the widget opens on Self-Hosted.
	await gotoHydrated(page, '/pricing');
	await page.getByRole('button', { name: 'Request Information' }).click();
	await openFillAndSubmit(page);
});
