<script lang="ts">
	import { BillingPlanForm } from '$lib/components';
	import type { BillingPlan, TypeMetadata, BillingPlanMetadata, FeatureMetadata } from '$lib/types';
	import billingPlansData from '$lib/fixtures/billing-plans.json';
	import featuresData from '$lib/fixtures/features.json';

	// Transform fixture data into the format needed by BillingPlanForm
	// The fixture combines TypeMetadata with BillingPlan data in the metadata field
	interface BillingPlanFixture {
		id: string;
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
			features: Record<string, boolean>;
			is_commercial: boolean;
		};
	}

	const fixtureData = billingPlansData as BillingPlanFixture[];

	// Extract BillingPlan array from the fixture metadata
	const plans: BillingPlan[] = fixtureData.map((item) => ({
		base_cents: item.metadata.base_cents,
		seat_cents: item.metadata.seat_cents,
		included_seats: item.metadata.included_seats,
		network_cents: item.metadata.network_cents,
		included_networks: item.metadata.included_networks,
		rate: item.metadata.rate,
		trial_days: item.metadata.trial_days,
		type: item.id as BillingPlan['type']
	}));

	// Transform to TypeMetadata<BillingPlanMetadata> format
	const billingPlansMetadata: TypeMetadata<BillingPlanMetadata>[] = fixtureData.map((item) => ({
		id: item.id,
		name: item.name,
		description: item.description,
		category: item.metadata.is_commercial ? 'commercial' : 'personal',
		icon: item.icon,
		color: item.color,
		metadata: {
			features: item.metadata.features,
			is_commercial: item.metadata.is_commercial
		}
	}));

	// Features metadata from fixture
	const featuresMetadata: TypeMetadata<FeatureMetadata>[] = featuresData as TypeMetadata<FeatureMetadata>[];

	function handlePlanSelect(plan: BillingPlan) {
		// Redirect to the app's checkout flow
		window.location.href = `https://app.netvisor.io/billing?plan=${plan.type}`;
	}
</script>

<svelte:head>
	<title>Pricing - NetVisor</title>
	<meta name="description" content="NetVisor pricing plans. Free for personal use, with affordable plans for teams and businesses." />
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
				Simple, Transparent Pricing
			</h1>
			<p class="text-xl text-gray-400 max-w-2xl mx-auto">
				Start free, scale as you grow. All plans include core features.
			</p>
		</div>

		<BillingPlanForm
			{plans}
			{billingPlansMetadata}
			{featuresMetadata}
			onPlanSelect={handlePlanSelect}
			showGithubStars={true}
		/>
	</div>
</section>
