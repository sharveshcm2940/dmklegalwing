'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, Copy, Check, ArrowRight, Search, ShieldCheck } from 'lucide-react';

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
    } catch {
      // Fallback
    }
  };

  const isEnrol = type === 'enrol';

  return (
    <div className="w-full bg-[#FAF8F5] py-12 sm:py-16 text-[#111111]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <div className="bg-white border-2 border-[#111111] p-6 sm:p-10 rounded-[2px] shadow-sm text-center space-y-6">
          
          {/* Success Check Icon */}
          <div className="w-16 h-16 bg-[#FCE8E8] border-2 border-[#C41A1F] text-[#C41A1F] mx-auto flex items-center justify-center rounded-[2px]">
            <CheckCircle2 className="w-10 h-10 text-[#C41A1F]" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#C41A1F] uppercase tracking-wider block">
              {isEnrol
                ? language === 'ta'
                  ? 'சேர்க்கை மனு பெறப்பட்டது'
                  : 'ENROLMENT APPLICATION RECEIVED'
                : language === 'ta'
                ? 'சட்ட உதவி மனு பெறப்பட்டது'
                : 'LEGAL GRIEVANCE RECEIVED'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline">
              {language === 'ta' ? 'விண்ணப்பம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது' : 'Submission Confirmed Successfully'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body max-w-lg mx-auto leading-relaxed">
              {isEnrol
                ? language === 'ta'
                  ? 'தங்களின் வழக்கறிஞர் சேர்க்கை விண்ணப்பம் தலைமைச் செயலகப் பதிவேட்டில் சேர்க்கப்பட்டுள்ளது.'
                : 'Your advocate membership application has been logged with the State Legal Wing Secretariat.'
                : language === 'ta'
                ? 'தங்களின் சட்டக் குறைதீர்ப்பு மனு திமுக சட்டத்துறை தலைமைச் செயலகக் குழுவிற்கு அனுப்பப்பட்டுள்ளது.'
                : 'Your legal grievance dossier has been forwarded to the designated State Secretariat Legal Panel.'}
            </p>
          </div>

          {/* Tracking ID Box in Large Type */}
          <div className="p-6 bg-[#FAF8F5] border-2 border-[#D8D3CB] rounded-[2px] space-y-3">
            <span className="text-xs font-bold text-[#5B5348] uppercase tracking-wider block">
              {language === 'ta' ? 'உங்கள் கண்காணிப்பு அடையாள எண் (TRACKING ID)' : 'YOUR OFFICIAL TRACKING ID'}
            </span>
            
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#C41A1F] tracking-wider break-all select-all py-1">
              {trackingId}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleCopy}
                className="min-h-[44px] px-5 py-2 bg-white hover:bg-[#111111] hover:text-white border border-[#111111] text-xs font-bold uppercase tracking-wider text-[#111111] rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>
                  {copied
                    ? language === 'ta'
                      ? 'நகலெடுக்கப்பட்டது!'
                      : 'Copied!'
                    : language === 'ta'
                    ? 'ஐடியை நகலெடு'
                    : 'Copy Tracking ID'}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[#5B5348] font-dmk-body pt-1">
              {language === 'ta'
                ? 'எதிர்காலக் குறிப்பு மற்றும் நிலையை அறிய இந்த எண்ணைப் பாதுகாப்பாக வைத்துக்கொள்ளவும்.'
                : 'Please preserve this tracking code safely to verify review status updates.'}
            </p>
          </div>

          {/* Next Steps / Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/track?id=${encodeURIComponent(trackingId)}`}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#E31E24] hover:bg-[#C41A1F] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'ta' ? 'நிலையை இப்போது சோதிக்க' : 'Check Status Now'}</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#111111] border border-[#111111] text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center cursor-pointer"
            >
              <span>{language === 'ta' ? 'முகப்பிற்குத் திரும்புக' : 'Return to Home'}</span>
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
      <div className="w-full bg-[#FAF8F5] py-16 text-center text-xs text-[#5B5348]">
        Loading confirmation...
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
