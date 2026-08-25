import { LandPlot, SatelliteDish, Server } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tag, type TagColor } from '@/components/tag';

/**
 * The scope chips a credential type carries — drawn here once, so a scope looks
 * and reads the same in the credential types table, in an integration guide's
 * transport table, and inline in prose.
 *
 * Each scope names a real entity and borrows that entity's colour and icon, as
 * the app does: `getTargetTagProps` in
 * `ui/src/lib/features/credentials/types/base.ts` reads them from the entity
 * metadata in `ui/src/lib/data/entities.json` — Network → Blue `land-plot`,
 * Daemon → Green `satellite-dish`, Host → Amber `server`. Scanopy has no fixture
 * for entity colours and icons yet, so this table is transcribed rather than
 * generated; keep it matched to those two files.
 *
 * `title` is the app's own tooltip for each scope.
 */
const SCOPES: Record<string, { label: string; title: string; icon: LucideIcon; color: TagColor }> =
	{
		Network: {
			label: 'Network',
			title: 'Can be assigned to a network to target to all hosts.',
			icon: LandPlot,
			color: 'Blue'
		},
		DaemonHost: {
			label: 'Daemon host',
			title: "Can be targeted to the daemon's own host.",
			icon: SatelliteDish,
			color: 'Green'
		},
		Hosts: {
			label: 'Remote hosts',
			title: 'Can be targeted to hosts remote to the daemon running the scan.',
			icon: Server,
			color: 'Amber'
		}
	};

/** Broad → narrow, so every row lists scopes in the same order. */
export const SCOPE_ORDER = ['Network', 'DaemonHost', 'Hosts'];

/** One scope chip, named by its fixture target key. */
export function CredentialScope({ id }: { id: string }) {
	const scope = SCOPES[id];
	if (!scope) return <Tag label={id} />;

	return <Tag color={scope.color} icon={scope.icon} label={scope.label} title={scope.title} />;
}

/** Every scope a credential type supports, in a consistent order. */
export function CredentialScopes({ targets }: { targets: string[] }) {
	return (
		<span className="inline-flex flex-wrap gap-1">
			{SCOPE_ORDER.filter((t) => targets.includes(t)).map((t) => (
				<CredentialScope key={t} id={t} />
			))}
		</span>
	);
}
