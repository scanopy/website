'use client';

import { useState, useEffect } from 'react';
import { type CookiePreferences, getGdprPreferences, saveGdprPreferences } from '$lib/cookies';
import { optInAnalytics, optOutAnalytics, isPostHogLoaded, getPostHog } from '$lib/posthog';

export function CookieConsent() {
	const [preferences, setPreferences] = useState<CookiePreferences>({
		necessary: true,
		analytics: false,
		marketing: false
	});
	const [showBanner, setShowBanner] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [hasConsented, setHasConsented] = useState(false);

	useEffect(() => {
		setMounted(true);
		const saved = getGdprPreferences();
		if (saved) {
			setPreferences({ ...preferences, ...saved });
			setHasConsented(true);
			applyPreferences(saved);
		} else {
			setShowBanner(true);
		}
	}, []);

	function applyPreferences(prefs: CookiePreferences) {
		if (isPostHogLoaded()) {
			if (prefs.analytics) {
				optInAnalytics();
				getPostHog()?.reloadFeatureFlags();
			} else {
				optOutAnalytics();
			}
		}
	}

	function savePrefs() {
		saveGdprPreferences(preferences);
		setHasConsented(true);
		setShowBanner(false);
		setShowSettings(false);
		applyPreferences(preferences);
	}

	function acceptAll() {
		const prefs = { necessary: true, analytics: true, marketing: true };
		setPreferences(prefs);
		saveGdprPreferences(prefs);
		setHasConsented(true);
		setShowBanner(false);
		setShowSettings(false);
		applyPreferences(prefs);
	}

	function rejectAll() {
		const prefs = { necessary: true, analytics: false, marketing: false };
		setPreferences(prefs);
		saveGdprPreferences(prefs);
		setHasConsented(true);
		setShowBanner(false);
		setShowSettings(false);
		applyPreferences(prefs);
	}

	function openSettings() {
		setShowSettings(true);
		setShowBanner(true);
	}

	function closeSettings() {
		setShowSettings(false);
		if (hasConsented) {
			setShowBanner(false);
		}
	}

	if (!mounted) return null;

	return (
		<>
			{showBanner && !showSettings && <div className="h-[100px] md:h-[72px]" />}

			{showBanner && (
				<>
					<div
						className={`pointer-events-none fixed inset-0 z-[9998] transition-colors duration-200 ${
							showSettings ? 'pointer-events-auto bg-black/50' : 'bg-transparent'
						}`}
					/>

					<div
						className={`fixed z-[9999] border-[var(--color-fd-border)] bg-[var(--color-fd-card)] p-5 ${
							showSettings
								? 'left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border'
								: 'bottom-0 left-0 right-0 border-t'
						}`}
					>
						{showSettings ? (
							<div className="flex flex-col gap-4">
								<div className="flex items-center justify-between">
									<h3 className="m-0 text-base font-semibold text-[var(--color-fd-foreground)]">
										Cookie Preferences
									</h3>
									<button
										onClick={closeSettings}
										className="flex cursor-pointer items-center justify-center rounded border-none bg-transparent p-1 text-[var(--color-fd-muted-foreground)] hover:bg-[var(--color-fd-muted)] hover:text-[var(--color-fd-foreground)]"
										aria-label="Close"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<line x1="18" y1="6" x2="6" y2="18" />
											<line x1="6" y1="6" x2="18" y2="18" />
										</svg>
									</button>
								</div>

								<p className="m-0 text-sm text-[var(--color-fd-muted-foreground)]">
									Manage your cookie preferences below. You can enable or disable different types of
									cookies. See our{' '}
									<a
										href="/privacy"
										className="text-[var(--color-fd-primary)] underline hover:text-[var(--color-fd-primary)]"
									>
										privacy policy
									</a>{' '}
									for more details.
								</p>

								<div className="my-2 flex flex-col gap-4">
									<div className="rounded-md border border-[var(--color-fd-border)] bg-[var(--color-fd-muted)] p-4">
										<div className="mb-2 flex items-center justify-between">
											<label className="flex cursor-pointer items-center gap-3">
												<input type="checkbox" checked disabled className="sr-only" />
												<span className="relative flex h-5 w-5 items-center justify-center rounded border border-[#4b5563] bg-[#374151] opacity-60 after:h-3 after:w-2 after:-translate-y-0.5 after:rotate-45 after:border-b-2 after:border-r-2 after:border-white after:content-['']" />
												<span className="text-[0.9375rem] font-medium text-[var(--color-fd-foreground)]">
													Necessary
												</span>
											</label>
											<span className="text-xs uppercase tracking-wider text-[var(--color-fd-muted-foreground)]">
												Always on
											</span>
										</div>
										<p className="m-0 text-[0.8125rem] leading-relaxed text-[var(--color-fd-muted-foreground)]">
											Essential cookies required for the website to function. These cannot be
											disabled.
										</p>
									</div>

									<div className="rounded-md border border-[var(--color-fd-border)] bg-[var(--color-fd-muted)] p-4">
										<div className="mb-2 flex items-center justify-between">
											<label className="flex cursor-pointer items-center gap-3">
												<input
													type="checkbox"
													checked={preferences.analytics}
													onChange={(e) =>
														setPreferences({
															...preferences,
															analytics: e.target.checked
														})
													}
													className="sr-only"
												/>
												<span
													className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
														preferences.analytics
															? 'border-blue-600 bg-blue-600'
															: 'border-[#4b5563] bg-[#374151] hover:border-[var(--color-fd-muted-foreground)]'
													}`}
												>
													{preferences.analytics && (
														<span className="h-3 w-2 -translate-y-0.5 rotate-45 border-b-2 border-r-2 border-white" />
													)}
												</span>
												<span className="text-[0.9375rem] font-medium text-[var(--color-fd-foreground)]">
													Analytics
												</span>
											</label>
										</div>
										<p className="m-0 text-[0.8125rem] leading-relaxed text-[var(--color-fd-muted-foreground)]">
											Help us understand how visitors interact with our website by collecting
											anonymous usage data.
										</p>
									</div>
								</div>

								<div className="flex flex-wrap justify-end gap-2 border-t border-[var(--color-fd-border)] pt-2">
									<button
										onClick={rejectAll}
										className="cursor-pointer rounded-md border border-[var(--color-fd-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-fd-muted-foreground)] transition-colors hover:border-[var(--color-fd-border)] hover:bg-[var(--color-fd-muted)] hover:text-[var(--color-fd-foreground)]"
									>
										Reject All
									</button>
									<button
										onClick={acceptAll}
										className="cursor-pointer rounded-md border border-[var(--color-fd-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-fd-muted-foreground)] transition-colors hover:border-[var(--color-fd-border)] hover:bg-[var(--color-fd-muted)] hover:text-[var(--color-fd-foreground)]"
									>
										Accept All
									</button>
									<button
										onClick={savePrefs}
										className="cursor-pointer rounded-md border border-blue-600 bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-blue-500 hover:bg-blue-600"
									>
										Save Preferences
									</button>
								</div>
							</div>
						) : (
							<div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div className="flex-1">
									<h3 className="m-0 mb-1 text-base font-semibold text-[var(--color-fd-foreground)]">
										Cookie Settings
									</h3>
									<p className="m-0 text-sm text-[var(--color-fd-muted-foreground)]">
										We use cookies to improve your experience and analyze site traffic. See our{' '}
										<a
											href="/privacy"
											className="text-[var(--color-fd-primary)] underline hover:text-[var(--color-fd-primary)]"
										>
											privacy policy
										</a>{' '}
										for details.
									</p>
								</div>
								<div className="flex flex-shrink-0 flex-wrap gap-2">
									<button
										onClick={openSettings}
										className="cursor-pointer rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-fd-muted-foreground)] underline transition-colors hover:text-[var(--color-fd-foreground)]"
									>
										Customize
									</button>
									<button
										onClick={rejectAll}
										className="cursor-pointer rounded-md border border-[var(--color-fd-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-fd-muted-foreground)] transition-colors hover:border-[var(--color-fd-border)] hover:bg-[var(--color-fd-muted)] hover:text-[var(--color-fd-foreground)]"
									>
										Reject All
									</button>
									<button
										onClick={acceptAll}
										className="cursor-pointer rounded-md border border-blue-600 bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-blue-500 hover:bg-blue-600"
									>
										Accept All
									</button>
								</div>
							</div>
						)}
					</div>
				</>
			)}

			{!showBanner && hasConsented && (
				<button
					onClick={openSettings}
					className="fixed bottom-4 right-4 z-[9999] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[var(--color-fd-border)] bg-[var(--color-fd-card)] text-[var(--color-fd-muted-foreground)] shadow-lg transition-colors hover:bg-[var(--color-fd-muted)] hover:text-[var(--color-fd-foreground)]"
					aria-label="Cookie settings"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<circle cx="8" cy="9" r="1.5" fill="currentColor" />
						<circle cx="15" cy="8" r="1.5" fill="currentColor" />
						<circle cx="10" cy="14" r="1.5" fill="currentColor" />
						<circle cx="16" cy="13" r="1.5" fill="currentColor" />
						<circle cx="13" cy="17" r="1" fill="currentColor" />
					</svg>
				</button>
			)}
		</>
	);
}
