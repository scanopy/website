import { marked } from 'marked';

export const prerender = true;

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

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const changelogFiles = import.meta.glob('/src/lib/changelog/*.md', {
		query: '?raw',
		import: 'default'
	});

	const entries: ChangelogEntry[] = [];

	for (const [path, loader] of Object.entries(changelogFiles)) {
		const raw = (await loader()) as string;
		const { frontmatter, body } = parseFrontmatter(raw);

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

	const rssItems = entries
		.map(
			(entry) => `
    <item>
      <title>${escapeXml(`Scanopy ${entry.version}: ${entry.title}`)}</title>
      <link>https://scanopy.net/changelog#${entry.slug}</link>
      <guid isPermaLink="true">https://scanopy.net/changelog#${entry.slug}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description><![CDATA[${entry.content}]]></description>
    </item>`
		)
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Scanopy Changelog</title>
    <description>Release notes and updates for Scanopy - automatic network discovery and documentation software.</description>
    <link>https://scanopy.net/changelog</link>
    <atom:link href="https://scanopy.net/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>https://scanopy.net/scanopy-logo.png</url>
      <title>Scanopy Changelog</title>
      <link>https://scanopy.net/changelog</link>
    </image>${rssItems}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
}
