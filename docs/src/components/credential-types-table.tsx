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

// Fixture target keys → the labels users see in the app.
const TARGET_LABELS: Record<string, string> = {
  Network: 'Network',
  DaemonHost: 'Daemon host',
  Hosts: 'Remote hosts',
};

// Broad → narrow, so every row lists targets in the same order.
const TARGET_ORDER = ['Network', 'DaemonHost', 'Hosts'];

function formatTargets(targets: string[]): string {
  return TARGET_ORDER.filter((t) => targets.includes(t))
    .map((t) => TARGET_LABELS[t] ?? t)
    .join(', ');
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
                <td>{formatTargets(transport.targets)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
