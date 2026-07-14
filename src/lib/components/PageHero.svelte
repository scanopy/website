<script lang="ts">
	import type { Snippet } from 'svelte';
	import { theme } from '$lib/theme.svelte';

	interface Props {
		image?: string;
		/** Light-theme variant. Defaults to the `-light` sibling of `image`. */
		imageLight?: string;
		title: string;
		subtitle?: string;
		children?: Snippet;
	}

	let { image = '/og/topology-hero.webp', imageLight, title, subtitle, children }: Props = $props();

	const resolvedImage = $derived(
		theme.resolved === 'light' ? (imageLight ?? image.replace(/\.webp$/, '-light.webp')) : image
	);
</script>

<section class="relative overflow-hidden py-16 lg:py-24">
	<img
		src={resolvedImage}
		alt=""
		class="absolute inset-0 h-full w-full object-cover"
		width="1440"
		height="900"
		loading="eager"
	/>
	<div class="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"></div>

	<div class="container relative z-10 mx-auto max-w-3xl px-4 text-center">
		<h1 class="mb-6 text-4xl font-bold leading-tight text-rose-400 lg:text-5xl">
			{title}
		</h1>
		{#if subtitle}
			<p class="mx-auto max-w-2xl text-xl text-gray-300">
				{subtitle}
			</p>
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
</section>
