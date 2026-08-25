import { Callout } from 'fumadocs-ui/components/callout';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CredentialScopes } from '@/components/credential-scopes';
import { FieldsTable } from '@/components/field-table';
import { Tag } from '@/components/tag';
import { getIntegration, getTransports } from '@/lib/integrations';

/**
 * Renders only for Beta. Stable is the norm, and tagging every stable row would
 * make the exception harder to spot rather than easier.
 */
export function StabilityTag({ stability }: { stability: string }) {
	if (stability !== 'Beta') return null;
	return (
		<Tag
			color="Amber"
			label="Beta"
			title="This integration is in beta. Please report any issues you encounter. Its settings may change in a future release."
			className="ml-2"
		/>
	);
}

/**
 * Marks a credential type whose vendor does not publish the API behind it. Like
 * {@link StabilityTag} it renders only for the exceptional case, and the two are
 * independent — a type can carry both, either, or neither.
 *
 * Gray rather than amber, as in the app: this is a standing property of the
 * vendor's API, not a warning about how far Scanopy has validated the
 * integration. `IntegrationUnofficialApi` says the same thing at length on the
 * guide that owns it; the chip is what carries it into a table of many types.
 */
export function UnofficialApiTag({ upstreamSupport }: { upstreamSupport: string }) {
	if (upstreamSupport !== 'Undocumented') return null;
	return (
		<Tag
			label="Unofficial API"
			title="The vendor does not publish or support this API. It can change or stop working without notice, and Scanopy tracks it on a best-effort basis."
			className="ml-2"
		/>
	);
}

/**
 * The credential types that reach one integration: how each connects, where it
 * can be pointed, and the daemon version it needs.
 *
 * Daemon floors are per-transport on purpose — SNMP v2c reaches a 0.16.2 daemon
 * while v1/v3 need 0.17.0 — so this table is the only honest place to state them.
 */
