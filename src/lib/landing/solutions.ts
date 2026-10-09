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
		heroView: 'l3',
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
				]
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
				]
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
	}
];
