'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { OFFICIAL_HIERARCHY_CHART } from '@/data/content';

export default function HomePage() {
  const { language } = useLanguage();
  const { news, districts } = useData();

  // 1. LEAD STORY FOR HERO CLIPPING (from /api/news)
  const publishedNews = useMemo(() => {
    return news.filter((n) => !n.status || n.status.toLowerCase() === 'published');
  }, [news]);

  const leadStory = useMemo(() => {
    return (
      publishedNews.find((n) => n.featured || n.isLeadStory) ||
      publishedNews[0] || {
        id: 'supreme-court-governor-ruling',
        category: 'Resolution',
        date: '2026-11-18',
        title: {
          en: 'Supreme Court upholds Tamil Nadu stand: Governors cannot delay assent to Assembly Bills indefinitely',
          ta: 'மாநில சட்டமன்ற மசோதாக்களுக்கு ஆளுநர்கள் ஒப்புதல் அளிக்காமல் காலவரையின்றி தாமதிக்க முடியாது: உச்சநீதிமன்றம் தீர்ப்பு',
        },
        summary: {
          en: 'Landmark constitutional ruling mandates that Governors must act within a reasonable time and cannot pocket-veto state legislation passed by the elected assembly.',
          ta: 'மக்களால் தேர்ந்தெடுக்கப்பட்ட சட்டமன்றம் நிறைவேற்றிய மசோதாக்களை ஆளுநர்கள் காலவரையின்றி கிடப்பில் போட முடியாது என வரலாற்றுச் சிறப்புமிக்க அரசமைப்பு அமர்வு தீர்ப்பு.',
        },
      }
    );
  }, [publishedNews]);

  // Mouse Parallax for Hero Sun-Ray Graphic (shifts up to 14 px opposite mouse)
  const heroRef = useRef<HTMLElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setParallaxOffset({
      x: Math.round(-relX * 28), // up to 14px in either direction
      y: Math.round(-relY * 28),
    });
  };

  const handleHeroMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  // 2. RED METRICS BAND COUNT UP (50 steps of 30 ms, ease-out cubic, 30% visibility)
  const metricsRef = useRef<HTMLDivElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [countsFinished, setCountsFinished] = useState(false);

  useEffect(() => {
    if (!metricsRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCounts([3500, 74, 50, 69]);
      setCountsFinished(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMetricsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(metricsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!metricsVisible) return;
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
        setCountsFinished(true);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [metricsVisible]);

  // 3. SECTIONS 4-8 INTERSECTION OBSERVER (Fade & Rise 28px over 0.8s at 12% visibility)
  const leadersRef = useRef<HTMLElement>(null);
  const newsRef = useRef<HTMLElement>(null);
  const districtsRef = useRef<HTMLElement>(null);
  const structureRef = useRef<HTMLElement>(null);
  const joinRef = useRef<HTMLElement>(null);

  const [revealed, setRevealed] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const refs = [
      { id: 'leaders', el: leadersRef.current },
      { id: 'news', el: newsRef.current },
      { id: 'districts', el: districtsRef.current },
      { id: 'structure', el: structureRef.current },
      { id: 'join', el: joinRef.current },
    ];

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed({ leaders: true, news: true, districts: true, structure: true, join: true });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id');
            if (id) {
              setRevealed((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.12 }
    );

    refs.forEach(({ el }) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 4. NEWS SECTION FILTER TABS
  const [newsFilter, setNewsFilter] = useState<'All' | 'Press release' | 'Statement' | 'Resolution'>('All');

  const filteredNews = useMemo(() => {
    if (newsFilter === 'All') return publishedNews;
    return publishedNews.filter((n) => n.category.toLowerCase().includes(newsFilter.toLowerCase()));
  }, [publishedNews, newsFilter]);

  const newsLeadStory = filteredNews[0] || leadStory;
  const wireStories = filteredNews.slice(1, 5);

  // 5. DISTRICTS SECTION SEARCH & DOCKET
  const [districtQuery, setDistrictQuery] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('chennai-north');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const filteredDistricts = useMemo(() => {
    const q = districtQuery.toLowerCase().trim();
    if (!q) return districts;
    return districts.filter(
      (d) =>
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

  const handleCopyPhone = (phone: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // 6. STRUCTURE SECTION: 3 EQUAL BLOCKS
  const [activeBranch, setActiveBranch] = useState<'joint' | 'deputy' | 'headoffice'>('joint');

  const branchRoster = useMemo(() => {
    if (activeBranch === 'joint') {
      return OFFICIAL_HIERARCHY_CHART.jointSecretaries.slice(0, 9);
    }
    if (activeBranch === 'deputy') {
      return OFFICIAL_HIERARCHY_CHART.deputySecretaries.slice(0, 5);
    }
    return OFFICIAL_HIERARCHY_CHART.headOfficeAdvocates.slice(0, 9);
  }, [activeBranch]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran antialiased overflow-x-clip selection:bg-[#E31E24] selection:text-white">
      
      {/* ===================================================================== */}
      {/* 1. HERO SECTION (Ink #111111, Parallax Sun-Rays, Tactile Lead Clipping)*/}
      {/* ===================================================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="w-full bg-[#111111] text-[#FAF8F5] overflow-hidden relative border-b border-[#111111]"
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 pb-24 sm:pt-16 sm:pb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Main Editorial Typography */}
            <div className="lg:col-span-7 max-w-[620px] space-y-6">
              
              {/* Kicker in #ff8a85 */}
              <div className="hero-stagger-1 flex items-center gap-3">
                <img
                  src="/images/dmk-official-logo.png"
                  alt="DMK Rising Sun & Flag Official Emblem"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <span className="text-[#ff8a85] font-helvetica font-extrabold text-[14px] sm:text-[15px] uppercase tracking-normal">
                  {language === 'ta'
                    ? 'மாநில தலைமைச் செயலகம் · அண்ணா அறிவாலயம், சென்னை'
                    : 'State Legal Secretariat · Anna Arivalayam, Chennai'}
                </span>
              </div>

              {/* Slogan in Kavivanar at clamp(46px, 6.6vw, 92px), line height 1.12 */}
              <h1 className="hero-stagger-2 font-kavivanar font-normal text-white text-[clamp(46px,6.6vw,92px)] leading-[1.12] tracking-normal">
                தமிழ்நாட்டைத் தலைகுனிய{' '}
                <span className="relative inline-block whitespace-nowrap">
                  விடமாட்டேன்!
                  {/* 4px red line draws across last word at 1.4s */}
                  <span
                    className="absolute bottom-1 left-0 h-[4px] bg-[#E31E24] animate-draw-underline"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              {/* 21 px Line */}
              <p className="hero-stagger-3 text-[21px] text-[#d8cfc2] leading-[1.65] font-normal">
                {language === 'ta'
                  ? 'சமூக நீதி, கூட்டாட்சி தத்துவம் மற்றும் 69% இடஒதுக்கீட்டை நீதிமன்றங்களில் சமரசமின்றி நிலைநிறுத்தும் திராவிட இயக்க வழக்கறிஞர்கள்.'
                  : 'Advocates of the Dravidian movement, defending social justice, federalism and the 69% reservation in the courts.'}
              </p>

              {/* Two Rectangular 48 px Buttons */}
              <div className="hero-stagger-4 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#districts"
                  className="min-h-[48px] h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center cursor-pointer transition-colors duration-150 btn-lift"
                >
                  {language === 'ta' ? 'மாவட்ட அணியைக் கண்டறிக' : 'Find your district unit'}
                </a>

                <a
                  href="#join"
                  className="min-h-[48px] h-[48px] px-8 bg-transparent hover:bg-[#FAF8F5] hover:text-[#111111] text-[#FAF8F5] font-helvetica font-extrabold text-[15px] uppercase tracking-normal border-2 border-[#FAF8F5] flex items-center justify-center cursor-pointer transition-colors duration-150 btn-lift"
                >
                  {language === 'ta' ? 'அணியில் இணைக' : 'Join the Legal Wing'}
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: Parchment Clipping (340 to 440 px wide, tilted -1.6 deg, shadow 10px 12px 0 #8f1118) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <article
                className="w-full max-w-[440px] sm:w-[410px] bg-[#FAF8F5] text-[#111111] p-[26px_28px] border-2 border-[#111111] shadow-[10px_12px_0_#8f1118] space-y-4 relative z-10 animate-clipping-rise"
                style={{ transform: 'rotate(-1.6deg)' }}
              >
                {/* Ink tag with type & date */}
                <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-3">
                  <span className="px-2.5 py-1 bg-[#111111] text-white text-[12px] font-extrabold uppercase tracking-normal">
                    {leadStory.category || 'Resolution'}
                  </span>
                  <span className="text-[13px] font-helvetica font-bold text-[#5B5348]">
                    {leadStory.date}
                  </span>
                </div>

                {/* Headline in Helvetica Now Display 800 at 27 px */}
                <h2 className="font-helvetica font-extrabold text-[27px] leading-[1.15] text-[#111111]">
                  <Link href={`/news/${leadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                    {leadStory.title[language]}
                  </Link>
                </h2>

                {/* Summary */}
                <p className="text-[16px] text-[#3a322d] leading-relaxed line-clamp-3">
                  {leadStory.summary[language]}
                </p>

                {/* "Read the full statement →" in #C41A1F */}
                <div className="pt-2 border-t border-[#d7d0c3] flex items-center justify-between">
                  <Link
                    href={`/news/${leadStory.id}`}
                    className="inline-flex items-center gap-1.5 text-[#C41A1F] hover:text-[#111111] font-helvetica font-extrabold text-[15px] transition-colors cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'Read the full statement'}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </article>
            </div>

          </div>
        </div>

        {/* 760 px Sun-Ray Graphic: right -140px, bottom -380px so only upper half shows */}
        {/* Turns once per 160s. Parallax mouse tracking shifts rays up to 14px opposite mouse */}
        <div
          className="absolute pointer-events-none select-none z-0 overflow-hidden"
          style={{
            right: -140,
            bottom: -380,
            width: 760,
            height: 760,
            transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
            transition: 'transform 0.15s ease-out',
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="-380 -380 760 760"
            className="w-[760px] h-[760px] animate-spin-160s origin-center"
          >
            {/* 12 polygons points="-22,-110 22,-110 64,-380 -64,-380" rotated at i * 30 deg */}
            {Array.from({ length: 12 }).map((_, i) => (
              <polygon
                key={i}
                points="-22,-110 22,-110 64,-380 -64,-380"
                transform={`rotate(${i * 30})`}
                fill={i % 2 === 0 ? '#E31E24' : '#8f1118'}
              />
            ))}
            {/* Center circle r=96 filled #111111 with stroke #E31E24 4px */}
            <circle cx="0" cy="0" r="96" fill="#111111" stroke="#E31E24" strokeWidth="4" />
          </svg>
        </div>

        {/* Signature DMK Flag Ribbon at bottom of Hero */}
        <div className="w-full h-[4px] dmk-flag-strip" aria-hidden="true" />
      </section>

      {/* ===================================================================== */}
      {/* 2. TICKER STRIP (Parchment #FAF8F5, 3 px Ink Bottom Border, 50s Loop) */}
      {/* ===================================================================== */}
      <section className="w-full bg-[#FAF8F5] border-b-[3px] border-[#111111] py-3.5 overflow-hidden select-none">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-ticker-50s inline-flex items-center">
            {/* Repeat items to create an uninterrupted 50s marquee */}
            {[...publishedNews, ...publishedNews].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center text-[16px] font-helvetica font-extrabold uppercase mr-[56px] shrink-0"
              >
                <span className="text-[#C41A1F] mr-2">[{item.category}]</span>
                <Link
                  href={`/news/${item.id}`}
                  className="text-[#111111] hover:text-[#C41A1F] transition-colors"
                >
                  {item.title.en || item.title[language]}
                </Link>
                <span className="text-[#5B5348] ml-[56px]" aria-hidden="true">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. RED METRICS BAND (#E31E24, 48 px Padding, 4 Columns, Top 4px Rule) */}
      {/* ===================================================================== */}
      <section
        ref={metricsRef}
        className="w-full bg-[#E31E24] text-white py-12 px-[clamp(20px,4vw,56px)] border-b border-[#111111]"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            
            {/* Col 1: 3,500+ Registered Advocates */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.1s' }}
              />
              <div className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[0].toLocaleString()}{countsFinished ? '+' : ''}
              </div>
              <p className="font-catamaran font-extrabold text-[18px] text-white leading-snug">
                {language === 'ta' ? 'பதிவுபெற்ற வழக்கறிஞர்கள்' : 'Registered advocates'}
              </p>
            </div>

            {/* Col 2: 74 District Units */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.2s' }}
              />
              <div className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[1]}
              </div>
              <p className="font-catamaran font-extrabold text-[18px] text-white leading-snug">
                {language === 'ta' ? 'அமைப்பு மாவட்டங்கள்' : 'District units'}
              </p>
            </div>

            {/* Col 3: 50+ Years of Jurisprudence */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.3s' }}
              />
              <div className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[2]}{countsFinished ? '+' : ''}
              </div>
              <p className="font-catamaran font-extrabold text-[18px] text-white leading-snug">
                {language === 'ta' ? 'ஆண்டுகள் மக்கள் சட்டப்பணி' : 'Years of jurisprudence'}
              </p>
            </div>

            {/* Col 4: 69% Reservation Defended */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.4s' }}
              />
              <div className="font-helvetica font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[3]}{countsFinished ? '%' : ''}
              </div>
              <p className="font-catamaran font-extrabold text-[18px] text-white leading-snug">
                {language === 'ta' ? 'சமூக நீதி இடஒதுக்கீடு அரண்' : 'Reservation defended'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. LEADERS SECTION (80 px Padding, Kavivanar #C41A1F Title, 4:5 Cards) */}
      {/* ===================================================================== */}
      <section
        ref={leadersRef}
        data-section-id="leaders"
        className={`w-full py-20 bg-[#FAF8F5] border-b border-[#111111] transition-all duration-800 ease-out ${
          revealed.leaders ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Kavivanar #C41A1F Title clamp(36px, 4.4vw, 56px) + 20 px Paragraph */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[13px] font-extrabold uppercase text-[#5B5348] tracking-normal block">
                {language === 'ta' ? 'அணித் தலைமை' : 'LEGAL WING LEADERSHIP'}
              </span>

              <h2 className="font-kavivanar font-normal text-[#C41A1F] text-[clamp(36px,4.4vw,56px)] leading-[1.2]">
                {language === 'ta'
                  ? 'அரசமைப்பு அமர்வுகளில் அறப்போர் நடத்தும் தலைமை'
                  : 'Guardians of Constitutional Law and Social Equity'}
              </h2>

              <p className="text-[20px] text-[#111111] leading-[1.7] font-normal">
                {language === 'ta'
                  ? 'பேரறிஞர் அண்ணா மற்றும் முத்தமிழறிஞர் கலைஞர் வகுத்தளித்த கொள்கைப் பாதையில், மாண்புமிகு முதலமைச்சர் மு.க. ஸ்டாலின் வழிகாட்டுதலில் உச்ச நீதிமன்றம் மற்றும் உயர் நீதிமன்றங்களில் சமூக நீதியை சமரசமின்றிப் பாதுகாக்கும் தலைமை வழக்கறிஞர் பெருமக்கள்.'
                  : 'Led by senior members of the Bar dedicated to advancing federal autonomy, linguistic equality, and affirmative action across India’s constitutional courts.'}
              </p>

              <div className="pt-2">
                <Link
                  href="/structure"
                  className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-0.5 hover:border-[#C41A1F] transition-colors"
                >
                  <span>{language === 'ta' ? 'முழு கட்டமைப்பு வரைபடம்' : 'Full structural chart'}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right: Two 4:5 Portraits with 2 px Ink Border, 6 px Top Rule expanding to 10 px */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Leader 1: R. Viduthalai (Red Top Rule) */}
              <div className="group bg-white border-2 border-[#111111] p-6 space-y-4 hover:-translate-y-1.5 transition-transform duration-200">
                {/* 6 px Red top rule expanding to 10 px */}
                <div className="w-full h-[6px] bg-[#E31E24] group-hover:h-[10px] transition-all duration-200" />

                <div className="aspect-[4/5] w-full bg-[#f1ece2] overflow-hidden border border-[#d7d0c3] relative">
                  <img
                    src="/images/r-viduthalai.jpg"
                    alt="R. Viduthalai Senior Advocate"
                    className="w-full h-full object-cover object-[center_15%] filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#111111]/90 text-white text-[12px] font-bold">
                    PRESIDENT · SENIOR ADVOCATE
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-helvetica font-extrabold text-[22px] text-[#111111] leading-tight">
                    {language === 'ta' ? 'ஆர். விடுதலை' : 'R. Viduthalai'}
                  </h3>
                  <p className="text-[14px] text-[#C41A1F] font-bold">
                    {language === 'ta'
                      ? 'தலைவர், வழக்கறிஞர் அணி · மூத்த வழக்கறிஞர்'
                      : 'President, DMK Legal Wing · Senior Advocate'}
                  </p>
                  <p className="text-[13px] text-[#5B5348] line-clamp-2">
                    {language === 'ta'
                      ? 'முன்னாள் தலைமை வழக்கறிஞர் (Advocate General of Tamil Nadu).'
                      : 'Former Advocate General of Tamil Nadu & Senior Counsel before Supreme Court.'}
                  </p>
                </div>
              </div>

              {/* Leader 2: N.R. Elango (Ink Top Rule) */}
              <div className="group bg-white border-2 border-[#111111] p-6 space-y-4 hover:-translate-y-1.5 transition-transform duration-200">
                {/* 6 px Ink top rule expanding to 10 px */}
                <div className="w-full h-[6px] bg-[#111111] group-hover:h-[10px] transition-all duration-200" />

                <div className="aspect-[4/5] w-full bg-[#f1ece2] overflow-hidden border border-[#d7d0c3] relative">
                  <img
                    src="/images/nr-elango.jpg"
                    alt="N.R. Elango Senior Advocate & MP"
                    className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#111111]/90 text-white text-[12px] font-bold">
                    SECRETARY · SENIOR ADVOCATE & MP
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-helvetica font-extrabold text-[22px] text-[#111111] leading-tight">
                    {language === 'ta' ? 'என்.ஆர். இளங்கோ' : 'N.R. Elango'}
                  </h3>
                  <p className="text-[14px] text-[#111111] font-bold">
                    {language === 'ta'
                      ? 'செயலாளர், வழக்கறிஞர் அணி · மூத்த வழக்கறிஞர் & எம்.பி.'
                      : 'Secretary, DMK Legal Wing · Senior Advocate & MP'}
                  </p>
                  <p className="text-[13px] text-[#5B5348] line-clamp-2">
                    {language === 'ta'
                      ? 'நாடாளுமன்ற மாநிலங்களவை உறுப்பினர் மற்றும் மூத்த வழக்கறிஞர்.'
                      : 'Member of Parliament (Rajya Sabha) & Senior Advocate, Madras High Court.'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. NEWS SECTION (#f1ece2, 3 px Ink Top Border, id="news")             */}
      {/* ===================================================================== */}
      <section
        id="news"
        ref={newsRef}
        data-section-id="news"
        className={`w-full py-20 bg-[#f1ece2] border-t-[3px] border-b border-[#111111] transition-all duration-800 ease-out ${
          revealed.news ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          {/* Header Row: Kavivanar Title + Sliding 3 px Underline Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#111111] pb-6 mb-12">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                {language === 'ta' ? 'செய்திப் பிரிவு' : 'PRESS BUREAU & MEDIA WIRE'}
              </span>
              <h2 className="font-kavivanar font-normal text-[#111111] text-[clamp(36px,4.5vw,56px)] leading-[1.2] mt-1">
                {language === 'ta' ? 'அறிக்கைகள் மற்றும் நீதிமன்ற உத்தரவுகள்' : 'Official Statements & Court Rulings'}
              </h2>
            </div>

            {/* Sliding 3 px Underline Filter Tabs: All / Press release / Statement / Resolution */}
            <div className="flex items-center gap-6 overflow-x-auto pb-1">
              {(['All', 'Press release', 'Statement', 'Resolution'] as const).map((tab) => {
                const isActive = newsFilter === tab;
                const tabLabelTa =
                  tab === 'All'
                    ? 'அனைத்தும்'
                    : tab === 'Press release'
                    ? 'செய்திக்குறிப்பு'
                    : tab === 'Statement'
                    ? 'அறிக்கை'
                    : 'தீர்மானம்';
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setNewsFilter(tab)}
                    className={`relative py-1 font-helvetica font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer whitespace-nowrap ${
                      isActive ? 'text-[#111111]' : 'text-[#5B5348] hover:text-[#111111]'
                    }`}
                  >
                    <span>{language === 'ta' ? tabLabelTa : tab}</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#E31E24] transition-all duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Lead Block */}
          <div className="bg-white border-2 border-[#111111] p-8 md:p-12 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 420 px Ink Panel: Sweeping Rays -14° to 0°, Dropping Date Stamp, Kavivanar Slogan */}
            <div className="lg:col-span-5 h-[340px] bg-[#111111] text-[#FAF8F5] p-6 relative overflow-hidden flex flex-col justify-between border-2 border-[#111111]">
              
              {/* Sweeping Rays Graphic behind */}
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

              {/* Dropping Date Stamp (scale 1.7 to 1, rotate -7°) */}
              <div className="relative z-10 self-start">
                <div className="animate-stamp-drop inline-block px-3 py-1 bg-[#E31E24] text-white font-helvetica font-extrabold text-[13px] uppercase border border-white">
                  {newsLeadStory.date} · {newsLeadStory.category}
                </div>
              </div>

              {/* Kavivanar Slogan */}
              <div className="relative z-10 space-y-1">
                <span className="text-[12px] font-bold text-[#ff8a85] uppercase tracking-normal">
                  SPECIAL DISPATCH
                </span>
                <p className="font-kavivanar font-normal text-[26px] leading-tight text-white">
                  {language === 'ta'
                    ? 'நீதிமன்றங்களில் சமரசமற்ற சமூக நீதி!'
                    : 'Uncompromising Social Justice in the Courts!'}
                </p>
              </div>
            </div>

            {/* Right Text + Ink Button */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F]">
                {newsLeadStory.court || 'Supreme Court of India'}
              </span>

              <h3 className="font-helvetica font-extrabold text-[clamp(26px,3.5vw,36px)] leading-[1.2] text-[#111111]">
                <Link href={`/news/${newsLeadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                  {newsLeadStory.title[language]}
                </Link>
              </h3>

              <p className="text-[18px] text-[#3a322d] leading-relaxed">
                {newsLeadStory.summary[language]}
              </p>

              <div className="pt-2">
                <Link
                  href={`/news/${newsLeadStory.id}`}
                  className="inline-flex items-center justify-center min-h-[48px] px-8 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'Read full statement →'}
                </Link>
              </div>
            </div>

          </div>

          {/* Ruled Story Rows (108 px Date Block, Red Hover Bar 0 to 6 px, 22 px Slide Right) */}
          <div className="space-y-0 divide-y divide-[#111111] border-t border-b border-[#111111] bg-white">
            {wireStories.map((story) => (
              <article
                key={story.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 transition-all duration-200 hover:bg-[#FAF8F5] hover:pl-10 cursor-pointer"
              >
                {/* Red hover bar 0 to 6 px */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[6px] bg-[#E31E24] transition-all duration-200"
                  aria-hidden="true"
                />

                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1">
                  {/* 108 px Date Block */}
                  <div className="w-[108px] shrink-0 font-helvetica font-bold text-[14px] text-[#5B5348]">
                    <div>{story.date}</div>
                    <span className="text-[12px] text-[#C41A1F] font-extrabold uppercase">
                      {story.category}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-1 flex-1">
                    <h4 className="font-helvetica font-extrabold text-[20px] text-[#111111] group-hover:text-[#C41A1F] transition-colors leading-snug">
                      <Link href={`/news/${story.id}`}>
                        {story.title[language]}
                      </Link>
                    </h4>
                    <p className="text-[15px] text-[#5B5348] line-clamp-1">
                      {story.summary[language]}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 shrink-0 font-helvetica font-bold text-[14px] text-[#C41A1F] uppercase md:pl-4">
                  <span>{language === 'ta' ? 'விவரம் →' : 'Read →'}</span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. DISTRICTS SECTION (Ink #111111, 80 px Padding, Search & Docket)    */}
      {/* ===================================================================== */}
      <section
        id="districts"
        ref={districtsRef}
        data-section-id="districts"
        className={`w-full py-20 bg-[#111111] text-[#FAF8F5] border-b border-[#3d3633] transition-all duration-800 ease-out ${
          revealed.districts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#3d3633] pb-6 mb-12">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#ff8a85] tracking-normal block">
                {language === 'ta' ? '74 கழக மாவட்டங்கள்' : '74 DISTRICT ADMINISTRATIVE UNITS'}
              </span>
              <h2 className="font-kavivanar font-normal text-white text-[clamp(36px,4.5vw,56px)] leading-[1.2] mt-1">
                {language === 'ta' ? 'மாவட்ட வழக்கறிஞர் அணிகள்' : 'Find Your District Legal Secretariat'}
              </h2>
            </div>
            <Link
              href="/districts"
              className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[15px] text-[#FAF8F5] hover:text-[#ff8a85] uppercase tracking-normal border-b-2 border-[#FAF8F5] pb-0.5 hover:border-[#ff8a85] transition-colors shrink-0"
            >
              <span>{language === 'ta' ? 'முழு மாவட்டக் கோப்பகம் →' : 'View full 74 directory →'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Search Box with SVG Magnifier + 380 px Scroll List with 1 px #3d3633 Rules */}
            <div className="lg:col-span-5 bg-[#1a1715] border border-[#3d3633] p-6 space-y-4">
              
              {/* Search box with SVG magnifier */}
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#d8cfc2]" aria-hidden="true">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={districtQuery}
                  onChange={(e) => setDistrictQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்டப் பெயர் அல்லது அமைப்பாளர்...' : 'Search by district or organizer...'}
                  className="w-full bg-[#111111] border border-[#3d3633] pl-11 pr-4 py-3 text-[15px] text-white placeholder-[#8a7f78] focus:outline-none focus:border-[#E31E24]"
                />
              </div>

              {/* 380 px Scroll List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-[#3d3633] border-t border-b border-[#3d3633]">
                {filteredDistricts.length === 0 ? (
                  <p className="py-8 text-center text-[#d8cfc2] text-[15px]">
                    {language === 'ta' ? 'மாவட்டங்கள் கிடைக்கவில்லை.' : 'No matching units found.'}
                  </p>
                ) : (
                  filteredDistricts.map((d) => {
                    const isSelected = activeDistrict?.id === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDistrictId(d.id)}
                        className={`w-full text-left p-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E31E24] text-white font-bold'
                            : 'hover:bg-[#25201d] text-[#FAF8F5]'
                        }`}
                      >
                        <div>
                          <div className="font-helvetica font-extrabold text-[16px]">
                            {d.name[language]}
                          </div>
                          <div className={`text-[13px] line-clamp-1 ${isSelected ? 'text-white/90' : 'text-[#d8cfc2]'}`}>
                            {d.organizer[language]} · {d.headquarters[language]}
                          </div>
                        </div>
                        <span className="text-[12px] uppercase tracking-normal px-2 py-0.5 bg-black/40 border border-white/20">
                          {d.zone}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Parchment Panel (#FAF8F5) with 8 px Red Top Border and Full-width Red Tel: Button */}
            <div className="lg:col-span-7 bg-[#FAF8F5] text-[#111111] border-2 border-[#111111] p-8 md:p-10 space-y-6">
              {/* 8 px Red top border */}
              <div className="w-full h-[8px] bg-[#E31E24]" />

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d7d0c3] pb-4">
                  <div>
                    <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
                      [{activeDistrict.zone} ZONE · DISTRICT REGISTRY]
                    </span>
                    <h3 className="font-helvetica font-extrabold text-[32px] leading-tight text-[#111111] mt-0.5">
                      {activeDistrict.name[language]}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-[#111111] text-white font-helvetica font-extrabold text-[13px] uppercase">
                    HQ: {activeDistrict.headquarters[language]}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-[#d7d0c3] space-y-1">
                    <span className="text-[12px] font-bold text-[#5B5348] uppercase">
                      {language === 'ta' ? 'மாவட்ட அமைப்பாளர்' : 'District Organizer'}
                    </span>
                    <p className="font-helvetica font-extrabold text-[18px] text-[#111111]">
                      {activeDistrict.organizer[language]}
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-[#d7d0c3] space-y-1">
                    <span className="text-[12px] font-bold text-[#5B5348] uppercase">
                      {language === 'ta' ? 'நீதிமன்ற வளாகம்' : 'Court Complex'}
                    </span>
                    <p className="font-helvetica font-extrabold text-[18px] text-[#111111]">
                      {activeDistrict.courtComplex[language]}
                    </p>
                  </div>
                </div>

                {/* Full-width Red tel: button */}
                <div className="pt-2">
                  <a
                    href={`tel:${activeDistrict.contactPhone}`}
                    className="w-full min-h-[48px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[16px] uppercase tracking-normal flex items-center justify-center gap-3 transition-colors cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'நேரடித் தொலைபேசி அழைப்பு:' : 'Call District Secretariat:'}</span>
                    <span>{activeDistrict.contactPhone}</span>
                  </a>
                </div>

                {/* Copy phone link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(activeDistrict.contactPhone)}
                    className="text-[13px] font-bold text-[#5B5348] hover:text-[#111111] underline cursor-pointer"
                  >
                    {copiedPhone
                      ? (language === 'ta' ? 'எண் நகலெடுக்கப்பட்டது!' : 'Phone copied!')
                      : (language === 'ta' ? 'தொலைபேசி எண்ணை நகலெடு' : 'Copy phone number')}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. STRUCTURE SECTION (80 px Padding, 3 Equal Blocks, 64 px Count)     */}
      {/* ===================================================================== */}
      <section
        ref={structureRef}
        data-section-id="structure"
        className={`w-full py-20 bg-[#FAF8F5] border-b border-[#111111] transition-all duration-800 ease-out ${
          revealed.structure ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#111111] pb-6 mb-12">
            <div>
              <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                {language === 'ta' ? 'அமைப்புச் சட்டம்' : 'ORGANIZATIONAL APPARATUS'}
              </span>
              <h2 className="font-kavivanar font-normal text-[#111111] text-[clamp(36px,4.5vw,56px)] leading-[1.2] mt-1">
                {language === 'ta' ? 'செயலாளரின் கீழ் மூன்று நிர்வாகப் பிரிவுகள்' : 'Three Wings Under the Secretary'}
              </h2>
            </div>
            <Link
              href="/structure"
              className="inline-flex items-center gap-2 font-helvetica font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-0.5 hover:border-[#C41A1F] transition-colors shrink-0"
            >
              <span>{language === 'ta' ? 'முழு நிர்வாகிகள் பட்டியல் →' : 'View full roster →'}</span>
            </Link>
          </div>

          {/* 3 Equal Blocks: Joint Secretaries (9), Deputy Secretaries (5), Head Office Advocates (9) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Block 1: Joint Secretaries 9 */}
            <button
              type="button"
              onClick={() => setActiveBranch('joint')}
              className={`p-8 border-2 border-[#111111] text-left transition-colors cursor-pointer ${
                activeBranch === 'joint'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#f1ece2]'
              }`}
            >
              <div className="font-helvetica font-extrabold text-[64px] leading-none mb-4">
                09
              </div>
              <h3 className="font-helvetica font-extrabold text-[22px] leading-tight mb-2">
                {language === 'ta' ? 'இணைச் செயலாளர்கள்' : 'Joint Secretaries'}
              </h3>
              <p className={`text-[14px] leading-normal ${activeBranch === 'joint' ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                {language === 'ta'
                  ? 'மண்டல ஒருங்கிணைப்பு மற்றும் அரசமைப்பு வழக்குகளுக்கான தலைமைக் குழு.'
                  : 'Zone-level administrative coordinators and constitutional bench counsels.'}
              </p>
            </button>

            {/* Block 2: Deputy Secretaries 5 */}
            <button
              type="button"
              onClick={() => setActiveBranch('deputy')}
              className={`p-8 border-2 border-[#111111] text-left transition-colors cursor-pointer ${
                activeBranch === 'deputy'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#f1ece2]'
              }`}
            >
              <div className="font-helvetica font-extrabold text-[64px] leading-none mb-4">
                05
              </div>
              <h3 className="font-helvetica font-extrabold text-[22px] leading-tight mb-2">
                {language === 'ta' ? 'துணைச் செயலாளர்கள்' : 'Deputy Secretaries'}
              </h3>
              <p className={`text-[14px] leading-normal ${activeBranch === 'deputy' ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                {language === 'ta'
                  ? 'களப்பணி, பயிற்சி முகாம்கள் மற்றும் ஆவணக் காப்பகப் பொறுப்பாளர்கள்.'
                  : 'Field operations, training academies, and legal documentation registry.'}
              </p>
            </button>

            {/* Block 3: Head Office Advocates 9 */}
            <button
              type="button"
              onClick={() => setActiveBranch('headoffice')}
              className={`p-8 border-2 border-[#111111] text-left transition-colors cursor-pointer ${
                activeBranch === 'headoffice'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#f1ece2]'
              }`}
            >
              <div className="font-helvetica font-extrabold text-[64px] leading-none mb-4">
                09
              </div>
              <h3 className="font-helvetica font-extrabold text-[22px] leading-tight mb-2">
                {language === 'ta' ? 'தலைமை நிலைய வழக்கறிஞர்கள்' : 'Head Office Advocates'}
              </h3>
              <p className={`text-[14px] leading-normal ${activeBranch === 'headoffice' ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                {language === 'ta'
                  ? 'அண்ணா அறிவாலயத்தில் நேரடி சட்ட ஆலோசனை மற்றும் வழக்காடல் குழு.'
                  : 'Permanent advisory counsel and urgent litigation desk at Anna Arivalayam.'}
              </p>
            </button>

          </div>

          {/* Roster below fades in staggered 40 ms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchRoster.map((officer, idx) => (
              <div
                key={officer.id || idx}
                className="p-5 bg-white border border-[#d7d0c3] space-y-1 transition-all duration-300 hover:border-[#111111]"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <span className="text-[12px] font-extrabold text-[#C41A1F] uppercase">
                  {officer.district[language]}
                </span>
                <h4 className="font-helvetica font-extrabold text-[18px] text-[#111111]">
                  {officer.name[language]}
                </h4>
                <p className="text-[13px] text-[#5B5348]">
                  {officer.role[language]}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. JOIN SECTION (Two Equal Blocks: Red Advocate Enrolment + Ink Citizen) */}
      {/* ===================================================================== */}
      <section
        id="join"
        ref={joinRef}
        data-section-id="join"
        className={`w-full py-20 bg-[#FAF8F5] border-b border-[#111111] transition-all duration-800 ease-out ${
          revealed.join ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Block 1: Red Advocate Enrolment with Ink Button */}
            <div className="bg-[#E31E24] text-white p-8 md:p-12 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-white text-[#E31E24] font-helvetica font-extrabold text-[12px] uppercase">
                  {language === 'ta' ? 'வழக்கறிஞர்களுக்கான தளம்' : 'FOR LICENSED ADVOCATES'}
                </span>
                <h3 className="font-helvetica font-extrabold text-[32px] sm:text-[38px] leading-tight text-white">
                  {language === 'ta'
                    ? 'திமுக வழக்கறிஞர் அணியில் உறுப்பினராகப் பதிவு செய்க'
                    : 'Enrol in the DMK Legal Wing Registry'}
                </h3>
                <p className="text-[17px] text-white/90 leading-relaxed font-normal">
                  {language === 'ta'
                    ? 'பார் கவுன்சில் பதிவுபெற்ற அனைத்து வழக்கறிஞர்களும் கழகத்தின் சட்டப் பிரிவில் இணைந்து சமூக நீதி மற்றும் அரசமைப்பு மாண்புகளைக் காக்க முன்வாருங்கள்.'
                    : 'Join thousands of bar practitioners defending constitutional democracy, federalism, and the reservation architecture across all 74 districts.'}
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/enrol"
                  className="w-full min-h-[48px] px-8 bg-[#111111] hover:bg-[#333333] text-white font-helvetica font-extrabold text-[16px] uppercase tracking-normal flex items-center justify-center transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'வழக்கறிஞர் சேர்க்கைப் படிவம்' : 'Enrol as Advocate →'}
                </Link>
              </div>
            </div>

            {/* Block 2: Ink Citizen Legal Desk with 2 px Red Border Custody Notice & Parchment Button */}
            <div className="bg-[#111111] text-[#FAF8F5] p-8 md:p-12 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-[#25201d] text-[#ff8a85] border border-[#3d3633] font-helvetica font-extrabold text-[12px] uppercase">
                  {language === 'ta' ? 'பொதுமக்கள் சட்ட உதவி' : 'CITIZEN LEGAL ASSISTANCE'}
                </span>
                <h3 className="font-helvetica font-extrabold text-[32px] sm:text-[38px] leading-tight text-white">
                  {language === 'ta'
                    ? 'கழகத் தோழர்கள் & பொதுமக்கள் சட்ட உதவி மையம்'
                    : 'Cadre & Citizen Legal Aid Desk'}
                </h3>
                <p className="text-[17px] text-[#d8cfc2] leading-relaxed font-normal">
                  {language === 'ta'
                    ? 'அரசியல் உள்நோக்கக் கைதுகள், அவசர வழக்காடல் மற்றும் அடிப்படை உரிமை மீறல்களுக்கு மாநிலம் முழுவதும் உடனடி இலவச சட்ட உதவி.'
                    : 'Urgent legal representation against unlawful detentions, political harassment, and civil rights violations through verified district panels.'}
                </p>

                {/* 2 px Red border custody notice */}
                <div className="p-4 bg-[#1a1715] border-2 border-[#E31E24] text-[15px] font-bold text-white leading-relaxed">
                  If you or someone you know is in police custody, call [HELPLINE NUMBER] now.
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/citizen-desk"
                  className="w-full min-h-[48px] px-8 bg-[#FAF8F5] hover:bg-white text-[#111111] font-helvetica font-extrabold text-[16px] uppercase tracking-normal flex items-center justify-center transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'சட்ட உதவி கோரிக்கை வைக்க' : 'Submit Assistance Request →'}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
