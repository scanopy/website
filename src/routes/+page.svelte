<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { GithubStars, FeaturedIn } from '$lib/components';
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
		Server
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
	const whatYouGet = allFeatures.filter((f) => f.group === 'what_you_get');

	// Generate schema from fixtures
	const softwareApplicationSchema = getSoftwareApplicationSchema();

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
	{@html `<script type="application/ld+json">${JSON.stringify(softwareApplicationSchema)}</script>`}
</svelte:head>

<!-- Hero Section -->
<section class="relative flex min-h-[600px] items-center overflow-hidden lg:min-h-[700px]">
	<!-- Background image -->
	<div
		class="absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('/topology-hero.png');"
	></div>
	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"></div>

	<div class="container relative z-10 mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Badge -->
			<div class="pb-4">
				<GithubStars />
			</div>

			<!-- Headline -->
			<h1 class="mb-6 text-4xl font-bold leading-tight text-rose-400 lg:text-6xl">
				Network documentation that updates itself
			</h1>

			<!-- Subheadline -->
			<p class="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
				Deploy a lightweight scanner, get live network diagrams in minutes.<br />No manual
				maintenance, no stale Visio files.
			</p>

			<!-- CTAs -->
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
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
				</a>
			</div>
		</div>
	</div>
</section>

<!-- How it works Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">How it works</h2>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each howItWorks as feature (feature.title)}
				<div class="card card-static p-6">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
						<feature.icon class="h-6 w-6 text-blue-400" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
					<p class="text-sm text-gray-400">{@html feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- What you get Section -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">What you get</h2>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each whatYouGet as feature (feature.title)}
				<div class="card card-static p-6">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
						<feature.icon class="h-6 w-6 text-blue-400" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
					<p class="text-sm text-gray-400">{@html feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Use Cases Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
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
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">Who it's for</h2>
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
