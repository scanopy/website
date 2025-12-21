<script lang="ts">
	import '../app.css';
	import { browser, dev } from '$app/environment';
	import { Footer } from '$lib/components';
	import { Menu, X } from 'lucide-svelte';
	import { PUBLIC_PLUNK_API_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import {
		analytics,
		featureFlags,
		evaluateCtaFlag,
		loadPh,
		initFeatureFlags
	} from '$lib/analytics.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let healthStatus = $state<'loading' | 'healthy' | 'unhealthy'>('loading');
	let mobileMenuOpen = $state(false);

	onMount(async () => {
		try {
			const res = await fetch('https://app.scanopy.net/api/health');
			healthStatus = res.ok ? 'healthy' : 'unhealthy';
			// await load()
		} catch {
			healthStatus = 'unhealthy';
		}

		if (browser) {
			loadPh();
		}
	});

	// Evaluate feature flag on mount to trigger exposure event (PostHog best practice)
	$effect(() => {
		evaluateCtaFlag();
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
	{@html `<script type="application/ld+json">
{
	"@context": "https://schema.org",
	"@type": "Organization",
	"name": "Scanopy",
	"url": "https://scanopy.net",
	"logo": {
		"@type": "ImageObject",
		"url": "https://scanopy.net/scanopy-logo.png",
		"width": 500,
		"height": 500
	},
	"image": "https://scanopy.net/scanopy-logo.png",
	"description": "Automatic network discovery and documentation. Clean network diagrams with one-time setup and zero upkeep.",
	"sameAs": [
		"https://github.com/scanopy/scanopy",
		"https://x.com/getscanopy",
		"https://discord.gg/b7ffQr8AcZ",
		"https://reddit.com/r/scanopy",
		"https://bsky.app/profile/scanopy.net"
	]
}
</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
		<div class="container mx-auto px-4 py-4">
			<nav class="flex items-center justify-between">
				<a href="/" class="flex items-center gap-2">
					<img src="./scanopy-logo.png" alt="Scanopy" class="h-8 w-8" />
					<span class="text-xl font-bold text-white">Scanopy</span>
				</a>

				<!-- Desktop navigation -->
				<div class="hidden items-center gap-6 md:flex">
					<a href="/pricing" class="text-gray-400 transition-colors hover:text-white">Pricing</a>
					<a href="/roadmap" class="text-gray-400 transition-colors hover:text-white">Roadmap</a>
					<a href="/docs" class="text-gray-400 transition-colors hover:text-white"> Docs </a>
					<a
						href="https://app.scanopy.net/login"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={() =>
							analytics.ctaClicked({ location: 'navbar', destination: 'app_login', text: 'Login' })}
					>
						Login
					</a>
					<a
						href="https://app.scanopy.net/onboarding"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary"
						onclick={() =>
							analytics.ctaClicked({
								location: 'navbar',
								destination: 'app_onboarding',
								text: featureFlags.mainCtaText
							})}
					>
						{featureFlags.mainCtaText}
					</a>
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
						href="/docs"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={closeMobileMenu}
					>
						Docs
					</a>
					<a
						href="https://app.scanopy.net/login"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={() => {
							analytics.ctaClicked({
								location: 'navbar_mobile',
								destination: 'app_login',
								text: 'Login'
							});
							closeMobileMenu();
						}}
					>
						Login
					</a>
					<a
						href="https://app.scanopy.net/onboarding"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary text-center"
						onclick={() => {
							analytics.ctaClicked({
								location: 'navbar_mobile',
								destination: 'app_onboarding',
								text: featureFlags.mainCtaText
							});
							closeMobileMenu();
						}}
					>
						{featureFlags.mainCtaText}
					</a>
				</div>
			{/if}
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<Footer {healthStatus} plunkApiKey={PUBLIC_PLUNK_API_KEY} />
</div>

<CookieConsent onAnalyticsChange={(enabled) => enabled && initFeatureFlags()} />
