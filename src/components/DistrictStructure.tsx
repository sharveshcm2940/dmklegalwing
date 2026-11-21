'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { DISTRICT_MAP_DATA, DistrictMapItem } from '@/data/districtStructureData';
import { DistrictSubUnit } from '@/types';
import { 
  ArrowUpRight, 
  Eye, 
  Download, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Scale, 
  Users, 
  ShieldCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface DistrictStructureProps {
  viewMoreLink?: string;
  isStandalonePage?: boolean;
}

export const DistrictStructure: React.FC<DistrictStructureProps> = ({
  viewMoreLink = '/districts',
  isStandalonePage = false
}) => {
  const { language } = useLanguage();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('tiruvannamalai');
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [activeUnit, setActiveUnit] = useState<DistrictSubUnit | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const selectedDistrict = DISTRICT_MAP_DATA.find((d) => d.id === selectedDistrictId) || DISTRICT_MAP_DATA[0];

  const handleDownloadRoster = (unit: DistrictSubUnit, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadSuccess(unit.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#80070D] via-[#8F0B12] to-[#6E050A] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-dmk-body">
      
      {/* Background Subtle Political Crowd / Movement Watermark */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay bg-repeat bg-center"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-6">
        
        {/* TOP BAR: "District Structure" + "View More ↗" Button */}
        <div className="flex items-center justify-between pb-2">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-dmk-headline uppercase tracking-tight drop-shadow-sm">
              {language === 'ta' ? 'மாவட்ட அமைப்பு' : 'District Structure'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200 mt-1 font-dmk-body">
              {language === 'ta'
                ? 'தமிழ்நாட்டின் 38 மாவட்ட வழக்கறிஞர் அணிகளின் படிநிலை & மண்டலப் பிரிவுகள்.'
                : 'Tamil Nadu 38 District Legal Wing Secretariats & Grassroots Organisational Units.'}
            </p>
          </div>

          <Link
            href={viewMoreLink}
            className="inline-flex items-center gap-1.5 bg-[#FFB703] hover:bg-yellow-400 text-neutral-950 font-english font-black px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
          >
            <span>{language === 'ta' ? 'மேலும் பார்க்க' : 'View More'}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* MAIN 2-COLUMN CONTAINER (Left Map + Inset / Right Leadership & Units) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: TAMIL NADU MAP + ZOOMED-IN DISTRICT INSET    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 border-2 border-white/60 rounded-3xl p-4 sm:p-6 bg-black/20 backdrop-blur-xs relative flex flex-col justify-between min-h-[500px] sm:min-h-[560px] shadow-2xl">
            
            {/* Quick District Selector Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-english mb-3 z-10">
              <span className="text-[10px] uppercase font-bold text-neutral-300 shrink-0 mr-1">
                {language === 'ta' ? 'விரைவுத் தேர்வு:' : 'Quick Select:'}
              </span>
              {DISTRICT_MAP_DATA.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDistrictId(d.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border shrink-0 ${
                      isSelected
                        ? 'bg-[#FFB703] text-neutral-950 border-[#FFB703] shadow-xs scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/30'
                    }`}
                  >
                    {d.name[language]}
                  </button>
                );
              })}
            </div>

            {/* Tamil Nadu Vector SVG Map */}
            <div className="relative flex-1 flex items-center justify-center p-2">
              <svg
                viewBox="80 40 400 600"
                className="w-full max-h-[460px] object-contain drop-shadow-xl"
              >
                <defs>
                  {/* Subtle map glow filter */}
                  <filter id="yellowGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFB703" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* State Backdrop Outline for reference */}
                <path
                  d="M 370,55 L 435,78 L 445,115 L 415,145 L 420,185 L 390,230 L 400,275 L 435,310 L 440,360 L 375,385 L 340,430 L 270,490 L 245,550 L 195,620 L 155,595 L 175,530 L 135,460 L 110,340 L 130,265 L 180,210 L 225,120 L 270,80 Z"
                  fill="#FDFDFD"
                  stroke="#8B0000"
                  strokeWidth="2.5"
                  className="opacity-90"
                />

                {/* Render District Geometries */}
                {DISTRICT_MAP_DATA.map((district) => {
                  const isSelected = selectedDistrictId === district.id;
                  const isHovered = hoveredDistrictId === district.id;

                  return (
                    <g
                      key={district.id}
                      onClick={() => setSelectedDistrictId(district.id)}
                      onMouseEnter={() => setHoveredDistrictId(district.id)}
                      onMouseLeave={() => setHoveredDistrictId(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      <path
                        d={district.path}
                        fill={
                          isSelected 
                            ? '#FFB703' 
                            : isHovered 
                            ? '#FFE082' 
                            : '#FFFFFF'
                        }
                        stroke="#80070D"
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        filter={isSelected ? 'url(#yellowGlow)' : undefined}
                        className="transition-colors duration-200"
                      />

                      {/* District ID Badge Tag */}
                      <text
                        x={district.labelX}
                        y={district.labelY}
                        fill={isSelected ? '#000000' : '#80070D'}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none select-none font-english"
                      >
                        {district.name.en.slice(0, 3).toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* INSET CARD: Zoomed In District Silhouette (Like reference image) */}
              <div className="absolute right-2 sm:right-6 bottom-4 sm:bottom-8 w-44 sm:w-56 border-2 border-white/70 rounded-2xl p-3 sm:p-4 bg-[#7A060C]/90 backdrop-blur-md shadow-2xl flex flex-col items-center text-center">
                <span className="text-[11px] font-english font-bold uppercase tracking-wider text-neutral-200 block mb-1">
                  {selectedDistrict.name[language]}
                </span>

                {/* Zoomed SVG of the active district with sub-divisions */}
                <div className="w-full aspect-[4/3] flex items-center justify-center p-2 relative">
                  <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
                    {/* Detailed multi-division district shape */}
                    <path
                      d="M 15,35 L 45,15 L 65,20 L 80,10 L 92,25 L 80,48 L 85,65 L 55,75 L 28,68 L 12,50 Z"
                      fill="#FFB703"
                      stroke="#80070D"
                      strokeWidth="2"
                    />
                    {/* Internal division demarcation lines (East, North, South, West) */}
                    <line x1="50" y1="18" x2="55" y2="73" stroke="#80070D" strokeWidth="1.5" strokeDasharray="2 1" />
                    <line x1="15" y1="35" x2="85" y2="48" stroke="#80070D" strokeWidth="1.5" strokeDasharray="2 1" />
                    
                    {/* Division labels inside inset */}
                    <text x="35" y="32" fontSize="6" fontWeight="bold" fill="#80070D" textAnchor="middle">N</text>
                    <text x="70" y="30" fontSize="6" fontWeight="bold" fill="#80070D" textAnchor="middle">E</text>
                    <text x="35" y="60" fontSize="6" fontWeight="bold" fill="#80070D" textAnchor="middle">W</text>
                    <text x="70" y="62" fontSize="6" fontWeight="bold" fill="#80070D" textAnchor="middle">S</text>
                  </svg>
                </div>

                <div className="mt-1 pt-1 border-t border-white/20 w-full flex items-center justify-between text-[10px] font-english text-neutral-300">
                  <span>{selectedDistrict.units.length} Units</span>
                  <span className="text-[#FFB703] font-bold">{selectedDistrict.zone} Zone</span>
                </div>
              </div>

            </div>

            {/* Bottom Status bar */}
            <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-english text-neutral-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#FFB703] rounded-sm inline-block" />
                <span>{language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட மாவட்டம்:' : 'Active District:'} <strong>{selectedDistrict.name[language]}</strong></span>
              </span>
              <span className="text-neutral-400">
                {language === 'ta' ? 'வரைபடத்தில் மாவட்டங்களை அழுத்தி மாற்றலாம்' : 'Click any district node to switch units'}
              </span>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: LEADERSHIP BANNER + DISTRICT SUB-UNITS LIST  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 border-2 border-white/60 rounded-3xl p-4 sm:p-6 bg-black/20 backdrop-blur-xs flex flex-col justify-between shadow-2xl space-y-4">
            
            {/* 1. POLITICAL LEADERSHIP BANNER (DMK Red & Black Flag + Rising Sun + Leadership salute) */}
            <div className="rounded-2xl overflow-hidden border-2 border-white/50 relative shadow-xl h-40 sm:h-44 w-full bg-gradient-to-r from-black via-[#111111] to-[#E31E24] flex items-center justify-between px-4 sm:px-6">
              
              {/* Dual tone party flag diagonal split */}
              <div className="absolute inset-0 flex pointer-events-none">
                <div className="w-1/2 bg-black opacity-90" />
                <div className="w-1/2 bg-[#E31E24] opacity-90" />
              </div>

              {/* Radiant Sun Rays in center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FFB703]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Left: Saluting / Welcoming Leadership Figure */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-lg bg-neutral-900 shrink-0">
                  <img
                    src="/images/dmk-campaign-stalin.jpg"
                    alt="Chief Minister M.K. Stalin"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="text-white drop-shadow-md">
                  <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#FFB703] block">
                    {language === 'ta' ? 'கழகத் தலைமை' : 'DMK HIGH COMMAND'}
                  </span>
                  <h4 className="text-sm sm:text-base font-black font-dmk-headline leading-tight">
                    {language === 'ta' ? 'மு.க. ஸ்டாலின்' : 'M.K. Stalin'}
                  </h4>
                  <p className="text-[11px] text-neutral-200 font-dmk-body">
                    {language === 'ta' ? 'கழகத் தலைவர்' : 'Party President'}
                  </p>
                </div>
              </div>

              {/* Center/Right: Golden Rising Sun Emblem + Scales of Justice */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-xs p-1.5 border border-white/40 flex items-center justify-center shadow-lg">
                  <img
                    src="/images/dmk-flag-sun.jpg"
                    alt="DMK Rising Sun Emblem"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="text-[9px] font-english font-black uppercase tracking-widest text-[#FFB703] mt-1">
                  LEGAL WING
                </span>
              </div>

            </div>

            {/* 2. LIST OF DISTRICT SUB-UNITS (1, 2, 3, 4 cards matching user's image) */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {selectedDistrict.units.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => setActiveUnit(unit)}
                  className="bg-white hover:bg-neutral-50 text-neutral-900 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-all cursor-pointer border border-neutral-100 group"
                >
                  {/* Left: Red Number Badge + Unit Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#80070D] text-white flex items-center justify-center text-xs sm:text-sm font-black shrink-0 font-english shadow-xs">
                      {unit.number}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-neutral-900 font-dmk-headline group-hover:text-[#80070D] transition-colors truncate">
                        {unit.name[language]}
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-dmk-body truncate">
                        {unit.organizer[language]}
                      </p>
                    </div>
                  </div>

                  {/* Right: Eye (Inspect) & Download Icons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveUnit(unit);
                      }}
                      className="w-8 h-8 rounded-lg bg-[#FAF7F2] hover:bg-neutral-900 text-neutral-700 hover:text-white flex items-center justify-center transition-colors border border-neutral-300 shadow-2xs"
                      title={language === 'ta' ? 'அமைப்பாளர் விவரம்' : 'View Team Details'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDownloadRoster(unit, e)}
                      className="w-8 h-8 rounded-lg bg-[#FAF7F2] hover:bg-[#80070D] text-neutral-700 hover:text-white flex items-center justify-center transition-colors border border-neutral-300 shadow-2xs"
                      title={language === 'ta' ? 'வழக்கறிஞர் பட்டியல் பதிவிறக்கம்' : 'Download Roster'}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Toast Notification */}
            {downloadSuccess && (
              <div className="bg-emerald-600 text-white text-xs p-2.5 rounded-xl flex items-center gap-2 font-english animate-fade-in shadow-md">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'ta' 
                    ? 'வழக்கறிஞர் அதிகாரப்பூர்வ பட்டியல் பதிவிறக்கம் செய்யப்பட்டது!' 
                    : 'Official advocate roster downloaded successfully!'}
                </span>
              </div>
            )}

            {/* Bottom Headquarters Link */}
            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-english text-neutral-300">
              <span className="flex items-center gap-1 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
                DMK Legal Wing State Cadre
              </span>
              <Link 
                href="/structure"
                className="hover:text-[#FFB703] underline font-bold"
              >
                {language === 'ta' ? 'மாநிலப் படிநிலை' : 'View Full Hierarchy'} &rarr;
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE MODAL: DISTRICT SUB-UNIT CADRE DOSSIER        */}
      {/* ========================================================= */}
      {activeUnit && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveUnit(null)}
        >
          <div 
            className="bg-white border-2 border-neutral-900 max-w-lg w-full p-6 sm:p-8 rounded-3xl relative shadow-2xl text-neutral-900 font-dmk-body overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Red/Black Dual-tone Band */}
            <div className="absolute top-0 left-0 right-0 h-2 flex">
              <div className="w-1/2 bg-black" />
              <div className="w-1/2 bg-[#80070D]" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveUnit(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#FAF7F2] hover:bg-neutral-900 hover:text-white rounded-full flex items-center justify-center transition-colors border border-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mt-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#80070D] text-white flex items-center justify-center text-xs font-bold font-english">
                    {activeUnit.number}
                  </span>
                  <span className="text-xs font-english font-bold uppercase tracking-wider text-[#80070D] bg-[#FFF5F5] px-2 py-0.5 border border-[#80070D] rounded">
                    {selectedDistrict.name[language]} • {activeUnit.name[language]}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-neutral-900 font-dmk-headline">
                  {activeUnit.name[language]}
                </h3>
              </div>

              {/* Lead Organizer Plate */}
              <div className="bg-[#FAF7F2] border border-neutral-300 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-english font-bold uppercase tracking-widest text-neutral-500 block">
                  {language === 'ta' ? 'மாவட்ட அமைப்பாளர்:' : 'DISTRICT ORGANIZER:'}
                </span>
                <h4 className="text-lg font-bold text-neutral-900 font-dmk-headline">
                  {activeUnit.organizer[language]}
                </h4>
                <p className="text-xs text-neutral-600 font-dmk-body">
                  {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி பொறுப்பாளர்' : 'DMK Legal Wing In-Charge Advocate'}
                </p>
              </div>

              {/* Jurisdiction & Court Complex */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-neutral-700">
                  <Building2 className="w-4 h-4 text-[#80070D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900">{language === 'ta' ? 'நீதிமன்ற வளாகம்:' : 'Court Complex:'}</strong>
                    <span>{activeUnit.court[language]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#FDFBF7] border border-neutral-200 p-2.5 rounded-lg text-center">
                    <span className="text-[10px] text-neutral-500 uppercase font-english block">{language === 'ta' ? 'வழக்கறிஞர்கள்' : 'Cadre Advocates'}</span>
                    <span className="text-lg font-black text-neutral-900 font-english">{activeUnit.memberCount}+</span>
                  </div>
                  <div className="bg-[#FDFBF7] border border-neutral-200 p-2.5 rounded-lg text-center">
                    <span className="text-[10px] text-neutral-500 uppercase font-english block">{language === 'ta' ? 'மக்கள் சட்ட உதவிகள்' : 'Legal Aid Clinics'}</span>
                    <span className="text-lg font-black text-[#80070D] font-english">{activeUnit.activeCases}+</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-english text-neutral-700">
                <a
                  href={`tel:${activeUnit.phone}`}
                  className="flex items-center gap-1.5 hover:text-[#80070D] font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#80070D]" />
                  <span>{activeUnit.phone}</span>
                </a>
                <a
                  href={`mailto:${activeUnit.email}`}
                  className="flex items-center gap-1.5 hover:text-[#80070D] font-semibold truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-[#80070D]" />
                  <span className="truncate">{activeUnit.email}</span>
                </a>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={(e) => handleDownloadRoster(activeUnit, e)}
                  className="w-full bg-[#80070D] hover:bg-neutral-900 text-white py-2.5 rounded-xl font-english font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ta' ? 'வழக்கறிஞர் பட்டியல் பதிவிறக்கம்' : 'Download Advocate Cadre Roster'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
