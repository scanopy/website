import { marked } from 'marked';
import { error } from '@sveltejs/kit';

interface BlogPost {
	title: string;
	description: string;
	date: string;
	keyword: string;
	slug: string;
	image: string;
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
			frontmatter[key.trim()] = valueParts.join(':').trim();
		}
	});

	return { frontmatter, body: match[2] };
}

export async function load({ params }) {
	const blogFiles = import.meta.glob('/src/lib/blog/*.md', {
		query: '?raw',
		import: 'default'
	});

	for (const [path, loader] of Object.entries(blogFiles)) {
		const raw = (await loader()) as string;
		const { frontmatter, body } = parseFrontmatter(raw);

		const slug = frontmatter.slug || path.split('/').pop()?.replace('.md', '') || '';

		if (slug === params.slug) {
			const post: BlogPost = {
				title: frontmatter.title || '',
				description: frontmatter.description || '',
				date: frontmatter.date || '',
				keyword: frontmatter.keyword || '',
				slug,
				image: frontmatter.image || '/topology-hero.png',
				content: await marked.parse(body)
			};

			return { post };
		}
	}

	error(404, 'Post not found');
}
