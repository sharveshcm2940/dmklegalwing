'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';

export default function ContactGatewayPage() {
  const { language } = useLanguage();
  const gatewaysSection = useReveal();

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      {/* Title band: "Contact" / "தொடர்பு" */}
      <PageTitleBand
        title={language === 'ta' ? 'தொடர்பு' : 'Contact'}
        description={
          language === 'ta'
            ? 'திமுக வழக்கறிஞர் அணி உறுப்பினர் சேர்க்கை மற்றும் பொது மக்கள் சட்ட உதவி மைய நுழைவு வாயில்.'
            : 'Access advocate membership enrolment and public citizen legal aid services.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12">
        {/* Two equal full-width blocks side by side (stacked on phones) */}
        <section
          ref={gatewaysSection.ref}
          className={`fade-rise ${gatewaysSection.revealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* 1. Red Block (white text): Advocate enrolment */}
            <div className="bg-[#E31E24] text-white border-2 border-[#111111] p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[12px] font-extrabold uppercase text-[#FAF8F5] block tracking-normal">
                  {language === 'ta' ? 'வழக்கறிஞர்களுக்கான தளம்' : 'For Advocates & Jurists'}
                </span>
                <h2
                  className={`${
                    language === 'ta' ? 'font-kavivanar' : 'font-helvetica'
                  } font-extrabold text-[32px] sm:text-[38px] leading-tight text-white`}
                >
                  {language === 'ta' ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை' : 'Advocate enrolment'}
                </h2>
                <p className="text-[18px] text-[#FAF8F5] leading-relaxed">
                  {language === 'ta'
                    ? '74 கழக அமைப்பு மாவட்டங்கள் மற்றும் நீதிமன்றப் பிரிவுகளில் வழக்கறிஞராக இணையுங்கள்.'
                    : 'Enrol as an advocate in the DMK Legal Wing across 74 party district units and court wings.'}
                </p>
              </div>

              <div>
                <Link
                  href="/enrol"
                  className="w-full sm:w-auto min-h-[48px] px-8 bg-[#111111] hover:bg-black text-[#FAF8F5] font-extrabold text-[15px] inline-flex items-center justify-center cursor-pointer btn-lift transition-colors"
                >
                  {language === 'ta' ? 'உறுப்பினராக விண்ணப்பிக்க' : 'Enrol now'}
                </Link>
              </div>
            </div>

            {/* 2. Ink Block: Citizen legal desk with boxed notice and parchment button */}
            <div className="bg-[#111111] text-[#FAF8F5] border-2 border-[#111111] p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-[12px] font-extrabold uppercase text-[#FAF8F5] block tracking-normal">
                    {language === 'ta' ? 'பொது மக்கள் சட்ட உதவி' : 'Public Legal Assistance'}
                  </span>
                  <h2
                    className={`${
                      language === 'ta' ? 'font-kavivanar' : 'font-helvetica'
                    } font-extrabold text-[32px] sm:text-[38px] leading-tight text-white`}
                  >
                    {language === 'ta' ? 'பொது மக்கள் சட்ட உதவி மையம்' : 'Citizen legal desk'}
                  </h2>
                  <p className="text-[18px] text-[#f1ece2] leading-relaxed">
                    {language === 'ta'
                      ? 'இலவச சட்ட உதவி, மனித உரிமைப் பாதுகாப்பு மற்றும் ஆட்கொணர்வு மனுக்களுக்கான உதவி மையம்.'
                      : 'Access state-wide pro-bono legal aid, civil rights defense, and habeas corpus assistance.'}
                  </p>
                </div>

                {/* Boxed notice: 2 px red border */}
                <div className="border-2 border-[#E31E24] p-4 bg-[#111111] text-[15px] font-bold text-white leading-relaxed">
                  If you or someone you know is in police custody, call [HELPLINE NUMBER] now.
                </div>
              </div>

              <div>
                <Link
                  href="/citizen-desk"
                  className="w-full sm:w-auto min-h-[48px] px-8 bg-[#FAF8F5] hover:bg-[#f1ece2] text-[#111111] font-extrabold text-[15px] inline-flex items-center justify-center cursor-pointer btn-lift transition-colors"
                >
                  {language === 'ta' ? 'சட்ட உதவி கோருக' : 'Submit grievance'}
                </Link>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
