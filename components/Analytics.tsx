'use client';

import { useEffect } from 'react';

// Simple analytics tracking component
export function Analytics() {
  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      if (typeof window !== 'undefined') {
        // Simple analytics - you can replace with Google Analytics, Mixpanel, etc.
        // Example: Send to analytics service
        // gtag('config', 'GA_MEASUREMENT_ID', {
        //   page_path: window.location.pathname,
        // });
      }
    };

    // Track CTA clicks
    const trackCTAClick = (ctaName: string) => {
      if (typeof window !== 'undefined')
        console.log(`CTA ${ctaName} clicked`);
      // Example: Send to analytics service
      // gtag('event', 'cta_click', {
      //   event_category: 'engagement',
      //   event_label: ctaName,
      // });
    };

    // Track app store downloads
    const trackAppDownload = (store: string) => {
      if (typeof window !== 'undefined')
        console.log(`App download from ${store}`);
      // Example: Send to analytics service
      // gtag('event', 'app_download', {
      //   event_category: 'conversion',
      //   event_label: store,
      // });
    };

    // Add event listeners for tracking
    const addTrackingListeners = () => {
      // Track all CTA buttons
      const ctaButtons = document.querySelectorAll('[data-track-cta]');
      ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const ctaName = (e.target as HTMLElement).getAttribute('data-track-cta');
          if (ctaName) trackCTAClick(ctaName);
        });
      });

      // Track app store links
      const appStoreLinks = document.querySelectorAll('[href*="apps.apple.com"], [href*="play.google.com"]');
      appStoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = (e.target as HTMLElement).getAttribute('href');
          if (href?.includes('apps.apple.com')) {
            trackAppDownload('app_store');
          } else if (href?.includes('play.google.com')) {
            trackAppDownload('google_play');
          }
        });
      });
    };

    trackPageView();
    addTrackingListeners();

    // Cleanup
    return () => {
      const ctaButtons = document.querySelectorAll('[data-track-cta]');
      ctaButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
      
      const appStoreLinks = document.querySelectorAll('[href*="apps.apple.com"], [href*="play.google.com"]');
      appStoreLinks.forEach(link => {
        link.removeEventListener('click', () => {});
      });
    };
  }, []);

  return null; // This component doesn't render anything
}

// Hook for tracking custom events
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.log(`Event: ${eventName}`, properties);
      // Example: Send to analytics service
      // gtag('event', eventName, properties);
    }
  };

  const trackPageView = (pageName: string) => {
    if (typeof window !== 'undefined') {
      console.log(`Page view: ${pageName}`);
      // Example: Send to analytics service
      // gtag('event', 'page_view', {
      //   page_title: pageName,
      //   page_location: window.location.href,
      // });
    }
  };

  return { trackEvent, trackPageView };
}
