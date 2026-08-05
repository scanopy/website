import type { Vendor, VendorCategory, VendorSource, VendorFAQ } from '$lib/types';
import { getServiceCountLabel, getStartingMonthlyPrice } from '$lib/schemas';

const serviceCount = getServiceCountLabel();
const startingPrice = getStartingMonthlyPrice();

export const disclosureText =
	"Scanopy is our product. Vendor details are sourced from official documentation, published pricing, and community reports as of June 2026. Features, pricing, and capabilities may have changed since publication. Check each vendor's website for the latest information.";

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
		bestFor:
			'IT teams and MSPs who want a dedicated network diagram automation tool which works alongside their existing monitoring platform',
		description:
			'Scanopy is our product. It is an [automated network documentation](/blog/automated-network-documentation) tool built for IT teams that need living network maps that work alongside their monitoring platform. It deploys a lightweight daemon that discovers your network and builds an interactive topology map that updates on a schedule. A single scan produces four views you can switch between: L2 physical, L3 logical, workloads, and applications.',
		discoveryNotes:
			'One daemon per network. No agents on endpoints, no SSH credentials. SNMPv1, v2c, and v3 (AuthPriv) are all supported, with credentials applied network-wide or pinned per host.',
		serviceDiscovery: `Beyond mapping devices and connections, Scanopy fingerprints [${serviceCount} service types](/services) per host: databases, web servers, DNS, DHCP, Docker containers, print services, and more. Most network mapping tools report only that a host is reachable at an IP address. Scanopy reports the services running on it. When you click a host on the topology map, you see every detected service, not just the host itself.`,
		diagrams:
			'One scan produces four interactive views you can switch between: L2 physical (switch ports and links), L3 logical (subnets and routing), workloads (Docker containers and what they run), and applications (services grouped into the apps they belong to). Topology snapshots version your network state over time, so you can see what changed between scans. Shareable via a read-only link that stays current as the network rescans (no per-seat licensing). Embeddable via iframe. Exportable as PNG, SVG, PDF, HTML, Mermaid, Confluence, and CSV.',
		pricingNotes: 'Free self-hosted [Community edition](/community) available.',
		whereItFits:
			'MSPs documenting client networks, IT teams that need documentation independent from their monitoring stack, and anyone who wants network maps without deploying another monitoring platform. Pairs well with whatever monitoring tool you already use.',
		tradeOff:
			"Monitoring, alerting, traffic analysis, config backup, patch management, software license tracking. It's a documentation tool. If you need monitoring, use a monitoring tool alongside it.",
		tradeOffLabel: "What Scanopy doesn't do",
		deployment: ['Cloud', 'Self-hosted'],
		deploymentNotes:
			'Cloud-hosted SaaS or [self-hosted via Docker](https://scanopy.net/community). One daemon per network, with no agents on endpoints and no inbound firewall rules.',
		deploymentSources: [{ id: 19 }],
		iframe: {
			src: 'https://demo.scanopy.net/share/a1b2c3d4-e5f6-7890-abcd-ef1234567890/embed?theme=dark',
			width: '800px',
			height: '600px',
			caption: 'This is a live Scanopy map you can interact with.'
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
		bestFor:
			'Enterprise teams that standardize on Microsoft tools and need Visio-native network diagram exports',
		description:
			'Best for organizations that need compliance-ready Visio exports. NTM scans your network and generates topology diagrams exportable to Visio, PDF, and PNG. It is a standalone Windows application, separate from the SolarWinds Observability platform.',
		discoveryNotes:
			'Scan-on-demand (not continuous). Supports scheduled scans. Also discovers VMware and Hyper-V environments.',
		diagrams:
			'Multiple diagram types from a single scan (Layer 2, Layer 3, physical). Exports to Visio with auto-populated SmartShapes, plus PNG, PDF, and the SolarWinds Orion Network Atlas format. No SVG, no Mermaid, no embeddable or iframe output, and no API access to the map data. NTM is a standalone product that cannot be installed on the same server as the SolarWinds Platform, and its Network Atlas export is one-way.',
		pricingNotes:
			'SolarWinds moved to subscription-only licensing across its product line in 2025. Renewal prices have reportedly increased significantly post-acquisition by Turn/River Capital.',
		whereItFits:
			'Enterprise teams that need compliance-ready documentation with Visio exports. The Visio export alone makes it the default choice in organizations that standardize on Microsoft tools.',
		tradeOff:
			'Requires Windows (.NET 3.5 and 4.8). No web-based access, no embeddable maps, no API. NTM has received only maintenance updates since roughly 2016, with no new discovery or mapping features. SolarWinds staff confirmed in 2017 that there is no product roadmap, and [NTM 2.2.x reaches full end-of-life in September 2026](https://documentation.solarwinds.com/en/success_center/ntm/content/release_notes/release_history.htm). Active development has shifted to SolarWinds Observability, whose NPM module carries its own topology views. NTM holds a [4.1 out of 5 on G2](https://www.g2.com/products/solarwinds-network-topology-mapper/reviews), where the most common request is exactly this integration; the product still works, but reviewers cite the lack of new features as the reason they look elsewhere. SolarWinds disclosed a supply-chain compromise in 2020, though NTM is a separate, much simpler product.',
		tradeOffLabel: 'Trade-offs',
		deployment: ['Desktop'],
		deploymentNotes:
			"Windows desktop application. Requires .NET 3.5 and 4.8. No web interface, no cloud option. Scans from the machine it's installed on.",
		deploymentSources: [{ id: 3 }],
		versus: `SolarWinds NTM and Scanopy both scan a network over SNMP, CDP, and LLDP and turn it into topology diagrams. The difference is what you get at the end. NTM is a [standalone Windows desktop application](https://www.solarwinds.com/network-topology-mapper) whose signature output is a Microsoft Visio export: it auto-populates Visio SmartShapes from the scan, which is why it is the default in shops that standardize on Visio for compliance documentation. Scanopy is a web-based tool: one daemon discovers the network and produces an interactive map you open in a browser, share by read-only link, embed via iframe, and export as PNG, SVG, PDF, HTML, Mermaid, Confluence, or CSV.

The trade-off is a web-based living map versus Windows-bound Visio files, plus the product's trajectory. NTM has no web interface, no API, and no embeddable output, and its result is a static file you regenerate each time you rescan. It has also received only maintenance and security updates since roughly 2016. SolarWinds staff [stated on the THWACK forum in 2017](https://thwack.solarwinds.com/products/network-topology-mapper-ntm/f/forum/13039/is-ntm-dead) that "there is no current roadmap for the product." If your deliverable is a Visio file for auditors, NTM produces it natively and Scanopy does not. If you want a shareable, browser-based map that refreshes on a schedule and isn't tied to Windows, Scanopy is [flat monthly with unlimited hosts](/pricing), [commercially self-hostable](/commercial), or free under [AGPL-3.0](/community).

Native Visio SmartShapes is the one export format NTM produces and Scanopy does not. For an organization whose documentation standard is Visio, that format decides the choice.`
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
		bestFor:
			'Large enterprises that need network maps integrated with automation and troubleshooting workflows',
		description:
			"The only tool on this list built for large-scale network automation. Enterprise-grade dynamic network mapping with troubleshooting workflows. NetBrain maps are wired into its automation platform's runbooks and playbooks.",
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
			'On-premises server or [NetBrain-hosted cloud](https://www.netbrain.com/). Central server polls devices via SNMP and SSH/CLI, with no per-device agents.',
		deploymentSources: [{ id: 21 }],
		versus:
			"NetBrain is an enterprise network-automation platform; Scanopy is a documentation tool. NetBrain's dynamic maps cover L2, L3, virtualization (ESXi/vSwitch/VM), and application-path mapping, and they tie into troubleshooting runbooks and automation playbooks, so a map can trigger actions, not just display data. It is built for large, complex networks with thousands of devices and a team to run it. Scanopy discovers your network and produces four switchable views (L2, L3, workloads, applications) plus per-host service fingerprinting, and it stops there. No automation engine, no runbooks.\n\nThe trade-off is scope, price, and effort. NetBrain is enterprise-priced (contact-sales only) and complex enough that a proper proof-of-concept is essential. Community experiences are polarized: some teams get excellent results, others have [struggled with map accuracy for years](https://www.reddit.com/r/networking/comments/uu3wyr/comment/i9duuiu/). Scanopy is [flat monthly with unlimited hosts](/pricing), self-hostable under a [commercial license](/commercial) or free under [AGPL-3.0](/community), and runs from one daemon with no platform to administer. NetBrain wires maps into operational automation across a large enterprise; Scanopy does not. Scanopy produces living, shareable network documentation without an automation platform to stand up.\n\nOn view coverage, NetBrain is one of the few tools here that produces all four view types, so it matches Scanopy there. The difference is everything around the map, not the map itself."
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
		bestFor:
			'Enterprise IT teams mapping application dependencies for data center migrations and cloud transitions',
		description:
			'Agentless [application dependency mapping](https://faddom.com/) (ADM) for hybrid and multi-cloud infrastructure. Faddom builds real-time maps of how servers, applications, and services depend on each other, aimed at data center migration, cloud transition planning, and change management. Its headline claim is a first map in under 60 minutes, and reviews corroborate the fast time-to-value.',
		discoveryNotes:
			'Discovery is agentless and credential-free. Instead of polling devices, Faddom observes network traffic ([NetFlow, sFlow, or a packet copy](https://faddom.com/)) to infer dependencies automatically. That means no agents to roll out, but it typically requires NetFlow/sFlow configuration or port mirroring, which needs network-team buy-in.',
		serviceDiscovery:
			'Faddom maps application dependencies (which services talk to which), not the device-level service fingerprinting that Scanopy or Nmap do. It enriches maps through integrations with Kubernetes and APM tools like Datadog.',
		diagrams:
			'Real-time application dependency graphs spanning on-prem, AWS, Azure, and GCP. It does not produce network-layer (Layer 2/3) topology: the focus is app-to-app relationships, not switch-port physical maps.',
		pricingNotes:
			'Pricing is public, which is rare in this category. A free Community tier covers up to 50 servers (described as "limited time access," so permanence is unclear). Paid plans start at $19,000/year for up to 300 servers (SMB tier) and scale to custom enterprise pricing. Modular: you pay for servers, modules, and users.',
		whereItFits:
			'Mid-to-large enterprise IT operations teams planning migrations or cloud moves who need an automatic picture of application dependencies without deploying agents. The public pricing and 50-server free tier make it evaluable without a sales process, which is unusual for ADM.',
		tradeOff:
			'ADM-only scope. No network-layer topology, no CMDB, ITAM, or service management ([per third-party analysis](https://virima.com/blog/faddom-solution-overview-top-alternatives)). Native ITSM integrations are limited to ServiceNow and Splunk. Traffic capture requires NetFlow/sFlow configuration or port mirroring, and the $19,000/year floor puts it out of reach for SMB and mid-market budgets.',
		tradeOffLabel: 'Trade-offs',
		deployment: ['Cloud', 'Self-hosted'],
		deploymentNotes:
			'Self-hosted appliance (on-prem or cloud), also available via the AWS, Azure, and GCP marketplaces. No per-host agents, but it needs access to network traffic.',
		versus: `Faddom and Scanopy both map application dependencies, but they get there from opposite directions and they don't fully overlap. Faddom is a dedicated [agentless application dependency mapping](https://faddom.com/) (ADM) platform: it observes network traffic (NetFlow, sFlow, or a packet copy) and automatically infers which servers and services depend on each other, aimed at data-center migrations and cloud moves. It produces no Layer 2/3 network topology: there are no switch-port or subnet maps. Scanopy maps L2 and L3 network topology, workloads, and applications, with the application view being user-defined grouping on top of automatic service discovery.

The trade-off is automatic app-dependency inference versus network topology and price. Faddom's free tier covers 50 servers, but paid plans [start at $19,000/year](https://faddom.com/pricing/), which puts it out of reach for SMB and mid-market budgets, and it needs NetFlow/sFlow or port mirroring to capture traffic. Scanopy is [flat monthly with unlimited hosts](/pricing), [commercially self-hostable](/commercial), or free under [AGPL-3.0](/community), needs no traffic-capture setup, and adds the network-layer views Faddom lacks. If you need automatic, traffic-derived application dependencies for a migration and can fund the price floor, Faddom is the better fit. If you need network topology plus application grouping in one affordable tool, Scanopy is.

On the application view, Faddom infers the dependency map from observed traffic with no user-defined grouping; Scanopy has you define the application grouping yourself on top of automatic service discovery. If you want the dependency map derived automatically and you can set up traffic capture, Faddom does that and Scanopy does not. Scanopy covers all four views, at flat pricing, and is self-hostable.`
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
			'Auvik does not publish pricing. Multiple device categories (network infrastructure, endpoints, servers) are charged at different rates, so current pricing requires a quote.',
		whereItFits:
			"If you're an MSP that needs monitoring, alerting, config backup, and network maps in one platform, Auvik is a strong option. Auvik renders L2 and L3 with device grouping and live link status.",
		tradeOff:
			"Documentation is coupled to Auvik's per-device pricing and platform. If you already run a different monitoring stack (LibreNMS, Zabbix, PRTG), adding Auvik for diagrams means paying for monitoring capabilities you already have.",
		deployment: ['Cloud'],
		deploymentNotes:
			"Cloud-hosted SaaS. One [collector deployed per network site](https://support.auvik.com/hc/en-us/articles/206173816) forwards data to Auvik's platform. No software on monitored devices.",
		deploymentSources: [{ id: 20 }],
		versus:
			"Auvik and Scanopy both build live Layer 2/3 topology maps from SNMP, CDP, LLDP, and ARP, so on raw discovery they overlap. The difference is what each is built to be. Auvik is a monitoring-and-RMM platform: alerting, config backup, traffic analysis, and remote management, with topology mapping as one feature among many. Scanopy is a dedicated documentation tool. It maps and fingerprints services (databases, web servers, Docker containers, and more) and produces four switchable views (L2, L3, workloads, applications), but it does no monitoring or alerting.\n\nThat shapes the buying decision. Auvik prices per device and does not publish rates, so cost scales with your fleet and you request a quote. Scanopy is [flat monthly with unlimited hosts](/pricing), and there is a [commercial self-hosted edition](/commercial) or a free, self-hostable [AGPL-3.0 Community edition](/community). If you are an MSP that wants monitoring, alerting, and maps in one cloud platform, Auvik bundles all three and Scanopy does not. If you already run a monitoring stack (LibreNMS, Zabbix, PRTG) and just need accurate, shareable, exportable documentation that isn't tied to a per-device monitoring bill, Scanopy runs alongside what you have rather than replacing it.\n\nOn views, Auvik renders L2 and L3 and surfaces VMs and containers as nodes, but it has no host-to-VM workload-nesting view, and its application grouping is unclear from public docs. Scanopy adds the workload and application views. Neither tool replaces the other's primary job."
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
		pricing: { text: 'Free to 100 sensors, then $200-$1,642/mo', sources: [{ id: 4 }] },
		alsoIncludes: ['Monitoring', 'Traffic Analysis'],
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'unclear',
			application: 'no',
			note: 'No native automatic L2/L3 topology. Automatic L2 mapping comes from PRTG UVexplorer, listed as a separate product in the PRTG family.'
		},
		viewTypesSources: [{ id: 32 }, { id: 45 }, { id: 46 }],
		bestFor:
			'Teams already running Paessler for monitoring who want status dashboards alongside their sensor data',
		description:
			'Best for teams already running Paessler for monitoring who want dashboards next to their sensor data. PRTG is a full monitoring stack with network auto-discovery, released in 2003 and with a large installed base. It licenses by sensor rather than by device: [most users average 10 sensors per device](https://www.paessler.com/prtg/requirements), so a 1,000-sensor license typically covers around 100 devices.',
		discoveryNotes:
			'Auto-discovery scans IP ranges over SNMP, WMI, and ICMP and creates sensors from what it finds. NetFlow and packet sniffing for traffic analysis. Self-hosted on Windows. Paessler notes that ["unmanaged switches cannot really be discovered by PRTG since most of them don\'t have an IP address"](https://helpdesk.paessler.com/en/support/solutions/articles/76000082169-layer-network-map).',
		diagrams:
			'Maps in PRTG are dashboards you compose, not diagrams generated from discovery. Paessler documents the Maps feature as a way to "create dashboards with monitoring information in a customizable layout", assembled in a drag-and-drop Map Designer from device icons, sensor status objects, graphs, tables, and geographic maps, where ["a map is a common HTML web page"](https://www.paessler.com/manuals/prtg/maps) that can be published at its own URL. For switch-to-switch topology, Paessler support states that ["PRTG has no way of knowing which switch is connected to which so creating an automatic graph is not possible"](https://helpdesk.paessler.com/en/support/solutions/articles/76000082169-layer-network-map). Automatic Layer 2 mapping comes from [PRTG UVexplorer](https://www.paessler.com/products), a separate product in the PRTG family.',
		pricingNotes:
			'Licensed by sensor, not by device, so cost tracks the number of monitored aspects rather than the size of the network. Subscription tiers run from [$200/mo for 500 sensors to $1,642/mo for 10,000](https://www.paessler.com/prtg/pricing), where 10,000 sensors covers roughly 1,000 devices. The freeware edition allows 100 sensors, about 10 devices. One license key per server, and licenses cannot be combined.',
		whereItFits:
			'If you already run PRTG for monitoring and want a status dashboard on a floor plan, a network operations center view, or a top-10 sensor list, the Maps feature covers it without adding a tool. The device and sensor inventory behind it is thorough.',
		tradeOff:
			'Maps are dashboards you lay out by hand, so there is no automatic switch-to-switch topology graph. Paessler support states that ["PRTG has no way of knowing which switch is connected to which so creating an automatic graph is not possible"](https://helpdesk.paessler.com/en/support/solutions/articles/76000082169-layer-network-map), and automatic Layer 2 mapping comes from [PRTG UVexplorer](https://www.paessler.com/products), a separate product in the PRTG family. Sensor-based licensing means the bill tracks monitoring scope rather than the number of devices you want documented. Unmanaged switches, which have no IP address of their own, sit outside what PRTG discovers.',
		tradeOffLabel: 'Trade-offs',
		deployment: ['Self-hosted', 'Cloud'],
		deploymentNotes:
			'Self-hosted on [Windows Server 2016+](https://www.paessler.com/prtg/requirements). [PRTG Hosted Monitor](https://www.paessler.com/prtg-hosted-monitor) available as cloud alternative. Core server with optional remote probes for distributed monitoring.',
		deploymentSources: [{ id: 13 }],
		versus: `PRTG and Scanopy both discover a network, but they produce different artifacts. PRTG is a mature, sensor-based monitoring platform released in 2003 with a large installed base, and its Maps feature builds dashboards: you assemble device icons, sensor status objects, graphs, tables, and geographic maps in a [drag-and-drop Map Designer](https://www.paessler.com/manuals/prtg/maps), and the result is an HTML page you can publish at its own URL. It has no native automatic Layer 2 or Layer 3 topology mapping. Paessler's knowledge base documents that ["PRTG has no way of knowing which switch is connected to which so creating an automatic graph is not possible"](https://helpdesk.paessler.com/en/support/solutions/articles/76000082169-layer-network-map), and automatic Layer 2 mapping comes from [PRTG UVexplorer](https://www.paessler.com/products), a separate product in the PRTG family. Scanopy's job is that topology: one daemon produces four switchable views (L2, L3, workloads, applications) and identifies the services on each host, with nothing else to buy.

The licensing models divide along the same line. PRTG charges by sensor, so cost scales with how many aspects you monitor rather than with the size of the network you want documented: subscriptions run [$200/mo for 500 sensors up to $1,642/mo for 10,000](https://www.paessler.com/prtg/pricing), and the freeware edition covers 100 sensors, about 10 devices. If you already run PRTG and mainly want monitoring, alerting, and traffic analysis, with dashboards as a secondary view, staying in PRTG (and adding UVexplorer for automatic L2 maps) avoids another tool. Scanopy is [flat monthly with unlimited hosts](/pricing), self-hostable under a [commercial license](/commercial), or free under [AGPL-3.0](/community), and it runs alongside PRTG rather than replacing your monitoring.

PRTG's sensor library and monitoring feature set exceed Scanopy's, and Scanopy does no monitoring at all. This comparison is only about which tool draws the network map automatically.`
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
		bestFor:
			'Cost-conscious MSPs who need monitoring, remote access, and basic network maps at a published price',
		description:
			"The lowest published per-device price of the monitoring platforms with network maps. Domotz offers remote monitoring and management with network mapping, positioned as a lower-cost Auvik alternative. A [single collector deployed to the client's network](https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/) provides a real-time inventory within minutes. No endpoint agents required.",
		discoveryNotes: 'Cloud-hosted with an on-site agent.',
		diagrams:
			'Auto-generated topology maps. The focus is remote access and monitoring, with mapping as a supporting feature.',
		pricingNotes:
			'Free tier covers 1 managed device with unlimited discovery. [Published per-device rates](https://www.domotz.com/pricing/).',
		whereItFits:
			'MSPs who want monitoring, remote access, and basic network mapping at a low per-device rate. Domotz publishes its pricing at $1.50/device/month.',
		tradeOff:
			'Diagrams are secondary to remote access and monitoring. If documentation is your primary goal, the mapping features may not go deep enough.',
		deployment: ['Cloud'],
		deploymentNotes:
			'Cloud-hosted SaaS. [One collector per network](https://blog.domotz.com/all/agentless-network-discovery-msp-client-onboarding/), running on Linux, Raspberry Pi, Docker, or NAS. No endpoint agents.',
		deploymentSources: [{ id: 14 }],
		versus: `Domotz and Scanopy both run a single on-site collector and build a Layer 2 topology map with no endpoint agents, so for basic "what's on this network" mapping they overlap. They're built around different priorities, though. Domotz is a monitoring and remote-access platform: monitoring, alerting, and secure remote connections into client devices, with [network topology](https://help.domotz.com/managing-your-account/network-topology/) as a supporting feature. Scanopy is a dedicated documentation tool: it fingerprints services per host and produces four switchable views (L2, L3, workloads, applications), and it does no monitoring or remote access at all.

The decision usually comes down to scope and price. Domotz publishes a per-device rate of [$1.50/device/month](https://www.domotz.com/pricing/), the lowest published rate of the monitoring platforms here. Because it is per-device, a 100-device site is about $150/month, and the mapping sits behind remote access and monitoring. Scanopy is [flat monthly with unlimited hosts](/pricing) and has a [commercial self-hosted edition](/commercial) or a free, self-hostable [AGPL-3.0 Community edition](/community). If you want monitoring, remote access, and a basic map in one platform, Domotz bundles all three. If you want deep, exportable, multi-view documentation alongside whatever monitoring you already run, Scanopy does that, and the two coexist on the same network.

On views, Domotz's Layer 2 map is documented in its help docs; the L3/VLAN mapping appears in its marketing but isn't documented as an actual view, and there's no documented host-to-VM or application view. Scanopy adds L3, workloads, and applications. Domotz does the monitoring and remote access that Scanopy doesn't touch.`
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
		bestFor:
			'Mid-market IT teams that want monitoring and visualization at a lower per-device cost',
		description:
			"Best budget option for mid-market teams that want monitoring and topology maps at a fraction of Auvik's per-device cost. OpManager provides [agentless](https://www.manageengine.com/network-monitoring/agentless-network-monitoring.html) network monitoring with Layer 2/3 auto-discovery and topology maps, plus rack and floor plan views that most monitoring tools lack. [Scales up to 30,000 devices](https://www.manageengine.com/network-monitoring/network-monitoring-tool.html) with a distributed monitoring architecture.",
		discoveryNotes: 'Auto-maps port-level connectivity.',
		diagrams:
			'Topology maps, rack views, floor plan views. More visualization options than most monitoring tools.',
		pricingNotes: 'Professional from $145/year. Free edition available (3 devices).',
		whereItFits:
			'Mid-market teams that want monitoring and visualization in one tool at a lower per-device cost than Auvik. OpManager also renders rack and floor-plan views, which most monitoring tools do not.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on [Windows or Linux](https://www.manageengine.com/network-monitoring/network-monitoring-tool.html). [Agentless](https://www.manageengine.com/network-monitoring/agentless-network-monitoring.html): the central server polls devices via SNMP, WMI, CLI.',
		deploymentSources: [{ id: 15 }],
		versus: `OpManager and Scanopy overlap more than most pairings on this list. Both auto-discover L2 and L3 topology over SNMP, CDP, LLDP, and ARP, and both produce a workload view: OpManager maps [host-to-VM, VM-to-datastore, and host-to-network relationships](https://www.manageengine.com/network-monitoring/vmware-monitoring.html) through its virtualization maps, which matches Scanopy's workload view. The difference is the category. OpManager is a full monitoring platform that also renders rack and floor-plan views, which most monitoring tools do not. Scanopy is a dedicated documentation tool with per-host service fingerprinting and no monitoring, alerting, or polling.

The trade-off is platform versus focus, and price. OpManager is self-hosted on Windows or Linux, is cheap ([from about $95/year for 10 devices](https://www.manageengine.com/network-monitoring/opmanager-editions.html)), scales to tens of thousands of devices, and bundles monitoring you may want anyway. Scanopy is [flat monthly with unlimited hosts](/pricing), self-hostable under a [commercial license](/commercial) or free under [AGPL-3.0](/community), and adds an application-dependency view OpManager doesn't have. If you want monitoring plus built-in visualization at a low per-device cost, OpManager bundles both. If you want documentation that's independent of your monitoring stack, plus an application view, Scanopy runs alongside it. Monitor with OpManager, document with Scanopy.

OpManager also renders L2, L3, and the workload (host-to-VM) view, and it adds rack and floor-plan views that Scanopy does not produce. Scanopy adds the application-dependency view and per-host service fingerprinting. OpManager has no application-grouping map.`
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
		bestFor:
			'Security audits, one-off network discovery, and as the discovery layer in custom automation pipelines',
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
			'Runs on [Linux, macOS, Windows, FreeBSD](https://nmap.org/download). No server component. Scans from wherever you run it, with no agents on targets.',
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
		bestFor:
			'Teams with Linux skills that want free, self-hosted monitoring with basic topology visualization',
		description:
			'The best free self-hosted monitoring option, with limited mapping. LibreNMS is open-source network monitoring with auto-discovery. Topology mapping is secondary and manual: the legacy Weathermap plugin is deprecated (it does not run on supported PHP versions), so mapping uses the Custom Maps feature. [Requires PHP 8.2+ and MariaDB](https://docs.librenms.org/Installation/Install-LibreNMS/) on Linux. The central server polls devices via SNMP, with no per-device agents required.',
		discoveryNotes: undefined,
		diagrams:
			'Topology visualization is a secondary feature. The legacy [Network Weathermap](https://docs.librenms.org/Extensions/Weathermap/) plugin is deprecated and does not work on supported PHP versions, so LibreNMS points users to its Custom Maps feature, where the layout is placed by hand. New devices are not added to the map automatically.',
		whereItFits:
			"Teams with Linux server management skills that want free monitoring with some topology visualization. If you're already running LibreNMS for monitoring, the weathermap plugin adds basic mapping without another tool.",
		tradeOff:
			'Topology visualization is a community plugin, not a first-class feature. Setup requires Linux, PHP, and database administration. The monitoring side is strong; the diagramming side is minimal.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on [Linux (Ubuntu, Debian, CentOS)](https://docs.librenms.org/Installation/Install-LibreNMS/). Docker available. Requires MariaDB and PHP 8.2+. The central server polls via SNMP, with no per-device agents.',
		deploymentSources: [{ id: 16 }],
		versus: `LibreNMS and Scanopy CE are both free and self-hosted, so that's the matchup here: [Scanopy's AGPL-3.0 Community edition](/community), not the paid product. LibreNMS is GPL-licensed, self-hosted network monitoring: strong SNMP auto-discovery, alerting, and graphing, with topology visualization as a secondary, plugin-based feature. Scanopy is dedicated documentation: one daemon, four switchable views (L2, L3, workloads, applications), and per-host service fingerprinting, with no monitoring or alerting.

The practical difference is what the mapping costs you in effort. LibreNMS's topology comes from the Weathermap plugin, which [the LibreNMS docs say "does not work on any supported versions of PHP" and recommend against](https://docs.librenms.org/Extensions/Weathermap/), pointing users to Custom Maps where the layout is hand-placed rather than generated. Standing it up also means managing Linux, PHP 8.2+, and MariaDB. Scanopy's map is automatic and is the core product, not a plugin. If you want free, self-hosted monitoring and you're comfortable administering the stack, LibreNMS provides it and the maps come with it. If you want automatic network documentation that refreshes on a schedule without manual map layout, Scanopy CE does that, and the two run together if you want both.

LibreNMS is the most-deployed free self-hosted monitoring stack, and Scanopy does no monitoring at all. For documentation, Scanopy produces the automatic multi-view map that LibreNMS does not.`
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
		bestFor:
			'Anyone who needs a one-time, hand-crafted network diagram for a presentation or project',
		description:
			'The best free option for one-time, hand-drawn network diagrams. draw.io is an open-source diagramming tool with extensive network shape libraries, and the most widely used free alternative to Visio.',
		discoveryNotes:
			'You place shapes and draw connections manually. You can import from CSV or XML if you build the data pipeline yourself.',
		diagrams:
			'Highly customizable. Huge icon libraries (Cisco, AWS, Azure, generic network). Export to everything. Works offline.',
		whereItFits:
			"One-time diagrams, architecture documentation, presentations. If you need a diagram for a specific project or meeting and you're willing to draw it, draw.io is excellent.",
		tradeOff:
			"The diagram is a snapshot of the moment you drew it. It [won't update when your network changes](/blog/network-diagrams-wrong). If you're looking for automated, continuously updated diagrams, draw.io isn't that. For a diagram of a network that does not exist yet, or a layout an auditor specifies, drawing it by hand is the only way to get it.",
		tradeOffLabel: 'The catch',
		deployment: ['Browser', 'Desktop'],
		deploymentNotes:
			'Browser-based at diagrams.net or desktop app (Electron: Windows, macOS, Linux). Confluence and Jira plugins available. No network interaction.'
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
		bestFor:
			'Teams that need polished, collaborative network diagrams for documentation or cloud architecture reviews',
		description:
			'Best for teams that need real-time collaboration on professional diagrams. Lucidchart is cloud-based diagramming with multi-user editing and imports infrastructure data from AWS, Azure, and GCP.',
		discoveryNotes:
			'No on-prem network scanning. Cloud architecture import via [Lucidscale](https://lucid.co/lucidscale/), which connects to AWS, Azure, and GCP accounts and auto-generates topology diagrams from live infrastructure.',
		diagrams:
			'Professional-grade output. Real-time collaboration. Extensive template library. Integrates with Google Workspace, Atlassian, Microsoft.',
		pricingNotes:
			'Free tier available (3 editable documents). Team plans from $9/user/month billed annually. See [current pricing](https://lucid.app/pricing/lucidchart) for latest rates.',
		whereItFits:
			'Teams that need polished, shareable diagrams for documentation, presentations, or cloud architecture reviews. Lucidchart supports real-time multi-cursor editing, inline commenting, and version history, and integrates with Confluence, Jira, Google Workspace, and Microsoft Teams.',
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
		bestFor:
			'Network teams that want free, open-source Layer 2 topology discovery and device tracking',
		description:
			'A long-established open-source network discovery tool. NetDisco is a web-based network management tool that discovers devices via SNMP and maps Layer 2 topology using CDP and LLDP neighbor data. Originally developed at the [University of California, Santa Cruz](https://en.wikipedia.org/wiki/Netdisco), actively maintained since 2003.',
		discoveryNotes:
			'SNMP-based device discovery with CDP/LLDP neighbor detection and ARP/MAC table correlation. Tracks switch port usage, VLAN assignments, and device locations over time.',
		diagrams:
			'Web-based topology maps with device groupings configurable via config file. Layout requires manual configuration to arrange.',
		whereItFits:
			'Network teams comfortable with Perl and Linux administration who want a free, battle-tested tool for Layer 2 discovery and device tracking. Strong at answering "what device is on which switch port?" questions.',
		tradeOff:
			'Perl-based, which limits the contributor pool. Topology visualization is functional but not modern. Requires Linux, PostgreSQL, and some configuration effort. No service detection beyond basic SNMP data. Mapping is a feature of a broader network management tool, not the primary focus.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on Linux. Requires [Perl and PostgreSQL](https://netdisco.org/). Docker image available. A [self-contained](https://netdisco.org/) central server polls via SNMP, with no per-device agents.',
		deploymentSources: [{ id: 12 }],
		versus: `NetDisco and Scanopy both discover devices over SNMP and read CDP/LLDP neighbor data, and both are open source. NetDisco focuses on Layer 2: it collects IP and MAC data into PostgreSQL and resolves "what device is on which switch port?". Search a MAC or IP and it returns the exact switch and port, which is why it is long established for tracking down endpoints and auditing port usage. Scanopy does that same Layer 2 work (switch, port, and MAC/IP visualization) from a single scan, and adds three more views (L3, workloads, applications) plus per-host service fingerprinting on top.

The difference is scope and setup, not Layer 2 capability. NetDisco is free (BSD-licensed) but it's Perl and PostgreSQL on Linux, and it's [Layer 1/2 only, with no L3 routing or subnet mapping](https://github.com/netdisco/netdisco/wiki/Network-Map). Scanopy is [flat monthly with unlimited hosts](/pricing), [commercially self-hostable](/commercial), or free under [AGPL-3.0](/community), runs from one daemon, and covers L3, workloads, and applications alongside the same switch-port and MAC/IP data. If switch-port and MAC tracking is all you need and you're happy administering Perl and Postgres, NetDisco covers it. If you want that Layer 2 visibility plus L3, workload, and application views in one tool, Scanopy is the broader fit.

On Layer 2 the two land in the same place: switch, port, MAC, IP. The choice is whether you also want L3, workloads, and applications in the same map (Scanopy), or a focused, free, self-hosted Layer 2 tool you run entirely yourself (NetDisco), which has done that one job since 2003.`
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
		bestFor:
			'Teams that want automated network documentation on their own infrastructure with no SaaS dependency',
		description:
			'The best free self-hosted option for automated network documentation. Scanopy CE is the free, self-hosted edition with the same discovery engine as the paid product (SNMP, LLDP, CDP, ARP), an interactive topology map, and service detection. Open source and runs on your own hardware.',
		discoveryNotes: 'One daemon, no per-device agents.',
		diagrams:
			'Interactive topology map with service and interface detail. Shareable by read-only link, embeddable via iframe, and exportable as PNG, SVG, PDF, HTML, Mermaid, Confluence, and CSV.',
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
		openSource: {
			status: 'osi',
			license: 'Apache-2.0',
			href: 'https://github.com/netbox-community/netbox'
		},
		pricing: { text: 'Cloud and Enterprise: contact sales', sources: [{ id: 42 }] },
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'Topology visualization comes from community plugins (e.g. netbox-topology-views), not core NetBox.'
		},
		viewTypesSources: [{ id: 40 }, { id: 41 }],
		bestFor:
			'Network and automation teams building a structured source of truth to drive Ansible, Nornir, or Terraform',
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
		versus: `Scanopy and NetBox serve different primary purposes, and they overlap in part. NetBox is a source of truth: it models the intended state of your network (every device, rack, IP, VLAN, and cable) as structured data behind a REST and GraphQL API, and it is the de facto standard for automation teams feeding Ansible, Nornir, and Terraform. Scanopy is a documentation tool: it discovers the operational state of your network and visualizes it as four switchable views (L2, L3, workloads, applications), with per-host service detection.

Both can discover the network. NetBox Labs ships [NetBox Discovery](https://netboxlabs.com/blog/announcing-netbox-discovery-infrastructure-design-operational-reality/), an open-source agent that actively scans for hosts and services and captures device configs and operational state, then validates that reality against the intended design. So on the discovery layer, NetBox and Scanopy overlap. Scanopy is not a full DCIM/IPAM source of truth, though: it does not model intended state, racks, circuits, or power.

Where they clearly differ is the output. NetBox Discovery feeds NetBox's data model and flags drift; it does not produce topology maps, and NetBox's visualization is plugin-based ([netbox-topology-views](https://github.com/netbox-community/netbox-topology-views)). Scanopy's core output is the interactive, living map itself. So the decision: if you want a structured source of truth that automation consumes and that continuously validates against intended design, NetBox (with Discovery) is the platform. If you want an automatic, up-to-date visual map of what is actually on your network, Scanopy is built for that and is not trying to be your data model. The two can also work together, with Scanopy as one way to keep NetBox populated.`
	},
	phpipam: {
		name: 'phpIPAM',
		fullName: 'phpIPAM',
		slug: 'phpipam',
		href: 'https://phpipam.com/',

		discovery: ['SNMP', 'ICMP'],
		discoverySources: [{ id: 47 }],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'osi', license: 'GPL-3.0' },
		pricing: { text: 'Free' },
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'Records subnets and hosts as tables; there is no rendered topology map.'
		},
		viewTypesSources: [{ id: 48 }],
		bestFor:
			'Teams that plan and assign address space, including ranges reserved before anything is deployed',
		description:
			'An open-source IP address management application. phpIPAM records subnets, IP allocations, VLANs, and devices in a structured database behind a web UI and an API, and can populate that record from the network itself. Written in PHP and self-hosted, under [GPL-3.0](https://phpipam.com/).',
		discoveryNotes:
			'Subnet discovery reads routing tables. Host discovery runs from scan agents configured per subnet, using ping, DNS resolution, and SNMP.',
		diagrams:
			'There is no native topology diagram. Network drawings and location maps are long-standing feature requests ([diagram module](https://github.com/phpipam/phpipam/issues/4445), [location map](https://github.com/phpipam/phpipam/issues/2044)) rather than shipped features. The output is tabular: subnet listings, IP allocations, and device records.',
		whereItFits:
			'Teams that assign address space rather than only observe it: reserving ranges before anything is deployed, splitting subnets as they plan them, and recording VLAN and VRF allocation as intent, including addresses that are not live yet.',
		tradeOff:
			'It records the plan for address space rather than the shape of the network, so what it holds is what someone entered or scanned into it. No topology map, and host detail is limited to what the scan agents return.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on a PHP and MySQL/MariaDB stack. Docker images are available. Scan agents can run remotely to reach subnets the main server cannot.',
		versus: `phpIPAM and Scanopy both keep a record of what is on the network, and they build it from different directions. phpIPAM is IP address management: subnets, allocations, VLANs, and device records in a structured database, populated from routing tables and from scan agents that ping, resolve DNS, and query SNMP. Its distinctive job is recording intent: ranges reserved before anything is deployed, subnets split as they are planned, VLAN and VRF assignment written down. Scanopy discovers hosts, services, interfaces, and topology on a schedule and renders four views of the same scan: physical (L2), logical (L3), workloads, and applications, with the host, service, and subnet data behind them available through the API and as CSV.

The difference is what each one produces. phpIPAM produces tables, and a network drawing is [not part of it](https://github.com/phpipam/phpipam/issues/4445); requests for one are open feature requests rather than shipped features. Scanopy produces an interactive map, with the underlying host and service data available as CSV. Both are free to self-host: phpIPAM under GPL-3.0, Scanopy under [AGPL-3.0](/community), with [flat pricing regardless of host count](/pricing) and [commercial self-hosted editions](/commercial) when you outgrow the caps.

The split is intent against observation, which is why teams run both. phpIPAM holds what address space is meant to look like, including the parts nobody has deployed yet, and that is the one thing discovery cannot produce. Scanopy holds what is actually on the network and how it connects, without anyone maintaining it. If the job is planning and assigning address space, phpIPAM is built for it. If the job is seeing what is really there and how it fits together, that is what Scanopy is built for.`
	},
	observium: {
		name: 'Observium',
		fullName: 'Observium',
		slug: 'observium',
		href: 'https://www.observium.org/',

		discovery: ['SNMP', 'CDP', 'LLDP'],
		discoverySources: [{ id: 50 }],
		services: { level: 'no' },
		autoUpdates: true,
		openSource: { status: 'osi', license: 'QPL' },
		pricing: {
			text: 'Free (Community); Professional subscription',
			href: 'https://www.observium.org/subscribe/',
			sources: [{ id: 51 }]
		},
		alsoIncludes: ['Monitoring'],
		viewTypes: {
			l2: 'yes',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'Per-device neighbour view, one hop out. A whole-network topology drawing comes from a community generator, not from Observium.'
		},
		viewTypesSources: [{ id: 50 }],
		bestFor:
			'Teams that want autodiscovering SNMP monitoring across mixed vendors and can treat mapping as a per-device view',
		description:
			'An autodiscovering SNMP monitoring platform covering Cisco, Juniper, Dell, HP, Linux, and Windows. Observium walks the network by following device neighbours, and is the project [LibreNMS forked from](https://www.librenms.org/). It ships in two editions: a free Community edition on 6-monthly source releases, and a paid Professional subscription.',
		discoveryNotes:
			'Autodiscovery follows neighbours over CDP, LLDP, FDP, and EDP, and picks up OSPF routing neighbours, continuing until it has walked the reachable network.',
		diagrams:
			'Mapping is per-device rather than whole-network. Each device has a neighbours view, and an interface has a Map sub-tab showing one level of connections. A full topology drawing comes from a community LLDP map generator built against the Observium database.',
		whereItFits:
			'Teams already committed to SNMP polling across a mixed-vendor estate who want device health, interface graphs, and neighbour data in one place, with Linux administration in-house.',
		tradeOff:
			'Mapping is a device-level view, so seeing the whole network means reaching for a community generator. The Community edition ships on a 6-monthly release cycle and is positioned by the project for small non-critical deployments, home use, evaluation, or lab; threshold monitoring and traffic accounting are Professional features.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on Linux with PHP and MySQL. A central poller queries devices over SNMP, with no per-device agents. Community ships as 6-monthly `.tar.gz` releases; Professional adds daily updates and is [licensed for one production install plus two test or development installs](https://www.observium.org/subscribe/), and is free to registered charities and open-source projects.',
		deploymentSources: [{ id: 49 }, { id: 51 }],
		versus: `Observium and Scanopy both discover devices over SNMP and read CDP and LLDP neighbour data, and both are self-hosted. Observium is a monitoring platform: it polls device health and interface counters, graphs them over time, and autodiscovers by following neighbours until it has walked the reachable network. Scanopy is a documentation tool: one scan produces four views of the same network (physical L2, logical L3, workloads, and applications) plus per-host service detection, and it rescans on a schedule.

The mapping is where the two diverge. Observium's topology is a per-device view: a neighbours page, and a Map sub-tab on an interface showing one level of connections. Drawing the whole network from that data means running a community LLDP map generator against the Observium database. Scanopy renders the whole network as an interactive map, and gets it out three ways: [export](/pricing) as an image, self-contained HTML, wiki markup, or CSV; embed the live map in a wiki or intranet via iframe; or share a read-only link that stays current as the network rescans.

Editions differ too. Observium Community is [QPL-licensed](https://docs.observium.org/licenses/) and ships on a 6-monthly release cycle, with threshold monitoring and traffic accounting in the paid Professional subscription. Scanopy is [free under AGPL-3.0](/community), or [flat monthly with unlimited hosts](/pricing) and [commercially self-hostable](/commercial). If you want SNMP monitoring with device-level neighbour views, Observium does that and has done for years. If you want the whole network drawn, kept current, and exportable, Scanopy is built for that, and it runs alongside monitoring rather than replacing it.`
	},
	opennms: {
		name: 'OpenNMS',
		fullName: 'OpenNMS Horizon / Meridian',
		slug: 'opennms',
		href: 'https://www.opennms.com/',

		discovery: ['SNMP', 'CDP', 'LLDP', 'ICMP'],
		discoverySources: [{ id: 52 }],
		services: { level: 'basic' },
		autoUpdates: true,
		openSource: { status: 'osi', license: 'AGPL-3.0' },
		pricing: {
			text: 'Free (Horizon); Meridian subscription',
			href: 'https://www.opennms.com/pricing/',
			sources: [{ id: 55 }]
		},
		alsoIncludes: ['Monitoring'],
		viewTypes: {
			l2: 'yes',
			l3: 'yes',
			workload: 'no',
			application: 'no',
			note: 'Enlinkd builds Layer 2 links from Bridge, CDP, and LLDP, and routing topology from OSPF and IS-IS.'
		},
		viewTypesSources: [{ id: 52 }, { id: 53 }],
		bestFor:
			'Larger networks that want protocol-level topology discovery inside a full monitoring platform',
		description:
			'An enterprise network management platform with first-class topology discovery. Its Enhanced Linkd (Enlinkd) daemon discovers physical and routing links using five protocols, all enabled by default. It ships as Horizon, free and on a rapid release cycle, and Meridian, a subscription release line with a longer stable cycle.',
		discoveryNotes:
			'Enlinkd runs five link-discovery methods by default: Bridge, CDP, IS-IS, LLDP, and OSPF. CDP and LLDP edges are drawn only where the adjacency is bidirectional, so a link appears when both devices report each other. Enlinkd updaters then correlate the collected data into a network-wide topology layout.',
		diagrams:
			'A topology map generated from discovered links rather than placed by hand, with Layer 2 adjacency from Bridge, CDP, and LLDP, and routing topology from OSPF and IS-IS.',
		whereItFits:
			'Networks large enough to justify a full NMS, where the team wants alerting, performance collection, and protocol-derived topology from a single platform and has the capacity to operate it.',
		tradeOff:
			'A full monitoring platform, so the topology arrives with alerting, performance collection, and provisioning to configure and run. Documentation output is a view inside the platform rather than an exportable artifact, and there are no workload or application-dependency views.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on Linux with PostgreSQL and a JVM. Horizon and Meridian are [both AGPLv3](https://www.opennms.com/faq/), and Meridian is also available under a proprietary licence. Meridian is priced as a flat yearly fee per management server.',
		deploymentSources: [{ id: 54 }],
		versus: `OpenNMS is the closest tool on this list to Scanopy on discovery. Its Enhanced Linkd (Enlinkd) daemon runs [five link-discovery methods by default](https://docs.opennms.com/meridian/2021/operation/topology/enlinkd/introduction.html): Bridge, CDP, IS-IS, LLDP, and OSPF, and it draws a CDP or LLDP edge only where [both devices report each other](https://docs.opennms.com/meridian/2024/operation/deep-dive/topology/enlinkd/layer-2/lldp-discovery.html). That is real protocol-level topology discovery, not a hand-placed diagram, and it covers routing topology as well as Layer 2. Scanopy discovers over the same family of protocols and adds ARP and MAC forwarding tables.

The difference is scope on both sides. OpenNMS is a full network management platform: alerting, performance collection, provisioning, and event correlation, with topology as one view inside it. Scanopy does documentation only, and covers two things OpenNMS does not: per-host service detection across hundreds of service types, and workload and application views showing VMs and containers nested in their hosts and services grouped by the application they make up. It also gets the map out, as [exports](/pricing) (image, self-contained HTML, wiki markup, CSV), an embedded live map in a wiki or intranet, or a read-only link that stays current.

Both are AGPL-3.0 and self-hostable, so licence is not the deciding factor. Choose OpenNMS if you want topology inside a platform that also monitors, and you have the capacity to run it. Choose Scanopy if you want documentation that stands on its own, covers workloads and applications alongside L2 and L3, and can be handed to someone as a map. Scanopy runs alongside a monitoring platform rather than replacing one, so running both is a coherent setup.`
	},
	zabbix: {
		name: 'Zabbix',
		fullName: 'Zabbix',
		slug: 'zabbix',
		href: 'https://www.zabbix.com/',

		discovery: ['SNMP', 'ICMP'],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'osi', license: 'AGPL-3.0' },
		pricing: { text: 'Free' },
		alsoIncludes: ['Monitoring'],
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'Maps are laid out by hand. Automatic Layer 2 topology comes from community modules.'
		},
		viewTypesSources: [{ id: 57 }],
		bestFor:
			'Teams that want one free monitoring platform across servers, applications, and network devices',
		description:
			'A long-established open-source monitoring platform covering servers, applications, cloud, and network devices, with agents, SNMP, and agentless checks. Released under [AGPLv3 from version 7.0 onward](https://www.zabbix.com/license), and under GPLv2 or later before that.',
		discoveryNotes:
			'Network discovery scans IP ranges and low-level discovery enumerates SNMP tables such as interfaces, creating items and triggers automatically. This populates what is monitored; it does not derive a topology.',
		diagrams:
			'Maps are dashboards you lay out by hand, placing icons and links yourself. Deriving a Layer 2 map from LLDP data automatically requires a community add-on, such as the L2 Discovery Module for LLDP on Zabbix Share or the [snmp_lldp](https://github.com/zabbix-book/snmp_lldp) and [zabbix-map](https://github.com/TiggyWiggler/zabbix-map) projects.',
		whereItFits:
			'Teams consolidating server, application, and network monitoring into one free platform, with the in-house capacity to template and maintain it.',
		tradeOff:
			'Mapping is a manual dashboard feature. New devices do not appear on a map on their own, and automatic topology means adding and maintaining a community module.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on Linux with a MySQL, PostgreSQL, or equivalent database. Packages, containers, and appliances are published by the project.'
	},
	nagios: {
		name: 'Nagios',
		fullName: 'Nagios Core / Nagios XI',
		slug: 'nagios',
		href: 'https://www.nagios.org/',

		discovery: [],
		services: { level: 'no' },
		autoUpdates: false,
		openSource: { status: 'osi', license: 'GPL-2.0' },
		pricing: {
			text: 'Free (Core); XI from $2,595 per 100 nodes',
			href: 'https://www.nagios.com/pricing-plans/',
			sources: [{ id: 60 }]
		},
		alsoIncludes: ['Monitoring'],
		viewTypes: {
			l2: 'no',
			l3: 'no',
			workload: 'no',
			application: 'no',
			note: 'The network map renders parent/child relationships written by hand in host definitions, not discovered links.'
		},
		viewTypesSources: [{ id: 59 }],
		bestFor:
			'Teams with an existing Nagios deployment who need host and service state, not a discovered map',
		description:
			'The long-running open-source monitoring engine. Nagios Core checks hosts and services defined in configuration files and is [free under GPLv2](https://www.nagios.org/faq/); Nagios XI wraps the same engine in a web interface with configuration wizards and is sold per monitored node.',
		discoveryNotes:
			'Nagios Core has no network discovery. Hosts and services are defined in configuration files, and the topology it displays is the hierarchy you declare. Nagios XI adds a configuration wizard for populating hosts.',
		diagrams:
			'The Network Status Map is drawn from the `parents` directive in host definitions, which an administrator writes by hand to describe the path from the monitoring server to each host. It reflects the hierarchy as declared, so it is accurate only while someone maintains it.',
		whereItFits:
			'Established Nagios estates where the configuration and plugin ecosystem are already in place and the goal is host and service state rather than network documentation.',
		tradeOff:
			'No discovery, so the map is only as current as the configuration behind it. Maintaining parent/child relationships by hand is the same effort as maintaining a diagram by hand.',
		deployment: ['Self-hosted'],
		deploymentNotes:
			'Self-hosted on Linux. Core is configuration-file driven; XI adds a web configuration layer over the same engine.'
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
		intro:
			"These are monitoring tools first. Network diagrams come included as part of the monitoring package. If you already use one of these for monitoring, the built-in mapping may be all you need. If you use a different monitoring stack, or want documentation that isn't tied to your monitoring vendor, a dedicated tool gives you more flexibility.",
		hasAlsoIncludes: false,
		vendors: ['auvik', 'prtg', 'manageengine-opmanager', 'domotz']
	},
	{
		id: 'dedicated',
		heading: 'Dedicated Diagram Tools',
		intro:
			'These exist specifically to discover and map networks or the applications running on them. Not monitoring platforms. No alerting, no traffic analysis, no config backup. Their entire purpose is producing accurate diagrams.',
		hasAlsoIncludes: false,
		vendors: ['solarwinds-ntm', 'scanopy', 'netbrain', 'faddom']
	},
	{
		id: 'manual',
		heading: 'Manual Diagramming',
		intro:
			"These tools don't discover your network. You draw the diagram yourself. They are included here because they are commonly recommended for this query, and they are not automated diagram tools.",
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
	"**Graphviz / D3.js.** Rendering engines, not discovery tools. If you've already got network data from another source (Nmap scans, SNMP polls, API calls), Graphviz and D3 can turn it into a diagram. This is the DIY path. Extremely flexible, significant engineering effort required.\n\n**Icinga.** A Nagios fork, backward compatible with Nagios configuration, plugins, and addons. Its [map module](https://github.com/nbuchwitz/icingaweb2-module-map) plots host and service state geographically on OpenStreetMap rather than drawing network topology; topology maps come through the NagVis integration, where the layout is placed by hand.";

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
		label:
			'Auvik - How does Auvik discover network topology and device information? (L1/L2/L3, ESXi host-to-VM)',
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
		label:
			'NetBrain - Visualize VMware vCenter Networks (ESXi host and VM relationships on dynamic maps)',
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
		label:
			'Auvik - VMware hypervisor dashboard (VMs listed in a dashboard, not a host-to-VM nesting map)',
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
	},
	{
		id: 45,
		label: 'Paessler - PRTG Maps are customizable dashboards (manual)',
		url: 'https://www.paessler.com/manuals/prtg/maps'
	},
	{
		id: 46,
		label: 'Paessler - PRTG UVexplorer listed as a separate product',
		url: 'https://www.paessler.com/products'
	},
	{
		id: 47,
		label: 'phpIPAM - Open source IP address management (GPL-3.0)',
		url: 'https://phpipam.com/'
	},
	{
		id: 48,
		label: 'phpIPAM - Network diagram module is an open feature request',
		url: 'https://github.com/phpipam/phpipam/issues/4445'
	},
	{
		id: 49,
		label: 'Observium - Licenses (Community under QPL)',
		url: 'https://docs.observium.org/licenses/'
	},
	{
		id: 50,
		label: 'Observium - Autodiscovery via CDP, LLDP, FDP, EDP and OSPF neighbours',
		url: 'https://docs.observium.org/autodiscovery/'
	},
	{
		id: 51,
		label: 'Observium - Subscribe: Community vs Professional editions',
		url: 'https://www.observium.org/subscribe/'
	},
	{
		id: 52,
		label: 'OpenNMS - Enhanced Linkd (Enlinkd): five link-discovery methods enabled by default',
		url: 'https://docs.opennms.com/meridian/2021/operation/topology/enlinkd/introduction.html'
	},
	{
		id: 53,
		label: 'OpenNMS - LLDP discovery requires bidirectional adjacency for an edge',
		url: 'https://docs.opennms.com/meridian/2024/operation/deep-dive/topology/enlinkd/layer-2/lldp-discovery.html'
	},
	{
		id: 54,
		label: 'OpenNMS - Difference between Horizon and Meridian (both AGPLv3)',
		url: 'https://www.opennms.com/faq/'
	},
	{
		id: 55,
		label: 'OpenNMS - Meridian subscription pricing',
		url: 'https://www.opennms.com/pricing/'
	},
	{
		id: 56,
		label: 'Zabbix - 7.0 released under AGPLv3 (previously GPLv2 or later)',
		url: 'https://blog.zabbix.com/striking-the-right-balance-zabbix-7-0-to-be-released-under-agplv3-license/27596/'
	},
	{
		id: 57,
		label: 'Zabbix - SNMP LLDP topology discovery is a community module',
		url: 'https://github.com/zabbix-book/snmp_lldp'
	},
	{
		id: 58,
		label: 'Nagios - FAQ: Nagios Core is free under GPLv2',
		url: 'https://www.nagios.org/faq/'
	},
	{
		id: 59,
		label: 'Nagios Core - Host parent/child relationships are defined by hand and drive the network map',
		url: 'https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/dependencies.html'
	},
	{
		id: 60,
		label: 'Nagios - XI pricing plans',
		url: 'https://www.nagios.com/pricing-plans/'
	}
];

