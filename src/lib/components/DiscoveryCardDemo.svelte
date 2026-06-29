<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Radar } from 'lucide-svelte';

	// Ported verbatim from the Scanopy app
	// (ui/src/lib/features/discovery/utils/estimation.ts) so the live label reads
	// identically to the product.
	function formatEstimatedRemaining(secs: number): string {
		if (secs < 60) return 'less than a minute';
		const minutes = Math.round(secs / 60);
		if (minutes === 1) return 'about 1 minute';
		if (minutes < 60) return `about ${minutes} minutes`;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		if (hours === 1) {
			if (remainingMinutes === 0) return 'about 1 hour';
			return `about 1 hour ${remainingMinutes} minutes`;
		}
		if (remainingMinutes === 0) return `about ${hours} hours`;
		return `about ${hours} hours ${remainingMinutes} minutes`;
	}

	// Simulated scan parameters.
	const TOTAL_SECS = 4 * 60; // notional full-scan duration the ETA counts down from
	const TOTAL_HOSTS = 52; // hosts discovered by the time the scan completes
	const CYCLE_MS = 20_000; // wall-clock length of one visible 0→100% sweep
	const HOLD_MS = 2_000; // pause at 100% before looping
	const TICK_MS = 200;

	// Reactive card state.
	let progress = $state(0);
	let hostsFound = $state(0);
	let remainingSecs = $state(TOTAL_SECS);
	let reducedMotion = $state(false);

	let elapsed = 0;
	let timer: ReturnType<typeof setInterval> | null = null;

	function applyPosition(pos: number) {
		// pos is 0→1 across the sweep.
		progress = Math.round(pos * 100);
		hostsFound = Math.round(pos * TOTAL_HOSTS);
		remainingSecs = Math.max(0, Math.round(TOTAL_SECS * (1 - pos)));
	}

	const estimationText = $derived.by(() => {
		if (!hostsFound) return 'Scanning for hosts...';
		return `Found ${hostsFound} hosts — ${formatEstimatedRemaining(remainingSecs)} remaining`;
	});

	onMount(() => {
		reducedMotion =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reducedMotion) {
			// Static representative frame (mid-scan snapshot).
			applyPosition(0.35);
			return;
		}

		timer = setInterval(() => {
			elapsed += TICK_MS;
			if (elapsed <= CYCLE_MS) {
				applyPosition(elapsed / CYCLE_MS);
			} else if (elapsed <= CYCLE_MS + HOLD_MS) {
				applyPosition(1); // hold at complete
			} else {
				elapsed = 0;
				applyPosition(0); // reset and loop
			}
		}, TICK_MS);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div
	class="card card-static"
	role="img"
	aria-label="Scanopy network scan in progress"
	style="box-shadow: 0 4px 40px rgb(var(--c-blue-500) / 0.08), 0 8px 24px rgba(0,0,0,0.4);"
>
	<!-- Header -->
	<div class="mb-5 flex items-center gap-3">
		<Radar class="h-7 w-7 text-green-400" aria-hidden="true" />
		<span class="text-primary text-lg font-bold">Network Discovery</span>
	</div>

	<!-- Static metadata fields -->
	<div class="space-y-3 text-sm" aria-hidden="true">
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-secondary font-medium">Daemon:</span>
			<span
				class="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-500/20"
			>
				scanopy-daemon-my-network
			</span>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-secondary font-medium">Started:</span>
			<span class="text-tertiary">Mar 12, 2026, 17:45</span>
		</div>
		<div class="flex flex-wrap items-baseline gap-2">
			<span class="text-secondary font-medium">Session ID:</span>
			<span class="text-tertiary break-all">d1113f4c-a0a0-4047-94a1-32eeca79747c</span>
		</div>
	</div>

	<!-- Live phase + progress -->
	<div class="mt-5" aria-hidden="true">
		<div class="mb-2 flex items-center gap-2 text-sm">
			<span class="text-secondary font-medium">Phase:</span>
			<span class="font-medium text-purple-600 dark:text-purple-400">Scanning</span>
		</div>

		<p class="text-secondary mb-2 text-xs">{estimationText}</p>

		<div class="flex items-center gap-2">
			<div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
				<div
					class="progress-fill relative h-full overflow-hidden rounded-full bg-blue-500"
					style="width: {progress}%"
				>
					{#if !reducedMotion}
						<div class="progress-shimmer absolute inset-0"></div>
					{/if}
				</div>
			</div>
			<span class="text-secondary w-9 text-right text-xs">{progress}%</span>
		</div>
	</div>
</div>

<style>
	.progress-fill {
		transition: width 0.4s ease;
	}

	.progress-shimmer {
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.15) 50%,
			transparent 100%
		);
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
