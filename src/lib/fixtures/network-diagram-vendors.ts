import type { Vendor, VendorCategory, VendorSource, VendorFAQ } from '$lib/types';
import { getServiceCountLabel } from '$lib/schemas';

const serviceCount = getServiceCountLabel();

export const disclosureText =
	"Full disclosure: Scanopy is our product. We built this list to be useful whether you pick us or not. Vendor details are sourced from official documentation, published pricing, and community reports as of April 2026. Features, pricing, and capabilities may have changed since publication — check each vendor's website for the latest information.";

export const vendors: Record<string, Vendor> = {
	scanopy: {
		name: 'Scanopy',
		slug: 'scanopy',
		href: '/',

		discovery: ['SNMP', 'LLDP', 'CDP', 'ARP', 'TCP/UDP'],
		services: { level: 'yes', detail: `${serviceCount} types`, detailHref: '/services' },
		autoUpdates: true,
		openSource: { status: 'osi', license: 'AGPL-3.0', href: '/community' },
		pricing: { text: 'Flat monthly, unlimited hosts', href: '/pricing' },
		alsoIncludes: ['Docker Visualization'],
		bestFor: 'IT teams and MSPs who want a dedicated network diagram automation tool which works alongside their existing monitoring platform',
		description:
			"Full disclosure: Scanopy is our product. We've tried to be honest about every tool on this list, including our own.\n\nScanopy is an [automated network documentation](/blog/automated-network-documentation) tool built for IT teams that need living network maps that work alongside their monitoring platform. It deploys a lightweight daemon that discovers your network and builds an interactive topology map that updates on a schedule.",
		discoveryNotes:
			'One daemon per network. No agents on endpoints, no SSH credentials.',
		serviceDiscovery:
			`This is where Scanopy differs from most tools on this list. Beyond mapping devices and connections, Scanopy fingerprints [${serviceCount} service types](/services) per host: databases, web servers, DNS, DHCP, Docker containers, print services, and more. Most network mapping tools tell you a device exists at an IP address. Scanopy tells you what it's running. When you click a host on the topology map, you see every detected service, not just the host itself.`,
		diagrams:
			'Interactive topology map showing devices, connections, services, and interfaces. Shareable via link (no per-seat licensing). Exportable as SVG, Mermaid, and Confluence markup. Embeddable via iframe.',
		pricingNotes:
			'Free self-hosted [Community edition](/community) available.',
		whereItFits:
			'MSPs documenting client networks, IT teams that need documentation independent from their monitoring stack, and anyone who wants network maps without deploying another monitoring platform. Pairs well with whatever monitoring tool you already use.',
		tradeOff:
			"Monitoring, alerting, traffic analysis, config backup, patch management, software license tracking. It's a documentation tool. If you need monitoring, use a monitoring tool alongside it.",
		tradeOffLabel: "What Scanopy doesn't do",
		deployment: ['Cloud', 'Self-hosted'],
		deploymentNotes:
			'Cloud-hosted SaaS or [self-hosted via Docker](https://scanopy.net/community). One daemon per network — no agents on endpoints, no inbound firewall rules.',
		deploymentSources: [{ id: 19 }],
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

		discovery: ['SNMP', 'WMI', 'CDP', 'LLDP', 'ICMP'],
		discoverySources: [{ id: 3 }],
		services: { level: 'no' },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: 'From $1,977/yr subscription', sources: [{ id: 3 }] },
		bestFor: 'Enterprise teams that standardize on Microsoft tools and need Visio-native network diagram exports',
		description:
			'Best for organizations that need compliance-ready Visio exports. NTM scans your network and generates topology diagrams exportable to Visio, PDF, and PNG. It is a standalone Windows application, separate from the SolarWinds Observability platform.',
		discoveryNotes:
			'Scan-on-demand (not continuous). Supports scheduled scans. Also discovers VMware and Hyper-V environments.',
		diagrams:
			'Multiple diagram types from a single scan (Layer 2, Layer 3, physical). Exports to Visio with auto-populated SmartShapes. Auto-layout with manual override.',
		pricingNotes: 'SolarWinds moved to subscription-only licensing across its product line in 2025. Renewal prices have reportedly increased significantly post-acquisition by Turn/River Capital.',
		whereItFits:
			'Enterprise teams that need compliance-ready documentation with Visio exports. The Visio export alone makes it the default choice in organizations that standardize on Microsoft tools.',
		tradeOff:
			'Requires Windows (.NET 3.5 and 4.8). No web-based access, no embeddable maps, no API. NTM has received only maintenance updates since roughly 2016, with no new discovery or mapping features. SolarWinds staff confirmed in 2017 that there is no product roadmap. The product still works, but active development has shifted to SolarWinds Observability. The SolarWinds brand also carries baggage from the 2020 supply chain incident, though NTM is a separate, much simpler product.',
		tradeOffLabel: 'Trade-offs',
		deployment: ['Desktop'],
		deploymentNotes:
			'Windows desktop application. Requires .NET 3.5 and 4.8. No web interface, no cloud option. Scans from the machine it\'s installed on.',
		deploymentSources: [{ id: 3 }]
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
		discoveryNotes:
			'Deep integration with network automation workflows. [Discovers AWS VPC/EC2, Azure VNet/VM, and GCP VPC/VM](https://www.netbraintech.com/docs/ie101/help/discovering-and-visualizing-public-cloud.htm) with hybrid on-prem/cloud path mapping.',
		diagrams:
			'Dynamic maps that tie into troubleshooting runbooks and automation playbooks. Maps can trigger actions, not just display data.',
		pricingNotes: 'Not published.',
		whereItFits:
			"Large, complex networks where diagrams aren't just documentation but part of the operational workflow. NetBrain handles networks with thousands of devices and integrates maps directly into troubleshooting runbooks and automation playbooks.",
		tradeOff:
			'Overkill for anything smaller than a large enterprise. The pricing and complexity reflect that. Community experiences are polarized: some teams report excellent results, while others have struggled with map accuracy for years. One [r/networking user](https://www.reddit.com/r/networking/comments/uu3wyr/comment/i9duuiu/) spent two years and "hundreds of thousands of dollars" before abandoning it and reverting to manual Visio diagrams. A thorough PoC is essential before committing.',
		deployment: ['Cloud', 'Self-hosted'],
		deploymentNotes:
			'On-premises server or [NetBrain-hosted cloud](https://www.netbrain.com/). Central server polls devices via SNMP and SSH/CLI — no per-device agents.',
		deploymentSources: [{ id: 21 }]
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
			'NetFlow for traffic analysis. Cloud-hosted with an on-site collector agent. Discovers across [AWS, Azure, and GCP via cloud APIs](https://support.auvik.com/hc/en-us/articles/206173816) alongside on-prem SNMP/LLDP.',
		diagrams:
			'Interactive topology maps with real-time updates and Layer 2/3 views. Auto-discovered topology renders at both layers, updates as devices change state, and stays readable in larger environments.',
		pricingNotes:
			'Auvik does not publish pricing. Multiple device categories (network infrastructure, endpoints, servers) charged at different rates — request a quote for current pricing.',
		whereItFits:
			"If you're an MSP that needs monitoring, alerting, config backup, and network maps in one platform, Auvik is a strong option. The topology mapping is a core feature with Layer 2/3 views, device grouping, and real-time link status — not an afterthought.",
		tradeOff:
			"Documentation is coupled to Auvik's per-device pricing and platform. If you already run a different monitoring stack (LibreNMS, Zabbix, PRTG), adding Auvik for diagrams means paying for monitoring capabilities you already have.",
		deployment: ['Cloud'],
		deploymentNotes:
			'Cloud-hosted SaaS. One [collector deployed per network site](https://support.auvik.com/hc/en-us/articles/206173816) forwards data to Auvik\'s platform. No software on monitored devices.',
		deploymentSources: [{ id: 20 }]
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
			'Best for teams already running Paessler for monitoring who want built-in mapping. PRTG is a full monitoring stack with auto-discovery and interactive maps — it has been around since 2003 and has a large installed base. PRTG counts sensors, not devices — [most users average 10 sensors per device](https://www.paessler.com/prtg/requirements), so a 1,000-sensor license typically covers around 100 devices.',
		discoveryNotes:
			'NetFlow and packet sniffing for traffic analysis. Self-hosted on Windows.',
		diagrams:
			'2D and 3D maps generated from discovery data. Functional, not the prettiest.',
		pricingNotes:
			'Not 100 devices - a single device can use multiple sensors.',
		whereItFits:
			'If you already use PRTG for monitoring and want basic topology visibility, the built-in maps avoid adding another tool. The maps show what PRTG discovers, which is thorough.',
		tradeOff:
			'Mapping is secondary to monitoring. The diagram feature exists to visualize what PRTG monitors, not to produce shareable documentation.',
		deployment: ['Self-hosted', 'Cloud'],
		deploymentNotes:
			'Self-hosted on [Windows Server 2016+](https://www.paessler.com/prtg/requirements). [PRTG Hosted Monitor](https://www.paessler.com/prtg-hosted-monitor) available as cloud alternative. Core server with optional remote probes for distributed monitoring.',
		deploymentSources: [{ id: 13 }]
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
			'The most affordable monitoring platform with network maps — best for cost-conscious MSPs. Domotz offers remote monitoring and management with network mapping, popular as a lower-cost Auvik alternative. A [single collector deployed to the client\'s network](https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/) provides a real-time inventory within minutes. No endpoint agents required.',
		discoveryNotes: 'Cloud-hosted with an on-site agent.',
		diagrams:
			'Auto-generated topology maps. Functional. The focus is remote access and monitoring, with mapping as a supporting feature.',
		pricingNotes:
			'Free tier covers 1 managed device with unlimited discovery. [Published and transparent](https://www.domotz.com/pricing/).',
		whereItFits:
			'MSPs who want monitoring, remote access, and basic network mapping at a fair price. Domotz is consistently cited as the most reasonably-priced monitoring platform in MSP communities.',
		tradeOff:
			'Diagrams are secondary to remote access and monitoring. If documentation is your primary goal, the mapping features may not go deep enough.',
		deployment: ['Cloud'],
		deploymentNotes:
			'Cloud-hosted SaaS. [One collector per network](https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/) — runs on Linux, Raspberry Pi, Docker, or NAS. No endpoint agents.',
		deploymentSources: [{ id: 14 }]
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
		bestFor: 'Mid-market IT teams that want monitoring and visualization at a lower per-device cost',
		description:
			"Best budget option for mid-market teams that want monitoring and topology maps at a fraction of Auvik's per-device cost. OpManager provides [agentless](https://www.manageengine.com/network-monitoring/agentless-network-monitoring.html) network monitoring with Layer 2/3 auto-discovery and topology maps, plus rack and floor plan views that most monitoring tools lack. [Scales up to 30,000 devices](https://www.manageengine.com/network-monitoring/network-monitoring-tool.html) with a distributed monitoring architecture.",
		discoveryNotes: 'Auto-maps port-level connectivity.',
		diagrams:
			'Topology maps, rack views, floor plan views. More visualization options than most monitoring tools.',
		pricingNotes:
			'Professional from $145/year. Free edition available (3 devices).',
		whereItFits:
			"Mid-market teams that want monitoring and visualization in one tool at a lower per-device cost than Auvik. The visualization options (rack views, floor plans) are unusually good for a monitoring tool.",
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on [Windows or Linux](https://www.manageengine.com/network-monitoring/network-monitoring-tool.html). [Agentless](https://www.manageengine.com/network-monitoring/agentless-network-monitoring.html) — central server polls devices via SNMP, WMI, CLI.',
		deploymentSources: [{ id: 15 }]
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
			"No continuous updates, no topology mapping (LLDP/CDP), no persistent documentation. Each scan is a snapshot. Zenmap's visualization is minimal. For ongoing, automated diagrams, Nmap is the discovery step, not the whole solution.",
		deployment: ['CLI'],
		deploymentNotes:
			'Runs on [Linux, macOS, Windows, FreeBSD](https://nmap.org/download). No server component. Scans from wherever you run it — no agents on targets.',
		deploymentSources: [{ id: 17 }]
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
			'The best free self-hosted monitoring option with basic mapping. LibreNMS is open-source network monitoring with auto-discovery and a weathermap plugin for topology visualization. [Requires PHP 8.2+ and MariaDB](https://docs.librenms.org/Installation/Install-LibreNMS/) on Linux. Central server polls devices via SNMP — no per-device agents required.',
		discoveryNotes: undefined,
		diagrams:
			'The [Network Weathermap](https://github.com/librenms/librenms) plugin generates topology visualizations. Not a core feature; requires separate setup. New devices are not automatically added to the map - topology layout is manual.',
		whereItFits:
			"Teams with Linux server management skills that want free monitoring with some topology visualization. If you're already running LibreNMS for monitoring, the weathermap plugin adds basic mapping without another tool.",
		tradeOff:
			'Topology visualization is a community plugin, not a first-class feature. Setup requires Linux, PHP, and database administration. The monitoring side is strong; the diagramming side is minimal.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on [Linux (Ubuntu, Debian, CentOS)](https://docs.librenms.org/Installation/Install-LibreNMS/). Docker available. Requires MariaDB and PHP 8.2+. Central server polls via SNMP — no per-device agents.',
		deploymentSources: [{ id: 16 }]
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
		tradeOffLabel: 'The catch',
		deployment: ['Browser', 'Desktop'],
		deploymentNotes:
			'Browser-based at diagrams.net or desktop app (Electron — Windows, macOS, Linux). Confluence and Jira plugins available. No network interaction.'
	},
	lucidchart: {
		name: 'Lucidchart',
		slug: 'lucidchart',
		href: 'https://www.lucidchart.com/',

		discovery: ['Cloud import'],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'no' },
		pricing: { text: 'From $9/user/mo', sources: [{ id: 11 }] },
		bestFor: 'Teams that need polished, collaborative network diagrams for documentation or cloud architecture reviews',
		description:
			'Best for teams that need real-time collaboration on professional diagrams. Lucidchart is cloud-based diagramming with multi-user editing and imports infrastructure data from AWS, Azure, and GCP.',
		discoveryNotes:
			'No on-prem network scanning. Cloud architecture import via [Lucidscale](https://lucid.co/lucidscale/) — connects to AWS, Azure, and GCP accounts and auto-generates topology diagrams from live infrastructure.',
		diagrams:
			'Professional-grade output. Real-time collaboration. Extensive template library. Integrates with Google Workspace, Atlassian, Microsoft.',
		pricingNotes:
			'Free tier available (3 editable documents). Team plans from $9/user/month billed annually. See [current pricing](https://lucid.app/pricing/lucidchart) for latest rates.',
		whereItFits:
			'Teams that need polished, shareable diagrams for documentation, presentations, or cloud architecture reviews. Lucidchart supports real-time multi-cursor editing, inline commenting, version history, and integrates with Confluence, Jira, Google Workspace, and Microsoft Teams.',
		tradeOff:
			"Same as draw.io for on-prem networks: you're drawing the diagram, not discovering it. The cloud import feature is useful for AWS/Azure/GCP environments but doesn't help with physical networks, switches, or on-prem infrastructure.",
		tradeOffLabel: 'The catch',
		deployment: ['Cloud', 'Browser'],
		deploymentNotes:
			'Cloud-hosted SaaS. Browser-based, no installation. Cloud import available for AWS/Azure/GCP topology via [Lucidscale](https://lucid.co/lucidscale/).',
		deploymentSources: [{ id: 22 }]
	},
	netdisco: {
		name: 'NetDisco',
		fullName: 'NetDisco',
		slug: 'netdisco',
		href: 'https://netdisco.org/',

		discovery: ['SNMP', 'CDP', 'LLDP', 'ARP'],
		discoverySources: [{ id: 12 }],
		services: { level: 'no' },
		autoUpdates: true,
		openSource: { status: 'osi', license: 'BSD' },
		pricing: { text: 'Free' },
		bestFor: 'Network teams that want free, open-source Layer 2 topology discovery and device tracking',
		description:
			'The most-recommended open-source network discovery tool in sysadmin and networking communities. NetDisco is a web-based network management tool that discovers devices via SNMP and maps Layer 2 topology using CDP and LLDP neighbor data. Originally developed at the University of Amsterdam, actively maintained since 2003.',
		discoveryNotes:
			'SNMP-based device discovery with CDP/LLDP neighbor detection and ARP/MAC table correlation. Tracks switch port usage, VLAN assignments, and device locations over time.',
		diagrams:
			'Web-based topology maps with device groupings configurable via config file. Maps take some effort to get looking the way you want, but device groupings work well. Not as polished as commercial tools, but functional.',
		whereItFits:
			'Network teams comfortable with Perl and Linux administration who want a free, battle-tested tool for Layer 2 discovery and device tracking. Strong at answering "what device is on which switch port?" questions.',
		tradeOff:
			'Perl-based, which limits the contributor pool. Topology visualization is functional but not modern. Requires Linux, PostgreSQL, and some configuration effort. No service detection beyond basic SNMP data. Mapping is a feature of a broader network management tool, not the primary focus.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on Linux. Requires [Perl and PostgreSQL](https://netdisco.org/). Docker image available. [Self-contained](https://netdisco.org/) central server polls via SNMP — no per-device agents.',
		deploymentSources: [{ id: 12 }]
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
			'Self-hosted means you manage updates and the host it runs on. No cloud dashboard or team sharing features from the paid tiers.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted via [Docker, Proxmox, or Unraid](https://scanopy.net/community). One daemon, no external dependencies beyond PostgreSQL. Same discovery engine as Scanopy SaaS.',
		deploymentSources: [{ id: 19 }]
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
		vendors: ['nmap-zenmap', 'librenms', 'netdisco']
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
		vendors: ['librenms', 'netdisco', 'nmap-zenmap', 'scanopy-ce']
	}
];

