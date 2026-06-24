<script lang="ts">
	import { GithubStars, FeaturedIn, CustomerLogos, ViewSwitcher } from '$lib/components';

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
	import { getProductFeatures, getServiceCountLabel, getStartingMonthlyPrice } from '$lib/schemas';

	const serviceCount = getServiceCountLabel();
	const startingPrice = getStartingMonthlyPrice();

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
			description:
				'Versionable network state shows what changed before something broke.'
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

	const heroViews = [
		{
			id: 'l2',
			label: 'Physical (L2)',
			alt: 'Scanopy Physical (L2) view showing switch ports and discovered links',
			src: '/l2-1440w.webp',
			srcset: '/l2-960w.webp 960w, /l2-1440w.webp 1440w, /l2-2400w.webp 2400w',
			width: 1440,
			height: 1772
		},
		{
			id: 'l3',
			label: 'Logical (L3)',
			alt: 'Scanopy Logical (L3) view showing subnets, hosts, and network segmentation',
			src: '/l3-1440w.webp',
			srcset: '/l3-960w.webp 960w, /l3-1440w.webp 1440w, /l3-2400w.webp 2400w',
			width: 1440,
			height: 1175
		},
		{
			id: 'workloads',
			label: 'Workloads',
			alt: 'Scanopy Workloads view showing VMs and containers nested inside hypervisors and hosts',
			src: '/wl-1440w.webp',
			srcset: '/wl-960w.webp 960w, /wl-1440w.webp 1440w, /wl-2400w.webp 2400w',
			width: 1440,
			height: 1202
		},
		{
			id: 'application',
			label: 'Applications',
			alt: 'Scanopy Application view showing services grouped by application and the dependencies between them',
			src: '/app-1440w.webp',
			srcset: '/app-960w.webp 960w, /app-1440w.webp 1440w, /app-2400w.webp 2400w',
			width: 1440,
			height: 1601
		}
	];

	// Ordered to match heroViews: application, l3, workloads, l2
	const viewDetails = [
		{
			label: 'Physical (L2)',
			question: 'How are our switches wired?',
			answer: 'Every switch, every port, every link, with VLANs and port status.',
			alt: heroViews[0].alt,
			src: heroViews[0].src,
			srcset: heroViews[0].srcset,
			width: heroViews[0].width,
			height: heroViews[0].height
		},
		{
			label: 'Logical (L3)',
			question: 'How is our network segmented?',
			answer: 'Subnets and how hosts connect across them.',
			alt: heroViews[1].alt,
			src: heroViews[1].src,
			srcset: heroViews[1].srcset,
			width: heroViews[1].width,
			height: heroViews[1].height
		},
		{
			label: 'Workloads',
			question: 'What runs where?',
			answer: 'Bare metal to hypervisors to containers. The full nesting chain in one model.',
			alt: heroViews[2].alt,
			src: heroViews[2].src,
			srcset: heroViews[2].srcset,
			width: heroViews[2].width,
			height: heroViews[2].height
		},
		{
			label: 'Applications',
			question: 'How are our applications structured?',
			answer: 'Services and their dependencies, grouped by application.',
			alt: heroViews[3].alt,
			src: heroViews[3].src,
			srcset: heroViews[3].srcset,
			width: heroViews[3].width,
			height: heroViews[3].height
		}
	];

	const pressMentions = pressMentionsData as PressMention[];
	const customerLogos = customerLogosData as CustomerLogo[];
</script>

