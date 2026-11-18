'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { IDEOLOGY_PILLARS } from '@/data/content';
import { Quote, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IdeologyPage() {
  const { language } = useLanguage();

  return (
    <div className="w-full flex flex-col space-y-12 py-8 font-dmk-body bg-[#FAF7F2]">
      
      {/* 1. Manifesto Editorial Header (Clean Border, No Shadow Box) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border-b-2 border-neutral-900 pb-6 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-[#E31E24] tracking-[0.2em] uppercase">
              {language === 'ta' ? 'திராவிட இயக்கக் கொள்கைப் பிரகடனம்' : 'DRAVIDIAN JURISPRUDENCE & FOUNDING DOCTRINE'}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-xs font-mono text-neutral-500">MANIFESTO OF EGALITARIAN JUSTICE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-tight mb-4">
            {language === 'ta'
              ? 'நீதிமன்றங்களில் சமூக நீதி: நமது கொள்கை அடித்தளம்'
              : 'The Ideological Pillars of Dravidian Constitutional Jurisprudence'}
          </h1>

          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-serif italic border-l-4 border-[#E31E24] pl-4 py-1 max-w-4xl bg-[#F3EFE6]">
            {language === 'ta'
              ? 'தந்தை பெரியார், பேரறிஞர் அண்ணா, முத்தமிழறிஞர் கலைஞர் வகுத்தளித்த சமூக நீதி, சுயமரியாதை, பகுத்தறிவு மற்றும் மாநில சுயாட்சிக் கொள்கைகளை இந்திய அரசமைப்பின் சட்டப் பாதுகாப்போடு இணைக்கும் வழிகாட்டி நெறிமுறைகள்.'
              : 'Rooted in the century-long struggle of the Dravidian movement. Our jurisprudence synthesizes egalitarian social reform with rigorous constitutional scholarship to defend human dignity, linguistic pride, and federal autonomy.'}
          </p>
        </div>
      </section>

      {/* 2. Grand Ideological Tribute: The Four Visionary Leaders Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border border-neutral-900 bg-[#2A1208] overflow-hidden">
          <div className="relative w-full h-64 sm:h-80 md:h-[400px] overflow-hidden flex items-center justify-center bg-[#2A1208]">
            <img
              src="/images/dmk-four-leaders.jpg"
              alt="கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
              className="w-full h-full object-cover object-center filter saturate-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 text-white">
              <div className="space-y-1.5 max-w-2xl">
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#FFD166] uppercase bg-black/85 px-3 py-1 border border-[#FFD166]/40 inline-block">
                  {language === 'ta' ? 'அடிப்படை வழிகாட்டுதல்' : 'GUIDING PRINCIPLE'}
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-dmk-slogan text-[#FFE8A3] leading-tight">
                  "கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
                </h2>
              </div>
              <span className="text-xs font-dmk-headline text-neutral-200 font-bold bg-black/85 px-3.5 py-1.5 border border-white/20 shrink-0">
                பெரியார் • அண்ணா • கலைஞர் • ஸ்டாலின்
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. In-depth Manifesto Articles (Clean Newspaper Flow, No Boxed Cards) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full space-y-12">
        {IDEOLOGY_PILLARS.map((pillar) => (
          <article
            key={pillar.id}
            id={pillar.id}
            className="scroll-mt-28 pt-8 border-t-2 border-neutral-900"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Number, Title, Overview & Principles */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-300 pb-2">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-[#E31E24]">
                    § {pillar.number}
                  </span>
                  <div className="h-6 w-[2px] bg-neutral-900" />
                  <span className="text-xs font-mono font-bold text-neutral-600 uppercase tracking-wider">
                    {pillar.subtitle[language]}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-snug">
                  {pillar.title[language]}
                </h2>

                <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-dmk-body">
                  {pillar.description[language]}
                </p>

                {/* Key Principles Checklist */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider border-b border-neutral-300 pb-1">
                    {language === 'ta' ? 'அடிப்படை சட்டக் கோட்பாடுகள்:' : 'CORE CONSTITUTIONAL TENETS:'}
                  </h4>
                  <div className="space-y-1.5">
                    {pillar.keyPrinciples.map((kp, kIdx) => (
                      <div key={kIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 p-2 bg-[#F3EFE6] border-l-2 border-[#E31E24]">
                        <CheckCircle2 className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                        <span className="font-dmk-body">{kp[language]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constitutional Benchmark Box */}
                <div className="p-3.5 bg-[#F3EFE6] border-l-4 border-neutral-900 text-xs text-neutral-900">
                  <span className="font-mono font-bold text-[#E31E24] uppercase tracking-wider block mb-1">
                    {language === 'ta' ? 'அரசமைப்பு & தீர்ப்பு முக்கியத்துவம்:' : 'CONSTITUTIONAL BENCHMARK:'}
                  </span>
                  <p className="leading-relaxed font-serif italic">
                    {pillar.legalRelevance[language]}
                  </p>
                </div>
              </div>

              {/* Right Column: Historical Decree Quote */}
              <div className="lg:col-span-5">
                <div className="p-6 bg-[#F3EFE6] border-t-2 border-b-2 border-neutral-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E31E24]">
                      HISTORICAL DECREE
                    </span>
                    <Quote className="w-5 h-5 text-[#E31E24]" />
                  </div>
                  
                  <blockquote className="text-base sm:text-lg font-serif italic text-neutral-900 leading-relaxed font-semibold">
                    “{pillar.quote.text[language]}”
                  </blockquote>

                  <div className="pt-3 border-t border-neutral-300 space-y-1">
                    <span className="text-sm font-bold text-neutral-900 block font-dmk-headline">
                      {pillar.quote.author[language]}
                    </span>
                    <span className="text-xs text-neutral-600 font-mono block">
                      {pillar.quote.context[language]}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </article>
        ))}
      </section>

      {/* 4. Bottom Broadsheet Proclamation Call to Action */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full pt-6">
        <div className="p-6 sm:p-8 bg-[#111111] text-white border-t-4 border-[#E31E24] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#E31E24] uppercase tracking-wider">
              OFFICIAL REPOSITORIES
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-dmk-headline">
              {language === 'ta' ? 'வரலாற்றுத் தீர்ப்புகள் மற்றும் சட்ட ஆவணங்களை வாசிக்க' : 'Access Authoritative Legal Briefs & Dossiers'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-serif italic">
              {language === 'ta'
                ? '69% இடஒதுக்கீடு சட்டம், ராஜமன்னார் குழு அறிக்கை மற்றும் ஆளுநர் அதிகார வரம்புத் தீர்ப்புகள் அடங்கிய களஞ்சியம்.'
                : 'Explore primary texts including the 69% reservation compendium, Rajamannar report, and landmark Supreme Court rulings.'}
            </p>
          </div>

          <Link
            href="/resources"
            className="px-6 py-2.5 bg-[#E31E24] hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-colors border border-white font-dmk-headline"
          >
            {language === 'ta' ? 'சட்ட ஆவணக் களஞ்சியம்' : 'Explore Legal Resources'}
          </Link>
        </div>
      </section>

    </div>
  );
}
