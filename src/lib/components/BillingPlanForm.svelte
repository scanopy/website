<script lang="ts">
	/**
	 * BillingPlanForm Component
	 *
	 * Card-based layout with pricing simulator, incremental feature highlights,
	 * and expandable full comparison grid. Responsive: 1 col mobile, 2 col tablet,
	 * auto-fit desktop.
	 */
	import { untrack } from 'svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { Check, X, ChevronDown, ChevronUp, Loader2, Minus, Plus } from 'lucide-svelte';
	import Tag from './Tag.svelte';
	import ToggleGroup from './ToggleGroup.svelte';
	import type { BillingPlan, BillingPlanMetadata, FeatureMetadata } from '$lib/types';
	import type { ColorStyle, IconComponent } from '$lib/utils/styling';
	import { tooltip } from '$lib/utils/tooltip';

	/**
	 * Interface for metadata helpers props.
	 * Both app store helpers and website fixture helpers satisfy this interface.
	 */
	interface MetadataHelpers<T> {
		getMetadata: (id: string | null) => T;
		getDescription: (id: string | null) => string;
		getName: (id: string | null) => string;
		getCategory: (id: string | null) => string;
		getIconComponent: (id: string | null) => IconComponent;
		getColorHelper: (id: string | null) => ColorStyle;
	}

	// ============================================================================
	// Props
	// ============================================================================

	interface Props {
		plans: BillingPlan[];
		billingPlanHelpers: MetadataHelpers<BillingPlanMetadata>;
		featureHelpers: MetadataHelpers<FeatureMetadata>;
		onPlanSelect: (plan: BillingPlan) => void | Promise<void>;
		onPlanInquiry?: (plan: BillingPlan) => void | Promise<void>;
		showGithubStars?: boolean;
		showHosting?: boolean;
		/** Show the Monthly/Yearly toggle. False for limited single-cadence tables (e.g. /commercial). */
		showBillingPeriodToggle?: boolean;
		class?: string;
		recommendedPlan?: string | null;
		/** If true, user is a returning customer and should not see trial offers */
		isReturningCustomer?: boolean;
	}

	// eslint-disable-next-line svelte/no-unused-props
	let {
		plans,
		billingPlanHelpers,
		featureHelpers,
		onPlanSelect,
		onPlanInquiry,
		showGithubStars = true,
		class: className = '',
		showHosting = false,
		showBillingPeriodToggle = true,
		recommendedPlan = null,
		isReturningCustomer = false
	}: Props = $props();

	let loadingPlanType = $state<string | null>(null);
	let showFullComparison = $state(false);

	type BillingPeriod = 'monthly' | 'yearly';
	let billingPeriod = $state<BillingPeriod>('yearly');

	type HostingFilter = 'cloud' | 'selfhosted';
	let hostingFilter = $state<HostingFilter>('cloud');

	const billingPeriodOptions = [
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'yearly', label: 'Yearly', badge: '-20%' }
	];

	const hostingOptions = [
		{ value: 'cloud', label: 'Cloud' },
		{ value: 'selfhosted', label: 'Self-Hosted' }
	];

	// Self-hosted is annual-only (the paid tiers ship yearly), so the Self-Hosted tab
	// always renders yearly rows and locks the Monthly/Yearly toggle to Yearly (disabled).
	let selfHostedActive = $derived(showHosting && hostingFilter === 'selfhosted');

	let filteredPlans = $derived.by(() => {
		let result = plans;
		if (showHosting) {
			result = result.filter((plan) => {
				const hosting = getHosting(plan);
				// Enterprise is hosting-agnostic ('Any') and tops both ladders.
				if (hostingFilter === 'cloud')
					return hosting === 'Cloud' || hosting === 'Managed' || hosting === 'Any';
				if (hostingFilter === 'selfhosted') return hosting === 'SelfHosted' || hosting === 'Any';
				return true;
			});
		}
		const period = selfHostedActive ? 'yearly' : billingPeriod;
		result = result.filter((plan) => {
			// Free / custom-price plans only have a Month variant; yearly is a duplicate
			if (hasCustomPrice(plan)) return plan.rate === 'Month';
			if (plan.type === 'Free') return plan.rate === 'Month';
			if (period === 'monthly') return plan.rate === 'Month';
			if (period === 'yearly') return plan.rate === 'Year';
			return true;
		});
		// Sort Free first and Enterprise last (Enterprise is hosting-agnostic and tops both
		// ladders); everything else keeps fixture order (stable sort).
		result = [...result].sort((a, b) => {
			if (a.type === 'Free') return -1;
			if (b.type === 'Free') return 1;
			if (a.type === 'Enterprise') return 1;
			if (b.type === 'Enterprise') return -1;
			return 0;
		});
		return result;
	});

	// ============================================================================
	// Pricing simulator state
	// ============================================================================

	let extraSeats = $state<Record<string, number>>({});
	let extraNetworks = $state<Record<string, number>>({});

	function adjustExtra(
		store: Record<string, number>,
		planType: string,
		delta: number
	): Record<string, number> {
		const current = store[planType] ?? 0;
		const next = Math.max(0, current + delta);
		return { ...store, [planType]: next };
	}

	function getExtraSeats(planType: string): number {
		return extraSeats[planType] ?? 0;
	}

	function getExtraNetworks(planType: string): number {
		return extraNetworks[planType] ?? 0;
	}

	function hasExtras(plan: BillingPlan): boolean {
		return getExtraSeats(plan.type) > 0 || getExtraNetworks(plan.type) > 0;
	}

	function getEstimatedTotal(plan: BillingPlan): number {
		const seatExtra = getExtraSeats(plan.type) * (plan.seat_cents ?? 0);
		const netExtra = getExtraNetworks(plan.type) * (plan.network_cents ?? 0);
		return plan.base_cents + seatExtra + netExtra;
	}

	function formatCents(cents: number): string {
		const dollars = cents / 100;
		return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
	}

	// Reset extras when billing period changes
	let prevBillingPeriod = $state(untrack(() => billingPeriod));
	$effect(() => {
		if (billingPeriod !== prevBillingPeriod) {
			prevBillingPeriod = billingPeriod;
			extraSeats = {};
			extraNetworks = {};
		}
	});

	// ============================================================================
	// Full comparison data
	// ============================================================================

	function getFeatureValue(planType: string, featureKey: string): boolean | string | number | null {
		const metadata = billingPlanHelpers.getMetadata(planType);
		const features = metadata?.features as unknown as
			| Record<string, boolean | string | number | null>
			| undefined;
		return features?.[featureKey] ?? null;
	}

	function isComingSoon(featureKey: string): boolean {
		return featureHelpers.getMetadata(featureKey)?.is_coming_soon === true;
	}

	let featureKeys = $derived(
		filteredPlans.length > 0
			? Object.keys(billingPlanHelpers.getMetadata(filteredPlans[0].type)?.features || {})
			: []
	);

	// Group features by category for the full comparison
	let groupedFeatures = $derived.by(() => {
		const groups = new SvelteMap<string, string[]>();
		for (const featureKey of featureKeys) {
			const category = featureHelpers.getCategory(featureKey) || 'Other';
			if (!groups.has(category)) groups.set(category, []);
			groups.get(category)!.push(featureKey);
		}
		// Sort features within each category by how many plans enable them (most first)
		for (const [, features] of groups) {
			features.sort((a, b) => {
				const countA = filteredPlans.filter((p) => getFeatureValue(p.type, a)).length;
				const countB = filteredPlans.filter((p) => getFeatureValue(p.type, b)).length;
				return countB - countA;
			});
		}
		// Sort categories: Core first, Support/Enterprise/Licensing last
		const sortedEntries = [...groups.entries()].sort(([a], [b]) => {
			const order = [
				'Discovery',
				'Visualization',
				'Integrations',
				'Support',
				'Enterprise',
				'Licensing & Billing'
			];
			const aIdx = order.indexOf(a);
			const bIdx = order.indexOf(b);
			if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
			if (aIdx === -1) return 1;
			if (bIdx === -1) return -1;
			return aIdx - bIdx;
		});
		return new SvelteMap(sortedEntries);
	});

	// Grid column template for full comparison
	let gridColumns = $derived.by(() => {
		const planCount = filteredPlans.length;
		if (planCount === 0) return '120px 1fr';
		return `minmax(100px, 20%) repeat(${planCount}, minmax(100px, 1fr))`;
	});

	// ============================================================================
	// Helper functions
	// ============================================================================

	// Self-hosted commercial tiers publish a real annual price (custom_price is null,
	// rate is Year). They're shown annual-first ("$3,000/yr") with a monthly whisper,
	// unlike Cloud plans which stay monthly-first.
	function isSelfHostedAnnual(plan: BillingPlan): boolean {
		const metadata = billingPlanHelpers.getMetadata(plan.type);
		return metadata?.hosting === 'SelfHosted' && !metadata?.custom_price && plan.rate === 'Year';
	}

	function formatDollars(cents: number): string {
		return `$${(cents / 100).toLocaleString('en-US')}`;
	}

	function formatBasePricing(plan: BillingPlan): string {
		const metadata = billingPlanHelpers.getMetadata(plan.type);
		if (metadata?.custom_price) return metadata.custom_price;
		if (isSelfHostedAnnual(plan)) return formatDollars(plan.base_cents);
		if (plan.rate === 'Year') return `$${plan.base_cents / 12 / 100}`;
		return `$${plan.base_cents / 100}`;
	}

	function formatRate(plan: BillingPlan): string {
		const metadata = billingPlanHelpers.getMetadata(plan.type);
		if (metadata?.custom_price) return '';
		if (isSelfHostedAnnual(plan)) return '/yr';
		if (plan.rate === 'Year') return '/mo, billed yearly';
		return '/mo';
	}

	function formatSeatAddonPricing(plan: BillingPlan): string {
		if (plan.seat_cents) {
			const monthly = plan.rate === 'Year' ? plan.seat_cents / 12 : plan.seat_cents;
			return `+$${monthly / 100} / seat / mo`;
		}
		return '';
	}

	function formatNetworkAddonPricing(plan: BillingPlan): string {
		if (plan.network_cents) {
			const monthly = plan.rate === 'Year' ? plan.network_cents / 12 : plan.network_cents;
			return `+$${monthly / 100} / network / mo`;
		}
		return '';
	}

	function formatHostAddonPricing(plan: BillingPlan): string {
		if (plan.host_cents) {
			const monthly = plan.rate === 'Year' ? plan.host_cents / 12 : plan.host_cents;
			return `+$${monthly / 100} / host / mo`;
		}
		return '';
	}

	function getHosting(plan: BillingPlan): string {
		return billingPlanHelpers.getMetadata(plan.type)?.hosting ?? '';
	}

	// Feature ids that are enabled (boolean true) on a plan. Used to compute a true feature
	// diff when a card chains to a neighbor that isn't its backend previous_tier (e.g.
	// Enterprise chaining to Self-Hosted Plus on the Self-Hosted tab).
	function enabledFeatureIds(planType: string | null): string[] {
		const features = billingPlanHelpers.getMetadata(planType)?.features as
			| Record<string, boolean | string | number | null>
			| undefined;
		if (!features) return [];
		return Object.entries(features)
			.filter(([, v]) => v === true)
			.map(([k]) => k);
	}

	function isCommercial(plan: BillingPlan): boolean {
		return billingPlanHelpers.getMetadata(plan.type)?.is_commercial === true;
	}

	function hasTrial(plan: BillingPlan): boolean {
		return !isReturningCustomer && plan.trial_days > 0;
	}

	function hasCustomPrice(plan: BillingPlan): boolean {
		return billingPlanHelpers.getMetadata(plan.type)?.custom_price !== null;
	}

	function getHostingColor(hosting: string): string {
		switch (hosting) {
			case 'Cloud':
				return 'Cyan';
			case 'Managed':
				return 'Purple';
			case 'SelfHosted':
				return 'Green';
			default:
				return 'Gray';
		}
	}

	function getHostingLabel(hosting: string): string {
		switch (hosting) {
			case 'SelfHosted':
				return 'Self-Hosted';
			default:
				return hosting;
		}
	}

	function isEnterprise(plan: BillingPlan): boolean {
		return plan.type === 'Enterprise';
	}

	async function handlePlanSelect(plan: BillingPlan) {
		loadingPlanType = plan.type;
		try {
			await onPlanSelect(plan);
		} finally {
			loadingPlanType = null;
		}
	}

	function formatIncludedValue(value: number | null | undefined, plan?: BillingPlan): string {
		if (value == null && plan && hasCustomPrice(plan)) return 'Custom';
		return value == null ? 'Unlimited' : String(value);
	}

	function formatSnapshotRetention(plan: BillingPlan): string {
		// Self-hosted and managed plans (Community, Commercial Edition, Enterprise)
		// configure retention themselves via the deployment override, so there's no
		// fixed published window.
		if (getHosting(plan) !== 'Cloud') return 'Custom';
		const days = getFeatureValue(plan.type, 'snapshot_retention_days');
		if (typeof days !== 'number' || days <= 0) return 'None';
		return `${days} days`;
	}

	function sortFeaturesByCategory(features: string[]): string[] {
		const order = ['Discovery', 'Visualization', 'Integrations', 'Support', 'Enterprise'];
		return [...features].sort((a, b) => {
			// Coming-soon features sort to end
			const soonA = isComingSoon(a) ? 1 : 0;
			const soonB = isComingSoon(b) ? 1 : 0;
			if (soonA !== soonB) return soonA - soonB;
			const catA = order.indexOf(featureHelpers.getCategory(a));
			const catB = order.indexOf(featureHelpers.getCategory(b));
			return (catA === -1 ? 99 : catA) - (catB === -1 ? 99 : catB);
		});
	}

	// ============================================================================
	// Mobile feature list toggle
	// ============================================================================

	let expandedFeatures = $state(new Set<string>());

	function toggleFeatures(planType: string) {
		const next = new SvelteSet(expandedFeatures);
		if (next.has(planType)) {
			next.delete(planType);
		} else {
			next.add(planType);
		}
		expandedFeatures = next;
	}
