<script lang="ts">
	interface BlogPost {
		title: string;
		description: string;
		date: string;
		keyword: string;
		slug: string;
		content: string;
	}

	interface PageData {
		post: BlogPost;
	}

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const articleSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.post.title,
		description: data.post.description,
		datePublished: data.post.date,
		author: {
			'@type': 'Organization',
			name: 'Scanopy',
			url: 'https://scanopy.net'
		},
		publisher: {
			'@type': 'Organization',
			name: 'Scanopy',
			logo: {
				'@type': 'ImageObject',
				url: 'https://scanopy.net/scanopy-logo.png'
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://scanopy.net/blog/${data.post.slug}`
		},
		image: 'https://scanopy.net/social.webp'
	});
</script>

<svelte:head>
	<title>{data.post.title} | Scanopy</title>
	<meta name="description" content={data.post.description} />
	<link rel="canonical" href="https://scanopy.net/blog/{data.post.slug}" />

	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://scanopy.net/blog/{data.post.slug}" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.post.description} />

	{@html `<script type="application/ld+json">${articleSchema}</script>`}
</svelte:head>

<article class="py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<header class="mb-12">
			<a href="/blog" class="mb-6 inline-block text-sm text-gray-500 hover:text-blue-400">
				&larr; Back to blog
			</a>
			{#if data.post.date}
				<time class="block text-sm text-gray-500" datetime={data.post.date}>
					{formatDate(data.post.date)}
				</time>
			{/if}
			<h1 class="mt-2 text-4xl font-bold text-white lg:text-5xl">
				{data.post.title}
			</h1>
		</header>

		<div class="prose prose-invert prose-gray max-w-none">
			{@html data.post.content}
		</div>
	</div>
</article>

<style>
	:global(.prose h2) {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
	}

	:global(.prose h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: rgb(229 231 235);
	}

	:global(.prose p) {
		color: rgb(209 213 219);
		margin-bottom: 1rem;
		line-height: 1.75;
	}

	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		color: rgb(209 213 219);
		margin-bottom: 1.5rem;
	}

	:global(.prose li) {
		color: rgb(209 213 219);
		margin-top: 0.25rem;
	}

	:global(.prose a) {
		color: rgb(96 165 250);
	}

	:global(.prose a:hover) {
		color: rgb(147 197 253);
	}

	:global(.prose code) {
		background-color: rgb(31 41 55);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: rgb(229 231 235);
	}

	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	:global(.prose th) {
		background-color: rgb(31 41 55);
		padding: 0.5rem 0.75rem;
		text-align: left;
		font-weight: 600;
		color: rgb(229 231 235);
		border: 1px solid rgb(55 65 81);
	}

	:global(.prose td) {
		padding: 0.5rem 0.75rem;
		color: rgb(209 213 219);
		border: 1px solid rgb(55 65 81);
	}

	:global(.prose strong) {
		color: rgb(229 231 235);
	}

	:global(.prose em) {
		color: rgb(209 213 219);
	}

	:global(.prose iframe) {
		max-width: 100%;
		margin: 1.5rem 0;
	}

	:global(.prose hr) {
		border: none;
		border-top: 1px solid rgb(55 65 81);
		margin: 2rem 0;
	}
</style>
