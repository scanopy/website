import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-static';

const baseUrl = 'https://scanopy.net/docs';
const contentDir = path.resolve(process.cwd(), 'content/docs');

function getGitLastModified(filePath: string): Date | undefined {
	try {
		const gitDate = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
			encoding: 'utf-8',
			cwd: process.cwd()
		}).trim();
		if (gitDate) return new Date(gitDate);
	} catch {
		// git not available or file not tracked
	}
	return undefined;
}

function getLastModified(slugs: string[]): Date | undefined {
	// API docs all derive from openapi.json, so they'd share one lastmod.
	// Omit lastmod rather than provide a misleading uniform date.
	if (slugs.length > 0 && slugs[0] === 'api') {
		return undefined;
	}

	// Try index.mdx inside slug directory, then slug.mdx as a file
	const candidates =
		slugs.length === 0
			? [path.join(contentDir, 'index.mdx')]
			: [path.join(contentDir, ...slugs, 'index.mdx'), path.join(contentDir, ...slugs) + '.mdx'];

	for (const candidate of candidates) {
		try {
			fs.statSync(candidate); // verify file exists
			return getGitLastModified(candidate);
		} catch {
			// try next candidate
		}
	}
	return undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = source.getPages();

	return pages
		.filter((page) => !(page.slugs[0] === 'api' && page.slugs.length >= 3))
		.map((page) => ({
			url: page.slugs.length === 0 ? `${baseUrl}/` : `${baseUrl}/${page.slugs.join('/')}/`,
			lastModified: getLastModified(page.slugs)
		}));
}
