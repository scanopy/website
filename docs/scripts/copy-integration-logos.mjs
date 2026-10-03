/**
 * Copies each integration's logo into public/logos/ so the docs serve it themselves.
 *
 * Logos are synced from scanopy into the marketing site's static/logos/services/services/.
 * The docs dev server cannot reach that folder, so `IntegrationIcon` reads its own copy at
 * /docs/logos/. Only the logos integrations.json marks `has_logo` are copied, and a missing
 * one fails the run rather than rendering a broken image.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURE = join(here, '..', '..', 'src', 'lib', 'fixtures', 'integrations.json');
const SOURCE_DIR = join(here, '..', '..', 'static', 'logos', 'services', 'services');
const TARGET_DIR = join(here, '..', 'public', 'logos');

const integrations = JSON.parse(readFileSync(FIXTURE, 'utf8'));

rmSync(TARGET_DIR, { recursive: true, force: true });
mkdirSync(TARGET_DIR, { recursive: true });

const missing = [];
for (const integration of integrations) {
	if (!integration.has_logo) continue;
	const file = `${integration.logo_slug}.${integration.logo_ext}`;
	const source = join(SOURCE_DIR, file);
	if (!existsSync(source)) {
		missing.push(`${integration.id}: ${source}`);
		continue;
	}
	copyFileSync(source, join(TARGET_DIR, file));
}

if (missing.length > 0) {
	console.error(`Integration logos missing:\n  ${missing.join('\n  ')}`);
	process.exit(1);
}
