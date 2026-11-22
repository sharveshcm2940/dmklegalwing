'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { SITE_STATS } from '@/data/siteStats';
import { OFFICIAL_HIERARCHY_CHART, IDEOLOGY_PILLARS } from '@/data/content';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { useReveal } from '@/hooks/useReveal';
import { Leader } from '@/types';

export default function HomePage() {
  const { language } = useLanguage();
  const { news, districts } = useData();

  // 1. LEAD STORY FOR HERO CLIPPING (from /api/news)
  const publishedNews = useMemo(() => {
    return news.filter((n) => !n.status || n.status.toLowerCase() === 'published');
  }, [news]);

  const leadStory = useMemo(() => {
    return publishedNews.find((n) => n.featured || n.isLeadStory) || publishedNews[0] || {
      id: 'supreme-court-governor-ruling',
      category: 'Resolution',
      date: '2026-11-18',
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
    if (newsFilter === 'All') return publishedNews.slice(0, 6);
    return publishedNews
      .filter((n) => n.category.toLowerCase().includes(newsFilter.toLowerCase()))
      .slice(0, 6);
  }, [publishedNews, newsFilter]);

  // 4. DISTRICTS SEARCH & SELECT
  const [districtQuery, setDistrictQuery] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('chennai-north');
  const [districtPanelFading, setDistrictPanelFading] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const filteredDistricts = useMemo(() => {
    const q = districtQuery.toLowerCase().trim();
    if (!q) return districts;
    return districts.filter((d) => 
      d.name.en.toLowerCase().includes(q) ||
      d.name.ta?.toLowerCase().includes(q) ||
      d.organizer.en.toLowerCase().includes(q) ||
      d.organizer.ta?.toLowerCase().includes(q) ||
      d.headquarters.en.toLowerCase().includes(q) ||
      d.headquarters.ta?.toLowerCase().includes(q)
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
    }, 200);
  };

  const handleCopyPhone = (phone: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // 5. STRUCTURE: THREE BRANCHES UNDER THE SECRETARY
  const [selectedBranch, setSelectedBranch] = useState<'joint' | 'deputy' | 'headoffice'>('joint');
  const [selectedLeaderModal, setSelectedLeaderModal] = useState<any | null>(null);

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

  // Section Reveal Hooks
  const tickerSection = useReveal();
  const metricsSection = useReveal();
  const ideologySection = useReveal();
  const districtsSection = useReveal();
  const structureSection = useReveal();
  const newsSection = useReveal();
  const ctaSection = useReveal();

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[18px] leading-[1.75] antialiased">
      
      {/* ===================================================================== */}
      {/* 1. HERO (Ink Background #111111, Parchment Text, Editorial Layout)    */}
      {/* ===================================================================== */}
      <section className="w-full bg-[#111111] text-[#FAF8F5] overflow-hidden relative border-b border-[#111111]">
        {/* Subtle top masthead strip */}
        <div className="border-b border-[#2b2522] bg-[#161413] px-[clamp(20px,4vw,56px)] py-2.5 text-[14px] text-[#FAF8F5]/80 flex flex-wrap items-center justify-between gap-4 font-helvetica">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#E31E24] inline-block animate-pulse" />
            <span className="font-extrabold uppercase tracking-normal text-white">
              {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி' : 'DMK Legal Wing'}
            </span>
            <span className="text-[#5B5348] select-none">·</span>
            <span>{language === 'ta' ? 'தலைமைச் செயலகம், அண்ணா அறிவாலயம்' : 'State Legal Secretariat, Anna Arivalayam'}</span>
          </div>
          <div className="flex items-center gap-4 text-[#d8cfc2]">
            <span>Chennai Edition</span>
            <span className="text-[#5B5348] select-none">·</span>
            <span>Est. 1971</span>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-14 pb-20 sm:pt-20 sm:pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Main Typography */}
            <div className="lg:col-span-7 max-w-[560px] space-y-6">
              
              {/* Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e1b19] border border-[#3d3633] text-[13px] font-extrabold text-[#ff8a85] uppercase tracking-normal">
                <span>CONSTITUTIONAL ADVOCACY & SOCIAL JUSTICE</span>
              </div>

              {/* Slogan in Kavivanar */}
              <h1 className="font-kavivanar font-normal text-white text-[clamp(44px,6.5vw,88px)] leading-[1.08] tracking-normal">
                தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!
              </h1>

              {/* Paragraph */}
              <p className="text-[20px] text-[#d8cfc2] leading-[1.6] font-normal">
                {language === 'ta'
                  ? 'சமூக நீதி, மாநில சுயாட்சி மற்றும் 69% இடஒதுக்கீட்டை உச்ச நீதிமன்றம் மற்றும் உயர் நீதிமன்றங்களில் சமரசமின்றி நிலைநிறுத்தும் திராவிட இயக்க வழக்கறிஞர்கள்.'
                  : 'Advocates of the Dravidian movement, relentlessly defending state autonomy, 69% affirmative action, and mother-tongue judicial rights before Constitutional Benches.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#districts"
                  className="min-h-[48px] h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center cursor-pointer transition-colors duration-150 btn-lift"
                >
                  {language === 'ta' ? 'மாவட்ட அணியைக் கண்டறிக' : 'Find your district unit'}
                </a>

                <Link
                  href="/enrol"
                  className="min-h-[48px] h-[48px] px-8 bg-transparent hover:bg-[#FAF8F5] hover:text-[#111111] text-[#FAF8F5] font-helvetica font-extrabold text-[15px] uppercase tracking-normal border-2 border-[#FAF8F5] flex items-center justify-center cursor-pointer transition-colors duration-150 btn-lift"
                >
                  {language === 'ta' ? 'அணியில் இணைக' : 'Join the Legal Wing'}
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN: Tactile Lead Story Dispatch Clipping */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <article 
                className="w-full max-w-[420px] bg-[#FAF8F5] text-[#111111] p-8 border-2 border-[#111111] shadow-[10px_12px_0px_#8f1118] space-y-4 relative z-10 transition-transform duration-200 hover:-translate-y-1"
              >
                {/* Tag & Date */}
                <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-3">
                  <span className="text-[13px] font-extrabold text-[#C41A1F] uppercase tracking-normal">
                    [{leadStory.category || 'Constitutional Ruling'}]
                  </span>
                  <span className="text-[13px] font-helvetica font-bold text-[#5B5348]">
                    {leadStory.date || '2026-11-18'}
                  </span>
                </div>

                {/* Headline */}
                <h2 className="font-helvetica font-extrabold text-[24px] leading-[1.2] text-[#111111]">
                  <Link href={`/news/${leadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                    {leadStory.title[language]}
                  </Link>
                </h2>

                {/* Summary */}
                <p className="text-[16px] text-[#3a322d] leading-relaxed line-clamp-3">
                  {leadStory.summary[language]}
                </p>

                {/* Link */}
                <div className="pt-2 border-t border-[#d7d0c3] flex items-center justify-between">
                  <Link 
                    href={`/news/${leadStory.id}`}
                    className="inline-flex items-center gap-1.5 text-[#C41A1F] hover:text-[#111111] font-helvetica font-extrabold text-[15px] transition-colors cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'Read full dispatch'}</span>
                    <span>&rarr;</span>
                  </Link>
                  <span className="text-[12px] font-bold text-[#5B5348] uppercase">
                    Supreme Court
                  </span>
                </div>
              </article>
            </div>

          </div>
        </div>

        {/* Live News Ticker Strip across bottom of Hero */}
        <div className="border-t border-[#2b2522] bg-[#0c0b0a] py-3 overflow-hidden select-none">
          <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] flex items-center gap-4">
            <span className="shrink-0 bg-[#E31E24] text-white text-[12px] font-extrabold px-2.5 py-0.5 uppercase tracking-normal">
              {language === 'ta' ? 'முக்கிய அறிவிப்புகள்' : 'DISPATCH WIRE'}
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="animate-ticker inline-block">
                {publishedNews.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="inline-flex items-center text-[15px] text-[#d8cfc2] hover:text-[#ff8a85] mx-6 transition-colors"
                  >
                    <span className="text-[#E31E24] mr-2">✦</span>
                    <span className="font-bold mr-2">[{item.category}]:</span>
                    <span>{item.title[language]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. METRICS BAND (Animated Counter with Strict Editorial Grid)         */}
      {/* ===================================================================== */}
      <section 
        ref={metricsRef}
        className="w-full bg-[#FAF8F5] border-b border-[#111111] py-16"
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-[#d7d0c3]">
            
            {/* Metric 01: Enrolled Advocates */}
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="font-helvetica font-extrabold text-[clamp(44px,5vw,68px)] text-[#111111] leading-none">
                {counts[0].toLocaleString()}+
              </div>
              <div className="w-12 h-1 bg-[#E31E24]" />
              <p className="text-[17px] font-bold text-[#111111]">
                {language === 'ta' ? 'பதிவுபெற்ற வழக்கறிஞர்கள்' : 'Enrolled Advocates'}
              </p>
              <p className="text-[14px] text-[#5B5348]">
                {language === 'ta' ? 'மாநிலம் முழுவதும் கழகப் பணிபுரியும் சட்டப் படை.' : 'Active bar practitioners defending cadre and constitutional rights.'}
              </p>
            </div>

            {/* Metric 02: Party District Units */}
            <div className="space-y-2 pt-4 md:pt-0 md:pl-10">
              <div className="font-helvetica font-extrabold text-[clamp(44px,5vw,68px)] text-[#111111] leading-none">
                {counts[1]}
              </div>
              <div className="w-12 h-1 bg-[#111111]" />
              <p className="text-[17px] font-bold text-[#111111]">
                {language === 'ta' ? 'கழக மாவட்ட வழக்கறிஞர் அணிகள்' : 'Party District Units'}
              </p>
              <p className="text-[14px] text-[#5B5348]">
                {language === 'ta' ? '74 கழக மாவட்டங்களிலும் நேரடி சட்டக் களப்பணி.' : 'Complete jurisdictional coverage across all 74 administrative units.'}
              </p>
            </div>

            {/* Metric 03: Constitutional Victories */}
            <div className="space-y-2 pt-4 md:pt-0 md:pl-10">
              <div className="font-helvetica font-extrabold text-[clamp(44px,5vw,68px)] text-[#111111] leading-none">
                {counts[2]}+
              </div>
              <div className="w-12 h-1 bg-[#E31E24]" />
              <p className="text-[17px] font-bold text-[#111111]">
                {language === 'ta' ? 'அரசமைப்பு வரலாற்றுத் தீர்ப்புகள்' : 'Landmark Bench Victories'}
              </p>
              <p className="text-[14px] text-[#5B5348]">
                {language === 'ta' ? 'உச்ச நீதிமன்றம் மற்றும் உயர் நீதிமன்றங்களில் நிலைநாட்டிய தீர்ப்புகள்.' : 'Precedents won on federalism, legislative sovereignty and rights.'}
              </p>
            </div>

            {/* Metric 04: 69% Reservation Shield */}
            <div className="space-y-2 pt-4 md:pt-0 md:pl-10">
              <div className="font-helvetica font-extrabold text-[clamp(44px,5vw,68px)] text-[#C41A1F] leading-none">
                {counts[3]}%
              </div>
              <div className="w-12 h-1 bg-[#C41A1F]" />
              <p className="text-[17px] font-bold text-[#111111]">
                {language === 'ta' ? 'இடஒதுக்கீட்டுப் பாதுகாப்பு' : 'Affirmative Action Shield'}
              </p>
              <p className="text-[14px] text-[#5B5348]">
                {language === 'ta' ? 'தமிழ்நாடு சட்டம் 45/1994-ன் கீழ் உறுதிசெய்யப்பட்ட சமூக நீதி.' : 'Safeguarded under the 9th Schedule through landmark litigation.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. SIX DOCTRINES OF DRAVIDIAN JURISPRUDENCE (Interactive Preview)     */}
      {/* ===================================================================== */}
      <section 
        ref={ideologySection.ref}
        className={`w-full py-20 border-b border-[#111111] bg-[#FAF8F5] fade-rise ${
          ideologySection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#111111] pb-6 mb-12">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                {language === 'ta' ? 'கோட்பாட்டுத் தூண்கள்' : 'IDEOLOGICAL ANCHORS'}
              </span>
              <h2 className="font-kavivanar font-normal text-[clamp(32px,4.5vw,52px)] text-[#111111] leading-tight mt-1">
                {language === 'ta' ? 'திராவிடச் சட்டவியலின் மூல விழுமியங்கள்' : 'Foundations of Dravidian Jurisprudence'}
              </h2>
            </div>
            <Link
              href="/ideology"
              className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-0.5 hover:border-[#C41A1F] transition-colors shrink-0"
            >
              <span>{language === 'ta' ? 'முழு கொள்கைப் பிரகடனம் →' : 'Explore all six doctrines →'}</span>
            </Link>
          </div>

          {/* Six Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {IDEOLOGY_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-white border border-[#111111] p-8 flex flex-col justify-between space-y-6 hover:border-[#E31E24] transition-all duration-200 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-3">
                    <span className="font-helvetica font-extrabold text-[28px] text-[#C41A1F]">
                      {pillar.number}
                    </span>
                    <span className="text-[12px] font-extrabold uppercase text-[#5B5348]">
                      DOCTRINE
                    </span>
                  </div>

                  <h3 className={`text-[24px] text-[#111111] group-hover:text-[#E31E24] transition-colors leading-snug ${
                    language === 'ta' ? 'font-kavivanar font-normal' : 'font-helvetica font-extrabold'
                  }`}>
                    {pillar.title[language]}
                  </h3>

                  <p className="text-[16px] text-[#5B5348] leading-relaxed line-clamp-3">
                    {pillar.description[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#d7d0c3]">
                  <p className="text-[13px] text-[#5B5348] font-bold line-clamp-1">
                    <span className="text-[#111111] mr-1">{language === 'ta' ? 'நீதிமன்றங்களில்:' : 'In court:'}</span>
                    {pillar.legalRelevance[language]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. DISTRICT LEGAL UNITS & INTERACTIVE REGISTRY                        */}
      {/* ===================================================================== */}
      <section 
        id="districts"
        ref={districtsSection.ref}
        className={`w-full py-20 border-b border-[#111111] bg-[#FAF8F5] fade-rise ${
          districtsSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#111111] pb-6 mb-12">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                {language === 'ta' ? '74 கழக மாவட்டங்கள்' : '74 DISTRICT LEGAL REGISTRY'}
              </span>
              <h2 className="font-kavivanar font-normal text-[clamp(32px,4.5vw,52px)] text-[#111111] leading-tight mt-1">
                {language === 'ta' ? 'உங்கள் மாவட்ட வழக்கறிஞர் அணித் தொடர்புகள்' : 'Find Your Local Legal Secretariat'}
              </h2>
            </div>
            <Link
              href="/districts"
              className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-0.5 hover:border-[#C41A1F] transition-colors shrink-0"
            >
              <span>{language === 'ta' ? 'முழு மாவட்டக் கோப்பகம் →' : 'View all 74 districts →'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: District List & Search */}
            <div className="lg:col-span-5 bg-white border border-[#111111] p-6 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={districtQuery}
                  onChange={(e) => setDistrictQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்டப் பெயர் அல்லது அமைப்பாளர்...' : 'Search by district or organizer...'}
                  className="w-full bg-[#FAF8F5] border-2 border-[#111111] px-4 py-2.5 text-[16px] placeholder-[#5B5348] focus:outline-none focus:border-[#E31E24]"
                />
                {districtQuery && (
                  <button
                    type="button"
                    onClick={() => setDistrictQuery('')}
                    className="absolute right-3 top-3 text-[13px] font-bold text-[#C41A1F] hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="max-h-[460px] overflow-y-auto divide-y divide-[#d7d0c3] border-t border-b border-[#d7d0c3] pr-1">
                {filteredDistricts.length === 0 ? (
                  <p className="py-8 text-center text-[#5B5348] text-[15px]">
                    {language === 'ta' ? 'மாவட்டங்கள் கிடைக்கவில்லை.' : 'No matching districts found.'}
                  </p>
                ) : (
                  filteredDistricts.map((d) => {
                    const isSelected = activeDistrict?.id === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleSelectDistrict(d.id)}
                        className={`w-full text-left p-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-[#FAF8F5]'
                            : 'hover:bg-[#f1ece2] text-[#111111]'
                        }`}
                      >
                        <div>
                          <div className="font-helvetica font-extrabold text-[16px]">
                            {d.name[language]}
                          </div>
                          <div className={`text-[13px] line-clamp-1 ${isSelected ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                            {d.organizer[language]} · {d.headquarters[language]}
                          </div>
                        </div>
                        <span className={`text-[12px] font-bold px-2 py-0.5 ${
                          isSelected ? 'bg-[#E31E24] text-white' : 'bg-[#FAF8F5] text-[#111111] border border-[#d7d0c3]'
                        }`}>
                          {d.zone}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Active District Docket Panel */}
            <div className="lg:col-span-7 bg-white border border-[#111111] p-8 md:p-10 space-y-6">
              {activeDistrict && (
                <div
                  className={`space-y-6 transition-opacity duration-200 ${
                    districtPanelFading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#111111] pb-4">
                    <div>
                      <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
                        [{activeDistrict.zone} ZONE · DISTRICT REGISTRY]
                      </span>
                      <h3 className="font-helvetica font-extrabold text-[32px] text-[#111111] leading-tight mt-0.5">
                        {activeDistrict.name[language]}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-[#111111] text-white font-helvetica font-extrabold text-[13px] uppercase">
                      HQ: {activeDistrict.headquarters[language]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-[#FAF8F5] border border-[#d7d0c3] space-y-1">
                      <span className="text-[12px] font-bold text-[#5B5348] uppercase">
                        {language === 'ta' ? 'மாவட்ட அமைப்பாளர்' : 'District Organizer'}
                      </span>
                      <p className="font-helvetica font-extrabold text-[18px] text-[#111111]">
                        {activeDistrict.organizer[language]}
                      </p>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] border border-[#d7d0c3] space-y-1">
                      <span className="text-[12px] font-bold text-[#5B5348] uppercase">
                        {language === 'ta' ? 'நீதிமன்ற வளாகம்' : 'Court Complex'}
                      </span>
                      <p className="font-helvetica font-extrabold text-[18px] text-[#111111]">
                        {activeDistrict.courtComplex[language]}
                      </p>
                    </div>
                  </div>

                  {/* Joint Organizers */}
                  {activeDistrict.jointOrganizers && activeDistrict.jointOrganizers.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[13px] font-bold text-[#5B5348] uppercase">
                        {language === 'ta' ? 'இணை அமைப்பாளர்கள்:' : 'Joint Organizers:'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeDistrict.jointOrganizers.map((jo, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#f1ece2] border border-[#d7d0c3] text-[14px] font-semibold text-[#111111]"
                          >
                            {jo[language]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Phone & Actions */}
                  <div className="pt-4 border-t border-[#d7d0c3] flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[12px] font-bold text-[#5B5348] uppercase block">
                        {language === 'ta' ? 'தொடர்பு தொலைபேசி' : 'Official Phone'}
                      </span>
                      <span className="font-helvetica font-extrabold text-[20px] text-[#111111]">
                        {activeDistrict.contactPhone || 'State Legal Desk: 044-24344444'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {activeDistrict.contactPhone && (
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(activeDistrict.contactPhone)}
                          className="min-h-[44px] h-[44px] px-5 bg-white hover:bg-[#FAF8F5] text-[#111111] font-helvetica font-extrabold text-[14px] uppercase border border-[#111111] transition-colors cursor-pointer"
                        >
                          {copiedPhone ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'எண்ணை நகலெடு' : 'Copy Number')}
                        </button>
                      )}

                      <a
                        href={`tel:${activeDistrict.contactPhone?.split(/[,/]/)[0]?.trim() || '04424344444'}`}
                        className="min-h-[44px] h-[44px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[14px] uppercase inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        {language === 'ta' ? 'அழைக்க' : 'Call Unit'}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. EXECUTIVE SECRETARIAT LEADERSHIP                                   */}
      {/* ===================================================================== */}
      <section 
        ref={structureSection.ref}
        className={`w-full py-20 border-b border-[#111111] bg-[#FAF8F5] fade-rise ${
          structureSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#111111] pb-6 mb-12">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                {language === 'ta' ? 'அமைப்பு மற்றும் தலைமை' : 'STATE EXECUTIVE SECRETARIAT'}
              </span>
              <h2 className="font-kavivanar font-normal text-[clamp(32px,4.5vw,52px)] text-[#111111] leading-tight mt-1">
                {language === 'ta' ? 'கழக வழக்கறிஞர் அணித் தலைமைப் பொறுப்பாளர்கள்' : 'Legal Leadership and Executive Council'}
              </h2>
            </div>
            <Link
              href="/structure"
              className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-0.5 hover:border-[#C41A1F] transition-colors shrink-0"
            >
              <span>{language === 'ta' ? 'முழு கட்டமைப்பு வரைபடம் →' : 'View full organizational tree →'}</span>
            </Link>
          </div>

          {/* Secretary Dossier Highlight */}
          <div className="bg-white border-2 border-[#111111] p-8 md:p-12 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 bg-[#E31E24] text-white font-helvetica font-extrabold text-[12px] uppercase tracking-normal inline-block">
                STATE SECRETARY · தலைமைச் செயலாளர்
              </span>
              <h3 className="font-helvetica font-extrabold text-[32px] md:text-[40px] text-[#111111] leading-tight">
                {OFFICIAL_HIERARCHY_CHART.secretary.name[language]}
              </h3>
              <p className="text-[17px] font-bold text-[#C41A1F]">
                {OFFICIAL_HIERARCHY_CHART.secretary.role[language]} · {OFFICIAL_HIERARCHY_CHART.secretary.court}
              </p>
              <p className="text-[18px] text-[#3a322d] leading-relaxed">
                {OFFICIAL_HIERARCHY_CHART.secretary.bio?.[language] || ''}
              </p>
            </div>
            <div className="lg:col-span-4 p-6 bg-[#FAF8F5] border border-[#d7d0c3] space-y-3">
              <div className="text-[13px] text-[#5B5348] font-bold">
                BAR ENROLMENT: <span className="text-[#111111]">{OFFICIAL_HIERARCHY_CHART.secretary.barCouncilNo}</span>
              </div>
              <div className="text-[13px] text-[#5B5348] font-bold">
                JURISDICTION: <span className="text-[#111111]">Supreme Court & Madras High Court</span>
              </div>
              <div className="text-[13px] text-[#5B5348] font-bold">
                KEY PRECEDENTS: <span className="text-[#111111]">Governor Assent Ruling (2024), 69% Reservation Bench</span>
              </div>
            </div>
          </div>

          {/* Branch Switcher Tabs */}
          <div className="flex items-center gap-4 border-b border-[#d7d0c3] pb-2 mb-8 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedBranch('joint')}
              className={`min-h-[44px] px-2 font-helvetica font-extrabold text-[16px] cursor-pointer transition-colors ${
                selectedBranch === 'joint'
                  ? 'text-[#111111] border-b-2 border-[#E31E24]'
                  : 'text-[#5B5348] hover:text-[#111111]'
              }`}
            >
              {language === 'ta' ? 'இணைச் செயலாளர்கள் (9)' : 'Joint Secretaries (9)'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedBranch('deputy')}
              className={`min-h-[44px] px-2 font-helvetica font-extrabold text-[16px] cursor-pointer transition-colors ${
                selectedBranch === 'deputy'
                  ? 'text-[#111111] border-b-2 border-[#E31E24]'
                  : 'text-[#5B5348] hover:text-[#111111]'
              }`}
            >
              {language === 'ta' ? 'துணைச் செயலாளர்கள் (5)' : 'Deputy Secretaries (5)'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedBranch('headoffice')}
              className={`min-h-[44px] px-2 font-helvetica font-extrabold text-[16px] cursor-pointer transition-colors ${
                selectedBranch === 'headoffice'
                  ? 'text-[#111111] border-b-2 border-[#E31E24]'
                  : 'text-[#5B5348] hover:text-[#111111]'
              }`}
            >
              {language === 'ta' ? 'தலைமை நிலைய வழக்கறிஞர்கள் (9)' : 'Head Office Advocates (9)'}
            </button>
          </div>

          {/* Branch Roster Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchRoster.map((leader) => (
              <div
                key={leader.id}
                onClick={() => setSelectedLeaderModal(leader)}
                className="bg-white border border-[#111111] p-6 space-y-3 cursor-pointer hover:border-[#E31E24] hover:bg-[#FAF8F5] transition-colors group"
              >
                <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-2">
                  <span className="text-[12px] font-extrabold uppercase text-[#C41A1F]">
                    {leader.designation[language]}
                  </span>
                  <span className="text-[12px] font-bold text-[#5B5348]">
                    {leader.court || 'High Court'}
                  </span>
                </div>
                <h4 className="font-helvetica font-extrabold text-[20px] text-[#111111] group-hover:text-[#E31E24] transition-colors">
                  {leader.name[language]}
                </h4>
                <p className="text-[15px] text-[#5B5348] line-clamp-2">
                  {leader.bio?.[language] || ''}
                </p>
                <span className="text-[13px] font-bold text-[#111111] underline decoration-1 inline-block pt-1">
                  {language === 'ta' ? 'விவரங்களைப் பார்க்க →' : 'View dossier →'}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. NEWS SECTION & OFFICIAL STATEMENTS WIRE                            */}
      {/* ===================================================================== */}
      <section 
        ref={newsSection.ref}
        className={`w-full py-20 border-b border-[#111111] bg-[#FAF8F5] fade-rise ${
          newsSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#111111] pb-6 mb-8">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                {language === 'ta' ? 'அதிகாரப்பூர்வ ஊடகம்' : 'PRESS BUREAU & MEDIA WIRE'}
              </span>
              <h2 className="font-kavivanar font-normal text-[clamp(32px,4.5vw,52px)] text-[#111111] leading-tight mt-1">
                {language === 'ta' ? 'செய்திகள் மற்றும் அறிக்கைகள்' : 'Latest Legal Dispatches & Orders'}
              </h2>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-4 overflow-x-auto pb-1">
              {(['All', 'Press release', 'Statement', 'Resolution'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setNewsFilter(tab)}
                  className={`min-h-[44px] px-1 font-helvetica font-extrabold text-[15px] cursor-pointer transition-colors ${
                    newsFilter === tab
                      ? 'text-[#111111] border-b-2 border-[#E31E24]'
                      : 'text-[#5B5348] hover:text-[#111111]'
                  }`}
                >
                  {tab === 'All' && language === 'ta' ? 'அனைத்தும்' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Wire Story Rows */}
          <div className="border-t border-b border-[#111111] divide-y divide-[#111111] bg-white">
            {filteredNews.map((item) => (
              <article key={item.id} className="p-6 md:p-8 hover:bg-[#FAF8F5] transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 text-[14px]">
                      <span className="font-bold text-[#C41A1F] uppercase">
                        [{item.category}]
                      </span>
                      <span className="text-[#5B5348] font-helvetica">
                        {item.date}
                      </span>
                      <span className="text-[#d7d0c3]">·</span>
                      <span className="text-[#5B5348] text-[13px]">
                        {item.court || 'Anna Arivalayam'}
                      </span>
                    </div>

                    <h3 className="font-helvetica font-extrabold text-[22px] md:text-[26px] text-[#111111] group-hover:text-[#E31E24] transition-colors leading-snug">
                      <Link href={`/news/${item.id}`}>
                        {item.title[language]}
                      </Link>
                    </h3>

                    <p className="text-[16px] text-[#3a322d] leading-relaxed line-clamp-2 max-w-4xl">
                      {item.summary[language]}
                    </p>
                  </div>

                  <Link
                    href={`/news/${item.id}`}
                    className="min-h-[44px] px-6 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[13px] uppercase tracking-normal inline-flex items-center justify-center transition-colors shrink-0 self-start md:self-center"
                  >
                    <span>{language === 'ta' ? 'அறிக்கை →' : 'Read dispatch →'}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="pt-8 text-center">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[16px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-1 hover:border-[#E31E24] transition-colors"
            >
              <span>{language === 'ta' ? 'அனைத்து செய்திக் காப்பகத்தையும் திறக்க →' : 'Open the complete newsroom & court watch →'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. ACTION GATEWAY: ENROLMENT & CITIZEN DESK                          */}
      {/* ===================================================================== */}
      <section 
        ref={ctaSection.ref}
        className={`w-full py-20 bg-[#FAF8F5] fade-rise ${
          ctaSection.revealed ? 'revealed' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Red Block: Advocate Enrolment */}
            <div className="bg-[#E31E24] text-white p-8 md:p-12 border-2 border-[#111111] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[12px] font-extrabold uppercase text-white/90">
                  ADVOCATE CADRE REGISTRATION
                </span>
                <h3 className="font-helvetica font-extrabold text-[32px] md:text-[38px] text-white leading-tight">
                  {language === 'ta' ? 'வழக்கறிஞர் அணி உறுப்பினர் பதிவு' : 'Advocate Enrolment Drive'}
                </h3>
                <p className="text-[18px] text-white/95 leading-relaxed">
                  {language === 'ta'
                    ? 'தமிழ்நாடு மற்றும் புதுச்சேரி வழக்கறிஞர்கள் கழகக் கொள்கைப் பயணத்தில் இணைந்து மக்கள் நலப் பணிகளில் பங்கேற்க உடனே பதிவு செய்யுங்கள்.'
                    : 'Join over 3,500 active advocate members defending fundamental constitutional rights and social justice across Tamil Nadu.'}
                </p>
              </div>

              <Link
                href="/enrol"
                className="min-h-[48px] h-[48px] px-8 bg-[#111111] hover:bg-black text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal inline-flex items-center justify-center transition-colors self-start btn-lift"
              >
                {language === 'ta' ? 'உறுப்பினர் விண்ணப்பம் →' : 'Enrol as Advocate →'}
              </Link>
            </div>

            {/* Ink Block: Citizen Legal Desk */}
            <div className="bg-[#111111] text-[#FAF8F5] p-8 md:p-12 border-2 border-[#111111] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[12px] font-extrabold uppercase text-[#ff8a85]">
                  PRO-BONO LEGAL AID & DESK
                </span>
                <h3 className="font-helvetica font-extrabold text-[32px] md:text-[38px] text-white leading-tight">
                  {language === 'ta' ? 'பொதுமக்கள் இலவச சட்ட உதவி மையம்' : 'Citizen Legal Desk'}
                </h3>
                <p className="text-[18px] text-[#d8cfc2] leading-relaxed">
                  {language === 'ta'
                    ? 'அடிப்படை மனித உரிமைகள் மீறல், நில விவகாரங்கள், மற்றும் சட்ட உதவி தேவைப்படும் பொதுமக்கள் தங்களது மனுக்களைப் பதிவு செய்யலாம்.'
                    : 'File pro-bono legal grievances, seek bail protection assistance, and receive constitutional guidance from our legal aid panel.'}
                </p>

                {/* Notice Box */}
                <div className="border border-[#E31E24] bg-[#1a1817] p-3 text-[14px] text-[#ff8a85] font-bold">
                  {language === 'ta' 
                    ? 'காவல்துறை விசாரணைக் காவலில் அநீதி இழைக்கப்பட்டால் உடனே அழைக்கவும்: 044-24344444' 
                    : 'If you or someone you know is in police custody, call 044-24344444 now.'}
                </div>
              </div>

              <Link
                href="/citizen-desk"
                className="min-h-[48px] h-[48px] px-8 bg-[#FAF8F5] hover:bg-white text-[#111111] font-helvetica font-extrabold text-[15px] uppercase tracking-normal inline-flex items-center justify-center transition-colors self-start btn-lift"
              >
                {language === 'ta' ? 'மனு தாக்கல் செய்க →' : 'Submit Legal Grievance →'}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Leader Dossier Modal */}
      {selectedLeaderModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedLeaderModal(null)}
          className="fixed inset-0 z-50 bg-[#111111]/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] text-[#111111] max-w-xl w-full border-2 border-[#111111] p-8 space-y-6 shadow-2xl relative"
          >
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  [{selectedLeaderModal.designation[language]}]
                </span>
                <h3 className="font-helvetica font-extrabold text-[28px] text-[#111111] leading-tight">
                  {selectedLeaderModal.name[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeaderModal(null)}
                className="min-h-[44px] h-[44px] px-4 font-helvetica font-extrabold text-[14px] text-[#111111] hover:text-[#C41A1F] cursor-pointer"
              >
                CLOSE [✕]
              </button>
            </div>

            <p className="text-[17px] text-[#3a322d] leading-relaxed">
              {selectedLeaderModal.bio?.[language] || ''}
            </p>

            <div className="p-4 bg-white border border-[#d7d0c3] space-y-2 text-[14px]">
              <div>
                <strong className="text-[#5B5348] uppercase">Court of Practice: </strong>
                <span className="font-bold text-[#111111]">{selectedLeaderModal.court || 'Madras High Court'}</span>
              </div>
              <div>
                <strong className="text-[#5B5348] uppercase">Responsibility: </strong>
                <span className="font-bold text-[#111111]">{selectedLeaderModal.role[language]}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedLeaderModal(null)}
                className="min-h-[44px] h-[44px] px-6 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[13px] uppercase cursor-pointer transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
