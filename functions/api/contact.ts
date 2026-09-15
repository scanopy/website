/**
 * POST /api/contact: contact modal submissions (src/lib/contact.ts).
 *
 * Finds or creates the Apollo account, creates the contact on it, and assigns a
 * follow-up task to the owner. Runs as a Cloudflare Pages Function.
 * APOLLO_API_KEY is a Pages secret; the key needs the contacts create, accounts
 * create, accounts search, and tasks create scopes.
 */

import { teamSizeOptions, urgencyOptions } from '../../src/lib/contact';

interface Env {
	APOLLO_API_KEY: string;
}

interface ApolloAccount {
	id: string;
	name?: string;
	domain?: string | null;
}

const APOLLO_API = 'https://api.apollo.io/api/v1';

// Apollo contact custom field IDs (Settings > Fields).
const FIELD_IDS = {
	companySize: '6aa8c530d5a706000c82477b',
	timeline: '6aa6eab226e3be0014ced68c',
	networkCount: '6aa6eb0d71ffc6001c7cfcf0',
	useCase: '6aa6eb4a3faf0d0014192072',
	planType: '6aa6eb6570fa1400141e66f6'
};

// Apollo user who owns new accounts and gets a task for each inquiry.
const OWNER_ID = '6aa40fd9aa33750010053ff1';

const INQUIRY_LABEL = 'Website inquiry';
// The weekly form monitor (e2e/) submits as formtest+YYYYMMDD@scanopy.net.
const MONITOR_LABEL = 'Form monitor';
const MONITOR_EMAIL = /^formtest\+\d{8}@scanopy\.net$/;

// An address at one of these says nothing about the visitor's company.
const FREE_EMAIL_DOMAINS = new Set([
	'aol.com',
	'gmail.com',
	'gmx.com',
	'googlemail.com',
	'hotmail.com',
	'icloud.com',
	'live.com',
	'mail.com',
	'me.com',
	'msn.com',
	'outlook.com',
	'proton.me',
	'protonmail.com',
	'yahoo.com',
	'yandex.com',
	'zoho.com'
]);

const TEAM_SIZES = new Set(teamSizeOptions.map((o) => o.value));
const TIMELINES = new Set(urgencyOptions.map((o) => o.value));

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

function text(value: unknown, max: number): string {
	return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function companyDomain(email: string): string | undefined {
	const domain = email.split('@')[1]?.toLowerCase();
	return domain && !FREE_EMAIL_DOMAINS.has(domain) ? domain : undefined;
}

/** Field errors are keyed like ContactInquiry so the modal can highlight them. */
function validate(body: Record<string, unknown>) {
	const inquiry = {
		email: text(body.email, 254),
		firstName: text(body.firstName, 100),
		lastName: text(body.lastName, 100),
		company: text(body.company, 200),
		teamSize: text(body.teamSize, 20),
		urgency: text(body.urgency, 20),
		networkCount: Number(body.networkCount),
		useCase: text(body.useCase, 5000),
		planType: text(body.planType, 50),
		honeypot: text(body.honeypot, 200)
	};

	const errors: Record<string, string> = {};
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
		errors.email = 'Please enter a valid email address';
	}
	if (!inquiry.firstName) errors.firstName = 'Please enter your first name';
	if (!inquiry.lastName) errors.lastName = 'Please enter your last name';
	if (!inquiry.company) errors.company = 'Please enter your company name';
	if (!TEAM_SIZES.has(inquiry.teamSize)) errors.teamSize = 'Please select your company size';
	if (!TIMELINES.has(inquiry.urgency)) errors.urgency = 'Please select a timeline';
	if (!Number.isInteger(inquiry.networkCount) || inquiry.networkCount < 0) {
		errors.networkCount = 'Please enter the number of networks/sites';
	}
	if (!inquiry.useCase) errors.useCase = 'Please describe your use case';
	// Set by the button the visitor clicked, not typed; never reject a lead over it.
	if (!/^[A-Za-z]+$/.test(inquiry.planType)) inquiry.planType = 'Unknown';

	return { inquiry, errors };
}

