/**
 * Enforces one layout across every integration guide.
 *
 * The guides in content/docs/guides/integrations are meant to be interchangeable in
 * shape: same sections, same order, same names, one section per credential type the
 * integration actually ships. That was previously maintained by reading them
 * side by side, which is exactly the kind of thing that rots. This runs in
 * `prebuild`, so a guide that drifts — or an integration that gains a transport
 * upstream and doesn't get documented — fails the build instead of shipping.
 *
 * The section list is not configuration to keep in sync: the fixed parts are here,
 * and the per-transport parts are derived from integrations.json.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const GUIDE_DIR = join(here, '..', 'content', 'docs', 'guides', 'integrations');
const FIXTURE = join(here, '..', '..', 'src', 'lib', 'fixtures', 'integrations.json');

/** Sections every guide carries before its per-transport sections. */
const SECTIONS_BEFORE = ['What gets discovered', 'Prerequisites', 'Choosing a credential type'];

/** Sections every guide carries after them. */
const SECTIONS_AFTER = ['Verifying it works', 'Troubleshooting'];

/** Components every guide must render, and what each one is for. */
const REQUIRED_COMPONENTS = [
	['<IntegrationBeta', 'the Beta notice, which renders itself only when a transport is Beta'],
	['<CredentialBasics', 'the shared "credentials work the same everywhere" block'],
	['<IntegrationTransports', 'the credential-type comparison table']
];

const integrations = JSON.parse(readFileSync(FIXTURE, 'utf8'));
const errors = [];

function frontmatter(source) {
	const match = source.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	return Object.fromEntries(
		match[1]
			.split('\n')
			.map((line) => line.match(/^(\w+):\s*(.*)$/))
			.filter(Boolean)
			.map((m) => [m[1], m[2].trim().replace(/^["'](.*)["']$/, '$1')])
	);
}

/** `## ` headings, ignoring any inside fenced code blocks. */
function sections(source) {
	const body = source.replace(/^---\n[\s\S]*?\n---/, '').replace(/```[\s\S]*?```/g, '');
	return [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
}

for (const file of readdirSync(GUIDE_DIR).filter((f) => f.endsWith('.mdx'))) {
	const path = join(GUIDE_DIR, file);
	const source = readFileSync(path, 'utf8');
	const fail = (message) => errors.push(`${file}: ${message}`);

	const id = frontmatter(source).integration;
	if (!id) {
		fail(
			'no `integration:` in frontmatter. Set it to the integrations.json id this guide ' +
				`documents (one of: ${integrations.map((i) => i.id).join(', ')}).`
		);
		continue;
	}

	const integration = integrations.find((i) => i.id === id);
	if (!integration) {
		fail(
			`frontmatter names integration "${id}", which is not in integrations.json ` +
				`(have: ${integrations.map((i) => i.id).join(', ')}).`
		);
		continue;
	}

	// One section per transport, named exactly as the app names the credential type,
	// in the fixture's order — so the sections and the generated comparison table
	// above them cannot disagree.
	const expected = [
		...SECTIONS_BEFORE,
		...integration.transports.map((t) => t.display_name),
		...SECTIONS_AFTER
	];
	const actual = sections(source);

	if (actual.join('\n') !== expected.join('\n')) {
		const missing = expected.filter((s) => !actual.includes(s));
		const extra = actual.filter((s) => !expected.includes(s));
		const detail = [
			missing.length ? `  missing: ${missing.join(', ')}` : null,
			extra.length ? `  unexpected: ${extra.join(', ')}` : null,
			!missing.length && !extra.length ? '  same sections, wrong order' : null
		].filter(Boolean);
		fail(
			[
				'section headings do not match the standard layout.',
				`  expected: ${expected.join(' | ')}`,
				`  actual:   ${actual.join(' | ')}`,
				...detail
			].join('\n')
		);
	}

	for (const [component, purpose] of REQUIRED_COMPONENTS) {
		if (!source.includes(component)) fail(`missing ${component} /> — ${purpose}.`);
	}

	// Every transport needs its fields documented in its own section, so a new
	// credential type upstream cannot land undocumented.
	for (const transport of integration.transports) {
		if (!source.includes(`transport="${transport.id}"`)) {
			fail(
				`no <IntegrationFields ... transport="${transport.id}" /> for the ` +
					`${transport.display_name} section.`
			);
		}
	}
}

if (errors.length) {
	console.error(`\nIntegration guide layout check failed:\n\n${errors.join('\n\n')}\n`);
	process.exit(1);
}

console.log(
	`Integration guide layout OK (${readdirSync(GUIDE_DIR).filter((f) => f.endsWith('.mdx')).length} guides)`
);
