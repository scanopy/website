<script lang="ts">
	import { Quote, ExternalLink } from 'lucide-svelte';
	import { analytics } from '$lib/analytics.svelte';
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';

	const mentions = (pressMentionsData as PressMention[]).map((m) => ({
		...m,
		dateFormatted: new Date(m.datePublished).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}));

	const badgeColors: Record<string, string> = {
		review: 'bg-blue-500/20 text-blue-400',
		tutorial: 'bg-green-500/20 text-green-400',
		guide: 'bg-purple-500/20 text-purple-400'
	};

	const languageLabels: Record<string, string> = {
		en: 'English',
		fr: 'French'
	};

	const videos = [
		{
			id: 'F4SgNNWzbEA',
			title: 'Stop Drawing Network Diagrams Manually — Scanopy Does It for You',
			channel: 'VirtualizationHowto',
			language: 'English',
			uploadDate: '2025-12-22',
			duration: 'PT14M33S'
		},
		{
			id: 'GmpWJpKzihI',
			title: 'Scanopy : cet outil crée la topologie de votre réseau à votre place',
			channel: 'IT-Connect',
			language: 'French',
			uploadDate: '2026-01-22',
			duration: 'PT23M48S'
		}
	];

	function trackLink(destination: string, url: string) {
		analytics.externalLinkClicked({ destination, location: 'press', url });
	}
</script>

<svelte:head>
	<title>Press & Media - Scanopy</title>
	<meta
		name="description"
		content="Read what the press and tech community are saying about Scanopy, the automated network documentation and topology mapping tool."
	/>
	<link rel="canonical" href="https://scanopy.net/press" />

	<meta property="og:title" content="Press & Media - Scanopy" />
	<meta property="og:description" content="Read what the press and tech community are saying about Scanopy, the automated network documentation and topology mapping tool." />
	<meta property="og:url" content="https://scanopy.net/press" />
	<meta property="og:image" content="https://scanopy.net/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Press & Media - Scanopy" />
	<meta name="twitter:description" content="Read what the press and tech community are saying about Scanopy, the automated network documentation and topology mapping tool." />
	<meta name="twitter:image" content="https://scanopy.net/social.webp" />

	{#each videos as v}
		{@html `<script type="application/ld+json">${JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'VideoObject',
			name: v.title,
			description: `${v.channel} reviews Scanopy, the automated network documentation and topology mapping tool.`,
			thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
			uploadDate: v.uploadDate,
			duration: v.duration,
			contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
			embedUrl: `https://www.youtube.com/embed/${v.id}`,
			publisher: { '@type': 'Organization', name: v.channel }
		})}</script>`}
	{/each}
</svelte:head>

<!-- Hero -->
<section class="py-16 lg:py-24">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl text-center">
			<h1 class="mb-4 text-4xl font-bold leading-tight text-rose-400 lg:text-5xl">
				Press & Media
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-300">
				See what publications and tech blogs are saying about Scanopy. From in-depth reviews to
				installation guides, the community is covering automated network documentation across the
				globe.
			</p>
		</div>
	</div>
</section>

<!-- Press Mentions Grid -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
			{#each mentions as mention (mention.id)}
				<a
					href={mention.url}
					target="_blank"
					rel="noopener noreferrer"
					class="card card-static group relative flex flex-col p-6 transition-colors hover:border-gray-700"
					onclick={() => trackLink(mention.id, mention.url)}
				>
					<div class="mb-4 flex items-center justify-between">
						<img
							src={mention.logo}
							alt={mention.name}
							class="h-8 max-w-[180px] object-contain"
							width="180"
							height="32"
						/>
						<div class="flex items-center gap-2">
							<span
								class="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {badgeColors[mention.articleType] ?? 'bg-gray-500/20 text-gray-400'}"
							>
								{mention.articleType}
							</span>
							<ExternalLink
								class="h-4 w-4 text-gray-600 transition-colors group-hover:text-gray-400"
							/>
						</div>
					</div>

					<p class="mb-3 text-sm font-medium text-gray-200">
						{mention.articleTitle}
					</p>

					{#if mention.quote}
						<div class="relative flex-1">
							<Quote class="absolute -left-1 -top-1 h-5 w-5 text-blue-500/20" />
							<p class="pl-5 text-sm italic leading-relaxed text-gray-400">
								"{mention.quote}"
							</p>
						</div>
					{/if}

					<div class="mt-4 flex items-center gap-2 text-xs text-gray-500">
						<span>{mention.dateFormatted}</span>
						<span>·</span>
						<span>{languageLabels[mention.language] ?? mention.language}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Video Reviews -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-rose-400 lg:text-4xl">Video Reviews</h2>
		<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
			{#each videos as video (video.id)}
				<div class="card card-static overflow-hidden p-0">
					<div class="relative aspect-video">
						<iframe
							src="https://www.youtube.com/embed/{video.id}"
							title={video.title}
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
							loading="lazy"
							class="absolute inset-0 h-full w-full"
						></iframe>
					</div>
					<div class="p-4">
						<p class="text-sm font-medium text-gray-200">{video.title}</p>
						<div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
							<span>{video.channel}</span>
							<span>·</span>
							<span>{video.language}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Press Inquiry CTA -->
<section class="border-t border-gray-800 py-12">
	<div class="container mx-auto px-4 text-center">
		<p class="mb-3 text-gray-400">
			Writing about Scanopy or interested in covering us?
		</p>
		<a
			href="mailto:press@scanopy.net"
			class="text-blue-400 hover:text-blue-300"
		>
			Reach out at press@scanopy.net &rarr;
		</a>
	</div>
</section>
