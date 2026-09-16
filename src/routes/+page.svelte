<script lang="ts">
	import {
		GithubStars,
		FeaturedIn,
		ViewSwitcher,
		CustomerQuote,
		CustomerLogos
	} from '$lib/components';
	import { theme } from '$lib/theme.svelte';
	import { tiltChild } from '$lib/actions/tilt';

	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import { Activity, Shield, Briefcase, Monitor, ArrowRight } from 'lucide-svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { page } from '$app/state';
	import {
		DEMO_BOOKING_URL,
		DEMO_CTA_LABEL,
		LICENSE_CTA_LABEL,
		PRICING_CTA_LABEL,
		PRICING_HREF
	} from '$lib/config/cta';
	import { licenseHref, trackLicenseClick } from '$lib/licensePath.svelte';
	import StickyCtaBar, { type StickyCta } from '$lib/components/StickyCtaBar.svelte';
	import {
		getServiceCountLabel,
		getStartingMonthlyPrice,
		getSelfHostedStartingAnnualPrice
	} from '$lib/schemas';

	const serviceCount = getServiceCountLabel();
	const startingPrice = getStartingMonthlyPrice();
	const selfHostedFrom = getSelfHostedStartingAnnualPrice();

	// Mobile-only sticky bar mirroring the (collapsed) navbar CTAs, so the primary
	// actions stay reachable while scrolling. Hides once the bottom CTA section is
	// reached. Desktop already shows both CTAs in the persistent navbar.
	let bottomCta = $state<HTMLElement>();

	const homeCtas: StickyCta[] = [
		{
			label: DEMO_CTA_LABEL,
			href: DEMO_BOOKING_URL,
			variant: 'primary',
			external: true,
			onclick: () =>
				analytics.ctaClicked({
					location: 'sticky_bar',
					destination: 'talk_to_sales',
					text: DEMO_CTA_LABEL
				})
		},
		{
			label: LICENSE_CTA_LABEL,
			href: licenseHref(page.url.pathname, 'sticky-bar'),
			variant: 'secondary',
			external: true,
			onclick: () => trackLicenseClick('sticky_bar')
		}
	];

	interface PageData {
		softwareApplicationSchema: Record<string, unknown>;
	}

	let { data }: { data: PageData } = $props();

	// Topology view screenshots come in light and dark variants and swap with the
	// site theme. width/height are identical across themes (same aspect ratio) to
	// avoid layout shift when the theme changes.
	const VIEW_META = [
		{
			id: 'l2',
			file: 'l2',
			label: 'Physical (L2)',
			height: 1779,
			alt: 'Scanopy Physical (L2) view showing switch ports and discovered links'
		},
		{
			id: 'l3',
			file: 'l3',
			label: 'Logical (L3)',
			height: 990,
			alt: 'Scanopy Logical (L3) view showing subnets, hosts, and network segmentation'
		},
		{
			id: 'workloads',
			file: 'wl',
			label: 'Workloads',
			height: 1216,
			alt: 'Scanopy Workloads view showing VMs and containers nested inside hypervisors and hosts'
		},
		{
			id: 'application',
			file: 'app',
			label: 'Applications',
			height: 1163,
			alt: 'Scanopy Application view showing services grouped by application and the dependencies between them'
		}
	];

	const heroViews = $derived(
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

	const pressMentions = pressMentionsData as PressMention[];
</script>

<svelte:head>
	<title>Automated Network Diagram & Documentation Software - Scanopy</title>
	<meta
		name="description"
		content="Scanopy discovers your network (SNMP, LLDP, ARP) and builds living network diagrams automatically. Free tier, self-hosted option, no per-device fees."
	/>
	<link rel="canonical" href="https://scanopy.net/" />

	<meta
		property="og:title"
		content="Automated Network Diagram & Documentation Software - Scanopy"
	/>
	<meta
		property="og:description"
		content="Scanopy discovers your network (SNMP, LLDP, ARP) and builds living network diagrams automatically. Free tier, self-hosted option, no per-device fees."
	/>
	<meta property="og:url" content="https://scanopy.net/" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Automated Network Diagram & Documentation Software - Scanopy"
	/>
	<meta
		name="twitter:description"
		content="Scanopy discovers your network (SNMP, LLDP, ARP) and builds living network diagrams automatically. Free tier, self-hosted option, no per-device fees."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	<link
		rel="alternate"
		type="application/rss+xml"
		title="Scanopy Changelog"
		href="https://scanopy.net/feed.xml"
	/>
	<link
		rel="preload"
		as="image"
		type="image/webp"
		media="(prefers-color-scheme: dark)"
		imagesrcset="/common/l2-960w.webp 960w, /common/l2-1440w.webp 1440w, /common/l2-2400w.webp 2400w"
		imagesizes="(max-width: 1024px) 100vw, 60vw"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		as="image"
		type="image/webp"
		media="(prefers-color-scheme: light)"
		imagesrcset="/common/l2-light-960w.webp 960w, /common/l2-light-1440w.webp 1440w, /common/l2-light-2400w.webp 2400w"
		imagesizes="(max-width: 1024px) 100vw, 60vw"
		fetchpriority="high"
	/>
	{@html `<script type="application/ld+json">${JSON.stringify(data.softwareApplicationSchema)}</script>`}
</svelte:head>

<!-- Section backgrounds alternate automatically (see <style> below), so adding,
	removing, or reordering a band keeps the light/dark stripes in sync. -->
<div class="home-bands">
	<!-- Hero Section -->
	<section class="relative overflow-hidden pb-16 pt-6 lg:pb-24 lg:pt-8">
		<!-- Radial glow behind the image -->
		<div
			class="pointer-events-none absolute right-0 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 translate-x-[10%] rounded-full opacity-30 blur-3xl lg:block"
			style="background: radial-gradient(circle, rgb(var(--c-blue-500) / 0.4) 0%, rgb(var(--c-blue-400) / 0.15) 50%, transparent 70%);"
		></div>

		<div class="container relative z-10 mx-auto px-4">
			<div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
				<!-- Left side: text -->
				<div class="flex-shrink-0 text-center lg:w-[38%] lg:text-left">
					<div class="mb-6">
						<GithubStars />
					</div>

					<h1
						class="mb-6 text-4xl font-bold leading-tight text-rose-400 sm:text-5xl lg:text-6xl"
						style="text-wrap: balance;"
					>
						Never maintain another network diagram.
					</h1>

					<p class="mb-8 max-w-xl text-xl text-gray-300">
						Living network documentation that builds itself, and doesn't stop at the network. Built
						for modern teams and agents.
					</p>

					<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
						<a
							href={DEMO_BOOKING_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-primary px-8 py-3 text-lg"
							onclick={() =>
								analytics.ctaClicked({
									location: 'hero',
									destination: 'talk_to_sales',
									text: DEMO_CTA_LABEL
								})}
						>
							{DEMO_CTA_LABEL}
							<ArrowRight class="h-5 w-5" />
						</a>
						<a
							href={PRICING_HREF}
							class="btn-secondary px-8 py-3 text-lg"
							onclick={() =>
								analytics.ctaClicked({
									location: 'hero',
									destination: 'pricing',
									text: PRICING_CTA_LABEL
								})}
						>
							{PRICING_CTA_LABEL}
						</a>
					</div>
				</div>

				<!-- Right side: tabbed view switcher -->
				<div class="w-full lg:w-[62%]" use:tiltChild>
					<ViewSwitcher views={heroViews} defaultTab="l2" autoRotate />
					<a
						href="https://demo.scanopy.net"
						target="_blank"
						rel="noopener noreferrer"
						class="mt-2 block text-center text-sm text-gray-500 transition-colors hover:text-blue-400"
						onclick={() =>
							analytics.ctaClicked({
								location: 'hero',
								destination: 'live_demo',
								text: 'View Live Demo'
							})}
					>
						View Live Demo &rarr;
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Customer logos: an untitled band of named proof directly under the hero -->
	<CustomerLogos />

	<!-- Who it's for Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
					Built for the teams that manage infrastructure
				</h2>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				<div class="card card-static p-6 text-center">
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
					>
						<Monitor class="h-7 w-7 text-blue-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">IT Operations</h3>
					<p class="mb-4 text-gray-400">
						Network architecture and physical topology, always current.
					</p>
				</div>

				<div class="card card-static p-6 text-center">
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
					>
						<Briefcase class="h-7 w-7 text-blue-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">MSPs</h3>
					<p class="mb-4 text-gray-400">
						Per-client documentation with live portals. No logins required.
					</p>
				</div>

				<div class="card card-static p-6 text-center">
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
					>
						<Shield class="h-7 w-7 text-blue-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">Security & Compliance</h3>
					<p class="mb-4 text-gray-400">
						Network segmentation validation and audit-ready documentation.
					</p>
				</div>

				<div class="card card-static p-6 text-center">
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
					>
						<Activity class="h-7 w-7 text-blue-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">Platform & DevOps</h3>
					<p class="mb-4 text-gray-400">
						Service dependencies and workload placement without APM instrumentation.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured In (press) -->
	<FeaturedIn mentions={pressMentions} />

	<!-- Featured customer: the named proof point in depth, last word before the CTA -->
	<section class="border-t border-gray-800 py-16">
		<CustomerQuote id="motala-kommun" />
	</section>

	<!-- CTA Section -->
	<section bind:this={bottomCta} class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Run Scanopy on your own infrastructure.
				</h2>
				<p class="mb-8 text-gray-400">
					Book a demo for a walkthrough, or see what each self-hosted plan costs.
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href={DEMO_BOOKING_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'talk_to_sales',
								text: DEMO_CTA_LABEL
							})}
					>
						{DEMO_CTA_LABEL}
						<ArrowRight class="h-5 w-5" />
					</a>
					<a
						href={PRICING_HREF}
						class="btn-secondary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'pricing',
								text: PRICING_CTA_LABEL
							})}
					>
						{PRICING_CTA_LABEL}
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="border-t border-gray-800 py-12">
		<div class="container mx-auto max-w-5xl px-4">
			<p class="text-sm leading-relaxed text-gray-400">
				Scanopy is automated network diagram and documentation software. A single scanner discovers
				hosts, maps Layer 2 and Layer 3 topology, and fingerprints <a
					href="/services"
					class="text-blue-400 hover:text-blue-300">{serviceCount} services</a
				>
				per host, documenting not just the network but the services, dependencies, and workloads running
				on it, in four views from one scan and keeping them current on a schedule. The
				<a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a>
				is free and open-source (AGPL-3.0) for one network and one seat. A
				<a href="/commercial" class="text-blue-400 hover:text-blue-300">commercial license</a>
				lifts those caps for self-hosted deployments, starting at {selfHostedFrom}/year, and
				<a href="/pricing" class="text-blue-400 hover:text-blue-300">cloud plans</a>
				start at {startingPrice}/month. Read
				<a href="/blog/automated-network-documentation" class="text-blue-400 hover:text-blue-300"
					>how automated network documentation works</a
				>, compare
				<a
					href="/comparisons/best-automated-network-diagram-tools"
					class="text-blue-400 hover:text-blue-300">network diagram tools</a
				>, browse the
				<a
					href="/guides/open-source-network-documentation"
					class="text-blue-400 hover:text-blue-300">open-source options</a
				>, or review our
				<a href="/security" class="text-blue-400 hover:text-blue-300">security practices</a>.
			</p>
		</div>
	</section>
</div>

<StickyCtaBar target={bottomCta} ctas={homeCtas} desktop={false} />

<style>
	/* Homepage content sections alternate their background automatically. Counting
	   by nth-of-type means inserting, removing, or reordering a <section> keeps the
	   alternation correct with no manual background classes to maintain. :global lets
	   sibling sections rendered by child components (logo wall, press strip) join the
	   same rhythm. */
	.home-bands :global(section:nth-of-type(even)) {
		background-color: rgb(var(--c-gray-900) / 0.5);
	}
</style>
