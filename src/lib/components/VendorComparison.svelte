<script lang="ts">
	import { marked } from 'marked';
	import type {
		Vendor,
		VendorCategory,
		VendorSource,
		DiscoveryMethod,
		SourceRef
	} from '$lib/types';

	interface Props {
		mode: 'tables' | 'detail' | 'sources';
		categories?: VendorCategory[];
		vendors?: Record<string, Vendor>;
		disclosureText?: string;
		section?: VendorCategory;
		honorableMentions?: string;
		sources?: VendorSource[];
	}

	let { mode, categories, vendors, disclosureText, section, honorableMentions, sources }: Props =
		$props();

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

	function osInfo(status: string) {
		return osStatuses[status] || osStatuses.no;
	}

	function md(text: string): string {
		return marked.parseInline(text) as string;
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

	function detailFields(vendor: Vendor): { label: string; content: string }[] {
		const fields: { label: string; content: string }[] = [];
		fields.push({ label: 'Discovery', content: discoveryText(vendor) });
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
		if (vendor.whereItFits) {
			fields.push({ label: 'Where it fits', content: vendor.whereItFits });
		}
		if (vendor.tradeOff) {
			fields.push({ label: vendor.tradeOffLabel || 'Trade-off', content: vendor.tradeOff });
		}
		return fields;
	}
</script>

{#if mode === 'tables' && categories && vendors}
	<table>
		<thead>
			<tr>
				<th class="tooltip-header">Tool<span class="tooltip-content">Product name and link to vendor site</span></th>
				<th class="tooltip-header">Discovery<span class="tooltip-content">Protocols used to find devices and map connections</span></th>
				<th class="tooltip-header">Services<span class="tooltip-content"><span class="chip chip-negative">No</span> No service awareness<br><span class="chip chip-neutral">Basic</span> Common port detection<br><span class="chip chip-positive">Yes</span> Application-level fingerprinting</span></th>
				<th class="tooltip-header">Live Updates<span class="tooltip-content">Whether diagrams update automatically after initial scan</span></th>
				<th class="tooltip-header">Open Source<span class="tooltip-content"><span class="chip chip-positive">OSI</span> OSI-approved open source license<br><span class="chip chip-neutral">Source available</span> Source code available, restricted license<br><span class="chip chip-negative">No</span> Proprietary</span></th>
				<th class="tooltip-header">Pricing<span class="tooltip-content">Starting price or pricing model</span></th>
				<th class="tooltip-header">Also Includes<span class="tooltip-content">Capabilities beyond network diagramming</span></th>
			</tr>
		</thead>
		<tbody>
			{#each categories as category}
				<tr class="category-row">
					<td colspan="7">{category.heading}</td>
				</tr>
				{#each category.vendors as slug}
					{@const vendor = v(slug)}
					<tr>
						<td><a href={vendor.href} {...isExternal(vendor.href) ? { target: '_blank', rel: 'noopener' } : {}}>{vendor.name}</a></td>
						<td>
							{#if vendor.discovery.length === 0}
								<span class="chip chip-negative">No</span>
							{:else}
								{#each vendor.discovery as protocol, i}
									{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(protocol)}>{protocol}</span>
								{/each}
							{/if}
							{#if vendor.discoverySources}
								{@html sourceRefHtml(vendor.discoverySources)}
							{/if}
						</td>
						<td>
							{#if vendor.services.detail && vendor.services.detailHref}
								<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}>{serviceInfo(vendor.services.level).label}</span><a href={vendor.services.detailHref} class="cell-detail">{vendor.services.detail}</a>
							{:else if vendor.services.detail}
								<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}>{serviceInfo(vendor.services.level).label}</span><span class="cell-detail">{vendor.services.detail}</span>
							{:else}
								<span class={sentimentClass(serviceInfo(vendor.services.level).sentiment)}>{serviceInfo(vendor.services.level).label}</span>
							{/if}
							{#if vendor.services.sources}
								{@html sourceRefHtml(vendor.services.sources)}
							{/if}
						</td>
						<td>
							{#if vendor.autoUpdates}
								<span class="chip chip-positive">Yes</span>
							{:else}
								<span class="chip chip-negative">No</span>
							{/if}
						</td>
						<td>
							{#if vendor.openSource.href}
								<a href={vendor.openSource.href}><span class={sentimentClass(osInfo(vendor.openSource.status).sentiment)}>{osInfo(vendor.openSource.status).label}</span></a>
							{:else}
								<span class={sentimentClass(osInfo(vendor.openSource.status).sentiment)}>{osInfo(vendor.openSource.status).label}</span>
							{/if}
							{#if vendor.openSource.license}
								<span class="cell-detail">{vendor.openSource.license}</span>
							{/if}
						</td>
						<td>
							{#if vendor.pricing.href}
								<a href={vendor.pricing.href}>{vendor.pricing.text}</a>
							{:else}
								{vendor.pricing.text}
							{/if}
							{#if vendor.pricing.sources}
								{@html sourceRefHtml(vendor.pricing.sources)}
							{/if}
						</td>
					<td>
						{#if vendor.alsoIncludes}
							{#each vendor.alsoIncludes as cap, i}
								{#if i > 0}{' '}{/if}<span class="chip" style={chipStyle(cap)}>{cap}</span>
							{/each}
						{/if}
					</td>
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>

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
		<h3 id={slugify(vendor.fullName || vendor.name)}><a href={vendor.href} {...isExternal(vendor.href) ? { target: '_blank', rel: 'noopener' } : {}}>{vendor.fullName || vendor.name}</a></h3>

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

{#if mode === 'sources' && sources}
	<div style="font-size: 0.8125rem; line-height: 1.8; color: rgb(156 163 175);">
		{#each sources as source}
			<span id="source-{source.id}">[{source.id}]</span> <a href={source.url}>{source.label}</a><br>
		{/each}
	</div>
{/if}
