<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		image?: string;
		title: string;
		subtitle?: string;
		children?: Snippet;
	}

	let { image = '/topology-hero.png', title, subtitle, children }: Props = $props();
</script>

<section class="relative overflow-hidden py-16 lg:py-24">
	<div
		class="absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('{image}');"
	></div>
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
