<script lang="ts">
	import {
		GithubStars,
		FeaturedIn,
		CustomerLogos,
		ViewSwitcher,
		DiscoveryCardDemo
	} from '$lib/components';
	import { theme } from '$lib/theme.svelte';

	// Tilt action: entrance tilt on scroll + mouse-follow tilt.
	// Applies transforms to `target` (defaults to node itself).
	// Mouse events always listen on `node` so the hover area can be larger than the tilt target.
	function tilt(node: HTMLElement, target?: HTMLElement) {
		const el = target ?? node;
		const rect = el.getBoundingClientRect();
		const isSmall = rect.width < 400 || rect.height < 300;
		const maxTilt = isSmall ? 10 : 8;

		// Entrance animation via IntersectionObserver
		el.style.transform = 'perspective(800px) rotateX(3deg) rotateY(-3deg)';
		el.style.opacity = '0';
		el.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.6s ease';

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
						el.style.opacity = '1';
						observer.unobserve(el);
					}
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(el);

		// Mouse-follow tilt with smoothing
		let targetX = 0;
		let targetY = 0;
		let currentX = 0;
		let currentY = 0;
		let rafId: number | null = null;

		function animate() {
			currentX += (targetX - currentX) * 0.08;
			currentY += (targetY - currentY) * 0.08;
			el.style.transition = 'none';
			el.style.transform = `perspective(800px) rotateY(${currentX * maxTilt}deg) rotateX(${-currentY * maxTilt}deg)`;
			if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
				rafId = requestAnimationFrame(animate);
			} else {
				rafId = null;
			}
		}

		function handleMove(e: MouseEvent) {
			const r = node.getBoundingClientRect();
			targetX = (e.clientX - r.left) / r.width - 0.5;
			targetY = (e.clientY - r.top) / r.height - 0.5;
			if (!rafId) rafId = requestAnimationFrame(animate);
		}

		function handleLeave() {
			targetX = 0;
			targetY = 0;
			if (!rafId) rafId = requestAnimationFrame(animate);
		}

		node.addEventListener('mousemove', handleMove);
		node.addEventListener('mouseleave', handleLeave);

		return {
			destroy() {
				observer.disconnect();
				if (rafId) cancelAnimationFrame(rafId);
				node.removeEventListener('mousemove', handleMove);
				node.removeEventListener('mouseleave', handleLeave);
			}
		};
	}

	// Tilt action that targets the .tiltable child within the node.
	// The tab bar stays static; only the browser frame tilts.
	function tiltChild(node: HTMLElement) {
		const target = node.querySelector<HTMLElement>('.tiltable');
		if (!target) return;
		return tilt(node, target);
	}

	import type { PressMention, CustomerLogo } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import customerLogosData from '$lib/fixtures/customer-logos.json';
	import {
		Download,
		GitBranch,
		RefreshCw,
		Box,
		Share2,
		Quote,
		Layers,
		Filter,
		Activity,
		ArrowRightLeft,
		Shield,
		UserPlus,
		Briefcase,
		Monitor,
		Server,
		ArrowRight
	} from 'lucide-svelte';
	import type { Component } from 'svelte';
	import { analytics, featureFlags } from '$lib/analytics.svelte';
	import { page } from '$app/state';
	import { APP, appHref } from '$lib/config/urls';
	import {
		getProductFeatures,
		getServiceCountLabel,
		getStartingMonthlyPrice,
		getFAQPageSchema
	} from '$lib/schemas';
	import FAQ from '$lib/components/FAQ.svelte';

	const serviceCount = getServiceCountLabel();
	const startingPrice = getStartingMonthlyPrice();

	// Homepage FAQ — the product-definitional and positioning questions AI answer engines
	// ask about Scanopy itself. Deliberately scoped to what isn't already answered in Q&A
	// form elsewhere: billing specifics link out to /pricing (its own FAQ) and product
	// matchups link to the comparison, rather than restating them here. Facts reuse the
	// canonical wording already on the site (the closing summary, the pricing FAQ, and the
	// comparison FAQs) so a single change keeps them consistent.
	const homeFaqs = [
		{
			question: 'What is Scanopy?',
			answer:
				'Scanopy is automated network diagram and documentation software. You deploy one lightweight scanner and it discovers your hosts, maps Layer 2 and Layer 3 topology, and fingerprints the services running on each host — turning your live network into four documentation views that stay current on a schedule, instead of a diagram you redraw by hand.'
		},
		{
			question: 'How does Scanopy discover and document my network?',
			answer:
				'You install a single daemon on the network — no agents on individual endpoints. It scans on a schedule, finds every host, subnet, switch, service, and workload, and correlates them into four switchable views: L2 physical, L3 logical, workloads, and applications. Each re-scan refreshes the documentation automatically, so it reflects the network as it is now rather than when someone last updated a diagram by hand.'
		},
		{
			question: 'Does Scanopy replace network monitoring tools like PRTG or Auvik?',
			answer:
				'No. Monitoring tools track device health, bandwidth, and alerts over time; Scanopy documents what is on your network and how it is connected. It sits alongside your monitoring stack rather than replacing it — many teams run both. See the <a href="/comparisons/best-automated-network-diagram-tools" class="text-blue-400 hover:text-blue-300">tool comparison</a> for how it stacks up against specific products.'
		},
		{
			question: 'Is Scanopy free or open source?',
			answer:
				'Yes. The self-hosted <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> is free and open-source under AGPL-3.0, with one network and one seat. Paid <a href="/pricing" class="text-blue-400 hover:text-blue-300">Cloud plans</a> and a <a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial self-hosted license</a> lift those caps and add features like exports, integrations, and more seats.'
		},
		{
			question: 'How often does Scanopy update the network diagram?',
			answer:
				'Scanopy runs scheduled scans — typically hourly to daily, depending on how often your network changes — and refreshes the documentation automatically each time. It is scheduled rather than continuous, so it keeps your maps current without polling the network around the clock.'
		}
	];

	// FAQPage schema sourced from the same array the page renders (strip inline HTML so the
	// schema text matches the visible plain-text answer), matching the pricing-page pattern.
	const faqSchema = getFAQPageSchema(
		homeFaqs.map((f) => ({ question: f.question, answer: f.answer.replace(/<[^>]+>/g, '') }))
	);

	interface PageData {
		softwareApplicationSchema: Record<string, unknown>;
	}

	let { data }: { data: PageData } = $props();

	// Icon mapping from fixture string names to Svelte components
	const iconMap: Record<string, Component> = {
		Download,
		RefreshCw,
		Box,
		GitBranch,
		Share2,
		Layers,
		Filter
	};

	// Load features from fixture and map icons
	const productFeatures = getProductFeatures();
	const allFeatures = productFeatures.map((f) => ({
		icon: iconMap[f.icon] || Box,
		title: f.title,
		description: f.description,
		group: f.group
	}));
	const howItWorks = allFeatures.filter((f) => f.group === 'how_it_works');

	const useCases = [
		{
			icon: Activity,
			title: 'Reduce incident response time',
			description:
				"See a broken service's dependency chain. Troubleshoot from understanding, not memory."
		},
		{
			icon: ArrowRightLeft,
			title: 'De-risk changes',
			description:
				'Before migrating, resubnetting, or decommissioning a host, see what depends on it.'
		},
		{
			icon: GitBranch,
			title: 'Simplify post-mortems',
			description: 'Versionable network state shows what changed before something broke.'
		},
		{
			icon: Shield,
			title: 'Eliminate audit scrambles',
			description:
				'Export current topology as SVG, PNG, Mermaid, or Confluence markup. One audit-ready artifact per cycle.'
		},
		{
			icon: Share2,
			title: 'Give clients live maps',
			description:
				'Shareable live links and embeddable maps, per client. No logins, no stale screenshots.'
		},
		{
			icon: UserPlus,
			title: 'Onboard engineers faster',
			description:
				'New engineers get the infrastructure picture on day one. Four current views, not a stale wiki.'
		}
	];

	const testimonials = [
		{
			quote:
				"It really helped me catch a couple things that were suboptimal, and be like 'why is that there', and tidy a couple things up.",
			author: 'reinhart_menken',
			url: 'https://www.reddit.com/r/selfhosted/comments/1ohd1ce/comment/nm4isu8/'
		},
		{
			quote: "This is sick. I just tried it out on my network and discovery's doing its thing.",
			author: 'discoshanktank',
			url: 'https://www.reddit.com/r/selfhosted/comments/1ohd1ce/comment/nlq3k6n/'
		},
		{
			quote: "You're literally doing the thing I've dreamed of for ages.",
			author: 'blitz9826',
			url: 'https://www.reddit.com/r/selfhosted/comments/1ohd1ce/comment/nlnyyl2/'
		},
		{
			quote: "So many features, wasn't expecting a lot more than a simple scanner and a UI.",
			author: 'Medium_Chemist_4032',
			url: 'https://www.reddit.com/r/selfhosted/comments/1ohd1ce/comment/nloqmz8/'
		}
	];

	// Topology view screenshots come in light and dark variants and swap with the
	// site theme. width/height are identical across themes (same aspect ratio) to
	// avoid layout shift when the theme changes.
	const VIEW_META = [
		{
			id: 'l2',
			file: 'l2',
			label: 'Physical (L2)',
			height: 1779,
			alt: 'Scanopy Physical (L2) view showing switch ports and discovered links',
			question: 'How are our switches wired?',
			answer: 'Every switch, every port, every link, with VLANs and port status.'
		},
		{
			id: 'l3',
			file: 'l3',
			label: 'Logical (L3)',
			height: 990,
			alt: 'Scanopy Logical (L3) view showing subnets, hosts, and network segmentation',
			question: 'How is our network segmented?',
			answer: 'Subnets and how hosts connect across them.'
		},
		{
			id: 'workloads',
			file: 'wl',
			label: 'Workloads',
			height: 1216,
			alt: 'Scanopy Workloads view showing VMs and containers nested inside hypervisors and hosts',
			question: 'What runs where?',
			answer: 'Bare metal to hypervisors to containers. The full nesting chain in one model.'
		},
		{
			id: 'application',
			file: 'app',
			label: 'Applications',
			height: 1163,
			alt: 'Scanopy Application view showing services grouped by application and the dependencies between them',
			question: 'How are our applications structured?',
			answer: 'Services and their dependencies, grouped by application.'
		}
	];

	const heroViews = $derived(
		VIEW_META.map((v) => {
			const s = theme.resolved === 'light' ? '-light' : '';
			return {
				id: v.id,
				label: v.label,
				alt: v.alt,
				src: `/${v.file}${s}-1440w.webp`,
				srcset: `/${v.file}${s}-960w.webp 960w, /${v.file}${s}-1440w.webp 1440w, /${v.file}${s}-2400w.webp 2400w`,
				width: 1440,
				height: v.height
			};
		})
	);

	const viewDetails = $derived(
		VIEW_META.map((v, i) => ({
			label: v.label,
			question: v.question,
			answer: v.answer,
			alt: heroViews[i].alt,
			src: heroViews[i].src,
			srcset: heroViews[i].srcset,
			width: heroViews[i].width,
			height: heroViews[i].height
		}))
	);

	const pressMentions = pressMentionsData as PressMention[];
	const customerLogos = customerLogosData as CustomerLogo[];
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
	<meta property="og:image" content="https://scanopy.net/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Automated Network Diagram & Documentation Software - Scanopy"
	/>
	<meta
		name="twitter:description"
		content="Scanopy discovers your network (SNMP, LLDP, ARP) and builds living network diagrams automatically. Free tier, self-hosted option, no per-device fees."
	/>
	<meta name="twitter:image" content="https://scanopy.net/social.webp" />

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
		imagesrcset="/l2-960w.webp 960w, /l2-1440w.webp 1440w, /l2-2400w.webp 2400w"
		imagesizes="(max-width: 1024px) 100vw, 60vw"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		as="image"
		type="image/webp"
		media="(prefers-color-scheme: light)"
		imagesrcset="/l2-light-960w.webp 960w, /l2-light-1440w.webp 1440w, /l2-light-2400w.webp 2400w"
		imagesizes="(max-width: 1024px) 100vw, 60vw"
		fetchpriority="high"
	/>
	{@html `<script type="application/ld+json">${JSON.stringify(data.softwareApplicationSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
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
						Living network documentation that builds itself — and doesn't stop at the network. Built
						for modern teams and agents.
					</p>

					<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
						<a
							href={appHref(APP.onboarding, page.url.pathname, 'hero')}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-primary px-8 py-3 text-lg"
							onclick={() =>
								analytics.ctaClicked({
									location: 'hero',
									destination: 'app_onboarding',
									text: featureFlags.mainCtaText
								})}
						>
							{featureFlags.mainCtaText}
							<ArrowRight class="h-5 w-5" />
						</a>
						<a
							href="https://cal.com/mferrandiz/scanopy-demo"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-secondary px-8 py-3 text-lg"
							onclick={() =>
								analytics.ctaClicked({
									location: 'hero',
									destination: 'talk_to_sales',
									text: 'Talk to Sales'
								})}
						>
							Talk to Sales
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

	<!-- Metrics -->
	<section class="border-t border-gray-800 py-8">
		<div class="container mx-auto px-4">
			<div class="flex flex-wrap items-center justify-center gap-8 text-center md:gap-16">
				<div>
					<p class="text-2xl font-bold text-white md:text-3xl">52,493</p>
					<p class="text-sm text-gray-400">hosts discovered</p>
				</div>
				<div class="hidden h-8 w-px bg-gray-700 md:block"></div>
				<div>
					<p class="text-2xl font-bold text-white md:text-3xl">931</p>
					<p class="text-sm text-gray-400">networks mapped</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Customer logos -->
	<CustomerLogos logos={customerLogos} />

	<!-- Problem beat -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto max-w-4xl px-4">
			<div class="mb-12 text-center">
				<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Your network isn't documented. It's inferred.
				</h2>
			</div>

			<div class="mb-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-950/40">
				<div
					class="hidden border-b border-gray-800 bg-gray-950/60 px-6 py-3 sm:grid sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-8"
				>
					<div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Source</div>
					<div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
						Outcome
					</div>
				</div>
				{#each [{ source: 'Infrastructure as Code', outcome: 'Declared documentation that holds up until drift, manual changes, or anything provisioned outside the pipeline.' }, { source: 'Wikis and diagrams', outcome: 'Snapshots accurate when someone last updated them. Fiction by month two.' }, { source: 'Team memory', outcome: 'Implicit documentation that walks out the door when people leave.' }] as item (item.source)}
					<div
						class="grid gap-1 border-b border-gray-800 px-6 py-4 last:border-b-0 sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-8"
					>
						<div class="font-semibold text-gray-300">{item.source}</div>
						<p class="text-sm text-gray-500">{item.outcome}</p>
					</div>
				{/each}
			</div>

			<div
				class="grid gap-1 rounded-xl border border-blue-500/40 bg-gradient-to-br from-blue-50 to-paper px-6 py-5 shadow-lg shadow-blue-500/10 dark:from-blue-950/40 dark:to-gray-900/40 sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-8"
			>
				<div class="text-lg font-bold text-white">Scanopy</div>
				<p class="text-gray-300">
					<span class="font-semibold text-rose-400">Observed network documentation</span> that
					reflects what's actually running. Every host, every dependency,
					<a href="/services" class="text-blue-400 hover:text-blue-300">{serviceCount} services</a>.
				</p>
			</div>
		</div>
	</section>

	<!-- The model, from every angle -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Visualize your whole network — and everything running on it
				</h2>
			</div>

			<div class="space-y-20">
				{#each viewDetails as view, i (view.label)}
					<div
						class="flex flex-col items-center gap-10 lg:gap-14 {i % 2 === 0
							? 'lg:flex-row'
							: 'lg:flex-row-reverse'}"
					>
						<div class="lg:w-3/4" use:tiltChild>
							<div class="tiltable browser-frame">
								<div class="browser-frame-bar">
									<span class="browser-frame-dot bg-red-500/70"></span>
									<span class="browser-frame-dot bg-yellow-500/70"></span>
									<span class="browser-frame-dot bg-green-500/70"></span>
									<span class="ml-3 text-xs text-gray-500">app.scanopy.net</span>
								</div>
								<div class="aspect-[4/3] p-6" style="background-color: var(--topo-bg);">
									<img
										src={view.src}
										srcset={view.srcset}
										sizes="(max-width: 1024px) 100vw, 50vw"
										alt={view.alt}
										width={view.width}
										height={view.height}
										class="block h-full w-full object-contain"
										loading="lazy"
									/>
								</div>
							</div>
						</div>
						<div class="lg:w-1/4">
							<span class="pill-eyebrow mb-3">
								{view.label}
							</span>
							<h3
								class="mb-4 text-2xl font-semibold text-white lg:text-3xl"
								style="text-wrap: balance;"
							>
								{view.question}
							</h3>
							<p class="leading-relaxed text-gray-400">{view.answer}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- What this unlocks Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span class="pill-eyebrow mb-4"> Outcomes </span>
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Fewer fires. Safer changes. Smoother handoffs. Faster onboarding.
				</h2>
			</div>

			<div
				class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:snap-none md:gap-6 md:overflow-visible md:pb-0 md:grid-cols-2 lg:grid-cols-3"
			>
				{#each useCases as useCase (useCase.title)}
					<div class="card card-static shrink-0 basis-[85%] snap-start p-8 md:basis-auto">
						<div
							class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
						>
							<useCase.icon class="h-7 w-7 text-blue-400" />
						</div>
						<h3 class="mb-3 text-xl font-semibold text-white">{useCase.title}</h3>
						<p class="leading-relaxed text-gray-400">{useCase.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Who it's for Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span class="pill-eyebrow mb-4"> Who it's for </span>
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

	<!-- Featured In Section -->
	<FeaturedIn mentions={pressMentions} />

	<!-- Pricing Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-2">
			<div class="mb-8 text-center">
				<span class="pill-eyebrow mb-4"> Pricing </span>
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
					Flat-rate pricing. No per-device fees. Scale without surprises.
				</h2>
				<div class="mx-auto flex flex-col items-center justify-center gap-4 sm:flex-row">
					<p class="text-lg font-semibold text-gray-200">
						Prefer to run Scanopy on your own infrastructure?
					</p>
					<a
						href="/commercial"
						class="rounded-lg border border-blue-500/40 px-4 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-500/10 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
						onclick={() =>
							analytics.ctaClicked({
								location: 'pricing_selfhost',
								destination: 'commercial',
								text: 'Commercial Edition'
							})}
					>
						Commercial Edition
					</a>
					<a
						href="/pricing#editions"
						class="text-sm font-semibold text-blue-400 hover:text-blue-300"
						onclick={() =>
							analytics.ctaClicked({
								location: 'pricing_selfhost',
								destination: 'editions',
								text: 'Compare All Editions'
							})}
					>
						Compare All Editions →
					</a>
				</div>
			</div>

			{#await import('$lib/components/PricingSection.svelte') then { default: PricingSection }}
				<PricingSection showGithubStars={false} showHosting={true} />
			{/await}
		</div>
	</section>

	<!-- Community Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span class="pill-eyebrow mb-4"> Community </span>
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">What users are saying</h2>
			</div>

			<div
				class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:snap-none md:gap-6 md:overflow-visible md:pb-0 md:grid-cols-2 lg:grid-cols-4"
			>
				{#each testimonials as testimonial (testimonial.author)}
					<div class="card card-static relative shrink-0 basis-[85%] snap-start p-5 md:basis-auto">
						<Quote class="absolute right-3 top-3 h-6 w-6 text-blue-500/20" />
						<p class="mb-4 text-sm italic text-gray-300">
							"{testimonial.quote}"
						</p>
						<a
							href={testimonial.url}
							target="_blank"
							rel="noopener"
							class="text-sm font-medium text-gray-400 hover:text-blue-400">{testimonial.author}</a
						>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto max-w-3xl px-4">
			<div class="mb-12 text-center">
				<span class="pill-eyebrow mb-4"> FAQ </span>
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
					Frequently asked questions
				</h2>
			</div>
			<FAQ faqs={homeFaqs} />
		</div>
	</section>

	<!-- Deploy in three steps -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span class="pill-eyebrow mb-4"> Get started </span>
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">Deploy in three steps.</h2>
			</div>

			<div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
				<!-- Steps -->
				<div class="space-y-8 lg:w-1/2">
					{#each howItWorks as feature, i (feature.title)}
						<div class="flex gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800 text-lg font-bold text-blue-400 ring-1 ring-blue-800"
							>
								{i + 1}
							</div>
							<div>
								<h3 class="mb-1 text-lg font-semibold text-white">{feature.title}</h3>
								<p class="text-sm text-gray-400">{@html feature.description}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Live discovery card (HTML re-creation of the in-app scan card) -->
				<div class="flex justify-center lg:w-1/2">
					<div use:tilt class="w-full max-w-sm">
						<DiscoveryCardDemo />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-6 text-3xl font-bold text-rose-400 lg:text-4xl">
					Your living network documentation is minutes away.
				</h2>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href={appHref(APP.onboarding, page.url.pathname, 'bottom-cta')}
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'app_onboarding',
								text: featureFlags.mainCtaText
							})}
					>
						{featureFlags.mainCtaText}
						<ArrowRight class="h-5 w-5" />
					</a>
					<a
						href="https://cal.com/mferrandiz/scanopy-demo"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-secondary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'talk_to_sales',
								text: 'Talk to Sales'
							})}
					>
						Talk to Sales
					</a>
				</div>
				<p class="mt-6 text-sm text-gray-400">
					Prefer to self-host? Run the full stack in your own environment with the
					<a
						href="/commercial"
						class="text-blue-400 hover:text-blue-300"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'commercial',
								text: 'Commercial Edition'
							})}>Commercial Edition</a
					>.
				</p>
			</div>
		</div>
	</section>

	<section class="border-t border-gray-800 py-12">
		<div class="container mx-auto max-w-5xl px-4">
			<p class="text-sm leading-relaxed text-gray-400">
				Scanopy is automated network diagram and documentation software. A single scanner discovers hosts, maps Layer 2
				and Layer 3 topology, and fingerprints <a
					href="/services"
					class="text-blue-400 hover:text-blue-300">{serviceCount} services</a
				>
				per host — documenting not just the network but the services, dependencies, and workloads running
				on it, in four views from one scan and keeping them current on a schedule. The
				<a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a>
				is free and open-source (AGPL-3.0); a
				<a href="/commercial" class="text-blue-400 hover:text-blue-300">commercial license</a>
				lifts the self-host caps, and
				<a href="/pricing" class="text-blue-400 hover:text-blue-300">cloud plans</a>
				start at {startingPrice}/month. Read
				<a href="/blog/automated-network-documentation" class="text-blue-400 hover:text-blue-300"
					>how automated network documentation works</a
				>, compare the
				<a
					href="/comparisons/best-automated-network-diagram-tools"
					class="text-blue-400 hover:text-blue-300">best automated network diagram software</a
				>, browse the guide to
				<a
					href="/guides/network-documentation-software"
					class="text-blue-400 hover:text-blue-300">network documentation software</a
				>, or review our
				<a href="/docs/reference/security/" class="text-blue-400 hover:text-blue-300"
					>security practices</a
				>.
			</p>
		</div>
	</section>
</div>

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
