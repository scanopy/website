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
		share_views: boolean;
		remove_created_with: boolean;
		audit_logs: boolean;
		api_access: boolean;
		onboarding_call: boolean;
		commercial_license: boolean;
		custom_sso: boolean;
		dedicated_instance: boolean;
		on_premise_installation: boolean;
		whitelabeling: boolean;
		invoice_billing: boolean;
		live_chat_support: boolean;
		embeds: boolean;
		email_support: boolean;
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
