'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Leader } from '../types';
import { 
  Users, 
  ChevronRight, 
  Mail, 
  Phone, 
  Search, 
  Shield, 
  Award, 
  Layers, 
  MapPin,
  X 
} from 'lucide-react';

export const OrgChart: React.FC = () => {
  const { language } = useLanguage();
  const { leaders } = useData();
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState<'all' | 'state' | 'high_court' | 'advisory'>('all');

  const filteredLeaders = leaders.filter((l) => {
    const matchesTier = activeTier === 'all' || l.level === activeTier;
    const matchesSearch =
      l.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.designation[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.role[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const stateSecretary = leaders.find((l) => l.id === 'p-wilson') || leaders[0];
  const advisoryLeaders = leaders.filter((l) => l.level === 'advisory');
  const stateDeputies = leaders.filter((l) => l.level === 'state' && l.id !== 'p-wilson');
  const highCourtLeaders = leaders.filter((l) => l.level === 'high_court');

  return (
    <div className="w-full space-y-8 font-dmk-body">
      
      {/* 1. Broadsheet Filter & Directory Search Bar */}
      <div className="bg-white border border-neutral-300 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Layers className="w-4 h-4 text-[#E31E24] shrink-0" />
          <span className="text-xs font-english font-bold uppercase text-neutral-800 shrink-0">
            {language === 'ta' ? 'அடுக்குகள்:' : 'Tiers:'}
          </span>
          {[
            { id: 'all', label: language === 'ta' ? 'அனைத்து நிலைகளும்' : 'All Tiers' },
            { id: 'state', label: language === 'ta' ? 'மாநில தலைமை' : 'State Executive' },
            { id: 'high_court', label: language === 'ta' ? 'உயர்நீதிமன்றக் கிளை' : 'High Court Wing' },
            { id: 'advisory', label: language === 'ta' ? 'ஆலோசனைக் குழு' : 'Advisory Board' }
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id as any)}
              className={`px-3 py-1.5 text-xs font-english font-bold uppercase tracking-wider transition-all border ${
                activeTier === tier.id
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-[#FAF7F2] text-neutral-700 hover:text-black border-neutral-300'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ta' ? 'பொறுப்பாளர் தேடுக...' : 'Search officer...'}
            className="w-full bg-[#FAF7F2] border border-neutral-300 pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-[#E31E24] font-dmk-body"
          />
        </div>
      </div>

      {/* 2. Structured Broadsheet Organisational Flow Chart */}
      <div className="bg-white border border-neutral-300 p-6 sm:p-10 relative overflow-hidden">
        
        {/* LEVEL 0: PARTY HIGH COMMAND */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-neutral-300 text-[10px] font-english text-neutral-800 uppercase tracking-wider mb-2 font-bold">
            <Shield className="w-3.5 h-3.5 text-[#E31E24]" />
            <span>{language === 'ta' ? 'கழகத் தலைமை வழிகாட்டுதல்' : 'DMK High Command Guidance'}</span>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-neutral-300 max-w-md w-full">
            <h4 className="text-base font-black text-neutral-900 uppercase tracking-wider font-dmk-headline">
              {language === 'ta' ? 'கழகத் தலைவர் & பொதுச்செயலாளர்' : 'Party President & General Secretary'}
            </h4>
            <p className="text-xs text-neutral-600 font-english mt-0.5">
              {language === 'ta' ? 'அண்ணா அறிவாலயம், சென்னை' : 'Anna Arivalayam, Chennai'}
            </p>
          </div>

          {/* Vertical Connecting Line */}
          <div className="w-[2px] h-8 bg-neutral-900 my-1" />
        </div>

        {/* LEVEL 1: STATE SECRETARY */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF5F5] border border-[#E31E24] text-[10px] font-english text-[#B81318] uppercase tracking-wider mb-2 font-bold">
            <Award className="w-3.5 h-3.5 text-[#E31E24]" />
            <span>{language === 'ta' ? 'மாநிலத் தலைமைச் செயலாளர்' : 'State Legal Secretary'}</span>
          </div>

          <div
            onClick={() => setSelectedLeader(stateSecretary)}
            className="group cursor-pointer bg-[#FAF7F2] hover:bg-white border border-neutral-300 hover:border-neutral-900 p-5 max-w-lg w-full transition-all flex items-center gap-4 text-left"
          >
            <div className="w-16 h-16 rounded-full bg-white border border-neutral-300 p-1 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src="/images/dmk-flag-sun.jpg"
                alt={stateSecretary.name[language]}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[#E31E24] uppercase tracking-wider block font-english">
                {stateSecretary.designation[language]}
              </span>
              <h3 className="text-lg font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-tight">
                {stateSecretary.name[language]}
              </h3>
              <p className="text-xs text-neutral-700 line-clamp-1 font-dmk-body">
                {stateSecretary.role[language]}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                <span className="font-english text-[#B81318] font-bold">{stateSecretary.barCouncilNo}</span>
                <span>•</span>
                <span className="text-neutral-900 font-bold font-dmk-headline">{language === 'ta' ? 'முழு விவரம்' : 'View Profile'} &rarr;</span>
              </div>
            </div>
          </div>

          {/* Branching Tree Line */}
          <div className="w-[2px] h-8 bg-neutral-900 my-1" />
          <div className="w-3/4 max-w-2xl h-[2px] bg-neutral-900 relative">
            <div className="absolute left-0 top-0 w-2 h-2 bg-[#E31E24] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 w-2 h-2 bg-[#E31E24] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute right-0 top-0 w-2 h-2 bg-[#E31E24] translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* LEVEL 2: THREE EXECUTIVE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Pillar 1: Legal Advisory Board */}
          <div className="bg-[#FAF7F2] border border-neutral-300 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-300 mb-3">
                <span className="text-xs font-black text-neutral-900 uppercase tracking-wider font-dmk-headline">
                  {language === 'ta' ? 'மாநில சட்ட ஆலோசனைக் குழு' : 'Legal Advisory Board'}
                </span>
                <span className="text-[10px] bg-white text-neutral-900 px-2 py-0.5 border border-neutral-300 font-english font-bold">
                  {advisoryLeaders.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {advisoryLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    onClick={() => setSelectedLeader(leader)}
                    className="p-3 bg-white hover:bg-[#FFF8F8] border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-colors"
                  >
                    <h5 className="text-xs font-bold text-neutral-900 font-dmk-headline">
                      {leader.name[language]}
                    </h5>
                    <p className="text-[11px] text-[#E31E24] font-medium font-english">
                      {leader.designation[language]}
                    </p>
                    <p className="text-[10px] text-neutral-600 line-clamp-1 mt-0.5 font-dmk-body">
                      {leader.role[language]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 2: Additional & Joint Secretaries */}
          <div className="bg-[#FAF7F2] border border-neutral-300 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-300 mb-3">
                <span className="text-xs font-black text-neutral-900 uppercase tracking-wider font-dmk-headline">
                  {language === 'ta' ? 'மாநில கூடுதல் / துணைச் செயலாளர்கள்' : 'State Executive Secretariat'}
                </span>
                <span className="text-[10px] bg-white text-neutral-900 px-2 py-0.5 border border-neutral-300 font-english font-bold">
                  {stateDeputies.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {stateDeputies.map((leader) => (
                  <div
                    key={leader.id}
                    onClick={() => setSelectedLeader(leader)}
                    className="p-3 bg-white hover:bg-[#FFF8F8] border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-colors"
                  >
                    <h5 className="text-xs font-bold text-neutral-900 font-dmk-headline">
                      {leader.name[language]}
                    </h5>
                    <p className="text-[11px] text-[#E31E24] font-medium font-english">
                      {leader.designation[language]}
                    </p>
                    <p className="text-[10px] text-neutral-600 line-clamp-1 mt-0.5 font-dmk-body">
                      {leader.role[language]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 3: High Court Wing */}
          <div className="bg-[#FAF7F2] border border-neutral-300 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-300 mb-3">
                <span className="text-xs font-black text-neutral-900 uppercase tracking-wider font-dmk-headline">
                  {language === 'ta' ? 'சென்னை உயர் நீதிமன்றம் & மதுரை கிளை' : 'High Court & Madurai Bench'}
                </span>
                <span className="text-[10px] bg-white text-neutral-900 px-2 py-0.5 border border-neutral-300 font-english font-bold">
                  {highCourtLeaders.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {highCourtLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    onClick={() => setSelectedLeader(leader)}
                    className="p-3 bg-white hover:bg-[#FFF8F8] border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-colors"
                  >
                    <h5 className="text-xs font-bold text-neutral-900 font-dmk-headline">
                      {leader.name[language]}
                    </h5>
                    <p className="text-[11px] text-[#E31E24] font-medium font-english">
                      {leader.designation[language]}
                    </p>
                    <p className="text-[10px] text-neutral-600 line-clamp-1 mt-0.5 font-dmk-body">
                      {leader.court}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* LEVEL 3: DISTRICT CADRE DIRECTORY */}
        <div className="bg-[#FAF7F2] border border-neutral-300 p-6">
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E31E24] uppercase tracking-wider block">
                {language === 'ta' ? 'களக் கட்டமைப்பு' : 'GRASSROOTS CADRE'}
              </span>
              <h4 className="text-base font-black text-neutral-900 font-dmk-headline">
                {language === 'ta' ? '38 மாவட்ட வழக்கறிஞர் அமைப்புகள்' : '38 District Legal Wing Secretariats'}
              </h4>
            </div>

            <a
              href="/districts"
              className="inline-flex items-center gap-1 text-xs text-[#E31E24] hover:text-black font-bold uppercase font-dmk-headline"
            >
              <span>{language === 'ta' ? 'அனைத்து மாவட்டங்களையும் பார்க்க' : 'View District Units'}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
            {['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Thanjavur', 'Kanchipuram', 'Cuddalore', 'Erode', 'Kanniyakumari'].map((dist) => (
              <div
                key={dist}
                className="p-2.5 bg-white border border-neutral-400 text-center hover:border-neutral-900 transition-colors shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E31E24] mx-auto mb-1" />
                <span className="text-neutral-900 font-bold block truncate font-dmk-headline">{dist}</span>
                <span className="text-[10px] text-neutral-500 font-mono">District Bar</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leader Profile Modal (Broadsheet Official Dossier Format) */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-900 max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-dmk-body">
            
            {/* Top Modal Flag Bar */}
            <div className="w-full h-1 flex absolute top-0 left-0">
              <div className="w-1/2 bg-black" />
              <div className="w-1/2 bg-[#E31E24]" />
            </div>

            <button
              onClick={() => setSelectedLeader(null)}
              className="absolute top-5 right-5 w-8 h-8 bg-[#FAF7F2] hover:bg-neutral-900 hover:text-white text-neutral-800 flex items-center justify-center font-bold text-sm transition-colors border border-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start mt-2 border-b border-neutral-300 pb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 border border-neutral-300 shrink-0 flex items-center justify-center">
                <img
                  src="/images/dmk-flag-sun.jpg"
                  alt={selectedLeader.name[language]}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-xs font-mono font-bold text-[#E31E24] uppercase tracking-wider block">
                  {selectedLeader.designation[language]}
                </span>
                <h3 className="text-2xl font-black text-neutral-900 font-dmk-headline">
                  {selectedLeader.name[language]}
                </h3>
                <p className="text-xs text-neutral-700 font-semibold font-serif italic">
                  {selectedLeader.role[language]}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  {selectedLeader.barCouncilNo && (
                    <span className="bg-[#FAF7F2] text-neutral-900 px-2.5 py-0.5 border border-neutral-900 font-mono font-bold">
                      Bar No: {selectedLeader.barCouncilNo}
                    </span>
                  )}
                  {selectedLeader.court && (
                    <span className="bg-[#FAF7F2] text-neutral-700 px-2.5 py-0.5 border border-neutral-400 font-mono">
                      {selectedLeader.court}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <h5 className="font-mono font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-1">
                  {language === 'ta' ? 'அறிமுகம் & வாதாடிய வழக்குகள்' : 'BIOGRAPHY & JURISPRUDENCE'}
                </h5>
                <p className="text-neutral-800 leading-relaxed text-sm font-dmk-body">
                  {selectedLeader.bio[language]}
                </p>
              </div>

              {selectedLeader.practiceArea && (
                <div>
                  <h5 className="font-mono font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-1">
                    {language === 'ta' ? 'வழக்காடும் சிறப்புத் துறைகள்' : 'PRACTICE SPECIALIZATION'}
                  </h5>
                  <p className="text-neutral-900 font-medium">
                    {selectedLeader.practiceArea[language]}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-300 flex flex-wrap gap-4 text-neutral-700">
                {selectedLeader.email && (
                  <a
                    href={`mailto:${selectedLeader.email}`}
                    className="flex items-center gap-1.5 hover:text-[#E31E24]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E31E24]" />
                    <span className="font-mono">{selectedLeader.email}</span>
                  </a>
                )}
                {selectedLeader.phone && (
                  <a
                    href={`tel:${selectedLeader.phone}`}
                    className="flex items-center gap-1.5 hover:text-[#E31E24]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E31E24]" />
                    <span className="font-mono">{selectedLeader.phone}</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
