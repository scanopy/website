<script lang="ts">
	import { FeaturedIn, GithubStars, PageHero } from '$lib/components';
	import { ArrowRight, ExternalLink } from 'lucide-svelte';
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import { analytics, featureFlags } from '$lib/analytics.svelte';

	const pressMentions = pressMentionsData as PressMention[];
</script>

<svelte:head>
	<title>About - Scanopy</title>
	<meta
		name="description"
		content="Scanopy exists because keeping network diagrams accurate is tedious, thankless work. We built a tool that does it for you."
	/>
	<link rel="canonical" href="https://scanopy.net/about" />
</svelte:head>

<PageHero
	title="Network documentation shouldn't be a chore"
	subtitle="Scanopy exists because keeping network diagrams accurate is tedious, thankless work - and nobody actually does it. We built a tool that does it for you."
/>

<!-- Origin Story -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<h2 class="mb-8 text-3xl font-bold text-rose-400 lg:text-4xl">How it started</h2>
		<div class="space-y-5 text-gray-300 leading-relaxed">
			<p>
				If you've spent any time on r/homelab or r/selfhosted, you've seen the posts. Someone
				shares a beautifully detailed network diagram - color-coded VLANs, labeled switches,
				the works - and the comments light up. <em>"How did you make this?"</em>
				<em>"What tool is that?"</em> <em>"I need to do this for my network."</em>
			</p>
			<p>
				I was one of those commenters. I always wanted a proper network diagram. I just never
				wanted to actually <em>make</em> one.
			</p>
			<p>
				The process is always the same: you open draw.io or Visio, spend a few hours dragging boxes
				around, feel good about yourself for a week, and then never update it again. Your network
				changes, the diagram doesn't, and six months later it's fiction.
			</p>
			<p>
				So I took the technical overkill route and built a tool that scans your network and
				generates the diagram automatically. That became Scanopy.
			</p>
		</div>
	</div>
</section>

<!-- What We Believe -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<h2 class="mb-12 text-3xl font-bold text-rose-400 lg:text-4xl">How we think about this</h2>
		<div class="space-y-10">
			<div>
				<h3 class="mb-3 text-xl font-semibold text-white">
					Documentation should be derived from infrastructure, not maintained alongside it.
				</h3>
				<p class="text-gray-400 leading-relaxed">
					Think of it like OpenAPI specs annotated inline in the codebase - the
					documentation isn't fully automatic, but it's heavily derived from the technical system
					it describes. That's the only way it stays accurate. Scanopy works the same way: it
					pulls directly from your actual network to generate documentation, so the diagram
					reflects reality instead of someone's memory of reality from three months ago.
				</p>
			</div>

			<div>
				<h3 class="mb-3 text-xl font-semibold text-white">
					A documentation tool shouldn't pretend to be an ITAM platform.
				</h3>
				<p class="text-gray-400 leading-relaxed">
					Scanopy doesn't do asset lifecycle management, procurement tracking, or compliance
					workflows. It does network documentation. That's a feature, not a gap. You don't need
					a $15/device/month platform when what you actually need is an accurate network map - and our pricing model is aligned to this, so you'll never pay per device with Scanopy.
				</p>
			</div>

			<div>
				<h3 class="mb-3 text-xl font-semibold text-white">
					IT buyers don't need hype. They need to verify.
				</h3>
				<p class="text-gray-400 leading-relaxed">
					We publish our pricing. We name competitors directly. We show real screenshots, not
					mockups. We make demos and self-hostability as accessible as possible. If Scanopy isn't the right fit, we'd rather you find out before you deploy
					it - not after.
				</p>
			</div>

			<div>
				<h3 class="mb-3 text-xl font-semibold text-white">
					The person who set up the network shouldn't be a single point of failure.
				</h3>
				<p class="text-gray-400 leading-relaxed">
					Every team has someone who "just knows" how the network is set up. When that person
					goes on vacation - or leaves - everyone else is guessing. Living
					documentation fixes the bus factor.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- What Others Are Saying -->
<FeaturedIn mentions={pressMentions} title="What others are saying" />

<section class="border-t border-gray-800 py-12">
	<div class="container mx-auto px-4">
		<div class="flex flex-wrap items-center justify-center gap-6">
			<GithubStars />
			<a
				href="https://discord.gg/b7ffQr8AcZ"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
			>
				Join our Discord
				<ExternalLink class="h-4 w-4" />
			</a>
		</div>
	</div>
</section>

<!-- Founder -->
<section class="border-t border-gray-800 bg-gray-900/50 py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<h2 class="mb-8 flex flex-wrap items-center gap-3 text-3xl font-bold text-rose-400 lg:text-4xl">
			Built by
			<a
				href="https://github.com/mayanayza"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-1.5 text-lg font-medium text-white transition-colors hover:border-gray-500"
			>
				<img
					src="https://github.com/mayanayza.png"
					alt="Maya"
					class="h-7 w-7 rounded-full"
					width="28"
					height="28"
				/>
				mayanayza
			</a>
		</h2>
		<div class="space-y-5 text-gray-300 leading-relaxed">
			<p>
				I'm a developer and homelabber. I built Scanopy because my own network documentation
				lived entirely in my head - and I knew I'd never maintain a manual diagram.
			</p>
			<p>
				Scanopy started as a side project to scratch my own itch. It turns out a lot of sysadmins,
				MSPs, and network engineers had the same itch.
			</p>
			<p>
				I'm not an enterprise IT veteran. I've never run an MSP or managed a production data
				center. What I am is someone who got tired of a problem and built a solution - and
				then discovered it solved that problem for a lot of other people too.
			</p>
		</div>
		<div class="mt-6 flex flex-wrap gap-4">
			<a
				href="https://noted.lol/scanopy/"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
			>
				Read the full origin story on noted.lol
				<ExternalLink class="h-4 w-4" />
			</a>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-6 text-3xl font-bold text-rose-400 lg:text-4xl">
				See it for yourself
			</h2>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="https://app.scanopy.net/onboarding"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-primary px-8 py-3 text-lg"
					onclick={() =>
						analytics.ctaClicked({
							location: 'about_cta',
							destination: 'app_onboarding',
							text: featureFlags.mainCtaText
						})}
				>
					{featureFlags.mainCtaText}
					<ArrowRight class="h-5 w-5" />
				</a>
				<a
					href="https://demo.scanopy.net"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-secondary px-8 py-3 text-lg"
					onclick={() =>
						analytics.ctaClicked({
							location: 'about_cta',
							destination: 'demo',
							text: 'View Live Demo'
						})}
				>
					View Live Demo
				</a>
			</div>
		</div>
	</div>
</section>
