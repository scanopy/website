import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { MarkdownDescription } from '@/components/markdown-description';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

export default async function Page(props: PageProps<'/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <MarkdownDescription>{page.data.description}</MarkdownDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const canonical = page.slugs.length === 0
    ? '/'
    : `/${page.slugs.join('/')}/`;

  // Noindex individual API endpoint pages (e.g. api/bindings/list_bindings)
  // but keep resource-level pages indexed (e.g. api/ and api/bindings/)
  const isApiEndpoint = page.slugs[0] === 'api' && page.slugs.length >= 3;

  return {
    title: page.data.title,
    description: page.data.description,
    ...(isApiEndpoint && { robots: 'noindex, follow' }),
    alternates: {
      canonical,
    },
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
