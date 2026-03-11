<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { GithubStars, FeaturedIn, PricingSection } from '$lib/components';

	// Tilt action: entrance tilt on scroll + mouse-follow tilt
	function tilt(node: HTMLElement) {
		const rect = node.getBoundingClientRect();
		const isSmall = rect.width < 400 || rect.height < 300;
		const maxTilt = isSmall ? 10 : 8;

		// Entrance animation via IntersectionObserver
		node.style.transform = 'perspective(800px) rotateX(3deg) rotateY(-3deg)';
		node.style.opacity = '0';
		node.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.6s ease';

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
						node.style.opacity = '1';
						observer.unobserve(node);
					}
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(node);

		// Mouse-follow tilt with smoothing
		let targetX = 0;
		let targetY = 0;
		let currentX = 0;
		let currentY = 0;
		let rafId: number | null = null;

		function animate() {
			currentX += (targetX - currentX) * 0.08;
			currentY += (targetY - currentY) * 0.08;
			node.style.transition = 'none';
			node.style.transform = `perspective(800px) rotateY(${currentX * maxTilt}deg) rotateX(${-currentY * maxTilt}deg)`;
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
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import {
		Network,
		Download,
		GitBranch,
		RefreshCw,
		Box,
		Share2,
		Quote,
		Users,
		ClipboardCheck,
		Briefcase,
		Monitor,
		Server,
		ArrowRight
	} from 'lucide-svelte';
	import type { Component } from 'svelte';
	import { analytics, featureFlags } from '$lib/analytics.svelte';
	import { getSoftwareApplicationSchema, getProductFeatures } from '$lib/schemas';

	const diagramTools = ['Visio', 'Lucidchart', 'Draw.io', 'PowerPoint', 'Miro', 'Gliffy'];
	let currentTool = $state(diagramTools[0]);

	onMount(() => {
		let index = 0;
		const interval = setInterval(() => {
			index = (index + 1) % diagramTools.length;
			currentTool = diagramTools[index];
		}, 2500);
		return () => clearInterval(interval);
	});

	// Icon mapping from fixture string names to Svelte components
	const iconMap: Record<string, Component> = {
		Download,
		Network,
		RefreshCw,
		Box,
		GitBranch,
		Share2
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
	const whatYouGet = allFeatures
		.filter((f) => f.group === 'what_you_get')
		.sort((a, b) => {
			// Put "Version history" last since it has no screenshot
			if (a.title === 'Version history') return 1;
			if (b.title === 'Version history') return -1;
			return 0;
		});

	// Generate schema from fixtures (async — resolved at build time during prerender)
	const softwareApplicationSchemaPromise = getSoftwareApplicationSchema();

	// How it works step screenshots
	const howItWorksScreenshots = [
		'/screenshots/daemon-install.webp',
		'/screenshots/discovery-progress.webp',
		'/hero-topology-dark.webp'
	];

	// What you get screenshots — matches sorted order: service_detection, sharing, versioning
	const whatYouGetScreenshots: (string | null)[] = [
		'/screenshots/hosts-catalog.webp',
		'/screenshots/export-modal.webp',
		null
	];

	const useCases = [
		{
			icon: Users,
			title: 'Onboard faster',
			description:
				'New hires and new clients see the whole picture on day one — no digging through outdated wikis.'
		},
		{
			icon: Briefcase,
			title: 'Impress your customers',
			description:
				'Transform documentation into a live client portal with zero manual updates.'
		},
		{
			icon: ClipboardCheck,
			title: 'Streamline audits',
			description: 'Hand auditors a live network map instead of outdated spreadsheets.'
		}
	];

	const testimonials = [
		{
			quote:
				"It really helped me catch a couple things that were suboptimal, and be like 'why is that there', and tidy a couple things up.",
			author: 'u/reinhart_menken'
		},
		{
			quote: "This is sick. I just tried it out on my network and discovery's doing its thing.",
			author: 'u/discoshanktank'
		},
		{
			quote: "You're literally doing the thing I've dreamed of for ages.",
			author: 'u/blitz9826'
		},
		{
			quote: "So many features, wasn't expecting a lot more than a simple scanner and a UI.",
			author: 'u/Medium_Chemist_4032'
		}
	];

	const pressMentions = pressMentionsData as PressMention[];
</script>

<svelte:head>
	<title>Scanopy - Automatic Network Documentation</title>
	<meta
		name="description"
		content="Network documentation that updates itself. Deploy a scanner, get live diagrams in minutes. Open source."
	/>
	<link rel="canonical" href="https://scanopy.net/" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Scanopy Changelog"
		href="https://scanopy.net/feed.xml"
	/>
	<link rel="preload" as="image" href="/hero-topology-dark.webp" fetchpriority="high" />
	{#await softwareApplicationSchemaPromise then schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/await}
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden py-16 lg:py-24">
	<!-- Radial glow behind the image -->
	<div
		class="pointer-events-none absolute right-0 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 translate-x-[10%] rounded-full opacity-30 blur-3xl lg:block"
		style="background: radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(96,165,250,0.15) 50%, transparent 70%);"
	></div>

	<div class="container relative z-10 mx-auto px-4">
		<div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
			<!-- Left side: text -->
			<div class="flex-shrink-0 text-center lg:w-[40%] lg:text-left">
				<div class="mb-6">
					<GithubStars />
				</div>

				<h1 class="mb-6 text-5xl font-bold leading-tight text-rose-400 lg:text-7xl">
					Network documentation that updates itself
				</h1>

				<p class="mb-10 max-w-xl text-xl text-gray-300">
					Deploy a lightweight scanner, get live network diagrams in minutes. No manual
					maintenance, no stale Visio files.
				</p>

				<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
					<a
						href="https://app.scanopy.net/onboarding"
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
						href="/pricing"
						class="btn-secondary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'hero',
								destination: 'pricing',
								text: 'Compare Plans'
							})}
					>
						Compare Plans
					</a>
				</div>
			</div>

			<!-- Right side: product screenshot in browser mockup -->
			<div class="w-full lg:w-[60%]">
				<a
					href="https://demo.scanopy.net/share/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
					target="_blank"
					rel="noopener noreferrer"
					class="group block"
					onclick={() =>
						analytics.ctaClicked({
							location: 'hero',
							destination: 'share_demo',
							text: 'Hero topology screenshot'
						})}
				>
					<div use:tilt class="browser-frame transition-shadow duration-200 group-hover:shadow-blue-500/10 group-hover:shadow-2xl">
						<div class="browser-frame-bar">
							<span class="browser-frame-dot bg-red-500/70"></span>
							<span class="browser-frame-dot bg-yellow-500/70"></span>
							<span class="browser-frame-dot bg-green-500/70"></span>
							<span class="ml-3 text-xs text-gray-500">demo.scanopy.net</span>
						</div>
						<img
							src="/hero-topology-dark.webp"
							alt="Scanopy network topology showing subnets, services, and connections"
							class="block w-full"
							loading="eager"
							fetchpriority="high"
							width="3706"
							height="3030"
						/>
					</div>
					<p class="mt-2 text-center text-sm text-gray-500 group-hover:text-blue-400 transition-colors">View live topology &rarr;</p>
				</a>
			</div>
		</div>
	</div>
