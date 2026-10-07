import snmp from '$lib/fixtures/snmp.json';

/**
 * The SNMP reference, generated from the daemon's own constants
 * (`backend/src/daemon/discovery/integration/snmp/catalog.rs` in scanopy). A
 * test there fails if the walker requests an object this list lacks, or the
 * list names one the walker never requests.
 */
interface SnmpObject {
	name: string;
	oid: string;
	request: 'get' | 'walk';
}

interface SnmpMib {
	name: string;
	standard: string;
	objects: SnmpObject[];
}

interface SnmpLimit {
	name: string;
	value: string;
	description: string;
}

interface SnmpReference {
	versions: string[];
	v3_auth_protocols: string[];
	v3_privacy_protocols: string[];
	ports: number[];
	limits: SnmpLimit[];
	mibs: SnmpMib[];
}

const reference = snmp as SnmpReference;

/** Versions, SNMPv3 protocols and ports. */
export function SnmpProtocolTable() {
	return (
		<div className="overflow-x-auto">
			<table>
				<tbody>
					<tr>
						<th>Versions</th>
						<td>{reference.versions.join(', ')}</td>
					</tr>
					<tr>
						<th>SNMPv3 authentication</th>
						<td>{reference.v3_auth_protocols.join(', ')}</td>
					</tr>
					<tr>
						<th>SNMPv3 privacy</th>
						<td>{reference.v3_privacy_protocols.join(', ')}</td>
					</tr>
					<tr>
						<th>Ports (UDP, in the order tried)</th>
						<td>{reference.ports.join(', ')}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

/** Every MIB object the daemon requests, grouped by MIB. */
export function SnmpMibsTable() {
	return (
		<div className="overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th>MIB</th>
						<th>Object</th>
						<th>OID</th>
						<th>Read by</th>
					</tr>
				</thead>
				<tbody>
					{reference.mibs.flatMap((mib) =>
						mib.objects.map((object, i) => (
							<tr key={`${mib.name}-${object.name}`}>
								{i === 0 ? (
									<td rowSpan={mib.objects.length} className="whitespace-nowrap align-top">
										<strong>{mib.name}</strong>
										<br />
										{mib.standard}
									</td>
								) : null}
								<td>{object.name}</td>
								<td>
									<code>{object.oid}</code>
								</td>
								<td>{object.request === 'get' ? 'GET' : 'Walk'}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

/** Timeouts and limits an SNMP run is held to. */
export function SnmpLimitsTable() {
	return (
		<div className="overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th>Limit</th>
						<th>Value</th>
						<th>Applies to</th>
					</tr>
				</thead>
				<tbody>
					{reference.limits.map((limit) => (
						<tr key={limit.name}>
							<td className="whitespace-nowrap">
								<strong>{limit.name}</strong>
							</td>
							<td>
								{/^\d+$/.test(limit.value)
									? Number(limit.value).toLocaleString('en-US')
									: limit.value}
							</td>
							<td>{limit.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
