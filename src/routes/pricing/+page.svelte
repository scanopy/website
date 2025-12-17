<script lang="ts">
	import { BillingPlanForm } from '$lib/components';
	import type {
		BillingPlan,
		BillingPlanType,
		BillingPlanMetadata,
		FeatureMetadata
	} from '$lib/types';
	import type { ColorStyle, IconComponent } from '$lib/utils/styling';
	import { onMount } from 'svelte';
	import { analytics } from '$lib/analytics';

	/**
	 * Interface for metadata helpers - matches what BillingPlanForm expects.
	 */
	interface MetadataHelpers<T> {
		getMetadata: (id: string | null) => T;
		getDescription: (id: string | null) => string;
		getName: (id: string | null) => string;
		getCategory: (id: string | null) => string;
		getIconComponent: (id: string | null) => IconComponent;
		getColorHelper: (id: string | null) => ColorStyle;
	}
	import { createColorHelper, createIconComponent } from '$lib/utils/styling';
	import billingPlansData from '$lib/fixtures/billing-plans.json';
	import featuresData from '$lib/fixtures/features.json';

	// ============================================================================
	// Fixture Types (matches API response structure)
	// ============================================================================

	interface BillingPlanFixture {
		id: BillingPlanType;
		name: string;
		description: string;
		category: string | null;
		icon: string;
		color: string;
		metadata: {
			base_cents: number;
			seat_cents: number | null;
			included_seats: number | null;
			network_cents: number | null;
			included_networks: number | null;
			rate: string;
			trial_days: number;
			features: BillingPlanMetadata['features'];
			is_commercial: boolean;
			hosting: string;
			custom_price: string | null;
			custom_checkout_cta: string | null;
			custom_checkout_link: string | null;
		};
	}

	interface FeatureFixture {
		id: string;
		name: string;
		description: string;
		category: string;
		icon: string | null;
		color: string | null;
		metadata: FeatureMetadata;
	}

	// ============================================================================
	// Data Transformation
	// ============================================================================

	const billingPlanFixtures = billingPlansData as BillingPlanFixture[];
	const featureFixtures = featuresData as FeatureFixture[];

	// Extract BillingPlan array from the fixture metadata
	const plans: BillingPlan[] = billingPlanFixtures.map((item) => ({
		base_cents: item.metadata.base_cents,
		seat_cents: item.metadata.seat_cents,
		included_seats: item.metadata.included_seats,
		network_cents: item.metadata.network_cents,
		included_networks: item.metadata.included_networks,
		rate: item.metadata.rate,
		trial_days: item.metadata.trial_days,
		type: item.id
	}));

	// ============================================================================
	// Metadata Helpers Factory
	// ============================================================================

	/**
	 * Creates metadata helpers from raw fixture data.
	 * This matches the interface expected by BillingPlanForm.
	 */
	function createMetadataHelpers<
		TFixture extends {
			id: string;
			name: string;
			description: string;
			category: string | null;
			icon: string | null;
			color: string | null;
			metadata: TMetadata;
		},
		TMetadata
	>(items: TFixture[]): MetadataHelpers<TMetadata> {
		const getItem = (id: string | null) => items.find((item) => item.id === id) || null;

		return {
			getMetadata: (id: string | null): TMetadata => getItem(id)?.metadata || ({} as TMetadata),
			getDescription: (id: string | null) => getItem(id)?.description || '',
			getName: (id: string | null) => getItem(id)?.name || id || '',
			getCategory: (id: string | null) => getItem(id)?.category || '',
			getIconComponent: (id: string | null) => createIconComponent(getItem(id)?.icon || null),
			getColorHelper: (id: string | null) => createColorHelper(getItem(id)?.color || null)
		};
	}

	// Transform fixtures to include BillingPlanMetadata shape
	const billingPlanHelpersData = billingPlanFixtures.map((item) => ({
		id: item.id,
		name: item.name,
		description: item.description,
		category: item.metadata.is_commercial ? 'commercial' : 'personal',
		icon: item.icon,
		color: item.color,
		metadata: {
			features: item.metadata.features,
			is_commercial: item.metadata.is_commercial,
			hosting: item.metadata.hosting,
			custom_price: item.metadata.custom_price,
			custom_checkout_cta: item.metadata.custom_checkout_cta,
			custom_checkout_link: item.metadata.custom_checkout_link
		} as BillingPlanMetadata
	}));

	const billingPlanHelpers = createMetadataHelpers<
		(typeof billingPlanHelpersData)[0],
		BillingPlanMetadata
	>(billingPlanHelpersData);
	const featureHelpers = createMetadataHelpers<FeatureFixture, FeatureMetadata>(featureFixtures);

	// ============================================================================
	// Lifecycle & Callbacks
	// ============================================================================

	onMount(() => {
		analytics.pricingViewed({ referrer: document.referrer || undefined });
	});

	function handlePlanSelect(plan: BillingPlan) {
		// Redirect to the app's checkout flow
		window.location.href = `https://app.scanopy.net/billing?plan=${plan.type}`;
	}
</script>

<svelte:head>
	<title>Pricing - Scanopy</title>
	<meta name="description" content="Scanopy pricing plans for personal and commerical users" />
</svelte:head>

<section class="py-10 pb-24 lg:pb-10">
	<div class="container mx-auto px-2">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Simple pricing. Unlimited scans.</h1>
		</div>

		<BillingPlanForm
			{plans}
			{billingPlanHelpers}
			{featureHelpers}
			onPlanSelect={handlePlanSelect}
			showGithubStars={true}
		/>
	</div>
</section>
