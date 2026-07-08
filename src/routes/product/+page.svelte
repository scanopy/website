<script lang="ts">
	import { DiscoveryCardDemo } from '$lib/components';
	import FAQ from '$lib/components/FAQ.svelte';
	import { theme } from '$lib/theme.svelte';
	import { tilt, tiltChild } from '$lib/actions/tilt';
	import {
		Download,
		GitBranch,
		RefreshCw,
		Box,
		Share2,
		Layers,
		Filter,
		Activity,
		ArrowRightLeft,
		Shield,
		UserPlus,
		ArrowRight
	} from 'lucide-svelte';
	import { getProductFeatures, getServiceCountLabel, getFAQPageSchema } from '$lib/schemas';
	import { analytics, featureFlags } from '$lib/analytics.svelte';
	import { page } from '$app/state';
	import { APP, appHref } from '$lib/config/urls';

	const serviceCount = getServiceCountLabel();

	// Icon mapping from fixture string names to Svelte components. Typed off a concrete
	// lucide icon (they all share the same component type).
	const iconMap: Record<string, typeof Download> = {
		Download,
		RefreshCw,
		Box,
		GitBranch,
		Share2,
		Layers,
		Filter
	};

	const productFeatures = getProductFeatures();
	const allFeatures = productFeatures.map((f) => ({
		icon: iconMap[f.icon] || Box,
		title: f.title,
		description: f.description,
		group: f.group
	}));
	const howItWorks = allFeatures.filter((f) => f.group === 'how_it_works');

	const useCases = [
		{
			icon: Activity,
			title: 'Reduce incident response time',
			description:
				"See a broken service's dependency chain. Troubleshoot from understanding, not memory."
		},
		{
			icon: ArrowRightLeft,
			title: 'De-risk changes',
			description:
				'Before migrating, resubnetting, or decommissioning a host, see what depends on it.'
		},
		{
			icon: GitBranch,
			title: 'Simplify post-mortems',
			description: 'Versionable network state shows what changed before something broke.'
		},
		{
			icon: Shield,
			title: 'Eliminate audit scrambles',
			description:
				'Export current topology as SVG, PNG, Mermaid, or Confluence markup. One audit-ready artifact per cycle.'
		},
		{
			icon: Share2,
			title: 'Give clients live maps',
			description:
				'Shareable live links and embeddable maps, per client. No logins, no stale screenshots.'
		},
		{
			icon: UserPlus,
			title: 'Onboard engineers faster',
			description:
				'New engineers get the infrastructure picture on day one. Four current views, not a stale wiki.'
		}
	];

	// Topology view screenshots come in light and dark variants and swap with the
	// site theme. width/height are identical across themes to avoid layout shift.
	const VIEW_META = [
		{
			id: 'l2',
			file: 'l2',
			label: 'Physical (L2)',
			height: 1779,
			alt: 'Scanopy Physical (L2) view showing switch ports and discovered links',
			question: 'How are our switches wired?',
			answer: 'Every switch, every port, every link, with VLANs and port status.'
		},
		{
			id: 'l3',
			file: 'l3',
			label: 'Logical (L3)',
			height: 990,
			alt: 'Scanopy Logical (L3) view showing subnets, hosts, and network segmentation',
			question: 'How is our network segmented?',
			answer: 'Subnets and how hosts connect across them.'
		},
		{
			id: 'workloads',
			file: 'wl',
			label: 'Workloads',
			height: 1216,
			alt: 'Scanopy Workloads view showing VMs and containers nested inside hypervisors and hosts',
			question: 'What runs where?',
			answer: 'Bare metal to hypervisors to containers. The full nesting chain in one model.'
		},
		{
			id: 'application',
			file: 'app',
			label: 'Applications',
			height: 1163,
			alt: 'Scanopy Application view showing services grouped by application and the dependencies between them',
			question: 'How are our applications structured?',
			answer: 'Services and their dependencies, grouped by application.'
		}
	];

	const viewDetails = $derived(
		VIEW_META.map((v) => {
			const s = theme.resolved === 'light' ? '-light' : '';
			return {
				label: v.label,
				question: v.question,
				answer: v.answer,
				alt: v.alt,
				src: `/${v.file}${s}-1440w.webp`,
				srcset: `/${v.file}${s}-960w.webp 960w, /${v.file}${s}-1440w.webp 1440w, /${v.file}${s}-2400w.webp 2400w`,
				width: 1440,
				height: v.height
			};
		})
	);

	// Product FAQ — the product-definitional and positioning questions AI answer engines
	// ask about Scanopy itself. Facts reuse the canonical wording already on the site so a
	// single change keeps them consistent.
	const productFaqs = [
		{
			question: 'What is Scanopy?',
			answer:
				'Scanopy is automated network diagram and documentation software. You deploy one lightweight scanner and it discovers your hosts, maps Layer 2 and Layer 3 topology, and fingerprints the services running on each host — turning your live network into four documentation views that stay current on a schedule, instead of a diagram you redraw by hand.'
		},
		{
			question: 'How does Scanopy discover and document my network?',
			answer:
				'You install a single daemon on the network — no agents on individual endpoints. It scans on a schedule, finds every host, subnet, switch, service, and workload, and correlates them into four switchable views: L2 physical, L3 logical, workloads, and applications. Each re-scan refreshes the documentation automatically, so it reflects the network as it is now rather than when someone last updated a diagram by hand.'
		},
		{
			question: 'Does Scanopy replace network monitoring tools like PRTG or Auvik?',
			answer:
				'No. Monitoring tools track device health, bandwidth, and alerts over time; Scanopy documents what is on your network and how it is connected. It sits alongside your monitoring stack rather than replacing it — many teams run both. See the <a href="/comparisons/best-automated-network-diagram-tools" class="text-blue-400 hover:text-blue-300">tool comparison</a> for how it stacks up against specific products.'
		},
		{
			question: 'Is Scanopy free or open source?',
			answer:
				'Yes. The self-hosted <a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a> is free and open-source under AGPL-3.0, with one network and one seat. Paid <a href="/pricing" class="text-blue-400 hover:text-blue-300">Cloud plans</a> and a <a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial self-hosted license</a> lift those caps and add features like exports, integrations, and more seats.'
		},
		{
			question: 'How often does Scanopy update the network diagram?',
			answer:
				'Scanopy runs scheduled scans — typically hourly to daily, depending on how often your network changes — and refreshes the documentation automatically each time. It is scheduled rather than continuous, so it keeps your maps current without polling the network around the clock.'
		}
	];

	// FAQPage schema sourced from the same array the page renders (strip inline HTML so the
	// schema text matches the visible plain-text answer).
	const faqSchema = getFAQPageSchema(
		productFaqs.map((f) => ({ question: f.question, answer: f.answer.replace(/<[^>]+>/g, '') }))
	);
