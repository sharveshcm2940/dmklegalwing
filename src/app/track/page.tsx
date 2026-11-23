'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';

function TrackContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [inputVal, setInputVal] = useState(queryId);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    trackingId?: string;
    status?: 'New' | 'In progress' | 'Resolved';
    lastUpdated?: string;
  } | null>(null);

  const mainSection = useReveal();

  const fetchStatus = useCallback(async (id: string) => {
    const cleanId = id.trim();
    if (!cleanId) return;

    setLoading(true);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (res.ok && data.success && data.found) {
        // Extract timestamp from id if not returned directly
        let dateStr = data.lastUpdated || '';
        if (!dateStr && data.trackingId) {
          const match = data.trackingId.match(/^(?:enq|reg)-(\d+)-/);
          if (match && match[1]) {
            const d = new Date(Number(match[1]));
            if (!isNaN(d.getTime())) {
              dateStr = d.toISOString().split('T')[0];
            }
          }
        }

        setResult({
          found: true,
          trackingId: data.trackingId,
          status: data.status,
          lastUpdated: dateStr || new Date().toISOString().split('T')[0]
        });
      } else {
        setResult({ found: false });
      }
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (queryId) {
      setInputVal(queryId);
      fetchStatus(queryId);
    }
  }, [queryId, fetchStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(inputVal);
  };

  const getStatusBadge = (st?: 'New' | 'In progress' | 'Resolved') => {
    switch (st) {
      case 'Resolved':
        return {
          text: language === 'ta' ? 'முடிவுற்றது' : 'Resolved',
          cls: 'bg-[#111111] text-[#FAF8F5]'
        };
      case 'In progress':
        return {
          text: language === 'ta' ? 'பரிசீலனையில்' : 'In progress',
          cls: 'bg-[#E31E24] text-white'
        };
      case 'New':
      default:
        return {
          text: language === 'ta' ? 'புதிய மனு' : 'New',
          cls: 'bg-[#f1ece2] text-[#111111] border border-[#111111]'
        };
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'மனு நிலை கண்காணிப்பு' : 'Application & grievance tracking'}
        description={
          language === 'ta'
            ? 'உங்கள் கண்காணிப்பு அடையாள எண்ணை உள்ளிட்டு மனுவின் தற்போதைய நிலையை அறியவும்.'
            : 'Enter your official reference number to check the live status of your submission.'
        }
      />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12 space-y-8">
        <section
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''} space-y-8`}
        >
          {/* Tracking Form: One input for the tracking ID and a button */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-[#111111] p-6 sm:p-8 space-y-4"
          >
            <label htmlFor="trackId" className="block text-[15px] font-extrabold text-[#111111]">
              {language === 'ta' ? 'கண்காணிப்பு அடையாள எண்' : 'Tracking ID'}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="trackId"
                type="text"
                required
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. reg-1700000000000-xxxxx or enq-1700000000000-xxxxx"
                className="flex-1 min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] font-mono text-[16px] text-[#111111] focus:bg-white outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="min-h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] flex items-center justify-center cursor-pointer btn-lift disabled:opacity-50 shrink-0 transition-colors"
              >
                {loading
                  ? (language === 'ta' ? 'தேடுகிறது...' : 'Checking...')
                  : (language === 'ta' ? 'கண்காணிக்க' : 'Track')}
              </button>
            </div>
          </form>

          {/* Result: Shows ONLY the status (New, In progress, Resolved) and the date of the last update */}
          {hasSearched && (
            <div className="bg-white border-2 border-[#111111] p-6 sm:p-8">
              {result && result.found ? (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d7d0c3]">
                    <span className="text-[14px] font-extrabold uppercase text-[#5B5348]">
                      {language === 'ta' ? 'மனுவின் தற்போதைய நிலை' : 'Status'}
                    </span>
                    <span
                      className={`inline-block px-5 py-2 text-[15px] font-extrabold text-center ${
                        getStatusBadge(result.status).cls
                      }`}
                    >
                      {getStatusBadge(result.status).text}
                    </span>
                  </div>

                  {/* Date of the last update */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <span className="text-[14px] font-extrabold uppercase text-[#5B5348]">
                      {language === 'ta' ? 'கடைசியாக புதுப்பிக்கப்பட்ட தேதி' : 'Date of last update'}
                    </span>
                    <span className="font-manrope font-extrabold text-[18px] text-[#111111]">
                      {result.lastUpdated || '—'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-[#5B5348] text-[16px]">
                  {language === 'ta'
                    ? 'இந்த அடையாள எண்ணிற்குரிய பதிவு எதுவும் காணப்படவில்லை.'
                    : 'No active record matches this tracking ID.'}
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
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-12 text-[#111111] font-bold">
          Loading...
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
