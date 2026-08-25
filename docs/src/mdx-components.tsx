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
	DiscoverySources,
	ElementRulesTable,
	IntegrationGuideLinks,
	RolesTable,
	ScanSettingsTable
} from '@/components/reference-tables';
import { SchemaERDiagram, SchemaFullDiagram } from '@/components/schema-diagrams';
import { SectionCards } from '@/components/section-cards';
import { StaleTag, StatusTag } from '@/components/status-tag';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		APIPage,
		CredentialBasics,
		CredentialScope,
		CredentialScopes,
		CredentialTypesTable,
		DaemonConfigTable,
		DiscoverySources,
		ElementRulesTable,
		EntityCoreTables,
		IntegrationBeta,
		IntegrationFields,
		IntegrationUnofficialApi,
		IntegrationGuideLinks,
		IntegrationTransports,
		Mermaid,
		RolesTable,
		ScanSettingsTable,
		SchemaERDiagram,
		SchemaFullDiagram,
		SectionCards,
		StaleTag,
		StatusTag,
		...components
	};
}
