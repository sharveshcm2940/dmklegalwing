'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface PageTitleBandProps {
  title: string;
  description: string;
}

export const PageTitleBand: React.FC<PageTitleBandProps> = ({ title, description }) => {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-[#111111] text-[#FAF8F5] pt-14 pb-16 relative overflow-hidden border-b border-[#111111]">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4 max-w-4xl">
          {/* Manrope ExtraBold for English, Kavivanar for Tamil at clamp(44px, 6vw, 84px) */}
          <h1 className={`${language === 'ta' ? 'font-kavivanar font-normal' : 'font-manrope font-extrabold'} text-[clamp(44px,6vw,84px)] leading-[1.12] text-[#FAF8F5] tracking-normal`}>
            {title}
          </h1>

          {/* One 20 px description line in #d8cfc2 */}
          <p className="text-[20px] text-[#d8cfc2] font-normal leading-[1.65]">
            {description}
          </p>
        </div>

        {/* Official Emblem without drop shadows */}
        <div className="shrink-0 hidden md:block pb-2">
          <img
            src="/images/dmk-official-logo.png"
            alt="DMK Official Emblem"
            className="h-24 w-auto object-contain"
          />
        </div>
      </div>

      {/* 6 px red rule along the bottom that draws left to right in 1 s */}
      <div className="w-full h-[6px] bg-[#E31E24] animate-draw-rule-1s mt-8" />
    </div>
  );
};
