import { CredentialScopes } from '@/components/credential-scopes';
import { StabilityTag, UnofficialApiTag } from '@/components/integration-tables';
import { allIntegrations } from '@/lib/integrations';

/**
 * Every credential type across every integration — the cross-integration overview
 * for the Credentials concept page. A single integration's own guide uses
 * `IntegrationTransports` instead, which adds the per-transport daemon floor.
 */
export function CredentialTypesTable() {
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
					{allIntegrations.flatMap((integration) =>
						integration.transports.map((transport, i) => (
							<tr key={transport.id}>
								{i === 0 && (
									<td rowSpan={integration.transports.length} className="whitespace-nowrap">
										<strong>{integration.name}</strong>
									</td>
								)}
								{/* The fixture's own name for the type. Composing it as
								    `${integration.name} ${transport.name}` used to name a type
								    that does not exist: the service is "UniFi Controller" but
								    the credential is "UniFi API Key". */}
								<td className="whitespace-nowrap">
									{transport.display_name}
									<StabilityTag stability={transport.stability} />
									<UnofficialApiTag upstreamSupport={transport.upstream_support} />
								</td>
								{i === 0 && (
									<td rowSpan={integration.transports.length}>{integration.discovers}</td>
								)}
								<td>
									<CredentialScopes targets={transport.targets} />
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
