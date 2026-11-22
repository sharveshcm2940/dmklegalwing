'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { EventItem } from '@/types';
import { PageTitleBand } from '@/components/PageTitleBand';

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export default function ActivitiesPage() {
  const { language } = useLanguage();
  const { events } = useData();

  // Filters: Status (Upcoming / Past / All), Category, and Month
  const [activeStatus, setActiveStatus] = useState<'upcoming' | 'past' | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  // Current calendar month (November = index 10)
  const currentCalendarMonth = 10;

  // Extract distinct categories from events data
  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ['All', ...Array.from(set)];
  }, [events]);

  // Find nearest upcoming event for Section 1
  const nearestUpcomingEvent = useMemo(() => {
    const upcoming = events.filter((e) => e.status === 'upcoming');
    if (upcoming.length > 0) return upcoming[0];
    return events[0] || null;
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Status filter
      if (activeStatus === 'upcoming' && e.status !== 'upcoming') return false;
      if (activeStatus === 'past' && e.status !== 'completed') return false;

      // Category filter
      if (activeCategory !== 'All' && e.category !== activeCategory) return false;

      // Month filter
      if (selectedMonth !== null) {
        const d = new Date(e.date);
        if (isNaN(d.getTime()) || d.getMonth() !== selectedMonth) return false;
      }

      return true;
    });
  }, [events, activeStatus, activeCategory, selectedMonth]);

  const handleOpenModal = (event: EventItem, e: React.MouseEvent<HTMLElement>) => {
    triggerRef.current = e.currentTarget;
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 10);
  };

  // Keyboard accessibility for modal
  useEffect(() => {
    if (!selectedEvent) return;

    setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  // Format date for nearest event
  const nextEventDate = useMemo(() => {
    if (!nearestUpcomingEvent) return { day: '14', monthYear: 'DECEMBER 2026' };
    const d = new Date(nearestUpcomingEvent.date);
    const day = isNaN(d.getDate()) ? '14' : String(d.getDate()).padStart(2, '0');
    const monthYear = isNaN(d.getTime())
      ? 'DECEMBER 2026'
      : d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase();
    return { day, monthYear };
  }, [nearestUpcomingEvent]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'நிகழ்வுகள்' : 'Conferences and events'}
        description={
          language === 'ta'
            ? 'மாநில வழக்கறிஞர் மாநாடுகள், அரசமைப்பு கருத்தரங்குகள் மற்றும் இலவச சட்ட உதவி முகாம்கள்.'
            : 'State advocate conferences, constitutional seminars, pro-bono citizen legal clinics, and grassroots sessions.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-16">
        
        {/* ========================================================== */}
        {/* 1. NEXT EVENT: ONE FULL-WIDTH RED BLOCK (WHITE TEXT)       */}
        {/* ========================================================== */}
        {nearestUpcomingEvent && (
          <section className="bg-[#E31E24] text-white p-8 md:p-14 border-2 border-[#111111] shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 flex-1">
                
                {/* Date in Helvetica Now Display 800 at 96px */}
                <div className="shrink-0 text-left border-b-2 md:border-b-0 md:border-r-2 border-white/30 pb-6 md:pb-0 md:pr-12">
                  <span className="font-helvetica font-extrabold text-[80px] md:text-[96px] leading-none text-white block">
                    {nextEventDate.day}
                  </span>
                  <span className="font-helvetica font-extrabold text-[18px] md:text-[20px] uppercase text-white/90 block mt-1 tracking-normal">
                    {nextEventDate.monthYear}
                  </span>
                  <span className="text-[12px] font-extrabold uppercase px-2 py-0.5 bg-black text-white inline-block mt-2">
                    {nearestUpcomingEvent.category}
                  </span>
                </div>

                {/* Title in 36px, Venue, Time, Speakers */}
                <div className="space-y-3 flex-1">
                  <span className="text-[13px] font-extrabold uppercase text-white/80 tracking-normal block">
                    {language === 'ta' ? 'அடுத்த பெரு நிகழ்வு' : 'NEAREST UPCOMING EVENT'}
                  </span>

                  <h3 className="font-helvetica font-extrabold text-[28px] md:text-[36px] text-white leading-tight">
                    {nearestUpcomingEvent.title[language]}
                  </h3>

                  <div className="text-[16px] text-white/90 space-y-1 pt-1">
                    <p className="font-bold flex items-center gap-2">
                      <span>📍</span>
                      <span>{nearestUpcomingEvent.venue[language]}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>{nearestUpcomingEvent.time}</span>
                    </p>
                    {nearestUpcomingEvent.chiefGuest && (
                      <p className="italic text-white/90 pt-1">
                        <span className="font-bold not-italic">
                          {language === 'ta' ? 'சிறப்பு விருந்தினர்: ' : 'Chief Guest / Keynote: '}
                        </span>
                        {nearestUpcomingEvent.chiefGuest[language]}
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* White button "Register" */}
              <div className="shrink-0 self-start lg:self-center">
                <Link
                  href="/enrol"
                  className="min-h-[48px] px-8 bg-white hover:bg-[#FAF8F5] text-[#111111] font-helvetica font-extrabold text-[15px] uppercase tracking-normal inline-flex items-center justify-center btn-lift transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'பதிவுசெய்க (Register)' : 'Register'}
                </Link>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================== */}
        {/* 2. FILTERS: TABS + MONTH STRIP (TWELVE SQUARE BUTTONS)      */}
        {/* ========================================================== */}
        <section className="space-y-8 border-b-2 border-[#111111] pb-8">
          
          {/* Top filter tabs: Upcoming / Past and Event Types */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#3d3633] pb-4">
            
            {/* Status Tabs: All, Upcoming, Past */}
            <div className="flex items-center gap-6 overflow-x-auto">
              {[
                { id: 'all', en: 'All Events', ta: 'அனைத்து நிகழ்வுகள்' },
                { id: 'upcoming', en: 'Upcoming', ta: 'வரவிருப்பவை' },
                { id: 'past', en: 'Past', ta: 'நிறைவடைந்தவை' }
              ].map((tab) => {
                const isActive = activeStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveStatus(tab.id as 'all' | 'upcoming' | 'past')}
                    className={`min-h-[44px] pb-2 font-helvetica font-extrabold text-[16px] transition-colors cursor-pointer shrink-0 ${
                      isActive
                        ? 'border-b-[3px] border-[#E31E24] text-[#111111]'
                        : 'border-b-[3px] border-transparent text-[#5B5348] hover:text-[#111111]'
                    }`}
                  >
                    {language === 'ta' ? tab.ta : tab.en}
                  </button>
                );
              })}
            </div>

            {/* Event Type Tabs */}
            <div className="flex items-center gap-4 overflow-x-auto">
              <span className="text-[13px] font-extrabold text-[#5B5348] uppercase shrink-0">
                {language === 'ta' ? 'பிரிவு:' : 'Type:'}
              </span>
              {existingCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-[44px] pb-2 font-helvetica font-extrabold text-[15px] transition-colors cursor-pointer shrink-0 ${
                      isActive
                        ? 'border-b-[3px] border-[#E31E24] text-[#111111]'
                        : 'border-b-[3px] border-transparent text-[#5B5348] hover:text-[#111111]'
                    }`}
                  >
                    {cat === 'All' && language === 'ta' ? 'அனைத்தும்' : cat}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Month Strip of twelve square month buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[13px] text-[#5B5348] font-bold">
              <span>{language === 'ta' ? 'மாதம் வாரியாக வடிகட்டுக:' : 'Filter by calendar month:'}</span>
              {selectedMonth !== null && (
                <button
                  type="button"
                  onClick={() => setSelectedMonth(null)}
                  className="text-[#C41A1F] hover:underline cursor-pointer"
                >
                  {language === 'ta' ? 'மாத வடிகட்டலை அழிக்க' : 'Clear month filter'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {MONTH_NAMES.map((month, idx) => {
                const isSelected = selectedMonth === idx;
                const isCurrentMonth = currentCalendarMonth === idx;

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => setSelectedMonth(isSelected ? null : idx)}
                    className={`w-full aspect-square min-h-[44px] flex flex-col items-center justify-center font-helvetica font-extrabold text-[13px] md:text-[14px] border-2 border-[#111111] transition-colors cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#E31E24] text-white border-[#E31E24]'
                        : 'bg-white text-[#111111] hover:bg-[#f1ece2]'
                    } ${isCurrentMonth ? 'border-b-[3px] border-b-[#111111]' : ''}`}
                    title={isCurrentMonth ? `${month} (Current Month)` : month}
                  >
                    <span>{month}</span>
                    {isCurrentMonth && (
                      <span className={`w-3 h-1 bg-[#111111] mt-0.5 ${isSelected ? 'bg-white' : ''}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* ========================================================== */}
        {/* 3. EVENT LIST AS RULED ROWS, NOT CARDS                     */}
        {/* ========================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-helvetica font-extrabold text-[clamp(24px,2.8vw,34px)] text-[#111111]">
              {language === 'ta' ? 'நிகழ்வுகள் பட்டியல்' : 'Official Event Register'}
            </h2>
            <span className="text-[14px] text-[#5B5348] font-bold">
              {filteredEvents.length} {language === 'ta' ? 'பதிவுகள்' : 'entries'}
            </span>
          </div>

          {/* 4. When no event matches a filter: one plain line saying so, not an illustration */}
          {filteredEvents.length === 0 ? (
            <div className="py-12 px-6 text-center border-t border-b border-[#111111] bg-white">
              <p className="text-[17px] text-[#5B5348]">
                {language === 'ta'
                  ? 'தேர்வு செய்யப்பட்ட வடிகட்டலுக்கு ஏற்ப எந்த நிகழ்வுகளும் காணப்படவில்லை.'
                  : 'No events match the selected filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="border-t border-b border-[#111111] divide-y divide-[#111111] bg-white">
              {filteredEvents.map((event) => {
                const d = new Date(event.date);
                const dayStr = isNaN(d.getDate()) ? '15' : String(d.getDate()).padStart(2, '0');
                const monthYearStr = isNaN(d.getTime())
                  ? 'DEC 2026'
                  : d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase();

                const isPast = event.status === 'completed';

                return (
                  <div
                    key={event.id}
                    onClick={(e) => handleOpenModal(event, e)}
                    className={`group relative py-8 px-6 transition-all duration-200 cursor-pointer overflow-hidden hover:bg-[#f1ece2] ${
                      isPast ? 'text-[#5B5348]' : 'text-[#111111]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-transform duration-200 ease-out group-hover:translate-x-[18px]">
                      
                      {/* Left: 120px date block (day 56px, month and year in grey) */}
                      <div className="flex items-start gap-8 flex-1">
                        
                        <div className="w-[120px] shrink-0 text-left">
                          <span className={`font-helvetica font-extrabold text-[56px] leading-none block ${
                            isPast ? 'text-[#5B5348]' : 'text-[#111111]'
                          }`}>
                            {dayStr}
                          </span>
                          <span className="font-helvetica font-bold text-[14px] text-[#5B5348] uppercase block mt-1">
                            {monthYearStr}
                          </span>
                        </div>

                        {/* Middle: Type in #C41A1F, Title in 28px, Venue, Speakers */}
                        <div className="flex-1 space-y-1.5">
                          <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] block">
                            {event.category}
                          </span>

                          <h3 className={`font-helvetica font-extrabold text-[24px] md:text-[28px] leading-tight ${
                            isPast ? 'text-[#5B5348]' : 'text-[#111111] group-hover:text-[#E31E24] transition-colors'
                          }`}>
                            {event.title[language]}
                          </h3>

                          <p className="text-[15px] font-semibold text-[#5B5348]">
                            📍 {event.venue[language]} {event.time ? `• ⏰ ${event.time}` : ''}
                          </p>

                          {event.chiefGuest && (
                            <p className="text-[14px] text-[#111111] pt-0.5">
                              <span className="text-[#5B5348] font-bold">
                                {language === 'ta' ? 'சிறப்பு பேச்சாளர்: ' : 'Speaker: '}
                              </span>
                              {event.chiefGuest[language]}
                            </p>
                          )}
                        </div>

                      </div>

                      {/* Right: "Details" link */}
                      <div className="shrink-0 self-end lg:self-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(event, e);
                          }}
                          className="font-helvetica font-extrabold text-[15px] text-[#C41A1F] hover:text-[#E31E24] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{language === 'ta' ? 'முழு விவரம்' : 'Details'}</span>
                          <span>&rarr;</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

      </div>

      {/* ========================================================== */}
      {/* EVENT DETAILS MODAL                                        */}
      {/* (Square parchment panel, 2px ink border, 6px red top bar)  */}
      {/* ========================================================== */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-[#111111]/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] text-[#111111] max-w-xl w-full border-2 border-[#111111] p-6 sm:p-8 relative shadow-2xl space-y-6"
          >
            {/* 6px red top bar */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#E31E24]" />

            {/* Header: Title and Close button */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#111111] pb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  [{selectedEvent.category}]
                </span>
                <h3 id="event-modal-title" className="font-helvetica font-extrabold text-[24px] md:text-[28px] text-[#111111] leading-tight">
                  {selectedEvent.title[language]}
                </h3>
              </div>

              <button
                ref={modalCloseBtnRef}
                type="button"
                onClick={handleCloseModal}
                className="min-h-[44px] h-[44px] px-4 bg-[#111111] hover:bg-[#E31E24] text-white font-helvetica font-extrabold text-[13px] uppercase tracking-normal transition-colors cursor-pointer btn-lift"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

            {/* Description */}
            <p className="text-[17px] text-[#3a322d] leading-relaxed">
              {selectedEvent.description[language]}
            </p>

            {/* Venue, Date & Speaker */}
            <div className="p-4 bg-white border border-[#111111] space-y-2 text-[15px]">
              <div>
                <strong className="block text-[#5B5348] text-[12px] uppercase">
                  {language === 'ta' ? 'நடைபெறும் இடம்:' : 'Venue & Location:'}
                </strong>
                <span className="font-semibold text-[#111111]">{selectedEvent.venue[language]}</span>
              </div>
              <div>
                <strong className="block text-[#5B5348] text-[12px] uppercase">
                  {language === 'ta' ? 'தேதி & நேரம்:' : 'Date & Schedule:'}
                </strong>
                <span className="font-semibold text-[#111111]">
                  {selectedEvent.date} {selectedEvent.time ? `• ${selectedEvent.time}` : ''}
                </span>
              </div>
              {selectedEvent.chiefGuest && (
                <div>
                  <strong className="block text-[#5B5348] text-[12px] uppercase">
                    {language === 'ta' ? 'சிறப்பு பேச்சாளர் / தலைவர்:' : 'Keynote / Chief Guest:'}
                  </strong>
                  <span className="font-semibold text-[#111111]">{selectedEvent.chiefGuest[language]}</span>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-[#111111]/20">
              {selectedEvent.status === 'upcoming' ? (
                <Link
                  href="/enrol"
                  className="min-h-[44px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] uppercase tracking-normal inline-flex items-center justify-center btn-lift"
                >
                  {language === 'ta' ? 'பதிவுசெய்க (Register)' : 'Register for Event'}
                </Link>
              ) : (
                <span className="text-[13px] font-bold text-[#5B5348]">
                  {language === 'ta' ? 'நிகழ்வு நிறைவடைந்தது' : 'Event completed'}
                </span>
              )}

              <button
                type="button"
                onClick={handleCloseModal}
                className="min-h-[44px] h-[44px] px-6 bg-[#111111] hover:bg-[#E31E24] text-white font-extrabold text-[14px] uppercase tracking-normal transition-colors cursor-pointer btn-lift"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
