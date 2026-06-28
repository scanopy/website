import { parseAlternativesSlug } from '$lib/compare/alternatives-pages';

/**
 * Route param matcher for `/comparisons/[slug=alternatives]`. Matches only
 * `<vendor>-alternatives` slugs whose vendor has an alternatives page (gated on the
 * vendor having a full `versus` writeup). Because a matcher-qualified route sorts above
 * the plain `/comparisons/[slug]` markdown route, this keeps the two from colliding and
 * stops the alternatives route from swallowing real comparison-post slugs.
 */
export function match(param: string): boolean {
	return parseAlternativesSlug(param) !== null;
}
