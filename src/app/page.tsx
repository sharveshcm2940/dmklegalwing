'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { IDEOLOGY_PILLARS, DMK_ORGANISATION_INFO } from '@/data/content';
import { DmkHeroSlider } from '@/components/DmkHeroSlider';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  ChevronRight, 
  Quote, 
  ExternalLink,
  Award,
  Building2,
  MapPin,
  Shield,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { events, news } = useData();

  const latestNews = news.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="w-full flex flex-col space-y-12 pb-16 font-dmk-body bg-[#FAF7F2]">
      
      {/* 1. BROADSHEET LEAD DISPATCH / HERO SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="border-4 border-neutral-900 bg-white p-2 shadow-[4px_4px_0px_#111111]">
          <div className="border border-neutral-300">
            <DmkHeroSlider />
          </div>
        </div>
      </section>

      {/* 2. GAZETTE OFFICIAL METRICS (Editorial Broadsheet Multi-Column Register) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#FAF7F2] border-y-2 border-neutral-900 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-neutral-900 text-center">
            
            <div className="p-4 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#B81318]">
                {language === 'ta' ? 'பதிவுற்ற வழக்கறிஞர்கள்' : 'REGISTERED ADVOCATES'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono mt-1">
                {DMK_ORGANISATION_INFO.barCountEstimated}
              </span>
              <span className="text-xs text-neutral-600 font-serif italic mt-0.5">
                {t.hero.statLawyers}
              </span>
            </div>

            <div className="p-4 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#B81318]">
                {language === 'ta' ? 'அனைத்து மாவட்ட கட்டமைப்பு' : 'DISTRICT JURISDICTIONS'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#E31E24] font-mono mt-1">
                38 / 38
              </span>
              <span className="text-xs text-neutral-600 font-serif italic mt-0.5">
                {t.hero.statDistricts}
              </span>
            </div>

            <div className="p-4 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#B81318]">
                {language === 'ta' ? 'நீதிமன்றப் பணி வரலாறு' : 'CONSTITUTIONAL ADVOCACY'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono mt-1">
                5+ Decades
              </span>
              <span className="text-xs text-neutral-600 font-serif italic mt-0.5">
                {t.hero.statDecades}
              </span>
            </div>

            <div className="p-4 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#B81318]">
                {language === 'ta' ? 'சமூக நீதி அரண்' : 'AFFIRMATIVE ACTION SHIELD'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#E31E24] font-mono mt-1">
                69% Quota
              </span>
              <span className="text-xs text-neutral-600 font-serif italic mt-0.5">
                {t.hero.statPrecedents}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FRONT-PAGE EDITORIAL & REVOLUTIONARY MENTORS TRIBUTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Lead Editorial Story with Broadsheet Dropcap */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border-2 border-neutral-900 shadow-[4px_4px_0px_#111111] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
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
                <p className="border-l-4 border-[#E31E24] pl-4 py-1 italic bg-[#FAF7F2] text-neutral-900 font-serif">
                  {t.intro.p2}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-neutral-900 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-600 uppercase">
                {language === 'ta' ? 'அண்ணா அறிவாலயம் தலைமைப் பிரகடனம்' : 'SECRETARIAT OFFICIAL COMMUNIQUÉ'}
              </span>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24] hover:text-black font-dmk-headline group"
              >
                <span>{t.intro.readMore}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Four Mentors Panoramic Artwork with Slogan */}
          <div className="lg:col-span-5 bg-[#2A1208] border-2 border-neutral-900 shadow-[4px_4px_0px_#111111] overflow-hidden flex flex-col justify-between text-white group">
            <div className="relative w-full h-60 sm:h-72 overflow-hidden bg-black flex items-center justify-center">
              <img
                src="/images/dmk-four-leaders.jpg"
                alt="கொள்கை தலைவர்கள்: பெரியார், அண்ணா, கலைஞர், ஸ்டாலின்"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 bg-black/85 text-[#FFD166] border border-[#FFD166]/40">
                  {language === 'ta' ? 'கொள்கைப் பிரகடனம்' : 'IDEOLOGICAL DOCTRINE'}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3 bg-[#180A04] border-t-2 border-amber-950">
              <p className="text-base sm:text-lg font-dmk-slogan text-[#FFE8A3] leading-snug drop-shadow-xs">
                "கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
              </p>
              
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-dmk-headline font-semibold">
                  பெரியார் • அண்ணா • கலைஞர் • ஸ்டாலின்
                </span>
                <Link
                  href="/ideology"
                  className="text-[#FFB703] hover:text-white font-bold flex items-center gap-1 font-dmk-headline transition-colors"
                >
                  <span>{language === 'ta' ? 'கொள்கை பார்வை' : 'Explore'}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE IDEOLOGICAL MANIFESTO (Newspaper Columns & Traditional Woodcut-Style Rules) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-2 border-neutral-900 p-8 sm:p-10 shadow-[4px_4px_0px_#111111]">
          
          <div className="text-center max-w-3xl mx-auto mb-8 pb-4 border-b-2 border-neutral-900 space-y-2">
            <span className="text-xs font-mono font-bold text-[#E31E24] tracking-[0.25em] uppercase">
              {t.ideologyPreview.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 font-dmk-headline tracking-tight">
              {t.ideologyPreview.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif italic">
              {t.ideologyPreview.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
            {IDEOLOGY_PILLARS.slice(0, 6).map((pillar, idx) => (
              <div
                key={pillar.id}
                className={`flex flex-col justify-between pt-4 lg:pt-0 ${idx > 0 ? 'lg:pl-6' : ''} space-y-3 group`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-300 pb-1.5 mb-2">
                    <span className="text-2xl font-mono font-black text-[#E31E24]">
                      § {pillar.number}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">
                      {pillar.subtitle[language]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 font-dmk-headline mb-2 group-hover:text-[#E31E24] transition-colors leading-snug">
                    {pillar.title[language]}
                  </h3>

                  <p className="text-xs text-neutral-700 leading-relaxed line-clamp-4 font-dmk-body">
                    {pillar.description[language]}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200">
                  <Link
                    href={`/ideology#${pillar.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-900 hover:text-[#E31E24] font-bold font-dmk-headline"
                  >
                    <span>{language === 'ta' ? 'முழுமையான விளக்கம்' : 'Constitutional Principle'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#E31E24] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 pt-6 border-t-2 border-neutral-900">
            <Link
              href="/ideology"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-[#E31E24] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs font-dmk-headline"
            >
              <span>{t.ideologyPreview.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. PHOTOJOURNALISM & FIELD DISPATCHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-2 border-neutral-900 p-8 sm:p-10 shadow-[4px_4px_0px_#111111]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-neutral-900 mb-8">
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
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#E31E24] hover:text-black font-dmk-headline"
            >
              <span>{t.activitiesPreview.allActivities}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="border-2 border-neutral-900 bg-[#FAF7F2] p-4 flex flex-col sm:flex-row gap-5 shadow-[3px_3px_0px_#111111] group"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-neutral-900 shrink-0 border border-neutral-900">
                  <img
                    src={evt.image}
                    alt={evt.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 text-white ${
                    evt.status === 'upcoming' ? 'bg-[#E31E24]' : 'bg-black'
                  }`}>
                    {evt.status === 'upcoming'
                      ? language === 'ta' ? 'வரவிருக்கும் நிகழ்வு' : 'Upcoming'
                      : language === 'ta' ? 'நிறைவடைந்தது' : 'Concluded'}
                  </span>
                </div>

                <div className="flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono mb-1.5 border-b border-neutral-300 pb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#E31E24]" />
                      <span>{evt.date}</span>
                      <span>•</span>
                      <span className="font-bold text-neutral-800">{evt.category}</span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-snug">
                      {evt.title[language]}
                    </h3>

                    <p className="text-xs text-neutral-700 line-clamp-2 leading-relaxed font-dmk-body mt-1">
                      {evt.description[language]}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-300 text-xs text-neutral-600 flex items-center justify-between">
                    <span className="truncate max-w-[180px] font-mono text-[11px]">{evt.venue[language]}</span>
                    <Link
                      href="/activities"
                      className="text-[#E31E24] font-bold hover:underline font-dmk-headline"
                    >
                      {language === 'ta' ? 'முழு விவரம்' : 'Details'} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. TELEGRAPHIC BULLETINS & PRESS ARCHIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-2 border-neutral-900 p-8 sm:p-10 shadow-[4px_4px_0px_#111111]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-neutral-900 mb-8">
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
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#E31E24] hover:text-black font-dmk-headline"
            >
              <span>{t.newsPreview.viewArchive}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {latestNews.map((item, idx) => (
              <article
                key={item.id}
                className={`flex flex-col justify-between pt-4 md:pt-0 ${idx > 0 ? 'md:pl-6' : ''} group`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-600 font-mono mb-2 border-b border-neutral-300 pb-1">
                    <span className="text-[#E31E24] font-bold uppercase">{item.category}</span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors line-clamp-2 mb-2 leading-snug">
                    {item.title[language]}
                  </h3>

                  <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3 mb-4 font-dmk-body">
                    {item.summary[language]}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
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

        </div>
      </section>

      {/* 7. OFFICIAL ENROLLMENT NOTICE / ADVOCATE MEMBERSHIP PROCLAMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#111111] text-white border-4 border-neutral-900 p-8 sm:p-12 shadow-[6px_6px_0px_#E31E24] relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="px-3 py-1 bg-[#E31E24] text-white text-xs font-mono font-bold uppercase tracking-widest inline-block">
              {language === 'ta' ? 'அதிகாரப்பூர்வ அழைப்பு' : 'OFFICIAL MEMBERSHIP ENROLLMENT'}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black font-dmk-headline tracking-tight text-white leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-dmk-body">
              {t.cta.desc}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact#register"
                className="px-6 py-3 bg-[#E31E24] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors border-2 border-white shadow-xs font-dmk-headline"
              >
                {t.cta.button}
              </Link>
              <Link
                href="/structure"
                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors border-2 border-neutral-700 font-dmk-headline"
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
