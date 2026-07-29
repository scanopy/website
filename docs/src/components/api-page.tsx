import { openapi } from '@/lib/openapi';
import { mediaAdapters } from '@/lib/media-adapters';
import { createAPIPage } from 'fumadocs-openapi/ui';
import client from './api-page.client';

export const APIPage = createAPIPage(openapi, {
	client,
	mediaAdapters
});
