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
    <header className="w-full bg-[#111111] border-b border-[#3d3633] sticky top-0 z-50 text-[#FAF8F5]">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] h-20 flex items-center justify-between gap-4">
        
        {/* Brand identity: Red 16px square + "திமுக வழக்கறிஞர் அணி" (Catamaran 800, 22px) + "DMK Legal Wing" (14px, #d8cfc2) */}
        <Link href="/" className="flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-[#E31E24]">
          <span className="w-4 h-4 bg-[#E31E24] shrink-0" aria-hidden="true" />
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="font-catamaran font-extrabold text-[22px] leading-tight text-[#FAF8F5] tracking-tight">
              திமுக வழக்கறிஞர் அணி
            </span>
            <span className="font-catamaran font-medium text-[14px] text-[#d8cfc2]">
              DMK Legal Wing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links + Language Toggle */}
        <div className="hidden xl:flex items-center gap-7">
          <nav className="flex items-center gap-5" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const label = language === 'ta' ? item.labelTa : item.labelEn;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative py-2 text-[15px] font-semibold text-[#FAF8F5] hover:text-white transition-colors duration-200 group"
                >
                  <span>{label}</span>
                  {/* 2px red underline grows from 0 to full width on hover, active page keeps it */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#E31E24] transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle: 1px #6d625a border, active language on red */}
          <div className="inline-flex items-center border border-[#6d625a] bg-transparent text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
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
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#E31E24] text-white font-extrabold'
                  : 'text-[#d8cfc2] hover:text-white'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Controls */}
        <div className="flex xl:hidden items-center gap-3">
          {/* Compact Language Toggle */}
          <div className="inline-flex items-center border border-[#6d625a] text-xs font-bold">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 ${
                language === 'ta' ? 'bg-[#E31E24] text-white' : 'text-[#d8cfc2]'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 ${
                language === 'en' ? 'bg-[#E31E24] text-white' : 'text-[#d8cfc2]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Hamburger Button (Inline SVG, no icon library) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#3d3633] text-[#FAF8F5] hover:bg-[#1a1a1a] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#111111] border-b border-[#3d3633] px-[clamp(20px,4vw,56px)] py-6 space-y-4">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const label = language === 'ta' ? item.labelTa : item.labelEn;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-semibold py-2 px-3 transition-colors ${
                    isActive ? 'bg-[#E31E24] text-white' : 'text-[#FAF8F5] hover:bg-[#1f1d1b]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
