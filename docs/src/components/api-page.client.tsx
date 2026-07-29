'use client';

import { defineClientConfig } from 'fumadocs-openapi/ui/client';
import { mediaAdapters } from '@/lib/media-adapters';

export default defineClientConfig({
	// Client-side configuration for API playground
	mediaAdapters
});
