<script lang="ts">
	import { ContactModal, PricingSection } from '$lib/components';
	import FAQ from '$lib/components/FAQ.svelte';
	import { analytics } from '$lib/analytics.svelte';
	import { Shield, Server, Lock, FileCheck, ArrowRight } from 'lucide-svelte';
	import billingPlansData from '$lib/fixtures/billing-plans.json';
	import { getFAQPageSchema } from '$lib/schemas';

	// Published annual price for a self-hosted tier, read from the fixture (not hardcoded).
	function annualPrice(id: string): string {
		const p = billingPlansData.find((x) => x.id === id && x.metadata.rate === 'Year');
		return p ? `$${(p.metadata.base_cents / 100).toLocaleString('en-US')}` : '';
	}

	const whySelfHost = [
		{
			icon: Lock,
			title: 'Your data never leaves your network',
			description:
				'Scanopy runs entirely on your own infrastructure. Discovery data, topology, and credentials stay inside your perimeter, and nothing is sent to a third party.'
		},
		{
			icon: Server,
			title: 'Works in air-gapped and on-prem environments',
			description:
				'Deploy on isolated networks with no outbound internet access. Ideal for OT networks, regulated environments, and customers with strict egress policies.'
		},
		{
			icon: FileCheck,
			title: 'Supports your compliance posture',
			description:
				'Keep your network documentation under your own data-residency and retention controls, with audit logs and SSO to fit your internal review and access policies.'
		},
		{
			icon: Shield,
			title: 'Full control over data and configuration',
			description:
				'You own the deployment, the upgrade cadence, and the data lifecycle. Integrate with your own identity provider and operational tooling.'
		}
	];

	const commercialFaqs = [
		{
			question: 'What is the Commercial Edition?',
			answer:
				'The Commercial Edition is the full Scanopy stack, self-hosted on your own infrastructure with a commercial license and support. It comes in two published tiers, Self-Hosted Standard and Self-Hosted Plus, that add capabilities like audit logs, webhooks, Confluence export, SAML, and priority support on top of the free Community Edition.'
		},
		{
			question: 'How is it different from the free Community Edition?',
			answer:
				'The Community Edition is free and open source for self-hosting, limited to one network and one user seat. The Commercial Edition adds a commercial license for business use, higher network and seat limits, multiple organizations per instance, and advanced features (SAML, audit logs, Confluence export, webhooks), plus email and priority support.'
		},
		{
			question: 'How much does it cost?',
			answer: `Self-Hosted Standard starts at ${annualPrice('SelfHostedStandard') || '$3,000'} per year and Self-Hosted Plus is ${annualPrice('SelfHostedPlus') || '$6,000'} per year, both billed annually with no per-host fees. Larger or custom deployments are priced individually. Tell us about your environment and we will size the right tier or put together a custom quote.`
		},
		{
			question: 'Can I run Scanopy in an air-gapped environment?',
			answer:
				'Yes. The Commercial Edition is designed to run fully on your own infrastructure, including isolated networks with no outbound internet access.'
		},
		{
			question: 'How do I get started?',
			answer:
				'Start with the free Community Edition to try self-hosting, then contact us for a Commercial license when you need commercial use, advanced features, or support. You can reach us any time at licensing@scanopy.net.'
		}
	];

	const faqSchema = getFAQPageSchema(commercialFaqs);

	let showContactModal = $state(false);

	function openContact(location: string) {
		analytics.ctaClicked({
			location,
			destination: 'contact_modal',
			text: 'Request a Quote'
		});
		showContactModal = true;
	}
</script>

<svelte:head>
	<title>Commercial Edition - Self-Hosted Network Documentation for Business | Scanopy</title>
	<meta
		name="description"
		content="Run Scanopy entirely on your own infrastructure with a commercial license and support. Built for businesses that need data control, air-gapped deployment, and compliance."
	/>
	<link rel="canonical" href="https://scanopy.net/commercial" />

	<meta
		property="og:title"
		content="Commercial Edition - Self-Hosted Network Documentation for Business | Scanopy"
	/>
	<meta
		property="og:description"
		content="Run Scanopy entirely on your own infrastructure with a commercial license and support. Built for businesses that need data control, air-gapped deployment, and compliance."
	/>
	<meta property="og:url" content="https://scanopy.net/commercial" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Commercial Edition - Self-Hosted Network Documentation for Business | Scanopy"
	/>
	<meta
		name="twitter:description"
		content="Run Scanopy entirely on your own infrastructure with a commercial license and support. Built for businesses that need data control, air-gapped deployment, and compliance."
	/>
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden py-16 lg:py-24">
	<!-- Background image -->
	<div
		class="absolute inset-0 bg-[url('/og/topology-hero-light.webp')] bg-cover bg-center bg-no-repeat dark:bg-[url('/og/topology-hero.webp')]"
	></div>
	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"></div>

	<div class="container relative z-10 mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="mb-4 text-4xl font-bold leading-tight text-rose-400 lg:text-6xl">
				Self-hosted network documentation, on your terms
			</h1>

			<p class="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
				Run the full Scanopy stack inside your own perimeter, with a commercial license, advanced
				features, and support for the teams that keep your infrastructure running.
			</p>

			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="https://cal.com/mferrandiz/scanopy-demo"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-primary inline-flex items-center gap-2"
					onclick={() =>
						analytics.ctaClicked({
							location: 'commercial_hero',
							destination: 'talk_to_sales',
							text: 'Book Demo'
						})}
				>
					Book Demo
					<ArrowRight class="h-4 w-4" />
				</a>
				<button
					type="button"
					class="btn-secondary inline-flex items-center gap-2"
					onclick={() => openContact('commercial_hero')}
				>
					Request a Quote
				</button>
			</div>
		</div>
	</div>
