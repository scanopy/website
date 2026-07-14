<script lang="ts">
	import { PageHero, CorrectionCallout } from '$lib/components';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import ArticleCTA from '$lib/components/ArticleCTA.svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import ArticleTOC from '$lib/components/ArticleTOC.svelte';
	import ScanopyDemo from '$lib/components/ScanopyDemo.svelte';
	import { ALT_VENDOR_SLUGS, altSlug } from '$lib/compare/alternatives-pages';
	import type { Vendor, VendorSource, SourceRef } from '$lib/types';

	interface PageData {
		pageSlug: string;
		scanopySlug: string;
		vendorSlug: string;
		scanopy: Vendor;
		vendor: Vendor;
		vendorName: string;
		title: string;
		description: string;
		intro: string;
		takeaway: { scanopy: string; vendor: string };
		versusHtml: string | null;
		sources: VendorSource[];
	}

	let { data }: { data: PageData } = $props();

	const canonical = `https://scanopy.net/comparisons/vs/${data.vendorSlug}`;
	const mainComparison = 'https://scanopy.net/comparisons/best-automated-network-diagram-tools';
	const altHref = ALT_VENDOR_SLUGS.includes(data.vendorSlug) ? altSlug(data.vendorSlug) : null;

	function abs(href: string): string {
		return href.startsWith('http') ? href : `https://scanopy.net${href}`;
	}

	function sourceRefHtml(refs?: SourceRef[]): string {
		if (!refs) return '';
		return refs.map((r) => ` <a href="#source-${r.id}">[${r.id}]</a>`).join('');
	}

	// Data-derived view-coverage prose, folded into the intro (not a labeled block). The
	// table itself shows the per-view chips; these sentences summarize them with citations.

	// Schema: model each compared product as a SoftwareApplication, wrapped in an ItemList
	// (the approach the main comparison page already uses), and a BreadcrumbList for context.
	const itemListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: data.title,
		description: data.description,
		url: canonical,
		numberOfItems: 2,
		itemListElement: [data.scanopy, data.vendor].map((v, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: {
				'@type': 'SoftwareApplication',
				name: v.fullName || v.name,
				applicationCategory: 'NetworkApplication',
				url: abs(v.href),
				...(v.bestFor ? { description: v.bestFor } : {})
			}
		}))
	};

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Comparisons',
				item: 'https://scanopy.net/comparisons'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: `Best automated network diagram tools`,
				item: mainComparison
			},
			{ '@type': 'ListItem', position: 3, name: data.title, item: canonical }
		]
	};

	const itemListJson = JSON.stringify(itemListSchema);
	const breadcrumbJson = JSON.stringify(breadcrumbSchema);

	// Head-to-head table: attributes as rows, Scanopy + the vendor as columns.
	const tableVendors = { [data.scanopySlug]: data.scanopy, [data.vendorSlug]: data.vendor };
	const tableSlugs = [data.scanopySlug, data.vendorSlug];
	const tableColumns = [
		'discovery',
		'services',
		'viewTypes',
		'autoUpdates',
		'openSource',
		'pricing',
		'alsoIncludes'
	];

	// Sticky table of contents, mirroring the comparisons/blog pages. Build from the H2s
	// actually rendered (the "Sources" section is intentionally omitted; ArticleTOC hides
	// it anyway). The TOC shows only when there are at least 3 entries.
	const headings = $derived([
		{ id: 'head-to-head', text: 'Head to head', level: 2 },
		...(data.versusHtml ? [{ id: 'how-they-compare', text: 'How they compare', level: 2 }] : []),
		{ id: 'when-to-choose-which', text: 'When to choose which', level: 2 }
	]);
	const showToc = $derived(headings.length >= 3);
</script>

