'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { SITE_STATS } from '@/data/siteStats';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Briefcase
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { news, events } = useData();

  // 1. Identify Lead Story and Secondary Stories from /api/news
  const leadStory = useMemo(() => {
    return news.find((n) => n.isLeadStory) || news.find((n) => n.featured) || news[0];
  }, [news]);

  const secondaryStories = useMemo(() => {
    return news.filter((n) => n.id !== leadStory?.id).slice(0, 3);
  }, [news, leadStory]);

  // 2. Deduplicate images across the entire page: "Never show the same image twice on one page"
  const displayedImages = new Set<string>();

  // Check lead story image
  const leadHasImage = Boolean(leadStory?.image && !displayedImages.has(leadStory.image));
  if (leadHasImage && leadStory?.image) {
    displayedImages.add(leadStory.image);
  }

  // Check secondary stories images
  const secondaryStoryList = secondaryStories.map((story) => {
    const showImage = Boolean(story.image && !displayedImages.has(story.image));
    if (showImage && story.image) {
      displayedImages.add(story.image);
    }
    return {
      story,
      showImage,
    };
  });

  // Mentors image is registered once
  displayedImages.add('/images/dmk-four-leaders.jpg');

  // Next court dates or events (up to 4 upcoming / scheduled events)
  const upcomingEvents = useMemo(() => {
    const list = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return list.slice(0, 4);
  }, [events]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-dmk-body">
      
      {/* TOP BROADSHEET MASTHEAD BAR */}
      <div className="border-b border-[#D8D3CB] py-2 px-4 sm:px-6 bg-[#FAF8F5]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5B5348] gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111111]">
              {language === 'ta' ? 'அதிகாரப்பூர்வ தளம்' : 'Official Portal'}
            </span>
            <span className="text-[#D8D3CB]">•</span>
            <span>
              {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி' : 'DMK Legal Wing — High Court & Supreme Court Front'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#111111]">
              {language === 'ta' ? 'அண்ணா அறிவாலயம், சென்னை' : 'Anna Arivalayam, Chennai — 600 018'}
            </span>
          </div>
        </div>
      </div>

      {/* 1. FIXED FRONT PAGE: 60% LEAD STORY + 40% RULED COLUMN OF 3 SECONDARY STORIES */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 border-b border-[#D8D3CB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEAD STORY (About 60% width on desktop: lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-[#D8D3CB] pb-8 lg:pb-0">
            {leadStory && (
              <article className="space-y-4">
                
                {/* Story Type Tag (Reserved uppercase letter-spaced style) */}
                <div className="flex items-center gap-2">
                  <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F]">
                    [{leadStory.category}]
                  </span>
                  <span className="text-[#D8D3CB]">•</span>
                  <time className="text-xs text-[#5B5348] font-english">
                    {leadStory.date}
                  </time>
                  {leadStory.court && (
                    <>
                      <span className="text-[#D8D3CB]">•</span>
                      <span className="text-xs text-[#5B5348] font-dmk-body">
                        {leadStory.court}
                      </span>
                    </>
                  )}
                </div>

                {/* Photo or Typographic Block */}
                {leadHasImage ? (
                  <figure className="space-y-2">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px]">
                      <img
                        src={leadStory.image}
                        alt={leadStory.title[language]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {(leadStory.caption?.[language] || leadStory.photoCredit) && (
                      <figcaption className="text-xs text-[#5B5348] font-dmk-body flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D3CB] pb-1.5">
                        {leadStory.caption?.[language] && (
                          <span className="italic">{leadStory.caption[language]}</span>
                        )}
                        {leadStory.photoCredit && (
                          <span className="font-english text-[10px] text-[#5B5348]/80">
                            {leadStory.photoCredit}
                          </span>
                        )}
                      </figcaption>
                    )}
                  </figure>
                ) : (
                  <div className="p-6 bg-white border-l-4 border-[#E31E24] border-y border-r border-[#D8D3CB] rounded-[2px] space-y-2">
                    <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F]">
                      [{leadStory.category}]
                    </span>
                    <p className="font-dmk-headline text-lg sm:text-xl font-bold text-[#111111] italic leading-snug">
                      &ldquo;{leadStory.title[language]}&rdquo;
                    </p>
                  </div>
                )}

                {/* Headline */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] font-dmk-headline hover:text-[#C41A1F] transition-colors leading-tight">
                  <Link href={`/news/${leadStory.id}`}>
                    {leadStory.title[language]}
                  </Link>
                </h1>

                {/* Two-Line Summary */}
                <p className="line-clamp-2 text-sm sm:text-base text-[#5B5348] font-dmk-body leading-relaxed">
                  {leadStory.summary[language]}
                </p>

                {/* "Read the full statement" Link */}
                <div className="pt-2">
                  <Link
                    href={`/news/${leadStory.id}`}
                    className="min-h-[44px] inline-flex items-center gap-1.5 font-dmk-body font-bold text-xs uppercase tracking-wider text-[#C41A1F] hover:text-[#111111] underline underline-offset-4 transition-colors"
                  >
                    <span>{language === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'Read the full statement'}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

              </article>
            )}
          </div>

          {/* THREE SECONDARY STORIES IN A RULED COLUMN (About 40% width on desktop: lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b-2 border-[#111111] pb-2">
              <h2 className="text-sm font-bold text-[#111111] font-dmk-headline">
                {language === 'ta' ? 'முக்கிய அறிக்கைகள் & தீர்ப்புகள்' : 'Dispatches & Legal Statements'}
              </h2>
            </div>

            <div className="divide-y divide-[#D8D3CB]">
              {secondaryStoryList.map(({ story, showImage }, idx) => (
                <article
                  key={story.id}
                  className={`space-y-3 ${idx === 0 ? 'pb-6' : 'py-6'}`}
                >
                  {/* Category & Date */}
                  <div className="flex items-center gap-2">
                    <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F]">
                      [{story.category}]
                    </span>
                    <span className="text-[#D8D3CB]">•</span>
                    <time className="text-xs text-[#5B5348] font-english">
                      {story.date}
                    </time>
                  </div>

                  {/* Photo or Typographic Block */}
                  {showImage ? (
                    <figure className="space-y-1.5">
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px]">
                        <img
                          src={story.image}
                          alt={story.title[language]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {(story.caption?.[language] || story.photoCredit) && (
                        <figcaption className="text-[11px] text-[#5B5348] font-dmk-body flex flex-wrap items-center justify-between gap-1 pb-1">
                          {story.caption?.[language] && (
                            <span className="italic">{story.caption[language]}</span>
                          )}
                          {story.photoCredit && (
                            <span className="font-english text-[10px] text-[#5B5348]/80">
                              {story.photoCredit}
                            </span>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  ) : (
                    <div className="p-3 bg-white border-l-2 border-[#E31E24] rounded-[2px]">
                      <p className="font-dmk-headline text-xs sm:text-sm font-semibold text-[#111111] italic leading-snug">
                        &ldquo;{story.title[language]}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Headline */}
                  <h3 className="text-base sm:text-lg font-bold text-[#111111] font-dmk-headline hover:text-[#C41A1F] transition-colors leading-snug line-clamp-2">
                    <Link href={`/news/${story.id}`}>
                      {story.title[language]}
                    </Link>
                  </h3>

                  {/* One-Line Summary & Link */}
                  <p className="line-clamp-2 text-xs sm:text-sm text-[#5B5348] font-dmk-body leading-relaxed">
                    {story.summary[language]}
                  </p>

                  <div>
                    <Link
                      href={`/news/${story.id}`}
                      className="min-h-[44px] inline-flex items-center gap-1 text-xs font-dmk-body font-bold text-[#111111] hover:text-[#C41A1F] underline underline-offset-4 transition-colors"
                    >
                      <span>{language === 'ta' ? 'விவரம்' : 'Read story'}</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Link to Full News Archive */}
            <div className="pt-2 border-t border-[#D8D3CB]">
              <Link
                href="/news"
                className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-dmk-body font-bold text-[#C41A1F] hover:text-[#111111] underline underline-offset-4 transition-colors"
              >
                <span>{language === 'ta' ? 'அனைத்து செய்திகள் & அறிக்கைகள்' : 'View Complete News & Media Archive'}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. COURT DATES & LEGAL EVENTS DOCKET (From /api/events) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-[#D8D3CB]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b-2 border-[#111111] mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
              {language === 'ta' ? 'அடுத்த நீதிமன்ற வழக்குகள் & நிகழ்வுகள்' : 'Next Court Dates & Proceedings'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-0.5">
              {language === 'ta' 
                ? 'சென்னை உயர் நீதிமன்றம், உச்ச நீதிமன்றம் மற்றும் வழக்கறிஞர் அணி முக்கிய நிகழ்வுகளின் அட்டவணை' 
                : 'Upcoming hearings, legal seminars, and court proceedings from the Legal Wing calendar'}
            </p>
          </div>

          <Link
            href="/activities"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-dmk-body font-bold text-[#C41A1F] hover:text-[#111111] underline underline-offset-4"
          >
            <span>{language === 'ta' ? 'முழு நிகழ்வுப் பட்டியல்' : 'Full Events & Court Calendar'}</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Ruled Docket Table / List */}
        <div className="border border-[#D8D3CB] divide-y divide-[#D8D3CB] bg-white rounded-[2px]">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
            >
              {/* Date & Matter Details */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 md:w-3/4">
                
                {/* Date */}
                <div className="shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-white text-xs font-english font-bold rounded-[2px]">
                    <Calendar className="w-3.5 h-3.5 text-[#E31E24]" />
                    <time>{evt.date}</time>
                  </div>
                </div>

                {/* Court / Venue & Matter */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5B5348] font-dmk-body">
                    <span className="font-bold text-[#C41A1F] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {evt.venue[language]}
                    </span>
                    <span className="text-[#D8D3CB]">•</span>
                    <span className="font-semibold text-[#111111]">{evt.category}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#111111] font-dmk-headline">
                    {evt.title[language]}
                  </h3>

                  <p className="line-clamp-1 text-xs text-[#5B5348] font-dmk-body">
                    {evt.description[language]}
                  </p>
                </div>

              </div>

              {/* Action Link */}
              <div className="shrink-0 flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#D8D3CB]">
                <Link
                  href="/activities"
                  className="min-h-[44px] inline-flex items-center gap-1 text-xs font-dmk-body font-bold text-[#111111] hover:text-[#C41A1F] underline underline-offset-4"
                >
                  <span>{language === 'ta' ? 'முழு விவரம்' : 'View Docket'}</span>
                  <span>&rarr;</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 3. METRICS STRIP (Read from src/data/siteStats.ts, with "as of November 2026" underneath) */}
      <section className="bg-[#111111] text-white border-y-2 border-[#E31E24] py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800 text-center">
            {SITE_STATS.metrics.map((metric) => (
              <div key={metric.id} className="p-4 sm:p-5">
                <span className="text-xs font-dmk-body font-bold text-neutral-400 block mb-1">
                  {metric.label[language]}
                </span>
                <span className={`text-3xl sm:text-4xl lg:text-5xl font-black font-english block my-1 tracking-tight ${
                  metric.highlightRed ? 'text-[#E31E24]' : 'text-white'
                }`}>
                  {metric.figure}
                </span>
                <span className="text-xs text-neutral-300 font-dmk-body block">
                  {metric.subtext[language]}
                </span>
              </div>
            ))}
          </div>

          {/* "as of November 2026" line under the strip */}
          <div className="mt-6 pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400 font-dmk-body">
            {language === 'ta' 
              ? `${SITE_STATS.asOf.ta} நிலவரப்படி` 
              : `as of ${SITE_STATS.asOf.en}`}
          </div>

        </div>
      </section>

      {/* 4. FOUR MENTOR PORTRAITS (Single row with names, not repeated behind headlines) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 border-b border-[#D8D3CB]">
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b-2 border-[#111111]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                {language === 'ta' ? 'கொள்கை வழிகாட்டிகள்' : 'Founding Mentors & Ideological Guide'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-0.5">
                {language === 'ta'
                  ? 'சமூக நீதி, மாநில சுயாட்சி மற்றும் சமத்துவக் கொள்கைகளின் வரலாற்றுத் தலைவர்கள்'
                  : 'The four visionary architects of Dravidian jurisprudence, social democracy, and constitutional equity'}
              </p>
            </div>
            <Link
              href="/ideology"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-dmk-body font-bold text-[#C41A1F] hover:text-[#111111] underline underline-offset-4"
            >
              <span>{language === 'ta' ? 'கொள்கைப் பார்வை' : 'Explore Ideology'}</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Unified Photo Row (Shown exactly once on page) */}
          <div className="border border-[#D8D3CB] bg-white rounded-[2px] overflow-hidden">
            <div className="relative aspect-[2/1] sm:aspect-[3/1] lg:aspect-[4/1] w-full overflow-hidden bg-black">
              <img
                src="/images/dmk-four-leaders.jpg"
                alt={language === 'ta' ? 'கொள்கை தலைவர்கள்: பெரியார், அண்ணா, கலைஞர், ஸ்டாலின்' : 'DMK Mentors: Periyar, Anna, Kalaignar, Stalin'}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Single Row of Names directly underneath */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D8D3CB] border-t border-[#D8D3CB] bg-[#FAF8F5] text-center">
              
              <div className="p-3 sm:p-4">
                <span className="font-dmk-headline font-bold text-sm sm:text-base text-[#111111] block">
                  {language === 'ta' ? 'தந்தை பெரியார்' : 'Thanthai Periyar'}
                </span>
                <span className="text-xs text-[#5B5348] font-dmk-body block mt-0.5">
                  {language === 'ta' ? 'சுயமரியாதை இயக்க நிறுவனர்' : 'Father of the Self-Respect Movement'}
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <span className="font-dmk-headline font-bold text-sm sm:text-base text-[#111111] block">
                  {language === 'ta' ? 'பேரறிஞர் அண்ணா' : 'Perarignar Anna'}
                </span>
                <span className="text-xs text-[#5B5348] font-dmk-body block mt-0.5">
                  {language === 'ta' ? 'திமுக நிறுவனத் தலைவர், முன்னாள் முதல்வர்' : 'Founding Leader of DMK & Former CM'}
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <span className="font-dmk-headline font-bold text-sm sm:text-base text-[#111111] block">
                  {language === 'ta' ? 'முத்தமிழறிஞர் கலைஞர்' : 'Muthamizharignar Kalaignar'}
                </span>
                <span className="text-xs text-[#5B5348] font-dmk-body block mt-0.5">
                  {language === 'ta' ? 'முன்னாள் திமுக தலைவர், 5 முறை முதல்வர்' : 'Former DMK President & 5-Term CM'}
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <span className="font-dmk-headline font-bold text-sm sm:text-base text-[#111111] block">
                  {language === 'ta' ? 'கழகத் தலைவர் மு.க. ஸ்டாலின்' : 'Kazhaga Thalaivar M.K. Stalin'}
                </span>
                <span className="text-xs text-[#5B5348] font-dmk-body block mt-0.5">
                  {language === 'ta' ? 'மாண்புமிகு தமிழ்நாடு முதலமைச்சர்' : 'Hon’ble Chief Minister of Tamil Nadu'}
                </span>
              </div>

            </div>
          </div>

          {/* Slogan Banner */}
          <div className="p-4 bg-white border-l-4 border-[#E31E24] border-y border-r border-[#D8D3CB] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm sm:text-base font-dmk-headline font-bold text-[#111111] leading-snug">
              &ldquo;{language === 'ta' 
                ? 'கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!' 
                : 'Following the path of our visionary leaders! Building an egalitarian society for all!'}&rdquo;
            </p>
            <Link
              href="/ideology"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-dmk-body font-bold text-[#C41A1F] hover:text-[#111111] underline underline-offset-4 shrink-0"
            >
              <span>{language === 'ta' ? 'கொள்கைப் பிரகடனம்' : 'Read Doctrine'}</span>
              <span>&rarr;</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 5. DISTRICT STRUCTURE & 74 PARTY CADRE DIRECTORY (Tamil Nadu Interactive Cartography) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <TamilNaduMap />
      </section>

    </div>
  );
}
