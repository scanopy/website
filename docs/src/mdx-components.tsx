import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { APIPage } from '@/components/api-page';
import { DaemonConfigTable } from '@/components/daemon-config-table';
import { EntityCoreTables } from '@/components/entity-core-tables';
import { Mermaid } from '@/components/mermaid';
import { SchemaERDiagram, SchemaFullDiagram } from '@/components/schema-diagrams';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage,
    DaemonConfigTable,
    EntityCoreTables,
    Mermaid,
    SchemaERDiagram,
    SchemaFullDiagram,
    ...components,
  };
}
