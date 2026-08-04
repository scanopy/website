<script lang="ts">
	import { ViewSwitcher, CustomerQuote } from '$lib/components';
	import EvidenceExports from '$lib/components/EvidenceExports.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import { getFAQPageSchema } from '$lib/schemas';
	import { theme } from '$lib/theme.svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { page } from '$app/state';
	import { appHref, APP } from '$lib/config/urls';
	import { ArrowRight } from 'lucide-svelte';

	const title = 'Network Documentation Software - Scanopy';
	const description =
		'Scanopy is network documentation software that discovers your hosts, services, interfaces, and topology, then keeps the map and inventory current on a schedule. Self-hosted or cloud, flat pricing regardless of host count.';
	const url = 'https://scanopy.net/solutions/network-documentation';

	// What the daemon collects. Kept to what discovery actually returns; the category explainer
	// (what documentation software is, how it differs from monitoring and ITAM) lives in
	// /guides/network-documentation-software and is deliberately not repeated here.
	const discovers = [
		{ name: 'Hosts', blurb: 'IP and MAC addresses, hostnames, and vendor.' },
		{ name: 'Services', blurb: 'Hundreds of service types per host, not just an open port.' },
		{ name: 'Interfaces', blurb: 'Port numbers, speeds, types, and status, over SNMP.' },
		{ name: 'Topology', blurb: 'Links between devices, from LLDP, CDP, ARP, and forwarding tables.' },
		{ name: 'Device details', blurb: 'System description, uptime, location, serial, and model.' },
		{ name: 'Containers', blurb: 'Docker images, ports, networks, and labels.' }
	];

	const VIEW_META = [
		{
			id: 'l2',
			file: 'l2',
			label: 'Physical (L2)',
			height: 1779,
			alt: 'Scanopy Physical (L2) view showing switches, their ports, and the discovered links between them'
		},
		{
			id: 'l3',
			file: 'l3',
			label: 'Logical (L3)',
			height: 990,
			alt: 'Scanopy Logical (L3) view showing which hosts and services sit on each subnet'
		},
		{
			id: 'workloads',
			file: 'wl',
			label: 'Workloads',
			height: 1216,
			alt: 'Scanopy Workloads view showing VMs and containers nested inside their hypervisors and hosts'
		},
		{
			id: 'application',
			file: 'app',
			label: 'Applications',
			height: 1163,
			alt: 'Scanopy Application view showing services grouped by application and the dependencies between them'
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

	// Product questions. The category questions (what the software category is, how it compares to
	// a template, the open-source options) are answered in the guide's own FAQ block.
	const faqs = [
		{
			question: 'How does Scanopy discover the network?',
			answer:
				'A lightweight daemon runs inside your network and queries devices using protocols they already implement: SNMP for device and interface data, LLDP and CDP for neighbour relationships, and ARP and MAC forwarding tables for the links those do not cover. It also detects the services running on each host, and reads Docker containers where it has access to the container socket.'
		},
		{
			question: 'How often does the documentation update?',
			answer:
				'Scans run on a schedule you set, and the map reflects the most recent scan. You can also save a dated snapshot at any point, which gives you a record of what the network looked like on a given date and what changed since.'
		},
		{
			question: 'Can Scanopy run self-hosted?',
			answer:
				'Yes. The commercial self-hosted editions run entirely on your own infrastructure, and the discovery data, topology, and credentials stay inside your perimeter. Scanopy runs in air-gapped and on-premise environments with no outbound internet access, which suits OT networks and strict egress policies. Scanopy Community Edition is AGPL-3.0 and self-hosted as well.'
		},
		{
			question: 'Does Scanopy replace my monitoring platform?',
			answer:
				'No. Scanopy is a documentation tool and runs alongside whatever monitoring and asset management you already have. It does not do monitoring, alerting, traffic analysis, patch management, or configuration backup. It documents what is on the network and how it connects, and keeps that record current.'
		},
		{
			question: 'How do I get the map into our documentation?',
			answer:
				'Three ways, and they do different jobs. Export a static copy as an image (PNG, SVG, PDF), a self-contained HTML page, wiki markup (Mermaid or Confluence), or CSV of the underlying host and service data. Embed the live map in a wiki, dashboard, or intranet page via iframe. Or share a read-only link to the live map, which stays current as the network rescans.'
		},
		{
			question: 'How is Scanopy priced?',
			answer:
				'Flat, regardless of host count. Documentation is only useful when it covers the whole network, so per-device pricing would make complete coverage the most expensive option. Current tiers for both cloud and self-hosted are on the pricing page.'
		}
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
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
		url
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(getFAQPageSchema(faqs))}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://scanopy.net/' },
			{ '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://scanopy.net/solutions' },
			{ '@type': 'ListItem', position: 3, name: 'Network Documentation', item: url }
		]
	})}</script>`}
</svelte:head>

<div class="home-bands">
	<!-- Hero -->
	<section class="py-20">
		<div class="container mx-auto max-w-3xl px-4 text-center">
			<h1 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Network documentation software<span class="block">that keeps the map current.</span>
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
				A lightweight daemon discovers your hosts, services, interfaces, and topology, and rescans
				on a schedule. Nothing to draw, no spreadsheet to maintain.
			</p>
			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="https://demo.scanopy.net"
					target="_blank"
					rel="noopener"
					class="btn-primary px-8 py-3 text-lg"
					onclick={() =>
						analytics.ctaClicked({
							location: 'network_documentation_hero',
							destination: 'live_demo',
							text: 'View live demo'
						})}
				>
					View live demo
					<ArrowRight class="h-5 w-5" />
				</a>
				<a
					href={appHref(APP.onboarding, page.url.pathname, 'network-documentation-hero')}
					target="_blank"
					rel="noopener noreferrer"
					class="btn-secondary px-8 py-3 text-lg">Start free</a
				>
			</div>
		</div>
	</section>

	<!-- Four views. Leads the page: the map is the product, so show it before describing it. -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					One scan produces four views of the same network
				</h2>
				<p class="mx-auto max-w-2xl text-gray-400">
					The physical cabling, the subnets and what sits on them, the VMs and containers, and the
					services that make up an application.
				</p>
			</div>
			<div class="mx-auto max-w-4xl">
				<ViewSwitcher {views} defaultTab="l2" autoRotate />
			</div>
		</div>
	</section>

	<!-- What discovery returns -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Every field comes from a scan, not from someone typing it in
				</h2>
			</div>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each discovers as d (d.name)}
					<div class="card flex flex-col p-6">
						<span class="text-lg font-semibold text-white">{d.name}</span>
						<span class="mt-3 leading-relaxed text-gray-400">{d.blurb}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Getting the map out -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Nobody has to come to you for the current diagram
				</h2>
				<p class="mx-auto max-w-2xl text-gray-400">
					The map goes where people already look, in the form each one needs.
				</p>
			</div>
			<EvidenceExports layout="cards" context="product" />
		</div>
	</section>

	<!-- Positioning -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto max-w-3xl px-4 text-center">
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Change monitoring platforms without losing your maps
			</h2>
			<p class="mx-auto max-w-2xl text-gray-400">
				Scanopy documents the network and is priced independently of the tools it sits beside. More
				on the category in the
				<a href="/guides/network-documentation-software" class="text-blue-400 hover:text-blue-300"
					>guide</a
				>, and on specific products in the
				<a
					href="/comparisons/best-automated-network-diagram-tools"
					class="text-blue-400 hover:text-blue-300">comparison</a
				>.
			</p>
		</div>
	</section>

	<!-- Self-hosted -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto max-w-3xl px-4 text-center">
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Your network data never leaves your infrastructure
			</h2>
			<p class="mx-auto max-w-2xl text-gray-400">
				Self-hosted, Scanopy runs with no outbound internet access at all, including air-gapped.
				Deployment models and subprocessors are on the
				<a href="/security" class="text-blue-400 hover:text-blue-300">security page</a>.
			</p>
		</div>
	</section>

	<!-- Reference -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<CustomerQuote id="motala-kommun" />
		</div>
	</section>

	<!-- FAQ -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Frequently Asked Questions
				</h2>
			</div>
			<div class="mx-auto max-w-3xl">
				<FAQ {faqs} />
			</div>
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
								location: 'network_documentation_cta',
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
					The <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> is
					free and self-hosted. The
					<a href="/commercial" class="text-blue-400 hover:text-blue-300">commercial editions</a>
					remove the seat and network limits and add support, and
					<a href="/pricing" class="text-blue-400 hover:text-blue-300">pricing</a> covers the tiers.
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	/* Sections alternate their background automatically, matching the homepage and the other
	   solution pages. Counting by nth-of-type keeps the alternation correct if a section is
	   added, removed, or reordered. */
	.home-bands :global(section:nth-of-type(even)) {
		background-color: rgb(var(--c-gray-900) / 0.5);
	}
</style>
