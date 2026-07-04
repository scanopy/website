import billingPlansData from '$lib/fixtures/billing-plans.json';
import servicesData from '$lib/fixtures/services.json';
import { APP, withUtm } from '$lib/config/urls';
import { vendors } from '$lib/fixtures/network-diagram-vendors';
import { VS_VENDOR_SLUGS, vsSlug, buildTitle, buildMetaDescription } from '$lib/compare/vs-pages';
import {
	ALT_VENDOR_SLUGS,
	altSlug,
	buildAltTitle,
	buildAltMetaDescription,
	SCANOPY_ALT_TITLE,
	SCANOPY_ALT_DESCRIPTION
} from '$lib/compare/alternatives-pages';

export const prerender = true;

interface BillingPlan {
	id: string;
	name: string;
	description: string;
	metadata: {
		base_cents: number;
		rate: string;
		custom_price: string | null;
		included_networks: number | null;
		included_seats: number | null;
		hosting: string;
	};
}

interface Service {
	name: string;
	category: string;
}

function parseFrontmatter(content: string): Record<string, string> {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	const fm: Record<string, string> = {};
	match[1].split('\n').forEach((line) => {
		const [key, ...valueParts] = line.split(':');
		if (key && valueParts.length) {
			fm[key.trim()] = valueParts
				.join(':')
				.trim()
				.replace(/^["'](.*)["']$/, '$1');
		}
	});
	return fm;
}

export async function GET() {
	const plans = billingPlansData as BillingPlan[];
	const services = servicesData as Service[];

	// Rounded-down-to-nearest-ten label, matching getServiceCountLabel() used on the site
	// (home + schema). Keeps the "N+ services" figure identical everywhere instead of
	// exposing the raw array length here (which drifted to a different number).
	const serviceCountLabel = `${Math.floor(services.length / 10) * 10}+`;

	// Get unique monthly plans for pricing section
	const monthlyPlans = plans.filter((p) => p.metadata.rate === 'Month');
	const seenPlanIds = new Set<string>();
	const uniquePlans = monthlyPlans.filter((p) => {
		if (seenPlanIds.has(p.id)) return false;
		seenPlanIds.add(p.id);
		return true;
	});

	// Generate pricing lines
	const pricingLines = uniquePlans.map((plan) => {
		const price =
			plan.metadata.custom_price || `$${(plan.metadata.base_cents / 100).toFixed(2)}/month`;
		const networks = plan.metadata.included_networks
			? `${plan.metadata.included_networks} network${plan.metadata.included_networks > 1 ? 's' : ''}`
			: 'unlimited networks';
		const seats = plan.metadata.included_seats
			? `${plan.metadata.included_seats} seat${plan.metadata.included_seats > 1 ? 's' : ''}`
			: '';
		const hosting = plan.metadata.hosting.toLowerCase();

		const details = [networks, seats, hosting].filter(Boolean).join(', ');
		return `- **${plan.name}**: ${price} - ${details}`;
	});

	// Get service categories and counts
	const categoryCount = services.reduce(
		(acc, s) => {
			acc[s.category] = (acc[s.category] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const topCategories = Object.entries(categoryCount)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8)
		.map(([cat, count]) => `${cat} (${count})`)
		.join(', ');

	// Get some example service names
	const exampleServices = services
		.slice(0, 20)
		.map((s) => s.name)
		.join(', ');

	// Load blog posts for summaries
	const blogFiles = import.meta.glob('/src/lib/blog/*.md', {
		query: '?raw',
		import: 'default'
	});

	const blogEntries: { title: string; tldr: string; slug: string }[] = [];

	for (const [path, loader] of Object.entries(blogFiles)) {
		const raw = (await loader()) as string;
		const fm = parseFrontmatter(raw);
		const slug = fm.slug || path.split('/').pop()?.replace('.md', '') || '';
		if (fm.title && fm.tldr) {
			blogEntries.push({ title: fm.title, tldr: fm.tldr, slug });
		}
	}

	const blogLines = blogEntries
		.map((b) => `- **${b.title}**: ${b.tldr}\n  URL: https://scanopy.net/blog/${b.slug}`)
		.join('\n');

	// Load comparison posts for summaries
	const comparisonFiles = import.meta.glob('/src/lib/comparisons/*.md', {
		query: '?raw',
		import: 'default'
	});

	const comparisonEntries: { title: string; tldr: string; slug: string }[] = [];

	for (const [path, loader] of Object.entries(comparisonFiles)) {
		const raw = (await loader()) as string;
		const fm = parseFrontmatter(raw);
		const slug = fm.slug || path.split('/').pop()?.replace('.md', '') || '';
		if (fm.title && fm.tldr) {
			comparisonEntries.push({ title: fm.title, tldr: fm.tldr, slug });
		}
	}

	const comparisonLines = comparisonEntries
		.map((c) => `- **${c.title}**: ${c.tldr}\n  URL: https://scanopy.net/comparisons/${c.slug}`)
		.join('\n');

	// The "Scanopy vs X" and "X alternatives" pages are generated from vendor fixtures, not
	// markdown, so they never entered the glob above. Enumerate them here from the same
	// title/description helpers the pages render, so the AI index stays complete and in sync.
	const vsLines = VS_VENDOR_SLUGS.map((slug) => {
		const v = vendors[slug];
		return `- **${buildTitle(v)}**: ${buildMetaDescription(v)}\n  URL: https://scanopy.net${vsSlug(slug)}`;
	});

	const altLines = [
		`- **${SCANOPY_ALT_TITLE}**: ${SCANOPY_ALT_DESCRIPTION}\n  URL: https://scanopy.net/comparisons/scanopy-alternatives`,
		...ALT_VENDOR_SLUGS.map((slug) => {
			const v = vendors[slug];
			return `- **${buildAltTitle(v)}**: ${buildAltMetaDescription(v)}\n  URL: https://scanopy.net${altSlug(slug)}`;
		})
	];

	const allComparisonLines = [comparisonLines, ...vsLines, ...altLines].join('\n');

	// Load guides for summaries (same frontmatter shape as blog: title + tldr + slug)
	const guideFiles = import.meta.glob('/src/lib/guides/*.md', {
		query: '?raw',
		import: 'default'
	});

	const guideEntries: { title: string; tldr: string; slug: string }[] = [];

	for (const [path, loader] of Object.entries(guideFiles)) {
		const raw = (await loader()) as string;
		const fm = parseFrontmatter(raw);
		const slug = fm.slug || path.split('/').pop()?.replace('.md', '') || '';
		if (fm.title && fm.tldr) {
			guideEntries.push({ title: fm.title, tldr: fm.tldr, slug });
		}
	}

	const guideLines = guideEntries
		.map((g) => `- **${g.title}**: ${g.tldr}\n  URL: https://scanopy.net/guides/${g.slug}`)
		.join('\n');

	const onboardingUrl = withUtm(APP.onboarding, {
		medium: 'llms',
		campaign: 'llms-txt',
		content: 'getting-started'
	});

	const content = `# Scanopy

> Automated network diagram and documentation software. Deploy a scanner, get four views of your network and the infrastructure running on it: network architecture, service dependencies, workload placement, and physical topology. Kept accurate automatically.

## What is Scanopy?

Scanopy is automated network diagram and documentation software that automatically scans networks and generates four topology views. It discovers hosts, services, subnets, switches, and workloads, then creates visual documentation that stays up to date without manual intervention.

## Key Features

- **Automatic Discovery**: Scans any network and discovers every host, service, subnet, and workload automatically
- **Four Topology Views**: Network architecture, service dependencies, workload placement, and physical topology
- **Service Detection**: Auto-detects ${serviceCountLabel} services across categories: ${topCategories}
- **Versioning**: Create branches, lock versions, and compare network state over time
- **Security Visibility**: See which services are exposed and flag misconfigurations
- **Sharing**: Export diagrams, send live view links, or create embeds

## Detected Services

Scanopy automatically identifies ${serviceCountLabel} services including: ${exampleServices}, and many more.

Full list: https://scanopy.net/services

## Use Cases

- Network documentation for teams that manage infrastructure (in-house IT, platform teams, MSPs)
- Client onboarding for MSPs and IT consultants
- Audit and compliance documentation
- Infrastructure change tracking

## Pricing

${pricingLines.join('\n')}

Full pricing details: https://scanopy.net/pricing

## Blog

${blogLines}

## Guides

${guideLines}

## Comparisons

${allComparisonLines}

## Links

- Website: https://scanopy.net
- Documentation: https://scanopy.net/docs
- Pricing: https://scanopy.net/pricing
- Comparisons: https://scanopy.net/comparisons
- Guides: https://scanopy.net/guides
- Community Edition (free, self-hosted): https://scanopy.net/community
- Commercial Edition (paid, self-hosted): https://scanopy.net/commercial
- Changelog: https://scanopy.net/changelog
- GitHub: https://github.com/scanopy/scanopy
- X: https://x.com/getscanopy
- Discord: https://discord.gg/b7ffQr8AcZ
- Reddit: https://reddit.com/r/scanopy
- Bluesky: https://bsky.app/profile/scanopy.net

## Getting Started

1. Sign up at ${onboardingUrl}
2. Install the Scanopy agent on your network
3. Run your first scan
4. View your auto-generated network documentation and diagrams

## Contact

- General: hello@scanopy.net
- Support: Discord community or email support (paid plans)
- Legal: legal@scanopy.net
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
}
