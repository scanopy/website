<script lang="ts">
	import { PageHero } from '$lib/components';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import { PUBLIC_BREVO_NEWSLETTER_FORM_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	interface BlogPost {
		title: string;
		description: string;
		date: string;
		dateModified?: string;
		keyword: string;
		slug: string;
		image: string;
		tldr?: string;
		style?: string;
		content: string;
		wordCount: number;
	}

	interface PageData {
		post: BlogPost;
		headings: Heading[];
	}

	let { data }: { data: PageData } = $props();
	let activeId = $state('');

	const showToc = $derived(data.headings && data.headings.length >= 3);

	onMount(() => {
		if (!showToc) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				}
			},
			{ rootMargin: '-80px 0px -70% 0px' }
		);

		for (const heading of data.headings) {
			const el = document.getElementById(heading.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	});

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const articleSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.post.title,
		description: data.post.description,
		datePublished: data.post.date,
		dateModified: data.post.dateModified || data.post.date,
		inLanguage: 'en',
		wordCount: data.post.wordCount,
		author: {
			'@type': 'Person',
			name: 'Maya',
			url: 'https://scanopy.net/about',
			image: 'https://github.com/mayanayza.png',
			sameAs: ['https://github.com/mayanayza']
		},
		publisher: {
			'@type': 'Organization',
			name: 'Scanopy',
			logo: {
				'@type': 'ImageObject',
				url: 'https://scanopy.net/scanopy-logo.webp'
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://scanopy.net/blog/${data.post.slug}`
		},
		image: `https://scanopy.net${data.post.image}`
	});
</script>

<svelte:head>
	<title>{data.post.title} - Scanopy</title>
	<meta name="description" content={data.post.description} />
	<link rel="canonical" href="https://scanopy.net/blog/{data.post.slug}" />

	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://scanopy.net/blog/{data.post.slug}" />
	<meta property="article:published_time" content={data.post.date} />
	<meta property="article:modified_time" content={data.post.dateModified || data.post.date} />

	<meta property="og:image" content="https://scanopy.net{data.post.image}" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.post.description} />
	<meta name="twitter:image" content="https://scanopy.net{data.post.image}" />

	{@html `<script type="application/ld+json">${articleSchema}</script>`}
</svelte:head>

