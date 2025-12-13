<script lang="ts">
	import { GithubStars } from '$lib/components';
	import {
		Network,
		Eye,
		Zap,
		Shield,
		Box,
		FileCode,
		Quote,
		Users,
		ClipboardCheck,
		Briefcase
	} from 'lucide-svelte';

	const features = [
		{
			icon: Network,
			title: 'Auto-Discovery',
			description: 'Automatically discover devices, services, and connections across your network.'
		},
		{
			icon: Eye,
			title: 'Visual Documentation',
			description: 'Generate interactive network topology maps that update in real-time.'
		},
		{
			icon: Zap,
			title: 'Real-Time Updates',
			description: 'Track changes as they happen with continuous network monitoring.'
		},
		{
			icon: Shield,
			title: 'Security Insights',
			description: 'Identify exposed services and potential security concerns.'
		},
		{
			icon: Box,
			title: 'Service Detection',
			description: 'Recognize 200+ services including Docker, databases, and more.'
		},
		{
			icon: FileCode,
			title: 'Export & Sharing',
			description: 'Export documentation or share live views with stakeholders and customers.'
		}
	];

	const useCases = [
		{
			icon: Users,
			title: 'Onboard employees faster',
			description: "Visual infrastructure documentation that's always up-to-date."
		},
		{
			icon: ClipboardCheck,
			title: 'Streamline audits & compliance',
			description: 'Easy-to-understand network artifacts for auditors.'
		},
		{
			icon: Briefcase,
			title: 'Deliver to your customers',
			description: 'Professional documentation as part of your service offering.'
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
</script>

<svelte:head>
	<title>Scanopy - Automatic Network Documentation</title>
	<meta
		name="description"
		content="Automatically discover and visually document network infrastructure. Open source network discovery and documentation tool."
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
			<div
				class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
			>
				<span class="text-sm font-medium text-gray-300">Open Source</span>
				<GithubStars usePublicApi={true} />
			</div>

			<!-- Headline -->
			<h1 class="mb-6 text-4xl font-bold leading-tight text-rose-400 lg:text-6xl">
				Automatically discover and visually document network infrastructure
			</h1>

			<!-- Subheadline -->
			<p class="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
				Join thousands of networking professionals using Scanopy to effortlessly create and
				maintain infrastructure documentation
			</p>

			<!-- CTAs -->
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="https://app.scanopy.net" class="btn-primary px-8 py-3 text-lg">
					Launch Scanopy
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
				Everything you need for network documentation
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-gray-400">
				Creating network infrastructure documentation has never been this easy
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature (feature.title)}
				<div class="card card-static p-6">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10">
						<feature.icon class="h-6 w-6 text-sky-400" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
					<p class="text-sm text-gray-400">{feature.description}</p>
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
				Built for teams of all sizes
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
				What the community is saying
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-gray-400">Real feedback from Reddit.</p>
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
			<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
				Ready to document your network infrastructure?
			</h2>
			<p class="mb-8 text-lg text-gray-400">
				Get started with a <span class="text-rose-400">free trial</span> in minutes.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="https://app.scanopy.net" class="btn-primary px-8 py-3 text-lg">
					Launch Scanopy
				</a>
				<a href="/pricing" class="btn-secondary px-8 py-3 text-lg"> View Pricing </a>
			</div>
		</div>
	</div>
</section>
