'use client';

import { useState, useEffect } from 'react';
import {
  type CookiePreferences,
  getGdprPreferences,
  saveGdprPreferences,
} from '$lib/cookies';
import {
  optInAnalytics,
  optOutAnalytics,
  isPostHogLoaded,
  getPostHog,
} from '$lib/posthog';

export function CookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
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
        getPostHog().reloadFeatureFlags();
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
    const prefs = { necessary: true, analytics: true };
    setPreferences(prefs);
    saveGdprPreferences(prefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);
    applyPreferences(prefs);
  }

  function rejectAll() {
    const prefs = { necessary: true, analytics: false };
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
            className={`fixed inset-0 z-[9998] pointer-events-none transition-colors duration-200 ${
              showSettings ? 'bg-black/50 pointer-events-auto' : 'bg-transparent'
            }`}
          />

          <div
            className={`fixed z-[9999] bg-[#1f2937] border-[#374151] p-5 ${
              showSettings
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[500px] w-[calc(100%-2rem)] border rounded-lg max-h-[90vh] overflow-y-auto'
                : 'bottom-0 left-0 right-0 border-t'
            }`}
          >
            {showSettings ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white text-base font-semibold m-0">
                    Cookie Preferences
                  </h3>
                  <button
                    onClick={closeSettings}
                    className="bg-transparent border-none text-gray-400 cursor-pointer p-1 flex items-center justify-center rounded hover:text-white hover:bg-[#374151]"
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

                <p className="text-gray-400 text-sm m-0">
                  Manage your cookie preferences below. You can enable or disable
                  different types of cookies. See our{' '}
                  <a href="/privacy" className="text-blue-400 underline hover:text-blue-300">
                    privacy policy
                  </a>{' '}
                  for more details.
                </p>

                <div className="flex flex-col gap-4 my-2">
                  <div className="bg-[#111827] border border-[#374151] rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked
                          disabled
                          className="sr-only"
                        />
                        <span className="w-5 h-5 border border-[#4b5563] rounded bg-[#374151] flex items-center justify-center opacity-60 relative after:content-[''] after:w-2 after:h-3 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:-translate-y-0.5" />
                        <span className="text-white font-medium text-[0.9375rem]">
                          Necessary
                        </span>
                      </label>
                      <span className="text-[#6b7280] text-xs uppercase tracking-wider">
                        Always on
                      </span>
                    </div>
                    <p className="text-gray-400 text-[0.8125rem] m-0 leading-relaxed">
                      Essential cookies required for the website to function.
                      These cannot be disabled.
                    </p>
                  </div>

                  <div className="bg-[#111827] border border-[#374151] rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              analytics: e.target.checked,
                            })
                          }
                          className="sr-only"
                        />
                        <span
                          className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                            preferences.analytics
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-[#4b5563] bg-[#374151] hover:border-[#6b7280]'
                          }`}
                        >
                          {preferences.analytics && (
                            <span className="w-2 h-3 border-white border-r-2 border-b-2 rotate-45 -translate-y-0.5" />
                          )}
                        </span>
                        <span className="text-white font-medium text-[0.9375rem]">
                          Analytics
                        </span>
                      </label>
                    </div>
                    <p className="text-gray-400 text-[0.8125rem] m-0 leading-relaxed">
                      Help us understand how visitors interact with our website
                      by collecting anonymous usage data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end flex-wrap pt-2 border-t border-[#374151]">
                  <button
                    onClick={rejectAll}
                    className="px-4 py-2 rounded-md font-medium text-sm cursor-pointer transition-colors bg-transparent text-gray-400 border border-[#374151] hover:bg-[#374151] hover:border-[#4b5563] hover:text-gray-200"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 rounded-md font-medium text-sm cursor-pointer transition-colors bg-transparent text-gray-400 border border-[#374151] hover:bg-[#374151] hover:border-[#4b5563] hover:text-gray-200"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={savePrefs}
                    className="px-4 py-2 rounded-md font-medium text-sm cursor-pointer transition-colors bg-blue-700 text-white border border-blue-600 hover:bg-blue-600 hover:border-blue-500"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-[1200px] mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-base font-semibold m-0 mb-1">
                    Cookie Settings
                  </h3>
                  <p className="text-gray-400 text-sm m-0">
                    We use cookies to improve your experience and analyze site
                    traffic. See our{' '}
                    <a
                      href="/privacy"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      privacy policy
                    </a>{' '}
                    for details.
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <button
                    onClick={openSettings}
                    className="px-4 py-2 rounded-md font-medium text-sm cursor-pointer transition-colors bg-transparent text-gray-400 border border-transparent underline hover:text-gray-200"
                  >
                    Customize
                  </button>
                  <button
                    onClick={rejectAll}
                    className="px-4 py-2 rounded-md font-medium text-sm cursor-pointer transition-colors bg-transparent text-gray-400 border border-[#374151] hover:bg-[#374151] hover:border-[#4b5563] hover:text-gray-200"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 rounded-md font-medium text-sm cursor-pointer transition-colors bg-blue-700 text-white border border-blue-600 hover:bg-blue-600 hover:border-blue-500"
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
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-[#1f2937] border border-[#374151] text-gray-400 cursor-pointer flex items-center justify-center shadow-lg z-[9999] transition-colors hover:bg-[#374151] hover:text-white"
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
