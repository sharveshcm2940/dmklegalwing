'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { ReadingProgress } from '@/components/news/ReadingProgress';
import { 
  ArrowLeft, 
  Calendar, 
  Share2, 
  Printer, 
  Check, 
  Scale, 
  ChevronRight
} from 'lucide-react';

interface ArticleViewProps {
  articleId: string;
}

export default function ArticleView({ articleId }: ArticleViewProps) {
  const { language } = useLanguage();
  const { news } = useData();
  const [copied, setCopied] = useState(false);
  const [printDate, setPrintDate] = useState<string>('');

  // Dedicated language switch for the article only (defaults to active site language)
  const [articleLang, setArticleLang] = useState<'ta' | 'en'>(language);

  useEffect(() => {
    setArticleLang(language);
  }, [language]);

  useEffect(() => {
    setPrintDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

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
        <h2 className="text-2xl font-black text-[#111111] font-dmk-headline mb-3">
          {language === 'ta' ? 'அறிக்கை கிடைக்கவில்லை' : 'Dispatch Not Found'}
        </h2>
        <p className="text-[#5B5348] text-sm mb-6">
          {language === 'ta' ? 'நீங்கள் தேடிய அறிக்கை நீக்கப்பட்டிருக்கலாம் அல்லது தவறான முகவரி.' : 'The requested news communiqué may have been moved or archived.'}
        </p>
        <Link 
          href="/news" 
          className="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 bg-[#E31E24] text-white font-bold text-xs uppercase tracking-wider rounded-[2px]"
        >
          &larr; {language === 'ta' ? 'செய்திப் பிரிவுக்குத் திரும்புக' : 'Return to Newsroom'}
        </Link>
      </div>
    );
  }

  // Format paragraphs from content text using the article's chosen language
  const paragraphs = (article.content[articleLang] || article.content[language]).split('\n\n');

  const issuingAuthorityText = article.issuingAuthority 
    ? article.issuingAuthority[articleLang] 
    : (articleLang === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமைச் செயலகம்' : 'DMK Legal Wing Secretariat');

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen py-8 font-dmk-body text-[#111111]">
      
      {/* 1. Thin Red Reading Progress Line at Top of Viewport */}
      <ReadingProgress />

      {/* 2. Top Editorial Breadcrumb & Navigation Strip (Hidden on Print) */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 mb-8 no-print">
        <div className="border-b border-[#D8D3CB] pb-4 flex items-center justify-between text-xs font-dmk-body text-[#5B5348]">
          <Link
            href="/news"
            className="min-h-[44px] inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#111111] hover:text-[#C41A1F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'ta' ? 'செய்திக் களத்திற்குத் திரும்பு' : 'BACK TO NEWSROOM'}</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-english font-bold text-[#C41A1F] uppercase tracking-wider text-[10px]">
              [{article.category}]
            </span>
            <span className="text-[#D8D3CB]">•</span>
            <span className="text-[#5B5348] font-english text-[11px]">DISPATCH REF: {article.id.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Typeset Newspaper Article Container */}
      <article className="max-w-[1100px] mx-auto px-4 sm:px-6 print-article">
        <div className="bg-white border border-[#D8D3CB] p-6 sm:p-12 rounded-[2px] shadow-xs">
          
          {/* Article Header Controls: Tamil/English Switch & Plain Text Share/Print Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D3CB] pb-4 mb-8 no-print">
            
            {/* Tamil / English Switch: Changes ONLY the article text */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#5B5348] font-dmk-body font-semibold">
                {language === 'ta' ? 'கட்டுரை மொழி வாசிப்பு:' : 'Article language:'}
              </span>
              <div className="inline-flex border-b border-[#D8D3CB]">
                <button
                  type="button"
                  onClick={() => setArticleLang('ta')}
                  className={`min-h-[44px] px-4 py-2 text-xs font-dmk-body font-bold transition-all border-b-[3px] rounded-none cursor-pointer ${
                    articleLang === 'ta'
                      ? 'border-[#E31E24] text-[#111111]'
                      : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:border-[#D8D3CB]'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  onClick={() => setArticleLang('en')}
                  className={`min-h-[44px] px-4 py-2 text-xs font-dmk-body font-bold transition-all border-b-[3px] rounded-none cursor-pointer ${
                    articleLang === 'en'
                      ? 'border-[#E31E24] text-[#111111]'
                      : 'border-transparent text-[#5B5348] hover:text-[#111111] hover:border-[#D8D3CB]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Plain Underlined Text Links for Share & Print */}
            <div className="flex items-center gap-6 text-xs font-dmk-body font-bold text-[#111111]">
              <button
                type="button"
                onClick={handleShare}
                className="min-h-[44px] inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#C41A1F] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C41A1F]" />
                    <span>{language === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது' : 'Copied Link'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#C41A1F]" />
                    <span>{language === 'ta' ? 'பகிர்' : 'Share'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="min-h-[44px] inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#C41A1F] transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C41A1F]" />
                <span>{language === 'ta' ? 'அச்சிடு' : 'Print'}</span>
              </button>
            </div>

          </div>

          {/* Header Metadata */}
          <div className="space-y-4 border-b-2 border-[#111111] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F]">
                [{article.category}]
              </span>

              <div className="flex items-center gap-3 text-[#5B5348] font-english">
                <span className="flex items-center gap-1 font-semibold text-[#111111]">
                  <Calendar className="w-3.5 h-3.5 text-[#C41A1F]" />
                  {article.date}
                </span>
                {article.time && <span>• {article.time}</span>}
                {article.readTime && (
                  <span className="hidden sm:inline bg-[#FAF8F5] px-2 py-0.5 border border-[#D8D3CB]">
                    {article.readTime}
                  </span>
                )}
              </div>
            </div>

            {/* Main Article Headline in chosen article language */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight leading-[1.12]">
              {article.title[articleLang]}
            </h1>

            {/* Standfirst / Editorial Summary */}
            <p className="text-lg sm:text-xl text-[#5B5348] leading-relaxed font-dmk-body border-l-4 border-[#E31E24] pl-4 py-1 italic">
              {article.summary[articleLang]}
            </p>

            {/* Issuing Authority & Author Signature: NEVER CUT OFF */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs font-dmk-body text-[#5B5348]">
              <div className="space-y-1">
                <span className="text-[#5B5348] text-[11px] block">
                  {articleLang === 'ta' ? 'அதிகாரப்பூர்வ அறிக்கை வெளியீடு:' : 'Official Issuing Authority:'}
                </span>
                <span className="font-bold text-[#111111] text-sm block break-words whitespace-normal leading-tight">
                  {issuingAuthorityText}
                </span>
                {article.author && article.author[articleLang] !== issuingAuthorityText && (
                  <span className="block text-[#5B5348] text-xs font-medium pt-0.5 break-words whitespace-normal">
                    {articleLang === 'ta' ? 'கையெழுத்திட்டவர்: ' : 'Signatory: '}
                    <strong className="text-[#111111]">{article.author[articleLang]}</strong>
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Hero Editorial Photograph with Caption & Photo Credit */}
          {article.image && (
            <div className="my-8">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#111111] border border-[#D8D3CB] rounded-[2px]">
                <img
                  src={article.image}
                  alt={article.title[articleLang]}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <figcaption className="bg-[#FAF8F5] border-x border-b border-[#D8D3CB] p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-dmk-body text-[#5B5348]">
                <p className="italic text-[#111111]">
                  {article.caption ? article.caption[articleLang] : article.title[articleLang]}
                </p>
                {article.photoCredit && (
                  <span className="font-english text-[10px] text-[#5B5348]/80 shrink-0">
                    Photo: {article.photoCredit}
                  </span>
                )}
              </figcaption>
            </div>
          )}

          {/* Court & Case Reference Bar (if applicable) */}
          {(article.court || article.caseNumber) && (
            <div className="bg-[#FAF8F5] border-l-4 border-[#E31E24] border-y border-r border-[#D8D3CB] p-4 my-6 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[2px]">
              <div className="space-y-0.5">
                <span className="font-english text-[10px] font-bold uppercase tracking-wider text-[#C41A1F] block">
                  {articleLang === 'ta' ? 'நீதிமன்ற வழக்கு விவரம்' : 'OFFICIAL COURT DOCKET REFERENCE'}
                </span>
                <span className="font-bold text-[#111111] text-sm block">
                  {article.court || 'Supreme Court of India'}
                </span>
                {article.caseNumber && (
                  <span className="block font-mono text-[#5B5348] text-xs">
                    Docket: {article.caseNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[#C41A1F] font-bold text-xs uppercase bg-white px-2.5 py-1 border border-[#D8D3CB] rounded-[2px]">
                  <Scale className="w-3.5 h-3.5" />
                  Official Proceeding
                </span>
              </div>
            </div>
          )}

          {/* Complete Article Prose Content */}
          <div className="prose max-w-none text-[#111111] font-dmk-body leading-relaxed text-base sm:text-lg space-y-6 pt-4">
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

          {/* Clean Print Footer with URL and Date (Visible ONLY in Print) */}
          <div className="hidden print:block print-footer">
            <p className="font-bold">DMK Legal Wing — Official Press Bureau & Constitutional Communiqué</p>
            <p>Title: {article.title[articleLang]}</p>
            <p>URL: {typeof window !== 'undefined' ? window.location.href : `https://dmklegalwing.in/news/${article.id}`}</p>
            <p>Date Published: {article.date} {printDate ? `| Printed: ${printDate}` : ''}</p>
          </div>

        </div>
      </article>

      {/* 4. Related Editorial Dispatches (Hidden in Print) */}
      {relatedArticles.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 mt-12 no-print">
          <div className="border-b-2 border-[#111111] pb-3 mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
              {language === 'ta' ? 'தொடர்புடைய முக்கிய அறிக்கைகள்' : 'Related Editorial Dispatches'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#D8D3CB] p-5 flex flex-col justify-between rounded-[2px] shadow-2xs hover:shadow-xs transition-shadow group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#5B5348] border-b border-[#D8D3CB] pb-1.5">
                    <span className="font-english font-bold text-[#C41A1F] uppercase text-[10px]">
                      [{item.category}]
                    </span>
                    <span className="font-english">{item.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#111111] font-dmk-headline group-hover:text-[#C41A1F] transition-colors leading-snug">
                    <Link href={`/news/${item.id}`}>
                      {item.title[language]}
                    </Link>
                  </h4>

                  <p className="text-xs text-[#5B5348] line-clamp-3 font-dmk-body">
                    {item.summary[language]}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D8D3CB]">
                  <Link
                    href={`/news/${item.id}`}
                    className="min-h-[44px] inline-flex items-center gap-1 text-xs font-dmk-body font-bold text-[#111111] group-hover:text-[#C41A1F] underline underline-offset-4"
                  >
                    <span>{language === 'ta' ? 'படிக்க' : 'Read statement'}</span>
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
