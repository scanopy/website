import integrations from '$lib/fixtures/integrations.json';
import type {
	Integration,
	IntegrationFieldDefinition,
	IntegrationSelectOption,
	IntegrationTransport
} from '$lib/types';

/**
 * Access to the `integrations.json` fixture, which is generated in the Scanopy repo
 * (`backend/src/server/credentials/impl/integrations.rs`) and copied here on release.
 *
 * The shape is declared once, in `src/lib/types.ts` alongside the fixture it describes. These
 * aliases keep the names this sub-site's components already use.
 */
export type SelectOption = IntegrationSelectOption;
export type FieldDefinition = IntegrationFieldDefinition;
export type Transport = IntegrationTransport;
export type { Integration };

export const allIntegrations = integrations as Integration[];

/**
 * Look up one integration by its fixture id (the service name — "Docker",
 * "SNMP", "UniFi Controller").
 *
 * Throws rather than rendering nothing: an id that no longer exists means a
 * credential type was renamed upstream, and a silently empty table in a guide is
 * the failure mode worth making loud. Next.js surfaces this at build time.
 */
export function getIntegration(id: string): Integration {
	const found = allIntegrations.find((i) => i.id === id);
	if (!found) {
		throw new Error(
			`Unknown integration "${id}". Available: ${allIntegrations.map((i) => i.id).join(', ')}`
		);
	}
	return found;
}

/**
 * The transports of an integration, optionally narrowed to one by its credential
 * type id ("PodmanProxy"), so a guide can document each transport under its own
 * prose heading.
 */
export function getTransports(id: string, transportId?: string): Transport[] {
	const integration = getIntegration(id);
	if (!transportId) return integration.transports;

	const found = integration.transports.find((t) => t.id === transportId);
	if (!found) {
		throw new Error(
			`Unknown transport "${transportId}" on "${id}". Available: ${integration.transports
				.map((t) => t.id)
				.join(', ')}`
		);
	}
	return [found];
}
