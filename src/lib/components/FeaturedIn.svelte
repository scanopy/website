<script lang="ts">
	import { Quote, ExternalLink } from 'lucide-svelte';
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

			<div
				class="mx-auto grid gap-8"
				class:md:grid-cols-2={mentions.length >= 2}
				class:lg:grid-cols-3={mentions.length === 3}
				class:lg:grid-cols-4={mentions.length >= 4}
			>
				{#each mentions as mention (mention.id)}
					<a
						href={mention.url}
						target="_blank"
						rel="noopener noreferrer"
						class="card card-static group relative flex flex-col p-6 transition-colors hover:border-gray-700"
					>
						<div class="mb-4 flex items-center justify-between">
							<img src={mention.logo} alt={mention.name} class="h-8 max-w-[180px] object-contain" width="180" height="32" />
							<ExternalLink
								class="h-4 w-4 text-gray-600 transition-colors group-hover:text-gray-400"
							/>
						</div>

						{#if mention.quote}
							<div class="relative flex-1">
								<Quote class="absolute -left-1 -top-1 h-5 w-5 text-blue-500/20" />
								<p class="pl-5 text-sm italic leading-relaxed text-gray-400">
									"{mention.quote}"
								</p>
							</div>
							<p class="mt-4 text-xs font-medium text-gray-500">
								— {mention.name}
							</p>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}
