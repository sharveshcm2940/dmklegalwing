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

  // Cross-fade reading pane over 0.3 s (150ms fade-out, 150ms fade-in)
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
    }, 150);
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
                  className={`w-full h-[56px] min-h-[56px] px-4 flex items-center gap-4 text-left border-b border-[#d7d0c3] transition-colors duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E31E24] ${
                    isSelected
                      ? 'border-l-4 border-l-[#E31E24] text-[#111111] font-bold bg-[#FAF8F5]'
                      : 'border-l-4 border-l-transparent text-[#5B5348] font-normal hover:text-[#111111]'
                  }`}
                >
                  <span className="font-helvetica font-extrabold text-[18px] text-[#5B5348] shrink-0 w-7">
                    {pillar.number}
                  </span>
                  <span
                    className={`truncate text-[17px] leading-snug ${
                      language === 'ta' ? 'font-kavivanar font-normal' : 'font-helvetica'
                    } ${isSelected ? 'text-[#111111]' : ''}`}
                  >
                    {pillar.title[language]}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Column: ~64% wide White Reading Pane */}
          <section
            role="tabpanel"
            id={`doctrine-pane-${displayedIndex}`}
            aria-labelledby={`doctrine-tab-${displayedIndex}`}
            className="w-[64%] flex-1 bg-white border border-[#111111] p-12 min-h-[460px]"
          >
            <div
              className={`transition-opacity duration-300 motion-reduce:transition-none ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Number in red (20 px) */}
              <div className="font-helvetica font-extrabold text-[20px] text-[#C41A1F] leading-none mb-3">
                {activePillar.number}
              </div>

              {/* Title: Kavivanar 56 px (Tamil) or Helvetica Now Display 800 48 px (English) */}
              {language === 'ta' ? (
                <h2 className="font-kavivanar font-normal text-[56px] text-[#111111] leading-[1.12] mb-6">
                  {activePillar.title.ta}
                </h2>
              ) : (
                <h2 className="font-helvetica font-extrabold text-[48px] text-[#111111] leading-[1.12] mb-6">
                  {activePillar.title.en}
                </h2>
              )}

              {/* Thin 1 px rule */}
              <div className="w-full h-px bg-[#d7d0c3] mb-6" />

              {/* Full text at 20 px, max 640 px wide */}
              <p className="font-catamaran text-[20px] text-[#111111] leading-[1.75] max-w-[640px] mb-6">
                {activePillar.description[language]}
              </p>

              {/* Legal reference sitting under text as a small grey line */}
              {activePillar.legalRelevance?.[language] && (
                <p className="text-[15px] text-[#5B5348] max-w-[640px] leading-relaxed">
                  <span className="font-bold text-[#5B5348]">
                    {language === 'ta' ? 'நீதிமன்றங்களில்: ' : 'In the courts: '}
                  </span>
                  {activePillar.legalRelevance[language]}
                </p>
              )}
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
                  className={`w-full min-h-[56px] py-4 px-4 flex items-center justify-between text-left cursor-pointer transition-colors duration-150 ${
                    isOpen
                      ? 'border-l-4 border-l-[#E31E24] text-[#111111] font-bold bg-[#FAF8F5]'
                      : 'border-l-4 border-l-transparent text-[#5B5348] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-helvetica font-extrabold text-[18px] text-[#5B5348] shrink-0">
                      {pillar.number}
                    </span>
                    <span
                      className={`text-[17px] leading-snug ${
                        language === 'ta' ? 'font-kavivanar font-normal' : 'font-helvetica'
                      }`}
                    >
                      {pillar.title[language]}
                    </span>
                  </div>
                  <span className="font-helvetica font-extrabold text-[16px] text-[#5B5348] shrink-0 ml-2">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`mobile-doctrine-${idx}`}
                    className="bg-white border-t border-[#111111] p-6 space-y-4"
                  >
                    {/* Number in red 20 px */}
                    <div className="font-helvetica font-extrabold text-[20px] text-[#C41A1F] leading-none">
                      {pillar.number}
                    </div>

                    {/* Title */}
                    {language === 'ta' ? (
                      <h2 className="font-kavivanar font-normal text-[36px] text-[#111111] leading-tight">
                        {pillar.title.ta}
                      </h2>
                    ) : (
                      <h2 className="font-helvetica font-extrabold text-[32px] text-[#111111] leading-tight">
                        {pillar.title.en}
                      </h2>
                    )}

                    {/* Thin 1 px rule */}
                    <div className="w-full h-px bg-[#d7d0c3]" />

                    {/* Full text at 20 px */}
                    <p className="font-catamaran text-[20px] text-[#111111] leading-[1.75]">
                      {pillar.description[language]}
                    </p>

                    {/* Legal reference */}
                    {pillar.legalRelevance?.[language] && (
                      <p className="text-[15px] text-[#5B5348] leading-relaxed pt-2">
                        <span className="font-bold text-[#5B5348]">
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
        <section className="border border-[#111111] bg-white p-8 md:p-12 mt-16 md:mt-24">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <span className="font-helvetica font-extrabold text-[12px] uppercase tracking-normal text-[#C41A1F] block">
                {language === 'ta' ? 'அதிகாரப்பூர்வ கொள்கை ஆவணம்' : 'OFFICIAL TREATY & DECLARATION'}
              </span>

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
            </div>

            {/* Red rectangular Download button */}
            <Link
              href="/resources#res-69-reservation"
              className="min-h-[48px] h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center shrink-0 uppercase tracking-normal transition-colors duration-150"
            >
              {language === 'ta' ? 'பிரகடன ஆவணத்தைப் பதிவிறக்குக (PDF)' : 'Download Treaty Manifesto (PDF)'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
