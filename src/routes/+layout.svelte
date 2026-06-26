<script lang="ts">
	import '../app.css';
	import { browser, dev } from '$app/environment';
	import { page } from '$app/state';
	import { Footer } from '$lib/components';
	import { Menu, X, ChevronDown } from 'lucide-svelte';
	import { PUBLIC_BREVO_NEWSLETTER_FORM_URL } from '$env/static/public';
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
	import { getBreadcrumbListSchema } from '$lib/schemas';
	import { APP, appHref } from '$lib/config/urls';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let healthStatus = $state<'loading' | 'healthy' | 'unhealthy'>('loading');
	let mobileMenuOpen = $state(false);
	let productMenuOpen = $state(false);
	let productMobileOpen = $state(false);
	let productMenuEl = $state<HTMLElement>();

	if (browser) {
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => loadPh());
		} else {
			setTimeout(() => loadPh(), 2000);
		}
	}

	onMount(() => {
		const checkHealth = async () => {
			try {
				const res = await fetch('https://app.scanopy.net/api/health');
				healthStatus = res.ok ? 'healthy' : 'unhealthy';
			} catch {
				healthStatus = 'unhealthy';
			}
		};
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => checkHealth());
		} else {
			setTimeout(() => checkHealth(), 2000);
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
		productMobileOpen = false;
	}

	// Close the desktop Product dropdown on Escape or any click outside of it.
	function handleWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') productMenuOpen = false;
	}
	function handleWindowClick(e: MouseEvent) {
		if (productMenuOpen && productMenuEl && !productMenuEl.contains(e.target as Node)) {
			productMenuOpen = false;
		}
	}

	// The three editions, surfaced together in the navbar so each deployment model has a
	// labeled front door. Cloud isn't an "Edition" — it's the default managed product, so
	// it points at Pricing rather than a dedicated page.
	const editionLinks = [
		{ href: '/pricing', label: 'Cloud', destination: 'cloud_pricing' },
		{ href: '/commercial', label: 'Commercial Edition', destination: 'commercial' },
		{ href: '/community', label: 'Community Edition', destination: 'community' }
	];

	const breadcrumbNameMap: Record<string, string> = {
		pricing: 'Pricing',
		about: 'About',
		blog: 'Blog',
		services: 'Services',
		showcase: 'Showcase',
		community: 'Community',
		commercial: 'Commercial',
		changelog: 'Changelog',
		roadmap: 'Roadmap',
		privacy: 'Privacy',
		terms: 'Terms',
		refund: 'Refund',
		comparisons: 'Comparisons'
	};

	// Routes that emit their own page-level BreadcrumbList (with a richer hand-built
	// trail). Skip the auto-breadcrumb there so a URL never carries two conflicting
	// trails, and so we don't synthesize a crumb for a non-page segment like `vs`.
	const SELF_BREADCRUMB_PREFIXES = ['/comparisons/vs/'];

	// Real, human title for the leaf crumb on dynamic detail routes, pulled from the
	// page's own load data instead of title-casing a raw slug (which produced names
	// like "Network Diagrams Wrong" rather than the actual post/entry title).
	function leafName(pathname: string, fallback: string): string {
		const data = page.data as Record<string, unknown> & {
			post?: { title?: string };
			entry?: { title?: string };
		};
		if (pathname.startsWith('/blog/')) return data?.post?.title || fallback;
		if (pathname.startsWith('/comparisons/')) return data?.post?.title || fallback;
		if (pathname.startsWith('/changelog/')) return data?.entry?.title || fallback;
		return fallback;
	}

	let breadcrumbSchema = $derived.by(() => {
		const pathname = page.url.pathname;
		if (pathname === '/') return null;
		if (SELF_BREADCRUMB_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

		const segments = pathname.split('/').filter(Boolean);
		const items = [{ name: 'Home', url: 'https://scanopy.net' }];

		let currentPath = '';
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			const isLeaf = index === segments.length - 1;
			const titleCased = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
			const name =
				breadcrumbNameMap[segment] || (isLeaf ? leafName(pathname, titleCased) : titleCased);
			items.push({ name, url: `https://scanopy.net${currentPath}` });
		});

		return getBreadcrumbListSchema(items);
	});
</script>

<svelte:window onkeydown={handleWindowKeydown} onclick={handleWindowClick} />

