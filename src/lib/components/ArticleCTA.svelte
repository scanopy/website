<script lang="ts">
	import { page } from '$app/state';
	import { APP, appHref } from '$lib/config/urls';
	import { analytics } from '$lib/analytics.svelte';

	interface Props {
		heading?: string;
		description?: string;
	}

	let {
		heading = 'Try Scanopy',
		description = 'Scanopy deploys a lightweight daemon that discovers your network and builds a live topology map. No per-device fees, unlimited hosts. It pairs with whatever monitoring tool you already use.'
	}: Props = $props();
</script>

<div class="mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
	<h3 class="mb-3 text-lg font-semibold text-white">{heading}</h3>
	<p class="mb-5 text-sm leading-relaxed text-gray-400">{description}</p>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<a
			href={appHref(APP.onboarding, page.url.pathname, 'article-cta')}
			target="_blank"
			rel="noopener noreferrer"
			class="btn-primary"
			onclick={() =>
				analytics.ctaClicked({
					location: 'article_cta',
					destination: 'app_onboarding',
					text: 'Try Scanopy free'
				})}>Try Scanopy free</a
		>
		<a href="/pricing" class="text-gray-400 transition-colors hover:text-white">View pricing</a>
		<a href="/commercial" class="text-gray-400 transition-colors hover:text-white"
			>Commercial edition</a
		>
		<a href="/community" class="text-gray-400 transition-colors hover:text-white"
			>Community edition</a
		>
		<a href="/docs" class="text-gray-400 transition-colors hover:text-white">Read the docs</a>
	</div>
</div>
