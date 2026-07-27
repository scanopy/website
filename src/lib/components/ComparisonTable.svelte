<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { COLUMN_DEFS } from '$lib/compare/table-columns';
	import { theme } from '$lib/theme.svelte';
	import type { Vendor, SourceRef } from '$lib/types';

	interface Group {
		heading: string;
		vendorSlugs: string[];
	}

	interface Props {
		vendors: Record<string, Vendor>;
		/** Flat list of vendor slugs (ignored when `groups` is set). */
		vendorSlugs?: string[];
		/** Category-grouped vendors (column orientation only); renders heading separator rows. */
		groups?: Group[];
		/** Attribute keys to render, in order. In row orientation a `name` entry is ignored
		 *  (vendor names become the column headers). */
		columns: string[];
		orientation?: 'column' | 'row';
		minWidth?: string;
		colWidths?: string[];
		/** Emit citation `[n]` links (they anchor to a `#source-n` list). Turn off on pages
		 *  that render the table without a sources section (e.g. the blog inline table). */
		showSources?: boolean;
	}

	let {
		vendors,
		vendorSlugs = [],
		groups,
		columns,
		orientation = 'column',
		minWidth,
		colWidths,
		showSources = true
	}: Props = $props();

	type Sentiment = 'positive' | 'negative' | 'neutral';

	function sentimentClass(s: Sentiment): string {
		return `chip chip-${s}`;
	}

	const serviceLevels: Record<string, { label: string; sentiment: Sentiment }> = {
		yes: { label: 'Yes', sentiment: 'positive' },
		basic: { label: 'Basic', sentiment: 'neutral' },
		no: { label: 'No', sentiment: 'negative' }
	};
	const osStatuses: Record<string, { label: string; sentiment: Sentiment }> = {
		osi: { label: 'OSI', sentiment: 'positive' },
		'source-available': { label: 'Source available', sentiment: 'neutral' },
		no: { label: 'No', sentiment: 'negative' }
	};
	function serviceInfo(level: string) {
		return serviceLevels[level] || serviceLevels.no;
	}
	function osInfo(status: string) {
		return osStatuses[status] || osStatuses.no;
	}

	const viewOrder: { key: 'l2' | 'l3' | 'workload' | 'application'; label: string }[] = [
		{ key: 'l2', label: 'L2' },
		{ key: 'l3', label: 'L3' },
		{ key: 'workload', label: 'Workload' },
		{ key: 'application', label: 'Application' }
	];

	function hashColor(str: string): { bg: string; fg: string } {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = ((hash % 360) + 360) % 360;
		// Light text on a translucent tint reads on dark; on light we need the inverse
		// a darker, more saturated label on a slightly stronger tint.
		return theme.resolved === 'dark'
			? { bg: `hsla(${hue}, 70%, 55%, 0.15)`, fg: `hsl(${hue}, 80%, 75%)` }
			: { bg: `hsla(${hue}, 70%, 45%, 0.14)`, fg: `hsl(${hue}, 70%, 32%)` };
	}
	function chipStyle(str: string): string {
		const { bg, fg } = hashColor(str);
		return `background: ${bg}; color: ${fg};`;
	}

	function sourceRefHtml(refs?: SourceRef[]): string {
		if (!refs) return '';
		return refs.map((r) => ` <a href="#source-${r.id}">[${r.id}]</a>`).join('');
	}

	function isExternal(href: string): boolean {
		return href.startsWith('http');
	}

	function v(slug: string): Vendor {
		return vendors[slug];
	}

	// Header column set (column orientation) and the per-attribute rows (row orientation,
	// vendor names become the headers so `name` is dropped).
	const attrColumns = $derived(columns.filter((c) => c !== 'name'));
	const flatGroups = $derived<Group[]>(groups ?? [{ heading: '', vendorSlugs }]);
	const rowVendorSlugs = $derived(groups ? groups.flatMap((g) => g.vendorSlugs) : vendorSlugs);
	const colSpan = $derived(columns.length);
