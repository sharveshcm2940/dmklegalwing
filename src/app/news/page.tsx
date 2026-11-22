'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LEGAL_DEVELOPMENTS_DATA } from '@/data/content';

export default function NewsPage() {
  const { language } = useLanguage();
  const { news } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const [todayDate, setTodayDate] = useState<string>('22 November 2026');

  // Single 0.5 s fade-in on mount; nothing else moves
  useEffect(() => {
    setMounted(true);
    const d = new Date();
    try {
      const formatted = d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setTodayDate(formatted);
    } catch {
      // Fallback
    }
  }, [language]);

  const filterTabs = [
    { id: 'all', en: 'All', ta: 'அனைத்தும்' },
    { id: 'press', en: 'Press release', ta: 'செய்திக்குறிப்பு' },
    { id: 'statement', en: 'Statement', ta: 'அறிக்கை' },
    { id: 'resolution', en: 'Resolution', ta: 'தீர்மானம்' },
    { id: 'gazette', en: 'Gazette', ta: 'அரசிதழ்' },
  ];

  // Published news items
  const publishedNews = useMemo(() => {
    return news.filter((item) => !item.status || item.status.toLowerCase() === 'published');
  }, [news]);

  // Filtered stories based on tab & search query
  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return publishedNews.filter((item) => {
      // Category match
      let matchesCategory = true;
      const cat = item.category.toLowerCase();
      if (activeCategory === 'press') {
        matchesCategory = cat.includes('press');
      } else if (activeCategory === 'statement') {
        matchesCategory = cat.includes('statement');
      } else if (activeCategory === 'resolution') {
        matchesCategory = cat.includes('resolution');
      } else if (activeCategory === 'gazette') {
        matchesCategory = cat.includes('gazette');
      }

      // Search query match
      const matchesSearch =
        !q ||
        item.title[language].toLowerCase().includes(q) ||
        item.title.en.toLowerCase().includes(q) ||
        item.title.ta.toLowerCase().includes(q) ||
        item.summary[language].toLowerCase().includes(q) ||
        item.summary.en.toLowerCase().includes(q) ||
        item.summary.ta.toLowerCase().includes(q) ||
        cat.includes(q) ||
        (item.court && item.court.toLowerCase().includes(q)) ||
        item.date.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [publishedNews, activeCategory, searchQuery, language]);

  // Lead story is first filtered story; remainder are wire stories
  const leadStory = filteredNews[0] || null;
  const remainingStories = filteredNews.slice(1);

  const leftStories = remainingStories.filter((_, idx) => idx % 2 === 0);
  const rightStories = remainingStories.filter((_, idx) => idx % 2 === 1);

  const hasPhoto = Boolean(leadStory && leadStory.image && leadStory.image.trim() !== '');

  return (
    <div
      className={`w-full min-h-screen bg-[#FAF8F5] text-[#111111] font-catamaran transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-10 pb-20">
        {/* ========================================================== */}
        {/* 1. MASTHEAD                                                */}
        {/* ========================================================== */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4">
            {/* Title: Kavivanar at clamp(56px, 9vw, 120px) in ink */}
            <h1 className="font-kavivanar font-normal text-[clamp(56px,9vw,120px)] text-[#111111] leading-none tracking-normal">
              செய்திகள்
            </h1>

            {/* Beside it: Helvetica Now Display 800 at 28px */}
            <p className="font-helvetica font-extrabold text-[28px] text-[#111111] leading-tight md:text-right">
              Press releases, statements and media wire
            </p>
          </div>

          {/* 3 px ink rule */}
          <div className="w-full h-[3px] bg-[#111111]" />

          {/* One-line dateline in grey 15 px */}
          <div className="flex items-center justify-between text-[15px] text-[#5B5348] font-helvetica py-2.5">
            <span>
              {language === 'ta' ? `சென்னை · ${todayDate}` : `Chennai · ${todayDate}`}
            </span>
            <span>
              {filteredNews.length}{' '}
              {language === 'ta'
                ? 'செய்திகள்'
                : filteredNews.length === 1
                ? 'dispatch'
                : 'dispatches'}
            </span>
          </div>
        </header>

        {/* ========================================================== */}
        {/* 2. FILTERS & SEARCH FIELD                                  */}
        {/* ========================================================== */}
        <section className="border-t border-b border-[#d7d0c3] py-4 my-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Plain text links separated by slashes */}
          <div className="flex flex-wrap items-center gap-2 text-[16px]">
            {filterTabs.map((tab, idx) => {
              const isActive = activeCategory === tab.id;
              return (
                <React.Fragment key={tab.id}>
                  {idx > 0 && (
                    <span className="text-[#5B5348] select-none mx-1" aria-hidden="true">
                      /
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`font-helvetica font-extrabold text-[16px] pb-0.5 cursor-pointer transition-colors ${
                      isActive
                        ? 'text-[#111111] border-b-2 border-[#E31E24]'
                        : 'text-[#5B5348] hover:text-[#111111]'
                    }`}
                  >
                    {tab[language]}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Search field with only a bottom border */}
          <div className="w-full md:w-72">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'செய்திகளைத் தேடுக...' : 'Search dispatches...'}
              className="w-full bg-transparent border-0 border-b border-[#111111] focus:border-[#E31E24] outline-none text-[16px] text-[#111111] placeholder-[#5B5348] py-1 px-0"
            />
          </div>
        </section>

        {/* No stories matching */}
        {filteredNews.length === 0 && (
          <div className="py-20 text-center text-[#5B5348] text-[18px]">
            {language === 'ta'
              ? 'தேடலுக்குரிய செய்திகள் எதுவும் கிடைக்கவில்லை.'
              : 'No dispatches found matching the criteria.'}
          </div>
        )}

        {/* ========================================================== */}
        {/* 3. LEAD STORY (NO BOX)                                     */}
        {/* ========================================================== */}
        {leadStory && (
          <article className="mt-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
              {/* Left Column: 62% if photo exists, otherwise full width */}
              <div className={hasPhoto ? 'w-full md:w-[62%]' : 'w-full'}>
                <Link href={`/news/${leadStory.id}`} className="group inline-block">
                  <h2
                    className={`leading-[1.05] text-[#111111] ${
                      language === 'ta'
                        ? 'font-kavivanar font-normal text-[clamp(34px,4.2vw,54px)]'
                        : 'font-helvetica font-extrabold text-[clamp(36px,4.4vw,58px)]'
                    }`}
                  >
                    <span className="border-b-2 border-transparent group-hover:border-[#E31E24] transition-colors duration-150">
                      {leadStory.title[language]}
                    </span>
                  </h2>
                </Link>

                {/* Summary at 20 px */}
                <p className="font-catamaran text-[20px] text-[#111111] leading-[1.75] mt-4 mb-3">
                  {leadStory.summary[language]}
                </p>

                {/* Grey source line */}
                <p className="text-[15px] text-[#5B5348] font-normal">
                  {leadStory.court ||
                    leadStory.issuingAuthority?.[language] ||
                    leadStory.author?.[language] ||
                    'State Legal Secretariat · Anna Arivalayam'}
                </p>
              </div>

              {/* Right Column: 38% photograph with caption & credit */}
              {hasPhoto && (
                <div className="w-full md:w-[38%] shrink-0">
                  <img
                    src={leadStory.image}
                    alt={leadStory.title[language]}
                    className="w-full h-auto object-cover border border-[#d7d0c3]"
                  />
                  {leadStory.caption?.[language] && (
                    <p className="text-[15px] text-[#5B5348] mt-2 leading-snug">
                      {leadStory.caption[language]}
                    </p>
                  )}
                  {leadStory.photoCredit && (
                    <p className="text-[13px] text-[#5B5348] mt-1 font-helvetica">
                      {leadStory.photoCredit}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 1 px ink rule below */}
            <div className="w-full h-px bg-[#111111] mt-12" />
          </article>
        )}

        {/* ========================================================== */}
        {/* 4. REST OF THE STORIES IN TWO COLUMNS                      */}
        {/* ========================================================== */}
        {remainingStories.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#d7d0c3]">
              {/* Left Column */}
              <div className="space-y-8 md:pr-10 pb-8 md:pb-0">
                {leftStories.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`${idx < leftStories.length - 1 ? 'border-b border-[#d7d0c3] pb-8' : ''}`}
                  >
                    <div className="text-[15px] mb-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[#C41A1F] font-bold">{item.category}</span>
                      <span className="text-[#5B5348]" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-helvetica text-[#5B5348]">{item.date}</span>
                    </div>

                    <Link href={`/news/${item.id}`} className="group inline-block">
                      <h3
                        className={`text-[26px] leading-[1.2] text-[#111111] ${
                          language === 'ta'
                            ? 'font-kavivanar font-normal'
                            : 'font-helvetica font-extrabold'
                        }`}
                      >
                        <span className="border-b-2 border-transparent group-hover:border-[#E31E24] transition-colors duration-150">
                          {item.title[language]}
                        </span>
                      </h3>
                    </Link>

                    <p className="font-catamaran text-[17px] text-[#111111] leading-[1.65] line-clamp-2 mt-2 mb-2">
                      {item.summary[language]}
                    </p>

                    <p className="text-[14px] text-[#5B5348] font-normal">
                      {item.court ||
                        item.issuingAuthority?.[language] ||
                        item.author?.[language] ||
                        'State Legal Secretariat, Anna Arivalayam'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-8 md:pl-10 pt-8 md:pt-0">
                {rightStories.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`${idx < rightStories.length - 1 ? 'border-b border-[#d7d0c3] pb-8' : ''}`}
                  >
                    <div className="text-[15px] mb-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[#C41A1F] font-bold">{item.category}</span>
                      <span className="text-[#5B5348]" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-helvetica text-[#5B5348]">{item.date}</span>
                    </div>

                    <Link href={`/news/${item.id}`} className="group inline-block">
                      <h3
                        className={`text-[26px] leading-[1.2] text-[#111111] ${
                          language === 'ta'
                            ? 'font-kavivanar font-normal'
                            : 'font-helvetica font-extrabold'
                        }`}
                      >
                        <span className="border-b-2 border-transparent group-hover:border-[#E31E24] transition-colors duration-150">
                          {item.title[language]}
                        </span>
                      </h3>
                    </Link>

                    <p className="font-catamaran text-[17px] text-[#111111] leading-[1.65] line-clamp-2 mt-2 mb-2">
                      {item.summary[language]}
                    </p>

                    <p className="text-[14px] text-[#5B5348] font-normal">
                      {item.court ||
                        item.issuingAuthority?.[language] ||
                        item.author?.[language] ||
                        'State Legal Secretariat, Anna Arivalayam'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================== */}
        {/* 5. COURT WATCH TABLE                                       */}
        {/* ========================================================== */}
        <section className="my-16">
          <h2
            className={`text-[28px] text-[#111111] mb-6 ${
              language === 'ta' ? 'font-kavivanar font-normal' : 'font-helvetica font-extrabold'
            }`}
          >
            {language === 'ta' ? 'நீதிமன்றக் கண்காணிப்பு' : 'Court watch'}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-t-2 border-[#111111]">
              <thead>
                <tr className="border-b border-[#111111]">
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] text-[#111111] uppercase tracking-normal w-1/4">
                    Court
                  </th>
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] text-[#111111] uppercase tracking-normal w-5/12">
                    Matter
                  </th>
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] text-[#111111] uppercase tracking-normal w-1/6">
                    Date
                  </th>
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] text-[#111111] uppercase tracking-normal w-1/6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7d0c3] border-b border-[#d7d0c3]">
                {LEGAL_DEVELOPMENTS_DATA.map((dev) => (
                  <tr key={dev.id} className="text-[18px] text-[#111111]">
                    <td className="py-4 px-4 font-semibold text-[#111111]">
                      {dev.court || ''}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#111111]">
                      {dev.caseTitle?.[language] || dev.caseNumber || ''}
                    </td>
                    <td className="py-4 px-4 font-helvetica text-[#5B5348]">
                      {dev.date || ''}
                    </td>
                    <td className="py-4 px-4 font-helvetica font-bold text-[#C41A1F]">
                      {dev.statusTag?.[language] || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================== */}
        {/* 6. PRESS ARCHIVE FOOTER STRIP                              */}
        {/* ========================================================== */}
        <footer className="border-t border-[#111111] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-helvetica font-bold text-[15px] text-[#5B5348]">
            {language === 'ta'
              ? 'திமுக வழக்கறிஞர் அணி வரலாற்று ஆவணக் காப்பகம் · 1971–2026'
              : 'DMK Legal Wing Historical Archives · 1971–2026'}
          </span>
          <Link
            href="/resources"
            className="font-helvetica font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] border-b border-[#111111] hover:border-[#C41A1F] transition-colors"
          >
            {language === 'ta' ? 'முழு ஆவணக் காப்பகத்தைத் திறக்க →' : 'Open the full archive →'}
          </Link>
        </footer>
      </div>
    </div>
  );
}
