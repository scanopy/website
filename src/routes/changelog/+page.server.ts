import { marked } from 'marked';

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

export async function load() {
	const changelogFiles = import.meta.glob('/src/lib/changelog/*.md', {
		query: '?raw',
		import: 'default'
	});

	const entries: ChangelogEntry[] = [];

	for (const [path, loader] of Object.entries(changelogFiles)) {
		const raw = (await loader()) as string;
		const { frontmatter, body } = parseFrontmatter(raw);

		// Extract slug from filename (e.g., /src/lib/changelog/v0.1.0.md -> v0.1.0)
		const slug = path.split('/').pop()?.replace('.md', '') || '';

		entries.push({
			version: frontmatter.version || slug,
			date: frontmatter.date || '',
			title: frontmatter.title || `Version ${frontmatter.version || slug}`,
			content: await marked.parse(body),
			slug
		});
	}

	// Sort by date descending (newest first)
	entries.sort((a, b) => {
		if (!a.date || !b.date) return 0;
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return { entries };
}
