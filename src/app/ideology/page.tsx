'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { IDEOLOGY_PILLARS } from '@/data/content';
import { 
  Quote, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function IdeologyPage() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync with URL hash if present (e.g. #federalism)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const foundIdx = IDEOLOGY_PILLARS.findIndex(p => p.id === hashId);
      if (foundIdx !== -1) {
        setActiveIndex(foundIdx);
      }
    }
  }, []);

  const currentPillar = IDEOLOGY_PILLARS[activeIndex] || IDEOLOGY_PILLARS[0];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % IDEOLOGY_PILLARS.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + IDEOLOGY_PILLARS.length) % IDEOLOGY_PILLARS.length);
  };

  return (
    <div className="w-full flex flex-col space-y-12 py-8 font-dmk-body bg-[#FAF7F2]">
      
      {/* 1. Manifesto Editorial Header (Clean Border, No Shadow Box) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border-b-2 border-neutral-900 pb-6 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-english font-bold text-[#E31E24] tracking-[0.2em] uppercase">
              {language === 'ta' ? 'திராவிட இயக்கக் கொள்கைப் பிரகடனம்' : 'DRAVIDIAN JURISPRUDENCE & FOUNDING DOCTRINE'}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-xs font-english text-neutral-500 font-bold">MANIFESTO OF EGALITARIAN JUSTICE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-tight mb-4">
            {language === 'ta'
              ? 'நீதிமன்றங்களில் சமூக நீதி: நமது கொள்கை அடித்தளம்'
              : 'The Ideological Pillars of Dravidian Constitutional Jurisprudence'}
          </h1>

          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-serif italic border-l-4 border-[#E31E24] pl-4 py-1 max-w-4xl bg-[#F3EFE6]">
            {language === 'ta'
              ? 'தந்தை பெரியார், பேரறிஞர் அண்ணா, முத்தமிழறிஞர் கலைஞர் வகுத்தளித்த சமூக நீதி, சுயமரியாதை, பகுத்தறிவு மற்றும் மாநில சுயாட்சிக் கொள்கைகளை இந்திய அரசமைப்பின் சட்டப் பாதுகாப்போடு இணைக்கும் வழிகாட்டி நெறிமுறைகள்.'
              : 'Rooted in the century-long struggle of the Dravidian movement. Our jurisprudence synthesizes egalitarian social reform with rigorous constitutional scholarship to defend human dignity, linguistic pride, and federal autonomy.'}
          </p>
        </div>
      </section>

      {/* 2. Grand Ideological Tribute: The Four Visionary Leaders Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border border-neutral-900 bg-[#2A1208] overflow-hidden">
          <div className="relative w-full h-64 sm:h-80 md:h-[400px] overflow-hidden flex items-center justify-center bg-[#2A1208]">
            <img
              src="/images/dmk-four-leaders.jpg"
              alt="கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
              className="w-full h-full object-cover object-center filter saturate-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 text-white">
              <div className="space-y-1.5 max-w-2xl">
                <span className="text-[10px] sm:text-xs font-english font-bold tracking-widest text-[#FFD166] uppercase bg-black/85 px-3 py-1 border border-[#FFD166]/40 inline-block">
                  {language === 'ta' ? 'அடிப்படை வழிகாட்டுதல்' : 'GUIDING PRINCIPLE'}
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-dmk-slogan text-[#FFE8A3] leading-tight">
                  "கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
                </h2>
              </div>
              <span className="text-xs font-dmk-headline text-neutral-200 font-bold bg-black/85 px-3.5 py-1.5 border border-white/20 shrink-0">
                பெரியார் • அண்ணா • கலைஞர் • ஸ்டாலின்
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DOCTRINE CAROUSEL (Carousel Edition) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full space-y-6">
        
        {/* Carousel Navigation Bar (Selector Tabs across all 6 Pillars) */}
        <div className="bg-white border-y-2 border-neutral-900 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#E31E24]" />
              <span className="text-xs font-english font-bold uppercase tracking-wider text-neutral-800">
                {language === 'ta' ? 'கொள்கைக் கோட்பாடுகள் தெரிவு' : 'SELECT DOCTRINAL PILLAR'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-english font-bold text-neutral-600">
              <span className="text-[#E31E24]">
                {language === 'ta' ? `தூண் 0${activeIndex + 1} / 06` : `PILLAR 0${activeIndex + 1} OF 06`}
              </span>
            </div>
          </div>

          {/* Quick-Jump Tabs for all 6 Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {IDEOLOGY_PILLARS.map((p, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-3 py-2 text-xs font-english font-bold uppercase tracking-wider transition-all border text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#E31E24] text-white border-[#E31E24] shadow-sm'
                      : 'bg-[#FAF7F2] text-neutral-700 hover:text-black hover:bg-white border-neutral-300'
                  }`}
                >
                  <span className={`text-[11px] block font-black ${isSelected ? 'text-white/80' : 'text-[#E31E24]'}`}>
                    § {p.number}
                  </span>
                  <span className="truncate block font-dmk-headline font-bold text-xs mt-0.5">
                    {p.title[language]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Active Carousel Article Card */}
        <div className="relative bg-white border border-neutral-300 p-6 sm:p-10 shadow-sm transition-all duration-300">
          
          {/* Previous / Next Desktop Floating Buttons */}
          <button
            onClick={prevSlide}
            aria-label="Previous Doctrine"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-[#E31E24] hover:text-white text-neutral-900 border border-neutral-900 items-center justify-center transition-colors shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Doctrine"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-[#E31E24] hover:text-white text-neutral-900 border border-neutral-900 items-center justify-center transition-colors shadow-md cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Top Identifier Bar */}
          <div className="flex flex-wrap items-center gap-3 border-b-2 border-neutral-900 pb-4 mb-6">
            <span className="text-3xl sm:text-4xl font-black text-[#E31E24] font-english">
              § {currentPillar.number}
            </span>
            <div className="h-6 w-[2px] bg-neutral-900 hidden sm:block" />
            <span className="text-xs sm:text-sm font-english font-bold text-neutral-600 uppercase tracking-wider">
              {currentPillar.subtitle[language]}
            </span>
          </div>

          {/* Two-Column Broadsheet Presentation (Matching Reference Design) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Title, Overview, Tenets, & Benchmark */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-snug">
                  {currentPillar.title[language]}
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-dmk-body mt-3">
                  {currentPillar.description[language]}
                </p>
              </div>

              {/* Core Constitutional Tenets Checklist */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-english font-bold text-neutral-700 uppercase tracking-wider border-b border-neutral-300 pb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E31E24] rounded-full inline-block" />
                  <span>{language === 'ta' ? 'அடிப்படை சட்டக் கோட்பாடுகள்:' : 'CORE CONSTITUTIONAL TENETS:'}</span>
                </h4>
                <div className="space-y-2">
                  {currentPillar.keyPrinciples.map((kp, kIdx) => (
                    <div 
                      key={kIdx} 
                      className="flex items-start gap-3 p-3 bg-[#FAF7F2] border-l-2 border-[#E31E24] text-xs sm:text-sm text-neutral-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                      <span className="font-dmk-body font-medium leading-relaxed">{kp[language]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constitutional Benchmark Box */}
              <div className="p-4 bg-[#FAF7F2] border-l-4 border-neutral-900 text-xs sm:text-sm text-neutral-900 space-y-1">
                <span className="font-english font-bold text-[#E31E24] uppercase tracking-wider block text-xs">
                  {language === 'ta' ? 'அரசமைப்பு & தீர்ப்பு முக்கியத்துவம்:' : 'CONSTITUTIONAL BENCHMARK:'}
                </span>
                <p className="leading-relaxed font-serif italic text-neutral-800">
                  {currentPillar.legalRelevance[language]}
                </p>
              </div>
            </div>

            {/* Right Column: Historical Decree Quote Banner */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 bg-[#FAF7F2] border-t-2 border-b-2 border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
                  <span className="text-xs font-english font-bold uppercase tracking-wider text-[#E31E24]">
                    HISTORICAL DECREE
                  </span>
                  <Quote className="w-6 h-6 text-[#E31E24]" />
                </div>
                
                <blockquote className="text-base sm:text-xl font-serif italic text-neutral-900 leading-relaxed font-bold">
                  “{currentPillar.quote.text[language]}”
                </blockquote>

                <div className="pt-4 border-t border-neutral-300 space-y-1">
                  <span className="text-base font-bold text-neutral-900 block font-dmk-headline">
                    {currentPillar.quote.author[language]}
                  </span>
                  <span className="text-xs text-neutral-600 font-english block">
                    {currentPillar.quote.context[language]}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Carousel Controls Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Step Previous Button */}
            <button
              onClick={prevSlide}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 border border-neutral-900 text-xs font-english font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#E31E24]" />
              <span>{language === 'ta' ? 'முந்தைய கொள்கை' : 'Previous Doctrine'}</span>
            </button>

            {/* Slide Dot Indicators */}
            <div className="flex items-center gap-2">
              {IDEOLOGY_PILLARS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to pillar ${idx + 1}`}
                  className={`h-2 transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'w-8 bg-[#E31E24]'
                      : 'w-2 bg-neutral-300 hover:bg-neutral-600'
                  }`}
                />
              ))}
            </div>

            {/* Step Next Button */}
            <button
              onClick={nextSlide}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#E31E24] hover:bg-neutral-900 text-white border border-neutral-900 text-xs font-english font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>{language === 'ta' ? 'அடுத்த கொள்கை' : 'Next Doctrine'}</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

          </div>

        </div>

      </section>

      {/* 4. Bottom Broadsheet Proclamation Call to Action */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full pt-6">
        <div className="p-6 sm:p-8 bg-[#111111] text-white border-t-4 border-[#E31E24] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-english font-bold text-[#E31E24] uppercase tracking-wider">
              OFFICIAL REPOSITORIES
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-dmk-headline">
              {language === 'ta' ? 'வரலாற்றுத் தீர்ப்புகள் மற்றும் சட்ட ஆவணங்களை வாசிக்க' : 'Access Authoritative Legal Briefs & Dossiers'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-serif italic">
              {language === 'ta'
                ? '69% இடஒதுக்கீடு சட்டம், ராஜமன்னார் குழு அறிக்கை மற்றும் ஆளுநர் அதிகார வரம்புத் தீர்ப்புகள் அடங்கிய களஞ்சியம்.'
                : 'Explore primary texts including the 69% reservation compendium, Rajamannar report, and landmark Supreme Court rulings.'}
            </p>
          </div>

          <Link
            href="/resources"
            className="px-6 py-2.5 bg-[#E31E24] hover:bg-white hover:text-black text-white text-xs font-english font-bold uppercase tracking-wider shrink-0 transition-colors border border-white font-dmk-headline"
          >
            {language === 'ta' ? 'சட்ட ஆவணக் களஞ்சியம்' : 'Explore Legal Resources'}
          </Link>
        </div>
      </section>

    </div>
  );
}
