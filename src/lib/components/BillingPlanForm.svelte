<script lang="ts">
	import { createColorHelper, createIconComponent } from '$lib/utils/styling';
	import { Check, X, ChevronDown } from 'lucide-svelte';
	import GithubStars from './GithubStars.svelte';
	import Tag from './Tag.svelte';
	import ToggleGroup from './ToggleGroup.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type {
		BillingPlan,
		BillingPlanMetadata,
		FeatureMetadata,
		TypeMetadata
	} from '$lib/types';

	interface Props {
		plans: BillingPlan[];
		billingPlansMetadata: TypeMetadata<BillingPlanMetadata>[];
		featuresMetadata: TypeMetadata<FeatureMetadata>[];
		onPlanSelect: (plan: BillingPlan) => void | Promise<void>;
		initialPlanFilter?: 'all' | 'personal' | 'commercial';
		showGithubStars?: boolean;
	}

	let {
		plans,
		billingPlansMetadata,
		featuresMetadata,
		onPlanSelect,
		initialPlanFilter = 'commercial',
		showGithubStars = true
	}: Props = $props();

	function createMetadataHelpers<T>(items: TypeMetadata<T>[]) {
		const getItem = (id: string | null) => items.find((item) => item.id === id) || null;
		return {
			getMetadata: (id: string | null): T => getItem(id)?.metadata || ({} as T),
			getDescription: (id: string | null) => getItem(id)?.description || '',
			getName: (id: string | null) => getItem(id)?.name || id || '',
			getCategory: (id: string | null) => getItem(id)?.category || '',
			getIconComponent: (id: string | null) => createIconComponent(getItem(id)?.icon || null),
			getColorHelper: (id: string | null) => createColorHelper(getItem(id)?.color || null)
		};
	}

	const billingPlans = $derived(createMetadataHelpers(billingPlansMetadata));
	const features = $derived(createMetadataHelpers(featuresMetadata));

	let collapsedCategories = $state<Record<string, boolean>>({});

	type PlanFilter = 'all' | 'personal' | 'commercial';
	let planFilter = $derived<PlanFilter>(initialPlanFilter);

	type BillingPeriod = 'monthly' | 'yearly';
	let billingPeriod = $state<BillingPeriod>('monthly');

	const planTypeOptions = [
		{ value: 'all', label: 'All Plans' },
		{ value: 'personal', label: 'Personal' },
		{ value: 'commercial', label: 'Commercial' }
	];

	const billingPeriodOptions = [
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'yearly', label: 'Yearly', badge: '-20%' }
	];

	let filteredPlans = $derived.by(() => {
		let result = plans;

		if (planFilter !== 'all') {
			result = result.filter((plan) => {
				const metadata = billingPlans.getMetadata(plan.type);
				if (planFilter === 'commercial') return metadata.is_commercial;
				if (planFilter === 'personal') return !metadata.is_commercial;
				return true;
			});
		}

		result = result.filter((plan) => {
			if (billingPeriod === 'monthly') return plan.rate === 'Month';
			if (billingPeriod === 'yearly') return plan.rate === 'Year';
			return true;
		});

		return result;
	});

	function toggleCategory(category: string) {
		collapsedCategories[category] = !collapsedCategories[category];
	}

	function formatBasePricing(plan: BillingPlan): string {
		return `$${plan.base_cents / 100}/${plan.rate}`;
	}

	function formatSeatAddonPricing(plan: BillingPlan): string {
		if (plan.seat_cents) return `+$${plan.seat_cents / 100}/seat/${plan.rate.toLowerCase()}`;
		else return '';
	}

	function formatNetworkAddonPricing(plan: BillingPlan): string {
		if (plan.network_cents)
			return `+$${plan.network_cents / 100}/network/${plan.rate.toLowerCase()}`;
		else return '';
	}

	function isComingSoon(featureKey: string): boolean {
		return features.getMetadata(featureKey)?.is_coming_soon === true;
	}

	let featureKeys = $derived(
		filteredPlans.length > 0
			? Object.keys(billingPlans.getMetadata(filteredPlans[0].type)?.features || {})
			: []
	);

	function getFeatureValue(planType: string, featureKey: string): boolean | string | number | null {
		const metadata = billingPlans.getMetadata(planType);
		return metadata?.features?.[featureKey] ?? null;
	}

	function isTextField(featureKey: string): boolean {
		if (filteredPlans.length === 0) return false;
		const values = filteredPlans.map((p) => getFeatureValue(p.type, featureKey));
		return values.some((v) => typeof v === 'string' && v !== 'Unlimited');
	}

	function isTruthyValue(value: string | boolean | number | null): boolean {
		if (value === null || value === false) return false;
		if (value === true) return true;
		if (typeof value === 'number' && value > 0) return true;
		if (typeof value === 'string' && value !== '') return true;
		return false;
	}

	function getTruthyCount(featureKey: string): number {
		return filteredPlans.filter((p) => isTruthyValue(getFeatureValue(p.type, featureKey))).length;
	}

	let sortedFeatureKeys = $derived(
		[...featureKeys].sort((a, b) => {
			const aIsText = isTextField(a);
			const bIsText = isTextField(b);
			if (aIsText && !bIsText) return 1;
			if (!aIsText && bIsText) return -1;
			return getTruthyCount(b) - getTruthyCount(a);
		})
	);

	let groupedFeatures = $derived.by(() => {
		const groups: SvelteMap<string, string[]> = new SvelteMap();

		for (const featureKey of sortedFeatureKeys) {
			const category = features.getCategory(featureKey) || 'Other';
			if (!groups.has(category)) {
				groups.set(category, []);
			}
			groups.get(category)!.push(featureKey);
		}

		const sortedEntries = [...groups.entries()].sort(([a], [b]) => {
			if (a === 'Features') return -1;
			if (b === 'Features') return 1;
			return a.localeCompare(b);
		});

		return new Map(sortedEntries);
	});

	let columnWidth = $derived(`${100 / (filteredPlans.length + 1)}%`);
