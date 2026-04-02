import type { Vendor, VendorCategory, VendorSource, VendorFAQ } from '$lib/types';

export const disclosureText =
	"Full disclosure: Scanopy is our product. We built this list to be useful whether you pick us or not. Vendor details are based on publicly available documentation and pricing as of April 2026. Features, pricing, and capabilities may have changed since publication - check each vendor's website for the latest information.";

export const vendors: Record<string, Vendor> = {
	scanopy: {
		name: 'Scanopy',
		slug: 'scanopy',
		href: '/',

		discovery: ['SNMP', 'LLDP', 'CDP', 'ARP', 'TCP/UDP'],
		services: { level: 'yes', detail: '200+ types', detailHref: '/services' },
		autoUpdates: true,
		openSource: { status: 'osi', license: 'AGPL-3.0', href: '/community' },
		pricing: { text: 'Flat monthly, unlimited hosts', href: '/pricing' },
		alsoIncludes: ['Docker Visualization'],
		bestFor: 'IT teams and MSPs who want automated network documentation without deploying a monitoring platform',
		description:
			"Full disclosure: Scanopy is our product. We've tried to be honest about every tool on this list, including our own.\n\nScanopy is an [automated network documentation](/blog/automated-network-documentation) tool built for IT teams that need living network maps without the overhead of a full monitoring platform. It deploys a lightweight daemon that discovers your network and builds an interactive topology map that updates on a schedule.",
		discoveryNotes:
			'One daemon per network. No agents on endpoints, no SSH credentials.',
		serviceDiscovery:
			"This is where Scanopy differs from most tools on this list. Beyond mapping devices and connections, Scanopy fingerprints [200+ service types](/services) per host: databases, web servers, DNS, DHCP, Docker containers, print services, and more. Most network mapping tools tell you a device exists at an IP address. Scanopy tells you what it's running. When you click a host on the topology map, you see every detected service, not just the host itself.",
		diagrams:
			'Interactive topology map showing devices, connections, services, and interfaces. Shareable via link (no per-seat licensing). Exportable as SVG, Mermaid, and Confluence markup. Embeddable via iframe.',
		pricingNotes:
			'Free self-hosted [Community edition](/community) available.',
		whereItFits:
			'MSPs documenting client networks, IT teams that need documentation independent from their monitoring stack, and anyone who wants network maps without deploying another monitoring platform. Pairs well with whatever monitoring tool you already use.',
		tradeOff:
			"Monitoring, alerting, traffic analysis, config backup, patch management, software license tracking. It's a documentation tool. If you need monitoring, use a monitoring tool alongside it.",
		tradeOffLabel: "What Scanopy doesn't do",
		iframe: {
			src: 'https://demo.scanopy.net/share/a1b2c3d4-e5f6-7890-abcd-ef1234567890/embed?theme=dark',
			width: '800px',
			height: '600px',
			caption:
				'This is a live Scanopy map you can interact with. Click a host to see its services and interfaces.'
		}
	},
	'solarwinds-ntm': {
		name: 'SolarWinds NTM',
		fullName: 'SolarWinds Network Topology Mapper',
		slug: 'solarwinds-ntm',
		href: 'https://www.solarwinds.com/network-topology-mapper',

		discovery: ['SNMP', 'WMI', 'CDP', 'ICMP'],
		discoverySources: [{ id: 3 }],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'no' },
		pricing: { text: 'From $1,977/yr subscription', sources: [{ id: 3 }] },
		bestFor: 'Enterprise teams that standardize on Microsoft tools and need Visio-native network diagram exports',
		description:
			'Best for organizations that need compliance-ready Visio exports. NTM is the most widely-recommended automated network diagram tool — it scans your network and generates topology diagrams exportable to Visio, PDF, and PNG.',
		discoveryNotes:
			'Scan-on-demand (not continuous). Supports scheduled scans.',
		diagrams:
			'Multiple diagram types from a single scan (Layer 2, Layer 3, physical). Exports to Visio format. Auto-layout with manual override.',
		pricingNotes: 'Perpetual license options also available.',
		whereItFits:
			'Enterprise teams that need compliance-ready documentation with Visio exports. The Visio export alone makes it the default choice in organizations that standardize on Microsoft tools.',
		tradeOff:
			'Requires Windows. Scan-on-demand means diagrams are snapshots, not living documents (though scheduled scans help). The interface feels dated compared to modern web apps. The SolarWinds brand carries baggage from the 2020 supply chain incident, though NTM is a separate, much simpler product.',
		tradeOffLabel: 'Trade-offs'
	},
	netbrain: {
		name: 'NetBrain',
		slug: 'netbrain',
		href: 'https://www.netbraintech.com/',

		discovery: ['SNMP', 'CDP', 'LLDP', 'ARP', 'SSH/CLI'],
		services: { level: 'no' },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: 'Enterprise (contact sales)' },
		bestFor: 'Large enterprises that need network maps integrated with automation and troubleshooting workflows',
		description:
			'The only tool on this list built for large-scale network automation. Enterprise-grade dynamic network mapping with troubleshooting workflows — NetBrain maps sit at the center of a broader automation platform.',
		discoveryNotes: 'Deep integration with network automation workflows.',
		diagrams:
			'Dynamic maps that tie into troubleshooting runbooks and automation playbooks. Maps can trigger actions, not just display data.',
		pricingNotes: 'Not published.',
		whereItFits:
			"Large, complex networks where diagrams aren't just documentation but part of the operational workflow. NetBrain is genuinely powerful for this use case.",
		tradeOff:
			'Overkill for anything smaller than a large enterprise. The pricing and complexity reflect that.'
	},
	auvik: {
		name: 'Auvik',
		slug: 'auvik',
		href: 'https://www.auvik.com/',

		discovery: ['SNMP', 'CDP', 'LLDP', 'ARP'],
		discoverySources: [{ id: 1 }],
		services: { level: 'basic', sources: [{ id: 2 }] },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: 'Per-device (contact sales)' },
		alsoIncludes: ['Monitoring', 'Traffic Analysis'],
		bestFor: 'MSPs who need monitoring, alerting, and network maps in one cloud-managed platform',
		description:
			'The strongest option for MSPs who want monitoring and network maps in one platform. Auvik is cloud-managed network monitoring that discovers devices via SNMP, CDP, LLDP, and ARP, then builds real-time topology maps that update continuously.',
		discoveryNotes:
			'NetFlow for traffic analysis. Cloud-hosted with an on-site collector agent.',
		diagrams:
			'Interactive topology maps, real-time updates, Layer 2/3 views. Clean UI. The mapping is genuinely good.',
		pricingNotes:
			'Multiple device categories charged at different rates.',
		whereItFits:
			"If you're an MSP that needs monitoring, alerting, config backup, and network maps in one platform, Auvik is a strong option. The topology mapping is a real feature, not an afterthought.",
		tradeOff:
			"Documentation is coupled to Auvik's per-device pricing and platform. If you already run a different monitoring stack (LibreNMS, Zabbix, PRTG), adding Auvik for diagrams means paying for monitoring capabilities you already have."
	},
	prtg: {
		name: 'PRTG',
		fullName: 'PRTG Network Monitor',
		slug: 'prtg',
		href: 'https://www.paessler.com/prtg',

		discovery: ['SNMP', 'WMI', 'ICMP'],
		discoverySources: [{ id: 4 }],
		services: { level: 'no' },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: 'Free up to 100 sensors then tiered', sources: [{ id: 4 }] },
		alsoIncludes: ['Monitoring', 'Traffic Analysis'],
		bestFor: 'Teams already invested in the Paessler ecosystem who want built-in topology mapping alongside monitoring',
		description:
			'Best for teams already running Paessler for monitoring who want built-in mapping. PRTG is a full monitoring stack with auto-discovery and interactive maps — it has been around since 2003 and has a large installed base.',
		discoveryNotes:
			'NetFlow and packet sniffing for traffic analysis. Self-hosted on Windows.',
		diagrams:
			'2D and 3D maps generated from discovery data. Functional, not the prettiest.',
		pricingNotes:
			'Not 100 devices - a single device can use multiple sensors.',
		whereItFits:
			'If you already use PRTG for monitoring and want basic topology visibility, the built-in maps avoid adding another tool. The maps show what PRTG discovers, which is thorough.',
		tradeOff:
			'Mapping is secondary to monitoring. The diagram feature exists to visualize what PRTG monitors, not to produce shareable documentation.'
	},
	domotz: {
		name: 'Domotz',
		slug: 'domotz',
		href: 'https://www.domotz.com/',

		discovery: ['SNMP', 'ARP', 'ICMP', 'CDP', 'LLDP', 'mDNS', 'NetBIOS'],
		discoverySources: [{ id: 5 }],
		services: { level: 'basic', sources: [{ id: 6 }] },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: '$1.50/device/mo', sources: [{ id: 7 }] },
		alsoIncludes: ['Monitoring', 'RMM'],
		bestFor: 'Cost-conscious MSPs who need monitoring, remote access, and basic network maps at a transparent price',
		description:
			'The most affordable monitoring platform with network maps — best for cost-conscious MSPs. Domotz offers remote monitoring and management with network mapping, popular as a lower-cost Auvik alternative.',
		discoveryNotes: 'Cloud-hosted with an on-site agent.',
		diagrams:
			'Auto-generated topology maps. Functional. The focus is remote access and monitoring, with mapping as a supporting feature.',
		pricingNotes:
			'Free tier covers 1 managed device with unlimited discovery. [Published and transparent](https://www.domotz.com/pricing/).',
		whereItFits:
			'MSPs who want monitoring, remote access, and basic network mapping at a fair price. Domotz is consistently cited as the most reasonably-priced monitoring platform in MSP communities.',
		tradeOff:
			'Diagrams are secondary to remote access and monitoring. If documentation is your primary goal, the mapping features may not go deep enough.'
	},
	'manageengine-opmanager': {
		name: 'ManageEngine OpManager',
		slug: 'manageengine-opmanager',
		href: 'https://www.manageengine.com/network-monitoring/',

		discovery: ['SNMP', 'CDP', 'LLDP', 'ARP'],
		discoverySources: [{ id: 8 }],
		services: { level: 'no' },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: 'From $95/yr (10 devices)', sources: [{ id: 9 }] },
		alsoIncludes: ['Monitoring'],
		bestFor: 'Mid-market IT teams that want monitoring and visualization without per-device pricing',
		description:
			"Best budget option for mid-market teams that want monitoring and topology maps without Auvik's per-device pricing. OpManager provides network monitoring with Layer 2/3 auto-discovery and topology maps, plus rack and floor plan views that most monitoring tools lack.",
		discoveryNotes: 'Auto-maps port-level connectivity.',
		diagrams:
			'Topology maps, rack views, floor plan views. More visualization options than most monitoring tools.',
		pricingNotes:
			'Professional from $145/year. Free edition available (3 devices).',
		whereItFits:
			"Mid-market teams that want monitoring and visualization in one tool without Auvik's per-device pricing model. The visualization options (rack views, floor plans) are unusually good for a monitoring tool."
	},
	'nmap-zenmap': {
		name: 'Nmap + Zenmap',
		slug: 'nmap-zenmap',
		href: 'https://nmap.org/',

		discovery: ['ICMP', 'ARP', 'TCP/UDP'],
		services: { level: 'yes' },
		autoUpdates: false,
		openSource: { status: 'source-available', license: 'NPSL' },
		pricing: { text: 'Free' },
		bestFor: 'Security audits, one-off network discovery, and as the discovery layer in custom automation pipelines',
		description:
			'The go-to tool for one-off network scanning and security audits, not ongoing documentation. Nmap is the standard open-source network scanner. Zenmap is its official GUI, which includes basic topology visualization of scan results.',
		discoveryNotes:
			"Port scanning, service fingerprinting, OS detection. Nmap's service detection is thorough: it doesn't just find open ports, it identifies what's running on them.",
		diagrams:
			'Zenmap generates a simple topology view from scan results. Functional for visualizing a single scan, but not a full network diagram tool. For more polished output, export Nmap data (XML) to Graphviz, D3.js, or import into draw.io.',
		whereItFits:
			"Security audits, one-off network discovery, and as the discovery layer in custom automation pipelines. If you want to know what's on your network right now and what services are running, Nmap is the fastest path. Pair it with a rendering tool for diagrams.",
		tradeOff:
			"No continuous updates, no topology mapping (LLDP/CDP), no persistent documentation. Each scan is a snapshot. Zenmap's visualization is minimal. For ongoing, automated diagrams, Nmap is the discovery step, not the whole solution."
	},
	librenms: {
		name: 'LibreNMS',
		slug: 'librenms',
		href: 'https://www.librenms.org/',

		discovery: ['SNMP', 'CDP', 'LLDP'],
		discoverySources: [{ id: 10 }],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'osi', license: 'GPL-3.0' },
		pricing: { text: 'Free' },
		alsoIncludes: ['Monitoring'],
		bestFor: 'Teams with Linux skills that want free, self-hosted monitoring with basic topology visualization',
		description:
			'The best free self-hosted monitoring option with basic mapping. LibreNMS is open-source network monitoring with auto-discovery and a weathermap plugin for topology visualization. PHP-based with an active community.',
		discoveryNotes: undefined,
		diagrams:
			'The [Network Weathermap](https://github.com/librenms/librenms) plugin generates topology visualizations. Not a core feature; requires separate setup. New devices are not automatically added to the map - topology layout is manual.',
		whereItFits:
			"Teams with Linux server management skills that want free monitoring with some topology visualization. If you're already running LibreNMS for monitoring, the weathermap plugin adds basic mapping without another tool.",
		tradeOff:
			'Topology visualization is a community plugin, not a first-class feature. Setup requires Linux, PHP, and database administration. The monitoring side is strong; the diagramming side is minimal.'
	},
	drawio: {
		name: 'draw.io',
		fullName: 'draw.io (diagrams.net)',
		slug: 'drawio',
		href: 'https://www.drawio.com/',

		discovery: [],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'osi', license: 'Apache-2.0' },
		pricing: { text: 'Free' },
		bestFor: 'Anyone who needs a one-time, hand-crafted network diagram for a presentation or project',
		description:
			'The best free option for one-time, hand-drawn network diagrams. draw.io is an open-source diagramming tool with extensive network shape libraries — the most popular free alternative to Visio.',
		discoveryNotes:
			'You place shapes and draw connections manually. You can import from CSV or XML if you build the data pipeline yourself.',
		diagrams:
			'Highly customizable. Huge icon libraries (Cisco, AWS, Azure, generic network). Export to everything. Works offline.',
		whereItFits:
			"One-time diagrams, architecture documentation, presentations. If you need a diagram for a specific project or meeting and you're willing to draw it, draw.io is excellent.",
		tradeOff:
			"The diagram is a snapshot of the moment you drew it. It [won't update when your network changes](/blog/network-diagrams-wrong). If you're looking for automated, continuously updated diagrams, draw.io isn't that. But for a well-crafted, specific-purpose diagram, nothing beats the flexibility of drawing it yourself.",
		tradeOffLabel: 'The catch'
	},
	lucidchart: {
		name: 'Lucidchart',
		slug: 'lucidchart',
		href: 'https://www.lucidchart.com/',

		discovery: ['Cloud import'],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'no' },
		pricing: { text: 'From ~$9/user/mo', sources: [{ id: 11 }] },
		bestFor: 'Teams that need polished, collaborative network diagrams for documentation or cloud architecture reviews',
		description:
			'Best for teams that need real-time collaboration on professional diagrams. Lucidchart is cloud-based diagramming with multi-user editing and imports infrastructure data from AWS, Azure, and GCP.',
		discoveryNotes: 'No on-prem network scanning.',
		diagrams:
			'Professional-grade output. Real-time collaboration. Extensive template library. Integrates with Google Workspace, Atlassian, Microsoft.',
		pricingNotes:
			'Free tier available. Team plans from ~$10/user/month.',
		whereItFits:
			'Teams that need polished, shareable diagrams for documentation, presentations, or cloud architecture reviews. The collaboration features are genuinely best-in-class.',
		tradeOff:
			"Same as draw.io for on-prem networks: you're drawing the diagram, not discovering it. The cloud import feature is useful for AWS/Azure/GCP environments but doesn't help with physical networks, switches, or on-prem infrastructure.",
		tradeOffLabel: 'The catch'
	},
	'scanopy-ce': {
		name: 'Scanopy Community Edition',
		slug: 'scanopy-ce',
		href: '/community',

		discovery: ['SNMP', 'LLDP', 'CDP', 'ARP'],
		services: { level: 'yes' },
		autoUpdates: true,
		openSource: { status: 'osi', license: 'AGPL-3.0', href: '/community' },
		pricing: { text: 'Free' },
		bestFor: 'Teams that want automated network documentation on their own infrastructure with no SaaS dependency',
		description:
			"The best free self-hosted option for automated network documentation. Scanopy CE is the free, self-hosted edition with the same discovery engine as the paid product — SNMP, LLDP, CDP, ARP — with an interactive topology map and service detection. Open source and runs on your own hardware.",
		discoveryNotes: 'One daemon, no per-device agents.',
		diagrams:
			'Interactive topology map with service and interface detail. Exportable as SVG, Mermaid, and Confluence markup.',
		pricingNotes: '[Self-hosted](/community).',
		whereItFits:
			"Homelabbers and small teams that want automated network documentation without a SaaS dependency. If you're already self-hosting your infrastructure, this fits right in.",
		tradeOff:
			'Self-hosted means you manage updates and the host it runs on. No cloud dashboard or team sharing features from the paid tiers.'
	}
};

