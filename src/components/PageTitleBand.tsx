'use client';

import React from 'react';

interface PageTitleBandProps {
  title: string;
  description: string;
}

export const PageTitleBand: React.FC<PageTitleBandProps> = ({ title, description }) => {
  return (
    <div className="w-full bg-[#111111] text-[#FAF8F5] pt-12 pb-14 border-b border-[#3d3633] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div className="space-y-3 max-w-4xl">
          <h1 className="font-kavivanar font-normal text-[clamp(44px,6vw,84px)] text-[#FAF8F5] leading-[1.12]">
            {title}
          </h1>
          <p className="text-[20px] text-[#d8cfc2] font-normal leading-relaxed">
            {description}
          </p>
        </div>
        <div className="shrink-0 hidden md:block">
          <img
            src="/images/dmk-official-logo.png"
            alt="DMK Official Emblem"
            className="h-28 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
      {/* 6px red rule along the bottom that draws from left to right in 1s on load */}
      <div className="w-full h-[6px] bg-[#E31E24] animate-draw-line mt-6" />
    </div>
  );
};
