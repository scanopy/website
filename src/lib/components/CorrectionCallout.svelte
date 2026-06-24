<script lang="ts">
	import { Info } from 'lucide-svelte';
</script>

<aside class="correction-callout" aria-label="Corrections">
	<Info class="callout-icon" aria-hidden="true" />
	<p>
		Spot something inaccurate or out of date? Email
		<a href="mailto:marketing@scanopy.net">marketing@scanopy.net</a> and we'll fix it.
	</p>
</aside>

<style>
	.correction-callout {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		margin: 0 0 1.5rem;
		padding: 0.625rem 0.875rem;
		border: 1px solid rgb(55 65 81);
		border-left: 3px solid rgb(59 130 246);
		border-radius: 0.375rem;
		background: rgb(31 41 55 / 0.5);
	}

	.correction-callout :global(.callout-icon) {
		flex-shrink: 0;
		width: 1rem;
		height: 1rem;
		margin-top: 0.15rem;
		color: rgb(96 165 250);
	}

	.correction-callout p {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: rgb(156 163 175);
	}

	.correction-callout a {
		color: rgb(96 165 250);
	}

	.correction-callout a:hover {
		color: rgb(147 197 253);
	}
</style>