export const honorableMentions =
	'**The Dude (MikroTik).** Free network mapping tool from MikroTik. Auto-discovers devices and draws a topology, but requires significant manual cleanup. Best for MikroTik-heavy environments. Loyal user base, but the tool is tightly coupled to the MikroTik ecosystem.\n\n**Graphviz / D3.js.** Rendering engines, not discovery tools. If you\'ve already got network data from another source (Nmap scans, SNMP polls, API calls), Graphviz and D3 can turn it into a diagram. This is the DIY path. Extremely flexible, significant engineering effort required.';

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
	},
	{
		id: 12,
		label: 'NetDisco - Documentation',
		url: 'https://metacpan.org/pod/App::Netdisco'
	},
	{
		id: 13,
		label: 'Paessler - PRTG System Requirements',
		url: 'https://www.paessler.com/prtg/requirements'
	},
	{
		id: 14,
		label: 'Domotz - Agentless Network Discovery',
		url: 'https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/'
	},
	{
		id: 15,
		label: 'ManageEngine - Agentless Monitoring',
		url: 'https://www.manageengine.com/network-monitoring/agentless-network-monitoring.html'
	},
	{
		id: 16,
		label: 'LibreNMS - Installation Guide',
		url: 'https://docs.librenms.org/Installation/Install-LibreNMS/'
	},
	{
		id: 17,
		label: 'Nmap - Download / Platforms',
		url: 'https://nmap.org/download'
	},
	{
		id: 18,
		label: 'Scanopy - Documentation',
		url: 'https://scanopy.net/docs'
	},
	{
		id: 19,
		label: 'Scanopy - Community Edition',
		url: 'https://scanopy.net/community'
	},
	{
		id: 20,
		label: 'Auvik - Cloud Collector Installation',
		url: 'https://support.auvik.com/hc/en-us/articles/206173816'
	},
	{
		id: 21,
		label: 'NetBrain - Discovering and Visualizing Public Cloud',
		url: 'https://www.netbraintech.com/docs/ie101/help/discovering-and-visualizing-public-cloud.htm'
	},
	{
		id: 22,
		label: 'Lucidscale - Automated Cloud Visualization',
		url: 'https://lucid.co/lucidscale/'
	}
];

