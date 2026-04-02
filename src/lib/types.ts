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
	articleTitle: string;
	articleType: string;
	datePublished: string;
	language: string;
	quote?: string;
	url: string;
	logo: string;
}

// Comparison blog post types
export type DiscoveryMethod =
	| 'SNMP'
	| 'CDP'
	| 'LLDP'
	| 'ARP'
	| 'ICMP'
	| 'WMI'
	| 'TCP/UDP'
	| 'SSH/CLI'
	| 'Cloud import'
	| 'mDNS'
	| 'NetBIOS';

export type ServiceLevel = 'yes' | 'no' | 'basic';
export type OpenSourceStatus = 'osi' | 'source-available' | 'no';
export type VendorCapability = 'Monitoring' | 'Automation' | 'Traffic Analysis' | 'RMM';

export interface SourceRef {
	id: number;
}

export interface LinkedText {
	text: string;
	href?: string;
	detail?: string;
	detailHref?: string;
	sources?: SourceRef[];
}

export interface Vendor {
	// Identity (shared across table + detail)
	name: string;
	fullName?: string; // for detail card h3 if different from table name
	slug: string;
	href: string;

	// Table data
	discovery: DiscoveryMethod[];
	discoverySources?: SourceRef[];
	services: {
		level: ServiceLevel;
		detail?: string;
		detailHref?: string;
		sources?: SourceRef[];
	};
	autoUpdates: boolean;
	openSource: { status: OpenSourceStatus; license?: string; href?: string };
	pricing: LinkedText;
	alsoIncludes?: VendorCapability[];

	// Detail card data
	bestFor?: string; // one-sentence "who is this for?" for AI extraction
	description: string;
	discoveryNotes?: string; // extra prose appended after auto-generated protocol list
	integrations?: string; // vendor API integrations, rendered after discovery in detail card
	diagrams?: string;
	serviceDiscovery?: string; // replaces diagrams for Scanopy
	pricingNotes?: string; // extra prose appended after pricing.text
	whereItFits?: string;
	tradeOff?: string;
	tradeOffLabel?: string; // defaults to "Trade-off"
	iframe?: { src: string; width: string; height: string; caption: string };
}

export interface VendorCategory {
	id: string;
	heading: string;
	intro?: string;
	hasAlsoIncludes: boolean;
	vendors: string[]; // vendor slugs
}

export interface VendorSource {
	id: number;
	label: string;
	url: string;
}

export interface VendorFAQ {
	question: string;
	answer: string;
}
