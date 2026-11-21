'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { IDEOLOGY_PILLARS, DMK_ORGANISATION_INFO } from '@/data/content';
import { DmkHeroSlider } from '@/components/DmkHeroSlider';
import { FoundationalDoctrines } from '@/components/FoundationalDoctrines';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink,
  Scale,
  Quote,
  CheckCircle2,
  BookOpen,
  Award,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { events } = useData();
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const upcomingEvents = events.slice(0, 2);
  const activePillar = IDEOLOGY_PILLARS[activePillarIndex] || IDEOLOGY_PILLARS[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-dmk-body">
      
      {/* 1. HERO SLIDER SECTION (Clean border, no card shadow) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-6 border-b border-neutral-300">
        <DmkHeroSlider />
      </section>

      {/* 2. OFFICIAL METRICS REGISTER (Prestigious Dravidian Movement Impact Strip) */}
      <section className="bg-[#111111] text-white border-y-2 border-[#E31E24] py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800 text-center">
            
            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'பதிவுபெற்ற வழக்கறிஞர்கள்' : 'REGISTERED ADVOCATES'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-white block my-1 tracking-tight">
                {DMK_ORGANISATION_INFO.barCountEstimated}
              </span>
              <span className="text-xs text-[#FFB703] font-dmk-body block">
                {language === 'ta' ? 'தமிழ்நாடு & புதுச்சேரி வழக்கறிஞர்கள் அரண்' : 'Tamil Nadu & Puducherry Legal Cadre'}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'அமைப்பு மாவட்டக் கட்டமைப்பு' : 'DISTRICT JURISDICTIONS'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-[#E31E24] block my-1 tracking-tight">
                74 / 74
              </span>
              <span className="text-xs text-neutral-300 font-dmk-body block">
                {language === 'ta' ? 'அனைத்து அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்' : 'Active Units in All 74 Party Districts'}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'வரலாற்றுப் பின்னணி' : 'CONSTITUTIONAL ADVOCACY'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-white block my-1 tracking-tight">
                50+ Years
              </span>
              <span className="text-xs text-[#FFB703] font-dmk-body block">
                {language === 'ta' ? '1971 முதல் தொடரும் மக்கள் சட்டப்பணி' : 'Continuous Jurisprudence Since 1971'}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'சமூக நீதி அரண்' : 'AFFIRMATIVE ACTION SHIELD'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-[#E31E24] block my-1 tracking-tight">
                69% Quota
              </span>
              <span className="text-xs text-neutral-300 font-dmk-body block">
                {language === 'ta' ? '9-வது அட்டவணையில் அரசமைப்புப் பாதுகாப்பு' : 'Ninth Schedule Constitutional Protection'}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FRONT-PAGE EDITORIAL & FOUR MENTORS (Clean 2-Column Split, No Boxed Cards) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 border-b border-neutral-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Lead Editorial Column */}
          <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-neutral-300 pb-8 lg:pb-0">
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2.5">
              <span className="text-xs font-english font-bold text-[#E31E24] tracking-[0.2em] uppercase">
                {language === 'ta' ? 'தலைமை தலையங்கம்' : 'LEAD EDITORIAL DISPATCH'}
              </span>
              <span className="text-xs font-english font-bold text-neutral-500">
                CHENNAI — HIGH COURT DESK
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 font-dmk-headline leading-tight">
              {t.intro.title}
            </h2>

            <div className="broadsheet-dropcap text-sm sm:text-base text-neutral-800 leading-relaxed font-dmk-body space-y-4">
              <p>
                {t.intro.p1}
              </p>
              <p className="border-l-4 border-[#E31E24] pl-4 py-2 italic bg-[#FAF7F2] text-neutral-900 font-serif text-sm sm:text-base">
                {t.intro.p2}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
              <span className="text-xs font-english font-bold text-neutral-600 uppercase">
                {language === 'ta' ? 'அண்ணா அறிவாலயம் தலைமைப் பிரகடனம்' : 'SECRETARIAT OFFICIAL COMMUNIQUÉ'}
              </span>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E31E24] hover:text-black font-dmk-headline group"
              >
                <span>{t.intro.readMore}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right: Four Mentors Banner & Slogan */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-black border-2 border-neutral-900 shadow-xl group">
              <img
                src="/images/dmk-four-leaders.jpg"
                alt="கொள்கை தலைவர்கள்: பெரியார், அண்ணா, கலைஞர், ஸ்டாலின்"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-english font-bold uppercase tracking-widest px-2.5 py-1 bg-black/90 text-[#FFD166] border border-[#FFD166]/40">
                  {language === 'ta' ? 'கொள்கைப் பிரகடனம்' : 'IDEOLOGICAL DOCTRINE'}
                </span>
              </div>
            </div>

            <div className="p-5 bg-[#FAF7F2] border-l-4 border-[#E31E24] space-y-3">
              <p className="text-lg sm:text-xl font-dmk-slogan text-neutral-900 leading-snug">
                "கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
              </p>
              
              <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-xs font-english">
                <span className="text-neutral-800 font-bold">
                  பெரியார் • அண்ணா • கலைஞர் • ஸ்டாலின்
                </span>
                <Link
                  href="/ideology"
                  className="text-[#E31E24] hover:underline font-bold"
                >
                  {language === 'ta' ? 'கொள்கைப் பார்வை →' : 'Explore →'}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE SIX FOUNDATIONAL DOCTRINES (Auto-Advancing Broadsheet System) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 border-b border-neutral-300">
        <FoundationalDoctrines />
      </section>

      {/* 5. PHOTOJOURNALISM & FIELD DISPATCHES (Editorial Press Layout, No Bulky Cards) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-neutral-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b-2 border-neutral-900 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-[#E31E24] tracking-[0.2em] uppercase block mb-1">
              {t.activitiesPreview.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline">
              {t.activitiesPreview.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif italic mt-0.5">
              {t.activitiesPreview.subtitle}
            </p>
          </div>

          <Link
            href="/activities"
            className="text-xs font-english font-bold text-[#E31E24] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>{t.activitiesPreview.allActivities}</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* 2-Column Photojournalism Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-300">
          {upcomingEvents.map((evt, idx) => (
            <article
              key={evt.id}
              className={`flex flex-col sm:flex-row gap-5 pt-6 md:pt-0 ${idx > 0 ? 'md:pl-8' : ''} group`}
            >
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-neutral-900 shrink-0 border border-neutral-300">
                <img
                  src={evt.image}
                  alt={evt.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 text-[10px] font-english font-bold uppercase tracking-wider px-2.5 py-1 text-white shadow-md ${
                  evt.status === 'upcoming' ? 'bg-[#E31E24]' : 'bg-black'
                }`}>
                  {evt.status === 'upcoming'
                    ? language === 'ta' ? 'வரவிருக்கும் நிகழ்வு' : 'Upcoming'
                    : language === 'ta' ? 'நிறைவடைந்தது' : 'Concluded'}
                </span>
              </div>

              <div className="flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 font-english mb-1 border-b border-neutral-200 pb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E31E24]" />
                    <span className="font-semibold">{evt.date}</span>
                    <span>•</span>
                    <span className="font-bold text-neutral-900 uppercase">{evt.category}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-snug">
                    {evt.title[language]}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body mt-1">
                    {evt.description[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                  <span className="truncate max-w-[180px] font-english text-[11px] font-bold text-neutral-800">{evt.venue[language]}</span>
                  <Link
                    href="/activities"
                    className="text-[#E31E24] font-bold hover:underline font-dmk-headline"
                  >
                    {language === 'ta' ? 'முழு விவரம்' : 'Details'} &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. DISTRICT STRUCTURE & 74 PARTY CADRE DIRECTORY (Tamil Nadu Interactive Cartography) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-neutral-300">
        <TamilNaduMap />
      </section>

      {/* 7. OFFICIAL ENROLLMENT NOTICE / ADVOCATE MEMBERSHIP PROCLAMATION (Mass & Stylish) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#111111] text-white p-8 sm:p-14 border-t-4 border-[#E31E24] relative overflow-hidden shadow-2xl">
          
          {/* Subtle Radiant Sunrise Background Glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#E31E24]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E31E24] text-white text-[11px] font-english font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'அதிகாரப்பூர்வ அழைப்பு • திமுக வழக்கறிஞர் அணி' : 'OFFICIAL MEMBERSHIP ENROLLMENT • DMK LEGAL WING'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-dmk-headline tracking-tight text-white leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-dmk-body max-w-3xl">
              {t.cta.desc}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/contact#register"
                className="px-8 py-3.5 bg-[#E31E24] hover:bg-white hover:text-black text-white text-xs sm:text-sm font-english font-bold uppercase tracking-wider transition-all border border-white font-dmk-headline shadow-lg"
              >
                {t.cta.button} &rarr;
              </Link>
              <Link
                href="/structure"
                className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-english font-bold uppercase tracking-wider transition-all border border-neutral-700 font-dmk-headline"
              >
                {language === 'ta' ? 'அமைப்புப் பட்டியல்' : 'View Hierarchy'}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