</script>

<div class="space-y-6 {className}">
	{#if showHosting || showBillingPeriodToggle}
		<!-- Header with Toggles -->
		<div class="flex flex-wrap items-stretch justify-center gap-3 px-4 lg:gap-6 lg:px-10">
			{#if showGithubStars}
				<!-- <GithubStars /> -->
			{/if}

			{#if showBillingPeriodToggle}
				<!-- Self-hosted paid tiers are annual-only, so the toggle stays visible but
			     locked to Yearly rather than disappearing when Self-Hosted is selected. -->
				<ToggleGroup
					options={billingPeriodOptions}
					selected={selfHostedActive ? 'yearly' : billingPeriod}
					onchange={(value) => (billingPeriod = value as BillingPeriod)}
					disabled={selfHostedActive}
				/>
			{/if}

			{#if showHosting}
				<ToggleGroup
					options={hostingOptions}
					selected={hostingFilter}
					onchange={(value) => (hostingFilter = value as HostingFilter)}
				/>
			{/if}
		</div>
	{/if}

	<!-- Plan Cards -->
	<div class="plan-cards-container px-4 lg:px-6">
		<div class="plan-cards-grid">
			{#each filteredPlans as plan (plan.type + plan.rate)}
				{@const IconComponent = billingPlanHelpers.getIconComponent(plan.type)}
				{@const license = getFeatureValue(plan.type, 'license_type')}
				{@const colorHelper = billingPlanHelpers.getColorHelper(plan.type)}
				{@const isRecommended = recommendedPlan === plan.type}
				{@const description = billingPlanHelpers.getDescription(plan.type)}
				{@const hosting = getHosting(plan)}
				{@const commercial = isCommercial(plan)}
				{@const trial = hasTrial(plan)}
				{@const enterprise = isEnterprise(plan)}
				{@const metadata = billingPlanHelpers.getMetadata(plan.type)}
				{@const purchaseFlow = metadata?.purchase_flow}
				{@const incrementalFeatures = metadata?.incremental_features ?? []}
				{@const backendPrevTier = metadata?.previous_tier}
				{@const backendPrevVisible = backendPrevTier
					? filteredPlans.some((p) => p.type === backendPrevTier)
					: false}
				{@const cardIdx = filteredPlans.findIndex(
					(p) => p.type === plan.type && p.rate === plan.rate
				)}
				{@const neighborPrev = cardIdx > 0 ? filteredPlans[cardIdx - 1].type : null}
				{@const usesNeighbor = !backendPrevVisible && neighborPrev !== null}
				{@const prevTier = backendPrevVisible
					? backendPrevTier
					: usesNeighbor
						? neighborPrev
						: backendPrevTier}
				{@const prevTierVisible = prevTier ? filteredPlans.some((p) => p.type === prevTier) : false}
				{@const prevTierFeatures =
					prevTier && !prevTierVisible
						? (billingPlanHelpers.getMetadata(prevTier)?.incremental_features ?? [])
						: []}
				{@const displayFeatures = sortFeaturesByCategory(
					usesNeighbor
						? enabledFeatureIds(plan.type).filter(
								(f) => !enabledFeatureIds(neighborPrev).includes(f)
							)
						: prevTierFeatures.length > 0
							? [...new Set([...prevTierFeatures, ...incrementalFeatures])]
							: incrementalFeatures
				)}

				<div
					class="plan-card card card-static flex flex-col {isRecommended
						? 'plan-card-recommended'
						: ''}"
				>
					<!-- Recommended Badge -->
					{#if isRecommended}
						<div class="-mt-3 mb-1 flex justify-center">
							<Tag label="Recommended" color="Yellow" />
						</div>
					{/if}

					<!-- Plan Header -->
					<div class="flex flex-col items-center gap-2 pb-4">
						<div class="flex items-center gap-2">
							<IconComponent class="{colorHelper.icon} h-5 w-5 lg:h-6 lg:w-6" />
							<span class="text-primary text-base font-semibold lg:text-lg">
								{billingPlanHelpers.getName(plan.type)}
							</span>
						</div>
					</div>

					<!-- Pricing -->
					<div class="flex flex-col items-center gap-1 pb-4">
						<div class="flex items-baseline gap-1">
							<span class="text-primary text-2xl font-bold lg:text-3xl">
								{hasExtras(plan)
									? formatCents(
											plan.rate === 'Year' ? getEstimatedTotal(plan) / 12 : getEstimatedTotal(plan)
										)
									: formatBasePricing(plan)}
							</span>
							{#if formatRate(plan)}
								<span class="text-tertiary text-sm">{formatRate(plan)}</span>
							{/if}
						</div>
						{#if hasExtras(plan)}
							<div class="text-tertiary text-center text-xs">
								Base {formatCents(plan.rate === 'Year' ? plan.base_cents / 12 : plan.base_cents)}
								{#if getExtraSeats(plan.type) > 0}
									{@const seatCost = getExtraSeats(plan.type) * (plan.seat_cents ?? 0)}
									+ {getExtraSeats(plan.type)}
									{getExtraSeats(plan.type) === 1 ? 'seat' : 'seats'} ({formatCents(
										plan.rate === 'Year' ? seatCost / 12 : seatCost
									)})
								{/if}
								{#if getExtraNetworks(plan.type) > 0}
									{@const netCost = getExtraNetworks(plan.type) * (plan.network_cents ?? 0)}
									+ {getExtraNetworks(plan.type)}
									{getExtraNetworks(plan.type) === 1 ? 'network' : 'networks'} ({formatCents(
										plan.rate === 'Year' ? netCost / 12 : netCost
									)})
								{/if}
							</div>
						{/if}
						{#if selfHostedActive || isSelfHostedAnnual(plan)}
							<div
								class={`text-tertiary text-center text-xs ${isSelfHostedAnnual(plan) && !hasExtras(plan) ? 'opacity-100' : 'opacity-0'}`}
							>
								that's ~{isSelfHostedAnnual(plan) ? formatCents(plan.base_cents / 12) : '$0'}/mo
							</div>
						{/if}
						<div
							class={`text-xs font-medium text-success ${hasTrial(plan) && !hasCustomPrice(plan) ? 'opacity-100' : 'opacity-0'}`}
						>
							{plan.trial_days}-day free trial
						</div>
					</div>

					<!-- Description -->
					{#if description}
						<p class="text-tertiary pb-4 text-center text-xs leading-relaxed lg:text-sm">
							{description}
						</p>
					{/if}

					<!-- CTA Button -->
					<div class="py-4">
						{#if enterprise && onPlanInquiry}
							<button
								type="button"
								onclick={() => onPlanInquiry(plan)}
								disabled={loadingPlanType !== null}
								class="btn-primary w-full text-sm"
							>
								Request Information
							</button>
						{:else if purchaseFlow === 'stripe'}
							<button
								type="button"
								onclick={() => handlePlanSelect(plan)}
								disabled={loadingPlanType !== null}
								class="btn-primary w-full text-sm"
							>
								{#if loadingPlanType === plan.type}
									<Loader2 class="mx-auto h-4 w-4 animate-spin" />
								{:else}
									{trial ? `Start ${plan.trial_days}-day free trial` : 'Get Started'}
								{/if}
							</button>
							{#if trial}
								<p class="text-tertiary mt-2 text-center text-xs">No card required</p>
							{/if}
						{:else if purchaseFlow === 'contact' && onPlanInquiry}
							<button
								type="button"
								onclick={() => onPlanInquiry(plan)}
								disabled={loadingPlanType !== null}
								class="btn-primary w-full text-sm"
							>
								Get a license
							</button>
						{:else}
							<a
								href="https://github.com/scanopy/scanopy"
								target="_blank"
								rel="noopener noreferrer"
								class="btn-secondary inline-block w-full text-center text-sm"
							>
								View on GitHub
							</a>
						{/if}
					</div>

					<!-- Included Resources with Stepper Controls -->
					<div class="space-y-2 border-b border-gray-700 pb-4">
						<!-- Seats -->
						<div class="flex items-center justify-between text-sm">
							<div class="flex flex-col">
								<span class="text-secondary">Seats</span>
								{#if plan.seat_cents}
									<span class="text-tertiary text-xs">{formatSeatAddonPricing(plan)}</span>
								{/if}
							</div>
							{#if plan.seat_cents && plan.included_seats !== null}
								<div class="stepper">
									<button
										type="button"
										class="stepper-btn"
										disabled={getExtraSeats(plan.type) === 0}
										onclick={() => (extraSeats = adjustExtra(extraSeats, plan.type, -1))}
									>
										<Minus class="h-3 w-3" />
									</button>
									<span class="text-primary w-8 text-center text-sm font-medium">
										{(plan.included_seats ?? 0) + getExtraSeats(plan.type)}
									</span>
									<button
										type="button"
										class="stepper-btn"
										onclick={() => (extraSeats = adjustExtra(extraSeats, plan.type, 1))}
									>
										<Plus class="h-3 w-3" />
									</button>
								</div>
							{:else}
								<span class="text-primary font-medium">
									{formatIncludedValue(plan.included_seats, plan)}
								</span>
							{/if}
						</div>

						<!-- Networks -->
						<div class="flex items-center justify-between text-sm">
							<div class="flex flex-col">
								<span class="text-secondary">Networks</span>
								{#if plan.network_cents}
									<span class="text-tertiary text-xs">{formatNetworkAddonPricing(plan)}</span>
								{/if}
							</div>
							{#if plan.network_cents && plan.included_networks !== null}
								<div class="stepper">
									<button
										type="button"
										class="stepper-btn"
										disabled={getExtraNetworks(plan.type) === 0}
										onclick={() => (extraNetworks = adjustExtra(extraNetworks, plan.type, -1))}
									>
										<Minus class="h-3 w-3" />
									</button>
									<span class="text-primary w-8 text-center text-sm font-medium">
										{(plan.included_networks ?? 0) + getExtraNetworks(plan.type)}
									</span>
									<button
										type="button"
										class="stepper-btn"
										onclick={() => (extraNetworks = adjustExtra(extraNetworks, plan.type, 1))}
									>
										<Plus class="h-3 w-3" />
									</button>
								</div>
							{:else}
								<span class="text-primary font-medium">
									{formatIncludedValue(plan.included_networks, plan)}
								</span>
							{/if}
						</div>

						<!-- Organizations (self-hosted concept; not shown on Cloud plans) -->
						{#if getHosting(plan) !== 'Cloud'}
							<div class="flex items-center justify-between text-sm">
								<div class="flex flex-col">
									<span class="text-secondary">Organizations</span>
								</div>
								<span class="text-primary font-medium">
									{formatIncludedValue(metadata?.included_orgs, plan)}
								</span>
							</div>
						{/if}

						<!-- Hosts -->
						<div class="flex items-center justify-between text-sm">
							<div class="flex flex-col">
								<span class="text-secondary">Hosts</span>
								{#if plan.host_cents}
									<span class="text-tertiary text-xs">{formatHostAddonPricing(plan)}</span>
								{/if}
							</div>
							<span class="text-primary font-medium">
								{formatIncludedValue(plan.included_hosts, plan)}
							</span>
						</div>

						<!-- Snapshot retention -->
						<div class="flex items-center justify-between text-sm">
							<div class="flex flex-col">
								<span class="text-secondary">Snapshot retention</span>
							</div>
							<span class="text-primary font-medium">
								{formatSnapshotRetention(plan)}
							</span>
						</div>

						<!-- License (self-hosted plans only; hidden when the plan has none set) -->
						{#if typeof license === 'string' && license}
							<div class="flex items-center justify-between text-sm">
								<div class="flex flex-col">
									<span class="text-secondary">License</span>
								</div>
								<span class="text-primary font-medium">{license}</span>
							</div>
						{/if}
					</div>

					<!-- Incremental Features -->
					<div class="flex-1 py-4">
						{#if prevTier && prevTierVisible}
							<p class="text-secondary mb-2 text-xs font-medium">
								Everything in <span class="text-primary"
									>{billingPlanHelpers.getName(prevTier)}</span
								>, plus:
							</p>
						{/if}

						<!-- Mobile: collapsible feature list -->
						{#if displayFeatures.length > 0}
							<button
								type="button"
								class="text-tertiary mb-2 flex items-center gap-1 text-xs font-medium sm:hidden"
								onclick={() => toggleFeatures(plan.type)}
							>
								{expandedFeatures.has(plan.type) ? 'Hide features' : 'Show features'}
								{#if expandedFeatures.has(plan.type)}
									<ChevronUp class="h-3 w-3" />
								{:else}
									<ChevronDown class="h-3 w-3" />
								{/if}
							</button>
						{/if}

						<ul class="space-y-1.5 {expandedFeatures.has(plan.type) ? '' : 'hidden sm:block'}">
							{#each displayFeatures as featureKey, i (featureKey)}
								{@const category = featureHelpers.getCategory(featureKey)}
								{@const prevCategory =
									i > 0 ? featureHelpers.getCategory(displayFeatures[i - 1]) : null}
								{#if category !== prevCategory}
									<li
										class="text-tertiary text-[10px] font-medium uppercase tracking-wider {i > 0
											? 'mt-2'
											: ''}"
									>
										{category}
									</li>
								{/if}
								{@const comingSoon = isComingSoon(featureKey)}
								<li class="flex items-start gap-2 text-sm">
									<Check
										class="mt-0.5 h-4 w-4 flex-shrink-0 {comingSoon
											? 'text-gray-500'
											: 'text-success'}"
									/>
									<span
										class={comingSoon ? 'text-tertiary' : 'text-secondary'}
										data-tooltip={featureHelpers.getDescription(featureKey)}
										use:tooltip>{featureHelpers.getName(featureKey)}</span
									>
									{#if comingSoon}
										<Tag label="Coming Soon" color="Gray" />
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Compare All Features Toggle -->
	<div class="flex justify-center px-4">
		<button
			type="button"
			class="text-secondary hover:text-primary flex items-center gap-2 text-sm transition-colors"
			onclick={() => (showFullComparison = !showFullComparison)}
		>
			{showFullComparison ? 'Hide' : 'Compare all features'}
			{#if showFullComparison}
				<ChevronUp class="h-4 w-4" />
			{:else}
				<ChevronDown class="h-4 w-4" />
			{/if}
		</button>
	</div>

	<!-- Full Comparison Grid (expandable) -->
	{#if showFullComparison}
		<div class="card mx-4 overflow-auto p-0 lg:mx-10">
			<!-- Plan Name Headers -->
			<div
				class="comparison-row comparison-header-row"
				style="grid-template-columns: {gridColumns}"
			>
				<div class="comparison-label-cell">
					<div class="text-xs font-medium lg:text-sm">Feature</div>
				</div>
				{#each filteredPlans as plan (plan.type)}
					<div class="comparison-value-cell">
						<span class="text-primary text-xs font-semibold lg:text-sm"
							>{billingPlanHelpers.getName(plan.type)}</span
						>
					</div>
				{/each}
			</div>

			{#each [...groupedFeatures.entries()] as [category, categoryFeatures] (category)}
				<!-- Category Header -->
				<div class="comparison-category-row">
					<span
						class="text-secondary p-2 text-xs font-semibold uppercase tracking-wide lg:p-3 lg:text-sm"
					>
						{category}
					</span>
				</div>

				{#each categoryFeatures as featureKey (featureKey)}
					{@const comingSoon = isComingSoon(featureKey)}
					<div class="comparison-row" style="grid-template-columns: {gridColumns}">
						<div class="comparison-label-cell">
							<div
								class="text-xs font-medium lg:text-sm"
								data-tooltip={featureHelpers.getDescription(featureKey)}
								use:tooltip
							>
								{featureHelpers.getName(featureKey)}
							</div>
						</div>
						{#each filteredPlans as plan (plan.type)}
							{@const value = getFeatureValue(plan.type, featureKey)}
							<div class="comparison-value-cell">
								{#if comingSoon && value}
									<Tag label="Coming Soon" color="Gray" />
								{:else if typeof value === 'boolean'}
									{#if value}
										<Check class="mx-auto h-4 w-4 text-success lg:h-5 lg:w-5" />
									{:else}
										<X class="text-muted mx-auto h-4 w-4 lg:h-5 lg:w-5" />
									{/if}
								{:else if value === null}
									<span class="text-tertiary">&mdash;</span>
								{:else}
									<span class="text-secondary text-xs lg:text-sm">{value}</span>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Card grid layout */
	.plan-cards-grid {
		display: grid;
		gap: 1rem;
		/* Mobile: single column vertical stack */
		grid-template-columns: 1fr;
	}

	@media (min-width: 640px) {
		.plan-cards-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.plan-cards-grid {
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
			gap: 0.75rem;
		}
	}

	/* Individual plan card */
	.plan-card {
		padding: 1.25rem;
		position: relative;
	}

	.plan-card-recommended {
		outline: 2px solid rgb(var(--c-yellow-400));
		outline-offset: -2px;
	}

	/* Stepper controls for pricing simulator */
	.stepper {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.stepper-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.25rem;
		border: 1px solid rgb(var(--c-gray-600));
		color: rgb(var(--c-gray-300));
		background: transparent;
		cursor: pointer;
		transition:
			background-color 150ms,
			border-color 150ms;
	}

	.stepper-btn:hover:not(:disabled) {
		background: rgb(var(--c-gray-700));
		border-color: rgb(var(--c-gray-500));
	}

	.stepper-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	/* ============================================ */
	/* Full comparison grid                         */
	/* ============================================ */

	.comparison-header-row {
		background: rgb(var(--c-gray-800));
		position: sticky;
		top: 0;
		z-index: 11;
	}

	.comparison-category-row {
		border-bottom: 1px solid rgb(var(--c-gray-700));
	}

	.comparison-row {
		display: grid;
		min-width: 500px;
		border-bottom: 1px solid rgb(var(--c-gray-700));
	}

	.comparison-row:last-child {
		border-bottom: none;
	}

	.comparison-label-cell {
		padding: 0.5rem;
		color: rgb(var(--c-gray-400));
		text-align: left;
		display: flex;
		align-items: center;
		position: sticky;
		left: 0;
		z-index: 10;
		background: rgb(var(--c-gray-800));
		border-right: 1px solid rgb(var(--c-gray-700));
	}

	.comparison-value-cell {
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		border-right: 1px solid rgb(var(--c-gray-700));
	}

	.comparison-value-cell:last-child {
		border-right: none;
	}

	@media (min-width: 1024px) {
		.comparison-label-cell,
		.comparison-value-cell {
			padding: 0.75rem;
		}
	}

	/* Feature tooltips */
	[data-tooltip] {
		position: relative;
		cursor: help;
		text-decoration: underline dotted;
		text-decoration-color: rgb(var(--c-gray-500));
		text-underline-offset: 2px;
	}
</style>
