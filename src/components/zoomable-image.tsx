'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ZoomableImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ZoomableImage({ src, alt = '', width, height, className = '' }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const lightbox =
    isOpen && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col bg-zinc-950"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged image"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-sm text-white/80">
              <span>Scroll to pan</span>
              <button
                type="button"
                onClick={close}
                className="rounded-md bg-white/15 px-3 py-1.5 text-white"
              >
                Close
              </button>
            </div>
            <div
              className="min-h-0 flex-1 overflow-auto overscroll-contain"
              style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
              onClick={close}
            >
              {/*
                Article CSS no longer stretches images. Lightbox still uses a
                56rem floor so 11px type on table SVGs stays readable.
              */}
              <img
                src={src}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                className="mx-auto block h-auto max-w-none bg-white"
                style={{ width: 'max(100%, 56rem)' }}
              />
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="relative mx-auto w-fit min-w-0 max-w-full">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onClick={open}
          className={`mx-auto block h-auto w-auto max-w-full cursor-zoom-in ${className}`}
        />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/55 px-2 py-1 text-[11px] font-medium text-white sm:hidden">
          Tap to enlarge
        </span>
      </div>
      {lightbox}
    </>
  );
}
