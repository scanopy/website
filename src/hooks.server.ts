import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk({ html }) {
			// Find all CSS stylesheet links and add preload hints before them
			const cssLinks = [...html.matchAll(/<link\s+href="([^"]+\.css)"\s+rel="stylesheet">/g)];
			if (cssLinks.length === 0) return html;

			const preloadTags = cssLinks
				.map(([, href]) => `<link rel="preload" href="${href}" as="style">`)
				.join('\n\t');

			// Insert preload hints right after <head> so browser discovers them early
			return html.replace('<head>', `<head>\n\t${preloadTags}`);
		}
	});
};
