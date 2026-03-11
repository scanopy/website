<script lang="ts">
	import { PricingSection, FeaturedIn } from '$lib/components';
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import { onMount } from 'svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { getProductSchema } from '$lib/schemas';

	onMount(() => {
		analytics.pricingViewed({ referrer: document.referrer || undefined });
	});

	const productSchema = getProductSchema();
	const pressMentions = pressMentionsData as PressMention[];
</script>

<svelte:head>
	<title>Pricing - Scanopy</title>
	<meta
		name="description"
		content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments."
	/>
	<link rel="canonical" href="https://scanopy.net/pricing" />
	{@html `<script type="application/ld+json">${JSON.stringify(productSchema)}</script>`}
</svelte:head>

<section class="py-10 pb-24 lg:pb-10">
	<div class="container mx-auto px-2">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">
				Unlimited hosts. No per-device fees, ever.
			</h1>
			<p class="text-lg text-gray-400">Unlimited scans on every plan.</p>
		</div>

		<PricingSection showGithubStars={true} showHosting={true} />
	</div>
</section>

<FeaturedIn mentions={pressMentions} />
