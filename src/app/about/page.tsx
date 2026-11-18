'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { HISTORICAL_MILESTONES, DMK_ORGANISATION_INFO } from '@/data/content';
import { 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Gavel, 
  History, 
  Filter,
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const [showFullIndex, setShowFullIndex] = useState<boolean>(false);

  const currentMilestone = HISTORICAL_MILESTONES[selectedMilestoneIndex] || HISTORICAL_MILESTONES[0];

  return (
    <div className="w-full flex flex-col space-y-12 py-10 font-dmk-body bg-[#FAF7F2]">
      
      {/* 1. Historical Broadsheet Editorial Masthead */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-y-2 border-neutral-900 p-8 sm:p-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 border-b border-neutral-300 pb-2">
              <span className="text-xs font-bold text-[#E31E24] tracking-[0.2em] uppercase font-english">
                {language === 'ta' ? 'அமைப்பு வரலாறு & அரசமைப்பு நோக்கம்' : 'HISTORICAL PROFILE & CONSTITUTIONAL MANDATE'}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-english text-neutral-500">1971–2026 ARCHIVE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-dmk-headline tracking-tight leading-tight">
              {language === 'ta'
                ? 'திமுக வழக்கறிஞர் அணி: அரை நூற்றாண்டு அரசமைப்புப் போர்ப்படை'
                : 'DMK Legal Wing: Half a Century of Constitutional Advocacy'}
            </h1>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-english border-l-4 border-[#E31E24] pl-4 py-1">
              {language === 'ta'
                ? 'நீதிமன்றங்களில் சமூக நீதியைப் பாதுகாத்து, மாநிலங்களின் சுயாட்சி உரிமைகளை நிலைநிறுத்தி, எளிய மனிதர்களின் ஜனநாயகக் குரலாக விளங்கும் திராவிட முன்னேற்றக் கழகத்தின் முதன்மை வழக்கறிஞர்கள் கூட்டமைப்பு.'
                : 'The official legal vanguard of the Dravidian Movement. For over five decades, uniting thousands of advocates to defend affirmative action, defeat centralist overreach, and deliver legal awareness across Tamil Nadu.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Three Editorial Responsibility Columns (Broadsheet Continuous Columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-neutral-300 border border-neutral-300 bg-white">
          
          <div className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-bold text-[#B81318] uppercase font-english">SECTION I</span>
                <Scale className="w-5 h-5 text-[#E31E24]" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-dmk-headline">
                {language === 'ta' ? 'அணியின் நோக்கம் & கடமைகள்' : 'Purpose & Responsibilities'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body">
                {language === 'ta'
                  ? 'அரசமைப்புச் சட்டத்தில் உறுதி செய்யப்பட்டுள்ள சமூக நீதி, பிற்படுத்தப்பட்ட மற்றும் ஒடுக்கப்பட்டோருக்கான இடஒதுக்கீடு, சமஉரிமை ஆகியவற்றை உயர் மற்றும் உச்ச நீதிமன்றங்களில் வாதாடிப் பாதுகாத்தல்.'
                  : 'Defending affirmative action, minority guarantees, and social justice before Constitutional Benches of the Madras High Court and the Supreme Court of India.'}
              </p>
            </div>
            <div className="pt-2 text-[11px] font-english text-neutral-500 uppercase">Article 15(4) & 16(4) Shield</div>
          </div>

          <div className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-bold text-[#B81318] uppercase font-english">SECTION II</span>
                <ShieldCheck className="w-5 h-5 text-[#E31E24]" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-dmk-headline">
                {language === 'ta' ? 'கழகத்தில் அணியின் பங்கு' : 'Role Within the DMK'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body">
                {language === 'ta'
                  ? 'கழகத்தின் சட்ட ஆலோசனைக் குழுவாக செயல்பட்டு, சட்டமன்ற மசோதாக்கள், தேர்தல் சட்ட விவகாரங்கள், மற்றும் மாநில உரிமைப் பிரச்னைகளில் அரசமைப்பு வழிகாட்டுதலை வழங்குதல்.'
                  : 'Acting as the party’s apex legal think-tank, drafting legislative defenses, guiding election law strategies, and challenging unconstitutional central interference.'}
              </p>
            </div>
            <div className="pt-2 text-[11px] font-english text-neutral-500 uppercase">State Autonomy Think-Tank</div>
          </div>

          <div className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-bold text-[#B81318] uppercase font-english">SECTION III</span>
                <Gavel className="w-5 h-5 text-[#E31E24]" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-dmk-headline">
                {language === 'ta' ? 'இலவச சட்ட உதவி & மக்கள் நலன்' : 'Citizen Access to Justice'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body">
                {language === 'ta'
                  ? 'அனைத்து மாவட்ட நீதிமன்றங்களிலும் எளிய மக்களுக்கு, உழைக்கும் மக்களுக்கு இலவச சட்ட உதவிகளை வழங்குதல் மற்றும் சட்ட விழிப்புணர்வு முகாம்களைத் தொடர்ச்சியாக நடத்துதல்.'
                  : 'Conducting pro-bono legal clinics in all 38 districts, supporting indigent litigants, and ensuring that no citizen is denied justice for want of legal representation.'}
              </p>
            </div>
            <div className="pt-2 text-[11px] font-english text-neutral-500 uppercase">38 District Legal Clinics</div>
          </div>

        </div>
      </section>

      {/* 3. Dual Official Visual Heritage Showcase (Broadsheet Plate Framing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Banner 1: Official Campaign Banner with Thalapathi M.K. Stalin */}
          <div className="border border-neutral-300 bg-[#FAF7F2] flex flex-col justify-between group overflow-hidden">
            <div className="relative w-full h-64 sm:h-72 overflow-hidden flex items-center justify-center bg-[#F9C300]">
              <img
                src="/images/dmk-campaign-stalin.jpg"
                alt="தமிழ்நாட்டை தலைகுனிய விடமாட்டேன்!"
                className="w-full h-full object-cover object-center filter saturate-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-black text-white font-english">
                  {language === 'ta' ? 'களப் பிரகடனம்' : 'CAMPAIGN DECLARATION'}
                </span>
              </div>
            </div>
            <div className="p-6 bg-[#111111] text-white space-y-2 border-t border-neutral-800">
              <h3 className="text-2xl sm:text-3xl font-dmk-headline text-white leading-tight">
                தமிழ்நாட்டை தலைகுனிய விடமாட்டேன்!
              </h3>
              <p className="text-xs text-neutral-300 font-dmk-body leading-relaxed">
                {language === 'ta'
                  ? 'கழகத் தலைவர் மாண்புமிகு முதலமைச்சர் மு.க. ஸ்டாலின் அவர்களின் வழிகாட்டலில் தமிழ்நாட்டின் உரிமைகளையும் தன்மானத்தையும் காக்கும் சட்டக்களம்.'
                  : 'Under Party President & Hon’ble Chief Minister M.K. Stalin, our legal cadre fiercely protects the constitutional rights and self-respect of Tamil Nadu.'}
              </p>
            </div>
          </div>

          {/* Banner 2: Four Leaders Panoramic Heritage Artwork */}
          <div className="border border-neutral-300 bg-[#FAF7F2] flex flex-col justify-between group overflow-hidden">
            <div className="relative w-full h-64 sm:h-72 overflow-hidden flex items-center justify-center bg-[#2A1208]">
              <img
                src="/images/dmk-four-leaders.jpg"
                alt="கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
                className="w-full h-full object-cover object-center filter saturate-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-black/85 text-[#FFD166] border border-[#FFD166]/40 font-english">
                  {language === 'ta' ? 'கொள்கை வழிகாட்டிகள்' : 'IDEOLOGICAL MENTORS'}
                </span>
              </div>
            </div>
            <div className="p-6 bg-[#180A04] text-white space-y-2 border-t border-amber-950">
              <h3 className="text-xl sm:text-2xl font-dmk-slogan text-[#FFE8A3] leading-snug">
                "கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
              </h3>
              <p className="text-xs text-neutral-300 font-dmk-body leading-relaxed">
                {language === 'ta'
                  ? 'தந்தை பெரியார், பேரறிஞர் அண்ணா, முத்தமிழறிஞர் கலைஞர் வழியில் சமூக நீதியையும் மாநில சுயாட்சியையும் நீதிமன்றங்களில் வென்றெடுப்போம்.'
                  : 'Continuing the sacred egalitarian mission of Periyar, Anna, Kalaignar, and Stalin in defending social justice across the halls of justice.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Constitutional Objectives Checklist (Gazette Schedule Format) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-10 bg-white border border-neutral-300">
          <div className="border-b border-neutral-300 pb-3 mb-6 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline">
              {language === 'ta' ? 'அணியின் முதன்மைச் சட்ட நோக்கங்கள்' : 'Constitutional Objectives & Principles'}
            </h2>
            <span className="text-xs font-bold text-[#E31E24] uppercase font-english">SCHEDULE A</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {[
              {
                en: 'Constitutional safeguarding of Tamil Nadu’s 69% reservation in education and public employment.',
                ta: 'கல்வி மற்றும் அரசுப் பணிகளில் தமிழ்நாட்டின் 69% இடஒதுக்கீட்டு உரிமையை உச்ச நீதிமன்றத்தில் பாதுகாத்தல்.'
              },
              {
                en: 'Advocating for Tamil as an official language in the Madras High Court under Article 348(2).',
                ta: 'அரசமைப்பு உறுப்பு 348(2)-ன் கீழ் சென்னை உயர் நீதிமன்றத்தில் தமிழை வழக்காடு மொழியாக நடைமுறைப்படுத்துதல்.'
              },
              {
                en: 'Upholding State legislative sovereignty against gubernatorial delays under Article 200.',
                ta: 'சட்டப்பேரவை நிறைவேற்றும் மசோதாக்களை ஆளுநர்கள் முடக்குவதற்கு எதிராக அரசமைப்புப் பிரிவு 200-ஐ நிலைநிறுத்துதல்.'
              },
              {
                en: 'Defending the federal character of India against unitary impositions like NEET and fiscal centralization.',
                ta: 'நீட் தேர்வு போன்ற ஒருமுகப்படுத்தப்பட்ட திணிப்புகளுக்கு எதிராக மாநில கல்வி, சுகாதார அதிகாரங்களைப் பாதுகாத்தல்.'
              },
              {
                en: 'Providing welfare support, orientation camps, and professional stipends for junior advocates.',
                ta: 'இளம் வழக்கறிஞர்களுக்கான தொழில்முறை வழிகாட்டுதல்கள் மற்றும் மாதாந்திர நலத்திட்டங்களை முன்னெடுத்தல்.'
              },
              {
                en: 'Protecting civil liberties against arbitrary misuse of central investigative and preventive detention laws.',
                ta: 'அரசியல் உள்நோக்கம் கொண்ட பழிவாங்கும் நடவடிக்கைகள் மற்றும் தடுப்புக் காவல் சட்டங்களுக்கு எதிராக சட்டப்போர் நடத்துதல்.'
              }
            ].map((obj, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-[#FAF7F2] border border-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                <span className="text-neutral-900 leading-relaxed font-dmk-body">{obj[language]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Historical Milestones Timeline (Our Journey - Star Timeline) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border border-neutral-300 p-6 sm:p-10 relative overflow-hidden">
          
          {/* Section Header Matching Reference Image */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-300 mb-8">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#8B0000] font-dmk-headline tracking-tight leading-none">
                {language === 'ta' ? 'நமது வரலாற்றுப் பயணம்' : 'Our Journey'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-dmk-headline mt-2">
                {language === 'ta'
                  ? 'நூற்றாண்டு கால சட்டப் போராட்ட வரலாறு • 1921 முதல் 2026 வரை'
                  : 'Over a Century of Legal Milestones • From 1921 to 2026'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-500 font-semibold">
                {language === 'ta'
                  ? `மைல்கல் ${selectedMilestoneIndex + 1} / ${HISTORICAL_MILESTONES.length}`
                  : `Milestone ${selectedMilestoneIndex + 1} of ${HISTORICAL_MILESTONES.length}`}
              </span>

              <button
                onClick={() => setShowFullIndex(!showFullIndex)}
                className="px-3 py-1.5 text-xs font-english font-bold uppercase tracking-wider border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-colors"
              >
                {showFullIndex
                  ? (language === 'ta' ? 'சுருக்கப் பார்வை' : 'Interactive View')
                  : (language === 'ta' ? 'அனைத்து மைல்கற்கள்' : 'View Full Index')}
              </button>
            </div>
          </div>

          {/* Interactive Star Timeline Track (Exact Replica of Reference Design) */}
          <div className="relative py-10 my-4 overflow-x-auto scrollbar-none">
            <div className="min-w-[700px] relative px-6">
              
              {/* Background Grey Track Line */}
              <div className="absolute top-[18px] left-8 right-8 h-[2px] bg-neutral-300 z-0" />

              {/* Active Crimson Progress Track Line */}
              <div 
                className="absolute top-[18px] left-8 h-[2px] bg-[#8B0000] z-0 transition-all duration-500" 
                style={{ 
                  width: `calc(${(selectedMilestoneIndex / (HISTORICAL_MILESTONES.length - 1)) * 100}% * ((100% - 64px) / 100))` 
                }} 
              />

              {/* Star Nodes along the Track */}
              <div className="flex items-center justify-between relative z-10">
                {HISTORICAL_MILESTONES.map((m, idx) => {
                  const isSelected = selectedMilestoneIndex === idx;
                  return (
                    <button
                      key={m.year + idx}
                      onClick={() => setSelectedMilestoneIndex(idx)}
                      className="group flex flex-col items-center focus:outline-none cursor-pointer transition-transform"
                      title={`${m.year}: ${m.title[language]}`}
                    >
                      {/* 5-Pointed Star Icon */}
                      <div className={`p-1 bg-white rounded-full transition-transform duration-300 ${
                        isSelected ? 'scale-125' : 'group-hover:scale-115'
                      }`}>
                        <Star 
                          className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                            isSelected
                              ? 'text-[#8B0000] fill-[#8B0000]'
                              : 'text-neutral-400 fill-neutral-300 group-hover:text-[#8B0000] group-hover:fill-[#8B0000]'
                          }`} 
                        />
                      </div>

                      {/* Year Label */}
                      <span className={`text-xs sm:text-sm font-english mt-2.5 transition-colors duration-200 select-none ${
                        isSelected
                          ? 'text-[#8B0000] font-black'
                          : 'text-neutral-400 group-hover:text-neutral-800 font-semibold'
                      }`}>
                        {m.year}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Detailed Selected Milestone Card */}
          <div className="mt-8 bg-[#FAF7F2] border border-neutral-300 p-6 sm:p-10 relative overflow-hidden transition-all duration-300">
            {/* Subtle Watermark Year in Background */}
            <div className="absolute -right-4 -bottom-6 opacity-5 pointer-events-none select-none text-[120px] sm:text-[180px] font-black font-english text-neutral-900 leading-none">
              {currentMilestone.year}
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 pb-4 mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-5xl font-black text-[#8B0000] font-english tracking-tight">
                    {currentMilestone.year}
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-white text-neutral-800 border border-neutral-300">
                    {currentMilestone.category}
                  </span>
                </div>

                <div className="text-xs font-mono text-neutral-500 font-semibold">
                  {language === 'ta'
                    ? `காலவரிசை பதிவு • ${currentMilestone.year}`
                    : `Chronicle Entry • ${currentMilestone.year}`}
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 font-dmk-headline mb-3 leading-snug">
                {currentMilestone.title[language]}
              </h3>

              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-dmk-body mb-6 max-w-4xl">
                {currentMilestone.description[language]}
              </p>

              <div className="p-4 bg-white border-l-4 border-[#8B0000] border-y border-r border-neutral-200 flex flex-col sm:flex-row sm:items-baseline gap-2 text-xs sm:text-sm text-neutral-800 mb-6">
                <span className="font-bold uppercase tracking-wider text-[#8B0000] font-english shrink-0">
                  {language === 'ta' ? 'அரசமைப்பு முக்கியத்துவம்:' : 'Constitutional Significance:'}
                </span>
                <span className="font-dmk-body italic">
                  {currentMilestone.significance[language]}
                </span>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-300 text-xs font-english font-bold uppercase tracking-wider">
                <button
                  onClick={() => setSelectedMilestoneIndex(prev => Math.max(0, prev - 1))}
                  disabled={selectedMilestoneIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-300 hover:border-black text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-[#8B0000]" />
                  <span>{language === 'ta' ? 'முந்தைய மைல்கல்' : 'Previous Milestone'}</span>
                </button>

                <span className="text-neutral-500 font-mono text-[11px] hidden sm:inline">
                  {language === 'ta'
                    ? 'நட்சத்திரத்தைக் கிளிக் செய்து வரலாற்றை அறிக'
                    : 'Click any star above or use navigation buttons'}
                </span>

                <button
                  onClick={() => setSelectedMilestoneIndex(prev => Math.min(HISTORICAL_MILESTONES.length - 1, prev + 1))}
                  disabled={selectedMilestoneIndex === HISTORICAL_MILESTONES.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-300 hover:border-black text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span>{language === 'ta' ? 'அடுத்த மைல்கல்' : 'Next Milestone'}</span>
                  <ChevronRight className="w-4 h-4 text-[#8B0000]" />
                </button>
              </div>
            </div>
          </div>

          {/* Full Chronological Gazette Index (Collapsible / Expandable) */}
          {showFullIndex && (
            <div className="mt-12 pt-8 border-t-2 border-neutral-900 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
                <h4 className="text-lg font-black text-neutral-900 font-dmk-headline">
                  {language === 'ta' ? 'முழு காலவரிசைப் பட்டியல்' : 'Complete Chronological Archive'}
                </h4>
                <span className="text-xs font-mono text-neutral-500">
                  10 {language === 'ta' ? 'வரலாற்று மைல்கற்கள்' : 'Key Milestones'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {HISTORICAL_MILESTONES.map((m, idx) => (
                  <div 
                    key={m.year + idx}
                    onClick={() => {
                      setSelectedMilestoneIndex(idx);
                      setShowFullIndex(false);
                    }}
                    className={`p-5 border transition-all cursor-pointer ${
                      selectedMilestoneIndex === idx
                        ? 'bg-white border-[#8B0000] shadow-sm'
                        : 'bg-[#FAF7F2] border-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-2">
                      <span className="text-xl font-black text-[#8B0000] font-english">{m.year}</span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-white border border-neutral-200">
                        {m.category}
                      </span>
                    </div>
                    <h5 className="font-bold text-neutral-900 font-dmk-headline text-sm mb-1 leading-snug">
                      {m.title[language]}
                    </h5>
                    <p className="text-xs text-neutral-600 font-dmk-body line-clamp-2">
                      {m.description[language]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
