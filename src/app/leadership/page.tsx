'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Leader } from '@/types';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { 
  IconSearch, 
  IconClose, 
  IconPhone, 
  IconMail, 
  IconScale 
} from '@/components/Icons';

export default function LeadershipPage() {
  const { language } = useLanguage();
  const { leaders } = useData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'state' | 'high_court' | 'advisory'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  const mainSection = useReveal();

  const filteredLeaders = leaders.filter((l) => {
    const matchesLevel = activeFilter === 'all' || l.level === activeFilter;
    const matchesSearch =
      !searchQuery ||
      l.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.designation[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.role[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.barCouncilNo && l.barCouncilNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'மாநிலத் தலைமைப் பொறுப்பாளர்கள்' : 'Council of Senior Counsel & Leadership'}
        description={
          language === 'ta'
            ? 'அணியை வழிநடத்தும் தலைவர், செயலாளர், இணைச் செயலாளர்கள் மற்றும் மூத்த வழக்கறிஞர்கள் குழு.'
            : 'Apex executive council, appellate litigators, and state secretariat leadership of the DMK Legal Wing.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-12">
        
        <section 
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''}`}
        >
          {/* Controls: Search & Category Filter */}
          <div className="bg-[#f1ece2] border-2 border-[#111111] p-6 space-y-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              <div className="md:col-span-6 space-y-1.5">
                <label htmlFor="leaderSearch" className="font-semibold text-[15px] text-[#111111]">
                  {language === 'ta' ? 'பொறுப்பாளர்களைத் தேடுக' : 'Search Counsel & Office Bearers'}
                </label>
                <div className="relative">
                  <IconSearch className="w-4 h-4 text-[#5B5348] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="leaderSearch"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ta' ? 'பெயர் அல்லது பதவி...' : 'Name or designation...'}
                    className="w-full min-h-[44px] bg-white border-2 border-[#111111] pl-10 pr-4 text-[15px] text-[#111111]"
                  />
                </div>
              </div>

              <div className="md:col-span-6 flex items-center gap-2 flex-wrap">
                {(['all', 'state', 'high_court', 'advisory'] as const).map((filterKey) => {
                  const isSelected = activeFilter === filterKey;
                  return (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setActiveFilter(filterKey)}
                      className={`min-h-[44px] px-4 py-2 text-[13px] font-extrabold cursor-pointer border-2 border-[#111111] transition-colors ${
                        isSelected
                          ? 'bg-[#E31E24] text-white border-[#E31E24]'
                          : 'bg-white text-[#111111] hover:bg-[#111111] hover:text-white'
                      }`}
                    >
                      {filterKey === 'all'
                        ? (language === 'ta' ? 'அனைத்தும்' : 'All')
                        : filterKey === 'state'
                        ? (language === 'ta' ? 'மாநில தலைமை' : 'State Council')
                        : filterKey === 'high_court'
                        ? (language === 'ta' ? 'உயர்நீதிமன்றப் பிரிவு' : 'High Court')
                        : (language === 'ta' ? 'ஆலோசனைக் குழு' : 'Advisory')}
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="flex items-center justify-between text-[14px] text-[#5B5348] border-t border-[#3d3633] pt-3">
              <span>
                {language === 'ta' ? 'பொறுப்பாளர்கள் எண்ணிக்கை: ' : 'Showing members: '}
                <strong className="text-[#111111] font-manrope">{filteredLeaders.length}</strong>
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

          {/* Leaders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white border-2 border-[#111111] p-6 flex flex-col justify-between hover:bg-[#f1ece2] transition-colors"
              >
                <div className="space-y-4">
                  {/* Photo frame with 2px ink border */}
                  <div className="aspect-[4/5] border-2 border-[#111111] bg-[#111111] flex items-center justify-center overflow-hidden">
                    {leader.image ? (
                      <img
                        src={leader.image}
                        alt={leader.name[language]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-manrope font-bold text-[#d8cfc2] text-sm">
                        [Official Photo]
                      </span>
                    )}
                  </div>

                  <div className="border-t-4 border-[#E31E24] pt-3 space-y-1">
                    <h3 className="font-manrope font-extrabold text-[22px] text-[#111111] leading-snug">
                      {leader.name[language]}
                    </h3>
                    <p className="text-[#C41A1F] font-extrabold text-[15px]">
                      {leader.designation[language]}
                    </p>
                    <p className="text-[14px] text-[#5B5348]">
                      {leader.role[language]}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#3d3633] flex items-center justify-between text-xs">
                  <span className="font-mono text-[#5B5348]">
                    {leader.barCouncilNo || 'Enrolled Advocate'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedLeader(leader)}
                    className="min-h-[44px] px-3 font-extrabold text-[#C41A1F] hover:text-[#111111] cursor-pointer"
                  >
                    {language === 'ta' ? 'விவரம் →' : 'Profile →'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

      </div>

      {/* Leader Modal */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#111111] max-w-lg w-full border-4 border-[#111111] p-8 space-y-6">
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  {selectedLeader.designation[language]}
                </span>
                <h3 className="font-manrope font-extrabold text-[26px] text-[#111111]">
                  {selectedLeader.name[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                className="p-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[16px] text-[#3a322d] leading-relaxed">
              {selectedLeader.bio[language]}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                className="min-h-[44px] px-8 bg-[#111111] hover:bg-black text-white font-extrabold text-[15px] cursor-pointer"
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
