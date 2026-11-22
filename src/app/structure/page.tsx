'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { OrgChart } from '@/components/OrgChart';
import { TamilNaduMap } from '@/components/TamilNaduMap';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { IconShield, IconBuilding, IconUsers } from '@/components/Icons';

export default function StructurePage() {
  const { language } = useLanguage();

  const orgSection = useReveal();
  const chambersSection = useReveal();
  const mapSection = useReveal();

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'அமைப்பு கட்டமைப்பு & பொறுப்பாளர்கள்' : 'Organisational Directory & Cadre'}
        description={
          language === 'ta'
            ? 'மாநில தலைமைச் செயலகம் முதல் 74 அமைப்பு மாவட்ட நீதிமன்ற வழக்கறிஞர் பிரிவுகள் வரை இயங்கும் முழுமையான ஜனநாயகப் படிநிலை அமைப்பு.'
            : 'A structured constitutional vanguard operating from the Apex State Secretariat to 74 District Court units across Tamil Nadu.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-16">

        {/* 1. Main Interactive Organisational Hierarchy */}
        <section 
          ref={orgSection.ref}
          className={`fade-rise ${orgSection.revealed ? 'revealed' : ''}`}
        >
          <OrgChart />
        </section>

        {/* 2. Structural Roles & Jurisdiction Notes (3 solid columns) */}
        <section 
          ref={chambersSection.ref}
          className={`fade-rise ${chambersSection.revealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#111111] border-2 border-[#111111] bg-white">
            
            <div className="p-8 space-y-3">
              <div className="flex items-center justify-between border-b border-[#3d3633] pb-2">
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F]">CHAMBER I</span>
                <IconShield className="w-5 h-5 text-[#C41A1F]" />
              </div>
              <h3 className="font-kavivanar font-normal text-[24px] text-[#111111] leading-tight">
                {language === 'ta' ? 'மாநிலச் செயலகம்' : 'State Legal Secretariat'}
              </h3>
              <p className="text-[15px] text-[#5B5348] leading-relaxed">
                {language === 'ta'
                  ? 'மாநிலச் செயலாளர் தலைமையில் அரசமைப்பு, தேர்தல் சட்டங்கள் மற்றும் கொள்கை வகுக்கும் வழிகாட்டுதல்களை மேற்கொள்கிறது.'
                  : 'Spearheaded by the State Secretary, managing high-stakes Supreme Court litigation and state-level policy advisories.'}
              </p>
            </div>

            <div className="p-8 space-y-3">
              <div className="flex items-center justify-between border-b border-[#3d3633] pb-2">
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F]">CHAMBER II</span>
                <IconBuilding className="w-5 h-5 text-[#C41A1F]" />
              </div>
              <h3 className="font-kavivanar font-normal text-[24px] text-[#111111] leading-tight">
                {language === 'ta' ? 'உயர்நீதிமன்றக் கிளைப் பிரிவுகள்' : 'Madras High Court & Madurai Bench'}
              </h3>
              <p className="text-[15px] text-[#5B5348] leading-relaxed">
                {language === 'ta'
                  ? 'சென்னை முதன்மை அமர்வு மற்றும் மதுரை கிளையில் ரிட் மனுக்கள், பொதுநல வழக்குகள் மற்றும் நீதிப்பேராணைப் பணிகளை வழிநடத்துகிறது.'
                  : 'Coordinating writ jurisdiction, public interest litigations, and appellate advocacy before Principal and Madurai Benches.'}
              </p>
            </div>

            <div className="p-8 space-y-3">
              <div className="flex items-center justify-between border-b border-[#3d3633] pb-2">
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F]">CHAMBER III</span>
                <IconUsers className="w-5 h-5 text-[#C41A1F]" />
              </div>
              <h3 className="font-kavivanar font-normal text-[24px] text-[#111111] leading-tight">
                {language === 'ta' ? '74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்' : '74 District Legal Wings'}
              </h3>
              <p className="text-[15px] text-[#5B5348] leading-relaxed">
                {language === 'ta'
                  ? '74 மாவட்ட அமைப்பாளர்கள் மூலம் அடிமட்ட வழக்கறிஞர்களை ஒருங்கிணைத்து, கீழமை நீதிமன்றங்களில் எளிய மக்களுக்கான சட்டப் பாதுகாப்பை வழங்குகிறது.'
                  : 'Empowering grassroots trial lawyers across all 74 party districts to provide immediate legal defense and rights protection.'}
              </p>
            </div>

          </div>
        </section>

        {/* 3. Tamil Nadu 74 District Organizational Structure & Map */}
        <section 
          ref={mapSection.ref}
          className={`fade-rise ${mapSection.revealed ? 'revealed' : ''}`}
        >
          <div className="border-t-2 border-[#111111] pt-12">
            <TamilNaduMap />
          </div>
        </section>

      </div>
    </div>
  );
}
