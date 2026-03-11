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
	const staticPages = [
		{ loc: '/', priority: '1.0', lastmod: '2026-03-09' },
		{ loc: '/pricing', priority: '0.9', lastmod: '2026-03-09' },
		{ loc: '/services', priority: '0.8', lastmod: '2026-02-01' },
		{ loc: '/docs/', priority: '0.8', lastmod: '2026-03-09' },
		{ loc: '/changelog', priority: '0.7', lastmod: '2026-03-09' },
		{ loc: '/roadmap', priority: '0.7', lastmod: '2026-02-01' },
		{ loc: '/showcase', priority: '0.7', lastmod: '2026-02-01' },
		{ loc: '/about', priority: '0.6', lastmod: '2026-03-11' },
		{ loc: '/blog', priority: '0.6', lastmod: '2026-02-01' },
		{ loc: '/community', priority: '0.5', lastmod: '2026-02-01' },
		{ loc: '/privacy', priority: '0.3', lastmod: '2025-12-01' },
		{ loc: '/terms', priority: '0.3', lastmod: '2025-12-01' },
		{ loc: '/refund', priority: '0.3', lastmod: '2025-12-01' }
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
    <loc>https://scanopy.net${page.loc}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
    <priority>${page.priority}</priority>
  </url>`
		)
		.join('');

	const changelogUrls = changelogEntries
		.map(
			(entry) => `
  <url>
    <loc>https://scanopy.net/changelog/${entry.slug}</loc>${entry.date ? `\n    <lastmod>${entry.date}</lastmod>` : ''}
    <priority>0.5</priority>
  </url>`
		)
		.join('');

	const blogUrls = blogEntries
		.map(
			(entry) => `
  <url>
    <loc>https://scanopy.net/blog/${entry.slug}</loc>${entry.date ? `\n    <lastmod>${entry.date}</lastmod>` : ''}
    <priority>0.6</priority>
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
