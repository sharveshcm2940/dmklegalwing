'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { EventItem } from '@/types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  Search, 
  ChevronRight,
  Camera,
  X,
  Filter
} from 'lucide-react';

export default function ActivitiesPage() {
  const { language } = useLanguage();
  const { events } = useData();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const categories = ['All', 'Conference', 'Legal Awareness', 'Seminar', 'Organisational', 'Constitutional'];

  const filteredEvents = events.filter((e) => {
    const matchesTab = activeTab === 'all' || e.status === activeTab;
    const matchesCat = activeCategory === 'All' || e.category === activeCategory;
    const matchesSearch =
      e.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCat && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col space-y-10 py-8 bg-[#FAF7F2] text-[#111111] font-dmk-body">
      
      {/* Broadsheet Masthead Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-y-2 border-neutral-900 p-6 sm:p-10 relative overflow-hidden">
          {/* Dual Party Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="w-1/2 bg-black" />
            <div className="w-1/2 bg-[#E31E24]" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-300 pb-5 mb-6 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#111111] text-white text-[11px] font-english uppercase px-3 py-1 tracking-widest font-bold">
                  {language === 'ta' ? 'களப்பணிகள் & மாநாடுகள்' : 'CAMPAIGNS & LEGAL CONFERENCES'}
                </span>
                <span className="text-xs font-english text-[#C41A1F] font-bold">
                  CITIZEN DEFENSE INITIATIVES
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight uppercase leading-none">
                {language === 'ta'
                  ? 'வழக்கறிஞர் அணி மாநாடுகள் & களப்பணிகள்'
                  : 'Conferences, Legal Clinics & Dispatches'}
              </h1>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right font-english text-[11px] text-neutral-600">
              <p className="font-bold text-[#111111]">STATEWIDE ACTION DOSSIER</p>
              <p>Legal Awareness & Mass Advocacy Drives</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-dmk-body">
                {language === 'ta'
                  ? 'மாநில அளவிலான வழக்கறிஞர்கள் மாநாடு, அரசமைப்பு விழிப்புணர்வுக் கருத்தரங்குகள், இளம் வழக்கறிஞர்களுக்கான சட்டப் பயிலரங்குகள் மற்றும் மாவட்ட இலவச சட்ட உதவி முகாம்களின் அதிகாரப்பூர்வ செய்தி அறிக்கை.'
                  : 'A rich photojournalistic chronicle of State Legal Conferences, Constitutional Seminars, pro-bono citizen legal clinics, and trial advocate workshops organized across all 38 districts of Tamil Nadu.'}
              </p>
            </div>
            <div className="lg:col-span-4 bg-[#FAF7F2] border border-neutral-300 p-4">
              <div className="flex items-center justify-between font-english text-xs text-neutral-700 pb-2 border-b border-neutral-300">
                <span>CONFERENCE RECORD</span>
                <span className="font-bold text-[#C41A1F]">STATEWIDE COVERAGE</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2 font-english">
                Dispatches from High Court Benches, district bar associations, and grassroots sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Broadsheet Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border border-neutral-300 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 border border-neutral-300">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-xs font-english font-bold uppercase transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#E31E24] text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                {language === 'ta' ? 'அனைத்தும்' : 'All'}
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1 text-xs font-english font-bold uppercase transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-[#E31E24] text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                {language === 'ta' ? 'வரவிருப்பவை' : 'Upcoming'}
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1 text-xs font-english font-bold uppercase transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-[#E31E24] text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                {language === 'ta' ? 'நிறைவடைந்தவை' : 'Concluded'}
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 ml-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-2.5 py-1 text-xs font-english font-bold uppercase transition-colors border ${
                    activeCategory === c
                      ? 'bg-[#111111] text-white border-neutral-900'
                      : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {c === 'All' ? (language === 'ta' ? 'அனைத்து வகைகள்' : 'All') : c}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'நிகழ்வு தேடுக...' : 'Search events or venues...'}
              className="w-full bg-[#FAF7F2] border border-neutral-300 pl-9 pr-3 py-1.5 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:border-[#E31E24]"
            />
          </div>

        </div>
      </section>

      {/* Photojournalism Editorial Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <article
              key={evt.id}
              className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors flex flex-col justify-between group"
            >
              <div>
                {/* Dual Party Stripe */}
                <div className="w-full h-1 flex">
                  <div className="w-1/2 bg-black" />
                  <div className="w-1/2 bg-[#E31E24]" />
                </div>

                {/* Photojournalism Framing */}
                <div className="relative h-56 overflow-hidden bg-[#111111] border-b border-neutral-300">
                  <img
                    src={evt.image}
                    alt={evt.title[language]}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className={`text-[10px] font-english font-bold uppercase tracking-wider px-2 py-0.5 border border-black ${
                      evt.status === 'upcoming' ? 'bg-[#E31E24] text-white' : 'bg-[#111111] text-white'
                    }`}>
                      {evt.status === 'upcoming'
                        ? language === 'ta' ? 'வரவிருக்கும் நிகழ்வு' : 'UPCOMING'
                        : language === 'ta' ? 'நிறைவடைந்தது' : 'CONCLUDED'}
                    </span>
                    <span className="text-[10px] font-english bg-white px-2 py-0.5 text-neutral-900 border border-neutral-300 font-bold uppercase">
                      {evt.category}
                    </span>
                  </div>

                  {evt.attendeesCount && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-english bg-black/90 px-2 py-0.5 text-white border border-white/20 z-10">
                      {evt.attendeesCount.toLocaleString()} {language === 'ta' ? 'பங்கேற்பாளர்கள்' : 'ATTENDEES'}
                    </div>
                  )}
                </div>

                {/* Editorial Body */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-english text-neutral-600 border-b border-neutral-200 pb-2">
                    <div className="flex items-center gap-1 font-bold text-neutral-800">
                      <Calendar className="w-3.5 h-3.5 text-[#C41A1F]" />
                      <span>{evt.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#C41A1F]" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#111111] font-dmk-headline group-hover:text-[#C41A1F] transition-colors line-clamp-2 leading-snug">
                    {evt.title[language]}
                  </h3>

                  <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3 font-dmk-body">
                    {evt.description[language]}
                  </p>

                  <div className="pt-2 text-xs text-neutral-800 flex items-start gap-1.5 font-dmk-body">
                    <MapPin className="w-3.5 h-3.5 text-[#C41A1F] shrink-0 mt-0.5" />
                    <span className="line-clamp-1 font-semibold">{evt.venue[language]}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedEvent(evt)}
                  className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#E31E24] hover:text-white border border-neutral-300 hover:border-neutral-900 text-xs font-english font-bold uppercase tracking-wider text-[#111111] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'ta' ? 'நிகழ்ச்சி அறிக்கை & விவரம்' : 'View Full Dispatch'}</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Event Details Broadsheet Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-neutral-900 rounded-none max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-dmk-body">
            
            {/* Top Modal Flag Bar */}
            <div className="w-full h-1 flex absolute top-0 left-0">
              <div className="w-1/2 bg-black" />
              <div className="w-1/2 bg-[#E31E24]" />
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-5 right-5 w-8 h-8 bg-white hover:bg-[#E31E24] hover:text-white text-neutral-900 border border-neutral-300 flex items-center justify-center font-bold text-sm transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 mt-2">
              <div className="flex flex-wrap gap-2 text-xs font-english">
                <span className="bg-[#E31E24] text-white font-bold px-2.5 py-0.5 border border-neutral-900">
                  {selectedEvent.category}
                </span>
                <span className="bg-white text-neutral-900 px-2.5 py-0.5 border border-neutral-300 font-bold">
                  {selectedEvent.date} ({selectedEvent.time})
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline leading-tight">
                {selectedEvent.title[language]}
              </h2>

              <div className="p-3 bg-white border border-neutral-300 text-xs text-neutral-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C41A1F]" />
                <span><strong>{language === 'ta' ? 'இடம்:' : 'Venue:'}</strong> {selectedEvent.venue[language]}</span>
              </div>

              {selectedEvent.chiefGuest && (
                <div className="p-3 bg-[#F3EFE6] border border-neutral-300 text-xs text-neutral-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C41A1F]" />
                  <span><strong>{language === 'ta' ? 'தலைமை:' : 'Presided By:'}</strong> {selectedEvent.chiefGuest[language]}</span>
                </div>
              )}

              <div className="border border-neutral-300 overflow-hidden max-h-72 bg-neutral-900">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title[language]}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <h4 className="font-english text-xs font-bold text-neutral-900 uppercase tracking-wider pb-1 border-b border-neutral-300">
                  {language === 'ta' ? 'நிகழ்ச்சி அறிக்கை & தீர்மானங்கள்' : 'EVENT CHRONICLE & OFFICIAL DELIBERATIONS'}
                </h4>
                <p className="text-sm text-neutral-800 leading-relaxed font-dmk-body">
                  {selectedEvent.description[language]}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-english">
                  DMK Legal Wing Secretariat Archives
                </span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-1.5 bg-[#111111] hover:bg-[#E31E24] text-white border border-neutral-900 text-xs font-english font-bold uppercase tracking-wider"
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