<svelte:head>
	<title>Scanopy - The Infrastructure Documentation Platform</title>
	<meta
		name="description"
		content="Never maintain another network diagram. Create a living model of your infrastructure. Built for modern teams and agents."
	/>
	<link rel="canonical" href="https://scanopy.net/" />

	<meta property="og:title" content="Scanopy - The Infrastructure Documentation Platform" />
	<meta property="og:description" content="Never maintain another network diagram. Create a living model of your infrastructure. Built for modern teams and agents." />
	<meta property="og:url" content="https://scanopy.net/" />
	<meta property="og:image" content="https://scanopy.net/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Scanopy - The Infrastructure Documentation Platform" />
	<meta name="twitter:description" content="Never maintain another network diagram. Create a living model of your infrastructure. Built for modern teams and agents." />
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
		imagesrcset="/l2-960w.webp 960w, /l2-1440w.webp 1440w, /l2-2400w.webp 2400w"
		imagesizes="(max-width: 1024px) 100vw, 60vw"
		fetchpriority="high"
	/>
	{@html `<script type="application/ld+json">${JSON.stringify(data.softwareApplicationSchema)}</script>`}
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden pb-16 pt-6 lg:pb-24 lg:pt-8">
	<!-- Radial glow behind the image -->
	<div
		class="pointer-events-none absolute right-0 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 translate-x-[10%] rounded-full opacity-30 blur-3xl lg:block"
		style="background: radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(96,165,250,0.15) 50%, transparent 70%);"
	></div>

	<div class="container relative z-10 mx-auto px-4">
		<div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
			<!-- Left side: text -->
			<div class="flex-shrink-0 text-center lg:w-[38%] lg:text-left">
				<div class="mb-6">
					<GithubStars />
				</div>

				<h1 class="mb-6 text-4xl font-bold leading-tight text-rose-400 sm:text-5xl lg:text-6xl" style="text-wrap: balance;">
					Never maintain another network diagram.
				</h1>

				<p class="mb-8 max-w-xl text-xl text-gray-300">
					Create a living model of your infrastructure. Built for modern teams and agents.
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
								destination: 'schedule_demo',
								text: 'Schedule Demo'
							})}
					>
						Schedule Demo
					</a>
				</div>
			</div>

			<!-- Right side: tabbed view switcher -->
			<div class="w-full lg:w-[62%]" use:tiltChild>
				<ViewSwitcher views={heroViews} defaultTab="l2" autoRotate />
				<a
					href="https://demo.scanopy.net/share/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-2 block text-center text-sm text-gray-500 hover:text-blue-400 transition-colors"
					onclick={() =>
						analytics.ctaClicked({
							location: 'hero',
							destination: 'share_demo',
							text: 'View live demo'
						})}
				>
					View live demo &rarr;
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Metrics -->
<div class="border-t border-gray-800 bg-gray-900/30 py-8">
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
</div>

<!-- Customer logos -->
<CustomerLogos logos={customerLogos} />

<!-- Problem beat -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto max-w-4xl px-4">
		<div class="mb-12 text-center">
			<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Your infrastructure isn't documented. It's inferred.
			</h2>
		</div>

		<div class="mb-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-950/40">
			<div class="hidden border-b border-gray-800 bg-gray-950/60 px-6 py-3 sm:grid sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-8">
				<div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Source</div>
				<div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Outcome</div>
			</div>
			{#each [
				{ source: 'Infrastructure as Code', outcome: 'Declared documentation that holds up until drift, manual changes, or anything provisioned outside the pipeline.' },
				{ source: 'Wikis and diagrams', outcome: 'Snapshots accurate when someone last updated them. Fiction by month two.' },
				{ source: 'Team memory', outcome: 'Implicit documentation that walks out the door when people leave.' }
			] as item (item.source)}
				<div class="grid gap-1 border-b border-gray-800 px-6 py-4 last:border-b-0 sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-8">
					<div class="font-semibold text-gray-300">{item.source}</div>
					<p class="text-sm text-gray-500">{item.outcome}</p>
				</div>
			{/each}
		</div>

		<div class="grid gap-1 rounded-xl border border-blue-500/40 bg-gradient-to-br from-blue-950/40 to-gray-900/40 px-6 py-5 shadow-lg shadow-blue-500/10 sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-8">
			<div class="text-lg font-bold text-white">Scanopy</div>
			<p class="text-gray-300">
				<span class="font-semibold text-rose-400">Observed network documentation</span> that reflects what's actually running. Every host, every dependency, <a href="/services" class="text-blue-400 hover:text-blue-300">{serviceCount} services</a>.
			</p>
		</div>
	</div>
</section>

