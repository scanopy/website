import { marked, Renderer } from 'marked';
import { error } from '@sveltejs/kit';

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
	style?: string;
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
			const headings: Heading[] = [];
			const renderer = new Renderer();

			if (frontmatter.style === 'comparison') {
				renderer.tablecell = ({ text, header }) => {
					const tag = header ? 'th' : 'td';
					if (header) {
						if (text === 'Services') {
							return `<th class="tooltip-header">${text}<span class="tooltip-content"><span class="chip chip-no">No</span> No service awareness<br><span class="chip chip-basic">Basic</span> Common port detection<br><span class="chip chip-yes">Yes</span> Application-level fingerprinting</span></th>`;
						}
						if (text === 'Open Source') {
							return `<th class="tooltip-header">${text}<span class="tooltip-content"><span class="chip chip-osi">OSI</span> OSI-approved open source license<br><span class="chip chip-source-available">Source available</span> Source code available, restricted license<br><span class="chip chip-no">No</span> Proprietary</span></th>`;
						}
						return `<${tag}>${text}</${tag}>`;
					}

					let content = marked.parseInline(text) as string;
					content = content.replace(/\bOSI\b/g, '<span class="chip chip-osi">OSI</span>');
					content = content.replace(/\bSource available\b/g, '<span class="chip chip-source-available">Source available</span>');
					content = content.replace(/\bYes\b/g, '<span class="chip chip-yes">Yes</span>');
					content = content.replace(/\bNo\b/g, '<span class="chip chip-no">No</span>');
					content = content.replace(/\b(SNMP|CDP|LLDP|NetFlow|WMI|ARP|ICMP|VMware|TCP\/UDP|Cloud import|SSH\/CLI|Ping)\b/g, (_, p) => `<span class="chip chip-${p.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')}">${p}</span>`);
					content = content.replace(/\b(Monitoring|Automation|Traffic Analysis|RMM)\b/g, (_, t) => `<span class="chip chip-type-${t.toLowerCase().replace(/\s+/g, '-')}">${t}</span>`);
					content = content.replace(/\bBasic\b/g, '<span class="chip chip-basic">Basic</span>');

					// Split linked chips: <a href="...">Chip (detail)</a> → chip + linked detail below
					content = content.replace(
						/<a([^>]*)>(<span class="chip[^"]*">[^<]+<\/span>)\s*\(([^)]+)\)<\/a>/g,
						'$2<a$1 class="cell-detail">$3</a>'
					);
					// Plain parentheticals (not source references)
					content = content.replace(/\((?!\[\d+\])([^)]+)\)/g, '<span class="cell-detail">$1</span>');

					return `<${tag}>${content}</${tag}>`;
				};
			}

			renderer.heading = ({ text, depth }) => {
				const parsed = marked.parseInline(text) as string;
				const plain = parsed.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
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
				style: frontmatter.style || undefined,
				content: htmlContent,
				wordCount
			};

			return { post, headings };
		}
	}

	error(404, 'Post not found');
}
