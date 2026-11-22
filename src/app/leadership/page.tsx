'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Leader } from '@/types';
import { Search, Filter, Mail, Phone, Scale, X } from 'lucide-react';

export default function LeadershipPage() {
  const { language } = useLanguage();
  const { leaders } = useData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'state' | 'high_court' | 'advisory'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  const filteredLeaders = leaders.filter((l) => {
    const matchesLevel = activeFilter === 'all' || l.level === activeFilter;
    const matchesSearch =
      l.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.designation[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.role[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.barCouncilNo && l.barCouncilNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col space-y-10 py-8 bg-[#FAF7F2] text-[#111111] font-dmk-body">
      
      {/* Editorial Header Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border-b-2 border-neutral-900 pb-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#111111] text-white text-[11px] font-english uppercase px-3 py-1 tracking-widest font-bold">
                  {language === 'ta' ? 'மாநிலத் தலைமைப் பொறுப்பாளர்கள்' : 'LEADERSHIP COUNCIL'}
                </span>
                <span className="text-xs font-english text-[#C41A1F] font-bold">
                  ESTD. 1971 • CHENNAI
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight uppercase leading-none">
                {language === 'ta'
                  ? 'திமுக வழக்கறிஞர் அணி தலைமைப் பொறுப்பாளர்கள்'
                  : 'Roll of Senior Counsel & Leadership'}
              </h1>
            </div>
            <div className="text-left md:text-right font-english text-xs text-neutral-600">
              <p className="font-bold text-[#111111]">STATE COUNCIL SECRETARIAT</p>
              <p>Anna Arivalayam, Chennai — 600 018</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-dmk-body max-w-4xl">
            {language === 'ta'
              ? 'இந்திய அரசமைப்புச் சட்டம், உயர் நீதிமன்றம் மற்றும் உச்ச நீதிமன்றங்களில் மாநில உரிமைகளையும் சமூக நீதியையும் நிலைநாட்டும் மூத்த வழக்கறிஞர்கள், நாடாளுமன்ற உறுப்பினர்கள் மற்றும் சட்டப் போராளிகளின் அதிகாரப்பூர்வப் பட்டியல்.'
              : 'Senior Advocates, Parliamentarians, and seasoned constitutional jurists guiding the legal strategy, social justice defense, and organizational hierarchy of the DMK Legal Wing.'}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white border-y border-neutral-300 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="font-english text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#C41A1F]" />
              {language === 'ta' ? 'வடிகட்டுக:' : 'FILTER:'}
            </span>
            {[
              { id: 'all', label: language === 'ta' ? 'அனைத்துப் பொறுப்பாளர்கள்' : 'All Leadership' },
              { id: 'state', label: language === 'ta' ? 'மாநிலச் செயலகம்' : 'State Executive' },
              { id: 'high_court', label: language === 'ta' ? 'உயர்நீதிமன்றப் பிரிவு' : 'High Court Wing' },
              { id: 'advisory', label: language === 'ta' ? 'ஆலோசனைக் குழு' : 'Advisory Board' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 text-xs font-english font-bold uppercase tracking-wider transition-all border ${
                  activeFilter === f.id
                    ? 'bg-[#E31E24] text-white border-neutral-900 font-bold'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'பெயர் அல்லது பார் எண் தேடுக...' : 'Search by name or bar enrollment...'}
              className="w-full bg-[#FAF7F2] border border-neutral-300 pl-9 pr-3 py-1.5 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
            />
          </div>

        </div>
      </section>

      {/* Leadership Editorial Grid (Clean Newspaper Directory, No Heavy Card Appearance) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaders.map((leader, index) => {
            const initials = leader.name.en
              .replace(/^(Advocate|Adv\.|Senior Advocate)\s+/i, '')
              .split(/[\s.]+/)
              .filter(Boolean)
              .map(n => n[0])
              .join('')
              .slice(0, 3)
              .toUpperCase();

            return (
              <article
                key={leader.id}
                className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Top DMK Dual-Color Ribbon */}
                  <div className="w-full h-1 flex">
                    <div className="w-1/2 bg-black" />
                    <div className="w-1/2 bg-[#E31E24]" />
                  </div>

                  {/* Header Plate */}
                  <div className="p-4 bg-[#FAF7F2] border-b border-neutral-200 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border border-neutral-900 p-0.5 flex items-center justify-center shrink-0">
                        <img
                          src="/images/dmk-flag-sun.jpg"
                          alt="Official DMK Insignia"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-5 h-5 bg-[#111111] text-white font-english text-[9px] font-bold flex items-center justify-center">
                            {initials}
                          </span>
                          <span className="text-[10px] font-english font-bold uppercase tracking-wider px-2 py-0.5 bg-[#E31E24] text-white">
                            {leader.level === 'state'
                              ? language === 'ta' ? 'மாநிலத் தலைமை' : 'STATE SECRETARY'
                              : leader.level === 'advisory'
                              ? language === 'ta' ? 'ஆலோசகர்' : 'ADVISORY'
                              : language === 'ta' ? 'உயர்நீதிமன்றம்' : 'HIGH COURT WING'}
                          </span>
                        </div>
                        {leader.barCouncilNo && (
                          <div className="font-english text-[11px] font-bold text-neutral-700 inline-block">
                            BAR: {leader.barCouncilNo}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-english text-xs text-neutral-400 font-bold block">
                        #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Body */}
                  <div className="p-5 space-y-2">
                    <span className="text-xs font-english font-bold text-[#C41A1F] uppercase tracking-wider block">
                      {leader.designation[language]}
                    </span>

                    <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-tight">
                      {leader.name[language]}
                    </h2>

                    <p className="text-xs text-neutral-800 font-bold font-dmk-body border-l-2 border-[#E31E24] pl-2.5 py-0.5">
                      {leader.role[language]}
                    </p>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3 font-dmk-body pt-1">
                      {leader.bio[language]}
                    </p>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="px-5 py-3 bg-[#FAF7F2] border-t border-neutral-200 flex items-center justify-between text-xs">
                  <span className="font-english text-xs text-neutral-700 font-bold truncate max-w-[170px]">
                    {leader.court || 'Madras High Court'}
                  </span>

                  <button
                    onClick={() => setSelectedLeader(leader)}
                    className="font-english text-xs font-bold text-[#C41A1F] hover:text-black flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>{language === 'ta' ? 'முழு விவரம்' : 'View Profile'}</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Leadership Profile Modal */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border-2 border-neutral-900 max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-dmk-body">
            
            {/* Top Modal Flag Bar */}
            <div className="w-full h-1 flex absolute top-0 left-0">
              <div className="w-1/2 bg-black" />
              <div className="w-1/2 bg-[#E31E24]" />
            </div>

            <button
              onClick={() => setSelectedLeader(null)}
              className="absolute top-5 right-5 w-8 h-8 bg-white hover:bg-[#E31E24] hover:text-white text-neutral-900 border border-neutral-900 flex items-center justify-center font-bold text-sm transition-all"
              aria-label="Close dossier"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-start mt-4 pb-4 border-b border-neutral-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white p-2 border border-neutral-900 flex items-center justify-center shrink-0">
                <img
                  src="/images/dmk-flag-sun.jpg"
                  alt={selectedLeader.name[language]}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-xs font-mono font-bold text-[#C41A1F] uppercase tracking-wider block">
                  {selectedLeader.designation[language]}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline leading-tight">
                  {selectedLeader.name[language]}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-800 font-bold">
                  {selectedLeader.role[language]}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                  {selectedLeader.barCouncilNo && (
                    <span className="bg-red-50 text-[#C41A1F] border border-red-300 px-2 py-0.5 font-bold">
                      Bar Council: {selectedLeader.barCouncilNo}
                    </span>
                  )}
                  {selectedLeader.court && (
                    <span className="bg-white border border-neutral-400 text-neutral-700 px-2 py-0.5">
                      {selectedLeader.court}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <h5 className="font-mono font-bold text-neutral-900 uppercase tracking-wider text-[11px] mb-1.5 pb-1 border-b border-neutral-300">
                  {language === 'ta' ? 'அறிமுகம் & வாதாடிய முக்கிய வழக்குகள்' : 'BIOGRAPHY & JURISPRUDENCE RECORD'}
                </h5>
                <p className="text-neutral-800 leading-relaxed text-sm font-dmk-body">
                  {selectedLeader.bio[language]}
                </p>
              </div>

              {selectedLeader.practiceArea && (
                <div>
                  <h5 className="font-mono font-bold text-neutral-900 uppercase tracking-wider text-[11px] mb-1.5 pb-1 border-b border-neutral-300">
                    {language === 'ta' ? 'வழக்காடும் சிறப்புத் துறைகள்' : 'PRACTICE & LITIGATION SPECIALIZATION'}
                  </h5>
                  <p className="text-neutral-900 font-bold text-xs bg-white p-2.5 border border-neutral-300">
                    {selectedLeader.practiceArea[language]}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-300 flex flex-wrap gap-4 text-neutral-700 font-mono text-xs">
                {selectedLeader.email && (
                  <a
                    href={`mailto:${selectedLeader.email}`}
                    className="flex items-center gap-1.5 hover:text-[#C41A1F] bg-white border border-neutral-300 px-2 py-1"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C41A1F]" />
                    <span>{selectedLeader.email}</span>
                  </a>
                )}
                {selectedLeader.phone && (
                  <a
                    href={`tel:${selectedLeader.phone}`}
                    className="flex items-center gap-1.5 hover:text-[#C41A1F] bg-white border border-neutral-300 px-2 py-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C41A1F]" />
                    <span>{selectedLeader.phone}</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
