'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { NewsItem } from '@/types';
import { ChevronRight } from 'lucide-react';

interface LatestNewsFeedProps {
  articles: NewsItem[];
  totalCount: number;
}

export const LatestNewsFeed: React.FC<LatestNewsFeedProps> = ({ articles, totalCount }) => {
  const { language } = useLanguage();
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const displayedArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <section className="w-full font-dmk-body">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#111111] pb-3 mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline">
            {language === 'ta' ? 'தலைமைச் செயலகச் செய்திக் களம்' : 'Dispatches & Legal Communiqués'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-0.5">
            {language === 'ta' 
              ? 'திமுக வழக்கறிஞர் அணி வெளியிடும் அதிகாரப்பூர்வ அறிக்கைகள் மற்றும் செய்திகளின் முழுப் பதிவகம்' 
              : 'Chronological broadsheet archive of official press statements, resolutions, and gazette notices'}
          </p>
        </div>

        <div className="text-xs font-dmk-body text-[#5B5348]">
          <span className="font-bold text-[#111111]">{articles.length}</span>
          <span> {language === 'ta' ? 'அறிக்கைகள் கிடைக்கின்றன' : 'records listed'}</span>
        </div>
      </div>

      {/* No Results Fallback */}
      {articles.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#D8D3CB] rounded-[2px]">
          <p className="text-[#5B5348] font-dmk-body text-sm">
            {language === 'ta' 
              ? 'தேடலுக்குரிய செய்திகள் எதுவும் கிடைக்கவில்லை. வேறு சொற்களைக் கொண்டு தேடவும்.'
              : 'No official dispatches match your filter or search query. Please try another category or keyword.'}
          </p>
        </div>
      ) : (
        /* Newspaper Ruled List (Not equal cards) */
        <div className="divide-y divide-[#D8D3CB] bg-white border-y border-[#D8D3CB] rounded-[2px]">
          {displayedArticles.map((item) => {
            const sourceText = item.issuingAuthority 
              ? item.issuingAuthority[language] 
              : (item.author ? item.author[language] : (language === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமைச் செயலகம்' : 'DMK Legal Wing Secretariat'));

            return (
              <article 
                key={item.id}
                className="p-5 sm:p-6 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Column: Ruled Entry Details */}
                  <div className="flex-1 space-y-2">
                    
                    {/* 1. Type Tag & Date */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F]">
                        [{item.category}]
                      </span>
                      <span className="text-[#D8D3CB]">•</span>
                      <time className="font-english text-xs text-[#5B5348]">
                        {item.date}
                      </time>
                      {item.court && (
                        <>
                          <span className="text-[#D8D3CB]">•</span>
                          <span className="text-xs text-[#5B5348] font-dmk-body">
                            {item.court}
                          </span>
                        </>
                      )}
                      {item.caseNumber && (
                        <>
                          <span className="text-[#D8D3CB]">•</span>
                          <span className="font-mono text-[11px] text-[#5B5348]">
                            {item.caseNumber}
                          </span>
                        </>
                      )}
                    </div>

                    {/* 2. Headline */}
                    <h3 className="text-base sm:text-lg font-bold text-[#111111] font-dmk-headline hover:text-[#C41A1F] transition-colors leading-snug">
                      <Link href={`/news/${item.id}`} className="block">
                        {item.title[language]}
                      </Link>
                    </h3>

                    {/* 3. One-Line Summary */}
                    <p className="line-clamp-1 text-xs sm:text-sm text-[#5B5348] font-dmk-body leading-relaxed">
                      {item.summary[language]}
                    </p>

                    {/* 4. Source / Author Line: NEVER CUT OFF, wraps to two lines if needed */}
                    <div className="pt-1 text-xs font-dmk-body text-[#5B5348] leading-snug break-words whitespace-normal">
                      <span className="text-[#5B5348]">{language === 'ta' ? 'வெளியீடு: ' : 'Source: '}</span>
                      <span className="font-semibold text-[#111111]">{sourceText}</span>
                    </div>

                  </div>

                  {/* Right Column: Secondary Action Link (Plain Underlined Text Link, min 44px) */}
                  <div className="shrink-0 flex items-center md:items-end justify-between md:justify-start pt-2 md:pt-0">
                    <Link
                      href={`/news/${item.id}`}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-dmk-body font-bold text-[#111111] hover:text-[#C41A1F] underline underline-offset-4 transition-colors"
                    >
                      <span>{language === 'ta' ? 'முழு அறிக்கை' : 'Read statement'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Load More Button: Rectangular, min-h-[44px] */}
      {hasMore && (
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="min-h-[44px] px-6 py-2.5 bg-[#FAF8F5] hover:bg-[#111111] hover:text-white border border-[#D8D3CB] text-[#111111] font-dmk-body font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            {language === 'ta' ? 'மேலும் அறிக்கைகளைக் காட்டுக' : 'Load More Dispatches'}
          </button>
        </div>
      )}

    </section>
  );
};
