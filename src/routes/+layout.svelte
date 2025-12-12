<script lang="ts">
	import '../app.css';
	import { dev } from '$app/environment';
	import { GithubStars, NewsletterSignup } from '$lib/components';
	import { Github, MessageCircle, Menu, X } from 'lucide-svelte';
	import { PUBLIC_PLUNK_API_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let healthStatus = $state<'loading' | 'healthy' | 'unhealthy'>('loading');
	let mobileMenuOpen = $state(false);

	onMount(async () => {
		try {
			const res = await fetch('https://app.netvisor.io/api/health');
			healthStatus = res.ok ? 'healthy' : 'unhealthy';
		} catch {
			healthStatus = 'unhealthy';
		}
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	{#if !dev}
		<script src="https://app.rybbit.io/api/script.js" data-site-id="d62db73b8794" defer></script>
	{/if}
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
		<div class="container mx-auto px-4 py-4">
			<nav class="flex items-center justify-between">
				<a href="/" class="flex items-center gap-2">
					<img src="/netvisor-logo.png" alt="NetVisor" class="h-8 w-8" />
					<span class="text-xl font-bold text-white">NetVisor</span>
				</a>

				<!-- Desktop navigation -->
				<div class="hidden items-center gap-6 md:flex">
					<a href="/pricing" class="text-gray-400 transition-colors hover:text-white">Pricing</a>
					<a href="/roadmap" class="text-gray-400 transition-colors hover:text-white">Roadmap</a>
					<a
						href="https://github.com/netvisor-io/netvisor/tree/main/docs"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
					>
						Docs
					</a>
					<a href="https://app.netvisor.io" class="btn-primary">Get Started</a>
				</div>

				<!-- Mobile menu button -->
				<button
					type="button"
					class="text-gray-400 hover:text-white md:hidden"
					onclick={toggleMobileMenu}
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</nav>

			<!-- Mobile navigation -->
			{#if mobileMenuOpen}
				<div class="mt-4 flex flex-col gap-4 border-t border-gray-800 pt-4 md:hidden">
					<a
						href="/pricing"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={closeMobileMenu}
					>
						Pricing
					</a>
					<a
						href="/roadmap"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={closeMobileMenu}
					>
						Roadmap
					</a>
					<a
						href="https://github.com/netvisor-io/netvisor/tree/main/docs"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={closeMobileMenu}
					>
						Docs
					</a>
					<a
						href="https://app.netvisor.io"
						class="btn-primary text-center"
						onclick={closeMobileMenu}
					>
						Get Started
					</a>
				</div>
			{/if}
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-gray-800 bg-gray-900/30">
		<div class="container mx-auto px-4 py-12">
			<div class="grid gap-8 md:grid-cols-4">
				<!-- Brand -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<img src="/netvisor-logo.png" alt="NetVisor" class="h-8 w-8" />
						<span class="text-xl font-bold text-white">NetVisor</span>
					</div>
					<p class="text-sm text-gray-400">
						Automatically discover and visually document network infrastructure.
					</p>
					<GithubStars usePublicApi={true} />
				</div>

				<!-- Product -->
				<div>
					<h4 class="mb-4 font-semibold text-white">Product</h4>
					<ul class="space-y-2">
						<li>
							<a href="/services" class="text-sm text-gray-400 hover:text-white"
								>Discoverable Services</a
							>
						</li>
						<li><a href="/pricing" class="text-sm text-gray-400 hover:text-white">Pricing</a></li>
						<li><a href="/roadmap" class="text-sm text-gray-400 hover:text-white">Roadmap</a></li>
						<li>
							<a
								href="https://github.com/netvisor-io/netvisor/blob/main/docs/"
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm text-gray-400 hover:text-white">Documentation</a
							>
						</li>
					</ul>
				</div>

				<!-- Resources -->
				<div>
					<h4 class="mb-4 font-semibold text-white">Resources</h4>
					<ul class="space-y-2">
						<li>
							<a
								href="https://github.com/netvisor-io/netvisor"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
							>
								<Github class="h-4 w-4" />
								GitHub
							</a>
						</li>
						<li>
							<a
								href="https://discord.gg/b7ffQr8AcZ"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
							>
								<MessageCircle class="h-4 w-4" />
								Discord
							</a>
						</li>
						<li>
							{#if healthStatus === 'healthy'}
								<a
									href="https://app.netvisor.io"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
								>
									<span class="relative flex h-3 w-3">
										<span
											class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
										></span>
										<span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
									</span>
									Status
								</a>
							{:else}
								<span class="flex items-center gap-2 text-sm text-gray-400">
									<span class="relative flex h-3 w-3">
										{#if healthStatus === 'loading'}
											<span
												class="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-400 opacity-75"
											></span>
											<span class="relative inline-flex h-3 w-3 rounded-full bg-gray-500"></span>
										{:else}
											<span
												class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
											></span>
											<span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
										{/if}
									</span>
									Status
								</span>
							{/if}
						</li>
					</ul>
				</div>

				<!-- Newsletter -->
				<div>
					<h4 class="mb-4 font-semibold text-white">Stay Updated</h4>
					<NewsletterSignup
						apiKey={PUBLIC_PLUNK_API_KEY}
						eventName="website_newsletter"
						compact={true}
					/>
				</div>
			</div>

			<div
				class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row"
			>
				<p class="text-sm text-gray-500">
					© {new Date().getFullYear()} NetVisor
				</p>
				<div class="flex gap-6">
					<a href="/privacy" class="text-sm text-gray-500 hover:text-gray-400">Privacy</a>
					<a href="/terms" class="text-sm text-gray-500 hover:text-gray-400">Terms</a>
				</div>
			</div>
		</div>
	</footer>
</div>