'use client';

import { useEffect, useRef, useState } from 'react';

interface TwitterEmbedProps {
  tweetId: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: Record<string, unknown>
        ) => Promise<HTMLElement | undefined>;
      };
      ready: (callback: () => void) => void;
    };
  }
}

export function TwitterEmbed({ tweetId }: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const renderTweet = async () => {
      if (!containerRef.current || cancelled) return;
      containerRef.current.innerHTML = '';

      try {
        const el = await window.twttr!.widgets.createTweet(tweetId, containerRef.current, {
          dnt: true,
          align: 'center',
        });
        if (!el && !cancelled) setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const waitForTwttr = () => {
      if (window.twttr && window.twttr.widgets) {
        renderTweet();
      } else {
        // Poll until twttr is available (script loaded via layout.tsx lazyOnload)
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.twttr && window.twttr.widgets) {
            clearInterval(interval);
            renderTweet();
          } else if (attempts > 30) {
            clearInterval(interval);
            if (!cancelled) setFailed(true);
          }
        }, 500);
      }
    };

    waitForTwttr();

    return () => { cancelled = true; };
  }, [tweetId]);

  if (failed) {
    return (
      <div className="flex justify-center min-h-[100px] items-center">
        <a
          href={`https://x.com/i/status/${tweetId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          View tweet on X →
        </a>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex justify-center min-h-[200px] items-center">
      <p className="text-muted-foreground text-sm">Loading tweet...</p>
    </div>
  );
}

