'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { NewsItem } from '@/types';
import { ArrowRight, Calendar, Clock, User, ChevronDown, ChevronRight, Share2, Check } from 'lucide-react';

interface LatestNewsFeedProps {
  articles: NewsItem[];
  totalCount: number;
}

export const LatestNewsFeed: React.FC<LatestNewsFeedProps> = ({ articles, totalCount }) => {
  const { language } = useLanguage();
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const displayedArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/news/${id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section className="w-full font-dmk-body">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3 mb-6">
        <div>
          <span className="text-[10px] font-english font-bold uppercase tracking-[0.2em] text-[#E31E24] block mb-0.5">
            {language === 'ta' ? 'அனைத்துப் பதிப்புகளின் காலவரிசை' : 'CHRONOLOGICAL DISPATCH ARCHIVE'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline">
            {language === 'ta' ? 'தலைமைச் செயலகச் செய்திக் களம்' : 'Latest from the Press Office'}
          </h3>
        </div>

        <div className="text-right text-xs font-english text-neutral-600">
          <span className="font-bold text-neutral-900">{articles.length}</span>
          <span> {language === 'ta' ? 'அறிக்கைகள் காட்டப்படுகின்றன' : 'Dispatches Available'}</span>
        </div>
      </div>

      {/* No Results Fallback */}
      {articles.length === 0 ? (
        <div className="p-12 text-center bg-white border border-neutral-300">
          <p className="text-neutral-500 font-dmk-body text-sm">
            {language === 'ta' 
              ? 'தேடலுக்குரிய செய்திகள் எதுவும் கிடைக்கவில்லை. வேறு சொற்களைக் கொண்டு தேடவும்.'
              : 'No official dispatches match your filter or search query. Please try another category or keyword.'}
          </p>
        </div>
      ) : (
        /* Newspaper-Inspired Editorial List */
        <div className="divide-y divide-neutral-300 bg-white border-y border-neutral-300">
          {displayedArticles.map((item, index) => {
            const isNewest = index === 0;
            return (
              <article 
                key={item.id}
                className="p-5 sm:p-7 hover:bg-[#FAF7F2] transition-colors relative group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* Left Column: Metadata & Timing */}
                  <div className="lg:w-48 shrink-0 space-y-1.5 text-xs font-english">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#E31E24] uppercase tracking-wider text-[11px]">
                        {item.category}
                      </span>
                      {isNewest && (
                        <span className="bg-[#E31E24] text-white text-[9px] font-bold px-1.5 py-0.2 uppercase tracking-widest animate-pulse">
                          LATEST
                        </span>
                      )}
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 text-neutral-600">
                      <time className="font-bold text-neutral-900">{item.date}</time>
                      {item.time && <span className="text-neutral-500 text-[11px]">{item.time}</span>}
                    </div>

                    {item.readTime && (
                      <span className="text-[10px] text-neutral-400 block pt-0.5">
                        {item.readTime}
                      </span>
                    )}
                  </div>

                  {/* Center Column: Headline, Summary & Authority */}
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold text-neutral-900 font-dmk-headline leading-snug group-hover:text-[#E31E24] transition-colors">
                      <Link href={`/news/${item.id}`} className="block">
                        {item.title[language]}
                      </Link>
                    </h4>

                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body line-clamp-2">
                      {item.summary[language]}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-english text-neutral-500">
                      {item.author && (
                        <span className="flex items-center gap-1 font-semibold text-neutral-800">
                          <User className="w-3 h-3 text-[#E31E24]" />
                          {item.author[language]}
                        </span>
                      )}
                      {item.court && (
                        <>
                          <span>•</span>
                          <span className="text-neutral-700 font-medium">{item.court}</span>
                        </>
                      )}
                      {item.caseNumber && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-neutral-600">{item.caseNumber}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions (Read Statement, Share) */}
                  <div className="lg:w-44 shrink-0 flex items-center lg:flex-col lg:items-end justify-between lg:justify-start gap-3 pt-2 lg:pt-0">
                    <Link
                      href={`/news/${item.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-english font-bold uppercase tracking-wider text-neutral-900 group-hover:text-[#E31E24] transition-colors border-b border-transparent group-hover:border-[#E31E24] pb-0.5"
                    >
                      <span>{language === 'ta' ? 'முழு அறிக்கை' : 'Read Dispatch'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={(e) => handleShare(item.id, e)}
                      className="inline-flex items-center gap-1 text-[11px] font-english text-neutral-500 hover:text-neutral-900 transition-colors"
                      title="Share Dispatch URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-6 py-3 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white border-2 border-neutral-900 text-xs font-english font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2 shadow-2xs"
          >
            <span>{language === 'ta' ? 'மேலும் அறிக்கைகளைக் காட்டுக' : 'LOAD PREVIOUS DISPATCHES'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

    </section>
  );
};
