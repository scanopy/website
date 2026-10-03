import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, type LoaderPlugin, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { createElement } from 'react';
import { IntegrationIcon } from '@/components/integration-icon';
import { allIntegrations } from '@/lib/integrations';
import { GET, POST, PUT, PATCH, DELETE } from '@/components/method-badge';
import { absolutizeDocsLinks, docsUrl } from '@/lib/urls';

// Custom icon handler for HTTP method badges
const methodIcons: Record<string, () => React.ReactNode> = {
	GET,
	POST,
	PUT,
	PATCH,
	DELETE
};

// See https://fumadocs.dev/docs/headless/source-api for more info
// baseUrl is relative to Next.js basePath (/docs), so use '/' here
export const source = loader({
	baseUrl: '/',
	source: docs.toFumadocsSource(),
	icon(icon) {
		if (icon && icon in methodIcons) {
			return methodIcons[icon]();
		}
		return undefined;
	},
	plugins: [lucideIconsPlugin(), integrationIconsPlugin()]
});

/** Last path segment of a URL: `/docs/guides/integrations/docker/` → `docker`. */
const lastSegment = (url: string) => url.split('/').filter(Boolean).pop();

/** Each integration guide's slug, ranked by its position in integrations.json. */
const guideRank = new Map(allIntegrations.map((i, rank) => [lastSegment(i.docs_path), rank]));

/**
 * Integration guides in the sidebar: an icon on each, from its `integration` frontmatter, and
 * fixture order (vendor integrations before generic ones), so a new integration needs no
 * meta.json edit. Non-guide pages in the folder keep their place ahead of the guides.
 */
function integrationIconsPlugin(): LoaderPlugin {
	return {
		name: 'scanopy:integration-icons',
		transformPageTree: {
			file(node, filePath) {
				const file = filePath ? this.storage.read(filePath) : undefined;
				const id =
					file?.format === 'page' ? (file.data as { integration?: string }).integration : undefined;
				if (id) node.icon = createElement(IntegrationIcon, { id, size: 16 });
				return node;
			},
			folder(node) {
				const rank = (child: (typeof node.children)[number]) =>
					child.type === 'page' ? (guideRank.get(lastSegment(child.url)) ?? -1) : -1;
				node.children.sort((a, b) => rank(a) - rank(b));
				return node;
			}
		}
	};
}

export function getPageImage(page: InferPageType<typeof source>) {
	const segments = [...page.slugs, 'image.png'];

	return {
		segments,
		url: `/og/${segments.join('/')}`
	};
}

export async function getLLMText(page: InferPageType<typeof source>) {
	const processed = await page.data.getText('processed');

	return `# ${page.data.title}
Source: ${docsUrl(page.slugs)}

${absolutizeDocsLinks(processed)}`;
}
