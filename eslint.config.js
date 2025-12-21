import prettier from 'eslint-config-prettier';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default [
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		ignores: [
			'tsconfig.json',
			'*.config.js',
			'*.config.ts',
			'build/',
			'.svelte-kit/',
			'docs/.astro/',
			'docs/dist/',
			// Files with @html JSON-LD that cause svelte-eslint-parser issues
			'src/routes/+layout.svelte',
			'src/routes/+page.svelte',
			'src/routes/pricing/+page.svelte',
			'src/routes/changelog/+page.svelte'
		]
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			// Static website doesn't use SvelteKit navigation resolver
			'svelte/no-navigation-without-resolve': 'off',
			// Allow external hrefs without $app/paths
			'svelte/valid-href-attribute': 'off',
			// Generic interfaces may have properties not used by all consumers
			'svelte/no-unused-props': 'off'
		}
	}
];
