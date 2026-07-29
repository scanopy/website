import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { APIPage } from '@/components/api-page';
import { CredentialTypesTable } from '@/components/credential-types-table';
import { DaemonConfigTable } from '@/components/daemon-config-table';
import { EntityCoreTables } from '@/components/entity-core-tables';
import {
	CredentialBasics,
	IntegrationBeta,
	IntegrationFields,
	IntegrationTransports
} from '@/components/integration-tables';
import { Mermaid } from '@/components/mermaid';
import { SchemaERDiagram, SchemaFullDiagram } from '@/components/schema-diagrams';
import { SectionCards } from '@/components/section-cards';
import { StatusTag } from '@/components/status-tag';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		APIPage,
		CredentialBasics,
		CredentialTypesTable,
		DaemonConfigTable,
		EntityCoreTables,
		IntegrationBeta,
		IntegrationFields,
		IntegrationTransports,
		Mermaid,
		SchemaERDiagram,
		SchemaFullDiagram,
		SectionCards,
		StatusTag,
		...components
	};
}
