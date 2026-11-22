'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LegalResource } from '@/types';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { 
  IconSearch, 
  IconClose, 
  IconCheck, 
  IconScale, 
  IconShield 
} from '@/components/Icons';

interface ExtendedLegalResource extends LegalResource {
  year?: string;
  lastUpdated?: string;
  language?: string;
  significance?: { en: string; ta: string };
  fileFormat?: string;
}

export default function ResourcesPage() {
  const { language } = useLanguage();
  const { resources: contextResources } = useData();

  const [resources, setResources] = useState<ExtendedLegalResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewResource, setPreviewResource] = useState<ExtendedLegalResource | null>(null);

  const mainSection = useReveal();

  const categories = [
    { id: 'All', en: 'All Categories', ta: 'அனைத்து பிரிவுகள்' },
    { id: 'Supreme Court', en: 'Supreme Court', ta: 'உச்ச நீதிமன்றம்' },
    { id: 'High Court', en: 'High Court', ta: 'உயர் நீதிமன்றம்' },
    { id: 'Constitution', en: 'Constitution', ta: 'அரசமைப்பு' },
    { id: 'Statute', en: 'Statute', ta: 'சட்டம்' },
    { id: 'Legal Aid', en: 'Legal Aid', ta: 'சட்ட உதவி' }
  ];

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

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((item) => {
      const matchesCat = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        !q ||
        item.title.en.toLowerCase().includes(q) ||
        item.title.ta.toLowerCase().includes(q) ||
        item.summary.en.toLowerCase().includes(q) ||
        item.summary.ta.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.court && item.court.toLowerCase().includes(q)) ||
        (item.citation && item.citation.toLowerCase().includes(q)) ||
        (item.year && item.year.includes(q));

      return matchesCat && matchesSearch;
    });
  }, [resources, activeCategory, searchQuery]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'சட்ட ஆவணக் களஞ்சியம்' : 'Constitutional & Legal Archive'}
        description={
          language === 'ta'
            ? 'வரலாற்றுச் சிறப்புமிக்க உச்ச நீதிமன்ற, உயர் நீதிமன்றத் தீர்ப்புகள், சட்டமன்ற ஆவணங்கள் மற்றும் அரசமைப்பு அறிக்கைகள்.'
            : 'Landmark Supreme Court & High Court judgments, state autonomy reports, and constitutional archives.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-12">
        
        <section 
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''}`}
        >
          {/* Search & Filter Toolbar */}
          <div className="bg-[#f1ece2] border-2 border-[#111111] p-6 space-y-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              {/* Search */}
              <div className="md:col-span-6 space-y-1.5">
                <label htmlFor="resourceSearch" className="font-semibold text-[15px] text-[#111111]">
                  {language === 'ta' ? 'ஆவணங்கள் & தீர்ப்புகளைத் தேடுக' : 'Search Documents & Judgments'}
                </label>
                <div className="relative">
                  <IconSearch className="w-4 h-4 text-[#5B5348] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="resourceSearch"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ta' ? 'வழக்கு பெயர், எண் அல்லது ஆண்டு...' : 'Case name, citation or topic...'}
                    className="w-full min-h-[44px] bg-white border-2 border-[#111111] pl-10 pr-4 text-[15px] text-[#111111]"
                  />
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="md:col-span-6 flex items-center gap-2 flex-wrap">
                {categories.map((c) => {
                  const isSelected = activeCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCategory(c.id)}
                      className={`min-h-[44px] px-3.5 py-2 text-[13px] font-extrabold cursor-pointer border-2 border-[#111111] transition-colors ${
                        isSelected
                          ? 'bg-[#E31E24] text-white border-[#E31E24]'
                          : 'bg-white text-[#111111] hover:bg-[#111111] hover:text-white'
                      }`}
                    >
                      {language === 'ta' ? c.ta : c.en}
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="flex items-center justify-between text-[14px] text-[#5B5348] border-t border-[#3d3633] pt-3">
              <span>
                {language === 'ta' ? 'மொத்த ஆவணங்கள்: ' : 'Archive count: '}
                <strong className="text-[#111111] font-helvetica">{filteredResources.length}</strong>
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#C41A1F] hover:underline font-bold cursor-pointer"
                >
                  {language === 'ta' ? 'தேடலை அழிக்க' : 'Clear search'}
                </button>
              )}
            </div>
          </div>

          {/* Ruled Document Rows */}
          {filteredResources.length === 0 ? (
            <div className="bg-white border-2 border-[#111111] p-12 text-center">
              <p className="text-[17px] text-[#5B5348]">
                {language === 'ta'
                  ? 'தேடலுக்குரிய ஆவணங்கள் எதுவும் கிடைக்கவில்லை.'
                  : 'No legal documents or precedents match your query.'}
              </p>
            </div>
          ) : (
            <div className="divide-y-2 divide-[#111111] border-2 border-[#111111] bg-white">
              {filteredResources.map((item) => (
                <div
                  key={item.id}
                  className="p-6 sm:p-8 hover:bg-[#f1ece2] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[13px]">
                      <span className="font-extrabold uppercase text-[#C41A1F]">
                        [{item.category}]
                      </span>
                      <span>•</span>
                      <span className="font-helvetica font-bold text-[#111111]">
                        {item.court || 'Constitutional Bench'}
                      </span>
                      {item.citation && (
                        <>
                          <span>•</span>
                          <span className="text-[#5B5348]">{item.citation}</span>
                        </>
                      )}
                    </div>

                    <h2 className="font-helvetica font-extrabold text-[22px] sm:text-[26px] text-[#111111] leading-snug">
                      {item.title[language]}
                    </h2>

                    <p className="text-[16px] text-[#3a322d] max-w-4xl leading-relaxed">
                      {item.summary[language]}
                    </p>

                    {item.significance && (
                      <div className="p-3 bg-white border-l-4 border-[#E31E24] border border-[#d7d0c3] text-[14px] text-[#111111] italic">
                        <strong>{language === 'ta' ? 'முக்கியத்துவம்: ' : 'Precedent Value: '}</strong>
                        {item.significance[language]}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 self-start md:self-center">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(item)}
                      className="min-h-[44px] px-5 py-2 bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[13px] transition-colors cursor-pointer btn-lift"
                    >
                      {language === 'ta' ? 'முழு விவரம்' : 'View Docket'}
                    </button>

                    <a
                      href={item.downloadUrl || '#'}
                      className="min-h-[44px] px-5 py-2 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[13px] flex items-center justify-center gap-2 cursor-pointer btn-lift"
                    >
                      <span>{language === 'ta' ? 'பதிவிறக்கு' : 'Download'}</span>
                      <span className="text-xs font-mono">({item.fileFormat || 'PDF'})</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </div>

      {/* Resource Docket Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#111111] max-w-2xl w-full border-4 border-[#111111] p-8 space-y-6">
            
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  [{previewResource.category}]
                </span>
                <h3 className="font-helvetica font-extrabold text-[26px] text-[#111111] leading-tight">
                  {previewResource.title[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="p-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[17px] text-[#3a322d] leading-relaxed">
              {previewResource.summary[language]}
            </p>

            <div className="p-4 bg-white border-2 border-[#111111] space-y-2 text-[14px]">
              <div>
                <strong className="text-[#5B5348] block text-xs">{language === 'ta' ? 'நீதிமன்றம்:' : 'Court / Tribunal:'}</strong>
                <span className="font-bold">{previewResource.court || 'Supreme Court of India'}</span>
              </div>
              {previewResource.citation && (
                <div>
                  <strong className="text-[#5B5348] block text-xs">{language === 'ta' ? 'வழக்கு குறிப்புரை:' : 'Official Citation:'}</strong>
                  <span>{previewResource.citation}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <a
                href={previewResource.downloadUrl || '#'}
                className="min-h-[44px] px-6 py-2 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] flex items-center justify-center cursor-pointer btn-lift"
              >
                {language === 'ta' ? 'ஆவணத்தைப் பதிவிறக்கு' : 'Download Document'}
              </a>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="min-h-[44px] px-6 py-2 bg-[#111111] hover:bg-black text-white font-extrabold text-[14px] cursor-pointer"
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
