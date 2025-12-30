import daemonConfig from '$lib/fixtures/daemon-config.json';

interface DaemonConfigField {
  id: string;
  label: string;
  cliFlag: string;
  envVar: string;
  configFileKey: string;
  default: string | null;
  description: string;
  docsOnly: boolean;
}

export function DaemonConfigTable() {
  const fields = daemonConfig as DaemonConfigField[];

  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>CLI Flag</th>
            <th>Environment Variable</th>
            <th>Config File Key</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td>
                <strong>{field.label}</strong>
              </td>
              <td>
                <code>{field.cliFlag}</code>
              </td>
              <td>
                <code>{field.envVar}</code>
              </td>
              <td>
                <code>{field.configFileKey}</code>
              </td>
              <td>
                {field.default ? (
                  field.default.startsWith('_') ? (
                    <em>{field.default.replace(/_/g, '')}</em>
                  ) : (
                    <code>{field.default}</code>
                  )
                ) : (
                  <em>None</em>
                )}
              </td>
              <td>{field.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
