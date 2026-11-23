'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { OFFICIAL_HIERARCHY_CHART } from '@/data/content';
import { SITE_STATS } from '@/data/siteStats';

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
        court: 'Supreme Court of India',
        source: 'Press Bureau, Anna Arivalayam',
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
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setParallaxOffset({
      x: Math.round(-relX * 28),
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

  // 3. SECTIONS d TO h INTERSECTION OBSERVER (Fade & Rise 28px over 0.8s at 12% visibility)
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

  // 4. NEWS SECTION FILTER TABS & TRANSITION
  const [newsFilter, setNewsFilter] = useState<'All' | 'Press release' | 'Statement' | 'Resolution'>('All');
  const [newsFading, setNewsFading] = useState(false);

  const handleNewsFilterChange = (tab: 'All' | 'Press release' | 'Statement' | 'Resolution') => {
    if (tab === newsFilter) return;
    setNewsFading(true);
    setTimeout(() => {
      setNewsFilter(tab);
      setNewsFading(false);
    }, 150);
  };

  const filteredNews = useMemo(() => {
    if (newsFilter === 'All') return publishedNews;
    return publishedNews.filter((n) => n.category.toLowerCase().includes(newsFilter.toLowerCase()));
  }, [publishedNews, newsFilter]);

  const newsLeadStory = filteredNews[0] || leadStory;
  const wireStories = filteredNews.slice(1, 6);

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

  // 5. DISTRICTS SECTION SEARCH & DOCKET
  const [districtQuery, setDistrictQuery] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('chennai-north');
  const [districtPanelSlide, setDistrictPanelSlide] = useState(false);

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

  const activeDistrictIndex = useMemo(() => {
    const idx = districts.findIndex((d) => d.id === selectedDistrictId);
    return idx >= 0 ? idx + 1 : 1;
  }, [districts, selectedDistrictId]);

  const activeDistrict = useMemo(() => {
    return districts.find((d) => d.id === selectedDistrictId) || filteredDistricts[0] || districts[0];
  }, [districts, selectedDistrictId, filteredDistricts]);

  const handleSelectDistrict = (id: string) => {
    if (id === selectedDistrictId) return;
    setDistrictPanelSlide(true);
    setSelectedDistrictId(id);
    setTimeout(() => {
      setDistrictPanelSlide(false);
    }, 50);
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
            
            {/* LEFT COLUMN: Main Editorial Typography (Asymmetric ~60% width) */}
            <div className="lg:col-span-7 max-w-[640px] space-y-6">
              
              {/* Kicker in #ff8a85 (15 px) */}
              <div className="hero-stagger-1 flex items-center gap-3">
                <img
                  src="/images/dmk-official-logo.png"
                  alt="DMK Official Emblem"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <span className="text-[#ff8a85] font-manrope font-extrabold text-[15px] uppercase tracking-normal">
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

              {/* 21 px Line, line height 1.65 */}
              <p className="hero-stagger-3 text-[20px] sm:text-[21px] text-[#d8cfc2] leading-[1.65] font-normal">
                {language === 'ta'
                  ? 'சமூக நீதி, கூட்டாட்சி தத்துவம் மற்றும் 69% இடஒதுக்கீட்டை நீதிமன்றங்களில் சமரசமின்றி நிலைநிறுத்தும் திராவிட இயக்க வழக்கறிஞர்கள்.'
                  : 'Advocates of the Dravidian movement, defending social justice, federalism and the 69% reservation in the courts.'}
              </p>

              {/* Two Rectangular 48 px Buttons (15 px 800) */}
              <div className="hero-stagger-4 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#districts"
                  className="min-h-[48px] h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-manrope font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center cursor-pointer transition-colors duration-150 btn-lift"
                >
                  {language === 'ta' ? 'மாவட்ட அணியைக் கண்டறிக' : 'Find your district unit'}
                </a>

                <a
                  href="#join"
                  className="min-h-[48px] h-[48px] px-8 bg-transparent hover:bg-[#FAF8F5] hover:text-[#111111] text-[#FAF8F5] font-manrope font-extrabold text-[15px] uppercase tracking-normal border-2 border-[#FAF8F5] flex items-center justify-center cursor-pointer transition-colors duration-150 btn-lift"
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
                {/* Ink tag with type & date (15 px) */}
                <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-3">
                  <span className="px-3 py-1 bg-[#111111] text-white text-[15px] font-extrabold uppercase tracking-normal">
                    {leadStory.category || 'Resolution'}
                  </span>
                  <span className="text-[15px] font-manrope font-bold text-[#5B5348]">
                    {leadStory.date}
                  </span>
                </div>

                {/* Headline in Helvetica Now Display 800 at 27 px (line height 1.12) */}
                <h2 className="font-manrope font-extrabold text-[27px] leading-[1.12] text-[#111111]">
                  <Link href={`/news/${leadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                    {leadStory.title[language]}
                  </Link>
                </h2>

                {/* Summary (17 px relaxed) */}
                <p className="text-[17px] text-[#3a322d] leading-[1.65] line-clamp-3">
                  {leadStory.summary[language]}
                </p>

                {/* "Read the full statement →" in #C41A1F (15 px) */}
                <div className="pt-2 border-t border-[#d7d0c3] flex items-center justify-between">
                  <Link
                    href={`/news/${leadStory.id}`}
                    className="inline-flex items-center gap-1.5 text-[#C41A1F] hover:text-[#111111] font-manrope font-extrabold text-[15px] transition-colors cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'முழு அறிக்கையைப் படிக்க →' : 'Read the full statement →'}</span>
                  </Link>
                </div>
              </article>
            </div>

          </div>
        </div>

        {/* 760 px Sun-ray Graphic at bottom right: right -140 px, bottom -380 px */}
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
            className="w-[760px] h-[760px] relative overflow-visible animate-spin-slow origin-center"
          >
            {/* 12 polygons rotated every 30 degrees, alternating #E31E24 and #8f1118 */}
            {Array.from({ length: 12 }).map((_, i) => (
              <polygon
                key={i}
                points="-22,-110 22,-110 64,-380 -64,-380"
                transform={`rotate(${i * 30})`}
                fill={i % 2 === 0 ? '#E31E24' : '#8f1118'}
              />
            ))}
            {/* Central circle r=96 filled #111 with 4px #E31E24 stroke */}
            <circle cx="0" cy="0" r="96" fill="#111111" stroke="#E31E24" strokeWidth="4" />
            <image
              href="/images/dmk-official-logo.png"
              x="-80"
              y="-80"
              width="160"
              height="160"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>

        {/* Bottom edge rule */}
        <div className="w-full h-[3px] bg-[#E31E24]" aria-hidden="true" />
      </section>

      {/* ===================================================================== */}
      {/* 2. TICKER STRIP (Parchment #FAF8F5, 3 px Ink Bottom Border, 50s Loop) */}
      {/* ===================================================================== */}
      <section className="w-full bg-[#FAF8F5] border-b-[3px] border-[#111111] py-3.5 overflow-hidden select-none">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-ticker-50s inline-flex items-center">
            {[...publishedNews, ...publishedNews].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center text-[16px] font-manrope font-extrabold uppercase mr-[56px] shrink-0"
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
      {/* 3. RED METRICS BAND (#E31E24, 48 px Padding, 4 Counters, Top 4px Rule)*/}
      {/* ===================================================================== */}
      <section
        ref={metricsRef}
        className="w-full bg-[#E31E24] text-white py-12 px-[clamp(20px,4vw,56px)] border-b border-[#111111]"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            
            {/* Col 1: 3,500+ Registered advocates */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.1s' }}
              />
              <div className="font-manrope font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[0].toLocaleString()}{countsFinished ? '+' : ''}
              </div>
              <p className="font-catamaran font-extrabold text-[17px] sm:text-[18px] text-white leading-snug">
                {SITE_STATS.metrics[0]?.label[language] || (language === 'ta' ? 'பதிவுபெற்ற வழக்கறிஞர்கள்' : 'Registered advocates')}
              </p>
            </div>

            {/* Col 2: 74 District units */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.2s' }}
              />
              <div className="font-manrope font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[1]}
              </div>
              <p className="font-catamaran font-extrabold text-[17px] sm:text-[18px] text-white leading-snug">
                {SITE_STATS.metrics[1]?.label[language] || (language === 'ta' ? 'அமைப்பு மாவட்டங்கள்' : 'District units')}
              </p>
            </div>

            {/* Col 3: 50+ Years of jurisprudence */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.3s' }}
              />
              <div className="font-manrope font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[2]}{countsFinished ? '+' : ''}
              </div>
              <p className="font-catamaran font-extrabold text-[17px] sm:text-[18px] text-white leading-snug">
                {SITE_STATS.metrics[2]?.label[language] || (language === 'ta' ? 'ஆண்டுகள் மக்கள் சட்டப்பணி' : 'Years of jurisprudence')}
              </p>
            </div>

            {/* Col 4: 69% Reservation defended */}
            <div className="space-y-3">
              <div
                className="w-full h-[4px] bg-white transition-all duration-600 ease-out"
                style={{ width: metricsVisible ? '100%' : '0%', transitionDelay: '0.4s' }}
              />
              <div className="font-manrope font-extrabold text-[clamp(48px,6vw,76px)] leading-none">
                {counts[3]}{countsFinished ? '%' : ''}
              </div>
              <p className="font-catamaran font-extrabold text-[17px] sm:text-[18px] text-white leading-snug">
                {SITE_STATS.metrics[3]?.label[language] || (language === 'ta' ? 'சமூக நீதி இடஒதுக்கீடு அரண்' : 'Reservation defended')}
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
            
            {/* Left: Kavivanar Title in #C41A1F and grey paragraph */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-kavivanar font-normal text-[#C41A1F] text-[clamp(34px,4.5vw,48px)] leading-[1.12]">
                {language === 'ta' ? 'அணியை வழிநடத்துவோர்' : 'Those who lead the wing'}
              </h2>

              <p className="text-[17px] text-[#5B5348] leading-[1.65] font-normal">
                {language === 'ta'
                  ? 'பேரறிஞர் அண்ணா மற்றும் முத்தமிழறிஞர் கலைஞர் வகுத்தளித்த கொள்கைப் பாதையில், மாண்புமிகு முதலமைச்சர் மு.க. ஸ்டாலின் வழிகாட்டுதலில் உச்ச நீதிமன்றம் மற்றும் உயர் நீதிமன்றங்களில் சமூக நீதியை சமரசமின்றிப் பாதுகாக்கும் தலைமை வழக்கறிஞர் பெருமக்கள்.'
                  : 'Advocating before the highest constitutional courts of the Republic, upholding state autonomy, linguistic rights, and the historic 69% reservation architecture for Tamil Nadu.'}
              </p>

              <div className="pt-2">
                <Link
                  href="/structure"
                  className="inline-flex items-center gap-2 font-manrope font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-0.5 hover:border-[#C41A1F] transition-colors"
                >
                  <span>{language === 'ta' ? 'முழு கட்டமைப்பு வரைபடம் →' : 'Full structural chart →'}</span>
                </Link>
              </div>
            </div>

            {/* Right: Two 4:5 Portraits with 2 px Ink Borders, 6 px Top Rule growing to 10 px */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Leader 1: R. Viduthalai (Red Top Rule) */}
              <div className="group bg-white border-2 border-[#111111] p-6 space-y-4 hover:-translate-y-[6px] transition-transform duration-200">
                {/* 6 px Red top rule growing to 10 px on hover */}
                <div className="w-full h-[6px] bg-[#E31E24] group-hover:h-[10px] transition-all duration-200" />

                <div className="aspect-[4/5] w-full bg-[#f1ece2] overflow-hidden border border-[#111111] relative">
                  <img
                    src="/images/r-viduthalai.jpg"
                    alt="R. Viduthalai, President"
                    className="w-full h-full object-cover object-[center_15%]"
                  />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-manrope font-extrabold text-[26px] text-[#111111] leading-[1.1]">
                    {language === 'ta' ? 'ஆர். விடுதலை' : 'R. Viduthalai'}
                  </h3>
                  <p className="text-[15px] text-[#C41A1F] font-bold">
                    {language === 'ta' ? 'தலைவர்' : 'President'}
                  </p>
                  <p className="text-[15px] text-[#5B5348] leading-[1.6]">
                    {language === 'ta'
                      ? 'மூத்த வழக்கறிஞர் · தமிழ்நாட்டின் முன்னாள் தலைமை வழக்கறிஞர்'
                      : 'Senior Advocate · Former Advocate General of Tamil Nadu'}
                  </p>
                </div>
              </div>

              {/* Leader 2: N.R. Elango (Ink Top Rule) */}
              <div className="group bg-white border-2 border-[#111111] p-6 space-y-4 hover:-translate-y-[6px] transition-transform duration-200">
                {/* 6 px Ink top rule growing to 10 px on hover */}
                <div className="w-full h-[6px] bg-[#111111] group-hover:h-[10px] transition-all duration-200" />

                <div className="aspect-[4/5] w-full bg-[#f1ece2] overflow-hidden border border-[#111111] relative">
                  <img
                    src="/images/nr-elango.jpg"
                    alt="N.R. Elango, Secretary"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-manrope font-extrabold text-[26px] text-[#111111] leading-[1.1]">
                    {language === 'ta' ? 'என்.ஆர். இளங்கோ' : 'N.R. Elango'}
                  </h3>
                  <p className="text-[15px] text-[#C41A1F] font-bold">
                    {language === 'ta' ? 'செயலாளர்' : 'Secretary'}
                  </p>
                  <p className="text-[15px] text-[#5B5348] leading-[1.6]">
                    {language === 'ta'
                      ? 'மூத்த வழக்கறிஞர் · நாடாளுமன்ற மாநிலங்களவை உறுப்பினர்'
                      : 'Senior Advocate · Member of Parliament, Rajya Sabha'}
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
          
          {/* Header Row: Kavivanar Title "From the press bureau" + Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#111111] pb-6 mb-12">
            <div>
              <h2 className="font-kavivanar font-normal text-[#111111] text-[clamp(34px,5vw,48px)] leading-[1.12]">
                {language === 'ta' ? 'செய்திப் பணியகத்திலிருந்து' : 'From the press bureau'}
              </h2>
            </div>

            {/* Sliding Red Underline Filter Tabs: All / Press release / Statement / Resolution */}
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
                    onClick={() => handleNewsFilterChange(tab)}
                    className={`relative py-1 font-manrope font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer whitespace-nowrap ${
                      isActive ? 'text-[#111111]' : 'text-[#5B5348] hover:text-[#111111]'
                    }`}
                  >
                    <span>{language === 'ta' ? tabLabelTa : tab}</span>
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
          </div>

          {/* First Story: Two-column block with 2 px ink border */}
          <div className={`transition-opacity duration-300 ${newsFading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="bg-white border-2 border-[#111111] p-8 md:p-12 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
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
                  <div className="animate-stamp-drop inline-block px-3.5 py-1.5 bg-[#FAF8F5] text-[#111111] font-manrope font-extrabold text-[15px] uppercase border-2 border-[#111111] shadow-[2px_2px_0_#8f1118]">
                    {newsLeadStory.date} · {newsLeadStory.category}
                  </div>
                </div>

                {/* Kavivanar Line "தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!" */}
                <div className="relative z-10 space-y-2">
                  <span className="text-[15px] font-bold text-[#ff8a85] uppercase tracking-normal block">
                    {language === 'ta' ? 'அண்ணா அறிவாலயம் சிறப்புச் செய்தி' : 'SPECIAL DISPATCH'}
                  </span>
                  <p className="font-kavivanar font-normal text-[26px] leading-[1.12] text-white">
                    தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!
                  </p>
                </div>
              </div>

              {/* Right Column: Type Tag, Headline, Summary 20px, Source, Ink Button */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-[15px] font-extrabold uppercase text-[#C41A1F] tracking-normal block">
                  [{newsLeadStory.category}] · {newsLeadStory.court || 'Constitutional Bench'}
                </span>

                <h3 className="font-manrope font-extrabold text-[clamp(30px,3.6vw,48px)] leading-[1.12] text-[#111111]">
                  <Link href={`/news/${newsLeadStory.id}`} className="hover:text-[#C41A1F] transition-colors">
                    {newsLeadStory.title[language]}
                  </Link>
                </h3>

                <p className="text-[20px] text-[#3a322d] leading-[1.65]">
                  {newsLeadStory.summary[language]}
                </p>

                {/* Source line (never cut off) */}
                <div className="text-[15px] font-bold text-[#5B5348] border-t border-[#d7d0c3] pt-3">
                  {language === 'ta' ? 'ஆதாரம்:' : 'Source:'}{' '}
                  {newsLeadStory.source || newsLeadStory.issuingAuthority?.[language] || 'State Legal Secretariat, Anna Arivalayam, Chennai'}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/news/${newsLeadStory.id}`}
                    className="inline-flex items-center justify-center min-h-[48px] px-8 bg-[#111111] hover:bg-[#E31E24] text-white font-manrope font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? 'முழு அறிக்கையைப் படிக்க →' : 'Read the full statement →'}
                  </Link>
                </div>
              </div>

            </div>

            {/* Other stories as Ruled Rows with NO cards */}
            {/* 108 px Date Block (Day 56 px 800, Month grey), Type in #C41A1F, Headline clamp(24px, 2.6vw, 34px) 800, Summary 18 px, Source 15 px, Arrow */}
            {/* Hover: red bar grows 0 to 6 px, moves 22 px right, turns #e9e3d7, arrow moves 8 px (all 0.25 s) */}
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
                        <div className="font-manrope font-extrabold text-[56px] leading-none text-[#111111]">
                          {dateParts.day}
                        </div>
                        <div className="font-manrope font-bold text-[15px] text-[#5B5348] mt-1 tracking-normal uppercase">
                          {dateParts.month} {dateParts.year}
                        </div>
                        <div className="mt-2 text-[15px] text-[#C41A1F] font-extrabold uppercase">
                          {story.category}
                        </div>
                      </div>

                      {/* Content: Type in #C41A1F, Headline clamp(24px, 2.6vw, 34px) 800, Summary 18 px, Source 15 px */}
                      <div className="space-y-2 flex-1">
                        <h4 className="font-manrope font-extrabold text-[clamp(24px,2.6vw,34px)] text-[#111111] group-hover:text-[#C41A1F] transition-colors leading-[1.14]">
                          <Link href={`/news/${story.id}`}>
                            {story.title[language]}
                          </Link>
                        </h4>
                        <p className="text-[17px] text-[#3a322d] leading-[1.65]">
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
                    <div className="mt-4 md:mt-0 shrink-0 md:pl-6 text-[#111111] group-hover:text-[#E31E24] text-[26px] font-bold transition-transform duration-250 group-hover:translate-x-2">
                      &rarr;
                    </div>
                  </article>
                );
              })}
            </div>
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
              <h2 className="font-kavivanar font-normal text-white text-[clamp(34px,4.5vw,48px)] leading-[1.12]">
                {language === 'ta' ? '74 கழக மாவட்டங்கள், ஒரு தொலைபேசி அழைப்பில்' : '74 district units, one phone call away'}
              </h2>
            </div>
            <Link
              href="/districts"
              className="inline-flex items-center gap-2 font-manrope font-extrabold text-[15px] text-[#FAF8F5] hover:text-[#ff8a85] uppercase tracking-normal border-b-2 border-[#FAF8F5] pb-0.5 hover:border-[#ff8a85] transition-colors shrink-0"
            >
              <span>{language === 'ta' ? 'முழு மாவட்டக் கோப்பகம் →' : 'View full 74 directory →'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 2 px Parchment Bordered Search Box + 380 px Scroll List */}
            <div className="lg:col-span-5 bg-[#1a1715] border-2 border-[#FAF8F5] p-6 space-y-4">
              
              {/* Search box with inline-SVG magnifier */}
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#111111]" aria-hidden="true">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={districtQuery}
                  onChange={(e) => setDistrictQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்டப் பெயர் அல்லது அமைப்பாளர்...' : 'Filter by district or organiser...'}
                  className="w-full bg-[#FAF8F5] border-2 border-[#111111] pl-11 pr-4 py-3 text-[15px] text-[#111111] placeholder-[#5B5348] focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                />
              </div>

              {/* 380 px Scroll List: name 800 left, organiser right, 1 px #3d3633 lines, hover #2a2523, selected row red */}
              <div className="h-[380px] overflow-y-auto divide-y divide-[#3d3633] border-t border-b border-[#3d3633]">
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
                        onClick={() => handleSelectDistrict(d.id)}
                        className={`w-full text-left p-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E31E24] text-white font-bold'
                            : 'hover:bg-[#2a2523] text-[#FAF8F5]'
                        }`}
                      >
                        <div className="font-manrope font-extrabold text-[17px]">
                          {d.name[language]}
                        </div>
                        <div className={`text-[15px] text-right pl-3 ${isSelected ? 'text-white' : 'text-[#d8cfc2]'}`}>
                          {d.organizer[language]}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Parchment Panel with 8 px Red Top Border */}
            {/* "District organiser · No. N" in #C41A1F, district name clamp(34px, 4vw, 52px) 800, organiser 600 at 26px, full-width red tel: button */}
            {/* Selecting a row slides the panel content in from the right (24 px, 0.35 s) */}
            <div className="lg:col-span-7 bg-[#FAF8F5] text-[#111111] border-2 border-[#111111] p-8 md:p-10 space-y-6 overflow-hidden">
              {/* 8 px Red top border */}
              <div className="w-full h-[8px] bg-[#E31E24]" />

              <div
                className={`space-y-5 transition-transform duration-350 ease-out ${
                  districtPanelSlide ? 'translate-x-6 opacity-0' : 'translate-x-0 opacity-100'
                }`}
              >
                <div className="border-b border-[#d7d0c3] pb-4">
                  <span className="text-[15px] font-extrabold uppercase text-[#C41A1F] block tracking-normal">
                    {language === 'ta'
                      ? `மாவட்ட அமைப்பாளர் · எண். ${activeDistrictIndex}`
                      : `District organiser · No. ${activeDistrictIndex}`}
                  </span>
                  <h3 className="font-manrope font-extrabold text-[clamp(34px,4vw,48px)] leading-[1.1] text-[#111111] mt-1">
                    {activeDistrict.name[language]}
                  </h3>
                </div>

                <div className="space-y-2">
                  <span className="text-[15px] font-bold text-[#5B5348] uppercase tracking-normal">
                    {language === 'ta' ? 'மாவட்ட அமைப்பாளர்' : 'District Organiser'}
                  </span>
                  <p className="font-manrope font-semibold text-[26px] text-[#111111] leading-[1.12]">
                    {activeDistrict.organizer[language]}
                  </p>
                  <p className="text-[15px] text-[#5B5348] leading-[1.6]">
                    {language === 'ta' ? 'தலைமையிடம் / நீதிமன்றம்:' : 'Headquarters / Court:'} {activeDistrict.headquarters[language]} · {activeDistrict.courtComplex[language]}
                  </p>
                </div>

                {/* One full-width red tel: button per number */}
                <div className="pt-4 space-y-3">
                  <a
                    href={`tel:${activeDistrict.contactPhone}`}
                    className="w-full min-h-[48px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-manrope font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center gap-3 transition-colors cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'நேரடி அழைப்பு:' : 'Direct Telephone Call:'}</span>
                    <span>{activeDistrict.contactPhone}</span>
                  </a>
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
              <h2 className="font-kavivanar font-normal text-[#111111] text-[clamp(34px,4.5vw,48px)] leading-[1.12]">
                {language === 'ta' ? 'செயலாளரின் கீழ் மூன்று நிர்வாகப் பிரிவுகள்' : 'Three branches under the Secretary'}
              </h2>
            </div>
            <Link
              href="/structure"
              className="inline-flex items-center gap-2 font-manrope font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal border-b-2 border-[#111111] pb-0.5 hover:border-[#C41A1F] transition-colors shrink-0"
            >
              <span>{language === 'ta' ? 'முழு நிர்வாகிகள் பட்டியல் →' : 'View full roster →'}</span>
            </Link>
          </div>

          {/* Three equal blocks in a 2 px ink frame: Joint Secretaries 9, Deputy Secretaries 5, Head Office Advocates 9 */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-[#111111] divide-y md:divide-y-0 md:divide-x-2 divide-[#111111] mb-12">
            
            {/* Block 1: Joint Secretaries 9 */}
            <button
              type="button"
              onClick={() => setActiveBranch('joint')}
              className={`p-8 text-left transition-colors cursor-pointer ${
                activeBranch === 'joint'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#f1ece2]'
              }`}
            >
              <div className="font-manrope font-extrabold text-[64px] leading-none mb-4">
                09
              </div>
              <h3 className="font-manrope font-extrabold text-[26px] leading-[1.1] mb-2">
                {language === 'ta' ? 'இணைச் செயலாளர்கள்' : 'Joint Secretaries'}
              </h3>
              <p className={`text-[15px] leading-[1.6] ${activeBranch === 'joint' ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                {language === 'ta'
                  ? 'மண்டல ஒருங்கிணைப்பு மற்றும் அரசமைப்பு வழக்குகளுக்கான தலைமைக் குழு.'
                  : 'Zone-level administrative coordinators and constitutional bench counsels.'}
              </p>
            </button>

            {/* Block 2: Deputy Secretaries 5 */}
            <button
              type="button"
              onClick={() => setActiveBranch('deputy')}
              className={`p-8 text-left transition-colors cursor-pointer ${
                activeBranch === 'deputy'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#f1ece2]'
              }`}
            >
              <div className="font-manrope font-extrabold text-[64px] leading-none mb-4">
                05
              </div>
              <h3 className="font-manrope font-extrabold text-[26px] leading-[1.1] mb-2">
                {language === 'ta' ? 'துணைச் செயலாளர்கள்' : 'Deputy Secretaries'}
              </h3>
              <p className={`text-[15px] leading-[1.6] ${activeBranch === 'deputy' ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                {language === 'ta'
                  ? 'களப்பணி, பயிற்சி முகாம்கள் மற்றும் ஆவணக் காப்பகப் பொறுப்பாளர்கள்.'
                  : 'Field operations, training academies, and legal documentation registry.'}
              </p>
            </button>

            {/* Block 3: Head Office Advocates 9 */}
            <button
              type="button"
              onClick={() => setActiveBranch('headoffice')}
              className={`p-8 text-left transition-colors cursor-pointer ${
                activeBranch === 'headoffice'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#f1ece2]'
              }`}
            >
              <div className="font-manrope font-extrabold text-[64px] leading-none mb-4">
                09
              </div>
              <h3 className="font-manrope font-extrabold text-[26px] leading-[1.1] mb-2">
                {language === 'ta' ? 'தலைமை நிலைய வழக்கறிஞர்கள்' : 'Head Office Advocates'}
              </h3>
              <p className={`text-[15px] leading-[1.6] ${activeBranch === 'headoffice' ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                {language === 'ta'
                  ? 'அண்ணா அறிவாலயத்தில் நேரடி சட்ட ஆலோசனை மற்றும் வழக்காடல் குழு.'
                  : 'Permanent advisory counsel and urgent litigation desk at Anna Arivalayam.'}
              </p>
            </button>

          </div>

          {/* Members below in columns: name 800, district grey; each fading in 40 ms after the previous */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchRoster.map((officer, idx) => (
              <div
                key={officer.id || idx}
                className="p-5 bg-white border border-[#111111] space-y-1 transition-all duration-300"
                style={{
                  animation: `fade-rise 0.4s ease-out ${idx * 40}ms forwards`,
                }}
              >
                <h4 className="font-manrope font-extrabold text-[17px] text-[#111111] leading-snug">
                  {officer.name[language]}
                </h4>
                <div className="text-[15px] text-[#5B5348] font-bold">
                  {officer.district[language]}
                </div>
                <div className="text-[15px] text-[#C41A1F]">
                  {officer.role[language]}
                </div>
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
            <div className="bg-[#E31E24] text-white p-8 md:p-12 space-y-6 flex flex-col justify-between border-2 border-[#111111]">
              <div className="space-y-4">
                <h3 className="font-kavivanar font-normal text-[44px] leading-[1.08] text-white">
                  {language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'Advocate enrolment'}
                </h3>
                <p className="text-[17px] text-white/95 leading-[1.65] font-normal">
                  {language === 'ta'
                    ? 'பார் கவுன்சில் பதிவுபெற்ற அனைத்து வழக்கறிஞர்களும் கழகத்தின் சட்டப் பிரிவில் இணைந்து சமூக நீதி மற்றும் அரசமைப்பு மாண்புகளைக் காக்க முன்வாருங்கள்.'
                    : 'Join thousands of bar practitioners defending constitutional democracy, federalism, and the reservation architecture across all 74 districts.'}
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/enrol"
                  className="w-full min-h-[48px] px-8 bg-[#111111] hover:bg-[#333333] text-white font-manrope font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'இப்போதே சேர்க்கை பெறுக' : 'Enrol now'}
                </Link>
              </div>
            </div>

            {/* Block 2: Ink Citizen Legal Desk with 2 px Red Border Custody Notice & Parchment Button */}
            <div className="bg-[#111111] text-[#FAF8F5] p-8 md:p-12 space-y-6 flex flex-col justify-between border-2 border-[#111111]">
              <div className="space-y-4">
                <h3 className="font-kavivanar font-normal text-[44px] leading-[1.08] text-white">
                  {language === 'ta' ? 'பொதுமக்கள் சட்ட உதவி மையம்' : 'Citizen legal desk'}
                </h3>
                <p className="text-[17px] text-[#d8cfc2] leading-[1.65] font-normal">
                  {language === 'ta'
                    ? 'அரசியல் உள்நோக்கக் கைதுகள், அவசர வழக்காடல் மற்றும் அடிப்படை உரிமை மீறல்களுக்கு மாநிலம் முழுவதும் உடனடி இலவச சட்ட உதவி.'
                    : 'Urgent legal representation against unlawful detentions, political harassment, and civil rights violations through verified district panels.'}
                </p>

                {/* 2 px Red bordered notice */}
                <div className="p-4 bg-[#1a1715] border-2 border-[#E31E24] text-[15px] font-bold text-white leading-[1.6]">
                  {language === 'ta'
                    ? 'நீங்களோ அல்லது உங்களுக்குத் தெரிந்தவர்களோ காவல்துறை காவலில் வைக்கப்பட்டிருந்தால், உடனடியாக 044-2434 4455 என்ற எண்ணை அழைக்கவும்.'
                    : 'If you or someone you know is in police custody, call 044-2434 4455 now.'}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/citizen-desk"
                  className="w-full min-h-[48px] px-8 bg-[#FAF8F5] hover:bg-white text-[#111111] font-manrope font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'கோரிக்கையை அனுப்புக' : 'Submit a request'}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
