<script lang="ts">
	import { PageHero, CorrectionCallout } from '$lib/components';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import ArticleCTA from '$lib/components/ArticleCTA.svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import ArticleTOC from '$lib/components/ArticleTOC.svelte';
	import { getBreadcrumbListSchema } from '$lib/schemas';
	import { vsSlug } from '$lib/compare/vs-pages';
	import { ALT_VENDOR_SLUGS, altSlug } from '$lib/compare/alternatives-pages';
	import type { Vendor, VendorSource } from '$lib/types';

	interface PageData {
		pageSlug: string;
		aSlug: string;
		bSlug: string;
		a: Vendor;
		b: Vendor;
		aName: string;
		bName: string;
		title: string;
		description: string;
		intro: string;
		fit: { a: string; b: string } | null;
		tableSlugs: string[];
		tableVendors: Record<string, Vendor>;
		disclosureText: string;
		sources: VendorSource[];
	}

	let { data }: { data: PageData } = $props();

	const canonical = `https://scanopy.net/comparisons/${data.pageSlug}`;
	const mainComparison = 'https://scanopy.net/comparisons/best-automated-network-diagram-tools';

	function abs(href: string): string {
		return href.startsWith('http') ? href : `https://scanopy.net${href}`;
	}

	// Onward links to the pages that answer the next question a reader has, which is
	// usually "what else is there" rather than "which of these two".
	const aAltHref = ALT_VENDOR_SLUGS.includes(data.aSlug) ? altSlug(data.aSlug) : null;
	const bAltHref = ALT_VENDOR_SLUGS.includes(data.bSlug) ? altSlug(data.bSlug) : null;

	const tableColumns = ['name', 'discovery', 'viewTypes', 'services', 'pricing', 'openSource'];

	// Schema: both compared tools plus Scanopy as SoftwareApplication entries in an
	// ItemList, matching the approach on the alternatives and vs pages.
	const itemListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: data.title,
		description: data.description,
		url: canonical,
		numberOfItems: data.tableSlugs.length,
		itemListElement: data.tableSlugs.map((slug, i) => {
			const v = data.tableVendors[slug];
			return {
				'@type': 'ListItem',
				position: i + 1,
				item: {
					'@type': 'SoftwareApplication',
					name: v.fullName || v.name,
					applicationCategory: 'NetworkApplication',
					url: abs(v.href)
				}
			};
		})
	};

	const breadcrumbSchema = getBreadcrumbListSchema([
		{ name: 'Comparisons', url: 'https://scanopy.net/comparisons' },
		{ name: 'Network documentation tools', url: mainComparison },
		{ name: data.title, url: canonical }
	]);

	const itemListJson = JSON.stringify(itemListSchema);
	const breadcrumbJson = JSON.stringify(breadcrumbSchema);

	const headings = $derived([
		{ id: 'compared', text: 'Compared', level: 2 },
		...(data.fit ? [{ id: 'fit', text: 'Where each fits', level: 2 }] : []),
		{ id: 'sources', text: 'Sources', level: 2 }
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

<PageHero image="/og/topology-hero.webp" title="{data.aName} vs {data.bName}" />

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

					<h2 id="compared">{data.aName} and {data.bName} compared</h2>
					<p>
						Discovery protocols, the topology views each tool produces, service detection, pricing
						and licensing. Scanopy is in the table as a third option, and it is our product.
					</p>

					<ComparisonTable
						vendors={data.tableVendors}
						vendorSlugs={data.tableSlugs}
						columns={tableColumns}
					/>

					<p style="font-size: 0.8125rem; color: rgb(var(--c-gray-400));">
						{data.disclosureText}
					</p>

					{#if data.fit}
						<h2 id="fit">Where each fits</h2>
						<p><strong>{data.aName}.</strong> {data.fit.a}</p>
						<p><strong>{data.bName}.</strong> {data.fit.b}</p>
					{/if}
				</div>

				<ArticleCTA />

				<div class="prose prose-invert prose-gray mt-10 max-w-none">
					<p>
						Head-to-head against Scanopy:
						<a href={vsSlug(data.aSlug)}>Scanopy vs {data.aName}</a>
						and <a href={vsSlug(data.bSlug)}>Scanopy vs {data.bName}</a>.
						{#if aAltHref || bAltHref}
							Looking more broadly:
							{#if aAltHref}<a href={aAltHref}>{data.aName} alternatives</a
								>{/if}{#if aAltHref && bAltHref},
							{/if}{#if bAltHref}<a href={bAltHref}>{data.bName} alternatives</a>{/if}.
						{/if}
						For every tool side by side, see the
						<a href={mainComparison}>full network diagram tools comparison</a>.
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

				<AuthorCard />
			</div>

			{#if showToc}
				<ArticleTOC {headings} maxDepth={2} />
			{/if}
		</div>
	</div>
</article>
