'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { ReadingProgress } from '@/components/news/ReadingProgress';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Printer, 
  Check, 
  FileText, 
  Download, 
  Building, 
  Scale, 
  User, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ArticleViewProps {
  articleId: string;
}

export default function ArticleView({ articleId }: ArticleViewProps) {
  const { language } = useLanguage();
  const { news } = useData();
  const [copied, setCopied] = useState(false);

  const article = news.find((n) => n.id === articleId) || news[0];

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Related dispatches (excluding current)
  const relatedArticles = news
    .filter((n) => n.id !== article?.id)
    .slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-dmk-body">
        <h2 className="text-2xl font-black text-neutral-900 font-dmk-headline mb-3">
          {language === 'ta' ? 'அறிக்கை கிடைக்கவில்லை' : 'Dispatch Not Found'}
        </h2>
        <p className="text-neutral-600 text-sm mb-6">
          {language === 'ta' ? 'நீங்கள் தேடிய அறிக்கை நீக்கப்பட்டிருக்கலாம் அல்லது தவறான முகவரி.' : 'The requested news communiqué may have been moved or archived.'}
        </p>
        <Link 
          href="/news" 
          className="px-5 py-2.5 bg-[#E31E24] text-white font-bold text-xs uppercase tracking-wider"
        >
          &larr; {language === 'ta' ? 'செய்திப் பிரிவுக்குத் திரும்புக' : 'Return to Newsroom'}
        </Link>
      </div>
    );
  }

  // Format paragraphs from content text
  const paragraphs = article.content[language].split('\n\n');

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 font-dmk-body text-[#111111]">
      
      {/* 1. Thin Red Reading Progress Line at Top of Viewport */}
      <ReadingProgress />

      {/* 2. Top Editorial Breadcrumb & Navigation Strip */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 mb-8">
        <div className="border-b border-neutral-300 pb-4 flex items-center justify-between text-xs font-english text-neutral-600">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-900 hover:text-[#E31E24] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'ta' ? 'செய்திக் களத்திற்குத் திரும்பு' : 'BACK TO NEWSROOM'}</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-bold text-[#E31E24] uppercase">{article.category}</span>
            <span>•</span>
            <span className="text-neutral-500">DISPATCH REF: {article.id.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Typeset Newspaper Article Container */}
      <article className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="bg-white border-2 border-neutral-900 p-6 sm:p-12 shadow-sm">
          
          {/* Header Metadata */}
          <div className="space-y-4 border-b-2 border-neutral-900 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-english">
              <span className="bg-[#E31E24] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                {article.category}
              </span>

              <div className="flex items-center gap-3 text-neutral-600">
                <span className="flex items-center gap-1 font-semibold text-neutral-800">
                  <Calendar className="w-3.5 h-3.5 text-[#E31E24]" />
                  {article.date}
                </span>
                {article.time && <span>• {article.time}</span>}
                {article.readTime && (
                  <span className="hidden sm:inline bg-[#FAF7F2] px-2 py-0.5 border border-neutral-300">
                    {article.readTime}
                  </span>
                )}
              </div>
            </div>

            {/* Main Article Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-[1.08] uppercase">
              {article.title[language]}
            </h1>

            {/* Standfirst / Editorial Summary */}
            <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed font-dmk-body border-l-4 border-[#E31E24] pl-4 py-1 italic">
              {article.summary[language]}
            </p>

            {/* Issuing Authority & Author Signature */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-english text-neutral-600">
              <div className="space-y-0.5">
                <span className="text-neutral-400 uppercase text-[10px] block">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ அறிக்கை வெளியீடு:' : 'Official Issuing Authority:'}
                </span>
                <span className="font-bold text-neutral-900 text-sm">
                  {article.issuingAuthority ? article.issuingAuthority[language] : (language === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமை' : 'DMK Legal Wing Secretariat')}
                </span>
                {article.author && (
                  <span className="block text-neutral-700 text-xs font-medium">
                    {article.author[language]}
                  </span>
                )}
              </div>

              {/* Action Buttons: Share & Print */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-neutral-900 hover:text-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied URL</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-neutral-900 hover:text-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

          </div>

          {/* Hero Editorial Photograph with Caption */}
          {article.image && (
            <div className="my-8">
              <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-950 border border-neutral-900">
                <img
                  src={article.image}
                  alt={article.title[language]}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="bg-[#FAF7F2] border-x border-b border-neutral-300 p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-english text-neutral-600">
                <p className="italic text-neutral-800">
                  {article.caption ? article.caption[language] : article.title[language]}
                </p>
                {article.photoCredit && (
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider shrink-0">
                    Photo: {article.photoCredit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Court & Case Reference Dossier Bar (if applicable) */}
          {(article.court || article.caseNumber) && (
            <div className="bg-[#FFF5F5] border border-[#E31E24] p-4 my-6 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-english font-bold uppercase tracking-wider text-[#B81318] block">
                  {language === 'ta' ? 'நீதிமன்ற வழக்கு விவரம்' : 'OFFICIAL COURT DOCKET REFERENCE'}
                </span>
                <span className="font-bold text-neutral-900 text-sm">
                  {article.court || 'Supreme Court of India'}
                </span>
                {article.caseNumber && (
                  <span className="block font-mono text-neutral-700 text-xs">
                    {article.caseNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[#B81318] font-bold text-xs uppercase bg-white px-2.5 py-1 border border-[#E31E24]">
                  <Scale className="w-3.5 h-3.5" />
                  Official Proceeding
                </span>
              </div>
            </div>
          )}

          {/* Complete Article Prose Content */}
          <div className="prose max-w-none text-neutral-900 font-dmk-body leading-relaxed text-base sm:text-lg space-y-6 pt-4">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {idx === 0 ? (
                  <>
                    <span className="float-left text-5xl font-black text-[#E31E24] font-dmk-headline pr-3 leading-none uppercase">
                      {p.charAt(0)}
                    </span>
                    {p.slice(1)}
                  </>
                ) : (
                  p
                )}
              </p>
            ))}
          </div>

          {/* Official Verification Seal & Document Download */}
          <div className="mt-12 pt-8 border-t-2 border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#FAF7F2] p-6 border border-neutral-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white border border-neutral-900 p-2 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-[#E31E24]" />
              </div>
              <div className="text-xs font-english">
                <span className="font-bold text-neutral-900 block uppercase tracking-wider text-sm">
                  {language === 'ta' ? 'உறுதிப்படுத்தப்பட்ட தலைமைச் செயலக ஆவணம்' : 'Verified Legal Wing Press Release'}
                </span>
                <span className="text-neutral-500">
                  Anna Arivalayam, Chennai • Dravida Munnetra Kazhagam
                </span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-neutral-900 text-white px-5 py-2.5 text-xs font-english font-bold uppercase tracking-widest transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'ta' ? 'அறிக்கையைப் பதிவிறக்குக (PDF)' : 'DOWNLOAD OFFICIAL PDF'}</span>
            </button>
          </div>

        </div>
      </article>

      {/* 4. Related Editorial Dispatches */}
      {relatedArticles.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 mt-12">
          <div className="border-b-2 border-neutral-900 pb-3 mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 font-dmk-headline uppercase">
              {language === 'ta' ? 'தொடர்புடைய முக்கிய அறிக்கைகள்' : 'Related Editorial Dispatches'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-neutral-900 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-english text-neutral-500 border-b border-neutral-200 pb-1.5">
                    <span className="font-bold text-[#E31E24] uppercase">{item.category}</span>
                    <span>{item.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-snug">
                    <Link href={`/news/${item.id}`}>
                      {item.title[language]}
                    </Link>
                  </h4>

                  <p className="text-xs text-neutral-600 line-clamp-3 font-dmk-body">
                    {item.summary[language]}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-200">
                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-english font-bold text-neutral-900 group-hover:text-[#E31E24] uppercase tracking-wider"
                  >
                    <span>{language === 'ta' ? 'படிக்க' : 'Read Dispatch'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
