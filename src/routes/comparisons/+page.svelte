<script lang="ts">
	import { Scale } from 'lucide-svelte';
	import { CorrectionCallout } from '$lib/components';

	interface ComparisonPost {
		title: string;
		description: string;
		date: string;
		keyword: string;
		slug: string;
	}

	interface VsLink {
		href: string;
		name: string;
	}

	interface PageData {
		posts: ComparisonPost[];
		vsLinks: VsLink[];
		altLinks: VsLink[];
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
	<title>Comparisons - Scanopy</title>
	<meta
		name="description"
		content="Side-by-side comparisons of network diagram and documentation tools. Pricing, features, and trade-offs."
	/>
	<link rel="canonical" href="https://scanopy.net/comparisons" />

	<meta property="og:title" content="Comparisons - Scanopy" />
	<meta
		property="og:description"
		content="Side-by-side comparisons of network diagram and documentation tools. Pricing, features, and trade-offs."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://scanopy.net/comparisons" />

	<meta property="og:image" content="https://scanopy.net/og/social.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Comparisons - Scanopy" />
	<meta
		name="twitter:description"
		content="Side-by-side comparisons of network diagram and documentation tools. Pricing, features, and trade-offs."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Comparisons - Scanopy',
		description: 'Side-by-side comparisons of network diagram and documentation tools. Pricing, features, and trade-offs.',
		url: 'https://scanopy.net/comparisons',
		isPartOf: {
			'@type': 'WebSite',
			name: 'Scanopy',
			url: 'https://scanopy.net'
		},
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: data.posts.map((post, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `https://scanopy.net/comparisons/${post.slug}`,
				name: post.title
			}))
		}
	})}</script>`}
</svelte:head>

<section class="py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<div class="mb-12 text-center">
			<div class="mb-4 flex justify-center">
				<Scale class="h-12 w-12 text-blue-400" />
			</div>
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Comparisons</h1>
			<p class="text-xl text-gray-400">
				Side-by-side comparisons of network diagram and documentation tools.
			</p>
		</div>

		<div class="mx-auto mb-12 max-w-2xl">
			<CorrectionCallout />
		</div>

		{#if data.posts.length === 0}
			<div class="text-center">
				<p class="text-gray-400">No comparisons yet. Check back soon!</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each data.posts as post (post.slug)}
					<article
						class="rounded-lg border border-gray-800 p-6 transition-colors hover:border-gray-700"
					>
						<a href="/comparisons/{post.slug}" class="block">
							{#if post.date}
								<time class="text-sm text-gray-500" datetime={post.date}>
									{formatDate(post.date)}
								</time>
							{/if}
							<h2 class="mt-1 text-2xl font-bold text-white hover:text-blue-400">
								{post.title}
							</h2>
							{#if post.description}
								<p class="mt-2 text-gray-400">{post.description}</p>
							{/if}
						</a>
					</article>
				{/each}
			</div>
		{/if}

		{#if data.vsLinks.length}
			<div class="mt-16 border-t border-gray-800 pt-12">
				<h2 class="mb-3 text-2xl font-bold text-white">Scanopy head-to-head comparisons</h2>
				<p class="mb-6 text-gray-400">
					Comparing Scanopy against one specific tool? These focused two-tool pages put Scanopy
					side by side with each competitor on discovery, the four topology views, pricing, and
					licensing.
				</p>
				<ul class="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
					{#each data.vsLinks as link (link.href)}
						<li>
							<a href={link.href} class="text-blue-400 hover:text-blue-300">
								Scanopy vs {link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if data.altLinks.length}
			<div class="mt-16 border-t border-gray-800 pt-12">
				<h2 class="mb-3 text-2xl font-bold text-white">Looking for an alternative to a specific tool?</h2>
				<p class="mb-6 text-gray-400">
					Shopping for a replacement? These roundups list the best alternatives to each tool,
					compared on discovery, the four topology views, pricing, and licensing. Comparing Scanopy
					itself? See <a href="/comparisons/scanopy-alternatives" class="text-blue-400 hover:text-blue-300">Scanopy alternatives</a>.
				</p>
				<ul class="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
					{#each data.altLinks as link (link.href)}
						<li>
							<a href={link.href} class="text-blue-400 hover:text-blue-300">
								Best {link.name} alternatives
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</section>
