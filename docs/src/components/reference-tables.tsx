import elementRuleTypes from '$lib/fixtures/element-rule-types.json';
import permissions from '$lib/fixtures/permissions.json';
import scanSettings from '$lib/fixtures/scan-settings.json';
import views from '$lib/fixtures/views.json';
import Link from 'next/link';
import { FieldsTable } from '@/components/field-table';
import { allIntegrations, type FieldDefinition } from '@/lib/integrations';
import { source } from '@/lib/source';

/**
 * Tables generated from fixtures the Scanopy repo already emits
 * (`backend/src/server/shared/fixtures.rs`) and the release copies across.
 *
 * Each of these replaced a hand-written table, and each hand-written table had
 * drifted: the roles table offered a "Visualizer" role that does not exist, and
 * the grouping-rule table named a rule "Docker Stack" that the app calls "Stack".
 */

interface MetadataEntry {
	id: string;
	name: string;
	description: string | null;
	metadata: Record<string, unknown> | null;
}

/** Perspective id (`L2Physical`) to the name the app shows (`L2 Physical`). */
const VIEW_NAMES: Record<string, string> = Object.fromEntries(
	(views as MetadataEntry[]).map((v) => [v.id, v.name])
);

const ALL_VIEW_IDS = (views as MetadataEntry[]).map((v) => v.id);

/** The roles an organization can assign, and what each one can do. */
export function RolesTable() {
	return (
		<div className="overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th>Role</th>
						<th>Can do</th>
					</tr>
				</thead>
				<tbody>
					{(permissions as MetadataEntry[]).map((role) => (
						<tr key={role.id}>
							<td className="whitespace-nowrap">
								<strong>{role.name}</strong>
							</td>
							<td>{role.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/**
 * Element grouping rules and the perspectives each applies to.
 *
 * A rule available everywhere is shown as "All perspectives" rather than as a
 * list of every name, which is what the hand-written table did and is what a
 * reader wants — but it's derived from the fixture, so a rule that stops being
 * universal starts listing its perspectives on its own.
 */
export function ElementRulesTable() {
	return (
		<div className="overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th>Rule</th>
						<th>What it groups</th>
						<th>Applies to</th>
					</tr>
				</thead>
				<tbody>
					{(elementRuleTypes as MetadataEntry[]).map((rule) => {
						const ruleViews = (rule.metadata?.views as string[] | undefined) ?? [];
						const everywhere = ALL_VIEW_IDS.every((v) => ruleViews.includes(v));
						return (
							<tr key={rule.id}>
								<td className="whitespace-nowrap">
									<strong>{rule.name}</strong>
								</td>
								<td>{rule.description}</td>
								<td>
									{everywhere
										? 'All perspectives'
										: ruleViews.map((v) => VIEW_NAMES[v] ?? v).join(', ')}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

/**
 * Integration id to the URL of the guide documenting it, taken from each guide's
 * `integration` frontmatter rather than a mapping kept here — so an integration
 * whose guide is missing that field is rendered as plain text rather than linked
 * somewhere wrong.
 */
function guideUrls(): Map<string, string> {
	return new Map(
		source
			.getPages()
			.filter((p) => p.data.integration)
			.map((p) => [p.data.integration as string, p.url])
	);
}

/**
 * Every source of data a credential unlocks, grouped by integration category.
 *
 * Replaces a hand-written list ("queries SNMP, discovers Docker and Podman
 * containers, reads controller inventories") that had to be edited for every new
 * integration and was wrong between edits. Categories carry the real distinction —
 * polling a host, reading a container runtime, reading a controller that reports
 * on other devices — so a new integration slots itself in, and a new *category*
 * appears on its own.
 */
export function DiscoverySources() {
	const urls = guideUrls();
	const categories = [...new Set(allIntegrations.map((i) => i.category))];

	return (
		<>
			{categories.map((category) => (
				<div key={category}>
					<p>
						<strong>{category}</strong>
					</p>
					<ul>
						{allIntegrations
							.filter((i) => i.category === category)
							.map((integration) => {
								const url = urls.get(integration.id);
								return (
									<li key={integration.id}>
										{url ? <Link href={url}>{integration.name}</Link> : integration.name} —{' '}
										{integration.discovers}
									</li>
								);
							})}
					</ul>
				</div>
			))}
		</>
	);
}

/**
 * Inline, comma-separated links to every integration guide.
 *
 * For sentences that would otherwise carry a hand-kept list of integration
 * names. Resolved the same way as `DiscoverySources` — from each guide's
 * `integration` frontmatter — so adding an integration extends the sentence and
 * removing one can't leave a dead link behind.
 */
export function IntegrationGuideLinks() {
	const urls = guideUrls();
	const links = allIntegrations
		.map((i) => ({ name: i.name, url: urls.get(i.id) }))
		.filter((l): l is { name: string; url: string } => Boolean(l.url));

	return (
		<>
			{links.map((l, i) => (
				<span key={l.url}>
					{i > 0 && (i === links.length - 1 ? ', and ' : ', ')}
					<Link href={l.url}>{l.name}</Link>
				</span>
			))}
		</>
	);
}

/**
 * Scan settings, grouped by the section of the discovery editor they appear in.
 *
 * The fixture calls that grouping `category` while credential fields call it
 * `group`; the table is otherwise identical, so map the one onto the other and
 * reuse it rather than keeping a second near-copy.
 */
export function ScanSettingsTable() {
	const fields = (scanSettings as (FieldDefinition & { category?: string })[]).map((f) => ({
		...f,
		group: f.category
	}));
	return <FieldsTable fields={fields} label="Setting" />;
}
