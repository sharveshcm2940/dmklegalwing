'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { EventItem } from '@/types';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { 
  IconCalendar, 
  IconMapPin, 
  IconSearch, 
  IconChevronRight, 
  IconClose, 
  IconCheck 
} from '@/components/Icons';

export default function ActivitiesPage() {
  const { language } = useLanguage();
  const { events } = useData();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const mainSection = useReveal();

  const categories = ['All', 'Conference', 'Legal Awareness', 'Seminar', 'Organisational', 'Constitutional'];

  const filteredEvents = events.filter((e) => {
    const matchesTab = activeTab === 'all' || e.status === activeTab;
    const matchesCat = activeCategory === 'All' || e.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      e.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCat && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'மாநாடுகள் & களப்பணிகள்' : 'Conferences & Field Initiatives'}
        description={
          language === 'ta'
            ? 'அரசமைப்பு விழிப்புணர்வுக் கருத்தரங்குகள், இளம் வழக்கறிஞர்களுக்கான பயிலரங்குகள் மற்றும் மாவட்ட இலவச சட்ட உதவி முகாம்கள்.'
            : 'A chronicle of State Legal Conferences, constitutional seminars, pro-bono citizen legal clinics, and grassroots sessions.'
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
              <div className="md:col-span-5 space-y-1.5">
                <label htmlFor="activitySearch" className="font-semibold text-[15px] text-[#111111]">
                  {language === 'ta' ? 'நிகழ்வுகளைத் தேடுக' : 'Search Events & Conferences'}
                </label>
                <div className="relative">
                  <IconSearch className="w-4 h-4 text-[#5B5348] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="activitySearch"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ta' ? 'தலைப்பு, இடம் அல்லது விவரம்...' : 'Title, venue or topic...'}
                    className="w-full min-h-[44px] bg-white border-2 border-[#111111] pl-10 pr-4 text-[15px] text-[#111111]"
                  />
                </div>
              </div>

              {/* Status Tabs */}
              <div className="md:col-span-3 flex items-center border border-[#111111] bg-white">
                {(['all', 'upcoming', 'completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-h-[44px] py-2 text-[13px] font-extrabold uppercase transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#111111] text-white'
                        : 'text-[#111111] hover:bg-[#f1ece2]'
                    }`}
                  >
                    {tab === 'all'
                      ? (language === 'ta' ? 'அனைத்தும்' : 'All')
                      : tab === 'upcoming'
                      ? (language === 'ta' ? 'வரவிருக்கும்' : 'Upcoming')
                      : (language === 'ta' ? 'நிறைவடைந்தவை' : 'Past')}
                  </button>
                ))}
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-4 space-y-1.5">
                <label htmlFor="categorySelect" className="font-semibold text-[15px] text-[#111111]">
                  {language === 'ta' ? 'பிரிவு' : 'Category'}
                </label>
                <select
                  id="categorySelect"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full min-h-[44px] bg-white border-2 border-[#111111] px-4 text-[15px] text-[#111111] cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex items-center justify-between text-[14px] text-[#5B5348] border-t border-[#3d3633] pt-3">
              <span>
                {language === 'ta' ? 'மொத்த நிகழ்வுகள்: ' : 'Showing events: '}
                <strong className="text-[#111111] font-helvetica">{filteredEvents.length}</strong>
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

          {/* Events Grid: Hand-designed Ruled Blocks */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white border-2 border-[#111111] p-12 text-center">
              <p className="text-[17px] text-[#5B5348]">
                {language === 'ta'
                  ? 'தேடலுக்குரிய நிகழ்வுகள் எதுவும் கிடைக்கவில்லை.'
                  : 'No activities or events match your current filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="bg-white border-2 border-[#111111] p-7 flex flex-col justify-between hover:bg-[#f1ece2] transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3 text-[13px]">
                      <span className="font-extrabold uppercase text-[#C41A1F]">
                        [{event.category}]
                      </span>
                      <span className="font-helvetica font-extrabold text-[#111111]">
                        {event.date}
                      </span>
                    </div>

                    <h2 className="font-kavivanar font-normal text-[26px] text-[#111111] leading-tight">
                      {event.title[language]}
                    </h2>

                    <p className="text-[16px] text-[#3a322d] leading-relaxed">
                      {event.description[language]}
                    </p>

                    <div className="space-y-1.5 pt-2 text-[14px] text-[#5B5348] border-t border-[#d7d0c3]">
                      <div className="flex items-center gap-2">
                        <IconMapPin className="w-4 h-4 text-[#C41A1F] shrink-0" />
                        <span className="font-semibold text-[#111111]">{event.venue[language]}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold">Time:</span>
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t-2 border-[#111111] flex items-center justify-between">
                    <span className={`text-[12px] font-extrabold uppercase px-3 py-1 border border-[#111111] ${
                      event.status === 'upcoming' ? 'bg-[#E31E24] text-white' : 'bg-[#FAF8F5] text-[#111111]'
                    }`}>
                      {event.status === 'upcoming' 
                        ? (language === 'ta' ? 'வரவிருக்கும் நிகழ்வு' : 'Upcoming') 
                        : (language === 'ta' ? 'நிறைவடைந்தது' : 'Completed')}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="min-h-[44px] px-5 py-2 bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[13px] transition-colors cursor-pointer btn-lift inline-flex items-center gap-2"
                    >
                      <span>{language === 'ta' ? 'முழு விவரம்' : 'View Details'}</span>
                      <IconChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

        </section>

      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#111111] max-w-xl w-full border-4 border-[#111111] p-8 space-y-6">
            
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-4">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  [{selectedEvent.category}]
                </span>
                <h3 className="font-kavivanar font-normal text-[28px] text-[#111111] leading-tight">
                  {selectedEvent.title[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[17px] text-[#3a322d] leading-relaxed">
              {selectedEvent.description[language]}
            </p>

            <div className="p-4 bg-white border-2 border-[#111111] space-y-2 text-[15px]">
              <div>
                <strong className="block text-[#5B5348] text-[13px]">{language === 'ta' ? 'இடம்:' : 'Venue:'}</strong>
                <span>{selectedEvent.venue[language]}</span>
              </div>
              <div>
                <strong className="block text-[#5B5348] text-[13px]">{language === 'ta' ? 'தேதி & நேரம்:' : 'Date & Time:'}</strong>
                <span>{selectedEvent.date} {selectedEvent.time ? `• ${selectedEvent.time}` : ''}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="min-h-[44px] px-8 bg-[#111111] hover:bg-black text-white font-extrabold text-[15px] cursor-pointer"
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
