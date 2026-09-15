<script lang="ts">
	import { PricingSection, FeaturedIn, CustomerLogos } from '$lib/components';
	import FAQ from '$lib/components/FAQ.svelte';
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import { onMount } from 'svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { DEMO_BOOKING_URL, DEMO_CTA_LABEL } from '$lib/config/cta';
	import {
		getProductSchema,
		getFAQPageSchema,
		getStartingMonthlyPrice,
		getSelfHostedAnnualPrice,
		getSelfHostedStartingAnnualPrice
	} from '$lib/schemas';

	onMount(() => {
		analytics.pricingViewed({ referrer: document.referrer || undefined });
	});

	const productSchema = getProductSchema();
	const startingPrice = getStartingMonthlyPrice();
	const pressMentions = pressMentionsData as PressMention[];

	// Self-hosted prices, read from the fixture (not hardcoded).
	const selfHostedFrom = getSelfHostedStartingAnnualPrice();
	const standardPrice = getSelfHostedAnnualPrice('SelfHostedStandard');
	const plusPrice = getSelfHostedAnnualPrice('SelfHostedPlus');

	const metaDescription = `Scanopy pricing: the free self-hosted Community Edition, commercial self-hosted licenses from ${selfHostedFrom}/yr, and cloud and enterprise plans. Flat-rate, no per-device fees.`;

	const linkClass = 'text-blue-400 hover:text-blue-300';

	const pricingFaqs = [
		{
			question: 'Is there a free plan?',
			answer: `Yes. The self-hosted <a href="/community" class="${linkClass}">Community Edition</a> is free and open source, with one network and one user seat. Cloud plans include a 14-day free trial, no credit card required.`
		},
		{
			question: 'How much is a self-hosted commercial license?',
			answer: `Self-Hosted Standard is ${standardPrice}/year and Self-Hosted Plus is ${plusPrice}/year, both billed annually with no per-host fees. Plus adds multiple organizations, SAML, and offline (air-gapped) license keys. The free <a href="/community" class="${linkClass}">Community Edition</a> covers one network and one user.`
		},
		{
			question: "What's the difference between Self-Hosted and Cloud?",
			answer: `Self-Hosted plans run the entire Scanopy stack on your own infrastructure, so discovery data and configuration stay under your control. They include the free <a href="/community" class="${linkClass}">Community Edition</a> and the paid Self-Hosted Standard and Plus tiers of the <a href="/commercial" class="${linkClass}">Commercial Edition</a>. On Cloud plans, Scanopy hosts the server and you install the daemon on your network.`
		},
		{
			question: 'Can I try a paid plan before committing?',
			answer:
				'Yes. The free Community Edition runs the same server as the paid self-hosted tiers, so you can evaluate Scanopy on your own network before buying a license. Cloud plans include a 14-day free trial with full access to the plan features.'
		},
		{
			question: 'Do you charge per device?',
			answer:
				'No. Every plan uses flat-rate pricing with no metering by device count, so your bill stays the same whether you scan 10 hosts or 10,000.'
		},
		{
			question: 'Do you offer annual billing?',
			answer:
				'Self-hosted licenses are billed annually. Cloud plans bill monthly or annually, and annual billing saves roughly 20%.'
		},
		{
			question: 'How does pricing work for MSPs?',
			answer:
				"Each 'network' in Scanopy maps to one client site, VLAN group, or isolated environment, so your plan scales with the number of clients whose infrastructure you document. Shareable views let you give each client a current map of their own environment without needing a Scanopy account."
		},
		{
			question: 'Can I upgrade or downgrade later?',
			answer:
				'Yes. On Cloud plans you can switch at any time from your account settings: upgrades take effect immediately, and downgrades apply at the end of your current billing cycle. To change a self-hosted license tier, contact licensing@scanopy.net.'
		},
		{
			question: 'What happens to my data if I cancel?',
			answer:
				'A cancelled Cloud plan is auto-downgraded to Free, and the Free caps on hosts, networks, and seats apply to your data. A self-hosted server keeps its data on your infrastructure. When a license expires, the server goes read-only until the key is replaced.'
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
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href="https://scanopy.net/pricing" />

	<meta property="og:title" content="Network Documentation Pricing & Plans - Scanopy" />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:url" content="https://scanopy.net/pricing" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Network Documentation Pricing & Plans - Scanopy" />
	<meta name="twitter:description" content={metaDescription} />
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
						href={DEMO_BOOKING_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="font-semibold text-blue-400 hover:text-blue-300"
						onclick={() =>
							analytics.ctaClicked({
								location: 'pricing_top',
								destination: 'talk_to_sales',
								text: DEMO_CTA_LABEL
							})}>{DEMO_CTA_LABEL}</a
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
			you give each client a current map of their own environment, no logins required.
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
			stays the same whether you're documenting 10 hosts or 10,000. The self-hosted
			<a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a>
			is free and open source. The
			<a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial Edition</a>
			adds two self-hosted tiers, Self-Hosted Standard and Plus, starting at {selfHostedFrom}/yr
			with a commercial license, advanced features, and support. Enterprise adds a custom plan with
			SSO, whitelabeling, and priority support, managed or self-hosted. Cloud plans start at
			{startingPrice}/month (billed annually) and include a free trial, scaling from a single
			network up to the multi-network tiers built for consultants, MSPs, and IT teams.
		</p>
	</div>
</section>
