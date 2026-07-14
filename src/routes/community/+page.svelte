<script lang="ts">
	import GithubStars from '$lib/components/GithubStars.svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { ExternalLink } from 'lucide-svelte';

	const communityLinks = [
		{ name: 'GitHub', url: 'https://github.com/scanopy/scanopy', destination: 'github' },
		{ name: 'Discord', url: 'https://discord.gg/b7ffQr8AcZ', destination: 'discord' },
		{ name: 'Reddit', url: 'https://reddit.com/r/scanopy', destination: 'reddit' },
		{
			name: 'Documentation',
			url: '/docs/self-hosted-server/server-installation/',
			destination: 'docs'
		}
	];

	function trackLink(destination: string, url: string) {
		analytics.externalLinkClicked({ destination, location: 'community', url });
	}
</script>

<svelte:head>
	<title>Community Edition - Free, Self-Hosted Network Documentation | Scanopy</title>
	<meta
		name="description"
		content="Free, self-hosted network documentation for homelabs, home networks, and small teams. Get started with a single Docker command."
	/>
	<link rel="canonical" href="https://scanopy.net/community" />

	<meta
		property="og:title"
		content="Community Edition - Free, Self-Hosted Network Documentation | Scanopy"
	/>
	<meta
		property="og:description"
		content="Free, self-hosted network documentation for homelabs, home networks, and small teams. Get started with a single Docker command."
	/>
	<meta property="og:url" content="https://scanopy.net/community" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Community Edition - Free, Self-Hosted Network Documentation | Scanopy"
	/>
	<meta
		name="twitter:description"
		content="Free, self-hosted network documentation for homelabs, home networks, and small teams. Get started with a single Docker command."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden py-16 lg:py-24">
	<!-- Background image -->
	<div
		class="absolute inset-0 bg-[url('/og/topology-hero-light.webp')] bg-cover bg-center bg-no-repeat dark:bg-[url('/og/topology-hero.webp')]"
	></div>
	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"></div>

	<div class="container relative z-10 mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<div class="pb-4">
				<GithubStars />
			</div>

			<h1 class="mb-4 text-4xl font-bold leading-tight text-rose-400 lg:text-6xl">
				Free, self-hosted network documentation
			</h1>

			<p class="mx-auto max-w-2xl text-xl text-gray-300">
				For homelabs, home networks, and small teams
			</p>
		</div>
	</div>
</section>

<!-- Intro -->
<section class="border-t border-gray-800 py-12">
	<div class="container mx-auto max-w-3xl px-4">
		<p class="text-lg leading-relaxed text-gray-300">
			Scanopy Community is the free, self-hosted edition of Scanopy - the same automatic discovery
			engine that powers our cloud plans, running entirely on your infrastructure. It's built for
			homelabbers, home network enthusiasts, and small teams who want auto-updating network
			documentation without sending data to a third party. Deploy with a single Docker command, scan
			your network, and get four views of your infrastructure in minutes. No account required, no
			time restrictions.
		</p>
	</div>
</section>

<!-- Quick Start -->
<section id="quickstart" class="border-t border-gray-800 py-20">
	<div class="container mx-auto max-w-2xl px-4">
		<h2 class="mb-8 text-center text-3xl font-bold text-rose-400 lg:text-4xl">Quick Start</h2>
		<div class="card card-static overflow-hidden p-0">
			<div class="bg-gray-800/50 px-4 py-2 text-sm text-gray-400">Terminal</div>
			<pre class="overflow-x-auto p-4 text-sm text-gray-300"><code
					>curl -O https://raw.githubusercontent.com/scanopy/scanopy/refs/heads/main/docker-compose.yml
docker compose up -d</code
				></pre>
		</div>
		<p class="mt-4 text-center text-sm text-gray-400">
			Access the UI at <code class="rounded bg-gray-800 px-1.5 py-0.5 text-gray-300"
				>http://localhost:60072</code
			>
		</p>
		<p class="mt-3 text-center text-sm text-gray-500">
			Also available via
			<a
				href="https://community-scripts.github.io/ProxmoxVE/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-400 hover:text-blue-300">Proxmox helper script</a
			>
			and
			<a
				href="https://unraid.net/community/apps"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-400 hover:text-blue-300">Unraid community app</a
			>. See the
			<a
				href="/docs/self-hosted-server/server-installation/"
				class="text-blue-400 hover:text-blue-300">full install docs</a
			> for more options.
		</p>
	</div>
</section>

<!-- Community Links -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-8 text-center text-3xl font-bold text-rose-400 lg:text-4xl">
			Join the Community
		</h2>
		<div class="flex flex-wrap items-center justify-center gap-4">
			{#each communityLinks as link}
				<a
					href={link.url}
					target={link.url.startsWith('/') ? undefined : '_blank'}
					rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
					class="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-5 py-3 text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
					onclick={() => trackLink(link.destination, link.url)}
				>
					{link.name}
					{#if !link.url.startsWith('/')}
						<ExternalLink class="h-4 w-4" />
					{/if}
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Soft Upsell -->
<section class="border-t border-gray-800 py-12">
	<div class="container mx-auto px-4 text-center">
		<p class="mb-3 text-gray-400">Need more networks, team seats, or managed hosting?</p>
		<a
			href="/pricing"
			class="text-blue-400 hover:text-blue-300"
			onclick={() =>
				analytics.ctaClicked({
					location: 'community_upsell',
					destination: 'pricing',
					text: 'View Plans'
				})}
		>
			View Plans &rarr;
		</a>
		<p class="mt-4 text-gray-400">
			Need a commercial license to self-host in your business?
			<a
				href="/commercial"
				class="text-blue-400 hover:text-blue-300"
				onclick={() =>
					analytics.ctaClicked({
						location: 'community_upsell',
						destination: 'commercial',
						text: 'Commercial Edition'
					})}
			>
				See the Commercial Edition &rarr;
			</a>
		</p>
	</div>
</section>
