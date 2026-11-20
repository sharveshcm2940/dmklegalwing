'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { IDEOLOGY_PILLARS } from '@/data/content';
import { 
  Quote, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Scale,
  Play,
  Pause
} from 'lucide-react';

export default function IdeologyPage() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 6500; // 6.5 seconds per slide
  const PROGRESS_INTERVAL = 50; // update progress every 50ms

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

  // Automatic animation timer
  useEffect(() => {
    if (isPaused) return;

    const step = (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((curr) => (curr + 1) % IDEOLOGY_PILLARS.length);
          return 0;
        }
        return prev + step;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  const selectPillar = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
  };

  const nextSlide = () => {
    selectPillar((activeIndex + 1) % IDEOLOGY_PILLARS.length);
  };

  const prevSlide = () => {
    selectPillar((activeIndex - 1 + IDEOLOGY_PILLARS.length) % IDEOLOGY_PILLARS.length);
  };

  const currentPillar = IDEOLOGY_PILLARS[activeIndex] || IDEOLOGY_PILLARS[0];

  return (
    <div className="w-full flex flex-col space-y-12 py-8 font-dmk-body bg-[#FAF7F2]">
      
      {/* 1. Manifesto Editorial Header */}
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

      {/* 3. AUTOMATICALLY ANIMATING HUMAN-DESIGNED DOCTRINE CAROUSEL */}
      <section 
        className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full space-y-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* The Human-Designed Carousel Slide Canvas */}
        <div className="relative bg-white border border-neutral-300 p-6 sm:p-12 shadow-sm overflow-hidden">
          
          {/* Subtle Top Movement Stripe with Live Auto-Advance Progress */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-200">
            <div 
              className="h-full bg-[#E31E24] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Desktop Left / Right Hover Floating Buttons */}
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

          {/* Key Identifiers: Kicker & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-neutral-900 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#E31E24] text-white text-xs font-english font-bold uppercase tracking-widest">
                {language === 'ta' ? `கோட்பாடு 0${activeIndex + 1}` : `DOCTRINE 0${activeIndex + 1}`}
              </span>
              <span className="text-xs sm:text-sm font-english font-bold text-neutral-800 uppercase tracking-wider">
                {currentPillar.subtitle[language]}
              </span>
            </div>

            <div className="text-xs font-english text-neutral-500 font-semibold hidden sm:block">
              {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி கொள்கைப் பிரகடனம்' : 'DMK Legal Wing Doctrinal Charter'}
            </div>
          </div>

          {/* Editorial Double-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Title, Narrative, Numbered Tenets, & Precedent Benchmark */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-tight">
                  {currentPillar.title[language]}
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-dmk-body mt-3">
                  {currentPillar.description[language]}
                </p>
              </div>

              {/* Core Constitutional Tenets (Dignified Editorial Numbering, No Checklist Boxes) */}
              <div className="space-y-3 pt-3 border-t border-neutral-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#E31E24]" />
                  <h3 className="text-xs font-english font-bold uppercase tracking-widest text-neutral-800">
                    {language === 'ta' ? 'அடிப்படை அரசமைப்புக் கோட்பாடுகள்' : 'CORE CONSTITUTIONAL TENETS'}
                  </h3>
                </div>

                <div className="space-y-3">
                  {currentPillar.keyPrinciples.map((kp, kIdx) => (
                    <div key={kIdx} className="flex items-start gap-3">
                      <span className="text-xs font-black font-english text-[#E31E24] mt-0.5 shrink-0">
                        0{kIdx + 1}.
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-800 font-dmk-body leading-relaxed font-medium">
                        {kp[language]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constitutional Benchmark & Landmark Precedent Callout */}
              <div className="p-4 bg-[#FAF7F2] border-l-4 border-[#E31E24] border-y border-r border-neutral-200 space-y-1">
                <span className="font-english font-bold text-[#E31E24] uppercase tracking-wider block text-xs">
                  {language === 'ta' ? 'அரசமைப்பு & தீர்ப்பு முக்கியத்துவம்:' : 'CONSTITUTIONAL BENCHMARK & PRECEDENT:'}
                </span>
                <p className="text-xs sm:text-sm font-serif italic text-neutral-800 leading-relaxed">
                  {currentPillar.legalRelevance[language]}
                </p>
              </div>

            </div>

            {/* Right Column: Historical Decree Pull-Quote */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div className="p-6 sm:p-8 bg-[#FAF7F2] border-2 border-neutral-900 shadow-sm relative space-y-5">
                
                <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
                  <span className="text-xs font-english font-bold uppercase tracking-wider text-[#E31E24]">
                    {language === 'ta' ? 'வரலாற்றுப் பிரகடனம்' : 'HISTORICAL DECREE'}
                  </span>
                  <Quote className="w-6 h-6 text-[#E31E24]" />
                </div>
                
                <blockquote className="text-base sm:text-xl font-serif italic text-neutral-900 leading-relaxed font-bold">
                  “{currentPillar.quote.text[language]}”
                </blockquote>

                <div className="pt-4 border-t border-neutral-300 space-y-1">
                  <p className="text-base font-black text-neutral-900 font-dmk-headline">
                    {currentPillar.quote.author[language]}
                  </p>
                  <p className="text-xs text-neutral-600 font-english leading-relaxed">
                    {currentPillar.quote.context[language]}
                  </p>
                </div>

              </div>

              {/* Bottom Quick Reference Link */}
              <div className="mt-6 flex items-center justify-between text-xs font-english">
                <span className="text-neutral-500 font-medium">
                  {language === 'ta' ? 'ஆவணக் களஞ்சியத்தில் முழு தீர்ப்புகள் உள்ளன' : 'Complete case briefs available in archive'}
                </span>
                <Link
                  href="/resources"
                  className="text-[#E31E24] hover:text-black font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <span>{language === 'ta' ? 'ஆவணங்கள்' : 'Case Briefs'}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Carousel Navigation Bar */}
          <div className="mt-10 pt-6 border-t border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Step Previous Button */}
            <button
              onClick={prevSlide}
              className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 border border-neutral-900 text-xs font-english font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#E31E24]" />
              <span>{language === 'ta' ? 'முந்தைய கொள்கை' : 'Previous Doctrine'}</span>
            </button>

            {/* Slide Indicators & Auto-Play Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-english font-bold uppercase tracking-wider border border-neutral-300 transition-colors cursor-pointer"
                title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-[#E31E24]" /> : <Pause className="w-3.5 h-3.5 text-[#E31E24]" />}
                <span className="text-[11px] hidden sm:inline">{isPaused ? 'Play' : 'Pause'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {IDEOLOGY_PILLARS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPillar(idx)}
                    aria-label={`Go to pillar ${idx + 1}`}
                    className={`h-2 transition-all cursor-pointer ${
                      activeIndex === idx
                        ? 'w-8 bg-[#E31E24]'
                        : 'w-2 bg-neutral-300 hover:bg-neutral-700'
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-english font-bold text-[#E31E24] ml-1">
                0{activeIndex + 1} / 06
              </span>
            </div>

            {/* Step Next Button */}
            <button
              onClick={nextSlide}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#E31E24] hover:bg-black text-white border border-neutral-900 text-xs font-english font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
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
