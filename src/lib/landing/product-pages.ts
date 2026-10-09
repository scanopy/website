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
	}
];
