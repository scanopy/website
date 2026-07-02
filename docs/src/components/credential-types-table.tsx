import integrations from '$lib/fixtures/integrations.json';

interface Transport {
  id: string;
  name: string;
  description: string;
  targets: string[];
}

interface Integration {
  id: string;
  name: string;
  category: string;
  discovers: string;
  transports: Transport[];
}

// Fixture target keys → the label + tag color used in the Scanopy app
// (see getTargetTagProps in ui/src/lib/features/credentials/types/base.ts:
// Network → Cyan, DaemonHost → Blue, Hosts → Purple). Full literal class
// strings so Tailwind picks them up.
const TARGET_TAGS: Record<string, { label: string; className: string }> = {
  Network: {
    label: 'Network',
    className: 'bg-cyan-200 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400',
  },
  DaemonHost: {
    label: 'Daemon host',
    className: 'bg-blue-200 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  },
  Hosts: {
    label: 'Remote hosts',
    className: 'bg-purple-200 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
  },
};

// Broad → narrow, so every row lists targets in the same order.
const TARGET_ORDER = ['Network', 'DaemonHost', 'Hosts'];

function TargetTags({ targets }: { targets: string[] }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {TARGET_ORDER.filter((t) => targets.includes(t)).map((t) => {
        const tag = TARGET_TAGS[t] ?? { label: t, className: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' };
        return (
          <span
            key={t}
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${tag.className}`}
          >
            {tag.label}
          </span>
        );
      })}
    </span>
  );
}

export function CredentialTypesTable() {
  const data = integrations as Integration[];

  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Integration</th>
            <th>Credential type</th>
            <th>What it discovers</th>
            <th>Can be targeted at</th>
          </tr>
        </thead>
        <tbody>
          {data.flatMap((integration) =>
            integration.transports.map((transport, i) => (
              <tr key={transport.id}>
                {i === 0 && (
                  <td rowSpan={integration.transports.length}>
                    <strong>{integration.name}</strong>
                  </td>
                )}
                <td>{`${integration.name} ${transport.name}`}</td>
                {i === 0 && (
                  <td rowSpan={integration.transports.length}>{integration.discovers}</td>
                )}
                <td>
                  <TargetTags targets={transport.targets} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