</section>

<!-- How it works Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				How it works
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				Up and running in three simple steps
			</h2>
		</div>

		<!-- Timeline -->
		<div class="relative">
			<!-- Connecting line (desktop) -->
			<div
				class="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-blue-800 to-transparent md:block"
			></div>

			<div class="grid gap-12 md:grid-cols-3 md:gap-8">
				{#each howItWorks as feature, i (feature.title)}
					<div class="relative flex flex-col items-center text-center">
						<!-- Step number -->
						<div
							class="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 text-lg font-bold text-blue-400 ring-1 ring-blue-800"
						>
							{i + 1}
						</div>

						<!-- Icon + text -->
						<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
							<feature.icon class="h-5 w-5 text-blue-400" />
						</div>
						<h3 class="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
						<p class="mb-6 text-sm text-gray-400">{@html feature.description}</p>

						<!-- Screenshot -->
						{#if howItWorksScreenshots[i]}
							<img
								use:tilt
								src={howItWorksScreenshots[i]}
								alt={feature.title}
								class="w-full rounded-xl border border-gray-700/50" style="box-shadow: 0 4px 40px rgba(59,130,246,0.08), 0 8px 24px rgba(0,0,0,0.4);"
								loading="lazy"
							/>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- What you get Section -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				What you get
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				Everything you need to master your network
			</h2>
		</div>

		<div class="space-y-16">
			{#each whatYouGet as feature, i (feature.title)}
				{@const screenshot = whatYouGetScreenshots[i]}
				{@const reversed = i % 2 === 1}
				{#if screenshot}
					<!-- Alternating split layout -->
					<div
						class="flex flex-col items-center gap-8 lg:gap-12 {reversed
							? 'lg:flex-row-reverse'
							: 'lg:flex-row'}"
					>
						<div class="lg:w-1/2">
							<div
								class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10"
							>
								<feature.icon class="h-6 w-6 text-blue-400" />
							</div>
							<h3 class="mb-3 text-2xl font-semibold text-white">{feature.title}</h3>
							<p class="text-gray-400">{@html feature.description}</p>
						</div>
						<div class="lg:w-1/2">
							{#if screenshot === '/screenshots/hosts-catalog.webp'}
								<div use:tilt class="browser-frame">
									<div class="browser-frame-bar">
										<span class="browser-frame-dot bg-red-500/70"></span>
										<span class="browser-frame-dot bg-yellow-500/70"></span>
										<span class="browser-frame-dot bg-green-500/70"></span>
										<span class="ml-3 text-xs text-gray-500">app.scanopy.net</span>
									</div>
									<img
										src={screenshot}
										alt={feature.title}
										class="block w-full"
										loading="lazy"
										width="2514"
										height="1666"
									/>
								</div>
							{:else}
								<img
									use:tilt
									src={screenshot}
									alt={feature.title}
									class="mx-auto max-w-xs rounded-xl border border-gray-700/50" style="box-shadow: 0 4px 40px rgba(59,130,246,0.08), 0 8px 24px rgba(0,0,0,0.4);"
									loading="lazy"
								/>
							{/if}
						</div>
					</div>
				{:else}
					<!-- Card layout for features without screenshots -->
					<div class="mx-auto max-w-2xl">
						<div class="card card-static p-8 text-center">
							<div
								class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10"
							>
								<feature.icon class="h-6 w-6 text-blue-400" />
							</div>
							<h3 class="mb-3 text-2xl font-semibold text-white">{feature.title}</h3>
							<p class="text-gray-400">{@html feature.description}</p>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- Use Cases Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				Use cases
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				Less
				<span
					class="relative inline-block h-[1.15em] overflow-hidden align-baseline"
					style="top: 0.15em;"
				>
					{#key currentTool}
						<span
							class="absolute bottom-0 left-0"
							in:fly={{ y: 24, duration: 250, delay: 150 }}
							out:fly={{ y: -24, duration: 250 }}
						>
							{currentTool}
						</span>
					{/key}
					<span class="invisible">{currentTool}</span>
				</span> wrangling, more clarity
			</h2>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each useCases as useCase (useCase.title)}
				<div class="text-center">
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
					>
						<useCase.icon class="h-7 w-7 text-blue-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">{useCase.title}</h3>
					<p class="text-gray-400">{useCase.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Who it's for Section -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400"
			>
				Who it's for
			</span>
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">Built for your team</h2>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="card card-static p-6 text-center">
				<div
					class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
				>
					<Monitor class="h-7 w-7 text-blue-400" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-white">IT Teams</h3>
				<p class="mb-4 text-gray-400">
					Your network diagram is always out of date. Fix it permanently.
				</p>
				<a
					href="https://app.scanopy.net/onboarding"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-blue-400 hover:underline"
				>
					Get started &rarr;
				</a>
			</div>

			<div class="card card-static p-6 text-center">
				<div
					class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
				>
					<Briefcase class="h-7 w-7 text-blue-400" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-white">MSPs</h3>
				<p class="mb-4 text-gray-400">
					Document every client network. Share live maps without granting logins.
				</p>
				<a
					href="https://demo.scanopy.net/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-blue-400 hover:underline"
				>
					See a live demo &rarr;
				</a>
			</div>

			<div class="card card-static p-6 text-center">
				<div
					class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10"
				>
					<Server class="h-7 w-7 text-blue-400" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-white">Self-Hosters</h3>
				<p class="mb-4 text-gray-400">Free, open-source, runs on your hardware.</p>
				<a
					href="https://github.com/scanopy/scanopy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-blue-400 hover:underline"
				>
					View on GitHub &rarr;
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Featured In Section -->
<FeaturedIn mentions={pressMentions} />

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
				Feedback from r/selfhosted and r/homelab
			</h2>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each testimonials as testimonial (testimonial.author)}
				<div class="card card-static relative p-5">
					<Quote class="absolute right-3 top-3 h-6 w-6 text-blue-500/20" />
					<p class="mb-4 text-sm italic text-gray-300">
						"{testimonial.quote}"
					</p>
					<p class="text-sm font-medium text-gray-400">{testimonial.author}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

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
				Unlimited hosts. No per-device fees, ever.
			</h2>
		</div>

		<PricingSection showGithubStars={false} showHosting={true} initialPlanFilter="all" />
	</div>
</section>

<!-- CTA Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-6 text-3xl font-bold text-rose-400 lg:text-4xl">
				Your network diagram is minutes away
			</h2>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="https://app.scanopy.net/onboarding"
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
					href="/pricing"
					class="btn-secondary px-8 py-3 text-lg"
					onclick={() =>
						analytics.ctaClicked({
							location: 'bottom_cta',
							destination: 'pricing',
							text: 'Compare Plans'
						})}
				>
					Compare Plans
				</a>
			</div>
		</div>
	</div>
</section>
