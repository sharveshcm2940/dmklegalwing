'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { IDEOLOGY_PILLARS } from '@/data/content';
import { PageTitleBand } from '@/components/PageTitleBand';

export default function IdeologyPage() {
  const { language } = useLanguage();

  // Section 1: Doctrine accordion (Row 01 open on load)
  const [openIndex, setOpenIndex] = useState<number>(0);

  // Section 2: Interactive Slide Engine (Fade 0.4s, Arrow keys, No auto-play)
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slideFade, setSlideFade] = useState<boolean>(true);

  const totalSlides = IDEOLOGY_PILLARS.length;

  const goToSlide = useCallback((nextIndex: number) => {
    setSlideFade(false);
    setTimeout(() => {
      setCurrentSlide(nextIndex);
      setSlideFade(true);
    }, 200);
  }, []);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }, [currentSlide, totalSlides, goToSlide]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, [currentSlide, totalSlides, goToSlide]);

  // Arrow key navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  const activeSlidePillar = IDEOLOGY_PILLARS[currentSlide] || IDEOLOGY_PILLARS[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65]">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'கொள்கைகள்' : 'Ideological foundations'}
        description={
          language === 'ta'
            ? 'சமூக நீதி, சுயமரியாதை, மாநில சுயாட்சி மற்றும் அரசமைப்பு விழுமியங்களை நீதிமன்றங்களில் நிலைநிறுத்தும் அறநெறி.'
            : 'Defending social justice, affirmative action, state autonomy, and constitutional democracy across Indian jurisprudence.'
        }
      />

      {/* 1. Doctrine list: six large ruled rows */}
      <section className="bg-[#FAF8F5] py-16 md:py-24 border-b border-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          <div className="mb-12 border-b-2 border-[#111111] pb-6">
            <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] block">
              {language === 'ta' ? 'அணியின் ஆறு முதன்மைக் கோட்பாடுகள்' : 'SIX CORE DOCTRINES'}
            </span>
            <h2 className="font-kavivanar font-normal text-[clamp(32px,4vw,48px)] text-[#111111] leading-tight mt-1">
              {language === 'ta' ? 'திராவிடச் சட்டவியலின் மூல விழுமியங்கள்' : 'Foundations of Dravidian Jurisprudence'}
            </h2>
            <p className="text-[17px] text-[#5B5348] mt-2">
              {language === 'ta'
                ? 'அரசமைப்புச் சட்டத்தில் உறுதி செய்யப்பட்டுள்ள உரிமைகளைப் பாதுகாக்கும் ஆறு அடிப்படைத் தூண்கள்.'
                : 'Click any doctrine to inspect its constitutional mandate, historical precedent, and philosophical anchor.'}
            </p>
          </div>

          {/* Six ruled rows */}
          <div className="border-t border-[#111111] divide-y divide-[#111111]">
            {IDEOLOGY_PILLARS.map((pillar, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={pillar.id}
                  className={`transition-colors duration-300 ${
                    isOpen ? 'bg-[#111111] text-[#FAF8F5]' : 'bg-[#FAF8F5] text-[#111111] hover:bg-[#f1ece2]'
                  }`}
                >
                  {/* Clickable Row Header Button */}
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-6 md:p-8 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Left: Number and Title/Summary */}
                      <div className="flex items-start md:items-center gap-6 md:gap-10">
                        {/* Number: Helvetica Now Display 800, 96px, red */}
                        <span className="font-helvetica font-extrabold text-[72px] md:text-[96px] text-[#E31E24] leading-none shrink-0 w-[110px] md:w-[140px]">
                          {pillar.number}
                        </span>

                        {/* Title and one-line summary */}
                        <div className="space-y-1">
                          {language === 'ta' ? (
                            <h3 className={`font-kavivanar font-normal text-[clamp(26px,3.2vw,36px)] leading-tight ${
                              isOpen ? 'text-[#FAF8F5]' : 'text-[#111111]'
                            }`}>
                              {pillar.title.ta}
                            </h3>
                          ) : (
                            <h3 className={`font-helvetica font-extrabold text-[26px] md:text-[36px] leading-tight ${
                              isOpen ? 'text-[#FAF8F5]' : 'text-[#111111]'
                            }`}>
                              {pillar.title.en}
                            </h3>
                          )}

                          <p className={`text-[17px] leading-snug line-clamp-1 ${
                            isOpen ? 'text-[#d8cfc2]' : 'text-[#5B5348]'
                          }`}>
                            {pillar.subtitle[language]}
                          </p>
                        </div>
                      </div>

                      {/* Right Indicator (+ / -) */}
                      <div className="shrink-0 self-end md:self-center">
                        <span className={`w-10 h-10 border-2 flex items-center justify-center font-helvetica font-extrabold text-[20px] transition-colors ${
                          isOpen 
                            ? 'border-[#FAF8F5] text-[#FAF8F5] bg-[#1a1a1a]' 
                            : 'border-[#111111] text-[#111111] bg-white'
                        }`}>
                          {isOpen ? '—' : '+'}
                        </span>
                      </div>

                    </div>
                  </button>

                  {/* Expanded Content: Animates height in 0.4s */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-400 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-8 md:px-8 md:pb-10 pt-2 border-t border-[#3d3633] space-y-6">
                        
                        {/* Full Description Text */}
                        <p className="text-[19px] text-[#FAF8F5] leading-relaxed max-w-4xl">
                          {pillar.description[language]}
                        </p>

                        {/* Quote Box */}
                        {pillar.quote && (
                          <div className="bg-[#1a1a1a] border-l-4 border-[#E31E24] border-y border-r border-[#3d3633] p-6 space-y-3 max-w-4xl">
                            <p className="font-kavivanar font-normal text-[22px] text-[#FAF8F5] leading-snug">
                              &ldquo;{pillar.quote.text[language]}&rdquo;
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-[#d8cfc2]">
                              <span className="text-[#ff8a85]">— {pillar.quote.author[language]}</span>
                              {pillar.quote.context?.[language] && (
                                <>
                                  <span>•</span>
                                  <span className="italic text-[#9e948a]">{pillar.quote.context[language]}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Key Principles Checklist */}
                        <div className="space-y-3 max-w-4xl pt-2">
                          <h4 className="font-extrabold text-[15px] uppercase tracking-normal text-[#ff8a85]">
                            {language === 'ta' ? 'அடிப்படை கொள்கை அம்சங்கள்:' : 'Key Principles & Mandates:'}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {pillar.keyPrinciples.map((item, pIdx) => (
                              <div key={pIdx} className="p-4 bg-[#1a1a1a] border border-[#3d3633] space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 bg-[#E31E24] shrink-0" />
                                  <span className="font-extrabold text-[12px] text-[#ff8a85] uppercase">
                                    PRINCIPLE {pIdx + 1}
                                  </span>
                                </div>
                                <p className="text-[15px] text-[#d8cfc2] leading-snug">
                                  {item[language]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Legal Relevance */}
                        {pillar.legalRelevance && (
                          <div className="p-4 bg-[#1a1a1a] border-l-4 border-[#ff8a85] text-[15px] text-[#d8cfc2] max-w-4xl">
                            <span className="font-bold text-[#FAF8F5] mr-2">
                              {language === 'ta' ? 'அரசமைப்புச் சாதனை:' : 'Constitutional Precedent:'}
                            </span>
                            {pillar.legalRelevance[language]}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. Slides: Full-width ink panel */}
      <section className="bg-[#111111] text-[#FAF8F5] relative overflow-hidden py-20 md:py-28 px-[clamp(20px,4vw,56px)] border-b border-[#111111]">
        <div className="max-w-[1280px] mx-auto relative">
          
          {/* Header row inside ink panel */}
          <div className="flex items-center justify-between border-b border-[#3d3633] pb-6 mb-12">
            <div>
              <span className="text-[12px] font-extrabold uppercase tracking-normal text-[#ff8a85] block">
                {language === 'ta' ? 'கொள்கைப் பிரகடனம் • ஸ்லைடு தொகுப்பு' : 'INTERACTIVE DOCTRINE ENGINE'}
              </span>
              <span className="text-[14px] text-[#9e948a] mt-1 block">
                {language === 'ta' ? 'விசைப்பலகை அம்புக்குறிகளைப் பயன்படுத்தலாம் (← / →)' : 'Use keyboard arrow keys (← / →) to navigate'}
              </span>
            </div>

            {/* Slide number: Helvetica Now Display */}
            <div className="font-helvetica font-extrabold text-[28px] md:text-[34px] text-[#E31E24]">
              {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </div>
          </div>

          {/* Slide Content: 0.4s fade transition */}
          <div
            className={`min-h-[320px] flex flex-col justify-between transition-opacity duration-200 ease-in-out ${
              slideFade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="space-y-6">
              {/* Slide Title in Kavivanar 48px */}
              <h3 className="font-kavivanar font-normal text-[clamp(32px,4vw,48px)] text-[#FAF8F5] leading-tight">
                {activeSlidePillar.title[language]}
              </h3>

              {/* Slide Text at 20px */}
              <p className="text-[20px] text-[#d8cfc2] leading-relaxed max-w-4xl">
                {activeSlidePillar.description[language]}
              </p>

              {/* Quote highlight if available */}
              {activeSlidePillar.quote && (
                <div className="p-6 bg-[#1a1a1a] border-l-4 border-[#E31E24] max-w-4xl">
                  <p className="font-kavivanar font-normal text-[20px] text-[#FAF8F5] leading-snug">
                    &ldquo;{activeSlidePillar.quote.text[language]}&rdquo;
                  </p>
                  <p className="text-[14px] text-[#ff8a85] font-bold mt-2">
                    — {activeSlidePillar.quote.author[language]}
                  </p>
                </div>
              )}
            </div>

            {/* Square Previous and Next Buttons */}
            <div className="flex items-center gap-4 pt-10">
              <button
                type="button"
                onClick={prevSlide}
                aria-label={language === 'ta' ? 'முந்தைய ஸ்லைடு' : 'Previous Slide'}
                className="w-12 h-12 min-h-[44px] bg-[#111111] border-2 border-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#111111] text-[#FAF8F5] flex items-center justify-center font-helvetica font-extrabold text-[18px] cursor-pointer btn-lift transition-colors"
              >
                <span aria-hidden="true">&larr;</span>
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label={language === 'ta' ? 'அடுத்த ஸ்லைடு' : 'Next Slide'}
                className="w-12 h-12 min-h-[44px] bg-[#E31E24] border-2 border-[#E31E24] hover:bg-[#C41A1F] text-white flex items-center justify-center font-helvetica font-extrabold text-[18px] cursor-pointer btn-lift transition-colors"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>

              <span className="font-helvetica font-extrabold text-[17px] text-[#d8cfc2] ml-2">
                {language === 'ta' ? 'கோட்பாடு' : 'Doctrine'} {activeSlidePillar.number}: {activeSlidePillar.subtitle[language]}
              </span>
            </div>

          </div>

        </div>

        {/* 4px red progress bar along the bottom that fills to show the position */}
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#3d3633]">
          <div
            className="h-full bg-[#E31E24] transition-all duration-400 ease-out"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </section>

      {/* 3. Treaty or document block: Parchment block with 4px ink top rule */}
      <section className="bg-[#FAF8F5] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          <div className="bg-[#f1ece2] border-t-4 border-[#111111] border-x border-b border-[#d7d0c3] p-8 md:p-14">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              <div className="max-w-3xl space-y-4">
                <span className="font-helvetica font-extrabold text-[12px] uppercase tracking-normal text-[#C41A1F] block">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ கொள்கை ஆவணம்' : 'OFFICIAL TREATY & DECLARATION'}
                </span>

                <h3 className="font-kavivanar font-normal text-[clamp(28px,3.5vw,40px)] text-[#111111] leading-tight">
                  {language === 'ta'
                    ? 'திராவிடச் சட்டவியல் பிரகடனம் & கொள்கை உடன்படிக்கை'
                    : 'The Treaty of Dravidian Jurisprudence & Constitutional Declaration'}
                </h3>

                <p className="text-[18px] text-[#3a322d] leading-relaxed">
                  {language === 'ta'
                    ? 'தமிழ்நாட்டின் 69% இடஒதுக்கீடு பாதுகாப்பு, மாநில சுயாட்சி அதிகாரங்கள், அரசமைப்பு உறுப்பு 348(2)-ன் கீழ் உயர் நீதிமன்றத்தில் தாய்மொழி உரிமை, மற்றும் கூட்டாட்சித் தத்துவங்களை ஒருங்கிணைக்கும் அதிகாரப்பூர்வ கொள்கை ஆவணம். உச்ச நீதிமன்ற அரசமைப்பு அமர்வுகளில் முன்வைக்கப்பட்ட வரலாற்று வாதங்கள் மற்றும் கொள்கைக் கோட்பாடுகளின் முழுமையான தொகுப்பு.'
                    : 'The definitive manifesto codifying the constitutional foundations of the Dravidian movement: defending affirmative action, state autonomy, Article 348(2) mother-tongue rights, and secular egalitarian democracy across Indian courts of record.'}
                </p>
              </div>

              {/* Download link as a red rectangular button */}
              <Link
                href="/resources#res-69-reservation"
                className="min-h-[48px] h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center shrink-0 btn-lift uppercase tracking-normal"
              >
                {language === 'ta' ? 'பிரகடன ஆவணத்தைப் பதிவிறக்குக (PDF)' : 'Download Treaty Manifesto (PDF)'}
              </Link>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
