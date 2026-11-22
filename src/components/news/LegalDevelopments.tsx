'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LegalDevelopmentItem } from '@/types';
import { Scale } from 'lucide-react';

interface LegalDevelopmentsProps {
  items: LegalDevelopmentItem[];
}

export const LegalDevelopments: React.FC<LegalDevelopmentsProps> = ({ items }) => {
  const { language } = useLanguage();
  const [selectedCourt, setSelectedCourt] = useState<string>('All');

  const courts = ['All', 'Supreme Court of India', 'Madras High Court', 'Constitutional Bench'];

  const filteredItems = items.filter((item) => {
    if (selectedCourt === 'All') return true;
    return item.court === selectedCourt;
  });

  return (
    <section className="w-full bg-[#FAF8F5] border border-[#D8D3CB] p-6 sm:p-10 font-dmk-body text-[#111111] rounded-[2px]">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#111111] pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Scale className="w-4 h-4 text-[#C41A1F]" />
            <span className="text-xs font-dmk-body font-bold text-[#C41A1F]">
              {language === 'ta' ? 'அரசமைப்பு & நீதிமன்ற நடவடிக்கைகள்' : 'Constitutional Jurisprudence & Court Docket'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline">
            {language === 'ta' ? 'நீதிமன்ற வழக்குக் கண்காணிப்பு (Court Watch)' : 'Court Watch & Legal Developments'}
          </h2>

          <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-1 max-w-2xl">
            {language === 'ta'
              ? 'உச்ச நீதிமன்றம் மற்றும் சென்னை உயர் நீதிமன்றத்தில் திமுக வழக்கறிஞர் அணி முன்னெடுக்கும் முக்கிய அரசமைப்பு, கூட்டாட்சி மற்றும் சமூக நீதி வழக்குகள்.'
              : 'Official status register of significant constitutional and public interest litigations championed by the DMK Legal Wing.'}
          </p>
        </div>

        {/* Square-cornered text tabs with 3px red underline on active tab, min 44px tall */}
        <div className="flex items-center gap-2 border-b border-[#D8D3CB] overflow-x-auto pb-0 scrollbar-none">
          {courts.map((court) => (
            <button
              key={court}
              type="button"
              onClick={() => setSelectedCourt(court)}
              className={`min-h-[44px] px-4 py-2 text-xs font-dmk-body font-bold transition-all border-b-[3px] rounded-none shrink-0 cursor-pointer ${
                selectedCourt === court
                  ? 'border-[#E31E24] text-[#111111]'
                  : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:border-[#D8D3CB]'
              }`}
            >
              {court === 'All' ? (language === 'ta' ? 'அனைத்து நீதிமன்றங்கள்' : 'All Courts') : court}
            </button>
          ))}
        </div>
      </div>

      {/* Court Watch Table: Columns Court, Case, Next hearing, Status */}
      <div className="w-full overflow-x-auto border border-[#D8D3CB] bg-white rounded-[2px]">
        <table className="w-full text-left text-xs font-dmk-body border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#FAF8F5] border-b-2 border-[#111111] text-[#111111]">
              <th scope="col" className="p-3.5 sm:p-4 text-xs font-bold uppercase tracking-wider font-dmk-headline w-1/4">
                {language === 'ta' ? 'நீதிமன்றம்' : 'Court'}
              </th>
              <th scope="col" className="p-3.5 sm:p-4 text-xs font-bold uppercase tracking-wider font-dmk-headline w-2/5">
                {language === 'ta' ? 'வழக்கு விவரம்' : 'Case'}
              </th>
              <th scope="col" className="p-3.5 sm:p-4 text-xs font-bold uppercase tracking-wider font-dmk-headline w-1/6">
                {language === 'ta' ? 'அடுத்த விசாரணை' : 'Next hearing'}
              </th>
              <th scope="col" className="p-3.5 sm:p-4 text-xs font-bold uppercase tracking-wider font-dmk-headline w-1/6">
                {language === 'ta' ? 'நிலை' : 'Status'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D3CB]">
            {filteredItems.map((item) => {
              const nextHearing = (item as any).nextHearing || (item as any).nextHearingDate || '—';

              return (
                <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                  
                  {/* Column 1: Court */}
                  <td className="p-3.5 sm:p-4 align-top">
                    <span className="font-bold text-[#111111] block text-xs sm:text-sm">
                      {item.court}
                    </span>
                    <span className="text-[11px] text-[#5B5348] block mt-0.5">
                      {item.bench}
                    </span>
                  </td>

                  {/* Column 2: Case */}
                  <td className="p-3.5 sm:p-4 align-top space-y-1">
                    <span className="font-bold text-[#111111] font-dmk-headline block text-sm leading-snug">
                      {item.caseTitle[language]}
                    </span>
                    <span className="font-mono text-[11px] text-[#5B5348] block">
                      {item.caseNumber}
                    </span>
                    <p className="text-xs text-[#5B5348] font-dmk-body leading-relaxed pt-1">
                      {item.summary[language]}
                    </p>
                    <div className="text-[11px] text-[#5B5348] pt-1">
                      <span className="text-[#5B5348]">{language === 'ta' ? 'வழக்கறிஞர் குழு: ' : 'Counsel: '}</span>
                      <span className="font-semibold text-[#111111]">{item.counsel[language]}</span>
                    </div>
                  </td>

                  {/* Column 3: Next hearing */}
                  <td className="p-3.5 sm:p-4 align-top">
                    <span className="inline-block px-2.5 py-1 bg-[#FAF8F5] border border-[#D8D3CB] font-english font-medium text-xs text-[#111111] rounded-[2px]">
                      {nextHearing}
                    </span>
                  </td>

                  {/* Column 4: Status */}
                  <td className="p-3.5 sm:p-4 align-top">
                    <span className="inline-block px-2.5 py-1 bg-[#FCE8E8] text-[#C41A1F] border border-[#E31E24]/30 text-xs font-bold rounded-[2px] leading-tight">
                      {item.statusTag[language]}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </section>
  );
};
