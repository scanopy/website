import { defineConfig } from '@playwright/test';

/**
 * Form-monitoring suite. By default it runs against the LIVE site and submits
 * real (sentinel-marked) data to Apollo and Brevo. See README "Form Monitoring".
 * Set E2E_BASE_URL to run it against another deployment, such as a local
 * preview build; off production the contact tests answer /api/contact locally.
 */
export default defineConfig({
	testDir: 'e2e',
	timeout: 60_000,
	expect: { timeout: 10_000 },
	// Serialize: each test performs a real production form submission.
	fullyParallel: false,
	workers: 1,
	// One retry in CI for network flake tolerance; each retry is one more real submission.
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: process.env.E2E_BASE_URL ?? 'https://scanopy.net',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
