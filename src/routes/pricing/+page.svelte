<script lang="ts">
	import { PricingSection, FeaturedIn, CustomerLogos } from '$lib/components';
	import FAQ from '$lib/components/FAQ.svelte';
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import billingPlansData from '$lib/fixtures/billing-plans.json';
	import { onMount } from 'svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { getProductSchema, getFAQPageSchema, getStartingMonthlyPrice } from '$lib/schemas';

	onMount(() => {
		analytics.pricingViewed({ referrer: document.referrer || undefined });
	});

	const productSchema = getProductSchema();
	const startingPrice = getStartingMonthlyPrice();
	const pressMentions = pressMentionsData as PressMention[];

	// Cheapest published self-hosted commercial tier, read from the fixture (not hardcoded).
	const selfHostedFrom = (() => {
		const paid = billingPlansData.filter(
			(p) => p.metadata.hosting === 'SelfHosted' && p.metadata.base_cents > 0
		);
		if (paid.length === 0) return null;
		const min = Math.min(...paid.map((p) => p.metadata.base_cents));
		return `$${(min / 100).toLocaleString('en-US')}`;
	})();

	const pricingFaqs = [
		{
			question: 'Is there a free plan?',
			answer:
				'Pro and Business plans include a 14-day free trial, no credit card required. If you prefer to self-host, the <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> is free and open-source (one network and one user seat).'
		},
		{
			question: 'Do you charge per device?',
			answer:
				"No. All plans use flat-rate pricing - we don't meter by device count, so your bill stays the same whether you're scanning 10 hosts or 10,000."
		},
		{
			question: "What's the difference between Cloud and Self-Hosted?",
			answer:
				'Cloud plans are hosted and managed by Scanopy - you just install the lightweight daemon on your network. Self-Hosted plans (the free <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> and the paid Self-Hosted Standard and Plus <a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial</a> tiers) let you run the entire Scanopy stack on your own infrastructure, giving you full control over data and configuration.'
		},
		{
			question: 'Can I try a paid plan before committing?',
			answer:
				'Pro and Business plans include a 14-day free trial. You get full access to all plan features during the trial period.'
		},
		{
			question: 'Do you offer annual billing?',
			answer:
				'Yes. Annual billing is available on all paid plans and saves roughly 20% compared to monthly pricing.'
		},
		{
			question: 'How much is a self-hosted commercial license?',
			answer: `Self-hosted commercial licenses start at ${selfHostedFrom ?? '$3,000'}/yr for Self-Hosted Standard, with Self-Hosted Plus above it for larger teams that need multiple organizations, SAML, and offline (air-gapped) license keys. Both are billed annually with no per-host fees. The free <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> stays available for a single network and user.`
		},
		{
			question: 'How does pricing work for MSPs?',
			answer:
				"Each 'network' in Scanopy maps to one client site, VLAN group, or isolated environment, so your plan scales with the number of clients whose infrastructure you document. Shareable views let you give each client a live map of their own environment without needing a Scanopy account."
		},
		{
			question: 'Can I upgrade or downgrade later?',
			answer:
				'Yes. You can switch between plans at any time from your account settings. Upgrades take effect immediately; downgrades apply at the end of your current billing cycle.'
		},
		{
			question: 'What happens to my data if I cancel?',
			answer:
				'Your plan will be auto-downgraded to Free upon cancellation, and any applicable entity caps (hosts, networks, seats) will be applied to your data automatically.'
		}
	];

	// FAQPage schema sourced from the same array the page renders (strip the inline
	// HTML from answers so the schema text matches the visible plain-text answer).
	const faqSchema = getFAQPageSchema(
		pricingFaqs.map((f) => ({ question: f.question, answer: f.answer.replace(/<[^>]+>/g, '') }))
	);
</script>

<svelte:head>
	<title>Network Documentation Pricing & Plans - Scanopy</title>
	<meta
		name="description"
		content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments."
	/>
	<link rel="canonical" href="https://scanopy.net/pricing" />

	<meta property="og:title" content="Network Documentation Pricing & Plans - Scanopy" />
	<meta
		property="og:description"
		content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments."
	/>
	<meta property="og:url" content="https://scanopy.net/pricing" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Network Documentation Pricing & Plans - Scanopy" />
	<meta
		name="twitter:description"
		content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify(productSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<section class="py-10 pb-24 lg:pb-10">
	<div class="container mx-auto px-2">
		<div class="mb-12 text-center">
			<h1 class="mb-8 text-4xl font-bold text-white lg:text-5xl">
				Flat-rate pricing. No per-device fees.<br />Scale without surprises.
			</h1>
			<div class="mx-auto mt-4 max-w-xl text-sm text-gray-400">
				<p>
					Evaluating for your team?
					<a
						href="https://cal.com/mferrandiz/scanopy-demo"
						target="_blank"
						rel="noopener noreferrer"
						class="font-semibold text-blue-400 hover:text-blue-300"
						onclick={() =>
							analytics.ctaClicked({
								location: 'pricing_top',
								destination: 'talk_to_sales',
								text: 'Book Demo'
							})}>Book Demo</a
					>
				</p>
			</div>
		</div>

		<PricingSection showGithubStars={true} showHosting={true} />
	</div>
</section>

<CustomerLogos />

<!-- For MSPs: one network = one client site -->
<section class="border-t border-gray-800 py-8">
	<div class="container mx-auto max-w-3xl px-4">
		<h3 class="mb-2 text-lg font-semibold text-white">For MSPs: one network = one client site</h3>
		<p class="text-sm leading-relaxed text-gray-400">
			Each network in Scanopy maps to one client site, VLAN group, or isolated environment. Your
			plan scales with the number of clients whose infrastructure you document. Shareable views let
			you give each client a live map of their own environment, no logins required.
		</p>
	</div>
</section>

<FeaturedIn mentions={pressMentions} />

<!-- FAQ -->
<section class="border-t border-gray-800 py-16">
	<div class="container mx-auto max-w-3xl px-4">
		<h2 class="mb-8 text-3xl font-bold text-rose-400 lg:text-4xl">Frequently Asked Questions</h2>
		<FAQ faqs={pricingFaqs} />
	</div>
</section>

<!-- Plan comparison prose -->
<section class="border-t border-gray-800 py-12">
	<div class="container mx-auto max-w-5xl px-4">
		<p class="text-sm leading-relaxed text-gray-400">
			Every Scanopy plan uses flat-rate pricing. You pay per plan, not per device, so your bill
			stays the same whether you're documenting 10 hosts or 10,000. Cloud plans start at
			{startingPrice}/month (billed annually) and include a free trial, scaling from a single
			network up to the multi-network tiers built for consultants, MSPs, and IT teams. Prefer to
			self-host? The
			<a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a>
			is free and open source. The
			<a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial Edition</a>
			publishes two self-hosted tiers, Self-Hosted Standard and Plus, starting at {selfHostedFrom}/yr
			with a commercial license, advanced features, and support. Enterprise adds a custom plan with
			SSO, whitelabeling, and priority support, managed or self-hosted.
		</p>
	</div>
</section>