<svelte:head>
	<title>{data.title} - Scanopy</title>
	<meta name="description" content={data.description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="https://scanopy.net/og/topology-hero.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:image" content="https://scanopy.net/og/topology-hero.webp" />

	{@html `<script type="application/ld+json">${itemListJson}</script>`}
	{@html `<script type="application/ld+json">${breadcrumbJson}</script>`}
</svelte:head>

<PageHero image="/og/topology-hero.webp" title="Scanopy vs {data.vendorName}" />

<article class="py-10 sm:py-20">
	<div class="container mx-auto px-3 sm:px-4" class:max-w-3xl={!showToc} class:max-w-5xl={showToc}>
		<div class:blog-layout={showToc}>
			<div class="blog-content">
				<header class="mb-10">
					<a
						href="/comparisons"
						class="mb-6 inline-block text-sm text-gray-500 hover:text-blue-400"
					>
						&larr; Back to comparisons
					</a>
				</header>

				<CorrectionCallout />

				<div class="prose prose-invert prose-gray max-w-none">
					<p>{data.intro}</p>

					<h2 id="head-to-head">Scanopy vs {data.vendorName}: head to head</h2>
					<ComparisonTable
						vendors={tableVendors}
						vendorSlugs={tableSlugs}
						columns={tableColumns}
						orientation="row"
						minWidth="560px"
						colWidths={['26%', '37%', '37%']}
					/>

					<ScanopyDemo />

					{#if data.versusHtml}
						<h2 id="how-they-compare">How they compare</h2>
						{@html data.versusHtml}
					{/if}

					<h2 id="when-to-choose-which">When to choose which</h2>
					<p><strong>Choose Scanopy when:</strong> {data.takeaway.scanopy}</p>
					<p><strong>Choose {data.vendorName} when:</strong> {data.takeaway.vendor}</p>

					<p>
						This is a focused, two-tool comparison.{#if altHref}
							Weighing other options too? See the
							<a href={altHref}>best {data.vendorName} alternatives</a>.{/if} For all 13 tools side by
						side, see the
						<a href="/comparisons/best-automated-network-diagram-tools"
							>full comparison of automated network diagram tools</a
						>.
					</p>

					{#if data.sources.length}
						<h2 id="sources">Sources</h2>
						<div style="font-size: 0.8125rem; line-height: 1.8; color: rgb(var(--c-gray-400));">
							{#each data.sources as source}
								<span id="source-{source.id}">[{source.id}]</span>
								<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><br
								/>
							{/each}
						</div>
					{/if}
				</div>

				<ArticleCTA />
				<AuthorCard />
			</div>

			{#if showToc}
				<ArticleTOC {headings} maxDepth={2} />
			{/if}
		</div>
	</div>
</article>

<style>
	/* Sticky-TOC two-column layout, mirrored from the comparisons [slug] page. */
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

	/* Shared comparison-table + chip styles, mirrored from the comparisons [slug] page so
	   the view-type tags and [n] citations render identically. */
	:global(.prose h2) {
		margin-top: 3rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: rgb(var(--c-white));
		padding-left: 0.75rem;
		border-left: 3px solid rgb(var(--c-blue-500));
		scroll-margin-top: 5rem;
	}

	:global(.prose p) {
		color: rgb(var(--c-gray-300));
		margin-bottom: 1.25rem;
		line-height: 1.75;
		overflow-wrap: break-word;
	}

	:global(.prose a) {
		color: rgb(var(--c-blue-400));
	}

	:global(.prose a:hover) {
		color: rgb(var(--c-blue-300));
	}

	:global(.prose strong) {
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

	:global(.table-scroll) {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-x: contain;
	}

	:global(.vendor-table td),
	:global(.vendor-table th) {
		overflow-wrap: break-word;
	}

	:global(.prose th) {
		background-color: rgb(var(--c-gray-800));
		padding: 0.5rem 0.75rem;
		text-align: left;
		font-weight: 600;
		color: rgb(var(--c-gray-200));
		border: 1px solid rgb(var(--c-gray-700));
		vertical-align: top;
	}

	:global(.prose td) {
		padding: 0.5rem 0.75rem;
		color: rgb(var(--c-gray-300));
		border: 1px solid rgb(var(--c-gray-700));
		vertical-align: top;
	}

	:global(.prose .view-cell) {
		text-align: center;
	}

	:global(.cell-detail) {
		display: block;
		font-size: 0.75rem;
		color: rgb(var(--c-gray-400));
		margin-top: 0.25rem;
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

	:global(.prose .chip-unclear) {
		background: rgb(var(--c-gray-400) / 0.12);
		color: rgb(var(--c-gray-400));
		border: 1px dashed rgb(var(--c-gray-400) / 0.5);
	}

	/* Network Views row: per-view tags wrap inside the cell, never overflow. */
	:global(.prose .view-tags) {
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem;
	}

	:global(.prose .view-tag) {
		font-size: 0.6875rem;
		padding: 0.0625rem 0.375rem;
	}

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
		margin-top: -0.5rem;
	}

	/* Dotted-underline hover tooltips on the head-to-head table's row labels. Mirrored from
	   the comparisons [slug] article page so the tooltip markup VsComparison emits renders
	   identically here (this content is wrapped in a .prose container above). */
	:global(.prose .tooltip-header) {
		position: relative;
		cursor: help;
		text-decoration: underline dotted rgb(var(--c-gray-400) / 0.5);
		text-underline-offset: 3px;
	}

	/* Inline tooltip content stays hidden; `use:tooltip` portals a fixed-positioned copy
	   (.tooltip-portal) to document.body so it never expands the table or page height. */
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
</style>
