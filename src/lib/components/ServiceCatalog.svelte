<script lang="ts">
	import { Search, ChevronDown, ChevronRight } from 'lucide-svelte';
	import type { ServiceDefinition } from '$lib/types';
	import { createColorHelper } from '$lib/utils/styling';
	import { SvelteSet, SvelteMap } from 'svelte/reactivity';
	import { analytics } from '$lib/analytics';

	interface Props {
		services: ServiceDefinition[];
		class?: string;
		showDiscoveryPatterns?: boolean;
	}

	let { services, class: className = '', showDiscoveryPatterns = false }: Props = $props();

	let searchQuery = $state('');
	let selectedCategory = $state<string | null>(null);
	let expandedServices = new SvelteSet<string>();

	let categories = $derived(() => {
		const cats = [...new SvelteSet(services.map((s) => s.category))];
		return cats.sort((a, b) => a.localeCompare(b));
	});

	// Debounced search tracking
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		const query = searchQuery.trim();
		if (query.length >= 2) {
			if (searchTimeout) clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				analytics.servicesSearched({
					query,
					results_count: filteredServices().length,
					category_filter: selectedCategory
				});
			}, 500);
		}
		return () => {
			if (searchTimeout) clearTimeout(searchTimeout);
		};
	});

	let filteredServices = $derived(() => {
		let result = services;

		if (selectedCategory) {
			result = result.filter((s) => s.category === selectedCategory);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(s) =>
					s.name.toLowerCase().includes(query) ||
					s.description.toLowerCase().includes(query) ||
					s.category.toLowerCase().includes(query)
			);
		}

		return result;
	});

	let groupedServices = $derived(() => {
		const groups = new SvelteMap<string, ServiceDefinition[]>();

		for (const service of filteredServices()) {
			const cat = service.category;
			if (!groups.has(cat)) {
				groups.set(cat, []);
			}
			groups.get(cat)!.push(service);
		}

		for (const [, serviceList] of groups) {
			serviceList.sort((a, b) => a.name.localeCompare(b.name));
		}

		// Sort groups alphabetically by category name
		const sortedEntries = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
		return new Map(sortedEntries);
	});

	function toggleServiceExpand(serviceName: string) {
		if (expandedServices.has(serviceName)) {
			expandedServices.delete(serviceName);
			expandedServices = new SvelteSet(expandedServices);
		} else {
			expandedServices.add(serviceName);
			expandedServices = new SvelteSet(expandedServices);
		}
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = null;
	}

	function getCategoryColorHelper(categoryServices: ServiceDefinition[]) {
		const firstService = categoryServices[0];
		return createColorHelper(firstService.color || null);
	}
</script>

<div class="space-y-6 {className}">
	<div class="space-y-4">
		<div class="relative max-w-md">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				placeholder="Search services..."
				bind:value={searchQuery}
				class="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
			/>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<button
				type="button"
				onclick={() => (selectedCategory = null)}
				class="rounded-full px-3 py-1 text-xs font-medium transition-colors {selectedCategory ===
				null
					? 'bg-blue-700 text-white'
					: 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
			>
				All ({services.length})
			</button>
			{#each categories() as category (category)}
				<button
					type="button"
					onclick={() => (selectedCategory = selectedCategory === category ? null : category)}
					class="rounded-full px-3 py-1 text-xs font-medium transition-colors {selectedCategory ===
					category
						? 'bg-blue-700 text-white'
						: 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
				>
					{category}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex items-center justify-between text-sm text-gray-400">
		<span>
			{filteredServices().length} service{filteredServices().length !== 1 ? 's' : ''} found
		</span>
		{#if searchQuery || selectedCategory}
			<button type="button" onclick={clearFilters} class="text-sky-400 hover:text-sky-300">
				Clear filters
			</button>
		{/if}
	</div>

	<div class="space-y-8">
		{#each [...groupedServices().entries()] as [category, categoryServices] (category)}
			{@const colorHelper = getCategoryColorHelper(categoryServices)}
			<div>
				<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
					<span
						class="inline-block rounded-md border px-2 py-0.5 text-xs {colorHelper.bg} {colorHelper.text}"
					>
						{category}
					</span>
					<span class="text-sm font-normal text-gray-400">({categoryServices.length})</span>
				</h3>

				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each categoryServices as service (service.name)}
						<div
							class="group rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-gray-600 hover:bg-gray-800"
						>
							<div class="flex items-start gap-3">
								<div
									class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg {service.logo_needs_white_background
										? 'bg-white'
										: 'bg-gray-700/50'}"
								>
									{#if service.logo_url}
										<img
											src={service.logo_url}
											alt="{service.name} logo"
											class="h-6 w-6 object-contain"
											onerror={(e) => {
												const target = e.target as HTMLImageElement;
												target.style.display = 'none';
											}}
										/>
									{:else}
										<span class="text-lg font-bold text-gray-500">
											{service.name.charAt(0)}
										</span>
									{/if}
								</div>

								<div class="min-w-0 flex-1">
									<h4 class="truncate font-medium text-white">{service.name}</h4>
									<p class="mt-1 line-clamp-2 text-xs text-gray-400">{service.description}</p>
								</div>
							</div>

							{#if showDiscoveryPatterns && service.discovery_pattern}
								<button
									type="button"
									onclick={() => toggleServiceExpand(service.name)}
									class="mt-3 flex w-full items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
								>
									{#if expandedServices.has(service.name)}
										<ChevronDown class="h-3 w-3" />
									{:else}
										<ChevronRight class="h-3 w-3" />
									{/if}
									<span>How it's detected</span>
								</button>

								{#if expandedServices.has(service.name)}
									<div class="mt-2 rounded bg-gray-900/50 p-2 text-xs text-gray-400">
										{service.discovery_pattern}
									</div>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	{#if filteredServices().length === 0}
		<div class="py-12 text-center">
			<p class="text-gray-400">No services found matching your search.</p>
			<button type="button" onclick={clearFilters} class="mt-2 text-sky-400 hover:text-sky-300">
				Clear filters
			</button>
		</div>
	{/if}
</div>
