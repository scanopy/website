<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import type { Vendor, SourceRef, ServiceLevel, OpenSourceStatus } from '$lib/types';

	interface Props {
		scanopy: Vendor;
		vendor: Vendor;
	}

	let { scanopy, vendor }: Props = $props();

	type Sentiment = 'positive' | 'negative' | 'neutral';

	function sentimentClass(s: Sentiment): string {
		return `chip chip-${s}`;
	}

	function hashColor(str: string): { bg: string; fg: string } {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = ((hash % 360) + 360) % 360;
		return {
			bg: `hsla(${hue}, 70%, 55%, 0.15)`,
			fg: `hsl(${hue}, 80%, 75%)`
		};
	}

	function chipStyle(str: string): string {
		const { bg, fg } = hashColor(str);
		return `background: ${bg}; color: ${fg};`;
	}

	const serviceLevels: Record<ServiceLevel, { label: string; sentiment: Sentiment }> = {
		yes: { label: 'Yes', sentiment: 'positive' },
		basic: { label: 'Basic', sentiment: 'neutral' },
		no: { label: 'No', sentiment: 'negative' }
	};

	const osStatuses: Record<OpenSourceStatus, { label: string; sentiment: Sentiment }> = {
		osi: { label: 'OSI', sentiment: 'positive' },
		'source-available': { label: 'Source available', sentiment: 'neutral' },
		no: { label: 'No', sentiment: 'negative' }
	};

	// Short per-view tag labels, matching VendorComparison's viewTags chips.
	const viewOrder: { key: 'l2' | 'l3' | 'workload' | 'application'; label: string }[] = [
		{ key: 'l2', label: 'L2' },
		{ key: 'l3', label: 'L3' },
		{ key: 'workload', label: 'Workload' },
		{ key: 'application', label: 'Application' }
	];

	function sourceRefHtml(refs?: SourceRef[]): string {
		if (!refs) return '';
		return refs.map((r) => ` <a href="#source-${r.id}">[${r.id}]</a>`).join('');
	}
</script>

