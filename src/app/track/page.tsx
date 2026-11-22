'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { IconSearch, IconCheck } from '@/components/Icons';

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
    name?: string;
    district?: string;
    submittedAt?: string;
  } | null>(null);

  const mainSection = useReveal();

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

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'மனு நிலை கண்காணிப்பு' : 'Live Status Tracking'}
        description={
          language === 'ta'
            ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை அல்லது மக்கள் சட்ட உதவி மனுவின் தற்போதைய நிலையை அறியவும்.'
            : 'Track the real-time processing status of your advocate enrolment or citizen legal aid petition.'
        }
      />

      <div className="max-w-[800px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-10">
        
        <section 
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''}`}
        >
          {/* Tracking Form */}
          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#111111] p-8 sm:p-10 space-y-6">
            <div>
              <label htmlFor="trackId" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                {language === 'ta' ? 'கண்காணிப்பு அடையாள எண் (Tracking ID)' : 'Grievance / Enrolment Tracking ID'}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="trackId"
                  type="text"
                  required
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. DMK-ENR-2026-XXXX or DMK-AID-2026-XXXX"
                  className="flex-1 min-h-[48px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[16px] font-mono text-[#111111]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center gap-2 cursor-pointer btn-lift disabled:opacity-50 shrink-0"
                >
                  <IconSearch className="w-4 h-4" />
                  <span>{loading ? (language === 'ta' ? 'தேடுகிறது...' : 'Searching...') : (language === 'ta' ? 'கண்காணிக்க' : 'Track Status')}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Results Box */}
          {result && (
            <div className="mt-8 bg-white border-2 border-[#111111] p-8 sm:p-10 space-y-6">
              {result.found ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#111111] pb-4">
                    <div>
                      <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                        {language === 'ta' ? 'கண்காணிப்பு எண்:' : 'TRACKING ID:'}
                      </span>
                      <span className="font-mono font-extrabold text-[22px] text-[#111111]">
                        {result.trackingId}
                      </span>
                    </div>

                    <span className={`text-[13px] font-extrabold uppercase px-4 py-1.5 border border-[#111111] ${
                      result.status === 'Resolved'
                        ? 'bg-[#111111] text-white'
                        : result.status === 'In progress'
                        ? 'bg-[#E31E24] text-white'
                        : 'bg-[#f1ece2] text-[#111111]'
                    }`}>
                      {result.status === 'Resolved'
                        ? (language === 'ta' ? 'முடிவுற்றது' : 'Resolved')
                        : result.status === 'In progress'
                        ? (language === 'ta' ? 'பரிசீலனையில்' : 'In Progress')
                        : (language === 'ta' ? 'புதிய மனு' : 'Submitted')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[15px]">
                    {result.name && (
                      <div className="p-4 bg-[#f1ece2] border border-[#111111]">
                        <span className="text-[12px] text-[#5B5348] block">{language === 'ta' ? 'விண்ணப்பதாரர்:' : 'Petitioner / Advocate:'}</span>
                        <strong className="text-[#111111] text-[16px]">{result.name}</strong>
                      </div>
                    )}
                    {result.district && (
                      <div className="p-4 bg-[#f1ece2] border border-[#111111]">
                        <span className="text-[12px] text-[#5B5348] block">{language === 'ta' ? 'மாவட்டம்:' : 'District Assigned:'}</span>
                        <strong className="text-[#111111] text-[16px]">{result.district}</strong>
                      </div>
                    )}
                  </div>

                  {result.message && (
                    <div className="p-4 bg-white border-l-4 border-[#E31E24] border border-[#d7d0c3] text-[15px]">
                      <span className="font-bold text-[#C41A1F] block text-xs mb-1">
                        {language === 'ta' ? 'செயலகக் குறிப்பு:' : 'SECRETARIAT MEMORANDUM:'}
                      </span>
                      <p className="text-[#111111]">{result.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <h3 className="font-kavivanar font-normal text-[24px] text-[#C41A1F]">
                    {language === 'ta' ? 'பதிவு காணப்படவில்லை' : 'Dossier Not Found'}
                  </h3>
                  <p className="text-[16px] text-[#5B5348] max-w-md mx-auto">
                    {result.message}
                  </p>
                </div>
              )}
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center p-12 text-[#111111] font-bold">
        Loading...
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
