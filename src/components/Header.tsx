'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { 
  Menu, 
  X, 
  Shield, 
  UserPlus, 
  ChevronRight,
  Search
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: language === 'ta' ? 'முகப்பு' : 'HOME' },
    { href: '/about', label: language === 'ta' ? 'அறிமுகம்' : 'ABOUT US' },
    { href: '/ideology', label: language === 'ta' ? 'கொள்கைகள்' : 'OUR IDEOLOGY' },
    { href: '/structure', label: language === 'ta' ? 'கட்டமைப்பு' : 'ORGANISATION' },
    { href: '/districts', label: language === 'ta' ? 'மாவட்டங்கள்' : 'DISTRICTS' },
    { href: '/activities', label: language === 'ta' ? 'செயல்பாடுகள்' : 'ACTIVITIES' },
    { href: '/resources', label: language === 'ta' ? 'சட்ட ஆவணங்கள்' : 'LEGAL RESOURCES' },
    { href: '/contact', label: language === 'ta' ? 'தொடர்பு' : 'CONTACT' }
  ];

  return (
    <header className="w-full bg-white z-50 sticky top-0 transition-all duration-300 shadow-xs font-dmk-body">
      
      {/* Top Movement Stripe */}
      <div className="w-full h-1 flex">
        <div className="w-1/2 bg-black" />
        <div className="w-1/2 bg-[#E31E24]" />
      </div>

      {/* 1. EDITORIAL MASTHEAD ROW */}
      <div className="border-b border-neutral-300 bg-white py-4 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left / Center: Emblem + Publication Identity */}
          <Link href="/" className="flex items-center gap-4 group text-center md:text-left">
            {/* The Official DMK Flag & Rising Sun Emblem */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white p-1 border border-neutral-300 group-hover:border-[#E31E24] transition-colors flex items-center justify-center">
              <img
                src="/images/dmk-flag-sun.jpg"
                alt="DMK Flag & Rising Sun Emblem"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Masthead Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#C41A1F] uppercase font-english">
                  {language === 'ta' ? 'திராவிட முன்னேற்றக் கழகம்' : 'DRAVIDA MUNNETRA KAZHAGAM'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 justify-center md:justify-start my-0.5">
                <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-none font-dmk-headline group-hover:text-[#E31E24] transition-colors">
                  {language === 'ta' ? 'வழக்கறிஞர் அணி' : 'Legal Wing'}
                </h1>
                <span className="text-xs sm:text-sm font-english text-[#5B5348] font-bold hidden sm:inline">
                  (Estd. 1971)
                </span>
              </div>

              <div className="flex items-center gap-2 justify-center md:justify-start text-[11px] sm:text-xs font-english text-[#5B5348]">
                <span>{language === 'ta' ? 'சமூக நீதி' : 'Social Justice'}</span>
                <span>•</span>
                <span>{language === 'ta' ? 'மாநில சுயாட்சி' : 'State Autonomy'}</span>
                <span>•</span>
                <span>{language === 'ta' ? 'அரசமைப்பு ஜனநாயகம்' : 'Constitutional Democracy'}</span>
              </div>
            </div>
          </Link>

          {/* Right: Quick Controls, Language Switcher, Admin, & Register Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-english font-bold bg-[#FAF8F5] hover:bg-neutral-200 border border-[#D8D3CB] text-[#111111] transition-colors rounded-[2px]"
              title="Toggle Language"
            >
              {language === 'ta' ? 'English' : 'தமிழ்'}
            </button>

            {/* Admin Portal Button */}
            <Link
              href="/admin"
              className="px-2.5 py-1 text-xs font-english font-bold bg-[#FAF8F5] hover:bg-neutral-200 border border-[#D8D3CB] text-[#111111] transition-colors flex items-center gap-1 rounded-[2px]"
            >
              <Shield className="w-3.5 h-3.5 text-[#C41A1F]" />
              <span>{language === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
            </Link>

            {/* Join Legal Wing Action Button */}
            <Link
              href="/enrol"
              className="inline-flex items-center min-h-[44px] gap-1.5 px-4 py-2 text-xs font-english font-bold uppercase tracking-wider text-white bg-[#E31E24] hover:bg-[#111111] border border-[#111111] transition-colors rounded-[2px]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'JOIN LEGAL WING'}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 bg-white border border-[#111111] text-[#111111] hover:text-white hover:bg-[#111111] transition-colors rounded-[2px]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. CENTERED PRIMARY NAVIGATION BAR (Sandwiched between two clean black lines) */}
      <div className="border-b border-black bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-center relative">
          
          {/* Centered Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center justify-center flex-wrap divide-x divide-neutral-200 mx-auto w-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 xl:px-4 py-2.5 text-[11px] xl:text-xs font-english font-bold uppercase tracking-wider transition-colors whitespace-nowrap text-center ${
                    isActive
                      ? 'text-white bg-[#E31E24] font-black'
                      : 'text-[#111111] hover:text-[#C41A1F] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-[#111111] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8D3CB]">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-[#FAF8F5] border border-[#D8D3CB] text-xs font-english font-bold text-[#111111] rounded-[2px]"
            >
              {language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாறுக'}
            </button>
            <Link
              href="/admin"
              className="px-3 py-1 bg-[#111111] text-white text-xs font-english font-bold uppercase tracking-wider rounded-[2px]"
            >
              {language === 'ta' ? 'நிர்வாகப் பக்கம்' : 'Admin Portal'}
            </Link>
          </div>

          <div className="grid grid-cols-1 divide-y divide-[#D8D3CB]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between py-2 text-xs font-english font-bold uppercase tracking-wider ${
                    isActive ? 'text-[#C41A1F]' : 'text-[#111111] hover:text-[#C41A1F]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5B5348]" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/enrol"
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 text-xs font-english font-bold uppercase tracking-wider text-white bg-[#E31E24] hover:bg-[#111111] transition-colors rounded-[2px]"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'JOIN LEGAL WING'}</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};
