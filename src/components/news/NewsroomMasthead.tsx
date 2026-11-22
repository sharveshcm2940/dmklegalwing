'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { NewsItem } from '@/types';
import { Search, X, Volume2, ArrowUpRight, Flame } from 'lucide-react';

interface NewsroomMastheadProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  latestDispatches: NewsItem[];
  onSelectArticle?: (item: NewsItem) => void;
}

export const NewsroomMasthead: React.FC<NewsroomMastheadProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  latestDispatches,
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
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-600 font-english gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-neutral-900 uppercase tracking-widest text-[10px] bg-neutral-900 text-white px-2 py-0.5">
              {language === 'ta' ? 'அதிகாரப்பூர்வ செய்திப் பிரிவு' : 'OFFICIAL PRESS BUREAU'}
            </span>
            <span className="hidden sm:inline text-neutral-400">•</span>
            <span className="font-semibold text-neutral-800">
              {language === 'ta' ? 'அண்ணா அறிவாலயம், சென்னை' : 'Anna Arivalayam, Chennai — 600 018'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="font-bold text-[#C41A1F]">
              {language === 'ta' ? 'அரசமைப்புச் சட்ட ஊடக மையம்' : 'CONSTITUTIONAL MEDIA WIRE'}
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
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block" />
              <span className="text-xs font-english font-bold uppercase tracking-[0.25em] text-[#C41A1F]">
                {language === 'ta' ? 'திராவிட முன்னேற்றக் கழகம் • வழக்கறிஞர் அணி' : 'DMK LEGAL WING • EDITORIAL PRESS OFFICE'}
              </span>
            </div>

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
          <div className="border border-neutral-300 bg-white p-4 shrink-0 sm:w-80 shadow-2xs">
            <div className="text-[10px] font-english font-bold uppercase tracking-wider text-[#C41A1F] border-b border-neutral-200 pb-1 mb-2">
              {language === 'ta' ? 'ஊடகச் செயலகப் பதிவகம்' : 'SECRETARIAT DISPATCH REGISTRY'}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-english">
              <div>
                <span className="block text-neutral-500 text-[10px] uppercase">{language === 'ta' ? 'அதிகாரப்பூர்வ பதிப்புகள்' : 'Total Dispatches'}</span>
                <span className="text-lg font-black text-neutral-900 font-dmk-headline">1,480+</span>
              </div>
              <div>
                <span className="block text-neutral-500 text-[10px] uppercase">{language === 'ta' ? 'நீதிமன்ற வழக்குகள்' : 'Active Litigations'}</span>
                <span className="text-lg font-black text-[#C41A1F] font-dmk-headline">280+</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Compact Horizontal Editorial Ticker (Paused on hover) */}
        {latestDispatches.length > 0 && (
          <div className="mt-4 bg-white border border-neutral-300 flex items-stretch overflow-hidden text-xs">
            <div className="bg-neutral-900 text-white px-3 sm:px-4 py-2 font-english font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 shrink-0 z-10">
              <span className="w-2 h-2 rounded-[2px] bg-[#E31E24] animate-ping" />
              <span>{language === 'ta' ? 'உடனடிச் செய்திகள்' : 'DISPATCH WIRE'}</span>
            </div>

            <div className="relative flex-1 overflow-hidden py-2 px-3 group">
              <div className="flex items-center gap-8 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
                {latestDispatches.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectArticle && onSelectArticle(item)}
                    className="inline-flex items-center gap-2 text-neutral-800 hover:text-[#C41A1F] transition-colors text-left"
                  >
                    <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase">
                      [{item.category}]
                    </span>
                    <span className="font-semibold font-dmk-body">
                      {item.title[language]}
                    </span>
                    <span className="text-neutral-400 font-english text-[10px]">
                      • {item.date}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Editorial Category Navigation Bar & Functional Search */}
        <div className="mt-6 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Scrollable Horizontal Navigation Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`px-3.5 py-1.5 text-xs font-english font-bold uppercase tracking-wider transition-all border shrink-0 ${
                    isActive
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                      : 'bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border-neutral-300'
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
              className="w-full bg-white border border-neutral-300 pl-9 pr-8 py-2 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 font-dmk-body"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
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
