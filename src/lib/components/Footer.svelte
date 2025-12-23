<script lang="ts">
	import GithubStars from '$lib/components/GithubStars.svelte';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import Icon from '@iconify/svelte';
	import { isPostHogLoaded, getPostHog } from '$lib/posthog';

	interface Props {
		healthStatus?: 'loading' | 'healthy' | 'unhealthy';
		plunkApiKey?: string;
	}

	let { healthStatus = 'loading', plunkApiKey = '' }: Props = $props();

	function trackExternalLink(destination: string, url: string) {
		if (isPostHogLoaded()) {
			getPostHog().capture('external_link_clicked', {
				destination,
				location: 'footer',
				url
			});
		}
	}
</script>

<footer class="border-t border-gray-800 bg-gray-900/30">
	<div class="container mx-auto px-4 py-12">
		<div class="grid gap-8 md:grid-cols-5">
			<!-- Brand -->
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<img src="/scanopy-logo.png" alt="Scanopy" class="h-8 w-8" />
					<span class="text-xl font-bold text-white">Scanopy</span>
				</div>
				<p class="text-sm text-gray-400">Network discovery and documentation on autopilot.</p>
				<GithubStars />
			</div>

			<!-- Product -->
			<div>
				<h4 class="mb-4 font-semibold text-white">Product</h4>
				<ul class="space-y-2">
					<li><a href="/pricing" class="text-sm text-gray-400 hover:text-white">Pricing</a></li>
					<li><a href="/roadmap" class="text-sm text-gray-400 hover:text-white">Roadmap</a></li>
					<li><a href="/changelog" class="text-sm text-gray-400 hover:text-white">Changelog</a></li>
					<li>
						<a href="/services" class="text-sm text-gray-400 hover:text-white"
							>Discoverable Services</a
						>
					</li>
					<li>
						{#if healthStatus === 'healthy'}
							<a
								href="https://app.scanopy.net"
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

			<!-- Resources -->
			<div>
				<h4 class="mb-4 font-semibold text-white">Resources</h4>
				<ul class="space-y-2">
					<li>
						<a
							href="https://github.com/scanopy/scanopy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
							onclick={() => trackExternalLink('github', 'https://github.com/scanopy/scanopy')}
						>
							<Icon icon="simple-icons:github" class="h-4 w-4" />
							GitHub
						</a>
					</li>
					<li>
						<a href="/docs" class="text-sm text-gray-400 hover:text-white">Documentation</a>
					</li>
					<li>
						<a href="/showcase" class="text-sm text-gray-400 hover:text-white">Showcase</a>
					</li>
				</ul>
			</div>

			<!-- Community -->
			<div>
				<h4 class="mb-4 font-semibold text-white">Community</h4>
				<ul class="space-y-2">
					<li>
						<a
							href="https://discord.gg/b7ffQr8AcZ"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
							onclick={() => trackExternalLink('discord', 'https://discord.gg/b7ffQr8AcZ')}
						>
							<Icon icon="simple-icons:discord" class="h-4 w-4" />
							Discord
						</a>
					</li>
					<li>
						<a
							href="https://reddit.com/r/scanopy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
							onclick={() => trackExternalLink('reddit', 'https://reddit.com/r/scanopy')}
						>
							<Icon icon="simple-icons:reddit" class="h-4 w-4" />
							Reddit
						</a>
					</li>
					<li>
						<a
							href="https://x.com/getscanopy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
							onclick={() => trackExternalLink('twitter', 'https://x.com/getscanopy')}
						>
							<Icon icon="simple-icons:x" class="h-4 w-4" />
							X
						</a>
					</li>
					<li>
						<a
							href="https://bsky.app/profile/scanopy.net"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
							onclick={() => trackExternalLink('bluesky', 'https://bsky.app/profile/scanopy.net')}
						>
							<Icon icon="simple-icons:bluesky" class="h-4 w-4" />
							Bluesky
						</a>
					</li>
				</ul>
			</div>

			<!-- Newsletter -->
			<div>
				<h4 class="mb-4 font-semibold text-white">Stay Updated</h4>
				{#if plunkApiKey}
					<NewsletterSignup apiKey={plunkApiKey} eventName="website_newsletter" compact={true} />
				{/if}
			</div>
		</div>

		<div
			class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row"
		>
			<p class="text-sm text-gray-500">
				© {new Date().getFullYear()} Scanopy
			</p>
			<div class="flex gap-6">
				<a href="/privacy" class="text-sm text-gray-500 hover:text-gray-400">Privacy</a>
				<a href="/terms" class="text-sm text-gray-500 hover:text-gray-400">Terms</a>
			</div>
		</div>
	</div>
</footer>
