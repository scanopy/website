<script lang="ts">
	import { marked } from 'marked';
	import { tooltip } from '$lib/actions/tooltip';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import type {
		Vendor,
		VendorCategory,
		VendorSource,
		DiscoveryMethod,
		SourceRef
	} from '$lib/types';

	interface Props {
		mode: 'tables' | 'detail' | 'sources' | 'inline';
		categories?: VendorCategory[];
		vendors?: Record<string, Vendor>;
		disclosureText?: string;
		section?: VendorCategory;
		honorableMentions?: string;
		sources?: VendorSource[];
		vendorSlugs?: string[];
		columns?: string[];
	}

	let {
		mode,
		categories,
		vendors,
		disclosureText,
		section,
		honorableMentions,
		sources,
		vendorSlugs,
		columns
	}: Props = $props();

	// Column set + widths for the main categorized comparison table (now rendered via the
	// shared ComparisonTable). Matches the previous hardcoded layout exactly.
	const MAIN_COLUMNS = [
		'name',
		'discovery',
		'viewTypes',
		'environments',
		'services',
		'autoUpdates',
		'openSource',
		'pricing',
		'alsoIncludes'
	];
	const MAIN_COL_WIDTHS = [
		'115px',
		'120px',
		'180px',
		'120px',
		'110px',
		'110px',
		'110px',
		'130px',
		'110px'
	];

	const columnHeaders: Record<string, string> = {
		name: 'Tool',
		discovery: 'Discovery',
		services: 'Services',
		autoUpdates: 'Live Updates',
		openSource: 'Open Source',
		pricing: 'Pricing',
		alsoIncludes: 'Also Includes',
		bestFor: 'Best for',
		deployment: 'Deployment',
		viewTypes: 'Network Views'
	};

	function v(slug: string): Vendor {
		return vendors![slug];
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

	const viewOrder: { key: 'l2' | 'l3' | 'workload' | 'application'; label: string }[] = [
		{ key: 'l2', label: 'L2' },
		{ key: 'l3', label: 'L3' },
		{ key: 'workload', label: 'Workload' },
		{ key: 'application', label: 'Application' }
	];

	function osInfo(status: string) {
		return osStatuses[status] || osStatuses.no;
	}

	function md(text: string): string {
		const html = marked.parseInline(text) as string;
		// External (http) reference links open in a new tab.
		return html.replace(
			/<a href="(https?:\/\/[^"]+)"/g,
			'<a href="$1" target="_blank" rel="noopener noreferrer"'
		);
	}

	function sourceRefHtml(refs: SourceRef[]): string {
		return refs.map((r) => ` <a href="#source-${r.id}">[${r.id}]</a>`).join('');
	}

	function isExternal(href: string): boolean {
		return href.startsWith('http');
	}

	function slugify(text: string): string {
		return text
			.replace(/<[^>]*>/g, '')
			.replace(/\(.*?\)/g, '')
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+$/, '');
	}

	function discoveryText(vendor: Vendor): string {
		const protocols = vendor.discovery.map((p) => p).join(', ');
		if (!vendor.discoveryNotes) return protocols || 'None.';
		if (protocols) return `${protocols}. ${vendor.discoveryNotes}`;
		return vendor.discoveryNotes;
	}

	function pricingText(vendor: Vendor): string {
		const base = vendor.pricing.href
			? `[${vendor.pricing.text}](${vendor.pricing.href})`
			: vendor.pricing.text;
		if (!vendor.pricingNotes) return `${base}.`;
		return `${base}. ${vendor.pricingNotes}`;
	}

	function viewTypesText(vendor: Vendor): string | null {
		if (!vendor.viewTypes) return null;
		// Coverage (which views) is shown by the table's Network Views chips; this detail line
		// carries only the per-vendor nuance note plus citations, to avoid restating coverage.
		if (!vendor.viewTypes.note) return null;
		let text = vendor.viewTypes.note;
		if (vendor.viewTypesSources) text += sourceRefHtml(vendor.viewTypesSources);
		return text;
	}

	function detailFields(vendor: Vendor): { label: string; content: string }[] {
		const fields: { label: string; content: string }[] = [];
		if (vendor.bestFor) {
			fields.push({ label: 'Best for', content: vendor.bestFor });
		}
		fields.push({ label: 'Discovery', content: discoveryText(vendor) });
		const vt = viewTypesText(vendor);
		if (vt) {
			fields.push({ label: 'Network views', content: vt });
		}
		if (vendor.integrations) {
			fields.push({ label: 'Integrations', content: vendor.integrations });
		}
		if (vendor.serviceDiscovery) {
			fields.push({ label: 'Service discovery', content: vendor.serviceDiscovery });
		}
		if (vendor.diagrams) {
			fields.push({ label: 'Diagrams', content: vendor.diagrams });
		}
		fields.push({ label: 'Pricing', content: pricingText(vendor) });
		if (vendor.deploymentNotes) {
			fields.push({ label: 'Deployment', content: vendor.deploymentNotes });
		}
		if (vendor.whereItFits) {
			fields.push({ label: 'Where it fits', content: vendor.whereItFits });
		}
		if (vendor.tradeOff) {
			fields.push({ label: vendor.tradeOffLabel || 'Trade-off', content: vendor.tradeOff });
		}
		return fields;
	}
</script>

