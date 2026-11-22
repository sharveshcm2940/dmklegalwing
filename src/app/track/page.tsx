'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Search, ShieldAlert, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

function TrackContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [inputVal, setInputVal] = useState(queryId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    trackingId?: string;
    status?: 'New' | 'In progress' | 'Resolved';
    type?: string;
    message?: string;
  } | null>(null);

  const fetchStatus = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setResult({
          found: false,
          message: data.error || (language === 'ta' ? 'அடையாள எண் காணப்படவில்லை.' : 'Tracking ID not found.')
        });
      }
    } catch {
      setResult({
        found: false,
        message: language === 'ta' ? 'சர்வர் இணைப்பு தோல்வியடைந்தது.' : 'Failed to reach tracking server.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      setInputVal(queryId);
      fetchStatus(queryId);
    }
  }, [queryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(inputVal);
  };

  const getStatusLabel = (status: 'New' | 'In progress' | 'Resolved') => {
    if (status === 'New') {
      return {
        en: 'New',
        ta: 'புதியது (பதிவு செய்யப்பட்டது)',
        descEn: 'Your submission has been logged and queued for initial verification.',
        descTa: 'உங்கள் மனு பதிவு செய்யப்பட்டு ஆரம்ப பரிசீலனை வரிசையில் உள்ளது.',
        color: 'bg-neutral-800 text-white'
      };
    }
    if (status === 'In progress') {
      return {
        en: 'In progress',
        ta: 'பரிசீலனையில் உள்ளது',
        descEn: 'Designated legal wing advocates are currently evaluating the matter.',
        descTa: 'ஒதுக்கப்பட்ட சட்டத்துறை வழக்கறிஞர்களால் மனு தீவிர பரிசீலனையில் உள்ளது.',
        color: 'bg-[#E31E24] text-white'
      };
    }
    return {
      en: 'Resolved',
      ta: 'முடிவு செய்யப்பட்டது',
      descEn: 'Action completed. Official determination or routing has taken effect.',
      descTa: 'நடவடிக்கை முடிவுற்றது. அதிகாரப்பூர்வ உத்தரவு அல்லது முடிவு எட்டப்பட்டது.',
      color: 'bg-green-700 text-white'
    };
  };

  return (
    <div className="w-full bg-[#FAF8F5] py-8 sm:py-12 text-[#111111]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#5B5348]">
          <Link href="/" className="hover:text-[#111111] underline">
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/contact" className="hover:text-[#111111] underline">
            {language === 'ta' ? 'தொடர்பு & உதவி' : 'Contact & Desk'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold">
            {language === 'ta' ? 'நிலை அறிதல்' : 'Status Tracking'}
          </span>
        </div>

        {/* Header */}
        <div className="border-b-2 border-[#111111] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block" />
            <span className="text-xs font-dmk-body text-[#C41A1F] font-bold uppercase tracking-wider">
              {language === 'ta' ? 'ரகசிய நிலை கண்காணிப்பு' : 'Confidential Status Lookup'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline">
            {language === 'ta' ? 'விண்ணப்பத்தின் நிலையை அறிக' : 'Track Submission Status'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-2 leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் ரகசியத்தன்மையைப் பாதுகாக்க, இந்தத் தேடல் மனுவின் தற்போதைய நிலையை மட்டுமே (New, In progress, Resolved) காட்டும்.'
              : 'To preserve complete applicant privacy, this tracker displays only the processing status without exposing any personal information.'}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-[#111111] p-6 rounded-[2px] shadow-xs space-y-4">
          <label htmlFor="trackingInput" className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
            {language === 'ta' ? 'கண்காணிப்பு அடையாள எண் (Tracking ID)' : 'Enter Tracking ID'}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="trackingInput"
              aria-label={language === 'ta' ? 'கண்காணிப்பு அடையாள எண்' : 'Tracking ID'}
              type="text"
              required
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. reg-1700000000000 or enq-1700000000000"
              className="flex-1 min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm font-mono bg-[#FAF8F5] rounded-[2px] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] px-6 py-2.5 bg-[#E31E24] hover:bg-[#C41A1F] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4 text-white" />
              <span>{loading ? (language === 'ta' ? 'தேடுகிறது...' : 'Searching...') : (language === 'ta' ? 'நிலையைச் சோதிக்க' : 'Check Status')}</span>
            </button>
          </div>
        </form>

        {/* Result Card */}
        {result && (
          <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 rounded-[2px] shadow-xs space-y-6">
            {result.found && result.status ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8D3CB] pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#5B5348] uppercase tracking-wider block">
                      {language === 'ta' ? 'கண்காணிப்பு எண்' : 'Tracking ID'}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-black text-[#111111]">
                      {result.trackingId}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[2px] ${
                      getStatusLabel(result.status).color
                    }`}
                  >
                    {language === 'ta' ? getStatusLabel(result.status).ta : getStatusLabel(result.status).en}
                  </span>
                </div>

                {/* 3-Step Progress Timeline */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#5B5348] uppercase tracking-wider block">
                    {language === 'ta' ? 'பரிசீலனை நிலை' : 'Progress Stage'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['New', 'In progress', 'Resolved'] as const).map((step, idx) => {
                      const stages = ['New', 'In progress', 'Resolved'];
                      const currentIdx = stages.indexOf(result.status!);
                      const isPastOrCurrent = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          className={`p-3 border text-center rounded-[2px] transition-colors ${
                            isCurrent
                              ? 'border-[#C41A1F] bg-[#FCE8E8] text-[#C41A1F]'
                              : isPastOrCurrent
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-[#D8D3CB] bg-[#FAF8F5] text-[#5B5348] opacity-60'
                          }`}
                        >
                          <span className="text-[10px] block font-mono font-bold mb-0.5">
                            0{idx + 1}
                          </span>
                          <span className="text-xs font-bold block">
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanatory Description */}
                <div className="p-4 bg-[#FAF8F5] border border-[#D8D3CB] rounded-[2px] text-xs text-[#5B5348] space-y-1">
                  <span className="font-bold text-[#111111] block">
                    {language === 'ta' ? 'தற்போதைய நிலை விளக்கம்:' : 'Current Status Notes:'}
                  </span>
                  <p>
                    {language === 'ta'
                      ? getStatusLabel(result.status).descTa
                      : getStatusLabel(result.status).descEn}
                  </p>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="pt-2 border-t border-[#D8D3CB] text-[11px] text-[#5B5348] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#C41A1F] shrink-0" />
                  <span>
                    {language === 'ta'
                      ? 'தனிநபர் விவரங்கள் எவையும் பொதுப் பார்வையில் வெளியிடப்படுவதில்லை.'
                      : 'Zero personal data is rendered on this public lookup.'}
                  </span>
                </div>
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-[#C41A1F] mx-auto" />
                <h3 className="text-base font-bold text-[#111111]">
                  {language === 'ta' ? 'அடையாள எண் காணப்படவில்லை' : 'No Record Found'}
                </h3>
                <p className="text-xs text-[#5B5348] max-w-md mx-auto">
                  {language === 'ta'
                    ? 'உள்ளிட்ட அடையாள எண் தவறாக இருக்கலாம் அல்லது இன்னும் கணினியில் பதியப்படாமல் இருக்கலாம். சரிபார்த்து மீண்டும் உள்ளிடவும்.'
                    : 'The Tracking ID entered does not match any active record. Please verify the code and try again.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <Link href="/enrol" className="hover:text-[#C41A1F] underline flex items-center gap-1">
            <span>{language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை படிவம்' : 'Advocate Enrolment Form'}</span>
            <span>&rarr;</span>
          </Link>
          <Link href="/citizen-desk" className="hover:text-[#C41A1F] underline flex items-center gap-1">
            <span>{language === 'ta' ? 'பொதுமக்கள் சட்ட உதவி மையம்' : 'Citizen Grievance Desk'}</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-[#FAF8F5] py-16 text-center text-xs text-[#5B5348]">
        Loading status tracker...
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