<!-- The model, from every angle -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Analyze your observed network from every angle.
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
								<span class="ml-3 text-xs text-gray-500">demo.scanopy.net</span>
							</div>
							<div class="aspect-[4/3] p-6" style="background-color: #15131d;">
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
						<span
							class="mb-3 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
						>
							{view.label}
						</span>
						<h3 class="mb-4 text-2xl font-semibold text-white lg:text-3xl" style="text-wrap: balance;">
							{view.question}
						</h3>
						<p class="text-gray-400 leading-relaxed">{view.answer}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- What this unlocks Section -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				Outcomes
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
				Fewer fires. Safer changes. Smoother handoffs. Faster onboarding.
			</h2>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each useCases as useCase (useCase.title)}
				<div class="card card-static p-8">
					<div
						class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
					>
						<useCase.icon class="h-7 w-7 text-blue-400" />
					</div>
					<h3 class="mb-3 text-xl font-semibold text-white">{useCase.title}</h3>
					<p class="text-gray-400 leading-relaxed">{useCase.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Who it's for Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				Who it's for
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">Built for everyone responsible for network infrastructure</h2>
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

		<p class="mt-8 text-center text-sm text-gray-500">
			Also available as a free, <a href="/community" class="text-blue-400 hover:text-blue-300">self-hosted Community Edition</a> or <a href="https://github.com/scanopy/scanopy" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">on GitHub</a>.
		</p>
	</div>
</section>

<!-- Community Section -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				Community
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				What users are saying
			</h2>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each testimonials as testimonial (testimonial.author)}
				<div class="card card-static relative p-5">
					<Quote class="absolute right-3 top-3 h-6 w-6 text-blue-500/20" />
					<p class="mb-4 text-sm italic text-gray-300">
						"{testimonial.quote}"
					</p>
					<a href={testimonial.url} target="_blank" rel="noopener" class="text-sm font-medium text-gray-400 hover:text-blue-400">{testimonial.author}</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Featured In Section -->
<FeaturedIn mentions={pressMentions} />

<!-- Pricing Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-2">
		<div class="mb-12 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				Pricing
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				Flat-rate pricing. No per-device fees. Scale without surprises.
			</h2>
		</div>

		{#await import('$lib/components/PricingSection.svelte') then { default: PricingSection }}
			<PricingSection showGithubStars={false} showHosting={true} />
		{/await}
	</div>
</section>

<!-- Deploy in three steps -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				Get started
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				Deploy in three steps.
			</h2>
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

			<!-- Screenshot -->
			<div class="lg:w-1/2 flex justify-center">
				<img
					use:tilt
					src="/screenshots/discovery-progress-480w.webp"
					srcset="/screenshots/discovery-progress-480w.webp 480w, /screenshots/discovery-progress.webp 778w"
					sizes="(max-width: 1024px) 100vw, 384px"
					alt="Scanopy network scan in progress"
					class="max-w-sm w-full rounded-xl"
					style="box-shadow: 0 4px 40px rgba(59,130,246,0.08), 0 8px 24px rgba(0,0,0,0.4);"
					loading="lazy"
					width="480"
					height="396"
				/>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-6 text-3xl font-bold text-rose-400 lg:text-4xl">
				Your living network model is minutes away.
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
							destination: 'schedule_demo',
							text: 'Schedule Demo'
						})}
				>
					Schedule Demo
				</a>
			</div>
		</div>
	</div>
</section>

<section class="border-t border-gray-800 py-12">
	<div class="container mx-auto max-w-5xl px-4">
		<p class="text-sm text-gray-400 leading-relaxed">
			Scanopy is an infrastructure documentation platform. A single scanner discovers hosts, maps Layer 2 and Layer 3 topology, and fingerprints <a href="/services" class="text-blue-400 hover:text-blue-300">{serviceCount} services</a> per host, generating four views of your infrastructure from one scan and keeping them current on a schedule. The <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> is free and open-source (AGPL-3.0); Cloud plans start at {startingPrice}/month. Read <a href="/blog/automated-network-documentation" class="text-blue-400 hover:text-blue-300">how automated infrastructure documentation works</a> or our <a href="/docs/reference/security" class="text-blue-400 hover:text-blue-300">security practices</a>.
		</p>
	</div>
</section>
