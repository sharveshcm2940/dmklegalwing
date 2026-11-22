'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { DistrictInfo } from '@/types';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { 
  IconPhone, 
  IconSearch, 
  IconEye, 
  IconClose, 
  IconBuilding, 
  IconMapPin, 
  IconScale 
} from '@/components/Icons';

export default function DistrictsPage() {
  const { language } = useLanguage();
  const { districts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedDossier, setSelectedDossier] = useState<DistrictInfo | null>(null);

  const mainSection = useReveal();

  const zones = ['All', 'Chennai', 'North', 'West', 'Central', 'South'];

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

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? '74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்' : '74 District Legal Units & Cadre'}
        description={
          language === 'ta'
            ? 'சென்னை உயர் நீதிமன்றம், மதுரை கிளை மற்றும் அனைத்து மாவட்ட அமர்வு நீதிமன்றங்களின் அதிகாரப்பூர்வ பட்டியல்.'
            : 'Official directory of 74 party organisational legal units connecting subordinate trial court secretariats and organisers.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-12">
        
        <section 
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: THE LIST */}
            <div className="lg:col-span-7 space-y-6 order-1">
              
              {/* Search Box & Zone Filter as Square Tabs */}
              <div className="bg-white border-2 border-[#111111] p-5 space-y-4">
                
                {/* Search Box with label above in 600 weight */}
                <div>
                  <label htmlFor="districtSearchInput" className="font-semibold text-[15px] text-[#111111] mb-1.5 block">
                    {language === 'ta' ? 'மாவட்டப் பெயர் அல்லது அமைப்பாளர் பெயரைத் தேடுக' : 'Search by district name or organiser'}
                  </label>
                  <div className="relative w-full">
                    <IconSearch className="w-4 h-4 text-[#5B5348] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="districtSearchInput"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={language === 'ta' ? 'தேடுக (எ.கா. சென்னை, மதுரை)...' : 'Search (e.g. Chennai, Madurai)...'}
                      className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] pl-10 pr-4 py-2 text-[15px] text-[#111111] placeholder-[#5B5348] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24]"
                    />
                  </div>
                </div>

                {/* Zone Filter as Square Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b-2 border-[#111111]">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`min-h-[44px] px-4 py-2 text-[14px] font-extrabold transition-colors border-b-[3px] rounded-none shrink-0 cursor-pointer ${
                        selectedZone === zone
                          ? 'border-[#E31E24] text-[#C41A1F] bg-[#f1ece2]'
                          : 'border-transparent text-[#5B5348] hover:text-[#111111]'
                      }`}
                    >
                      {zone === 'All' ? (language === 'ta' ? 'அனைத்தும்' : 'All Zones') : `${zone}`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[14px] text-[#5B5348]">
                  <span>
                    {language === 'ta' ? 'காட்டப்படும் மாவட்டங்கள்: ' : 'Displaying units: '}
                    <strong className="text-[#111111] font-helvetica">{filteredDistricts.length}</strong>
                  </span>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[#C41A1F] hover:underline font-bold cursor-pointer"
                    >
                      {language === 'ta' ? 'தேடலை அழிக்க' : 'Clear search'}
                    </button>
                  )}
                </div>

              </div>

              {/* Ruled List */}
              {filteredDistricts.length === 0 ? (
                <div className="bg-white border-2 border-[#111111] p-8 text-center">
                  <p className="text-[16px] text-[#5B5348]">
                    {language === 'ta' 
                      ? 'தேடலுக்குரிய மாவட்டங்கள் அல்லது அமைப்பாளர்கள் எதுவும் கிடைக்கவில்லை.' 
                      : 'No district units match your search query or zone filter.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y-2 divide-[#111111] border-2 border-[#111111] bg-white">
                  {filteredDistricts.map((d) => {
                    const isPhonePublic = d.showPhonePublicly !== false;
                    const phoneNumbers = isPhonePublic && d.contactPhone
                      ? d.contactPhone.split(/[,;/]/).map((p) => p.trim()).filter(Boolean)
                      : [];

                    return (
                      <article
                        key={d.id}
                        className="p-5 hover:bg-[#f1ece2] transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-[13px]">
                              {d.number && (
                                <span className="font-helvetica font-extrabold text-[#C41A1F]">
                                  #{d.number}
                                </span>
                              )}
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#111111] text-[11px] font-extrabold uppercase text-[#5B5348]">
                                {d.zone} Zone
                              </span>
                              <span>•</span>
                              <span className="text-[14px] text-[#5B5348]">
                                {d.headquarters[language]}
                              </span>
                            </div>

                            <h2 className="font-helvetica font-extrabold text-[22px] text-[#111111] leading-snug">
                              {d.name[language]}
                            </h2>

                            <div className="text-[15px] text-[#5B5348]">
                              <span>{language === 'ta' ? 'அமைப்பாளர்: ' : 'Organiser: '}</span>
                              <strong className="text-[#111111]">{d.organizer[language]}</strong>
                            </div>

                            <p className="line-clamp-1 text-[13px] text-[#5B5348]">
                              {d.courtComplex[language]}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:self-center shrink-0">
                            {isPhonePublic && phoneNumbers.length > 0 ? (
                              phoneNumbers.map((phone, idx) => (
                                <a
                                  key={idx}
                                  href={`tel:${phone.replace(/\s+/g, '')}`}
                                  className="min-h-[44px] px-4 py-2 inline-flex items-center justify-center gap-1.5 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[13px] btn-lift cursor-pointer"
                                  title={`Call ${phone}`}
                                >
                                  <IconPhone className="w-3.5 h-3.5" />
                                  <span>{phone}</span>
                                </a>
                              ))
                            ) : (
                              <span className="text-[13px] text-[#5B5348] italic py-2">
                                {language === 'ta' ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்க' : 'Contact via State Secretariat'}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedDossier(d)}
                              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center border-2 border-[#111111] bg-[#FAF8F5] hover:bg-[#111111] hover:text-white text-[#111111] btn-lift cursor-pointer"
                              title={language === 'ta' ? 'விவரம் காண்க' : 'Inspect Dossier'}
                              aria-label={language === 'ta' ? `${d.name[language]} மாவட்ட ஆவணத்தைக் காண்க` : `Inspect dossier for ${d.name[language]}`}
                            >
                              <IconEye className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

            </div>

            {/* COLUMN 2: THE MAP */}
            <div className="lg:col-span-5 order-2 lg:sticky lg:top-24">
              <div className="border-2 border-[#111111] bg-white p-4">
                <TamilNaduMap />
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* DOSSIER MODAL */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#111111] max-w-lg w-full border-4 border-[#111111] p-6 sm:p-8 relative">
            
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4 mb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ மாவட்ட ஆவணம்' : 'District Legal Dossier'}
                </span>
                <h3 className="font-helvetica font-extrabold text-[26px] text-[#111111]">
                  {selectedDossier.name[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                className="p-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-[15px]">
              <div className="p-4 bg-white border-2 border-[#111111]">
                <span className="text-[13px] text-[#5B5348] block mb-0.5">
                  {language === 'ta' ? 'மாவட்ட அமைப்பாளர்:' : 'District Organiser:'}
                </span>
                <p className="font-extrabold text-[18px] text-[#111111]">
                  {selectedDossier.organizer[language]}
                </p>
                <p className="text-[13px] text-[#5B5348] pt-0.5">
                  DMK Legal Wing Secretariat • Advocate Bar Cadre
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'மண்டலம்' : 'Party Zone'}
                  </span>
                  <span className="font-bold text-[#111111] block">
                    {selectedDossier.zone}
                  </span>
                </div>
                <div className="p-3 bg-white border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'தலைமையகம்' : 'Headquarters'}
                  </span>
                  <span className="font-bold text-[#111111] block">
                    {selectedDossier.headquarters[language]}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f1ece2] border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-0.5">
                    {language === 'ta' ? 'பதிவுசெய்த வழக்கறிஞர்கள்' : 'Enrolled Advocates'}
                  </span>
                  <span className="font-helvetica font-extrabold text-[24px] text-[#111111]">
                    {selectedDossier.memberCount || 150}+
                  </span>
                </div>
                <div className="p-3 bg-[#f1ece2] border border-[#111111]">
                  <span className="text-[12px] text-[#5B5348] block mb-0.5">
                    {language === 'ta' ? 'கையாண்ட வழக்குகள்' : 'Cases Assisted'}
                  </span>
                  <span className="font-helvetica font-extrabold text-[24px] text-[#C41A1F]">
                    {selectedDossier.activeCasesAssisted || 35}+
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#111111] space-y-1">
                <span className="text-[12px] font-bold text-[#5B5348] block">
                  {language === 'ta' ? 'நீதிமன்ற வளாகப் பிரிவு:' : 'Court Complex & Jurisdiction:'}
                </span>
                <p className="text-[14px] text-[#111111]">
                  {selectedDossier.courtComplex[language]}
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                {selectedDossier.showPhonePublicly !== false && selectedDossier.contactPhone && (
                  <a
                    href={`tel:${selectedDossier.contactPhone.replace(/\s+/g, '')}`}
                    className="flex-1 min-h-[44px] bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] inline-flex items-center justify-center gap-2 btn-lift"
                  >
                    <IconPhone className="w-4 h-4" />
                    <span>{language === 'ta' ? 'அழைக்க' : 'Call Unit'}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDossier(null)}
                  className="flex-1 min-h-[44px] bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[14px] inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'மூடுக' : 'Close'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
