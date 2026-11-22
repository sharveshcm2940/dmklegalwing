'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { DistrictInfo } from '../types';
import { 
  REAL_TN_DISTRICTS, 
  TN_MAP_VIEWBOX, 
  RealDistrictMapMeta 
} from '../data/tamilNaduMapData';
import { 
  Phone, 
  Search, 
  Filter, 
  Eye, 
  X, 
  CheckCircle2, 
  Building2, 
  Scale, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

export const TamilNaduMap: React.FC = () => {
  const { language } = useLanguage();
  const { districts } = useData();

  // Default selection: Tiruvannamalai (TVM) matching user's reference mockup image!
  const [selectedCode, setSelectedCode] = useState<string>('TVM');
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<DistrictInfo | null>(null);
  const [showFullDirectoryModal, setShowFullDirectoryModal] = useState<boolean>(false);
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>('All');

  // Active administrative district from REAL_TN_DISTRICTS
  const activeAdminDistrict = useMemo(() => {
    return (
      REAL_TN_DISTRICTS.find((d) => d.code === selectedCode) ||
      REAL_TN_DISTRICTS.find((d) => d.code === 'TVM') ||
      REAL_TN_DISTRICTS[0]
    );
  }, [selectedCode]);

  // Retrieve matching party sub-districts for the selected administrative district
  const currentSubDistricts = useMemo(() => {
    const list = activeAdminDistrict.subDistrictIds
      .map((subId) => districts.find((d) => d.id === subId))
      .filter((d): d is DistrictInfo => Boolean(d));

    // Fallback if none mapped: search by district name prefix
    if (list.length === 0) {
      const fallback = districts.filter((d) =>
        d.name.en.toLowerCase().includes(activeAdminDistrict.name.en.toLowerCase())
      );
      if (fallback.length > 0) return fallback;
      return [districts[0]];
    }

    return list;
  }, [activeAdminDistrict, districts]);

  // Filtered 74 districts for the full directory modal
  const filtered74Districts = useMemo(() => {
    return districts.filter((d) => {
      const matchesZone = zoneFilter === 'All' || d.zone === zoneFilter;
      const q = directorySearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.name[language].toLowerCase().includes(q) ||
        d.organizer[language].toLowerCase().includes(q) ||
        d.contactPhone.includes(q) ||
        d.headquarters[language].toLowerCase().includes(q);
      return matchesZone && matchesSearch;
    });
  }, [districts, zoneFilter, directorySearch, language]);

  return (
    <div className="w-full bg-[#8A0005] text-white font-dmk-body relative overflow-hidden p-4 sm:p-8 lg:p-10 border-y-4 border-[#111111] shadow-2xl">
      
      {/* Background Graphic Watermark */}
      <div 
        className="absolute inset-0 opacity-10 bg-repeat pointer-events-none select-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 1. TOP HEADER BAR: "District Structure" + "View More ↗" Button */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/20 relative z-10">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-dmk-headline tracking-tight uppercase">
            {language === 'ta' ? 'மாவட்டக் கட்டமைப்பு' : 'District Structure'}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-dmk-body mt-1">
            {language === 'ta'
              ? 'தமிழ்நாட்டின் 38 வருவாய் மாவட்டங்களில் செயல்படும் 74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்'
              : '74 Party Legal Wing Units across all 38 Administrative Districts of Tamil Nadu & Puducherry'}
          </p>
        </div>

        {/* "View More ↗" Button (Rectangular red button, 2px radius, min 44px tall) */}
        <button
          onClick={() => setShowFullDirectoryModal(true)}
          className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-[#E31E24] hover:bg-[#111111] text-white text-xs sm:text-sm font-dmk-body font-bold uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer rounded-[2px]"
        >
          <span>{language === 'ta' ? 'அனைத்து 74 மாவட்டங்கள்' : 'View More'}</span>
          <span className="text-base leading-none">↗</span>
        </button>
      </div>

      {/* Explanatory Line: 38 Administrative Districts vs 74 Party Units */}
      <div className="mb-4 px-4 py-2.5 bg-[#630003] border border-white/20 text-xs text-white/90 font-dmk-body rounded-[2px] relative z-10">
        {language === 'ta'
          ? 'இவ்வரைபடம் தமிழ்நாட்டின் 38 வருவாய் மாவட்டங்களையும், 74 அமைப்புப் பிரிவுகளையும் காட்டுவதால், ஒரு மாவட்டத்தைத் தேர்வு செய்யும் போது இரண்டு அல்லது அதற்கு மேற்பட்ட அமைப்பாளர்கள் தோன்றலாம்.'
          : 'The map has 38 administrative districts and 74 party units, so selecting a district can show two organisers.'}
      </div>

      {/* 2. MAIN 2-COLUMN SPLIT (Real Map & Inset on Left, Leader Banner & Units on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: REAL TAMIL NADU MAP + INSET ZOOM (7 cols)    */}
        {/* ========================================================== */}
        <div className="lg:col-span-7 bg-[#780004]/95 border-2 border-white/30 p-4 sm:p-6 relative shadow-inner flex flex-col md:flex-row items-center gap-6">
          
          {/* Main Authentic Geographic Tamil Nadu Map SVG */}
          <div className="w-full md:w-3/5 aspect-[4/5] relative flex items-center justify-center">
            <svg
              viewBox={TN_MAP_VIEWBOX}
              className="w-full h-full filter drop-shadow-xl"
            >
              {/* All 37/38 Real Geographic District Polygons */}
              {REAL_TN_DISTRICTS.map((dist) => {
                const isSelected = activeAdminDistrict.code === dist.code;
                const isHovered = hoveredCode === dist.code;

                return (
                  <path
                    key={dist.code}
                    d={dist.path}
                    tabIndex={0}
                    role="button"
                    aria-label={`${dist.name.en} (${dist.name.ta}) district`}
                    onClick={() => setSelectedCode(dist.code)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCode(dist.code);
                      }
                    }}
                    onMouseEnter={() => setHoveredCode(dist.code)}
                    onMouseLeave={() => setHoveredCode(null)}
                    fill={isSelected ? '#FCE8E8' : isHovered ? '#FCE8E8' : '#FFFFFF'}
                    stroke={isSelected ? '#C41A1F' : isHovered ? '#111111' : '#8A0005'}
                    strokeWidth={isSelected ? '2' : isHovered ? '2' : '0.8'}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="cursor-pointer transition-colors duration-150 focus:outline-none focus:stroke-[#111111]"
                  >
                    <title>{dist.name.en} ({dist.name.ta})</title>
                  </path>
                );
              })}
            </svg>
          </div>

          {/* Inset Box showing Zoomed District Outline */}
          <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-4 bg-[#630003] border-2 border-white/40 shadow-xl rounded-[2px]">
            <span className="text-sm font-dmk-headline font-bold text-[#FAF8F5] text-center mb-0.5">
              {activeAdminDistrict.name[language]}
            </span>
            <span className="text-xs text-white/80 font-dmk-body mb-2">
              {language === 'ta' ? 'அமைப்பு எல்லைப் பார்வை' : 'District boundary inset'}
            </span>
            
            {/* Zoomed authentic SVG contour of that exact district */}
            <div className="w-44 h-44 relative flex items-center justify-center my-2 p-2 bg-[#4D0002]/70 border border-white/20 overflow-hidden rounded-[2px]">
              <svg 
                viewBox={activeAdminDistrict.viewBox} 
                className="w-full h-full filter drop-shadow-md"
              >
                <path
                  d={activeAdminDistrict.path}
                  fill="#FCE8E8"
                  stroke="#C41A1F"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="mt-2 text-center text-xs text-white/90 font-dmk-body space-y-1">
              <span className="inline-block px-3 py-1 bg-[#FAF8F5] text-[#111111] font-bold text-xs font-dmk-body rounded-[2px]">
                {currentSubDistricts.length} {language === 'ta' ? 'அமைப்பு மாவட்டங்கள்' : 'Party units'}
              </span>
              <p className="text-white/70 text-[11px] pt-1">
                {language === 'ta' ? 'கள வழக்கறிஞர் பாதுகாப்புப் பிரிவு' : 'Click any district to inspect cadre'}
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: LEADER BANNER & SUB-DISTRICT CARDS (5 cols)  */}
        {/* ========================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Official DMK Leadership & Rising Sun Flag Banner */}
          <div className="w-full bg-[#111111] border-2 border-white/30 overflow-hidden relative shadow-lg rounded-[2px]">
            
            {/* Top red/black dual-tone stripe */}
            <div className="h-1.5 w-full flex">
              <div className="w-1/2 bg-[#E31E24]" />
              <div className="w-1/2 bg-black" />
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              
              {/* Leader portrait + attribution */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-[2px] overflow-hidden border-2 border-[#FAF8F5] shrink-0 bg-neutral-900">
                  <img
                    src="/images/dmk-four-leaders.jpg"
                    alt="DMK Leadership"
                    className="w-full h-full object-cover object-right"
                  />
                </div>
                <div>
                  <span className="text-xs text-white/80 font-dmk-body block mb-0.5">
                    {language === 'ta' ? 'மாநிலத் தலைமை வழிகாட்டல்' : 'State executive guidance'}
                  </span>
                  <h4 className="text-base font-black text-white font-dmk-headline leading-tight">
                    {language === 'ta' ? 'மு.க. ஸ்டாலின்' : 'M.K. Stalin'}
                  </h4>
                  <p className="text-xs text-white/70 font-dmk-body">
                    {language === 'ta' ? 'கழகத் தலைவர் & முதலமைச்சர்' : 'DMK President & Chief Minister'}
                  </p>
                </div>
              </div>

              {/* DMK Flag with Rising Sun badge */}
              <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-r from-red-600 via-red-700 to-black border border-white/20 px-3 rounded-[2px]">
                <span className="text-xs font-black tracking-wider text-white uppercase font-english">
                  DMK
                </span>
                <span className="text-[9px] text-[#FAF8F5] font-bold">
                  LEGAL WING
                </span>
              </div>

            </div>
          </div>

          {/* Sub-Districts List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {currentSubDistricts.map((sub, index) => (
              <div
                key={sub.id}
                className="bg-white text-neutral-900 p-3 sm:p-3.5 border border-neutral-300 shadow-xs flex items-center justify-between gap-3 hover:border-black transition-all group rounded-[2px]"
              >
                
                {/* Number badge & Sub-district Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 bg-[#E31E24] text-white rounded-[2px] flex items-center justify-center text-xs font-english font-black shrink-0 shadow-xs">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-black font-dmk-headline text-neutral-900 group-hover:text-[#C41A1F] transition-colors truncate">
                      {sub.name[language]}
                    </h5>
                    <p className="text-[11px] text-[#5B5348] truncate font-dmk-body">
                      {sub.organizer[language]} • {sub.showPhonePublicly !== false ? (
                        <span className="font-mono text-neutral-800">{sub.contactPhone}</span>
                      ) : (
                        <span className="italic text-[#5B5348]">{language === 'ta' ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்ளவும்' : 'Contact through the State Secretariat'}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons (Eye Icon + Phone/Call Icon) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  
                  {/* View Details modal button */}
                  <button
                    onClick={() => setSelectedSubDistrict(sub)}
                    className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors rounded-[2px]"
                    title={language === 'ta' ? 'பொறுப்பாளர் விவரம்' : 'View Officer Dossier'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Direct Phone Call button (only if showPhonePublicly is not false) */}
                  {sub.showPhonePublicly !== false && (
                    <a
                      href={`tel:${sub.contactPhone}`}
                      className="p-1.5 text-neutral-500 hover:text-[#C41A1F] hover:bg-neutral-100 transition-colors rounded-[2px]"
                      title={`Call ${sub.contactPhone}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 3. SUB-DISTRICT DETAILS POPUP MODAL */}
      {selectedSubDistrict && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-neutral-900 max-w-lg w-full border-2 border-[#111111] p-6 sm:p-8 shadow-2xl relative font-dmk-body rounded-[2px]">
            
            {/* Header bar */}
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4 mb-4">
              <div>
                <span className="text-xs font-dmk-body text-[#C41A1F] block mb-1">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ மாவட்ட ஆவணம்' : 'District legal dossier'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                  {selectedSubDistrict.name[language]}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubDistrict(null)}
                className="p-1.5 text-[#5B5348] hover:text-[#111111] transition-colors rounded-[2px] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-white border border-[#D8D3CB] space-y-1 rounded-[2px]">
                <span className="text-xs font-dmk-body text-[#5B5348] block">
                  {language === 'ta' ? 'மாவட்ட அமைப்பாளர்' : 'District Organizer'}
                </span>
                <p className="text-base font-bold text-[#111111] font-dmk-headline">
                  {selectedSubDistrict.organizer[language]}
                </p>
                <p className="text-xs text-[#5B5348] font-dmk-body">
                  Senior Trial Advocate • DMK Legal Wing
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-xs font-dmk-body text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'தொலைபேசி' : 'Phone Contact'}
                  </span>
                  {selectedSubDistrict.showPhonePublicly !== false ? (
                    <a
                      href={`tel:${selectedSubDistrict.contactPhone}`}
                      className="font-mono font-bold text-[#C41A1F] hover:underline"
                    >
                      {selectedSubDistrict.contactPhone}
                    </a>
                  ) : (
                    <span className="text-xs italic text-[#5B5348] block">
                      {language === 'ta' ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்ளவும்' : 'Contact through the State Secretariat'}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-xs font-dmk-body text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'மண்டலம்' : 'Party Zone'}
                  </span>
                  <span className="font-bold text-[#111111]">
                    {selectedSubDistrict.zone}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#D8D3CB] space-y-1 rounded-[2px]">
                <span className="text-xs font-dmk-body text-[#5B5348] block">
                  {language === 'ta' ? 'நீதிமன்ற வளாகம்' : 'Attached Court Complex'}
                </span>
                <p className="text-[#111111] font-dmk-body">
                  {selectedSubDistrict.courtComplex[language]}
                </p>
              </div>

              <div className="p-3 bg-white border border-[#D8D3CB] space-y-1 rounded-[2px]">
                <span className="text-xs font-dmk-body text-[#5B5348] block">
                  {language === 'ta' ? 'மாவட்ட தலைமையகம்' : 'Headquarters'}
                </span>
                <p className="text-[#111111] font-dmk-body">
                  {selectedSubDistrict.headquarters[language]}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#D8D3CB] flex items-center justify-between">
              {selectedSubDistrict.showPhonePublicly !== false ? (
                <a
                  href={`tel:${selectedSubDistrict.contactPhone}`}
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
                onClick={() => setSelectedSubDistrict(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-dmk-body font-bold text-[#111111] hover:text-[#C41A1F] underline underline-offset-4 transition-colors cursor-pointer"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. FULL 74 DISTRICT CADRE DIRECTORY MODAL */}
      {showFullDirectoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-[#111111] max-w-5xl w-full max-h-[90vh] flex flex-col border-2 border-[#111111] shadow-2xl relative font-dmk-body rounded-[2px]">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#111111] text-white flex items-center justify-between border-b-2 border-[#E31E24]">
              <div>
                <span className="text-xs font-dmk-body text-white/80 block mb-1">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ பொறுப்பாளர் விவரக்குறிப்பு' : 'Official cadre directory'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-dmk-headline">
                  {language === 'ta' ? '74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள் முழுப் பட்டியல்' : 'Complete 74 District Legal Cadre Directory'}
                </h3>
              </div>
              <button
                onClick={() => setShowFullDirectoryModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-[2px] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-white border-b border-[#D8D3CB] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#5B5348] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்டம் அல்லது பொறுப்பாளர் தேடுக...' : 'Search district, organizer or phone...'}
                  className="w-full min-h-[44px] bg-[#FAF8F5] border border-[#D8D3CB] pl-9 pr-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111] rounded-[2px]"
                />
              </div>

              {/* Zonal Filter Tabs: Square-cornered text tabs with 3px red underline on active tab, min 44px tall */}
              <div className="flex items-center gap-2 border-b border-[#D8D3CB] overflow-x-auto w-full sm:w-auto">
                {['All', 'Chennai', 'North', 'West', 'Central', 'South'].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoneFilter(z)}
                    className={`min-h-[44px] px-3.5 py-2 text-xs font-dmk-body font-bold transition-all border-b-[3px] rounded-none cursor-pointer ${
                      zoneFilter === z
                        ? 'border-[#E31E24] text-[#111111]'
                        : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:border-[#D8D3CB]'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Table of 74 Districts */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F5]">
              <div className="border border-[#D8D3CB] bg-white overflow-x-auto rounded-[2px]">
                <table className="w-full text-left text-xs font-dmk-body">
                  <thead className="bg-[#111111] text-white font-english text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-[#5B5348] w-12 text-center">No.</th>
                      <th className="py-2.5 px-3 border-b border-[#5B5348]">District Unit</th>
                      <th className="py-2.5 px-3 border-b border-[#5B5348]">Organiser</th>
                      <th className="py-2.5 px-3 border-b border-[#5B5348]">Phone</th>
                      <th className="py-2.5 px-3 border-b border-[#5B5348]">Court Complex</th>
                      <th className="py-2.5 px-3 border-b border-[#5B5348] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D3CB]">
                    {filtered74Districts.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-[#5B5348]">
                          {item.number || idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#111111] font-dmk-headline">
                          {item.name[language]}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#111111]">
                          {item.organizer[language]}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#C41A1F]">
                          {item.showPhonePublicly !== false ? (
                            <a href={`tel:${item.contactPhone}`} className="hover:underline">
                              {item.contactPhone}
                            </a>
                          ) : (
                            <span className="text-[11px] font-dmk-body text-[#5B5348] italic font-normal">
                              {language === 'ta' ? 'செயலகம் வாயிலாக' : 'Via Secretariat'}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[#5B5348] truncate max-w-xs">
                          {item.courtComplex[language]}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedSubDistrict(item)}
                            className="p-1 hover:text-[#C41A1F] text-[#5B5348] rounded-[2px]"
                            title="View Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-[#D8D3CB] flex items-center justify-between text-xs font-dmk-body">
              <span className="text-[#5B5348]">
                Displaying <strong>{filtered74Districts.length}</strong> of <strong>74</strong> District Secretariats
              </span>
              <button
                onClick={() => setShowFullDirectoryModal(false)}
                className="min-h-[44px] px-5 py-2.5 bg-[#E31E24] hover:bg-[#111111] text-white text-xs font-dmk-body font-bold uppercase tracking-wider transition-colors rounded-[2px] cursor-pointer"
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
