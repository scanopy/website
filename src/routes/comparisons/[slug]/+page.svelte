<script lang="ts">
	import { PageHero, CorrectionCallout } from '$lib/components';
	import VendorComparison from '$lib/components/VendorComparison.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import ArticleCTA from '$lib/components/ArticleCTA.svelte';
	import ArticleTOC from '$lib/components/ArticleTOC.svelte';
	import { getFAQPageSchema } from '$lib/schemas';
	import type { Vendor, VendorCategory, VendorSource, VendorFAQ } from '$lib/types';
	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	interface ComparisonPost {
		title: string;
		description: string;
		date: string;
		dateModified?: string;
		keyword: string;
		slug: string;
		image: string;
		tldr?: string;
		ctaDescription?: string;
		style?: string;
		content: string;
		wordCount: number;
	}

	type ContentSegment =
		| { type: 'html'; content: string }
		| { type: 'vendor-tables' }
		| { type: 'vendor-section'; id: string }
		| { type: 'vendor-sources' };

	interface VendorData {
		vendors: Record<string, Vendor>;
		tableCategories: VendorCategory[];
		detailSections: VendorCategory[];
		sources: VendorSource[];
		faqs: VendorFAQ[];
		disclosureText: string;
		honorableMentions: string;
		itemListSchema: Record<string, unknown>;
	}

	interface PageData {
		post: ComparisonPost;
		headings: Heading[];
		contentSegments?: ContentSegment[];
		vendorData?: VendorData;
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

	const articleSchemaObj: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `https://scanopy.net/comparisons/${data.post.slug}#article`,
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
			'@id': `https://scanopy.net/comparisons/${data.post.slug}`
		},
		isPartOf: {
			'@id': 'https://scanopy.net/#website'
		},
		about: {
			'@type': 'Thing',
			name: 'Network documentation tools',
			description:
				'Software that discovers a network and keeps its documentation and topology current automatically'
		},
		image: `https://scanopy.net${data.post.image}`
	};

	const articleSchema = JSON.stringify(articleSchemaObj);

	const itemListSchema = data.vendorData ? JSON.stringify(data.vendorData.itemListSchema) : null;

	// FAQPage schema (AEO), sourced from the same FAQs the page renders. Strip inline
	// HTML so the schema answer text matches the visible plain-text answer.
	const faqSchema = data.vendorData?.faqs?.length
		? JSON.stringify(
				getFAQPageSchema(
					data.vendorData.faqs.map((f) => ({
						question: f.question,
						answer: f.answer.replace(/<[^>]+>/g, '')
					}))
				)
			)
		: null;
</script>

