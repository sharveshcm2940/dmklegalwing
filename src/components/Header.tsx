'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', labelEn: 'Home', labelTa: 'முகப்பு' },
    { href: '/about', labelEn: 'About', labelTa: 'அறிமுகம்' },
    { href: '/ideology', labelEn: 'Ideology', labelTa: 'கொள்கைகள்' },
    { href: '/structure', labelEn: 'Structure', labelTa: 'கட்டமைப்பு' },
    { href: '/districts', labelEn: 'Districts', labelTa: 'மாவட்டங்கள்' },
    { href: '/news', labelEn: 'News', labelTa: 'செய்திகள்' },
    { href: '/activities', labelEn: 'Activities', labelTa: 'செயல்பாடுகள்' },
    { href: '/resources', labelEn: 'Resources', labelTa: 'ஆவணங்கள்' },
    { href: '/contact', labelEn: 'Contact', labelTa: 'தொடர்பு' },
  ];

  return (
    <header className="w-full bg-[#111111] border-b border-[#3d3633] sticky top-0 z-50 text-[#FAF8F5] overflow-x-clip">
      {/* Signature DMK Flag Top Strip: Top Black, Bottom Red */}
      <div className="w-full h-[4px] dmk-flag-strip" aria-hidden="true" />
      
      {/* Tier 1: Main Masthead Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3">
        
        {/* Brand identity: Official Rising Sun & Flag Logo + 16px Red Square + "திமுக வழக்கறிஞர் அணி" */}
        <Link 
          href="/" 
          className="flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-[#E31E24]"
          aria-label="DMK Legal Wing Home"
        >
          {/* Official Emblem */}
          <img
            src="/images/dmk-official-logo.png"
            alt="DMK Rising Sun & Flag Emblem"
            className="h-10 sm:h-12 w-auto object-contain shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          />

          {/* 16 px Red Square */}
          <span className="w-4 h-4 bg-[#E31E24] inline-block shrink-0" aria-hidden="true" />

          {/* Brand Titles */}
          <div className="flex flex-col justify-center">
            <span className="font-catamaran font-extrabold text-[17px] sm:text-[20px] md:text-[22px] leading-tight text-[#FAF8F5] tracking-normal whitespace-nowrap">
              திமுக வழக்கறிஞர் அணி
            </span>
            <span className="font-catamaran font-bold text-[11px] sm:text-[12px] text-[#d8cfc2] leading-tight tracking-wider uppercase mt-0.5 whitespace-nowrap">
              DMK Legal Wing
            </span>
          </div>
        </Link>

        {/* Right Controls: Enrol CTA + Visible தமிழ்/EN Toggle + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Enrol CTA */}
          <Link
            href="/enrol"
            className="hidden sm:inline-flex items-center justify-center min-h-[38px] px-4 bg-[#E31E24] hover:bg-[#C41A1F] text-white text-[13px] font-bold transition-colors btn-lift whitespace-nowrap"
          >
            {language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'Enrol as Advocate'}
          </Link>

          {/* Visible தமிழ் / EN Language Toggle */}
          <div className="inline-flex items-center border border-[#6d625a] bg-transparent text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                language === 'ta'
                  ? 'bg-[#E31E24] text-white font-extrabold'
                  : 'text-[#d8cfc2] hover:text-white'
              }`}
              aria-label="Switch to Tamil"
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                language === 'en'
                  ? 'bg-[#E31E24] text-white font-extrabold'
                  : 'text-[#d8cfc2] hover:text-white'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Hamburger Button for Viewports < 1024px */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 border border-[#3d3633] text-[#FAF8F5] hover:bg-[#1e1b19] transition-colors shrink-0"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Tier 2: Dedicated Desktop Navigation Ribbon (1024px+) */}
      {/* Dedicating the full 1280px width ensures Tamil link names never crowd, wrap, or overflow */}
      <div className="hidden lg:block w-full bg-[#161413] border-t border-[#2e2724]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-1 py-1" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const label = language === 'ta' ? item.labelTa : item.labelEn;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2.5 px-3 text-[14px] xl:text-[15px] font-semibold transition-colors duration-150 group whitespace-nowrap flex items-center ${
                    isActive ? 'text-white' : 'text-[#d8cfc2] hover:text-white'
                  }`}
                >
                  <span className="leading-normal">{label}</span>
                  {/* 2 px red underline grows from the left on hover */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#E31E24] transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu (< 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161413] border-t border-[#2e2724] px-4 py-4 space-y-2">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const label = language === 'ta' ? item.labelTa : item.labelEn;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[15px] font-semibold py-3 px-3 transition-colors leading-normal whitespace-nowrap block ${
                    isActive ? 'bg-[#E31E24] text-white font-bold' : 'text-[#FAF8F5] hover:bg-[#25201d]'
                  }`}
                >
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#2e2724] sm:hidden">
              <Link
                href="/enrol"
                className="w-full flex items-center justify-center py-3 bg-[#E31E24] hover:bg-[#C41A1F] text-white text-[14px] font-bold"
              >
                {language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'Enrol as Advocate'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
