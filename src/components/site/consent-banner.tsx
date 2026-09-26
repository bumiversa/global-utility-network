'use client';

import { useState, useEffect } from 'react';

type GtagFunction = (command: string, target: string, config: Record<string, string>) => void;

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem('bumiversa_analytics_consent');
    if (!consentStatus) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBanner(true);
    } else if (consentStatus === 'granted') {
      const gtag = (window as unknown as { gtag?: GtagFunction }).gtag;
      if (gtag) {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
    }
  }, []);

  const updateGtag = (status: 'granted' | 'denied') => {
    const gtag = (window as unknown as { gtag?: GtagFunction }).gtag;
    if (gtag) {
      gtag('consent', 'update', {
        'analytics_storage': status,
        // Strict separation: Analytics consent does not imply Advertising consent
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('bumiversa_analytics_consent', 'granted');
    updateGtag('granted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('bumiversa_analytics_consent', 'denied');
    updateGtag('denied');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white p-4 shadow-lg sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-600">
          We use Google Analytics to understand how visitors interact with our utilities and improve our tools. 
          You can accept or reject analytics tracking. Your choice will be saved.{' '}
          <a href="/privacy" className="font-medium text-zinc-900 underline hover:text-zinc-700">
            Learn more in our Privacy Policy.
          </a>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Reject Analytics
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Accept Analytics
          </button>
        </div>
      </div>
    </div>
  );
}