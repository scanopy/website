import { getServiceCountLabel } from '$lib/schemas';
import type { LandingPage } from './types';

// Use-case pages under /solutions/<slug>. /solutions/compliance has its own route and is
// listed from $lib/landing/index.ts. Capability claims follow the same rule as
// product-pages.ts: checked against the scanopy `dev` branch, source cited in a comment.

const services = getServiceCountLabel();
const link = (href: string, text: string) =>
	`<a href="${href}" class="text-blue-400 hover:text-blue-300">${text}</a>`;

export const solutionPages: LandingPage[] = [
	{
		// One daemon per site: server/daemons/impl/base.rs:26. Scan targets: discovery/impl/types.rs:45-48.
		// Site-scoped users: users/impl/base.rs:53. Roles: users/impl/permissions.rs:29-35.
		// Digest recipients per site: digest/service.rs:478-493.
		slug: 'multi-site-networks',
		navLabel: 'Multi-site networks',
		navBlurb: 'Every office, plant, and data center in one current map',
		title: 'Multi-Site Network Documentation | Scanopy',
		description:
			'Run a Scanopy daemon at each site and document every office, plant, and data center in one place: topology, inventory, and VLANs per site, kept current on a schedule.',
		heading: 'One current map of every office, plant, and data center.',
		subhead:
			'Run a lightweight daemon at each site. Each one scans its own network on a schedule, and every site lands in the same Scanopy server, with one inventory and one search across all of them.',
		heroViews: ['l3', 'l2', 'workloads', 'application'],
		sections: [
			{
				heading: 'Each site scans itself',
				points: [
					{
						title: 'One daemon per site',
						body: 'Run the daemon on a Linux, macOS, or Windows machine at the site, or in Docker on Linux. No agents on endpoints.'
					},
					{
						title: 'Scan what you choose',
						body: 'Point a scan at specific subnets, or let it cover every subnet at the site.'
					},
					{
						title: 'Its own schedule',
						body: 'Each site rescans on its own schedule, so a busy plant and a quiet branch office both stay current.'
					}
				]
			},
			{
				heading: 'Everyone sees the sites they need',
				points: [
					{
						title: 'Site-level access',
						body: 'Give a site’s IT lead access to that site only, as an admin, member, or viewer.'
					},
					{
						title: 'Digests go to the right people',
						body: `The ${link('/product/snapshots', 'digest after each scan')} goes to the people with access to that site, not to everyone.`
					},
					{
						title: 'Read-only links for auditors',
						body: 'Share a live, read-only map with an auditor or a parent company without creating an account.'
					}
				],
				figure: {
					kind: 'screenshot',
					name: 'invite',
					alt: 'Scanopy Invite User form granting Member permissions on the Data Center site only',
					width: 1752,
					height: 1204
				}
			},
			{
				heading: 'Every site in one inventory',
				points: [
					{
						title: 'Filter by site',
						body: `Hosts, subnets, and VLANs carry their site, so the ${link('/product/device-inventory', 'inventory')} filters to one site or shows them all.`
					},
					{
						title: 'One search',
						body: 'Search for a host, IP, or service across every site you have access to.'
					},
					{
						title: 'Export per site',
						body: 'Export a filtered inventory to CSV for one site’s audit, or the whole estate for the annual review.'
					}
				]
			}
		],
		quoteId: 'motala-kommun',
		faqs: [
			{
				question: 'Does each site need its own Scanopy server?',
				answer:
					'No. Each site runs a daemon, and every daemon reports to one Scanopy server, self-hosted or in Scanopy Cloud.'
			},
			{
				question: 'How many sites can I document?',
				answer: `It depends on the plan. The ${link('/pricing', 'pricing page')} lists the sites included in each.`
			}
		],
		related: ['device-inventory', 'vlan-mapping', 'snapshots']
	},
	{
		// Digest hosts added: digest/payload.rs:165-174. Service matching incl. MAC vendor:
		// services/impl/patterns.rs:885-920; categories: services/impl/categories.rs:37-95.
		// Subnet types: SubnetTab.svelte. Tags + tag filter: HostTab.svelte:354-407.
		slug: 'shadow-it',
		navLabel: 'Shadow IT discovery',
		navBlurb: 'Find the devices and services nobody told IT about',
		title: 'Find Shadow IT and Unknown Devices on Your Network | Scanopy',
		description:
			'Scanopy scans every office network on a schedule, identifies each device by the services it runs, and lists the hosts that are new since the last scan.',
		heading: 'Find the devices nobody told IT about.',
		subhead:
			'Scanopy scans each office network on a schedule and lists every host it finds, with its MAC, IP, and the services it runs. After each scan, a digest names the hosts that are new since the last one.',
		sections: [
			{
				heading: 'New hosts land in the scan digest',
				points: [
					{
						title: 'Added since the last scan',
						body: `The ${link('/product/snapshots', 'digest after each scheduled scan')} lists every host that wasn’t there before.`
					},
					{
						title: 'Gone, too',
						body: 'Hosts that stop answering show as stale, so a device that walked out the door doesn’t linger in the inventory.'
					},
					{
						title: 'Changed hosts',
						body: 'A known host with new services or open ports shows up as changed, such as a workstation that starts serving a web app.'
					}
				],
				// One capture, used for both themes: the email has no dark version.
				figure: {
					kind: 'screenshot',
					name: 'scan-digest-email',
					alt: 'Scanopy discovery scan summary email with counts of new, stale, and changed hosts, VLANs, and subnets scanned',
					width: 1206,
					height: 1160
				}
			},
			{
				heading: 'Know what a device is from what it runs',
				points: [
					{
						title: `${services} service definitions`,
						body: `Printers, cameras, NAS boxes, IoT hubs, databases, and web servers, matched by open ports, service responses, and MAC vendor. ${link('/services', 'See the list')}.`
					},
					{
						title: 'Hardware facts where SNMP answers',
						body: 'Managed devices report manufacturer, model, serial number, and firmware.'
					},
					{
						title: 'Unknown ports stay visible',
						body: 'A host running something Scanopy doesn’t recognize still shows its open ports, so an unlabeled service is a lead, not a blank.'
					}
				]
			},
			{
				heading: 'See which subnet and VLAN it landed on',
				points: [
					{
						title: 'Subnet and VLAN context',
						body: `Each host sits in its subnet, typed as LAN, WiFi, IoT, Guest, or DMZ, with the ${link('/product/vlan-mapping', 'VLANs')} behind it.`
					},
					{
						title: 'Tag what you’ve reviewed',
						body: 'Tag hosts as approved or by owner, then filter the inventory by tag to see what still needs a look.'
					},
					{
						title: 'Every office covered',
						body: `Run a daemon in each office and every network reports to one inventory. See ${link('/solutions/multi-site-networks', 'multi-site networks')}.`
					}
				]
			}
		],
		faqs: [
			{
				question: 'Is Scanopy a NAC or a security monitoring tool?',
				answer:
					'No. Scanopy documents what is on the network and keeps that record current. It does not block devices or alert in real time: a new device appears in the digest after the next scheduled scan. Run it alongside your NAC and monitoring tools.'
			},
			{
				question: 'Do I need to install anything on the devices?',
				answer:
					'No. One daemon per site scans the network. Devices that answer SNMP report more detail when you add credentials.'
			}
		],
		related: ['device-inventory', 'snapshots', 'vlan-mapping']
	},
	{
		// Scan controls: server/discovery/impl/scan_settings.rs:10-75, light vs full port runs
		// daemon/discovery/service/network/scan.rs:1542-1553; subnets per discovery types.rs:93-98;
		// --interfaces daemon/shared/config.rs:344-347. Industrial definitions:
		// services/definitions/{modbus_tcp,ethernet_ip,opc_ua,bacnet}.rs. PROFINET DCP:
		// scan.rs:224-268 (tested on real devices per founder, 2026-10-09; dcp/mod.rs:22-27 says otherwise and is stale). Westermo LLDP:
		// server/lldp/resolver.rs:280. Offline licenses: server/license/crypto.rs:3-14, mint.rs:199.
		slug: 'plant-ot-networks',
		navLabel: 'Plant & OT networks',
		navBlurb: 'Document plant-floor networks, with the data kept on site',
		title: 'OT and Plant Network Documentation | Scanopy',
		description:
			'Document plant and OT networks with scans you rate-limit and scope, industrial device identification, and a self-hosted server that keeps the data on site.',
		heading: 'Document the plant network without sending the data off site.',
		subhead:
			'Scanopy runs on your own server, scans at the rate and scope you set, and identifies industrial devices alongside the IT gear, so the plant network gets the same current map as the office.',
		heroViews: ['l2', 'l3', 'workloads', 'application'],
		sections: [
			{
				heading: 'Industrial devices identified next to IT gear',
				points: [
					{
						title: 'Industrial protocols',
						body: 'Modbus TCP, EtherNet/IP, OPC UA, and BACnet devices are identified as industrial services.'
					},
					{
						title: 'Industrial switches',
						body: 'Port links from industrial switches, Westermo included, come from LLDP like any other switch.'
					},
					{
						title: 'Devices without an IP',
						body: 'Devices found only by MAC address, such as PROFINET devices that answer DCP, still appear on the physical (L2) map.'
					}
				],
				figure: {
					kind: 'screenshot',
					name: 'industrial',
					alt: 'Scanopy inspector on a facility UPS identified by Modbus TCP on port 502, next to a BACnet HVAC controller',
					width: 1560,
					height: 1166
				}
			},
			{
				heading: 'Scans you set the pace and scope of',
				points: [
					{
						title: 'Rate limits',
						body: 'Set the ARP and port-scan packet rates for each discovery, and a maximum run time.'
					},
					{
						title: 'Light scans by default',
						body: 'Most runs probe a common port set, and a full port sweep runs only every few scans.'
					},
					{
						title: 'Scoped to what you choose',
						body: 'Pick the subnets each discovery covers and the interfaces the daemon uses, and schedule scans for a maintenance window.'
					}
				],
				figure: {
					kind: 'screenshot',
					name: 'scan-perf',
					alt: 'Scanopy discovery Performance tab with port scan rate, ARP scan rate, and maximum discovery duration',
					width: 2400,
					height: 1017
				}
			},
			{
				heading: 'The data stays on your network',
				points: [
					{
						title: 'Self-hosted',
						body: `Run the Scanopy server on your own infrastructure with the ${link('/commercial', 'Commercial Edition')}.`
					},
					{
						title: 'Air-gapped',
						body: 'On plans with air-gapped deployment, an offline license key validates without contacting Scanopy.'
					},
					{
						title: 'Evidence for CMMC',
						body: `Level 2 scoping needs every in-scope asset, OT included, in an inventory and a diagram. See the ${link('/guides/network-documentation-cmmc', 'CMMC guide')}.`
					}
				]
			}
		],
		showLogos: true,
		faqs: [
			{
				question: 'Does Scanopy scan actively?',
				answer:
					'Yes. The daemon sends ARP and port probes, and identifies industrial devices with protocol requests such as Modbus device identification. You set the rate, the subnets, and the schedule, so you can test on one cell and run scans in a maintenance window.'
			},
			{
				question: 'Can I run it with no internet connection?',
				answer: `Yes, self-hosted with an offline license key, on plans that include air-gapped deployment. The ${link('/pricing', 'pricing page')} lists which.`
			}
		],
		related: ['network-topology', 'device-inventory', 'vlan-mapping']
	},
	{
		// Host fields: hosts/impl/base.rs:60-169 (description, management URL, location, contact).
		// Status tags: server/tags/impl/base.rs:23-43. Viewer role: users/impl/permissions.rs:30-35.
		slug: 'network-handover',
		navLabel: 'Handover & onboarding',
		navBlurb: 'Keep the network documented through staff changes and handovers',
		title: 'Network Documentation for Handover and Onboarding | Scanopy',
		description:
			'When the person who knew the network leaves, the documentation stays. Scanopy rebuilds the map and inventory from the network on a schedule, so a new hire starts from what is actually there.',
		heading: 'Keep the network documented when the people who know it move on.',
		subhead:
			'Scanopy rebuilds the network map and inventory from the network itself on a schedule. A new hire, a contractor, or the next MSP starts from what is actually running, not from a diagram someone stopped updating.',
		heroViews: ['l3', 'l2', 'workloads', 'application'],
		sections: [
			{
				heading: 'Day one starts from the network, not from memory',
				points: [
					{
						title: 'Four views from one scan',
						body: `${link('/product/network-topology', 'Physical and logical topology')}, ${link('/product/workload-mapping', 'workloads')}, and ${link('/product/application-mapping', 'applications')}, rebuilt on every scheduled scan.`
					},
					{
						title: 'A searchable inventory',
						body: `Every host with its addresses, services, and hardware facts in the ${link('/product/device-inventory', 'device inventory')}. Press / to search all of it.`
					},
					{
						title: 'Nothing to redraw',
						body: 'The map comes from discovery, so nobody has to remember to update it before they go.'
					}
				]
			},
			{
				heading: 'The context discovery can’t find, kept next to the host',
				points: [
					{
						title: 'Descriptions and links',
						body: 'Add a description and a management URL to each host, so the admin page is one click from the map.'
					},
					{
						title: 'Location and contact',
						body: 'Record where a device sits and who to call. SNMP devices fill these in from their own settings.'
					},
					{
						title: 'Lifecycle status',
						body: 'Tag hosts from planned to decommissioned, so the next person knows what is meant to be there.'
					}
				],
				figure: {
					kind: 'screenshot',
					name: 'host-detail',
					alt: 'Scanopy host details with a description, tags, SNMP hardware facts, location, and contact',
					width: 2400,
					height: 1150
				}
			},
			{
				heading: 'Hand over access, not a folder of PDFs',
				points: [
					{
						title: 'Viewer accounts',
						body: 'Give a new hire or an auditor a read-only seat on the sites you choose. They can see everything there and change nothing.'
					},
					{
						title: 'Links and embeds',
						body: `Send a read-only link with a password and expiry, or embed the live map in the team wiki. See ${link('/product/sharing-and-exports', 'sharing, embeds & exports')}.`
					},
					{
						title: 'Exports for the handover pack',
						body: 'Export the map as PDF, Visio, draw.io, or Confluence markup, and the inventory as CSV.'
					}
				]
			}
		],
		faqs: [
			{
				question: 'Does Scanopy store passwords for devices?',
				answer:
					'Only the credentials the daemon scans with, such as SNMP, SSH, or Docker access, and they are redacted in the API. It is not a password manager.'
			}
		],
		related: ['network-topology', 'device-inventory', 'sharing-and-exports']
	}
];
