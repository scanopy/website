<script lang="ts">
	import { Mail, CheckCircle, AlertCircle } from 'lucide-svelte';

	interface Props {
		apiKey: string;
		eventName?: string;
		class?: string;
		compact?: boolean;
	}

	let {
		apiKey,
		eventName = 'newsletter-signup',
		class: className = '',
		compact = false
	}: Props = $props();

	let email = $state('');
	let loading = $state(false);
	let status = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	function validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!email.trim()) {
			status = 'error';
			errorMessage = 'Please enter your email address';
			return;
		}

		if (!validateEmail(email)) {
			status = 'error';
			errorMessage = 'Please enter a valid email address';
			return;
		}

		loading = true;
		status = 'idle';
		errorMessage = '';

		try {
			const response = await fetch('https://api.useplunk.com/v1/track', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					event: eventName,
					email: email.trim(),
					subscribed: true,
					metadata: {
						signup_source: 'website'
					}
				})
			});

			if (response.ok) {
				status = 'success';
				email = '';
			} else {
				throw new Error('Failed to subscribe');
			}
		} catch (err) {
			console.error('Newsletter signup error:', err);
			status = 'error';
			errorMessage = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}

	function reset() {
		status = 'idle';
		errorMessage = '';
	}
</script>

{#if status === 'success'}
	<div class="flex items-center gap-3 {className}">
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
			<CheckCircle class="h-5 w-5 text-green-400" />
		</div>
		<div>
			<p class="font-medium text-white">You're subscribed!</p>
			<p class="text-sm text-gray-400">We'll keep you updated.</p>
		</div>
	</div>
{:else}
	<form onsubmit={handleSubmit} class="space-y-3 {className}">
		{#if !compact}
			<div class="flex items-center gap-2 text-sm text-gray-400">
				<Mail class="h-4 w-4" />
				<span>Subscribe to updates</span>
			</div>
		{/if}

		<div class="flex gap-2 {compact ? 'flex-col sm:flex-row' : ''}">
			<input
				type="email"
				placeholder="Enter your email"
				bind:value={email}
				oninput={reset}
				disabled={loading}
				class="flex-1 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50 {status ===
				'error'
					? 'border-red-500'
					: ''}"
			/>
			<button
				type="submit"
				disabled={loading}
				class="btn-primary text-sm disabled:opacity-50 {compact ? 'w-full sm:w-auto' : ''}"
			>
				{#if loading}
					<span class="flex items-center justify-center gap-2">
						<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<span>Subscribing...</span>
					</span>
				{:else}
					Subscribe
				{/if}
			</button>
		</div>

		{#if status === 'error' && errorMessage}
			<div class="flex items-center gap-2 text-sm text-red-400">
				<AlertCircle class="h-4 w-4" />
				<span>{errorMessage}</span>
			</div>
		{/if}

		{#if !compact}
			<p class="text-xs text-gray-500">We respect your privacy. Unsubscribe at any time.</p>
		{/if}
	</form>
{/if}
