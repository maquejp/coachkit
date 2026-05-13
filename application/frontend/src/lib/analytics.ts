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

export function trackPageView(url: string) {
  if (import.meta.env.PROD) {
    const umami = getUmami();
    if (umami?.track) {
      umami.track('page_view', { url });
    }
  }
}

export function trackEvent(name: string, data?: Record<string, string | number>) {
  const umami = getUmami();
  if (umami?.track) {
    umami.track(name, data);
  }
}
