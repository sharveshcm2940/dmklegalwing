'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

interface ArticleViewProps {
  articleId: string;
}

export default function ArticleView({ articleId }: ArticleViewProps) {
  const { language } = useLanguage();
  const { news } = useData();

  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Article reading language switch: defaults to current site language but toggles article text only
  const [articleLang, setArticleLang] = useState<'ta' | 'en'>(language);

  useEffect(() => {
    setArticleLang(language);
  }, [language]);

  // Reading progress bar calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setReadingProgress(100);
        return;
      }
      const current = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, current)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const article = useMemo(() => {
    return news.find((n) => n.id === articleId) || news[0];
  }, [news, articleId]);

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

  // Two related stories at the end
  const relatedArticles = useMemo(() => {
    return news
      .filter((n) => n.id !== article?.id)
      .slice(0, 2);
  }, [news, article?.id]);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-catamaran bg-[#FAF8F5]">
        <h2 className="text-2xl font-black text-[#111111] mb-3">
          {language === 'ta' ? 'அறிக்கை கிடைக்கவில்லை' : 'Dispatch Not Found'}
        </h2>
        <p className="text-[#5B5348] text-base mb-6">
          {language === 'ta'
            ? 'நீங்கள் தேடிய அறிக்கை நீக்கப்பட்டிருக்கலாம் அல்லது தவறான முகவரி.'
            : 'The requested news communiqué may have been moved or archived.'}
        </p>
        <Link
          href="/news"
          className="min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 bg-[#E31E24] text-white font-extrabold text-[15px] btn-lift"
        >
          &larr; {language === 'ta' ? 'செய்திப் பிரிவுக்குத் திரும்புக' : 'Return to Newsroom'}
        </Link>
      </div>
    );
  }

  // Raw paragraphs of article
  const rawContent = article.content[articleLang] || article.content[language] || '';
  const paragraphs = rawContent.split('\n\n').filter((p) => p.trim().length > 0);

  const issuingAuthorityText = article.issuingAuthority
    ? article.issuingAuthority[articleLang]
    : article.court || (articleLang === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமைச் செயலகம்' : 'DMK Legal Wing Secretariat');

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen text-[#111111] font-catamaran pb-24 relative">
      
      {/* ========================================================== */}
      {/* PRINT STYLESHEET                                           */}
      {/* ========================================================== */}
      <style jsx global>{`
        @media print {
          header, footer, nav, .no-print, .reading-progress {
            display: none !important;
          }
          body, main, article {
            background: white !important;
            color: black !important;
            font-size: 13pt !important;
            line-height: 1.6 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-only {
            display: block !important;
          }
          a {
            text-decoration: none !important;
            color: black !important;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>

      {/* ========================================================== */}
      {/* 4PX RED READING-PROGRESS BAR FIXED TO TOP                  */}
      {/* ========================================================== */}
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-transparent z-50 pointer-events-none reading-progress">
        <div
          className="h-full bg-[#E31E24] transition-all duration-75 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-[1100px] mx-auto px-[clamp(20px,4vw,56px)] pt-10 space-y-12">
        
        {/* Navigation Breadcrumb back to /news (no-print) */}
        <div className="no-print">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-manrope font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] uppercase tracking-normal"
          >
            <span>&larr;</span>
            <span>{language === 'ta' ? 'செய்தியகத்திற்குத் திரும்புக' : 'Back to Newsroom'}</span>
          </Link>
        </div>

        {/* ========================================================== */}
        {/* ARTICLE HEAD ON PARCHMENT                                  */}
        {/* ========================================================== */}
        <header className="space-y-6 border-b-2 border-[#111111] pb-8">
          
          {/* Metadata Row: Type tag (red background, white 800 text), Date, and Language Switch */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Type tag: Red background, white 800 text */}
              <span className="px-3 py-1 bg-[#E31E24] text-white font-manrope font-extrabold text-[13px] uppercase tracking-normal">
                {article.category}
              </span>

              {/* Date */}
              <span className="font-manrope font-bold text-[15px] text-[#5B5348]">
                {article.date}
              </span>
            </div>

            {/* Language switch (தமிழ் / English) that changes only the article text */}
            <div className="inline-flex border border-[#6d625a] text-xs font-bold no-print">
              <button
                type="button"
                onClick={() => setArticleLang('ta')}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  articleLang === 'ta' ? 'bg-[#E31E24] text-white' : 'text-[#111111] hover:bg-[#f1ece2]'
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setArticleLang('en')}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  articleLang === 'en' ? 'bg-[#E31E24] text-white' : 'text-[#111111] hover:bg-[#f1ece2]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Headline: Helvetica Now Display 800, clamp(34px, 5vw, 60px), line height 1.05, max-w 900px */}
          <h1 className="font-manrope font-extrabold text-[clamp(34px,5vw,60px)] leading-[1.05] max-w-[900px] text-[#111111]">
            {article.title[articleLang]}
          </h1>

          {/* Source or author line */}
          <p className="text-[17px] text-[#5B5348] font-semibold break-words">
            {issuingAuthorityText}
            {article.author && article.author[articleLang] !== issuingAuthorityText && (
              <span className="text-[#111111] ml-2">
                • {articleLang === 'ta' ? 'அறிக்கை: ' : 'Dispatch by: '} {article.author[articleLang]}
              </span>
            )}
          </p>

          {/* Actions as plain underlined text links: Share, Print */}
          <div className="flex items-center gap-6 pt-2 no-print text-[15px] font-bold">
            <button
              type="button"
              onClick={handleShare}
              className="underline text-[#111111] hover:text-[#C41A1F] cursor-pointer"
            >
              {copied
                ? (language === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது' : 'Link copied to clipboard')
                : (language === 'ta' ? 'பகிர்' : 'Share')}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="underline text-[#111111] hover:text-[#C41A1F] cursor-pointer"
            >
              {language === 'ta' ? 'அச்சிடு' : 'Print'}
            </button>
          </div>

        </header>

        {/* ========================================================== */}
        {/* LEAD IMAGE (IF STORY HAS ONE, FULL WIDTH OF CONTENT)       */}
        {/* ========================================================== */}
        {article.image && (
          <div className="w-full max-w-[720px] mx-auto border-2 border-[#111111] overflow-hidden rounded-none my-8">
            <img
              src={article.image}
              alt={article.title[articleLang]}
              className="w-full h-auto object-cover rounded-none"
            />
            {(article.caption || article.photoCredit) && (
              <div className="p-3 bg-[#f1ece2] border-t border-[#111111] text-[15px] text-[#5B5348] space-y-0.5">
                {article.caption && (
                  <p className="italic">
                    {article.caption[articleLang]}
                  </p>
                )}
                {article.photoCredit && (
                  <p className="font-semibold text-[13px] text-[#5B5348]">
                    Photo: {article.photoCredit}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* CASE CITATION BADGE (SQUARE, 2PX INK BORDER)               */}
        {/* ========================================================== */}
        {(article.caseNumber || article.court) && (
          <div className="w-full max-w-[720px] mx-auto border-2 border-[#111111] bg-white p-5 flex items-start gap-4 rounded-none">
            <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center shrink-0 font-manrope font-extrabold text-[12px] uppercase">
              LAW
            </div>
            <div className="space-y-0.5">
              <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
                {language === 'ta' ? 'அரசமைப்பு வழக்கு மேற்கோள்' : 'Constitutional Case Citation'}
              </span>
              {article.caseNumber && (
                <span className="font-manrope font-extrabold text-[17px] text-[#111111] block">
                  {article.caseNumber}
                </span>
              )}
              {article.court && (
                <span className="text-[14px] text-[#5B5348] block">
                  {article.court}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* BODY IN A 720PX COLUMN: CATAMARAN 20PX, LINE HEIGHT 1.75    */}
        {/* ========================================================== */}
        <article className="max-w-[720px] mx-auto text-[20px] leading-[1.75] font-catamaran text-[#111111] space-y-8">
          
          {paragraphs.map((p, idx) => {
            // First letter of the first paragraph is a four-line drop cap in Kavivanar (Tamil) or Helvetica Now Display 800 (English), colour #C41A1F
            if (idx === 0) {
              const firstLetter = p.charAt(0);
              const rest = p.slice(1);
              const dropCapFont = articleLang === 'ta' ? 'font-kavivanar' : 'font-manrope font-extrabold';

              return (
                <p key={idx} className="leading-[1.75]">
                  <span
                    className={`float-left text-[76px] leading-[0.8] text-[#C41A1F] pr-3 pt-1 select-none ${dropCapFont}`}
                    style={{ height: '70px' }}
                  >
                    {firstLetter}
                  </span>
                  {rest}
                </p>
              );
            }

            // Quoted passage: gets a 4px ink rule on top (never a coloured left border), quote in 28px Helvetica Now Display 800
            const isQuotation = p.startsWith('>') || p.startsWith('“') || p.startsWith('"');
            if (isQuotation) {
              const cleanQuote = p.replace(/^>\s*/, '').replace(/^[“"]|[”"]$/g, '');

              return (
                <blockquote key={idx} className="border-t-4 border-[#111111] pt-4 my-8 not-italic">
                  <p className="font-manrope font-extrabold text-[28px] text-[#111111] leading-snug">
                    &ldquo;{cleanQuote}&rdquo;
                  </p>
                </blockquote>
              );
            }

            return (
              <p key={idx} className="leading-[1.75] text-[#111111]">
                {p}
              </p>
            );
          })}

        </article>

        {/* Print-only footer details */}
        <div className="print-only border-t-2 border-black pt-4 mt-8 text-xs text-black space-y-1">
          <p className="font-bold">{article.title[articleLang]}</p>
          <p>Date: {article.date} · State Legal Secretariat, Anna Arivalayam, Chennai — 600 018</p>
          <p className="mt-1 break-all">Source: https://dmklegalwing.in/news/{article.id}</p>
        </div>

        {/* ========================================================== */}
        {/* TWO RELATED STORIES AS RULED ROWS & LINK BACK TO /NEWS      */}
        {/* ========================================================== */}
        {relatedArticles.length > 0 && (
          <section className="border-t-2 border-[#111111] pt-12 no-print space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-manrope font-extrabold text-[clamp(24px,2.8vw,34px)] text-[#111111]">
                {language === 'ta' ? 'தொடர்புடைய முக்கிய அறிக்கைகள்' : 'Related dispatches on wire'}
              </h2>

              <Link
                href="/news"
                className="font-manrope font-extrabold text-[15px] text-[#C41A1F] hover:underline uppercase tracking-normal"
              >
                {language === 'ta' ? 'அனைத்து அறிக்கைகளும் →' : 'View all dispatches →'}
              </Link>
            </div>

            {/* Ruled list (same style as news list) */}
            <div className="border-t border-b border-[#111111] divide-y divide-[#111111] bg-white">
              {relatedArticles.map((item) => {
                const d = new Date(item.date);
                const dayStr = isNaN(d.getDate()) ? '12' : String(d.getDate()).padStart(2, '0');
                const monthStr = isNaN(d.getTime())
                  ? 'NOV'
                  : d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();

                const sourceLine = item.court || item.issuingAuthority?.[language] || 'State Legal Secretariat, Anna Arivalayam';

                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group block relative py-8 px-6 transition-all duration-200 cursor-pointer overflow-hidden hover:bg-[#f1ece2]"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-transform duration-200 ease-out group-hover:translate-x-[18px]">
                      
                      <div className="flex items-start gap-6 md:gap-8 flex-1">
                        {/* Day & Month */}
                        <div className="w-[84px] shrink-0 text-left">
                          <span className="font-manrope font-extrabold text-[52px] leading-none text-[#111111] block">
                            {dayStr}
                          </span>
                          <span className="font-manrope font-extrabold text-[14px] text-[#5B5348] uppercase block mt-1">
                            {monthStr}
                          </span>
                        </div>

                        {/* Title, Category, Summary, Source */}
                        <div className="flex-1 space-y-1.5">
                          <span className="text-[13px] font-extrabold uppercase text-[#C41A1F] block">
                            {item.category}
                          </span>

                          <h3 className="font-manrope font-extrabold text-[clamp(22px,2.4vw,30px)] text-[#111111] leading-snug group-hover:text-[#C41A1F] transition-colors">
                            {item.title[language]}
                          </h3>

                          <p className="text-[17px] text-[#3a322d] leading-relaxed line-clamp-2">
                            {item.summary[language]}
                          </p>

                          <p className="text-[14px] text-[#5B5348] font-semibold break-words pt-1">
                            {sourceLine}
                          </p>
                        </div>
                      </div>

                      {/* Arrow */}
                      <span className="text-[28px] font-extrabold text-[#C41A1F] shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-[8px] self-end lg:self-center">
                        &rarr;
                      </span>

                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Link back to /news */}
            <div className="pt-4 text-center">
              <Link
                href="/news"
                className="inline-flex items-center justify-center min-h-[48px] px-8 bg-[#111111] hover:bg-[#E31E24] text-white font-manrope font-extrabold text-[15px] uppercase tracking-normal btn-lift cursor-pointer transition-colors"
              >
                <span>&larr; {language === 'ta' ? 'செய்தியகப் பதிவுக்குத் திரும்புக' : 'Back to Newsroom'}</span>
              </Link>
            </div>

          </section>
        )}

      </div>

    </div>
  );
}
