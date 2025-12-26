<script lang="ts">
	import { Rocket } from 'lucide-svelte';
	import type { FeatureMetadata } from '$lib/types';
	import featuresData from '$lib/fixtures/features.json';
	import { analytics } from '$lib/analytics.svelte';

	interface FeatureFixture {
		id: string;
		name: string;
		description: string;
		category: string;
		icon: string | null;
		color: string | null;
		metadata: FeatureMetadata;
	}

	const features = featuresData as FeatureFixture[];

	// Filter to only coming soon features
	const comingSoonFeatures = features.filter((f) => f.metadata.is_coming_soon);

	const manualFeatures: FeatureFixture[] = [
		{
			id: 'hardware-inventory',
			name: 'Hardware Inventory',
			description: 'Track host-level hardware specs including CPU, memory, storage.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'physical-infrastructure',
			name: 'Physical Infrastructure Mapping',
			description:
				'Visualize racks, chassis, and cabling. Map logical topology discoveries to their physical locations.',
			category: 'Visualization',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'topology-versioning',
			name: 'Network Versioning & Lineage',
			description:
				'Track how your network evolves over time. Compare snapshots, visualize changes, and explore topology history.',
			category: 'Visualization',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'api-access',
			name: 'API Access',
			description:
				'Programmatic access to Scanopy data and functionality. Enable third-party integrations and custom workflows.',
			category: 'Developer',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'plugin-system',
			name: 'Plugin/Extension System',
			description:
				'Extend Scanopy with custom plugins. Add new integrations and functionality.',
			category: 'Developer',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'snmp-discovery',
			name: 'SNMP Discovery',
			description:
				'Discover network devices and infrastructure via SNMP. Gain visibility into switches, routers, and other network equipment.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'proxmox-integration',
			name: 'Proxmox Integration',
			description:
				'Discover and map Proxmox VE environments. Track VMs, containers, and cluster topology.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'kubernetes-integration',
			name: 'Kubernetes Integration',
			description:
				'Discover and visualize Kubernetes clusters. Map pods, services, deployments, and their relationships.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'aws-integration',
			name: 'AWS Integration',
			description:
				'Discover and map AWS infrastructure. Track EC2 instances, VPCs, and cloud resources.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'gcp-integration',
			name: 'GCP Integration',
			description:
				'Discover and map Google Cloud Platform infrastructure. Track Compute Engine instances, VPCs, and cloud resources.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'azure-integration',
			name: 'Azure Integration',
			description:
				'Discover and map Microsoft Azure infrastructure. Track virtual machines, VNets, and cloud resources.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'netbox-integration',
			name: 'NetBox Integration',
			description:
				'Sync discovered infrastructure with NetBox. Auto-populate devices, IPs, and connections in your IPAM/DCIM system.',
			category: 'Integrations',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		},
		{
			id: 'unifi-integration',
			name: 'Unifi API Support',
			description:
				'Discover and map Unifi network infrastructure. Integrate with Unifi controllers for enhanced visibility.',
			category: 'Discovery',
			icon: null,
			color: null,
			metadata: {
				is_coming_soon: true
			}
		}
	];

	// Group by category
	const groupedFeatures = comingSoonFeatures.concat(manualFeatures).reduce(
		(acc, feature) => {
			const category = feature.category;
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(feature);
			return acc;
		},
		{} as Record<string, FeatureFixture[]>
	);

	const sortedCategories = Object.keys(groupedFeatures).sort();
</script>

<svelte:head>
	<title>Roadmap - Scanopy</title>
	<meta
		name="description"
		content="See what's coming next to Scanopy. Our product roadmap shows upcoming features and improvements."
	/>
	<link rel="canonical" href="https://scanopy.net/roadmap" />
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<div class="mb-4 flex justify-center">
				<Rocket class="h-12 w-12 text-blue-400" />
			</div>
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Roadmap</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-400">
				See what's coming next to Scanopy. These features are currently in development. Some
				features will not be available for all plans.
			</p>
		</div>

		{#if comingSoonFeatures.length === 0}
			<div class="text-center">
				<p class="text-gray-400">All planned features have been shipped! Check back soon.</p>
			</div>
		{:else}
			<div class="mx-auto max-w-3xl space-y-8">
				{#each sortedCategories as category (category)}
					<div>
						<h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
							{category}
						</h2>
						<div class="space-y-4">
							{#each groupedFeatures[category] as feature (feature.id)}
								<button
									type="button"
									class="card w-full cursor-pointer p-6 text-left transition-colors hover:border-blue-500/50"
									onclick={() =>
										analytics.roadmapItemClicked({
											feature_id: feature.id,
											feature_name: feature.name,
											category
										})}
								>
									<h3 class="mb-2 text-lg font-semibold text-white">{feature.name}</h3>
									<p class="text-gray-400">{feature.description}</p>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-16 text-center">
			<p class="mb-4 text-gray-400">Have a feature request?</p>
			<a
				href="https://github.com/scanopy/scanopy/issues/new?template=feature_request.md"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
				onclick={() => analytics.featureRequestClicked()}
			>
				Request a Feature
			</a>
		</div>
	</div>
</section>
