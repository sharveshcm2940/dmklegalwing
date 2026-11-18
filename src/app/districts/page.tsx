'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { Phone, Mail, Search, Filter, MapPin, Building2, Scale } from 'lucide-react';

export default function DistrictsPage() {
  const { language } = useLanguage();
  const { districts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');

  const filteredDistricts = districts.filter((d) => {
    const matchesZone = selectedZone === 'All' || d.zone === selectedZone;
    const matchesSearch =
      d.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.organizer[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.headquarters[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const zones = ['All', 'Chennai', 'North', 'West', 'Central', 'South'];

  return (
    <div className="w-full flex flex-col space-y-10 py-8 bg-[#FAF7F2] text-[#111111] font-dmk-body">
      
      {/* Broadsheet Masthead Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#FAF7F2] border-2 border-neutral-900 shadow-[4px_4px_0px_#111111] p-6 sm:p-10 relative overflow-hidden">
          {/* Dual Party Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/2 bg-black" />
            <div className="w-1/2 bg-[#E31E24]" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-5 mb-6 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#111111] text-white text-[10px] font-mono uppercase px-2 py-0.5 tracking-widest font-bold">
                  {language === 'ta' ? 'அரசிதழ் பிராந்தியப் பதிவேடு' : 'REGIONAL JURISDICTION GAZETTE'}
                </span>
                <span className="text-[11px] font-mono text-[#E31E24] font-bold">
                  VOL. LIV • SEC. VI (DISTRICTS)
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight uppercase leading-none">
                {language === 'ta'
                  ? 'தமிழ்நாடு 38 மாவட்ட வழக்கறிஞர் அணிகள்'
                  : '38 District Legal Wing Directory'}
              </h1>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right font-mono text-[11px] text-neutral-600">
              <p className="font-bold text-[#111111]">COURT SESSIONS DIRECTORY</p>
              <p>Principal District & Munsif Courts Network</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-dmk-body">
                {language === 'ta'
                  ? 'சென்னை உயர் நீதிமன்ற முதன்மை அமர்வு முதல் கன்னியாகுமரி மாவட்ட முதன்மை அமர்வு நீதிமன்றம் வரை பரந்து விரிந்த 38 மாவட்ட வழக்கறிஞர் அணிகள், பொறுப்பாளர்கள் மற்றும் நீதிமன்ற வளாகங்களின் ஒருங்கிணைந்த பட்டியல்.'
                  : 'From the Madras High Court to subordinate district courts across Tamil Nadu, our verified district coordinators champion citizen legal aid, grassroots defense, and social justice constitutional representation.'}
              </p>
            </div>
            <div className="lg:col-span-4 bg-[#F3EFE6] border border-neutral-900 p-4">
              <div className="flex items-center justify-between font-mono text-xs text-neutral-700 pb-2 border-b border-neutral-400">
                <span>DISTRICT CADRE</span>
                <span className="font-bold text-[#E31E24]">38 SESSIONS WINGS</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2 font-mono">
                Grassroots defense clinics active across all revenue districts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cartographic Interactive Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <TamilNaduMap />
      </section>

      {/* Complete District Classified Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b-2 border-neutral-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#E31E24]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E31E24]">
                {language === 'ta' ? 'அனைத்து மாவட்டங்களின் விவரங்கள்' : 'CLASSIFIED DISTRICT GAZETTE'}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline uppercase">
              {language === 'ta' ? 'அனைத்து மாவட்ட பொறுப்பாளர்கள் பட்டியல்' : 'District Cadre & Court Complexes'}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                    selectedZone === zone
                      ? 'bg-[#E31E24] text-white border-neutral-900 shadow-[2px_2px_0px_#111111]'
                      : 'bg-white text-neutral-700 border-neutral-400 hover:border-neutral-900'
                  }`}
                >
                  {zone === 'All' ? (language === 'ta' ? 'அனைத்தும்' : 'All') : zone}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ta' ? 'மாவட்டம் தேடுக...' : 'Search district...'}
                className="w-full bg-white border-2 border-neutral-900 pl-8 pr-3 py-1 text-xs font-mono text-[#111111] placeholder-neutral-500 focus:outline-none focus:border-[#E31E24]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDistricts.map((d) => (
            <article
              key={d.id}
              className="bg-white border-2 border-neutral-900 shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#E31E24] p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#E31E24] uppercase tracking-wider block font-bold">
                      {d.zone} ZONE
                    </span>
                    <h4 className="text-xl font-black text-[#111111] font-dmk-headline">
                      {d.name[language]}
                    </h4>
                  </div>
                  <div className="text-right bg-[#FAF7F2] border border-neutral-900 px-2 py-1">
                    <span className="text-base font-black text-[#111111] font-mono block leading-none">
                      {d.memberCount.toLocaleString()}+
                    </span>
                    <span className="text-[9px] font-mono uppercase text-neutral-600 font-bold">
                      {language === 'ta' ? 'வழக்கறிஞர்கள்' : 'Advocates'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-dmk-body">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-500 block">
                      {language === 'ta' ? 'மாவட்ட அமைப்பாளர்:' : 'DISTRICT ORGANIZER:'}
                    </span>
                    <span className="text-[#111111] font-bold text-sm block mt-0.5 font-dmk-headline">
                      {d.organizer[language]}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-500 block">
                      {language === 'ta' ? 'நீதிமன்ற வளாகம்:' : 'COURT COMPLEX:'}
                    </span>
                    <span className="text-neutral-700 block line-clamp-2 mt-0.5 text-xs">
                      {d.courtComplex[language]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-neutral-900 flex items-center justify-between text-xs font-mono">
                <a
                  href={`tel:${d.contactPhone}`}
                  className="flex items-center gap-1.5 text-neutral-800 hover:text-[#E31E24] transition-colors font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>{d.contactPhone}</span>
                </a>
                <a
                  href={`mailto:${d.contactEmail}`}
                  className="flex items-center gap-1.5 text-neutral-800 hover:text-[#E31E24] transition-colors font-bold uppercase tracking-wider text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>{language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
