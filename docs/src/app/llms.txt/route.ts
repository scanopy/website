import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
	const pages = source.getPages();

	// Group pages by section
	const sections: Record<string, typeof pages> = {};
	for (const page of pages) {
		// Use first slug segment as section, or 'root' for top-level pages
		const section = page.slugs[0] || 'root';
		if (!sections[section]) {
			sections[section] = [];
		}
		sections[section].push(page);
	}

	// Build the llms.txt content
	const lines: string[] = [
		'# Scanopy Documentation',
		'',
		'> Network topology discovery and visualization platform. Scanopy helps you map your infrastructure by discovering hosts, services, and their relationships across your networks.',
		'',
		'## Documentation',
		''
	];

	// Add non-API pages first
	for (const page of pages) {
		if (page.slugs[0] === 'api') continue;
		const url = `/${page.slugs.join('/')}`;
		const title = page.data.title || page.slugs.join('/');
		const description = page.data.description ? `: ${page.data.description}` : '';
		lines.push(`- [${title}](${url})${description}`);
	}

	// Add API section
	lines.push('', '## API Reference', '');
	for (const page of pages) {
		if (page.slugs[0] !== 'api') continue;
		const url = `/${page.slugs.join('/')}`;
		const title = page.data.title || page.slugs.join('/');
		lines.push(`- [${title}](${url})`);
	}

	// Add link to full text
	lines.push('', '## Full Documentation', '');
	lines.push('- [Complete documentation text](/llms-full.txt)');

	return new Response(lines.join('\n'));
}
