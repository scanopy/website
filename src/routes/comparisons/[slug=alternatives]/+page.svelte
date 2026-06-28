<script lang="ts">
	import { PageHero, CorrectionCallout } from '$lib/components';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import ArticleCTA from '$lib/components/ArticleCTA.svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import ArticleTOC from '$lib/components/ArticleTOC.svelte';
	import ScanopyDemo from '$lib/components/ScanopyDemo.svelte';
	import { getFAQPageSchema, getBreadcrumbListSchema } from '$lib/schemas';
	import { page } from '$app/state';
	import { APP, appHref } from '$lib/config/urls';
	import type { Vendor, VendorFAQ, VendorSource } from '$lib/types';

	interface AltCard {
		slug: string;
		name: string;
		href: string;
		blurb: string;
		isScanopy: boolean;
		vsHref: string | null;
	}

	interface PageData {
		vendorSlug: string;
		vendorName: string;
		vendorHref: string;
		title: string;
		description: string;
		intro: string;
		alternatives: AltCard[];
		tableSlugs: string[];
		tableVendors: Record<string, Vendor>;
		versusHtml: string;
		faqs: VendorFAQ[];
		sources: VendorSource[];
	}

	let { data }: { data: PageData } = $props();

	const canonical = `https://scanopy.net/comparisons/${data.vendorSlug}-alternatives`;
	const mainComparison = 'https://scanopy.net/comparisons/best-automated-network-diagram-tools';
	const vsHref = `/comparisons/vs/${data.vendorSlug}`;

	function abs(href: string): string {
		return href.startsWith('http') ? href : `https://scanopy.net${href}`;
	}

	// Schema: each featured tool as a SoftwareApplication inside an ItemList (the ranked
	// list of alternatives), plus a BreadcrumbList and the FAQPage.
	const itemListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: data.title,
		description: data.description,
		url: canonical,
		numberOfItems: data.alternatives.length,
		itemListElement: data.alternatives.map((alt, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: {
				'@type': 'SoftwareApplication',
				name: alt.name,
				applicationCategory: 'NetworkApplication',
				url: abs(alt.href),
				description: alt.blurb
			}
		}))
	};

	const breadcrumbSchema = getBreadcrumbListSchema([
		{ name: 'Comparisons', url: 'https://scanopy.net/comparisons' },
		{ name: 'Best automated network diagram tools', url: mainComparison },
		{ name: data.title, url: canonical }
	]);

	const faqSchema = data.faqs.length ? getFAQPageSchema(data.faqs) : null;

	const itemListJson = JSON.stringify(itemListSchema);
	const breadcrumbJson = JSON.stringify(breadcrumbSchema);
	const faqJson = faqSchema ? JSON.stringify(faqSchema) : null;

	const tableColumns = ['name', 'discovery', 'viewTypes', 'services', 'pricing', 'openSource'];

	// Sticky table of contents, mirroring the comparisons/blog pages. Shows when there are
	// at least 3 entries.
	const headings = $derived([
		{ id: 'best-alternatives', text: 'Best alternatives', level: 2 },
		{ id: 'compared', text: 'Compared', level: 2 },
		{ id: 'why-scanopy', text: 'Why Scanopy', level: 2 },
		...(data.faqs.length ? [{ id: 'faq', text: 'FAQ', level: 2 }] : [])
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
	<meta property="og:image" content="https://scanopy.net/topology-hero.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:image" content="https://scanopy.net/topology-hero.webp" />

	{@html `<script type="application/ld+json">${itemListJson}</script>`}
	{@html `<script type="application/ld+json">${breadcrumbJson}</script>`}
	{#if faqJson}
		{@html `<script type="application/ld+json">${faqJson}</script>`}
	{/if}
</svelte:head>

<PageHero image="/topology-hero.webp" title="Best {data.vendorName} Alternatives" />

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

					<h2 id="best-alternatives">The best {data.vendorName} alternatives</h2>
				</div>

				<!-- Card listicle: custom UI, kept outside .prose so its Tailwind colors apply. -->
				<div class="my-8 space-y-4">
					{#each data.alternatives as alt, i (alt.slug)}
						<div
							class="rounded-lg border p-5 {alt.isScanopy
								? 'border-blue-500/60 bg-blue-500/5'
								: 'border-gray-800'}"
						>
							<div class="flex items-baseline gap-3">
								<span
									class="flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold {alt.isScanopy
										? 'bg-blue-500 text-white'
										: 'bg-gray-800 text-gray-300'}"
								>
									{i + 1}
								</span>
								<h3 class="m-0 text-xl font-bold text-white">
									<a
										href={alt.href}
										class="hover:text-blue-400"
										{...alt.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}}
									>
										{alt.name}
									</a>
									{#if alt.isScanopy}
										<span
											class="ml-2 rounded-full bg-blue-500/15 px-2 py-0.5 align-middle text-xs font-semibold text-blue-300"
											>Our pick</span
										>
									{/if}
								</h3>
							</div>
							<p class="mb-0 mt-2 leading-relaxed text-gray-300">{alt.blurb}</p>
							{#if alt.isScanopy}
								<div class="mt-4 flex flex-wrap items-center gap-4 text-sm">
									<a
										href={appHref(APP.onboarding, page.url.pathname, 'alternatives-card')}
										target="_blank"
										rel="noopener noreferrer"
										class="btn-primary">Try Scanopy free</a
									>
									<a href="/pricing" class="text-gray-400 transition-colors hover:text-white"
										>See pricing</a
									>
									<a href="/commercial" class="text-gray-400 transition-colors hover:text-white"
										>Commercial edition</a
									>
									<a href="/community" class="text-gray-400 transition-colors hover:text-white"
										>Community edition</a
									>
								</div>
							{:else if alt.vsHref}
								<a
									href={alt.vsHref}
									class="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300"
								>
									Scanopy vs {alt.name}, head to head &rarr;
								</a>
							{/if}
						</div>
					{/each}
				</div>

				<div class="prose prose-invert prose-gray max-w-none">
					<h2 id="compared">{data.vendorName} alternatives compared</h2>
					<p>
						How {data.vendorName} and each alternative compare on discovery, the four topology views
						(L2, L3, workloads, applications), service detection, pricing, and licensing.
					</p>
					<ComparisonTable
						vendors={data.tableVendors}
						vendorSlugs={data.tableSlugs}
						columns={tableColumns}
					/>

					<ScanopyDemo />

					<h2 id="why-scanopy">Why Scanopy is a strong {data.vendorName} alternative</h2>
					{@html data.versusHtml}

					{#if data.faqs.length}
						<h2 id="faq">Frequently asked questions</h2>
					{/if}
				</div>

				{#if data.faqs.length}
					<div class="mt-6">
						<FAQ faqs={data.faqs} />
					</div>
				{/if}

				<div class="prose prose-invert prose-gray mt-10 max-w-none">
					<p>
						Comparing just these two? See the focused <a href={vsHref}
							>Scanopy vs {data.vendorName} head-to-head</a
						>. For all 13 tools side by side, see the
						<a href="/comparisons/best-automated-network-diagram-tools"
							>full comparison of automated network diagram tools</a
						>.
					</p>
				</div>

				{#if data.sources.length}
					<div class="prose prose-invert prose-gray mt-10 max-w-none">
						<h2 id="sources">Sources</h2>
						<div style="font-size: 0.8125rem; line-height: 1.8; color: rgb(var(--c-gray-400));">
							{#each data.sources as source}
								<span id="source-{source.id}">[{source.id}]</span>
								<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><br
								/>
							{/each}
						</div>
					</div>
				{/if}

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

	/* Shared comparison-table + chip styles, mirrored from the vs/[slug] page so the
	   VendorComparison inline table's view-type tags and chips render identically here. */
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

	:global(.prose .view-tags) {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	:global(.prose .view-tag) {
		font-size: 0.6875rem;
		padding: 0.0625rem 0.375rem;
	}

	:global(.prose .chip-unclear) {
		background: rgb(var(--c-gray-400) / 0.12);
		color: rgb(var(--c-gray-400));
		border: 1px dashed rgb(var(--c-gray-400) / 0.5);
	}

	:global(.prose .view-tag-no) {
		background: rgb(var(--c-gray-600) / 0.18);
		color: rgb(var(--c-gray-500));
		text-decoration: line-through;
		text-decoration-color: rgb(var(--c-gray-500) / 0.6);
	}
</style>
