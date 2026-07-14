<script lang="ts">
	import { X, Send, CheckCircle, AlertCircle } from 'lucide-svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { submitContactInquiry, type ContactSubmitResult } from '$lib/brevo';
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
	let networkCount = $state<number | null>(null);
	let useCase = $state('');
	let loading = $state(false);
	let status = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');
	let fieldErrors = $state<Record<string, string>>({});
	// When the submission itself fails (network/server), offer an email fallback
	// pre-filled with whatever the user already entered.
	let showEmailFallback = $state(false);

	const LICENSING_EMAIL = 'licensing@scanopy.net';

	const mailtoHref = $derived.by(() => {
		const subject = `${planName} plan inquiry`;
		const bodyLines = [
			`Plan: ${planName} (${planType})`,
			`Email: ${email}`,
			`First name: ${firstName}`,
			`Last name: ${lastName}`,
			`Company: ${company}`,
			`Company size: ${teamSize}`,
			`Timeline: ${urgency}`,
			`Networks/sites: ${networkCount ?? ''}`,
			'',
			'Use case:',
			useCase
		];
		return `mailto:${LICENSING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
	});

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
		networkCount = null;
		useCase = '';
		status = 'idle';
		errorMessage = '';
		fieldErrors = {};
		showEmailFallback = false;
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

	function validateForm(): string | null {
		if (!email.trim()) return 'Please enter your email address';
		if (!validateEmail(email)) return 'Please enter a valid email address';
		if (!firstName.trim()) return 'Please enter your first name';
		if (!lastName.trim()) return 'Please enter your last name';
		if (!company.trim()) return 'Please enter your company name';
		if (!teamSize) return 'Please select your company size';
		if (!urgency) return 'Please select a timeline';
		if (networkCount === null || networkCount === undefined)
			return 'Please enter the number of networks/sites';
		if (!useCase.trim()) return 'Please describe your use case';
		return null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		// Everything runs inside try/catch so an unexpected error can never leave
		// the form in a silent no-op state; it always surfaces as a visible error.
		try {
			const validationError = validateForm();
			if (validationError) {
				status = 'error';
				errorMessage = validationError;
				return;
			}

			loading = true;
			status = 'idle';
			errorMessage = '';
			fieldErrors = {};
			showEmailFallback = false;

			const result = await submitContactInquiry(PUBLIC_BREVO_CONTACT_FORM_URL, {
				email: email.trim(),
				firstname: firstName.trim(),
				lastname: lastName.trim(),
				company: company.trim(),
				numemployees: teamSize,
				urgency: urgency || undefined,
				networkCount: networkCount ?? undefined,
				message: useCase.trim() || undefined,
				planType
			});

			if (result.success) {
				status = 'success';
				analytics.planInquirySubmitted({ planType, success: true });
			} else {
				status = 'error';
				if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
					fieldErrors = result.fieldErrors;
					errorMessage = 'Please fix the highlighted fields below.';
				} else {
					errorMessage = 'Something went wrong. Please try again.';
					showEmailFallback = true;
				}
				analytics.planInquirySubmitted({ planType, success: false });
			}
		} catch (err) {
			console.error('Contact form error:', err);
			status = 'error';
			errorMessage = 'Something went wrong. Please try again.';
			showEmailFallback = true;
			analytics.planInquirySubmitted({ planType, success: false });
		} finally {
			loading = false;
		}
	}

	function clearError(field?: string) {
		if (status === 'error') {
			if (field && fieldErrors[field]) {
				const { [field]: _, ...rest } = fieldErrors;
				fieldErrors = rest;
			}
			if (!field || Object.keys(fieldErrors).length === 0) {
				status = 'idle';
				errorMessage = '';
			}
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
							oninput={() => clearError('email')}
							disabled={loading}
							class="w-full rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.email ? 'border-red-500' : 'border-gray-700'}"
						/>
						{#if fieldErrors.email}<p class="mt-1 text-xs text-red-400">{fieldErrors.email}</p>{/if}
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
								oninput={() => clearError('firstName')}
								disabled={loading}
								class="w-full rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.firstName ? 'border-red-500' : 'border-gray-700'}"
							/>
							{#if fieldErrors.firstName}<p class="mt-1 text-xs text-red-400">{fieldErrors.firstName}</p>{/if}
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
								oninput={() => clearError('lastName')}
								disabled={loading}
								class="w-full rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.lastName ? 'border-red-500' : 'border-gray-700'}"
							/>
							{#if fieldErrors.lastName}<p class="mt-1 text-xs text-red-400">{fieldErrors.lastName}</p>{/if}
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
							oninput={() => clearError('company')}
							disabled={loading}
							class="w-full rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.company ? 'border-red-500' : 'border-gray-700'}"
						/>
						{#if fieldErrors.company}<p class="mt-1 text-xs text-red-400">{fieldErrors.company}</p>{/if}
					</div>

					<div>
						<label for="contact-team-size" class="mb-1 block text-sm font-medium text-gray-300">
							Company Size <span class="text-red-400">*</span>
						</label>
						<select
							id="contact-team-size"
							bind:value={teamSize}
							onchange={() => clearError('teamSize')}
							disabled={loading}
							class="w-full rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.teamSize ? 'border-red-500' : 'border-gray-700'}"
						>
							<option value="" disabled>Select company size</option>
							{#each teamSizeOptions as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						{#if fieldErrors.teamSize}<p class="mt-1 text-xs text-red-400">{fieldErrors.teamSize}</p>{/if}
					</div>

					<div>
						<label for="contact-urgency" class="mb-1 block text-sm font-medium text-gray-300">
							How soon do you need a solution? <span class="text-red-400">*</span>
						</label>
						<select
							id="contact-urgency"
							bind:value={urgency}
							onchange={() => clearError('urgency')}
							disabled={loading}
							class="w-full rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.urgency ? 'border-red-500' : 'border-gray-700'}"
						>
							<option value="">Select timeline</option>
							{#each urgencyOptions as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						{#if fieldErrors.urgency}<p class="mt-1 text-xs text-red-400">{fieldErrors.urgency}</p>{/if}
					</div>

					<div>
						<label for="contact-network-count" class="mb-1 block text-sm font-medium text-gray-300">
							How many networks/sites? <span class="text-red-400">*</span>
						</label>
						<input
							id="contact-network-count"
							type="number"
							min="0"
							placeholder="Number of networks"
							bind:value={networkCount}
							oninput={() => clearError('networkCount')}
							disabled={loading}
							class="w-full rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.networkCount ? 'border-red-500' : 'border-gray-700'}"
						/>
						{#if fieldErrors.networkCount}<p class="mt-1 text-xs text-red-400">{fieldErrors.networkCount}</p>{/if}
					</div>

					<div>
						<label for="contact-use-case" class="mb-1 block text-sm font-medium text-gray-300">
							Use Case <span class="text-red-400">*</span>
						</label>
						<textarea
							id="contact-use-case"
							placeholder="Tell us about your use case..."
							bind:value={useCase}
							oninput={() => clearError('useCase')}
							disabled={loading}
							rows={3}
							class="w-full resize-none rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {fieldErrors.useCase ? 'border-red-500' : 'border-gray-700'}"
						></textarea>
						{#if fieldErrors.useCase}<p class="mt-1 text-xs text-red-400">{fieldErrors.useCase}</p>{/if}
					</div>

					{#if status === 'error' && errorMessage}
						<div class="space-y-2 text-sm text-red-400">
							<div class="flex items-center gap-2">
								<AlertCircle class="h-4 w-4 flex-shrink-0" />
								<span>{errorMessage}</span>
							</div>
							{#if showEmailFallback}
								<p class="text-gray-400">
									If this error persists, please email your inquiry to
									<a
										href={mailtoHref}
										class="font-medium text-blue-400 underline hover:text-blue-300"
									>
										{LICENSING_EMAIL}
									</a>.
								</p>
							{/if}
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
