import { execSync } from 'node:child_process';
import { allVsPageSlugs } from '$lib/compare/vs-pages';
import { allAltPageSlugs } from '$lib/compare/alternatives-pages';

export const prerender = true;

function parseFrontmatter(content: string): Record<string, string> {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};

	const frontmatter: Record<string, string> = {};
	match[1].split('\n').forEach((line) => {
		const [key, ...valueParts] = line.split(':');
		if (key && valueParts.length) {
			frontmatter[key.trim()] = valueParts
				.join(':')
				.trim()
				.replace(/^["'](.*)["']$/, '$1');
		}
	});
	return frontmatter;
}

function getLastCommitDate(filePath: string): string {
	try {
		const date = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
			encoding: 'utf-8'
		}).trim();
		return date ? date.split('T')[0] : new Date().toISOString().split('T')[0];
	} catch {
		return new Date().toISOString().split('T')[0];
	}
}

export async function GET() {
	const staticPages = [
		{ loc: '/', src: 'src/routes/+page.svelte' },
		{ loc: '/product', src: 'src/routes/product/+page.svelte' },
		{ loc: '/pricing', src: 'src/routes/pricing/+page.svelte' },
		{ loc: '/services', src: 'src/routes/services/+page.svelte' },
		{ loc: '/integrations', src: 'src/routes/integrations/+page.svelte' },
		{ loc: '/changelog', src: 'src/routes/changelog/+page.svelte' },
		{ loc: '/roadmap', src: 'src/routes/roadmap/+page.svelte' },
		{ loc: '/about', src: 'src/routes/about/+page.svelte' },
		{ loc: '/blog', src: 'src/routes/blog/+page.svelte' },
		{ loc: '/guides', src: 'src/routes/guides/+page.svelte' },
		{ loc: '/comparisons', src: 'src/routes/comparisons/+page.svelte' },
		{
			loc: '/comparisons/scanopy-alternatives',
			src: 'src/routes/comparisons/scanopy-alternatives/+page.svelte'
		},
		{ loc: '/community', src: 'src/routes/community/+page.svelte' },
		{ loc: '/commercial', src: 'src/routes/commercial/+page.svelte' },
		{ loc: '/press', src: 'src/routes/press/+page.svelte' },
		{ loc: '/security', src: 'src/routes/security/+page.svelte' },
		{ loc: '/privacy', src: 'src/routes/privacy/+page.svelte' },
		{ loc: '/terms', src: 'src/routes/terms/+page.svelte' },
		{ loc: '/dpa', src: 'src/routes/dpa/+page.svelte' },
		{ loc: '/refund', src: 'src/routes/refund/+page.svelte' }
	];

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
    <lastmod>${getLastCommitDate(page.src)}</lastmod>
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

	// Load resources (guides) for dynamic URLs
	const resourceFiles = import.meta.glob('/src/lib/guides/*.md', {
		query: '?raw',
		import: 'default'
	});

	const resourceEntries: { slug: string; date: string }[] = [];

	for (const [path, loader] of Object.entries(resourceFiles)) {
		const raw = (await loader()) as string;
		const frontmatter = parseFrontmatter(raw);
		const slug = path.split('/').pop()?.replace('.md', '') || '';

		resourceEntries.push({
			slug,
			date: frontmatter.date || ''
		});
	}

	const resourceUrls = resourceEntries
		.map(
			(entry) => `
  <url>
    <loc>https://scanopy.net/guides/${entry.slug}</loc>${entry.date ? `\n    <lastmod>${entry.date}</lastmod>` : ''}
  </url>`
		)
		.join('');

	// Load comparison posts for dynamic URLs
	const comparisonFiles = import.meta.glob('/src/lib/comparisons/*.md', {
		query: '?raw',
		import: 'default'
	});

	const comparisonEntries: { slug: string; date: string }[] = [];

	for (const [path, loader] of Object.entries(comparisonFiles)) {
		const raw = (await loader()) as string;
		const frontmatter = parseFrontmatter(raw);
		const slug = path.split('/').pop()?.replace('.md', '') || '';

		comparisonEntries.push({
			slug,
			date: frontmatter.date || ''
		});
	}

	const comparisonUrls = comparisonEntries
		.map(
			(entry) => `
  <url>
    <loc>https://scanopy.net/comparisons/${entry.slug}</loc>${entry.date ? `\n    <lastmod>${entry.date}</lastmod>` : ''}
  </url>`
		)
		.join('');

	// Programmatic "Scanopy vs <vendor>" head-to-head comparison pages.
	// allVsPageSlugs() returns full paths like /comparisons/vs/<vendor>. Every page is
	// rendered from the shared vendor fixture, so its last-commit date is the lastmod.
	const vsLastmod = getLastCommitDate('src/lib/fixtures/network-diagram-vendors.ts');
	const vsUrls = allVsPageSlugs()
		.map(
			(path) => `
  <url>
    <loc>https://scanopy.net${path}</loc>
    <lastmod>${vsLastmod}</lastmod>
  </url>`
		)
		.join('');

	// Programmatic "Best <vendor> alternatives" listicle pages; same fixture-derived
	// lastmod as the vs pages.
	const altUrls = allAltPageSlugs()
		.map(
			(path) => `
  <url>
    <loc>https://scanopy.net${path}</loc>
    <lastmod>${vsLastmod}</lastmod>
  </url>`
		)
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}${blogUrls}${resourceUrls}${comparisonUrls}${vsUrls}${altUrls}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
}
