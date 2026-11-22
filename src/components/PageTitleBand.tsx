'use client';

import React from 'react';

interface PageTitleBandProps {
  title: string;
  description: string;
}

export const PageTitleBand: React.FC<PageTitleBandProps> = ({ title, description }) => {
  return (
    <div className="w-full bg-[#111111] text-[#FAF8F5] pt-12 pb-14 border-b border-[#3d3633] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] space-y-3">
        <h1 className="font-kavivanar font-normal text-[clamp(44px,6vw,84px)] text-[#FAF8F5] leading-[1.12]">
          {title}
        </h1>
        <p className="text-[20px] text-[#d8cfc2] font-normal max-w-4xl leading-relaxed">
          {description}
        </p>
      </div>
      {/* 6px red rule along the bottom that draws from left to right in 1s on load */}
      <div className="w-full h-[6px] bg-[#E31E24] animate-draw-line" />
    </div>
  );
};
