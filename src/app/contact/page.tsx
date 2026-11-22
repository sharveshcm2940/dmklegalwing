'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { DMK_ORGANISATION_INFO } from '@/data/content';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  UserPlus, 
  Scale, 
  ArrowRight, 
  Search, 
  Clock 
} from 'lucide-react';

export default function ContactGatewayPage() {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-[#FAF8F5] py-8 sm:py-12 text-[#111111]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Page Header */}
        <div className="border-b-2 border-[#111111] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block" />
            <span className="text-xs font-dmk-body text-[#C41A1F] font-bold uppercase tracking-wider">
              {language === 'ta' ? 'தலைமைச் செயலகத் தொடர்பு & உதவி மையம்' : 'State Secretariat & Legal Assistance'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] font-dmk-headline">
            {language === 'ta' ? 'தொடர்பு & பொது மக்கள் சட்ட உதவி மையம்' : 'Contact & Legal Services Gateway'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-2 max-w-3xl leading-relaxed">
            {language === 'ta'
              ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை, பொது மக்கள் சட்ட உதவி மற்றும் மாநில தலைமைச் செயலகத் தொடர்புகளுக்கான அதிகாரப்பூர்வ தளம்.'
              : 'Direct access to advocate membership enrollment, citizen legal grievance assistance, and official State Secretariat communication channels.'}
          </p>
        </div>

        {/* The Two Primary Action Gateways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Gateway 1: Advocate Membership Enrollment */}
          <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 rounded-[2px] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#FCE8E8] border border-[#C41A1F] flex items-center justify-center rounded-[2px]">
                <UserPlus className="w-6 h-6 text-[#C41A1F]" />
              </div>
              
              <div>
                <span className="text-xs font-bold text-[#C41A1F] uppercase tracking-wider block mb-1">
                  {language === 'ta' ? 'வழக்கறிஞர்களுக்கான தளம்' : 'For Advocates & Jurists'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                  {language === 'ta' ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை' : 'Advocate Membership Enrolment'}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body leading-relaxed">
                {language === 'ta'
                  ? 'பார் கவுன்சிலில் பதிவு செய்த வழக்கறிஞர்கள் திமுக வழக்கறிஞர் அணியில் இணைந்து கட்சி மாவட்ட மற்றும் உயர் நீதிமன்றப் பிரிவுகளில் பணியாற்ற விண்ணப்பிக்கலாம்.'
                  : 'Enrolled advocates can register with the DMK Legal Wing to participate in party district legal units, state committees, and High Court advocacy panels.'}
              </p>

              <ul className="space-y-2 text-xs text-[#111111] pt-2 border-t border-[#D8D3CB]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E31E24]" />
                  <span>{language === 'ta' ? '74 கழக மாவட்டங்கள் & நீதிமன்றப் பிரிவுகள்' : '74 Party District Units & Court Wings'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E31E24]" />
                  <span>{language === 'ta' ? 'அதிகாரப்பூர்வ வழக்கறிஞர் அடையாளச் சான்றிதழ்' : 'Official Legal Wing Membership Credential'}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-[#D8D3CB]">
              <Link
                href="/enrol"
                className="w-full min-h-[44px] px-6 py-3 bg-[#E31E24] hover:bg-[#C41A1F] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ta' ? 'உறுப்பினர் சேர்க்கை படிவம்' : 'Proceed to Advocate Enrolment'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Gateway 2: Citizen Legal Aid & Grievance Desk */}
          <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 rounded-[2px] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#FCE8E8] border border-[#C41A1F] flex items-center justify-center rounded-[2px]">
                <Scale className="w-6 h-6 text-[#C41A1F]" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#C41A1F] uppercase tracking-wider block mb-1">
                  {language === 'ta' ? 'பொதுமக்களுக்கான சட்ட உதவி' : 'For Citizens & Public Aid'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                  {language === 'ta' ? 'பொதுமக்கள் சட்ட உதவி மையம்' : 'Citizen Legal Grievance Desk'}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body leading-relaxed">
                {language === 'ta'
                  ? 'காவல் துறை அத்துமீறல், நில அபகரிப்பு, சட்ட விரோதக் கைது அல்லது அரசு நலத் திட்ட உரிமைகள் தொடர்பான சட்டப் பாதுகாப்பிற்கு நேரடியாக மனு செய்யலாம்.'
                  : 'Submit legal assistance requests for police overreach, civil disputes, unlawful detention, and constitutional rights protection handled confidentially by designated advocates.'}
              </p>

              <div className="p-3 bg-[#FCE8E8] border border-[#C41A1F] text-xs text-[#111111] rounded-[2px]">
                <span className="font-bold text-[#C41A1F] block mb-0.5">
                  {language === 'ta' ? 'அவசர காவல் துறை கைது உதவி' : 'Emergency Custody Support'}
                </span>
                {language === 'ta'
                  ? 'நீங்களோ அல்லது உங்களுக்குத் தெரிந்தவரோ காவல் துறையின் பிடியில் இருந்தால் உடனடியாக தொடர்பு கொள்ளலாம்.'
                  : 'Immediate emergency counsel routing for urgent police detention cases.'}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#D8D3CB]">
              <Link
                href="/citizen-desk"
                className="w-full min-h-[44px] px-6 py-3 bg-[#111111] hover:bg-[#E31E24] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ta' ? 'சட்ட உதவி மனு அளிக்க' : 'File Legal Aid Request'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

        </div>

        {/* Tracking ID Callout Banner */}
        <div className="bg-white border-2 border-[#111111] p-6 rounded-[2px] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px] text-[#111111] shrink-0 mt-0.5">
              <Search className="w-5 h-5 text-[#C41A1F]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#111111] font-dmk-headline">
                {language === 'ta' ? 'விண்ணப்பத்தின் நிலையை அறிய' : 'Track Existing Submission Status'}
              </h3>
              <p className="text-xs text-[#5B5348] font-dmk-body mt-0.5">
                {language === 'ta'
                  ? 'உறுப்பினர் சேர்க்கை அல்லது சட்ட உதவி மனுவின் கண்காணிப்பு அடையாள எண்ணைக் (Tracking ID) கொண்டு அதன் பரிசீலனை நிலையை அறியலாம்.'
                  : 'Lookup the current review status of any enrollment or legal aid submission using your Tracking ID.'}
              </p>
            </div>
          </div>

          <Link
            href="/track"
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#FAF8F5] hover:bg-[#111111] hover:text-white border border-[#111111] text-xs font-bold uppercase tracking-wider text-[#111111] rounded-[2px] transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <span>{language === 'ta' ? 'நிலையை அறிய' : 'Check Status'}</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* State Secretariat Headquarters Information */}
        <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 rounded-[2px] shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D8D3CB]">
            <Building2 className="w-5 h-5 text-[#C41A1F]" />
            <h2 className="text-lg sm:text-xl font-black text-[#111111] font-dmk-headline">
              {language === 'ta' ? 'மாநில தலைமைச் செயலகம்' : 'State Secretariat Headquarters'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            
            {/* Postal Address */}
            <div className="p-4 bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#C41A1F] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#C41A1F]" />
                <span>{language === 'ta' ? 'அஞ்சல் முகவரி' : 'Postal Address'}</span>
              </div>
              <p className="font-bold text-[#111111]">
                {language === 'ta' ? 'அண்ணா அறிவாலயம் (தலைமையகம்)' : 'Anna Arivalayam (Headquarters)'}
              </p>
              <p className="text-[#5B5348] leading-relaxed">
                {DMK_ORGANISATION_INFO.headquarters[language]}
              </p>
            </div>

            {/* Telephone Lines */}
            <div className="p-4 bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#C41A1F] uppercase tracking-wider">
                <Phone className="w-4 h-4 text-[#C41A1F]" />
                <span>{language === 'ta' ? 'தொலைபேசி' : 'Phone Numbers'}</span>
              </div>
              <p className="text-xs text-[#5B5348]">{language === 'ta' ? 'தலைமையக தொலைபேசி:' : 'Secretariat Office:'}</p>
              <a
                href={`tel:${DMK_ORGANISATION_INFO.phone.split('/')[0].trim()}`}
                className="font-mono font-bold text-[#111111] hover:text-[#C41A1F] block min-h-[44px] flex items-center"
              >
                {DMK_ORGANISATION_INFO.phone}
              </a>
            </div>

            {/* Email & Working Hours */}
            <div className="p-4 bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#C41A1F] uppercase tracking-wider">
                <Mail className="w-4 h-4 text-[#C41A1F]" />
                <span>{language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'}</span>
              </div>
              <a
                href={`mailto:${DMK_ORGANISATION_INFO.email}`}
                className="font-mono text-xs font-bold text-[#111111] hover:text-[#C41A1F] block break-all min-h-[44px] flex items-center"
              >
                {DMK_ORGANISATION_INFO.email}
              </a>
              <div className="pt-2 border-t border-[#D8D3CB] flex items-center gap-1 text-[11px] text-[#5B5348]">
                <Clock className="w-3.5 h-3.5 text-[#5B5348]" />
                <span>{language === 'ta' ? 'திங்கள் - சனி: காலை 10 - மாலை 6' : 'Mon - Sat: 10:00 AM - 6:00 PM'}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
