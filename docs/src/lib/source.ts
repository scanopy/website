import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { GET, POST, PUT, PATCH, DELETE } from '@/components/method-badge';

// Custom icon handler for HTTP method badges
const methodIcons: Record<string, () => React.ReactNode> = {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
};

// See https://fumadocs.dev/docs/headless/source-api for more info
// baseUrl is relative to Next.js basePath (/docs), so use '/' here
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (icon && icon in methodIcons) {
      return methodIcons[icon]();
    }
    return undefined;
  },
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
