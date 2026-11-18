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
    { href: '/leadership', label: language === 'ta' ? 'தலைமை' : 'LEADERSHIP' },
    { href: '/districts', label: language === 'ta' ? 'மாவட்டங்கள்' : 'DISTRICTS' },
    { href: '/activities', label: language === 'ta' ? 'செயல்பாடுகள்' : 'ACTIVITIES' },
    { href: '/resources', label: language === 'ta' ? 'சட்ட ஆவணங்கள்' : 'LEGAL RESOURCES' },
    { href: '/news', label: language === 'ta' ? 'செய்திகள்' : 'NEWS & MEDIA' },
    { href: '/contact', label: language === 'ta' ? 'தொடர்பு' : 'CONTACT' }
  ];

  return (
    <header className="w-full bg-white z-50 sticky top-0 transition-all duration-300 shadow-xs font-dmk-body">
      
      {/* 1. EDITORIAL MASTHEAD ROW */}
      <div className="border-b border-neutral-300 bg-white py-4 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left / Center: Emblem + Publication Identity */}
          <Link href="/" className="flex items-center gap-4 group text-center md:text-left">
            {/* The Official DMK Flag & Rising Sun Emblem */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white p-1 border-2 border-neutral-900 shadow-[2px_2px_0px_#111111] group-hover:shadow-[3px_3px_0px_#E31E24] transition-all flex items-center justify-center">
              <img
                src="/images/dmk-flag-sun.jpg"
                alt="DMK Flag & Rising Sun Emblem"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Masthead Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#E31E24] uppercase">
                  {language === 'ta' ? 'திராவிட முன்னேற்றக் கழகம்' : 'DRAVIDA MUNNETRA KAZHAGAM'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 justify-center md:justify-start my-0.5">
                <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none font-dmk-headline group-hover:text-[#E31E24] transition-colors">
                  {language === 'ta' ? 'வழக்கறிஞர் அணி' : 'Legal Wing'}
                </h1>
                <span className="text-xs sm:text-sm font-mono text-neutral-500 font-bold hidden sm:inline">
                  (Estd. 1971)
                </span>
              </div>

              <div className="flex items-center gap-2 justify-center md:justify-start text-[11px] sm:text-xs font-serif italic text-neutral-600">
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
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#FAF7F2] hover:bg-neutral-200 border border-neutral-400 text-neutral-900 transition-colors"
              title="Toggle Language"
            >
              {language === 'ta' ? 'English' : 'தமிழ்'}
            </button>

            {/* Admin Portal Button */}
            <Link
              href="/admin"
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#FAF7F2] hover:bg-neutral-200 border border-neutral-400 text-neutral-900 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-[#E31E24]" />
              <span>{language === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
            </Link>

            {/* Join Legal Wing Action Button */}
            <Link
              href="/contact#register"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#E31E24] hover:bg-neutral-900 border border-neutral-900 shadow-[2px_2px_0px_#111111] transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'JOIN LEGAL WING'}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 bg-white border border-neutral-900 text-neutral-900 hover:text-white hover:bg-neutral-900 transition-colors"
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
          <nav className="hidden xl:flex items-center justify-center flex-wrap divide-x divide-neutral-200 mx-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors whitespace-nowrap text-center ${
                    isActive
                      ? 'text-white bg-[#E31E24] font-black'
                      : 'text-neutral-900 hover:text-[#E31E24] hover:bg-[#FAF7F2]'
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
        <div className="xl:hidden bg-white border-b-2 border-neutral-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-[#FAF7F2] border border-neutral-300 text-xs font-mono font-bold text-neutral-800"
            >
              {language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாறுக'}
            </button>
            <Link
              href="/admin"
              className="px-3 py-1 bg-neutral-900 text-white text-xs font-mono font-bold uppercase tracking-wider"
            >
              {language === 'ta' ? 'நிர்வாகப் பக்கம்' : 'Admin Portal'}
            </Link>
          </div>

          <div className="grid grid-cols-1 divide-y divide-neutral-100">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between py-2 text-xs font-mono font-bold uppercase tracking-wider ${
                    isActive ? 'text-[#E31E24]' : 'text-neutral-800 hover:text-[#E31E24]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/contact#register"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#E31E24] shadow-[2px_2px_0px_#111111]"
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
