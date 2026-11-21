'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { OrgChart } from '@/components/OrgChart';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { Award, Layers, Users } from 'lucide-react';

export default function StructurePage() {
  const { language } = useLanguage();

  return (
    <div className="w-full flex flex-col space-y-12 py-10 font-dmk-body bg-[#FAF7F2]">
      
      {/* 1. Broadsheet Directory Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-y-2 border-neutral-900 p-8 sm:p-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 border-b border-neutral-300 pb-2">
              <span className="text-xs font-english font-bold text-[#E31E24] tracking-[0.2em] uppercase">
                {language === 'ta' ? 'அமைப்பு கட்டமைப்பு & பொறுப்பாளர்கள்' : 'ORGANISATIONAL DIRECTORY & CADRE'}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-english text-neutral-500">ESTD. 1971 • CHENNAI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-tight">
              {language === 'ta'
                ? 'திமுக வழக்கறிஞர் அணி அமைப்பு வரைபடம்'
                : 'DMK Legal Wing Organisational Structure'}
            </h1>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-english border-l-4 border-[#E31E24] pl-4 py-1">
              {language === 'ta'
                ? 'மாநில தலைமைச் செயலகம் முதல் 74 அமைப்பு மாவட்ட நீதிமன்ற வழக்கறிஞர் பிரிவுகள் வரை இயங்கும் முழுமையான ஜனநாயகப் படிநிலை அமைப்பு.'
                : 'A structured constitutional vanguard operating from the Apex State Secretariat to 74 District Court units across Tamil Nadu and Puducherry.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Interactive Organisational Hierarchy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <OrgChart />
      </section>

      {/* 3. Structural Roles & Jurisdiction Notes (Broadsheet Classified Columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-300 border border-neutral-300 bg-white">
          <div className="p-6 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-[10px] font-english font-bold uppercase text-[#B81318]">CHAMBER I</span>
              <Award className="w-5 h-5 text-[#E31E24]" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 font-dmk-headline">
              {language === 'ta' ? 'மாநிலச் செயலகம்' : 'State Legal Secretariat'}
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body">
              {language === 'ta'
                ? 'மாநிலச் செயலாளர் தலைமையில் அரசமைப்பு, தேர்தல் சட்டங்கள் மற்றும் கொள்கை வகுக்கும் வழிகாட்டுதல்களை மேற்கொள்கிறது.'
                : 'Spearheaded by the State Secretary, managing high-stakes Supreme Court litigation and state-level policy advisories.'}
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-[10px] font-english font-bold uppercase text-[#B81318]">CHAMBER II</span>
              <Layers className="w-5 h-5 text-[#E31E24]" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 font-dmk-headline">
              {language === 'ta' ? 'உயர்நீதிமன்றக் கிளைப் பிரிவுகள்' : 'Madras High Court & Madurai Bench'}
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body">
              {language === 'ta'
                ? 'சென்னை முதன்மை அமர்வு மற்றும் மதுரை கிளையில் ரிட் மனுக்கள், பொதுநல வழக்குகள் மற்றும் நீதிப்பேராணைப் பணிகளை வழிநடத்துகிறது.'
                : 'Coordinating writ jurisdiction, public interest litigations, and appellate advocacy before Principal and Madurai Benches.'}
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-[10px] font-english font-bold uppercase text-[#B81318]">CHAMBER III</span>
              <Users className="w-5 h-5 text-[#E31E24]" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 font-dmk-headline">
              {language === 'ta' ? '74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்' : '74 District Legal Wings'}
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body">
              {language === 'ta'
                ? '74 மாவட்ட அமைப்பாளர்கள் மூலம் அடிமட்ட வழக்கறிஞர்களை ஒருங்கிணைத்து, கீழமை நீதிமன்றங்களில் எளிய மக்களுக்கான சட்டப் பாதுகாப்பை வழங்குகிறது.'
                : 'Empowering grassroots trial lawyers across all 74 party districts to provide immediate legal defense and rights protection.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Tamil Nadu 74 District Organizational Structure & Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <TamilNaduMap />
      </section>

    </div>
  );
}
