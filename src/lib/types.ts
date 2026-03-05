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

export type BillingPlanType =
	| 'Free'
	| 'Community'
	| 'Starter'
	| 'Pro'
	| 'Team'
	| 'Business'
	| 'Enterprise'
	| 'CommercialSelfHosted';

export interface BillingPlan {
	base_cents: number;
	seat_cents: number | null;
	included_seats: number | null;
	network_cents: number | null;
	included_networks: number | null;
	host_cents: number | null;
	included_hosts: number | null;
	rate: string;
	trial_days: number;
	type: BillingPlanType;
}

export interface BillingPlanMetadata {
	features: Record<string, boolean | string | number | null>;
	is_commercial: boolean;
	hosting: string;
	custom_price: string | null;
	incremental_features: string[];
	previous_tier: string | null;
}

export interface FeatureMetadata {
	is_coming_soon: boolean;
	use_null_as_unlimited?: boolean;
	minimum_plan?: string | null;
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

export interface GalleryAuthor {
	name: string;
	url?: string;
}

export interface GalleryItem {
	id: string;
	title: string;
	description: string;
	image: string;
	author: GalleryAuthor;
	tags: string[];
	services_count?: number;
	featured?: boolean;
	/** If false, skip this item in social media posting workflow. Defaults to false. */
	social?: boolean;
}

export interface PressMention {
	id: string;
	name: string;
	quote?: string;
	url: string;
	logo: string;
}
