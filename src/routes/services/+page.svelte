<script lang="ts">
	import { ServiceCatalog } from '$lib/components';
	import type { ServiceDefinition } from '$lib/types';
	import servicesData from '$lib/fixtures/services.json';
	import { analytics } from '$lib/analytics.svelte';

	const services: ServiceDefinition[] = servicesData;
</script>

<svelte:head>
	<title>Discoverable Services - Scanopy</title>
	<meta
		name="description"
		content="Scanopy can automatically detect 200+ services including Docker, databases, media servers, and more."
	/>
	<link rel="canonical" href="https://scanopy.net/services" />
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

		<ServiceCatalog {services} showDiscoveryPatterns={true} />

		<div class="mt-16 text-center">
			<p class="mb-4 text-gray-400">Don't see a service you use? We're constantly adding more.</p>
			<a
				href="https://github.com/scanopy/scanopy/issues/new?template=service-detection-issue.md"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
				onclick={() => analytics.serviceRequestClicked()}
			>
				Request a Service
			</a>
		</div>
	</div>
</section>