// Table categories - groups vendors for comparison tables
// Detail sections - groups vendors for the prose cards below
// These intentionally differ: e.g., "Discovery Tools" table has Nmap+LibreNMS,
// but the "Open Source Options" detail section has Nmap+LibreNMS+Scanopy CE.
export const tableCategories: VendorCategory[] = [
	{
		id: 'dedicated',
		heading: 'Dedicated Diagram Tools',
		hasAlsoIncludes: false,
		vendors: ['scanopy', 'solarwinds-ntm', 'netbrain']
	},
	{
		id: 'monitoring',
		heading: 'Monitoring Platforms with Diagrams',
		hasAlsoIncludes: true,
		vendors: ['auvik', 'prtg', 'domotz', 'manageengine-opmanager']
	},
	{
		id: 'discovery',
		heading: 'Discovery Tools',
		hasAlsoIncludes: true,
		vendors: ['nmap-zenmap', 'librenms']
	},
	{
		id: 'manual',
		heading: 'Manual Diagramming',
		hasAlsoIncludes: false,
		vendors: ['drawio', 'lucidchart']
	}
];

export const detailSections: VendorCategory[] = [
	{
		id: 'monitoring',
		heading: 'Monitoring Platforms with Diagrams',
		intro: "These are monitoring tools first, and strong ones. Network diagrams come included as part of the monitoring package. If you already use one of these for monitoring, the built-in mapping may be all you need. If you use a different monitoring stack, or want documentation that isn't tied to your monitoring vendor, a dedicated tool gives you more flexibility.",
		hasAlsoIncludes: false,
		vendors: ['auvik', 'prtg', 'manageengine-opmanager', 'domotz']
	},
	{
		id: 'dedicated',
		heading: 'Dedicated Diagram Tools',
		intro: 'These exist specifically to discover and map networks. Not monitoring platforms. No alerting, no traffic analysis, no config backup. Their entire purpose is producing accurate network diagrams.',
		hasAlsoIncludes: false,
		vendors: ['solarwinds-ntm', 'scanopy', 'netbrain']
	},
	{
		id: 'manual',
		heading: 'Manual Diagramming',
		intro: 'These tools don\'t discover your network. You draw the diagram yourself. They show up in "automated network diagram" recommendations constantly, so they\'re worth covering to clarify what they actually do.',
		hasAlsoIncludes: false,
		vendors: ['drawio', 'lucidchart']
	},
	{
		id: 'discovery',
		heading: 'Discovery Tools',
		hasAlsoIncludes: false,
		vendors: ['librenms', 'nmap-zenmap', 'scanopy-ce']
	}
];

