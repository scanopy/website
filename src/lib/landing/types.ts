/**
 * Shared shape for the feature pages under /product/<slug> and the use-case pages under
 * /solutions/<slug>. Both render through LandingPage.svelte; the nav, footer, hub pages,
 * sitemap and llms.txt all read the same arrays, so a page is listed by adding it once.
 */

/** Topology view screenshots in static/common, keyed by the view they show. */
export type TopologyView = 'l2' | 'l3' | 'workloads' | 'application';

export type SectionFigure =
	| { kind: 'view'; view: TopologyView }
	/**
	 * A product screenshot in static/screenshots: `<name>-dark.webp` and `<name>-light.webp`, each
	 * with `-800w` and `-1200w` variants. Width and height are the dark full-size file.
	 */
	| { kind: 'screenshot'; name: string; alt: string; width: number; height: number }
	/** The shared exports / embed / share / snapshot cards. */
	| { kind: 'exports' };

export interface LandingSection {
	/** States the section's claim, not a label. */
	heading: string;
	/** One sentence, or omit when the heading carries it. */
	standfirst?: string;
	/** Three short blocks. Body strings may hold inline links. */
	points: { title: string; body: string }[];
	figure?: SectionFigure;
}

export interface LandingPage {
	slug: string;
	/** Menu and card label. */
	navLabel: string;
	/** One line under the label in menus and hub cards. */
	navBlurb: string;
	/** <title> and og:title. */
	title: string;
	/** Meta description. */
	description: string;
	/** H1: the outcome. */
	heading: string;
	/** The mechanism, one or two sentences. */
	subhead: string;
	/** Topology views in the hero, first one shown. One view renders as a still image, no tabs. */
	heroViews?: TopologyView[];
	sections: LandingSection[];
	/** Testimonial id from fixtures/testimonials.json. Approved quotes only. */
	quoteId?: string;
	/** Show the customer logo band. Logos are identification only: no detail beyond the name. */
	showLogos?: boolean;
	faqs: { question: string; answer: string }[];
	/** Product page slugs this page builds on. Solutions list these; product pages get backlinks. */
	related: string[];
}

/** A page listed in the nav and hub but built outside the template (e.g. /solutions/compliance). */
export interface ListedPage {
	slug: string;
	navLabel: string;
	navBlurb: string;
	/** Product page slugs it builds on, for backlinks. */
	related: string[];
}