</script>

<svelte:head>
	<title>Product — Automated Network Diagrams & Documentation | Scanopy</title>
	<meta
		name="description"
		content="See how Scanopy documents your whole network: discover every host, map Layer 2 and Layer 3 topology, fingerprint services, and keep four living views current on a schedule."
	/>
	<link rel="canonical" href="https://scanopy.net/product" />

	<meta property="og:title" content="Scanopy Product — Automated Network Diagrams & Documentation" />
	<meta
		property="og:description"
		content="Discover every host, map Layer 2 and Layer 3 topology, fingerprint services, and keep four living network views current on a schedule."
	/>
	<meta property="og:url" content="https://scanopy.net/product" />
	<meta property="og:image" content="https://scanopy.net/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content="Scanopy Product — Automated Network Diagrams & Documentation" />
	<meta
		name="twitter:description"
		content="Discover every host, map Layer 2 and Layer 3 topology, fingerprint services, and keep four living network views current on a schedule."
	/>
	<meta name="twitter:image" content="https://scanopy.net/social.webp" />
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<!-- Section backgrounds alternate automatically (see <style> below). -->
<div class="home-bands">
	<!-- Problem beat (page lead) -->
	<section class="py-20">
		<div class="container mx-auto max-w-4xl px-4">
			<div class="mb-12 text-center">
				<h1 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Your network documentation is already outdated. Scanopy keeps it current, automatically.
				</h1>
			</div>

			<div class="mb-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-950/40">
				<div
					class="hidden border-b border-gray-800 bg-gray-950/60 px-6 py-3 sm:grid sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-8"
				>
					<div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Source</div>
					<div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
						Outcome
					</div>
				</div>
				{#each [{ source: 'Infrastructure as Code', outcome: 'Declared documentation that holds up until drift, manual changes, or anything provisioned outside the pipeline.' }, { source: 'Wikis and diagrams', outcome: 'Snapshots accurate when someone last updated them. Fiction by month two.' }, { source: 'Team memory', outcome: 'Implicit documentation that walks out the door when people leave.' }] as item (item.source)}
					<div
						class="grid gap-1 border-b border-gray-800 px-6 py-4 last:border-b-0 sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-8"
					>
						<div class="font-semibold text-gray-300">{item.source}</div>
						<p class="text-sm text-gray-500">{item.outcome}</p>
					</div>
				{/each}
			</div>

			<div
				class="grid gap-1 rounded-xl border border-blue-500/40 bg-gradient-to-br from-blue-50 to-paper px-6 py-5 shadow-lg shadow-blue-500/10 dark:from-blue-950/40 dark:to-gray-900/40 sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-8"
			>
				<div class="text-lg font-bold text-white">Scanopy</div>
				<p class="text-gray-300">
					<span class="font-semibold text-rose-400">Observed network documentation</span> that
					reflects what's actually running. Every host, every dependency,
					<a href="/services" class="text-blue-400 hover:text-blue-300">{serviceCount} services</a>.
				</p>
			</div>
		</div>
	</section>

	<!-- The model, from every angle -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Visualize your whole network — and everything running on it
				</h2>
			</div>

			<div class="space-y-20">
				{#each viewDetails as view, i (view.label)}
					<div
						class="flex flex-col items-center gap-10 lg:gap-14 {i % 2 === 0
							? 'lg:flex-row'
							: 'lg:flex-row-reverse'}"
					>
						<div class="lg:w-3/4" use:tiltChild>
							<div class="tiltable browser-frame">
								<div class="browser-frame-bar">
									<span class="browser-frame-dot bg-red-500/70"></span>
									<span class="browser-frame-dot bg-yellow-500/70"></span>
									<span class="browser-frame-dot bg-green-500/70"></span>
									<span class="ml-3 text-xs text-gray-500">app.scanopy.net</span>
								</div>
								<div class="aspect-[4/3] p-6" style="background-color: var(--topo-bg);">
									<img
										src={view.src}
										srcset={view.srcset}
										sizes="(max-width: 1024px) 100vw, 50vw"
										alt={view.alt}
										width={view.width}
										height={view.height}
										class="block h-full w-full object-contain"
										loading="lazy"
									/>
								</div>
							</div>
						</div>
						<div class="lg:w-1/4">
							<span class="pill-eyebrow mb-3">
								{view.label}
							</span>
							<h3
								class="mb-4 text-2xl font-semibold text-white lg:text-3xl"
								style="text-wrap: balance;"
							>
								{view.question}
							</h3>
							<p class="leading-relaxed text-gray-400">{view.answer}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- What this unlocks Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl" style="text-wrap: balance;">
					Fewer fires. Safer changes. Smoother handoffs. Faster onboarding.
				</h2>
			</div>

			<div
				class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3"
			>
				{#each useCases as useCase (useCase.title)}
					<div class="card card-static shrink-0 basis-[85%] snap-start p-8 md:basis-auto">
						<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
							<useCase.icon class="h-7 w-7 text-blue-400" />
						</div>
						<h3 class="mb-3 text-xl font-semibold text-white">{useCase.title}</h3>
						<p class="leading-relaxed text-gray-400">{useCase.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Deploy in three steps -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">
						Deploy once. Scanopy does the rest.
					</h2>
			</div>

			<div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
				<!-- Steps -->
				<div class="space-y-8 lg:w-1/2">
					{#each howItWorks as feature, i (feature.title)}
						<div class="flex gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800 text-lg font-bold text-blue-400 ring-1 ring-blue-800"
							>
								{i + 1}
							</div>
							<div>
								<h3 class="mb-1 text-lg font-semibold text-white">{feature.title}</h3>
								<p class="text-sm text-gray-400">{@html feature.description}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Live discovery card (HTML re-creation of the in-app scan card) -->
				<div class="flex justify-center lg:w-1/2">
					<div use:tilt class="w-full max-w-sm">
						<DiscoveryCardDemo />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2
					class="mb-6 text-3xl font-bold text-rose-400 lg:text-4xl"
					style="text-wrap: balance;"
				>
					Your living network documentation is minutes away.
				</h2>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href={appHref(APP.onboarding, page.url.pathname, 'bottom-cta')}
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'app_onboarding',
								text: featureFlags.mainCtaText
							})}
					>
						{featureFlags.mainCtaText}
						<ArrowRight class="h-5 w-5" />
					</a>
					<a
						href="https://cal.com/mferrandiz/scanopy-demo"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-secondary px-8 py-3 text-lg"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'talk_to_sales',
								text: 'Book Demo'
							})}
					>
						Book Demo
					</a>
				</div>
				<p class="mt-6 text-sm text-gray-400">
					Prefer to self-host? Run the full stack in your own environment with the
					<a
						href="/commercial"
						class="text-blue-400 hover:text-blue-300"
						onclick={() =>
							analytics.ctaClicked({
								location: 'bottom_cta',
								destination: 'commercial',
								text: 'Commercial Edition'
							})}>Commercial Edition</a
					>.
				</p>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="border-t border-gray-800 py-20">
		<div class="container mx-auto max-w-3xl px-4">
			<div class="mb-12 text-center">
				<span class="pill-eyebrow mb-4"> FAQ </span>
				<h2 class="mb-4 text-3xl font-bold text-rose-400 lg:text-4xl">Frequently asked questions</h2>
			</div>
			<FAQ faqs={productFaqs} />
		</div>
	</section>
</div>

<style>
	/* Content sections alternate their background automatically; counting by
	   nth-of-type keeps the alternation correct as sections change. */
	.home-bands :global(section:nth-of-type(even)) {
		background-color: rgb(var(--c-gray-900) / 0.5);
	}
</style>
