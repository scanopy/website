<script lang="ts">
	import { marked } from 'marked';
	import { tooltip } from '$lib/actions/tooltip';
	import { theme, withTheme } from '$lib/theme.svelte';
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

	function v(slug: string): Vendor {
		return vendors![slug];
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
				src={withTheme(vendor.iframe.src, theme.resolved)}
				width={vendor.iframe.width}
				height={vendor.iframe.height}
				frameborder="0"
				style="border: 1px solid rgb(var(--c-gray-700)); border-radius: 8px;"
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
	<ComparisonTable orientation="column" {vendors} {vendorSlugs} {columns} showSources={false} />
	<p style="font-size: 0.8125rem; color: rgb(var(--c-gray-400));">
		For a detailed comparison of these and other tools, see our <a
			href="/comparisons/best-automated-network-diagram-tools"
			>full network diagram tools comparison</a
		>.
	</p>
{/if}

{#if mode === 'sources' && sources}
	<div style="font-size: 0.8125rem; line-height: 1.8; color: rgb(var(--c-gray-400));">
		{#each sources as source}
			<span id="source-{source.id}">[{source.id}]</span>
			<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><br />
		{/each}
	</div>
{/if}