export const vendorFAQs: VendorFAQ[] = [
	{
		question: 'What is the difference between a network diagram tool and a network monitoring tool?',
		answer: 'A network diagram tool discovers devices and connections, then produces a visual topology map. A monitoring tool tracks device health, bandwidth, and alerts over time. Some monitoring platforms (Auvik, PRTG, Domotz, ManageEngine) include basic mapping as a feature. Dedicated diagram tools (Scanopy, SolarWinds NTM, NetBrain) focus entirely on producing accurate, shareable maps without bundling monitoring.'
	},
	{
		question: 'How often should automated network diagrams be updated?',
		answer: 'It depends on how often your network changes. Tools like Scanopy, Auvik, and Domotz update maps continuously or on a schedule (hourly to daily). SolarWinds NTM runs on-demand scans. For most IT teams, daily or weekly updates catch device additions and topology changes. Environments with frequent changes (cloud, DevOps) benefit from continuous updates.'
	},
	{
		question: 'Can network diagram tools discover cloud infrastructure?',
		answer: 'Some can. Lucidscale (part of the Lucid suite) imports AWS, Azure, and GCP topology via cloud APIs. NetBrain and Auvik offer cloud API connectors for hybrid on-prem/cloud maps. Most on-prem-focused tools (SolarWinds NTM, PRTG, Domotz, LibreNMS, NetDisco) only discover devices reachable via SNMP, LLDP, or ARP on local networks.'
	},
	{
		question: 'Do I need SNMP enabled for automated network discovery?',
		answer: 'For most tools on this list, yes. SNMP provides device identity, interface details, and neighbor relationships via LLDP/CDP. Without SNMP, discovery is limited to IP-level scanning (ping sweeps, ARP). Nmap can identify services via port scanning without SNMP, but topology mapping relies on SNMP neighbor tables for accurate connection data.'
	},
	{
		question: 'What is the most common reason automated network diagrams are inaccurate?',
		answer: 'Incomplete SNMP coverage. If SNMP is not enabled on all managed devices, or if community strings are misconfigured, the tool only sees a partial network. Other common causes include firewalls blocking discovery traffic, unmanaged switches that do not respond to SNMP, and stale ARP caches on routers. Running a manual spot-check after initial discovery helps identify gaps.'
	},
	{
		question: 'How do network diagram tools handle VLANs and subnets?',
		answer: 'Tools using SNMP and LLDP/CDP can discover VLAN assignments and map devices to subnets automatically. SolarWinds NTM, NetBrain, and NetDisco are particularly strong at Layer 2 topology including VLAN boundaries. Monitoring-focused tools like Auvik and PRTG show VLAN data as part of device detail but may not visualize VLAN segmentation as a distinct diagram layer.'
	}
];
