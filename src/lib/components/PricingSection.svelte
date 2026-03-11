<script lang="ts">
	import { BillingPlanForm, ContactModal } from '$lib/components';
	import type {
		BillingPlan,
		BillingPlanType,
		BillingPlanMetadata,
		FeatureMetadata
	} from '$lib/types';
	import type { ColorStyle, IconComponent } from '$lib/utils/styling';
	import { createColorHelper, createIconComponent } from '$lib/utils/styling';
	import billingPlansData from '$lib/fixtures/billing-plans.json';
	import featuresData from '$lib/fixtures/features.json';

	interface Props {
		showGithubStars?: boolean;
		showHosting?: boolean;
	}

	let {
		showGithubStars = false,
		showHosting = true,
	}: Props = $props();

	// ============================================================================
	// Fixture Types
	// ============================================================================

	interface MetadataHelpers<T> {
		getMetadata: (id: string | null) => T;
		getDescription: (id: string | null) => string;
		getName: (id: string | null) => string;
		getCategory: (id: string | null) => string;
		getIconComponent: (id: string | null) => IconComponent;
		getColorHelper: (id: string | null) => ColorStyle;
	}

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
			host_cents: number | null;
			included_hosts: number | null;
			rate: string;
			trial_days: number;
			features: BillingPlanMetadata['features'];
			is_commercial: boolean;
			hosting: string;
			custom_price: string | null;
			incremental_features: string[];
			previous_tier: string | null;
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

	const plans: BillingPlan[] = billingPlanFixtures.map((item) => ({
		base_cents: item.metadata.base_cents,
		seat_cents: item.metadata.seat_cents,
		included_seats: item.metadata.included_seats,
		network_cents: item.metadata.network_cents,
		included_networks: item.metadata.included_networks,
		host_cents: item.metadata.host_cents,
		included_hosts: item.metadata.included_hosts,
		rate: item.metadata.rate,
		trial_days: item.metadata.trial_days,
		type: item.id
	}));

	// ============================================================================
	// Metadata Helpers Factory
	// ============================================================================

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
			incremental_features: item.metadata.incremental_features,
			previous_tier: item.metadata.previous_tier
		} as BillingPlanMetadata
	}));

	const billingPlanHelpers = createMetadataHelpers<
		(typeof billingPlanHelpersData)[0],
		BillingPlanMetadata
	>(billingPlanHelpersData);
	const featureHelpers = createMetadataHelpers<FeatureFixture, FeatureMetadata>(featureFixtures);

	// ============================================================================
	// Contact Modal State
	// ============================================================================

	let showContactModal = $state(false);
	let selectedPlanType = $state('');
	let selectedPlanName = $state('');

	function handlePlanInquiry(plan: BillingPlan) {
		selectedPlanType = plan.type;
		selectedPlanName = billingPlanHelpers.getName(plan.type);
		showContactModal = true;
	}

	function handlePlanSelect(plan: BillingPlan) {
		window.open('https://app.scanopy.net/?modal=billing-plan', '_blank', 'noopener,noreferrer');
	}
</script>

<BillingPlanForm
	{plans}
	{billingPlanHelpers}
	{featureHelpers}
	onPlanSelect={handlePlanSelect}
	onPlanInquiry={handlePlanInquiry}
	{showGithubStars}
	{showHosting}
/>

<ContactModal
	open={showContactModal}
	onClose={() => (showContactModal = false)}
	planType={selectedPlanType}
	planName={selectedPlanName}
/>
