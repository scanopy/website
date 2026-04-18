<script lang="ts">
	import { PricingSection, FeaturedIn } from '$lib/components';
	import FAQ from '$lib/components/FAQ.svelte';
	import type { PressMention } from '$lib/types';
	import pressMentionsData from '$lib/fixtures/press-mentions.json';
	import { onMount } from 'svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { getProductSchema } from '$lib/schemas';

	onMount(() => {
		analytics.pricingViewed({ referrer: document.referrer || undefined });
	});

	const productSchema = getProductSchema();
	const pressMentions = pressMentionsData as PressMention[];

	const pricingFaqs = [
		{
			question: 'Is there a free plan?',
			answer: 'Pro and Business plans include a 14-day free trial, no credit card required. If you prefer to self-host, the <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> is free and open-source with no host limit.'
		},
		{
			question: 'Do you charge per device?',
			answer: "No. All plans use flat-rate pricing - we don't meter by device count, so your bill stays the same whether you're scanning 10 hosts or 10,000."
		},
		{
			question: "What's the difference between Cloud and Self-Hosted?",
			answer: 'Cloud plans are hosted and managed by Scanopy - you just install the lightweight daemon on your network. Self-Hosted plans (Community and On-Premise) let you run the entire Scanopy stack on your own infrastructure, giving you full control over data and configuration.'
		},
		{
			question: 'Can I try a paid plan before committing?',
			answer: 'Pro and Business plans include a 14-day free trial. You get full access to all plan features during the trial period.'
		},
		{
			question: 'Do you offer annual billing?',
			answer: 'Yes. Annual billing is available on all paid plans and saves roughly 20% compared to monthly pricing.'
		},
		{
			question: 'How does pricing work for MSPs?',
			answer: "Each 'network' in Scanopy maps to one client site, VLAN group, or isolated environment — so your plan scales with the number of clients whose infrastructure you document. Shareable views let you give each client a live map of their own environment without needing a Scanopy account."
		},
		{
			question: 'Can I upgrade or downgrade later?',
			answer: 'Yes. You can switch between plans at any time from your account settings. Upgrades take effect immediately; downgrades apply at the end of your current billing cycle.'
		},
		{
			question: 'What happens to my data if I cancel?',
			answer: 'Your plan will be auto-downgraded to Free upon cancellation, and any applicable entity caps (hosts, networks, seats) will be applied to your data automatically.'
		}
	];
</script>

<svelte:head>
	<title>Network Documentation Pricing & Plans - Scanopy</title>
	<meta
		name="description"
		content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments."
	/>
	<link rel="canonical" href="https://scanopy.net/pricing" />

	<meta property="og:title" content="Network Documentation Pricing & Plans - Scanopy" />
	<meta property="og:description" content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments." />
	<meta property="og:url" content="https://scanopy.net/pricing" />
	<meta property="og:image" content="https://scanopy.net/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Network Documentation Pricing & Plans - Scanopy" />
	<meta name="twitter:description" content="Scanopy pricing plans for personal and commercial users. From free self-hosted to enterprise managed deployments." />
	<meta name="twitter:image" content="https://scanopy.net/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify(productSchema)}</script>`}
</svelte:head>

<section class="py-10 pb-24 lg:pb-10">
	<div class="container mx-auto px-2">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">
				Flat-rate pricing. No per-device fees. Scale without surprises.
			</h1>
			<p class="text-lg text-gray-400">Unlimited scans on every plan.</p>
		</div>

		<PricingSection showGithubStars={true} showHosting={true} />
	</div>
</section>

<!-- For MSPs: one network = one client site -->
<section class="border-t border-gray-800 py-8">
	<div class="container mx-auto max-w-3xl px-4">
		<h3 class="mb-2 text-lg font-semibold text-white">
			For MSPs: one network = one client site
		</h3>
		<p class="text-sm text-gray-400 leading-relaxed">
			Each network in Scanopy maps to one client site, VLAN group, or isolated environment. Your plan scales with the number of clients whose infrastructure you document. Shareable views let you give each client a live map of their own environment — no logins required.
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
		<p class="text-sm text-gray-400 leading-relaxed">
			Every Scanopy plan uses flat-rate pricing, you don't pay per device. Pro and Business include a 14-day free trial so you can evaluate Scanopy before committing. Starter adds scheduled discovery, shareable views, and SVG export for $14.99/month. Pro unlocks API access, Mermaid diagram export, and embeddable views across up to 3 networks - ideal for consultants or multi-site setups. Business is built for MSPs and IT teams managing 15+ networks, with Confluence export, audit logs, webhooks, and priority support. All paid plans include annual billing at a ~20% discount. If you prefer to self-host, the Community plan is free with no host limits, and the On-Premise plan adds commercial licensing and advanced features. Enterprise includes fully managed deployment with SSO, whitelabeling, and live chat support.
		</p>
	</div>
</section>
