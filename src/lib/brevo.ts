import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

declare const grecaptcha: {
	ready: (cb: () => void) => void;
	execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

let recaptchaLoaded = false;

function loadRecaptcha(): Promise<void> {
	if (recaptchaLoaded) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${PUBLIC_RECAPTCHA_SITE_KEY}`;
		script.async = true;
		script.onload = () => {
			recaptchaLoaded = true;
			resolve();
		};
		script.onerror = () => {
			reject(new Error('Failed to load reCAPTCHA'));
		};
		const timeout = setTimeout(() => {
			reject(new Error('reCAPTCHA load timeout'));
		}, 5000);
		script.onload = () => {
			clearTimeout(timeout);
			recaptchaLoaded = true;
			resolve();
		};
		document.head.appendChild(script);
	});
}

async function getRecaptchaToken(): Promise<string | null> {
	try {
		await loadRecaptcha();
		return await new Promise((resolve) => {
			const timeout = setTimeout(() => resolve(null), 5000);
			grecaptcha.ready(() => {
				grecaptcha.execute(PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' })
					.then((token) => {
						clearTimeout(timeout);
						resolve(token);
					})
					.catch(() => {
						clearTimeout(timeout);
						resolve(null);
					});
			});
		});
	} catch {
		return null;
	}
}

interface ContactInquiryData {
	email: string;
	firstname: string;
	lastname: string;
	company: string;
	numemployees: string;
	urgency?: string;
	networkCount?: number | null;
	message?: string;
	planType: string;
}

export async function submitNewsletter(formUrl: string, email: string): Promise<boolean> {
	const token = await getRecaptchaToken();

	const formData = new FormData();
	formData.append('EMAIL', email);
	if (token) {
		formData.append('g-recaptcha-response', token);
	}
	formData.append('email_address_check', '');
	formData.append('locale', 'en');

	const response = await fetch(`${formUrl}?isAjax=1`, {
		method: 'POST',
		body: formData
	});

	if (!response.ok) return false;
	const result = await response.json();
	return result.success === true;
}

const BREVO_FIELD_MAP: Record<string, string> = {
	EMAIL: 'email',
	FIRSTNAME: 'firstName',
	LASTNAME: 'lastName',
	INQUIRY_COMPANY: 'company',
	INQUIRY_NUM_EMPLOYEES: 'teamSize',
	INQUIRY_URGENCY: 'urgency',
	INQUIRY_NETWORK_COUNT: 'networkCount',
	INQUIRY_MESSAGE: 'useCase'
};

export interface ContactSubmitResult {
	success: boolean;
	fieldErrors?: Record<string, string>;
}

export async function submitContactInquiry(
	formUrl: string,
	data: ContactInquiryData
): Promise<ContactSubmitResult> {
	const token = await getRecaptchaToken();

	const formData = new FormData();
	formData.append('EMAIL', data.email);
	formData.append('FIRSTNAME', data.firstname);
	formData.append('LASTNAME', data.lastname);
	formData.append('INQUIRY_COMPANY', data.company);
	formData.append('INQUIRY_NUM_EMPLOYEES', data.numemployees);
	formData.append('INQUIRY_URGENCY', data.urgency || '');
	formData.append('INQUIRY_NETWORK_COUNT', data.networkCount != null ? String(data.networkCount) : '');
	formData.append('INQUIRY_MESSAGE', data.message || '');
	formData.append('INQUIRY_PLAN_TYPE', data.planType);
	if (token) {
		formData.append('g-recaptcha-response', token);
	}
	formData.append('email_address_check', '');
	formData.append('locale', 'en');

	const response = await fetch(`${formUrl}?isAjax=1`, {
		method: 'POST',
		body: formData
	});

	const result = await response.json();

	if (result.success === true) {
		return { success: true };
	}

	if (result.errors) {
		const fieldErrors: Record<string, string> = {};
		for (const [brevoField, message] of Object.entries(result.errors)) {
			const formField = BREVO_FIELD_MAP[brevoField];
			if (formField) {
				fieldErrors[formField] = message as string;
			}
		}
		return { success: false, fieldErrors };
	}

	return { success: false };
}
