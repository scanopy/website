import serverConfig from '$lib/fixtures/server-config.json';

/**
 * Every server setting, generated from the server's own CLI definition and
 * `ServerConfig::default()` (`backend/src/server/config.rs` in scanopy).
 */
interface ServerConfigField {
	id: string;
	cli_flag: string | null;
	env_var: string;
	default: string | null;
	description: string;
}

export function ServerConfigTable() {
	const fields = serverConfig as ServerConfigField[];

	return (
		<div className="overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th>Environment Variable</th>
						<th>CLI Flag</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{fields.map((field) => (
						<tr key={field.id}>
							<td>
								<code>{field.env_var}</code>
							</td>
							<td>{field.cli_flag ? <code>{field.cli_flag}</code> : <em>None</em>}</td>
							<td>{field.default ? <code>{field.default}</code> : <em>None</em>}</td>
							<td>{field.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
