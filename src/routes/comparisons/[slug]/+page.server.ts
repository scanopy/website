import { marked, Renderer } from 'marked';
import { error } from '@sveltejs/kit';
import {
	vendors,
	tableCategories,
	detailSections,
	vendorSources,
	vendorFAQs,
	disclosureText,
	honorableMentions
} from '$lib/fixtures/network-diagram-vendors';

interface Heading {
	id: string;
	text: string;
	level: number;
}

interface ComparisonPost {
	title: string;
	description: string;
	date: string;
	dateModified?: string;
	keyword: string;
	slug: string;
	image: string;
	tldr?: string;
	ctaDescription?: string;
	style?: string;
	content: string;
	wordCount: number;
}

type ContentSegment =
	| { type: 'html'; content: string }
	| { type: 'vendor-tables' }
	| { type: 'vendor-section'; id: string }
	| { type: 'vendor-sources' };

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

function slugify(text: string): string {
	return text
		.replace(/<[^>]*>/g, '')
		.replace(/\(.*?\)/g, '')
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+$/, '');
}

function splitContentIntoSegments(html: string): ContentSegment[] {
	const segments: ContentSegment[] = [];
	const markerRegex = /<!--\s*vendor-(tables|section:(\w+)|sources)\s*-->/g;
	let lastIndex = 0;
	let match;

	while ((match = markerRegex.exec(html)) !== null) {
		const before = html.slice(lastIndex, match.index).trim();
		if (before) {
			segments.push({ type: 'html', content: before });
		}

		if (match[1] === 'tables') {
			segments.push({ type: 'vendor-tables' });
		} else if (match[1] === 'sources') {
			segments.push({ type: 'vendor-sources' });
		} else if (match[2]) {
			segments.push({ type: 'vendor-section', id: match[2] });
		}

		lastIndex = match.index + match[0].length;
	}

	const remaining = html.slice(lastIndex).trim();
	if (remaining) {
		segments.push({ type: 'html', content: remaining });
	}

	return segments;
}

function mergeHeadings(segments: ContentSegment[], markdownHeadings: Heading[]): Heading[] {
	const merged: Heading[] = [];
	let mdIdx = 0;

	for (const segment of segments) {
		if (segment.type === 'html') {
			const h2h3Matches = segment.content.match(/<h[23]\s/g);
			const count = h2h3Matches ? h2h3Matches.length : 0;
			for (let i = 0; i < count && mdIdx < markdownHeadings.length; i++) {
				merged.push(markdownHeadings[mdIdx++]);
			}
		} else if (segment.type === 'vendor-section') {
			const section = detailSections.find((s) => s.id === segment.id);
			if (section) {
				merged.push({
					id: slugify(section.heading),
					text: section.heading,
					level: 2
				});
				for (const slug of section.vendors) {
					const vendor = vendors[slug];
					if (vendor) {
						merged.push({
							id: slugify(vendor.fullName || vendor.name),
							text: vendor.fullName || vendor.name,
							level: 3
						});
					}
				}
				if (section.id === 'discovery') {
					merged.push({ id: 'honorable-mentions', text: 'Honorable mentions', level: 3 });
				}
			}
		}
	}

	return merged;
}

function generateItemListSchema() {
	const seen = new Set<string>();
	const items: { name: string; url: string }[] = [];

	for (const section of detailSections) {
		for (const slug of section.vendors) {
			if (seen.has(slug)) continue;
			seen.add(slug);

			const vendor = vendors[slug];
			if (!vendor) continue;

			let url = vendor.href;
			if (url.startsWith('/')) {
				url = `https://scanopy.net${url}`;
			}

			items.push({ name: vendor.fullName || vendor.name, url });
		}
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Best Automated Network Diagram Tools (2026)',
		numberOfItems: items.length,
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			url: item.url
		}))
	};
}

export async function load({ params }) {
	const comparisonFiles = import.meta.glob('/src/lib/comparisons/*.md', {
		query: '?raw',
		import: 'default'
	});

	for (const [path, loader] of Object.entries(comparisonFiles)) {
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

			let htmlContent = await marked.parse(body, { renderer });

			// Wrap markdown-rendered tables in scroll containers for mobile
			htmlContent = htmlContent.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');

			// Replace dynamic markers with vendor-derived content
			const manualCategory = tableCategories.find((c) => c.id === 'manual');
			if (manualCategory) {
				const manualNames = manualCategory.vendors.map((slug) => vendors[slug].name);
				let manualList: string;
				if (manualNames.length === 1) {
					manualList = manualNames[0];
				} else if (manualNames.length === 2) {
					manualList = `${manualNames[0]} and ${manualNames[1]}`;
				} else {
					manualList = `${manualNames.slice(0, -1).join(', ')}, and ${manualNames[manualNames.length - 1]}`;
				}
				htmlContent = htmlContent.replace(
					/<!--\s*manual-tools-list\s*-->/,
					manualList
				);
			}

			let wordCount = htmlContent
				.replace(/<[^>]*>/g, '')
				.split(/\s+/)
				.filter(Boolean).length;

			const post: ComparisonPost = {
				title: frontmatter.title || '',
				description: frontmatter.description || '',
				date: frontmatter.date || '',
				dateModified: frontmatter.dateModified || undefined,
				keyword: frontmatter.keyword || '',
				slug,
				image: frontmatter.image || '/topology-hero.webp',
				tldr: frontmatter.tldr || undefined,
				ctaDescription: frontmatter.ctaDescription || undefined,
				style: frontmatter.style || undefined,
				content: htmlContent,
				wordCount
			};

			if (frontmatter.style === 'comparison') {
				// Include vendor section text in word count
				const seen = new Set<string>();
				for (const section of detailSections) {
					for (const vSlug of section.vendors) {
						if (seen.has(vSlug)) continue;
						seen.add(vSlug);
						const v = vendors[vSlug];
						if (!v) continue;
						const text = [v.description, v.discoveryNotes, v.serviceDiscovery, v.diagrams, v.pricingNotes, v.whereItFits, v.tradeOff].filter(Boolean).join(' ');
						wordCount += text.split(/\s+/).filter(Boolean).length;
					}
				}
				post.wordCount = wordCount;

				const contentSegments = splitContentIntoSegments(htmlContent);
				const mergedHeadings = mergeHeadings(contentSegments, headings);

				// Add FAQ headings for TOC
				if (vendorFAQs.length) {
					mergedHeadings.push({ id: 'frequently-asked-questions', text: 'Frequently Asked Questions', level: 2 });
				}

				const itemListSchema = generateItemListSchema();

				return {
					post,
					headings: mergedHeadings,
					contentSegments,
					vendorData: {
						vendors,
						tableCategories,
						detailSections,
						sources: vendorSources,
						faqs: vendorFAQs,
						disclosureText,
						honorableMentions,
						itemListSchema
					}
				};
			}

			return { post, headings };
		}
	}

	error(404, 'Comparison not found');
}
