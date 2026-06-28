<script lang="ts">
	import type { CustomerLogo } from '$lib/types';

	interface Props {
		logos: CustomerLogo[];
		title?: string;
		sectionClass?: string;
	}

	let {
		logos,
		title = 'Trusted by teams that manage real infrastructure',
		sectionClass = ''
	}: Props = $props();
</script>

{#if logos.length > 0}
	<section class="border-t border-gray-800 py-16 {sectionClass}">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl">{title}</h2>
			</div>

			<div class="mx-auto flex flex-wrap items-start justify-center gap-8">
				{#each logos as logo (logo.id)}
					{@const Wrapper = logo.url ? 'a' : 'div'}
					<svelte:element
						this={Wrapper}
						href={logo.url}
						target={logo.url ? '_blank' : undefined}
						rel={logo.url ? 'noopener noreferrer' : undefined}
						class="group flex flex-col items-center text-center"
					>
						<div
							class="flex h-20 w-48 items-center justify-center rounded-xl bg-paper px-6 py-4 shadow-sm transition-transform group-hover:-translate-y-0.5"
						>
							<img
								src={logo.logo}
								alt={logo.name}
								class="max-h-12 max-w-full object-contain"
								loading="lazy"
								width="180"
								height="48"
							/>
						</div>
						{#if logo.caption}
							<p class="mt-3 text-sm text-gray-500">
								<span class="font-medium text-gray-400">{logo.name}</span> — {logo.caption}
							</p>
						{/if}
					</svelte:element>
				{/each}
			</div>
		</div>
	</section>
{/if}
