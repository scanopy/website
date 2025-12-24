'use client';

import { useEffect } from 'react';
import { initPostHog, capturePageview } from '$lib/posthog';
import { hasAnalyticsConsent } from '$lib/cookies';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = 'https://ph.scanopy.net';

export function Analytics() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    initPostHog({
      apiKey: POSTHOG_KEY,
      apiHost: POSTHOG_HOST,
    });

    // If user already consented, capture pageview
    if (hasAnalyticsConsent()) {
      capturePageview();
    }
  }, []);

  return null;
}
