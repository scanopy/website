<script lang="ts">
	// The canonical "ways Scanopy shares network-topology evidence with auditors" block, shared
	// across the compliance guides via the `<!-- evidence-exports -->` marker so the product-capability
	// description (exports, embed, shared link, snapshots) lives in one place and stays in sync with
	// the product instead of being retyped and drifting per guide. The export format list mirrors
	// src/lib/fixtures/features.json (the source of truth). Per CLAUDE.md, exports, embed, and share
	// are always described together; snapshots is the distinct over-time record.
	//
	// One data source, two layouts: `prose` (default) for the guides' evidence sections, `cards` for
	// the /solutions/compliance landing page.

	let { layout = 'prose' }: { layout?: 'prose' | 'cards' } = $props();

	type Method = { title: string; what: string; auditorUse: string; overTime?: boolean };

	const methods: Method[] = [
		{
			title: 'Export the map',
			what: 'A static copy: an image (PNG, SVG, PDF), a self-contained HTML page, wiki markup (Mermaid, Confluence), or CSV of the underlying host and service data.',
			auditorUse: 'Drop the current diagram straight into a compliance document or evidence pack.'
		},
		{
			title: 'Embed the live map',
			what: 'An iframe that puts the live map inside a wiki, dashboard, or intranet page.',
			auditorUse: 'The page an auditor opens shows the current topology, not a stale attachment.'
		},
		{
			title: 'Share a read-only link',
			what: 'A link to the live map, read-only, that stays current as the network rescans.',
			auditorUse: 'Give an auditor a view without exporting or emailing anything.'
		},
		{
			title: 'Save a dated snapshot',
			what: 'A saved, dated capture of the network state, taken at each audit or review.',
			auditorUse:
				'Show what the network looked like on a date and what changed since: the record that the documentation is maintained, not reconstructed for the assessment.',
			overTime: true
		}
	];

	const current = methods.filter((m) => !m.overTime);
	const snapshot = methods.find((m) => m.overTime);
</script>

{#if layout === 'cards'}
	<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
		{#each methods as m (m.title)}
			<div class="card flex flex-col p-6">
				<span class="text-lg font-semibold text-white">{m.title}</span>
				<span class="mt-3 leading-relaxed text-gray-400">{m.what}</span>
				<span class="mt-3 text-sm leading-relaxed text-gray-500">{m.auditorUse}</span>
			</div>
		{/each}
	</div>
{:else}
	<p>Scanopy gets the current map out three ways:</p>
	<ul>
		{#each current as m (m.title)}
			<li><strong>{m.title}.</strong> {m.what} {m.auditorUse}</li>
		{/each}
	</ul>
	{#if snapshot}
		<p>
			Those show the network as it is now. Auditors and authorities also ask whether it is kept
			current over time. <strong>{snapshot.title}:</strong>
			{snapshot.what}
			{snapshot.auditorUse}
		</p>
	{/if}
{/if}
