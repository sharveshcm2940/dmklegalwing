'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { NewsItem } from '@/types';
import { Search, X, Volume2, ArrowUpRight, Flame } from 'lucide-react';

interface CourtHearingItem {
  id: string;
  court: string;
  caseNumber?: string;
  caseTitle: { en: string; ta: string };
  nextHearing: string;
}

interface NewsroomMastheadProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  courtHearingItems?: CourtHearingItem[];
  onSelectArticle?: (item: NewsItem) => void;
}

export const NewsroomMasthead: React.FC<NewsroomMastheadProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  courtHearingItems = [],
  onSelectArticle
}) => {
  const { language } = useLanguage();

  const [todayDateString, setTodayDateString] = React.useState<string>('Friday, 20 November 2026');

  // Format today's date in editorial style after mount to avoid SSR prerender discrepancy
  React.useEffect(() => {
    const now = new Date();
    if (language === 'ta') {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setTodayDateString(now.toLocaleDateString('ta-IN', options));
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setTodayDateString(now.toLocaleDateString('en-GB', options));
    }
  }, [language]);

  return (
    <header className="w-full bg-[#FAF7F2] border-b-2 border-neutral-900 font-dmk-body">
      
      {/* 1. Top Newspaper Header Strip: Location, Bureau Label, Live Date */}
      <div className="border-b border-neutral-300 py-2.5 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-600 font-dmk-body gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-900 text-xs font-dmk-body">
              {language === 'ta' ? 'அதிகாரப்பூர்வ செய்திப் பிரிவு' : 'Official press bureau'}
            </span>
            <span className="hidden sm:inline text-neutral-400">•</span>
            <span className="font-medium text-neutral-800">
              {language === 'ta' ? 'அண்ணா அறிவாலயம், சென்னை' : 'Anna Arivalayam, Chennai — 600 018'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-dmk-body">
            <span className="font-semibold text-[#C41A1F]">
              {language === 'ta' ? 'அரசமைப்புச் சட்ட ஊடக மையம்' : 'Constitutional media wire'}
            </span>
            <span className="text-neutral-400">•</span>
            <time className="font-medium text-neutral-900">
              {todayDateString}
            </time>
          </div>
        </div>
      </div>

      {/* 2. Main Editorial Masthead Branding */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-neutral-900 pb-8">
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-900 font-dmk-headline tracking-tight uppercase leading-[0.95]">
              {language === 'ta' 
                ? 'செய்திகள். அறிக்கைகள். சட்டப் போராட்டங்கள்.'
                : 'NEWS. STATEMENTS. LEGAL DEVELOPMENTS.'}
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-dmk-body pt-1">
              {language === 'ta'
                ? 'திமுக வழக்கறிஞர் அணி தலைமைச் செயலகம் வெளியிடும் அதிகாரப்பூர்வ அறிக்கைகள், தீர்மானங்கள், உச்ச நீதிமன்ற & உயர் நீதிமன்ற வழக்கு முன்னேற்றங்கள் மற்றும் அரசமைப்புச் சட்ட அறிவிப்புகள்.'
                : 'The official institutional wire for press releases, constitutional statements, state resolutions, court proceeding dispatches, and statutory gazette communiqués from the DMK Legal Wing.'}
            </p>
          </div>

          {/* Quick Institutional Stats Stamp */}
          <div className="border border-neutral-300 bg-white p-4 shrink-0 sm:w-80 shadow-2xs rounded-[2px]">
            <div className="text-xs font-dmk-body font-bold text-[#C41A1F] border-b border-neutral-200 pb-1 mb-2">
              {language === 'ta' ? 'ஊடகச் செயலகப் பதிவகம்' : 'Secretariat dispatch registry'}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-dmk-body">
              <div>
                <span className="block text-neutral-500 text-[11px]">{language === 'ta' ? 'அதிகாரப்பூர்வ பதிப்புகள்' : 'Total Dispatches'}</span>
                <span className="text-lg font-black text-neutral-900 font-dmk-headline">1,480+</span>
              </div>
              <div>
                <span className="block text-neutral-500 text-[11px]">{language === 'ta' ? 'நீதிமன்ற வழக்குகள்' : 'Active Litigations'}</span>
                <span className="text-lg font-black text-[#C41A1F] font-dmk-headline">280+</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Court Ticker: Rendered ONLY if real hearing dates exist in data */}
        {courtHearingItems && courtHearingItems.length > 0 && (
          <div className="mt-4 bg-white border border-[#D8D3CB] flex items-stretch overflow-hidden text-xs rounded-[2px]">
            <div className="bg-[#111111] text-white px-3 sm:px-4 py-2 font-english font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 shrink-0 z-10">
              <span className="w-2 h-2 rounded-[2px] bg-[#E31E24] animate-ping" />
              <span>{language === 'ta' ? 'நீதிமன்ற விசாரணைப் பட்டியல்' : 'COURT HEARING TICKER'}</span>
            </div>

            <div className="relative flex-1 overflow-hidden py-2 px-3 group">
              <div className="flex items-center gap-8 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
                {courtHearingItems.map((item) => (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-2 text-[#111111] text-left"
                  >
                    <span className="font-bold text-[#C41A1F] uppercase text-[10px] font-english">
                      [{item.court}]
                    </span>
                    <span className="font-semibold font-dmk-body">
                      {item.caseTitle[language]}
                    </span>
                    <span className="text-[#5B5348] font-english text-[11px] font-medium">
                      • {language === 'ta' ? 'அடுத்த விசாரணை:' : 'Next Hearing:'} {item.nextHearing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Editorial Category Navigation Bar & Functional Search */}
        <div className="mt-6 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Square-cornered text tabs with 3px red underline on active tab, min 44px tall */}
          <div className="flex items-center gap-2 border-b border-[#D8D3CB] overflow-x-auto pb-0 scrollbar-none w-full md:w-auto">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`min-h-[44px] px-4 py-2 text-xs font-dmk-body font-bold transition-all border-b-[3px] rounded-none shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-[#E31E24] text-[#111111]'
                      : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:border-[#D8D3CB]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Functional Search Field */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={language === 'ta' ? 'அறிக்கைகள் அல்லது வழக்குகளைத் தேடுக...' : 'Search dispatches, orders, or dates...'}
              className="w-full min-h-[44px] bg-white border border-[#D8D3CB] pl-9 pr-8 py-2 text-xs text-[#111111] placeholder-[#5B5348] focus:outline-none focus:border-[#111111] font-dmk-body rounded-[2px]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5B5348] hover:text-[#111111] cursor-pointer p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </header>
  );
};
