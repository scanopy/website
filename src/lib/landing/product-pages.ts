import { getServiceCountLabel } from '$lib/schemas';
import type { LandingPage } from './types';

// Feature pages under /product/<slug>. Every capability claim here was checked against the
// scanopy `dev` branch (UI components and handlers, not doc comments or fixtures). Cite the
// source in a comment when adding a claim.

const services = getServiceCountLabel();
const link = (href: string, text: string) =>
	`<a href="${href}" class="text-blue-400 hover:text-blue-300">${text}</a>`;

export const productPages: LandingPage[] = [
	{
		// L2 links: server/topology/service/l2_builder.rs:40-100 (LLDP/CDP), FDB fallback
		// server/hosts/service/topology/mod.rs:1117-1170. Port speed/status: ElementNode.svelte:703-708.
		// Default port grouping: topology/types/grouping.rs:394-400. L3: subnet_graph_builder.rs:456,
		// l3_builder.rs:22-28. Rules/filters: grouping.rs:114-131, types/views.rs:309-334.
		// Schedules: discovery/impl/types.rs:198-212.
		slug: 'network-topology',
		navLabel: 'Network topology',
		navBlurb: 'Physical (L2) and logical (L3) maps, drawn from the network itself',
		title: 'Physical and Logical Network Topology Maps | Scanopy',
		description:
			'Scanopy draws your physical (L2) topology port to port from LLDP, CDP, and switch forwarding tables, and your logical (L3) topology subnet by subnet. Rebuilt on every scheduled scan.',
		heading: 'A network diagram that redraws itself after every scan.',
		subhead:
			'Scanopy draws the physical topology port to port from LLDP, CDP, and switch forwarding tables, and the logical topology subnet by subnet. Each scheduled scan rebuilds both from what it finds.',
		heroView: 'l2',
		sections: [
			{
				heading: 'Physical (L2): every switch port and what plugs into it',
				points: [
					{
						title: 'Links from LLDP and CDP',
						body: 'Port-to-port links come from the neighbor tables on your switches, read over SNMP or gNMI, or from UniFi and HPE Aruba Instant On controllers.'
					},
					{
						title: 'Forwarding tables fill the gaps',
						body: 'Where a port has no LLDP neighbor but its forwarding table shows one device, Scanopy links the port to that device.'
					},
					{
						title: 'Port status and speed',
						body: 'Each port shows its speed and operational status. Trunk ports, access ports by VLAN, and ports by status are grouped by default.'
					}
				],
				figure: { kind: 'view', view: 'l2' }
			},
			{
				heading: 'Logical (L3): every subnet and the addresses in it',
				points: [
					{
						title: 'Subnets as containers',
						body: `Each subnet holds the IP addresses discovery found in it, typed as LAN, WiFi, IoT, Guest, DMZ, and more. See ${link('/product/vlan-mapping', 'VLANs & subnets')}.`
					},
					{
						title: 'Multi-homed hosts, connected',
						body: 'A host with addresses in several subnets shows a link between them, so you can see which machines bridge segments.'
					},
					{
						title: 'Click for the details',
						body: 'Select any address to see its host, the services on it, and the host’s other addresses.'
					}
				],
				figure: { kind: 'view', view: 'l3' }
			},
			{
				heading: 'Laid out by rules you set, not by dragging boxes',
				points: [
					{
						title: 'Automatic layout',
						body: 'Scanopy lays out every view automatically, so a rescan never leaves you with a diagram to tidy.'
					},
					{
						title: 'Group and filter',
						body: 'Group by subnet, host, service category, or tag. Filter by tag, link state, or how recently a device was seen.'
					},
					{
						title: 'On your schedule',
						body: 'Set each discovery to rescan on a day and time, or with a cron expression.'
					}
				]
			}
		],
		quoteId: 'motala-kommun',
		faqs: [
			{
				question: 'What does Scanopy need to map physical topology?',
				answer:
					'SNMP read access to your switches (v1, v2c, or v3), or gNMI on switches that support it. UniFi and HPE Aruba Instant On networks can use their controller instead. Devices that don’t advertise LLDP or CDP are linked from switch forwarding tables where possible.'
			},
			{
				question: 'Is this a monitoring tool?',
				answer:
					'No. Scanopy documents what is on the network and how it connects, and rebuilds that on a schedule. It runs alongside your monitoring tools, which track health, bandwidth, and alerts.'
			},
			{
				question: 'Can I get the diagram into Visio or draw.io?',
				answer: `Yes, on plans that include those formats. The map also exports as PNG, SVG, PDF, HTML, Mermaid, or Confluence markup, embeds live in a wiki, or shares by read-only link. See ${link('/product/sharing-and-exports', 'sharing, embeds & exports')}.`
			}
		],
		related: ['vlan-mapping', 'device-inventory', 'sharing-and-exports']
	},
	{
		// workloads_builder.rs:50-77. Proxmox: daemon/discovery/integration/proxmox/mod.rs:1-4.
		// Containers: services/impl/virtualization.rs:39-57, compose project container/scanner.rs:1302-1308.
		// Docker access: integration/docker/mod.rs:4-6.
		slug: 'workload-mapping',
		navLabel: 'Workload mapping',
		navBlurb: 'Hypervisors, VMs, and containers, nested the way they actually run',
		title: 'Map VMs and Containers: Proxmox, Docker, and Podman | Scanopy',
		description:
			'Scanopy maps what runs where: Proxmox nodes, VMs, and LXC containers, Docker and Podman containers grouped by Compose stack, and the services on each.',
		heading: 'See what runs where, from the hypervisor down to the container.',
		subhead:
			'Scanopy reads Proxmox, Docker, and Podman directly and nests every VM and container inside the host that runs it, with the services each one exposes.',
		heroView: 'workloads',
		sections: [
			{
				heading: 'Hypervisors, VMs, and containers in one tree',
				points: [
					{
						title: 'Proxmox',
						body: 'Nodes, QEMU virtual machines, and LXC containers, read from the Proxmox API.'
					},
					{
						title: 'Docker and Podman',
						body: 'Containers from the local socket, or from a remote host through a Docker or Podman API proxy.'
					},
					{
						title: 'Nested inside their host',
						body: 'VMs and LXC containers sit inside their Proxmox node, and Docker containers sit inside the host or VM that runs them.'
					}
				],
				figure: { kind: 'view', view: 'workloads' }
			},
			{
				heading: 'Containers grouped by the stack they belong to',
				points: [
					{
						title: 'Compose stacks',
						body: 'Containers from the same Docker Compose project are grouped together.'
					},
					{
						title: 'Ports and services',
						body: `Each container lists its open ports and the services Scanopy recognizes on them, from ${services} definitions.`
					},
					{
						title: 'Guides for each runtime',
						body: `Step by step: ${link('/guides/visualize-docker-containers-network', 'map Docker containers')} or ${link('/guides/visualize-podman-containers-network', 'map Podman containers')}.`
					}
				]
			},
			{
				heading: 'The same workloads in every other view',
				points: [
					{
						title: 'On the subnet map',
						body: `VMs and containers appear in the ${link('/product/network-topology', 'logical (L3) view')} with links back to the hypervisor or runtime that hosts them.`
					},
					{
						title: 'In the inventory',
						body: `Every VM is a host in the ${link('/product/device-inventory', 'device inventory')}, filterable by the hypervisor it runs on.`
					},
					{
						title: 'In applications',
						body: `Tag containers with the application they serve and they appear in the ${link('/product/application-mapping', 'application map')}.`
					}
				]
			}
		],
		faqs: [
			{
				question: 'Does the daemon need access to the Docker socket?',
				answer:
					'For local containers, yes. For remote hosts, point Scanopy at a Docker or Podman API proxy instead.'
			},
			{
				question: 'Does Scanopy support VMware?',
				answer:
					'Scanopy recognizes vCenter and ESXi as services on the network. It does not read VMs from the vSphere API.'
			}
		],
		related: ['network-topology', 'application-mapping', 'device-inventory']
	},
	{
		// Application tags: server/tags/impl/base.rs:30-43, application_builder.rs:44-63; UI
		// TagPickerInline.svelte:209-210, DefineGroupsStep.svelte:74,96. Dependencies:
		// dependencies/impl/types.rs:27-31, InspectorMultiSelect.svelte:424,600, views.rs:1070-1111.
		// No automatic dependency inference anywhere.
		slug: 'application-mapping',
		navLabel: 'Application mapping',
		navBlurb: 'Services grouped by the application they serve, on hosts kept current',
		title: 'Application Map: Services Grouped by Application | Scanopy',
		description:
			'Group discovered services into the applications they serve and draw the request paths between them. Scanopy keeps the hosts, addresses, and ports underneath current.',
		heading: 'An application map that stays accurate when the servers change.',
		subhead:
			'You name each application and the services in it. Discovery keeps the hosts, addresses, and ports underneath current, so the map doesn’t drift when a service moves.',
		heroView: 'application',
		sections: [
			{
				heading: 'You name the application, discovery fills it in',
				points: [
					{
						title: 'Application tags',
						body: 'Tag a service, or a whole host, with the application it belongs to. Services inherit their host’s application unless you tag them directly.'
					},
					{
						title: 'A setup wizard',
						body: 'A guided setup suggests applications to create and walks you through assigning services.'
					},
					{
						title: 'Built on discovered services',
						body: `Every service in an application is one Scanopy found on the network, from ${link('/services', `${services} definitions`)}, not a box someone drew.`
					}
				],
				figure: { kind: 'view', view: 'application' }
			},
			{
				heading: 'Draw the request path once',
				points: [
					{
						title: 'Request paths',
						body: 'Select services in order, such as load balancer, app server, database, and save them as a request path.'
					},
					{
						title: 'Hub and spoke',
						body: 'Link one shared service, such as a database or an identity provider, to everything that calls it.'
					},
					{
						title: 'Visible across views',
						body: 'Dependencies show in the application, logical (L3), and workload views.'
					}
				]
			}
		],
		faqs: [
			{
				question: 'Does Scanopy discover application dependencies automatically?',
				answer: `No. Scanopy discovers hosts, services, and ports. You define which services form an application and the request paths between them. For dependencies inferred from network traffic, see ${link('/comparisons/vs/faddom', 'Scanopy vs Faddom')}.`
			},
			{
				question: 'What is the application view for?',
				answer:
					'Seeing which hosts and services an application depends on before a migration, a change, or a risk analysis.'
			}
		],
		related: ['workload-mapping', 'network-topology', 'device-inventory']
	},
	{
		// Host fields: backend/src/server/hosts/impl/base.rs:38-173. Columns and filters:
		// ui/src/lib/features/hosts/components/HostTab.svelte:354-407, 517-872. Export:
		// HostExportModal.svelte, hosts/handlers.rs ~1539-1560.
		slug: 'device-inventory',
		navLabel: 'Device inventory',
		navBlurb: 'Every host discovery finds, with its addresses, services, and hardware facts',
		title: 'Network Device Inventory from Automatic Discovery | Scanopy',
		description:
			'Scanopy builds a network device inventory from discovery: IPs, MACs, interfaces, services, and SNMP hardware facts for every host, refreshed each scan and exportable to CSV.',
		heading: 'A device inventory that matches the network, not last year’s spreadsheet.',
		subhead:
			'Each scan records every host it finds, with its IP and MAC addresses, interfaces, open ports, and services. Switches and other SNMP devices add manufacturer, model, serial number, and firmware.',
		sections: [
			{
				heading: 'Every host, with what it runs and how it connects',
				points: [
					{
						title: 'Addresses and interfaces',
						body: 'IP addresses, MAC addresses, hostnames, and interfaces for each host, plus the hypervisor or container host it runs on.'
					},
					{
						title: 'Services, not just open ports',
						body: `Scanopy matches each host against ${link('/services', `${services} service definitions`)}, so a host reads as a PostgreSQL server, a printer, or a camera by what it runs.`
					},
					{
						title: 'Hardware facts over SNMP',
						body: 'Manufacturer, model, serial number, asset tag, firmware and software revision, location, and contact, read from the device itself.'
					}
				],
				// Pre-rename UI (shows "Network" grouping). Replace with a current Hosts tab capture.
				figure: {
					kind: 'screenshot',
					name: 'hosts-catalog',
					alt: 'Scanopy Hosts list showing each host with its services, interfaces, and tags',
					width: 1200,
					height: 795
				}
			},
			{
				heading: 'Find any host in a few keystrokes',
				points: [
					{
						title: 'Search everything',
						body: 'Press / to search hosts, IP addresses, ports, services, subnets, and VLANs at once.'
					},
					{
						title: 'Filter and group the list',
						body: 'Filter by site, service, manufacturer, model, location, OS, or tag. Sort or group by any column.'
					},
					{
						title: 'Tag and describe hosts',
						body: 'Add tags for owner, environment, or criticality, and a description for anything discovery can’t know.'
					}
				]
			},
			{
				heading: 'Stale hosts show as stale, not as current',
				points: [
					{
						title: 'Last seen on every row',
						body: 'Each host shows when a scan last found it, and one filter lists the hosts that have gone stale.'
					},
					{
						title: 'Merge duplicates, hide noise',
						body: 'Consolidate two records of the same device into one, and hide hosts you don’t want in the list.'
					},
					{
						title: 'Export the inventory',
						body: 'Download hosts as CSV, or a ZIP with separate CSVs for hosts, IP addresses, ports, services, and interfaces. The export keeps your current filters.'
					}
				]
			}
		],
		faqs: [
			{
				question: 'Is Scanopy an IT asset management (ITAM) tool?',
				answer:
					'No. Scanopy records what discovery finds on the network and keeps it current. Purchase dates, warranties, owners, and software licenses belong in an ITAM system, and Scanopy runs alongside one.'
			},
			{
				question: 'Do I need an agent on every device?',
				answer:
					'No. One daemon scans the network. Add SNMP credentials for your switches and other managed devices to collect hardware facts and interface details.'
			},
			{
				question: 'How does Scanopy know what a device is?',
				answer: `By the services it runs. Scanopy matches open ports, service responses, and MAC vendors against ${services} service definitions, from databases and web servers to printers, cameras, and IoT devices. See the ${link('/services', 'full list')}.`
			},
			{
				question: 'Can I get the inventory out of Scanopy?',
				answer: `Yes. Hosts, subnets, VLANs, and services each export to CSV, and the host export can include IP addresses, ports, services, and interfaces as separate files. The topology map exports to image, document, diagram, and wiki formats, embeds in a wiki, or shares by read-only link. ${link('/product', 'See the product overview')}.`
			}
		],
		related: ['vlan-mapping', 'snapshots']
	},
	{
		// VLAN OIDs: daemon/discovery/integration/snmp/catalog.rs ~281-312, oids.rs:468-491.
		// VLAN tab: ui/src/lib/features/vlans/components/VlanTab.svelte:144-221. Subnet link:
		// hosts/service/discovery.rs:274-336. L2 trunk/native-VLAN rules: topology/types/base.rs:308-311.
		// Subnet list: SubnetTab.svelte:335-472. LLDP/CDP: catalog.rs:123-225.
		slug: 'vlan-mapping',
		navLabel: 'VLANs & subnets',
		navBlurb: 'VLANs read from your switches, linked to the subnets behind them',
		title: 'VLAN Discovery and Mapping over SNMP | Scanopy',
		description:
			'Scanopy reads VLANs from your switches over SNMP, maps native and tagged VLANs per port, and links each VLAN to its subnets. Kept current on a schedule.',
		heading: 'See every VLAN, the ports that carry it, and the subnets behind it.',
		subhead:
			'Scanopy reads VLAN tables from your switches over SNMP (Q-BRIDGE-MIB and Cisco VTP) and links each VLAN to the subnets on it. VLAN membership comes from the switches, not from a host plugged into each VLAN.',
		heroView: 'l2',
		sections: [
			{
				heading: 'VLANs come from the switch, port by port',
				points: [
					{
						title: 'Names and IDs',
						body: 'Every VLAN a switch knows about, with its number and name.'
					},
					{
						title: 'VLANs and neighbors per port',
						body: 'Click any port in the topology to see the VLANs it carries and the neighbor on the other end, from LLDP or CDP.'
					},
					{
						title: 'Trunks and access ports, grouped',
						body: 'The Physical (L2) view marks trunk ports and groups access ports by native VLAN.'
					}
				],
				figure: { kind: 'view', view: 'l2' }
			},
			{
				heading: 'Every subnet, with the VLANs behind it',
				points: [
					{
						title: 'Subnets from several sources',
						body: 'Subnets come from the daemon’s own interfaces, SNMP address tables, Docker networks, and integrations like UniFi.'
					},
					{
						title: 'VLANs linked automatically',
						body: 'Each subnet lists the VLANs its hosts sit on, recomputed after every scan.'
					},
					{
						title: 'Type and utilization',
						body: 'Each subnet carries a type (LAN, WiFi, IoT, Guest, DMZ, VPN, and more) and shows how many of its addresses are in use.'
					}
				],
				figure: { kind: 'view', view: 'l3' }
			},
			{
				heading: 'New VLANs appear after the scan that finds them',
				points: [
					{
						title: 'First and last seen',
						body: 'The VLAN list shows when each VLAN was last seen and which scan first found it.'
					},
					{
						title: 'In the scan digest',
						body: `The ${link('/product/snapshots', 'digest after each scheduled scan')} lists VLANs added and VLANs gone stale.`
					},
					{
						title: 'Searchable and exportable',
						body: 'Filter VLANs by site or tag, search them with the rest of the inventory, and export the list to CSV.'
					}
				]
			}
		],
		quoteId: 'motala-kommun',
		faqs: [
			{
				question: 'What does Scanopy need to discover VLANs?',
				answer:
					'SNMP read access (v1, v2c, or v3) to switches that support Q-BRIDGE-MIB, or Cisco VTP on Cisco switches. Add the SNMP credentials in Scanopy and the next scan reads the VLAN tables.'
			},
			{
				question: 'Does Scanopy change switch or VLAN configuration?',
				answer:
					'No. Scanopy is a documentation tool. It reads VLAN configuration from the switches and never writes to them.'
			},
			{
				question: 'Does the daemon need to sit on every VLAN?',
				answer:
					'Not for VLAN data, which comes from the switches over SNMP. To discover hosts on a subnet, the daemon needs to reach that subnet, either directly or through routing.'
			}
		],
		related: ['device-inventory', 'snapshots']
	},
	{
		// Snapshots: TopologyTab.svelte:611-640, 774-806; snapshots/handlers.rs:82; export header
		// ExportModal.svelte:132-140; retention plans.rs:663-1003, config.rs:267-273.
		// Digest: digest/payload.rs:165-187, digest/service.rs:291-295, 478-493,
		// digest/subscriber.rs:36-45, EmailTab.svelte:127-133. No compare/diff UI exists.
		slug: 'snapshots',
		navLabel: 'Snapshots & scan digests',
		navBlurb: 'What changed after each scan, and what the network looked like on a date',
		title: 'Network Change Tracking: Snapshots and Scan Digests | Scanopy',
		description:
			'After each scheduled scan, Scanopy emails which hosts and VLANs appeared, went stale, or changed. Snapshots record the network on a date for audits and change windows.',
		heading: 'Know what changed since the last scan, and what the network looked like on audit day.',
		subhead:
			'After each scheduled scan, Scanopy emails a digest of the hosts and VLANs that appeared, went stale, or changed. Take a snapshot before an audit or a change window, and you can open the network as it was on that date.',
		sections: [
			{
				heading: 'A digest after every scheduled scan',
				points: [
					{
						title: 'What it lists',
						body: 'Subnets scanned, hosts added, hosts gone stale, hosts with new or missing services, addresses, interfaces, or ports, and VLANs added or gone stale.'
					},
					{
						title: 'Silent when nothing changed',
						body: 'If a scan finds no changes, no email goes out.'
					},
					{
						title: 'Sent to the people on that site',
						body: 'Everyone with access to the site gets it, and each person can turn it off in their email settings.'
					}
				]
			},
			{
				heading: 'A snapshot records the network on a date',
				points: [
					{
						title: 'Take one before it matters',
						body: 'One click captures the whole topology before an audit, a migration, or a change window.'
					},
					{
						title: 'Open it read-only',
						body: 'Pick a snapshot from the topology menu to see every view as it was when you took it.'
					},
					{
						title: 'Export it with its date',
						body: 'A snapshot export carries its capture time in the header, so the evidence states when it was true.'
					}
				],
				figure: { kind: 'view', view: 'l3' }
			},
			{
				heading: 'The current map goes wherever your team works',
				standfirst:
					'Snapshots are the dated record. The live map exports, embeds, and shares by link.',
				points: [],
				figure: { kind: 'exports' }
			}
		],
		faqs: [
			{
				question: 'Does Scanopy alert me when a new device joins the network?',
				answer:
					'Scanopy is a documentation tool, not a monitor. New hosts appear in the digest after the next scheduled scan, not the moment they connect. For real-time alerts, run it alongside your monitoring tools.'
			},
			{
				question: 'How long are snapshots kept?',
				answer: `It depends on the plan, and the ${link('/pricing', 'pricing page')} lists retention for each. Self-hosted servers can set their own retention period.`
			},
			{
				question: 'Can I turn the digest off?',
				answer:
					'Yes. Each user can switch off the discovery scan summary in their email settings.'
			}
		],
		related: ['device-inventory', 'vlan-mapping']
	},
	{
		// Formats: ui/src/lib/features/topology/components/ExportModal.svelte:186-265; gating
		// billing/types/base/plans.rs:631-1000. Share options: server/shares/impl/base.rs:31-96;
		// password handlers.rs:144-165,320-374; allowed domains service.rs:122-150; embed code
		// features/shares/queries.ts:231-252. Plan gates: auth/middleware/features.rs:166,
		// shares/handlers.rs:416-423.
		slug: 'sharing-and-exports',
		navLabel: 'Sharing, embeds & exports',
		navBlurb: 'Export the map, embed it live, or share a read-only link',
		title: 'Share, Embed, and Export Network Diagrams | Scanopy',
		description:
			'Export the network map to PNG, SVG, PDF, HTML, draw.io, Visio, Mermaid, Confluence, or CSV. Embed the live map in a wiki, or share a read-only link with a password and expiry.',
		heading: 'Put the current network map wherever your team already looks.',
		subhead:
			'Export a static copy in the format the document needs, embed the live map in a wiki or dashboard, or send a read-only link that stays current as the network rescans.',
		sections: [
			{
				heading: 'Three ways to get the map out, plus a dated snapshot',
				points: [],
				figure: { kind: 'exports' }
			},
			{
				heading: 'Share links you control',
				points: [
					{
						title: 'Password and expiry',
						body: 'Protect a link with a password, set a date it stops working, or switch it off at any time.'
					},
					{
						title: 'Choose what they see',
						body: 'Pick which views the link opens, and whether viewers get the inspector, zoom controls, export button, and minimap.'
					},
					{
						title: 'No account needed',
						body: 'An auditor, contractor, or client opens the live map in a browser without a Scanopy login.'
					}
				]
			},
			{
				heading: 'Embed the live map in the page people already open',
				points: [
					{
						title: 'One iframe',
						body: 'Paste the embed code into Confluence, a wiki, an intranet page, or a dashboard, with your choice of size and theme.'
					},
					{
						title: 'Restricted to your sites',
						body: 'List the domains allowed to embed the map, and every other site is refused.'
					},
					{
						title: 'Current without anyone updating it',
						body: 'The embedded map is the live one, so the page shows the network as of the last scan.'
					}
				]
			}
		],
		faqs: [
			{
				question: 'Which export formats does Scanopy support?',
				answer: `PNG, SVG, PDF, and self-contained HTML; editable draw.io and Visio diagrams; Mermaid and Confluence markup; and CSV of the underlying host and service data. Some formats are on higher plans; the ${link('/pricing', 'pricing page')} lists which.`
			},
			{
				question: 'Does a shared link show a snapshot or the live network?',
				answer: `The live network. To record the network on a date, take a ${link('/product/snapshots', 'snapshot')} and export it, and the export carries the capture time.`
			}
		],
		related: ['network-topology', 'snapshots', 'device-inventory']
	}
];
