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

interface TamilNaduMapProps {
  onSelectSubDistrict?: (district: DistrictInfo) => void;
  selectedSubDistrictId?: string;
}

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({
  onSelectSubDistrict,
  selectedSubDistrictId
}) => {
  const { language } = useLanguage();
  const { districts } = useData();

  // Selected administrative district code (default Tiruvannamalai 'TVM')
  const [selectedCode, setSelectedCode] = useState<string>('TVM');
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

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

    if (list.length === 0) {
      const fallback = districts.filter((d) =>
        d.name.en.toLowerCase().includes(activeAdminDistrict.name.en.toLowerCase())
      );
      if (fallback.length > 0) return fallback;
      return [districts[0]];
    }

    return list;
  }, [activeAdminDistrict, districts]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran border-2 border-[#111111] p-6 md:p-8">
      
      {/* Required explanatory line above the map */}
      <div className="mb-6 border-b border-[#3d3633] pb-4">
        <p className="text-[15px] font-semibold text-[#5B5348] leading-relaxed">
          {language === 'ta'
            ? '38 வருவாய் நிர்வாக மாவட்டங்கள் மற்றும் 74 கழக அமைப்பு மாவட்டங்கள் வரைபடத்தில் இணைக்கப்பட்டுள்ளன; ஒரு நிர்வாக மாவட்டத்தில் ஒன்றுக்கும் மேற்பட்ட கழக அமைப்பாளர்கள் செயல்படுகின்றனர்.'
            : '38 administrative districts and 74 party units: multiple party organisational units function across the state\'s revenue jurisdictions.'}
        </p>
      </div>

      {/* Map Layout: Map on left, District Cadre on right (stacks on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SVG MAP CONTAINER (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#111111] p-4 flex flex-col items-center">
          <div className="w-full aspect-[4/5] max-w-[500px] relative flex items-center justify-center">
            <svg
              viewBox={TN_MAP_VIEWBOX}
              className="w-full h-full overflow-visible"
              aria-label={language === 'ta' ? 'தமிழ்நாடு மாவட்ட வரைபடம்' : 'Tamil Nadu Geographic District Map'}
            >
              {REAL_TN_DISTRICTS.map((dist) => {
                const isSelected = activeAdminDistrict.code === dist.code;
                const isHovered = hoveredCode === dist.code;

                return (
                  <path
                    key={dist.code}
                    d={dist.path}
                    tabIndex={0}
                    role="button"
                    aria-label={`${dist.name[language]} (${dist.name.en})`}
                    onClick={() => {
                      setSelectedCode(dist.code);
                      if (onSelectSubDistrict && currentSubDistricts[0]) {
                        onSelectSubDistrict(currentSubDistricts[0]);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCode(dist.code);
                        if (onSelectSubDistrict && currentSubDistricts[0]) {
                          onSelectSubDistrict(currentSubDistricts[0]);
                        }
                      }
                    }}
                    onMouseEnter={() => setHoveredCode(dist.code)}
                    onMouseLeave={() => setHoveredCode(null)}
                    fill={isSelected || isHovered ? '#E31E24' : '#f6c9ca'}
                    stroke="#111111"
                    strokeWidth={isSelected || isHovered ? '2' : '1'}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:stroke-[#111111] focus-visible:stroke-[3]"
                  >
                    <title>{dist.name.en} ({dist.name.ta})</title>
                  </path>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 text-center">
            <span className="font-manrope font-extrabold text-[15px] text-[#111111]">
              {activeAdminDistrict.name[language]} ({activeAdminDistrict.name.en})
            </span>
            <span className="text-[13px] text-[#5B5348] block">
              {currentSubDistricts.length} {language === 'ta' ? 'கழக அமைப்பு மாவட்டங்கள்' : 'Party units mapped'}
            </span>
          </div>
        </div>

        {/* SUB-DISTRICT CADRE LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b-2 border-[#111111] pb-2">
            <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
              {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட வருவாய் மாவட்டம்' : 'Selected Administrative District'}
            </span>
            <h3 className="font-manrope font-extrabold text-[24px] text-[#111111]">
              {activeAdminDistrict.name[language]}
            </h3>
          </div>

          {/* Sub-districts list */}
          <div className="space-y-3">
            {currentSubDistricts.map((sub, idx) => {
              const isPhonePublic = sub.showPhonePublicly !== false;
              const phoneNumbers = isPhonePublic && sub.contactPhone
                ? sub.contactPhone.split(/[,;/]/).map((p) => p.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubDistrict?.(sub)}
                  className={`p-4 border-2 transition-all cursor-pointer ${
                    selectedSubDistrictId === sub.id
                      ? 'bg-[#111111] text-[#FAF8F5] border-[#111111]'
                      : 'bg-white text-[#111111] border-[#111111] hover:bg-[#f1ece2]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-[#C41A1F] block">
                        UNIT {idx + 1} • {sub.zone}
                      </span>
                      <h4 className="font-manrope font-extrabold text-[18px] leading-snug">
                        {sub.name[language]}
                      </h4>
                      <p className={`text-[14px] mt-1 ${selectedSubDistrictId === sub.id ? 'text-[#d8cfc2]' : 'text-[#5B5348]'}`}>
                        <span className="font-semibold">{sub.organizer[language]}</span>
                      </p>
                    </div>
                  </div>

                  {/* Phone call action or privacy notice */}
                  <div className="mt-3 pt-3 border-t border-current/20">
                    {isPhonePublic && phoneNumbers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {phoneNumbers.map((phone, pIdx) => (
                          <a
                            key={pIdx}
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="min-h-[44px] px-3 py-1.5 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-manrope font-extrabold text-[13px] inline-flex items-center gap-1.5 btn-lift cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{phone}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[12px] italic opacity-80 block">
                        {language === 'ta' ? 'மாநிலத் தலைமைச் செயலகம் வாயிலாகத் தொடர்பு கொள்க' : 'Contact through the State Secretariat'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
