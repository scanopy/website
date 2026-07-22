import { marked, Renderer } from 'marked';
import { error } from '@sveltejs/kit';
import { vendors as allVendors } from '$lib/fixtures/network-diagram-vendors';
import { externalizeLinks } from '$lib/server/externalize-links';
import { splitContentSegments } from '$lib/content/contentSegments';
import type { Vendor } from '$lib/types';

interface Heading {
	id: string;
	text: string;
	level: number;
}

interface FaqItem {
	question: string;
	answer: string;
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
	format?: string;
	faq: FaqItem[];
	content: string;
	wordCount: number;
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

// The naive scalar parser above flattens everything to strings, so a nested `faq:` list
// (question/answer pairs that feed FAQPage structured data) is parsed structurally here.
// Convention: single-line question/answer values (colons in the value are fine).
//   faq:
//     - question: ...
//       answer: ...
function parseFaq(content: string): FaqItem[] {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return [];

	const unquote = (s: string) => s.trim().replace(/^["'](.*)["']$/, '$1');
	const faq: FaqItem[] = [];
	let inFaq = false;
	let current: FaqItem | null = null;

	for (const line of match[1].split('\n')) {
		// A column-0 key ends any faq block and toggles whether we're inside `faq:`.
		const topKey = line.match(/^([A-Za-z0-9_]+):/);
		if (topKey) {
			if (current) {
				faq.push(current);
				current = null;
			}
			inFaq = topKey[1] === 'faq';
			continue;
		}
		if (!inFaq) continue;

		const q = line.match(/^\s*-\s*question:\s*(.*)$/);
		if (q) {
			if (current) faq.push(current);
			current = { question: unquote(q[1]), answer: '' };
			continue;
		}
		const a = line.match(/^\s*answer:\s*(.*)$/);
		if (a && current) current.answer = unquote(a[1]);
	}
	if (current) faq.push(current);

	return faq.filter((f) => f.question && f.answer);
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

			const htmlContent = externalizeLinks(await marked.parse(body, { renderer }));

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
				image: frontmatter.image || '/og/topology-hero.webp',
				tldr: frontmatter.tldr || undefined,
				ctaDescription: frontmatter.ctaDescription || undefined,
				format: frontmatter.format || undefined,
				faq: parseFaq(raw),
				content: htmlContent,
				wordCount
			};

			const parsed = splitContentSegments(htmlContent);
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
