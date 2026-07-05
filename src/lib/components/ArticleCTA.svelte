<script lang="ts">
	import { page } from '$app/state';
	import { APP, appHref, withUtm, utmFromPath } from '$lib/config/urls';
	import { analytics } from '$lib/analytics.svelte';

	interface Props {
		heading?: string;
		description?: string;
	}

	let {
		heading = 'See what Scanopy builds',
		description = 'Scanopy deploys a lightweight daemon that discovers your network and builds a live topology map. No per-device fees, unlimited hosts. It pairs with whatever monitoring tool you already use.'
	}: Props = $props();

	// Research-intent readers get the demo first: a real topology map in one
	// click, no signup. Trial and pricing are the follow-on paths.
	const demoHref = $derived(
		withUtm('https://demo.scanopy.net', {
			...utmFromPath(page.url.pathname),
			content: 'article-cta'
		})
	);
</script>

<div class="mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
	<h3 class="mb-3 text-lg font-semibold text-white">{heading}</h3>
	<p class="mb-5 text-sm leading-relaxed text-gray-400">{description}</p>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<a
			href={demoHref}
			target="_blank"
			rel="noopener noreferrer"
			class="btn-primary"
			onclick={() =>
				analytics.ctaClicked({
					location: 'article_cta',
					destination: 'demo',
					text: 'Explore the live demo'
				})}>Explore the live demo</a
		>
		<a
			href={appHref(APP.onboarding, page.url.pathname, 'article-cta')}
			target="_blank"
			rel="noopener noreferrer"
			class="text-gray-400 transition-colors hover:text-white"
			onclick={() =>
				analytics.ctaClicked({
					location: 'article_cta',
					destination: 'app_onboarding',
					text: 'Try Scanopy free'
				})}>Try Scanopy free</a
		>
		<a href="/pricing" class="text-gray-400 transition-colors hover:text-white"
			>Pricing &amp; editions</a
		>
	</div>
</div>
