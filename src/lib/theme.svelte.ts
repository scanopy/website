import { browser } from '$app/environment';

// Reactive view of the currently applied theme. The theme class is set on <html>
// by the inline script in app.html and kept in sync with the OS by +layout.svelte;
// here we observe the resulting `.dark` class so components (embedded app iframes,
// theme-swapped screenshots, dynamically-colored chips) can follow it.
//
// `resolved` starts as 'dark' to match server-side rendering (the inline script has
// not run yet on the server). initTheme() — called from +layout.svelte onMount — then
// reads the real value after hydration, so the reactive change patches the SSR markup.

function current(): 'light' | 'dark' {
	return browser && !document.documentElement.classList.contains('dark') ? 'light' : 'dark';
}

let resolved = $state<'light' | 'dark'>('dark');
let started = false;

export const theme = {
	get resolved() {
		return resolved;
	}
};

export function initTheme(): void {
	if (!browser || started) return;
	started = true;
	resolved = current();
	new MutationObserver(() => {
		resolved = current();
	}).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

/** Return `src` with its `theme` query param set to match the site theme. */
export function withTheme(src: string, t: 'light' | 'dark'): string {
	try {
		const url = new URL(src);
		url.searchParams.set('theme', t);
		return url.toString();
	} catch {
		return src;
	}
}
