<script lang="ts">
	/**
	 * A "Get a license" link. Every one on the site renders through this component so the
	 * target (licenseHref) and the cta_clicked event stay identical everywhere.
	 */
	import { page } from '$app/state';
	import { LICENSE_CTA_LABEL } from '$lib/config/cta';
	import { licenseHref, trackLicenseClick } from '$lib/licensePath.svelte';

	interface Props {
		/** cta_clicked `location`, e.g. `navbar`, `about_cta`. */
		location: string;
		class?: string;
		/** utm_content; defaults to `location` with hyphens. */
		content?: string;
		/** utm_medium override for chrome that appears on every page (e.g. `nav`). */
		medium?: string;
		/** Append a right arrow, for inline text links. */
		arrow?: boolean;
		/** Runs after tracking, e.g. to close the mobile menu. */
		onclick?: () => void;
	}

	let {
		location,
		class: className = '',
		content,
		medium,
		arrow = false,
		onclick
	}: Props = $props();

	const href = $derived(
		licenseHref(page.url.pathname, content ?? location.replaceAll('_', '-'), medium)
	);
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class={className}
	onclick={() => {
		trackLicenseClick(location);
		onclick?.();
	}}
>
	{LICENSE_CTA_LABEL}{#if arrow}&nbsp;&rarr;{/if}
</a>
