import integrations from '$lib/fixtures/integrations.json';

/**
 * Types for the `integrations.json` fixture, which is generated in the Scanopy
 * repo (`backend/src/server/credentials/impl/integrations.rs`) and copied here on
 * release. Keep these in sync with `Integration` / `IntegrationTransport` /
 * `FieldDefinition` there — this file is the only place the shape is declared, so
 * a mismatch surfaces in one spot rather than in every component.
 */

export interface SelectOption {
	value: string;
	label: string;
}

export interface FieldDefinition {
	id: string;
	label: string;
	field_type: string;
	placeholder?: string;
	secret: boolean;
	optional: boolean;
	help_text?: string;
	options?: SelectOption[];
	default_value?: string;
	inline_format?: string;
	/** Form section the field belongs to ("Connection", "Authentication", …). */
	group?: string;
}

export interface Transport {
	id: string;
	/** Short label ("Socket", "Proxy", "v2c"). */
	name: string;
	/** Full credential-type name as the app shows it ("UniFi API Key"). */
	display_name: string;
	description: string;
	requires_config: boolean;
	single_endpoint_per_host: boolean;
	targets: string[];
	stability: 'Stable' | 'Beta';
	minimum_daemon_version: string;
	fields: FieldDefinition[];
}

export interface Integration {
	id: string;
	name: string;
	category: string;
	discovers: string;
	summary: string;
	transports: Transport[];
}

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
