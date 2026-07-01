<script lang="ts">
	import { BookOpen } from 'lucide-svelte';

	interface Resource {
		title: string;
		description: string;
		date: string;
		keyword: string;
		slug: string;
	}

	interface PageData {
		resources: Resource[];
	}

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr + 'T12:00:00');
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Guides - Scanopy</title>
	<meta
		name="description"
		content="In-depth guides and reference on network documentation: automated discovery, topology mapping, integrations, and compliance."
	/>
	<link rel="canonical" href="https://scanopy.net/guides" />

	<meta property="og:title" content="Guides - Scanopy" />
	<meta
		property="og:description"
		content="In-depth guides and reference on network documentation: automated discovery, topology mapping, integrations, and compliance."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://scanopy.net/guides" />

	<meta property="og:image" content="https://scanopy.net/social.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Guides - Scanopy" />
	<meta
		name="twitter:description"
		content="In-depth guides and reference on network documentation: automated discovery, topology mapping, integrations, and compliance."
	/>
	<meta name="twitter:image" content="https://scanopy.net/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Guides - Scanopy',
		description:
			'In-depth guides and reference on network documentation: automated discovery, topology mapping, integrations, and compliance.',
		url: 'https://scanopy.net/guides',
		isPartOf: {
			'@type': 'WebSite',
			name: 'Scanopy',
			url: 'https://scanopy.net'
		},
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: data.resources.map((resource, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `https://scanopy.net/guides/${resource.slug}`,
				name: resource.title
			}))
		}
	})}</script>`}
</svelte:head>

<section class="py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<div class="mb-12 text-center">
			<div class="mb-4 flex justify-center">
				<BookOpen class="h-12 w-12 text-blue-400" />
			</div>
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Guides</h1>
			<p class="text-xl text-gray-400">
				In-depth, evergreen guides on documenting, mapping, and understanding your network.
			</p>
		</div>

		{#if data.resources.length === 0}
			<div class="text-center">
				<p class="text-gray-400">No guides yet. Check back soon!</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each data.resources as resource (resource.slug)}
					<article
						class="rounded-lg border border-gray-800 p-6 transition-colors hover:border-gray-700"
					>
						<a href="/guides/{resource.slug}" class="block">
							{#if resource.date}
								<time class="text-sm text-gray-500" datetime={resource.date}>
									{formatDate(resource.date)}
								</time>
							{/if}
							<h2 class="mt-1 text-2xl font-bold text-white hover:text-blue-400">
								{resource.title}
							</h2>
							{#if resource.description}
								<p class="mt-2 text-gray-400">{resource.description}</p>
							{/if}
						</a>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
