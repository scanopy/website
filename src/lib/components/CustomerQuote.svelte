<script lang="ts">
	import type { Testimonial, CustomerLogo } from '$lib/types';
	import testimonialsData from '$lib/fixtures/testimonials.json';
	import customerLogosData from '$lib/fixtures/customer-logos.json';

	// Pairs a customer quote with that customer's logo, the same treatment used for the
	// lead testimonial on the homepage. Pass the testimonial `id`; the quote text and the
	// customer logo are resolved from the fixtures so callers (homepage, guides, blog) stay
	// in sync. Set `card` to render it inside a bordered card (used inline in articles);
	// leave it off for the full-width homepage treatment. `not-prose` keeps article
	// typography styles off the blockquote when this renders inside a markdown `.prose`
	// container.
	let { id, card = false }: { id: string; card?: boolean } = $props();

	const testimonials = testimonialsData as Testimonial[];
	const customerLogos = customerLogosData as CustomerLogo[];

	const testimonial = $derived(testimonials.find((t) => t.id === id));
	const customer = $derived(
		testimonial ? customerLogos.find((c) => c.id === testimonial.customerId) : undefined
	);
</script>

{#if testimonial}
	<figure
		class="not-prose mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:gap-12 md:text-left {card
			? 'card card-static md:p-8'
			: 'px-4'}"
	>
		{#if customer}
			<figcaption class="flex flex-shrink-0 flex-col items-center gap-3">
				<svelte:element
					this={customer.url ? 'a' : 'div'}
					href={customer.url}
					target={customer.url ? '_blank' : undefined}
					rel={customer.url ? 'noopener noreferrer' : undefined}
					class="flex h-16 w-40 items-center justify-center rounded-xl bg-paper px-5 py-3 shadow-sm"
				>
					<img
						src={customer.logo}
						alt={customer.name}
						class="max-h-10 max-w-full object-contain"
						width="180"
						height="48"
						loading="lazy"
					/>
				</svelte:element>
				<span class="max-w-[12rem] text-center text-sm font-medium text-gray-400"
					>{testimonial.attribution}</span
				>
			</figcaption>
		{/if}
		<blockquote class="text-lg italic leading-relaxed text-gray-200 lg:text-xl">
			"{testimonial.quote}"
		</blockquote>
	</figure>
{/if}
