'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { DistrictInfo } from '../types';
import { 
  Building2, 
  Phone, 
  Mail, 
  Users, 
  Scale, 
  Search, 
  Filter,
  Compass,
  MapPin
} from 'lucide-react';

interface DistrictCoordinate {
  id: string;
  cx: number;
  cy: number;
  r: number;
  label: string;
  zone: 'Chennai' | 'North' | 'West' | 'Central' | 'South';
}

const DISTRICT_COORDINATES: DistrictCoordinate[] = [
  { id: 'chennai', cx: 390, cy: 75, r: 16, label: 'Chennai', zone: 'Chennai' },
  { id: 'thiruvallur', cx: 360, cy: 60, r: 14, label: 'Tiruvallur', zone: 'North' },
  { id: 'kanchipuram', cx: 355, cy: 95, r: 13, label: 'Kanchipuram', zone: 'North' },
  { id: 'chengalpattu', cx: 380, cy: 110, r: 13, label: 'Chengalpattu', zone: 'North' },
  { id: 'vellore', cx: 310, cy: 90, r: 14, label: 'Vellore', zone: 'North' },
  { id: 'dharmapuri', cx: 240, cy: 130, r: 14, label: 'Dharmapuri', zone: 'West' },
  { id: 'krishnagiri', cx: 260, cy: 90, r: 14, label: 'Krishnagiri', zone: 'West' },
  { id: 'viluppuram', cx: 335, cy: 145, r: 14, label: 'Viluppuram', zone: 'North' },
  { id: 'salem', cx: 250, cy: 175, r: 15, label: 'Salem', zone: 'West' },
  { id: 'erode', cx: 200, cy: 195, r: 14, label: 'Erode', zone: 'West' },
  { id: 'namakkal', cx: 240, cy: 215, r: 13, label: 'Namakkal', zone: 'West' },
  { id: 'cuddalore', cx: 350, cy: 185, r: 14, label: 'Cuddalore', zone: 'Central' },
  { id: 'coimbatore', cx: 150, cy: 220, r: 17, label: 'Coimbatore', zone: 'West' },
  { id: 'tiruchirappalli', cx: 275, cy: 250, r: 16, label: 'Tiruchirappalli', zone: 'Central' },
  { id: 'thanjavur', cx: 330, cy: 255, r: 15, label: 'Thanjavur', zone: 'Central' },
  { id: 'pudukkottai', cx: 310, cy: 295, r: 14, label: 'Pudukkottai', zone: 'Central' },
  { id: 'dindigul', cx: 215, cy: 270, r: 15, label: 'Dindigul', zone: 'South' },
  { id: 'madurai', cx: 235, cy: 320, r: 17, label: 'Madurai', zone: 'South' },
  { id: 'ramanathapuram', cx: 310, cy: 375, r: 15, label: 'Ramanathapuram', zone: 'South' },
  { id: 'thoothukudi', cx: 240, cy: 420, r: 15, label: 'Thoothukudi', zone: 'South' },
  { id: 'tirunelveli', cx: 205, cy: 425, r: 16, label: 'Tirunelveli', zone: 'South' },
  { id: 'kanniyakumari', cx: 190, cy: 475, r: 14, label: 'Kanniyakumari', zone: 'South' }
];

