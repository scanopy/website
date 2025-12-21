import billingPlansData from '$lib/fixtures/billing-plans.json';
import servicesData from '$lib/fixtures/services.json';

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

export function GET() {
	const plans = billingPlansData as BillingPlan[];
	const services = servicesData as Service[];

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
		const price = plan.metadata.custom_price || `$${(plan.metadata.base_cents / 100).toFixed(2)}/month`;
		const networks = plan.metadata.included_networks ? `${plan.metadata.included_networks} network${plan.metadata.included_networks > 1 ? 's' : ''}` : 'unlimited networks';
		const seats = plan.metadata.included_seats ? `${plan.metadata.included_seats} seat${plan.metadata.included_seats > 1 ? 's' : ''}` : '';
		const hosting = plan.metadata.hosting.toLowerCase();

		const details = [networks, seats, hosting].filter(Boolean).join(', ');
		return `- **${plan.name}**: ${price} - ${details}`;
	});

	// Get service categories and counts
	const categoryCount = services.reduce((acc, s) => {
		acc[s.category] = (acc[s.category] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

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

	const content = `# Scanopy

> Automatic network discovery and documentation software. Create live, auto-updating network diagrams with one-time setup and zero upkeep.

## What is Scanopy?

Scanopy is a network documentation tool that automatically scans networks and generates live topology diagrams. It discovers hosts, services, and subnets, then creates visual documentation that stays up to date without manual intervention.

## Key Features

- **Automatic Discovery**: Scans any network and discovers every host, service, and subnet automatically
- **Live Diagrams**: Topology diagrams that update as the network changes
- **Service Detection**: Auto-detects ${services.length}+ services across categories: ${topCategories}
- **Versioning**: Create branches, lock versions, and compare network state over time
- **Security Visibility**: See which services are exposed and flag misconfigurations
- **Sharing**: Export diagrams, send live view links, or create embeds

## Detected Services

Scanopy automatically identifies ${services.length}+ services including: ${exampleServices}, and many more.

Full list: https://scanopy.net/services

## Use Cases

- Network documentation for homelabs and enterprises
- Client onboarding for MSPs and IT consultants
- Audit and compliance documentation
- Infrastructure change tracking

## Pricing

${pricingLines.join('\n')}

Full pricing details: https://scanopy.net/pricing

## Links

- Website: https://scanopy.net
- Documentation: https://scanopy.net/docs
- Pricing: https://scanopy.net/pricing
- GitHub: https://github.com/scanopy/scanopy
- Discord: https://discord.gg/b7ffQr8AcZ

## Getting Started

1. Sign up at https://app.scanopy.net/onboarding
2. Install the Scanopy agent on your network
3. Run your first scan
4. View your auto-generated network diagram

## Contact

- Support: Discord community or email support (paid plans)
- Legal: legal@scanopy.net
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
}
