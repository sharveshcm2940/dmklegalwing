'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function ConfirmationContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const trackingId = searchParams.get('id') || 'DMK-REF';
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
    <div className="w-full bg-[#FAF8F5] text-[#111111] min-h-[80vh] flex flex-col justify-center items-center py-16 px-4">
      <div className="max-w-[800px] w-full bg-white border-2 border-[#111111] p-8 sm:p-14 text-center space-y-8">
        
        {/* "Received" in Kavivanar 64 px */}
        <h1 className="font-kavivanar text-[64px] text-[#111111] leading-none">
          {language === 'ta' ? 'பெறப்பட்டது' : 'Received'}
        </h1>

        {/* Tracking ID in Helvetica Now Display 800 at 64 px with "Copy" button */}
        <div className="space-y-4 pt-4 border-t-2 border-[#111111]">
          <span className="text-[13px] font-extrabold uppercase text-[#5B5348] block">
            {language === 'ta' ? 'கண்காணிப்பு அடையாள எண்' : 'Tracking ID'}
          </span>
          <div className="font-helvetica font-extrabold text-[clamp(28px,5.5vw,64px)] text-[#E31E24] tracking-normal select-all break-all leading-tight">
            {trackingId}
          </div>
          <div>
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] px-8 bg-[#111111] hover:bg-black text-[#FAF8F5] font-extrabold text-[15px] inline-flex items-center justify-center cursor-pointer btn-lift transition-colors"
            >
              {copied
                ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!')
                : (language === 'ta' ? 'நகலெடு' : 'Copy')}
            </button>
          </div>
        </div>

        {/* What happens next in two plain sentences */}
        <div className="pt-6 border-t border-[#d7d0c3] space-y-2 text-[18px] text-[#333333] leading-relaxed max-w-xl mx-auto">
          {isEnrol ? (
            language === 'ta' ? (
              <>
                <p>உங்கள் வழக்கறிஞர் சேர்க்கை மனு சரிபார்ப்பிற்காக உங்கள் மாவட்ட வழக்கறிஞர் அணி அமைப்பாளருக்கு அனுப்பப்பட்டுள்ளது.</p>
                <p>உங்கள் பார் கவுன்சில் பதிவுகள் உறுதி செய்யப்பட்டதும், மாநில தலைமை அலுவலகத்திலிருந்து உங்களைத் தொடர்பு கொள்வர்.</p>
              </>
            ) : (
              <>
                <p>Your enrolment dossier has been transmitted to your designated district Legal Wing organiser for verification.</p>
                <p>Our state secretariat will contact you within three working days with your verified membership credentials.</p>
              </>
            )
          ) : (
            language === 'ta' ? (
              <>
                <p>உங்கள் சட்ட உதவி மனு பதிவு செய்யப்பட்டு, உங்கள் மாவட்டத்திற்கான சட்டப் பாதுகாப்புக் குழுவிற்கு ஒதுக்கப்பட்டுள்ளது.</p>
                <p>உங்கள் மனுவை உடனடியாக முன்னெடுக்க எங்கள் வழக்கறிஞர் குழுவினர் நீங்கள் வழங்கிய தொலைபேசி எண்ணில் உங்களைத் தொடர்பு கொள்வர்.</p>
              </>
            ) : (
              <>
                <p>Your legal grievance petition has been assigned to a panel advocate in your jurisdiction.</p>
                <p>A designated duty advocate will contact you at the provided phone number to assist with immediate legal proceedings.</p>
              </>
            )
          )}
        </div>

        {/* Action Link to Track */}
        <div className="pt-6 border-t-2 border-[#111111] flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/track?id=${encodeURIComponent(trackingId)}`}
            className="w-full sm:w-auto min-h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center cursor-pointer btn-lift transition-colors"
          >
            {language === 'ta' ? 'மனுவைக் கண்காணிக்க' : 'Track status'}
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto min-h-[48px] px-8 bg-[#FAF8F5] hover:bg-[#f1ece2] text-[#111111] border-2 border-[#111111] font-extrabold text-[15px] inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            {language === 'ta' ? 'முகப்புக்குத் திரும்புக' : 'Return to Contact'}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-12 text-[#111111] font-bold">
          Loading...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
