<script lang="ts">
	import { Rocket } from 'lucide-svelte';
	import type { FeatureMetadata } from '$lib/types';
	import featuresData from '$lib/fixtures/features.json';
	import { analytics } from '$lib/analytics.svelte';

	interface FeatureFixture {
		id: string;
		name: string;
		description: string;
		category: string;
		icon: string | null;
		color: string | null;
		metadata: FeatureMetadata;
	}

	const features = featuresData as FeatureFixture[];

	// Filter to only coming soon features
	const comingSoonFeatures = features.filter((f) => f.metadata.is_coming_soon);

	// Group by category
	const groupedFeatures = comingSoonFeatures.reduce(
		(acc, feature) => {
			const category = feature.category;
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(feature);
			return acc;
		},
		{} as Record<string, FeatureFixture[]>
	);

	const sortedCategories = Object.keys(groupedFeatures).sort();
</script>

<svelte:head>
	<title>Product Roadmap - Scanopy</title>
	<meta
		name="description"
		content="See what's coming next to Scanopy. Our product roadmap shows upcoming features and improvements."
	/>
	<link rel="canonical" href="https://scanopy.net/roadmap" />

	<meta property="og:title" content="Product Roadmap - Scanopy" />
	<meta
		property="og:description"
		content="See what's coming next to Scanopy. Our product roadmap shows upcoming features and improvements."
	/>
	<meta property="og:url" content="https://scanopy.net/roadmap" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Product Roadmap - Scanopy" />
	<meta
		name="twitter:description"
		content="See what's coming next to Scanopy. Our product roadmap shows upcoming features and improvements."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<div class="mb-4 flex justify-center">
				<Rocket class="h-12 w-12 text-blue-400" />
			</div>
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Roadmap</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-400">
				See what's coming next to Scanopy. These features are currently in development. Some
				features will not be available for all plans.
			</p>
			<p class="mx-auto mt-4 max-w-2xl text-gray-500">
				Features are prioritized based on community feedback, GitHub issues, and what we hear from
				users on Discord and Reddit. Have a use case that isn't covered? Open a feature request and
				we'll evaluate it for the roadmap. Most features below are driven by real user requests.
			</p>
		</div>

		{#if comingSoonFeatures.length === 0}
			<div class="text-center">
				<p class="text-gray-400">All planned features have been shipped! Check back soon.</p>
			</div>
		{:else}
			<div class="mx-auto max-w-3xl space-y-8">
				{#each sortedCategories as category (category)}
					<div>
						<h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
							{category}
						</h2>
						<div class="space-y-4">
							{#each groupedFeatures[category] as feature (feature.id)}
								<button
									type="button"
									class="card w-full cursor-pointer p-6 text-left transition-colors hover:border-blue-500/50"
									onclick={() =>
										analytics.roadmapItemClicked({
											feature_id: feature.id,
											feature_name: feature.name,
											category
										})}
								>
									<h3 class="mb-2 text-lg font-semibold text-white">{feature.name}</h3>
									<p class="text-gray-400">{feature.description}</p>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-16 text-center">
			<p class="mb-4 text-gray-400">Have a feature request?</p>
			<a
				href="https://github.com/scanopy/scanopy/issues/new?template=feature_request.md"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
				onclick={() => analytics.featureRequestClicked()}
			>
				Request a Feature
			</a>
		</div>
	</div>
</section>
