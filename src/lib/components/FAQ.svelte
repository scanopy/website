<script lang="ts">
	interface FAQItem {
		question: string;
		answer: string;
	}

	interface Props {
		faqs: FAQItem[];
	}

	let { faqs }: Props = $props();
</script>

<div class="space-y-4">
	{#each faqs as faq}
		<details class="group rounded-lg border border-gray-800 bg-gray-900/50 px-6 py-4">
			<summary class="cursor-pointer text-lg font-semibold text-white select-none group-open:mb-3">
				{faq.question}
			</summary>
			<p class="text-gray-300 leading-relaxed">{faq.answer}</p>
		</details>
	{/each}
</div>