export function IntegrationTransports({ id }: { id: string }) {
	const integration = getIntegration(id);

	return (
		<div className="overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th>Credential type</th>
						<th>How it connects</th>
						<th>Can be targeted at</th>
						<th>Requires daemon</th>
					</tr>
				</thead>
				<tbody>
					{integration.transports.map((transport) => (
						<tr key={transport.id}>
							<td className="whitespace-nowrap">
								<strong>{transport.display_name}</strong>
								<StabilityTag stability={transport.stability} />
								<UnofficialApiTag upstreamSupport={transport.upstream_support} />
							</td>
							<td>{transport.description}</td>
							<td>
								<CredentialScopes targets={transport.targets} />
							</td>
							<td className="whitespace-nowrap">
								<code>{transport.minimum_daemon_version}</code> or later
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function oxford(items: string[]) {
	if (items.length < 3) return items.join(' and ');
	return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * Beta notice, rendered only when the fixture says at least one of this
 * integration's transports is Beta — so promoting an integration in the Scanopy
 * repo removes this notice from the guide on the next fixture sync, and shipping
 * a new Beta integration cannot forget to add one.
 *
 * Names the specific credential types when only some are Beta. Pass children for
 * anything integration-specific about what is or isn't validated yet; the generic
 * "fields may change" framing is here so every guide words it identically.
 */
export function IntegrationBeta({ id, children }: { id: string; children?: ReactNode }) {
	const integration = getIntegration(id);
	const beta = integration.transports.filter((t) => t.stability === 'Beta');
	if (beta.length === 0) return null;

	const whole = beta.length === integration.transports.length;

	return (
		<Callout type="warn" title="Beta">
			<p>
				{whole
					? `The ${integration.name} integration is in beta.`
					: `The ${oxford(beta.map((t) => t.display_name))} credential ${
							beta.length > 1 ? 'types are' : 'type is'
						} in beta.`}{' '}
				Data collection may be incomplete and the credential fields may change in a future release.
				Please{' '}
				<a href="https://github.com/scanopy/scanopy/issues/new">report anything that looks wrong</a>
				.
			</p>
			{children}
		</Callout>
	);
}

/**
 * Unofficial-API notice, rendered when the fixture marks at least one of this integration's
 * transports `upstream_support: Undocumented`.
 *
 * The copy defines what an unofficial API is and what follows from it, and stops there. It makes
 * no claim about any vendor's API programme — whether one is published, and why Scanopy uses this
 * interface instead, are per-vendor facts a shared component cannot know. An earlier version
 * asserted that UniFi "has no published API", which is untrue.
 *
 * Deliberately separate from {@link IntegrationBeta}: beta is about how far *we* have validated an
 * integration and disappears when it is promoted, while an unofficial interface is a standing
 * property of the integration. An integration can show both notices, one, or neither — UniFi is
 * stable and unofficial, Instant On is currently both.
 */
export function IntegrationUnofficialApi({ id, children }: { id: string; children?: ReactNode }) {
	const integration = getIntegration(id);
	const undocumented = integration.transports.filter((t) => t.upstream_support === 'Undocumented');
	if (undocumented.length === 0) return null;

	const whole = undocumented.length === integration.transports.length;

	return (
		<Callout type="info" title="Unofficial API">
			<p>
				{whole
					? `The ${integration.name} integration uses an unofficial API.`
					: `The ${oxford(undocumented.map((t) => t.display_name))} credential ${
							undocumented.length > 1 ? 'types use' : 'type uses'
						} an unofficial API.`}{' '}
				An unofficial API is one that isn&apos;t documented for use outside the vendor&apos;s own
				application — Scanopy reads it the same way that application does. It can change at any
				time, so Scanopy follows it on a best-effort basis and this integration can stop returning
				data until a release catches up. Nothing here modifies your devices — it only reads.
			</p>
			{children}
		</Callout>
	);
}

/**
 * The standard "this part isn't integration-specific" block every integration
 * guide opens with.
 *
 * Creating, assigning and overriding a credential works identically for SNMP,
 * Docker, Podman and UniFi, so the steps live once in the Credentials concept
 * page and each guide links to them from here rather than restating them. What
 * *is* integration-specific — where this credential can be pointed — comes from
 * the fixture, so it stays right as targets change.
 */
export function CredentialBasics({ id }: { id: string }) {
	const integration = getIntegration(id);
	const targets = [...new Set(integration.transports.flatMap((t) => t.targets))];

	return (
		<Callout type="info" title="Before you start">
			<p>
				{integration.name} credentials are created under <strong>Assets &gt; Credentials</strong>{' '}
				and can be pointed at <CredentialScopes targets={targets} />.
			</p>
			<p>
				Creating a credential, assigning it, and overriding it on an individual host work the same
				way for every integration — see{' '}
				<Link href="/using-scanopy/credentials/#creating-a-credential">Creating a credential</Link>,{' '}
				<Link href="/using-scanopy/credentials/#where-a-credential-applies">
					Where a credential applies
				</Link>
				, and <Link href="/using-scanopy/credentials/#auto-assignment">Auto-assignment</Link>. This
				guide covers only what is specific to {integration.name}.
			</p>
		</Callout>
	);
}

/**
 * What you fill in when creating a credential, generated from the same field
 * definitions the app builds its form from — so a documented default or help
 * string cannot drift from the product.
 *
 * Pass `transport` to scope it to one credential type, which is what a guide
 * wants when each transport has its own prose section. Without it, every
 * transport is rendered with a label above its table. Those labels are plain
 * text rather than headings on purpose: a heading rendered from a component
 * never reaches the page's table of contents, so the MDX author writes the real
 * headings.
 */
export function IntegrationFields({ id, transport }: { id: string; transport?: string }) {
	const transports = getTransports(id, transport);
	const labelled = transports.length > 1;

	return (
		<>
			{transports.map((t) => (
				<div key={t.id}>
					{labelled && (
						<p>
							<strong>{t.display_name}</strong>
							<StabilityTag stability={t.stability} />
							<UnofficialApiTag upstreamSupport={t.upstream_support} />
						</p>
					)}
					<FieldsTable fields={t.fields} />
				</div>
			))}
		</>
	);
}
