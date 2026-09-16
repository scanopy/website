<script lang="ts">
	import { BillingPlanForm } from '$lib/components';
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
	import { page } from '$app/state';
	import { APP, appHref } from '$lib/config/urls';
	import { DEMO_BOOKING_URL, DEMO_CTA_LABEL } from '$lib/config/cta';
	import { analytics } from '$lib/analytics.svelte';
	import { openContactModal, openLicenseSignup } from '$lib/licensePath.svelte';

	interface Props {
		showGithubStars?: boolean;
		showHosting?: boolean;
		/** Restrict the table to these plan ids (e.g. a Standard+Plus-only table on /commercial). */
		planIds?: string[];
	}

	let { showGithubStars = false, showHosting = true, planIds }: Props = $props();

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
			purchase_flow: string;
			included_orgs: number | null;
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

	// Build the full plan list, then filter out the free tiers (cloud Free and self-hosted
	// Community) for the public pricing UI. The full fixture stays accessible via
	// `billingPlanHelpers` below, so `previous_tier` lookups (e.g., Self-Hosted Standard
	// referencing Community) still resolve even though the free tiers are hidden.
	const allPlans: BillingPlan[] = billingPlanFixtures.map((item) => ({
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
	const plans: BillingPlan[] = allPlans.filter(
		(p) =>
			p.type !== 'Free' && p.type !== 'Community' && (planIds ? planIds.includes(p.type) : true)
	);

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
			purchase_flow: item.metadata.purchase_flow,
			included_orgs: item.metadata.included_orgs,
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
	// Card actions
	// ============================================================================

	function trackPlanSelected(plan: BillingPlan) {
		analytics.pricingPlanSelected({
			plan: plan.type,
			period: plan.rate === 'Year' ? 'yearly' : 'monthly',
			price_cents: plan.base_cents,
			is_trial: plan.trial_days > 0
		});
	}

	// Contact-flow cards: the paid self-hosted tiers open license signup in the app, and
	// Enterprise opens the contact modal as an inquiry.
	function handlePlanInquiry(plan: BillingPlan) {
		trackPlanSelected(plan);
		if (billingPlanHelpers.getMetadata(plan.type).hosting === 'SelfHosted') {
			openLicenseSignup({
				location: 'pricing_widget',
				content: 'pricing-plan',
				planType: plan.type
			});
			return;
		}
		analytics.ctaClicked({
			location: 'pricing_widget',
			destination: 'contact_modal',
			text: 'Request Information',
			plan: plan.type
		});
		openContactModal(plan.type, billingPlanHelpers.getName(plan.type));
	}

	function handlePlanSelect(plan: BillingPlan) {
		trackPlanSelected(plan);
		window.open(
			appHref(APP.billingPlan, page.url.pathname, 'pricing-plan'),
			'_blank',
			'noopener,noreferrer'
		);
	}

	function handleBookDemo(plan: BillingPlan) {
		analytics.ctaClicked({
			location: 'pricing_widget',
			destination: 'talk_to_sales',
			text: DEMO_CTA_LABEL,
			plan: plan.type
		});
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
	showBillingPeriodToggle={!planIds}
	demoUrl={DEMO_BOOKING_URL}
	demoLabel={DEMO_CTA_LABEL}
	onBookDemo={handleBookDemo}
	onHostingChange={(filter) => analytics.pricingPlanFiltered({ filter })}
	onPlanLinkClick={trackPlanSelected}
/>
