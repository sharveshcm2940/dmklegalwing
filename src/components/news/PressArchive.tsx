'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PressGalleryItem } from '@/types';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  MapPin, 
  Calendar, 
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

interface PressArchiveProps {
  items: PressGalleryItem[];
}

export const PressArchive: React.FC<PressArchiveProps> = ({ items }) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Press Conferences',
    'Legal Wing Events',
    'Advocates Meetings',
    'Official Programmes',
    'Historical Archive'
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  // Modal navigation handlers
  const handlePrev = useCallback(() => {
    if (viewerIndex === null) return;
    setViewerIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
  }, [viewerIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (viewerIndex === null) return;
    setViewerIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
  }, [viewerIndex, filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewerIndex === null) return;
      if (e.key === 'Escape') setViewerIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerIndex, handlePrev, handleNext]);

  const activePhoto = viewerIndex !== null ? filteredItems[viewerIndex] : null;

  // Split into 1 hero photo + remaining photos for asymmetrical layout
  const heroPhoto = filteredItems[0];
  const sidePhotos = filteredItems.slice(1, 4);

  return (
    <section className="w-full font-dmk-body">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-neutral-900 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Camera className="w-4 h-4 text-[#E31E24]" />
            <span className="text-[11px] font-english font-bold uppercase tracking-[0.25em] text-[#E31E24]">
              {language === 'ta' ? 'அதிகாரப்பூர்வ நிழற்படக் காப்பகம்' : 'OFFICIAL DOCUMENTARY PRESS ARCHIVE'}
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 font-dmk-headline tracking-tight uppercase">
            {language === 'ta' ? 'செய்தியாளர் புகைப்படக் கூடம்' : 'ARCHIVAL PRESS GALLERY'}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-700 font-dmk-body mt-1 max-w-2xl">
            {language === 'ta'
              ? 'திமுக வழக்கறிஞர் அணியின் முக்கிய செய்தியாளர் சந்திப்புகள், மாநில மாநாடுகள், களப் போராட்டங்கள் மற்றும் வரலாற்றுத் தருணங்களின் புகைப்படத் தொகுப்பு.'
              : 'Authentic documentary photography chronicling press conferences, state summits, legal conventions, and historical movement milestones.'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setViewerIndex(null);
              }}
              className={`px-3 py-1 text-xs font-english transition-all border shrink-0 ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                  : 'bg-white text-neutral-700 hover:border-neutral-900 border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetrical Magazine-Inspired Photography Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-white border border-neutral-300 text-neutral-500 text-xs">
          {language === 'ta' ? 'இப்பிரிவில் புகைப்படங்கள் எதுவும் இல்லை.' : 'No photographs available in this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Hero Large Photograph (7 of 12 cols on lg) */}
          {heroPhoto && (
            <div 
              onClick={() => setViewerIndex(0)}
              className="lg:col-span-7 bg-white border-2 border-neutral-900 p-3 cursor-pointer group shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                <img
                  src={heroPhoto.image}
                  alt={heroPhoto.title[language]}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                />

                <div className="absolute top-3 left-3 bg-[#E31E24] text-white text-[10px] font-english font-bold uppercase tracking-widest px-2.5 py-0.5">
                  {heroPhoto.category}
                </div>

                <div className="absolute bottom-3 right-3 bg-neutral-900/80 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-english text-neutral-500">
                  <span className="flex items-center gap-1 font-bold text-neutral-900">
                    <MapPin className="w-3 h-3 text-[#E31E24]" />
                    {heroPhoto.location[language]}
                  </span>
                  <span>{heroPhoto.date}</span>
                </div>

                <h4 className="text-xl font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors">
                  {heroPhoto.title[language]}
                </h4>

                <p className="text-xs text-neutral-600 font-dmk-body line-clamp-2">
                  {heroPhoto.caption[language]}
                </p>
              </div>
            </div>
          )}

          {/* Secondary Stacked Column (5 of 12 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {sidePhotos.map((photo, sIndex) => {
              const originalIndex = sIndex + 1;
              return (
                <div
                  key={photo.id}
                  onClick={() => setViewerIndex(originalIndex)}
                  className="bg-white border-2 border-neutral-900 p-2.5 cursor-pointer group flex flex-col sm:flex-row gap-3 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="relative sm:w-44 aspect-[16/10] sm:aspect-auto sm:h-28 shrink-0 overflow-hidden bg-neutral-950">
                    <img
                      src={photo.image}
                      alt={photo.title[language]}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-neutral-900 text-white text-[9px] font-english font-bold uppercase px-1.5 py-0.2">
                      {photo.category}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between p-1">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-english text-neutral-500 mb-1">
                        <span className="truncate">{photo.location[language]}</span>
                        <span className="shrink-0">{photo.date}</span>
                      </div>
                      <h5 className="text-sm font-bold text-neutral-900 font-dmk-headline line-clamp-2 group-hover:text-[#E31E24] transition-colors leading-snug">
                        {photo.title[language]}
                      </h5>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-english uppercase pt-1">
                      {language === 'ta' ? 'பெரிதாக்க சொடுக்கவும்' : 'Click to inspect'} &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Lightbox / Fullscreen Image Modal */}
      {activePhoto && viewerIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={() => setViewerIndex(null)}
        >
          <div 
            className="bg-white border-2 border-neutral-900 max-w-4xl w-full overflow-hidden shadow-2xl relative font-dmk-body"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top red header hairline */}
            <div className="h-1 bg-[#E31E24] w-full" />

            {/* Close Button */}
            <button
              onClick={() => setViewerIndex(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-neutral-900 text-white hover:bg-[#E31E24] transition-colors flex items-center justify-center font-bold"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Big Image Viewer Container */}
            <div className="relative aspect-[16/10] bg-neutral-950 flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.image}
                alt={activePhoto.title[language]}
                className="max-h-[70vh] w-full object-contain"
              />

              {/* Prev / Next Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-900/80 hover:bg-[#E31E24] text-white flex items-center justify-center transition-colors shadow-md"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-900/80 hover:bg-[#E31E24] text-white flex items-center justify-center transition-colors shadow-md"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Information Banner Below Image */}
            <div className="p-5 sm:p-6 bg-white space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-english border-b border-neutral-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E31E24] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {activePhoto.category}
                  </span>
                  <span className="font-bold text-neutral-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E31E24]" />
                    {activePhoto.location[language]}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-neutral-600">
                  <time className="font-medium">{activePhoto.date}</time>
                  <span>({viewerIndex + 1} of {filteredItems.length})</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 font-dmk-headline">
                {activePhoto.title[language]}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body">
                {activePhoto.caption[language]}
              </p>

              {activePhoto.photographer && (
                <div className="text-[10px] font-english text-neutral-500 uppercase tracking-wider pt-1">
                  Photo Credit: {activePhoto.photographer}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
