import { HelpCircle } from 'lucide-react';
import { iconFor } from '@/lib/icons';
import { getIntegration, type Integration } from '@/lib/integrations';

/**
 * An integration's logo, or the lucide icon the app shows when it has none.
 *
 * Mirrors the app's `getIconComponent` (`ui/src/lib/shared/stores/metadata.ts`): `has_logo`
 * picks the service logo, otherwise the fixture's `icon` name, otherwise `HelpCircle`.
 *
 * Logos are copied into `public/logos/` by `scripts/copy-integration-logos.mjs` before `dev`
 * and `build`.
 *
 * Decorative: the integration's name always sits next to it.
 */
export function IntegrationIcon({
	id,
	integration = getIntegration(id!),
	size = 20,
	className = ''
}: {
	id?: string;
	integration?: Integration;
	size?: number;
	className?: string;
}) {
	const box =
		`inline-flex flex-shrink-0 items-center justify-center align-middle ${className}`.trim();

	if (integration.has_logo) {
		return (
			<span
				className={`${box} ${integration.logo_needs_white_background ? 'rounded bg-white p-0.5' : ''}`.trim()}
				aria-hidden="true"
			>
				{/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
				<img
					src={`/docs/logos/${integration.logo_slug}.${integration.logo_ext}`}
					alt=""
					width={size}
					height={size}
					className="object-contain"
					// Inline so it beats the prose stylesheet's top/bottom margin on every content <img>.
					style={{ width: size, height: size, margin: 0 }}
				/>
			</span>
		);
	}

	const Icon = iconFor(integration.icon) ?? HelpCircle;
	return (
		<span className={`${box} text-fd-muted-foreground`} aria-hidden="true">
			<Icon size={size} />
		</span>
	);
}
