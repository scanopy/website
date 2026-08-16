import { Callout } from 'fumadocs-ui/components/callout';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { FieldsTable, TAG_BASE } from '@/components/field-table';
import { getIntegration, getTransports } from '@/lib/integrations';

// Fixture target keys → the label + tag color used in the Scanopy app
// (see getTargetTagProps in ui/src/lib/features/credentials/types/base.ts:
// Network → Cyan, DaemonHost → Blue, Hosts → Purple). Full literal class
// strings so Tailwind picks them up.
const TARGET_TAGS: Record<string, { label: string; className: string }> = {
	Network: {
		label: 'Network',
		className: 'bg-cyan-200 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400'
	},
	DaemonHost: {
		label: 'Daemon host',
		className: 'bg-blue-200 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
	},
	Hosts: {
		label: 'Remote hosts',
		className: 'bg-purple-200 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
	}
};

// Broad → narrow, so every row lists targets in the same order.
const TARGET_ORDER = ['Network', 'DaemonHost', 'Hosts'];

export function TargetTags({ targets }: { targets: string[] }) {
	return (
		<span className="inline-flex flex-wrap gap-1">
			{TARGET_ORDER.filter((t) => targets.includes(t)).map((t) => {
				const tag = TARGET_TAGS[t] ?? {
					label: t,
					className: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
				};
				return (
					<span key={t} className={`${TAG_BASE} ${tag.className}`}>
						{tag.label}
					</span>
				);
			})}
		</span>
	);
}

/**
 * Renders only for Beta. Stable is the norm, and tagging every stable row would
 * make the exception harder to spot rather than easier.
 */
export function StabilityTag({ stability }: { stability: string }) {
	if (stability !== 'Beta') return null;
	return (
		<span
			className={`${TAG_BASE} ml-2 bg-amber-200 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400`}
		>
			Beta
		</span>
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
							</td>
							<td>{transport.description}</td>
							<td>
								<TargetTags targets={transport.targets} />
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
 * Unofficial-API notice, rendered only when the fixture says at least one of this integration's
 * transports talks to an API its vendor does not publish.
 *
 * Deliberately separate from {@link IntegrationBeta}: beta is about how far *we* have validated an
 * integration and disappears when it is promoted, while an undocumented upstream is a standing
 * property of the vendor's API. An integration can show both notices, one, or neither — UniFi is
 * stable and undocumented, Instant On is currently both.
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
					? `${integration.name} has no published API.`
					: `The ${oxford(undocumented.map((t) => t.display_name))} credential ${
							undocumented.length > 1 ? 'types use' : 'type uses'
						} an API the vendor does not publish.`}{' '}
				Scanopy reads the same endpoints the vendor&apos;s own application uses. They are
				unsupported and can change or stop working without notice, so Scanopy tracks them on a
				best-effort basis. Nothing here modifies your devices — it only reads.
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
				and can be pointed at <TargetTags targets={targets} />.
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
						</p>
					)}
					<FieldsTable fields={t.fields} />
				</div>
			))}
		</>
	);
}
