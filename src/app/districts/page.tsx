'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { DistrictInfo } from '@/types';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { Phone, Search, Eye, X, Building2, MapPin, Scale } from 'lucide-react';

export default function DistrictsPage() {
  const { language } = useLanguage();
  const { districts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedDossier, setSelectedDossier] = useState<DistrictInfo | null>(null);

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
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-dmk-body py-8">
      
      {/* 1. MASTHEAD BANNER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8">
        <div className="border-b-2 border-[#111111] pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-dmk-body font-bold text-[#C41A1F] block mb-1">
                {language === 'ta' ? 'அமைப்பு மாவட்டக் கட்டமைப்பு' : '74 DISTRICT PARTY CADRE DIRECTORY'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight leading-tight">
                {language === 'ta'
                  ? '74 மாவட்ட வழக்கறிஞர் அணிகள்'
                  : '74 District Legal Units & Cadre Directory'}
              </h1>
              <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-2 max-w-3xl leading-relaxed">
                {language === 'ta'
                  ? 'சென்னை உயர் நீதிமன்றம், மதுரை கிளை, புதுச்சேரி மற்றும் அனைத்து மாவட்ட அமர்வு நீதிமன்றங்களையும் உள்ளடக்கிய 74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகளின் அதிகாரப்பூர்வ பட்டியல்.'
                  : 'Official directory of 74 party organizational legal units across Tamil Nadu and Puducherry, connecting subordinate trial court secretariats and district organizers.'}
              </p>
            </div>

            <div className="text-xs text-[#5B5348] font-dmk-body shrink-0">
              <span className="font-bold text-[#111111]">{districts.length}</span> {language === 'ta' ? 'அமைப்பு மாவட்டங்கள்' : 'Party Units Registered'}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN LAYOUT: LIST FIRST, MAP SECOND (Beside list on wide screens, below list on phones) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================== */}
          {/* COLUMN 1: THE LIST (Comes FIRST on phones & left side on desktop) */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 space-y-6 order-1">
            
            {/* Search Box & Zone Filter as Square Tabs */}
            <div className="bg-white border border-[#D8D3CB] p-4 sm:p-5 rounded-[2px] space-y-4">
              
              {/* Search Box: district name or organiser */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#5B5348] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="districtSearchInput"
                  aria-label={language === 'ta' ? 'மாவட்டப் பெயர் அல்லது அமைப்பாளர் பெயரைத் தேடுக' : 'Search by district name or organiser'}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்டப் பெயர் அல்லது அமைப்பாளர் பெயரைத் தேடுக...' : 'Search by district name or organiser...'}
                  className="w-full min-h-[44px] bg-[#FAF8F5] border border-[#D8D3CB] pl-10 pr-4 py-2 text-xs font-dmk-body text-[#111111] placeholder-[#5B5348] focus:outline-none focus:border-[#111111] rounded-[2px]"
                />
              </div>

              {/* Zone Filter as Square Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#D8D3CB]">
                {zones.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className={`min-h-[44px] px-4 py-2 text-xs font-dmk-body font-bold transition-all border-b-[3px] rounded-none shrink-0 cursor-pointer ${
                      selectedZone === zone
                        ? 'border-[#E31E24] text-[#111111]'
                        : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:border-[#D8D3CB]'
                    }`}
                  >
                    {zone === 'All' ? (language === 'ta' ? 'அனைத்து மண்டலங்கள்' : 'All Zones') : `${zone} Zone`}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#5B5348]">
                <span>
                  {language === 'ta' ? 'காட்டப்படும் மாவட்டங்கள்: ' : 'Displaying units: '}
                  <strong className="text-[#111111]">{filteredDistricts.length}</strong>
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#C41A1F] hover:underline cursor-pointer"
                  >
                    {language === 'ta' ? 'தேடலை அழிக்க' : 'Clear search'}
                  </button>
                )}
              </div>

            </div>

            {/* Ruled List: One row per party district */}
            {filteredDistricts.length === 0 ? (
              <div className="bg-white border border-[#D8D3CB] p-8 text-center rounded-[2px]">
                <p className="text-xs text-[#5B5348] font-dmk-body">
                  {language === 'ta' 
                    ? 'தேடலுக்குரிய மாவட்டங்கள் அல்லது அமைப்பாளர்கள் எதுவும் கிடைக்கவில்லை.' 
                    : 'No district units match your search query or zone filter.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#D8D3CB] border border-[#D8D3CB] bg-white rounded-[2px]">
                {filteredDistricts.map((d) => {
                  const isPhonePublic = d.showPhonePublicly !== false;
                  
                  // Split multiple phone numbers if an organiser has two numbers
                  const phoneNumbers = isPhonePublic && d.contactPhone
                    ? d.contactPhone.split(/[,;/]/).map((p) => p.trim()).filter(Boolean)
                    : [];

                  return (
                    <article
                      key={d.id}
                      className="p-4 sm:p-5 hover:bg-[#FAF8F5] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* District & Organiser Info */}
                        <div className="space-y-1.5 flex-1">
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {d.number && (
                              <span className="font-mono font-bold text-[#C41A1F]">
                                #{d.number}
                              </span>
                            )}
                            <span className="text-[#D8D3CB]">•</span>
                            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D8D3CB] font-english text-[10px] font-bold uppercase rounded-[2px] text-[#5B5348]">
                              {d.zone} Zone
                            </span>
                            <span className="text-[#D8D3CB]">•</span>
                            <span className="text-xs text-[#5B5348]">
                              {d.headquarters[language]}
                            </span>
                          </div>

                          {/* District Name */}
                          <h2 className="text-base sm:text-lg font-bold text-[#111111] font-dmk-headline leading-snug">
                            {d.name[language]}
                          </h2>

                          {/* Organiser Name */}
                          <div className="text-xs text-[#5B5348] font-dmk-body">
                            <span className="text-[#5B5348]">{language === 'ta' ? 'அமைப்பாளர்: ' : 'Organiser: '}</span>
                            <strong className="text-[#111111]">{d.organizer[language]}</strong>
                          </div>

                          {/* Court Complex */}
                          <p className="line-clamp-1 text-[11px] text-[#5B5348] font-dmk-body">
                            {d.courtComplex[language]}
                          </p>

                        </div>

                        {/* Actions: Call Button(s) (>= 44px) + Inspection Icon */}
                        <div className="flex flex-wrap items-center gap-2 sm:self-center shrink-0">
                          
                          {/* If organiser has two numbers, show both as separate call buttons */}
                          {isPhonePublic && phoneNumbers.length > 0 ? (
                            phoneNumbers.map((phone, idx) => (
                              <a
                                key={idx}
                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                className="min-h-[44px] px-3.5 py-2 inline-flex items-center justify-center gap-1.5 bg-[#E31E24] hover:bg-[#111111] text-white font-dmk-body font-bold text-xs rounded-[2px] transition-colors"
                                title={`Call ${phone}`}
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{phone}</span>
                              </a>
                            ))
                          ) : (
                            <span className="text-xs font-dmk-body text-[#5B5348] italic py-2">
                              {language === 'ta' ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்ளவும்' : 'Contact through the State Secretariat'}
                            </span>
                          )}

                          {/* Inspection Icon that opens the Dossier */}
                          <button
                            type="button"
                            onClick={() => setSelectedDossier(d)}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-[#D8D3CB] bg-[#FAF8F5] hover:bg-[#111111] hover:text-white text-[#111111] rounded-[2px] transition-colors cursor-pointer"
                            title={language === 'ta' ? 'விவரம் காண்க' : 'Inspect Dossier'}
                            aria-label={language === 'ta' ? `${d.name[language]} மாவட்ட ஆவணத்தைக் காண்க` : `Inspect dossier for ${d.name[language]}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          </div>

          {/* ============================================================== */}
          {/* COLUMN 2: THE MAP (Below list on phones, beside it on desktop) */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 order-2 lg:sticky lg:top-6">
            <TamilNaduMap />
          </div>

        </div>
      </section>

      {/* 3. DOSSIER MODAL */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-[#111111] max-w-lg w-full border-2 border-[#111111] p-6 sm:p-8 shadow-2xl relative font-dmk-body rounded-[2px]">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4 mb-4">
              <div>
                <span className="text-xs font-dmk-body text-[#C41A1F] block mb-1">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ மாவட்ட ஆவணம்' : 'District Legal Dossier'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                  {selectedDossier.name[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                className="p-1.5 text-[#5B5348] hover:text-[#111111] transition-colors rounded-[2px] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="space-y-4 text-xs font-dmk-body">
              <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-xs text-[#5B5348] block mb-0.5">
                  {language === 'ta' ? 'மாவட்ட அமைப்பாளர்:' : 'District Organiser:'}
                </span>
                <p className="text-sm font-bold text-[#111111] font-dmk-headline">
                  {selectedDossier.organizer[language]}
                </p>
                <p className="text-xs text-[#5B5348] pt-0.5">
                  DMK Legal Wing Secretariat • Advocate Bar Cadre
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-xs text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'மண்டலம்' : 'Party Zone'}
                  </span>
                  <span className="font-bold text-[#111111] block">
                    {selectedDossier.zone}
                  </span>
                </div>
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-xs text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'தலைமையகம்' : 'Headquarters'}
                  </span>
                  <span className="font-bold text-[#111111] block">
                    {selectedDossier.headquarters[language]}
                  </span>
                </div>
              </div>

              {/* Cadre Metrics & Cases Assisted from backend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-xs text-[#5B5348] block mb-0.5">
                    {language === 'ta' ? 'பதிவுசெய்த வழக்கறிஞர்கள்' : 'Enrolled Advocates'}
                  </span>
                  <span className="text-base font-bold text-[#111111] font-mono">
                    {selectedDossier.memberCount || 150}+
                  </span>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-xs text-[#5B5348] block mb-0.5">
                    {language === 'ta' ? 'கையாண்ட வழக்குகள்' : 'Cases Assisted'}
                  </span>
                  <span className="text-base font-bold text-[#C41A1F] font-mono">
                    {selectedDossier.activeCasesAssisted || 35}+
                  </span>
                </div>
              </div>

              {/* Joint Organisers when present in backend */}
              {selectedDossier.jointOrganizers && selectedDossier.jointOrganizers.length > 0 && (
                <div className="p-3 bg-white border border-[#D8D3CB] space-y-1.5 rounded-[2px]">
                  <span className="text-xs text-[#5B5348] block">
                    {language === 'ta' ? 'இணை அமைப்பாளர்கள்:' : 'Joint Organisers:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDossier.jointOrganizers.map((jo, idx) => (
                      <span key={idx} className="bg-[#FAF8F5] px-2.5 py-1 border border-[#D8D3CB] font-bold text-[#111111] text-xs rounded-[2px]">
                        {jo[language]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-white border border-[#D8D3CB] space-y-1 rounded-[2px]">
                <span className="text-xs text-[#5B5348] block">
                  {language === 'ta' ? 'நீதிமன்ற வளாகம்' : 'Attached Court Complex'}
                </span>
                <p className="text-[#111111] font-dmk-body">
                  {selectedDossier.courtComplex[language]}
                </p>
              </div>

              {/* Direct Phone / Privacy */}
              <div className="p-3 bg-white border border-[#D8D3CB] space-y-1 rounded-[2px]">
                <span className="text-xs text-[#5B5348] block">
                  {language === 'ta' ? 'தொடர்பு எண்' : 'Contact Phone'}
                </span>
                {selectedDossier.showPhonePublicly !== false ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedDossier.contactPhone.split(/[,;/]/).map((p, idx) => (
                      <a
                        key={idx}
                        href={`tel:${p.trim().replace(/\s+/g, '')}`}
                        className="font-mono font-bold text-[#C41A1F] hover:underline"
                      >
                        {p.trim()}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-[#5B5348]">
                    {language === 'ta' ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்ளவும்' : 'Contact through the State Secretariat'}
                  </p>
                )}
              </div>

              {selectedDossier.contactEmail && (
                <div className="p-3 bg-white border border-[#D8D3CB] space-y-1 rounded-[2px]">
                  <span className="text-xs text-[#5B5348] block">
                    {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Official Email'}
                  </span>
                  <a
                    href={`mailto:${selectedDossier.contactEmail}`}
                    className="text-[#111111] hover:text-[#C41A1F] underline"
                  >
                    {selectedDossier.contactEmail}
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-[#D8D3CB] flex items-center justify-between">
              {selectedDossier.showPhonePublicly !== false ? (
                <a
                  href={`tel:${selectedDossier.contactPhone.split(/[,;/]/)[0].trim().replace(/\s+/g, '')}`}
                  className="min-h-[44px] px-5 py-2.5 bg-[#E31E24] hover:bg-[#111111] text-white text-xs font-dmk-body font-bold uppercase tracking-wider flex items-center gap-2 transition-colors rounded-[2px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>{language === 'ta' ? 'அழைக்க' : 'Direct Call'}</span>
                </a>
              ) : (
                <span className="text-xs text-[#5B5348] italic font-dmk-body">
                  {language === 'ta' ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்ளவும்' : 'Contact through the State Secretariat'}
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-dmk-body font-bold text-[#111111] hover:text-[#C41A1F] underline underline-offset-4 transition-colors cursor-pointer"
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
