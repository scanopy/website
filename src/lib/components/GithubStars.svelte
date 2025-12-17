<script lang="ts">
	import { Github, Star } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Props {
		class?: string;
		repoUrl?: string;
	}

	let { class: className = '', repoUrl = 'https://github.com/scanopy/scanopy' }: Props = $props();

	let stars = writable<number>();
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
				stars.set(cached);
				error = false;
				loading = false;
				return;
			}

			const count = await fetchFromPublicApi();
			if (count !== null) {
				stars.set(count);
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

{#if !loading && !error && $stars != null && $stars != undefined}
	<a
		href="https://github.com/scanopy/scanopy"
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/80 px-4 py-2 text-sm text-gray-300 shadow-lg backdrop-blur-sm transition-all hover:border-gray-600 hover:bg-gray-700/80 {className}"
	>
		<Github class="h-4 w-4" />
		<span class="flex items-center gap-1">
			<Star class="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
			<span>{formatStars($stars)}</span>
		</span>
	</a>
{:else if loading}
	<div
		class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/80 px-4 py-2 text-sm text-gray-400 shadow-lg backdrop-blur-sm {className}"
	>
		<Github class="h-4 w-4" />
		<span class="flex items-center gap-1">
			<Star class="h-3.5 w-3.5" />
			<span>...</span>
		</span>
	</div>
{/if}
