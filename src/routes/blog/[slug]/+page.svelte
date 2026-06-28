<script lang="ts">
	import { PageHero } from '$lib/components';
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import ArticleCTA from '$lib/components/ArticleCTA.svelte';
	import ArticleTOC from '$lib/components/ArticleTOC.svelte';
	import VendorComparison from '$lib/components/VendorComparison.svelte';
	import type { Vendor } from '$lib/types';

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	interface BlogPost {
		title: string;
		description: string;
		date: string;
		dateModified?: string;
		keyword: string;
		slug: string;
		image: string;
		tldr?: string;
		ctaDescription?: string;
		content: string;
		wordCount: number;
	}

	type ContentSegment =
		| { type: 'html'; content: string }
		| { type: 'vendor-inline-table'; vendorSlugs: string[]; columns: string[] };

	interface PageData {
		post: BlogPost;
		headings: Heading[];
		contentSegments?: ContentSegment[];
		vendorData?: { vendors: Record<string, Vendor> };
	}

	let { data }: { data: PageData } = $props();

	const showToc = $derived(data.headings && data.headings.length >= 3);

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr + 'T12:00:00');
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const articleSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `https://scanopy.net/blog/${data.post.slug}#article`,
		headline: data.post.title,
		description: data.post.description,
		datePublished: data.post.date,
		dateModified: data.post.dateModified || data.post.date,
		inLanguage: 'en',
		wordCount: data.post.wordCount,
		author: {
			'@type': 'Person',
			name: 'Maya',
			url: 'https://scanopy.net/about',
			sameAs: ['https://github.com/mayanayza']
		},
		publisher: {
			'@id': 'https://scanopy.net/#organization'
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://scanopy.net/blog/${data.post.slug}`
		},
		isPartOf: {
			'@id': 'https://scanopy.net/#website'
		},
		image: `https://scanopy.net${data.post.image}`
	});
</script>

<svelte:head>
	<title>{data.post.title} - Scanopy</title>
	<meta name="description" content={data.post.description} />
	<link rel="canonical" href="https://scanopy.net/blog/{data.post.slug}" />

	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://scanopy.net/blog/{data.post.slug}" />
	<meta property="article:published_time" content={data.post.date} />
	<meta property="article:modified_time" content={data.post.dateModified || data.post.date} />

	<meta property="og:image" content="https://scanopy.net{data.post.image}" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.post.description} />
	<meta name="twitter:image" content="https://scanopy.net{data.post.image}" />

	{@html `<script type="application/ld+json">${articleSchema}</script>`}
</svelte:head>

<PageHero image={data.post.image} title={data.post.title}>
	{#if data.post.date}
		<div class="flex items-center gap-2 text-sm text-gray-400">
			<time datetime={data.post.date}>{formatDate(data.post.date)}</time>
			{#if data.post.dateModified && data.post.dateModified !== data.post.date}
				<span>·</span>
				<span
					>Updated <time datetime={data.post.dateModified}
						>{formatDate(data.post.dateModified)}</time
					></span
				>
			{/if}
			<span>·</span>
			<a href="/about" class="hover:text-blue-400">Maya</a>
		</div>
	{/if}
</PageHero>

<article class="py-20">
	<div class="container mx-auto px-4" class:max-w-3xl={!showToc} class:max-w-5xl={showToc}>
		<div class:blog-layout={showToc}>
			<div class="blog-content">
				<header class="mb-12">
					<a href="/blog" class="mb-6 inline-block text-sm text-gray-500 hover:text-blue-400">
						&larr; Back to blog
					</a>
				</header>

				{#if data.post.tldr}
					<div class="mb-8 rounded-r-lg border-l-[3px] border-blue-500 bg-gray-800/50 px-5 py-4">
						<p class="text-sm font-medium text-gray-300">
							<span class="font-semibold text-white">TL;DR:</span>
							{data.post.tldr}
						</p>
					</div>
				{/if}

				<div class="prose prose-invert prose-gray max-w-none">
					{#if data.contentSegments && data.vendorData}
						{#each data.contentSegments as segment}
							{#if segment.type === 'html'}
								{@html segment.content}
							{:else if segment.type === 'vendor-inline-table'}
								<VendorComparison
									mode="inline"
									vendors={data.vendorData.vendors}
									vendorSlugs={segment.vendorSlugs}
									columns={segment.columns}
								/>
							{/if}
						{/each}
					{:else}
						{@html data.post.content}
					{/if}
				</div>

				<ArticleCTA description={data.post.ctaDescription} />
				<AuthorCard />
			</div>

			{#if showToc}
				<ArticleTOC headings={data.headings} />
			{/if}
		</div>
	</div>
</article>

<style>
	.blog-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 1024px) {
		.blog-layout {
			grid-template-columns: 1fr 200px;
		}
	}

	:global(.prose h2) {
		margin-top: 3.5rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: rgb(var(--c-white));
		padding-left: 0.75rem;
		border-left: 3px solid rgb(var(--c-blue-500));
		scroll-margin-top: 5rem;
	}

	:global(.prose h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: rgb(var(--c-gray-200));
		scroll-margin-top: 5rem;
	}

	:global(.prose p) {
		color: rgb(var(--c-gray-300));
		margin-bottom: 1.25rem;
		line-height: 1.75;
	}

	:global(.prose p > strong:first-child) {
		color: rgb(var(--c-gray-100));
	}

	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		color: rgb(var(--c-gray-300));
		margin-bottom: 1.5rem;
	}

	:global(.prose li) {
		color: rgb(var(--c-gray-300));
		margin-top: 0.25rem;
	}

	:global(.prose a) {
		color: rgb(var(--c-blue-400));
	}

	:global(.prose a:hover) {
		color: rgb(var(--c-blue-300));
	}

	:global(.prose code) {
		background-color: rgb(var(--c-gray-800));
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: rgb(var(--c-gray-200));
	}

	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	:global(.prose th) {
		background-color: rgb(var(--c-gray-800));
		padding: 0.5rem 0.75rem;
		text-align: left;
		font-weight: 600;
		color: rgb(var(--c-gray-200));
		border: 1px solid rgb(var(--c-gray-700));
	}

	:global(.prose td) {
		padding: 0.5rem 0.75rem;
		color: rgb(var(--c-gray-300));
		border: 1px solid rgb(var(--c-gray-700));
	}

	:global(.prose strong) {
		color: rgb(var(--c-gray-200));
	}

	:global(.prose em) {
		color: rgb(var(--c-gray-300));
	}

	:global(.prose iframe) {
		max-width: 100%;
		margin: 1.5rem 0;
	}

	:global(.prose hr) {
		border: none;
		border-top: 1px solid rgb(var(--c-gray-700));
		margin: 2rem 0;
	}
</style>
