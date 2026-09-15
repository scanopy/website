/**
 * Contact modal submissions. The browser posts to our Cloudflare Pages Function
 * (functions/api/contact.ts), which creates the Apollo contact. The option lists
 * live here so the modal and the function validate against the same values.
 */

export const teamSizeOptions = [
	{ value: '1-10', label: '1-10 employees' },
	{ value: '11-25', label: '11-25 employees' },
	{ value: '26-50', label: '26-50 employees' },
	{ value: '51-100', label: '51-100 employees' },
	{ value: '101-250', label: '101-250 employees' },
	{ value: '251-500', label: '251-500 employees' },
	{ value: '501-1000', label: '501-1000 employees' },
	{ value: '1001+', label: '1001+ employees' }
];

export const urgencyOptions = [
	{ value: 'immediately', label: 'Immediately' },
	{ value: '1-3 months', label: '1-3 months' },
	{ value: '3-6 months', label: '3-6 months' },
	{ value: 'exploring', label: 'Just exploring' }
];

export interface ContactInquiry {
	email: string;
	firstName: string;
	lastName: string;
	company: string;
	teamSize: string;
	urgency: string;
	networkCount: number;
	useCase: string;
	planType: string;
	/** Hidden field; any value marks the submission as a bot. */
	honeypot: string;
}

export interface ContactSubmitResult {
	success: boolean;
	/** Keyed by ContactInquiry field name. */
	fieldErrors?: Record<string, string>;
}

export async function submitContactInquiry(data: ContactInquiry): Promise<ContactSubmitResult> {
	const response = await fetch('/api/contact', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	let result: ContactSubmitResult;
	try {
		result = await response.json();
	} catch {
		return { success: false };
	}

	if (result.success === true) return { success: true };
	return { success: false, fieldErrors: result.fieldErrors };
}