export const TamilNaduMap: React.FC = () => {
  const { language } = useLanguage();
  const { districts } = useData();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('chennai');
  const [activeZone, setActiveZone] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedDistrict = districts.find((d) => d.id === selectedDistrictId) || districts[0];

  const filteredDistricts = districts.filter((d) => {
    const matchesZone = activeZone === 'All' || d.zone === activeZone;
    const matchesQuery =
      d.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.organizer[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.headquarters[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesQuery;
  });

  const zones = ['All', 'Chennai', 'North', 'West', 'Central', 'South'];

  return (
    <div className="bg-white border border-neutral-300 overflow-hidden font-dmk-body">
      
      {/* Newspaper Top Bar */}
      <div className="bg-white p-5 border-b border-neutral-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E31E24]" />
            <span className="font-english text-[10px] font-bold uppercase tracking-widest text-[#E31E24]">
              {language === 'ta' ? 'அதிகாரப்பூர்வ நிலவியல் அரசிதழ்' : 'OFFICIAL CARTOGRAPHIC GAZETTE'}
            </span>
          </div>
          <h3 className="text-2xl font-black text-[#111111] font-dmk-headline tracking-tight uppercase">
            {language === 'ta' ? 'தமிழ்நாடு மாவட்ட வழக்கறிஞர் கள வரைபடம்' : 'Jurisdictional Map of Tamil Nadu'}
          </h3>
          <p className="text-xs text-neutral-600 mt-0.5 font-dmk-body">
            {language === 'ta'
              ? 'வரைபடத்தில் மாவட்ட வட்டங்களை அழுத்தி அப்பிரிவின் பொறுப்பாளர் மற்றும் நீதிமன்ற விவரங்களைப் பார்வையிடுக.'
              : 'Select any district node to inspect legal wing leadership, court complex addresses, and contact dispatches.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ta' ? 'மாவட்டம் அல்லது பொறுப்பாளர்...' : 'Search district or organizer...'}
            className="w-full bg-[#FAF7F2] border border-neutral-300 pl-9 pr-3 py-1.5 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:border-[#E31E24]"
          />
        </div>
      </div>

      {/* Zone Filters Bar */}
      <div className="bg-[#FAF7F2] px-5 py-2.5 border-b border-neutral-300 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-english font-bold text-neutral-800 uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#E31E24]" />
          {language === 'ta' ? 'மண்டலம்:' : 'ZONE:'}
        </span>
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => setActiveZone(zone)}
            className={`px-3 py-1 text-xs font-english font-bold uppercase tracking-wider transition-all border ${
              activeZone === zone
                ? 'bg-[#E31E24] text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {zone === 'All' ? (language === 'ta' ? 'அனைத்தும்' : 'All Zones') : zone}
          </button>
        ))}
      </div>

      {/* Grid: Map View (Cartographic Print) + Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        
        {/* Left: Vintage Cartographic SVG Map */}
        <div className="lg:col-span-6 bg-[#FAF7F2] p-6 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-neutral-300">
          <div className="text-center mb-3">
            <span className="text-[11px] font-english text-[#E31E24] tracking-widest uppercase font-bold">
              {language === 'ta' ? 'தமிழ்நாடு அரசமைப்பு கள வரைபடம்' : 'TAMIL NADU SESSIONS JURISDICTIONS'}
            </span>
          </div>

          <div className="relative w-full max-w-[390px] aspect-[4/5] flex items-center justify-center bg-[#F3EFE6] border border-neutral-400 p-2">
            <svg
              viewBox="100 30 330 470"
              className="w-full h-full"
            >
              <defs>
                <pattern id="newspaperDots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="#111111" opacity="0.06" />
                </pattern>
              </defs>

              {/* Background dot pattern */}
              <rect width="100%" height="100%" fill="url(#newspaperDots)" />

              {/* Tamil Nadu State Outline (Vintage Cartographic Print Style) */}
              <path
                d="M 360,50 L 400,75 L 395,115 L 360,140 L 370,185 L 350,225 L 350,270 L 320,380 L 260,430 L 200,490 L 180,470 L 195,430 L 155,360 L 140,240 L 155,200 L 220,110 L 260,75 Z"
                fill="#FAF7F2"
                stroke="#111111"
                strokeWidth="2.5"
                strokeDasharray="none"
              />

              {/* High Court Corridor Lines */}
              <line x1="390" y1="75" x2="275" y2="250" stroke="#E31E24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="275" y1="250" x2="235" y2="320" stroke="#E31E24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="235" y1="320" x2="150" y2="220" stroke="#E31E24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

              {/* District Nodes */}
              {DISTRICT_COORDINATES.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                const isChennaiOrMadurai = d.id === 'chennai' || d.id === 'madurai';

                return (
                  <g
                    key={d.id}
                    onClick={() => setSelectedDistrictId(d.id)}
                    className="cursor-pointer group"
                  >
                    {/* Ring for selected */}
                    {isSelected && (
                      <circle
                        cx={d.cx}
                        cy={d.cy}
                        r={d.r + 5}
                        fill="none"
                        stroke="#E31E24"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Main Node */}
                    <circle
                      cx={d.cx}
                      cy={d.cy}
                      r={d.r}
                      fill={
                        isSelected
                          ? '#E31E24'
                          : isChennaiOrMadurai
                          ? '#111111'
                          : '#FFFFFF'
                      }
                      stroke="#111111"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-colors group-hover:fill-[#E31E24]"
                    />

                    {/* High Court Bench Indicator */}
                    {isChennaiOrMadurai && !isSelected && (
                      <circle cx={d.cx} cy={d.cy} r={3} fill="#E31E24" />
                    )}

                    {/* Node Text Label */}
                    <text
                      x={d.cx}
                      y={d.cy + 3}
                      textAnchor="middle"
                      fill={isSelected || isChennaiOrMadurai ? '#FFFFFF' : '#111111'}
                      fontSize="8"
                      fontWeight="bold"
                      className="pointer-events-none select-none font-mono"
                    >
                      {d.label.slice(0, 3).toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-english text-neutral-800 mt-4 bg-white px-3 py-1.5 border border-neutral-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#E31E24] border border-neutral-900" />
              <span>{language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected District'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#111111]" />
              <span>{language === 'ta' ? 'உயர்நீதிமன்றக் கிளை' : 'High Court Bench'}</span>
            </div>
          </div>
        </div>

        {/* Right: Selected District Details Register */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-white">
          <div>
            {/* District Header Plate */}
            <div className="flex items-start justify-between border-b border-neutral-300 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-english font-bold text-[#E31E24] tracking-widest uppercase block">
                  {selectedDistrict.zone} {language === 'ta' ? 'மண்டலப் பிரிவு' : 'ZONE JURISDICTION'}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline leading-tight mt-0.5">
                  {selectedDistrict.name[language]}
                </h4>
                <p className="text-xs font-english text-neutral-600 mt-1">
                  {language === 'ta' ? 'தலைமையகம்:' : 'Headquarters:'}{' '}
                  <span className="text-[#111111] font-bold">
                    {selectedDistrict.headquarters[language]}
                  </span>
                </p>
              </div>

              <div className="text-right bg-[#FAF7F2] border border-neutral-300 p-2.5">
                <span className="text-xl font-black text-[#111111] font-english block">
                  {selectedDistrict.memberCount.toLocaleString()}+
                </span>
                <span className="text-[10px] font-english font-bold uppercase tracking-wider text-neutral-700">
                  {language === 'ta' ? 'வழக்கறிஞர்கள்' : 'Advocates'}
                </span>
              </div>
            </div>

            {/* Information Rows */}
            <div className="space-y-3 text-xs">
              
              <div className="p-3.5 bg-[#FAF7F2] border border-neutral-300">
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-english text-[10px] uppercase font-bold text-neutral-600 block">
                      {language === 'ta' ? 'முதன்மை நீதிமன்ற வளாகம்:' : 'PRIMARY COURT COMPLEX:'}
                    </span>
                    <span className="text-[#111111] font-bold text-xs font-dmk-body block mt-0.5">
                      {selectedDistrict.courtComplex[language]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-neutral-300">
                <div className="flex items-start gap-2.5">
                  <Scale className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-english text-[10px] uppercase font-bold text-neutral-600 block">
                      {language === 'ta' ? 'மாவட்ட வழக்கறிஞர் அணி அமைப்பாளர்:' : 'DISTRICT LEGAL WING ORGANIZER:'}
                    </span>
                    <span className="text-sm text-[#111111] font-black font-dmk-headline block mt-0.5">
                      {selectedDistrict.organizer[language]}
                    </span>

                    {selectedDistrict.jointOrganizers && selectedDistrict.jointOrganizers.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-300">
                        <span className="font-english text-[10px] uppercase font-bold text-neutral-600 block mb-1">
                          {language === 'ta' ? 'இணை அமைப்பாளர்கள்:' : 'JOINT ORGANIZERS:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedDistrict.jointOrganizers.map((jo, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-white text-neutral-800 px-2 py-0.5 border border-neutral-300 font-semibold"
                            >
                              {jo[language]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct Despatches / Phone & Mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${selectedDistrict.contactPhone}`}
                  className="flex items-center gap-2 p-3 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#E31E24]" />
                  <div>
                    <span className="text-[10px] font-english uppercase text-neutral-600 block">
                      {language === 'ta' ? 'தொலைபேசி' : 'PHONE DESPATCH'}
                    </span>
                    <span className="text-xs text-[#111111] font-english font-bold">
                      {selectedDistrict.contactPhone}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${selectedDistrict.contactEmail}`}
                  className="flex items-center gap-2 p-3 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#E31E24]" />
                  <div>
                    <span className="text-[10px] font-english uppercase text-neutral-600 block">
                      {language === 'ta' ? 'மின்னஞ்சல்' : 'OFFICIAL EMAIL'}
                    </span>
                    <span className="text-xs text-[#111111] font-english font-bold truncate max-w-[140px] block">
                      {selectedDistrict.contactEmail}
                    </span>
                  </div>
                </a>
              </div>

            </div>
          </div>

          {/* Quick select pills */}
          <div className="mt-5 pt-3 border-t-2 border-neutral-900">
            <span className="font-mono text-[10px] uppercase font-bold text-neutral-700 block mb-1.5">
              {language === 'ta' ? 'விரைவு மாவட்டத் தேர்வு:' : 'QUICK DISTRICT SELECTOR:'}
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrictId(d.id)}
                  className={`px-2 py-0.5 text-[11px] font-mono font-semibold border transition-all ${
                    selectedDistrictId === d.id
                      ? 'bg-[#E31E24] text-white border-neutral-900 font-bold'
                      : 'bg-[#FAF7F2] text-neutral-800 border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {d.name[language]}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
