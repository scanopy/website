// Shared inline-component parser for markdown content routes (blog, guides, and any
// future route that renders authored markdown). Splits rendered HTML on inline markers
// so they render as Svelte components instead of raw HTML, letting a chosen vendor subset
// table, a live demo embed, a customer quote, the shared exports block, or a captioned
// topology figure appear inline in prose on WHATEVER route the content belongs on — the
// marker set is defined once here, not copied per route.
//
// Markers:
//   <!-- vendor-table:slug,slug [columns:a,b] -->  arbitrary vendor subset table
//   <!-- scanopy-demo -->                          theme-aware live map embed
//   <!-- quote:id -->                              customer quote + logo
//   <!-- evidence-exports -->                      shared exports/embed/share block
//   <!-- topology-figure:applications|l3|l2|workloads -->  captioned topology screenshot

export type ContentSegment =
	| { type: 'html'; content: string }
	| { type: 'vendor-inline-table'; vendorSlugs: string[]; columns: string[] }
	| { type: 'scanopy-demo' }
	| { type: 'customer-quote'; id: string }
	| { type: 'evidence-exports' }
	| { type: 'topology-figure'; view: string };

export const DEFAULT_INLINE_COLUMNS = ['name', 'discovery', 'pricing', 'bestFor'];

/**
 * Splits rendered markdown HTML into content segments on the inline-component markers above.
 * Returns null when the content has none of the markers (caller renders the raw HTML instead).
 * The second return value is the de-duplicated set of vendor slugs referenced by any
 * vendor-table markers, so the caller can hydrate just the vendor data it needs.
 */
export function splitContentSegments(
	html: string
): { segments: ContentSegment[]; vendorSlugs: string[] } | null {
	const markerRegex =
		/<!--\s*(?:vendor-table:([\w,-]+)(?:\s+columns:([\w,]+))?|scanopy-demo|quote:([\w-]+)|evidence-exports|topology-figure:(applications|l3|l2|workloads))\s*-->/g;
	if (!markerRegex.test(html)) return null;

	const segments: ContentSegment[] = [];
	const allSlugs: string[] = [];
	let lastIndex = 0;
	markerRegex.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = markerRegex.exec(html)) !== null) {
		const before = html.slice(lastIndex, match.index).trim();
		if (before) {
			segments.push({ type: 'html', content: before });
		}

		if (match[1]) {
			const vendorSlugs = match[1].split(',').filter(Boolean);
			const columns = match[2] ? match[2].split(',').filter(Boolean) : DEFAULT_INLINE_COLUMNS;
			allSlugs.push(...vendorSlugs);
			segments.push({ type: 'vendor-inline-table', vendorSlugs, columns });
		} else if (match[3]) {
			segments.push({ type: 'customer-quote', id: match[3] });
		} else if (match[4]) {
			segments.push({ type: 'topology-figure', view: match[4] });
		} else if (match[0].includes('evidence-exports')) {
			segments.push({ type: 'evidence-exports' });
		} else {
			segments.push({ type: 'scanopy-demo' });
		}

		lastIndex = match.index + match[0].length;
	}

	const remaining = html.slice(lastIndex).trim();
	if (remaining) {
		segments.push({ type: 'html', content: remaining });
	}

	return { segments, vendorSlugs: [...new Set(allSlugs)] };
}
