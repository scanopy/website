import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
	dir: 'content/docs',
	docs: {
		schema: frontmatterSchema.extend({
			// Integration guides declare which `integrations.json` entry they document.
			// `scripts/check-integration-guides.mjs` uses it to derive the page's required
			// section list from the fixture, so the guides cannot drift from each other or
			// from the shipped credential types.
			integration: z.string().optional()
		}),
		postprocess: {
			includeProcessedMarkdown: true
		}
	},
	meta: {
		schema: metaSchema
	}
});

export default defineConfig({
	mdxOptions: {
		// MDX options
	}
});
