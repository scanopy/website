<script lang="ts">
	import { customers, customerDescriptor } from '$lib/customers';

	interface Props {
		title?: string;
		sectionClass?: string;
	}

	// Reads the full customer list from `$lib/customers` rather than taking it as a prop, so
	// every band on the site shows the same set. `title` is optional: without one the band
	// renders as a bare row of logos, which is how both the homepage and pricing use it.
	let { title, sectionClass = '' }: Props = $props();
</script>

{#if customers.length > 0}
	<section class="border-t border-gray-800 py-16 {sectionClass}">
		<div class="container mx-auto px-4">
			{#if title}
				<div class="mb-12 text-center">
					<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl">{title}</h2>
				</div>
			{/if}

			<div class="mx-auto flex flex-wrap items-start justify-center gap-8">
				{#each customers as customer (customer.id)}
					{@const Wrapper = customer.url ? 'a' : 'div'}
					<svelte:element
						this={Wrapper}
						href={customer.url}
						target={customer.url ? '_blank' : undefined}
						rel={customer.url ? 'noopener noreferrer' : undefined}
						class="group flex flex-col items-center text-center"
					>
						<div
							class="flex h-20 w-48 items-center justify-center rounded-xl bg-paper px-6 py-4 shadow-sm transition-transform group-hover:-translate-y-0.5"
						>
							<img
								src={customer.logo}
								alt={customer.name}
								class="max-h-12 max-w-full object-contain"
								loading="lazy"
								width="180"
								height="48"
							/>
						</div>
						<p class="mt-3 text-sm text-gray-500">{customerDescriptor(customer)}</p>
					</svelte:element>
				{/each}
			</div>
		</div>
	</section>
{/if}
