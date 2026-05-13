declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void;
    };
  }
}

function getUmami() {
  return typeof window !== 'undefined' ? window.umami : undefined;
}

export function initAnalytics() {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
  if (!websiteId || typeof document === 'undefined') return;

  const existing = document.querySelector(`script[data-website-id="${websiteId}"]`);
  if (existing) return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', websiteId);
  document.head.appendChild(script);
}

export function trackPageView(url: string) {
  const umami = getUmami();
  if (umami?.track) {
    umami.track('page_view', { url });
  }
}

export function trackEvent(name: string, data?: Record<string, string | number>) {
  const umami = getUmami();
  if (umami?.track) {
    umami.track(name, data);
  }
}
