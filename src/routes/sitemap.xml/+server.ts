export const prerender = true;

function parseFrontmatter(content: string): Record<string, string> {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};

	const frontmatter: Record<string, string> = {};
	match[1].split('\n').forEach((line) => {
		const [key, ...valueParts] = line.split(':');
		if (key && valueParts.length) {
			frontmatter[key.trim()] = valueParts.join(':').trim();
		}
	});
	return frontmatter;
}

export async function GET() {
	const buildDate = new Date().toISOString().split('T')[0];

	const staticPages = [
		{ loc: '/' },
		{ loc: '/pricing' },
		{ loc: '/services' },
		{ loc: '/changelog' },
		{ loc: '/roadmap' },
		{ loc: '/showcase' },
		{ loc: '/about' },
		{ loc: '/blog' },
		{ loc: '/community' },
		{ loc: '/privacy' },
		{ loc: '/terms' },
		{ loc: '/refund' }
	];

	// Load changelog entries for dynamic URLs
	const changelogFiles = import.meta.glob('/src/lib/changelog/*.md', {
		query: '?raw',
		import: 'default'
	});

	const changelogEntries: { slug: string; date: string }[] = [];

	for (const [path, loader] of Object.entries(changelogFiles)) {
		const raw = (await loader()) as string;
		const frontmatter = parseFrontmatter(raw);
		const slug = path.split('/').pop()?.replace('.md', '') || '';

		changelogEntries.push({
			slug,
			date: frontmatter.date || ''
		});
	}

	// Load blog posts for dynamic URLs
	const blogFiles = import.meta.glob('/src/lib/blog/*.md', {
		query: '?raw',
		import: 'default'
	});

	const blogEntries: { slug: string; date: string }[] = [];

	for (const [path, loader] of Object.entries(blogFiles)) {
		const raw = (await loader()) as string;
		const frontmatter = parseFrontmatter(raw);
		const slug = path.split('/').pop()?.replace('.md', '') || '';

		blogEntries.push({
			slug,
			date: frontmatter.date || ''
		});
	}

	const urls = staticPages
		.map(
			(page) => `
  <url>
    <loc>https://scanopy.net${page.loc}</loc>
    <lastmod>${buildDate}</lastmod>
  </url>`
		)
		.join('');

	const changelogUrls = changelogEntries
		.map(
			(entry) => `
  <url>
    <loc>https://scanopy.net/changelog/${entry.slug}</loc>${entry.date ? `\n    <lastmod>${entry.date}</lastmod>` : ''}
  </url>`
		)
		.join('');

	const blogUrls = blogEntries
		.map(
			(entry) => `
  <url>
    <loc>https://scanopy.net/blog/${entry.slug}</loc>${entry.date ? `\n    <lastmod>${entry.date}</lastmod>` : ''}
  </url>`
		)
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}${changelogUrls}${blogUrls}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
}
