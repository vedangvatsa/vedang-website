'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Linkedin, Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import { XBrandIcon } from '@/components/x-brand-icon';

const STORAGE_KEY = 'vedang_social_popup_dismissed';

interface SocialChannel {
  name: string;
  handle: string;
  url: string;
  icon: React.ReactNode;
  badge?: string;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: 'LinkedIn',
    handle: 'in/vedangvatsa',
    url: 'https://linkedin.com/in/vedangvatsa',
    icon: <Linkedin className="h-5 w-5 text-[#0A66C2]" />,
  },
  {
    name: 'X',
    handle: '@vedangvatsa',
    url: 'https://x.com/vedangvatsa',
    icon: <XBrandIcon className="h-4 w-4 text-foreground" />,
  },
  {
    name: 'Instagram',
    handle: '@vedangvatsa',
    url: 'https://www.instagram.com/vedangvatsa',
    icon: <Instagram className="h-5 w-5 text-[#E4405F]" />,
  },
  {
    name: 'Facebook',
    handle: '@vedangvatsa',
    url: 'https://www.facebook.com/vedangvatsa',
    icon: <Facebook className="h-5 w-5 text-[#1877F2]" />,
  },
];

export function SocialPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        return;
      }
    } catch {}

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, dismiss]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-background text-foreground border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Stay Connected</p>
          <h2 id="social-popup-title" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Connect with Vedang on Social Media
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Follow along for essays, research on autonomous AI systems, and Web3 developments.
          </p>
        </div>

        {/* Social Links List */}
        <div className="space-y-2.5">
          {SOCIAL_CHANNELS.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-muted/70 hover:border-foreground/20 transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.handle}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
          ))}
        </div>

        {/* Footer Dismiss */}
        <div className="mt-5 pt-4 border-t border-border/40 text-center">
          <button
            onClick={dismiss}
            className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
