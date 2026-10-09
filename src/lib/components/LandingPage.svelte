<script lang="ts">
	// One template for the feature pages (/product/<slug>) and the use-case pages
	// (/solutions/<slug>). Content lives in $lib/landing; this file only lays it out.
	import { ArrowRight } from 'lucide-svelte';
	import ViewSwitcher from '$lib/components/ViewSwitcher.svelte';
	import CustomerQuote from '$lib/components/CustomerQuote.svelte';
	import EvidenceExports from '$lib/components/EvidenceExports.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import LicenseCta from '$lib/components/LicenseCta.svelte';
	import { theme } from '$lib/theme.svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { DEMO_BOOKING_URL, DEMO_CTA_LABEL } from '$lib/config/cta';
	import { getBreadcrumbListSchema, getFAQPageSchema } from '$lib/schemas';
	import { VIEW_ORDER, viewImage } from '$lib/landing/views';
	import type { LandingPage } from '$lib/landing/types';

	interface LinkCard {
		href: string;
		label: string;
		blurb: string;
	}

	interface Props {
		page: LandingPage;
		kind: 'product' | 'solution';
		/** Product pages this page builds on (solutions) or sits next to (product). */
		builtOn: LinkCard[];
		/** Solutions that use this product page. Empty on solution pages. */
		usedBy: LinkCard[];
	}

	let { page, kind, builtOn, usedBy }: Props = $props();

	const base = $derived(kind === 'product' ? '/product' : '/solutions');
	const url = $derived(`https://scanopy.net${base}/${page.slug}`);
	const loc = $derived(`${kind}_${page.slug.replaceAll('-', '_')}`);
	const light = $derived(theme.resolved === 'light');

	const heroViews = $derived(
		page.heroView
			? [page.heroView, ...VIEW_ORDER.filter((v) => v !== page.heroView)].map((v) =>
					viewImage(v, light)
				)
			: []
	);

	const breadcrumb = $derived(
		getBreadcrumbListSchema([
			{ name: 'Home', url: 'https://scanopy.net' },
			{
				name: kind === 'product' ? 'Product' : 'Solutions',
				url: `https://scanopy.net${base}`
			},
			{ name: page.navLabel, url }
		])
	);

	const faqSchema = $derived(
		getFAQPageSchema(
			page.faqs.map((f) => ({ question: f.question, answer: f.answer.replace(/<[^>]+>/g, '') }))
		)
	);
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
	<link rel="canonical" href={url} />

	<meta property="og:title" content={page.title} />
	<meta property="og:description" content={page.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={page.title} />
	<meta name="twitter:description" content={page.description} />
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: page.title,
		description: page.description,
		url
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{#if page.faqs.length}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
	{/if}
</svelte:head>

{#snippet ctas(where: string)}
	<div class="flex flex-col justify-center gap-4 sm:flex-row">
		<a
			href={DEMO_BOOKING_URL}
			target="_blank"
			rel="noopener noreferrer"
			class="btn-primary px-8 py-3 text-lg"
			onclick={() =>
				analytics.ctaClicked({
					location: `${loc}_${where}`,
					destination: 'talk_to_sales',
					text: DEMO_CTA_LABEL
				})}
		>
			{DEMO_CTA_LABEL}
			<ArrowRight class="h-5 w-5" />
		</a>
		<LicenseCta location={`${loc}_${where}`} class="btn-secondary px-8 py-3 text-lg" />
	</div>
	<a
		href="https://demo.scanopy.net"
		target="_blank"
		rel="noopener noreferrer"
		class="mt-6 inline-block text-sm text-gray-500 transition-colors hover:text-blue-400"
		onclick={() =>
			analytics.ctaClicked({
				location: `${loc}_${where}`,
				destination: 'live_demo',
				text: 'View live demo'
			})}
	>
		View live demo &rarr;
	</a>
{/snippet}

{#snippet cards(items: LinkCard[])}
	<div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
		{#each items as item (item.href)}
			<a href={item.href} class="card flex flex-col p-6">
				<span class="text-lg font-semibold text-white">{item.label}</span>
				<span class="mt-2 leading-relaxed text-gray-400">{item.blurb}</span>
				<span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-400">
					Explore <ArrowRight class="h-4 w-4" />
				</span>
			</a>
		{/each}
	</div>
{/snippet}

<div class="home-bands">
	<!-- Hero -->
	<section class="py-20">
		<div class="container mx-auto max-w-3xl px-4 text-center">
			<span class="pill-eyebrow mb-4">{page.navLabel}</span>
			<h1 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				{page.heading}
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-300">{@html page.subhead}</p>
			<div class="mt-8">
				{@render ctas('hero')}
			</div>
		</div>
		{#if heroViews.length}
			<div class="container mx-auto mt-14 max-w-4xl px-4">
				<ViewSwitcher views={heroViews} defaultTab={page.heroView} />
			</div>
		{/if}
	</section>

	<!-- Capability sections -->
	{#each page.sections as section, i (section.heading)}
		<section class="border-t border-gray-800 py-20">
			<div class="container mx-auto px-4">
				<div class="mx-auto mb-12 max-w-3xl text-center">
					<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
						{section.heading}
					</h2>
					{#if section.standfirst}
						<p class="mx-auto mt-4 max-w-2xl text-gray-400">{@html section.standfirst}</p>
					{/if}
				</div>

				{#if section.figure?.kind === 'exports'}
					<EvidenceExports layout="cards" context="product" />
				{:else if section.figure}
					{@const fig = section.figure}
					<div
						class="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:gap-14 {i % 2 === 0
							? 'lg:flex-row'
							: 'lg:flex-row-reverse'}"
					>
						<div class="w-full lg:w-3/5">
							<div class="browser-frame">
								<div class="browser-frame-bar">
									<span class="browser-frame-dot bg-red-500/70"></span>
									<span class="browser-frame-dot bg-yellow-500/70"></span>
									<span class="browser-frame-dot bg-green-500/70"></span>
									<span class="ml-3 text-xs text-gray-500">app.scanopy.net</span>
								</div>
								{#if fig.kind === 'view'}
									{@const img = viewImage(fig.view, light)}
									<div class="aspect-[4/3] p-6" style="background-color: var(--topo-bg);">
										<img
											src={img.src}
											srcset={img.srcset}
											sizes="(max-width: 1024px) 100vw, 60vw"
											alt={img.alt}
											width={img.width}
											height={img.height}
											class="block h-full w-full object-contain"
											loading="lazy"
										/>
									</div>
								{:else if fig.kind === 'screenshot'}
									<img
										src={`/screenshots/${fig.name}.webp`}
										srcset={`/screenshots/${fig.name}-800w.webp 800w, /screenshots/${fig.name}-1200w.webp 1200w`}
										sizes="(max-width: 1024px) 100vw, 60vw"
										alt={fig.alt}
										width={fig.width}
										height={fig.height}
										class="block h-auto w-full"
										loading="lazy"
									/>
								{/if}
							</div>
						</div>
						<div class="space-y-6 lg:w-2/5">
							{#each section.points as point (point.title)}
								<div>
									<h3 class="mb-1 text-lg font-semibold text-white">{point.title}</h3>
									<p class="leading-relaxed text-gray-400">{@html point.body}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if !section.figure}
					<div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
						{#each section.points as point (point.title)}
							<div class="card card-static p-6">
								<h3 class="mb-2 text-lg font-semibold text-white">{point.title}</h3>
								<p class="leading-relaxed text-gray-400">{@html point.body}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	{/each}

	{#if page.quoteId}
		<section class="border-t border-gray-800 py-20">
			<div class="container mx-auto px-4">
				<CustomerQuote id={page.quoteId} />
			</div>
		</section>
	{/if}

	<!-- Cross-links: solutions point to the features they use, features point back. -->
	{#if builtOn.length || usedBy.length}
		<section class="border-t border-gray-800 py-20">
			<div class="container mx-auto space-y-16 px-4">
				{#if usedBy.length}
					<div>
						<h2 class="mb-10 text-center text-2xl font-bold text-white lg:text-3xl">
							Solutions built on {page.navLabel}
						</h2>
						{@render cards(usedBy)}
					</div>
				{/if}
				{#if builtOn.length}
					<div>
						<h2 class="mb-10 text-center text-2xl font-bold text-white lg:text-3xl">
							{kind === 'solution' ? 'The features behind it' : 'Related features'}
						</h2>
						{@render cards(builtOn)}
					</div>
				{/if}
			</div>
		</section>
	{/if}

	{#if page.faqs.length}
		<section class="border-t border-gray-800 py-20">
			<div class="container mx-auto max-w-3xl px-4">
				<div class="mb-12 text-center">
					<span class="pill-eyebrow mb-4">FAQ</span>
					<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl">Frequently asked questions</h2>
				</div>
				<FAQ faqs={page.faqs} />
			</div>
		</section>
	{/if}

	<!-- Closing CTA -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-6 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					See it on your own network.
				</h2>
				{@render ctas('cta')}
			</div>
		</div>
	</section>
</div>

<style>
	.home-bands :global(section:nth-of-type(even)) {
		background-color: rgb(var(--c-gray-900) / 0.5);
	}
</style>