</section>

<!-- Intro -->
<section class="border-t border-gray-800 py-12">
	<div class="container mx-auto max-w-3xl px-4">
		<p class="text-lg leading-relaxed text-gray-300">
			The Commercial Edition is Scanopy's self-hosted edition for business. It runs the same
			automatic discovery engine that powers our cloud plans, entirely on your own infrastructure.
			It fits any organization that prefers to self-host, including regulated industries, air-gapped
			and on-prem environments, and teams with strict data-residency requirements. You get a
			commercial license, published pricing, advanced features, and support on top of everything in
			the free Community Edition.
		</p>
	</div>
</section>

<!-- Why self-host commercially -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-10 text-center text-3xl font-bold text-rose-400 lg:text-4xl">
			Why self-host with a commercial license
		</h2>
		<div class="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
			{#each whySelfHost as item}
				{@const Icon = item.icon}
				<div class="card card-static p-6">
					<Icon class="mb-3 h-6 w-6 text-rose-400" />
					<p class="mb-2 font-semibold text-white">{item.title}</p>
					<p class="text-sm leading-relaxed text-gray-400">{item.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Commercial plans -->
<section class="border-t border-gray-800 py-20">
	<div class="container mx-auto px-4">
		<div class="mb-10 text-center">
			<h2 class="mb-3 text-3xl font-bold text-rose-400 lg:text-4xl">Commercial plans</h2>
			<p class="mx-auto max-w-2xl text-gray-400">
				Published annual pricing, no per-host fees. Compare the two tiers below, or talk to us about
				a custom deployment.
			</p>
		</div>
		<PricingSection
			planIds={['SelfHostedStandard', 'SelfHostedPlus']}
			showHosting={false}
			showGithubStars={false}
		/>
	</div>
</section>

<!-- Community vs Commercial -->
<section class="border-t border-gray-800 py-16">
	<div class="container mx-auto max-w-3xl px-4">
		<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">Community or Commercial?</h2>
		<p class="mb-4 text-lg leading-relaxed text-gray-300">
			The free <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a>
			is the best place to start, free to self-host for a single network and user, ideal for homelabs,
			evaluation, and small teams.
		</p>
		<p class="text-lg leading-relaxed text-gray-300">
			Step up to the Commercial Edition when you need a commercial license for business use, higher
			network and seat limits, multiple organizations per instance, advanced features like SAML,
			audit logs, Confluence export, and webhooks, or email and priority support backing your
			deployment.
		</p>
	</div>
</section>

<!-- FAQ -->
<section class="border-t border-gray-800 py-16">
	<div class="container mx-auto max-w-3xl px-4">
		<h2 class="mb-8 text-3xl font-bold text-rose-400 lg:text-4xl">Frequently Asked Questions</h2>
		<FAQ faqs={commercialFaqs} />
	</div>
</section>

<!-- Closing CTA -->
<section class="border-t border-gray-800 py-16">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-3 text-2xl font-bold text-white lg:text-3xl">Ready to self-host Scanopy?</h2>
		<p class="mx-auto mb-6 max-w-xl text-gray-400">
			Tell us about your environment and we'll put together a Commercial Edition quote.
		</p>
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="https://cal.com/mferrandiz/scanopy-demo"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary inline-flex items-center gap-2"
				onclick={() =>
					analytics.ctaClicked({
						location: 'commercial_footer',
						destination: 'talk_to_sales',
						text: 'Book Demo'
					})}
			>
				Book Demo
				<ArrowRight class="h-4 w-4" />
			</a>
			<button
				type="button"
				class="btn-secondary inline-flex items-center gap-2"
				onclick={() => openContact('commercial_footer')}
			>
				Request a Quote
			</button>
		</div>
		<p class="mt-4 text-sm text-gray-500">
			Or email us directly at
			<a href="mailto:licensing@scanopy.net" class="text-blue-400 hover:text-blue-300"
				>licensing@scanopy.net</a
			>
		</p>
	</div>
</section>

<ContactModal
	open={showContactModal}
	onClose={() => (showContactModal = false)}
	planType="SelfHostedStandard"
	planName="Commercial Edition"
/>
