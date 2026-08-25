import { Clock } from 'lucide-react';
import { Tag, type TagColor } from '@/components/tag';

/**
 * A daemon's status badge, in the colour the app gives it.
 *
 * Transcribed from `getDaemonStatusTag` in `ui/src/lib/features/daemons/utils.ts`,
 * which is also the source of the priority order the reference page documents.
 * The app additionally hangs a help icon off every non-Healthy status linking to
 * that page — dropped here, since it would link to the page the reader is on.
 */
const STATUS_COLORS: Record<string, TagColor> = {
	Healthy: 'Green',
	'Awaiting Connection': 'Blue',
	Standby: 'Purple',
	Unreachable: 'Red',
	Deprecated: 'Orange',
	Unsupported: 'Red',
	Outdated: 'Yellow',
	Unknown: 'Gray'
};

export function StatusTag({ status }: { status: string }) {
	return <Tag color={STATUS_COLORS[status] ?? 'Gray'} label={status} />;
}

/**
 * The badge an entity carries once discovery hasn't observed it within its
 * network's staleness window, drawn as the app draws it: amber with a clock, per
 * `getFreshnessTag` in `ui/src/lib/shared/utils/freshness.ts`.
 *
 * No tooltip — the app's is the entity's own "last seen 12d ago", which only
 * exists in front of real data.
 */
export function StaleTag() {
	return <Tag color="Amber" icon={Clock} label="Stale" />;
}
