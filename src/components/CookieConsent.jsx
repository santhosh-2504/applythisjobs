import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('applythisjobs_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('applythisjobs_cookie_consent', 'true');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('applythisjobs_cookie_consent', 'false');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-900 text-white p-4 z-50 border-t border-gray-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
          We use cookies and analytical technologies to enhance your experience and analyze web traffic in accordance with our{' '}
          <Link href="/privacy-policy" className="underline text-blue-400 hover:text-blue-300">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={accept}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
