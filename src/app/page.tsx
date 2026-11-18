'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { IDEOLOGY_PILLARS, DMK_ORGANISATION_INFO } from '@/data/content';
import { DmkHeroSlider } from '@/components/DmkHeroSlider';
import { 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink,
  Scale
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { events, news } = useData();

  const latestNews = news.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-dmk-body">
      
      {/* 1. HERO SLIDER SECTION (Clean border, no card shadow) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-6 border-b border-neutral-300">
        <DmkHeroSlider />
      </section>

      {/* 2. OFFICIAL METRICS REGISTER (Seamless Newspaper Multi-Column Tape) */}
      <section className="border-b border-neutral-300 bg-[#FAF7F2] py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-300 text-center">
            
            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'பதிவுபெற்ற வழக்கறிஞர்கள்' : 'REGISTERED ADVOCATES'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-neutral-900 block mt-0.5">
                {DMK_ORGANISATION_INFO.barCountEstimated}
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">
                {t.hero.statLawyers}
              </span>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'மாவட்டக் கட்டமைப்பு' : 'DISTRICT JURISDICTIONS'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#E31E24] block mt-0.5">
                38 / 38
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">
                {t.hero.statDistricts}
              </span>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'வரலாற்றுப் பின்னணி' : 'CONSTITUTIONAL ADVOCACY'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-neutral-900 block mt-0.5">
                5+ Decades
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">
                {t.hero.statDecades}
              </span>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'சமூக நீதி அரண்' : 'AFFIRMATIVE ACTION SHIELD'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#E31E24] block mt-0.5">
                69% Quota
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">
                {t.hero.statPrecedents}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FRONT-PAGE EDITORIAL & FOUR MENTORS (Clean 2-Column Split, No Boxed Cards) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-neutral-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Lead Editorial Column */}
          <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-neutral-300 pb-8 lg:pb-0">
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2">
              <span className="text-xs font-mono font-bold text-[#E31E24] tracking-[0.2em] uppercase">
                {language === 'ta' ? 'தலைமை தலையங்கம்' : 'LEAD EDITORIAL DISPATCH'}
              </span>
              <span className="text-xs font-mono text-neutral-500">
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
              <p className="border-l-4 border-[#E31E24] pl-4 py-1 italic bg-[#F3EFE6] text-neutral-900 font-serif">
                {t.intro.p2}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-600 uppercase">
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
            <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-black border border-neutral-900">
              <img
                src="/images/dmk-four-leaders.jpg"
                alt="கொள்கை தலைவர்கள்: பெரியார், அண்ணா, கலைஞர், ஸ்டாலின்"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-black/90 text-[#FFD166] border border-[#FFD166]/40">
                  {language === 'ta' ? 'கொள்கைப் பிரகடனம்' : 'IDEOLOGICAL DOCTRINE'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F3EFE6] border-l-4 border-[#E31E24] space-y-2">
              <p className="text-base sm:text-lg font-dmk-slogan text-neutral-900 leading-snug">
                "கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
              </p>
              
              <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-700 font-semibold">
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

      {/* 4. THE IDEOLOGICAL MANIFESTO (Clean Newspaper Columns with Dividers, No Cards) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-neutral-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-3 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-[#E31E24] tracking-[0.25em] uppercase block mb-1">
              {t.ideologyPreview.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline tracking-tight uppercase">
              {t.ideologyPreview.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif italic mt-0.5">
              {t.ideologyPreview.subtitle}
            </p>
          </div>

          <Link
            href="/ideology"
            className="font-mono text-xs font-bold text-[#E31E24] hover:underline uppercase tracking-wider mt-2 md:mt-0"
          >
            {t.ideologyPreview.viewAll} &rarr;
          </Link>
        </div>

        {/* Seamless 3-Column Newspaper Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-neutral-300">
          {IDEOLOGY_PILLARS.slice(0, 6).map((pillar, idx) => (
            <div
              key={pillar.id}
              className={`flex flex-col justify-between pt-6 lg:pt-0 ${idx > 0 ? 'lg:pl-8' : ''} space-y-3 group`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-300 pb-1.5 mb-2">
                  <span className="text-xl font-mono font-black text-[#E31E24]">
                    § {pillar.number}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">
                    {pillar.subtitle[language]}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 font-dmk-headline mb-2 group-hover:text-[#E31E24] transition-colors leading-snug">
                  {pillar.title[language]}
                </h3>

                <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body">
                  {pillar.description[language]}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200">
                <Link
                  href={`/ideology#${pillar.id}`}
                  className="inline-flex items-center gap-1 text-xs text-neutral-900 hover:text-[#E31E24] font-bold font-dmk-headline"
                >
                  <span>{language === 'ta' ? 'விளக்கம்' : 'Read Doctrine'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#E31E24]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
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
            className="font-mono text-xs font-bold text-[#E31E24] hover:underline uppercase tracking-wider"
          >
            {t.activitiesPreview.allActivities} &rarr;
          </Link>
        </div>

        {/* 2-Column Photojournalism Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-300">
          {upcomingEvents.map((evt, idx) => (
            <article
              key={evt.id}
              className={`flex flex-col sm:flex-row gap-5 pt-6 md:pt-0 ${idx > 0 ? 'md:pl-8' : ''} group`}
            >
              <div className="sm:w-2/5 h-44 sm:h-auto relative overflow-hidden bg-neutral-900 shrink-0 border border-neutral-300">
                <img
                  src={evt.image}
                  alt={evt.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 text-white ${
                  evt.status === 'upcoming' ? 'bg-[#E31E24]' : 'bg-black'
                }`}>
                  {evt.status === 'upcoming'
                    ? language === 'ta' ? 'வரவிருக்கும் நிகழ்வு' : 'Upcoming'
                    : language === 'ta' ? 'நிறைவடைந்தது' : 'Concluded'}
                </span>
              </div>

              <div className="flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono mb-1 border-b border-neutral-200 pb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E31E24]" />
                    <span>{evt.date}</span>
                    <span>•</span>
                    <span className="font-bold text-neutral-800">{evt.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-snug">
                    {evt.title[language]}
                  </h3>

                  <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body mt-1">
                    {evt.description[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                  <span className="truncate max-w-[180px] font-mono text-[11px] font-semibold">{evt.venue[language]}</span>
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

      {/* 6. TELEGRAPHIC BULLETINS & PRESS ARCHIVE (Seamless 3-Column Newsprint) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-neutral-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b-2 border-neutral-900 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-[#E31E24] tracking-[0.2em] uppercase block mb-1">
              {t.newsPreview.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline">
              {t.newsPreview.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif italic mt-0.5">
              {t.newsPreview.subtitle}
            </p>
          </div>

          <Link
            href="/news"
            className="font-mono text-xs font-bold text-[#E31E24] hover:underline uppercase tracking-wider"
          >
            {t.newsPreview.viewArchive} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-300">
          {latestNews.map((item, idx) => (
            <article
              key={item.id}
              className={`flex flex-col justify-between pt-6 md:pt-0 ${idx > 0 ? 'md:pl-8' : ''} group`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-600 font-mono mb-2 border-b border-neutral-200 pb-1">
                  <span className="text-[#E31E24] font-bold uppercase">{item.category}</span>
                  <span>{item.date}</span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-snug mb-2">
                  {item.title[language]}
                </h3>

                <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body mb-3">
                  {item.summary[language]}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-mono text-[11px] truncate max-w-[150px]">
                  {item.author[language]}
                </span>
                <Link
                  href="/news"
                  className="text-neutral-900 hover:text-[#E31E24] font-bold flex items-center gap-1 font-dmk-headline"
                >
                  <span>{language === 'ta' ? 'வாசிக்க' : 'Read'}</span>
                  <ExternalLink className="w-3 h-3 text-[#E31E24]" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. OFFICIAL ENROLLMENT NOTICE / ADVOCATE MEMBERSHIP PROCLAMATION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="bg-[#111111] text-white p-8 sm:p-12 border-t-4 border-[#E31E24]">
          <div className="max-w-3xl space-y-3">
            <span className="px-2.5 py-0.5 bg-[#E31E24] text-white text-[10px] font-mono font-bold uppercase tracking-widest inline-block">
              {language === 'ta' ? 'அதிகாரப்பூர்வ அழைப்பு' : 'OFFICIAL MEMBERSHIP ENROLLMENT'}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black font-dmk-headline tracking-tight text-white leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-dmk-body">
              {t.cta.desc}
            </p>

            <div className="pt-3 flex flex-wrap gap-4">
              <Link
                href="/contact#register"
                className="px-6 py-2.5 bg-[#E31E24] hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-white font-dmk-headline"
              >
                {t.cta.button}
              </Link>
              <Link
                href="/structure"
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-neutral-700 font-dmk-headline"
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