async function apollo(env: Env, path: string, body: unknown) {
	const response = await fetch(`${APOLLO_API}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': env.APOLLO_API_KEY },
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(10_000)
	});
	if (!response.ok) {
		const detail = (await response.text()).slice(0, 300);
		throw new Error(`Apollo ${path} returned ${response.status}: ${detail}`);
	}
	return response.json();
}

/**
 * Apollo's create-account API doesn't deduplicate, so reuse an account whose
 * name matches exactly or whose domain matches the visitor's email domain.
 */
async function findOrCreateAccount(
	env: Env,
	company: string,
	domain: string | undefined
): Promise<string> {
	const search = await apollo(env, '/accounts/search', {
		q_organization_name: company,
		per_page: 25
	});
	const name = company.toLowerCase();
	const match = (search?.accounts as ApolloAccount[] | undefined)?.find(
		(a) => a.name?.toLowerCase() === name || (domain !== undefined && a.domain === domain)
	);
	if (match) return match.id;

	const created = await apollo(env, '/accounts', { name: company, domain, owner_id: OWNER_ID });
	const id = created?.account?.id;
	if (!id) throw new Error('Apollo /accounts response has no account id');
	return id;
}

export const onRequestPost = async ({
	request,
	env
}: {
	request: Request;
	env: Env;
}): Promise<Response> => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ success: false }, 400);
	}
	if (typeof body !== 'object' || body === null) return json({ success: false }, 400);

	const { inquiry, errors } = validate(body as Record<string, unknown>);

	// Bots fill the hidden field. Report success so they don't retry.
	if (inquiry.honeypot) return json({ success: true });

	if (Object.keys(errors).length > 0) return json({ success: false, fieldErrors: errors }, 400);

	const isMonitor = MONITOR_EMAIL.test(inquiry.email);

	let accountId: string | undefined;
	try {
		accountId = await findOrCreateAccount(env, inquiry.company, companyDomain(inquiry.email));
	} catch (err) {
		// Still save the contact; the account can be linked by hand.
		console.error('Apollo account lookup/create failed:', err);
	}

	let contactId: string;
	try {
		const result = await apollo(env, '/contacts', {
			first_name: inquiry.firstName,
			last_name: inquiry.lastName,
			email: inquiry.email,
			organization_name: inquiry.company,
			account_id: accountId,
			label_names: [isMonitor ? MONITOR_LABEL : INQUIRY_LABEL],
			run_dedupe: true,
			typed_custom_fields: {
				[FIELD_IDS.companySize]: inquiry.teamSize,
				[FIELD_IDS.timeline]: inquiry.urgency,
				[FIELD_IDS.networkCount]: String(inquiry.networkCount),
				[FIELD_IDS.useCase]: inquiry.useCase,
				[FIELD_IDS.planType]: inquiry.planType
			}
		});
		contactId = result?.contact?.id;
		if (!contactId) throw new Error('Apollo /contacts response has no contact id');
	} catch (err) {
		console.error('Apollo contact create failed:', err);
		return json({ success: false }, 502);
	}

	if (!isMonitor) {
		try {
			await apollo(env, '/tasks', {
				user_id: OWNER_ID,
				contact_id: contactId,
				type: 'action_item',
				status: 'scheduled',
				priority: 'high',
				due_at: new Date().toISOString(),
				title: `Website inquiry: ${inquiry.planType}`,
				note:
					`${inquiry.firstName} ${inquiry.lastName} (${inquiry.company}), ` +
					`${inquiry.teamSize} employees, ${inquiry.networkCount} networks/sites, ` +
					`timeline: ${inquiry.urgency}\n\n${inquiry.useCase}`
			});
		} catch (err) {
			// The contact is saved, so the visitor's submission still succeeded.
			console.error('Apollo task create failed:', err);
		}
	}

	return json({ success: true });
};
