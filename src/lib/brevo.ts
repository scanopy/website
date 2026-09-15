// reCAPTCHA v3 integration — disabled July 2026, kept for possible re-enable.
// Captcha enforcement was turned off in Brevo (the honeypot field and
// newsletter double opt-in remain the spam protection), so generating tokens
// only added latency and a Google script load. To re-enable: turn captcha back
// on in the Brevo form settings, then uncomment this block and the
// `getRecaptchaToken`/`g-recaptcha-response` lines in submitNewsletter
// below (PUBLIC_RECAPTCHA_SITE_KEY is still set in .env). Note: with captcha
// enforced, the weekly form monitor's newsletter spec will fail — automated
// browsers can't pass reCAPTCHA v3; see README "Form Monitoring".
//
// import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
//
// declare const grecaptcha: {
// 	ready: (cb: () => void) => void;
// 	execute: (siteKey: string, options: { action: string }) => Promise<string>;
// };
//
// let recaptchaLoaded = false;
//
// function loadRecaptcha(): Promise<void> {
// 	if (recaptchaLoaded) return Promise.resolve();
// 	return new Promise((resolve, reject) => {
// 		const script = document.createElement('script');
// 		script.src = `https://www.google.com/recaptcha/api.js?render=${PUBLIC_RECAPTCHA_SITE_KEY}`;
// 		script.async = true;
// 		script.onload = () => {
// 			recaptchaLoaded = true;
// 			resolve();
// 		};
// 		script.onerror = () => {
// 			reject(new Error('Failed to load reCAPTCHA'));
// 		};
// 		const timeout = setTimeout(() => {
// 			reject(new Error('reCAPTCHA load timeout'));
// 		}, 5000);
// 		script.onload = () => {
// 			clearTimeout(timeout);
// 			recaptchaLoaded = true;
// 			resolve();
// 		};
// 		document.head.appendChild(script);
// 	});
// }
//
// async function getRecaptchaToken(): Promise<string | null> {
// 	try {
// 		await loadRecaptcha();
// 		return await new Promise((resolve) => {
// 			const timeout = setTimeout(() => resolve(null), 5000);
// 			grecaptcha.ready(() => {
// 				grecaptcha.execute(PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' })
// 					.then((token) => {
// 						clearTimeout(timeout);
// 						resolve(token);
// 					})
// 					.catch(() => {
// 						clearTimeout(timeout);
// 						resolve(null);
// 					});
// 			});
// 		});
// 	} catch {
// 		return null;
// 	}
// }

export async function submitNewsletter(formUrl: string, email: string): Promise<boolean> {
	// const token = await getRecaptchaToken();

	const formData = new FormData();
	formData.append('EMAIL', email);
	// if (token) {
	// 	formData.append('g-recaptcha-response', token);
	// }
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
