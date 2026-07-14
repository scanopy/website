<script lang="ts">
	import { onDestroy } from 'svelte';

	interface View {
		id: string;
		label: string;
		alt: string;
		src: string;
		srcset: string;
		width?: number;
		height?: number;
	}

	interface Props {
		views: View[];
		defaultTab?: string;
		autoRotate?: boolean;
		rotateIntervalMs?: number;
	}

	let { views, defaultTab, autoRotate = false, rotateIntervalMs = 5000 }: Props = $props();
	let activeId = $state(defaultTab ?? views[0]?.id ?? '');

	const active = $derived(views.find((v) => v.id === activeId) ?? views[0]);

	let rotating = $state(autoRotate);
	let paused = $state(false);
	let timerId: ReturnType<typeof setTimeout> | null = null;

	function advance() {
		const idx = views.findIndex((v) => v.id === activeId);
		const next = views[(idx + 1) % views.length];
		if (next) activeId = next.id;
	}

	function scheduleNext() {
		if (timerId) clearTimeout(timerId);
		if (!rotating || paused) return;
		timerId = setTimeout(() => {
			advance();
			scheduleNext();
		}, rotateIntervalMs);
	}

	$effect(() => {
		if (rotating && !paused) {
			scheduleNext();
		} else if (timerId) {
			clearTimeout(timerId);
			timerId = null;
		}
	});

	onDestroy(() => {
		if (timerId) clearTimeout(timerId);
	});

	function handleTabClick(id: string) {
		activeId = id;
		rotating = false;
	}
</script>

<div
	class="w-full"
	onmouseenter={() => (paused = true)}
	onmouseleave={() => (paused = false)}
	role="region"
	aria-label="Infrastructure view switcher"
>
	<!-- Tab bar -->
	<div class="mb-3 flex gap-1 overflow-x-auto rounded-lg bg-gray-800/50 p-1">
		{#each views as view (view.id)}
			<button
				class="flex-shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors sm:flex-1 sm:text-sm {activeId ===
				view.id
					? 'bg-gray-700 text-white shadow-sm'
					: 'text-gray-400 hover:text-gray-200'}"
				onclick={() => handleTabClick(view.id)}
			>
				{view.label}
			</button>
		{/each}
	</div>

	<!-- Browser frame with screenshot, tiltable region -->
	<div class="tiltable">
		<div class="browser-frame">
			<div class="browser-frame-bar">
				<span class="browser-frame-dot bg-red-500/70"></span>
				<span class="browser-frame-dot bg-yellow-500/70"></span>
				<span class="browser-frame-dot bg-green-500/70"></span>
				<span class="ml-3 text-xs text-gray-500">app.scanopy.net</span>
			</div>
			{#key active.id}
				<div class="aspect-[4/3] p-6" style="background-color: var(--topo-bg);">
					<img
						src={active.src}
						srcset={active.srcset}
						sizes="(max-width: 1024px) 100vw, 60vw"
						alt={active.alt}
						width={active.width}
						height={active.height}
						class="block h-full w-full object-contain"
						loading={active.id === defaultTab ? 'eager' : 'lazy'}
						fetchpriority={active.id === defaultTab ? 'high' : undefined}
					/>
				</div>
			{/key}
		</div>
	</div>
</div>
