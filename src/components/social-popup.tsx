'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Linkedin, Instagram, Facebook } from 'lucide-react';
import { XBrandIcon } from '@/components/x-brand-icon';

const STORAGE_KEY = 'vedang_social_popup_dismissed';

interface SocialChannel {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/vedangvatsa',
    icon: <Linkedin className="h-5 w-5" />,
  },
  {
    name: 'X',
    url: 'https://x.com/vedangvatsa',
    icon: <XBrandIcon className="h-4 w-4" />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/vedangvatsa',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/vedangvatsa',
    icon: <Facebook className="h-5 w-5" />,
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-background text-foreground border border-border rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-4 pt-1">
          <img
            src="/images/ved.png"
            alt="Vedang Vatsa"
            width={60}
            height={60}
            className="h-15 w-15 rounded-full object-cover border border-border/80 shadow-md"
          />
          <h2 id="social-popup-title" className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Connect with Vedang on Social Media
          </h2>

          {/* Horizontal Social Icons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            {SOCIAL_CHANNELS.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                aria-label={item.name}
                title={item.name}
                className="w-12 h-12 rounded-lg border border-border/70 bg-card hover:bg-muted hover:border-foreground/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-150 shadow-xs hover:scale-105 group"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
