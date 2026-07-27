<script lang="ts">
	import { GalleryShowcase } from '$lib/components';
	import { Send } from 'lucide-svelte';
	import type { GalleryItem } from '$lib/types';
	import galleryData from '$lib/fixtures/gallery.json';

	const items: GalleryItem[] = galleryData;
</script>

<svelte:head>
	<title>Community Showcase - Scanopy</title>
	<meta
		name="description"
		content="See what the Scanopy community is building. Explore infrastructure topologies from homelabs, businesses, and enterprise networks."
	/>
	<link rel="canonical" href="https://scanopy.net/showcase" />
	<meta name="robots" content="noindex" />

	<meta property="og:title" content="Community Showcase - Scanopy" />
	<meta
		property="og:description"
		content="See what the Scanopy community is building. Explore infrastructure topologies from homelabs, businesses, and enterprise networks."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://scanopy.net/showcase" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Community Showcase - Scanopy" />
	<meta
		name="twitter:description"
		content="See what the Scanopy community is building. Explore infrastructure topologies from homelabs, businesses, and enterprise networks."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Community Showcase</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-400">
				See what the community is building with Scanopy. From homelabs to enterprise networks,
				explore real topologies created by our users.
			</p>
			<p class="mx-auto mt-4 max-w-2xl text-gray-500">
				Every topology below was generated automatically by Scanopy's discovery engine. No manual
				drawing, no drag-and-drop. Just deploy the scanner and let it map your infrastructure. From
				single-subnet homelabs to multi-VLAN production networks, these topologies update themselves
				as your infrastructure changes.
			</p>
		</div>

		<GalleryShowcase {items} />

		<div class="mt-16 rounded-xl border border-gray-700 bg-gray-800/30 p-8 text-center">
			<h2 class="mb-2 text-xl font-semibold text-white">Built something cool?</h2>
			<p class="mb-6 text-gray-400">
				Share your network topology with the community. We'd love to feature your setup!
				<a href="/community" class="text-blue-400 hover:text-blue-300"
					>Join the community on Discord and GitHub</a
				>.
			</p>
			<a
				href="https://tally.so/r/lbqLAv"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary inline-flex items-center gap-2"
			>
				<Send class="h-4 w-4" />
				Submit Your Topology
			</a>
		</div>
	</div>
</section>
