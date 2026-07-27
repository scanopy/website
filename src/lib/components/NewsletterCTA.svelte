<script lang="ts">
	import NewsletterSignup from './NewsletterSignup.svelte';
	import { PUBLIC_BREVO_NEWSLETTER_FORM_URL } from '$env/static/public';

	interface Props {
		heading?: string;
	}

	let { heading = 'Get notified when we publish new posts' }: Props = $props();
</script>

{#if PUBLIC_BREVO_NEWSLETTER_FORM_URL}
	<div class="mt-16 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
		<h3 class="mb-2 text-lg font-semibold text-white">{heading}</h3>
		<p class="mb-4 text-sm text-gray-400">
			Network documentation tips, product updates, and the occasional deep dive.
		</p>
		<NewsletterSignup formUrl={PUBLIC_BREVO_NEWSLETTER_FORM_URL} />
	</div>
{/if}
