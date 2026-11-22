'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LegalResource } from '@/types';
import { 
  Download, 
  Search, 
  Eye, 
  CheckCircle2, 
  FileText, 
  X, 
  Building2, 
  Scale, 
  BookOpen, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ExtendedLegalResource extends LegalResource {
  year?: string;
  lastUpdated?: string;
  language?: string;
}

export default function ResourcesPage() {
  const { language } = useLanguage();
  const { resources: contextResources } = useData();

  const [resources, setResources] = useState<ExtendedLegalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLangFilter, setActiveLangFilter] = useState<string>('All');
  const [previewResource, setPreviewResource] = useState<ExtendedLegalResource | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Categories for the filter tabs
  const categories = [
    { id: 'All', en: 'All Categories', ta: 'அனைத்து பிரிவுகள்' },
    { id: 'Supreme Court', en: 'Supreme Court', ta: 'உச்ச நீதிமன்றம்' },
    { id: 'High Court', en: 'High Court', ta: 'உயர் நீதிமன்றம்' },
    { id: 'Constitution', en: 'Constitution', ta: 'அரசமைப்பு' },
    { id: 'Statute', en: 'Statute', ta: 'சட்டம்' },
    { id: 'Legal Aid', en: 'Legal Aid', ta: 'சட்ட உதவி' }
  ];

  // Language filter tabs
  const languageFilters = [
    { id: 'All', en: 'All Languages', ta: 'அனைத்து மொழிகள்' },
    { id: 'Bilingual', en: 'Bilingual', ta: 'இருமொழி' },
    { id: 'Tamil', en: 'Tamil', ta: 'தமிழ்' },
    { id: 'English', en: 'English', ta: 'ஆங்கிலம்' }
  ];

  // Fetch directly from /api/resources to read all live fields
  useEffect(() => {
    let isMounted = true;
    async function loadResources() {
      try {
        const res = await fetch('/api/resources');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.resources) && isMounted) {
            setResources(data.resources);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Direct /api/resources fetch failed, using fallback:', err);
      }
      if (isMounted) {
        setResources(contextResources as ExtendedLegalResource[]);
        setLoading(false);
      }
    }

    loadResources();
    return () => {
      isMounted = false;
    };
  }, [contextResources]);

  // Determine item's language display
  const getItemLanguage = (item: ExtendedLegalResource): string => {
    if (item.language) return item.language;
    // In our repository, resources provide both Tamil and English summaries and titles
    if (item.title?.en && item.title?.ta) {
      return language === 'ta' ? 'இருமொழி (தமிழ் / ஆங்கிலம்)' : 'Bilingual (Tamil / English)';
    }
    return language === 'ta' ? 'தமிழ்' : 'Tamil';
  };

  // Determine if item matches language filter
  const matchesLanguageFilter = (item: ExtendedLegalResource, filter: string): boolean => {
    if (filter === 'All') return true;
    const itemLangStr = (item.language || 'Bilingual').toLowerCase();
    if (filter === 'Bilingual') {
      return itemLangStr.includes('bilingual') || (Boolean(item.title?.en) && Boolean(item.title?.ta));
    }
    if (filter === 'Tamil') {
      return itemLangStr.includes('tamil') || Boolean(item.title?.ta);
    }
    if (filter === 'English') {
      return itemLangStr.includes('english') || Boolean(item.title?.en);
    }
    return true;
  };

  // Filtered catalogue list
  const filteredResources = resources.filter((r) => {
    const matchesCat = activeCategory === 'All' || r.category === activeCategory;
    const matchesLang = matchesLanguageFilter(r, activeLangFilter);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title[language]?.toLowerCase().includes(q) ||
      r.title.en?.toLowerCase().includes(q) ||
      r.title.ta?.toLowerCase().includes(q) ||
      r.summary[language]?.toLowerCase().includes(q) ||
      (r.court && r.court.toLowerCase().includes(q)) ||
      (r.citation && r.citation.toLowerCase().includes(q)) ||
      r.category.toLowerCase().includes(q);

    return matchesCat && matchesLang && matchesSearch;
  });

  const handleDownload = (res: ExtendedLegalResource) => {
    setDownloadToast(res.title[language] || res.title.en);
    setTimeout(() => {
      setDownloadToast(null);
    }, 4500);

    // Trigger download if real url
    if (res.downloadUrl && res.downloadUrl !== '#') {
      window.open(res.downloadUrl, '_blank');
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] py-8 sm:py-12 text-[#111111] font-dmk-body">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#5B5348]">
          <Link href="/" className="hover:text-[#111111] underline">
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold">
            {language === 'ta' ? 'சட்ட ஆவணக் களஞ்சியம்' : 'Legal Library Catalogue'}
          </span>
        </div>

        {/* Masthead / Catalogue Header */}
        <div className="border-b-2 border-[#111111] pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block" />
                <span className="text-xs font-dmk-body text-[#C41A1F] font-bold uppercase tracking-wider">
                  {language === 'ta' ? 'அரசமைப்பு & சட்ட நூலகப் பதிவேடு' : 'Constitutional & Legal Library Register'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] font-dmk-headline">
                {language === 'ta'
                  ? 'சட்ட ஆவணக் களஞ்சியம் & தீர்ப்புகள் பட்டியல்'
                  : 'DMK Legal Wing Library Catalogue'}
              </h1>
            </div>
            
            <div className="text-xs text-[#5B5348] font-mono">
              <span className="font-bold text-[#111111] block">
                {language === 'ta' ? 'பதிவு செய்யப்பட்ட ஆவணங்கள்:' : 'Catalogue Volumes:'} {resources.length}
              </span>
              <span>{language === 'ta' ? 'தலைமைச் செயலகப் பதிவேடு' : 'State Secretariat Curated Archives'}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-3 max-w-4xl leading-relaxed">
            {language === 'ta'
              ? '69% இடஒதுக்கீடு அரசமைப்பு ஆவணங்கள், ராஜமன்னார் குழுவின் மாநில சுயாட்சி அறிக்கை, ஆளுநர் அதிகார வரம்புத் தீர்ப்புகள் மற்றும் மக்கள் சட்டப் பாதுகாப்பு வழிகாட்டிகள் அடங்கிய உத்தியோகபூர்வ ஆவணப் பதிவேடு.'
              : 'Primary legal authorities, constitutional bench briefings, landmark Supreme Court judgments, and statutory compendiums curated for advocate practice and citizen rights research.'}
          </p>
        </div>

        {/* Filter Strip & Search Section */}
        <div className="bg-white border-2 border-[#111111] p-5 sm:p-6 rounded-[2px] shadow-xs space-y-5">
          
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#5B5348] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'ஆவணத்தின் தலைப்பு, நீதிமன்றம், சட்டப் பிரிவு அல்லது வழக்கு எண் தேடுக...'
                  : 'Search by title, court, statute, or citation number...'
              }
              className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm text-[#111111] rounded-[2px] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B5348] hover:text-[#111111] p-1.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter 1: Category Tabs (Square tabs with 3px red underline on active tab) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                {language === 'ta' ? 'பிரிவு வாரியாக வகைப்படுத்துக:' : 'Filter by Category:'}
              </span>
              <span className="text-[11px] text-[#5B5348] font-mono">
                {activeCategory}
              </span>
            </div>
            
            <div className="flex items-center gap-1 overflow-x-auto border-b border-[#D8D3CB] pb-0 scrollbar-thin">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`min-h-[44px] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 rounded-none cursor-pointer border-b-[3px] ${
                      isActive
                        ? 'border-[#E31E24] text-[#C41A1F] bg-[#FAF8F5]'
                        : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {language === 'ta' ? cat.ta : cat.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter 2: Language Tabs (Square tabs with 3px red underline on active tab) */}
          <div className="space-y-2 pt-2 border-t border-[#D8D3CB]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                {language === 'ta' ? 'மொழி வாரியாக வடிகட்டுக:' : 'Filter by Language:'}
              </span>
              <span className="text-[11px] text-[#5B5348] font-mono">
                {activeLangFilter}
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto border-b border-[#D8D3CB] pb-0 scrollbar-thin">
              {languageFilters.map((lFilter) => {
                const isActive = activeLangFilter === lFilter.id;
                return (
                  <button
                    key={lFilter.id}
                    onClick={() => setActiveLangFilter(lFilter.id)}
                    className={`min-h-[44px] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 rounded-none cursor-pointer border-b-[3px] ${
                      isActive
                        ? 'border-[#E31E24] text-[#C41A1F] bg-[#FAF8F5]'
                        : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {language === 'ta' ? lFilter.ta : lFilter.en}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Results Counter & Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-[#5B5348] px-1">
          <span>
            {language === 'ta'
              ? `${filteredResources.length} ஆவணங்கள் காட்டப்படுகின்றன`
              : `Showing ${filteredResources.length} catalogue record${filteredResources.length === 1 ? '' : 's'}`}
          </span>
          {(activeCategory !== 'All' || activeLangFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveLangFilter('All');
                setSearchQuery('');
              }}
              className="text-[#C41A1F] hover:underline font-semibold cursor-pointer"
            >
              {language === 'ta' ? 'அனைத்து வடிகட்டிகளையும் நீக்குக' : 'Reset All Filters'}
            </button>
          )}
        </div>

        {/* Library Catalogue Table */}
        <div className="bg-white border-2 border-[#111111] rounded-[2px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <caption className="sr-only">
                {language === 'ta' ? 'திமுக சட்டத்துறை ஆவண நூலகப் பதிவேடு' : 'DMK Legal Wing Library Catalogue Records'}
              </caption>

              <thead>
                <tr className="bg-[#111111] text-white border-b-2 border-[#111111]">
                  <th scope="col" className="p-4 font-bold uppercase tracking-wider min-w-[280px]">
                    {language === 'ta' ? 'ஆவணத் தலைப்பு' : 'Title'}
                  </th>
                  <th scope="col" className="p-4 font-bold uppercase tracking-wider min-w-[80px]">
                    {language === 'ta' ? 'ஆண்டு' : 'Year'}
                  </th>
                  <th scope="col" className="p-4 font-bold uppercase tracking-wider min-w-[180px]">
                    {language === 'ta' ? 'நீதிமன்றம் அல்லது சட்டம்' : 'Court or Act'}
                  </th>
                  <th scope="col" className="p-4 font-bold uppercase tracking-wider min-w-[130px]">
                    {language === 'ta' ? 'மொழி' : 'Language'}
                  </th>
                  <th scope="col" className="p-4 font-bold uppercase tracking-wider min-w-[90px]">
                    {language === 'ta' ? 'அளவு' : 'File Size'}
                  </th>
                  <th scope="col" className="p-4 font-bold uppercase tracking-wider min-w-[120px]">
                    {language === 'ta' ? 'கடைசியாகப் புதுப்பிக்கப்பட்டது' : 'Last Updated'}
                  </th>
                  <th scope="col" className="p-4 font-bold uppercase tracking-wider text-right min-w-[160px]">
                    {language === 'ta' ? 'செயல்கள்' : 'Actions'}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#D8D3CB]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-xs text-[#5B5348]">
                      {language === 'ta' ? 'நூலகப் பதிவேடு ஏற்றப்படுகிறது...' : 'Loading library catalogue records...'}
                    </td>
                  </tr>
                ) : filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center space-y-2">
                      <AlertCircle className="w-6 h-6 text-[#C41A1F] mx-auto" />
                      <p className="text-sm font-bold text-[#111111]">
                        {language === 'ta' ? 'ஆவணங்கள் எதுவும் காணப்படவில்லை' : 'No catalogue matches found'}
                      </p>
                      <p className="text-xs text-[#5B5348]">
                        {language === 'ta'
                          ? 'தேடல் சொற்களை மாற்றி அல்லது வடிகட்டிகளை மீட்டமைத்து மீண்டும் முயற்சிக்கவும்.'
                          : 'Try adjusting your search query or reset the category and language filters.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((item) => {
                    const courtOrAct = item.court || item.citation || '';
                    const yearVal = item.year || '';
                    const lastUpdatedVal = item.lastUpdated || '';

                    return (
                      <tr 
                        key={item.id} 
                        className="hover:bg-[#FAF8F5] transition-colors group"
                      >
                        {/* Title Column (with plain-text category tag, not a pill) */}
                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-[#111111] group-hover:text-[#C41A1F] transition-colors block leading-snug">
                              {item.title[language] || item.title.en}
                            </span>
                            
                            {/* Category tag as plain text, not a pill */}
                            <div className="text-[11px] text-[#5B5348] font-dmk-body flex items-center gap-1.5">
                              <span className="font-semibold text-[#111111] uppercase tracking-wider">
                                {item.category}
                              </span>
                              {item.citation && (
                                <>
                                  <span className="text-[#D8D3CB]">•</span>
                                  <span className="font-mono text-[#5B5348] truncate max-w-xs">
                                    {item.citation}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Year Column (leave cell empty if no year in data) */}
                        <td className="p-4 align-top font-mono text-xs text-[#111111]">
                          {yearVal || <span className="text-neutral-300 select-none">—</span>}
                        </td>

                        {/* Court or Act Column */}
                        <td className="p-4 align-top text-xs text-[#5B5348]">
                          {courtOrAct ? (
                            <span className="text-[#111111] font-medium leading-snug block">
                              {courtOrAct}
                            </span>
                          ) : (
                            <span className="text-neutral-300 select-none">—</span>
                          )}
                        </td>

                        {/* Language Column */}
                        <td className="p-4 align-top text-xs text-[#5B5348]">
                          {getItemLanguage(item)}
                        </td>

                        {/* File Size Column */}
                        <td className="p-4 align-top font-mono text-xs text-[#111111] whitespace-nowrap">
                          {item.fileSize || 'PDF'}
                        </td>

                        {/* Last Updated Column (leave cell empty if no last-updated in data) */}
                        <td className="p-4 align-top font-mono text-xs text-[#5B5348] whitespace-nowrap">
                          {lastUpdatedVal || <span className="text-neutral-300 select-none">—</span>}
                        </td>

                        {/* Actions Column (Preview link + Download link) */}
                        <td className="p-4 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-3">
                            
                            {/* Preview Link (Opens PDF in existing viewer before download) */}
                            <button
                              onClick={() => setPreviewResource(item)}
                              className="min-h-[44px] px-2.5 py-1 text-xs font-bold text-[#111111] hover:text-[#C41A1F] underline flex items-center gap-1 cursor-pointer transition-colors"
                              aria-label={`Preview ${item.title[language] || item.title.en}`}
                            >
                              <Eye className="w-3.5 h-3.5 text-[#C41A1F]" />
                              <span>{language === 'ta' ? 'முன்னோட்டம்' : 'Preview'}</span>
                            </button>

                            {/* Download Link */}
                            <button
                              onClick={() => handleDownload(item)}
                              className="min-h-[44px] px-3.5 py-1.5 bg-[#E31E24] hover:bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                              aria-label={`Download ${item.title[language] || item.title.en}`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{language === 'ta' ? 'பதிவிறக்குக' : 'Download'}</span>
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Existing PDF Viewer Modal (Enhanced for Full Preview before download) */}
        {previewResource && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
          >
            <div className="bg-[#FAF8F5] border-2 border-[#111111] max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto rounded-[2px] shadow-2xl space-y-6">
              
              {/* Top Accent Strip */}
              <div className="w-full h-1.5 flex absolute top-0 left-0 right-0">
                <div className="w-1/2 bg-[#111111]" />
                <div className="w-1/2 bg-[#E31E24]" />
              </div>

              {/* Close Button (min-h-[44px] accessible touch target) */}
              <button
                onClick={() => setPreviewResource(null)}
                className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white hover:bg-[#E31E24] hover:text-white text-[#111111] border border-[#111111] rounded-[2px] transition-colors cursor-pointer"
                aria-label={language === 'ta' ? 'மூடுக' : 'Close Preview'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Document Header & Classification */}
              <div className="space-y-2 pt-2 border-b border-[#D8D3CB] pb-4 pr-12">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#C41A1F] uppercase tracking-wider">
                  <span>{previewResource.category}</span>
                  {previewResource.court && (
                    <>
                      <span className="text-[#D8D3CB]">•</span>
                      <span>{previewResource.court}</span>
                    </>
                  )}
                  <span className="text-[#D8D3CB]">•</span>
                  <span>PDF • {previewResource.fileSize}</span>
                </div>

                <h2 
                  id="preview-modal-title"
                  className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline leading-tight"
                >
                  {previewResource.title[language] || previewResource.title.en}
                </h2>

                {previewResource.citation && (
                  <div className="text-xs font-mono font-bold text-[#5B5348] pt-1">
                    {language === 'ta' ? 'வழக்கு / சான்று எண்:' : 'Citation / Record:'} {previewResource.citation}
                  </div>
                )}
              </div>

              {/* Simulated PDF Document Canvas View */}
              <div className="bg-white border-2 border-[#D8D3CB] p-6 sm:p-8 rounded-[2px] space-y-6 shadow-inner">
                
                {/* Official Crest & Document Masthead */}
                <div className="border-b-2 border-[#111111] pb-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C41A1F] font-bold block">
                      DMK LEGAL WING • STATE SECRETARIAT REPOSITORY
                    </span>
                    <h3 className="text-sm font-bold text-[#111111] font-dmk-headline">
                      {language === 'ta' ? 'உத்தியோகபூர்வ சட்ட ஆவண முன்னோட்டம்' : 'Official Legal Dossier Digest & Transcript'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#D8D3CB] font-mono text-[11px] font-bold text-[#111111]">
                    {getItemLanguage(previewResource)}
                  </span>
                </div>

                {/* Summary / Legal Brief */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                    {language === 'ta' ? 'வழக்கு சுருக்கம் / ஆவண விளக்கம்:' : 'Executive Legal Brief & Background:'}
                  </span>
                  <p className="text-xs sm:text-sm text-[#111111] leading-relaxed font-dmk-body">
                    {previewResource.summary[language] || previewResource.summary.en}
                  </p>
                </div>

                {/* Key Jurisprudence Highlights */}
                {previewResource.keyHighlights && (
                  <div className="pt-3 border-t border-[#D8D3CB] space-y-3">
                    <span className="text-xs font-bold text-[#C41A1F] uppercase tracking-wider block">
                      {language === 'ta' ? 'அரசமைப்பு & தீர்ப்பு முக்கிய அம்சங்கள்:' : 'Key Constitutional & Statutory Findings:'}
                    </span>
                    <div className="space-y-2">
                      {(previewResource.keyHighlights[language] || previewResource.keyHighlights.en || []).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#111111]">
                          <CheckCircle2 className="w-4 h-4 text-[#C41A1F] shrink-0 mt-0.5" />
                          <span className="leading-snug">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Actions: Close & Direct Download */}
              <div className="pt-4 border-t border-[#D8D3CB] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#111111] border border-[#111111] text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'முன்னோட்டத்தை மூடுக' : 'Close Preview'}
                </button>

                <button
                  onClick={() => {
                    handleDownload(previewResource);
                    setPreviewResource(null);
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 bg-[#E31E24] hover:bg-[#C41A1F] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>
                    {language === 'ta' ? 'முழு ஆவணத்தைப் பதிவிறக்குக' : 'Download Complete PDF Dossier'}
                  </span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Download Success Toast Notification */}
        {downloadToast && (
          <div 
            className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white border-2 border-[#E31E24] p-4 shadow-xl flex items-center gap-3 rounded-[2px] max-w-md animate-fade-in"
            role="status"
          >
            <CheckCircle2 className="w-5 h-5 text-[#C41A1F] shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold text-white mb-0.5">
                {language === 'ta' ? 'ஆவணம் பதிவிறக்கம் தொடங்கப்பட்டது' : 'Download Initiated'}
              </strong>
              <span className="text-[#D8D3CB] line-clamp-1">{downloadToast}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
