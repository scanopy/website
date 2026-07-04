<script lang="ts">
	import { ServiceCatalog } from '$lib/components';
	import type { ServiceDefinition } from '$lib/types';
	import servicesData from '$lib/fixtures/services.json';
	import { analytics } from '$lib/analytics.svelte';
	import { getServiceCountLabel } from '$lib/schemas';

	const services: ServiceDefinition[] = servicesData;
	const serviceCount = getServiceCountLabel();
</script>

<svelte:head>
	<title>Discoverable Services - Scanopy</title>
	<meta
		name="description"
		content="Scanopy can automatically detect {serviceCount} services including Docker, databases, media servers, and more."
	/>
	<link rel="canonical" href="https://scanopy.net/services" />

	<meta property="og:title" content="Discoverable Services - Scanopy" />
	<meta
		property="og:description"
		content="Scanopy can automatically detect {serviceCount} services including Docker, databases, media servers, and more."
	/>
	<meta property="og:url" content="https://scanopy.net/services" />
	<meta property="og:image" content="https://scanopy.net/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Discoverable Services - Scanopy" />
	<meta
		name="twitter:description"
		content="Scanopy can automatically detect {serviceCount} services including Docker, databases, media servers, and more."
	/>
	<meta name="twitter:image" content="https://scanopy.net/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Discoverable Services - Scanopy',
		description: `Scanopy can automatically detect ${serviceCount} services including Docker, databases, media servers, and more.`,
		url: 'https://scanopy.net/services',
		isPartOf: {
			'@type': 'WebSite',
			'@id': 'https://scanopy.net/#website'
		},
		mainEntity: {
			'@type': 'ItemList',
			name: 'Services detected by Scanopy',
			numberOfItems: services.length,
			itemListElement: services.map((s, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: s.name
			}))
		}
	})}</script>`}
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Discoverable Services</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-400">
				Scanopy automatically detects and identifies these services running on your network. More
				services are added regularly.
			</p>
		</div>

		<p class="mx-auto mb-12 max-w-3xl text-center text-gray-400">
			Services are detected automatically during network scans using a combination of port checks,
			HTTP endpoint probing, header analysis, and MAC vendor identification.
		</p>

		<ServiceCatalog {services} showDiscoveryPatterns={true} />

		<div class="mt-16 text-center">
			<p class="mb-4 text-gray-400">Don't see a service you use? We're constantly adding more.</p>
			<a
				href="https://github.com/scanopy/scanopy/issues/new?template=service-detection-issue.yml"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
				onclick={() => analytics.serviceRequestClicked()}
			>
				Request a Service
			</a>
		</div>

		<div class="mx-auto mt-16 max-w-5xl space-y-4 text-sm leading-relaxed text-gray-400">
			<p>
				Scanopy identifies services using a multi-phase detection process. During network discovery,
				the daemon scans open TCP and UDP ports, probes known HTTP endpoints, and matches responses
				against a library of service definitions. Detection patterns combine port checks, endpoint
				content matching, HTTP header analysis, and MAC vendor identification - using combinatorial
				logic to reduce false positives.
			</p>
			<p>
				Each detected service is assigned a confidence level from Certain to Low based on how
				specific the match is. Endpoint content and header matches produce High confidence results,
				while port-only detections are rated lower. This lets you quickly see which identifications
				are rock-solid and which might need a closer look.
			</p>
			<p>
				For the full technical details on how detection patterns work and the complete list of
				supported services, see the <a
					href="/docs/reference/service-detection/"
					class="text-blue-400 hover:text-blue-300">service detection reference</a
				>. Most network diagram tools detect that a host exists but not what it runs; see how the
				field compares in our
				<a
					href="/comparisons/best-automated-network-diagram-tools"
					class="text-blue-400 hover:text-blue-300">comparison of automated network diagram tools</a
				>. Want to <a href="/pricing" class="text-blue-400 hover:text-blue-300">compare plans</a>?
				You can <a href="/community" class="text-blue-400 hover:text-blue-300">self-host free</a> or
				get a
				<a href="/commercial" class="text-blue-400 hover:text-blue-300">commercial license</a>.
			</p>
		</div>
	</div>
</section>
