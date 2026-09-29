import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function ImageGallery({ images = [], destinationName = 'Destination' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fallback = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80';
  const validImages = images && images.length > 0 ? images : [fallback];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrev, handleNext]);

  return (
    <div className="space-y-3">
      {/* Main Feature Image Container */}
      <div className="relative h-72 sm:h-96 md:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
        <img
          src={validImages[activeIndex]}
          alt={`${destinationName} - View ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer"
          onClick={() => setLightboxOpen(true)}
          loading="lazy"
        />

        {/* Expand / Lightbox trigger button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow-sm"
          title="Open Fullscreen Gallery"
          aria-label="Open Fullscreen Gallery"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Arrow Controls on Large Image */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition shadow-sm opacity-80 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition shadow-sm opacity-80 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Caption bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between text-white text-xs">
          <span className="font-medium truncate drop-shadow">{destinationName}</span>
          <span className="bg-black/40 px-2.5 py-1 rounded-full text-[11px] font-mono border border-white/20">
            {activeIndex + 1} / {validImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnails row */}
      {validImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-18 w-24 sm:h-20 sm:w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-amber-600 ring-2 ring-amber-600/30 scale-102 shadow-sm'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${destinationName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="absolute top-4 inset-x-4 max-w-6xl mx-auto flex items-center justify-between text-white z-10">
            <div>
              <h4 className="font-serif font-bold text-lg text-amber-300">{destinationName}</h4>
              <p className="text-xs text-slate-400">Photo {activeIndex + 1} of {validImages.length}</p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image */}
          <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={validImages[activeIndex]}
              alt={`${destinationName} full preview`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur transition"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur transition"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom helper tip */}
          <div className="absolute bottom-4 text-center text-xs text-slate-400">
            Use Left / Right arrow keys to navigate, Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
