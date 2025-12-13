<script lang="ts">
	import posthog from 'posthog-js';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	const COOKIE_NAME = 'netvisor_gdpr';
	const COOKIE_DOMAIN = dev ? '' : '.netvisor.io';

	type ConsentState = 'pending' | 'accepted' | 'rejected';

	let consentState: ConsentState = $state('pending');
	let showBanner = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const existing = getCookie(COOKIE_NAME);
		if (existing === 'accepted') {
			consentState = 'accepted';
			showBanner = false;
			if (posthog.__loaded) posthog.opt_in_capturing();
		} else if (existing === 'rejected') {
			consentState = 'rejected';
			showBanner = false;
			if (posthog.__loaded) posthog.opt_out_capturing();
		} else {
			showBanner = true;
		}
	});

	function getCookie(name: string): string | null {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : null;
	}

	function setCookie(name: string, value: string, days: number) {
		const expires = new Date(Date.now() + days * 864e5).toUTCString();
		const domain = COOKIE_DOMAIN ? `; domain=${COOKIE_DOMAIN}` : '';
		document.cookie = `${name}=${value}; expires=${expires}; path=/${domain}; SameSite=Lax`;
	}

	function accept() {
		consentState = 'accepted';
		showBanner = false;
		setCookie(COOKIE_NAME, 'accepted', 365);
		if (posthog.__loaded) posthog.opt_in_capturing();
	}

	function reject() {
		consentState = 'rejected';
		showBanner = false;
		setCookie(COOKIE_NAME, 'rejected', 365);
		if (posthog.__loaded) posthog.opt_out_capturing();
	}

	function openSettings() {
		showBanner = true;
	}
</script>

{#if mounted}
	{#if showBanner}
		<div class="banner">
			<div class="content">
				<h3 class="title">Cookie Settings</h3>
				<p class="description">
					We use cookies to offer a better browsing experience and analyze site traffic.
					Please review our <a href="/privacy">privacy policy</a>.
					By clicking accept, you consent to our privacy policy & use of cookies.
				</p>
				<div class="buttons">
					<button class="btn btn-secondary" onclick={reject}>Reject</button>
					<button class="btn btn-primary" onclick={accept}>Accept</button>
				</div>
			</div>
		</div>
	{:else}
		<button class="toggle" onclick={openSettings} aria-label="Cookie settings">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"/>
				<circle cx="8" cy="9" r="1.5" fill="currentColor"/>
				<circle cx="15" cy="8" r="1.5" fill="currentColor"/>
				<circle cx="10" cy="14" r="1.5" fill="currentColor"/>
				<circle cx="16" cy="13" r="1.5" fill="currentColor"/>
				<circle cx="13" cy="17" r="1" fill="currentColor"/>
			</svg>
		</button>
	{/if}
{/if}

<style>
	.banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #1f2937;
		border-top: 1px solid #374151;
		padding: 1.5rem;
		z-index: 9999;
	}

	.content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.content {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.title {
		color: white;
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.description {
		color: #9ca3af;
		font-size: 0.875rem;
		margin: 0;
		flex: 1;
	}

	.description a {
		color: #60a5fa;
		text-decoration: underline;
	}

	.description a:hover {
		color: #93c5fd;
	}

	.buttons {
		display: flex;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 150ms, border-color 150ms;
	}

	.btn-primary {
		background: #1d4ed8;
		color: white;
		border: 1px solid #2563eb;
	}

	.btn-primary:hover {
		background: #2563eb;
		border-color: #3b82f6;
	}

	.btn-secondary {
		background: transparent;
		color: #9ca3af;
		border: 1px solid #374151;
	}

	.btn-secondary:hover {
		background: #1f2937;
		border-color: #4b5563;
		color: #e5e7eb;
	}

	.toggle {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: #1f2937;
		border: 1px solid #374151;
		color: #9ca3af;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
		z-index: 9999;
		transition: background-color 150ms, color 150ms;
	}

	.toggle:hover {
		background: #374151;
		color: white;
	}
</style>