export const honorableMentions =
	'**Graphviz / D3.js.** Rendering engines, not discovery tools. If you\'ve already got network data from another source (Nmap scans, SNMP polls, API calls), Graphviz and D3 can turn it into a diagram. This is the DIY path. Extremely flexible, significant engineering effort required.';

export const vendorSources: VendorSource[] = [
	{
		id: 1,
		label: 'Auvik - How does Auvik discover network topology and device information?',
		url: 'https://support.auvik.com/hc/en-us/articles/202956414'
	},
	{
		id: 2,
		label: 'Auvik - Can Auvik discover services on my network?',
		url: 'https://support.auvik.com/hc/en-us/articles/203604100'
	},
	{
		id: 3,
		label: 'SolarWinds - Network Topology Mapper',
		url: 'https://www.solarwinds.com/network-topology-mapper'
	},
	{
		id: 4,
		label: 'Paessler - PRTG Pricing',
		url: 'https://www.paessler.com/pricing'
	},
	{
		id: 5,
		label: 'Domotz - Agentless Network Discovery for MSP Client Onboarding',
		url: 'https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/'
	},
	{
		id: 6,
		label: 'Domotz - Device TCP/UDP Ports/Services Discovery',
		url: 'https://help.domotz.com/monitoring-management/device-tcp-udp-ports-services-discovery/'
	},
	{
		id: 7,
		label: 'Domotz - Pricing',
		url: 'https://www.domotz.com/pricing/'
	},
	{
		id: 8,
		label: 'ManageEngine - Discover Networks',
		url: 'https://www.manageengine.com/network-monitoring/help/discover-networks.html'
	},
	{
		id: 9,
		label: 'ManageEngine - OpManager Editions',
		url: 'https://www.manageengine.com/network-monitoring/opmanager-editions.html'
	},
	{
		id: 10,
		label: 'LibreNMS - Auto-Discovery',
		url: 'https://docs.librenms.org/Extensions/Auto-Discovery/'
	},
	{
		id: 11,
		label: 'Lucidchart - Pricing',
		url: 'https://lucid.app/pricing/lucidchart'
	}
];

