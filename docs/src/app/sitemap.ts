import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';

const baseUrl = 'https://scanopy.net/docs';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  return pages.map((page) => ({
    url: `${baseUrl}/${page.slugs.join('/')}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: page.slugs.length === 0 ? 1.0 : page.slugs[0] === 'api' ? 0.5 : 0.8,
  }));
}
