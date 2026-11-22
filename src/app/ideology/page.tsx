'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { IDEOLOGY_PILLARS } from '@/data/content';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { 
  IconCheck, 
  IconScale, 
  IconChevronRight, 
  IconChevronLeft 
} from '@/components/Icons';

export default function IdeologyPage() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const heroSection = useReveal();
  const pillarsSection = useReveal();
  const quoteSection = useReveal();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const foundIdx = IDEOLOGY_PILLARS.findIndex(p => p.id === hashId);
      if (foundIdx !== -1) {
        setActiveIndex(foundIdx);
      }
    }
  }, []);

  const currentPillar = IDEOLOGY_PILLARS[activeIndex] || IDEOLOGY_PILLARS[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'திராவிட இயக்கக் கொள்கைப் பிரகடனம்' : 'Our Ideological Doctrine'}
        description={
          language === 'ta'
            ? 'சமூக நீதி, சுயமரியாதை, மாநில சுயாட்சி மற்றும் அரசமைப்பு விழுமியங்களை நீதிமன்றங்களில் நிலைநிறுத்தும் அறநெறி.'
            : 'Defending social justice, affirmative action, state autonomy, and constitutional democracy across Indian jurisprudence.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-16">

        {/* 1. Four Visionary Leaders Banner */}
        <section 
          ref={heroSection.ref}
          className={`fade-rise ${heroSection.revealed ? 'revealed' : ''}`}
        >
          <div className="border-2 border-[#111111] bg-[#111111] text-[#FAF8F5] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              <div className="lg:col-span-7 h-72 sm:h-96 relative bg-[#111111] overflow-hidden">
                <img
                  src="/images/dmk-four-leaders.jpg"
                  alt="தந்தை பெரியார், பேரறிஞர் அண்ணா, முத்தமிழறிஞர் கலைஞர், மாண்புமிகு முதலமைச்சர் மு.க. ஸ்டாலின்"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
                <span className="text-[12px] font-extrabold uppercase tracking-normal text-[#ff8a85] block">
                  {language === 'ta' ? 'அறநெறி வழிகாட்டிகள்' : 'IDEOLOGICAL MENTORS'}
                </span>
                <h2 className="font-kavivanar font-normal text-[clamp(28px,3.5vw,40px)] text-white leading-tight">
                  &ldquo;கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்!&rdquo;
                </h2>
                <p className="text-[17px] text-[#d8cfc2] leading-relaxed">
                  {language === 'ta'
                    ? 'பெரியார், அண்ணா, கலைஞர், மு.க. ஸ்டாலின் ஆகியோரின் வழிகாட்டுதலில் சமூக மாற்றத்திற்கான சட்டப் போராட்டங்களை முன்னெடுப்போம்.'
                    : 'Carrying forward the historic struggle of Periyar, Anna, Kalaignar, and Stalin to establish an egalitarian, self-respecting society governed by the rule of law.'}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 2. Interactive Five Pillars of Dravidian Jurisprudence */}
        <section 
          ref={pillarsSection.ref}
          className={`fade-rise ${pillarsSection.revealed ? 'revealed' : ''}`}
        >
          <div className="space-y-8">
            
            {/* Header */}
            <div className="border-b-2 border-[#111111] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] block">
                  {language === 'ta' ? 'ஐந்து மூலத் தூண்கள்' : 'FIVE CORE PILLARS'}
                </span>
                <h2 className="font-kavivanar font-normal text-[clamp(32px,4vw,48px)] text-[#111111] leading-tight">
                  {language === 'ta' ? 'திராவிடச் சட்டவியலின் மூல விழுமியங்கள்' : 'Pillars of Dravidian Jurisprudence'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#5B5348] font-bold">
                  {activeIndex + 1} / {IDEOLOGY_PILLARS.length}
                </span>
              </div>
            </div>

            {/* Horizontal Pillar Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-2 border-[#111111] divide-x-2 divide-y-2 lg:divide-y-0 divide-[#111111] bg-white">
              {IDEOLOGY_PILLARS.map((pillar, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`p-4 text-left transition-colors cursor-pointer min-h-[72px] flex flex-col justify-between focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24] ${
                      isSelected 
                        ? 'bg-[#111111] text-[#FAF8F5]' 
                        : 'bg-white hover:bg-[#f1ece2] text-[#111111]'
                    }`}
                  >
                    <span className="font-helvetica font-extrabold text-[20px] text-[#C41A1F] block">
                      {pillar.number}
                    </span>
                    <span className="font-bold text-[14px] leading-tight line-clamp-2 mt-1">
                      {pillar.title[language]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Pillar Content Box */}
            <div className="border-2 border-[#111111] bg-[#f1ece2] p-8 sm:p-12 space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b-2 border-[#111111] pb-6">
                <div>
                  <span className="font-helvetica font-extrabold text-[48px] text-[#C41A1F] leading-none block mb-1">
                    {currentPillar.number}
                  </span>
                  <h3 className="font-kavivanar font-normal text-[clamp(28px,3.6vw,44px)] text-[#111111] leading-tight">
                    {currentPillar.title[language]}
                  </h3>
                </div>
                <div className="text-[15px] font-extrabold text-[#5B5348] uppercase">
                  {currentPillar.subtitle[language]}
                </div>
              </div>

              {/* Description */}
              <p className="text-[20px] text-[#111111] leading-relaxed max-w-4xl">
                {currentPillar.description[language]}
              </p>

              {/* Core Quote Box */}
              {currentPillar.quote && (
                <div className="bg-white border-l-6 border-[#E31E24] border-y border-r border-[#111111] p-6 space-y-3">
                  <p className="font-kavivanar font-normal text-[22px] text-[#111111] leading-snug">
                    &ldquo;{currentPillar.quote.text[language]}&rdquo;
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-[#5B5348]">
                    <span className="text-[#C41A1F]">— {currentPillar.quote.author[language]}</span>
                    {currentPillar.quote.context?.[language] && (
                      <>
                        <span>•</span>
                        <span className="italic">{currentPillar.quote.context[language]}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Key Principles Checklist */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-[18px] text-[#111111] uppercase tracking-normal">
                  {language === 'ta' ? 'அடிப்படை கொள்கை அம்சங்கள்:' : 'Key Principles & Mandates:'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentPillar.keyPrinciples.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white border border-[#111111] space-y-2">
                      <div className="flex items-center gap-2">
                        <IconCheck className="w-4 h-4 text-[#C41A1F] shrink-0" />
                        <span className="font-extrabold text-[13px] text-[#C41A1F]">PRINCIPLE {idx + 1}</span>
                      </div>
                      <p className="text-[15px] text-[#111111] leading-snug">
                        {item[language]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between pt-6 border-t-2 border-[#111111]">
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev - 1 + IDEOLOGY_PILLARS.length) % IDEOLOGY_PILLARS.length)}
                  className="min-h-[44px] px-6 py-2 bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[14px] transition-colors cursor-pointer btn-lift inline-flex items-center gap-2"
                >
                  <IconChevronLeft className="w-4 h-4" />
                  <span>{language === 'ta' ? 'முந்தைய கோட்பாடு' : 'Previous Pillar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % IDEOLOGY_PILLARS.length)}
                  className="min-h-[44px] px-6 py-2 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] transition-colors cursor-pointer btn-lift inline-flex items-center gap-2"
                >
                  <span>{language === 'ta' ? 'அடுத்த கோட்பாடு' : 'Next Pillar'}</span>
                  <IconChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 3. Call to Action */}
        <section 
          ref={quoteSection.ref}
          className={`fade-rise ${quoteSection.revealed ? 'revealed' : ''}`}
        >
          <div className="bg-[#111111] text-[#FAF8F5] p-10 sm:p-14 border-2 border-[#111111] flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <h3 className="font-kavivanar font-normal text-[36px] text-white leading-tight">
                {language === 'ta' ? 'சமூக நீதிப் போர்ப்படையில் இணையுங்கள்' : 'Stand for Constitutional Justice'}
              </h3>
              <p className="text-[18px] text-[#d8cfc2]">
                {language === 'ta'
                  ? 'தமிழ்நாட்டின் உரிமைகளையும், எளிய மனிதர்களின் அரசமைப்புப் பாதுகாப்பையும் நிலைநிறுத்த வழக்கறிஞர் அணியில் இணைந்திடுங்கள்.'
                  : 'Join thousands of dedicated advocates defending human dignity, state rights, and egalitarian constitutionalism across Tamil Nadu.'}
              </p>
            </div>

            <Link
              href="/enrol"
              className="min-h-[48px] h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center shrink-0 btn-lift"
            >
              {language === 'ta' ? 'உறுப்பினராகப் பதிவுசெய்க' : 'Enrol as an Advocate'}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
