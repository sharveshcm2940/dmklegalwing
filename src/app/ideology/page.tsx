'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { IDEOLOGY_PILLARS } from '@/data/content';
import { PageTitleBand } from '@/components/PageTitleBand';

export default function IdeologyPage() {
  const { language } = useLanguage();

  // Desktop tab selection (Doctrine 01 selected on load)
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [displayedIndex, setDisplayedIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  // Mobile accordion state (Doctrine 01 open on load, one open at a time)
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number>(0);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Cross-fade reading pane over 0.25 s
  const changeDoctrine = (nextIdx: number) => {
    if (nextIdx === selectedIndex && nextIdx === displayedIndex) return;
    setSelectedIndex(nextIdx);
    setIsFading(true);
  };

  useEffect(() => {
    if (!isFading) return;
    const timer = setTimeout(() => {
      setDisplayedIndex(selectedIndex);
      setIsFading(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [isFading, selectedIndex]);

  // Keyboard navigation for desktop doctrine list: Up and Down arrow keys move selection
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let targetIndex = currentIndex;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % IDEOLOGY_PILLARS.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + IDEOLOGY_PILLARS.length) % IDEOLOGY_PILLARS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = IDEOLOGY_PILLARS.length - 1;
    }

    if (targetIndex !== currentIndex) {
      changeDoctrine(targetIndex);
      buttonRefs.current[targetIndex]?.focus();
    }
  };

  const activePillar = IDEOLOGY_PILLARS[displayedIndex] || IDEOLOGY_PILLARS[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[18px] leading-[1.75]">
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'கொள்கைகள்' : 'Ideological foundations'}
        description={
          language === 'ta'
            ? 'சமூக நீதி, சுயமரியாதை, மாநில சுயாட்சி மற்றும் அரசமைப்பு விழுமியங்களை நீதிமன்றங்களில் நிலைநிறுத்தும் அறநெறி.'
            : 'Defending social justice, affirmative action, state autonomy, and constitutional democracy across Indian jurisprudence.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] py-16 md:py-24">
        {/* Progress & Kicker Bar */}
        <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-4 mb-8 text-[14px]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold uppercase text-[#C41A1F]">
              {language === 'ta' ? 'அணியின் ஆறு முதன்மைக் கோட்பாடுகள்' : 'SIX CORE DOCTRINES'}
            </span>
            <span className="text-[#d7d0c3]">/</span>
            <span className="text-[#5B5348] font-bold">
              {language === 'ta' ? `கோட்பாடு ${activePillar.number} / 06` : `Doctrine ${activePillar.number} of 06`}
            </span>
          </div>
          <span className="text-[#5B5348] hidden sm:inline text-[13px]">
            {language === 'ta' ? 'விசைப்பலகை அம்புக்குறிகளைப் பயன்படுத்தலாம் (↑ / ↓)' : 'Use keyboard arrow keys (↑ / ↓) to navigate'}
          </span>
        </div>

        {/* DESKTOP LAYOUT (md and up): Index (36%) + Reading Pane (64%) */}
        <div className="hidden md:flex items-start gap-8 lg:gap-12">
          {/* Left Column: ~36% wide Table of Contents */}
          <nav
            role="tablist"
            aria-orientation="vertical"
            aria-label={language === 'ta' ? 'கொள்கைகள் பட்டியல்' : 'Doctrines index'}
            className="w-[36%] shrink-0 border-t border-[#d7d0c3]"
          >
            {IDEOLOGY_PILLARS.map((pillar, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={pillar.id}
                  ref={(el) => {
                    buttonRefs.current[idx] = el;
                  }}
                  role="tab"
                  id={`doctrine-tab-${idx}`}
                  aria-selected={isSelected}
                  aria-controls={`doctrine-pane-${idx}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => changeDoctrine(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`w-full min-h-[58px] px-5 flex items-center justify-between text-left border-b border-[#d7d0c3] transition-all duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E31E24] ${
                    isSelected
                      ? 'border-l-4 border-l-[#E31E24] text-[#111111] font-bold bg-white'
                      : 'border-l-4 border-l-transparent text-[#5B5348] font-normal hover:text-[#111111] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-4 truncate">
                    <span className="font-manrope font-extrabold text-[18px] text-[#C41A1F] shrink-0 w-7">
                      {pillar.number}
                    </span>
                    <span
                      className={`truncate text-[17px] leading-snug ${
                        language === 'ta' ? 'font-kavivanar font-normal' : 'font-manrope font-bold'
                      } ${isSelected ? 'text-[#111111]' : ''}`}
                    >
                      {pillar.title[language]}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-[#E31E24] font-bold text-[18px] ml-2 shrink-0">
                      →
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Column: ~64% wide White Reading Pane */}
          <section
            role="tabpanel"
            id={`doctrine-pane-${displayedIndex}`}
            aria-labelledby={`doctrine-tab-${displayedIndex}`}
            className="w-[64%] flex-1 bg-white border border-[#111111] p-10 lg:p-14 min-h-[520px] flex flex-col justify-between"
          >
            <div
              className={`space-y-6 transition-opacity duration-200 motion-reduce:transition-none ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Number and Subtitle */}
              <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-3">
                <span className="font-manrope font-extrabold text-[22px] text-[#C41A1F] leading-none">
                  DOCTRINE {activePillar.number}
                </span>
                <span className="text-[13px] font-bold text-[#5B5348] uppercase">
                  {activePillar.subtitle[language]}
                </span>
              </div>

              {/* Title: Kavivanar 56 px (Tamil) or Helvetica Now Display 800 48 px (English) */}
              {language === 'ta' ? (
                <h2 className="font-kavivanar font-normal text-[56px] text-[#111111] leading-[1.12]">
                  {activePillar.title.ta}
                </h2>
              ) : (
                <h2 className="font-manrope font-extrabold text-[48px] text-[#111111] leading-[1.12]">
                  {activePillar.title.en}
                </h2>
              )}

              {/* Full Description text at 20 px */}
              <p className="font-catamaran text-[20px] text-[#111111] leading-[1.75] max-w-[680px]">
                {activePillar.description[language]}
              </p>

              {/* Quoted passage with 4 px ink top rule */}
              {activePillar.quote && (
                <div className="border-t-4 border-[#111111] pt-4 mt-6 space-y-2 bg-[#FAF8F5] p-5 border border-[#d7d0c3]">
                  <p className="font-kavivanar text-[22px] text-[#111111] leading-snug italic">
                    &ldquo;{activePillar.quote.text[language]}&rdquo;
                  </p>
                  <p className="text-[14px] text-[#C41A1F] font-bold">
                    — {activePillar.quote.author[language]}
                    {activePillar.quote.context?.[language] && (
                      <span className="text-[#5B5348] font-normal ml-2">
                        ({activePillar.quote.context[language]})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Key Principles Pills */}
              {activePillar.keyPrinciples && activePillar.keyPrinciples.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    {language === 'ta' ? 'முக்கிய சட்டக் கொள்கைகள்:' : 'KEY CONSTITUTIONAL MANDATES:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activePillar.keyPrinciples.map((item, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-3 py-1 bg-[#f1ece2] text-[#111111] text-[14px] font-semibold border border-[#d7d0c3]"
                      >
                        {item[language]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal reference sitting under text as a small grey line */}
              {activePillar.legalRelevance?.[language] && (
                <div className="border-t border-[#d7d0c3] pt-4 mt-4">
                  <p className="text-[15px] text-[#5B5348] leading-relaxed">
                    <span className="font-bold text-[#111111]">
                      {language === 'ta' ? 'நீதிமன்றங்களில்: ' : 'In the courts: '}
                    </span>
                    {activePillar.legalRelevance[language]}
                  </p>
                </div>
              )}
            </div>

            {/* Reading Navigation Footer inside reading pane */}
            <div className="pt-8 mt-8 border-t border-[#d7d0c3] flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeDoctrine((displayedIndex - 1 + IDEOLOGY_PILLARS.length) % IDEOLOGY_PILLARS.length)}
                className="text-[14px] font-bold text-[#5B5348] hover:text-[#111111] cursor-pointer"
              >
                &larr; {language === 'ta' ? 'முந்தைய கோட்பாடு' : 'Previous Doctrine'}
              </button>

              <button
                type="button"
                onClick={() => changeDoctrine((displayedIndex + 1) % IDEOLOGY_PILLARS.length)}
                className="text-[14px] font-bold text-[#C41A1F] hover:text-[#111111] cursor-pointer"
              >
                {language === 'ta' ? 'அடுத்த கோட்பாடு' : 'Next Doctrine'} &rarr;
              </button>
            </div>
          </section>
        </div>

        {/* MOBILE LAYOUT (< md): Accordion list */}
        <div className="block md:hidden border-t border-[#d7d0c3]">
          {IDEOLOGY_PILLARS.map((pillar, idx) => {
            const isOpen = mobileOpenIndex === idx;

            return (
              <div key={pillar.id} className="border-b border-[#d7d0c3]">
                <button
                  type="button"
                  onClick={() => setMobileOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`mobile-doctrine-${idx}`}
                  className={`w-full min-h-[58px] py-4 px-4 flex items-center justify-between text-left cursor-pointer transition-colors duration-150 ${
                    isOpen
                      ? 'border-l-4 border-l-[#E31E24] text-[#111111] font-bold bg-white'
                      : 'border-l-4 border-l-transparent text-[#5B5348] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-manrope font-extrabold text-[18px] text-[#C41A1F] shrink-0">
                      {pillar.number}
                    </span>
                    <span
                      className={`text-[17px] leading-snug ${
                        language === 'ta' ? 'font-kavivanar font-normal' : 'font-manrope font-bold'
                      }`}
                    >
                      {pillar.title[language]}
                    </span>
                  </div>
                  <span className="font-manrope font-extrabold text-[18px] text-[#5B5348] shrink-0 ml-2">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`mobile-doctrine-${idx}`}
                    className="bg-white border-t border-[#111111] p-6 space-y-4"
                  >
                    <div className="font-manrope font-extrabold text-[18px] text-[#C41A1F] leading-none">
                      DOCTRINE {pillar.number}
                    </div>

                    {language === 'ta' ? (
                      <h3 className="font-kavivanar font-normal text-[32px] text-[#111111] leading-tight">
                        {pillar.title.ta}
                      </h3>
                    ) : (
                      <h3 className="font-manrope font-extrabold text-[28px] text-[#111111] leading-tight">
                        {pillar.title.en}
                      </h3>
                    )}

                    <div className="w-full h-px bg-[#d7d0c3]" />

                    <p className="font-catamaran text-[18px] text-[#111111] leading-[1.75]">
                      {pillar.description[language]}
                    </p>

                    {pillar.quote && (
                      <div className="border-t-2 border-[#111111] pt-3 bg-[#FAF8F5] p-4 text-[15px]">
                        <p className="font-kavivanar italic text-[#111111]">&ldquo;{pillar.quote.text[language]}&rdquo;</p>
                        <p className="text-[#C41A1F] font-bold mt-1">— {pillar.quote.author[language]}</p>
                      </div>
                    )}

                    {pillar.legalRelevance?.[language] && (
                      <p className="text-[14px] text-[#5B5348] leading-relaxed pt-2 border-t border-[#d7d0c3]">
                        <span className="font-bold text-[#111111]">
                          {language === 'ta' ? 'நீதிமன்றங்களில்: ' : 'In the courts: '}
                        </span>
                        {pillar.legalRelevance[language]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* TREATY BLOCK: Plain 1 px ink-bordered box with existing text and red download button */}
        <section className="border border-[#111111] bg-white p-8 md:p-12 mt-16 md:mt-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[5px] dmk-flag-strip" aria-hidden="true" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src="/images/dmk-official-logo.png"
                  alt="DMK Official Emblem"
                  className="h-14 w-auto object-contain"
                />
                <span className="font-manrope font-extrabold text-[12px] uppercase tracking-normal text-[#C41A1F] block">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ கொள்கை ஆவணம்' : 'OFFICIAL TREATY & DECLARATION'}
                </span>
              </div>

              <h3 className="font-kavivanar font-normal text-[clamp(26px,3.2vw,36px)] text-[#111111] leading-tight">
                {language === 'ta'
                  ? 'திராவிடச் சட்டவியல் பிரகடனம் & கொள்கை உடன்படிக்கை'
                  : 'The Treaty of Dravidian Jurisprudence & Constitutional Declaration'}
              </h3>

              <p className="font-catamaran text-[18px] text-[#5B5348] leading-[1.75]">
                {language === 'ta'
                  ? 'தமிழ்நாட்டின் 69% இடஒதுக்கீடு பாதுகாப்பு, மாநில சுயாட்சி அதிகாரங்கள், அரசமைப்பு உறுப்பு 348(2)-ன் கீழ் உயர் நீதிமன்றத்தில் தாய்மொழி உரிமை, மற்றும் கூட்டாட்சித் தத்துவங்களை ஒருங்கிணைக்கும் அதிகாரப்பூர்வ கொள்கை ஆவணம். உச்ச நீதிமன்ற அரசமைப்பு அமர்வுகளில் முன்வைக்கப்பட்ட வரலாற்று வாதங்கள் மற்றும் கொள்கைக் கோட்பாடுகளின் முழுமையான தொகுப்பு.'
                  : 'The definitive manifesto codifying the constitutional foundations of the Dravidian movement: defending affirmative action, state autonomy, Article 348(2) mother-tongue rights, and secular egalitarian democracy across Indian courts of record.'}
              </p>

              <div className="flex items-center gap-4 text-[13px] font-bold text-[#111111] pt-1">
                <span className="px-2.5 py-0.5 bg-[#FAF8F5] border border-[#d7d0c3]">PDF MANIFESTO</span>
                <span className="text-[#5B5348]">12 PAGES</span>
                <span className="text-[#5B5348]">·</span>
                <span className="text-[#5B5348]">2.4 MB</span>
              </div>
            </div>

            {/* Red rectangular Download button */}
            <Link
              href="/resources#res-69-reservation"
              className="min-h-[48px] h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-manrope font-extrabold text-[15px] inline-flex items-center justify-center shrink-0 uppercase tracking-normal transition-colors duration-150 btn-lift"
            >
              {language === 'ta' ? 'பிரகடன ஆவணத்தைப் பதிவிறக்குக (PDF)' : 'Download Treaty Manifesto (PDF)'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