</script>

{#snippet viewTags(vendor: Vendor)}
	{#if vendor.viewTypes}
		<span class="view-tags">
			{#each viewOrder as view}
				{@const support = vendor.viewTypes[view.key]}
				{#if support === 'yes'}
					<span class="chip chip-positive view-tag" title="{view.label}: supported"
						>{view.label}</span
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
	{/if}
{/snippet}

{#snippet environmentsCell(vendor: Vendor)}
	{@const onPrem = vendor.discovery.length > 0}
	{@const clouds = vendor.cloudDiscovery?.clouds ?? []}
	{#if onPrem || clouds.length}
		<span class="env-tags">
			{#if onPrem}
				<span class="chip env-tag" title="Discovers on-prem networks">On-prem</span>
			{/if}
			{#each clouds as cloud}
				<span class="chip env-tag" title="Discovers {cloud}">{cloud}</span>
			{/each}
		</span>
		{#if showSources && vendor.cloudDiscovery?.sources}{@html sourceRefHtml(
				vendor.cloudDiscovery.sources
			)}{/if}
	{:else}
		<span class="cell-detail" title="No discovery">—</span>
	{/if}
{/snippet}

{#snippet cell(vendor: Vendor, col: string)}
	{#if col === 'name'}
		<a href={vendor.href} {...isExternal(vendor.href) ? { target: '_blank', rel: 'noopener' } : {}}
			>{vendor.name}</a
		>
	{:else if col === 'discovery'}
		{#if vendor.discovery.length === 0}
			<span class="chip chip-negative">No</span>
		{:else}
			{#each vendor.discovery as protocol, i}
				{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(protocol)}>{protocol}</span>
			{/each}
		{/if}
		{#if showSources && vendor.discoverySources}{@html sourceRefHtml(vendor.discoverySources)}{/if}
	{:else if col === 'viewTypes'}
		{@render viewTags(vendor)}{#if orientation === 'row' && vendor.viewTypes?.note}<div
				class="cell-detail"
				style="margin-top: 0.45rem; line-height: 1.4;"
			>
				{vendor.viewTypes.note}{#if showSources}{@html sourceRefHtml(vendor.viewTypesSources)}{/if}
			</div>{/if}
	{:else if col === 'environments'}
		{@render environmentsCell(vendor)}
	{:else if col === 'services'}
		{#if vendor.services.detail && vendor.services.detailHref}
			<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}
				>{serviceInfo(vendor.services.level).label}</span
			><a href={vendor.services.detailHref} class="cell-detail">{vendor.services.detail}</a>
		{:else if vendor.services.detail}
			<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}
				>{serviceInfo(vendor.services.level).label}</span
			><span class="cell-detail">{vendor.services.detail}</span>
		{:else}
			<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}
				>{serviceInfo(vendor.services.level).label}</span
			>
		{/if}
		{#if showSources && vendor.services.sources}{@html sourceRefHtml(vendor.services.sources)}{/if}
	{:else if col === 'autoUpdates'}
		{#if vendor.autoUpdates}
			<span class="chip chip-positive">Yes</span>
		{:else}
			<span class="chip chip-negative">No</span>
		{/if}
	{:else if col === 'openSource'}
		{#if vendor.openSource.href}
			<a href={vendor.openSource.href}
				><span class={sentimentClass(osInfo(vendor.openSource.status).sentiment)}
					>{osInfo(vendor.openSource.status).label}</span
				></a
			>
		{:else}
			<span class={sentimentClass(osInfo(vendor.openSource.status).sentiment)}
				>{osInfo(vendor.openSource.status).label}</span
			>
		{/if}
		{#if vendor.openSource.license}<span class="cell-detail">{vendor.openSource.license}</span>{/if}
	{:else if col === 'pricing'}
		{#if vendor.pricing.href}
			<a href={vendor.pricing.href}>{vendor.pricing.text}</a>
		{:else}
			{vendor.pricing.text}
		{/if}
		{#if showSources && vendor.pricing.sources}{@html sourceRefHtml(vendor.pricing.sources)}{/if}
	{:else if col === 'alsoIncludes'}
		{#if vendor.alsoIncludes && vendor.alsoIncludes.length}
			{#each vendor.alsoIncludes as cap, i}
				{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(cap)}>{cap}</span>
			{/each}
		{:else}
			<span class="cell-detail">—</span>
		{/if}
	{:else if col === 'bestFor'}
		{vendor.bestFor || ''}
	{:else if col === 'deployment'}
		{vendor.deployment?.join(', ') || ''}
	{/if}
{/snippet}

<div class="table-scroll vendor-table">
	{#if orientation === 'row'}
		<table style="table-layout: fixed; width: 100%;{minWidth ? ` min-width: ${minWidth};` : ''}">
			{#if colWidths}
				<colgroup>
					{#each colWidths as w}<col style="width: {w};" />{/each}
				</colgroup>
			{/if}
			<thead>
				<tr>
					<th></th>
					{#each rowVendorSlugs as slug}
						{@const vendor = v(slug)}
						<th
							><a
								href={vendor.href}
								{...isExternal(vendor.href) ? { target: '_blank', rel: 'noopener' } : {}}
								>{vendor.fullName || vendor.name}</a
							></th
						>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each attrColumns as col}
					<tr>
						<th scope="row" class="tooltip-header" use:tooltip
							>{COLUMN_DEFS[col].label}<span class="tooltip-content"
								>{@html COLUMN_DEFS[col].tooltip}</span
							></th
						>
						{#each rowVendorSlugs as slug}
							<td class={col === 'viewTypes' ? 'view-cell' : ''}>{@render cell(v(slug), col)}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<table style="table-layout: fixed;{minWidth ? ` min-width: ${minWidth};` : ''}">
			{#if colWidths}
				<colgroup>
					{#each colWidths as w}<col style="width: {w};" />{/each}
				</colgroup>
			{/if}
			<thead>
				<tr>
					{#each columns as col}
						<th class="tooltip-header" use:tooltip
							>{COLUMN_DEFS[col].label}<span class="tooltip-content"
								>{@html COLUMN_DEFS[col].tooltip}</span
							></th
						>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each flatGroups as group}
					{#if group.heading}
						<tr class="category-row"><td colspan={colSpan}>{group.heading}</td></tr>
					{/if}
					{#each group.vendorSlugs as slug}
						{@const vendor = v(slug)}
						<tr>
							{#each columns as col}
								<td class={col === 'viewTypes' ? 'view-cell' : ''}>{@render cell(vendor, col)}</td>
							{/each}
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	/* Self-contained comparison-table styling so the table renders identically on any host
	   page (the alternatives pages don't define these). Element styles are scoped to the
	   .vendor-table wrapper; the hover tooltip is portaled to <body> by `use:tooltip`, so its
	   styles must be global. */
	:global(.table-scroll) {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-x: contain;
	}

	:global(.vendor-table th) {
		background-color: rgb(var(--c-gray-800));
		padding: 0.375rem 0.5rem;
		text-align: left;
		font-weight: 600;
		color: rgb(var(--c-gray-200));
		border: 1px solid rgb(var(--c-gray-700));
		vertical-align: top;
		overflow-wrap: break-word;
	}

	:global(.vendor-table td) {
		padding: 0.375rem 0.5rem;
		color: rgb(var(--c-gray-300));
		border: 1px solid rgb(var(--c-gray-700));
		vertical-align: top;
		overflow-wrap: break-word;
	}

	@media (min-width: 640px) {
		:global(.vendor-table th),
		:global(.vendor-table td) {
			padding: 0.5rem 0.75rem;
		}
	}

	:global(.vendor-table .view-cell) {
		text-align: center;
	}

	:global(.vendor-table .category-row td) {
		background: rgb(var(--c-gray-900));
		font-weight: 700;
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: rgb(var(--c-gray-400));
		padding: 0.625rem 0.75rem;
		border-left: none;
		border-right: none;
	}

	:global(.vendor-table .chip) {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.5;
		white-space: nowrap;
	}

	:global(.vendor-table .chip-positive) {
		background: rgba(34, 197, 94, 0.15);
		color: rgb(var(--c-green-400));
	}

	:global(.vendor-table .chip-negative) {
		background: rgba(239, 68, 68, 0.15);
		color: rgb(var(--c-red-400));
	}

	:global(.vendor-table .chip-neutral) {
		background: rgba(245, 158, 11, 0.15);
		color: rgb(var(--c-amber-400));
	}

	:global(.vendor-table .chip-unclear) {
		background: rgb(var(--c-gray-400) / 0.12);
		color: rgb(var(--c-gray-400));
		border: 1px dashed rgb(var(--c-gray-400) / 0.5);
	}

	:global(.vendor-table .view-tags),
	:global(.vendor-table .env-tags) {
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem;
	}

	:global(.vendor-table .view-tag) {
		font-size: 0.6875rem;
		padding: 0.0625rem 0.375rem;
	}

	:global(.vendor-table .view-tag-no) {
		background: rgb(var(--c-gray-600) / 0.18);
		color: rgb(var(--c-gray-500));
		text-decoration: line-through;
		text-decoration-color: rgb(var(--c-gray-500) / 0.6);
	}

	:global(.vendor-table .env-tag) {
		background: rgb(var(--c-gray-400) / 0.14);
		color: rgb(var(--c-gray-300));
		font-size: 0.6875rem;
		padding: 0.0625rem 0.375rem;
	}

	:global(.vendor-table .cell-detail) {
		display: block;
		font-size: 0.75rem;
		color: rgb(var(--c-gray-400));
		margin-top: 0.25rem;
	}

	:global(.vendor-table a.cell-detail),
	:global(.vendor-table .cell-detail a) {
		color: rgb(var(--c-blue-400));
	}

	/* Dotted-underline header that reveals a portaled tooltip on hover. The inline
	   .tooltip-content stays hidden; `use:tooltip` clones it into a fixed-position
	   .tooltip-portal on <body>. */
	:global(.tooltip-header) {
		position: relative;
		cursor: help;
		text-decoration: underline dotted rgb(var(--c-gray-400) / 0.5);
		text-underline-offset: 3px;
	}

	:global(.tooltip-content) {
		display: none;
	}

	:global(.tooltip-portal) {
		padding: 0.75rem 1rem;
		background: rgb(var(--c-gray-800));
		border: 1px solid rgb(var(--c-gray-700));
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 400;
		color: rgb(var(--c-gray-300));
		line-height: 2;
		z-index: 50;
		pointer-events: none;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
	}

	:global(.tooltip-portal .chip) {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.5;
		white-space: nowrap;
	}

	:global(.tooltip-portal .chip-positive) {
		background: rgba(34, 197, 94, 0.15);
		color: rgb(var(--c-green-400));
	}

	:global(.tooltip-portal .chip-negative) {
		background: rgba(239, 68, 68, 0.15);
		color: rgb(var(--c-red-400));
	}

	:global(.tooltip-portal .chip-neutral) {
		background: rgba(245, 158, 11, 0.15);
		color: rgb(var(--c-amber-400));
	}

	:global(.tooltip-portal .chip-unclear) {
		background: rgb(var(--c-gray-400) / 0.12);
		color: rgb(var(--c-gray-400));
		border: 1px dashed rgb(var(--c-gray-400) / 0.5);
	}

	:global(.tooltip-portal .view-tag-no) {
		background: rgb(var(--c-gray-600) / 0.18);
		color: rgb(var(--c-gray-500));
		text-decoration: line-through;
		text-decoration-color: rgb(var(--c-gray-500) / 0.6);
	}
</style>
