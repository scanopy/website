import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** `octagon-alert` → the `OctagonAlert` component `lucide-react` exports. */
export function iconFor(name: string | null | undefined): LucideIcon | undefined {
	if (!name) return undefined;
	const componentName = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
	return (LucideIcons as unknown as Record<string, LucideIcon>)[componentName];
}
