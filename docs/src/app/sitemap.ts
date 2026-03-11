import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-static';

const baseUrl = 'https://scanopy.net/docs';
const contentDir = path.resolve(process.cwd(), 'content/docs');

function getLastModified(slugs: string[]): Date | undefined {
  // Try index.mdx inside slug directory, then slug.mdx as a file
  const candidates = slugs.length === 0
    ? [path.join(contentDir, 'index.mdx')]
    : [
        path.join(contentDir, ...slugs, 'index.mdx'),
        path.join(contentDir, ...slugs) + '.mdx',
      ];

  for (const candidate of candidates) {
    try {
      const stat = fs.statSync(candidate);
      return stat.mtime;
    } catch {
      // try next candidate
    }
  }
  return undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  return pages.map((page) => ({
    url: page.slugs.length === 0
      ? `${baseUrl}/`
      : `${baseUrl}/${page.slugs.join('/')}/`,
    lastModified: getLastModified(page.slugs),
  }));
}
