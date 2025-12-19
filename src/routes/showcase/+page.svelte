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
		content="See what the Scanopy community is building. Explore topology diagrams from homelabs, businesses, and creative network setups."
	/>
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Community Showcase</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-400">
				See what the community is building with Scanopy. From homelabs to enterprise networks,
				explore real topology diagrams created by our users.
			</p>
		</div>

		<GalleryShowcase {items} />

		<div class="mt-16 rounded-xl border border-gray-700 bg-gray-800/30 p-8 text-center">
			<h2 class="mb-2 text-xl font-semibold text-white">Built something cool?</h2>
			<p class="mb-6 text-gray-400">
				Share your network topology with the community. We'd love to feature your setup!
			</p>
			<a
				href="https://tally.so/r/lbqLAv"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary inline-flex items-center gap-2"
			>
				<Send class="h-4 w-4" />
				Submit Your Diagram
			</a>
		</div>
	</div>
</section>
