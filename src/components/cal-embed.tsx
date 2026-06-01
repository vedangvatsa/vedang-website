'use client';

import { useEffect, useState } from 'react';

function CalSkeleton() {
  return (
    <div className="animate-pulse" style={{ minHeight: '500px' }}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left panel skeleton */}
        <div className="md:w-[280px] space-y-4 p-4">
          <div className="w-12 h-12 bg-muted rounded-full" />
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-40" />
          <div className="flex gap-2 mt-4">
            <div className="h-8 bg-muted rounded-full w-14" />
            <div className="h-8 bg-muted rounded-full w-14" />
            <div className="h-8 bg-muted rounded-full w-12" />
          </div>
          <div className="h-4 bg-muted rounded w-36 mt-2" />
          <div className="h-4 bg-muted rounded w-44" />
        </div>
        {/* Calendar skeleton */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-muted rounded w-28" />
            <div className="flex gap-2">
              <div className="h-6 w-6 bg-muted rounded" />
              <div className="h-6 w-6 bg-muted rounded" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`h-${i}`} className="h-4 bg-muted rounded w-8 mx-auto" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={`d-${i}`} className="h-9 bg-muted/60 rounded w-9 mx-auto" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalEmbed() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Cal.com inline embed
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = (cal.q || []) as any[];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = (api.q || []) as any[];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    const Cal = (window as any).Cal;
    Cal('init', '30min', { origin: 'https://app.cal.com' });

    Cal.ns['30min']('inline', {
      elementOrSelector: '#my-cal-inline-30min',
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
      calLink: 'vedangvatsa/30min',
    });

    Cal.ns['30min']('ui', { hideEventTypeDetails: false, layout: 'month_view' });

    // Detect when the iframe loads to hide skeleton
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector('#my-cal-inline-30min iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.addEventListener('load', () => setLoaded(true));
        // Fallback in case load already fired
        if (iframe.contentWindow) {
          setTimeout(() => setLoaded(true), 2000);
        }
        observer.disconnect();
      }
    });
    observer.observe(document.getElementById('my-cal-inline-30min')!, {
      childList: true,
      subtree: true,
    });

    // Final fallback
    const timeout = setTimeout(() => setLoaded(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {!loaded && <CalSkeleton />}
      <div
        id="my-cal-inline-30min"
        style={{
          width: '100%',
          minHeight: '500px',
          marginBottom: '-30px',
          opacity: loaded ? 1 : 0,
          position: loaded ? 'relative' : 'absolute',
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
