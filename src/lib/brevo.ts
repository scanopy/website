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
			grecaptcha.ready(() => {
				grecaptcha.execute(PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' }).then(resolve);
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
	networkCount?: string;
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

export async function submitContactInquiry(
	formUrl: string,
	data: ContactInquiryData
): Promise<boolean> {
	const token = await getRecaptchaToken();

	const formData = new FormData();
	formData.append('EMAIL', data.email);
	formData.append('FIRSTNAME', data.firstname);
	formData.append('LASTNAME', data.lastname);
	formData.append('INQUIRY_COMPANY', data.company);
	formData.append('INQUIRY_NUM_EMPLOYEES', data.numemployees);
	formData.append('INQUIRY_URGENCY', data.urgency || '');
	formData.append('INQUIRY_NETWORK_COUNT', data.networkCount || '');
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

	if (!response.ok) return false;
	const result = await response.json();
	return result.success === true;
}
