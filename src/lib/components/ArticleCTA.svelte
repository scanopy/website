<script lang="ts">
	interface Props {
		heading?: string;
		description?: string;
	}

	let {
		heading = 'Try Scanopy',
		description = 'Scanopy deploys a lightweight daemon that discovers your network and builds a live topology map. No per-device fees, unlimited hosts. It pairs with whatever monitoring tool you already use.'
	}: Props = $props();
</script>

<div class="mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
	<h3 class="mb-3 text-lg font-semibold text-white">{heading}</h3>
	<p class="mb-5 text-sm text-gray-400 leading-relaxed">{description}</p>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<a href="https://app.scanopy.net/onboarding" target="_blank" rel="noopener noreferrer" class="btn-primary">Try Scanopy free</a>
		<a href="/pricing" class="text-gray-400 hover:text-white transition-colors">View pricing</a>
		<a href="/docs" class="text-gray-400 hover:text-white transition-colors">Read the docs</a>
	</div>
</div>
