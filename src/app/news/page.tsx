'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { NewsItem } from '@/types';
import { 
  Calendar, 
  Search, 
  Filter, 
  Share2, 
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';

export default function NewsPage() {
  const { language } = useLanguage();
  const { news } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  const categories = ['All', 'Press Release', 'Statement', 'Resolution', 'Media', 'Gazette'];

  const filteredNews = news.filter((n) => {
    const matchesCategory = activeCategory === 'All' || n.category === activeCategory;
    const matchesSearch =
      n.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews.find((n) => n.featured) || filteredNews[0];
  const regularNews = filteredNews.filter((n) => n.id !== featuredNews?.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div className="w-full flex flex-col space-y-10 py-8 bg-[#FAF7F2] text-[#111111] font-dmk-body">
      
      {/* Editorial Header Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border-b-2 border-neutral-900 pb-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#111111] text-white text-[10px] font-mono uppercase px-2 py-0.5 tracking-widest font-bold">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ செய்தி & அறிக்கை இதழ்' : 'THE DRAVIDIAN LEGAL HERALD'}
                </span>
                <span className="text-[11px] font-mono text-[#E31E24] font-bold">
                  DAILY DISPATCH & PRESS COMMUNIQUÉ
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight uppercase leading-none">
                {language === 'ta'
                  ? 'அதிகாரப்பூர்வ அறிக்கைகள் & செய்திகள்'
                  : 'Press Releases, Statements & Media Wire'}
              </h1>
            </div>
            <div className="text-left md:text-right font-mono text-[11px] text-neutral-600">
              <p className="font-bold text-[#111111]">SECRETARIAT PRESS BUREAU</p>
              <p>Anna Arivalayam, Chennai — 600 018</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-dmk-body max-w-4xl">
            {language === 'ta'
              ? 'திமுக வழக்கறிஞர் அணித் தலைமை வெளியிடும் அதிகாரப்பூர்வ அறிக்கைகள், தீர்மானங்கள், உச்ச நீதிமன்ற & உயர் நீதிமன்ற வழக்கு முன்னேற்றங்கள் மற்றும் அரசமைப்புச் சட்ட விளக்கங்களின் காலவரிசைத் தொகுப்பு.'
              : 'Authoritative press communiqués, constitutional defense statements, council resolutions, and High Court and Supreme Court proceeding summaries issued by the DMK Legal Wing Secretariat.'}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white border-y border-neutral-300 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#E31E24]" />
              {language === 'ta' ? 'செய்திப் பிரிவு:' : 'EDITION:'}
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === c
                    ? 'bg-[#E31E24] text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {c === 'All' ? (language === 'ta' ? 'அனைத்து செய்திகள்' : 'All Releases') : c}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'செய்தி தேடுக...' : 'Search news headlines...'}
              className="w-full bg-[#FAF7F2] border border-neutral-300 pl-9 pr-3 py-1.5 text-xs text-[#111111] font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E31E24]"
            />
          </div>

        </div>
      </section>

      {/* Toast Alert */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white border-2 border-[#E31E24] px-5 py-3 shadow-md flex items-center gap-2 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#E31E24]" />
          <span>{language === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது' : 'ARTICLE PERMALINK COPIED'}</span>
        </div>
      )}

      {/* Featured Lead Story (Clean Newspaper Feature Layout, No Card Appearance) */}
      {featuredNews && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
          <div className="bg-white border border-neutral-300 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto bg-neutral-950 overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-300">
              <img
                src={featuredNews.image}
                alt={featuredNews.title[language]}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="bg-[#E31E24] text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1">
                  {language === 'ta' ? 'சிறப்பிதழ் / தலைமை அறிக்கை' : 'EXTRA EDITION • SPECIAL REPORT'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-[#FAF7F2]">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-600 border-b border-neutral-300 pb-2">
                  <span className="text-[#E31E24] font-bold uppercase">{featuredNews.category}</span>
                  <span>•</span>
                  <span>{featuredNews.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline leading-tight">
                  {featuredNews.title[language]}
                </h2>

                <p className="text-sm text-neutral-800 leading-relaxed font-dmk-body">
                  {featuredNews.summary[language]}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-mono font-bold">
                  {featuredNews.author[language]}
                </span>

                <button
                  onClick={() => setSelectedArticle(featuredNews)}
                  className="px-5 py-2.5 bg-[#E31E24] hover:bg-neutral-900 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span>{language === 'ta' ? 'முழு அறிக்கை வாசிக்க' : 'Read Full Dispatch'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Chronological News Archive Grid (Clean Newspaper Columns, No Heavy Card Appearance) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border-b-2 border-neutral-900 pb-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E31E24]" />
            <h3 className="text-2xl font-black text-[#111111] font-dmk-headline uppercase">
              {language === 'ta' ? 'அனைத்து அறிக்கைகள் & செய்திப் பதிவுகள்' : 'Gazette Bulletins & Communiqués'}
            </h3>
          </div>
          <span className="font-mono text-xs text-neutral-600">
            {regularNews.length} DISPATCHES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="w-full h-1 flex">
                  <div className="w-1/2 bg-black" />
                  <div className="w-1/2 bg-[#E31E24]" />
                </div>

                <div className="relative h-48 overflow-hidden bg-neutral-950 border-b border-neutral-200">
                  <img
                    src={item.image}
                    alt={item.title[language]}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#111111] text-white">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#E31E24]" />
                    <span>{item.date}</span>
                  </div>

                  <h4 className="text-base font-black text-[#111111] font-dmk-headline group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-snug">
                    {item.title[language]}
                  </h4>

                  <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3 font-dmk-body">
                    {item.summary[language]}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[11px] text-neutral-600 font-mono truncate max-w-[150px]">
                  {item.author[language]}
                </span>

                <button
                  onClick={() => setSelectedArticle(item)}
                  className="font-mono text-xs font-bold text-[#E31E24] hover:text-black flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>{language === 'ta' ? 'அறிக்கை' : 'Read'}</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full Article Reader Broadsheet Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border-2 border-neutral-900 max-w-3xl w-full p-6 sm:p-10 relative max-h-[90vh] overflow-y-auto font-dmk-body">
            
            <div className="w-full h-1 flex absolute top-0 left-0">
              <div className="w-1/2 bg-black" />
              <div className="w-1/2 bg-[#E31E24]" />
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 w-8 h-8 bg-white hover:bg-[#E31E24] hover:text-white text-neutral-900 border border-neutral-900 flex items-center justify-center font-bold text-sm transition-all"
              aria-label="Close article"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-5 mt-2">
              <div className="space-y-2 border-b border-neutral-300 pb-4">
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-700">
                  <span className="bg-[#E31E24] text-white px-2 py-0.5 font-bold uppercase">{selectedArticle.category}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span className="font-bold">{selectedArticle.author[language]}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline leading-tight">
                  {selectedArticle.title[language]}
                </h1>
              </div>

              <div className="border border-neutral-900 overflow-hidden max-h-80 bg-neutral-950">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title[language]}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 bg-white border border-neutral-300 text-sm font-dmk-headline italic text-neutral-900">
                {selectedArticle.summary[language]}
              </div>

              <div className="text-sm sm:text-base text-neutral-800 leading-relaxed space-y-4 font-dmk-body">
                <p>{selectedArticle.content[language]}</p>
              </div>

              <div className="pt-6 border-t border-neutral-300 flex items-center justify-between">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-800 hover:text-[#E31E24] transition-colors border border-neutral-900 px-3 py-1.5 bg-white"
                >
                  <Share2 className="w-4 h-4 text-[#E31E24]" />
                  <span>{language === 'ta' ? 'பகிர்' : 'Copy Article Wire'}</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 bg-[#111111] hover:bg-[#E31E24] text-white border border-neutral-900 text-xs font-mono font-bold uppercase tracking-wider"
                >
                  {language === 'ta' ? 'மூடுக' : 'Close Dispatch'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
