<script lang="ts">
	import { onMount } from 'svelte';
	import { chrome } from '$lib/stores/chrome.svelte';

	export interface StickyCta {
		label: string;
		href: string;
		/** Visual style; defaults to primary. */
		variant?: 'primary' | 'secondary';
		/** Open in a new tab (adds target/rel). */
		external?: boolean;
		onclick?: () => void;
	}

	interface Props {
		/** The CTAs to show, in order. */
		ctas: StickyCta[];
		/**
		 * Element that hides the bar once the reader reaches it (in view or scrolled
		 * past). Typically the page's own footer/bottom CTA so the two don't stack.
		 */
		target?: HTMLElement;
		/** Show the centered desktop pill too. When false the bar is mobile-only. */
		desktop?: boolean;
		ariaLabel?: string;
	}

	let {
		ctas,
		target,
		desktop = true,
		ariaLabel = 'Get started with Scanopy'
	}: Props = $props();

	// Shown once the reader is past the hero, hidden again when the target CTA is
	// reached or while the cookie banner is open. On mobile-only bars (desktop =
	// false) it also stays hidden above the md breakpoint so the cookie toggle
	// isn't nudged for a bar that isn't rendered.
	let mounted = $state(false);
	let scrolledPastHero = $state(false);
	let targetReached = $state(false);
	let isMobile = $state(false);
	let barEl = $state<HTMLElement>();

	const barVisible = $derived(
		mounted &&
			scrolledPastHero &&
			!targetReached &&
			!chrome.cookieBannerOpen &&
			(desktop || isMobile)
	);

	$effect(() => {
		chrome.bottomBarVisible = barVisible;
	});

	// Publish the bar's height so the cookie toggle can clear it (the stacked
	// mobile layout is taller than a single row).
	$effect(() => {
		if (!barEl) return;
		const ro = new ResizeObserver(() => {
			chrome.bottomBarHeight = barEl?.offsetHeight ?? 0;
		});
		ro.observe(barEl);
		chrome.bottomBarHeight = barEl.offsetHeight;
		return () => ro.disconnect();
	});

	onMount(() => {
		mounted = true;

		const mq = window.matchMedia('(max-width: 767px)');
		isMobile = mq.matches;
		const onMq = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mq.addEventListener('change', onMq);

		let ticking = false;
		const update = () => {
			// "Past the first screen" — a hero-shape-agnostic proxy for scroll depth.
			scrolledPastHero = window.scrollY > window.innerHeight * 0.8;
			// Target reached once its top scrolls up into (or above) the viewport.
			targetReached = target
				? target.getBoundingClientRect().top < window.innerHeight * 0.9
				: false;
			ticking = false;
		};
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		update();

		return () => {
			mq.removeEventListener('change', onMq);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			chrome.bottomBarVisible = false;
			chrome.bottomBarHeight = 0;
		};
	});
</script>

{#if mounted}
	<aside
		bind:this={barEl}
		class="bottom-bar"
		class:is-visible={barVisible}
		class:mobile-only={!desktop}
		inert={!barVisible}
		aria-label={ariaLabel}
	>
		{#each ctas as cta (cta.label)}
			<a
				href={cta.href}
				class={cta.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}
				target={cta.external ? '_blank' : undefined}
				rel={cta.external ? 'noopener noreferrer' : undefined}
				onclick={cta.onclick}>{cta.label}</a
			>
		{/each}
	</aside>
{/if}

<style>
	/* Mobile: full-width bar pinned to the bottom, matching the cookie banner surface.
	   Hidden by default; slides up when `.is-visible` is set. */
	.bottom-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 60;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.625rem;
		padding: 0.875rem 1rem calc(0.875rem + env(safe-area-inset-bottom));
		background: rgb(var(--c-gray-800));
		border-top: 1px solid rgb(var(--c-gray-700));
		transform: translateY(100%);
		opacity: 0;
		transition:
			transform 200ms ease,
			opacity 200ms ease;
	}

	.bottom-bar.is-visible {
		transform: translateY(0);
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.bottom-bar {
			transition: opacity 200ms ease;
		}
	}

	/* Mobile: stacked, each CTA spans the full width of the bar, slightly larger
	   text for proportionality. */
	.bottom-bar :global(.btn-primary),
	.bottom-bar :global(.btn-secondary) {
		width: 100%;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		font-size: 1rem;
	}

	/* Desktop: a compact, centered floating pill — not full width. The centering
	   translateX(-50%) is composed with the slide-up translateY so both animate
	   together without conflict. */
	@media (min-width: 768px) {
		.bottom-bar {
			left: 50%;
			right: auto;
			bottom: 1.5rem;
			flex-direction: row;
			align-items: center;
			gap: 1rem;
			width: max-content;
			max-width: min(36rem, calc(100vw - 2rem));
			padding: 0.6rem 0.75rem;
			border: 1px solid rgb(var(--c-gray-700));
			border-radius: 9999px;
			box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
			transform: translate(-50%, calc(100% + 1.5rem));
		}

		.bottom-bar.is-visible {
			transform: translate(-50%, 0);
		}

		.bottom-bar :global(.btn-primary),
		.bottom-bar :global(.btn-secondary) {
			width: auto;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
			font-size: 0.875rem;
		}

		/* Mobile-only bars (e.g. the homepage) never show the desktop pill. */
		.bottom-bar.mobile-only {
			display: none;
		}
	}
</style>
