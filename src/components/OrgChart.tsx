'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { OFFICIAL_HIERARCHY_CHART } from '@/data/content';
import { FlowchartOfficer } from '@/types';

export const OrgChart: React.FC = () => {
  const { language } = useLanguage();
  const [selectedOfficer, setSelectedOfficer] = useState<FlowchartOfficer | null>(null);

  // Line drawing animation trigger on scroll into view
  const chartRef = useRef<HTMLDivElement>(null);
  const [linesDrawn, setLinesDrawn] = useState(false);

  // Accessibility / Focus management
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { president, secretary, jointSecretaries, deputySecretaries, headOfficeAdvocates } = OFFICIAL_HIERARCHY_CHART;

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLinesDrawn(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleOpenOfficer = (
    officer: FlowchartOfficer,
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    lastTriggerRef.current = e.currentTarget as HTMLElement;
    setSelectedOfficer(officer);
  };

  const handleCloseModal = () => {
    setSelectedOfficer(null);
    setTimeout(() => {
      lastTriggerRef.current?.focus();
    }, 10);
  };

  // Keyboard navigation for modal (Escape key) and initial focus
  useEffect(() => {
    if (!selectedOfficer) return;

    // Focus close button inside modal
    setTimeout(() => {
      modalCloseButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOfficer]);

  return (
    <div ref={chartRef} className="w-full text-[#111111] font-catamaran">
      
      {/* Flowchart container */}
      <div className="w-full space-y-4">

        {/* ========================================================== */}
        {/* TIER 1: PRESIDENT                                          */}
        {/* ========================================================== */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={(e) => handleOpenOfficer(president, e)}
            className="w-full max-w-md bg-white border-2 border-[#111111] p-6 text-center cursor-pointer relative group btn-lift focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
          >
            {/* 6px red top bar */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#E31E24]" />

            <span className="font-extrabold text-[13px] md:text-[14px] text-[#C41A1F] uppercase tracking-normal block mb-1">
              {language === 'ta' ? 'தலைவர்' : 'President'}
            </span>
            <h3 className="font-manrope font-extrabold text-[24px] md:text-[28px] text-[#111111] leading-tight group-hover:text-[#E31E24] transition-colors">
              {president.name[language]}
            </h3>
            <p className="text-[14px] text-[#5B5348] mt-1">
              {president.role[language]} • <span className="font-bold text-[#111111]">{president.district[language]}</span>
            </p>
          </button>
        </div>

        {/* 2px ink line joining President to Secretary (Stroke animation 0.8s) */}
        <div className="flex justify-center my-0 select-none">
          <svg width="2" height="40" className="overflow-visible" aria-hidden="true">
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="40"
              stroke="#111111"
              strokeWidth="2"
              strokeDasharray="40"
              strokeDashoffset={linesDrawn ? 0 : 40}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
        </div>

        {/* ========================================================== */}
        {/* TIER 2: SECRETARY                                          */}
        {/* ========================================================== */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={(e) => handleOpenOfficer(secretary, e)}
            className="w-full max-w-md bg-white border-2 border-[#111111] p-6 text-center cursor-pointer relative group btn-lift focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
          >
            {/* 6px ink top bar */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#111111]" />

            <span className="font-extrabold text-[13px] md:text-[14px] text-[#111111] uppercase tracking-normal block mb-1">
              {language === 'ta' ? 'செயலாளர்' : 'Secretary'}
            </span>
            <h3 className="font-manrope font-extrabold text-[24px] md:text-[28px] text-[#111111] leading-tight group-hover:text-[#E31E24] transition-colors">
              {secretary.name[language]}
            </h3>
            <p className="text-[14px] text-[#5B5348] mt-1">
              {secretary.role[language]} • <span className="font-bold text-[#111111]">{secretary.district[language]}</span>
            </p>
          </button>
        </div>

        {/* ========================================================== */}
        {/* CONNECTING LINES FROM SECRETARY TO THREE COLUMNS           */}
        {/* ========================================================== */}
        
        {/* Desktop Line Drawing: Spans across 3 columns (0.8s stroke animation) */}
        <div className="hidden lg:block w-full max-w-6xl mx-auto my-0 select-none">
          <svg viewBox="0 0 1000 50" preserveAspectRatio="none" className="w-full h-12 overflow-visible" aria-hidden="true">
            {/* Center vertical stem down from Secretary */}
            <line
              x1="500"
              y1="0"
              x2="500"
              y2="25"
              stroke="#111111"
              strokeWidth="2"
              strokeDasharray="25"
              strokeDashoffset={linesDrawn ? 0 : 25}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
            {/* Horizontal line spanning between column 1 center (166) and column 3 center (834) */}
            <line
              x1="166"
              y1="25"
              x2="834"
              y2="25"
              stroke="#111111"
              strokeWidth="2"
              strokeDasharray="668"
              strokeDashoffset={linesDrawn ? 0 : 668}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
            {/* Drop into Column 1 */}
            <line
              x1="166"
              y1="25"
              x2="166"
              y2="50"
              stroke="#111111"
              strokeWidth="2"
              strokeDasharray="25"
              strokeDashoffset={linesDrawn ? 0 : 25}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
            {/* Drop into Column 2 */}
            <line
              x1="500"
              y1="25"
              x2="500"
              y2="50"
              stroke="#111111"
              strokeWidth="2"
              strokeDasharray="25"
              strokeDashoffset={linesDrawn ? 0 : 25}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
            {/* Drop into Column 3 */}
            <line
              x1="834"
              y1="25"
              x2="834"
              y2="50"
              stroke="#111111"
              strokeWidth="2"
              strokeDasharray="25"
              strokeDashoffset={linesDrawn ? 0 : 25}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
        </div>

        {/* Mobile Line Drawing: Single vertical connector down to stacked columns */}
        <div className="lg:hidden flex justify-center my-0 select-none">
          <svg width="2" height="32" className="overflow-visible" aria-hidden="true">
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="32"
              stroke="#111111"
              strokeWidth="2"
              strokeDasharray="32"
              strokeDashoffset={linesDrawn ? 0 : 32}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
        </div>

        {/* ========================================================== */}
        {/* TIER 3: THREE COLUMNS UNDER SECRETARY                      */}
        {/* (Stacks on phones, all names visible at once)              */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full pt-1">
          
          {/* COLUMN 1: JOINT SECRETARIES (9) */}
          <div className="border-2 border-[#111111] bg-white flex flex-col">
            {/* Ink header with title and count */}
            <div className="bg-[#111111] text-[#FAF8F5] p-4 text-center">
              <h4 className="font-manrope font-extrabold text-[18px] md:text-[20px] text-[#FAF8F5]">
                {language === 'ta' ? 'இணைச் செயலாளர்கள் (9)' : 'Joint Secretaries (9)'}
              </h4>
            </div>

            {/* List of members: 1px #d7d0c3 line between rows, min-h-[48px] on mobile */}
            <div className="divide-y divide-[#d7d0c3]">
              {jointSecretaries.map((officer) => (
                <button
                  key={officer.id}
                  type="button"
                  onClick={(e) => handleOpenOfficer(officer, e)}
                  className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between gap-3 text-left group hover:bg-[#FAF8F5] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#E31E24]"
                >
                  <span className="font-manrope font-extrabold text-[15px] md:text-[16px] text-[#111111] group-hover:text-[#E31E24] transition-colors">
                    {officer.name[language]}
                  </span>
                  <span className="text-[13px] md:text-[14px] text-[#5B5348] shrink-0 font-normal">
                    {officer.district[language]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2: DEPUTY SECRETARIES (5) */}
          <div className="border-2 border-[#111111] bg-white flex flex-col">
            {/* Ink header with title and count */}
            <div className="bg-[#111111] text-[#FAF8F5] p-4 text-center">
              <h4 className="font-manrope font-extrabold text-[18px] md:text-[20px] text-[#FAF8F5]">
                {language === 'ta' ? 'துணைச் செயலாளர்கள் (5)' : 'Deputy Secretaries (5)'}
              </h4>
            </div>

            {/* List of members: 1px #d7d0c3 line between rows, min-h-[48px] on mobile */}
            <div className="divide-y divide-[#d7d0c3]">
              {deputySecretaries.map((officer) => (
                <button
                  key={officer.id}
                  type="button"
                  onClick={(e) => handleOpenOfficer(officer, e)}
                  className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between gap-3 text-left group hover:bg-[#FAF8F5] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#E31E24]"
                >
                  <span className="font-manrope font-extrabold text-[15px] md:text-[16px] text-[#111111] group-hover:text-[#E31E24] transition-colors">
                    {officer.name[language]}
                  </span>
                  <span className="text-[13px] md:text-[14px] text-[#5B5348] shrink-0 font-normal">
                    {officer.district[language]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 3: HEAD OFFICE ADVOCATES (9) */}
          <div className="border-2 border-[#111111] bg-white flex flex-col">
            {/* Ink header with title and count */}
            <div className="bg-[#111111] text-[#FAF8F5] p-4 text-center">
              <h4 className="font-manrope font-extrabold text-[18px] md:text-[20px] text-[#FAF8F5]">
                {language === 'ta' ? 'தலைமையக வழக்கறிஞர்கள் (9)' : 'Head Office Advocates (9)'}
              </h4>
            </div>

            {/* List of members: 1px #d7d0c3 line between rows, min-h-[48px] on mobile */}
            <div className="divide-y divide-[#d7d0c3]">
              {headOfficeAdvocates.map((officer) => (
                <button
                  key={officer.id}
                  type="button"
                  onClick={(e) => handleOpenOfficer(officer, e)}
                  className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between gap-3 text-left group hover:bg-[#FAF8F5] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#E31E24]"
                >
                  <span className="font-manrope font-extrabold text-[15px] md:text-[16px] text-[#111111] group-hover:text-[#E31E24] transition-colors">
                    {officer.name[language]}
                  </span>
                  <span className="text-[13px] md:text-[14px] text-[#5B5348] shrink-0 font-normal">
                    {officer.district[language]}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================== */}
      {/* DOSSIER MODAL                                              */}
      {/* (Square parchment panel, 2px ink border, 6px red top bar)  */}
      {/* ========================================================== */}
      {selectedOfficer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-officer-name"
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-[#111111]/80 flex items-center justify-center p-4"
        >
          {/* Modal Panel: clicking inside stops propagation */}
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] text-[#111111] max-w-xl w-full border-2 border-[#111111] p-6 md:p-8 relative space-y-6"
          >
            {/* 6px red top bar */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#E31E24]" />

            {/* Header: Name and Close button */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#111111] pb-4">
              <div>
                <span className="font-extrabold text-[13px] text-[#C41A1F] uppercase tracking-normal block mb-1">
                  {selectedOfficer.designation[language]}
                </span>
                <h3 id="modal-officer-name" className="font-manrope font-extrabold text-[24px] md:text-[28px] text-[#111111] leading-tight">
                  {selectedOfficer.name[language]}
                </h3>
                <span className="text-[14px] text-[#5B5348] font-bold block mt-0.5">
                  {language === 'ta' ? selectedOfficer.name.en : selectedOfficer.name.ta}
                </span>
              </div>

              {/* Close button */}
              <button
                ref={modalCloseButtonRef}
                type="button"
                onClick={handleCloseModal}
                className="min-h-[44px] h-[44px] px-4 bg-[#111111] hover:bg-[#E31E24] text-white font-manrope font-extrabold text-[13px] uppercase tracking-normal transition-colors cursor-pointer btn-lift"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

            {/* Dossier Details */}
            <div className="space-y-4 text-[15px]">
              
              {/* Portfolio & Role in Tamil and English */}
              <div className="p-4 bg-white border border-[#111111] space-y-1">
                <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                  {language === 'ta' ? 'பொறுப்பு & துறை (Portfolio)' : 'Portfolio & Role'}
                </span>
                <p className="font-bold text-[#111111]">
                  {selectedOfficer.role.ta}
                </p>
                <p className="text-[13px] text-[#5B5348]">
                  {selectedOfficer.role.en}
                </p>
              </div>

              {/* Station & Court Affiliation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#111111] space-y-1">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    {language === 'ta' ? 'தளம் / மாவட்டம் (Station)' : 'Station / District'}
                  </span>
                  <p className="font-bold text-[#111111]">
                    {selectedOfficer.district.ta} / {selectedOfficer.district.en}
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#111111] space-y-1">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    {language === 'ta' ? 'நீதிமன்றப் பிரிவு (Court)' : 'Court Affiliation'}
                  </span>
                  <p className="font-bold text-[#111111]">
                    {selectedOfficer.court || (language === 'ta' ? 'சென்னை உயர்நீதிமன்றம்' : 'Madras High Court')}
                  </p>
                </div>
              </div>

              {/* Bar Council Number: ONLY if it exists in data */}
              {selectedOfficer.barCouncilNo && (
                <div className="p-4 bg-white border border-[#111111]">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block mb-0.5">
                    {language === 'ta' ? 'பார் கவுன்சில் பதிவு எண்' : 'Bar Council Enrollment'}
                  </span>
                  <span className="font-manrope font-extrabold text-[16px] text-[#C41A1F]">
                    {selectedOfficer.barCouncilNo}
                  </span>
                </div>
              )}

              {/* Biography: ONLY show what the data has. Never invent biography text. */}
              {selectedOfficer.bio && (
                <div className="p-4 bg-white border border-[#111111] space-y-2">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    {language === 'ta' ? 'அதிகாரப்பூர்வ குறிப்பு' : 'Official Cadre Biography'}
                  </span>
                  <p className="text-[14px] text-[#111111] leading-relaxed">
                    {selectedOfficer.bio[language]}
                  </p>
                  {selectedOfficer.bio[language === 'ta' ? 'en' : 'ta'] && (
                    <p className="text-[13px] text-[#5B5348] leading-relaxed italic pt-2 border-t border-[#d7d0c3]">
                      {selectedOfficer.bio[language === 'ta' ? 'en' : 'ta']}
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Footer Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="min-h-[44px] h-[44px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] uppercase tracking-normal transition-colors cursor-pointer btn-lift"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
