'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { EventItem } from '@/types';
import { PageTitleBand } from '@/components/PageTitleBand';

const TA_MONTHS = [
  'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
  'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
];

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_TA = ['திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி', 'ஞாயிறு'];

export default function ActivitiesPage() {
  const { language } = useLanguage();
  const { events } = useData();

  // View: 'list' (default) or 'month'
  const [activeView, setActiveView] = useState<'list' | 'month'>('list');

  // Filters: Status ('all' | 'upcoming' | 'past') and Category ('All' or specific)
  const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'past'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Cross-fade animation over 0.25 s on view or filter change
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Month view calendar navigation (Defaulting to December 2026 where nearest conference is)
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(11); // 0-indexed: 11 = December

  // Day selection in Month View
  const [selectedDay, setSelectedDay] = useState<{ dateStr: string; events: EventItem[] } | null>(null);

  // Event details modal
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  // Trigger 0.25s crossfade on view or filter change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [activeView, activeStatus, activeCategory]);

  // Modal accessibility
  useEffect(() => {
    if (!selectedEvent) return;
    setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  // Distinct categories in the data
  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ['All', ...Array.from(set)];
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (activeStatus === 'upcoming' && e.status !== 'upcoming') return false;
      if (activeStatus === 'past' && e.status !== 'completed') return false;
      if (activeCategory !== 'All' && e.category !== activeCategory) return false;
      return true;
    });
  }, [events, activeStatus, activeCategory]);

  // Nearest upcoming event in filtered results
  const nearestUpcomingEvent = useMemo(() => {
    const upcoming = events.filter((e) => e.status === 'upcoming');
    return upcoming[0] || null;
  }, [events]);

  // List view: Grouped by month
  const groupedByMonth = useMemo(() => {
    const groups: {
      key: string;
      year: string;
      monthIndex: number;
      events: EventItem[];
    }[] = [];

    // Sort events descending by date
    const sorted = [...filteredEvents].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    sorted.forEach((event) => {
      const d = new Date(event.date);
      const year = isNaN(d.getFullYear()) ? '2026' : String(d.getFullYear());
      const monthIndex = isNaN(d.getMonth()) ? 11 : d.getMonth();
      const key = `${year}-${monthIndex}`;

      let grp = groups.find((g) => g.key === key);
      if (!grp) {
        grp = { key, year, monthIndex, events: [] };
        groups.push(grp);
      }
      grp.events.push(event);
    });

    return groups;
  }, [filteredEvents]);

  // Month name helper
  const getMonthName = (monthIndex: number, lang: 'en' | 'ta') => {
    return lang === 'ta' ? TA_MONTHS[monthIndex] : EN_MONTHS[monthIndex];
  };

  // Month view calendar navigation
  const goToPrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
    setSelectedDay(null);
  };

  // Build calendar cells (Monday to Sunday)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    let startDayIndex = firstDay.getDay() - 1; // 0 = Mon, ..., 6 = Sun
    if (startDayIndex === -1) startDayIndex = 6;

    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells: {
      dayNum: number | null;
      dateStr: string | null;
      events: EventItem[];
      isToday: boolean;
    }[] = [];

    // Empty cells before start day
    for (let i = 0; i < startDayIndex; i++) {
      cells.push({ dayNum: null, dateStr: null, events: [], isToday: false });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
      // Fixed reference date: 22 November 2026
      const isToday = calendarYear === 2026 && calendarMonth === 10 && day === 22;

      cells.push({
        dayNum: day,
        dateStr,
        events: dayEvents,
        isToday,
      });
    }

    // Pad ending cells to complete full 7-day row
    const remainder = cells.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        cells.push({ dayNum: null, dateStr: null, events: [], isToday: false });
      }
    }

    return cells;
  }, [calendarYear, calendarMonth, filteredEvents]);

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#111111] font-catamaran text-[18px] leading-[1.75] pb-24">
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'நிகழ்வுகள் & மாநாடுகள்' : 'Conferences and events'}
        description={
          language === 'ta'
            ? 'கழக வழக்கறிஞர் அணியின் மாநில மாநாடுகள், கருத்தரங்குகள், சட்டப் பயிற்சிப் பட்டறைகள் மற்றும் களப்பணிகள்.'
            : 'Official agenda of state conferences, legal seminars, workshops, and commemorative sessions.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-10">
        {/* ========================================================== */}
        {/* 1. HEADING ROW & FILTERS                                   */}
        {/* ========================================================== */}
        <header className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#3d3633]/20">
            {/* Slogan / Subhead */}
            <span className="font-manrope font-extrabold text-[14px] uppercase text-[#C41A1F] tracking-normal">
              {language === 'ta' ? 'கழக நிகழ்வு அட்டவணை' : 'Official Wing Calendar'}
            </span>

            {/* Right: Text buttons "List" and "Month" (Active underlined in red) */}
            <div className="flex items-center gap-6 shrink-0">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className={`min-h-[44px] h-[44px] inline-flex items-center font-manrope font-extrabold text-[17px] cursor-pointer transition-colors ${
                  activeView === 'list'
                    ? 'text-[#111111] border-b-[3px] border-[#E31E24]'
                    : 'text-[#5B5348] hover:text-[#111111] border-b-[3px] border-transparent'
                }`}
              >
                {language === 'ta' ? 'பட்டியல்' : 'List'}
              </button>
              <button
                type="button"
                onClick={() => setActiveView('month')}
                className={`min-h-[44px] h-[44px] inline-flex items-center font-manrope font-extrabold text-[17px] cursor-pointer transition-colors ${
                  activeView === 'month'
                    ? 'text-[#111111] border-b-[3px] border-[#E31E24]'
                    : 'text-[#5B5348] hover:text-[#111111] border-b-[3px] border-transparent'
                }`}
              >
                {language === 'ta' ? 'மாதம்' : 'Month'}
              </button>
            </div>
          </div>

          {/* Filters as plain text links: Upcoming / Past, then each event type */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] pt-1">
            {/* All / Upcoming / Past */}
            <button
              type="button"
              onClick={() => setActiveStatus('all')}
              className={`min-h-[44px] inline-flex items-center font-manrope font-bold cursor-pointer transition-colors ${
                activeStatus === 'all'
                  ? 'text-[#111111] border-b-2 border-[#E31E24]'
                  : 'text-[#5B5348] hover:text-[#111111]'
              }`}
            >
              {language === 'ta' ? 'அனைத்தும்' : 'All'}
            </button>
            <span className="text-[#5B5348] select-none">/</span>
            <button
              type="button"
              onClick={() => setActiveStatus('upcoming')}
              className={`min-h-[44px] inline-flex items-center font-manrope font-bold cursor-pointer transition-colors ${
                activeStatus === 'upcoming'
                  ? 'text-[#111111] border-b-2 border-[#E31E24]'
                  : 'text-[#5B5348] hover:text-[#111111]'
              }`}
            >
              {language === 'ta' ? 'வரவிருப்பவை' : 'Upcoming'}
            </button>
            <span className="text-[#5B5348] select-none">/</span>
            <button
              type="button"
              onClick={() => setActiveStatus('past')}
              className={`min-h-[44px] inline-flex items-center font-manrope font-bold cursor-pointer transition-colors ${
                activeStatus === 'past'
                  ? 'text-[#111111] border-b-2 border-[#E31E24]'
                  : 'text-[#5B5348] hover:text-[#111111]'
              }`}
            >
              {language === 'ta' ? 'நிறைவடைந்தவை' : 'Past'}
            </button>

            <span className="text-[#d7d0c3] font-bold mx-2">|</span>

            {/* Event categories */}
            {existingCategories.map((cat, idx) => {
              const isActive = activeCategory === cat;
              return (
                <React.Fragment key={cat}>
                  {idx > 0 && <span className="text-[#5B5348] select-none">/</span>}
                  <button
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-[44px] inline-flex items-center font-manrope font-bold cursor-pointer transition-colors ${
                      isActive
                        ? 'text-[#111111] border-b-2 border-[#E31E24]'
                        : 'text-[#5B5348] hover:text-[#111111]'
                    }`}
                  >
                    {cat === 'All' && language === 'ta' ? 'அனைத்துப் பிரிவுகள்' : cat}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Signature DMK Flag 5px rule: Top Black, Bottom Red */}
          <div className="w-full h-[5px] dmk-flag-strip mt-2 mb-12" aria-hidden="true" />
        </header>

        {/* ========================================================== */}
        {/* CROSS-FADING CONTENT CONTAINER (0.25 s)                    */}
        {/* ========================================================== */}
        <div
          className={`transition-opacity duration-250 ease-in-out motion-reduce:transition-none ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* 4. When nothing matches: one plain sentence, no illustration */}
          {filteredEvents.length === 0 ? (
            <p className="py-20 text-center text-[#5B5348] text-[18px]">
              {language === 'ta'
                ? 'தேர்வு செய்யப்பட்ட வடிகட்டலுக்கு ஏற்ப எந்த நிகழ்வுகளும் காணப்படவில்லை.'
                : 'No events match the selected criteria.'}
            </p>
          ) : activeView === 'list' ? (
            /* ========================================================== */
            /* 2. LIST VIEW (DEFAULT): GROUPED BY MONTH                   */
            /* ========================================================== */
            <div className="space-y-16">
              {groupedByMonth.map((grp) => (
                <div
                  key={grp.key}
                  className="flex flex-col md:flex-row gap-8 lg:gap-12 pb-12 border-b border-[#d7d0c3] last:border-b-0"
                >
                  {/* Left Column (about 200 px, sticky on desktop; heading on phones) */}
                  <div className="w-full md:w-[200px] shrink-0 md:sticky md:top-24 self-start">
                    <h2 className="font-kavivanar font-normal text-[36px] text-[#111111] leading-tight">
                      {getMonthName(grp.monthIndex, language)}
                    </h2>
                    <p className="font-manrope font-bold text-[18px] text-[#5B5348] mt-1">
                      {grp.year}
                    </p>
                  </div>

                  {/* Right Column: Events separated by 1 px #d7d0c3 rules */}
                  <div className="flex-1 divide-y divide-[#d7d0c3]">
                    {grp.events.map((event) => {
                      const isNearest = nearestUpcomingEvent?.id === event.id;
                      const isPast = event.status === 'completed';
                      const d = new Date(event.date);
                      const dayNum = isNaN(d.getDate())
                        ? '15'
                        : String(d.getDate()).padStart(2, '0');

                      return (
                        <article key={event.id} className="py-8 first:pt-0 last:pb-0">
                          {/* Nearest upcoming event has a 3 px red rule above it */}
                          {isNearest && (
                            <div className="w-full h-[3px] bg-[#E31E24] mb-6" />
                          )}

                          <div className="flex flex-col sm:flex-row items-start gap-6 lg:gap-8">
                            {/* Day number in Helvetica Now Display 800 at 44 px */}
                            <div className="shrink-0 w-16">
                              <span
                                className={`font-manrope font-extrabold text-[44px] leading-none block ${
                                  isPast ? 'text-[#5B5348]' : 'text-[#111111]'
                                }`}
                              >
                                {dayNum}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-2">
                              {/* Type in #C41A1F 15 px */}
                              <span
                                className={`text-[15px] font-bold block ${
                                  isPast ? 'text-[#5B5348]' : 'text-[#C41A1F]'
                                }`}
                              >
                                {event.category}
                              </span>

                              {/* Title in Helvetica Now Display 800 at 26 px (Kavivanar for Tamil) */}
                              <h3
                                className={`text-[26px] leading-[1.2] ${
                                  language === 'ta'
                                    ? 'font-kavivanar font-normal'
                                    : 'font-manrope font-extrabold'
                                } ${isPast ? 'text-[#5B5348]' : 'text-[#111111]'}`}
                              >
                                {event.title[language]}
                              </h3>

                              {/* Venue and time in grey 17 px */}
                              <p className="text-[17px] text-[#5B5348]">
                                <span>{event.venue[language]}</span>
                                {event.time && (
                                  <>
                                    <span className="mx-2" aria-hidden="true">
                                      ·
                                    </span>
                                    <span>{event.time}</span>
                                  </>
                                )}
                              </p>

                              {/* Speakers if data has them */}
                              {event.chiefGuest && (
                                <p className="text-[15px] text-[#5B5348]">
                                  <span className="font-bold text-[#111111]">
                                    {language === 'ta' ? 'சிறப்பு பேச்சாளர்: ' : 'Speaker: '}
                                  </span>
                                  <span>{event.chiefGuest[language]}</span>
                                </p>
                              )}

                                {/* Actions: Details text link & red rectangular Register button */}
                                <div className="pt-2 flex flex-wrap items-center gap-6">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedEvent(event)}
                                    className="min-h-[44px] inline-flex items-center font-manrope font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] underline decoration-1 underline-offset-4 cursor-pointer"
                                  >
                                    {language === 'ta' ? 'விவரங்கள் →' : 'Details →'}
                                  </button>

                                  {event.status === 'upcoming' && (
                                    <Link
                                      href="/enrol"
                                      className="min-h-[44px] h-[44px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-manrope font-extrabold text-[14px] uppercase tracking-normal inline-flex items-center justify-center transition-colors cursor-pointer btn-lift"
                                    >
                                      {language === 'ta' ? 'பதிவுசெய்க' : 'Register'}
                                    </Link>
                                  )}
                                </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ========================================================== */
            /* 3. MONTH VIEW: SQUARE SEVEN-COLUMN GRID (MON TO SUN)       */
            /* ========================================================== */
            <div className="space-y-6">
              {/* Previous and next month text buttons above grid */}
              <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-4">
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  className="min-h-[44px] h-[44px] px-2 font-manrope font-bold text-[16px] text-[#111111] hover:text-[#C41A1F] cursor-pointer"
                >
                  ← {getMonthName((calendarMonth - 1 + 12) % 12, language)}
                </button>

                <h2 className="font-kavivanar font-normal text-[28px] md:text-[36px] text-[#111111] leading-none">
                  {getMonthName(calendarMonth, language)} {calendarYear}
                </h2>

                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="min-h-[44px] h-[44px] px-2 font-manrope font-bold text-[16px] text-[#111111] hover:text-[#C41A1F] cursor-pointer"
                >
                  {getMonthName((calendarMonth + 1) % 12, language)} →
                </button>
              </div>

              {/* Day headers: Monday to Sunday */}
              <div className="grid grid-cols-7 border-t border-l border-[#d7d0c3] text-center">
                {(language === 'ta' ? WEEKDAYS_TA : WEEKDAYS_EN).map((dayName) => (
                  <div
                    key={dayName}
                    className="border-r border-b border-[#d7d0c3] py-2 font-manrope font-extrabold text-[14px] text-[#5B5348] uppercase tracking-normal"
                  >
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Square 7-column grid with 1 px #d7d0c3 lines */}
              <div className="grid grid-cols-7 border-l border-[#d7d0c3]">
                {calendarDays.map((cell, idx) => {
                  const hasEvents = cell.events.length > 0;
                  const isSelected = selectedDay?.dateStr === cell.dateStr;

                  if (cell.dayNum === null) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="border-r border-b border-[#d7d0c3] aspect-square min-h-[60px] sm:min-h-[90px] bg-[#FAF8F5]/40"
                      />
                    );
                  }

                  return (
                    <button
                      key={cell.dateStr || idx}
                      type="button"
                      disabled={!hasEvents}
                      onClick={() =>
                        hasEvents
                          ? setSelectedDay({
                              dateStr: cell.dateStr!,
                              events: cell.events,
                            })
                          : null
                      }
                      className={`border-r border-b border-[#d7d0c3] aspect-square min-h-[60px] sm:min-h-[90px] p-2 flex flex-col justify-between text-left transition-colors ${
                        hasEvents ? 'cursor-pointer hover:bg-white' : 'cursor-default'
                      } ${cell.isToday ? 'border-2 border-[#111111]' : ''} ${
                        isSelected ? 'bg-white' : ''
                      }`}
                    >
                      {/* Day number */}
                      <span className="font-manrope font-extrabold text-[16px] md:text-[18px] text-[#111111] leading-none">
                        {cell.dayNum}
                      </span>

                      {/* 10 px red square under days that have an event */}
                      {hasEvents && (
                        <div
                          className="w-[10px] h-[10px] bg-[#E31E24] mt-1 shrink-0"
                          aria-label={`${cell.events.length} event(s)`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Clicking a day with events opens its events in a plain panel below the grid */}
              {selectedDay && selectedDay.events.length > 0 && (
                <div className="bg-white border border-[#111111] p-6 md:p-8 mt-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#d7d0c3] pb-4">
                    <h3 className="font-manrope font-extrabold text-[22px] text-[#111111]">
                      {language === 'ta'
                        ? `நிகழ்வுகள்: ${selectedDay.dateStr}`
                        : `Events on ${selectedDay.dateStr}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedDay(null)}
                      className="min-h-[44px] h-[44px] px-4 font-manrope font-bold text-[15px] text-[#5B5348] hover:text-[#111111] cursor-pointer"
                    >
                      {language === 'ta' ? 'மூடுக' : 'Close'}
                    </button>
                  </div>

                  <div className="divide-y divide-[#d7d0c3]">
                    {selectedDay.events.map((ev) => (
                      <div key={ev.id} className="py-4 space-y-2 first:pt-0 last:pb-0">
                        <span className="text-[14px] font-bold text-[#C41A1F] block">
                          {ev.category}
                        </span>
                        <h4
                          className={`text-[22px] text-[#111111] leading-snug ${
                            language === 'ta'
                              ? 'font-kavivanar font-normal'
                              : 'font-manrope font-extrabold'
                          }`}
                        >
                          {ev.title[language]}
                        </h4>
                        <p className="text-[16px] text-[#5B5348]">
                          {ev.venue[language]} {ev.time ? `· ${ev.time}` : ''}
                        </p>
                        {ev.chiefGuest && (
                          <p className="text-[14px] text-[#5B5348]">
                            <span className="font-bold text-[#111111]">
                              {language === 'ta' ? 'சிறப்பு பேச்சாளர்: ' : 'Speaker: '}
                            </span>
                            {ev.chiefGuest[language]}
                          </p>
                        )}
                        <div className="pt-2 flex items-center gap-6">
                          <button
                            type="button"
                            onClick={() => setSelectedEvent(ev)}
                            className="min-h-[44px] inline-flex items-center font-manrope font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] underline decoration-1 underline-offset-4 cursor-pointer"
                          >
                            {language === 'ta' ? 'விவரங்கள் →' : 'Details →'}
                          </button>
                          {ev.status === 'upcoming' && (
                            <Link
                              href="/enrol"
                              className="min-h-[44px] h-[44px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-manrope font-extrabold text-[14px] uppercase tracking-normal inline-flex items-center justify-center transition-colors cursor-pointer btn-lift"
                            >
                              {language === 'ta' ? 'பதிவுசெய்க' : 'Register'}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* PLAIN EVENT DETAILS MODAL                                  */}
      {/* ========================================================== */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 bg-[#111111]/70 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] text-[#111111] max-w-xl w-full border border-[#111111] p-6 sm:p-8 space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#111111] pb-4">
              <div>
                <span className="text-[13px] font-bold text-[#C41A1F] block mb-1">
                  {selectedEvent.category}
                </span>
                <h3
                  id="event-modal-title"
                  className={`text-[24px] md:text-[28px] text-[#111111] leading-tight ${
                    language === 'ta'
                      ? 'font-kavivanar font-normal'
                      : 'font-manrope font-extrabold'
                  }`}
                >
                  {selectedEvent.title[language]}
                </h3>
              </div>
              <button
                ref={modalCloseBtnRef}
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="min-h-[44px] h-[44px] px-4 font-manrope font-bold text-[14px] text-[#111111] hover:text-[#C41A1F] cursor-pointer"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

            {/* Description */}
            <p className="text-[17px] text-[#111111] leading-relaxed">
              {selectedEvent.description[language]}
            </p>

            {/* Venue, Schedule, Speakers */}
            <div className="border-t border-[#d7d0c3] pt-4 space-y-2 text-[15px] text-[#5B5348]">
              <p>
                <strong className="text-[#111111]">
                  {language === 'ta' ? 'இடம்: ' : 'Venue: '}
                </strong>
                {selectedEvent.venue[language]}
              </p>
              <p>
                <strong className="text-[#111111]">
                  {language === 'ta' ? 'நேரம்: ' : 'Schedule: '}
                </strong>
                {selectedEvent.date} {selectedEvent.time ? `· ${selectedEvent.time}` : ''}
              </p>
              {selectedEvent.chiefGuest && (
                <p>
                  <strong className="text-[#111111]">
                    {language === 'ta' ? 'தலைவர் / பேச்சாளர்: ' : 'Keynote / Speaker: '}
                  </strong>
                  {selectedEvent.chiefGuest[language]}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-[#d7d0c3]">
              {selectedEvent.status === 'upcoming' ? (
                <Link
                  href="/enrol"
                  className="min-h-[44px] h-[44px] px-6 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-manrope font-extrabold text-[14px] uppercase tracking-normal inline-flex items-center justify-center transition-colors"
                >
                  {language === 'ta' ? 'பதிவுசெய்க' : 'Register'}
                </Link>
              ) : (
                <span className="text-[14px] font-bold text-[#5B5348]">
                  {language === 'ta' ? 'நிறைவடைந்தது' : 'Event completed'}
                </span>
              )}
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="min-h-[44px] h-[44px] px-4 font-manrope font-bold text-[14px] text-[#111111] hover:text-[#C41A1F] cursor-pointer"
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
