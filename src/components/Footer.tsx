'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="w-full bg-[#111111] text-[#FAF8F5] border-t border-[#3d3633]">
      {/* Signature DMK Flag Top Strip */}
      <div className="w-full h-[6px] dmk-flag-strip" aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] py-12 space-y-8">
        
        {/* Main Footer Row: Name on the left, State Secretariat on the right */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#3d3633]">
          {/* Left: Official Emblem + Name */}
          <div className="flex items-center gap-4">
            <img
              src="/images/dmk-official-logo.png"
              alt="DMK Official Emblem"
              className="h-14 w-auto object-contain shrink-0"
            />
            <div>
              <div className="font-catamaran font-extrabold text-[20px] text-[#FAF8F5] leading-tight">
                திமுக வழக்கறிஞர் அணி · DMK Legal Wing
              </div>
              <div className="font-catamaran text-[13px] text-[#d8cfc2]">
                {language === 'ta'
                  ? 'திராவிட முன்னேற்றக் கழகம் · தமிழ்நாடு'
                  : 'Dravida Munnetra Kazhagam · Tamil Nadu, India'}
              </div>
            </div>
          </div>

          {/* Right: State Legal Secretariat address (16px) */}
          <div className="text-left md:text-right font-catamaran text-[16px] text-[#d8cfc2] leading-snug">
            State Legal Secretariat, Anna Arivalayam, Chennai — 600 018
          </div>
        </div>

        {/* Bottom Bar: Copyright & OneSash */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#d8cfc2]">
          <div>
            &copy; 2026 DMK Legal Wing. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <span>developed by</span>
            <a
              href="https://www.onesash.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-[44px] px-2 py-1 hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[#E31E24]"
              aria-label="OneSash — Technology, People, Impact (opens in a new tab)"
            >
              <img
                src="/images/onesash-logo.png"
                alt="OneSash"
                className="h-7 w-auto object-contain"
              />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
