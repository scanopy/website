<script lang="ts">
	import type { Integration, IntegrationTransport } from '$lib/types';
	import { Tag } from '$lib/components';
	import { analytics } from '$lib/analytics.svelte';

	let { data } = $props();
	const integrations: Integration[] = data.integrations;

	// Logos are shared with the service catalog under /static/logos/services/services/*
	const logoGlob = import.meta.glob('/static/logos/services/services/*', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;
	const logoBySlug = new Map<string, string>();
	for (const [path, url] of Object.entries(logoGlob)) {
		const filename = path.split('/').pop()!;
		const slug = filename.replace(/\.[^.]+$/, '');
		logoBySlug.set(slug, url.replace(/^\/static\//, '/'));
	}

	function logoUrl(integration: Integration): string | null {
		if (!integration.has_logo) return null;
		return logoBySlug.get(integration.logo_slug) ?? null;
	}

	// Both tags mark the exception, never the norm — a "Stable" chip on nine of ten transports
	// would bury the one that isn't. They are separate axes: beta is how far we have validated the
	// integration and goes away on promotion, while an undocumented upstream is a standing
	// property of the vendor's API.
	function isBeta(transport: IntegrationTransport): boolean {
		return transport.stability === 'Beta';
	}

	function isUndocumented(transport: IntegrationTransport): boolean {
		return transport.upstream_support === 'Undocumented';
	}

	// Card-level only when the whole integration is beta. Where just some transports are, the
	// per-transport tags say which, and a card-level tag would overstate it.
	function integrationIsBeta(integration: Integration): boolean {
		return integration.transports.every(isBeta);
	}

	const categories = [...new Set(integrations.map((i) => i.category))].sort((a, b) =>
		a.localeCompare(b)
	);

	function byCategory(category: string): Integration[] {
		return integrations
			.filter((i) => i.category === category)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	const description = `Scanopy integrates with ${integrations
		.map((i) => i.name)
		.join(', ')} to discover and document what's running on your infrastructure.`;
</script>

<svelte:head>
	<title>Integrations - Scanopy</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://scanopy.net/integrations" />

	<meta property="og:title" content="Integrations - Scanopy" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://scanopy.net/integrations" />
	<meta property="og:image" content="https://scanopy.net/og/social.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Integrations - Scanopy" />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://scanopy.net/og/social.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Integrations - Scanopy',
		description,
		url: 'https://scanopy.net/integrations',
		isPartOf: {
			'@type': 'WebSite',
			'@id': 'https://scanopy.net/#website'
		},
		mainEntity: {
			'@type': 'ItemList',
			name: 'Scanopy integrations',
			numberOfItems: integrations.length,
			itemListElement: integrations.map((integration, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: integration.name
			}))
		}
	})}</script>`}
</svelte:head>

<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Integrations</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-400">
				Connect Scanopy to the platforms you already run. Each integration discovers what's there
				and keeps your network documentation current. More are added regularly.
			</p>
		</div>

		<div class="mx-auto max-w-5xl space-y-12">
			{#each categories as category (category)}
				<div>
					<h2 class="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
						{category}
					</h2>

					<div class="grid gap-6 md:grid-cols-2">
						{#each byCategory(category) as integration (integration.id)}
							{@const logo = logoUrl(integration)}
							{@const guide = data.guides[integration.id]}
							<div
								class="flex flex-col rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:border-gray-600 hover:bg-gray-800"
							>
								<div class="flex items-start gap-4">
									<div
										class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg {integration.logo_needs_white_background
											? 'bg-paper'
											: 'bg-gray-700/50'}"
									>
										{#if logo}
											<img
												src={logo}
												alt="{integration.name} logo"
												class="h-7 w-7 object-contain"
												width="28"
												height="28"
											/>
										{:else}
											<span class="text-xl font-bold text-gray-400">
												{integration.name.charAt(0)}
											</span>
										{/if}
									</div>

									<div class="min-w-0 flex-1">
										<div class="flex flex-wrap items-center gap-2">
											<h3 class="text-lg font-semibold text-white">{integration.name}</h3>
											{#if integrationIsBeta(integration)}
												<Tag label="Beta" color="amber" />
											{/if}
										</div>
										<p class="mt-1 text-sm text-gray-400">{integration.discovers}</p>
									</div>
								</div>

								<div class="mb-5 mt-5 border-t border-gray-700/70 pt-4">
									<span
										class="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-500"
									>
										Connection methods
									</span>
									<ul class="space-y-3">
										{#each integration.transports as transport (transport.id)}
											<li>
												<div class="flex flex-wrap items-center gap-2">
													<span class="font-medium text-white">{transport.display_name}</span>
													{#if !integrationIsBeta(integration) && isBeta(transport)}
														<Tag label="Beta" color="amber" />
													{/if}
													{#if isUndocumented(transport)}
														<Tag label="Unofficial API" color="gray" />
													{/if}
												</div>
												<span class="text-sm text-gray-400">{transport.description}</span>
											</li>
										{/each}
									</ul>
								</div>

								<!-- One link per row, not wrapped: a guide title long enough to wrap put the two
								     links on one line in some cards and two in others. mt-auto pins the block to the
								     bottom so it lines up across cards with different numbers of transports. -->
								<div class="mt-auto flex flex-col gap-2 border-t border-gray-700/70 pt-4">
									<a
										href={integration.docs_path}
										class="w-fit text-sm text-blue-400 hover:text-blue-300"
									>
										Setup guide
									</a>
									{#if guide}
										<a href={guide.href} class="w-fit text-sm text-blue-400 hover:text-blue-300">
											{guide.title}
										</a>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-16 text-center">
			<p class="mb-4 text-gray-400">Need Scanopy to connect to something else?</p>
			<a
				href="https://github.com/scanopy/scanopy/issues/new?template=feature_request.md"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
				onclick={() => analytics.integrationRequestClicked()}
			>
				Request an Integration
			</a>
		</div>

		<div class="mx-auto mt-16 max-w-3xl text-center">
			<p class="mb-4 text-gray-400">
				Once connected, an integration runs as part of your scheduled scans, with no manual exports
				and no stale diagrams. See the
				<a href="/docs/using-scanopy/discovery/" class="text-blue-400 hover:text-blue-300"
					>discovery documentation</a
				>
				for setup details, or browse the
				<a href="/services" class="text-blue-400 hover:text-blue-300">services Scanopy detects</a>
				during a scan.
			</p>
			<p class="text-gray-400">
				Want to <a href="/pricing" class="text-blue-400 hover:text-blue-300">compare plans</a>? You
				can <a href="/community" class="text-blue-400 hover:text-blue-300">self-host free</a> or get
				a
				<a href="/commercial" class="text-blue-400 hover:text-blue-300">commercial license</a>.
			</p>
		</div>
	</div>
</section>
