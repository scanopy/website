import type { Vendor, VendorCategory, VendorSource, VendorFAQ } from '$lib/types';
import { getServiceCountLabel, getStartingMonthlyPrice } from '$lib/schemas';

const serviceCount = getServiceCountLabel();
const startingPrice = getStartingMonthlyPrice();

export const disclosureText =
	"Full disclosure: Scanopy is our product. We built this list to be useful whether you pick us or not. Vendor details are sourced from official documentation, published pricing, and community reports as of June 2026. Features, pricing, and capabilities may have changed since publication. Check each vendor's website for the latest information.";

export const vendors: Record<string, Vendor> = {
	scanopy: {
		name: 'Scanopy',
		slug: 'scanopy',
		href: '/',

		discovery: ['SNMP', 'LLDP', 'CDP', 'ARP', 'TCP/UDP'],
		services: { level: 'yes', detail: `${serviceCount} types`, detailHref: '/services' },
		autoUpdates: true,
		openSource: { status: 'osi', license: 'AGPL-3.0', href: '/community' },
		pricing: { text: `Starts at ${startingPrice} monthly, unlimited hosts`, href: '/pricing' },
		alsoIncludes: ['Docker Visualization'],
		viewTypes: {
			l2: 'yes',
			l3: 'yes',
			workload: 'yes',
			application: 'yes'
		},
		viewTypesSources: [{ id: 18 }],
		bestFor: 'IT teams and MSPs who want a dedicated network diagram automation tool which works alongside their existing monitoring platform',
		description:
			"Full disclosure: Scanopy is our product. We've tried to be honest about every tool on this list, including our own.\n\nScanopy is an [automated network documentation](/blog/automated-network-documentation) tool built for IT teams that need living network maps that work alongside their monitoring platform. It deploys a lightweight daemon that discovers your network and builds an interactive topology map that updates on a schedule. A single scan produces four views you can switch between: L2 physical, L3 logical, workloads, and applications.",
		discoveryNotes:
			'One daemon per network. No agents on endpoints, no SSH credentials. SNMPv1, v2c, and v3 (AuthPriv) are all supported, with credentials applied network-wide or pinned per host.',
		serviceDiscovery:
			`This is where Scanopy differs from most tools on this list. Beyond mapping devices and connections, Scanopy fingerprints [${serviceCount} service types](/services) per host: databases, web servers, DNS, DHCP, Docker containers, print services, and more. Most network mapping tools tell you a device exists at an IP address. Scanopy tells you what it's running. When you click a host on the topology map, you see every detected service, not just the host itself.`,
		diagrams:
			'One scan produces four interactive views you can switch between: L2 physical (switch ports and links), L3 logical (subnets and routing), workloads (Docker containers and what they run), and applications (services grouped into the apps they belong to). Topology snapshots version your network state over time, so you can see what changed between scans. Shareable via link (no per-seat licensing). Exportable as SVG, PNG, HTML, Confluence, Mermaid, and PDF. Embeddable via iframe.',
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
				'This is a live Scanopy map you can interact with.'
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
		pricing: { text: 'Perpetual ~$1,570 (subscription shift unclear)', sources: [{ id: 44 }] },
		viewTypes: {
			l2: 'yes',
			l3: 'yes',
			workload: 'unclear',
			application: 'no',
			note: 'L2 and L3 diagrams from a single scan.'
		},
		viewTypesSources: [{ id: 3 }],
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
		deploymentSources: [{ id: 3 }],
		versus:
			`SolarWinds NTM and Scanopy both scan a network over SNMP, CDP, and LLDP and turn it into topology diagrams, so on the surface they do the same job. The difference is what you get at the end. NTM is a [standalone Windows desktop application](https://www.solarwinds.com/network-topology-mapper) whose signature output is a Microsoft Visio export — it auto-populates Visio SmartShapes from the scan, and that single feature makes it the default in shops that standardize on Visio for compliance documentation. Scanopy is a web-based tool: one daemon discovers the network and produces an interactive map you open in a browser, share by link, embed via iframe, and export as SVG, PNG, HTML, Confluence, Mermaid, or PDF.

The real trade-off is a web-based living map versus Windows-bound Visio files, plus the product's trajectory. NTM has no web interface, no API, and no embeddable output, and its result is a static file you regenerate each time you rescan. It has also received only maintenance and security updates since roughly 2016 — SolarWinds staff [stated on the THWACK forum in 2017](https://thwack.solarwinds.com/products/network-topology-mapper-ntm/f/forum/13039/is-ntm-dead) that "there is no current roadmap for the product." If your deliverable is a Visio file for auditors, NTM is the better fit and the export is the whole reason to run it. If you want a shareable, browser-based map that refreshes on a schedule and isn't tied to Windows, Scanopy is the better fit, and it's [flat monthly with unlimited hosts](/pricing), [commercially self-hostable](/commercial), or free under [AGPL-3.0](/community).

Where NTM wins is that Visio export. Scanopy exports SVG, PNG, HTML, Confluence, Mermaid, and PDF, but not native Visio SmartShapes — and for an organization whose documentation standard is Visio, that one format can outweigh everything else.`
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
		viewTypes: {
			l2: 'yes',
			l3: 'yes',
			workload: 'yes',
			application: 'yes',
			note: 'Virtualization maps (ESXi/vSwitch/VM) and application-path mapping, all on one dynamic map.'
		},
		viewTypesSources: [{ id: 34 }, { id: 35 }, { id: 36 }],
		cloudDiscovery: {
			clouds: ['AWS', 'Azure', 'GCP'],
			hybrid: true,
			note: 'hybrid on-prem/cloud path mapping in one map',
			sources: [{ id: 21 }]
		},
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
		deploymentSources: [{ id: 21 }],
		versus:
			"NetBrain and Scanopy answer different questions. NetBrain is an enterprise network-automation platform: its dynamic maps cover L2, L3, virtualization (ESXi/vSwitch/VM), and application-path mapping, and they tie into troubleshooting runbooks and automation playbooks, so a map can trigger actions, not just display data. It is built for large, complex networks with thousands of devices and a team to run it. Scanopy is a focused documentation tool: it discovers your network and produces four switchable views (L2, L3, workloads, applications) plus per-host service fingerprinting, and it stops there. No automation engine, no runbooks.\n\nThe trade-off is scope, price, and effort. NetBrain is enterprise-priced (contact-sales only) and complex enough that a proper proof-of-concept is essential. Community experiences are polarized: some teams get excellent results, others have [struggled with map accuracy for years](https://www.reddit.com/r/networking/comments/uu3wyr/comment/i9duuiu/). Scanopy is [flat monthly with unlimited hosts](/pricing), self-hostable under a [commercial license](/commercial) or free under [AGPL-3.0](/community), and runs from one daemon with no platform to administer. If you need maps wired into operational automation across a large enterprise, NetBrain is the category leader and Scanopy is not a substitute. If you want accurate, living, shareable network documentation without standing up an automation platform, Scanopy is simpler and far cheaper.\n\nOn view coverage alone, NetBrain is one of the few tools here that produces all four view types, so it matches Scanopy there. The difference is everything around the map, not the map itself."
	},
	faddom: {
		name: 'Faddom',
		slug: 'faddom',
		href: 'https://faddom.com/',

		discovery: ['NetFlow/sFlow'],
		discoverySources: [{ id: 23 }],
		services: { level: 'basic', detail: 'app dependencies', sources: [{ id: 23 }] },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: 'Free up to 50 servers then from $19,000/yr', sources: [{ id: 24 }] },
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'unclear',
			application: 'yes',
			note: 'Application view is automatic, inferred from observed traffic (NetFlow/sFlow); does no network-layer L2/L3 topology.'
		},
		viewTypesSources: [{ id: 23 }],
		bestFor: 'Enterprise IT teams mapping application dependencies for data center migrations and cloud transitions',
		description:
			'Agentless [application dependency mapping](https://faddom.com/) (ADM) for hybrid and multi-cloud infrastructure. Faddom builds real-time maps of how servers, applications, and services depend on each other, aimed at data center migration, cloud transition planning, and change management. Its headline claim is a first map in under 60 minutes, and reviews corroborate the fast time-to-value.',
		discoveryNotes:
			'Discovery is agentless and credential-free. Instead of polling devices, Faddom observes network traffic ([NetFlow, sFlow, or a packet copy](https://faddom.com/)) to infer dependencies automatically. That means no agents to roll out, but it typically requires NetFlow/sFlow configuration or port mirroring, which needs network-team buy-in.',
		serviceDiscovery:
			'Faddom maps application dependencies (which services talk to which), not the device-level service fingerprinting that Scanopy or Nmap do. It enriches maps through integrations with Kubernetes and APM tools like Datadog.',
		diagrams:
			'Real-time application dependency graphs spanning on-prem, AWS, Azure, and GCP. It does not produce network-layer (Layer 2/3) topology — the focus is app-to-app relationships, not switch-port physical maps.',
		pricingNotes:
			'Pricing is public, which is rare in this category. A free Community tier covers up to 50 servers (described as "limited time access," so permanence is unclear). Paid plans start at $19,000/year for up to 300 servers (SMB tier) and scale to custom enterprise pricing. Modular: you pay for servers, modules, and users.',
		whereItFits:
			'Mid-to-large enterprise IT operations teams planning migrations or cloud moves who need an automatic picture of application dependencies without deploying agents. The public pricing and 50-server free tier make it evaluable without a sales process, which is unusual for ADM.',
		tradeOff:
			'ADM-only scope. No network-layer topology, no CMDB, ITAM, or service management ([per third-party analysis](https://virima.com/blog/faddom-solution-overview-top-alternatives)). Native ITSM integrations are limited to ServiceNow and Splunk. The traffic-capture dependency (NetFlow/sFlow or port mirroring) is a real setup hurdle, and the $19,000/year floor puts it out of reach for SMB and mid-market budgets.',
		tradeOffLabel: 'Trade-offs',
		deployment: ['Cloud', 'Self-hosted'],
		deploymentNotes:
			'Self-hosted appliance (on-prem or cloud), also available via the AWS, Azure, and GCP marketplaces. No per-host agents, but it needs access to network traffic.',
		versus:
			`Faddom and Scanopy sit in the same broad category — both can map application dependencies — but they get there from opposite directions, and they don't fully overlap. Faddom is a dedicated [agentless application dependency mapping](https://faddom.com/) (ADM) platform: it observes network traffic (NetFlow, sFlow, or a packet copy) and automatically infers which servers and services depend on each other, aimed at data-center migrations and cloud moves. It does no Layer 2/3 network topology at all — there are no switch-port or subnet maps. Scanopy comes at it from the other side: it maps L2 and L3 network topology, workloads, and applications, with the application view being user-defined grouping on top of automatic service discovery.

The trade-off is automatic app-dependency inference versus network topology and price. Faddom's free tier covers 50 servers, but paid plans [start at $19,000/year](https://faddom.com/pricing/), which puts it out of reach for SMB and mid-market budgets, and it needs NetFlow/sFlow or port mirroring to capture traffic. Scanopy is [flat monthly with unlimited hosts](/pricing), [commercially self-hostable](/commercial), or free under [AGPL-3.0](/community), needs no traffic-capture setup, and adds the network-layer views Faddom lacks. If you need automatic, traffic-derived application dependencies for a migration and can fund the price floor, Faddom is the better fit. If you need network topology plus application grouping in one affordable tool, Scanopy is.

On the application view itself, Faddom's automation is the stronger of the two, and it's worth saying plainly: Faddom builds the dependency map automatically from observed traffic, where Scanopy has you define the application grouping yourself on top of automatic service discovery. If you want the app map to draw itself — and you'll set up traffic capture — that's a real Faddom advantage. Scanopy's case isn't that it's uniquely four-view; it's that it covers all four views and stays affordable and self-hostable.`
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
		viewTypes: {
			l2: 'yes',
			l3: 'yes',
			workload: 'no',
			application: 'unclear',
			note: 'Discovers VMs and containers and shows them as nodes on the L2/L3 map, but no host-to-VM nesting view (VM detail lives in a monitoring dashboard).'
		},
		viewTypesSources: [{ id: 37 }, { id: 39 }],
		cloudDiscovery: {
			clouds: ['AWS', 'Azure', 'GCP'],
			hybrid: true,
			note: 'cloud APIs alongside on-prem collector',
			sources: [{ id: 20 }]
		},
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
		deploymentSources: [{ id: 20 }],
		versus:
			"Auvik and Scanopy both build live Layer 2/3 topology maps from SNMP, CDP, LLDP, and ARP, so on raw discovery they overlap. The difference is what each is built to be. Auvik is a monitoring-and-RMM platform: alerting, config backup, traffic analysis, and remote management, with topology mapping as one strong feature among many. Scanopy is a dedicated documentation tool. It maps and fingerprints services (databases, web servers, Docker containers, and more) and produces four switchable views (L2, L3, workloads, applications), but it does no monitoring or alerting.\n\nThat shapes the buying decision. Auvik prices per device and does not publish rates, so cost scales with your fleet and you request a quote. Scanopy is [flat monthly with unlimited hosts](/pricing), and there is a [commercial self-hosted edition](/commercial) or a free, self-hostable [AGPL-3.0 Community edition](/community). If you are an MSP that wants monitoring, alerting, and maps in one cloud platform, Auvik's bundle is the stronger fit, and its topology mapping is a real core feature, not an afterthought. If you already run a monitoring stack (LibreNMS, Zabbix, PRTG) and just need accurate, shareable, exportable documentation that isn't tied to a per-device monitoring bill, Scanopy sits alongside what you have rather than replacing it.\n\nOn views, Auvik covers L2 and L3 well and surfaces VMs and containers as nodes, but it has no host-to-VM workload-nesting view, and its application grouping is unclear from public docs. Scanopy adds the workload and application views. Neither tool replaces the other's primary job."
	},
	prtg: {
		name: 'PRTG',
		fullName: 'PRTG Network Monitor',
		slug: 'prtg',
		href: 'https://www.paessler.com/prtg',

		discovery: ['SNMP', 'WMI', 'ICMP'],
		discoverySources: [{ id: 13 }],
		services: { level: 'no' },
		autoUpdates: true,
		openSource: { status: 'no' },
		pricing: { text: 'Free up to 100 sensors then tiered', sources: [{ id: 4 }] },
		alsoIncludes: ['Monitoring', 'Traffic Analysis'],
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'unclear',
			application: 'no',
			note: 'No native auto L2/L3; automatic L2 maps require the third-party UVexplorer add-on.'
		},
		viewTypesSources: [{ id: 32 }],
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
		deploymentSources: [{ id: 13 }],
		versus:
			`PRTG and Scanopy both discover a network and draw maps, but they're built for different jobs. PRTG is a mature, sensor-based monitoring platform that's been around since 2003 with a large installed base; its maps exist to visualize what it monitors. It has no native automatic Layer 2/3 topology mapping, though — Paessler's own knowledge base states plainly that ["PRTG has no way of knowing which switch is connected to which so creating an automatic graph is not possible"](https://helpdesk.paessler.com/en/support/solutions/articles/76000082169-layer-network-map), and the documented fix is the third-party UVexplorer add-on. Scanopy's entire job is automatic topology: one daemon produces four switchable views (L2, L3, workloads, applications) plus per-host service fingerprinting, out of the box and with no add-on.

So the trade-off is monitoring-first with bolt-on mapping versus mapping-first as the product. If you already run PRTG and mainly want monitoring, alerting, and traffic analysis — with maps as a secondary view — staying in PRTG (and adding UVexplorer if you need real L2 maps) avoids another tool. If accurate, automatic, shareable, multi-view documentation is the actual goal, Scanopy is built for that and doesn't need a separate discovery engine to produce a topology. Scanopy is [flat monthly with unlimited hosts](/pricing), self-hostable under a [commercial license](/commercial), or free under [AGPL-3.0](/community), and it sits alongside PRTG rather than replacing your monitoring.

PRTG is also a much broader and more proven monitoring platform than Scanopy — two decades of development, a huge sensor library, and an installed base Scanopy can't claim. For monitoring, it wins outright. This comparison is only about which tool draws the network map, and that's Scanopy's automatic topology, not PRTG's.`
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
		viewTypes: {
			l2: 'yes',
			l3: 'unclear',
			workload: 'unclear',
			application: 'unclear',
			note: 'L2 map confirmed; L3/VLAN mapping is not documented in Domotz help docs.'
		},
		viewTypesSources: [{ id: 29 }],
		bestFor: 'Cost-conscious MSPs who need monitoring, remote access, and basic network maps at a transparent price',
		description:
			'The most affordable monitoring platform with network maps — best for cost-conscious MSPs. Domotz offers remote monitoring and management with network mapping, popular as a lower-cost Auvik alternative. A [single collector deployed to the client\'s network](https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/) provides a real-time inventory within minutes. No endpoint agents required.',
		discoveryNotes: 'Cloud-hosted with an on-site agent.',
		diagrams:
			'Auto-generated topology maps. Functional. The focus is remote access and monitoring, with mapping as a supporting feature.',
		pricingNotes:
			'Free tier covers 1 managed device with unlimited discovery. [Published and transparent](https://www.domotz.com/pricing/).',
		whereItFits:
			'MSPs who want monitoring, remote access, and basic network mapping at a fair price. Domotz is frequently recommended as a fair-priced option in MSP communities.',
		tradeOff:
			'Diagrams are secondary to remote access and monitoring. If documentation is your primary goal, the mapping features may not go deep enough.',
		deployment: ['Cloud'],
		deploymentNotes:
			'Cloud-hosted SaaS. [One collector per network](https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/) — runs on Linux, Raspberry Pi, Docker, or NAS. No endpoint agents.',
		deploymentSources: [{ id: 14 }],
		versus:
			`Domotz and Scanopy both run a single on-site collector and build a Layer 2 topology map with no endpoint agents, so for basic "what's on this network" mapping they overlap. They're built around different priorities, though. Domotz is a monitoring and remote-access platform — its headline value is monitoring, alerting, and secure remote connections into client devices, with [network topology](https://help.domotz.com/managing-your-account/network-topology/) as a supporting feature. Scanopy is a dedicated documentation tool: it fingerprints services per host and produces four switchable views (L2, L3, workloads, applications), and it does no monitoring or remote access at all.

The decision usually comes down to scope and price. Domotz is cheap and transparently priced at [$1.50/device/month](https://www.domotz.com/pricing/), which is why MSP communities consistently cite it as the most reasonably priced monitoring platform and the go-to lower-cost Auvik alternative. But its pricing is per-device, so a 100-device site is about $150/month, and the mapping sits behind remote access and monitoring. Scanopy is [flat monthly with unlimited hosts](/pricing) and has a [commercial self-hosted edition](/commercial) or a free, self-hostable [AGPL-3.0 Community edition](/community). If you want monitoring, remote access, and a basic map in one affordable platform, Domotz is the stronger pick. If you want deep, exportable, multi-view documentation that sits alongside whatever monitoring you already run, Scanopy is — and the two coexist cleanly on the same network.

On views, Domotz's Layer 2 map is confirmed in its help docs and does the job; the L3/VLAN mapping shows up in its marketing but isn't documented as an actual view, and there's no documented host-to-VM or application view. Scanopy adds L3, workloads, and applications — but Domotz does the monitoring and remote access that Scanopy doesn't touch.`
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
		viewTypes: {
			l2: 'yes',
			l3: 'yes',
			workload: 'yes',
			application: 'no',
			note: 'Host-to-VM and VM-to-datastore virtualization maps.'
		},
		viewTypesSources: [{ id: 27 }, { id: 38 }],
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
		deploymentSources: [{ id: 15 }],
		versus:
			`OpManager and Scanopy overlap more than most pairings on this list. Both auto-discover L2 and L3 topology over SNMP, CDP, LLDP, and ARP, and — unusually — both produce a workload view: OpManager maps [host-to-VM, VM-to-datastore, and host-to-network relationships](https://www.manageengine.com/network-monitoring/vmware-monitoring.html) through its virtualization maps, which matches Scanopy's workload view. The difference is the category. OpManager is a full monitoring platform (it happens to have unusually deep visualization, including rack and floor-plan views most monitoring tools lack), while Scanopy is a dedicated documentation tool with per-host service fingerprinting and no monitoring, alerting, or polling.

The trade-off is platform versus focus, and price. OpManager is self-hosted on Windows or Linux, is cheap ([from about $95/year for 10 devices](https://www.manageengine.com/network-monitoring/opmanager-editions.html)), scales to tens of thousands of devices, and bundles monitoring you may want anyway. Scanopy is [flat monthly with unlimited hosts](/pricing), self-hostable under a [commercial license](/commercial) or free under [AGPL-3.0](/community), and adds an application-dependency view OpManager doesn't have. If you want monitoring plus strong built-in visualization at a low per-device cost, OpManager is the better fit. If you want documentation that's independent of your monitoring stack — and an application view — Scanopy fits alongside it. Monitor with OpManager, document with Scanopy.

OpManager keeps pace with Scanopy on L2, L3, and the workload (host-to-VM) view, and its rack and floor-plan views are something Scanopy doesn't offer at all. Scanopy pulls ahead in two places: the application-dependency view and per-host service fingerprinting. OpManager has no application-grouping map.`
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
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'The Zenmap topology tab is a traceroute hop graph, not an L2 or L3 map.'
		},
		viewTypesSources: [{ id: 17 }],
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
		viewTypes: {
			l2: 'yes',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'L2 map built from xDP (CDP/LLDP) and ARP; no L3 subnet map.'
		},
		viewTypesSources: [{ id: 30 }],
		bestFor: 'Teams with Linux skills that want free, self-hosted monitoring with basic topology visualization',
		description:
			'The best free self-hosted monitoring option, with limited mapping. LibreNMS is open-source network monitoring with auto-discovery. Topology mapping is secondary and manual: the legacy Weathermap plugin is deprecated (it does not run on supported PHP versions), so mapping uses the Custom Maps feature. [Requires PHP 8.2+ and MariaDB](https://docs.librenms.org/Installation/Install-LibreNMS/) on Linux. Central server polls devices via SNMP — no per-device agents required.',
		discoveryNotes: undefined,
		diagrams:
			'Topology visualization is a secondary feature. The legacy [Network Weathermap](https://docs.librenms.org/Extensions/Weathermap/) plugin is deprecated and does not work on supported PHP versions, so LibreNMS points users to its Custom Maps feature, where the layout is placed by hand. New devices are not added to the map automatically.',
		whereItFits:
			"Teams with Linux server management skills that want free monitoring with some topology visualization. If you're already running LibreNMS for monitoring, the weathermap plugin adds basic mapping without another tool.",
		tradeOff:
			'Topology visualization is a community plugin, not a first-class feature. Setup requires Linux, PHP, and database administration. The monitoring side is strong; the diagramming side is minimal.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on [Linux (Ubuntu, Debian, CentOS)](https://docs.librenms.org/Installation/Install-LibreNMS/). Docker available. Requires MariaDB and PHP 8.2+. Central server polls via SNMP — no per-device agents.',
		deploymentSources: [{ id: 16 }],
		versus:
			`LibreNMS and Scanopy CE are both free and self-hosted, so that's the fair matchup here — [Scanopy's AGPL-3.0 Community edition](/community), not the paid product. LibreNMS is GPL-licensed, self-hosted network monitoring: strong SNMP auto-discovery, alerting, and graphing, with topology visualization as a secondary, plugin-based feature. Scanopy is dedicated documentation: one daemon, four switchable views (L2, L3, workloads, applications), and per-host service fingerprinting, with no monitoring or alerting.

The practical difference is what the mapping costs you in effort. LibreNMS's topology comes from the Weathermap plugin, which [the LibreNMS docs say "does not work on any supported versions of PHP" and recommend against](https://docs.librenms.org/Extensions/Weathermap/), pointing users to Custom Maps where the layout is hand-placed rather than generated. Standing it up also means managing Linux, PHP 8.2+, and MariaDB. Scanopy's map is automatic and is the core product, not a plugin. If you want free, self-hosted monitoring and you're comfortable administering the stack, LibreNMS is excellent and the maps are a bonus. If you want automatic network documentation that refreshes on a schedule without manual map layout, Scanopy CE is the closer fit — and it pairs naturally with LibreNMS if you want both.

LibreNMS has years of development behind it and an active community, and Scanopy does no monitoring — it isn't trying to replace it. For the documentation side specifically, Scanopy's automatic multi-view map is the stronger tool; for free self-hosted monitoring, LibreNMS is the one to beat.`
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
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'Manual diagramming only, no discovery.'
		},
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

		discovery: [],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'no' },
		pricing: { text: 'From $9/user/mo', sources: [{ id: 11 }] },
		viewTypes: {
			l2: 'no',
			l3: 'unclear',
			workload: 'unclear',
			application: 'unclear',
			note: 'Auto-views come only from the Lucidscale cloud import (AWS/Azure/GCP), not on-prem topology.'
		},
		viewTypesSources: [{ id: 33 }],
		cloudDiscovery: {
			clouds: ['AWS', 'Azure', 'GCP'],
			hybrid: false,
			note: 'imports cloud topology; no on-prem discovery',
			sources: [{ id: 22 }]
		},
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
		viewTypes: {
			l2: 'yes',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'Layer 1/2 neighbor map (CDP/LLDP); explicitly no L3 routing or subnet mapping.'
		},
		viewTypesSources: [{ id: 31 }],
		bestFor: 'Network teams that want free, open-source Layer 2 topology discovery and device tracking',
		description:
			'The most-recommended open-source network discovery tool in sysadmin and networking communities. NetDisco is a web-based network management tool that discovers devices via SNMP and maps Layer 2 topology using CDP and LLDP neighbor data. Originally developed at the [University of California, Santa Cruz](https://en.wikipedia.org/wiki/Netdisco), actively maintained since 2003.',
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
		deploymentSources: [{ id: 12 }],
		versus:
			`NetDisco and Scanopy both discover devices over SNMP and read CDP/LLDP neighbor data, and both are open source. NetDisco focuses on Layer 2: it collects IP and MAC data into PostgreSQL and answers "what device is on which switch port?" — search a MAC or IP and it shows the exact switch and port, which makes it a long-running favorite for tracking down endpoints and auditing port usage. Scanopy does that same Layer 2 work — switch, port, and MAC/IP visualization — from a single scan, and adds three more views (L3, workloads, applications) plus per-host service fingerprinting on top.

The real difference is scope and setup, not Layer 2 capability. NetDisco is free (BSD-licensed) but it's Perl and PostgreSQL on Linux, and it's [Layer 1/2 only — no L3 routing or subnet mapping](https://github.com/netdisco/netdisco/wiki/Network-Map). Scanopy is [flat monthly with unlimited hosts](/pricing), [commercially self-hostable](/commercial), or free under [AGPL-3.0](/community), runs from one daemon, and covers L3, workloads, and applications alongside the same switch-port and MAC/IP data. If switch-port and MAC tracking is all you need and you're happy administering Perl and Postgres, NetDisco does it well. If you want that Layer 2 visibility plus L3, workload, and application views in one tool you don't have to hand-assemble, Scanopy is the broader fit.

On Layer 2 itself the two land in the same place — switch, port, MAC, IP. What you're really choosing is whether you also want L3, workloads, and applications in the same map (Scanopy), or a focused, free, self-hosted Layer 2 tool you run entirely yourself (NetDisco), which has done that one job well since 2003.`
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
		viewTypes: {
			l2: 'yes',
			l3: 'yes',
			workload: 'yes',
			application: 'yes',
			note: 'Same engine and four views as Scanopy SaaS; application view is user-defined.'
		},
		viewTypesSources: [{ id: 19 }],
		bestFor: 'Teams that want automated network documentation on their own infrastructure with no SaaS dependency',
		description:
			"The best free self-hosted option for automated network documentation. Scanopy CE is the free, self-hosted edition with the same discovery engine as the paid product — SNMP, LLDP, CDP, ARP — with an interactive topology map and service detection. Open source and runs on your own hardware.",
		discoveryNotes: 'One daemon, no per-device agents.',
		diagrams:
			'Interactive topology map with service and interface detail. Exportable as SVG, PNG, HTML, Confluence, Mermaid, and PDF.',
		pricingNotes:
			'Free to [self-host](/community), capped at one network and one seat. A [commercial license](/commercial) lifts those caps for business self-hosting; [managed cloud plans](/pricing) are available too.',
		whereItFits:
			'Teams that want automated network documentation on their own infrastructure with no SaaS dependency. The free Community edition is AGPL-3.0 and limited to a single network and a single seat; teams that need more take a [commercial self-host license](/commercial) or move to the [managed cloud plans](/pricing).',
		tradeOff:
			'Self-hosted, so you manage updates and the host it runs on. The Community edition is AGPL-3.0 and capped at one network and one seat; a [commercial license](/commercial) removes those caps for business self-hosting, with [managed cloud hosting](/pricing) as a separate option.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted via [Docker, Proxmox, or Unraid](https://scanopy.net/community). One daemon, no external dependencies beyond PostgreSQL. Same discovery engine as Scanopy SaaS.',
		deploymentSources: [{ id: 19 }]
	},
	netbox: {
		name: 'NetBox',
		slug: 'netbox',
		href: 'https://netboxlabs.com/',

		discovery: ['ICMP', 'SNMP', 'SSH/CLI'],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'osi', license: 'Apache-2.0', href: 'https://github.com/netbox-community/netbox' },
		pricing: { text: 'Cloud and Enterprise: contact sales', sources: [{ id: 42 }] },
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'Topology visualization comes from community plugins (e.g. netbox-topology-views), not core NetBox.'
		},
		viewTypesSources: [{ id: 40 }, { id: 41 }],
		bestFor: 'Network and automation teams building a structured source of truth to drive Ansible, Nornir, or Terraform',
		description:
			'The de facto network source of truth (NSoT), combining DCIM and IPAM. NetBox models the intended state of your network (what it should be) and exposes it through a structured data model and REST and GraphQL API. NetBox Labs also ships NetBox Discovery, an open-source scanning agent that captures operational state and validates it against that intended design. What NetBox does not do natively is visualize your network: topology maps come from community plugins, not the core product.',
		discoveryNotes:
			'NetBox core models intended state and does not scan, but NetBox Labs ships [NetBox Discovery](https://netboxlabs.com/blog/announcing-netbox-discovery-infrastructure-design-operational-reality/), an open-source agent that actively scans for hosts and services and captures device configs, interfaces, and operational state via ICMP, SNMP, SSH, and NETCONF, feeding it into the NetBox model and validating drift against intended design. You can also populate NetBox manually, through its REST and GraphQL API, or with feeders like SlurpIT.',
		diagrams:
			'No native topology visualization. Community plugins render maps from NetBox data: [netbox-topology-views](https://github.com/netbox-community/netbox-topology-views) (the most popular, drawing topology from your cable records) and Network Canvas (L2 and L3). Core NetBox provides rack elevations and cable traces, not an auto-generated topology map.',
		pricingNotes:
			'Paid NetBox Cloud and Enterprise tiers (contact sales) add managed hosting, NetBox Discovery orchestration and Assurance, enhanced AI (write actions with human-in-the-loop approval, higher AI-credit limits), and support. The open-source Community edition is free to self-host, and NetBox Copilot (free tier) and the open-source MCP server work with it too.',
		whereItFits:
			'Network automation teams that need a structured source of truth feeding Ansible, Nornir, or Terraform. It pairs naturally with a discovery tool that keeps it populated.',
		tradeOff:
			'No native topology visualization (maps come from community plugins, not the core product). Steep learning curve, and overkill for small networks. NetBox is a source of truth and API, not a diagram tool, even with NetBox Discovery feeding it operational data.',
		tradeOffLabel: 'Trade-offs',
		deployment: ['Self-hosted', 'Cloud'],
		deploymentNotes:
			'Self-hosted (Python and PostgreSQL, Docker image available) for the Community edition, or managed via NetBox Cloud and NetBox Enterprise.',
		deploymentSources: [{ id: 43 }],
		versus:
			`Scanopy and NetBox serve different primary purposes, and they overlap in part. NetBox is a source of truth: it models the intended state of your network (every device, rack, IP, VLAN, and cable) as structured data behind a REST and GraphQL API, and it is the de facto standard for automation teams feeding Ansible, Nornir, and Terraform. Scanopy is a documentation tool: it discovers the operational state of your network and visualizes it as four switchable views (L2, L3, workloads, applications), with per-host service detection.

Both can discover the network. NetBox Labs ships [NetBox Discovery](https://netboxlabs.com/blog/announcing-netbox-discovery-infrastructure-design-operational-reality/), an open-source agent that actively scans for hosts and services and captures device configs and operational state, then validates that reality against the intended design. So on the discovery layer, NetBox and Scanopy overlap. Scanopy is not a full DCIM/IPAM source of truth, though: it does not model intended state, racks, circuits, or power.

Where they clearly differ is the output. NetBox Discovery feeds NetBox's data model and flags drift; it does not produce topology maps, and NetBox's visualization is plugin-based ([netbox-topology-views](https://github.com/netbox-community/netbox-topology-views)). Scanopy's core output is the interactive, living map itself. So the decision: if you want a structured source of truth that automation consumes and that continuously validates against intended design, NetBox (with Discovery) is the platform. If you want an automatic, up-to-date visual map of what is actually on your network, Scanopy is built for that and is not trying to be your data model. The two can also work together, with Scanopy as one way to keep NetBox populated.`
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
		vendors: ['scanopy', 'solarwinds-ntm', 'netbrain', 'faddom']
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
		intro: 'These exist specifically to discover and map networks or the applications running on them. Not monitoring platforms. No alerting, no traffic analysis, no config backup. Their entire purpose is producing accurate diagrams.',
		hasAlsoIncludes: false,
		vendors: ['solarwinds-ntm', 'scanopy', 'netbrain', 'faddom']
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
		url: 'https://www.netbrain.com/docs/ie101/help/discovering-and-visualizing-public-cloud.htm'
	},
	{
		id: 22,
		label: 'Lucidscale - Automated Cloud Visualization',
		url: 'https://lucid.co/lucidscale/'
	},
	{
		id: 23,
		label: 'Faddom - Agentless Application Dependency Mapping',
		url: 'https://faddom.com/'
	},
	{
		id: 24,
		label: 'Faddom - Pricing',
		url: 'https://faddom.com/pricing/'
	},
	{
		id: 25,
		label: 'NetBrain - Discovering and Visualizing Virtualization (ESXi host, vSwitch, VM)',
		url: 'https://www.netbrain.com/docs/ie101/help/discovering-and-visualizing-virtualization.htm'
	},
	{
		id: 26,
		label: 'Auvik - How does Auvik discover network topology and device information? (L1/L2/L3, ESXi host-to-VM)',
		url: 'https://support.auvik.com/hc/en-us/articles/202956414'
	},
	{
		id: 27,
		label: 'ManageEngine OpManager - Layer 2 Maps',
		url: 'https://www.manageengine.com/network-monitoring/help/layer2-maps.html'
	},
	{
		id: 28,
		label: 'ManageEngine OpManager - VMware Monitoring (host-to-VM, VM-to-datastore maps)',
		url: 'https://www.manageengine.com/network-monitoring/vmware-monitoring.html'
	},
	{
		id: 29,
		label: 'Domotz - Network Topology Mapping (VLAN/subnet, L2/L3)',
		url: 'https://help.domotz.com/managing-your-account/network-topology/'
	},
	{
		id: 30,
		label: 'LibreNMS - Network Map (Layer 2 links via xDP and ARP)',
		url: 'https://docs.librenms.org/Extensions/Network-Map/'
	},
	{
		id: 31,
		label: 'NetDisco - Network Map (layer1/layer2, not L3 routing/subnets)',
		url: 'https://github.com/netdisco/netdisco/wiki/Network-Map'
	},
	{
		id: 32,
		label: 'Paessler - PRTG has no native Layer 2 topology mapping (use UVexplorer)',
		url: 'https://helpdesk.paessler.com/en/support/solutions/articles/76000082169'
	},
	{
		id: 33,
		label: 'Lucid - Lucidscale cloud visualization (cloud-only, no on-prem topology)',
		url: 'https://help.lucid.co/hc/en-us/articles/16080567251604'
	},
	{
		id: 34,
		label: 'NetBrain - Dynamic Map (Layer 2 and Layer 3 topology)',
		url: 'https://www.netbrain.com/features/dynamic-map/'
	},
	{
		id: 35,
		label: 'NetBrain - Visualize VMware vCenter Networks (ESXi host and VM relationships on dynamic maps)',
		url: 'https://www.netbrain.com/docs/12tp0fe0ge/help/HTML/visualize-vmware-vcenter-networks-1.html'
	},
	{
		id: 36,
		label: 'NetBrain - Mapping Application Dependencies (A/B Path traffic-flow map)',
		url: 'https://www.netbrain.com/blog/mapping-application-dependencies-b-path/'
	},
	{
		id: 37,
		label: 'Auvik - Network Topology Mapper (visualizes physical wiring, VLANs, VMs, containers)',
		url: 'https://www.auvik.com/network-management-software/use-case/network-topology-mapper/'
	},
	{
		id: 38,
		label: 'ManageEngine OpManager - Virtual Maps (Host-to-VM, Host-to-Datastore)',
		url: 'https://www.manageengine.com/network-monitoring/faq/customize-vmmaps.html'
	},
	{
		id: 39,
		label: 'Auvik - VMware hypervisor dashboard (VMs listed in a dashboard, not a host-to-VM nesting map)',
		url: 'https://support.auvik.com/hc/en-us/articles/206616706-What-can-I-see-on-a-VMware-hypervisor-dashboard'
	},
	{
		id: 40,
		label: 'NetBox - Network Source of Truth (DCIM and IPAM)',
		url: 'https://netboxlabs.com/products/netbox/'
	},
	{
		id: 41,
		label: 'NetBox - Topology visualization via community plugin (netbox-topology-views)',
		url: 'https://github.com/netbox-community/netbox-topology-views'
	},
	{
		id: 42,
		label: 'NetBox Labs - Pricing (Cloud and Enterprise contact sales)',
		url: 'https://netboxlabs.com/pricing/'
	},
	{
		id: 43,
		label: 'NetBox - Open source (Apache-2.0), GitHub',
		url: 'https://github.com/netbox-community/netbox'
	},
	{
		id: 44,
		label: 'SolarWinds NTM - Pricing (TrustRadius)',
		url: 'https://www.trustradius.com/products/solarwinds-network-topology-mapper/pricing'
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
