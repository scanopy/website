import { Tag } from '@/components/tag';
import type { FieldDefinition } from '@/lib/integrations';

/**
 * Renders a set of `FieldDefinition`s as a table.
 *
 * Shared because two fixtures emit this same shape: a credential type's fields
 * (`integrations.json`) and a discovery's scan settings (`scan-settings.json`).
 * Both come from the metadata the app builds its own forms from, so a documented
 * label, default or help string cannot drift from the product.
 */

function fieldDescription(field: FieldDefinition) {
	if (!field.options?.length) return field.help_text ?? null;
	const choices = field.options.map((o) => o.label).join(', ');
	return [field.help_text, `One of: ${choices}.`].filter(Boolean).join(' ');
}

/**
 * A select field's `default_value` is the wire value (`Sha256`), which is not what
 * the form shows or what a reader should type. Resolve it through the field's own
 * options to the display label (`SHA-256`), falling back to the raw value for
 * fields that have no options.
 */
function defaultLabel(field: FieldDefinition) {
	if (field.default_value === undefined || field.default_value === '') return null;
	const match = field.options?.find((o) => o.value === field.default_value);
	return match?.label ?? field.default_value;
}

export function FieldsTable({
	fields,
	label = 'Field'
}: {
	fields: FieldDefinition[];
	/** Header for the first column — "Field" for credentials, "Setting" for scan settings. */
	label?: string;
}) {
	// Group headers only earn their row when there is more than one group to tell
	// apart — a lone "Connection" banner is noise.
	const groups = [...new Set(fields.map((f) => f.group ?? ''))];
	const showGroups = groups.filter(Boolean).length > 1;

	return (
		<div className="overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th>{label}</th>
						<th>Required</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{groups.flatMap((group) => {
						const rows = fields.filter((f) => (f.group ?? '') === group);
						const header =
							showGroups && group ? (
								<tr key={`group-${group}`}>
									<td colSpan={4} className="text-fd-muted-foreground text-sm font-semibold">
										{group}
									</td>
								</tr>
							) : null;

						return [
							header,
							...rows.map((field) => (
								<tr key={field.id}>
									<td className="whitespace-nowrap">
										<strong>{field.label}</strong>
										{field.secret && <Tag label="Secret" className="ml-2" />}
									</td>
									<td>{field.optional ? 'Optional' : 'Required'}</td>
									<td>
										{defaultLabel(field) ? <code>{defaultLabel(field)}</code> : <em>None</em>}
									</td>
									<td>{fieldDescription(field)}</td>
								</tr>
							))
						];
					})}
				</tbody>
			</table>
		</div>
	);
}
