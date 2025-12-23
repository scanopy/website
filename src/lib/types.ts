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

export type BillingPlanType = 'Community' | 'Starter' | 'Pro' | 'Team' | 'Business' | 'Enterprise';

export interface BillingPlan {
	base_cents: number;
	seat_cents: number | null;
	included_seats: number | null;
	network_cents: number | null;
	included_networks: number | null;
	rate: string;
	trial_days: number;
	type: BillingPlanType;
}

export interface BillingPlanMetadata {
	features: {
		audit_logs: boolean;
		commercial_license: boolean;
		community_support: boolean;
		custom_sso: boolean;
		email_support: boolean;
		embeds: boolean;
		invoice_billing: boolean;
		live_chat_support: boolean;
		managed_deployment: boolean;
		onboarding_call: boolean;
		priority_support: boolean;
		remove_created_with: boolean;
		share_views: boolean;
		webhooks: boolean;
		whitelabeling: boolean;
	};
	is_commercial: boolean;
	hosting: string;
	custom_price: string | null;
	custom_checkout_cta: string | null;
	custom_checkout_link: string | null;
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
