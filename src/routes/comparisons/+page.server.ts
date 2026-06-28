import { marked } from 'marked';
import { vendors } from '$lib/fixtures/network-diagram-vendors';
import { VS_VENDOR_SLUGS, vsSlug, vendorDisplayName } from '$lib/compare/vs-pages';
import { ALT_VENDOR_SLUGS, altSlug } from '$lib/compare/alternatives-pages';

interface VsLink {
	href: string;
	name: string;
}

interface ComparisonPost {
	title: string;
	description: string;
	date: string;
	keyword: string;
	slug: string;
	content: string;
}

function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
	const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) {
		return { frontmatter: {}, body: content };
	}

	const frontmatter: Record<string, string> = {};
	match[1].split('\n').forEach((line) => {
		const [key, ...valueParts] = line.split(':');
		if (key && valueParts.length) {
			frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^["'](.*)["']$/, '$1');
		}
	});

	return { frontmatter, body: match[2] };
}

export async function load() {
	const comparisonFiles = import.meta.glob('/src/lib/comparisons/*.md', {
		query: '?raw',
		import: 'default'
	});

	const posts: ComparisonPost[] = [];

	for (const [path, loader] of Object.entries(comparisonFiles)) {
		const raw = (await loader()) as string;
		const { frontmatter, body } = parseFrontmatter(raw);

		const slug = frontmatter.slug || path.split('/').pop()?.replace('.md', '') || '';

		posts.push({
			title: frontmatter.title || '',
			description: frontmatter.description || '',
			date: frontmatter.date || '',
			keyword: frontmatter.keyword || '',
			slug,
			content: await marked.parse(body)
		});
	}

	posts.sort((a, b) => {
		if (!a.date || !b.date) return 0;
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	// Head-to-head "Scanopy vs <vendor>" pages, pulled from the shared vendor list so the
	// hub stays in sync with whatever VS_VENDOR_SLUGS includes.
	const vsLinks: VsLink[] = VS_VENDOR_SLUGS.map((slug) => ({
		href: vsSlug(slug),
		name: vendorDisplayName(vendors[slug])
	}));

	// "Best <vendor> alternatives" listicle pages, gated to vendors with a full versus writeup.
	const altLinks: VsLink[] = ALT_VENDOR_SLUGS.map((slug) => ({
		href: altSlug(slug),
		name: vendorDisplayName(vendors[slug])
	}));

	return { posts, vsLinks, altLinks };
}
