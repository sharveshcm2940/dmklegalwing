'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LEGAL_DEVELOPMENTS_DATA } from '@/data/content';

export default function NewsPage() {
  const { language } = useLanguage();
  const { news } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('All releases');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Animations on load
  const [mastheadDrawn, setMastheadDrawn] = useState<boolean>(false);
  const [sunSweep, setSunSweep] = useState<boolean>(false);
  const [dateDropped, setDateDropped] = useState<boolean>(false);

  useEffect(() => {
    // 1s masthead rule draw
    const t0 = setTimeout(() => setMastheadDrawn(true), 50);

    // 1.6s sun-ray sweep
    const t1 = setTimeout(() => setSunSweep(true), 100);

    // 1.1s date stamp drop-in
    const t2 = setTimeout(() => setDateDropped(true), 1100);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const filterTabs = ['All releases', 'Press release', 'Statement', 'Resolution', 'Gazette'];

  // Published news items
  const publishedNews = useMemo(() => {
    return news.filter((item) => !item.status || item.status.toLowerCase() === 'published');
  }, [news]);

  // Lead story is first featured or first item
  const leadStory = useMemo(() => {
    return publishedNews.find((item) => item.featured) || publishedNews[0] || null;
  }, [publishedNews]);

  // "Also on the wire" items (filtered by search and active category, excluding lead story if no search)
  const wireNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return publishedNews.filter((item) => {
      // Category match
      let matchesCategory = true;
      if (activeCategory === 'Press release') {
        matchesCategory = item.category.toLowerCase().includes('press');
      } else if (activeCategory === 'Statement') {
        matchesCategory = item.category.toLowerCase().includes('statement');
      } else if (activeCategory === 'Resolution') {
        matchesCategory = item.category.toLowerCase().includes('resolution');
      } else if (activeCategory === 'Gazette') {
        matchesCategory = item.category.toLowerCase().includes('gazette');
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
        item.category.toLowerCase().includes(q) ||
        (item.court && item.court.toLowerCase().includes(q)) ||
        item.date.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [publishedNews, activeCategory, searchQuery, language]);

  // Format lead story date stamp
  const leadDate = useMemo(() => {
    if (!leadStory) return { day: '18', monthYear: 'NOV 2026' };
    const d = new Date(leadStory.date);
    const day = isNaN(d.getDate()) ? '18' : String(d.getDate()).padStart(2, '0');
    const monthYear = isNaN(d.getTime())
      ? 'NOV 2026'
      : d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase();
    return { day, monthYear };
  }, [leadStory]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65]">
      
      {/* ========================================================== */}
      {/* 1. MASTHEAD: REPLACES TITLE BAND                           */}
      {/* ========================================================== */}
      <div className="w-full">
        {/* Thin ink strip */}
        <div className="bg-[#111111] text-[#FAF8F5] py-2 px-[clamp(20px,4vw,56px)] text-[15px] font-semibold flex flex-wrap items-center justify-between gap-4">
          <span>திமுக வழக்கறிஞர் அணி · Press Bureau</span>
          <span>Chennai · 22 November 2026</span>
        </div>

        {/* Masthead Headline Box */}
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
            
            {/* Huge Kavivanar title "செய்திகள்" (clamp(64px, 11vw, 150px), colour #E31E24) */}
            <h1 className="font-kavivanar font-normal text-[clamp(64px,11vw,150px)] text-[#E31E24] leading-none tracking-tight">
              செய்திகள்
            </h1>

            {/* Bottom aligned right headline */}
            <div className="md:text-right space-y-1">
              <h2 className="font-helvetica font-extrabold text-[clamp(24px,2.8vw,34px)] text-[#111111] leading-tight">
                Press releases, statements & media wire
              </h2>
              <p className="text-[16px] text-[#5B5348]">
                {language === 'ta'
                  ? 'தலைமைச் செயலகத்தின் அதிகாரப்பூர்வ ஊடகப் பதிவுகள் மற்றும் அறிக்கைகள்'
                  : 'Official dispatches, constitutional resolutions & media updates from Anna Arivalayam'}
              </p>
            </div>

          </div>

          {/* Under it a 6px ink rule that draws from left to right in 1s, then a 2px ink rule 4px below it */}
          <div className="space-y-[4px] select-none">
            <div
              className="h-[6px] bg-[#111111] origin-left transition-transform duration-1000 ease-out"
              style={{ transform: mastheadDrawn ? 'scaleX(1)' : 'scaleX(0)' }}
            />
            <div className="h-[2px] bg-[#111111] w-full" />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-6 space-y-16">
        
        {/* ========================================================== */}
        {/* 2. FILTER ROW: TABS & SEARCH BOX WITH BOTTOM BORDER ONLY   */}
        {/* ========================================================== */}
        <div className="border-b border-[#111111] pb-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Tabs: plain text buttons, 800, 17px, 44px tall; active one in #C41A1F with 4px bottom border */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1">
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategory(tab)}
                  className={`min-h-[44px] h-[44px] px-1 font-helvetica font-extrabold text-[17px] transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'text-[#C41A1F] border-b-4 border-[#C41A1F]'
                      : 'text-[#111111] hover:text-[#C41A1F] border-b-4 border-transparent'
                  }`}
                >
                  {tab === 'All releases' && language === 'ta' ? 'அனைத்து அறிக்கைகள்' : tab}
                </button>
              );
            })}
          </div>

          {/* Search box with bottom border only */}
          <div className="w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'செய்திகளைத் தேடுக...' : 'Search dispatches...'}
              className="w-full min-h-[44px] bg-transparent border-0 border-b-2 border-[#111111] text-[16px] text-[#111111] placeholder-[#5B5348] focus:outline-none focus:border-[#E31E24] px-1"
            />
          </div>

        </div>

        {/* ========================================================== */}
        {/* 3. LEAD STORY: 2PX INK BORDERED BLOCK IN TWO EQUAL COLUMNS */}
        {/* ========================================================== */}
        {leadStory && (
          <article className="border-2 border-[#111111] bg-white grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Ink panel at least 420px tall holding sun-ray graphic and date stamp */}
            <div className="bg-[#111111] text-[#FAF8F5] relative overflow-hidden min-h-[420px] p-8 flex flex-col justify-between">
              
              {/* Sun-Ray Graphic (three red and four dark-red wedges, sweeps -14 to 0 deg in 1.6s) */}
              <div
                className="absolute right-[-100px] bottom-[-240px] w-[640px] h-[640px] pointer-events-none select-none z-0"
                style={{
                  transform: `rotate(${sunSweep ? 0 : -14}deg)`,
                  transition: 'transform 1.6s ease-out'
                }}
                aria-hidden="true"
              >
                <svg viewBox="-300 -300 600 600" className="w-full h-full">
                  {/* Three red wedges (#E31E24) */}
                  {[0, 90, 180].map((deg) => (
                    <polygon
                      key={`red-${deg}`}
                      points="-18,-90 18,-90 52,-300 -52,-300"
                      fill="#E31E24"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  {/* Four dark-red wedges (#8f1118) */}
                  {[45, 135, 225, 315].map((deg) => (
                    <polygon
                      key={`dark-${deg}`}
                      points="-18,-90 18,-90 52,-300 -52,-300"
                      fill="#8f1118"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  {/* Center hub */}
                  <circle cx="0" cy="0" r="75" fill="#111111" stroke="#E31E24" strokeWidth="4" />
                </svg>
              </div>

              {/* Parchment-bordered date stamp sits at top left: drops in at 1.1s, scaling 1.7 to 1 and rotating to -7deg */}
              <div
                className="relative z-10 self-start bg-[#FAF8F5] text-[#111111] border-2 border-[#FAF8F5] p-3 text-center shadow-lg"
                style={{
                  transform: dateDropped ? 'scale(1) rotate(-7deg)' : 'scale(1.7) rotate(0deg)',
                  opacity: dateDropped ? 1 : 0,
                  transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease-out'
                }}
              >
                {/* Day in Helvetica Now Display 800 at 54px */}
                <span className="font-helvetica font-extrabold text-[54px] leading-none text-[#111111] block">
                  {leadDate.day}
                </span>
                {/* Month and year 800 at 15px */}
                <span className="font-helvetica font-extrabold text-[15px] uppercase text-[#C41A1F] block mt-1 tracking-normal">
                  {leadDate.monthYear}
                </span>
              </div>

              {/* Bottom of the panel: Kavivanar line "தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!" in parchment */}
              <div className="relative z-10 pt-16">
                <p className="font-kavivanar font-normal text-[clamp(24px,3vw,34px)] text-[#FAF8F5] leading-tight">
                  &ldquo;தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!&rdquo;
                </p>
              </div>

            </div>

            {/* Right: Red type tag, Headline, Summary, Source line, and Ink button */}
            <div className="p-8 md:p-12 flex flex-col justify-between space-y-6 bg-[#FAF8F5]">
              
              <div className="space-y-4">
                {/* Red type tag */}
                <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                  {leadStory.category}
                </span>

                {/* Headline: Helvetica Now Display 800, clamp(30px, 3.6vw, 48px), line height 1.06 */}
                <h3 className="font-helvetica font-extrabold text-[clamp(30px,3.6vw,48px)] leading-[1.06] text-[#111111]">
                  <Link href={`/news/${leadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                    {leadStory.title[language]}
                  </Link>
                </h3>

                {/* Summary at 20px */}
                <p className="text-[20px] text-[#3a322d] leading-relaxed">
                  {leadStory.summary[language]}
                </p>

                {/* Source line (never cut off, wrap it instead) */}
                <p className="text-[14px] text-[#5B5348] font-semibold break-words pt-1">
                  {leadStory.court || leadStory.issuingAuthority?.[language] || 'State Legal Secretariat · Anna Arivalayam'}
                </p>
              </div>

              {/* Ink button "Read the full statement →" */}
              <Link
                href={`/news/${leadStory.id}`}
                className="inline-flex items-center justify-center min-h-[48px] px-8 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal btn-lift cursor-pointer transition-colors self-start"
              >
                <span>{language === 'ta' ? 'முழு அறிக்கையை வாசிக்க →' : 'Read the full statement →'}</span>
              </Link>

            </div>

          </article>
        )}

        {/* ========================================================== */}
        {/* 4. "ALSO ON THE WIRE": RULED LIST                          */}
        {/* ========================================================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#111111] pb-3">
            <h2 className="font-helvetica font-extrabold text-[clamp(24px,2.8vw,36px)] text-[#111111] leading-tight">
              {language === 'ta' ? 'அறிக்கைகள் வரிசைப் பதிவு' : 'Also on the wire'}
            </h2>
          </div>

          <div className="border-t border-b border-[#111111] divide-y divide-[#111111] bg-white">
            {wireNews.length === 0 ? (
              <div className="p-12 text-center text-[#5B5348]">
                {language === 'ta' ? 'அறிக்கைகள் எதுவும் கிடைக்கவில்லை.' : 'No dispatches found matching criteria.'}
              </div>
            ) : (
              wireNews.map((item) => {
                const d = new Date(item.date);
                const dayStr = isNaN(d.getDate()) ? '12' : String(d.getDate()).padStart(2, '0');
                const monthStr = isNaN(d.getTime())
                  ? 'NOV'
                  : d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();

                const sourceLine = item.court || item.issuingAuthority?.[language] || 'State Legal Secretariat, Anna Arivalayam';

                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group block relative py-8 px-6 transition-all duration-200 cursor-pointer overflow-hidden hover:bg-[#f1ece2]"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-transform duration-200 ease-out group-hover:translate-x-[18px]">
                      
                      {/* Left side: Date Block and Content */}
                      <div className="flex items-start gap-6 md:gap-8 flex-1">
                        
                        {/* Date block: day at 52px, month in grey */}
                        <div className="w-[84px] shrink-0 text-left">
                          <span className="font-helvetica font-extrabold text-[52px] leading-none text-[#111111] block">
                            {dayStr}
                          </span>
                          <span className="font-helvetica font-extrabold text-[14px] text-[#5B5348] uppercase block mt-1">
                            {monthStr}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1.5">
                          {/* Type in #C41A1F */}
                          <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] block">
                            {item.category}
                          </span>

                          {/* Headline: clamp(22px, 2.4vw, 32px) */}
                          <h3 className="font-helvetica font-extrabold text-[clamp(22px,2.4vw,32px)] text-[#111111] leading-snug group-hover:text-[#C41A1F] transition-colors">
                            {item.title[language]}
                          </h3>

                          {/* Summary */}
                          <p className="text-[17px] text-[#3a322d] leading-relaxed">
                            {item.summary[language]}
                          </p>

                          {/* Source line (never cut off, wrap it instead) */}
                          <p className="text-[14px] text-[#5B5348] font-semibold break-words pt-1">
                            {sourceLine}
                          </p>
                        </div>

                      </div>

                      {/* Right Arrow: Moves 8px on hover */}
                      <span className="text-[28px] font-extrabold text-[#C41A1F] shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-[8px] self-end lg:self-center">
                        &rarr;
                      </span>

                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* ========================================================== */}
        {/* 5. COURT WATCH: INK BAND WITH TITLE & TABLE                */}
        {/* ========================================================== */}
        <section className="bg-[#111111] text-[#FAF8F5] py-14 px-6 md:px-10 border-2 border-[#111111] space-y-8">
          
          {/* Title in Kavivanar 44px */}
          <h2 className="font-kavivanar font-normal text-[44px] text-[#FAF8F5] leading-tight">
            Court watch
          </h2>

          {/* Table: Court, Matter, Date, Status */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#4a423d]">
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] text-[#ff8a85] uppercase tracking-normal w-1/4">
                    Court
                  </th>
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] text-[#ff8a85] uppercase tracking-normal w-5/12">
                    Matter
                  </th>
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] text-[#ff8a85] uppercase tracking-normal w-1/6">
                    Date
                  </th>
                  <th className="py-4 px-4 font-helvetica font-extrabold text-[15px] text-[#ff8a85] uppercase tracking-normal w-1/6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4a423d]">
                {LEGAL_DEVELOPMENTS_DATA.map((dev) => (
                  <tr
                    key={dev.id}
                    className="hover:bg-[#2a2523] transition-colors text-[18px] text-[#FAF8F5]"
                  >
                    {/* Court */}
                    <td className="py-4 px-4 font-semibold text-[#d8cfc2]">
                      {dev.court || ''}
                    </td>

                    {/* Matter */}
                    <td className="py-4 px-4 font-bold text-[#FAF8F5]">
                      {dev.caseTitle[language] || dev.caseNumber || ''}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-[#d8cfc2] font-helvetica">
                      {dev.date || ''}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 font-bold text-[#ff8a85]">
                      {dev.statusTag?.[language] || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* ========================================================== */}
        {/* 6. FOOTER STRIP WITH 6PX RED TOP BORDER                    */}
        {/* ========================================================== */}
        <div className="border-t-[6px] border-[#E31E24] bg-[#111111] text-[#FAF8F5] py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-helvetica font-extrabold text-[16px] text-[#d8cfc2]">
            DMK Legal Wing Historical Archives · 1971–2026
          </span>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[16px] text-[#FAF8F5] hover:text-[#ff8a85] uppercase tracking-normal transition-colors cursor-pointer"
          >
            <span>{language === 'ta' ? 'முழு ஆவணக் காப்பகத்தைத் திறக்க →' : 'Open the full archive →'}</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
