import type { LucideIcon } from 'lucide-react';

/**
 * The tag chip the docs share with the app.
 *
 * Scanopy draws every chip — a credential scope, a Beta marker, a Stale badge —
 * through one `Tag` component (`ui/src/lib/shared/components/data/Tag.svelte`)
 * over one colour table (`ui/src/lib/shared/utils/styling.ts`). Reproducing that
 * here once means a chip in the docs reads as the same object as the chip in the
 * product, and a colour is corrected in one place rather than in each table that
 * happens to draw one.
 *
 * Colours are added as they are used. Class strings are written out in full so
 * Tailwind picks them up.
 */
export type TagColor = 'Amber' | 'Blue' | 'Gray' | 'Green' | 'Orange' | 'Purple' | 'Red' | 'Yellow';

const TAG_COLORS: Record<TagColor, string> = {
	Amber: 'bg-amber-200 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
	Blue: 'bg-blue-200 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
	Gray: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
	Green: 'bg-green-200 text-green-600 dark:bg-green-900/50 dark:text-green-400',
	Orange: 'bg-orange-200 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
	Purple: 'bg-purple-200 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
	Red: 'bg-red-200 text-red-600 dark:bg-red-900/50 dark:text-red-400',
	Yellow: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400'
};

export const TAG_BASE = 'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium';

export function Tag({
	color = 'Gray',
	icon: Icon,
	label,
	title,
	className = ''
}: {
	color?: TagColor;
	icon?: LucideIcon;
	label: string;
	/** The app's own tooltip for this chip, where it has one. */
	title?: string;
	className?: string;
}) {
	return (
		<span className={`${TAG_BASE} ${TAG_COLORS[color]} ${className}`.trim()} title={title}>
			{Icon && <Icon size={16} className="flex-shrink-0" aria-hidden="true" />}
			{label}
		</span>
	);
}
