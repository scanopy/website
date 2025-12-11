// Shared types for the website

export interface TypeMetadata<TMetadata = Record<string, unknown>> {
	id: string;
	name: string;
	description: string;
	category: string | null;
	icon: string | null;
	color: string | null;
	metadata: TMetadata;
}

export interface BillingPlan {
	base_cents: number;
	seat_cents: number | null;
	included_seats: number | null;
	network_cents: number | null;
	included_networks: number | null;
	rate: string;
	trial_days: number;
	type: 'Community' | 'Starter' | 'Pro' | 'Team' | 'Business' | 'Enterprise';
}

export interface BillingPlanMetadata {
	features: Record<string, boolean | string | number | null>;
	is_commercial: boolean;
}

export interface FeatureMetadata {
	is_coming_soon: boolean;
	use_null_as_unlimited?: boolean;
}

export interface ServiceDefinition {
	name: string;
	category: string;
	description: string;
	discovery_pattern: string;
	logo_url: string;
	color: string;
	logo_needs_white_background?: boolean;
}
