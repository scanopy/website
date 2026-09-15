<script lang="ts">
	import GithubStars from '$lib/components/GithubStars.svelte';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';

	import { isPostHogLoaded, getPostHog } from '$lib/posthog';
	import { page } from '$app/state';
	import { APP, appHref } from '$lib/config/urls';

	interface Props {
		healthStatus?: 'loading' | 'healthy' | 'unhealthy';
		brevoNewsletterFormUrl?: string;
	}

	let { healthStatus = 'loading', brevoNewsletterFormUrl = '' }: Props = $props();

	function trackExternalLink(destination: string, url: string) {
		if (isPostHogLoaded()) {
			getPostHog()?.capture('external_link_clicked', {
				destination,
				location: 'footer',
				url
			});
		}
	}

	// Social platforms where Scanopy can be found, rendered as an icon row below the
	// newsletter. Each brand mark is a single 24×24 path.
	const socialLinks = [
		{
			label: 'GitHub',
			destination: 'github',
			href: 'https://github.com/scanopy/scanopy',
			path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
		},
		{
			label: 'Discord',
			destination: 'discord',
			href: 'https://discord.gg/b7ffQr8AcZ',
			path: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z'
		},
		{
			label: 'Reddit',
			destination: 'reddit',
			href: 'https://reddit.com/r/scanopy',
			path: 'M12 0C5.373 0 0 5.373 0 12c0 3.314 1.344 6.315 3.516 8.484A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.44 13.16c.016.166.024.334.024.504 0 2.57-2.992 4.656-6.684 4.656s-6.684-2.086-6.684-4.656c0-.17.008-.338.024-.504a1.473 1.473 0 01-.724-1.268c0-.816.662-1.478 1.478-1.478.386 0 .738.148 1.002.392 1.17-.818 2.782-1.34 4.566-1.392l.862-4.064a.305.305 0 01.362-.236l2.88.608a1.058 1.058 0 112.006.068l-3.168-.668-.776 3.656c1.746.064 3.322.586 4.468 1.392.264-.244.616-.392 1.002-.392.816 0 1.478.662 1.478 1.478a1.47 1.47 0 01-.724 1.268zM9.272 12.77a1.058 1.058 0 100 2.116 1.058 1.058 0 000-2.116zm5.456 0a1.058 1.058 0 100 2.116 1.058 1.058 0 000-2.116zm-4.982 3.426a.27.27 0 01.37-.096c.602.344 1.254.516 1.884.516s1.282-.172 1.884-.516a.27.27 0 01.274.466 4.297 4.297 0 01-2.158.578 4.297 4.297 0 01-2.158-.578.27.27 0 01-.096-.37z'
		},
		{
			label: 'X',
			destination: 'twitter',
			href: 'https://x.com/getscanopy',
			path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'
		},
		{
			label: 'YouTube',
			destination: 'youtube',
			href: 'https://www.youtube.com/channel/UCBoVhleKPpmN9LrcpCHPeeQ',
			path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
		},
		{
			label: 'Bluesky',
			destination: 'bluesky',
			href: 'https://bsky.app/profile/scanopy.net',
			path: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.593 3.463 6.272 3.223-3.736.647-7.028 2.621-2.424 7.466 5.147 4.848 7.07-.493 7.528-1.993.458 1.5 2.381 6.841 7.528 1.993 4.604-4.845 1.312-6.82-2.424-7.466 2.68.24 5.487-.596 6.272-3.223C23.622 9.418 24 4.458 24 3.768c0-.688-.139-1.86-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z'
		},
		{
			label: 'LinkedIn',
			destination: 'linkedin',
			href: 'https://www.linkedin.com/company/scanopynet/',
			path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'
		}
	];
</script>

