<script lang="ts">
	import { ViewSwitcher, CustomerQuote } from '$lib/components';
	import EvidenceExports from '$lib/components/EvidenceExports.svelte';
	import { theme } from '$lib/theme.svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { page } from '$app/state';
	import { appHref, APP } from '$lib/config/urls';
	import { ArrowRight } from 'lucide-svelte';

	const title = 'Audit-Ready Network Documentation - Scanopy';
	const description =
		'NIS2, ISO 27001, and HIPAA all expect network documentation that is accurate today, not last year. Scanopy discovers your network and keeps the map and inventory current on a schedule, so the evidence is ready before the auditor asks.';

	// Each card leads with the control that drives the requirement, then what Scanopy produces
	// for it, and links to the guide that maps the standard in full. PCI-DSS is intentionally
	// omitted until its guide ships.
	const standards = [
		{
			name: 'NIS2',
			control: 'Article 21(2)',
			href: '/guides/network-documentation-nis2',
			blurb:
				'Article 21 requires risk-management measures backed by an accurate picture of the network and its assets. Scanopy keeps the topology and inventory current on a schedule, and dated snapshots record that it stayed current between reviews.'
		},
		{
			name: 'ISO 27001:2022',
			control: 'A.8.20 / A.5.9',
			href: '/guides/network-documentation-iso27001',
			blurb:
				'ISO 27002 guidance names current network diagrams, and A.5.9 expects an asset inventory. Scanopy discovers both from the network itself, so the diagram an auditor asks for matches the network, not a redrawn approximation.'
		},
		{
			name: 'HIPAA',
			control: 'Security Rule risk analysis',
			href: '/guides/network-documentation-hipaa',
			blurb:
				'The required risk analysis depends on knowing your systems and how data moves between them. Scanopy maps the hosts, services, and application dependencies that the analysis is built on, and keeps that map current.'
		}
	];

	// Four topology views, framed the way the homepage hero frames them. Each view is the
	// evidence a control leans on; the Applications view is the data-flow map a risk analysis
	// is built on, so it leads.
	const VIEW_META = [
		{
			id: 'application',
			file: 'app',
			label: 'Applications',
			height: 1163,
			alt: 'Scanopy Application view showing services grouped by application and the dependencies between them, the data-flow map a risk analysis is built on'
		},
		{
			id: 'l3',
			file: 'l3',
			label: 'Logical (L3)',
			height: 990,
			alt: 'Scanopy Logical (L3) view showing subnets, hosts, and network segmentation'
		},
		{
			id: 'l2',
			file: 'l2',
			label: 'Physical (L2)',
			height: 1779,
			alt: 'Scanopy Physical (L2) view showing switch ports and discovered links, a physical topology and device inventory'
		},
		{
			id: 'workloads',
			file: 'wl',
			label: 'Workloads',
			height: 1216,
			alt: 'Scanopy Workloads view showing VMs and containers nested inside hypervisors and hosts'
		}
	];

	const views = $derived(
		VIEW_META.map((v) => {
			const s = theme.resolved === 'light' ? '-light' : '';
			return {
				id: v.id,
				label: v.label,
				alt: v.alt,
				src: `/common/${v.file}${s}-1440w.webp`,
				srcset: `/common/${v.file}${s}-960w.webp 960w, /common/${v.file}${s}-1440w.webp 1440w, /common/${v.file}${s}-2400w.webp 2400w`,
				width: 1440,
				height: v.height
			};
		})
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://scanopy.net/solutions/compliance" />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://scanopy.net/solutions/compliance" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		description,
		url: 'https://scanopy.net/solutions/compliance'
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://scanopy.net/' },
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Solutions',
				item: 'https://scanopy.net/solutions'
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: 'Compliance',
				item: 'https://scanopy.net/solutions/compliance'
			}
		]
	})}</script>`}
</svelte:head>

<div class="home-bands">
	<!-- Hero -->
	<section class="py-20">
		<div class="container mx-auto max-w-3xl px-4 text-center">
			<h1 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Audit-ready network documentation,<span class="block">without the effort.</span>
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
				NIS2, ISO 27001, and HIPAA all expect network documentation that is accurate today, not last
				year. Scanopy discovers your network and keeps the map and inventory current on a schedule,
				so the evidence is ready before the auditor asks.
			</p>
			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="https://demo.scanopy.net"
					target="_blank"
					rel="noopener"
					class="btn-primary px-8 py-3 text-lg"
					onclick={() =>
						analytics.ctaClicked({
							location: 'compliance_hero',
							destination: 'live_demo',
							text: 'View live demo'
						})}
				>
					View live demo
					<ArrowRight class="h-5 w-5" />
				</a>
				<a
					href={appHref(APP.onboarding, page.url.pathname, 'compliance-hero')}
					target="_blank"
					rel="noopener noreferrer"
					class="btn-secondary px-8 py-3 text-lg">Start free</a
				>
			</div>
		</div>
	</section>

	<!-- Standard cards -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					What NIS2, ISO 27001, and HIPAA expect, and what Scanopy produces
				</h2>
				<p class="mx-auto max-w-2xl text-gray-400">
					Each one expects documentation that reflects the network as it is now, plus evidence that
					it stayed that way over time.
				</p>
			</div>
			<div class="grid gap-8 md:grid-cols-3">
				{#each standards as s (s.name)}
					<a href={s.href} class="card flex flex-col p-6">
						<span class="text-xl font-semibold text-white">{s.name}</span>
						<span class="mt-0.5 text-sm text-gray-500">{s.control}</span>
						<span class="mt-3 leading-relaxed text-gray-400">{s.blurb}</span>
						<span class="mt-4 text-sm font-semibold text-blue-400">Read the guide &rarr;</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Topology visual: four views = the evidence each control leans on -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Give each control the evidence it asks for
				</h2>
				<p class="mx-auto max-w-2xl text-gray-400">
					One scan produces four topology views, generated from the live network rather than redrawn
					by hand. Each answers a question an assessor asks: what's on the network, how it's
					segmented, what runs where, and how data moves between systems.
				</p>
			</div>
			<div class="mx-auto max-w-4xl">
				<ViewSwitcher {views} defaultTab="application" autoRotate />
			</div>
		</div>
	</section>

	<!-- Evidence out -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Hand auditors evidence in whatever form they want
				</h2>
				<p class="mx-auto max-w-2xl text-gray-400">
					Producing the evidence stops being a scramble before each assessment. The current map is
					always a click from a document, a live embed, a shared link, or a dated record.
				</p>
			</div>
			<EvidenceExports layout="cards" />
		</div>
	</section>

	<!-- Self-hosted callout -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto max-w-3xl px-4 text-center">
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Self-hosted keeps the data on your infrastructure
			</h2>
			<p class="mx-auto max-w-2xl text-gray-400">
				Run Scanopy fully self-hosted and the network data never leaves your infrastructure. How
				Scanopy handles data in each deployment model, with subprocessors and security practices, is
				on the <a href="/security" class="text-blue-400 hover:text-blue-300">security page</a>.
			</p>
		</div>
	</section>

	<!-- Reference -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<CustomerQuote id="motala-kommun" />
		</div>
	</section>

	<!-- CTA -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-6 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					See it on your own network.
				</h2>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href="https://demo.scanopy.net"
						target="_blank"
						rel="noopener"
						class="btn-primary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'compliance_cta',
								destination: 'live_demo',
								text: 'View live demo'
							})}
					>
						View live demo
						<ArrowRight class="h-5 w-5" />
					</a>
					<a
						href="https://cal.com/mferrandiz/scanopy-demo"
						target="_blank"
						rel="noopener"
						class="btn-secondary px-8 py-3 text-lg">Book a demo</a
					>
				</div>
				<p class="mt-6 text-sm text-gray-400">
					Prefer to self-host? The
					<a href="/commercial" class="text-blue-400 hover:text-blue-300">commercial editions</a>
					run in your own environment with support, and
					<a href="/pricing" class="text-blue-400 hover:text-blue-300">pricing</a> covers the tiers.
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	/* Sections alternate their background automatically, matching the homepage and product
	   pages. Counting by nth-of-type keeps the alternation correct if a section is added,
	   removed, or reordered. */
	.home-bands :global(section:nth-of-type(even)) {
		background-color: rgb(var(--c-gray-900) / 0.5);
	}
</style>
