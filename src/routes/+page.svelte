<script lang="ts">
	import { GithubStars } from '$lib/components';
	import { Network, Eye, Zap, Shield, Box, FileCode, Quote, Users, ClipboardCheck, Briefcase } from 'lucide-svelte';

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
			description: 'Visual infrastructure documentation that\'s always up-to-date.'
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
			quote: "It really helped me catch a couple things that were suboptimal, and be like 'why is that there', and tidy a couple things up.",
			author: "u/reinhart_menken"
		},
		{
			quote: "This is sick. I just tried it out on my network and discovery's doing its thing.",
			author: "u/discoshanktank"
		},
		{
			quote: "You're literally doing the thing I've dreamed of for ages.",
			author: "u/blitz9826"
		},
		{
			quote: "So many features, wasn't expecting a lot more than a simple scanner and a UI.",
			author: "u/Medium_Chemist_4032"
		}
	];
</script>

<svelte:head>
	<title>NetVisor - Automatic Network Documentation</title>
	<meta name="description" content="Automatically discover and visually document network infrastructure. Open source network discovery and documentation tool." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center">
	<!-- Background image -->
	<div
		class="absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('/hero-network.jpeg');"
	></div>
	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"></div>

	<div class="container mx-auto px-4 relative z-10">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Badge -->
			<div class="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
				<span class="text-gray-300 text-sm font-medium">Open Source</span>
				<GithubStars usePublicApi={true} />
			</div>

			<!-- Headline -->
			<h1 class="text-4xl lg:text-6xl font-bold text-rose-400 mb-6 leading-tight">
				Automatically discover and visually document network infrastructure
			</h1>

			<!-- Subheadline -->
			<p class="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
				Join thousands of networking professionals using NetVisor to effortlessly create and maintain infrastructure documentation
			</p>

			<!-- CTAs -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="https://app.netvisor.io" class="btn-primary text-lg px-8 py-3">
					Launch NetVisor
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-20 border-t border-gray-800">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-3xl lg:text-4xl font-bold mb-4 text-rose-400">
				Everything you need for network documentation
			</h2>
			<p class="text-gray-400 text-lg max-w-2xl mx-auto">
				Creating network infrastructure documentation has never been this easy
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature (feature.title)}
				<div class="card card-static p-6">
					<div class="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
						<feature.icon class="w-6 h-6 text-sky-400" />
					</div>
					<h3 class="text-lg font-semibold text-white mb-2">{feature.title}</h3>
					<p class="text-gray-400 text-sm">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Use Cases Section -->
<section class="py-20 border-t border-gray-800">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-3xl lg:text-4xl font-bold mb-4 text-rose-400">
				Built for teams of all sizes
			</h2>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each useCases as useCase (useCase.title)}
				<div class="text-center">
					<div class="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center mb-4 mx-auto">
						<useCase.icon class="w-7 h-7 text-sky-400" />
					</div>
					<h3 class="text-xl font-semibold text-white mb-2">{useCase.title}</h3>
					<p class="text-gray-400">{useCase.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Community Section -->
<section class="py-20 border-t border-gray-800 bg-gray-900/50">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-3xl lg:text-4xl font-bold mb-4 text-rose-400">
				What the community is saying
			</h2>
			<p class="text-gray-400 text-lg max-w-2xl mx-auto">
				Real feedback from Reddit.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each testimonials as testimonial}
				<div class="card card-static p-5 relative">
					<Quote class="w-6 h-6 text-sky-500/20 absolute top-3 right-3" />
					<p class="text-gray-300 mb-4 text-sm italic">
						"{testimonial.quote}"
					</p>
					<p class="text-gray-400 text-sm font-medium">{testimonial.author}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 border-t border-gray-800">
	<div class="container mx-auto px-4">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl lg:text-4xl font-bold mb-4 text-rose-400">
				Ready to document your network infrastructure?
			</h2>
			<p class="text-gray-400 text-lg mb-8">
				Get started with a <span class="text-rose-400">free trial</span> in minutes.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="https://app.netvisor.io" class="btn-primary text-lg px-8 py-3">
					Launch NetVisor
				</a>
				<a href="/pricing" class="btn-secondary text-lg px-8 py-3">
					View Pricing
				</a>
			</div>
		</div>
	</div>
</section>
