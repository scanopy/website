import { analytics } from '$lib/analytics.svelte';
import { LICENSE_CTA_LABEL } from '$lib/config/cta';

/**
 * State for the site's one contact modal, mounted in the root layout. Pages open it through
 * startLicensePath() (self-hosted licenses) or openContactModal() (Enterprise inquiries).
 */
export const contactModal = $state({ open: false, planType: '', planName: '' });

export function openContactModal(planType: string, planName: string) {
	contactModal.planType = planType;
	contactModal.planName = planName;
	contactModal.open = true;
}

export function closeContactModal() {
	contactModal.open = false;
}

/**
 * The license path. Every "Get a license" action on the site calls this.
 *
 * LICENSE PORTAL SWITCH: when app.scanopy.net ships self-serve license keys and its
 * /onboarding reads `hosting=self_hosted`, replace the openContactModal() call below with:
 *
 *   window.open(
 *     appHref(`${APP.onboarding}?hosting=self_hosted`, window.location.pathname, location),
 *     '_blank',
 *     'noopener,noreferrer'
 *   );
 *
 * (`APP` and `appHref` come from $lib/config/urls; appHref keeps the query and adds the
 * utm_* tags.) Nothing else on the site needs to change.
 */
export function startLicensePath({
	planType,
	planName,
	location
}: {
	planType: string;
	planName: string;
	location: string;
}) {
	analytics.ctaClicked({
		location,
		destination: 'self_hosted',
		text: LICENSE_CTA_LABEL,
		plan: planType
	});
	openContactModal(planType, planName);
}