<PageHero image={data.post.image} title={data.post.title}>
	{#if data.post.date}
		<div class="flex items-center gap-2 text-sm text-gray-400">
			<time datetime={data.post.date}>{formatDate(data.post.date)}</time>
			{#if data.post.dateModified && data.post.dateModified !== data.post.date}
				<span>·</span>
				<span>Updated <time datetime={data.post.dateModified}>{formatDate(data.post.dateModified)}</time></span>
			{/if}
			<span>·</span>
			<a href="/about" class="hover:text-blue-400">Maya</a>
		</div>
	{/if}
</PageHero>

<article class="py-20">
	<div class="container mx-auto px-4" class:max-w-3xl={!showToc} class:max-w-5xl={showToc}>
		<div class:blog-layout={showToc}>
			<div class="blog-content">
				<header class="mb-12">
					<a href="/blog" class="mb-6 inline-block text-sm text-gray-500 hover:text-blue-400">
						&larr; Back to blog
					</a>
				</header>

				{#if data.post.tldr}
					<div class="mb-8 rounded-r-lg border-l-[3px] border-blue-500 bg-gray-800/50 px-5 py-4">
						<p class="text-sm font-medium text-gray-300">
							<span class="font-semibold text-white">TL;DR:</span> {data.post.tldr}
						</p>
					</div>
				{/if}

				<div class="prose prose-invert prose-gray max-w-none" class:prose-comparison={data.post.style === 'comparison'}>
					{@html data.post.content}
				</div>

				{#if PUBLIC_BREVO_NEWSLETTER_FORM_URL}
					<div class="mt-16 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
						<h3 class="mb-2 text-lg font-semibold text-white">Get notified when we publish new posts</h3>
						<p class="mb-4 text-sm text-gray-400">Network documentation tips, product updates, and the occasional deep dive.</p>
						<NewsletterSignup formUrl={PUBLIC_BREVO_NEWSLETTER_FORM_URL} />
					</div>
				{/if}

				<div class="mt-12 flex items-start gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
					<img
						src="https://github.com/mayanayza.png"
						alt="Maya"
						class="h-14 w-14 rounded-full"
						width="56"
						height="56"
						loading="lazy"
					/>
					<div>
						<a href="/about" class="font-semibold text-white hover:text-blue-400">Maya</a>
						<p class="mt-1 text-sm text-gray-400">
							Founder of Scanopy. Self-hoster, homelabber, and the person behind
							Scanopy's automatic network documentation.
						</p>
					</div>
				</div>
			</div>

			{#if showToc}
				<nav class="blog-toc" aria-label="Table of contents">
					<div class="toc-sticky">
						<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">On this page</p>
						<ul class="space-y-1">
							{#each data.headings as heading}
								<li>
									<a
										href="#{heading.id}"
										class="toc-link block text-sm leading-6 transition-colors"
										class:toc-link-h3={heading.level === 3}
										class:toc-active={activeId === heading.id}
										onclick={(e) => {
											e.preventDefault();
											document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
										}}
									>
										{heading.text}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</nav>
			{/if}
		</div>
	</div>
</article>

<style>
	.blog-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 1024px) {
		.blog-layout {
			grid-template-columns: 1fr 200px;
		}
	}

	.blog-toc {
		display: none;
	}

	@media (min-width: 1024px) {
		.blog-toc {
			display: block;
		}
	}

	.toc-sticky {
		position: sticky;
		top: 6rem;
	}

	.toc-link {
		color: rgb(107 114 128);
		border-left: 2px solid transparent;
		padding-left: 0.75rem;
	}

	.toc-link-h3 {
		padding-left: 1.5rem;
	}

	.toc-link:hover {
		color: rgb(209 213 219);
	}

	.toc-active {
		color: rgb(96 165 250) !important;
		border-left-color: rgb(59 130 246);
	}

	:global(.prose h2) {
		margin-top: 3.5rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		padding-left: 0.75rem;
		border-left: 3px solid rgb(59 130 246);
		scroll-margin-top: 5rem;
	}

	:global(.prose h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: rgb(229 231 235);
		scroll-margin-top: 5rem;
	}

	:global(.prose p) {
		color: rgb(209 213 219);
		margin-bottom: 1.25rem;
		line-height: 1.75;
	}

	:global(.prose p > strong:first-child) {
		color: rgb(243 244 246);
	}

	/* Comparison post style: vendor sections as cards */
	:global(.prose-comparison h3) {
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		padding: 1rem 1.25rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
		background: rgb(31 41 55);
		border-radius: 0.5rem 0.5rem 0 0;
		border: 1px solid rgb(55 65 81);
		border-bottom: none;
		scroll-margin-top: 5rem;
	}

	:global(.prose-comparison h3 + p) {
		padding: 1rem 1.25rem 0.75rem;
		border-left: 1px solid rgb(55 65 81);
		border-right: 1px solid rgb(55 65 81);
		margin-bottom: 0;
		color: rgb(156 163 175);
		font-size: 0.9375rem;
	}

	:global(.prose-comparison h3 + p + p),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child)) {
		padding: 0.5rem 1.25rem;
		border-left: 1px solid rgb(55 65 81);
		border-right: 1px solid rgb(55 65 81);
		margin-bottom: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	:global(.prose-comparison h3 ~ p:has(> strong:first-child) > strong:first-child) {
		color: rgb(96 165 250);
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* Last bold-label paragraph before next h3 or h2 gets bottom border + rounded corners */
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):has(+ h3)),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):has(+ h2)),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):has(+ iframe)),
	:global(.prose-comparison h3 ~ p:has(> strong:first-child):last-child) {
		border-bottom: 1px solid rgb(55 65 81);
		border-radius: 0 0 0.5rem 0.5rem;
		padding-bottom: 1rem;
		margin-bottom: 0.5rem;
	}

	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		color: rgb(209 213 219);
		margin-bottom: 1.5rem;
	}

	:global(.prose li) {
		color: rgb(209 213 219);
		margin-top: 0.25rem;
	}

	:global(.prose a) {
		color: rgb(96 165 250);
	}

	:global(.prose a:hover) {
		color: rgb(147 197 253);
	}

	:global(.prose code) {
		background-color: rgb(31 41 55);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: rgb(229 231 235);
	}

	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	:global(.prose-comparison table) {
		min-width: 800px;
	}

	:global(.prose-comparison) {
		overflow-x: auto;
	}

	:global(.prose-comparison td:nth-child(3)),
	:global(.prose-comparison td:nth-child(4)),
	:global(.prose-comparison th:nth-child(3)),
	:global(.prose-comparison th:nth-child(4)) {
		text-align: center;
		white-space: nowrap;
	}

	:global(.prose-comparison td:nth-child(1)) {
		white-space: nowrap;
		font-weight: 600;
	}

	:global(.prose-comparison .cell-detail) {
		display: block;
		font-size: 0.75rem;
		color: rgb(156 163 175);
		margin-top: 0.25rem;
	}

	:global(.prose-comparison a.cell-detail),
	:global(.prose-comparison .cell-detail a) {
		color: rgb(96 165 250);
	}

	:global(.prose-comparison a.cell-detail:hover),
	:global(.prose-comparison .cell-detail a:hover) {
		color: rgb(147 197 253);
	}

	:global(.prose-comparison td:nth-child(2)) {
		min-width: 140px;
	}

	:global(.prose th) {
		background-color: rgb(31 41 55);
		padding: 0.5rem 0.75rem;
		text-align: left;
		font-weight: 600;
		color: rgb(229 231 235);
		border: 1px solid rgb(55 65 81);
	}

	:global(.prose td) {
		padding: 0.5rem 0.75rem;
		color: rgb(209 213 219);
		border: 1px solid rgb(55 65 81);
	}

	:global(.prose .chip) {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.5;
		white-space: nowrap;
	}

	:global(.prose .chip-yes) {
		background: rgba(34, 197, 94, 0.15);
		color: rgb(74 222 128);
	}

	:global(.prose .chip-no) {
		background: rgba(239, 68, 68, 0.15);
		color: rgb(248 113 113);
	}

	:global(.prose .chip-osi) {
		background: rgba(34, 197, 94, 0.15);
		color: rgb(74 222 128);
	}

	:global(.prose .chip-source-available) {
		background: rgba(245, 158, 11, 0.15);
		color: rgb(251 191 36);
	}

	/* Protocol chips */
	:global(.prose .chip-snmp) { background: rgba(236, 72, 153, 0.15); color: rgb(244 114 182); }
	:global(.prose .chip-cdp) { background: rgba(34, 197, 94, 0.15); color: rgb(74 222 128); }
	:global(.prose .chip-lldp) { background: rgba(59, 130, 246, 0.15); color: rgb(147 197 253); }
	:global(.prose .chip-netflow) { background: rgba(168, 85, 247, 0.15); color: rgb(192 132 252); }
	:global(.prose .chip-wmi) { background: rgba(245, 158, 11, 0.15); color: rgb(251 191 36); }
	:global(.prose .chip-arp) { background: rgba(20, 184, 166, 0.15); color: rgb(45 212 191); }
	:global(.prose .chip-icmp) { background: rgba(239, 68, 68, 0.15); color: rgb(248 113 113); }
	:global(.prose .chip-vmware) { background: rgba(99, 102, 241, 0.15); color: rgb(129 140 248); }
	:global(.prose .chip-tcp-udp) { background: rgba(251, 146, 60, 0.15); color: rgb(251 146 60); }
	:global(.prose .chip-ssh-cli) { background: rgba(234, 179, 8, 0.15); color: rgb(250 204 21); }
	:global(.prose .chip-ping) { background: rgba(139, 92, 246, 0.15); color: rgb(167 139 250); }
	:global(.prose .chip-cloud-import) { background: rgba(107, 114, 128, 0.15); color: rgb(156 163 175); }
	:global(.prose .chip-basic) { background: rgba(245, 158, 11, 0.15); color: rgb(251 191 36); }

	:global(.prose .tooltip-header) {
		position: relative;
		cursor: help;
		text-decoration: underline dotted rgba(148, 163, 184, 0.5);
		text-underline-offset: 3px;
	}

	:global(.prose .tooltip-content) {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.5rem;
		padding: 0.75rem 1rem;
		background: rgb(31 41 55);
		border: 1px solid rgb(55 65 81);
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 400;
		color: rgb(209 213 219);
		white-space: nowrap;
		z-index: 10;
		line-height: 2;
	}

	:global(.prose .tooltip-header:hover .tooltip-content) {
		display: block;
	}

	/* Additional capability chips */
	:global(.prose .chip-type-traffic-analysis) { background: rgba(139, 92, 246, 0.15); color: rgb(167 139 250); }
	:global(.prose .chip-type-rmm) { background: rgba(236, 72, 153, 0.15); color: rgb(244 114 182); }

	/* Type chips */
	:global(.prose .chip-type-monitoring) { background: rgba(245, 158, 11, 0.15); color: rgb(251 191 36); }
	:global(.prose .chip-type-automation) { background: rgba(168, 85, 247, 0.15); color: rgb(192 132 252); }

	:global(.prose strong) {
		color: rgb(229 231 235);
	}

	:global(.prose em) {
		color: rgb(209 213 219);
	}

	:global(.prose iframe) {
		max-width: 100%;
		margin: 1.5rem 0;
	}

	:global(.prose hr) {
		border: none;
		border-top: 1px solid rgb(55 65 81);
		margin: 2rem 0;
	}
</style>
