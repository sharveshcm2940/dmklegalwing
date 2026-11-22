'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { DistrictInfo } from '@/types';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { PageTitleBand } from '@/components/PageTitleBand';

export default function DistrictsPage() {
  const { language } = useLanguage();
  const { districts } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [panelFade, setPanelFade] = useState(true);

  // Dossier modal state and focus handling
  const [selectedDossier, setSelectedDossier] = useState<DistrictInfo | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  const zones = ['All', 'Chennai', 'North', 'West', 'Central', 'South'];

  // Filtered districts according to zone and search
  const filteredDistricts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return districts.filter((d) => {
      const matchesZone = selectedZone === 'All' || d.zone === selectedZone;
      const matchesSearch =
        !q ||
        d.name[language].toLowerCase().includes(q) ||
        d.name.en.toLowerCase().includes(q) ||
        d.name.ta.toLowerCase().includes(q) ||
        d.organizer[language].toLowerCase().includes(q) ||
        d.organizer.en.toLowerCase().includes(q) ||
        d.organizer.ta.toLowerCase().includes(q);

      return matchesZone && matchesSearch;
    });
  }, [districts, selectedZone, searchQuery, language]);

  // Selected district for right-hand panel
  const selectedDistrict = useMemo(() => {
    if (selectedDistrictId) {
      const found = districts.find((d) => d.id === selectedDistrictId);
      if (found) return found;
    }
    return filteredDistricts[0] || districts[0] || null;
  }, [selectedDistrictId, filteredDistricts, districts]);

  // Select district with 0.4s fade animation
  const handleSelectDistrict = (district: DistrictInfo) => {
    setPanelFade(false);
    setSelectedDistrictId(district.id);
    setTimeout(() => {
      setPanelFade(true);
    }, 50);
  };

  const handleOpenDossier = (district: DistrictInfo, e: React.MouseEvent<HTMLElement>) => {
    triggerRef.current = e.currentTarget;
    setSelectedDossier(district);
  };

  const handleCloseDossier = () => {
    setSelectedDossier(null);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 10);
  };

  // Keyboard accessibility for modal
  useEffect(() => {
    if (!selectedDossier) return;

    setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseDossier();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDossier]);

  // Phone numbers with privacy check (missing field treated as true)
  const isSelectedPhonePublic = selectedDistrict ? selectedDistrict.showPhonePublicly !== false : true;
  const selectedPhoneNumbers = selectedDistrict && isSelectedPhonePublic && selectedDistrict.contactPhone
    ? selectedDistrict.contactPhone.split(/[,;/]/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? '74 மாவட்ட அணிகள்' : '74 district units'}
        description={
          language === 'ta'
            ? 'சென்னை உயர் நீதிமன்றம், மதுரை கிளை மற்றும் அனைத்து மாவட்ட அமர்வு நீதிமன்றங்களின் அதிகாரப்பூர்வ பட்டியல்.'
            : 'Official directory of 74 party organisational legal units connecting subordinate trial court secretariats and organisers.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-16">
        
        {/* ========================================================== */}
        {/* 1. DARK SECTION (INK BACKGROUND)                           */}
        {/* ========================================================== */}
        <section className="bg-[#111111] text-[#FAF8F5] border-2 border-[#111111] p-6 md:p-10 space-y-8">
          
          {/* Header controls: Search Box and Zone Filter Tabs */}
          <div className="space-y-6">
            
            {/* Search Box: 2px parchment border, inline-SVG magnifier, filters as you type */}
            <div>
              <label htmlFor="district-search" className="font-semibold text-[14px] text-[#d8cfc2] mb-2 block">
                {language === 'ta'
                  ? 'மாவட்டப் பெயர் அல்லது அமைப்பாளர் பெயரைத் தேடுக'
                  : 'Search by district name or organiser'}
              </label>
              <div className="relative w-full">
                <svg
                  className="w-5 h-5 text-[#FAF8F5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="district-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்ட அல்லது அமைப்பாளர் பெயர் உள்ளிடுக...' : 'Type district or organiser name...'}
                  className="w-full min-h-[44px] bg-[#1a1a1a] border-2 border-[#FAF8F5] text-[#FAF8F5] placeholder-[#9e948a] pl-11 pr-4 py-2.5 text-[15px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                />
              </div>
            </div>

            {/* Zone Filter Tabs: plain text buttons with 3px red underline on active one */}
            <div className="flex items-center gap-6 overflow-x-auto pb-2 border-b border-[#3d3633]">
              {zones.map((zone) => {
                const isActive = selectedZone === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className={`min-h-[44px] pb-2 text-[15px] transition-colors cursor-pointer shrink-0 ${
                      isActive
                        ? 'border-b-[3px] border-[#E31E24] text-[#FAF8F5] font-extrabold'
                        : 'border-b-[3px] border-transparent text-[#d8cfc2] hover:text-[#FAF8F5] font-semibold'
                    }`}
                  >
                    {zone === 'All' ? (language === 'ta' ? 'அனைத்து மண்டலங்கள்' : 'All Zones') : `${zone} Zone`}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Main Grid: Left = 380px tall scrolling list, Right = Parchment Panel with 8px red top border */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 380px tall scrolling list of districts */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="flex items-center justify-between pb-2 text-[13px] text-[#d8cfc2]">
                <span>
                  {language === 'ta' ? 'வரிசைப் பட்டியல்' : 'District Units'}: {filteredDistricts.length}
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#ff8a85] hover:underline cursor-pointer"
                  >
                    {language === 'ta' ? 'தேடலை அழிக்க' : 'Clear search'}
                  </button>
                )}
              </div>

              <div className="h-[380px] overflow-y-auto border border-[#3d3633] divide-y divide-[#3d3633] bg-[#1a1a1a]">
                {filteredDistricts.length === 0 ? (
                  <div className="p-8 text-center text-[#9e948a] text-[15px]">
                    {language === 'ta' ? 'மாவட்டங்கள் எதுவும் கிடைக்கவில்லை' : 'No matching district units found.'}
                  </div>
                ) : (
                  filteredDistricts.map((d) => {
                    const isSelected = selectedDistrict?.id === d.id;

                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleSelectDistrict(d)}
                        className={`w-full min-h-[48px] px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#E31E24] text-white'
                            : 'hover:bg-[#2a2523] text-[#FAF8F5]'
                        }`}
                      >
                        {/* Name in 800 weight on the left */}
                        <span className="font-helvetica font-extrabold text-[15px] truncate">
                          {d.name[language]}
                        </span>

                        {/* Organiser on the right */}
                        <span className={`text-[13px] truncate text-right shrink-0 max-w-[180px] ${
                          isSelected ? 'text-white/90' : 'text-[#d8cfc2]'
                        }`}>
                          {d.organizer[language]}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Parchment panel with an 8px red top border showing selected district */}
            <div className="lg:col-span-7">
              {selectedDistrict ? (
                <div
                  className={`bg-[#FAF8F5] text-[#111111] p-6 sm:p-8 border-2 border-[#111111] border-t-8 border-t-[#E31E24] space-y-6 transition-opacity duration-400 ease-in-out ${
                    panelFade ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Label: "District organiser · No. N" in #C41A1F */}
                  <div>
                    <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] tracking-normal block mb-1">
                      {language === 'ta'
                        ? `மாவட்ட அமைப்பாளர் · எண் ${selectedDistrict.number || 1}`
                        : `District organiser · No. ${selectedDistrict.number || 1}`}
                    </span>

                    {/* District name: Helvetica Now Display 800, clamp(34px, 4vw, 52px) */}
                    <h3 className="font-helvetica font-extrabold text-[clamp(34px,4vw,52px)] text-[#111111] leading-tight">
                      {selectedDistrict.name[language]}
                    </h3>

                    {/* Organiser: 600 weight, 26px */}
                    <p className="font-semibold text-[26px] text-[#111111] leading-snug mt-2">
                      {selectedDistrict.organizer[language]}
                    </p>
                  </div>

                  {/* Court complex address if data has one */}
                  {selectedDistrict.courtComplex && (
                    <div className="p-4 bg-white border border-[#111111] space-y-1">
                      <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                        {language === 'ta' ? 'நீதிமன்ற வளாக முகவரி / தளம்' : 'Court Complex & Jurisdiction'}
                      </span>
                      <p className="text-[15px] text-[#111111]">
                        {selectedDistrict.courtComplex[language]}
                      </p>
                    </div>
                  )}

                  {/* One full-width red call button per phone number (tel: link, number in Helvetica Now Display 800 at 24px) */}
                  <div className="space-y-3 pt-2">
                    {isSelectedPhonePublic && selectedPhoneNumbers.length > 0 ? (
                      selectedPhoneNumbers.map((phone, idx) => (
                        <a
                          key={idx}
                          href={`tel:${phone.replace(/\s+/g, '')}`}
                          className="w-full min-h-[48px] bg-[#E31E24] hover:bg-[#C41A1F] text-white flex items-center justify-center gap-3 px-6 py-3 cursor-pointer btn-lift transition-colors"
                          title={`Call ${phone}`}
                        >
                          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-helvetica font-extrabold text-[24px] leading-none">
                            {phone}
                          </span>
                        </a>
                      ))
                    ) : (
                      <div className="p-4 bg-[#f1ece2] border border-[#d7d0c3] text-center font-bold text-[15px] text-[#5B5348]">
                        {language === 'ta'
                          ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்க'
                          : 'Contact through the State Secretariat'}
                      </div>
                    )}
                  </div>

                  {/* Inspection link that opens the dossier modal */}
                  <div className="pt-2 border-t border-[#111111]/20 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={(e) => handleOpenDossier(selectedDistrict, e)}
                      className="text-[#C41A1F] hover:text-[#E31E24] hover:underline font-bold text-[15px] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>
                        {language === 'ta'
                          ? 'முழு மாவட்ட ஆவணக் குறிப்பை காண்க (Dossier) →'
                          : 'Inspect Full District Dossier →'}
                      </span>
                    </button>

                    <span className="text-[13px] text-[#5B5348] font-bold">
                      {selectedDistrict.zone} Zone
                    </span>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center text-[#9e948a] border-2 border-[#3d3633]">
                  {language === 'ta' ? 'மாவட்டத்தைத் தேர்வு செய்யவும்' : 'Select a district from the list.'}
                </div>
              )}
            </div>

          </div>

        </section>

        {/* ========================================================== */}
        {/* 2. THE MAP: BELOW ON PHONES, BESIDE LIST ON WIDE SCREENS   */}
        {/* ========================================================== */}
        <section className="space-y-4">
          <div className="border-b-2 border-[#111111] pb-3 flex items-center justify-between">
            <h2 className="font-kavivanar font-normal text-[clamp(28px,3.5vw,40px)] text-[#111111] leading-tight">
              {language === 'ta' ? 'தமிழ்நாடு மாவட்ட வரைபட கட்டமைப்பு' : 'Geographic District Mapping of Tamil Nadu'}
            </h2>
            <span className="font-helvetica font-extrabold text-[13px] text-[#C41A1F] uppercase">
              38 Revenue Districts • 74 Units
            </span>
          </div>

          <TamilNaduMap
            onSelectSubDistrict={(sub) => handleSelectDistrict(sub)}
            selectedSubDistrictId={selectedDistrict?.id}
          />
        </section>

      </div>

      {/* ========================================================== */}
      {/* 3. DOSSIER MODAL                                           */}
      {/* (Square parchment panel, 2px ink border, 6px red top bar)  */}
      {/* ========================================================== */}
      {selectedDossier && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-title"
          onClick={handleCloseDossier}
          className="fixed inset-0 z-50 bg-[#111111]/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] text-[#111111] max-w-lg w-full border-2 border-[#111111] p-6 sm:p-8 relative space-y-6"
          >
            {/* 6px red top bar */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#E31E24]" />

            {/* Header: Title and Close button */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#111111] pb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ மாவட்ட ஆவணம்' : 'Official District Dossier'}
                </span>
                <h3 id="dossier-title" className="font-helvetica font-extrabold text-[26px] text-[#111111]">
                  {selectedDossier.name[language]}
                </h3>
                <span className="text-[13px] text-[#5B5348] font-bold block mt-0.5">
                  Unit #{selectedDossier.number || 1} • {selectedDossier.zone} Zone
                </span>
              </div>

              <button
                ref={modalCloseBtnRef}
                type="button"
                onClick={handleCloseDossier}
                className="min-h-[44px] h-[44px] px-4 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[13px] uppercase tracking-normal transition-colors cursor-pointer btn-lift"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 text-[15px]">
              
              <div className="p-4 bg-white border border-[#111111] space-y-1">
                <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                  {language === 'ta' ? 'மாவட்ட அமைப்பாளர்' : 'District Organiser'}
                </span>
                <p className="font-bold text-[18px] text-[#111111]">
                  {selectedDossier.organizer[language]}
                </p>
                <p className="text-[13px] text-[#5B5348]">
                  DMK Legal Wing Secretariat • Designated Bar Leader
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-1 font-bold">
                    {language === 'ta' ? 'மண்டலம்' : 'Party Zone'}
                  </span>
                  <span className="font-extrabold text-[#111111]">
                    {selectedDossier.zone}
                  </span>
                </div>

                <div className="p-3 bg-white border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-1 font-bold">
                    {language === 'ta' ? 'தலைமையகம்' : 'Headquarters'}
                  </span>
                  <span className="font-extrabold text-[#111111]">
                    {selectedDossier.headquarters[language]}
                  </span>
                </div>
              </div>

              {selectedDossier.courtComplex && (
                <div className="p-4 bg-white border border-[#111111] space-y-1">
                  <span className="text-[12px] font-bold text-[#5B5348] block">
                    {language === 'ta' ? 'நீதிமன்ற வளாகப் பிரிவு:' : 'Court Complex & Station:'}
                  </span>
                  <p className="text-[14px] text-[#111111]">
                    {selectedDossier.courtComplex[language]}
                  </p>
                </div>
              )}

              {/* Cadre statistics if available */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f1ece2] border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-0.5 font-bold">
                    {language === 'ta' ? 'பதிவுசெய்த வழக்கறிஞர்கள்' : 'Enrolled Advocates'}
                  </span>
                  <span className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                    {selectedDossier.memberCount || 150}+
                  </span>
                </div>

                <div className="p-3 bg-[#f1ece2] border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-0.5 font-bold">
                    {language === 'ta' ? 'கையாண்ட வழக்குகள்' : 'Cases Assisted'}
                  </span>
                  <span className="font-helvetica font-extrabold text-[22px] text-[#C41A1F]">
                    {selectedDossier.activeCasesAssisted || 35}+
                  </span>
                </div>
              </div>

              {/* Call button or privacy note */}
              <div className="pt-2">
                {selectedDossier.showPhonePublicly !== false && selectedDossier.contactPhone ? (
                  <a
                    href={`tel:${selectedDossier.contactPhone.replace(/\s+/g, '')}`}
                    className="w-full min-h-[48px] bg-[#E31E24] hover:bg-[#C41A1F] text-white flex items-center justify-center gap-2 font-helvetica font-extrabold text-[18px] btn-lift cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'அழைக்க:' : 'Call:'} {selectedDossier.contactPhone}</span>
                  </a>
                ) : (
                  <div className="p-3 bg-[#f1ece2] border border-[#d7d0c3] text-center text-[13px] font-bold text-[#5B5348]">
                    {language === 'ta'
                      ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்க'
                      : 'Contact through the State Secretariat'}
                  </div>
                )}
              </div>

            </div>

            {/* Footer close button */}
            <div className="flex justify-end pt-2 border-t border-[#111111]/20">
              <button
                type="button"
                onClick={handleCloseDossier}
                className="min-h-[44px] h-[44px] px-6 bg-[#111111] hover:bg-[#E31E24] text-white font-extrabold text-[14px] uppercase tracking-normal transition-colors cursor-pointer btn-lift"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
