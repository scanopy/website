<script lang="ts">
	import { BookOpen } from 'lucide-svelte';

	interface BlogPost {
		title: string;
		description: string;
		date: string;
		keyword: string;
		slug: string;
	}

	interface PageData {
		posts: BlogPost[];
	}

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blog | Scanopy</title>
	<meta
		name="description"
		content="Technical articles on network documentation, automated discovery, and IT infrastructure management."
	/>
	<link rel="canonical" href="https://scanopy.net/blog" />

	<meta property="og:title" content="Blog | Scanopy" />
	<meta
		property="og:description"
		content="Technical articles on network documentation, automated discovery, and IT infrastructure management."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://scanopy.net/blog" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Blog | Scanopy" />
	<meta
		name="twitter:description"
		content="Technical articles on network documentation, automated discovery, and IT infrastructure management."
	/>
</svelte:head>

<section class="py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<div class="mb-12 text-center">
			<div class="mb-4 flex justify-center">
				<BookOpen class="h-12 w-12 text-blue-400" />
			</div>
			<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Blog</h1>
			<p class="text-xl text-gray-400">
				Network documentation, automated discovery, and lessons from the field.
			</p>
		</div>

		{#if data.posts.length === 0}
			<div class="text-center">
				<p class="text-gray-400">No posts yet. Check back soon!</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each data.posts as post (post.slug)}
					<article
						class="rounded-lg border border-gray-800 p-6 transition-colors hover:border-gray-700"
					>
						<a href="/blog/{post.slug}" class="block">
							{#if post.date}
								<time class="text-sm text-gray-500" datetime={post.date}>
									{formatDate(post.date)}
								</time>
							{/if}
							<h2 class="mt-1 text-2xl font-bold text-white hover:text-blue-400">
								{post.title}
							</h2>
							{#if post.description}
								<p class="mt-2 text-gray-400">{post.description}</p>
							{/if}
						</a>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
