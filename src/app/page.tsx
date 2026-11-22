'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { SITE_STATS } from '@/data/siteStats';
import { OFFICIAL_HIERARCHY_CHART } from '@/data/content';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { useReveal } from '@/hooks/useReveal';

export default function HomePage() {
  const { language } = useLanguage();
  const { news, districts } = useData();

  // 1. LEAD STORY FOR HERO CLIPPING (from /api/news)
  const publishedNews = useMemo(() => {
    return news.filter((n) => !n.status || n.status.toLowerCase() === 'published');
  }, [news]);

  const leadStory = useMemo(() => {
    return publishedNews.find((n) => n.isLeadStory) || publishedNews[0] || {
      id: 'supreme-court-governor-ruling',
      category: 'Resolution',
      date: '10-11-2026',
      title: {
        en: 'Supreme Court upholds Tamil Nadu stand: Governors cannot delay assent to Assembly Bills indefinitely',
        ta: 'மாநில சட்டமன்ற மசோதாக்களுக்கு ஆளுநர்கள் ஒப்புதல் அளிக்காமல் காலவரையின்றி தாமதிக்க முடியாது: உச்சநீதிமன்றம் தீர்ப்பு'
      },
      summary: {
        en: 'Landmark constitutional ruling mandates that Governors must act within a reasonable time and cannot pocket-veto state legislation passed by the elected assembly.',
        ta: 'மக்களால் தேர்ந்தெடுக்கப்பட்ட சட்டமன்றம் நிறைவேற்றிய மசோதாக்களை ஆளுநர்கள் காலவரையின்றி கிடப்பில் போட முடியாது என வரலாற்றுச் சிறப்புமிக்க அரசமைப்பு அமர்வு தீர்ப்பு.'
      }
    };
  }, [publishedNews]);

  // 2. METRICS BAND COUNT UP (50 steps of 30ms, ease-out cubic, threshold 0.3)
  const metricsRef = useRef<HTMLDivElement>(null);
  const [metricsTriggered, setMetricsTriggered] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [countingDone, setCountingDone] = useState(false);

  useEffect(() => {
    if (!metricsRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCounts([3500, 74, 50, 69]);
      setCountingDone(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMetricsTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(metricsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!metricsTriggered) return;
    const targets = [3500, 74, 50, 69];
    let step = 0;
    const totalSteps = 50;
    const intervalMs = 30;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(targets.map((tgt) => Math.round(eased * tgt)));

      if (step >= totalSteps) {
        clearInterval(timer);
        setCounts(targets);
        setCountingDone(true);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [metricsTriggered]);

  // 3. NEWS FILTER & PRESS BUREAU
  const [newsFilter, setNewsFilter] = useState<'All' | 'Press release' | 'Statement' | 'Resolution'>('All');

  const filteredNews = useMemo(() => {
    if (newsFilter === 'All') return publishedNews.slice(0, 8);
    return publishedNews
      .filter((n) => n.category.toLowerCase() === newsFilter.toLowerCase())
      .slice(0, 8);
  }, [publishedNews, newsFilter]);

  // 4. DISTRICTS SEARCH & SELECT
  const [districtQuery, setDistrictQuery] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('chennai-north');
  const [districtPanelFading, setDistrictPanelFading] = useState(false);

  const filteredDistricts = useMemo(() => {
    const q = districtQuery.toLowerCase().trim();
    if (!q) return districts;
    return districts.filter((d) => 
      d.name.en.toLowerCase().includes(q) ||
      d.name.ta?.toLowerCase().includes(q) ||
      d.organizer.en.toLowerCase().includes(q) ||
      d.organizer.ta?.toLowerCase().includes(q)
    );
  }, [districts, districtQuery]);

  const activeDistrict = useMemo(() => {
    return districts.find((d) => d.id === selectedDistrictId) || filteredDistricts[0] || districts[0];
  }, [districts, selectedDistrictId, filteredDistricts]);

  const handleSelectDistrict = (id: string) => {
    if (id === selectedDistrictId) return;
    setDistrictPanelFading(true);
    setSelectedDistrictId(id);
    setTimeout(() => {
      setDistrictPanelFading(false);
    }, 300);
  };

  const parsedPhoneNumbers = useMemo(() => {
    if (!activeDistrict?.contactPhone) return [];
    return activeDistrict.contactPhone
      .split(/[,/]/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [activeDistrict]);

  // 5. STRUCTURE: THREE BRANCHES UNDER THE SECRETARY
  const [selectedBranch, setSelectedBranch] = useState<'joint' | 'deputy' | 'headoffice'>('joint');
  const [branchFading, setBranchFading] = useState(false);

  const handleSelectBranch = (b: 'joint' | 'deputy' | 'headoffice') => {
    if (b === selectedBranch) return;
    setBranchFading(true);
    setSelectedBranch(b);
    setTimeout(() => setBranchFading(false), 250);
  };

  // Branch roster definitions ensuring: Joint Secretaries 9, Deputy Secretaries 5, Head Office Advocates 9
  const branchRoster = useMemo(() => {
    if (selectedBranch === 'joint') {
      return OFFICIAL_HIERARCHY_CHART.jointSecretaries.slice(0, 9);
    }
    if (selectedBranch === 'deputy') {
      return OFFICIAL_HIERARCHY_CHART.deputySecretaries.slice(0, 5);
    }
    return OFFICIAL_HIERARCHY_CHART.headOfficeAdvocates.slice(0, 9);
  }, [selectedBranch]);

  // Section Reveal Hooks (fading and rising 28px over 0.8s once at 12% visible)
  const leadersSection = useReveal();
  const newsSection = useReveal();
  const districtsSection = useReveal();
  const structureSection = useReveal();
  const joinSection = useReveal();

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] antialiased">
      
      {/* ===================================================================== */}
      {/* 1. HERO (ink background #111111, parchment text, overflow hidden)     */}
      {/* ===================================================================== */}
      <section className="w-full bg-[#111111] text-[#FAF8F5] overflow-hidden relative">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-16 pb-20 sm:pt-20 sm:pb-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN (max about 520px text) */}
            <div className="lg:col-span-7 max-w-[520px] space-y-6">
              
              {/* Kicker */}
              <p className="text-[14px] text-[#ff8a85] font-semibold tracking-normal">
                {language === 'ta' 
                  ? 'மாநில சட்டத் தலைமைச் செயலகம் · அண்ணா அறிவாலயம், சென்னை' 
                  : 'State Legal Secretariat · Anna Arivalayam, Chennai'}
              </p>

              {/* Slogan in Kavivanar */}
              <h1 
                className="font-kavivanar font-normal text-white text-[clamp(46px,6.6vw,92px)] leading-[1.12] tracking-normal"
              >
                தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!
              </h1>

              {/* Paragraph */}
              <p className="text-[21px] text-[#e8e0d3] leading-[1.45] font-normal">
                {language === 'ta'
                  ? 'சமூக நீதி, மாநில சுயாட்சி மற்றும் 69% இடஒதுக்கீட்டை நீதிமன்றங்களில் நிலைநிறுத்தும் திராவிட இயக்க வழக்கறிஞர்கள்.'
                  : 'Advocates of the Dravidian movement, defending social justice, federalism and the 69% reservation in the courts.'}
              </p>

              {/* Two Rectangular Buttons (48px tall, 800 weight, lift 3px on hover, square corners) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#districts"
                  className="min-h-[48px] h-[48px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] rounded-none flex items-center justify-center cursor-pointer btn-lift transition-colors duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                >
                  {language === 'ta' ? 'உங்கள் மாவட்ட அணியைக் கண்டறிக' : 'Find your district unit'}
                </a>

                <a
                  href="/enrol"
                  className="min-h-[48px] h-[48px] px-6 bg-transparent hover:bg-[#FAF8F5] hover:text-[#111111] text-[#FAF8F5] font-extrabold text-[15px] border-2 border-[#FAF8F5] rounded-none flex items-center justify-center cursor-pointer btn-lift transition-colors duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                >
                  {language === 'ta' ? 'வழக்கறிஞர் அணியில் இணைக' : 'Join the Legal Wing'}
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: Parchment Clipping (340 to 440px wide, padding 26px 28px, tilted -1.6deg, solid offset shadow 10px 12px 0 #8f1118) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <article 
                className="w-full max-w-[440px] min-w-[320px] bg-[#FAF8F5] text-[#111111] p-[26px_28px] rounded-none rotate-[-1.6deg] shadow-[10px_12px_0px_#8f1118] space-y-4 relative z-10"
              >
                {/* Tag & Date */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-[#111111] uppercase tracking-normal">
                    {leadStory.category || 'Resolution'}
                  </span>
                  <span className="text-[13px] font-helvetica font-normal text-[#5B5348]">
                    {leadStory.date || '10-11-2026'}
                  </span>
                </div>

                {/* Headline */}
                <h2 className="font-helvetica font-extrabold text-[27px] leading-[1.14] text-[#111111]">
                  <Link href={`/news/${leadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                    {leadStory.title[language]}
                  </Link>
                </h2>

                {/* Link */}
                <div className="pt-2">
                  <Link 
                    href={`/news/${leadStory.id}`}
                    className="inline-block text-[#C41A1F] hover:text-[#111111] font-bold text-[15px] transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? 'முழு அறிக்கையைப் படிக்க →' : 'Read the full statement →'}
                  </Link>
                </div>
              </article>
            </div>

          </div>
        </div>

        {/* 760x760px SUN-RAY GRAPHIC (positioned right -140px, bottom -380px, turns once every 160s) */}
        <div 
          className="absolute right-[-140px] bottom-[-380px] w-[760px] h-[760px] pointer-events-none select-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          <svg
            viewBox="-380 -380 760 760"
            className="w-full h-full animate-spin-slow"
          >
            {/* 12 identical polygons: points="-22,-110 22,-110 64,-380 -64,-380" */}
            {/* Rotated by 0, 60, 120, 180, 240, 300 (fill #E31E24) */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <polygon
                key={`red-${deg}`}
                points="-22,-110 22,-110 64,-380 -64,-380"
                fill="#E31E24"
                transform={`rotate(${deg})`}
              />
            ))}

            {/* Rotated by 30, 90, 150, 210, 270, 330 (fill #8f1118) */}
            {[30, 90, 150, 210, 270, 330].map((deg) => (
              <polygon
                key={`deep-${deg}`}
                points="-22,-110 22,-110 64,-380 -64,-380"
                fill="#8f1118"
                transform={`rotate(${deg})`}
              />
            ))}

            {/* In the centre: circle r=96 filled #111 with a 4px #E31E24 stroke */}
            <circle cx="0" cy="0" r="96" fill="#111111" stroke="#E31E24" strokeWidth="4" />
          </svg>
        </div>

      </section>

      {/* ===================================================================== */}
      {/* 2. TICKER: parchment strip with 3px ink bottom border                 */}
      {/* ===================================================================== */}
      <section className="w-full bg-[#FAF8F5] border-b-[3px] border-[#111111] py-3.5 overflow-hidden">
        <div className="overflow-hidden w-full">
          <div className="animate-ticker flex items-center font-helvetica font-extrabold text-[16px] text-[#111111] whitespace-nowrap">
            {/* Repeat list twice for continuous ticker loop */}
            {[1, 2].map((loopIdx) => (
              <div key={loopIdx} className="flex items-center">
                {publishedNews.slice(0, 8).map((item) => (
                  <Link
                    key={`${loopIdx}-${item.id}`}
                    href={`/news/${item.id}`}
                    className="inline-flex items-center hover:text-[#C41A1F] transition-colors cursor-pointer mr-[56px]"
                  >
                    <span className="text-[#C41A1F] mr-2">
                      {item.category || 'Statement'}
                    </span>
                    <span className={language === 'en' ? 'uppercase tracking-[.06em]' : ''}>
                      {item.title[language]}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. METRICS BAND (red background #E31E24, white text, padding 48px)    */}
      {/* ===================================================================== */}
      <section 
        ref={metricsRef}
        className="w-full bg-[#E31E24] text-white py-12"
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Metric 1: 3,500+ Registered advocates */}
            <div className="min-w-[220px] border-t-4 border-white pt-4">
              <span className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none tracking-[-.02em] block">
                {countingDone ? '3,500+' : counts[0].toLocaleString() + (countingDone ? '+' : '')}
              </span>
              <span className="font-semibold text-[18px] text-white block mt-2">
                {SITE_STATS.metrics[0]?.label[language] || 'Registered advocates'}
              </span>
            </div>

            {/* Metric 2: 74 District units */}
            <div className="min-w-[220px] border-t-4 border-white pt-4">
              <span className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none tracking-[-.02em] block">
                {countingDone ? '74' : counts[1]}
              </span>
              <span className="font-semibold text-[18px] text-white block mt-2">
                {SITE_STATS.metrics[1]?.label[language] || 'District units'}
              </span>
            </div>

            {/* Metric 3: 50+ Years of jurisprudence */}
            <div className="min-w-[220px] border-t-4 border-white pt-4">
              <span className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none tracking-[-.02em] block">
                {countingDone ? '50+' : counts[2] + (countingDone ? '+' : '')}
              </span>
              <span className="font-semibold text-[18px] text-white block mt-2">
                {SITE_STATS.metrics[2]?.label[language] || 'Years of jurisprudence'}
              </span>
            </div>

            {/* Metric 4: 69% Reservation defended */}
            <div className="min-w-[220px] border-t-4 border-white pt-4">
              <span className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none tracking-[-.02em] block">
                {countingDone ? '69%' : counts[3] + (countingDone ? '%' : '')}
              </span>
              <span className="font-semibold text-[18px] text-white block mt-2">
                {SITE_STATS.metrics[3]?.label[language] || 'Reservation defended'}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. LEADERS (parchment, padding 80px)                                  */}
      {/* ===================================================================== */}
      <section 
        ref={leadersSection.ref}
        className={`w-full bg-[#FAF8F5] py-20 fade-rise ${
          leadersSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left column: title in Kavivanar clamp(38px, 4.8vw, 62px) colour #C41A1F + paragraph */}
            <div className="lg:col-span-5 space-y-5">
              <h2 className="font-kavivanar font-normal text-[#C41A1F] text-[clamp(38px,4.8vw,62px)] leading-[1.14]">
                {language === 'ta' ? 'அணியை வழிநடத்துவோர்' : 'Those who lead the wing'}
              </h2>
              <p className="text-[19px] text-[#5B5348] leading-[1.6]">
                {language === 'ta'
                  ? 'ஒரு தலைவரும் ஒரு செயலாளரும் ஒன்பது இணைச் செயலாளர்கள், ஐந்து துணைச் செயலாளர்கள், ஒன்பது தலைமை நிலைய வழக்கறிஞர்கள் மற்றும் 74 அமைப்பு மாவட்ட அமைப்பாளர்களை வழிநடத்துகிறார்கள்.'
                  : 'A President and a Secretary direct nine Joint Secretaries, five Deputy Secretaries, nine Head Office Advocates and organisers in 74 district units.'}
              </p>
            </div>

            {/* Right: Two people side by side */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Leader 1: President R. Viduthalai */}
              <div className="space-y-4">
                {/* 4:5 portrait with 2px ink border */}
                <div className="aspect-[4/5] border-2 border-[#111111] bg-[#f1ece2] flex items-center justify-center rounded-none relative overflow-hidden">
                  <span className="font-helvetica font-semibold text-[16px] text-[#5B5348]">
                    [Official photo]
                  </span>
                </div>

                {/* 6px top rule (red for President) */}
                <div className="border-t-[6px] border-[#E31E24] pt-3 space-y-1">
                  <h3 className="font-helvetica font-extrabold text-[26px] text-[#111111] leading-snug">
                    R. Viduthalai
                  </h3>
                  <p className="text-[#C41A1F] font-extrabold text-[17px]">
                    {language === 'ta' ? 'தலைவர்' : 'President'}
                  </p>
                  <p className="text-[16px] text-[#5B5348] leading-relaxed">
                    Senior Advocate · Former Advocate General of Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Leader 2: Secretary N.R. Elango */}
              <div className="space-y-4">
                {/* 4:5 portrait with 2px ink border */}
                <div className="aspect-[4/5] border-2 border-[#111111] bg-[#f1ece2] flex items-center justify-center rounded-none relative overflow-hidden">
                  <span className="font-helvetica font-semibold text-[16px] text-[#5B5348]">
                    [Official photo]
                  </span>
                </div>

                {/* 6px top rule (ink for Secretary) */}
                <div className="border-t-[6px] border-[#111111] pt-3 space-y-1">
                  <h3 className="font-helvetica font-extrabold text-[26px] text-[#111111] leading-snug">
                    N.R. Elango
                  </h3>
                  <p className="text-[#C41A1F] font-extrabold text-[17px]">
                    {language === 'ta' ? 'செயலாளர்' : 'Secretary'}
                  </p>
                  <p className="text-[16px] text-[#5B5348] leading-relaxed">
                    Senior Advocate · Member of Parliament, Rajya Sabha
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. NEWS (id news, background #f1ece2, 3px ink top border, padding 80px)*/}
      {/* ===================================================================== */}
      <section 
        id="news"
        ref={newsSection.ref}
        className={`w-full bg-[#f1ece2] border-t-[3px] border-[#111111] py-20 fade-rise ${
          newsSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          {/* Header row with title (Kavivanar) and filter tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-[3px] border-[#111111]">
            <h2 className="font-kavivanar font-normal text-[#111111] text-[clamp(34px,4vw,48px)] leading-tight">
              {language === 'ta' ? 'செய்தியகத்திலிருந்து' : 'From the press bureau'}
            </h2>

            {/* Filter Tabs: All / Press release / Statement / Resolution */}
            <div className="flex items-center gap-6 flex-wrap">
              {(['All', 'Press release', 'Statement', 'Resolution'] as const).map((tab) => {
                const isActive = newsFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setNewsFilter(tab)}
                    className={`min-h-[44px] h-[44px] text-[17px] font-extrabold cursor-pointer transition-colors relative rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24] ${
                      isActive
                        ? 'text-[#C41A1F] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#C41A1F]'
                        : 'text-[#111111] hover:text-[#C41A1F]'
                    }`}
                  >
                    {tab === 'All' && language === 'ta' ? 'அனைத்தும்' : tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of ruled rows */}
          <div className="divide-y divide-[#111111]">
            {filteredNews.map((item) => {
              const d = new Date(item.date);
              const dayStr = isNaN(d.getDate()) ? '10' : String(d.getDate()).padStart(2, '0');
              const monthYearStr = d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

              return (
                <div
                  key={item.id}
                  className="group relative py-7 px-0 transition-all duration-250 cursor-pointer overflow-hidden hover:bg-[#e9e3d7]"
                >
                  {/* Red bar grows from the left edge (0 to 6px wide) on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[6px] bg-[#E31E24] transition-all duration-250" />

                  {/* Row content shifts 22px right on hover */}
                  <div className="transition-transform duration-250 group-hover:translate-x-[22px] flex flex-col md:flex-row md:items-start gap-6 md:gap-8 pr-4">
                    
                    {/* Left: 108px column with day number and month/year */}
                    <div className="w-[108px] shrink-0">
                      <span className="font-helvetica font-extrabold text-[56px] leading-[0.9] text-[#111111] block">
                        {dayStr}
                      </span>
                      <span className="font-extrabold text-[15px] text-[#5B5348] block mt-1">
                        {monthYearStr}
                      </span>
                    </div>

                    {/* Middle: type in #C41A1F, headline, summary, source */}
                    <div className="flex-1 space-y-2">
                      <span className="text-[#C41A1F] font-extrabold text-[15px] block">
                        {item.category || 'Statement'}
                      </span>

                      <h3 className="font-helvetica font-extrabold text-[clamp(24px,2.6vw,34px)] leading-[1.14] text-[#111111]">
                        <Link href={`/news/${item.id}`} className="hover:text-[#C41A1F] transition-colors">
                          {item.title[language]}
                        </Link>
                      </h3>

                      <p className="text-[18px] text-[#3a322d] max-w-[720px] leading-[1.5]">
                        {item.summary[language]}
                      </p>

                      <p className="text-[15px] font-semibold text-[#5B5348]">
                        {item.court || (language === 'ta' ? 'மாநில சட்டத் தலைமைச் செயலகம்' : 'State Legal Secretariat')}
                      </p>
                    </div>

                    {/* Right: arrow "→" in #C41A1F */}
                    <div className="shrink-0 self-center">
                      <span className="text-[#C41A1F] text-[28px] font-bold block" aria-hidden="true">
                        →
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. DISTRICTS (id districts, ink background, parchment text, padding 80px)*/}
      {/* ===================================================================== */}
      <section 
        id="districts"
        ref={districtsSection.ref}
        className={`w-full bg-[#111111] text-[#FAF8F5] py-20 fade-rise ${
          districtsSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] space-y-10">
          
          {/* Title in Kavivanar */}
          <h2 className="font-kavivanar font-normal text-[#FAF8F5] text-[clamp(34px,4vw,54px)] leading-tight">
            {language === 'ta' 
              ? '74 அமைப்பு மாவட்டங்கள், ஓர் அழைப்பு தூரத்தில்' 
              : '74 district units, one phone call away'}
          </h2>

          {/* Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 2px parchment bordered search box + 380px tall scrolling list */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Search box with inline SVG magnifier (18px) */}
              <div className="relative">
                <input
                  type="text"
                  value={districtQuery}
                  onChange={(e) => setDistrictQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்டம் அல்லது அமைப்பாளர்...' : 'Search district or organiser...'}
                  className="w-full min-h-[48px] h-[48px] bg-transparent border-2 border-[#FAF8F5] text-[#FAF8F5] pl-11 pr-4 text-[16px] outline-none rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FAF8F5]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              {/* 380px tall scrolling list */}
              <div className="h-[380px] overflow-y-auto divide-y divide-[#3d3633] border-t border-b border-[#3d3633]">
                {filteredDistricts.map((d) => {
                  const isSelected = d.id === activeDistrict?.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDistrict(d.id)}
                      className={`min-h-[48px] w-full p-3 px-4 flex items-center justify-between text-left cursor-pointer transition-colors duration-150 rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24] ${
                        isSelected 
                          ? 'bg-[#E31E24] text-white' 
                          : 'text-[#FAF8F5] hover:bg-[#2a2523]'
                      }`}
                    >
                      <span className="font-extrabold text-[17px] truncate mr-3">
                        {d.name[language]}
                      </span>
                      <span className={`text-[16px] shrink-0 truncate ${
                        isSelected ? 'text-white' : 'text-[#d8cfc2]'
                      }`}>
                        {d.organizer[language]}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right: parchment panel with an 8px red top border, padding 36px */}
            <div className="lg:col-span-7">
              {activeDistrict && (
                <div 
                  className={`bg-[#FAF8F5] text-[#111111] border-t-8 border-[#E31E24] p-[36px] rounded-none space-y-6 transition-all duration-300 ${
                    districtPanelFading ? 'opacity-0 translate-y-[10px]' : 'opacity-100 translate-y-0'
                  }`}
                >
                  <span className="text-[#C41A1F] font-bold text-[13px] tracking-normal block">
                    District organiser · No. {activeDistrict.number || activeDistrict.id}
                  </span>

                  <h3 className="font-helvetica font-extrabold text-[clamp(34px,4vw,52px)] leading-[1.1] text-[#111111]">
                    {activeDistrict.name[language]}
                  </h3>

                  <p className="font-semibold text-[26px] text-[#111111]">
                    {activeDistrict.organizer[language]}
                  </p>

                  <div className="space-y-3 pt-2">
                    {activeDistrict.showPhonePublicly === false ? (
                      <div className="p-4 bg-[#f1ece2] border border-[#d7d0c3] text-[#111111]">
                        <span className="block text-[14px] text-[#5B5348] mb-2">
                          {language === 'ta' ? 'கழகத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்க:' : 'Contact through the State Secretariat:'}
                        </span>
                        <a
                          href="tel:044-24344444"
                          className="min-h-[48px] h-[48px] w-full px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white flex items-center justify-between cursor-pointer btn-lift rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                        >
                          <span className="font-helvetica font-extrabold text-[24px]">
                            044-2434 4444
                          </span>
                          <span className="font-bold text-[16px]">
                            {language === 'ta' ? 'அழைக்க' : 'Call'}
                          </span>
                        </a>
                      </div>
                    ) : parsedPhoneNumbers.length === 0 ? (
                      <div className="text-[16px] text-[#5B5348]">
                        Contact through the State Secretariat: 044-2434 4444
                      </div>
                    ) : (
                      parsedPhoneNumbers.map((phone, idx) => (
                        <a
                          key={idx}
                          href={`tel:${phone.replace(/\s+/g, '')}`}
                          className="min-h-[48px] h-[52px] w-full px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white flex items-center justify-between cursor-pointer btn-lift rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                        >
                          <span className="font-helvetica font-extrabold text-[24px]">
                            {phone}
                          </span>
                          <span className="font-bold text-[16px]">
                            {language === 'ta' ? 'அழைக்க' : 'Call'}
                          </span>
                        </a>
                      ))
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Existing TamilNaduMap below districts block */}
          <div className="pt-6 border-t border-[#3d3633]">
            <TamilNaduMap />
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. STRUCTURE (padding 80px): Three branches under the Secretary      */}
      {/* ===================================================================== */}
      <section 
        id="structure"
        ref={structureSection.ref}
        className={`w-full py-20 fade-rise ${
          structureSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] space-y-10">
          
          {/* Title in Kavivanar */}
          <h2 className="font-kavivanar font-normal text-[#111111] text-[clamp(34px,4vw,52px)] leading-tight">
            {language === 'ta' 
              ? 'செயலாளர் கீழ் இயங்கும் மூன்று பிரிவுகள்' 
              : 'Three branches under the Secretary'}
          </h2>

          {/* Three equal blocks in a 2px ink frame */}
          <div className="border-2 border-[#111111] grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#111111] rounded-none">
            
            {/* Block 1: Joint Secretaries 9 */}
            <button
              type="button"
              onClick={() => handleSelectBranch('joint')}
              className={`p-8 text-left transition-colors cursor-pointer rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24] ${
                selectedBranch === 'joint' 
                  ? 'bg-[#111111] text-[#FAF8F5]' 
                  : 'bg-white hover:bg-[#111111] hover:text-[#FAF8F5] text-[#111111]'
              }`}
            >
              <span className="font-helvetica font-extrabold text-[64px] leading-none tracking-[-.03em] block mb-2">
                9
              </span>
              <span className="font-extrabold text-[22px] block">
                {language === 'ta' ? 'இணைச் செயலாளர்கள்' : 'Joint Secretaries'}
              </span>
            </button>

            {/* Block 2: Deputy Secretaries 5 */}
            <button
              type="button"
              onClick={() => handleSelectBranch('deputy')}
              className={`p-8 text-left transition-colors cursor-pointer rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24] ${
                selectedBranch === 'deputy' 
                  ? 'bg-[#111111] text-[#FAF8F5]' 
                  : 'bg-white hover:bg-[#111111] hover:text-[#FAF8F5] text-[#111111]'
              }`}
            >
              <span className="font-helvetica font-extrabold text-[64px] leading-none tracking-[-.03em] block mb-2">
                5
              </span>
              <span className="font-extrabold text-[22px] block">
                {language === 'ta' ? 'துணைச் செயலாளர்கள்' : 'Deputy Secretaries'}
              </span>
            </button>

            {/* Block 3: Head Office Advocates 9 */}
            <button
              type="button"
              onClick={() => handleSelectBranch('headoffice')}
              className={`p-8 text-left transition-colors cursor-pointer rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24] ${
                selectedBranch === 'headoffice' 
                  ? 'bg-[#111111] text-[#FAF8F5]' 
                  : 'bg-white hover:bg-[#111111] hover:text-[#FAF8F5] text-[#111111]'
              }`}
            >
              <span className="font-helvetica font-extrabold text-[64px] leading-none tracking-[-.03em] block mb-2">
                9
              </span>
              <span className="font-extrabold text-[22px] block">
                {language === 'ta' ? 'தலைமை நிலைய வழக்கறிஞர்கள்' : 'Head Office Advocates'}
              </span>
            </button>

          </div>

          {/* Members of chosen branch */}
          <div 
            className={`divide-y divide-[#d7d0c3] border-t border-b border-[#d7d0c3] transition-opacity duration-250 ${
              branchFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {branchRoster.map((member) => (
              <div 
                key={member.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="font-extrabold text-[18px] text-[#111111]">
                  {member.name[language]}
                </span>
                <span className="text-[#5B5348] text-[16px]">
                  {member.district[language]}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. JOIN (id join, two equal blocks, padding 44px 40px)                */}
      {/* ===================================================================== */}
      <section 
        id="join"
        ref={joinSection.ref}
        className={`max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] py-16 sm:py-20 fade-rise ${
          joinSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-none overflow-hidden">
          
          {/* RED BLOCK (white text) */}
          <div className="bg-[#E31E24] text-white p-[40px] sm:p-[44px] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="font-kavivanar font-normal text-white text-[44px] leading-tight">
                {language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'Advocate enrolment'}
              </h2>
              <p className="text-[18px] text-white leading-[1.6]">
                {language === 'ta'
                  ? 'பார் கவுன்சிலில் பதிவுபெற்ற வழக்கறிஞர்கள் தங்களது பதிவு எண் மற்றும் மாவட்ட அணியைத் தேர்வு செய்து வழக்கறிஞர் அணியில் இணையலாம்.'
                  : 'Practising advocates join the Legal Wing with a Bar Council enrolment number and a district unit.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/enrol"
                className="min-h-[48px] h-[48px] px-8 bg-[#111111] hover:bg-black text-white font-extrabold text-[15px] inline-flex items-center justify-center cursor-pointer btn-lift rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white"
              >
                {language === 'ta' ? 'இப்போதே இணைக' : 'Enrol now'}
              </Link>
            </div>
          </div>

          {/* INK BLOCK (parchment text) */}
          <div className="bg-[#111111] text-[#FAF8F5] p-[40px] sm:p-[44px] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* 2px red bordered notice */}
              <div className="border-2 border-[#E31E24] p-3 text-[15px] font-bold text-white">
                If you or someone you know is in police custody, call [HELPLINE NUMBER] now.
              </div>

              <h2 className="font-kavivanar font-normal text-[#FAF8F5] text-[44px] leading-tight">
                {language === 'ta' ? 'மக்கள் சட்ட உதவி மையம்' : 'Citizen legal desk'}
              </h2>

              <p className="text-[18px] text-[#e8e0d3] leading-[1.6]">
                {language === 'ta'
                  ? 'இலவச சட்ட உதவிக்கு விண்ணப்பியுங்கள். உங்கள் கோரிக்கை உங்கள் மாவட்ட அமைப்பாளருக்கு அனுப்பப்பட்டு உங்களுக்கு கண்காணிப்பு எண் வழங்கப்படும்.'
                  : 'Ask for free legal help. Your request goes to the organiser of your district and you get a tracking ID.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/citizen-desk"
                className="min-h-[48px] h-[48px] px-8 bg-[#FAF8F5] hover:bg-white text-[#111111] font-extrabold text-[15px] inline-flex items-center justify-center cursor-pointer btn-lift rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
              >
                {language === 'ta' ? 'மனுவை சமர்ப்பிக்க' : 'Submit a request'}
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
