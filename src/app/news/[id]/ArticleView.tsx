'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { 
  IconCheck, 
  IconScale, 
  IconChevronRight, 
  IconCalendar,
  IconClose
} from '@/components/Icons';

interface ArticleViewProps {
  articleId: string;
}

export default function ArticleView({ articleId }: ArticleViewProps) {
  const { language } = useLanguage();
  const { news } = useData();
  const [copied, setCopied] = useState(false);
  const [printDate, setPrintDate] = useState<string>('');

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

  const relatedArticles = news
    .filter((n) => n.id !== article?.id)
    .slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-catamaran">
        <h2 className="text-2xl font-black text-[#111111] mb-3">
          {language === 'ta' ? 'அறிக்கை கிடைக்கவில்லை' : 'Dispatch Not Found'}
        </h2>
        <p className="text-[#5B5348] text-base mb-6">
          {language === 'ta' ? 'நீங்கள் தேடிய அறிக்கை நீக்கப்பட்டிருக்கலாம் அல்லது தவறான முகவரி.' : 'The requested news communiqué may have been moved or archived.'}
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

  const paragraphs = (article.content[articleLang] || article.content[language]).split('\n\n');

  const issuingAuthorityText = article.issuingAuthority 
    ? article.issuingAuthority[articleLang] 
    : (articleLang === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமைச் செயலகம்' : 'DMK Legal Wing Secretariat');

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-24 font-catamaran text-[#111111] text-[17px] leading-[1.65]">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={article.title[articleLang]}
        description={article.summary[articleLang]}
      />

      <div className="max-w-[1100px] mx-auto px-[clamp(20px,4vw,56px)] pt-8">
        
        {/* Navigation Breadcrumb & Article Controls */}
        <div className="border-b-2 border-[#111111] pb-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <Link
            href="/news"
            className="min-h-[44px] inline-flex items-center gap-2 font-extrabold text-[15px] text-[#111111] hover:text-[#C41A1F] transition-colors"
          >
            <span>&larr;</span>
            <span>{language === 'ta' ? 'செய்திக் களத்திற்குத் திரும்பு' : 'BACK TO NEWSROOM'}</span>
          </Link>

          {/* Controls: Article Language Switch & Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Bilingual Article Reading Switch */}
            <div className="inline-flex border border-[#6d625a] text-xs font-bold">
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

            {/* Share & Print */}
            <button
              type="button"
              onClick={handleShare}
              className="min-h-[44px] px-4 py-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white font-extrabold text-[13px] transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              {copied ? (
                <>
                  <IconCheck className="w-4 h-4 text-[#C41A1F]" />
                  <span>{language === 'ta' ? 'நகலெடுக்கப்பட்டது' : 'Copied'}</span>
                </>
              ) : (
                <span>{language === 'ta' ? 'பகிர்' : 'Share'}</span>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-4 py-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white font-extrabold text-[13px] transition-colors cursor-pointer"
            >
              {language === 'ta' ? 'அச்சிடு' : 'Print'}
            </button>
          </div>
        </div>

        {/* Main Article Container */}
        <article className="bg-white border-2 border-[#111111] p-8 sm:p-12 space-y-8">
          
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#111111] pb-4 text-[14px]">
            <span className="font-extrabold uppercase text-[#C41A1F]">
              [{article.category}]
            </span>

            <div className="flex items-center gap-4 text-[#5B5348]">
              <span className="font-helvetica font-bold text-[#111111]">
                {article.date}
              </span>
              {article.court && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-[#111111]">{article.court}</span>
                </>
              )}
            </div>
          </div>

          {/* Photograph if available */}
          {article.image && (
            <div className="border-2 border-[#111111] overflow-hidden">
              <div className="aspect-[16/9] w-full bg-[#111111]">
                <img
                  src={article.image}
                  alt={article.title[articleLang]}
                  className="w-full h-full object-cover"
                />
              </div>
              {article.caption && (
                <div className="p-3 bg-[#f1ece2] text-[14px] text-[#5B5348] italic border-t border-[#111111]">
                  {article.caption[articleLang]}
                </div>
              )}
            </div>
          )}

          {/* Prose Content */}
          <div className="space-y-6 text-[#111111] text-[18px] leading-[1.7]">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {idx === 0 ? (
                  <>
                    <span className="float-left text-5xl font-extrabold text-[#E31E24] pr-3 leading-none uppercase">
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

          {/* Issuing Signature */}
          <div className="border-t-2 border-[#111111] pt-6 mt-8 space-y-1">
            <span className="text-[12px] uppercase text-[#5B5348] font-bold block">
              {articleLang === 'ta' ? 'அதிகாரப்பூர்வ வெளியீடு:' : 'Official Issuing Authority:'}
            </span>
            <span className="font-extrabold text-[18px] text-[#111111] block">
              {issuingAuthorityText}
            </span>
            {article.author && article.author[articleLang] !== issuingAuthorityText && (
              <span className="text-[14px] text-[#5B5348] block">
                {articleLang === 'ta' ? 'கையெழுத்திட்டவர்: ' : 'Signatory: '}
                <strong className="text-[#111111]">{article.author[articleLang]}</strong>
              </span>
            )}
          </div>

        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 border-t-2 border-[#111111] pt-8 no-print space-y-6">
            <h3 className="font-kavivanar font-normal text-[28px] text-[#111111]">
              {language === 'ta' ? 'தொடர்புடைய முக்கிய அறிக்கைகள்' : 'Related Dispatches'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-[#111111] p-6 flex flex-col justify-between hover:bg-[#f1ece2] transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold text-[#C41A1F] uppercase block">
                      [{item.category}]
                    </span>
                    <h4 className="font-extrabold text-[18px] text-[#111111] leading-snug">
                      <Link href={`/news/${item.id}`} className="hover:text-[#C41A1F]">
                        {item.title[language]}
                      </Link>
                    </h4>
                    <p className="text-[14px] text-[#5B5348] line-clamp-2">
                      {item.summary[language]}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#3d3633]">
                    <Link
                      href={`/news/${item.id}`}
                      className="min-h-[44px] inline-flex items-center gap-1 font-extrabold text-[13px] text-[#C41A1F]"
                    >
                      <span>{language === 'ta' ? 'படிக்க' : 'Read'}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