</script>

<div class="space-y-6 px-10">
	<div class="flex flex-wrap items-stretch justify-center gap-6">
		{#if showGithubStars}
			<div class="card inline-flex items-center gap-2 px-4 shadow-xl backdrop-blur-sm">
				<span class="text-secondary text-sm">Open source on GitHub</span>
				<GithubStars />
			</div>
		{/if}

		<ToggleGroup
			options={planTypeOptions}
			selected={planFilter}
			onchange={(value) => (planFilter = value as PlanFilter)}
		/>

		<ToggleGroup
			options={billingPeriodOptions}
			selected={billingPeriod}
			onchange={(value) => (billingPeriod = value as BillingPeriod)}
		/>
	</div>

	<div>
		<div class="card overflow-hidden rounded-b-none border-b-0 p-0">
			<table class="w-full table-fixed">
				<thead class="sticky top-0 z-10">
					<tr class="border-b border-gray-700">
						<th class="border-r border-gray-700 p-4" style="width: {columnWidth}"></th>

						{#each filteredPlans as plan (plan.type)}
							{@const description = billingPlans.getDescription(plan.type)}
							{@const IconComponent = billingPlans.getIconComponent(plan.type)}
							{@const colorHelper = billingPlans.getColorHelper(plan.type)}
							<th class="border-r border-gray-700 p-4 last:border-r-0" style="width: {columnWidth}">
								<div class="flex h-full min-h-[200px] flex-col justify-between space-y-3">
									<div class="flex flex-col items-center space-y-2">
										<div class="flex justify-center">
											<IconComponent class="{colorHelper.icon} h-8 w-8" />
										</div>
										<div class="flex items-center gap-2">
											<span class="text-primary text-lg font-semibold">
												{billingPlans.getName(plan.type)}
											</span>
										</div>
									</div>

									<div class="flex flex-col items-center space-y-1">
										<div class="text-primary text-2xl font-bold">{formatBasePricing(plan)}</div>
										{#if plan.trial_days > 0}
											<div class="text-xs font-medium text-success">
												{plan.trial_days}-day free trial
											</div>
										{/if}
									</div>

									<div class="flex items-end justify-center">
										{#if description}
											<div class="text-tertiary text-center text-xs leading-tight">
												{description}
											</div>
										{/if}
									</div>
								</div>
							</th>
						{/each}
					</tr>
				</thead>

				<tbody>
					<tr class="border-b border-gray-700 transition-colors hover:bg-gray-800/30">
						<td class="text-secondary border-r border-gray-700 p-4">
							<div class="text-sm font-medium">Seats</div>
						</td>
						{#each filteredPlans as plan (plan.type)}
							<td class="border-r border-gray-700 p-4 text-center last:border-r-0">
								<div class="flex flex-col">
									<span class="text-secondary">
										{plan.included_seats === null ? 'Unlimited' : plan.included_seats}
									</span>
									{#if plan.seat_cents}
										<span class="text-tertiary text-sm">
											{formatSeatAddonPricing(plan)} for additional seats
										</span>
									{/if}
								</div>
							</td>
						{/each}
					</tr>

					<tr class="border-b border-gray-700 transition-colors hover:bg-gray-800/30">
						<td class="text-secondary border-r border-gray-700 p-4">
							<div class="text-sm font-medium">Networks</div>
						</td>
						{#each filteredPlans as plan (plan.type)}
							<td class="border-r border-gray-700 p-4 text-center last:border-r-0">
								<div class="flex flex-col">
									<span class="text-secondary">
										{plan.included_networks === null ? 'Unlimited' : plan.included_networks}
									</span>
									{#if plan.network_cents}
										<span class="text-tertiary text-sm">
											{formatNetworkAddonPricing(plan)} for additional networks
										</span>
									{/if}
								</div>
							</td>
						{/each}
					</tr>

					{#each [...groupedFeatures.entries()] as [category, categoryFeatures] (category)}
						<tr class="border-b border-gray-700">
							<td colspan={filteredPlans.length + 1} class="p-0">
								<button
									type="button"
									class="text-secondary hover:text-primary flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-800/60"
									onclick={() => toggleCategory(category)}
									aria-expanded={!collapsedCategories[category]}
								>
									<span class="text-sm font-semibold uppercase tracking-wide">{category}</span>
									<ChevronDown
										class="h-4 w-4 transition-transform {collapsedCategories[category]
											? '-rotate-90'
											: ''}"
									/>
								</button>
							</td>
						</tr>

						{#if !collapsedCategories[category]}
							{#each categoryFeatures as featureKey (featureKey)}
								{@const featureDescription = features.getDescription(featureKey)}
								{@const comingSoon = isComingSoon(featureKey)}
								<tr class="border-b border-gray-700 transition-colors hover:bg-gray-800/30">
									<td class="text-secondary border-r border-gray-700 p-4">
										<div class="text-sm font-medium">
											{features.getName(featureKey)}
										</div>
										{#if featureDescription}
											<div class="text-tertiary mt-1 text-xs leading-tight">
												{featureDescription}
											</div>
										{/if}
									</td>

									{#each filteredPlans as plan (plan.type)}
										{@const value = getFeatureValue(plan.type, featureKey)}
										<td class="border-r border-gray-700 p-4 text-center last:border-r-0">
											{#if comingSoon && value}
												<Tag label="Coming Soon" color="yellow" />
											{:else if typeof value === 'boolean'}
												{#if value}
													<Check class="mx-auto h-8 w-8 text-success" />
												{:else}
													<X class="text-muted mx-auto h-8 w-8" />
												{/if}
											{:else if value === null}
												<span class="text-tertiary">—</span>
											{:else}
												<span class="text-secondary text-lg">{value}</span>
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
		<div class="sticky bottom-0 left-0 right-0 z-20">
			<div class="card overflow-hidden rounded-t-none p-0">
				<div class="flex">
					<div class="border-r border-gray-700 p-4" style="width: {columnWidth}"></div>
					{#each filteredPlans as plan (plan.type)}
						<div class="border-r border-gray-700 p-4 last:border-r-0" style="width: {columnWidth}">
							<button type="button" onclick={() => onPlanSelect(plan)} class="btn-primary w-full">
								Select
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
