import { marked, Renderer } from 'marked';
import { error } from '@sveltejs/kit';
import { vendors as allVendors } from '$lib/fixtures/network-diagram-vendors';
import type { Vendor } from '$lib/types';

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
	ctaDescription?: string;
	content: string;
	wordCount: number;
}

type ContentSegment =
	| { type: 'html'; content: string }
	| { type: 'vendor-inline-table'; vendorSlugs: string[]; columns: string[] };

const DEFAULT_INLINE_COLUMNS = ['name', 'discovery', 'pricing', 'bestFor'];

function splitBlogSegments(
	html: string
): { segments: ContentSegment[]; vendorSlugs: string[] } | null {
	const markerRegex = /<!--\s*vendor-table:([\w,-]+)(?:\s+columns:([\w,]+))?\s*-->/g;
	let match = markerRegex.exec(html);
	if (!match) return null;

	const segments: ContentSegment[] = [];
	const allSlugs: string[] = [];
	let lastIndex = 0;
	markerRegex.lastIndex = 0;

	while ((match = markerRegex.exec(html)) !== null) {
		const before = html.slice(lastIndex, match.index).trim();
		if (before) {
			segments.push({ type: 'html', content: before });
		}

		const vendorSlugs = match[1].split(',').filter(Boolean);
		const columns = match[2] ? match[2].split(',').filter(Boolean) : DEFAULT_INLINE_COLUMNS;
		allSlugs.push(...vendorSlugs);
		segments.push({ type: 'vendor-inline-table', vendorSlugs, columns });

		lastIndex = match.index + match[0].length;
	}

	const remaining = html.slice(lastIndex).trim();
	if (remaining) {
		segments.push({ type: 'html', content: remaining });
	}

	return { segments, vendorSlugs: [...new Set(allSlugs)] };
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
			frontmatter[key.trim()] = valueParts
				.join(':')
				.trim()
				.replace(/^["'](.*)["']$/, '$1');
		}
	});

	return { frontmatter, body: match[2] };
}

export async function load({ params }) {
	const blogFiles = import.meta.glob('/src/lib/guides/*.md', {
		query: '?raw',
		import: 'default'
	});

	for (const [path, loader] of Object.entries(blogFiles)) {
		const raw = (await loader()) as string;
		const { frontmatter, body } = parseFrontmatter(raw);

		const slug = frontmatter.slug || path.split('/').pop()?.replace('.md', '') || '';

		if (slug === params.slug) {
			const headings: Heading[] = [];
			const renderer = new Renderer();

			renderer.heading = ({ text, depth }) => {
				const parsed = marked.parseInline(text) as string;
				const plain = parsed
					.replace(/<[^>]*>/g, '')
					.replace(/&quot;/g, '"')
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&#39;/g, "'");
				if (depth === 2 || depth === 3) {
					const id = plain
						.toLowerCase()
						.replace(/[^\w\s-]/g, '')
						.replace(/\s+/g, '-');
					headings.push({ id, text: plain, level: depth });
					const display = parsed.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
					return `<h${depth} id="${id}">${display}</h${depth}>`;
				}
				return `<h${depth}>${parsed.replace(/&quot;/g, '"').replace(/&#39;/g, "'")}</h${depth}>`;
			};

			const htmlContent = await marked.parse(body, { renderer });

			const wordCount = htmlContent
				.replace(/<[^>]*>/g, '')
				.split(/\s+/)
				.filter(Boolean).length;

			const post: BlogPost = {
				title: frontmatter.title || '',
				description: frontmatter.description || '',
				date: frontmatter.date || '',
				dateModified: frontmatter.dateModified || undefined,
				keyword: frontmatter.keyword || '',
				slug,
				image: frontmatter.image || '/topology-hero.webp',
				tldr: frontmatter.tldr || undefined,
				ctaDescription: frontmatter.ctaDescription || undefined,
				content: htmlContent,
				wordCount
			};

			const parsed = splitBlogSegments(htmlContent);
			if (parsed) {
				const filteredVendors: Record<string, Vendor> = {};
				for (const vs of parsed.vendorSlugs) {
					if (allVendors[vs]) {
						filteredVendors[vs] = allVendors[vs];
					}
				}
				return {
					post,
					headings,
					contentSegments: parsed.segments,
					vendorData: { vendors: filteredVendors }
				};
			}

			return { post, headings };
		}
	}

	error(404, 'Post not found');
}