export const vendorFAQs: VendorFAQ[] = [
	{
		question: 'What are network documentation tools?',
		answer:
			'Network documentation tools keep a current, accurate record of your network: the devices on it, how they connect, and the services running on them. The automated kind discovers this directly from the network over protocols like SNMP, LLDP, and ARP and updates it on a schedule, instead of relying on someone to maintain a spreadsheet or diagram by hand. The output is usually a topology map plus a searchable inventory.'
	},
	{
		question: 'Do network documentation tools replace IT asset management or monitoring?',
		answer:
			'No. Documentation tools record what exists and how it connects. Monitoring watches device health and alerts on problems, and IT asset management tracks ownership, licensing, and procurement. The three overlap on the device inventory but answer different questions, and most teams run them alongside each other rather than one instead of another.'
	},
	{
		question:
			'What is the difference between a network diagram tool and a network monitoring tool?',
		answer:
			'A network diagram tool discovers devices and connections, then produces a visual topology map. A monitoring tool tracks device health, bandwidth, and alerts over time. Some monitoring platforms (Auvik, PRTG, Domotz, ManageEngine) include basic mapping as a feature. Dedicated diagram tools (Scanopy, SolarWinds NTM, NetBrain) focus entirely on producing accurate, shareable maps without bundling monitoring.'
	},
	{
		question: 'How often should automated network diagrams be updated?',
		answer:
			'It depends on how often your network changes. Scanopy runs scheduled scans (hourly to daily), while tools like Auvik and Domotz poll continuously. SolarWinds NTM runs on-demand scans. For most IT teams, daily or weekly updates catch device additions and topology changes. Environments with frequent changes (cloud, DevOps) benefit from more frequent scan schedules.'
	},
	{
		question: 'Can network diagram tools discover cloud infrastructure?',
		answer:
			'Some can. Lucidscale (part of the Lucid suite) imports AWS, Azure, and GCP topology via cloud APIs. NetBrain and Auvik offer cloud API connectors for hybrid on-prem/cloud maps. Most on-prem-focused tools (SolarWinds NTM, PRTG, Domotz, LibreNMS, NetDisco) only discover devices reachable via SNMP, LLDP, or ARP on local networks.'
	},
	{
		question: 'Do I need SNMP enabled for automated network discovery?',
		answer:
			'For most tools on this list, yes. SNMP provides device identity, interface details, and neighbor relationships via LLDP/CDP. Without SNMP, discovery is limited to IP-level scanning (ping sweeps, ARP). Nmap can identify services via port scanning without SNMP, but topology mapping relies on SNMP neighbor tables for accurate connection data.'
	},
	{
		question: 'What is the most common reason automated network diagrams are inaccurate?',
		answer:
			'Incomplete SNMP coverage. If SNMP is not enabled on all managed devices, or if community strings are misconfigured, the tool only sees a partial network. Other common causes include firewalls blocking discovery traffic, unmanaged switches that do not respond to SNMP, and stale ARP caches on routers. Running a manual spot-check after initial discovery helps identify gaps.'
	},
	{
		question: 'How do network diagram tools handle VLANs and subnets?',
		answer:
			'Tools using SNMP and LLDP/CDP can discover VLAN assignments and map devices to subnets automatically. SolarWinds NTM, NetBrain, and NetDisco are particularly strong at Layer 2 topology including VLAN boundaries. Monitoring-focused tools like Auvik and PRTG show VLAN data as part of device detail but may not visualize VLAN segmentation as a distinct diagram layer.'
	}
];
