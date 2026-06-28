<script lang="ts">
	import { onMount } from 'svelte';

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	interface Props {
		headings: Heading[];
		maxDepth?: number;
	}

	let { headings, maxDepth = 2 }: Props = $props();

	const excludeIds = new Set(['try-it', 'sources']);
	const filteredHeadings = $derived(
		headings.filter((h) => h.level <= maxDepth && !excludeIds.has(h.id))
	);
	let activeId = $state('');

	const showToc = $derived(filteredHeadings && filteredHeadings.length >= 3);

	onMount(() => {
		if (!showToc) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				}
			},
			{ rootMargin: '-80px 0px -70% 0px' }
		);

		for (const heading of filteredHeadings) {
			const el = document.getElementById(heading.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	});
</script>

{#if showToc}
	<nav class="blog-toc" aria-label="Table of contents">
		<div class="toc-sticky">
			<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">On this page</p>
			<ul class="space-y-1">
				{#each filteredHeadings as heading}
					<li>
						<a
							href="#{heading.id}"
							class="toc-link block text-sm leading-6 transition-colors"
							class:toc-link-h3={heading.level === 3}
							class:toc-active={activeId === heading.id}
							onclick={(e) => {
								e.preventDefault();
								document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
							}}
						>
							{heading.text}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
{/if}

<style>
	.blog-toc {
		display: none;
	}

	@media (min-width: 1024px) {
		.blog-toc {
			display: block;
		}
	}

	.toc-sticky {
		position: sticky;
		top: 6rem;
	}

	.toc-link {
		color: rgb(var(--c-gray-500));
		border-left: 2px solid transparent;
		padding-left: 0.75rem;
	}

	.toc-link-h3 {
		padding-left: 1.5rem;
	}

	.toc-link:hover {
		color: rgb(var(--c-gray-300));
	}

	.toc-active {
		color: rgb(var(--c-blue-400)) !important;
		border-left-color: rgb(var(--c-blue-500));
	}
</style>
