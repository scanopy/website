<script lang="ts">
	import { ExternalLink } from 'lucide-svelte';
	import type { PressMention } from '$lib/types';

	interface Props {
		mentions: PressMention[];
		title?: string;
		sectionClass?: string;
	}

	let { mentions, title = 'Featured In', sectionClass = '' }: Props = $props();
</script>

{#if mentions.length > 0}
	<section class="border-t border-gray-800 py-16 {sectionClass}">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">{title}</h2>
			</div>

			<!-- Single non-wrapping row; scrolls horizontally when the logos overflow.
				 Cards size to their quote (width varies) and stay compact in height. -->
			<div class="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-3">
				{#each mentions as mention (mention.id)}
					<a
						href={mention.url}
						target="_blank"
						rel="noopener noreferrer"
						class="card card-static group relative flex w-fit min-w-[220px] max-w-sm shrink-0 snap-start flex-col p-5 transition-colors hover:border-gray-700"
					>
						<div class="mb-3 flex items-center justify-between gap-4">
							<img
								src={mention.logo}
								alt={mention.name}
								class="h-7 max-w-[160px] object-contain"
								width="160"
								height="28"
							/>
							<ExternalLink
								class="h-4 w-4 shrink-0 text-gray-600 transition-colors group-hover:text-gray-400"
							/>
						</div>

						{#if mention.quote}
							<p class="text-sm italic leading-relaxed text-gray-400">
								"{mention.quote}"
							</p>
							<p class="mt-3 text-xs font-medium text-gray-500">— {mention.name}</p>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}
