'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { IconCheck, IconSearch, IconChevronRight } from '@/components/Icons';

function ConfirmationContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const trackingId = searchParams.get('id') || 'N/A';
  const type = searchParams.get('type') || 'submission';

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const isEnrol = type === 'enrol';

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={isEnrol 
          ? (language === 'ta' ? 'சேர்க்கை மனு பெறப்பட்டது' : 'Enrolment Application Received')
          : (language === 'ta' ? 'சட்ட உதவி மனு பெறப்பட்டது' : 'Legal Grievance Received')}
        description={
          language === 'ta'
            ? 'உங்கள் மனு வெற்றிகரமாகப் பெறப்பட்டது. கண்காணிப்பு எண்ணைக் குறித்துக் கொள்ளவும்.'
            : 'Your submission has been securely docketed. Please retain your tracking identification number.'
        }
      />

      <div className="max-w-[720px] mx-auto px-[clamp(20px,4vw,56px)] pt-12">
        
        <div className="bg-white border-2 border-[#111111] p-8 sm:p-12 text-center space-y-6">
          
          {/* Solid 16px red square */}
          <div className="w-12 h-12 bg-[#E31E24] text-white mx-auto flex items-center justify-center">
            <IconCheck className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-2">
            <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
              {language === 'ta' ? 'அதிகாரப்பூர்வ பதிவு எண்' : 'OFFICIAL REGISTRATION REFERENCE'}
            </span>
            <h2 className="font-kavivanar font-normal text-[32px] text-[#111111] leading-tight">
              {isEnrol
                ? (language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை பதிவு செய்யப்பட்டது' : 'Enrolment Docket Registered')
                : (language === 'ta' ? 'சட்ட உதவி கோரிக்கை பதிவு செய்யப்பட்டது' : 'Grievance Docket Registered')}
            </h2>
          </div>

          <p className="text-[16px] text-[#5B5348] leading-relaxed max-w-lg mx-auto">
            {isEnrol
              ? (language === 'ta'
                ? 'உங்கள் விண்ணப்பம் பரிசீலிக்கப்பட்டு உங்கள் மாவட்ட வழக்கறிஞர் அணி அமைப்பாளருக்கு அனுப்பப்பட்டுள்ளது.'
                : 'Your application has been received and routed to your designated district Legal Wing organiser.')
              : (language === 'ta'
                ? 'உங்கள் கோரிக்கை தொடர்புடைய மாவட்ட வழக்கறிஞர் அமைப்பாளருக்கு அனுப்பப்பட்டுள்ளது.'
                : 'Your grievance has been assigned to the relevant district legal assistance cell.')}
          </p>

          {/* Tracking ID Box */}
          <div className="p-6 bg-[#f1ece2] border-2 border-[#111111] space-y-3">
            <span className="text-[12px] text-[#5B5348] font-bold uppercase block">
              {language === 'ta' ? 'உங்கள் கண்காணிப்பு அடையாள எண்:' : 'Your Tracking ID:'}
            </span>
            <div className="font-mono font-extrabold text-[26px] sm:text-[30px] text-[#111111] tracking-wider select-all">
              {trackingId}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] px-6 py-2 bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[13px] inline-flex items-center gap-2 cursor-pointer btn-lift"
            >
              <IconCheck className="w-4 h-4 text-[#C41A1F]" />
              <span>{copied ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'நகலெடு' : 'Copy Tracking ID')}</span>
            </button>
          </div>

          <div className="pt-6 border-t-2 border-[#111111] flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/track?id=${encodeURIComponent(trackingId)}`}
              className="w-full sm:w-auto min-h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] inline-flex items-center justify-center gap-2 btn-lift"
            >
              <IconSearch className="w-4 h-4" />
              <span>{language === 'ta' ? 'மனுவைக் கண்காணிக்க' : 'Track This Application'}</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto min-h-[48px] px-8 bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[14px] inline-flex items-center justify-center btn-lift"
            >
              {language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Return to Home'}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center p-12 text-[#111111] font-bold">
        Loading...
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
