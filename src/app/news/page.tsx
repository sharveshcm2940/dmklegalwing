'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { NewsItem } from '@/types';
import { NewsroomMasthead } from '@/components/news/NewsroomMasthead';
import { LeadStory } from '@/components/news/LeadStory';
import { LatestNewsFeed } from '@/components/news/LatestNewsFeed';
import { LegalDevelopments } from '@/components/news/LegalDevelopments';
import { PressArchive } from '@/components/news/PressArchive';

export default function NewsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { news, legalDevelopments, gallery } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('All Updates');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All Updates',
    'Press Releases',
    'Official Statements',
    'Court Watch',
    'Resolutions',
    'Gazette',
    'Media Archive'
  ];

  // Map category button label to data category filter
  const matchesCategoryFilter = (itemCategory: string, selected: string) => {
    if (selected === 'All Updates') return true;
    if (selected === 'Press Releases') return itemCategory === 'Press Release';
    if (selected === 'Official Statements') return itemCategory === 'Statement' || itemCategory === 'Official Statements';
    if (selected === 'Court Watch') return itemCategory === 'Court Watch' || itemCategory === 'Legal Developments';
    if (selected === 'Resolutions') return itemCategory === 'Resolution';
    if (selected === 'Gazette') return itemCategory === 'Gazette';
    if (selected === 'Media Archive') return itemCategory === 'Media' || itemCategory === 'Media Archive';
    return itemCategory === selected;
  };

  // Filter news articles based on category and search query
  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return news.filter((item) => {
      const matchesCat = matchesCategoryFilter(item.category, activeCategory);
      const matchesSearch =
        !q ||
        item.title[language].toLowerCase().includes(q) ||
        item.summary[language].toLowerCase().includes(q) ||
        item.content[language].toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.court && item.court.toLowerCase().includes(q)) ||
        (item.caseNumber && item.caseNumber.toLowerCase().includes(q)) ||
        item.date.includes(q);

      return matchesCat && matchesSearch;
    });
  }, [news, activeCategory, searchQuery, language]);

  // Lead story is the item flagged as featured, or the first article matching the query
  const leadStory = useMemo(() => {
    return filteredNews.find((n) => n.featured) || filteredNews[0] || news[0];
  }, [filteredNews, news]);

  // Feed articles: all filtered news excluding the lead story (or all if filtered differently)
  const feedArticles = useMemo(() => {
    if (!leadStory) return filteredNews;
    return filteredNews.filter((n) => n.id !== leadStory.id);
  }, [filteredNews, leadStory]);

  // Latest ticker dispatches
  const latestDispatches = useMemo(() => {
    return news.slice(0, 5);
  }, [news]);

  const handleSelectArticle = (article: NewsItem) => {
    router.push(`/news/${article.id}`);
  };

  return (
    <div className="w-full flex flex-col space-y-12 pb-16 bg-[#FAF7F2] text-[#111111] font-dmk-body">
      
      {/* SECTION A: EDITORIAL NEWSROOM MASTHEAD */}
      <NewsroomMasthead
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        latestDispatches={latestDispatches}
        onSelectArticle={handleSelectArticle}
      />

      {/* SECTION B: FRONT-PAGE LEAD STORY */}
      {leadStory && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
          <LeadStory 
            story={leadStory} 
            onReadMore={handleSelectArticle} 
          />
        </section>
      )}

      {/* SECTION C: LATEST FROM THE PRESS OFFICE (EDITORIAL FEED) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <LatestNewsFeed 
          articles={feedArticles} 
          totalCount={filteredNews.length} 
        />
      </section>

      {/* SECTION D: LEGAL DEVELOPMENTS / COURT WATCH */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <LegalDevelopments 
          items={legalDevelopments} 
        />
      </section>

      {/* SECTION E: ARCHIVAL PRESS GALLERY (DOCUMENTARY PHOTOGRAPHY) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <PressArchive 
          items={gallery} 
        />
      </section>

    </div>
  );
}
