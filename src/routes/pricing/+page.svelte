<script lang="ts">
	import { PricingSection, FeaturedIn } from '$lib/components';
	import FAQ from '$lib/components/FAQ.svelte';
	import EditionsComparison from '$lib/components/EditionsComparison.svelte';
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import { onMount } from 'svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { getProductSchema, getFAQPageSchema, getStartingMonthlyPrice } from '$lib/schemas';

	onMount(() => {
		analytics.pricingViewed({ referrer: document.referrer || undefined });
	});

	const productSchema = getProductSchema();
	const startingPrice = getStartingMonthlyPrice();
	const pressMentions = pressMentionsData as PressMention[];

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
				'Cloud plans are hosted and managed by Scanopy - you just install the lightweight daemon on your network. Self-Hosted plans (<a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> and <a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial Edition</a>) let you run the entire Scanopy stack on your own infrastructure, giving you full control over data and configuration.'
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
			question: 'How does pricing work for MSPs?',
			answer:
				"Each 'network' in Scanopy maps to one client site, VLAN group, or isolated environment — so your plan scales with the number of clients whose infrastructure you document. Shareable views let you give each client a live map of their own environment without needing a Scanopy account."
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
	<meta property="og:image" content="https://scanopy.net/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Network Documentation Pricing & Plans - Scanopy" />
	<meta
		name="twitter:description"
		content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments."
	/>
	<meta name="twitter:image" content="https://scanopy.net/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify(productSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<section class="py-10 pb-24 lg:pb-10">
	<div class="container mx-auto px-2">
		<div class="mb-12 text-center">
			<h1 class="mb-8 text-4xl font-bold text-white lg:text-5xl">
				Flat-rate pricing. No per-device fees.<br />Scale without surprises.
			</h1>
			<p class="mt-4 text-sm text-gray-400">
				Evaluating for your team?
				<a
					href="https://cal.com/mferrandiz/scanopy-demo"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-400 hover:text-blue-300"
					onclick={() =>
						analytics.ctaClicked({
							location: 'pricing_top',
							destination: 'talk_to_sales',
							text: 'Talk to Sales'
						})}>Talk to Sales</a
				>.
			</p>
		</div>

		<PricingSection showGithubStars={true} showHosting={true} />
	</div>
</section>

<!-- Editions comparison: managed vs self-hosted deployment choice -->
<section id="editions" class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-10 text-center">
			<span class="pill-eyebrow mb-4"> Editions </span>
			<h2 class="mb-3 text-3xl font-bold text-rose-400 lg:text-4xl">Four ways to run Scanopy</h2>
			<p class="mx-auto max-w-2xl text-gray-400">
				Managed in our cloud or self-hosted in your own environment — pick the deployment that fits
				your team.
			</p>
		</div>
		<EditionsComparison />
	</div>
</section>

<!-- For MSPs: one network = one client site -->
<section class="border-t border-gray-800 py-8">
	<div class="container mx-auto max-w-3xl px-4">
		<h3 class="mb-2 text-lg font-semibold text-white">For MSPs: one network = one client site</h3>
		<p class="text-sm leading-relaxed text-gray-400">
			Each network in Scanopy maps to one client site, VLAN group, or isolated environment. Your
			plan scales with the number of clients whose infrastructure you document. Shareable views let
			you give each client a live map of their own environment — no logins required.
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
			Every Scanopy plan uses flat-rate pricing — you pay per plan, not per device, so your bill
			stays the same whether you're documenting 10 hosts or 10,000. Cloud plans start at
			{startingPrice}/month (billed annually) and include a free trial, scaling from a single network
			up to the multi-network tiers built for consultants, MSPs, and IT teams. Prefer to self-host? The
			<a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a>
			is free and open-source, the
			<a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial Edition</a>
			adds a commercial license, unlimited networks and seats, and advanced features, and Enterprise
			adds fully managed deployment with SSO, whitelabeling, and support.
		</p>
	</div>
</section>
