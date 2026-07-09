'use client';

import { useState, useCallback, useEffect } from 'react';

interface ZoomableImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ZoomableImage({ src, alt = '', width, height, className = '' }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

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

  return (
    <>
      {/* Inline image with hover effect */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onClick={open}
        className={`cursor-zoom-in transition-transform duration-200 hover:scale-[1.02] ${className}`}
      />

      {/* Lightbox overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
          onClick={close}
        >
          {/* Close hint */}
          <div className="absolute top-4 right-4 text-white/60 text-sm font-medium pointer-events-none">
            ESC or click to close
          </div>

          {/* Zoomed image */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[95vw] max-h-[92vh] object-contain rounded-lg shadow-2xl cursor-default animate-in zoom-in-95 duration-200"
          />
        </div>
      )}
    </>
  );
}