<svelte:head>
	{@html `<script type="application/ld+json">
{
	"@context": "https://schema.org",
	"@type": "Organization",
	"@id": "https://scanopy.net/#organization",
	"name": "Scanopy",
	"legalName": "Scanopy LLC",
	"url": "https://scanopy.net",
	"logo": {
		"@type": "ImageObject",
		"url": "https://scanopy.net/scanopy-logo.webp",
		"width": 500,
		"height": 500
	},
	"image": "https://scanopy.net/scanopy-logo.webp",
	"description": "Infrastructure documentation software. Deploy a lightweight scanner to automatically discover and document network architecture, service dependencies, workload placement, and physical topology.",
	"address": {
		"@type": "PostalAddress",
		"streetAddress": "418 Broadway Ste N",
		"addressLocality": "Albany",
		"addressRegion": "NY",
		"postalCode": "12207",
		"addressCountry": "US"
	},
	"sameAs": [
		"https://github.com/scanopy/scanopy",
		"https://x.com/getscanopy",
		"https://discord.gg/b7ffQr8AcZ",
		"https://reddit.com/r/scanopy",
		"https://bsky.app/profile/scanopy.net"
	],
	"foundingDate": "2025",
	"contactPoint": {
		"@type": "ContactPoint",
		"contactType": "customer support",
		"url": "https://discord.gg/b7ffQr8AcZ"
	}
}
</script>`}
	{@html `<script type="application/ld+json">
{
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": "https://scanopy.net/#website",
	"name": "Scanopy",
	"url": "https://scanopy.net",
	"publisher": {"@id": "https://scanopy.net/#organization"}
}
</script>`}
	{#if breadcrumbSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
	{/if}

	<!-- Site-wide social defaults. Only tags no individual page sets live here (so we
	     never emit duplicate property= meta); per-page og:title/description/image
	     remain on each page. -->
	<meta property="og:site_name" content="Scanopy" />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:site" content="@getscanopy" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
		<div class="container mx-auto px-4 py-4">
			<nav class="flex items-center justify-between">
				<a href="/" class="flex items-center gap-2">
					<img src="/scanopy-logo-64.webp" alt="Scanopy" class="h-8 w-8" width="32" height="32" />
					<span class="text-xl font-bold text-white">Scanopy</span>
				</a>

				<!-- Desktop navigation -->
				<div class="hidden items-center gap-6 md:flex">
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="relative"
						bind:this={productMenuEl}
						onmouseenter={() => (productMenuOpen = true)}
						onmouseleave={() => (productMenuOpen = false)}
						onfocusin={() => (productMenuOpen = true)}
						onfocusout={(e) => {
							if (!productMenuEl?.contains(e.relatedTarget as Node)) productMenuOpen = false;
						}}
					>
						<button
							type="button"
							class="flex items-center gap-1 text-gray-400 transition-colors hover:text-white"
							aria-haspopup="true"
							aria-expanded={productMenuOpen}
						>
							Product
							<ChevronDown
								class="h-4 w-4 transition-transform {productMenuOpen ? 'rotate-180' : ''}"
							/>
						</button>
						{#if productMenuOpen}
							<div
								class="absolute left-0 top-full z-50 w-56 rounded-lg border border-gray-800 bg-gray-900 p-2 pt-3 shadow-2xl"
							>
								{#each editionLinks as link}
									<a
										href={link.href}
										class="block rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
										onclick={() => {
											analytics.ctaClicked({
												location: 'navbar_product',
												destination: link.destination,
												text: link.label
											});
											productMenuOpen = false;
										}}
									>
										{link.label}
									</a>
								{/each}
							</div>
						{/if}
					</div>
					<a href="/pricing" class="text-gray-400 transition-colors hover:text-white">Pricing</a>
					<a href="/docs" class="text-gray-400 transition-colors hover:text-white">Docs</a>
					<a
						href="https://demo.scanopy.net"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
					>
						Live Demo
					</a>
					<a
						href={appHref(APP.login, page.url.pathname, 'navbar', 'nav')}
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={() =>
							analytics.ctaClicked({ location: 'navbar', destination: 'app_login', text: 'Login' })}
					>
						Login
					</a>
					<a
						href={appHref(APP.onboarding, page.url.pathname, 'navbar', 'nav')}
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
					class="flex min-h-[44px] min-w-[44px] items-center justify-center text-gray-400 hover:text-white md:hidden"
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
					<div>
						<button
							type="button"
							class="flex w-full items-center justify-between text-gray-400 transition-colors hover:text-white"
							aria-expanded={productMobileOpen}
							onclick={() => (productMobileOpen = !productMobileOpen)}
						>
							Product
							<ChevronDown
								class="h-4 w-4 transition-transform {productMobileOpen ? 'rotate-180' : ''}"
							/>
						</button>
						{#if productMobileOpen}
							<div class="mt-3 flex flex-col gap-3 pl-3">
								{#each editionLinks as link}
									<a
										href={link.href}
										class="text-sm text-gray-400 transition-colors hover:text-white"
										onclick={() => {
											analytics.ctaClicked({
												location: 'navbar_mobile_product',
												destination: link.destination,
												text: link.label
											});
											closeMobileMenu();
										}}
									>
										{link.label}
									</a>
								{/each}
							</div>
						{/if}
					</div>
					<a
						href="/pricing"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={closeMobileMenu}
					>
						Pricing
					</a>
					<a
						href="/docs"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={closeMobileMenu}
					>
						Docs
					</a>
					<a
						href="https://demo.scanopy.net"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
						onclick={closeMobileMenu}
					>
						Live Demo
					</a>
					<a
						href={appHref(APP.login, page.url.pathname, 'navbar-mobile', 'nav')}
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
						href={appHref(APP.onboarding, page.url.pathname, 'navbar-mobile', 'nav')}
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

	<Footer {healthStatus} brevoNewsletterFormUrl={PUBLIC_BREVO_NEWSLETTER_FORM_URL} />
</div>

<CookieConsent onAnalyticsChange={(enabled) => enabled && initFeatureFlags()} />
