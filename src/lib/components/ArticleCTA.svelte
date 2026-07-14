<script lang="ts">
	import { page } from '$app/state';
	import { withUtm, utmFromPath } from '$lib/config/urls';
	import { analytics } from '$lib/analytics.svelte';
	import StickyCtaBar, { type StickyCta } from '$lib/components/StickyCtaBar.svelte';

	// Research-intent readers get the demo first: a real topology map in one
	// click, no signup. Pricing is the follow-on path. The two CTAs describe
	// themselves, so there's no heading or prose, just the choice.
	const demoHref = $derived(
		withUtm('https://demo.scanopy.net', {
			...utmFromPath(page.url.pathname),
			content: 'article-cta'
		})
	);

	// The persistent bottom bar mirrors these CTAs and hides once this footer box
	// scrolls into view.
	let ctaBox = $state<HTMLDivElement>();

	const barCtas: StickyCta[] = $derived([
		{
			label: 'Explore Live Demo',
			href: demoHref,
			variant: 'primary',
			external: true,
			onclick: () =>
				analytics.ctaClicked({
					location: 'article_bottom_bar',
					destination: 'demo',
					text: 'Explore Live Demo'
				})
		},
		{
			label: 'View Pricing',
			href: '/pricing',
			variant: 'secondary',
			onclick: () =>
				analytics.ctaClicked({
					location: 'article_bottom_bar',
					destination: 'pricing',
					text: 'View Pricing'
				})
		}
	]);
</script>

<div bind:this={ctaBox} class="cta-box mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
	<a
		href={demoHref}
		target="_blank"
		rel="noopener noreferrer"
		class="btn-primary"
		onclick={() =>
			analytics.ctaClicked({
				location: 'article_cta',
				destination: 'demo',
				text: 'Explore Live Demo'
			})}>Explore Live Demo</a
	>
	<a
		href="/pricing"
		class="btn-secondary"
		onclick={() =>
			analytics.ctaClicked({
				location: 'article_cta',
				destination: 'pricing',
				text: 'View Pricing'
			})}>View Pricing</a
	>
</div>

<StickyCtaBar target={ctaBox} ctas={barCtas} ariaLabel="Explore Scanopy" />

<style>
	/* Footer CTA: two self-describing actions spanning the full width of the
	   article's bottom. No heading, no prose. */
	.cta-box {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.cta-box :global(.btn-primary),
	.cta-box :global(.btn-secondary) {
		flex: 1;
	}
</style>
