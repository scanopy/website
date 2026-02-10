<script lang="ts">
	import { X, Send, CheckCircle, AlertCircle } from 'lucide-svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { submitContactInquiry } from '$lib/brevo';
	import { PUBLIC_BREVO_CONTACT_FORM_URL } from '$env/static/public';

	interface Props {
		open: boolean;
		onClose: () => void;
		planType: string;
		planName: string;
	}

	let { open, onClose, planType, planName }: Props = $props();

	let email = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let company = $state('');
	let teamSize = $state('');
	let urgency = $state('');
	let networkCount = $state('');
	let useCase = $state('');
	let loading = $state(false);
	let status = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	const teamSizeOptions = [
		{ value: '1-10', label: '1-10 employees' },
		{ value: '11-25', label: '11-25 employees' },
		{ value: '26-50', label: '26-50 employees' },
		{ value: '51-100', label: '51-100 employees' },
		{ value: '101-250', label: '101-250 employees' },
		{ value: '251-500', label: '251-500 employees' },
		{ value: '501-1000', label: '501-1000 employees' },
		{ value: '1001+', label: '1001+ employees' }
	];

	const urgencyOptions = [
		{ value: 'immediately', label: 'Immediately' },
		{ value: '1-3 months', label: '1-3 months' },
		{ value: '3-6 months', label: '3-6 months' },
		{ value: 'exploring', label: 'Just exploring' }
	];


	function validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function resetForm() {
		email = '';
		firstName = '';
		lastName = '';
		company = '';
		teamSize = '';
		urgency = '';
		networkCount = '';
		useCase = '';
		status = 'idle';
		errorMessage = '';
	}

	function handleClose() {
		resetForm();
		onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
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

		if (!firstName.trim()) {
			status = 'error';
			errorMessage = 'Please enter your first name';
			return;
		}

		if (!lastName.trim()) {
			status = 'error';
			errorMessage = 'Please enter your last name';
			return;
		}

		if (!company.trim()) {
			status = 'error';
			errorMessage = 'Please enter your company name';
			return;
		}

		if (!teamSize) {
			status = 'error';
			errorMessage = 'Please select your company size';
			return;
		}

		loading = true;
		status = 'idle';
		errorMessage = '';

		try {
			const success = await submitContactInquiry(PUBLIC_BREVO_CONTACT_FORM_URL, {
				email: email.trim(),
				firstname: firstName.trim(),
				lastname: lastName.trim(),
				company: company.trim(),
				numemployees: teamSize,
				urgency: urgency || undefined,
				networkCount: networkCount || undefined,
				message: useCase.trim() || undefined,
				planType
			});

			if (success) {
				status = 'success';
				analytics.planInquirySubmitted({ planType, success: true });
			} else {
				throw new Error('Failed to submit');
			}
		} catch (err) {
			console.error('Contact form error:', err);
			status = 'error';
			errorMessage = 'Something went wrong. Please try again.';
			analytics.planInquirySubmitted({ planType, success: false });
		} finally {
			loading = false;
		}
	}

	function clearError() {
		if (status === 'error') {
			status = 'idle';
			errorMessage = '';
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	>
		<div
			class="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
		>
			<button
				type="button"
				onclick={handleClose}
				class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
				aria-label="Close modal"
			>
				<X class="h-5 w-5" />
			</button>

			{#if status === 'success'}
				<div class="py-8 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
					>
						<CheckCircle class="h-8 w-8 text-green-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">Thank you!</h3>
					<p class="mb-6 text-gray-400">
						We've received your inquiry about the {planName} plan. We'll be in touch soon.
					</p>
					<button type="button" onclick={handleClose} class="btn-primary"> Close </button>
				</div>
			{:else}
				<h2 id="modal-title" class="mb-2 text-xl font-semibold text-white">
					Contact Us About {planName}
				</h2>
				<p class="mb-6 text-sm text-gray-400">
					Tell us about your needs and we'll get back to you shortly.
				</p>

				<form onsubmit={handleSubmit} class="space-y-4">
					<div>
						<label for="contact-email" class="mb-1 block text-sm font-medium text-gray-300">
							Email <span class="text-red-400">*</span>
						</label>
						<input
							id="contact-email"
							type="email"
							placeholder="you@company.com"
							bind:value={email}
							oninput={clearError}
							disabled={loading}
							class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
						/>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="contact-firstname" class="mb-1 block text-sm font-medium text-gray-300">
								First Name <span class="text-red-400">*</span>
							</label>
							<input
								id="contact-firstname"
								type="text"
								placeholder="First name"
								bind:value={firstName}
								oninput={clearError}
								disabled={loading}
								class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
							/>
						</div>
						<div>
							<label for="contact-lastname" class="mb-1 block text-sm font-medium text-gray-300">
								Last Name <span class="text-red-400">*</span>
							</label>
							<input
								id="contact-lastname"
								type="text"
								placeholder="Last name"
								bind:value={lastName}
								oninput={clearError}
								disabled={loading}
								class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
							/>
						</div>
					</div>

					<div>
						<label for="contact-company" class="mb-1 block text-sm font-medium text-gray-300">
							Company <span class="text-red-400">*</span>
						</label>
						<input
							id="contact-company"
							type="text"
							placeholder="Your company"
							bind:value={company}
							oninput={clearError}
							disabled={loading}
							class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
						/>
					</div>

					<div>
						<label for="contact-team-size" class="mb-1 block text-sm font-medium text-gray-300">
							Company Size <span class="text-red-400">*</span>
						</label>
						<select
							id="contact-team-size"
							bind:value={teamSize}
							onchange={clearError}
							disabled={loading}
							class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
						>
							<option value="" disabled>Select company size</option>
							{#each teamSizeOptions as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="contact-urgency" class="mb-1 block text-sm font-medium text-gray-300">
							How soon do you need a solution? <span class="text-gray-500">(optional)</span>
						</label>
						<select
							id="contact-urgency"
							bind:value={urgency}
							disabled={loading}
							class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
						>
							<option value="">Select timeline</option>
							{#each urgencyOptions as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="contact-network-count" class="mb-1 block text-sm font-medium text-gray-300">
							How many networks/sites? <span class="text-gray-500">(optional)</span>
						</label>
						<input
							id="contact-network-count"
							type="number"
							min="0"
							placeholder="Number of networks"
							bind:value={networkCount}
							disabled={loading}
							class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
						/>
					</div>

					<div>
						<label for="contact-use-case" class="mb-1 block text-sm font-medium text-gray-300">
							Use Case <span class="text-gray-500">(optional)</span>
						</label>
						<textarea
							id="contact-use-case"
							placeholder="Tell us about your use case..."
							bind:value={useCase}
							disabled={loading}
							rows={3}
							class="w-full resize-none rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
						></textarea>
					</div>

					{#if status === 'error' && errorMessage}
						<div class="flex items-center gap-2 text-sm text-red-400">
							<AlertCircle class="h-4 w-4 flex-shrink-0" />
							<span>{errorMessage}</span>
						</div>
					{/if}

					<button type="submit" disabled={loading} class="btn-primary w-full disabled:opacity-50">
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
								<span>Submitting...</span>
							</span>
						{:else}
							<span class="flex items-center justify-center gap-2">
								<Send class="h-4 w-4" />
								<span>Submit</span>
							</span>
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</div>
{/if}
