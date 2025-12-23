// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import path from 'path';

// https://astro.build/config
export default defineConfig({
	site: 'https://scanopy.net',
	base: '/docs',
	vite: {
		envDir: path.resolve('..'),
		resolve: {
			alias: {
				$lib: path.resolve('../src/lib')
			}
		}
	},
	integrations: [
		svelte(),
		tailwind({ applyBaseStyles: false }),
		starlight({
			plugins: [
				starlightOpenAPI([
					{
						base: 'api',
						label: 'API Reference',
						schema: '../src/lib/fixtures/openapi.json',
					},
				]),
			],
			title: 'Scanopy Docs',
			logo: {
				src: '../static/scanopy-logo.png',
				alt: 'Scanopy'
			},
			favicon: '/favicon.png',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/scanopy/scanopy' }],
			expressiveCode: {
				themes: ['tokyo-night'],
				useDarkModeMediaQuery: false,
				styleOverrides: {
					borderColor: 'rgba(55, 65, 81, 0.5)',
					borderRadius: '0.75rem',
				},
			},
			customCss: ['./src/styles/custom.css'],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Header: './src/components/Header.astro',
				Head: './src/components/Head.astro',
				PageFrame: './src/components/PageFrame.astro'
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' }
					]
				},
				{
					label: 'Using Scanopy',
					items: [
						{ label: 'Organization & Access', slug: 'using-scanopy/organization' },
						{ label: 'Hosts, Subnets & Groups', slug: 'using-scanopy/network-data' },
						{ label: 'Discovery', slug: 'using-scanopy/discovery' },
						{ label: 'Topology', slug: 'using-scanopy/topology' }
					]
				},
				{
					label: 'Daemons',
					items: [
						{ label: 'Installing a Daemon', slug: 'daemons/installing-daemon' },
						{ label: 'Daemon Configuration', slug: 'daemons/daemon-configuration' },
						{ label: 'Multi-VLAN Deployment', slug: 'daemons/multi-vlan' },
						{ label: 'Docker Socket Proxy', slug: 'daemons/docker-proxy' },
						{ label: 'Troubleshooting', slug: 'daemons/troubleshooting' }
					]
				},
				{
					label: 'Self-Hosted',
					items: [
						{ label: 'Server Installation', slug: 'self-hosted/server-installation' },
						{ label: 'Server Configuration', slug: 'self-hosted/server-configuration' },
						{ label: 'OIDC Setup', slug: 'self-hosted/oidc' },
						{ label: 'Server Troubleshooting', slug: 'self-hosted/troubleshooting' }
					]
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Architecture', slug: 'reference/architecture' },
						{ label: 'Service Detection', slug: 'reference/service-detection' },
						{ label: 'Limitations', slug: 'reference/limitations' },
						{ label: 'Security', slug: 'reference/security' },
						{ label: 'FAQ', slug: 'reference/faq' }
					]
				},
				...openAPISidebarGroups
			]
		})
	]
});
