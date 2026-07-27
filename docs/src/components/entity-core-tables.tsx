'use client';

import entityMetadata from '$lib/fixtures/entity-metadata.json';

interface EntityMetadataEntry {
	id: string;
	name_singular: string;
	name_plural: string;
	description: string;
	category: string;
	category_display: string;
	table_name: string;
}

const categoryOrder = [
	'Organizations & Users',
	'Network Infrastructure',
	'Discovery & Daemons',
	'Visualization',
	'Metadata'
];

export function EntityCoreTables() {
	const metadata = entityMetadata as EntityMetadataEntry[];

	// Group entities by category_display
	const byCategory: Record<string, EntityMetadataEntry[]> = {};
	for (const entity of metadata) {
		const cat = entity.category_display;
		if (!byCategory[cat]) byCategory[cat] = [];
		byCategory[cat].push(entity);
	}

	return (
		<>
			{categoryOrder.map((category) => {
				const entities = byCategory[category];
				if (!entities || entities.length === 0) return null;

				return (
					<div key={category} className="mb-8">
						<h3 className="mb-3 text-lg font-semibold">{category}</h3>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="border-fd-border border-b">
										<th className="text-fd-muted-foreground py-2 pr-4 text-left font-medium">
											Table
										</th>
										<th className="text-fd-muted-foreground py-2 text-left font-medium">Purpose</th>
									</tr>
								</thead>
								<tbody>
									{entities.map((entity) => (
										<tr key={entity.id} className="border-fd-border border-b">
											<td className="py-2 pr-4">
												<code className="text-fd-primary">{entity.table_name}</code>
											</td>
											<td className="text-fd-foreground py-2">
												{entity.description.split('.')[0]}.
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				);
			})}
		</>
	);
}
