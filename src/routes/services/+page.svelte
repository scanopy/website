<script lang="ts">
	import { ServiceCatalog } from '$lib/components';
	import type { ServiceDefinition } from '$lib/types';
	import servicesData from '$lib/fixtures/services.json';

	const services: ServiceDefinition[] = servicesData;
</script>

<svelte:head>
	<title>Supported Services - NetVisor</title>
	<meta
		name="description"
		content="NetVisor can automatically detect 100+ services including Docker, databases, media servers, and more."
	/>
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Supported Services</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-400">
				NetVisor automatically detects and identifies these services running on your network. More
				services are added regularly.
			</p>
		</div>

		<ServiceCatalog {services} showDiscoveryPatterns={true} />

		<div class="mt-16 text-center">
			<p class="mb-4 text-gray-400">Don't see a service you use? We're constantly adding more.</p>
			<a
				href="https://github.com/netvisor-io/netvisor/issues/new?template=service_request.md"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
			>
				Request a Service
			</a>
		</div>
	</div>
</section>
