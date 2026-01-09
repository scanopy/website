import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { APIPage } from '@/components/api-page';
import { DaemonConfigTable } from '@/components/daemon-config-table';
import { Mermaid } from '@/components/mermaid';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage,
    DaemonConfigTable,
    Mermaid,
    ...components,
  };
}