{#snippet viewTags(vendor: Vendor)}
	{#if vendor.viewTypes}
		<span class="view-tags">
			{#each viewOrder as view, i}
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
		{#if vendor.cloudDiscovery?.sources}
			{@html sourceRefHtml(vendor.cloudDiscovery.sources)}
		{/if}
	{:else}
		<span class="cell-detail" title="No discovery">—</span>
	{/if}
{/snippet}

{#if mode === 'tables' && categories && vendors}
	<ComparisonTable
		{vendors}
		orientation="column"
		columns={MAIN_COLUMNS}
		colWidths={MAIN_COL_WIDTHS}
		minWidth="990px"
		groups={categories.map((c) => ({ heading: c.heading, vendorSlugs: c.vendors }))}
	/>

	{#if disclosureText}
		<p>{disclosureText}</p>
	{/if}
{/if}

{#if mode === 'detail' && section && vendors}
	<h2 id={slugify(section.heading)}>{section.heading}</h2>

	{#if section.intro}
		<p>{@html md(section.intro)}</p>
	{/if}

	{#each section.vendors as slug}
		{@const vendor = v(slug)}
		<h3 id={slugify(vendor.fullName || vendor.name)}>
			<a
				href={vendor.href}
				{...isExternal(vendor.href) ? { target: '_blank', rel: 'noopener' } : {}}
				>{vendor.fullName || vendor.name}</a
			>
		</h3>

		<p>{@html md(vendor.description)}</p>

		{#each detailFields(vendor) as field}
			<p><strong>{field.label}:</strong> {@html md(field.content)}</p>
		{/each}

		{#if vendor.iframe}
			<iframe
				src={vendor.iframe.src}
				width={vendor.iframe.width}
				height={vendor.iframe.height}
				frameborder="0"
				style="border: 1px solid #374151; border-radius: 8px;"
				title={vendor.name}
			></iframe>
			<p>{vendor.iframe.caption}</p>
		{/if}
	{/each}

	{#if honorableMentions}
		<h3 id="honorable-mentions">Honorable mentions</h3>
		<p>{@html md(honorableMentions)}</p>
	{/if}
{/if}

{#if mode === 'inline' && vendorSlugs && vendors && columns}
	<div class="table-scroll vendor-table">
		<table>
			<thead>
				<tr>
					{#each columns as col}
						<th>{columnHeaders[col] || col}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each vendorSlugs as slug}
					{@const vendor = v(slug)}
					<tr>
						{#each columns as col}
							{#if col === 'name'}
								<td
									><a
										href={vendor.href}
										{...isExternal(vendor.href) ? { target: '_blank', rel: 'noopener' } : {}}
										>{vendor.name}</a
									></td
								>
							{:else if col === 'discovery'}
								<td>
									{#if vendor.discovery.length === 0}
										<span class="chip chip-negative">None</span>
									{:else}
										{#each vendor.discovery as protocol, i}
											{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(protocol)}
												>{protocol}</span
											>
										{/each}
									{/if}
								</td>
							{:else if col === 'services'}
								<td>
									{#if vendor.services.detail && vendor.services.detailHref}
										<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}
											>{serviceInfo(vendor.services.level).label}</span
										><a href={vendor.services.detailHref} class="cell-detail"
											>{vendor.services.detail}</a
										>
									{:else if vendor.services.detail}
										<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}
											>{serviceInfo(vendor.services.level).label}</span
										><span class="cell-detail">{vendor.services.detail}</span>
									{:else}
										<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}
											>{serviceInfo(vendor.services.level).label}</span
										>
									{/if}
								</td>
							{:else if col === 'autoUpdates'}
								<td>
									{#if vendor.autoUpdates}
										<span class="chip chip-positive">Yes</span>
									{:else}
										<span class="chip chip-negative">No</span>
									{/if}
								</td>
							{:else if col === 'openSource'}
								<td>
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
									{#if vendor.openSource.license}
										<span class="cell-detail">{vendor.openSource.license}</span>
									{/if}
								</td>
							{:else if col === 'pricing'}
								<td>
									{#if vendor.pricing.href}
										<a href={vendor.pricing.href}>{vendor.pricing.text}</a>
									{:else}
										{vendor.pricing.text}
									{/if}
								</td>
							{:else if col === 'alsoIncludes'}
								<td>
									{#if vendor.alsoIncludes}
										{#each vendor.alsoIncludes as cap, i}
											{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(cap)}>{cap}</span>
										{/each}
									{/if}
								</td>
							{:else if col === 'viewTypes'}
								<td>{@render viewTags(vendor)}</td>
							{:else if col === 'bestFor'}
								<td>{vendor.bestFor || ''}</td>
							{:else if col === 'deployment'}
								<td>{vendor.deployment?.join(', ') || ''}</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p style="font-size: 0.8125rem; color: rgb(156 163 175);">
		For a detailed comparison of these and other tools, see our <a
			href="/comparisons/best-automated-network-diagram-tools"
			>full comparison of automated network diagram tools</a
		>.
	</p>
{/if}

{#if mode === 'sources' && sources}
	<div style="font-size: 0.8125rem; line-height: 1.8; color: rgb(156 163 175);">
		{#each sources as source}
			<span id="source-{source.id}">[{source.id}]</span>
			<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><br />
		{/each}
	</div>
{/if}
