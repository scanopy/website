<script lang="ts">
	import { analytics } from '$lib/analytics.svelte';
	import { DEMO_BOOKING_URL, DEMO_CTA_LABEL } from '$lib/config/cta';
	import LicenseCta from '$lib/components/LicenseCta.svelte';
</script>

<svelte:head>
	<title>Newsletter Confirmed - Scanopy</title>
	<meta
		name="description"
		content="Your newsletter subscription has been confirmed. Welcome to Scanopy updates."
	/>
	<meta name="robots" content="noindex, nofollow" />
	<link rel="canonical" href="https://scanopy.net/newsletter-confirmed" />

	<meta property="og:title" content="Newsletter Confirmed - Scanopy" />
	<meta
		property="og:description"
		content="Your newsletter subscription has been confirmed. Welcome to Scanopy updates."
	/>
	<meta property="og:url" content="https://scanopy.net/newsletter-confirmed" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Newsletter Confirmed - Scanopy" />
	<meta
		name="twitter:description"
		content="Your newsletter subscription has been confirmed. Welcome to Scanopy updates."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />
</svelte:head>

<section class="flex min-h-[60vh] items-center py-20">
	<div class="container mx-auto max-w-2xl px-4 text-center">
		<h1 class="mb-6 text-4xl font-bold text-white">You're subscribed!</h1>
		<p class="mb-8 text-lg text-gray-300">
			Thanks for confirming your subscription. You'll now receive our latest product updates, tips,
			and news straight to your inbox.
		</p>
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href={DEMO_BOOKING_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary"
				onclick={() =>
					analytics.ctaClicked({
						location: 'newsletter_confirmed',
						destination: 'talk_to_sales',
						text: DEMO_CTA_LABEL
					})}>{DEMO_CTA_LABEL}</a
			>
			<LicenseCta location="newsletter_confirmed" class="btn-secondary" />
		</div>
	</div>
</section>
