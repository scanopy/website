// Single source of truth for comparison-table column headers + hover tooltips, shared by
// the unified ComparisonTable so the vs, alternatives, and main comparison tables render
// identical labels and tooltips. Tooltip strings may contain HTML (chip legends) and are
// rendered with {@html} inside the .tooltip-content span.

export interface ColumnDef {
	label: string;
	tooltip: string;
}

export const COLUMN_DEFS: Record<string, ColumnDef> = {
	name: {
		label: 'Tool',
		tooltip: 'Product name and link to vendor site'
	},
	discovery: {
		label: 'Discovery',
		tooltip: 'Protocols used to find devices and map connections'
	},
	viewTypes: {
		label: 'Network Views',
		tooltip:
			'Which topology views the tool produces from discovery.<br><span class="chip chip-positive">L2</span> Physical switch ports and links<br><span class="chip chip-positive">L3</span> Subnets, VLANs, routing<br><span class="chip chip-positive">Workload</span> VM/container host nesting<br><span class="chip chip-positive">Application</span> Service-dependency / app grouping<br><br><span class="chip chip-positive">Yes</span> supported<br><span class="chip chip-unclear">Tag ?</span> unverified<br><span class="chip view-tag-no">Greyed</span> not supported'
	},
	environments: {
		label: 'Environments',
		tooltip: 'Where the tool discovers/maps: on-prem and/or public cloud (AWS, Azure, GCP).'
	},
	services: {
		label: 'Services',
		tooltip:
			'<span class="chip chip-negative">No</span> No service awareness<br><span class="chip chip-neutral">Basic</span> Common port detection<br><span class="chip chip-positive">Yes</span> Application-level fingerprinting'
	},
	autoUpdates: {
		label: 'Live Updates',
		tooltip: 'Whether diagrams update automatically after the initial scan'
	},
	openSource: {
		label: 'Open Source',
		tooltip:
			'<span class="chip chip-positive">OSI</span> OSI-approved open source license<br><span class="chip chip-neutral">Source available</span> Source code available, restricted license<br><span class="chip chip-negative">No</span> Proprietary'
	},
	pricing: {
		label: 'Pricing',
		tooltip: 'Starting price or pricing model'
	},
	alsoIncludes: {
		label: 'Also Includes',
		tooltip: 'Capabilities beyond network diagramming'
	}
};