<footer class="border-t border-gray-800 bg-gray-900/30">
	<div class="container mx-auto px-4 py-12">
		<div class="flex flex-col gap-12">
			<!-- Brand + newsletter (centered), with a social icon row beneath -->
			<div class="order-last flex flex-col items-center gap-8">
				<div
					class="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-16"
				>
					<!-- Brand -->
					<div class="space-y-4">
						<div class="flex items-center gap-2">
							<img
								src="/brand/scanopy-logo-64.webp"
								alt="Scanopy"
								class="h-8 w-8"
								width="32"
								height="32"
							/>
							<span class="text-xl font-bold text-white">Scanopy</span>
						</div>
						<p class="text-sm text-gray-400">Network discovery and documentation on autopilot.</p>
						<GithubStars />
					</div>

					<!-- Newsletter -->
					<div class="w-full max-w-md">
						<span class="mb-4 block font-semibold text-white">Stay Updated</span>
						{#if brevoNewsletterFormUrl}
							<NewsletterSignup formUrl={brevoNewsletterFormUrl} compact={true} />
						{/if}
					</div>
				</div>

				<!-- Social platforms -->
				<div class="flex flex-wrap items-center justify-center gap-5">
					{#each socialLinks as social (social.label)}
						<a
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
							class="text-gray-400 transition-colors hover:text-white"
							onclick={() => trackExternalLink(social.destination, social.href)}
						>
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
								><path d={social.path} /></svg
							>
						</a>
					{/each}
				</div>
			</div>

			<!-- Link columns -->
			<div
				class="order-first mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 sm:flex sm:justify-between"
			>
				<!-- Product -->
				<div>
					<span class="mb-4 block font-semibold text-white">Product</span>
					<ul class="space-y-2">
						<li><a href="/pricing" class="text-sm text-gray-400 hover:text-white">Pricing</a></li>
						<li>
							<a href="/community" class="text-sm text-gray-400 hover:text-white"
								>Community Edition</a
							>
						</li>
						<li>
							<a href="/commercial" class="text-sm text-gray-400 hover:text-white"
								>Commercial Edition</a
							>
						</li>
						<li><a href="/roadmap" class="text-sm text-gray-400 hover:text-white">Roadmap</a></li>
						<li>
							<a href="/changelog" class="text-sm text-gray-400 hover:text-white">Changelog</a>
						</li>
					</ul>
				</div>

				<!-- Resources -->
				<div>
					<span class="mb-4 block font-semibold text-white">Resources</span>
					<ul class="space-y-2">
						<li>
							<a href="/docs" class="text-sm text-gray-400 hover:text-white">Documentation</a>
						</li>
						<li>
							<a href="/integrations" class="text-sm text-gray-400 hover:text-white">Integrations</a
							>
						</li>
						<li>
							<a href="/services" class="text-sm text-gray-400 hover:text-white"
								>Discoverable Services</a
							>
						</li>
						<li>
							<a href="/guides" class="text-sm text-gray-400 hover:text-white">Guides</a>
						</li>
						<li><a href="/blog" class="text-sm text-gray-400 hover:text-white">Blog</a></li>
						<li>
							<a href="/comparisons" class="text-sm text-gray-400 hover:text-white">Comparisons</a>
						</li>
						<li>
							<a href="/solutions/compliance" class="text-sm text-gray-400 hover:text-white"
								>Compliance</a
							>
						</li>
					</ul>
				</div>

				<!-- Company -->
				<div>
					<span class="mb-4 block font-semibold text-white">Company</span>
					<ul class="space-y-2">
						<li><a href="/about" class="text-sm text-gray-400 hover:text-white">About</a></li>
						<li><a href="/press" class="text-sm text-gray-400 hover:text-white">Press</a></li>
						<li>
							<a href="mailto:hello@scanopy.net" class="text-sm text-gray-400 hover:text-white"
								>Contact</a
							>
						</li>
					</ul>
				</div>

				<!-- Security & Legal -->
				<div>
					<span class="mb-4 block font-semibold text-white">Security &amp; Legal</span>
					<ul class="space-y-2">
						<li>
							<a href="/security" class="text-sm text-gray-400 hover:text-white">Security</a>
						</li>
						<li>
							<a href="/privacy" class="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
						</li>
						<li>
							<a href="/terms" class="text-sm text-gray-400 hover:text-white">Terms of Service</a>
						</li>
						<li>
							<a href="/refund" class="text-sm text-gray-400 hover:text-white">Refund Policy</a>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row"
		>
			<p class="text-sm text-gray-500">
				© {new Date().getFullYear()} Scanopy LLC
			</p>
			<div class="flex gap-6">
				{#if healthStatus === 'healthy'}
					<a
						href={appHref(APP.app, page.url.pathname, 'footer-status', 'footer')}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
					>
						<span class="relative flex h-3 w-3">
							<span class="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
							></span>
							<span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
						</span>
						Status
					</a>
				{:else}
					<span class="flex items-center gap-2 text-sm text-gray-400">
						<span class="relative flex h-3 w-3">
							{#if healthStatus === 'loading'}
								<span class="absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"
								></span>
								<span class="relative inline-flex h-3 w-3 rounded-full bg-gray-500"></span>
							{:else}
								<span class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
								></span>
								<span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
							{/if}
						</span>
						Status
					</span>
				{/if}
				<a
					href={appHref(APP.login, page.url.pathname, 'footer', 'footer')}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-gray-500 hover:text-gray-400"
					onclick={() => trackExternalLink('app_login', APP.login)}>Log in</a
				>
			</div>
		</div>
	</div>
</footer>
