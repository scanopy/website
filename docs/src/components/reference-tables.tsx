import elementRuleTypes from '$lib/fixtures/element-rule-types.json';
import permissions from '$lib/fixtures/permissions.json';
import scanSettings from '$lib/fixtures/scan-settings.json';
import views from '$lib/fixtures/views.json';
import { FieldsTable } from '@/components/field-table';
import type { FieldDefinition } from '@/lib/integrations';

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
