<script lang="ts">
	import { page } from '$app/state';
	import { withUtm, utmFromPath } from '$lib/config/urls';
	import { analytics } from '$lib/analytics.svelte';
	import {
		DEMO_BOOKING_URL,
		DEMO_CTA_LABEL,
		PRICING_CTA_LABEL,
		PRICING_HREF
	} from '$lib/config/cta';
	import StickyCtaBar, { type StickyCta } from '$lib/components/StickyCtaBar.svelte';

	// Two commercial actions, book a demo or see pricing, with the demo instance as a
	// text link below them. The CTAs describe themselves, so there's no
	// heading or prose.
	const demoHref = $derived(
		withUtm('https://demo.scanopy.net', {
			...utmFromPath(page.url.pathname),
			content: 'article-cta'
		})
	);

	// The persistent bottom bar mirrors the two buttons and hides once this footer box
	// scrolls into view.
	let ctaBox = $state<HTMLDivElement>();

	const barCtas: StickyCta[] = [
		{
			label: DEMO_CTA_LABEL,
			href: DEMO_BOOKING_URL,
			variant: 'primary',
			external: true,
			onclick: () =>
				analytics.ctaClicked({
					location: 'article_bottom_bar',
					destination: 'talk_to_sales',
					text: DEMO_CTA_LABEL
				})
		},
		{
			label: PRICING_CTA_LABEL,
			href: PRICING_HREF,
			variant: 'secondary',
			onclick: () =>
				analytics.ctaClicked({
					location: 'article_bottom_bar',
					destination: 'pricing',
					text: PRICING_CTA_LABEL
				})
		}
	];
</script>

<div bind:this={ctaBox} class="cta-box mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
	<a
		href={DEMO_BOOKING_URL}
		target="_blank"
		rel="noopener noreferrer"
		class="btn-primary"
		onclick={() =>
			analytics.ctaClicked({
				location: 'article_cta',
				destination: 'talk_to_sales',
				text: DEMO_CTA_LABEL
			})}>{DEMO_CTA_LABEL}</a
	>
	<a
		href={PRICING_HREF}
		class="btn-secondary"
		onclick={() =>
			analytics.ctaClicked({
				location: 'article_cta',
				destination: 'pricing',
				text: PRICING_CTA_LABEL
			})}>{PRICING_CTA_LABEL}</a
	>
	<a
		href={demoHref}
		target="_blank"
		rel="noopener noreferrer"
		class="demo-link text-sm text-gray-500 transition-colors hover:text-blue-400"
		onclick={() =>
			analytics.ctaClicked({
				location: 'article_cta',
				destination: 'demo',
				text: 'Explore Live Demo'
			})}>Explore Live Demo &rarr;</a
	>
</div>

<StickyCtaBar target={ctaBox} ctas={barCtas} ariaLabel="Explore Scanopy" />

<style>
	/* Footer CTA: two self-describing actions spanning the full width of the
	   article's bottom, with the demo-instance link centered under them. */
	.cta-box {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.cta-box :global(.btn-primary),
	.cta-box :global(.btn-secondary) {
		flex: 1;
	}

	.demo-link {
		align-self: center;
	}
</style>
