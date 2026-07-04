<script lang="ts">
	import { APP, appHref } from '$lib/config/urls';
	import { getStartingMonthlyPrice } from '$lib/schemas';
	import { analytics } from '$lib/analytics.svelte';
	import { page } from '$app/state';
	import billingPlansData from '$lib/fixtures/billing-plans.json';
	import { Cloud, Server, Heart, Building2 } from 'lucide-svelte';

	interface PlanFixture {
		id: string;
		metadata: {
			hosting: string;
			custom_price: string | null;
			included_networks: number | null;
			included_seats: number | null;
			base_cents: number;
			trial_days: number;
		};
	}

	const plans = billingPlansData as unknown as PlanFixture[];
	const startingPrice = getStartingMonthlyPrice();

	// Managed vs self-hosted, derived from the plan's hosting field.
	function deploymentLabel(hosting: string): string {
		return hosting === 'SelfHosted' ? 'Self-hosted' : 'Managed by Scanopy';
	}

	// Networks/seats line derived from the plan's included limits (both null → unlimited).
	function limitsNote(m: PlanFixture['metadata']): string {
		const nets = m.included_networks;
		const seats = m.included_seats;
		if (nets == null && seats == null) return 'Unlimited networks & seats';
		const parts: string[] = [];
		if (nets != null) parts.push(nets === 1 ? '1 network' : `${nets} networks`);
		if (seats != null) parts.push(seats === 1 ? '1 seat' : `${seats} seats`);
		return parts.join(' · ');
	}

	// Editorial framing per edition (tagline, best-for, CTA, accent) — the marketing copy
	// that isn't in the fixture. `deployment`, `price`, and `priceNote` are DERIVED from
	// billing-plans.json below (keyed by `planId`) so they stay in sync with pricing.
	// `icon` is left to inference — lucide-svelte's type isn't assignable to svelte's
	// `Component` interface in this setup (annotating it errors).
	const editionsConfig = [
		{
			id: 'cloud',
			name: 'Cloud',
			icon: Cloud,
			planId: null as string | null,
			tagline: 'We host it — you just deploy the scanner on your network.',
			bestFor: 'Teams that want managed hosting and flat, predictable pricing.',
			ctaText: 'Start Free Trial',
			ctaHref: appHref(APP.onboarding, page.url.pathname, 'editions'),
			external: true,
			destination: 'app_onboarding',
			highlight: false
		},
		{
			id: 'commercial',
			name: 'Commercial',
			icon: Server,
			planId: 'CommercialSelfHosted' as string | null,
			tagline: 'Run the full stack inside your own perimeter, with a license and support.',
			bestFor: 'Businesses that need data control, on-prem, or air-gapped deployment.',
			ctaText: 'Learn More',
			ctaHref: '/commercial',
			external: false,
			destination: 'commercial',
			highlight: true
		},
		{
			id: 'community',
			name: 'Community',
			icon: Heart,
			planId: 'Community' as string | null,
			tagline: 'Free and open-source (AGPL-3.0). Deploy with one Docker command.',
			bestFor: 'Homelabs, home networks, and small teams.',
			ctaText: 'Explore Community',
			ctaHref: '/community',
			external: false,
			destination: 'community',
			highlight: false
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			icon: Building2,
			planId: 'Enterprise' as string | null,
			tagline: 'Fully managed deployment with SSO, whitelabeling, and live chat support.',
			bestFor: 'Larger orgs needing managed deployment and advanced controls.',
			ctaText: 'Talk to Sales',
			ctaHref: 'https://cal.com/mferrandiz/scanopy-demo',
			external: true,
			destination: 'talk_to_sales',
			highlight: false
		}
	];

	// Merge editorial config with the fixture-derived deployment / price / limits.
	const editions = editionsConfig.map((c) => {
		if (c.planId === null) {
			// Cloud is an aggregate of the per-tier Cloud plans, not one fixture row.
			const cloudTier = plans.find(
				(p) => p.metadata.hosting === 'Cloud' && p.metadata.base_cents > 0
			);
			const trialDays = cloudTier?.metadata.trial_days ?? 14;
			return {
				...c,
				deployment: 'Managed by Scanopy',
				price: startingPrice ? `From ${startingPrice}/mo` : 'Flat monthly',
				priceNote: `billed yearly · ${trialDays}-day free trial`
			};
		}
		const m = plans.find((p) => p.id === c.planId)?.metadata;
		return {
			...c,
			deployment: m ? deploymentLabel(m.hosting) : '',
			price: m?.custom_price ?? 'Custom',
			priceNote: m ? limitsNote(m) : ''
		};
	});

	function track(ed: (typeof editions)[number]) {
		analytics.ctaClicked({
			location: 'editions_comparison',
			destination: ed.destination,
			text: ed.ctaText
		});
	}
</script>

<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
	{#each editions as ed (ed.id)}
		{@const Icon = ed.icon}
		<div
			class="card card-static flex flex-col p-6 {ed.highlight
				? 'ring-1 ring-blue-500/40'
				: ''}"
		>
			<div class="mb-3 flex items-center gap-2">
				<Icon class="h-5 w-5 text-blue-400" />
				<h3 class="text-xl font-semibold text-white">{ed.name}</h3>
			</div>

			<span
				class="mb-3 inline-block w-fit rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300"
			>
				{ed.deployment}
			</span>

			<p class="mb-4 text-sm leading-relaxed text-gray-400">{ed.tagline}</p>

			<div class="mb-4">
				<div class="text-lg font-bold text-white">{ed.price}</div>
				<div class="text-xs text-gray-500">{ed.priceNote}</div>
			</div>

			<p class="mb-6 text-sm leading-relaxed text-gray-400">
				<span class="font-medium text-gray-300">Best for:</span>
				{ed.bestFor}
			</p>

			<div class="mt-auto">
				{#if ed.external}
					<a
						href={ed.ctaHref}
						target="_blank"
						rel="noopener noreferrer"
						class={ed.highlight
							? 'btn-primary block w-full text-center text-sm'
							: 'btn-secondary block w-full text-center text-sm'}
						onclick={() => track(ed)}
					>
						{ed.ctaText}
					</a>
				{:else}
					<a
						href={ed.ctaHref}
						class={ed.highlight
							? 'btn-primary block w-full text-center text-sm'
							: 'btn-secondary block w-full text-center text-sm'}
						onclick={() => track(ed)}
					>
						{ed.ctaText}
					</a>
				{/if}
			</div>
		</div>
	{/each}
</div>
