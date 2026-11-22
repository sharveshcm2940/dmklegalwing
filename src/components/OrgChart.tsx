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
  Users,
  Layers
} from 'lucide-react';

export const OrgChart: React.FC = () => {
  const { language } = useLanguage();
  const [selectedOfficer, setSelectedOfficer] = useState<FlowchartOfficer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');

  const { president, secretary, jointSecretaries, deputySecretaries, headOfficeAdvocates } = OFFICIAL_HIERARCHY_CHART;

  const allOfficers: FlowchartOfficer[] = useMemo(() => [
    president,
    secretary,
    ...jointSecretaries,
    ...deputySecretaries,
    ...headOfficeAdvocates
  ], [president, secretary, jointSecretaries, deputySecretaries, headOfficeAdvocates]);

  const isMatched = (officer: FlowchartOfficer): boolean => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      officer.name[language].toLowerCase().includes(q) ||
      officer.district[language].toLowerCase().includes(q) ||
      officer.designation[language].toLowerCase().includes(q) ||
      officer.role[language].toLowerCase().includes(q);

    const matchesCity =
      selectedCityFilter === 'all' ||
      officer.district[language].toLowerCase() === selectedCityFilter.toLowerCase();

    return matchesSearch && matchesCity;
  };

  const hasFilter = searchQuery.trim() !== '' || selectedCityFilter !== 'all';

  return (
    <div className="w-full space-y-6 font-dmk-body text-[#111111]">

      {/* Top Filter and Search Bar */}
      <div className="bg-white border-2 border-[#111111] p-5 sm:p-6 shadow-xs rounded-[2px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block" />
              <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#C41A1F]">
                {language === 'ta' ? 'அதிகாரப்பூர்வ படிநிலை வரைபடம்' : 'EXECUTIVE COMMAND HIERARCHY'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
              {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி தலைமைப் படிநிலை' : 'DMK Legal Wing Organisational Chart'}
            </h3>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#5B5348] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'பொறுப்பாளர் அல்லது ஊர் தேடுக...' : 'Search officer or station...'}
              className="w-full bg-[#FAF8F5] border border-[#D8D3CB] pl-9 pr-8 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111] rounded-[2px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5B5348] hover:text-[#111111] rounded-[2px]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Flowchart Canvas */}
      <div className="bg-[#FAF8F5] border-2 border-[#111111] p-6 sm:p-12 relative overflow-x-auto shadow-xs rounded-[2px]">
        
        <div className="min-w-[760px] flex flex-col items-center">
          
          {/* ========================================================== */}
          {/* LEVEL 1: PRESIDENT                                         */}
          {/* ========================================================== */}
          <div className="flex flex-col items-center relative z-10 w-full max-w-md">
            
            <div
              onClick={() => setSelectedOfficer(president)}
              className={`w-full bg-white border-2 transition-all p-4 text-center cursor-pointer relative shadow-xs group hover:border-[#E31E24] rounded-[2px] ${
                isMatched(president)
                  ? 'border-[#111111] ring-2 ring-[#E31E24]'
                  : hasFilter
                  ? 'border-[#D8D3CB] opacity-40'
                  : 'border-[#111111]'
              }`}
            >
              {/* Top Accent Header Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#111111]" />

              <span className="text-[11px] font-english font-bold uppercase tracking-widest text-[#C41A1F] block mb-0.5">
                {president.designation[language]}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline group-hover:text-[#C41A1F] transition-colors">
                {president.name[language]}
              </h2>
              <p className="text-xs text-[#5B5348] font-dmk-body mt-0.5">
                {president.role[language]} • <span className="font-semibold text-[#111111]">{president.district[language]}</span>
              </p>
            </div>

            {/* Connecting Vertical Line with Downward Arrow */}
            <div className="flex flex-col items-center my-0.5 select-none">
              <div className="w-[2px] h-8 bg-[#111111]" />
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#111111]" />
            </div>

          </div>

          {/* ========================================================== */}
          {/* LEVEL 2: SECRETARY                                         */}
          {/* ========================================================== */}
          <div className="flex flex-col items-center relative z-10 w-full max-w-md">
            
            <div
              onClick={() => setSelectedOfficer(secretary)}
              className={`w-full bg-white border-2 transition-all p-4 text-center cursor-pointer relative shadow-xs group hover:border-[#E31E24] rounded-[2px] ${
                isMatched(secretary)
                  ? 'border-[#111111] ring-2 ring-[#E31E24]'
                  : hasFilter
                  ? 'border-[#D8D3CB] opacity-40'
                  : 'border-[#111111]'
              }`}
            >
              {/* Dual Red / Black Header Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="w-1/2 bg-black" />
                <div className="w-1/2 bg-[#E31E24]" />
              </div>

              <span className="text-[11px] font-english font-bold uppercase tracking-widest text-[#C41A1F] block mb-0.5">
                {secretary.designation[language]}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline group-hover:text-[#C41A1F] transition-colors">
                {secretary.name[language]}
              </h2>
              <p className="text-xs text-[#5B5348] font-dmk-body mt-0.5">
                {secretary.role[language]} • <span className="font-semibold text-[#111111]">{secretary.district[language]}</span>
              </p>
            </div>

            {/* Tree Branching Stem to 3 Columns */}
            <div className="w-full flex flex-col items-center select-none">
              <div className="w-[2px] h-8 bg-[#111111]" />
            </div>

          </div>

          {/* ========================================================== */}
          {/* LEVEL 3: THREE PARALLEL BRANCHES                           */}
          {/* ========================================================== */}
          <div className="w-full max-w-5xl">
            
            {/* Horizontal Busbar connecting the 3 columns */}
            <div className="w-full relative h-[2px] bg-[#111111]">
              <div className="absolute left-[16.6%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#E31E24] rounded-[2px]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#E31E24] rounded-[2px]" />
              <div className="absolute left-[83.3%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#E31E24] rounded-[2px]" />
            </div>

            {/* Three Drop Arrows */}
            <div className="grid grid-cols-3 w-full">
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-6 bg-[#111111]" />
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#111111]" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-6 bg-[#111111]" />
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#111111]" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-6 bg-[#111111]" />
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#111111]" />
              </div>
            </div>

            {/* Three Parallel Content Containers */}
            <div className="grid grid-cols-3 gap-5 mt-2">
              
              {/* ---------------------------------------------------- */}
              {/* BRANCH 1: JOINT SECRETARIES (9)                      */}
              {/* ---------------------------------------------------- */}
              <div className="bg-white border-2 border-[#111111] p-4 shadow-xs flex flex-col justify-between rounded-[2px]">
                <div>
                  <div className="border-b-2 border-[#111111] pb-2 mb-3">
                    <h4 className="text-base font-black text-[#111111] font-dmk-headline">
                      {language === 'ta' ? 'இணைச் செயலாளர்கள் (9)' : 'Joint Secretaries (9)'}
                    </h4>
                    <span className="text-[10px] font-english uppercase tracking-wider text-[#C41A1F] font-bold">
                      Zonal Coordination & Bar Liaison
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs font-dmk-body">
                    {jointSecretaries.map((officer) => (
                      <li
                        key={officer.id}
                        onClick={() => setSelectedOfficer(officer)}
                        className={`p-2 border border-[#D8D3CB] hover:border-[#111111] hover:bg-[#FAF8F5] transition-colors cursor-pointer group flex items-center justify-between gap-2 rounded-[2px] ${
                          isMatched(officer)
                            ? 'bg-[#FAF8F5] border-[#111111] font-bold'
                            : hasFilter
                            ? 'opacity-30'
                            : ''
                        }`}
                      >
                        <span className="font-bold text-[#111111] group-hover:text-[#C41A1F] transition-colors truncate">
                          {officer.name[language]}
                        </span>
                        <span className="text-[11px] font-english text-[#5B5348] shrink-0">
                          • {officer.district[language]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-2 border-t border-[#D8D3CB] text-center">
                  <span className="text-[10px] font-english text-[#5B5348]">
                    9 Advocates • Apex Secretariat
                  </span>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* BRANCH 2: DEPUTY SECRETARIES (5)                     */}
              {/* ---------------------------------------------------- */}
              <div className="bg-white border-2 border-[#111111] p-4 shadow-xs flex flex-col justify-between rounded-[2px]">
                <div>
                  <div className="border-b-2 border-[#111111] pb-2 mb-3">
                    <h4 className="text-base font-black text-[#111111] font-dmk-headline">
                      {language === 'ta' ? 'துணைச் செயலாளர்கள் (5)' : 'Deputy Secretaries (5)'}
                    </h4>
                    <span className="text-[10px] font-english uppercase tracking-wider text-[#C41A1F] font-bold">
                      Secretariat Administration & Training
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs font-dmk-body">
                    {deputySecretaries.map((officer) => (
                      <li
                        key={officer.id}
                        onClick={() => setSelectedOfficer(officer)}
                        className={`p-2 border border-[#D8D3CB] hover:border-[#111111] hover:bg-[#FAF8F5] transition-colors cursor-pointer group flex items-center justify-between gap-2 rounded-[2px] ${
                          isMatched(officer)
                            ? 'bg-[#FAF8F5] border-[#111111] font-bold'
                            : hasFilter
                            ? 'opacity-30'
                            : ''
                        }`}
                      >
                        <span className="font-bold text-[#111111] group-hover:text-[#C41A1F] transition-colors truncate">
                          {officer.name[language]}
                        </span>
                        <span className="text-[11px] font-english text-[#5B5348] shrink-0">
                          • {officer.district[language]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-2 border-t border-[#D8D3CB] text-center">
                  <span className="text-[10px] font-english text-[#5B5348]">
                    5 Advocates • State Operations
                  </span>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* BRANCH 3: HEAD OFFICE ADVOCATES (9)                  */}
              {/* ---------------------------------------------------- */}
              <div className="bg-white border-2 border-[#111111] p-4 shadow-xs flex flex-col justify-between rounded-[2px]">
                <div>
                  <div className="border-b-2 border-[#111111] pb-2 mb-3">
                    <h4 className="text-base font-black text-[#111111] font-dmk-headline">
                      {language === 'ta' ? 'தலைமையக வழக்கறிஞர்கள் (9)' : 'Head Office Advocates (9)'}
                    </h4>
                    <span className="text-[10px] font-english uppercase tracking-wider text-[#C41A1F] font-bold">
                      Arivalayam HQ Legal Chamber
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs font-dmk-body">
                    {headOfficeAdvocates.map((officer) => (
                      <li
                        key={officer.id}
                        onClick={() => setSelectedOfficer(officer)}
                        className={`p-2 border border-[#D8D3CB] hover:border-[#111111] hover:bg-[#FAF8F5] transition-colors cursor-pointer group flex items-center justify-between gap-2 rounded-[2px] ${
                          isMatched(officer)
                            ? 'bg-[#FAF8F5] border-[#111111] font-bold'
                            : hasFilter
                            ? 'opacity-30'
                            : ''
                        }`}
                      >
                        <span className="font-bold text-[#111111] group-hover:text-[#C41A1F] transition-colors truncate">
                          {officer.name[language]}
                        </span>
                        <span className="text-[11px] font-english text-[#5B5348] shrink-0">
                          • {officer.district[language]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-2 border-t border-[#D8D3CB] text-center">
                  <span className="text-[10px] font-english text-[#5B5348]">
                    9 Advocates • Headquarters Liaison
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Officer Bio Dossier Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-[#111111] max-w-lg w-full border-2 border-[#111111] p-6 sm:p-8 shadow-2xl relative font-dmk-body rounded-[2px]">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#C41A1F] block mb-1">
                  OFFICIAL CADRE DOSSIER
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                  {selectedOfficer.name[language]}
                </h3>
                <span className="text-xs font-bold text-[#5B5348] font-english uppercase">
                  {selectedOfficer.designation[language]}
                </span>
              </div>
              <button
                onClick={() => setSelectedOfficer(null)}
                className="p-1 text-[#5B5348] hover:text-[#111111] transition-colors rounded-[2px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-[10px] font-english font-bold uppercase text-[#5B5348] block mb-1">
                  {language === 'ta' ? 'பொறுப்பு & துறை' : 'PORTFOLIO & JURISDICTION'}
                </span>
                <p className="font-semibold text-[#111111]">
                  {selectedOfficer.role[language]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-[10px] font-english font-bold uppercase text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'தளம் / ஊர்' : 'STATION'}
                  </span>
                  <span className="font-bold text-[#111111]">
                    {selectedOfficer.district[language]}
                  </span>
                </div>
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-[10px] font-english font-bold uppercase text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'நீதிமன்றப் பிரிவு' : 'COURT AFFILIATION'}
                  </span>
                  <span className="font-bold text-[#111111]">
                    {selectedOfficer.court}
                  </span>
                </div>
              </div>

              {selectedOfficer.barCouncilNo && (
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-[10px] font-english font-bold uppercase text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'பார் கவுன்சில் எண்' : 'BAR ENROLLMENT'}
                  </span>
                  <span className="font-mono font-bold text-[#C41A1F]">
                    {selectedOfficer.barCouncilNo}
                  </span>
                </div>
              )}

              {selectedOfficer.bio && (
                <div className="p-3 bg-white border border-[#D8D3CB] rounded-[2px]">
                  <span className="text-[10px] font-english font-bold uppercase text-[#5B5348] block mb-1">
                    {language === 'ta' ? 'குறிப்பு' : 'OFFICIAL DISPATCH'}
                  </span>
                  <p className="text-[#5B5348] leading-relaxed font-dmk-body text-xs">
                    {selectedOfficer.bio[language]}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-[#D8D3CB] flex justify-end">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="px-5 py-2 bg-[#111111] hover:bg-[#E31E24] text-white text-xs font-english font-bold uppercase tracking-wider transition-colors rounded-[2px]"
              >
                {language === 'ta' ? 'மூடுக' : 'Close Dossier'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
