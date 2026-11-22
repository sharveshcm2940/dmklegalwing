'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { NewsItem } from '@/types';
import { ArrowRight, Clock, MapPin, Shield, Calendar, ExternalLink } from 'lucide-react';

interface LeadStoryProps {
  story: NewsItem;
  onReadMore?: (story: NewsItem) => void;
}

export const LeadStory: React.FC<LeadStoryProps> = ({ story, onReadMore }) => {
  const { language } = useLanguage();

  if (!story) return null;

  return (
    <article className="w-full bg-white border-2 border-neutral-900 shadow-sm overflow-hidden font-dmk-body">
      
      {/* Top Editorial Label Bar */}
      <div className="bg-[#FAF7F2] border-b border-neutral-300 px-4 sm:px-6 py-2 flex items-center justify-between text-[11px] font-english">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#E31E24]" />
          <span className="font-bold text-[#C41A1F] uppercase tracking-widest">
            {language === 'ta' ? 'முக்கியச் செய்தி • முதன்மை அறிக்கை' : 'LEAD EDITORIAL DISPATCH'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-600">
          <Calendar className="w-3 h-3 text-neutral-400" />
          <time className="font-medium">{story.date}</time>
          {story.time && <span>• {story.time}</span>}
          {story.readTime && (
            <span className="hidden sm:inline bg-white px-2 py-0.5 border border-neutral-200 text-neutral-700">
              {story.readTime}
            </span>
          )}
        </div>
      </div>

      {/* Asymmetrical Split Composition: 60% Left Photo / 40% Right Copy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-neutral-900">
        
        {/* Left Side: 60% Width (7 of 12 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-neutral-950 text-white relative group overflow-hidden">
          
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[460px] w-full overflow-hidden bg-neutral-900">
            <img
              src={story.image || '/images/dmk-slider-official.jpg'}
              alt={story.title[language]}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
            />

            {/* Overlaid Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[#E31E24] text-white px-3 py-1 text-xs font-english font-bold uppercase tracking-widest shadow-md">
                {story.category}
              </span>
            </div>

            {/* Overlaid Court or Jurisdiction Tag if present */}
            {story.court && (
              <div className="absolute top-4 right-4 z-10 hidden sm:block">
                <span className="bg-neutral-900/90 text-white border border-neutral-700 px-2.5 py-1 text-[11px] font-english font-semibold">
                  {story.court}
                </span>
              </div>
            )}
          </div>

          {/* Authentic Photo Credit and Caption Strip */}
          <div className="bg-[#151515] text-neutral-300 px-4 py-2.5 border-t border-neutral-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-english">
            <p className="line-clamp-1 italic text-neutral-300 text-[11px]">
              {story.caption ? story.caption[language] : (story.title[language])}
            </p>
            {story.photoCredit && (
              <span className="text-[10px] text-neutral-400 shrink-0 uppercase tracking-wider">
                Photo: {story.photoCredit}
              </span>
            )}
          </div>

        </div>

        {/* Right Side: 40% Width (5 of 12 cols on lg) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-between text-xs text-neutral-500 font-english border-b border-neutral-200 pb-2">
              <span className="font-bold text-[#C41A1F] uppercase tracking-wider">
                {story.issuingAuthority ? story.issuingAuthority[language] : (language === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமை' : 'DMK Legal Wing Secretariat')}
              </span>
              {story.caseNumber && (
                <span className="font-mono text-[10px] text-neutral-600 bg-[#FAF7F2] px-2 py-0.5 border border-neutral-300">
                  {story.caseNumber}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-black text-neutral-900 font-dmk-headline leading-[1.15] tracking-tight group-hover:text-[#E31E24] transition-colors">
              <Link href={`/news/${story.id}`}>
                {story.title[language]}
              </Link>
            </h2>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-dmk-body border-l-2 border-[#E31E24] pl-3.5 py-0.5">
              {story.summary[language]}
            </p>

            {story.author && (
              <div className="pt-2 text-xs font-english text-neutral-600">
                <span className="text-neutral-400">{language === 'ta' ? 'அறிக்கை வெளியீடு: ' : 'Official Dispatch by: '}</span>
                <span className="font-bold text-neutral-900">{story.author[language]}</span>
              </div>
            )}

          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-neutral-200 flex items-center justify-between">
            <Link
              href={`/news/${story.id}`}
              className="inline-flex items-center gap-2 bg-[#E31E24] hover:bg-neutral-900 text-white px-5 py-2.5 text-xs font-english font-bold uppercase tracking-wider transition-colors"
            >
              <span>{language === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'READ FULL STATEMENT'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <span className="text-[11px] font-english text-neutral-500">
              {language === 'ta' ? 'உறுதிப்படுத்தப்பட்ட அறிக்கை' : 'Verified Dispatch'}
            </span>
          </div>

        </div>

      </div>

    </article>
  );
};
