import integrationsData from '$lib/fixtures/integrations.json';
import type { Integration } from '$lib/types';

// The docs guide for each integration comes from the fixture's `docs_path`, declared once in the
// Scanopy repo beside the discovery text. The marketing guides under /guides are website content,
// so they declare which integration they cover in their own frontmatter — the same shape the docs
// sub-site uses, and for the same reason: a link table here would be a second list to maintain.

interface GuideLink {
	href: string;
	title: string;
}

/** Scalar-only frontmatter read, matching the parser the /guides routes already use. */
function frontmatterValue(raw: string, key: string): string {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
	if (!match) return '';
	for (const line of match[1].split('\n')) {
		const [name, ...rest] = line.split(':');
		if (name?.trim() !== key || !rest.length) continue;
		return rest
			.join(':')
			.trim()
			.replace(/^["'](.*)["']$/, '$1');
	}
	return '';
}

async function guidesByIntegration(): Promise<Record<string, GuideLink>> {
	const files = import.meta.glob('/src/lib/guides/*.md', { query: '?raw', import: 'default' });
	const guides: Record<string, GuideLink> = {};

	for (const [path, loader] of Object.entries(files)) {
		const raw = (await loader()) as string;
		const integration = frontmatterValue(raw, 'integration');
		if (!integration) continue;

		const slug = frontmatterValue(raw, 'slug') || path.split('/').pop()!.replace('.md', '');
		guides[integration] = { href: `/guides/${slug}`, title: frontmatterValue(raw, 'title') };
	}

	return guides;
}

export async function load() {
	return {
		integrations: integrationsData as Integration[],
		guides: await guidesByIntegration()
	};
}
