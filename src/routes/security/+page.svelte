<script lang="ts">
	import LegalPage from '$lib/components/LegalPage.svelte';
</script>

<LegalPage
	title="Security"
	description="How Scanopy handles your data: the two deployment models, what the daemon collects, credential handling, authentication, subprocessors, and how to report a vulnerability."
	slug="security"
	date="July 10, 2026"
	dateType="updated"
>
	<p class="mb-4 text-gray-300">
		This page describes how Scanopy handles data, what the scanning daemon does and does not
		collect, how credentials are stored, and the controls around the service. It is written for
		security and procurement reviews. If something here is unclear or you need it in a questionnaire
		format, email
		<a href="mailto:security@scanopy.net" class="text-blue-400 hover:text-blue-300"
			>security@scanopy.net</a
		>.
	</p>

	<section>
		<h2 class="mb-4 text-2xl font-semibold text-rose-400">
			1. Two deployment models, two data paths
		</h2>
		<p class="mb-4 text-gray-300">
			Scanopy runs in one of two ways, and the difference determines where your network data lives.
		</p>

		<h3 class="mb-3 text-xl font-semibold text-white">Self-hosted</h3>
		<p class="mb-4 text-gray-300">
			You run the full Scanopy stack (server, database, and daemon) inside your own infrastructure.
			Discovery data is stored in your database and is not transmitted to Scanopy. Self-hosted is
			available as the free, open-source
			<a href="/community" class="text-blue-400 hover:text-blue-300">Community Edition</a>
			and as the paid
			<a href="/commercial" class="text-blue-400 hover:text-blue-300">Commercial Edition</a>.
		</p>

		<h3 class="mb-3 text-xl font-semibold text-white">Scanopy Cloud</h3>
		<p class="mb-4 text-gray-300">
			You run only the lightweight daemon on your network. It connects to Scanopy's hosted server,
			which stores your topology and account data. The daemon transmits the discovery results
			described in section 2 (host and network metadata). All daemon-to-server and client-to-server
			communication uses HTTPS/TLS, with certificate validation enabled by default.
		</p>
		<p class="mb-4 text-gray-300">
			Scanopy Cloud is hosted in the United States. The application server runs on Hetzner compute,
			and the database that holds your topology and account data is a managed Neon Postgres
			instance, both in the United States. A Data Processing Agreement for Scanopy Cloud is
			available on request (see section 6).
		</p>

		<h3 class="mb-3 text-xl font-semibold text-white">How the daemon connects</h3>
		<p class="mb-4 text-gray-300">
			The daemon connects in one of two modes. In DaemonPoll mode (the default) the daemon initiates
			all connections and polls the server, so it needs no inbound ports open to it, which suits
			daemons behind NAT or a firewall. In ServerPoll mode the server initiates connections to the
			daemon, for DMZ deployments where the daemon cannot make outbound connections. Both use
			HTTPS/TLS. For operational detail, see the
			<a href="/docs/reference/architecture/" class="text-blue-400 hover:text-blue-300"
				>architecture reference</a
			>
			and
			<a
				href="/docs/setting-up-daemons/planning-daemon-deployment/"
				class="text-blue-400 hover:text-blue-300">daemon deployment planning</a
			>.
		</p>
	</section>

	<section>
		<h2 class="mb-4 text-2xl font-semibold text-rose-400">
			2. What the daemon collects, and what it does not
		</h2>
		<p class="mb-4 text-gray-300">
			The daemon scans the networks you configure and records inventory and topology data:
		</p>
		<ul class="mb-4 list-inside list-disc space-y-1 text-gray-300">
			<li>
				<strong class="text-white">Hosts:</strong> IP addresses, MAC addresses, hostnames, and vendor
				identification.
			</li>
			<li>
				<strong class="text-white">Services:</strong> open ports and the service types detected on them.
			</li>
			<li>
				<strong class="text-white">Interfaces:</strong> port numbers, speeds, interface types, and admin/operational
				status (via SNMP).
			</li>
			<li>
				<strong class="text-white">Topology:</strong> physical and logical links between devices, derived
				from LLDP, CDP, ARP tables, and MAC forwarding tables.
			</li>
			<li>
				<strong class="text-white">SNMP device details:</strong> system descriptions, uptime, location,
				serial numbers, and hardware models.
			</li>
			<li>
				<strong class="text-white">Docker and Podman containers:</strong> images, ports, networks, and
				labels, when the daemon is given socket access.
			</li>
		</ul>
		<p class="mb-4 text-gray-300">What the daemon does not do:</p>
		<ul class="mb-4 list-inside list-disc space-y-1 text-gray-300">
			<li>
				<strong class="text-white">No packet-payload capture.</strong> Scanopy discovers devices and
				services; it does not capture, inspect, or store the contents of network traffic. It is a documentation
				tool, not a traffic-analysis or monitoring tool.
			</li>
			<li>
				<strong class="text-white">No credential exfiltration.</strong> The credentials you give the
				daemon to query devices are used to query those devices. See section 3 for how they are stored.
			</li>
		</ul>
	</section>

	<section>
		<h2 class="mb-4 text-2xl font-semibold text-rose-400">3. Credential handling</h2>
		<p class="mb-4 text-gray-300">
			To read from SNMP devices, Docker sockets, and similar sources, the daemon needs credentials.
			You control how those are stored, and there are two options:
		</p>
		<ul class="mb-4 list-inside list-disc space-y-2 text-gray-300">
			<li>
				<strong class="text-white">File-backed on the daemon host.</strong> A credential can be a reference
				to a file on the machine running the daemon. The secret is read from that file at scan time and
				is never sent to or stored on the Scanopy server. The secret stays where you put it.
			</li>
			<li>
				<strong class="text-white">Stored with Scanopy.</strong> Alternatively, a credential can be saved
				through Scanopy so you do not have to manage files on each host. On Scanopy Cloud, those secrets
				are held in the hosted database; on self-hosted, they are held in your own database.
			</li>
		</ul>
		<p class="mb-4 text-gray-300">
			For SNMPv3, the privacy (encryption) layer uses AES-128 or AES-256, so device queries are
			encrypted on the wire when the device supports it.
		</p>
	</section>

	<section>
		<h2 class="mb-4 text-2xl font-semibold text-rose-400">
			4. Access, authentication, and isolation
		</h2>

		<h3 class="mb-3 text-xl font-semibold text-white">Authentication</h3>
		<p class="mb-4 text-gray-300">
			Scanopy supports email and password with email verification, and single sign-on via OpenID
			Connect (OIDC). On Scanopy Cloud, Google and Microsoft identity providers are available. On
			self-hosted and enterprise-managed deployments, any OIDC-compliant provider can be configured,
			including Authentik, Keycloak, Auth0, and Okta. Bring-your-own OIDC (Custom SSO) and SAML are
			part of the Enterprise and Commercial self-hosted feature set; see <a
				href="/pricing"
				class="text-blue-400 hover:text-blue-300">pricing</a
			> for how they are tiered. Anyone can create a Scanopy Cloud account, which creates a new organization.
			On self-hosted, the free Community edition is limited to a single organization, so the first account
			becomes its owner and further accounts join by invitation; paid editions raise or remove that limit.
			Joining an existing organization requires an invitation from an organization administrator.
		</p>

		<h3 class="mb-3 text-xl font-semibold text-white">Tenant isolation</h3>
		<p class="mb-4 text-gray-300">
			The organization is the top-level tenant boundary. Within an organization, each network holds
			its own hosts, services, subnets, and topology, and users can be restricted to specific
			networks. Every API query is scoped to the authenticated user's organization and permitted
			networks. This is logical multi-tenancy with application-enforced boundaries.
		</p>

		<h3 class="mb-3 text-xl font-semibold text-white">Least privilege</h3>
		<p class="mb-4 text-gray-300">
			The daemon needs elevated permissions on its host to send raw packets for scanning (root or
			the CAP_NET_RAW capability on Linux, administrator on macOS and Windows, and optional Docker
			socket access for container discovery). The server itself runs as a standard, unprivileged
			user process.
		</p>

		<h3 class="mb-3 text-xl font-semibold text-white">Logging</h3>
		<p class="mb-4 text-gray-300">
			Authentication and access activity is recorded in Scanopy's application logs, including
			sign-in successes and failures, sign-outs, registrations, password and email changes, SSO link
			and unlink events, and API key authentication failures and key rotation.
		</p>

		<h3 class="mb-3 text-xl font-semibold text-white">Reporting a vulnerability</h3>
		<p class="mb-4 text-gray-300">
			Report suspected vulnerabilities to
			<a href="mailto:security@scanopy.net" class="text-blue-400 hover:text-blue-300"
				>security@scanopy.net</a
			>
			or through
			<a
				href="https://github.com/scanopy/scanopy/security/advisories/new"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-400 hover:text-blue-300">GitHub Security Advisories</a
			>. Our policy is published at
			<a
				href="/.well-known/security.txt"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-400 hover:text-blue-300">/.well-known/security.txt</a
			>. Please give us a chance to address an issue before disclosing it publicly.
		</p>
	</section>

	<section>
		<h2 class="mb-4 text-2xl font-semibold text-rose-400">5. Certifications</h2>
		<p class="mb-4 text-gray-300">
			Scanopy does not currently hold a formal certification such as SOC 2 or ISO 27001.
		</p>
	</section>

	<section>
		<h2 class="mb-4 text-2xl font-semibold text-rose-400">6. Data Processing Agreement</h2>
		<p class="mb-4 text-gray-300">
			For Scanopy Cloud, our
			<a href="/dpa" class="text-blue-400 hover:text-blue-300">Data Processing Addendum</a>
			is published and forms part of the Terms of Service. If you need a countersigned copy, email
			<a href="mailto:legal@scanopy.net" class="text-blue-400 hover:text-blue-300"
				>legal@scanopy.net</a
			>.
		</p>
	</section>

	<section>
		<h2 class="mb-4 text-2xl font-semibold text-rose-400">7. Subprocessors (Scanopy Cloud)</h2>
		<p class="mb-4 text-gray-300">
			Scanopy Cloud relies on the following subprocessors. Self-hosted deployments use none of them
			for your network data.
		</p>
		<ul class="mb-4 list-inside list-disc space-y-2 text-gray-300">
			<li>
				<strong class="text-white">Hetzner</strong> (United States): application server and compute hosting.
			</li>
			<li>
				<strong class="text-white">Neon</strong> (United States): managed Postgres database that stores
				your topology and account data.
			</li>
			<li><strong class="text-white">Stripe:</strong> payment processing.</li>
			<li><strong class="text-white">Brevo:</strong> transactional and marketing email.</li>
			<li>
				<strong class="text-white">PostHog:</strong> product analytics.
			</li>
		</ul>
		<p class="text-gray-300">
			See the
			<a href="/privacy" class="text-blue-400 hover:text-blue-300">Privacy Policy</a> for each vendor's
			role in more detail.
		</p>
	</section>
</LegalPage>
