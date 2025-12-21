<script lang="ts">
	import { ExternalLink, Image, Server, X, ZoomIn, ZoomOut } from 'lucide-svelte';
	import type { GalleryItem } from '$lib/types';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		items: GalleryItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();

	let selectedTag = $state<string | null>(null);
	let lightboxItem = $state<GalleryItem | null>(null);
	let isZoomed = $state(false);
	let isMobile = $state(false);

	// Check for mobile on mount
	$effect(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	let allTags = $derived(() => {
		const tags = new SvelteSet<string>();
		for (const item of items) {
			for (const tag of item.tags) {
				tags.add(tag);
			}
		}
		return [...tags].sort((a, b) => a.localeCompare(b));
	});

	let filteredItems = $derived(() => {
		if (!selectedTag) return items;
		return items.filter((item) => item.tags.includes(selectedTag!));
	});

	let featuredItems = $derived(() => filteredItems().filter((item) => item.featured));
	let regularItems = $derived(() => filteredItems().filter((item) => !item.featured));

	function clearFilter() {
		selectedTag = null;
	}

	function openLightbox(item: GalleryItem) {
		lightboxItem = item;
		isZoomed = false;
	}

	function closeLightbox() {
		lightboxItem = null;
		isZoomed = false;
	}

	function toggleZoom() {
		if (!isMobile) {
			isZoomed = !isZoomed;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && lightboxItem) {
			closeLightbox();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Lightbox Modal -->
{#if lightboxItem}
	<div
		class="fixed inset-0 z-50 bg-black/90 {isZoomed
			? 'overflow-auto'
			: 'flex items-center justify-center'}"
		onclick={isZoomed ? undefined : closeLightbox}
		onkeydown={(e) => e.key === 'Escape' && closeLightbox()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Controls -->
		<div class="fixed right-4 top-4 z-10 flex gap-2">
			{#if !isMobile}
				<button
					type="button"
					class="rounded-full bg-gray-800/80 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
					onclick={toggleZoom}
					aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
				>
					{#if isZoomed}
						<ZoomOut class="h-6 w-6" />
					{:else}
						<ZoomIn class="h-6 w-6" />
					{/if}
				</button>
			{/if}
			<button
				type="button"
				class="rounded-full bg-gray-800/80 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
				onclick={closeLightbox}
				aria-label="Close lightbox"
			>
				<X class="h-6 w-6" />
			</button>
		</div>

		{#if isZoomed && !isMobile}
			<!-- Zoomed: full size, scrollable -->
			<div class="min-h-full min-w-full p-4">
				<button type="button" onclick={toggleZoom} class="cursor-zoom-out">
					<img src={lightboxItem.image} alt={lightboxItem.title} />
				</button>
			</div>
		{:else}
			<!-- Fit to screen with space for details -->
			<div class="flex h-full flex-col items-center justify-center gap-4 p-4">
				<button
					type="button"
					class="max-h-[calc(100vh-120px)] max-w-[90vw] {isMobile ? '' : 'cursor-zoom-in'}"
					onclick={(e) => {
						e.stopPropagation();
						if (!isMobile) toggleZoom();
					}}
				>
					<img
						src={lightboxItem.image}
						alt={lightboxItem.title}
						class="max-h-[calc(100vh-120px)] max-w-[90vw] object-contain"
					/>
				</button>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- Details island -->
				<div
					class="flex w-full max-w-2xl items-center justify-between gap-4 rounded-lg border border-gray-700 bg-gray-900/95 px-4 py-2 backdrop-blur-sm"
					onclick={(e) => e.stopPropagation()}
				>
					<div class="min-w-0 flex-1">
						<h3 class="truncate font-medium text-white">{lightboxItem.title}</h3>
						<div class="flex items-center gap-3 text-xs text-gray-500">
							{#if lightboxItem.author.url}
								<a
									href={lightboxItem.author.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-1 hover:text-blue-400"
								>
									{lightboxItem.author.name}
									<ExternalLink class="h-3 w-3" />
								</a>
							{:else}
								<span>{lightboxItem.author.name}</span>
							{/if}
							{#if lightboxItem.services_count}
								<span class="flex items-center gap-1">
									<Server class="h-3 w-3" />
									{lightboxItem.services_count} services
								</span>
							{/if}
						</div>
					</div>

					{#if lightboxItem.tags.length > 0}
						<div class="hidden flex-wrap gap-1 sm:flex">
							{#each lightboxItem.tags as tag (tag)}
								<span class="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
									{tag}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/if}

<div class="space-y-8 {className}">
	<!-- Tag filters -->
	{#if allTags().length > 0}
		<div class="flex flex-wrap items-center gap-2">
			<button
				type="button"
				onclick={() => (selectedTag = null)}
				class="rounded-full px-3 py-1 text-xs font-medium transition-colors {selectedTag === null
					? 'bg-blue-600 text-white'
					: 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
			>
				All ({items.length})
			</button>
			{#each allTags() as tag (tag)}
				<button
					type="button"
					onclick={() => (selectedTag = selectedTag === tag ? null : tag)}
					class="rounded-full px-3 py-1 text-xs font-medium transition-colors {selectedTag === tag
						? 'bg-blue-600 text-white'
						: 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
				>
					{tag}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Results count -->
	<div class="flex items-center justify-between text-sm text-gray-400">
		<span>
			{filteredItems().length} diagram{filteredItems().length !== 1 ? 's' : ''}
		</span>
		{#if selectedTag}
			<button type="button" onclick={clearFilter} class="text-blue-400 hover:text-blue-300">
				Clear filter
			</button>
		{/if}
	</div>

	<!-- Featured items -->
	{#if featuredItems().length > 0}
		<div>
			<h3 class="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">Featured</h3>
			<div class="grid gap-6 md:grid-cols-2">
				{#each featuredItems() as item (item.id)}
					<div
						class="group overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 transition-all hover:border-gray-600 hover:bg-gray-800"
					>
						<button
							type="button"
							class="relative aspect-video w-full cursor-pointer overflow-hidden bg-gray-900"
							onclick={() => openLightbox(item)}
						>
							<img
								src={item.image}
								alt={item.title}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								onerror={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
									target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
									const placeholder = document.createElement('div');
									placeholder.className = 'text-gray-600 flex flex-col items-center gap-2';
									placeholder.innerHTML = `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-sm">Image coming soon</span>`;
									target.parentElement?.appendChild(placeholder);
								}}
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100"
							>
								<span class="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900">
									Click to enlarge
								</span>
							</div>
						</button>

						<div class="p-4">
							<h4 class="text-lg font-semibold text-white">{item.title}</h4>
							<p class="mt-1 text-sm text-gray-400">{item.description}</p>

							{#if item.tags.length > 0}
								<div class="mt-3 flex flex-wrap items-center gap-2">
									{#each item.tags as tag (tag)}
										<span class="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
											{tag}
										</span>
									{/each}
								</div>
							{/if}

							<div class="mt-4 flex items-center justify-between text-sm">
								<div class="flex items-center gap-1 text-gray-500">
									{#if item.author.url}
										<a
											href={item.author.url}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-1 text-gray-400 hover:text-blue-400"
										>
											{item.author.name}
											<ExternalLink class="h-3 w-3" />
										</a>
									{:else}
										<span class="text-gray-400">{item.author.name}</span>
									{/if}
								</div>
								{#if item.services_count}
									<div class="flex items-center gap-1 text-gray-500">
										<Server class="h-3 w-3" />
										<span>{item.services_count} services</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Regular items -->
	{#if regularItems().length > 0}
		<div>
			{#if featuredItems().length > 0}
				<h3 class="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
					Community Submissions
				</h3>
			{/if}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each regularItems() as item (item.id)}
					<div
						class="group overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 transition-all hover:border-gray-600 hover:bg-gray-800"
					>
						<button
							type="button"
							class="relative aspect-video w-full cursor-pointer overflow-hidden bg-gray-900"
							onclick={() => openLightbox(item)}
						>
							<img
								src={item.image}
								alt={item.title}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								onerror={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
									target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
									const placeholder = document.createElement('div');
									placeholder.className = 'text-gray-600 flex flex-col items-center gap-2';
									placeholder.innerHTML = `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-sm">Image coming soon</span>`;
									target.parentElement?.appendChild(placeholder);
								}}
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100"
							>
								<span class="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900">
									Click to enlarge
								</span>
							</div>
						</button>

						<div class="p-4">
							<h4 class="font-semibold text-white">{item.title}</h4>
							<p class="mt-1 line-clamp-2 text-sm text-gray-400">{item.description}</p>

							{#if item.tags.length > 0}
								<div class="mt-3 flex flex-wrap gap-1">
									{#each item.tags as tag (tag)}
										<span class="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
											{tag}
										</span>
									{/each}
								</div>
							{/if}

							<div class="mt-3 flex items-center justify-between text-xs">
								<div class="text-gray-500">
									{#if item.author.url}
										<a
											href={item.author.url}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-1 hover:text-blue-400"
										>
											{item.author.name}
											<ExternalLink class="h-3 w-3" />
										</a>
									{:else}
										<span>{item.author.name}</span>
									{/if}
								</div>
								{#if item.services_count}
									<div class="flex items-center gap-1 text-gray-500">
										<Server class="h-3 w-3" />
										<span>{item.services_count}</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Empty state -->
	{#if filteredItems().length === 0}
		<div class="py-12 text-center">
			<Image class="mx-auto h-12 w-12 text-gray-600" />
			<p class="mt-4 text-gray-400">No diagrams found matching this filter.</p>
			<button type="button" onclick={clearFilter} class="mt-2 text-blue-400 hover:text-blue-300">
				Clear filter
			</button>
		</div>
	{/if}
</div>
