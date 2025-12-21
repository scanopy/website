<script lang="ts">
	import { History } from 'lucide-svelte';

	interface ChangelogEntry {
		version: string;
		date: string;
		title: string;
		content: string;
		slug: string;
	}

	interface PageData {
		entries: ChangelogEntry[];
	}

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Changelog - Scanopy</title>
	<meta
		name="description"
		content="Scanopy changelog and release notes. See what's new in each version of Scanopy."
	/>
	<link rel="canonical" href="https://scanopy.net/changelog" />
</svelte:head>

<section class="py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<div class="mb-12 text-center">
			<div class="mb-4 flex justify-center">
				<History class="h-12 w-12 text-blue-400" />
			</div>
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Changelog</h1>
			<p class="text-xl text-gray-400">New updates and improvements to Scanopy.</p>
		</div>

		{#if data.entries.length === 0}
			<div class="text-center">
				<p class="text-gray-400">No releases yet. Check back soon!</p>
			</div>
		{:else}
			<div class="relative">
				<!-- Timeline line -->
				<div class="absolute left-[7px] top-2 hidden h-full w-0.5 bg-gray-800 md:block"></div>

				<div class="space-y-12">
					{#each data.entries as entry (entry.slug)}
						<article class="relative md:pl-10">
							<!-- Timeline dot -->
							<div
								class="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-2 border-blue-500 bg-gray-900 md:block"
							></div>

							<header class="mb-4">
								<div class="flex flex-wrap items-center gap-3">
									<span
										class="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400"
									>
										v{entry.version}
									</span>
									{#if entry.date}
										<time class="text-sm text-gray-500" datetime={entry.date}>
											{formatDate(entry.date)}
										</time>
									{/if}
								</div>
								<h2 class="mt-2 text-2xl font-bold text-white">{entry.title}</h2>
							</header>

							<div class="prose prose-invert prose-gray max-w-none">
								{@html entry.content}
							</div>
						</article>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	:global(.prose h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: rgb(251 113 133);
	}

	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		color: rgb(209 213 219);
		margin-bottom: 1.5rem;
	}

	:global(.prose li) {
		color: rgb(209 213 219);
		margin-top: 0.25rem;
	}

	:global(.prose p) {
		color: rgb(209 213 219);
		margin-bottom: 1rem;
	}

	:global(.prose a) {
		color: rgb(96 165 250);
	}

	:global(.prose a:hover) {
		color: rgb(147 197 253);
	}

	:global(.prose code) {
		background-color: rgb(31 41 55);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: rgb(229 231 235);
	}

	:global(.prose hr) {
		border: none;
		margin: 2rem 0 1rem 0;
	}
</style>
