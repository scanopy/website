<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { solutionNav } from '$lib/landing';

	const title = 'Solutions - Scanopy';
	const description =
		'How teams that manage infrastructure use Scanopy. Each solution starts from the same network map and inventory, kept current on a schedule, and puts it to work for a specific job.';

	// Each entry is a job the network map does, not a feature. The list lives in $lib/landing
	// so the nav, footer, and this hub stay in step.
	const solutions = solutionNav.map((s) => ({ name: s.label, href: s.href, blurb: s.blurb }));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://scanopy.net/solutions" />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://scanopy.net/solutions" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: title,
		description,
		url: 'https://scanopy.net/solutions'
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://scanopy.net/' },
			{ '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://scanopy.net/solutions' }
		]
	})}</script>`}
</svelte:head>

<div class="home-bands">
	<!-- Hero -->
	<section class="py-20">
		<div class="container mx-auto max-w-3xl px-4 text-center">
			<h1 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				One network map, put to work.
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
				Scanopy discovers your network and keeps the map and inventory current on a schedule.
			</p>
		</div>
	</section>

	<!-- Solution cards -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
				{#each solutions as s (s.name)}
					<a href={s.href} class="card flex flex-col p-6">
						<span class="text-xl font-semibold text-white">{s.name}</span>
						<span class="mt-3 leading-relaxed text-gray-400">{s.blurb}</span>
						<span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-400">
							Explore <ArrowRight class="h-4 w-4" />
						</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
</div>

<style>
	.home-bands :global(section:nth-of-type(even)) {
		background-color: rgb(var(--c-gray-900) / 0.5);
	}
</style>
