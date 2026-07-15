<script lang="ts">
	// Shared topology screenshot used across the compliance guides, rendered via the
	// `<!-- topology-figure:applications|l3|l2|workloads -->` marker. The image assets, paths, alt
	// text, and the compliance-evidence caption all live here once instead of being copy-pasted into
	// each guide. Light/dark variants swap with the site theme. Assets live in static/common/. The
	// caption names the compliance evidence the view provides, standard-neutral (matching the
	// "What Scanopy produces" column in each guide's requirements table).
	let { view }: { view: 'applications' | 'l3' | 'l2' | 'workloads' } = $props();

	const FIGURES = {
		applications: {
			base: 'app',
			alt: 'Scanopy Applications view: services grouped by application with the dependencies between them drawn as edges, showing which systems interconnect and how data can travel between them.',
			caption:
				'Applications view: service-to-service dependencies. The data-flow map of which systems interconnect and where data can travel.'
		},
		l3: {
			base: 'l3',
			alt: 'Scanopy Logical (L3) view: hosts grouped by subnet, showing which hosts sit on which subnets and how the subnets reach each other.',
			caption:
				'Logical view: subnets and how hosts sit across them. Segmentation and logical-topology evidence.'
		},
		l2: {
			base: 'l2',
			alt: "Scanopy Physical (L2) view: switches and the hosts connected to them with port speeds and links, an automatically discovered inventory of the network's devices.",
			caption:
				'Physical view: switches, ports, and connected hosts. Physical topology and device inventory.'
		},
		workloads: {
			base: 'wl',
			alt: 'Scanopy Workloads view: the services and virtual machines running on each host, nested under the host that runs them.',
			caption: 'Workloads view: the services and VMs on each host. Service and workload inventory.'
		}
	} as const;

	const fig = $derived(FIGURES[view]);
</script>

{#if fig}
	<figure class="my-8">
		<img
			class="block dark:hidden w-full rounded-lg border border-gray-200"
			src="/common/{fig.base}-light-960w.webp"
			srcset="/common/{fig.base}-light-960w.webp 960w, /common/{fig.base}-light-1440w.webp 1440w, /common/{fig.base}-light-2400w.webp 2400w"
			sizes="(min-width: 1024px) 720px, 100vw"
			loading="lazy"
			alt={fig.alt}
		/>
		<img
			class="hidden dark:block w-full rounded-lg border border-gray-800"
			src="/common/{fig.base}-960w.webp"
			srcset="/common/{fig.base}-960w.webp 960w, /common/{fig.base}-1440w.webp 1440w, /common/{fig.base}-2400w.webp 2400w"
			sizes="(min-width: 1024px) 720px, 100vw"
			loading="lazy"
			alt={fig.alt}
		/>
		<figcaption class="mt-3 text-sm text-gray-400">{fig.caption}</figcaption>
	</figure>
{/if}
