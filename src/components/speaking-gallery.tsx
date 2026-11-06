'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { speakingEngagementImages } from '@/lib/media-data';

interface SpeakingGalleryProps {
  images?: string[];
  className?: string;
}

export function SpeakingGallery({
  images = speakingEngagementImages,
  className = '',
}: SpeakingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % images.length
    );
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  return (
    <>
      <div className={`columns-2 sm:columns-3 md:columns-4 gap-4 ${className}`}>
        {images.map((src, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative block w-full overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-zoom-in"
              aria-label={`View photo ${index + 1} full size`}
            >
              <Image
                src={src}
                alt={`Vedang Vatsa speaking at engagement ${index + 1}`}
                width={500}
                height={500}
                className="rounded-lg object-cover w-full h-auto transition-transform duration-200 group-hover:scale-[1.02]"
                data-ai-hint="person speaking"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                <span className="bg-background/80 text-foreground text-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Zoom
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in-0 duration-200"
          onClick={handleClose}
        >
          {/* Top Bar with Counter and Close Button */}
          <div
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-white/70 font-mono">
              {selectedIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/10 hover:bg-white/20 text-white p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Previous Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/25 text-white p-2.5 sm:p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/25 text-white p-2.5 sm:p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Active Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedIndex]}
              alt={`Vedang Vatsa speaking photo ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
            />
          </div>
        </div>
      )}
    </>
  );
}
