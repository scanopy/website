'use client';

import entityMetadata from '@/lib/fixtures/entity-metadata.json';

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
  'Metadata',
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
            <h3 className="text-lg font-semibold mb-3">{category}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 pr-4 font-medium text-gray-300">Table</th>
                    <th className="text-left py-2 font-medium text-gray-300">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity) => (
                    <tr key={entity.id} className="border-b border-gray-800">
                      <td className="py-2 pr-4">
                        <code className="text-blue-400">{entity.table_name}</code>
                      </td>
                      <td className="py-2 text-gray-300">
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
