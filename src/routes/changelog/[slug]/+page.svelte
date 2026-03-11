<script lang="ts">
	import { History, ArrowLeft } from 'lucide-svelte';

	interface ChangelogEntry {
		version: string;
		date: string;
		title: string;
		content: string;
		slug: string;
	}

	interface PageData {
		entry: ChangelogEntry;
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
	<title>v{data.entry.version}: {data.entry.title} - Scanopy Changelog</title>
	<meta
		name="description"
		content="Scanopy v{data.entry.version} — {data.entry.title}"
	/>
	<link rel="canonical" href="https://scanopy.net/changelog/{data.entry.slug}" />
</svelte:head>

<section class="py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<a
			href="/changelog"
			class="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
		>
			<ArrowLeft class="h-4 w-4" />
			All releases
		</a>

		<article>
			<header class="mb-6">
				<div class="flex flex-wrap items-center gap-3">
					<span
						class="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400"
					>
						v{data.entry.version}
					</span>
					{#if data.entry.date}
						<time class="text-sm text-gray-500" datetime={data.entry.date}>
							{formatDate(data.entry.date)}
						</time>
					{/if}
				</div>
				<h1 class="mt-3 text-3xl font-bold text-white lg:text-4xl">{data.entry.title}</h1>
			</header>

			<div class="prose prose-invert prose-gray max-w-none">
				{@html data.entry.content}
			</div>
		</article>
	</div>
</section>

<style>
	:global(.prose h2) {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: rgb(251 113 133);
	}

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

	:global(.prose img) {
		width: 100%;
		border-radius: 0.5rem;
		border: 1px solid rgb(31 41 55);
		margin: 1rem 0;
	}

	:global(.prose hr) {
		border: none;
		margin: 2rem 0 1rem 0;
	}
</style>
