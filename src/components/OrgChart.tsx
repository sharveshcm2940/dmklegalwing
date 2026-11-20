'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { OFFICIAL_HIERARCHY_CHART } from '../data/content';
import { FlowchartOfficer } from '../types';
import { 
  Search, 
  MapPin, 
  Scale, 
  Award, 
  ChevronRight, 
  X, 
  Shield, 
  Building,
  Mail,
  Phone,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const OrgChart: React.FC = () => {
  const { language } = useLanguage();
  const [selectedOfficer, setSelectedOfficer] = useState<FlowchartOfficer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [activeBranchFilter, setActiveBranchFilter] = useState<'all' | 'joint' | 'deputy' | 'headoffice'>('all');

  const { president, secretary, jointSecretaries, deputySecretaries, headOfficeAdvocates } = OFFICIAL_HIERARCHY_CHART;

  // Aggregate all 25 officers into a single flat array for search and filter calculations
  const allOfficers: FlowchartOfficer[] = useMemo(() => [
    president,
    secretary,
    ...jointSecretaries,
    ...deputySecretaries,
    ...headOfficeAdvocates
  ], [president, secretary, jointSecretaries, deputySecretaries, headOfficeAdvocates]);

  // List of unique districts with counts
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allOfficers.forEach((o) => {
      const dist = o.district[language];
      counts[dist] = (counts[dist] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allOfficers, language]);

  // Check if an officer matches current search and district filters
  const isMatch = (officer: FlowchartOfficer): boolean => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      officer.name[language].toLowerCase().includes(q) ||
      officer.district[language].toLowerCase().includes(q) ||
      officer.designation[language].toLowerCase().includes(q) ||
      officer.role[language].toLowerCase().includes(q);

    const matchesDistrict =
      selectedDistrict === 'all' ||
      officer.district[language].toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesDistrict;
  };

  // Check if any filter is active
  const hasActiveFilter = searchQuery.trim() !== '' || selectedDistrict !== 'all';

  return (
    <div className="w-full space-y-8 font-dmk-body text-[#111111]">

      {/* Top Editorial Bar: Status, District Filter & Search */}
      <div className="bg-white border-2 border-neutral-900 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block animate-pulse" />
              <span className="text-[11px] font-english font-bold uppercase tracking-[0.2em] text-[#E31E24]">
                {language === 'ta' ? 'அதிகாரப்பூர்வ தலைமைப் படிநிலை' : 'OFFICIAL STATE LEADERSHIP FLOWCHART'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 font-dmk-headline tracking-tight">
              {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி - மாநிலக் கட்டமைப்பு' : 'DMK Legal Wing — Executive Hierarchy Tree'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-dmk-body">
              {language === 'ta'
                ? 'தலைவர், செயலாளர் வழிகாட்டலில் இயங்கும் 25 மாநில தலைமைப் பொறுப்பாளர்கள் மற்றும் 3 செயல் பிரிவுகள்.'
                : 'A structured 3-tier constitutional hierarchy connecting the President, Secretary, and three executive wings across Tamil Nadu.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'பெயர் அல்லது ஊர் தேடுக...' : 'Search officer or district...'}
              className="w-full bg-[#FAF7F2] border border-neutral-300 pl-10 pr-9 py-2.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-dmk-body"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* District Filter Chips */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-english font-bold uppercase tracking-wider text-neutral-500 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#E31E24]" />
            {language === 'ta' ? 'மாவட்டம்:' : 'Filter Station:'}
          </span>

          <button
            onClick={() => setSelectedDistrict('all')}
            className={`px-3 py-1 text-xs font-english font-bold uppercase tracking-wider transition-all border ${
              selectedDistrict === 'all'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-[#FAF7F2] text-neutral-700 hover:text-black hover:bg-neutral-200 border-neutral-300'
            }`}
          >
            {language === 'ta' ? 'அனைத்தும் (25)' : 'All Stations (25)'}
          </button>

          {districtCounts.map(([district, count]) => {
            const isSelected = selectedDistrict.toLowerCase() === district.toLowerCase();
            return (
              <button
                key={district}
                onClick={() => setSelectedDistrict(isSelected ? 'all' : district)}
                className={`px-2.5 py-1 text-xs font-english transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#E31E24] text-white border-[#E31E24] font-bold shadow-xs'
                    : 'bg-white text-neutral-700 hover:border-neutral-900 border-neutral-300'
                }`}
              >
                <span>{district}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white text-[#E31E24] font-bold' : 'bg-neutral-100 text-neutral-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flowchart Tree Canvas */}
      <div className="bg-[#FAF7F2] border-2 border-neutral-900 p-6 sm:p-10 relative overflow-hidden">
        
        {/* Subtle decorative background watermark badge */}
        <div className="absolute right-6 top-6 opacity-5 pointer-events-none select-none">
          <Scale className="w-64 h-64 text-neutral-900" />
        </div>

        {/* ============================================================== */}
        {/* TIER 1: PRESIDENT (APEX)                                       */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-300 shadow-2xs text-[11px] font-english font-bold uppercase tracking-widest text-[#E31E24] mb-3">
            <Shield className="w-3.5 h-3.5 text-[#E31E24]" />
            <span>{language === 'ta' ? 'மாநிலத் தலைமை • தலைவர்' : 'APEX LEADERSHIP • PRESIDENT'}</span>
          </div>

          <div
            onClick={() => setSelectedOfficer(president)}
            className={`group cursor-pointer bg-white border-2 transition-all p-6 max-w-xl w-full text-center relative shadow-sm hover:shadow-md ${
              isMatch(president)
                ? 'border-neutral-900 ring-2 ring-[#E31E24]'
                : hasActiveFilter
                ? 'border-neutral-200 opacity-40'
                : 'border-neutral-900 hover:border-[#E31E24]'
            }`}
          >
            {/* Top red header hairline */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E31E24]" />

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-english font-bold uppercase tracking-[0.2em] text-[#E31E24] mb-1">
                {president.designation[language]}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors">
                {president.name[language]}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-1 font-dmk-body">
                {president.role[language]}
              </p>
              
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 font-english font-bold text-neutral-800 bg-[#FAF7F2] px-2.5 py-0.5 border border-neutral-300">
                  <MapPin className="w-3 h-3 text-[#E31E24]" />
                  {president.district[language]}
                </span>
                <span className="text-neutral-400">•</span>
                <span className="font-english text-[11px] text-[#B81318] font-bold">
                  {president.court}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-english">
              <span>{language === 'ta' ? 'முன்னாள் தலைமை வழக்கறிஞர்' : 'Former Advocate General, TN'}</span>
              <span className="text-neutral-900 font-bold group-hover:text-[#E31E24] flex items-center gap-0.5 font-dmk-headline">
                {language === 'ta' ? 'முழு விவரம்' : 'View Profile'} &rarr;
              </span>
            </div>
          </div>

          {/* Vertical Connecting Line with Flow Arrow */}
          <div className="flex flex-col items-center my-1 select-none">
            <div className="w-[3px] h-8 bg-neutral-900" />
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-neutral-900" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* TIER 2: SECRETARY (EXECUTIVE)                                  */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center relative z-10 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-300 shadow-2xs text-[11px] font-english font-bold uppercase tracking-widest text-neutral-800 mb-3">
            <Award className="w-3.5 h-3.5 text-[#E31E24]" />
            <span>{language === 'ta' ? 'மாநிலச் செயலகம் • செயலாளர்' : 'EXECUTIVE SECRETARIAT • SECRETARY'}</span>
          </div>

          <div
            onClick={() => setSelectedOfficer(secretary)}
            className={`group cursor-pointer bg-white border-2 transition-all p-6 max-w-xl w-full text-center relative shadow-sm hover:shadow-md ${
              isMatch(secretary)
                ? 'border-neutral-900 ring-2 ring-[#E31E24]'
                : hasActiveFilter
                ? 'border-neutral-200 opacity-40'
                : 'border-neutral-900 hover:border-[#E31E24]'
            }`}
          >
            {/* Top black/red split bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="w-1/2 bg-neutral-900" />
              <div className="w-1/2 bg-[#E31E24]" />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-english font-bold uppercase tracking-[0.2em] text-[#E31E24] mb-1">
                {secretary.designation[language]}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors">
                {secretary.name[language]}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-1 font-dmk-body">
                {secretary.role[language]}
              </p>
              
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 font-english font-bold text-neutral-800 bg-[#FAF7F2] px-2.5 py-0.5 border border-neutral-300">
                  <MapPin className="w-3 h-3 text-[#E31E24]" />
                  {secretary.district[language]}
                </span>
                <span className="text-neutral-400">•</span>
                <span className="font-english text-[11px] text-[#B81318] font-bold">
                  {secretary.court}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-english">
              <span>{language === 'ta' ? 'மாநிலங்களவை உறுப்பினர்' : 'Member of Parliament (Rajya Sabha)'}</span>
              <span className="text-neutral-900 font-bold group-hover:text-[#E31E24] flex items-center gap-0.5 font-dmk-headline">
                {language === 'ta' ? 'முழு விவரம்' : 'View Profile'} &rarr;
              </span>
            </div>
          </div>

          {/* Flowchart Branching Connector (Stem -> Horizontal Bar -> 3 Drops) */}
          <div className="w-full max-w-5xl flex flex-col items-center mt-1">
            {/* Center stem down */}
            <div className="w-[3px] h-8 bg-neutral-900" />

            {/* Horizontal Busbar spanning across the 3 columns (hidden on mobile, displayed on md+) */}
            <div className="hidden md:block w-full h-[3px] bg-neutral-900 relative">
              {/* Left drop anchor dot */}
              <div className="absolute left-[16.6%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#E31E24] rounded-full border-2 border-white" />
              {/* Center drop anchor dot */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#E31E24] rounded-full border-2 border-white" />
              {/* Right drop anchor dot */}
              <div className="absolute left-[83.3%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#E31E24] rounded-full border-2 border-white" />
            </div>

            {/* Three Downward Arrow Drops */}
            <div className="hidden md:grid grid-cols-3 w-full">
              <div className="flex flex-col items-center">
                <div className="w-[3px] h-8 bg-neutral-900" />
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-neutral-900" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[3px] h-8 bg-neutral-900" />
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-neutral-900" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[3px] h-8 bg-neutral-900" />
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-neutral-900" />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TIER 3: THREE PARALLEL COLUMNS                                  */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-start">
          
          {/* ========================================== */}
          {/* COLUMN 1: JOINT SECRETARIES (9)            */}
          {/* ========================================== */}
          <div className="bg-white border-2 border-neutral-900 shadow-sm flex flex-col h-full">
            <div className="p-4 sm:p-5 bg-white border-b-2 border-neutral-900 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31E24]" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-english font-bold uppercase tracking-wider text-neutral-500">
                  {language === 'ta' ? 'படிநிலை 3.1' : 'TIER 3.1 • EXECUTIVE'}
                </span>
                <span className="bg-[#E31E24] text-white text-xs font-english font-bold px-2 py-0.5">
                  9 {language === 'ta' ? 'பொறுப்பாளர்கள்' : 'OFFICERS'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 font-dmk-headline">
                {language === 'ta' ? 'இணைச் செயலாளர்கள் (9)' : 'Joint Secretaries (9)'}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 font-dmk-body">
                {language === 'ta'
                  ? 'மண்டல ஒருங்கிணைப்பு & உயர்நீதிமன்ற வழக்கறிஞர் வழிகாட்டுதல்'
                  : 'Zonal Administration & Regional Bar Coordination'}
              </p>
            </div>

            <div className="p-3 sm:p-4 space-y-2.5 flex-1 bg-[#FDFBF7]">
              {jointSecretaries.map((officer, index) => {
                const matched = isMatch(officer);
                return (
                  <div
                    key={officer.id}
                    onClick={() => setSelectedOfficer(officer)}
                    className={`p-3 bg-white border transition-all cursor-pointer relative group flex items-start justify-between gap-3 ${
                      matched
                        ? 'border-neutral-900 hover:border-[#E31E24] shadow-2xs hover:shadow-xs'
                        : hasActiveFilter
                        ? 'border-neutral-200 opacity-30'
                        : 'border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="text-[11px] font-english font-black text-[#E31E24] shrink-0 pt-0.5">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors truncate">
                          {officer.name[language]}
                        </h4>
                        <p className="text-[11px] text-neutral-600 truncate font-dmk-body">
                          {officer.role[language]}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-english font-bold text-neutral-800 bg-[#FAF7F2] px-2 py-0.5 border border-neutral-300 shrink-0">
                      <MapPin className="w-2.5 h-2.5 text-[#E31E24]" />
                      {officer.district[language]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================== */}
          {/* COLUMN 2: DEPUTY SECRETARIES (5)           */}
          {/* ========================================== */}
          <div className="bg-white border-2 border-neutral-900 shadow-sm flex flex-col h-full">
            <div className="p-4 sm:p-5 bg-white border-b-2 border-neutral-900 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-900" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-english font-bold uppercase tracking-wider text-neutral-500">
                  {language === 'ta' ? 'படிநிலை 3.2' : 'TIER 3.2 • EXECUTIVE'}
                </span>
                <span className="bg-neutral-900 text-white text-xs font-english font-bold px-2 py-0.5">
                  5 {language === 'ta' ? 'பொறுப்பாளர்கள்' : 'OFFICERS'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 font-dmk-headline">
                {language === 'ta' ? 'துணைச் செயலாளர்கள் (5)' : 'Deputy Secretaries (5)'}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 font-dmk-body">
                {language === 'ta'
                  ? 'தலைமைச் செயலகப் பணிகள் & இளைஞர் வழக்கறிஞர் பாசறை'
                  : 'Operations, Cadre Liaison & Training Portfolios'}
              </p>
            </div>

            <div className="p-3 sm:p-4 space-y-2.5 flex-1 bg-[#FDFBF7]">
              {deputySecretaries.map((officer, index) => {
                const matched = isMatch(officer);
                return (
                  <div
                    key={officer.id}
                    onClick={() => setSelectedOfficer(officer)}
                    className={`p-3 bg-white border transition-all cursor-pointer relative group flex items-start justify-between gap-3 ${
                      matched
                        ? 'border-neutral-900 hover:border-[#E31E24] shadow-2xs hover:shadow-xs'
                        : hasActiveFilter
                        ? 'border-neutral-200 opacity-30'
                        : 'border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="text-[11px] font-english font-black text-[#E31E24] shrink-0 pt-0.5">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors truncate">
                          {officer.name[language]}
                        </h4>
                        <p className="text-[11px] text-neutral-600 truncate font-dmk-body">
                          {officer.role[language]}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-english font-bold text-neutral-800 bg-[#FAF7F2] px-2 py-0.5 border border-neutral-300 shrink-0">
                      <MapPin className="w-2.5 h-2.5 text-[#E31E24]" />
                      {officer.district[language]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================== */}
          {/* COLUMN 3: HEAD OFFICE ADVOCATES (9)        */}
          {/* ========================================== */}
          <div className="bg-white border-2 border-neutral-900 shadow-sm flex flex-col h-full">
            <div className="p-4 sm:p-5 bg-white border-b-2 border-neutral-900 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31E24]" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-english font-bold uppercase tracking-wider text-neutral-500">
                  {language === 'ta' ? 'படிநிலை 3.3' : 'TIER 3.3 • HEADQUARTERS'}
                </span>
                <span className="bg-[#E31E24] text-white text-xs font-english font-bold px-2 py-0.5">
                  9 {language === 'ta' ? 'வழக்கறிஞர்கள்' : 'ADVOCATES'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 font-dmk-headline">
                {language === 'ta' ? 'தலைமையக வழக்கறிஞர்கள் (9)' : 'Head Office Advocates (9)'}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 font-dmk-body">
                {language === 'ta'
                  ? 'அண்ணா அறிவாலயம் & கடலோர டெல்டா வழக்கறிஞர் ஒருங்கிணைப்பு'
                  : 'Anna Arivalayam Secretariat & Regional Bench Liaisons'}
              </p>
            </div>

            <div className="p-3 sm:p-4 space-y-2.5 flex-1 bg-[#FDFBF7]">
              {headOfficeAdvocates.map((officer, index) => {
                const matched = isMatch(officer);
                return (
                  <div
                    key={officer.id}
                    onClick={() => setSelectedOfficer(officer)}
                    className={`p-3 bg-white border transition-all cursor-pointer relative group flex items-start justify-between gap-3 ${
                      matched
                        ? 'border-neutral-900 hover:border-[#E31E24] shadow-2xs hover:shadow-xs'
                        : hasActiveFilter
                        ? 'border-neutral-200 opacity-30'
                        : 'border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="text-[11px] font-english font-black text-[#E31E24] shrink-0 pt-0.5">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors truncate">
                          {officer.name[language]}
                        </h4>
                        <p className="text-[11px] text-neutral-600 truncate font-dmk-body">
                          {officer.role[language]}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-english font-bold text-neutral-800 bg-[#FAF7F2] px-2 py-0.5 border border-neutral-300 shrink-0">
                      <MapPin className="w-2.5 h-2.5 text-[#E31E24]" />
                      {officer.district[language]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Dossier Modal */}
      {selectedOfficer && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedOfficer(null)}
        >
          <div 
            className="bg-white border-2 border-neutral-900 max-w-xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] font-dmk-body"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top party red/black hairline banner */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="w-1/2 bg-black" />
              <div className="w-1/2 bg-[#E31E24]" />
            </div>

            <button
              onClick={() => setSelectedOfficer(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#FAF7F2] hover:bg-neutral-900 hover:text-white text-neutral-800 flex items-center justify-center font-bold text-sm transition-colors border border-neutral-300"
              aria-label="Close dossier"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mt-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-english font-bold uppercase tracking-[0.2em] text-[#E31E24] bg-[#FFF5F5] px-2 py-0.5 border border-[#E31E24]">
                    {selectedOfficer.designation[language]}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-english font-bold text-neutral-700 bg-[#FAF7F2] px-2 py-0.5 border border-neutral-300">
                    <MapPin className="w-3 h-3 text-[#E31E24]" />
                    {selectedOfficer.district[language]}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline">
                  {selectedOfficer.name[language]}
                </h3>
                <p className="text-sm font-semibold text-neutral-700 mt-0.5 font-dmk-body">
                  {selectedOfficer.role[language]}
                </p>
              </div>

              {selectedOfficer.court && (
                <div className="bg-[#FAF7F2] border border-neutral-300 p-3 text-xs">
                  <span className="text-[10px] font-english font-bold text-neutral-500 uppercase tracking-wider block mb-0.5">
                    {language === 'ta' ? 'நீதிமன்ற ஆளுகை / பணித்துறை' : 'COURT JURISDICTION & BAR'}
                  </span>
                  <span className="font-english font-bold text-neutral-900">
                    {selectedOfficer.court}
                  </span>
                  {selectedOfficer.barCouncilNo && (
                    <span className="block text-neutral-600 font-english mt-0.5">
                      Bar Council Reg: {selectedOfficer.barCouncilNo}
                    </span>
                  )}
                </div>
              )}

              {selectedOfficer.bio && (
                <div>
                  <span className="text-[10px] font-english font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    {language === 'ta' ? 'பொறுப்பாளர் அறிமுகம் & களப்பணிகள்' : 'OFFICER PROFILE & CADRE PORTFOLIO'}
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-dmk-body">
                    {selectedOfficer.bio[language]}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs font-english text-neutral-600">
                <span className="flex items-center gap-1.5 font-bold text-neutral-900">
                  <CheckCircle2 className="w-4 h-4 text-[#E31E24]" />
                  DMK Legal Wing State Executive
                </span>
                <span className="text-neutral-500">
                  Anna Arivalayam, Chennai
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