export const vendorFAQs: VendorFAQ[] = [
	{
		question: 'What network diagram tool bundles diagrams with monitoring?',
		answer: 'If you already use Auvik, PRTG, Domotz, or ManageEngine for monitoring, use their built-in mapping. No reason to add another tool for something your monitoring platform already does.'
	},
	{
		question: 'What network diagram tool is independent from monitoring?',
		answer: 'Scanopy or SolarWinds NTM. Scanopy gives you a living map that updates on a schedule with flat pricing. SolarWinds NTM gives you scan-on-demand with Visio exports. Different approaches to the same goal.'
	},
	{
		question: 'What network diagram tool works for large enterprise with automation?',
		answer: 'NetBrain. Nothing else operates at the same scale with the same automation integration.'
	},
	{
		question: 'What is the best tool for a one-time network diagram?',
		answer: 'draw.io or Lucidchart. Draw it once, export it, done. No ongoing cost, no infrastructure. draw.io is free. Lucidchart is better for team collaboration.'
	},
	{
		question: 'What is the best free self-hosted network diagram tool?',
		answer: 'LibreNMS for monitoring with basic maps. Scanopy Community Edition for documentation-focused mapping. draw.io for manual diagrams. All three are free.'
	},
	{
		question: 'What is the best network diagram tool for MSPs?',
		answer: 'Auvik if you want monitoring bundled in (per-device pricing scales with your client base). Scanopy if you want documentation decoupled from monitoring (flat pricing regardless of host count).'
	}
];
