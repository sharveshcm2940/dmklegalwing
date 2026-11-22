'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { NewsItem } from '@/types';
import { ArrowRight, Calendar } from 'lucide-react';

interface LeadStoryProps {
  story: NewsItem;
  onReadMore?: (story: NewsItem) => void;
}

export const LeadStory: React.FC<LeadStoryProps> = ({ story, onReadMore }) => {
  const { language } = useLanguage();

  if (!story) return null;

  const sourceName = story.issuingAuthority 
    ? story.issuingAuthority[language] 
    : (story.author ? story.author[language] : (language === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமைச் செயலகம்' : 'DMK Legal Wing Secretariat'));

  return (
    <article className="w-full bg-white border border-[#D8D3CB] rounded-[2px] overflow-hidden font-dmk-body">
      
      {/* Top Editorial Label Bar */}
      <div className="bg-[#FAF8F5] border-b border-[#D8D3CB] px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-dmk-body">
        <div className="flex items-center gap-2">
          <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F]">
            [{story.category}]
          </span>
          <span className="text-[#D8D3CB]">•</span>
          <span className="text-xs text-[#5B5348] font-bold">
            {language === 'ta' ? 'முக்கிய தலையங்க அறிக்கை' : 'Lead Editorial Dispatch'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#5B5348]">
          <Calendar className="w-3.5 h-3.5 text-[#C41A1F]" />
          <time className="font-english text-xs">{story.date}</time>
          {story.time && <span className="font-english text-xs">• {story.time}</span>}
        </div>
      </div>

      {/* Asymmetrical Split Composition: 60% Left / 40% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-[#D8D3CB]">
        
        {/* Left Side: 60% Width (7 of 12 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#FAF8F5]">
          
          {story.image ? (
            <div>
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#111111]">
                <img
                  src={story.image}
                  alt={story.title[language]}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Photo Caption & Credit Strip */}
              {(story.caption?.[language] || story.photoCredit) && (
                <figcaption className="bg-[#FAF8F5] text-[#5B5348] px-4 py-2 border-t border-[#D8D3CB] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-dmk-body">
                  <p className="italic text-xs">
                    {story.caption ? story.caption[language] : story.title[language]}
                  </p>
                  {story.photoCredit && (
                    <span className="font-english text-[10px] text-[#5B5348]/80 shrink-0">
                      Photo: {story.photoCredit}
                    </span>
                  )}
                </figcaption>
              )}
            </div>
          ) : (
            /* Typographic block when no image is present - No placeholder picture! */
            <div className="p-8 sm:p-12 flex flex-col justify-center h-full bg-white border-l-4 border-[#E31E24]">
              <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F] block mb-2">
                [{story.category}]
              </span>
              <blockquote className="font-dmk-headline text-2xl sm:text-3xl font-black text-[#111111] leading-tight italic">
                &ldquo;{story.title[language]}&rdquo;
              </blockquote>
            </div>
          )}

        </div>

        {/* Right Side: 40% Width (5 of 12 cols on lg) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-4">
          
          <div className="space-y-4">
            
            {/* Source & Authority: NEVER CUT OFF, wraps to 2 lines if needed */}
            <div className="border-b border-[#D8D3CB] pb-2 text-xs font-dmk-body">
              <span className="text-[#5B5348] block text-[11px] mb-0.5">
                {language === 'ta' ? 'அதிகாரப்பூர்வ வெளியீடு:' : 'Official Dispatch Source:'}
              </span>
              <span className="font-bold text-[#111111] block leading-tight break-words whitespace-normal">
                {sourceName}
              </span>
              {story.caseNumber && (
                <span className="font-mono text-[11px] text-[#5B5348] block mt-1">
                  Docket: {story.caseNumber}
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline leading-[1.15] hover:text-[#C41A1F] transition-colors">
              <Link href={`/news/${story.id}`}>
                {story.title[language]}
              </Link>
            </h2>

            {/* Editorial Summary */}
            <p className="text-sm sm:text-base text-[#5B5348] leading-relaxed font-dmk-body border-l-2 border-[#E31E24] pl-3.5 py-0.5">
              {story.summary[language]}
            </p>

            {/* Author Attribution: NEVER CUT OFF */}
            {story.author && story.author[language] !== sourceName && (
              <div className="pt-1 text-xs font-dmk-body text-[#5B5348]">
                <span className="text-[#5B5348]">{language === 'ta' ? 'கையெழுத்திட்டவர்: ' : 'Signatory: '}</span>
                <span className="font-bold text-[#111111] break-words whitespace-normal">{story.author[language]}</span>
              </div>
            )}

          </div>

          {/* Action Footer: min-h-[44px] rectangular red button */}
          <div className="pt-4 border-t border-[#D8D3CB] flex items-center justify-between">
            <Link
              href={`/news/${story.id}`}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#111111] text-white px-5 py-2.5 text-xs font-dmk-body font-bold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              <span>{language === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'READ FULL STATEMENT'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <span className="text-xs font-dmk-body text-[#5B5348]">
              {language === 'ta' ? 'உறுதிப்படுத்தப்பட்ட அறிக்கை' : 'Verified Dispatch'}
            </span>
          </div>

        </div>

      </div>

    </article>
  );
};
