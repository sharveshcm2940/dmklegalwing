'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LEGAL_DEVELOPMENTS_DATA } from '@/data/content';
import { LegalDevelopmentItem } from '@/types';

export default function NewsPage() {
  const { language } = useLanguage();
  const { news } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const [todayDate, setTodayDate] = useState<string>('22 November 2026');

  // Case detail modal
  const [selectedCaseModal, setSelectedCaseModal] = useState<LegalDevelopmentItem | null>(null);

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

  const publishedNews = useMemo(() => {
    return news.filter((item) => !item.status || item.status.toLowerCase() === 'published');
  }, [news]);

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return publishedNews.filter((item) => {
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

  const leadStory = filteredNews[0] || null;
  const wireStories = filteredNews.slice(1);

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
          {/* Masthead Ink Sub-strip */}
          <div className="flex items-center justify-between text-[13px] text-[#5B5348] font-bold uppercase tracking-normal border-b border-[#d7d0c3] pb-2 mb-4">
            <span className="flex items-center gap-3">
              <img
                src="/images/dmk-official-logo.png"
                alt="DMK Official Emblem"
                className="h-6 w-auto object-contain"
              />
              <span>
                {language === 'ta'
                  ? 'திமுக வழக்கறிஞர் அணி · அதிகாரப்பூர்வ செய்திப் பிரிவு'
                  : 'DMK Legal Wing · Press & Media Bureau'}
              </span>
            </span>
            <span>Vol. LIV · Issue 1971</span>
          </div>

          {/* Huge Kavivanar "செய்திகள்" in RED beside "Press releases, statements & media wire" */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
            <h1 className="font-kavivanar font-normal text-[clamp(56px,9vw,120px)] text-[#E31E24] leading-[1.08] tracking-normal">
              செய்திகள்
            </h1>

            <div className="md:text-right space-y-1">
              <p className="font-helvetica font-extrabold text-[28px] text-[#111111] leading-tight">
                Press releases, statements & media wire
              </p>
              <p className="text-[14px] text-[#5B5348]">
                {language === 'ta'
                  ? 'தலைமைச் செயலகத்தின் அதிகாரப்பூர்வ ஊடகப் பதிவுகள் மற்றும் நீதிமன்ற உத்தரவுகள்'
                  : 'Official dispatches, constitutional resolutions & media updates from Anna Arivalayam'}
              </p>
            </div>
          </div>

          {/* 6 px ink rule drawing in, 2 px rule below */}
          <div className="w-full h-[6px] bg-[#111111] animate-draw-rule-1s" />
          <div className="w-full h-[2px] bg-[#111111] mt-1" />

          {/* One-line dateline in grey 15 px */}
          <div className="flex items-center justify-between text-[15px] text-[#5B5348] font-helvetica py-2.5">
            <span>
              {language === 'ta' ? `சென்னை · ${todayDate}` : `Chennai · ${todayDate}`}
            </span>
            <span className="font-bold">
              {filteredNews.length}{' '}
              {language === 'ta'
                ? 'அறிக்கைகள்'
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
          <div className="w-full md:w-80 relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'செய்திகளைத் தேடுக...' : 'Search dispatches...'}
              className="w-full bg-transparent border-0 border-b-2 border-[#111111] focus:border-[#E31E24] outline-none text-[16px] text-[#111111] placeholder-[#5B5348] py-1 px-0 pr-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-0 top-1 text-[13px] font-bold text-[#C41A1F] hover:underline cursor-pointer"
              >
                ✕
              </button>
            )}
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
        {/* 3. LEAD STORY BLOCK                                        */}
        {/* ========================================================== */}
        {leadStory && (
          <article className="bg-white border-2 border-[#111111] p-8 md:p-12 mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 420 px Ink Panel with Sweeping Rays and Dropping Date Stamp */}
            <div className="lg:col-span-5 h-[340px] bg-[#111111] text-[#FAF8F5] p-6 relative overflow-hidden flex flex-col justify-between border-2 border-[#111111]">
              {/* Sweeping Rays Graphic */}
              <div
                className="absolute -right-20 -bottom-20 w-[360px] h-[360px] opacity-40 pointer-events-none select-none animate-ray-sweep"
                aria-hidden="true"
              >
                <svg viewBox="-180 -180 360 360" className="w-full h-full">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <polygon
                      key={i}
                      points="-11,-55 11,-55 32,-190 -32,-190"
                      transform={`rotate(${i * 30})`}
                      fill={i % 2 === 0 ? '#E31E24' : '#8f1118'}
                    />
                  ))}
                  <circle cx="0" cy="0" r="48" fill="#111111" stroke="#E31E24" strokeWidth="2" />
                </svg>
              </div>

              {/* Dropping Date Stamp */}
              <div className="relative z-10 self-start">
                <div className="animate-stamp-drop inline-block px-3 py-1 bg-[#E31E24] text-white font-helvetica font-extrabold text-[13px] uppercase border border-white">
                  {leadStory.date} · {leadStory.category}
                </div>
              </div>

              {/* Slogan */}
              <div className="relative z-10 space-y-1">
                <span className="text-[12px] font-bold text-[#ff8a85] uppercase tracking-normal">
                  LEAD COMMUNIQUÉ
                </span>
                <p className="font-kavivanar font-normal text-[26px] leading-tight text-white">
                  {language === 'ta'
                    ? 'நீதிமன்றங்களில் சமரசமற்ற சமூக நீதி!'
                    : 'Uncompromising Social Justice in the Courts!'}
                </p>
              </div>
            </div>

            {/* Right: Headline, Summary, Never Cut Off Source Line, Button */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F]">
                [{leadStory.category}]
              </span>

              <h2 className="font-helvetica font-extrabold text-[clamp(28px,3.8vw,42px)] leading-[1.12] text-[#111111]">
                <Link href={`/news/${leadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                  {leadStory.title[language]}
                </Link>
              </h2>

              <p className="text-[18px] text-[#3a322d] leading-relaxed">
                {leadStory.summary[language]}
              </p>

              {/* Never cut off a source line */}
              <div className="text-[15px] text-[#5B5348] font-normal pt-1">
                <strong className="text-[#111111] uppercase font-bold mr-1">Source:</strong>
                <span>
                  {leadStory.court ||
                    leadStory.issuingAuthority?.[language] ||
                    leadStory.author?.[language] ||
                    'State Legal Secretariat, Anna Arivalayam, Chennai — 600 018'}
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/news/${leadStory.id}`}
                  className="inline-flex items-center justify-center min-h-[44px] px-8 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'Read full statement →'}
                </Link>
              </div>
            </div>

          </article>
        )}

        {/* ========================================================== */}
        {/* 4. ALSO ON THE WIRE (RULED ROWS)                           */}
        {/* ========================================================== */}
        {wireStories.length > 0 && (
          <section className="mb-16">
            <div className="border-b-2 border-[#111111] pb-3 mb-6">
              <h2 className="font-helvetica font-extrabold text-[24px] text-[#111111] uppercase tracking-normal">
                {language === 'ta' ? 'செய்தியகக் குறிப்புகள்' : 'Also on the wire'}
              </h2>
            </div>

            <div className="divide-y divide-[#d7d0c3] border-t border-b border-[#d7d0c3] bg-white">
              {wireStories.map((item) => (
                <article
                  key={item.id}
                  className="p-6 md:p-8 space-y-3 hover:bg-[#FAF8F5] transition-colors group"
                >
                  <div className="text-[15px] flex items-center gap-2 flex-wrap">
                    <span className="text-[#C41A1F] font-extrabold uppercase">
                      [{item.category}]
                    </span>
                    <span className="text-[#5B5348]" aria-hidden="true">·</span>
                    <span className="font-helvetica font-bold text-[#5B5348]">{item.date}</span>
                  </div>

                  <Link href={`/news/${item.id}`} className="block">
                    <h3 className="font-helvetica font-extrabold text-[26px] leading-[1.2] text-[#111111] group-hover:text-[#E31E24] group-hover:underline transition-all">
                      {item.title[language]}
                    </h3>
                  </Link>

                  <p className="text-[17px] text-[#111111] leading-[1.65] line-clamp-2">
                    {item.summary[language]}
                  </p>

                  {/* Never cut off source line */}
                  <div className="text-[14px] text-[#5B5348] font-normal pt-1">
                    <strong className="text-[#111111] uppercase font-bold mr-1">Source:</strong>
                    <span>
                      {item.court ||
                        item.issuingAuthority?.[language] ||
                        item.author?.[language] ||
                        'State Legal Secretariat, Anna Arivalayam, Chennai — 600 018'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================== */}
        {/* 5. COURT WATCH (TABLE IN AN INK BAND)                      */}
        {/* ========================================================== */}
        <section className="my-16 bg-[#111111] text-[#FAF8F5] border-2 border-[#111111] p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-[#3d3633] pb-4">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#ff8a85] tracking-normal block">
                BENCH MONITOR
              </span>
              <h2 className="font-kavivanar font-normal text-[32px] text-white mt-1">
                {language === 'ta' ? 'நீதிமன்றக் கண்காணிப்பு' : 'Court Watch'}
              </h2>
            </div>
            <span className="text-[13px] text-[#d8cfc2]">
              {language === 'ta'
                ? 'வழக்கு விவரங்களைப் பார்க்க வரியைத் தொடவும்'
                : 'Click any row for detailed case record'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-t-2 border-white">
              <thead>
                <tr className="border-b border-[#3d3633] text-[#ff8a85]">
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-1/4">
                    Court
                  </th>
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-5/12">
                    Matter
                  </th>
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-1/6">
                    Date
                  </th>
                  <th className="py-3 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-1/6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d3633]">
                {LEGAL_DEVELOPMENTS_DATA.map((dev) => (
                  <tr
                    key={dev.id}
                    onClick={() => setSelectedCaseModal(dev)}
                    className="text-[18px] text-[#FAF8F5] hover:bg-[#1a1715] cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-white">
                      {dev.court || ''}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {dev.caseTitle?.[language] || dev.caseNumber || ''}
                    </td>
                    <td className="py-4 px-4 font-helvetica text-[#d8cfc2]">
                      {dev.date || ''}
                    </td>
                    <td className="py-4 px-4 font-helvetica font-extrabold text-[#ff8a85]">
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
            {language === 'ta' ? 'முழு ஆவணக் காப்பகத்தைத் திறக்க →' : 'Open the full archive & vault →'}
          </Link>
        </footer>
      </div>

      {/* Case Details Modal (Solid 2 px ink border, zero drop shadows) */}
      {selectedCaseModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCaseModal(null)}
          className="fixed inset-0 z-50 bg-[#111111]/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] text-[#111111] max-w-xl w-full border-2 border-[#111111] p-8 space-y-6 relative"
          >
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  [{selectedCaseModal.court}]
                </span>
                <h3 className="font-helvetica font-extrabold text-[24px] text-[#111111] leading-tight">
                  {selectedCaseModal.caseTitle?.[language] || selectedCaseModal.caseNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCaseModal(null)}
                className="min-h-[44px] h-[44px] px-4 font-helvetica font-extrabold text-[14px] text-[#111111] hover:text-[#C41A1F] cursor-pointer"
              >
                CLOSE [✕]
              </button>
            </div>

            <p className="text-[17px] text-[#3a322d] leading-relaxed">
              {selectedCaseModal.summary[language]}
            </p>

            <div className="p-4 bg-white border border-[#d7d0c3] space-y-2 text-[14px]">
              <div>
                <strong className="text-[#5B5348] uppercase">Bench / Counsel: </strong>
                <span className="font-bold text-[#111111]">
                  {selectedCaseModal.counsel[language]} · {selectedCaseModal.bench}
                </span>
              </div>
              <div>
                <strong className="text-[#5B5348] uppercase">Case Status: </strong>
                <span className="font-bold text-[#C41A1F]">
                  {selectedCaseModal.statusTag[language]}
                </span>
              </div>
              <div>
                <strong className="text-[#5B5348] uppercase">Constitutional Significance: </strong>
                <span className="text-[#111111]">
                  {selectedCaseModal.significance[language]}
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedCaseModal(null)}
                className="min-h-[44px] h-[44px] px-6 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[13px] uppercase cursor-pointer transition-colors"
              >
                Close Case Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
