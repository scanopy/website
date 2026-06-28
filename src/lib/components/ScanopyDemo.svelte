<script lang="ts">
	// Live, interactive Scanopy map embed — the same demo the blog posts and the main
	// comparison page (Scanopy detail card) use, so visitors can see the product produce a
	// real topology map rather than just reading about it. Lazy-loaded to keep it off the
	// critical path. The embed follows the site theme via the app's ?theme= param.
	import { theme, withTheme } from '$lib/theme.svelte';

	const baseSrc = 'https://demo.scanopy.net/share/a1b2c3d4-e5f6-7890-abcd-ef1234567890/embed';
</script>

<figure class="my-8">
	<div class="overflow-hidden rounded-lg border border-gray-700">
		<iframe
			src={withTheme(baseSrc, theme.resolved)}
			title="Live Scanopy network topology map"
			loading="lazy"
			class="block h-[460px] w-full"
		></iframe>
	</div>
	<figcaption class="mt-3 text-sm text-gray-400">
		This is a live Scanopy map you can interact with.
	</figcaption>
</figure>
