'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

// Replace with your actual GA4 measurement ID
const MEASUREMENT_ID = 'G-RQTEP9TM87';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    // Track page views on route changes
    const url = pathname + searchParams.toString();
    ReactGA.send({ hitType: "pageview", page: url });
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
} 