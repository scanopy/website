<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
		repoUrl?: string;
		usePublicApi?: boolean; // Always uses public API, kept for compatibility
	}

	let {
		class: className = '',
		repoUrl = 'https://github.com/scanopy/scanopy',
		usePublicApi: _ = true // eslint-disable-line @typescript-eslint/no-unused-vars
	}: Props = $props();

	let stars = $state<number | undefined>(undefined);
	let loading = $state(true);
	let error = $state(false);

	const cacheKey = 'scanopy-github-stars';
	const cacheTtlMs = 3600000; // 1 hour

	interface CachedValue {
		stars: number;
		timestamp: number;
	}

	function getCachedStars(): number | null {
		if (typeof window === 'undefined') return null;
		try {
			const cached = localStorage.getItem(cacheKey);
			if (!cached) return null;
			const parsed: CachedValue = JSON.parse(cached);
			if (Date.now() - parsed.timestamp < cacheTtlMs) {
				return parsed.stars;
			}
			localStorage.removeItem(cacheKey);
		} catch {
			// Ignore localStorage errors
		}
		return null;
	}

	function setCachedStars(count: number): void {
		if (typeof window === 'undefined') return;
		try {
			const value: CachedValue = { stars: count, timestamp: Date.now() };
			localStorage.setItem(cacheKey, JSON.stringify(value));
		} catch {
			// Ignore localStorage errors
		}
	}

	async function fetchFromPublicApi(): Promise<number | null> {
		const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
		if (!match) return null;
		const [, owner, repo] = match;

		const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
			headers: { Accept: 'application/vnd.github.v3+json' }
		});
		if (!response.ok) return null;
		const data = await response.json();
		return data.stargazers_count ?? null;
	}

	async function fetchStars() {
		try {
			const cached = getCachedStars();
			if (cached !== null) {
				stars = cached;
				error = false;
				loading = false;
				return;
			}

			const count = await fetchFromPublicApi();
			if (count !== null) {
				stars = count;
				setCachedStars(count);
				error = false;
			} else {
				error = true;
			}
		} catch (err) {
			console.error('Error fetching GitHub stars:', err);
			error = true;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchStars();
	});

	function formatStars(count: number): string {
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}k`;
		}
		return count.toString();
	}
</script>

{#if !loading && !error && stars != null && stars != undefined}
	<a
		href={repoUrl}
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 bg-gray-700/50 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:bg-gray-700 {className}"
	>
		<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
		<span>{formatStars(stars)}</span>
	</a>
{:else if loading}
	<div
		class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 bg-gray-700/50 px-3 py-1.5 text-sm {className}"
	>
		<Star class="h-4 w-4 text-gray-500" />
		<span class="text-gray-500">...</span>
	</div>
{/if}
