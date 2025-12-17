<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { GithubStars } from '$lib/components';
	import {
		Network,
		Eye,
		GitBranch,
		Shield,
		Box,
		FileCode,
		Quote,
		Users,
		ClipboardCheck,
		Briefcase
	} from 'lucide-svelte';
	import { analytics } from '$lib/analytics';

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

	const features = [
		{
			icon: Network,
			title: 'Never miss a device',
			description: 'Scans any network and discovers every host, service, and subnet automatically.'
		},
		{
			icon: GitBranch,
			title: 'Versioning without the commits',
			description: 'Create branches, lock versions, and compare network state over time.'
		},
		{
			icon: Shield,
			title: "Know what's exposed",
			description: 'See which services are reachable and flag misconfigurations before they become incidents.'
		},
		{
			icon: Box,
			title: 'Auto-detects 200+ services',
			description: 'Identifies <a href="/services" class="text-sky-400 hover:underline">200+ services</a> including Docker, PostgreSQL, nginx, Prometheus, and Active Directory.'
		},
		{
			icon: FileCode,
			title: 'Share with anyone',
			description: 'Export diagrams, send live view links, or create embeds (coming soon).'
		},
		{
			icon: Eye,
			title: 'Diagrams that never go stale',
			description: 'Live topology diagrams that update as each network changes.'
		}
	];

	const useCases = [
		{
			icon: Users,
			title: 'Onboard faster',
			description: 'New hires and new clients see the whole picture on day one — no digging through outdated wikis.'
		},
		{
			icon: Briefcase,
			title: 'Impress your customers',
			description: 'Turn documentation into a live client portal — zero manual updates.'
		},
		{
			icon: ClipboardCheck,
			title: 'Streamline audits & compliance',
			description: 'Hand auditors a live network map instead of stale spreadsheets.'
		},
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
</script>

<svelte:head>
	<title>Scanopy - Automatic Network Documentation</title>
	<meta
		name="description"
		content="Automatic network diagrams that stay up to date. Open source."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative flex min-h-[600px] items-center overflow-hidden lg:min-h-[700px]">
	<!-- Background image -->
	<div
		class="absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('/hero-network.jpeg');"
	></div>
	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"></div>

	<div class="container relative z-10 mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Badge -->
			<div class="pb-4">
				<GithubStars  />
			</div>

			<!-- Headline -->
			<h1 class="mb-6 text-4xl font-bold leading-tight text-rose-400 lg:text-6xl">
				Clean network diagrams.<br />One-time setup, zero upkeep
				<!-- No setup. No maintenance. Just clean network docs. -->
				 <!-- Clean network documentation without the overhead -->
			</h1>

			<!-- Subheadline -->
			<p class="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
				From one site to hundreds — scan any network<br />and get live, auto-updating documentation in minutes
			</p>

			<!-- CTAs -->
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="https://app.scanopy.net"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-primary px-8 py-3 text-lg"
					onclick={() => analytics.ctaClicked({ location: 'hero', destination: 'app', text: 'Start Free Trial' })}
				>
					Start Free Trial
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				Scan once. Stay documented forever.
			</h2>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature (feature.title)}
				<div class="card card-static p-6">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10">
						<feature.icon class="h-6 w-6 text-sky-400" />
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
				<span class="relative inline-block h-[1.15em] overflow-hidden align-baseline" style="top: 0.15em;">
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
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10"
					>
						<useCase.icon class="h-7 w-7 text-sky-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">{useCase.title}</h3>
					<p class="text-gray-400">{useCase.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

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
					<Quote class="absolute right-3 top-3 h-6 w-6 text-sky-500/20" />
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
					href="https://app.scanopy.net"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-primary px-8 py-3 text-lg"
					onclick={() => analytics.ctaClicked({ location: 'bottom_cta', destination: 'app', text: 'Start Free Trial' })}
				>
					Start Free Trial
				</a>
				<a
					href="/pricing"
					class="btn-secondary px-8 py-3 text-lg"
					onclick={() => analytics.ctaClicked({ location: 'bottom_cta', destination: 'pricing', text: 'Compare Plans' })}
				>
					Compare Plans
				</a>
			</div>
		</div>
	</div>
</section>
