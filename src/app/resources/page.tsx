'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LegalResource } from '@/types';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';

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
  { id: 'Statutory Reform', en: 'Statutory Reform', ta: 'சட்ட சீர்திருத்தம்' }
];

export default function ResourcesPage() {
  const { language } = useLanguage();
  const { resources: contextResources } = useData();

  const [resources, setResources] = useState<ExtendedLegalResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewResource, setPreviewResource] = useState<ExtendedLegalResource | null>(null);

  const mainSection = useReveal();

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
        console.warn('Direct fetch failed, falling back to context:', err);
      }
      if (isMounted) {
        setResources(contextResources as ExtendedLegalResource[]);
      }
    }

    loadResources();
    return () => {
      isMounted = false;
    };
  }, [contextResources]);

  // Close preview on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewResource) {
        setPreviewResource(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewResource]);

  // Extract all categories from data to supplement the base categories
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
              : r.category
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

  const filteredResources = useMemo(() => {
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

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[18px] leading-[1.75] pb-24">
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'சட்ட ஆவண கல்விற்கூடம்' : 'Legal document vault'}
        description={
          language === 'ta'
            ? 'அரசமைப்பு அறிக்கைகள், வரலாற்றுச் சிறப்புமிக்க நீதிமன்றத் தீர்ப்புகள் மற்றும் சட்டக் கையேடுகளின் அதிகாரப்பூர்வ ஆவணக் காப்பகம்.'
            : 'Authoritative constitutional archives, landmark judicial precedents, statutory reports and party legal briefs.'
        }
      />

      <div className="max-w-[1400px] mx-auto px-[clamp(20px,4vw,56px)] pt-10 space-y-8">
        <section
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''} space-y-6`}
        >
          {/* 1. Search Box & Category Tabs Toolbar */}
          <div className="space-y-4">
            {/* Search Box: 2 px ink border, inline-SVG magnifier */}
            <div className="relative border-2 border-[#111111] bg-white flex items-center px-4 min-h-[48px]">
              <svg
                className="w-5 h-5 text-[#5B5348] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'ஆவணத்தின் தலைப்பு, வழக்கு எண் அல்லது குறிப்புரை தேடுக...'
                    : 'Search catalogue by title, citation, year or topic...'
                }
                className="w-full bg-transparent border-none outline-none text-[16px] text-[#111111] font-catamaran pl-3 pr-2 placeholder-[#5B5348]"
                aria-label={language === 'ta' ? 'ஆவணங்களைத் தேடுக' : 'Search documents'}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[13px] font-extrabold text-[#C41A1F] hover:underline cursor-pointer px-2"
                >
                  {language === 'ta' ? 'அழிக்க' : 'Clear'}
                </button>
              )}
            </div>

            {/* Category tabs: plain text buttons with a red underline for the active one */}
            <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto border-b border-[#d7d0c3] pb-1 scrollbar-none">
              {categories.map((c) => {
                const isActive = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={`min-h-[44px] px-3 py-2 text-[15px] font-extrabold whitespace-nowrap cursor-pointer transition-colors border-b-[3px] -mb-[1px] ${
                      isActive
                        ? 'border-[#E31E24] text-[#C41A1F]'
                        : 'border-transparent text-[#111111] hover:text-[#C41A1F]'
                    }`}
                  >
                    {language === 'ta' ? c.ta : c.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catalogue count bar */}
          <div className="flex items-center justify-between text-[14px] text-[#5B5348] border-b border-[#d7d0c3] pb-2">
            <span>
              {language === 'ta' ? 'மொத்தப் பதிவுகள்: ' : 'Catalogue entries: '}
              <strong className="text-[#111111] font-helvetica font-extrabold">
                {filteredResources.length}
              </strong>
            </span>
            {activeCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="text-[#C41A1F] hover:underline font-extrabold text-xs cursor-pointer"
              >
                {language === 'ta' ? 'அனைத்தையும் காட்டுக' : 'Reset category'}
              </button>
            )}
          </div>

          {/* Main Content Layout: Table on left, PDF viewer panel on right when active */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Table Area (Wide Screens: table stays visible even when preview is open) */}
            <div
              className={`w-full transition-all duration-300 ${
                previewResource ? 'lg:w-[55%]' : 'lg:w-full'
              }`}
            >
              {filteredResources.length === 0 ? (
                <div className="py-12 text-center text-[#5B5348] text-[17px]">
                  {language === 'ta'
                    ? 'தேடலுக்குரிய சட்ட ஆவணங்கள் எதுவும் கிடைக்கவில்லை.'
                    : 'No documents match your query in this catalogue.'}
                </div>
              ) : (
                <>
                  {/* Desktop / Tablet Table View */}
                  <div className="hidden md:block overflow-x-auto border-2 border-[#111111] bg-white">
                    <table className="w-full text-left border-collapse">
                      {/* Header row: ink background, parchment text, 800 weight, 15 px */}
                      <thead>
                        <tr className="bg-[#111111] text-[#FAF8F5] font-extrabold text-[15px] border-b-2 border-[#111111]">
                          <th className="py-3 px-4 font-extrabold">{language === 'ta' ? 'தலைப்பு' : 'Title'}</th>
                          <th className="py-3 px-4 font-extrabold whitespace-nowrap">{language === 'ta' ? 'பிரிவு' : 'Category'}</th>
                          <th className="py-3 px-4 font-extrabold whitespace-nowrap">{language === 'ta' ? 'ஆண்டு' : 'Year'}</th>
                          <th className="py-3 px-4 font-extrabold whitespace-nowrap">{language === 'ta' ? 'மொழி' : 'Language'}</th>
                          <th className="py-3 px-4 font-extrabold whitespace-nowrap">{language === 'ta' ? 'அளவு' : 'Size'}</th>
                          <th className="py-3 px-4 font-extrabold whitespace-nowrap">{language === 'ta' ? 'புதுப்பிக்கப்பட்டது' : 'Updated'}</th>
                          <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">{language === 'ta' ? 'செயல்கள்' : 'Actions'}</th>
                        </tr>
                      </thead>
                      {/* Rows: 18 px text, 1 px #d7d0c3 lines, 64 px tall, hover #f1ece2 */}
                      <tbody>
                        {filteredResources.map((item) => {
                          const isSelected = previewResource?.id === item.id;
                          const yearValue = item.year || (item.date ? item.date.slice(0, 4) : '');
                          const updatedValue = item.lastUpdated || item.date || '';
                          const sizeValue = item.fileSize || '';
                          const languageValue = item.language || '';

                          return (
                            <tr
                              key={item.id}
                              className={`text-[18px] border-b border-[#d7d0c3] min-h-[64px] h-[64px] transition-colors ${
                                isSelected ? 'bg-[#f1ece2]' : 'hover:bg-[#f1ece2]'
                              }`}
                            >
                              {/* Title: Helvetica Now Display 800 */}
                              <td className="py-3 px-4 align-middle">
                                <div
                                  className={
                                    language === 'ta'
                                      ? 'font-kavivanar text-[18px] text-[#111111]'
                                      : 'font-helvetica font-extrabold text-[17px] text-[#111111]'
                                  }
                                >
                                  {item.title[language] || item.title.en}
                                </div>
                                {item.citation && (
                                  <div className="text-[13px] text-[#5B5348] font-catamaran mt-0.5">
                                    {item.citation}
                                  </div>
                                )}
                              </td>

                              {/* Category */}
                              <td className="py-3 px-4 align-middle text-[15px] font-semibold text-[#5B5348] whitespace-nowrap">
                                {item.category || ''}
                              </td>

                              {/* Year: Leave cell empty when no value */}
                              <td className="py-3 px-4 align-middle font-helvetica font-extrabold text-[16px] text-[#111111] whitespace-nowrap">
                                {yearValue}
                              </td>

                              {/* Language: Leave cell empty when no value */}
                              <td className="py-3 px-4 align-middle text-[15px] text-[#5B5348] whitespace-nowrap">
                                {languageValue}
                              </td>

                              {/* Size: Leave cell empty when no value */}
                              <td className="py-3 px-4 align-middle font-helvetica text-[15px] text-[#5B5348] whitespace-nowrap">
                                {sizeValue}
                              </td>

                              {/* Updated: Leave cell empty when no value */}
                              <td className="py-3 px-4 align-middle font-helvetica text-[15px] text-[#5B5348] whitespace-nowrap">
                                {updatedValue}
                              </td>

                              {/* Actions: Two text links, "Preview" and "Download" (red button on hover) */}
                              <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewResource(item)}
                                    className="text-[15px] font-extrabold text-[#111111] underline hover:no-underline hover:bg-[#E31E24] hover:text-white px-3 py-1.5 cursor-pointer transition-colors"
                                  >
                                    {language === 'ta' ? 'பார்வை' : 'Preview'}
                                  </button>
                                  <a
                                    href={item.downloadUrl || '#'}
                                    download
                                    className="text-[15px] font-extrabold text-[#111111] underline hover:no-underline hover:bg-[#E31E24] hover:text-white px-3 py-1.5 cursor-pointer transition-colors"
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

                  {/* 4. Mobile Phones: Stacked Block View with title first and two actions at bottom >= 44 px */}
                  <div className="block md:hidden space-y-4">
                    {filteredResources.map((item) => {
                      const isSelected = previewResource?.id === item.id;
                      const yearValue = item.year || (item.date ? item.date.slice(0, 4) : '');
                      const updatedValue = item.lastUpdated || item.date || '';
                      const sizeValue = item.fileSize || '';
                      const languageValue = item.language || '';

                      return (
                        <div
                          key={item.id}
                          className={`border-2 border-[#111111] bg-white p-5 space-y-3 transition-colors ${
                            isSelected ? 'bg-[#f1ece2]' : 'hover:bg-[#f1ece2]'
                          }`}
                        >
                          <div>
                            <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                              [{item.category}]
                            </span>
                            <h3
                              className={`${
                                language === 'ta' ? 'font-kavivanar' : 'font-helvetica'
                              } font-extrabold text-[20px] text-[#111111] leading-tight`}
                            >
                              {item.title[language] || item.title.en}
                            </h3>
                            {item.citation && (
                              <p className="text-[13px] text-[#5B5348] font-catamaran mt-1">
                                {item.citation}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[#5B5348] pt-2 border-t border-[#d7d0c3]">
                            {yearValue && (
                              <span>
                                {language === 'ta' ? 'ஆண்டு: ' : 'Year: '}
                                <strong className="text-[#111111] font-helvetica">{yearValue}</strong>
                              </span>
                            )}
                            {languageValue && (
                              <span>
                                {language === 'ta' ? 'மொழி: ' : 'Language: '}
                                <strong className="text-[#111111]">{languageValue}</strong>
                              </span>
                            )}
                            {sizeValue && (
                              <span>
                                {language === 'ta' ? 'அளவு: ' : 'Size: '}
                                <strong className="text-[#111111] font-helvetica">{sizeValue}</strong>
                              </span>
                            )}
                            {updatedValue && (
                              <span>
                                {language === 'ta' ? 'புதுப்பிக்கப்பட்டது: ' : 'Updated: '}
                                <strong className="text-[#111111] font-helvetica">{updatedValue}</strong>
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#d7d0c3]">
                            <button
                              type="button"
                              onClick={() => setPreviewResource(item)}
                              className="min-h-[44px] w-full px-4 py-2 border-2 border-[#111111] bg-white hover:bg-[#E31E24] hover:text-white hover:border-[#E31E24] text-[#111111] font-extrabold text-[14px] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              {language === 'ta' ? 'பார்வை' : 'Preview'}
                            </button>
                            <a
                              href={item.downloadUrl || '#'}
                              download
                              className="min-h-[44px] w-full px-4 py-2 border-2 border-[#111111] bg-white hover:bg-[#E31E24] hover:text-white hover:border-[#E31E24] text-[#111111] font-extrabold text-[14px] flex items-center justify-center cursor-pointer transition-colors"
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

            {/* 3. PDF Viewer Panel on Right (about 45% width on wide screens, full screen on phones) */}
            {previewResource && (
              <>
                {/* Desktop/Tablet Panel (45% width, sticky) */}
                <aside
                  aria-label={language === 'ta' ? 'ஆவணக் காட்சி' : 'Document Preview'}
                  className="hidden lg:block lg:w-[45%] sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto bg-[#FAF8F5] border-2 border-[#111111] p-6 space-y-6 shrink-0 shadow-lg"
                >
                  {/* Signature DMK Flag Bar: Top Black, Bottom Red */}
                  <div className="h-[6px] dmk-flag-strip -mt-6 -mx-6 mb-4" />

                  {/* Header: Document Title & Close Button */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#111111]">
                    <div className="space-y-1">
                      <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
                        [{previewResource.category}]
                      </span>
                      <h2
                        className={`${
                          language === 'ta' ? 'font-kavivanar' : 'font-helvetica'
                        } font-extrabold text-[24px] text-[#111111] leading-tight`}
                      >
                        {previewResource.title[language] || previewResource.title.en}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewResource(null)}
                      className="min-h-[44px] px-4 py-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] font-extrabold text-[14px] cursor-pointer shrink-0 transition-colors"
                    >
                      {language === 'ta' ? 'மூடுக' : 'Close'}
                    </button>
                  </div>

                  {/* PDF Viewer Sheet */}
                  <div className="bg-white border-2 border-[#111111] p-6 space-y-4 shadow-none">
                    <div className="flex items-center justify-between pb-3 border-b border-[#d7d0c3] text-[13px] text-[#5B5348]">
                      <span>{language === 'ta' ? 'அதிகாரப்பூர்வ ஆவணக் குறிப்பு' : 'Official Legal Docket'}</span>
                      <span className="font-helvetica font-extrabold text-[#111111]">
                        {previewResource.fileSize || 'PDF'}
                      </span>
                    </div>

                    <p className="text-[17px] text-[#111111] leading-relaxed">
                      {previewResource.summary[language] || previewResource.summary.en}
                    </p>

                    {previewResource.court && (
                      <div className="p-3 bg-[#f1ece2] border-l-4 border-[#111111] text-[14px] text-[#111111]">
                        <strong className="block text-xs text-[#5B5348]">
                          {language === 'ta' ? 'நீதிமன்றம்:' : 'Court / Tribunal:'}
                        </strong>
                        <span className="font-bold">{previewResource.court}</span>
                      </div>
                    )}

                    {previewResource.citation && (
                      <div className="p-3 bg-[#f1ece2] border-l-4 border-[#E31E24] text-[14px] text-[#111111]">
                        <strong className="block text-xs text-[#5B5348]">
                          {language === 'ta' ? 'வழக்கு குறிப்புரை:' : 'Official Citation:'}
                        </strong>
                        <span className="font-bold">{previewResource.citation}</span>
                      </div>
                    )}

                    {previewResource.keyHighlights &&
                      previewResource.keyHighlights[language]?.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-[#d7d0c3]">
                          <strong className="text-[13px] uppercase tracking-normal text-[#C41A1F] block">
                            {language === 'ta' ? 'முக்கிய சட்ட வாதங்கள்:' : 'Ratio & Key Submissions:'}
                          </strong>
                          <ul className="space-y-1.5 text-[15px] list-disc list-inside text-[#333333]">
                            {previewResource.keyHighlights[language].map((pt, i) => (
                              <li key={i} className="leading-snug">{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Download button */}
                    <div className="pt-4 border-t border-[#d7d0c3]">
                      <a
                        href={previewResource.downloadUrl || '#'}
                        download
                        className="w-full min-h-[48px] h-[48px] bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center transition-colors cursor-pointer"
                      >
                        {language === 'ta' ? 'முழு ஆவணத்தைப் பதிவிறக்குக (PDF)' : 'Download Full Document (PDF)'}
                      </a>
                    </div>
                  </div>
                </aside>

                {/* Mobile Fullscreen Panel */}
                <div
                  role="dialog"
                  aria-modal="true"
                  className="lg:hidden fixed inset-0 z-50 bg-[#FAF8F5] p-6 overflow-y-auto space-y-6"
                >
                  {/* Signature DMK Flag Bar: Top Black, Bottom Red */}
                  <div className="h-[6px] dmk-flag-strip -mt-6 -mx-6 mb-4" />

                  <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#111111]">
                    <div className="space-y-1">
                      <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
                        [{previewResource.category}]
                      </span>
                      <h2
                        className={`${
                          language === 'ta' ? 'font-kavivanar' : 'font-helvetica'
                        } font-extrabold text-[22px] text-[#111111] leading-tight`}
                      >
                        {previewResource.title[language] || previewResource.title.en}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewResource(null)}
                      className="min-h-[44px] px-4 py-2 border-2 border-[#111111] bg-white text-[#111111] font-extrabold text-[14px] cursor-pointer"
                    >
                      {language === 'ta' ? 'மூடுக' : 'Close'}
                    </button>
                  </div>

                  <p className="text-[16px] text-[#111111] leading-relaxed">
                    {previewResource.summary[language] || previewResource.summary.en}
                  </p>

                  {previewResource.citation && (
                    <div className="p-3 bg-[#f1ece2] border-l-4 border-[#E31E24] text-[14px] text-[#111111]">
                      <span className="font-bold">{previewResource.citation}</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <a
                      href={previewResource.downloadUrl || '#'}
                      download
                      className="w-full min-h-[48px] h-[48px] bg-[#E31E24] hover:bg-[#C41A1F] text-white font-helvetica font-extrabold text-[15px] uppercase tracking-normal flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {language === 'ta' ? 'பதிவிறக்குக (PDF)' : 'Download (PDF)'}
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
