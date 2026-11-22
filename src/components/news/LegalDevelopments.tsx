'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LegalDevelopmentItem } from '@/types';
import { Scale, FileText, ExternalLink, ShieldAlert, Award, ChevronRight, Filter } from 'lucide-react';

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
    <section className="w-full bg-[#FAF7F2] border-2 border-neutral-900 p-6 sm:p-10 font-dmk-body text-[#111111]">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-neutral-900 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Scale className="w-4 h-4 text-[#C41A1F]" />
            <span className="text-[11px] font-english font-bold uppercase tracking-[0.25em] text-[#C41A1F]">
              {language === 'ta' ? 'அரசமைப்பு & நீதிமன்ற நடவடிக்கைகள்' : 'CONSTITUTIONAL JURISPRUDENCE & DOCKET'}
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 font-dmk-headline tracking-tight uppercase">
            {language === 'ta' ? 'நீதிமன்ற வழக்குகள் & சட்ட முன்னேற்றங்கள்' : 'LEGAL DEVELOPMENTS'}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-700 font-dmk-body mt-1 max-w-2xl">
            {language === 'ta'
              ? 'உச்ச நீதிமன்றம் மற்றும் சென்னை உயர் நீதிமன்றத்தில் திமுக வழக்கறிஞர் அணி முன்னெடுக்கும் வரலாற்றுச் சிறப்புமிக்க அரசமைப்பு, கூட்டாட்சி மற்றும் சமூக நீதி வழக்குகள்.'
              : 'Important legal proceedings, constitutional matters, and developments of public significance argued by the DMK Legal Wing.'}
          </p>
        </div>

        {/* Court Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {courts.map((court) => (
            <button
              key={court}
              onClick={() => setSelectedCourt(court)}
              className={`px-3 py-1 text-xs font-english transition-all border ${
                selectedCourt === court
                  ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                  : 'bg-white text-neutral-700 hover:border-neutral-900 border-neutral-300'
              }`}
            >
              {court}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Editorial Court Docket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-neutral-900 p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow relative"
          >
            {/* Top red corner indicator */}
            <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
              <div className="bg-[#E31E24] w-12 h-2 rotate-45 translate-x-3 -translate-y-1" />
            </div>

            <div className="space-y-3">
              
              {/* Category, Court & Date */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-english border-b border-neutral-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#C41A1F] uppercase tracking-wider text-[11px]">
                    {item.category}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-700 font-medium">
                    {item.court}
                  </span>
                </div>

                <span className="bg-[#FFF5F5] text-[#C41A1F] border border-[#E31E24] px-2 py-0.5 text-[10px] font-bold uppercase rounded-[2px]">
                  {item.statusTag[language]}
                </span>
              </div>

              {/* Case Title & Docket Reference */}
              <div>
                <span className="font-mono text-[11px] text-neutral-500 block mb-0.5">
                  {item.caseNumber}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-neutral-900 font-dmk-headline leading-tight">
                  {item.caseTitle[language]}
                </h4>
              </div>

              {/* Bench & Arguing Counsel */}
              <div className="bg-[#FAF7F2] p-2.5 border border-neutral-300 text-xs space-y-1 font-english">
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">{language === 'ta' ? 'அமர்வு:' : 'Judicial Bench:'}</span>
                  <span className="font-semibold text-neutral-900">{item.bench}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">{language === 'ta' ? 'கழக மூத்த வழக்கறிஞர்:' : 'Lead Counsel:'}</span>
                  <span className="font-bold text-[#C41A1F]">{item.counsel[language]}</span>
                </div>
              </div>

              {/* Summary of Arguments / Orders */}
              <p className="text-xs sm:text-sm text-neutral-700 font-dmk-body leading-relaxed">
                {item.summary[language]}
              </p>

              {/* Constitutional Significance */}
              <div className="text-xs border-l-2 border-neutral-900 pl-2.5 py-0.5 text-neutral-600 italic font-dmk-body">
                <span className="font-semibold text-neutral-900 not-italic uppercase text-[10px] block font-english">
                  {language === 'ta' ? 'அரசமைப்பு முக்கியத்துவம்:' : 'Constitutional Significance:'}
                </span>
                {item.significance[language]}
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-5 border-t border-neutral-200 flex items-center justify-between text-xs font-english">
              <time className="text-neutral-500">
                {language === 'ta' ? 'தேதி:' : 'Date:'} {item.date}
              </time>

              <div className="flex items-center gap-2">
                <a
                  href="#legal-docket"
                  className="inline-flex items-center gap-1 text-neutral-900 hover:text-[#C41A1F] font-bold uppercase transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C41A1F]" />
                  <span>{language === 'ta' ? 'வழக்கு ஆவணம்' : 'Docket Record'}</span>
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
