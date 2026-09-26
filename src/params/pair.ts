import { parsePairSlug } from '$lib/compare/pair-pages';

/**
 * Route param matcher for `/comparisons/[slug=pair]`. Matches only the generated
 * `<a>-vs-<b>` competitor-versus-competitor slugs. Like the alternatives matcher, a
 * matcher-qualified route sorts above the plain `/comparisons/[slug]` markdown route,
 * so this cannot swallow a real comparison-post slug.
 */
export function match(param: string): boolean {
	return parsePairSlug(param) !== null;
}
