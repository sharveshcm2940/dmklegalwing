'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LEGAL_DEVELOPMENTS_DATA } from '@/data/content';
import { LegalDevelopmentItem } from '@/types';

export default function NewsPage() {
  const { language } = useLanguage();
  const { news } = useData();

  const [activeTab, setActiveTab] = useState<'All releases' | 'Press release' | 'Statement' | 'Resolution' | 'Gazette'>('All releases');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newsFading, setNewsFading] = useState<boolean>(false);
  const [todayDate, setTodayDate] = useState<string>('23 November 2026');

  // Case detail modal for Court Watch
  const [selectedCaseModal, setSelectedCaseModal] = useState<LegalDevelopmentItem | null>(null);

  // Court watch scroll-into-view observer
  const courtWatchRef = useRef<HTMLElement>(null);
  const [courtWatchVisible, setCourtWatchVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const d = new Date();
      const formatted = d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setTodayDate(formatted);
    } catch {
      setTodayDate('23 November 2026');
    }
  }, [language]);

  useEffect(() => {
    if (!courtWatchRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCourtWatchVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCourtWatchVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(courtWatchRef.current);
    return () => observer.disconnect();
  }, []);

  const tabs: Array<{ id: 'All releases' | 'Press release' | 'Statement' | 'Resolution' | 'Gazette'; en: string; ta: string }> = [
    { id: 'All releases', en: 'All releases', ta: 'அனைத்து வெளியீடுகள்' },
    { id: 'Press release', en: 'Press release', ta: 'செய்திக்குறிப்பு' },
    { id: 'Statement', en: 'Statement', ta: 'அறிக்கை' },
    { id: 'Resolution', en: 'Resolution', ta: 'தீர்மானம்' },
    { id: 'Gazette', en: 'Gazette', ta: 'அரசிதழ்' },
  ];

  const handleTabChange = (tabId: 'All releases' | 'Press release' | 'Statement' | 'Resolution' | 'Gazette') => {
    if (tabId === activeTab) return;
    setNewsFading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setNewsFading(false);
    }, 150);
  };

  const publishedNews = useMemo(() => {
    return news.filter((item) => !item.status || item.status.toLowerCase() === 'published');
  }, [news]);

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return publishedNews.filter((item) => {
      let matchesTab = true;
      const cat = item.category.toLowerCase();
      if (activeTab === 'Press release') {
        matchesTab = cat.includes('press');
      } else if (activeTab === 'Statement') {
        matchesTab = cat.includes('statement');
      } else if (activeTab === 'Resolution') {
        matchesTab = cat.includes('resolution');
      } else if (activeTab === 'Gazette') {
        matchesTab = cat.includes('gazette');
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

      return matchesTab && matchesSearch;
    });
  }, [publishedNews, activeTab, searchQuery, language]);

  const leadStory = filteredNews[0] || null;
  const wireStories = filteredNews.slice(1);

  // Helper for 108 px date block (day 56 px 800, month grey)
  const formatStoryDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { day: '18', month: 'NOV', year: '2026' };
      const day = String(d.getDate()).padStart(2, '0');
      const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      return { day, month, year: String(d.getFullYear()) };
    } catch {
      return { day: '18', month: 'NOV', year: '2026' };
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#111111] font-catamaran antialiased overflow-x-clip selection:bg-[#E31E24] selection:text-white">
      
      {/* ========================================================== */}
      {/* 1. MASTHEAD (NO TITLE BAND)                                */}
      {/* Ink strip with "திமுக வழக்கறிஞர் அணி · Press Bureau" and   */}
      {/* "Chennai · [today's date]"                                  */}
      {/* Kavivanar "செய்திகள்" clamp(64px,11vw,150px) in #E31E24     */}
      {/* beside "Press releases, statements & media wire" 800 28px   */}
      {/* 6 px ink rule draws left-to-right in 1s, then 2px rule 4px below */}
      {/* ========================================================== */}
      <header className="w-full bg-[#FAF8F5] pt-0">
        
        {/* Ink strip */}
        <div className="w-full bg-[#111111] text-[#FAF8F5] py-2.5 px-[clamp(20px,4vw,56px)] border-b border-[#111111]">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[14px] font-helvetica font-extrabold uppercase tracking-normal">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#E31E24] inline-block" aria-hidden="true" />
              <span>திமுக வழக்கறிஞர் அணி · Press Bureau</span>
            </div>
            <div className="text-[#d8cfc2]">
              Chennai · {todayDate}
            </div>
          </div>
        </div>

        {/* Masthead Banner: Kavivanar title "செய்திகள்" in #E31E24 beside Helvetica 800 28px text */}
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-10 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <h1 className="font-kavivanar font-normal text-[#E31E24] text-[clamp(64px,11vw,150px)] leading-[0.95] tracking-normal select-none">
              செய்திகள்
            </h1>

            <div className="lg:text-right space-y-1 pb-2">
              <p className="font-helvetica font-extrabold text-[28px] text-[#111111] leading-tight">
                Press releases, statements & media wire
              </p>
              <p className="text-[16px] text-[#5B5348] font-normal">
                {language === 'ta'
                  ? 'கழகத் தலைமைச் செயலகம், அண்ணா அறிவாலயம் — சென்னை 600 018'
                  : 'State Legal Secretariat, Anna Arivalayam, Chennai — 600 018'}
              </p>
            </div>
          </div>

          {/* 6 px ink rule that draws left to right in 1 s, then a 2 px rule 4 px below it */}
          <div className="w-full space-y-[4px]">
            <div className="w-full h-[6px] bg-[#111111] animate-draw-rule-1s" />
            <div className="w-full h-[2px] bg-[#111111]" />
          </div>
        </div>

      </header>

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pb-24 pt-6">
        
        {/* ========================================================== */}
        {/* 2. FILTER ROW: TABS (sliding red underline) + SEARCH FIELD  */}
        {/* Live filtering, 1 px ink rule below                        */}
        {/* ========================================================== */}
        <section className="pb-6 mb-12 border-b border-[#111111] flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Tabs: All releases / Press release / Statement / Resolution / Gazette */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative py-1 font-helvetica font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-[#111111]' : 'text-[#5B5348] hover:text-[#111111]'
                  }`}
                >
                  <span>{language === 'ta' ? tab.ta : tab.en}</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#E31E24] transition-all duration-250 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Search field with only a bottom border */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'தேடுக (வார்த்தை, எண், நீதிமன்றம்)...' : 'Filter wire by keyword...'}
              className="w-full bg-transparent border-0 border-b-2 border-[#111111] focus:border-[#E31E24] outline-none text-[16px] text-[#111111] placeholder-[#5B5348] py-1.5 px-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-0 top-2 text-[13px] font-bold text-[#C41A1F] hover:underline cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* Empty state */}
        {filteredNews.length === 0 && (
          <div className="py-20 text-center text-[#5B5348] text-[18px]">
            {language === 'ta'
              ? 'தேடலுக்குரிய செய்திகள் எதுவும் கிடைக்கவில்லை.'
              : 'No releases found matching the selected filter.'}
          </div>
        )}

        {/* ========================================================== */}
        {/* 3. LEAD STORY (EXACTLY AS IN 1e)                           */}
        {/* ========================================================== */}
        {leadStory && (
          <div className={`transition-opacity duration-300 ${newsFading ? 'opacity-0' : 'opacity-100'}`}>
            <article className="bg-white border-2 border-[#111111] p-8 md:p-12 mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left 420 px Ink Panel: Sweeping Rays -14° to 0°, Dropping Date Stamp, Kavivanar Line */}
              <div className="lg:col-span-5 h-[420px] bg-[#111111] text-[#FAF8F5] p-8 relative overflow-hidden flex flex-col justify-between border-2 border-[#111111]">
                
                {/* Sweeping Rays Graphic behind (-14 to 0 deg in 1.6s) */}
                <div
                  className="absolute -right-16 -bottom-16 w-[380px] h-[380px] opacity-40 pointer-events-none select-none animate-ray-sweep origin-center"
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
                    <image
                      href="/images/dmk-official-logo.png"
                      x="-40"
                      y="-40"
                      width="80"
                      height="80"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </svg>
                </div>

                {/* Dropping Parchment-Bordered Date Stamp (scale 1.7 to 1, rotate -7°, 0.6s) */}
                <div className="relative z-10 self-start">
                  <div className="animate-stamp-drop inline-block px-3.5 py-1.5 bg-[#FAF8F5] text-[#111111] font-helvetica font-extrabold text-[13px] uppercase border-2 border-[#111111] shadow-[2px_2px_0_#8f1118]">
                    {leadStory.date} · {leadStory.category}
                  </div>
                </div>

                {/* Kavivanar Line "தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!" */}
                <div className="relative z-10 space-y-2">
                  <span className="text-[12px] font-bold text-[#ff8a85] uppercase tracking-normal">
                    {language === 'ta' ? 'அண்ணா அறிவாலயம் சிறப்புச் செய்தி' : 'SPECIAL DISPATCH'}
                  </span>
                  <p className="font-kavivanar font-normal text-[clamp(24px,2.8vw,32px)] leading-tight text-white">
                    தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!
                  </p>
                </div>
              </div>

              {/* Right Column: Type Tag, Headline, Summary 20px, Source, Ink Button */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal">
                  [{leadStory.category}] · {leadStory.court || 'Constitutional Bench'}
                </span>

                <h2 className="font-helvetica font-extrabold text-[clamp(30px,3.6vw,48px)] leading-[1.15] text-[#111111]">
                  <Link href={`/news/${leadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                    {leadStory.title[language]}
                  </Link>
                </h2>

                <p className="text-[20px] text-[#3a322d] leading-[1.65]">
                  {leadStory.summary[language]}
                </p>

                {/* Source line (never cut off) */}
                <div className="text-[15px] font-bold text-[#5B5348] border-t border-[#d7d0c3] pt-3">
                  {language === 'ta' ? 'ஆதாரம்:' : 'Source:'}{' '}
                  {leadStory.source || leadStory.issuingAuthority?.[language] || 'State Legal Secretariat, Anna Arivalayam, Chennai'}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/news/${leadStory.id}`}
                    className="inline-flex items-center justify-center min-h-[48px] px-8 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? 'முழு அறிக்கையைப் படிக்க →' : 'Read the full statement →'}
                  </Link>
                </div>
              </div>

            </article>
          </div>
        )}

        {/* ========================================================== */}
        {/* 4. ALSO ON THE WIRE (EXACTLY AS IN 1e)                     */}
        {/* ========================================================== */}
        {wireStories.length > 0 && (
          <section className="mb-20">
            <div className="border-b-2 border-[#111111] pb-3 mb-6">
              <h3 className="font-helvetica font-extrabold text-[24px] text-[#111111] uppercase tracking-normal">
                {language === 'ta' ? 'செய்தியகத்தின் பிற பதிவுகள்' : 'Also on the wire'}
              </h3>
            </div>

            <div className="divide-y divide-[#111111] border-t border-b border-[#111111] bg-white">
              {wireStories.map((story) => {
                const dateParts = formatStoryDate(story.date);
                return (
                  <article
                    key={story.id}
                    className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8 transition-all duration-250 hover:bg-[#e9e3d7] hover:translate-x-[22px] cursor-pointer overflow-hidden"
                  >
                    {/* Red hover bar 0 to 6 px on left edge */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[6px] bg-[#E31E24] transition-all duration-250"
                      aria-hidden="true"
                    />

                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 flex-1">
                      {/* 108 px Date Block */}
                      <div className="w-[108px] shrink-0 text-left">
                        <div className="font-helvetica font-extrabold text-[56px] leading-none text-[#111111]">
                          {dateParts.day}
                        </div>
                        <div className="font-helvetica font-bold text-[15px] text-[#5B5348] mt-1 tracking-wider uppercase">
                          {dateParts.month} {dateParts.year}
                        </div>
                        <div className="mt-2 text-[12px] text-[#C41A1F] font-extrabold uppercase">
                          {story.category}
                        </div>
                      </div>

                      {/* Content: Type in #C41A1F, Headline clamp(24px, 2.6vw, 34px) 800, Summary 18 px, Source 15 px */}
                      <div className="space-y-2 flex-1">
                        <h4 className="font-helvetica font-extrabold text-[clamp(24px,2.6vw,34px)] text-[#111111] group-hover:text-[#C41A1F] transition-colors leading-[1.2]">
                          <Link href={`/news/${story.id}`}>
                            {story.title[language]}
                          </Link>
                        </h4>
                        <p className="text-[18px] text-[#3a322d] leading-relaxed">
                          {story.summary[language]}
                        </p>
                        {/* Source line (never cut off) */}
                        <p className="text-[15px] text-[#5B5348] font-bold">
                          {language === 'ta' ? 'வெளியீடு:' : 'Issued by:'}{' '}
                          {story.source || story.issuingAuthority?.[language] || 'DMK Legal Wing Press Bureau'}
                        </p>
                      </div>
                    </div>

                    {/* Arrow that moves 8 px on hover */}
                    <div className="mt-4 md:mt-0 shrink-0 md:pl-6 text-[#111111] group-hover:text-[#E31E24] text-[24px] font-bold transition-transform duration-250 group-hover:translate-x-2">
                      &rarr;
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================== */}
        {/* 5. COURT WATCH (INK BAND WITH KAVIVANAR TITLE & TABLE)     */}
        {/* Header #ff8a85 800 15px; 18px rows, 1px #4a423d lines;      */}
        {/* hover #2a2523. Staggered 60ms on scroll. Leave cell empty   */}
        {/* when data has no value.                                     */}
        {/* ========================================================== */}
        <section
          ref={courtWatchRef}
          className="my-20 bg-[#111111] text-[#FAF8F5] border-2 border-[#111111] p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[#3d3633] pb-4">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#ff8a85] tracking-normal block">
                CONSTITUTIONAL BENCH DOCKET
              </span>
              <h2 className="font-kavivanar font-normal text-[clamp(32px,4vw,44px)] text-white mt-1 leading-tight">
                {language === 'ta' ? 'நீதிமன்றக் கண்காணிப்பு' : 'Court Watch'}
              </h2>
            </div>
            <span className="text-[14px] text-[#d8cfc2]">
              {language === 'ta'
                ? 'வழக்கு விவரங்களைப் பார்வையிட வரியைத் தொடுக'
                : 'Active constitutional litigations & state autonomy hearings'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-t-2 border-[#FAF8F5]">
              <thead>
                <tr className="border-b border-[#4a423d] text-[#ff8a85]">
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-1/4">
                    Court
                  </th>
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-5/12">
                    Matter
                  </th>
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-1/6">
                    Date
                  </th>
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] uppercase tracking-normal w-1/6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4a423d]">
                {LEGAL_DEVELOPMENTS_DATA.map((dev, idx) => (
                  <tr
                    key={dev.id}
                    onClick={() => setSelectedCaseModal(dev)}
                    className="text-[18px] text-[#FAF8F5] hover:bg-[#2a2523] cursor-pointer transition-colors"
                    style={{
                      opacity: courtWatchVisible ? 1 : 0,
                      transform: courtWatchVisible ? 'translateY(0)' : 'translateY(16px)',
                      transition: `opacity 0.4s ease-out ${idx * 60}ms, transform 0.4s ease-out ${idx * 60}ms`,
                    }}
                  >
                    {/* Leave empty when data has no value */}
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
        {/* 6. FOOTER STRIP WITH 6 px RED TOP BORDER                   */}
        {/* "Open the full archive →"                                   */}
        {/* ========================================================== */}
        <section className="border-t-[6px] border-[#E31E24] pt-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-helvetica font-bold text-[15px] text-[#5B5348]">
            {language === 'ta'
              ? 'திமுக வழக்கறிஞர் அணி சட்ட வரலாற்றுப் பதிவுகள் மற்றும் ஆவணங்கள்'
              : 'DMK Legal Wing Historical Archives & Case Law Vault'}
          </span>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[16px] text-[#111111] hover:text-[#C41A1F] border-b-2 border-[#111111] hover:border-[#C41A1F] pb-0.5 transition-colors cursor-pointer"
          >
            <span>{language === 'ta' ? 'முழு ஆவணக் காப்பகத்தைத் திறக்க →' : 'Open the full archive →'}</span>
          </Link>
        </section>

      </main>

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
                  [{selectedCaseModal.court || 'Constitutional Bench'}]
                </span>
                <h3 className="font-helvetica font-extrabold text-[24px] text-[#111111] leading-tight">
                  {selectedCaseModal.caseTitle?.[language] || selectedCaseModal.caseNumber || ''}
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
                  {selectedCaseModal.counsel?.[language] || ''} · {selectedCaseModal.bench || ''}
                </span>
              </div>
              <div>
                <strong className="text-[#5B5348] uppercase">Case Status: </strong>
                <span className="font-bold text-[#C41A1F]">
                  {selectedCaseModal.statusTag?.[language] || ''}
                </span>
              </div>
              <div>
                <strong className="text-[#5B5348] uppercase">Constitutional Significance: </strong>
                <span className="text-[#111111]">
                  {selectedCaseModal.significance?.[language] || ''}
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
