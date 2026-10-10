import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { APIPage } from '@/components/api-page';
import { CredentialScope, CredentialScopes } from '@/components/credential-scopes';
import { CredentialTypesTable } from '@/components/credential-types-table';
import { DaemonConfigTable } from '@/components/daemon-config-table';
import { EntityCoreTables } from '@/components/entity-core-tables';
import {
	CredentialBasics,
	IntegrationBeta,
	IntegrationFields,
	IntegrationUnofficialApi,
	IntegrationTransports
} from '@/components/integration-tables';
import { Mermaid } from '@/components/mermaid';
import {
	ContainerRulesTable,
	DiscoverySources,
	ElementRulesTable,
	IntegrationGuideLinks,
	IntegrationsReporting,
	RolesTable,
	ScanSettingsTable,
	ScanWarningsTable,
	SshScriptFieldsTable,
	VirtualizationRelationships
} from '@/components/reference-tables';
import { SchemaERDiagram, SchemaFullDiagram } from '@/components/schema-diagrams';
import { Screenshot } from '@/components/screenshot';
import { SectionCards } from '@/components/section-cards';
import { ServerConfigTable } from '@/components/server-config-table';
import { SnmpLimitsTable, SnmpMibsTable, SnmpProtocolTable } from '@/components/snmp-tables';
import { StaleTag, StatusTag } from '@/components/status-tag';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		APIPage,
		CredentialBasics,
		CredentialScope,
		CredentialScopes,
		ContainerRulesTable,
		CredentialTypesTable,
		DaemonConfigTable,
		DiscoverySources,
		ElementRulesTable,
		EntityCoreTables,
		IntegrationBeta,
		IntegrationFields,
		IntegrationUnofficialApi,
		IntegrationGuideLinks,
		IntegrationsReporting,
		IntegrationTransports,
		Mermaid,
		RolesTable,
		ScanSettingsTable,
		ScanWarningsTable,
		SchemaERDiagram,
		SchemaFullDiagram,
		Screenshot,
		SectionCards,
		ServerConfigTable,
		SnmpLimitsTable,
		SnmpMibsTable,
		SnmpProtocolTable,
		SshScriptFieldsTable,
		StaleTag,
		StatusTag,
		VirtualizationRelationships,
		...components
	};
}
