<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Page title, e.g. "Privacy Policy". Rendered in the h1 and meta tags. */
		title: string;
		/** Meta description for search and social cards. */
		description: string;
		/** Path slug without leading slash, e.g. "privacy". Used for canonical and og:url. */
		slug: string;
		/** Date value, e.g. "July 8, 2026". */
		date: string;
		/**
		 * Which label precedes the date. Contracts (Terms, Privacy, DPA) use "effective";
		 * informational pages (Security, Refund) use "updated".
		 */
		dateType?: 'effective' | 'updated';
		children: Snippet;
	}

	let { title, description, slug, date, dateType = 'updated', children }: Props = $props();

	const fullTitle = `${title} - Scanopy`;
	const url = `https://scanopy.net/${slug}`;
	const dateLabel = dateType === 'effective' ? 'Effective Date' : 'Last updated';
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />
</svelte:head>

<section class="py-20">
	<div class="container mx-auto max-w-4xl px-4">
		<h1 class="mb-4 text-4xl font-bold text-white">{title}</h1>
		<p class="mb-12 text-gray-400">{dateLabel}: {date}</p>

		<div class="prose prose-invert prose-gray max-w-none space-y-8">
			{@render children()}
		</div>
	</div>
</section>
