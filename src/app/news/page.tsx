'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { IconSearch } from '@/components/Icons';

export default function NewsPage() {
  const { language } = useLanguage();
  const { news } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const mainSection = useReveal();

  const categories = ['All', 'Press Release', 'Statement', 'Resolution', 'Court Watch'];

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return news.filter((item) => {
      if (item.status && item.status.toLowerCase() !== 'published') return false;

      const matchesCat = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !q ||
        item.title[language].toLowerCase().includes(q) ||
        item.summary[language].toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.court && item.court.toLowerCase().includes(q)) ||
        item.date.includes(q);

      return matchesCat && matchesSearch;
    });
  }, [news, activeCategory, searchQuery, language]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'செய்தியகம் & பத்திரிகை அறிக்கைகள்' : 'Press Bureau & Newsroom'}
        description={
          language === 'ta'
            ? 'திமுக வழக்கறிஞர் அணியின் அதிகாரப்பூர்வ அறிக்கைகள், சட்டமன்ற தீர்மானங்கள் மற்றும் உச்சநீதிமன்ற வழக்குகள்.'
            : 'Official press dispatches, constitutional resolutions, court watch updates, and legal briefings.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-12">
        
        <section 
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''}`}
        >
          {/* Controls: Search & Category Filter */}
          <div className="bg-[#f1ece2] border-2 border-[#111111] p-6 space-y-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6 space-y-1.5">
                <label htmlFor="newsSearch" className="font-semibold text-[15px] text-[#111111]">
                  {language === 'ta' ? 'அறிக்கைகளைத் தேடுக' : 'Search Dispatches & Reports'}
                </label>
                <div className="relative">
                  <IconSearch className="w-4 h-4 text-[#5B5348] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="newsSearch"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ta' ? 'தலைப்பு, தேதி அல்லது நீதிமன்றம்...' : 'Headline, date or court...'}
                    className="w-full min-h-[44px] bg-white border-2 border-[#111111] pl-10 pr-4 text-[15px] text-[#111111]"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="md:col-span-6 flex items-center gap-2 flex-wrap">
                {categories.map((tab) => {
                  const isSelected = activeCategory === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCategory(tab)}
                      className={`min-h-[44px] px-4 py-2 text-[14px] font-extrabold cursor-pointer border-2 border-[#111111] transition-colors ${
                        isSelected
                          ? 'bg-[#E31E24] text-white border-[#E31E24]'
                          : 'bg-white text-[#111111] hover:bg-[#111111] hover:text-white'
                      }`}
                    >
                      {tab === 'All' && language === 'ta' ? 'அனைத்தும்' : tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-[14px] text-[#5B5348] border-t border-[#3d3633] pt-3">
              <span>
                {language === 'ta' ? 'மொத்த அறிக்கைகள்: ' : 'Showing dispatches: '}
                <strong className="text-[#111111] font-helvetica">{filteredNews.length}</strong>
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#C41A1F] hover:underline font-bold cursor-pointer"
                >
                  {language === 'ta' ? 'தேடலை அழிக்க' : 'Clear search'}
                </button>
              )}
            </div>
          </div>

          {/* Ruled Rows List */}
          {filteredNews.length === 0 ? (
            <div className="bg-white border-2 border-[#111111] p-12 text-center">
              <p className="text-[17px] text-[#5B5348]">
                {language === 'ta'
                  ? 'தேடலுக்குரிய செய்திகள் எதுவும் கிடைக்கவில்லை.'
                  : 'No dispatches match your search query.'}
              </p>
            </div>
          ) : (
            <div className="divide-y-2 divide-[#111111] border-2 border-[#111111] bg-white">
              {filteredNews.map((item) => {
                const d = new Date(item.date);
                const dayStr = isNaN(d.getDate()) ? '10' : String(d.getDate()).padStart(2, '0');
                const monthYearStr = d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

                return (
                  <div
                    key={item.id}
                    className="group relative py-7 px-6 transition-all duration-250 cursor-pointer overflow-hidden hover:bg-[#f1ece2]"
                  >
                    {/* Red bar grows from the left edge */}
                    <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[6px] bg-[#E31E24] transition-all duration-250" />

                    <div className="transition-transform duration-250 group-hover:translate-x-[16px] flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                      
                      {/* Left: Day & Month Column */}
                      <div className="w-[100px] shrink-0">
                        <span className="font-helvetica font-extrabold text-[48px] leading-[0.9] text-[#111111] block">
                          {dayStr}
                        </span>
                        <span className="font-extrabold text-[14px] text-[#5B5348] block mt-1">
                          {monthYearStr}
                        </span>
                      </div>

                      {/* Middle: Tag, Headline, Summary, Court */}
                      <div className="flex-1 space-y-2">
                        <span className="text-[#C41A1F] font-extrabold text-[14px] block">
                          {item.category}
                        </span>

                        <h2 className="font-helvetica font-extrabold text-[24px] sm:text-[28px] leading-[1.18] text-[#111111]">
                          <Link href={`/news/${item.id}`} className="hover:text-[#C41A1F] transition-colors">
                            {item.title[language]}
                          </Link>
                        </h2>

                        <p className="text-[17px] text-[#3a322d] max-w-3xl leading-relaxed">
                          {item.summary[language]}
                        </p>

                        <p className="text-[14px] font-semibold text-[#5B5348]">
                          {item.court || (language === 'ta' ? 'மாநில சட்டத் தலைமைச் செயலகம்' : 'State Legal Secretariat')}
                        </p>
                      </div>

                      {/* Right: Arrow */}
                      <div className="shrink-0 self-center">
                        <Link 
                          href={`/news/${item.id}`}
                          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#C41A1F] group-hover:text-[#111111] text-[26px] font-bold"
                          aria-label={`Read ${item.title[language]}`}
                        >
                          →
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