{#snippet viewTags(col: Vendor)}
	<span class="view-tags">
		{#each viewOrder as view}
			{@const support = col.viewTypes ? col.viewTypes[view.key] : 'no'}
			{#if support === 'yes'}
				<span class="chip chip-positive view-tag" title="{view.label}: supported">{view.label}</span
				>
			{:else if support === 'unclear'}
				<span class="chip chip-unclear view-tag" title="{view.label}: unverified"
					>{view.label} ?</span
				>
			{:else}
				<span class="chip view-tag view-tag-no" title="{view.label}: not supported"
					>{view.label}</span
				>
			{/if}
		{/each}
	</span>
{/snippet}

<div class="table-scroll vendor-table">
	<table style="table-layout: fixed; width: 100%; min-width: 560px;">
		<colgroup>
			<col style="width: 26%;" />
			<col style="width: 37%;" />
			<col style="width: 37%;" />
		</colgroup>
		<thead>
			<tr>
				<th></th>
				<th><a href={scanopy.href}>{scanopy.name}</a></th>
				<th>
					<a
						href={vendor.href}
						{...vendor.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}}
						>{vendor.fullName || vendor.name}</a
					>
				</th>
			</tr>
		</thead>
		<tbody>
			<!-- Discovery -->
			<tr>
				<th scope="row" class="tooltip-header" use:tooltip
					>Discovery<span class="tooltip-content"
						>Protocols used to find devices and map connections</span
					></th
				>
				{#each [scanopy, vendor] as col}
					<td>
						{#if col.discovery.length === 0}
							<span class="chip chip-negative">None</span>
						{:else}
							{#each col.discovery as protocol, i}
								{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(protocol)}>{protocol}</span
								>
							{/each}
						{/if}
						{@html sourceRefHtml(col.discoverySources)}
					</td>
				{/each}
			</tr>

			<!-- Service detection -->
			<tr>
				<th scope="row" class="tooltip-header" use:tooltip
					>Service detection<span class="tooltip-content"
						>Whether the tool fingerprints services per host (databases, web servers, containers)
						beyond simple port detection</span
					></th
				>
				{#each [scanopy, vendor] as col}
					<td>
						<span class={sentimentClass(serviceLevels[col.services.level].sentiment)}
							>{serviceLevels[col.services.level].label}</span
						>
						{#if col.services.detail}
							<span class="cell-detail">{col.services.detail}</span>
						{/if}
						{@html sourceRefHtml(col.services.sources)}
					</td>
				{/each}
			</tr>

			<!-- Network views: one row, four per-view tags per column -->
			<tr>
				<th scope="row" class="tooltip-header" use:tooltip
					>Network Views<span class="tooltip-content"
						>Which topology views the tool produces from discovery.<br /><span
							class="chip chip-positive">L2</span
						>
						Physical switch ports and links<br /><span class="chip chip-positive">L3</span> Subnets,
						VLANs, routing<br /><span class="chip chip-positive">Workload</span> VM/container host
						nesting<br /><span class="chip chip-positive">Application</span> Service-dependency /
						app grouping<br /><br /><span class="chip chip-positive">Yes</span> supported<br /><span
							class="chip chip-unclear">Tag ?</span
						>
						unverified<br /><span class="chip view-tag-no">Greyed</span> not supported</span
					></th
				>
				{#each [scanopy, vendor] as col}
					<td class="view-cell">
						{@render viewTags(col)}{#if col.viewTypes?.note}<div
								class="cell-detail"
								style="margin-top: 0.45rem; line-height: 1.4;"
							>
								{col.viewTypes.note}{@html sourceRefHtml(col.viewTypesSources)}
							</div>{/if}
					</td>
				{/each}
			</tr>

			<!-- Live updates -->
			<tr>
				<th scope="row" class="tooltip-header" use:tooltip
					>Live updates<span class="tooltip-content"
						>Whether the map updates automatically after the initial scan</span
					></th
				>
				{#each [scanopy, vendor] as col}
					<td>
						{#if col.autoUpdates}
							<span class="chip chip-positive">Yes</span>
						{:else}
							<span class="chip chip-negative">No</span>
						{/if}
					</td>
				{/each}
			</tr>

			<!-- Open source -->
			<tr>
				<th scope="row" class="tooltip-header" use:tooltip
					>Open source<span class="tooltip-content"
						>OSI means an OSI-approved open-source license; Source available means restricted; No
						means proprietary</span
					></th
				>
				{#each [scanopy, vendor] as col}
					<td>
						{#if col.openSource.href}
							<a href={col.openSource.href}
								><span class={sentimentClass(osStatuses[col.openSource.status].sentiment)}
									>{osStatuses[col.openSource.status].label}</span
								></a
							>
						{:else}
							<span class={sentimentClass(osStatuses[col.openSource.status].sentiment)}
								>{osStatuses[col.openSource.status].label}</span
							>
						{/if}
						{#if col.openSource.license}
							<span class="cell-detail">{col.openSource.license}</span>
						{/if}
					</td>
				{/each}
			</tr>

			<!-- Pricing -->
			<tr>
				<th scope="row" class="tooltip-header" use:tooltip
					>Pricing<span class="tooltip-content">Starting price or pricing model</span></th
				>
				{#each [scanopy, vendor] as col}
					<td>
						{#if col.pricing.href}
							<a href={col.pricing.href}>{col.pricing.text}</a>
						{:else}
							{col.pricing.text}
						{/if}
						{@html sourceRefHtml(col.pricing.sources)}
					</td>
				{/each}
			</tr>

			<!-- Also includes -->
			<tr>
				<th scope="row" class="tooltip-header" use:tooltip
					>Also includes<span class="tooltip-content">Capabilities beyond network diagramming</span
					></th
				>
				{#each [scanopy, vendor] as col}
					<td>
						{#if col.alsoIncludes && col.alsoIncludes.length}
							{#each col.alsoIncludes as cap, i}
								{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(cap)}>{cap}</span>
							{/each}
						{:else}
							<span class="cell-detail">—</span>
						{/if}
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
</div>
