<script lang="ts">
	// The four things a buyer evaluates before committing: where it runs, how it is billed, how
	// the bill behaves as the network grows, and what the licence lets them do. Shared across the
	// solution pages so the deployment and pricing claims stay in one place.
	//
	// Deployment wording is load-bearing: Cloud and SelfHosted are both real (billing-plans.json),
	// so nothing here may describe self-hosting as the only option, and "the data never leaves your
	// network" is true of the self-hosted deployment specifically, not of Scanopy generally.
	//
	// Follows the EvidenceExports convention: this renders the cards, the page supplies the heading.

	const terms = [
		{
			name: 'Cloud or self-hosted',
			blurb:
				'Run it managed by us, or entirely on your own infrastructure, where the discovery data and credentials stay inside your perimeter with no outbound internet access at all.',
			href: '/security',
			linkText: 'Security and subprocessors'
		},
		{
			name: 'Billed on its own',
			blurb:
				'Scanopy is priced separately from the tools it sits beside, so your documentation is not bundled into a monitoring or asset contract.',
			href: '/comparisons/best-automated-network-diagram-tools',
			linkText: 'Compare tools'
		},
		{
			name: 'The price does not move with host count',
			blurb:
				'Discovering more hosts does not raise the bill, so documenting the whole network costs the same as documenting part of it.',
			href: '/pricing',
			linkText: 'Pricing'
		},
		{
			name: 'Open source core',
			blurb:
				'Community Edition is AGPL-3.0, so you can read the code before you run it on your network. Free, capped at one seat and one network.',
			href: '/community',
			linkText: 'Community Edition'
		}
	];
</script>

<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
	{#each terms as t (t.name)}
		<div class="card flex flex-col p-6">
			<span class="text-lg font-semibold text-white">{t.name}</span>
			<span class="mt-3 leading-relaxed text-gray-400">{t.blurb}</span>
			<a href={t.href} class="mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300"
				>{t.linkText} &rarr;</a
			>
		</div>
	{/each}
</div>
