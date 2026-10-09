import { error } from '@sveltejs/kit';
import { solutionPages, getSolutionPage, builtOnCards } from '$lib/landing';

export const prerender = true;

export function entries() {
	return solutionPages.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const page = getSolutionPage(params.slug);
	if (!page) error(404, 'Page not found');
	return { page, builtOn: builtOnCards(page) };
}
