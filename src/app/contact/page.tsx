'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { DMK_ORGANISATION_INFO } from '@/data/content';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { 
  IconBuilding, 
  IconMapPin, 
  IconPhone, 
  IconMail, 
  IconScale, 
  IconChevronRight 
} from '@/components/Icons';

export default function ContactGatewayPage() {
  const { language } = useLanguage();

  const gatewaysSection = useReveal();
  const officesSection = useReveal();

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'தொடர்பு & சட்ட உதவி மையம்' : 'Contact & Legal Services Gateway'}
        description={
          language === 'ta'
            ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை, பொது மக்கள் சட்ட உதவி மற்றும் மாநில தலைமைச் செயலகத் தொடர்புகள்.'
            : 'Direct access to advocate enrolment, citizen legal grievance assistance, and official State Secretariat channels.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-16">

        {/* 1. The Two Primary Action Gateways */}
        <section 
          ref={gatewaysSection.ref}
          className={`fade-rise ${gatewaysSection.revealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gateway 1: Advocate Enrolment (Red Accent) */}
            <div className="bg-[#FAF8F5] border-2 border-[#111111] p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
                  <span className="text-[12px] font-extrabold uppercase text-[#C41A1F]">
                    {language === 'ta' ? 'வழக்கறிஞர்களுக்கான தளம்' : 'FOR ADVOCATES & JURISTS'}
                  </span>
                  <IconScale className="w-5 h-5 text-[#C41A1F]" />
                </div>

                <h2 className="font-kavivanar font-normal text-[32px] text-[#111111] leading-tight">
                  {language === 'ta' ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை' : 'Advocate Membership Enrolment'}
                </h2>

                <p className="text-[17px] text-[#3a322d] leading-relaxed">
                  {language === 'ta'
                    ? 'பார் கவுன்சிலில் பதிவு செய்த வழக்கறிஞர்கள் திமுக வழக்கறிஞர் அணியில் இணைந்து கட்சி மாவட்ட மற்றும் உயர் நீதிமன்றப் பிரிவுகளில் பணியாற்ற விண்ணப்பிக்கலாம்.'
                    : 'Enrolled advocates can register with the DMK Legal Wing to participate in party district legal units, state committees, and High Court advocacy panels.'}
                </p>

                <ul className="space-y-2 text-[15px] text-[#111111] pt-2 border-t border-[#d7d0c3]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E31E24]" />
                    <span>{language === 'ta' ? '74 கழக அமைப்பு மாவட்டங்கள் & நீதிமன்றப் பிரிவுகள்' : '74 Party District Units & Court Wings'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E31E24]" />
                    <span>{language === 'ta' ? 'அதிகாரப்பூர்வ வழக்கறிஞர் அடையாளச் சான்றிதழ்' : 'Official Legal Wing Membership Credential'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  href="/enrol"
                  className="w-full min-h-[48px] bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center gap-2 btn-lift"
                >
                  <span>{language === 'ta' ? 'உறுப்பினராக விண்ணப்பிக்க' : 'Enrol as an Advocate'}</span>
                  <IconChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Gateway 2: Citizen Legal Aid Grievance Desk (Ink Accent) */}
            <div className="bg-[#111111] text-[#FAF8F5] border-2 border-[#111111] p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d3633] pb-3">
                  <span className="text-[12px] font-extrabold uppercase text-[#ff8a85]">
                    {language === 'ta' ? 'பொது மக்கள் சட்ட உதவி மையம்' : 'PUBLIC LEGAL AID DESK'}
                  </span>
                  <span className="w-4 h-4 bg-[#E31E24]" />
                </div>

                <div className="border border-[#E31E24] p-3 text-[14px] font-bold text-white">
                  If you or someone you know is in police custody, call [HELPLINE NUMBER] now.
                </div>

                <h2 className="font-kavivanar font-normal text-[32px] text-white leading-tight">
                  {language === 'ta' ? 'மக்கள் சட்ட உதவி மையம்' : 'Citizen Legal Grievance Portal'}
                </h2>

                <p className="text-[17px] text-[#d8cfc2] leading-relaxed">
                  {language === 'ta'
                    ? 'பொது மக்கள் தங்களது சட்டப் பிரச்னைகள், நிலுவை வழக்குகள் மற்றும் மனித உரிமை மீறல்கள் தொடர்பாக இலவச சட்ட ஆலோசனை பெற விண்ணப்பிக்கலாம்.'
                    : 'Submit your legal grievance or seek pro-bono defense from our district legal aid committees and panel counsel.'}
                </p>

                <ul className="space-y-2 text-[15px] text-[#d8cfc2] pt-2 border-t border-[#3d3633]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E31E24]" />
                    <span>{language === 'ta' ? 'உடனடி இணைய மனு கண்காணிப்பு எண்' : 'Real-Time Grievance Tracking Number'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E31E24]" />
                    <span>{language === 'ta' ? 'மாவட்ட வழக்கறிஞர் குழு நேரடி உதவி' : 'District Legal Aid Committee Support'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/citizen-desk"
                  className="flex-1 min-h-[48px] bg-[#FAF8F5] hover:bg-white text-[#111111] font-extrabold text-[15px] inline-flex items-center justify-center gap-2 btn-lift"
                >
                  <span>{language === 'ta' ? 'மனுவை சமர்ப்பிக்க' : 'Submit Grievance'}</span>
                  <IconChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/track"
                  className="min-h-[48px] px-6 border-2 border-[#FAF8F5] hover:bg-white/10 text-white font-extrabold text-[15px] inline-flex items-center justify-center btn-lift"
                >
                  {language === 'ta' ? 'மனு நிலை' : 'Track Status'}
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 2. Official Secretariat Offices */}
        <section 
          ref={officesSection.ref}
          className={`fade-rise ${officesSection.revealed ? 'revealed' : ''}`}
        >
          <div className="border-2 border-[#111111] bg-white p-8 sm:p-12 space-y-8">
            <div className="border-b-2 border-[#111111] pb-4">
              <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                {language === 'ta' ? 'அதிகாரப்பூர்வ முகவரிகள்' : 'OFFICIAL CONTACT CHANNELS'}
              </span>
              <h3 className="font-kavivanar font-normal text-[30px] text-[#111111] leading-tight">
                {language === 'ta' ? 'கழகத் தலைமைச் செயலகம் & உயர் நீதிமன்ற அலுவலகம்' : 'State Legal Headquarters & High Court Chambers'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[16px]">
              
              {/* Headquarters */}
              <div className="p-6 bg-[#f1ece2] border-2 border-[#111111] space-y-4">
                <div className="flex items-center gap-3 border-b border-[#3d3633] pb-2">
                  <IconBuilding className="w-5 h-5 text-[#C41A1F]" />
                  <h4 className="font-extrabold text-[18px] text-[#111111]">
                    {language === 'ta' ? 'கழகத் தலைமைச் செயலகம்' : 'Party Central Headquarters'}
                  </h4>
                </div>
                <p className="text-[#3a322d] leading-relaxed">
                  {DMK_ORGANISATION_INFO.headquarters[language]}
                </p>
                <div className="space-y-2 pt-2 border-t border-[#d7d0c3] text-[15px]">
                  <div className="flex items-center gap-2">
                    <IconPhone className="w-4 h-4 text-[#C41A1F]" />
                    <span className="font-helvetica font-bold">044-2434 4444 / 044-2434 4455</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMail className="w-4 h-4 text-[#C41A1F]" />
                    <span className="font-helvetica font-bold">legalwing@dmk.org.in</span>
                  </div>
                </div>
              </div>

              {/* High Court Office */}
              <div className="p-6 bg-[#f1ece2] border-2 border-[#111111] space-y-4">
                <div className="flex items-center gap-3 border-b border-[#3d3633] pb-2">
                  <IconMapPin className="w-5 h-5 text-[#C41A1F]" />
                  <h4 className="font-extrabold text-[18px] text-[#111111]">
                    {language === 'ta' ? 'உயர் நீதிமன்ற அலுவலகம்' : 'High Court Legal Chambers'}
                  </h4>
                </div>
                <p className="text-[#3a322d] leading-relaxed">
                  {DMK_ORGANISATION_INFO.highCourtOffice[language]}
                </p>
                <div className="space-y-2 pt-2 border-t border-[#d7d0c3] text-[15px]">
                  <div className="flex items-center gap-2">
                    <IconPhone className="w-4 h-4 text-[#C41A1F]" />
                    <span className="font-helvetica font-bold">044-2534 1122</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMail className="w-4 h-4 text-[#C41A1F]" />
                    <span className="font-helvetica font-bold">hc.legalwing@dmk.org.in</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
