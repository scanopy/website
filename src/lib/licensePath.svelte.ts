import { analytics } from '$lib/analytics.svelte';
import { LICENSE_CTA_LABEL } from '$lib/config/cta';
import { APP, appHref } from '$lib/config/urls';

/**
 * State for the site's one contact modal, mounted in the root layout. The pricing widget's
 * Enterprise "Request Information" opens it through openContactModal().
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

/** App signup, tagged as a self-hosted license signup. */
const LICENSE_SIGNUP_URL = `${APP.onboarding}?hosting=self_hosted`;

/**
 * Where every "Get a license" CTA goes: app signup tagged `hosting=self_hosted`, plus UTM
 * tags for the page (`pathname`) and the CTA position (`content`).
 */
export function licenseHref(pathname: string, content: string, medium?: string): string {
	return appHref(LICENSE_SIGNUP_URL, pathname, content, medium);
}

/** Record a "Get a license" click. */
export function trackLicenseClick(location: string, planType?: string) {
	analytics.ctaClicked({
		location,
		destination: 'self_hosted',
		text: LICENSE_CTA_LABEL,
		...(planType ? { plan: planType } : {})
	});
}

/**
 * For license buttons that can't be links (the pricing widget's plan cards): record the
 * click, then open app signup in a new tab.
 */
export function openLicenseSignup({
	location,
	content,
	planType
}: {
	location: string;
	content: string;
	planType?: string;
}) {
	trackLicenseClick(location, planType);
	window.open(licenseHref(window.location.pathname, content), '_blank', 'noopener,noreferrer');
}
