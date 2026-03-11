import { marked } from 'marked';
import { error } from '@sveltejs/kit';

interface ChangelogEntry {
	version: string;
	date: string;
	title: string;
	content: string;
	slug: string;
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
	const changelogFiles = import.meta.glob('/src/lib/changelog/*.md', {
		query: '?raw',
		import: 'default'
	});

	const filePath = `/src/lib/changelog/${params.slug}.md`;
	const loader = changelogFiles[filePath];

	if (!loader) {
		error(404, 'Changelog entry not found');
	}

	const raw = (await loader()) as string;
	const { frontmatter, body } = parseFrontmatter(raw);

	const entry: ChangelogEntry = {
		version: frontmatter.version || params.slug,
		date: frontmatter.date || '',
		title: frontmatter.title || `Version ${frontmatter.version || params.slug}`,
		content: await marked.parse(body),
		slug: params.slug
	};

	return { entry };
}
