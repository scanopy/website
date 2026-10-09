import { error } from '@sveltejs/kit';
import { productPages, getProductPage, builtOnCards, usedByCards } from '$lib/landing';

export const prerender = true;

export function entries() {
	return productPages.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const page = getProductPage(params.slug);
	if (!page) error(404, 'Page not found');
	return { page, builtOn: builtOnCards(page), usedBy: usedByCards(page.slug) };
}
