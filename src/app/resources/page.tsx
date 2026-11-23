'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LegalResource } from '@/types';

interface ExtendedLegalResource extends LegalResource {
  year?: string;
  lastUpdated?: string;
  language?: string;
  significance?: { en: string; ta: string };
  fileFormat?: string;
}

interface CategoryOption {
  id: string;
  en: string;
  ta: string;
}

const BASE_CATEGORIES: CategoryOption[] = [
  { id: 'All', en: 'All', ta: 'அனைத்தும்' },
  { id: 'State Autonomy', en: 'State Autonomy', ta: 'மாநில சுயாட்சி' },
  { id: 'Social Justice', en: 'Social Justice', ta: 'சமூக நீதி' },
  { id: 'Constitutional Law', en: 'Constitutional Law', ta: 'அரசமைப்புச் சட்டம்' },
  { id: 'Statutory Reform', en: 'Statutory Reform', ta: 'சட்ட சீர்திருத்தம்' },
];

type SortField = 'year' | 'size' | 'updated';
type SortDir = 'asc' | 'desc';

export default function ResourcesPage() {
  const { language } = useLanguage();
  const { resources: contextResources } = useData();

  const [resources, setResources] = useState<ExtendedLegalResource[]>(
    () => (contextResources as ExtendedLegalResource[]) || []
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewResource, setPreviewResource] = useState<ExtendedLegalResource | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Focus return ref
  const lastFocusedRowRef = useRef<HTMLButtonElement | null>(null);

  // Sync with contextResources immediately and load from /api/resources if needed
  useEffect(() => {
    if (contextResources && contextResources.length > 0) {
      setResources(contextResources as ExtendedLegalResource[]);
    }
  }, [contextResources]);

  useEffect(() => {
    let isMounted = true;
    async function loadResources() {
      try {
        const res = await fetch('/api/resources');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.resources) && isMounted) {
            setResources(data.resources);
            return;
          }
        }
      } catch (err) {
        console.warn('Direct fetch from /api/resources failed, using context:', err);
      }
    }

    loadResources();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewResource(null);
    if (lastFocusedRowRef.current) {
      lastFocusedRowRef.current.focus();
    }
  }, []);

  const handleOpenPreview = (item: ExtendedLegalResource, buttonEl?: HTMLButtonElement | null) => {
    if (buttonEl) lastFocusedRowRef.current = buttonEl;
    setPreviewResource(item);
  };

  // Handle escape key to close preview and return focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewResource) {
        handleClosePreview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewResource, handleClosePreview]);

  // Category collection from data
  const categories: CategoryOption[] = useMemo(() => {
    const list = [...BASE_CATEGORIES];
    const existingIds = new Set(list.map((c) => c.id.toLowerCase()));

    resources.forEach((r) => {
      if (r.category && !existingIds.has(r.category.toLowerCase())) {
        existingIds.add(r.category.toLowerCase());
        list.push({
          id: r.category,
          en: r.category,
          ta:
            r.category === 'Supreme Court'
              ? 'உச்ச நீதிமன்றம்'
              : r.category === 'High Court'
              ? 'உயர் நீதிமன்றம்'
              : r.category === 'Constitution'
              ? 'அரசமைப்பு'
              : r.category === 'Statute'
              ? 'சட்டம்'
              : r.category === 'Legal Aid'
              ? 'சட்ட உதவி'
              : r.category,
        });
      }
    });

    return list;
  }, [resources]);

  // Matching logic
  const matchesCategory = useCallback((item: ExtendedLegalResource, catId: string): boolean => {
    if (catId === 'All') return true;
    if (item.category === catId) return true;

    const textEn = `${item.title.en} ${item.summary.en} ${item.category || ''}`.toLowerCase();
    const textTa = `${item.title.ta} ${item.summary.ta} ${item.category || ''}`.toLowerCase();

    if (catId === 'State Autonomy') {
      return (
        textEn.includes('autonomy') ||
        textEn.includes('governor') ||
        textEn.includes('centre-state') ||
        textTa.includes('சுயாட்சி') ||
        textTa.includes('ஆளுநர்') ||
        item.id === 'res-rajamannar-autonomy' ||
        item.id === 'res-governor-assent'
      );
    }
    if (catId === 'Social Justice') {
      return (
        textEn.includes('reservation') ||
        textEn.includes('backward') ||
        textEn.includes('social justice') ||
        textTa.includes('இடஒதுக்கீடு') ||
        textTa.includes('சமூக நீதி') ||
        item.id === 'res-69-reservation'
      );
    }
    if (catId === 'Constitutional Law') {
      return (
        item.category === 'Constitution' ||
        item.category === 'Supreme Court' ||
        textEn.includes('constitution') ||
        textTa.includes('அரசமைப்பு') ||
        item.court === 'Constitutional Bench' ||
        item.court === 'Supreme Court of India'
      );
    }
    if (catId === 'Statutory Reform') {
      return (
        item.category === 'Statute' ||
        textEn.includes('amendment') ||
        textEn.includes('statutory') ||
        textTa.includes('சட்டம்') ||
        item.id === 'res-self-respect-marriage'
      );
    }

    return item.category.toLowerCase() === catId.toLowerCase();
  }, []);

  // Filtered resources
  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((item) => {
      const matchCat = matchesCategory(item, activeCategory);
      const matchSearch =
        !q ||
        item.title.en.toLowerCase().includes(q) ||
        item.title.ta.toLowerCase().includes(q) ||
        item.summary.en.toLowerCase().includes(q) ||
        item.summary.ta.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.court && item.court.toLowerCase().includes(q)) ||
        (item.citation && item.citation.toLowerCase().includes(q)) ||
        (item.year && item.year.includes(q)) ||
        (item.date && item.date.includes(q));

      return matchCat && matchSearch;
    });
  }, [resources, activeCategory, searchQuery, matchesCategory]);

  // Helpers for sorting
  const parseSizeToKb = (sizeStr?: string): number => {
    if (!sizeStr) return 0;
    const num = parseFloat(sizeStr);
    if (isNaN(num)) return 0;
    if (sizeStr.toLowerCase().includes('mb')) return num * 1024;
    if (sizeStr.toLowerCase().includes('gb')) return num * 1024 * 1024;
    return num;
  };

  const parseYearVal = (item: ExtendedLegalResource): number => {
    if (item.year) {
      const parsed = parseInt(item.year, 10);
      if (!isNaN(parsed)) return parsed;
    }
    if (item.date) {
      const parsed = parseInt(item.date.slice(0, 4), 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  };

  const parseUpdatedTime = (item: ExtendedLegalResource): number => {
    const dateStr = item.lastUpdated || item.date;
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    return isNaN(t) ? 0 : t;
  };

  // Sorted resources
  const sortedResources = useMemo(() => {
    if (!sortField) return filteredList;

    return [...filteredList].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'year') {
        comparison = parseYearVal(a) - parseYearVal(b);
      } else if (sortField === 'size') {
        comparison = parseSizeToKb(a.fileSize) - parseSizeToKb(b.fileSize);
      } else if (sortField === 'updated') {
        comparison = parseUpdatedTime(a) - parseUpdatedTime(b);
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [filteredList, sortField, sortDir]);

  // Handle header sort button clicks
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Counting "N documents" in grey when filter changes
  const [displayCount, setDisplayCount] = useState<number>(sortedResources.length);
  const displayCountRef = useRef<number>(displayCount);
  displayCountRef.current = displayCount;

  useEffect(() => {
    const start = displayCountRef.current;
    const end = sortedResources.length;
    if (start === end) return;
    let step = 0;
    const totalSteps = 12;
    const interval = setInterval(() => {
      step++;
      const current = Math.round(start + (end - start) * (step / totalSteps));
      setDisplayCount(current);
      if (step >= totalSteps) {
        setDisplayCount(end);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [sortedResources.length]);

  // Helper to mark matched letters with #f6c9ca background
  const highlightMatch = (text: string, query: string) => {
    const q = query.trim();
    if (!q) return text;
    try {
      const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[#f6c9ca] text-[#111111] px-0.5 font-bold">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#111111] font-catamaran antialiased overflow-x-clip selection:bg-[#E31E24] selection:text-white">
      
      {/* ========================================================== */}
      {/* 1. TITLE BAND (INK)                                        */}
      {/* Kavivanar title "Legal document vault" / "சட்ட ஆவண         */}
      {/* கல்விக்கூடம்" clamp(44px,6vw,84px), parchment text,        */}
      {/* one 20 px line in #d8cfc2, 6 px red rule drawing 1s        */}
      {/* ========================================================== */}
      <section className="w-full bg-[#111111] text-[#FAF8F5] pt-14 pb-12 px-[clamp(20px,4vw,56px)] border-b border-[#111111] relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto space-y-4">
          <span className="text-[15px] font-extrabold uppercase text-[#ff8a85] tracking-normal block">
            OFFICIAL DIGITAL REPOSITORY · ANNA ARIVALAYAM
          </span>

          <h1 className="font-kavivanar font-normal text-[#FAF8F5] text-[clamp(44px,6vw,84px)] leading-[1.08] tracking-normal">
            {language === 'ta' ? 'சட்ட ஆவண கல்விக்கூடம்' : 'Legal document vault'}
          </h1>

          <p className="text-[20px] text-[#d8cfc2] leading-[1.65] max-w-[860px] font-normal">
            {language === 'ta'
              ? 'அரசமைப்பு அறிக்கைகள், வரலாற்றுச் சிறப்புமிக்க நீதிமன்றத் தீர்ப்புகள் மற்றும் சட்டக் கையேடுகளின் அதிகாரப்பூர்வ ஆவணக் காப்பகம்.'
              : 'Authoritative constitutional archives, landmark judicial precedents, statutory reports and party legal briefs.'}
          </p>
        </div>

        {/* 6 px red rule along the bottom that draws left to right in 1 s */}
        <div className="w-full h-[6px] bg-[#E31E24] animate-draw-rule-1s absolute bottom-0 left-0" />
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-10 pb-24">
        
        {/* ========================================================== */}
        {/* 2. TOOLBAR ON PARCHMENT                                    */}
        {/* Search box (2 px ink border, inline-SVG magnifier)         */}
        {/* Category tabs with sliding red underline                   */}
        {/* Right: line "N documents" in grey counting to new number   */}
        {/* ========================================================== */}
        <section className="bg-[#FAF8F5] pb-8 space-y-6">
          
          {/* Search box: 2 px ink border, inline-SVG magnifier */}
          <div className="relative border-2 border-[#111111] bg-white flex items-center px-4 min-h-[48px]">
            <span className="text-[#111111] shrink-0" aria-hidden="true">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'ஆவணத் தலைப்பு, வழக்கு எண் அல்லது குறிப்புரை தேடுக (வார்த்தை நிறமிடப்படும்)...'
                  : 'Search by title, category, year or citation (matches highlighted)...'
              }
              className="w-full bg-transparent border-none outline-none text-[15px] sm:text-[17px] text-[#111111] pl-3 pr-2 py-2 placeholder-[#5B5348]"
              aria-label={language === 'ta' ? 'ஆவணங்களைத் தேடுக' : 'Search documents'}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[15px] font-extrabold text-[#C41A1F] hover:underline cursor-pointer px-2"
              >
                {language === 'ta' ? 'அழிக்க' : 'Clear'}
              </button>
            )}
          </div>

          {/* Category tabs + Count */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#111111] pb-3">
            
            {/* Category tabs: All, State Autonomy, Social Justice, Constitutional Law, Statutory Reform... */}
            <div className="flex items-center gap-6 overflow-x-auto pb-1">
              {categories.map((c) => {
                const isActive = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={`relative py-1 font-helvetica font-extrabold text-[15px] uppercase tracking-normal transition-colors cursor-pointer whitespace-nowrap ${
                      isActive ? 'text-[#111111]' : 'text-[#5B5348] hover:text-[#111111]'
                    }`}
                  >
                    <span>{language === 'ta' ? c.ta : c.en}</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#E31E24] transition-all duration-250 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            {/* Right: "N documents" in grey counting to new number when filter changes */}
            <div className="font-helvetica font-bold text-[15px] text-[#5B5348] whitespace-nowrap shrink-0 md:text-right">
              <span className="text-[#111111] font-extrabold">{displayCount}</span>{' '}
              {language === 'ta'
                ? 'ஆவணங்கள்'
                : displayCount === 1
                ? 'document'
                : 'documents'}
            </div>

          </div>
        </section>

        {/* Empty state */}
        {sortedResources.length === 0 && (
          <div className="py-20 text-center text-[#5B5348] text-[17px]">
            {language === 'ta'
              ? 'தேடலுக்குரிய சட்ட ஆவணங்கள் எதுவும் கிடைக்கவில்லை.'
              : 'No documents match your query in this catalogue.'}
          </div>
        )}

        {/* ========================================================== */}
        {/* 3. TABLE (DESKTOP & TABLETS)                               */}
        {/* Header on ink, parchment text, 800, 15 px                  */}
        {/* Columns: Title, Category, Year, Language, Size, Updated,   */}
        {/* Actions. Year, Size, Updated are sort buttons with arrow.  */}
        {/* Rows 64 px tall, 18 px text, 1 px #d7d0c3 lines,           */}
        {/* Title Helvetica Now Display 800.                           */}
        {/* Hover: 4 px red bar grows at left, turns #f1ece2.          */}
        {/* Rows fade in 40 ms apart. Leave cell empty when no value.  */}
        {/* Click on table closes preview.                             */}
        {/* ========================================================== */}
        {sortedResources.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto border-2 border-[#111111] bg-white">
              <table
                onClick={previewResource ? handleClosePreview : undefined}
                className="w-full text-left border-collapse"
              >
                {/* Header row on ink (parchment text, 800, 15 px) */}
                <thead>
                  <tr className="bg-[#111111] text-[#FAF8F5] font-helvetica font-extrabold text-[15px] uppercase tracking-normal border-b-2 border-[#111111]">
                    <th className="py-4 px-4 w-5/12">
                      {language === 'ta' ? 'தலைப்பு' : 'Title'}
                    </th>
                    <th className="py-4 px-4 whitespace-nowrap">
                      {language === 'ta' ? 'பிரிவு' : 'Category'}
                    </th>
                    
                    {/* Sortable: Year */}
                    <th className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort('year');
                        }}
                        className="inline-flex items-center gap-1.5 font-helvetica font-extrabold text-[15px] uppercase text-[#FAF8F5] hover:text-[#ff8a85] cursor-pointer"
                      >
                        <span>{language === 'ta' ? 'ஆண்டு' : 'Year'}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            sortField === 'year' && sortDir === 'asc' ? 'rotate-180 text-[#E31E24]' : 'text-[#d8cfc2]'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>

                    <th className="py-4 px-4 whitespace-nowrap">
                      {language === 'ta' ? 'மொழி' : 'Language'}
                    </th>

                    {/* Sortable: Size */}
                    <th className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort('size');
                        }}
                        className="inline-flex items-center gap-1.5 font-helvetica font-extrabold text-[15px] uppercase text-[#FAF8F5] hover:text-[#ff8a85] cursor-pointer"
                      >
                        <span>{language === 'ta' ? 'அளவு' : 'Size'}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            sortField === 'size' && sortDir === 'asc' ? 'rotate-180 text-[#E31E24]' : 'text-[#d8cfc2]'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>

                    {/* Sortable: Updated */}
                    <th className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort('updated');
                        }}
                        className="inline-flex items-center gap-1.5 font-helvetica font-extrabold text-[15px] uppercase text-[#FAF8F5] hover:text-[#ff8a85] cursor-pointer"
                      >
                        <span>{language === 'ta' ? 'புதுப்பிக்கப்பட்டது' : 'Updated'}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            sortField === 'updated' && sortDir === 'asc' ? 'rotate-180 text-[#E31E24]' : 'text-[#d8cfc2]'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>

                    <th className="py-4 px-4 text-right whitespace-nowrap">
                      {language === 'ta' ? 'செயல்கள்' : 'Actions'}
                    </th>
                  </tr>
                </thead>

                {/* Rows: 64 px tall, 18 px text, 1 px #d7d0c3 lines, title Helvetica 800 */}
                {/* Hover: 4 px red bar grows at left edge, row turns #f1ece2 */}
                {/* Staggered fade in 40 ms apart */}
                <tbody className="divide-y divide-[#d7d0c3]">
                  {sortedResources.map((item, idx) => {
                    const isSelected = previewResource?.id === item.id;
                    const yearVal = item.year || (item.date ? item.date.slice(0, 4) : '');
                    const updatedVal = item.lastUpdated || item.date || '';
                    const sizeVal = item.fileSize || '';
                    const langVal = item.language || '';
                    const titleStr = item.title[language] || item.title.en;

                    return (
                      <tr
                        key={item.id}
                        className={`group relative text-[18px] min-h-[64px] h-[64px] transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#f1ece2]' : 'hover:bg-[#f1ece2]'
                        }`}
                        style={{
                          animation: `fade-rise 0.4s ease-out ${idx * 40}ms forwards`,
                        }}
                      >
                        {/* Title with matched letters highlighted in #f6c9ca background */}
                        <td className="py-3 px-4 align-middle relative">
                          {/* 4 px red bar grows at left edge on hover */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[4px] bg-[#E31E24] transition-all duration-200"
                            aria-hidden="true"
                          />
                          <div className="font-helvetica font-extrabold text-[18px] text-[#111111] leading-[1.12]">
                            {highlightMatch(titleStr, searchQuery)}
                          </div>
                          {item.citation && (
                            <div className="text-[15px] text-[#5B5348] font-catamaran mt-0.5">
                              {item.citation}
                            </div>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 align-middle text-[15px] font-semibold text-[#5B5348] whitespace-nowrap">
                          {item.category || ''}
                        </td>

                        {/* Year: Leave cell empty when no value */}
                        <td className="py-3 px-4 align-middle font-helvetica font-extrabold text-[15px] text-[#111111] whitespace-nowrap">
                          {yearVal || ''}
                        </td>

                        {/* Language: Leave cell empty when no value */}
                        <td className="py-3 px-4 align-middle text-[15px] text-[#5B5348] whitespace-nowrap">
                          {langVal || ''}
                        </td>

                        {/* Size: Leave cell empty when no value */}
                        <td className="py-3 px-4 align-middle font-helvetica text-[15px] text-[#5B5348] whitespace-nowrap">
                          {sizeVal || ''}
                        </td>

                        {/* Updated: Leave cell empty when no value */}
                        <td className="py-3 px-4 align-middle font-helvetica text-[15px] text-[#5B5348] whitespace-nowrap">
                          {updatedVal || ''}
                        </td>

                        {/* Actions: Text links "Preview" and "Download" (Download becomes red rectangular button on hover) */}
                        <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPreview(item, e.currentTarget);
                              }}
                              className="font-helvetica font-extrabold text-[15px] text-[#111111] underline hover:text-[#E31E24] cursor-pointer py-1"
                            >
                              {language === 'ta' ? 'பார்வை' : 'Preview'}
                            </button>
                            <a
                              href={item.downloadUrl || '#'}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="font-helvetica font-extrabold text-[15px] text-[#111111] underline hover:no-underline hover:bg-[#E31E24] hover:text-white px-3 py-1.5 transition-colors cursor-pointer border border-transparent hover:border-[#E31E24]"
                            >
                              {language === 'ta' ? 'பதிவிறக்கு' : 'Download'}
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ========================================================== */}
            {/* 4. MOBILE PHONES (STACKED BLOCKS)                          */}
            {/* Title first, then category, language, size on one line,    */}
            {/* then actions each at least 44 px tall.                     */}
            {/* ========================================================== */}
            <div className="block md:hidden space-y-4">
              {sortedResources.map((item, idx) => {
                const yearVal = item.year || (item.date ? item.date.slice(0, 4) : '');
                const sizeVal = item.fileSize || '';
                const langVal = item.language || '';
                const titleStr = item.title[language] || item.title.en;

                return (
                  <div
                    key={item.id}
                    className="border-2 border-[#111111] bg-white p-5 space-y-3 relative group"
                    style={{
                      animation: `fade-rise 0.4s ease-out ${idx * 40}ms forwards`,
                    }}
                  >
                    {/* 4 px red bar on hover */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[4px] bg-[#E31E24] transition-all duration-200"
                      aria-hidden="true"
                    />

                    {/* Title first */}
                    <div>
                      <h2 className="font-helvetica font-extrabold text-[20px] text-[#111111] leading-[1.14]">
                        {highlightMatch(titleStr, searchQuery)}
                      </h2>
                      {item.citation && (
                        <p className="text-[15px] text-[#5B5348] font-catamaran mt-1">
                          {item.citation}
                        </p>
                      )}
                    </div>

                    {/* Category, language, and size on one line */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[#5B5348] pt-2 border-t border-[#d7d0c3]">
                      <span className="font-bold text-[#C41A1F] uppercase">
                        [{item.category}]
                      </span>
                      {langVal && <span>· {langVal}</span>}
                      {sizeVal && <span>· {sizeVal}</span>}
                      {yearVal && <span>· {yearVal}</span>}
                    </div>

                    {/* Two actions, each at least 44 px tall */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#d7d0c3]">
                      <button
                        type="button"
                        onClick={(e) => handleOpenPreview(item, e.currentTarget)}
                        className="min-h-[44px] h-[44px] w-full px-4 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] font-helvetica font-extrabold text-[15px] uppercase flex items-center justify-center cursor-pointer transition-colors"
                      >
                        {language === 'ta' ? 'பார்வை' : 'Preview'}
                      </button>
                      <a
                        href={item.downloadUrl || '#'}
                        download
                        className="min-h-[44px] h-[44px] w-full px-4 border-2 border-[#111111] bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[15px] uppercase flex items-center justify-center cursor-pointer transition-colors"
                      >
                        {language === 'ta' ? 'பதிவிறக்கு' : 'Download'}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* ========================================================== */}
      {/* 5. PREVIEW PANEL (SLIDES FROM RIGHT: 45% DESKTOP, FULL MOBILE)*/}
      {/* 0.4s transition, PDF viewer, document title, short significance */}
      {/* line from data, red Download button, ink Close button.       */}
      {/* Escape key and click on table close it, focus returns to row. */}
      {/* Table stays visible and preserves scroll.                    */}
      {/* ========================================================== */}
      {previewResource && (
        <>
          {/* Backdrop overlay that closes preview on click */}
          <div
            onClick={handleClosePreview}
            className="fixed inset-0 bg-[#111111]/50 z-40"
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={previewResource.title[language] || previewResource.title.en}
            className="fixed right-0 top-0 bottom-0 w-full lg:w-[45%] bg-[#FAF8F5] text-[#111111] border-l-2 border-[#111111] z-50 p-6 md:p-8 overflow-y-auto space-y-6 transition-transform duration-400 ease-out"
          >
            {/* Header Strip with Title and Ink Close Button */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#111111]">
              <div className="space-y-1">
                <span className="text-[15px] font-extrabold uppercase text-[#C41A1F] block tracking-normal">
                  [{previewResource.category}] · OFFICIAL ARCHIVE
                </span>
                <h2 className="font-helvetica font-extrabold text-[26px] text-[#111111] leading-[1.12]">
                  {previewResource.title[language] || previewResource.title.en}
                </h2>
              </div>
              
              {/* Ink Close Button */}
              <button
                type="button"
                onClick={handleClosePreview}
                className="min-h-[44px] h-[44px] px-5 bg-[#111111] hover:bg-[#333333] text-white font-helvetica font-extrabold text-[15px] uppercase cursor-pointer shrink-0 transition-colors"
              >
                {language === 'ta' ? 'மூடுக [✕]' : 'Close [✕]'}
              </button>
            </div>

            {/* Short significance line from the data */}
            <div className="p-4 bg-[#f1ece2] border-l-4 border-[#E31E24] space-y-1">
              <span className="text-[15px] font-bold text-[#5B5348] uppercase tracking-normal block">
                {language === 'ta' ? 'அரசமைப்பு முக்கியத்துவம்:' : 'Constitutional Significance:'}
              </span>
              <p className="text-[17px] text-[#111111] font-semibold leading-[1.6]">
                {previewResource.significance?.[language] ||
                  previewResource.summary[language] ||
                  previewResource.summary.en}
              </p>
            </div>

            {/* PDF Viewer Sheet */}
            <div className="bg-white border-2 border-[#111111] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d7d0c3] text-[15px] text-[#5B5348]">
                <span className="font-bold uppercase tracking-normal">
                  {language === 'ta' ? 'சட்டக் கோப்பு உரை வடிவம்' : 'Official PDF Document Docket'}
                </span>
                <span className="font-helvetica font-extrabold text-[#111111]">
                  {previewResource.fileSize || 'PDF FORMAT'}
                </span>
              </div>

              {/* Embedded Document Preview Body */}
              <div className="h-[280px] sm:h-[340px] border border-[#d7d0c3] bg-[#FAF8F5] p-5 overflow-y-auto space-y-3 font-catamaran text-[15px] leading-relaxed text-[#333333]">
                <div className="text-center pb-3 border-b border-[#d7d0c3] space-y-1">
                  <span className="text-[15px] font-extrabold uppercase text-[#C41A1F] block">
                    LEGAL WING HEADQUARTERS · CHENNAI
                  </span>
                  <p className="font-helvetica font-extrabold text-[17px] text-[#111111] leading-snug">
                    {previewResource.title[language] || previewResource.title.en}
                  </p>
                  {previewResource.citation && (
                    <p className="text-[15px] text-[#5B5348] font-mono">
                      {previewResource.citation}
                    </p>
                  )}
                </div>

                <p className="text-[17px] leading-[1.65]">
                  {previewResource.summary[language] || previewResource.summary.en}
                </p>

                {previewResource.court && (
                  <p className="text-[15px] text-[#111111] font-bold pt-2">
                    <span className="text-[#5B5348]">Court / Bench:</span> {previewResource.court}
                  </p>
                )}

                {previewResource.keyHighlights && previewResource.keyHighlights[language]?.length > 0 && (
                  <div className="pt-2 border-t border-[#d7d0c3] space-y-1">
                    <strong className="text-[15px] uppercase text-[#C41A1F] block">
                      Key Legal Submissions:
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-[15px]">
                      {previewResource.keyHighlights[language].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Red Download Button */}
              <div className="pt-4 border-t border-[#d7d0c3]">
                <a
                  href={previewResource.downloadUrl || '#'}
                  download
                  className="w-full min-h-[48px] h-[48px] bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'ஆவணத்தைப் பதிவிறக்குக (PDF)' : 'Download Full Document (PDF)'}
                </a>
              </div>
            </div>
          </aside>
        </>
      )}

    </div>
  );
}