<svelte:head>
	<title>{data.post.title} - Scanopy</title>
	<meta name="description" content={data.post.description} />
	<link rel="canonical" href="https://scanopy.net/comparisons/{data.post.slug}" />

	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://scanopy.net/comparisons/{data.post.slug}" />
	<meta property="article:published_time" content={data.post.date} />
	<meta property="article:modified_time" content={data.post.dateModified || data.post.date} />

	<meta property="og:image" content="https://scanopy.net{data.post.image}" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.post.description} />
	<meta name="twitter:image" content="https://scanopy.net{data.post.image}" />

	{@html `<script type="application/ld+json">${articleSchema}</script>`}
	{#if itemListSchema}
		{@html `<script type="application/ld+json">${itemListSchema}</script>`}
	{/if}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${faqSchema}</script>`}
	{/if}
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

<article class="py-10 sm:py-20">
	<div class="container mx-auto px-3 sm:px-4" class:max-w-3xl={!showToc} class:max-w-5xl={showToc}>
		<div class:blog-layout={showToc}>
			<div class="blog-content">
				<header class="mb-12">
					<a
						href="/comparisons"
						class="mb-6 inline-block text-sm text-gray-500 hover:text-blue-400"
					>
						&larr; Back to comparisons
					</a>
				</header>

				<CorrectionCallout />

				{#if data.post.tldr}
					<div class="mb-8 rounded-r-lg border-l-[3px] border-blue-500 bg-gray-800/50 px-5 py-4">
						<p class="text-sm font-medium text-gray-300">
							<span class="font-semibold text-white">TL;DR:</span>
							{data.post.tldr}
						</p>
					</div>
				{/if}

				<div
					class="prose prose-invert prose-gray max-w-none"
					class:prose-comparison={data.post.style === 'comparison'}
				>
					{#if data.contentSegments && data.vendorData}
						{#each data.contentSegments as segment}
							{#if segment.type === 'html'}
								{@html segment.content}
							{:else if segment.type === 'vendor-tables'}
								<VendorComparison
									mode="tables"
									categories={data.vendorData.tableCategories}
									vendors={data.vendorData.vendors}
									disclosureText={data.vendorData.disclosureText}
								/>
							{:else if segment.type === 'vendor-section'}
								<VendorComparison
									mode="detail"
									section={data.vendorData.detailSections.find((s) => s.id === segment.id)}
									vendors={data.vendorData.vendors}
									honorableMentions={segment.id === 'discovery'
										? data.vendorData.honorableMentions
										: undefined}
								/>
							{:else if segment.type === 'vendor-sources'}
								<VendorComparison mode="sources" sources={data.vendorData.sources} />
							{/if}
						{/each}
					{:else}
						{@html data.post.content}
					{/if}
				</div>

				<ArticleCTA />

				{#if data.vendorData?.faqs?.length}
					<div class="prose prose-invert prose-gray mt-12 max-w-none">
						<h2 id="frequently-asked-questions">Frequently Asked Questions</h2>
						<FAQ faqs={data.vendorData.faqs} />
					</div>
				{/if}
				<AuthorCard />
			</div>

			{#if showToc}
				<ArticleTOC headings={data.headings} maxDepth={3} />
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

	.blog-content {
		min-width: 0;
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
		overflow-wrap: break-word;
	}

	:global(.prose p > strong:first-child) {
		color: rgb(var(--c-gray-100));
	}

	/* Comparison post style: vendor sections as cards */
	:global(.prose-comparison h3) {
		margin-top: 2.5rem;
		margin-bottom: 0;
		padding: 0.75rem 1rem;
		font-size: 1.125rem;
		font-weight: 700;
		color: rgb(var(--c-white));
		background: rgb(var(--c-gray-800));
		border-radius: 0.5rem 0.5rem 0 0;
		border: 1px solid rgb(var(--c-gray-700));
		border-bottom: 1px solid rgb(var(--c-gray-700) / 0.5);
		scroll-margin-top: 5rem;
	}

	:global(.prose-comparison h3 + p) {
		padding: 0.75rem 1rem 0.5rem;
		border-left: 1px solid rgb(var(--c-gray-700));
		border-right: 1px solid rgb(var(--c-gray-700));
		margin-top: 0;
		margin-bottom: 0;
		color: rgb(var(--c-gray-400));
		font-size: 0.9375rem;
	}

	:global(.prose-comparison h3 + p + p),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child)) {
		padding: 0.5rem 1rem;
		border-left: 1px solid rgb(var(--c-gray-700));
		border-right: 1px solid rgb(var(--c-gray-700));
		margin-bottom: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	:global(.prose-comparison h3 ~ p:has(> strong:first-child) > strong:first-child) {
		color: rgb(var(--c-rose-400));
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* Last bold-label paragraph before next h3 or h2 gets bottom border + rounded corners */
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):has(+ h3)),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):has(+ h2)),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):has(+ iframe)),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):last-child) {
		border-bottom: 1px solid rgb(var(--c-gray-700));
		border-radius: 0 0 0.5rem 0.5rem;
		padding-bottom: 1rem;
		margin-bottom: 0.5rem;
	}

	@media (min-width: 640px) {
		:global(.prose-comparison h3) {
			padding: 1rem 1.25rem;
			font-size: 1.25rem;
		}

		:global(.prose-comparison h3 + p) {
			padding: 1rem 1.25rem 0.75rem;
		}

		:global(.prose-comparison h3 + p + p),
		:global(.prose-comparison h3 ~ p:has(> strong:first-child)) {
			padding: 0.5rem 1.25rem;
		}
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
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.8125rem;
	}

	@media (min-width: 640px) {
		:global(.prose table) {
			font-size: 0.875rem;
		}
	}

	:global(.vendor-table td),
	:global(.vendor-table th) {
		overflow-wrap: break-word;
	}

	:global(.table-scroll) {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-x: contain;
	}

	:global(.prose > .table-scroll table) {
		table-layout: auto;
		width: 100%;
	}

	:global(.prose > .table-scroll th:first-child),
	:global(.prose > .table-scroll td:first-child) {
		width: 35%;
	}

	:global(.prose > .table-scroll td),
	:global(.prose > .table-scroll th) {
		overflow-wrap: break-word;
	}

	:global(.prose) {
		overflow-wrap: break-word;
		word-break: break-word;
		max-width: 100%;
	}

	/* Network Views (3) and Environments (4): center the chip groups. Allow wrapping so chips
	   never overflow the cell. */
	:global(.vendor-table td:nth-child(3)),
	:global(.vendor-table td:nth-child(4)),
	:global(.vendor-table th:nth-child(3)),
	:global(.vendor-table th:nth-child(4)) {
		text-align: center;
	}

	/* Environments column: neutral, equal-weight on-prem / cloud chips that wrap freely. */
	:global(.prose .env-tags) {
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
	}

	:global(.prose .env-tag) {
		background: rgb(var(--c-gray-400) / 0.14);
		color: rgb(var(--c-gray-300));
		font-size: 0.6875rem;
		padding: 0.0625rem 0.375rem;
	}

	:global(.vendor-table td:nth-child(1)) {
		font-weight: 600;
	}

	:global(.prose-comparison .cell-detail) {
		display: block;
		font-size: 0.75rem;
		color: rgb(var(--c-gray-400));
		margin-top: 0.25rem;
	}

	:global(.prose-comparison a.cell-detail),
	:global(.prose-comparison .cell-detail a) {
		color: rgb(var(--c-blue-400));
	}

	:global(.prose-comparison a.cell-detail:hover),
	:global(.prose-comparison .cell-detail a:hover) {
		color: rgb(var(--c-blue-300));
	}

	:global(.prose-comparison td:nth-child(2)) {
		min-width: 120px;
	}

	:global(.prose-comparison td:nth-child(6)),
	:global(.prose-comparison th:nth-child(6)) {
		min-width: 130px;
	}

	:global(.prose-comparison .category-row td) {
		background: rgb(var(--c-gray-900));
		font-weight: 700;
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: rgb(var(--c-gray-400));
		padding: 0.625rem 0.75rem;
		border-left: none;
		border-right: none;
	}

	:global(.prose th) {
		background-color: rgb(var(--c-gray-800));
		padding: 0.375rem 0.5rem;
		text-align: left;
		font-weight: 600;
		color: rgb(var(--c-gray-200));
		border: 1px solid rgb(var(--c-gray-700));
	}

	:global(.prose td) {
		padding: 0.375rem 0.5rem;
		color: rgb(var(--c-gray-300));
		border: 1px solid rgb(var(--c-gray-700));
	}

	@media (min-width: 640px) {
		:global(.prose th) {
			padding: 0.5rem 0.75rem;
		}

		:global(.prose td) {
			padding: 0.5rem 0.75rem;
		}
	}

	:global(.prose .chip) {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.5;
		white-space: nowrap;
	}

	:global(.prose .chip-positive) {
		background: rgba(34, 197, 94, 0.15);
		color: rgb(var(--c-green-400));
	}

	:global(.prose .chip-negative) {
		background: rgba(239, 68, 68, 0.15);
		color: rgb(var(--c-red-400));
	}

	:global(.prose .chip-neutral) {
		background: rgba(245, 158, 11, 0.15);
		color: rgb(var(--c-amber-400));
	}

	/* Unverified ("unclear") view support: muted, distinct from yes/no. */
	:global(.prose .chip-unclear) {
		background: rgb(var(--c-gray-400) / 0.12);
		color: rgb(var(--c-gray-400));
		border: 1px dashed rgb(var(--c-gray-400) / 0.5);
	}

	/* Network Views column: compact per-view tags. */
	:global(.prose .view-tags) {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	:global(.prose .view-tag) {
		font-size: 0.6875rem;
		padding: 0.0625rem 0.375rem;
	}

	/* Not-supported view: greyed out, de-emphasised. */
	:global(.prose .view-tag-no) {
		background: rgb(var(--c-gray-600) / 0.18);
		color: rgb(var(--c-gray-500));
		text-decoration: line-through;
		text-decoration-color: rgb(var(--c-gray-500) / 0.6);
	}

	:global(.prose .view-legend) {
		font-size: 0.8125rem;
		color: rgb(var(--c-gray-400));
		line-height: 2.2;
	}

	:global(.prose .tooltip-header) {
		position: relative;
		cursor: help;
		text-decoration: underline dotted rgb(var(--c-gray-400) / 0.5);
		text-underline-offset: 3px;
	}

	/* The inline .tooltip-content stays hidden; the `use:tooltip` action clones it and
	   portals the copy (.tooltip-portal) to document.body so it can be position: fixed and
	   never expand the table cell or the document height. */
	:global(.prose .tooltip-content) {
		display: none;
	}

	:global(.tooltip-portal) {
		padding: 0.75rem 1rem;
		background: rgb(var(--c-gray-800));
		border: 1px solid rgb(var(--c-gray-700));
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 400;
		color: rgb(var(--c-gray-300));
		line-height: 2;
		z-index: 50;
		pointer-events: none;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
	}

	:global(.tooltip-portal .chip) {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.5;
		white-space: nowrap;
	}

	:global(.tooltip-portal .chip-positive) {
		background: rgba(34, 197, 94, 0.15);
		color: rgb(var(--c-green-400));
	}

	:global(.tooltip-portal .chip-negative) {
		background: rgba(239, 68, 68, 0.15);
		color: rgb(var(--c-red-400));
	}

	:global(.tooltip-portal .chip-neutral) {
		background: rgba(245, 158, 11, 0.15);
		color: rgb(var(--c-amber-400));
	}

	:global(.tooltip-portal .chip-unclear) {
		background: rgb(var(--c-gray-400) / 0.12);
		color: rgb(var(--c-gray-400));
		border: 1px dashed rgb(var(--c-gray-400) / 0.5);
	}

	:global(.tooltip-portal .view-tag-no) {
		background: rgb(var(--c-gray-600) / 0.18);
		color: rgb(var(--c-gray-500));
		text-decoration: line-through;
		text-decoration-color: rgb(var(--c-gray-500) / 0.6);
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

	:global(.prose dl) {
		margin: 1.5rem 0;
	}

	:global(.prose dt) {
		color: rgb(var(--c-gray-200));
		margin-top: 1rem;
		font-size: 0.9375rem;
	}

	:global(.prose dd) {
		color: rgb(var(--c-gray-300));
		margin-left: 0;
		margin-top: 0.25rem;
		line-height: 1.75;
		font-size: 0.875rem;
	}

	@media (min-width: 640px) {
		:global(.prose dd) {
			margin-left: 1.25rem;
		}
	}
</style>
