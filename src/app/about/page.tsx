'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { HISTORICAL_MILESTONES } from '@/data/content';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { 
  IconScale, 
  IconShield, 
  IconCheck, 
  IconStar, 
  IconChevronLeft, 
  IconChevronRight 
} from '@/components/Icons';

export default function AboutPage() {
  const { language } = useLanguage();
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const [showFullIndex, setShowFullIndex] = useState<boolean>(false);

  const section1 = useReveal();
  const section2 = useReveal();
  const section3 = useReveal();
  const section4 = useReveal();

  const currentMilestone = HISTORICAL_MILESTONES[selectedMilestoneIndex] || HISTORICAL_MILESTONES[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'அணி வரலாறு & அரசமைப்பு நோக்கம்' : 'Historical Profile & Constitutional Mandate'}
        description={
          language === 'ta'
            ? 'நீதிமன்றங்களில் சமூக நீதியைப் பாதுகாத்து, மாநில சுயாட்சி உரிமைகளை நிலைநிறுத்தும் ஐந்து தசாப்த கால சட்டப் போராட்டம்.'
            : 'Five decades of constitutional advocacy defending affirmative action, federalism, and human dignity across Indian courts.'
        }
      />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-16">

        {/* 1. Core Pillars of Institutional Responsibility (3 columns ruled) */}
        <section 
          ref={section1.ref}
          className={`fade-rise ${section1.revealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#111111] border-2 border-[#111111] bg-[#FAF8F5]">
            
            <div className="p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#3d3633] pb-2">
                  <span className="text-[12px] font-extrabold text-[#C41A1F] uppercase tracking-normal">
                    SECTION I
                  </span>
                  <IconScale className="w-5 h-5 text-[#C41A1F]" />
                </div>
                <h2 className="font-kavivanar font-normal text-[26px] text-[#111111] leading-tight">
                  {language === 'ta' ? 'அணியின் நோக்கம் & கடமைகள்' : 'Purpose & Responsibilities'}
                </h2>
                <p className="text-[16px] text-[#5B5348] leading-relaxed">
                  {language === 'ta'
                    ? 'அரசமைப்புச் சட்டத்தில் உறுதி செய்யப்பட்டுள்ள சமூக நீதி, பிற்படுத்தப்பட்ட மற்றும் ஒடுக்கப்பட்டோருக்கான இடஒதுக்கீடு, சமஉரிமை ஆகியவற்றை உயர் மற்றும் உச்ச நீதிமன்றங்களில் வாதாடிப் பாதுகாத்தல்.'
                    : 'Defending affirmative action, minority guarantees, and social justice before Constitutional Benches of the Madras High Court and the Supreme Court of India.'}
                </p>
              </div>
              <div className="pt-2 text-[12px] font-bold text-[#111111] uppercase tracking-normal">
                Article 15(4) & 16(4) Shield
              </div>
            </div>

            <div className="p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#3d3633] pb-2">
                  <span className="text-[12px] font-extrabold text-[#C41A1F] uppercase tracking-normal">
                    SECTION II
                  </span>
                  <IconShield className="w-5 h-5 text-[#C41A1F]" />
                </div>
                <h2 className="font-kavivanar font-normal text-[26px] text-[#111111] leading-tight">
                  {language === 'ta' ? 'கழகத்தில் அணியின் பங்கு' : 'Role Within the DMK'}
                </h2>
                <p className="text-[16px] text-[#5B5348] leading-relaxed">
                  {language === 'ta'
                    ? 'கழகத்தின் சட்ட ஆலோசனைக் குழுவாக செயல்பட்டு, சட்டமன்ற மசோதாக்கள், தேர்தல் சட்ட விவகாரங்கள், மற்றும் மாநில உரிமைப் பிரச்னைகளில் அரசமைப்பு வழிகாட்டுதலை வழங்குதல்.'
                    : 'Acting as the party’s apex legal think-tank, drafting legislative defenses, guiding election law strategies, and challenging unconstitutional central interference.'}
                </p>
              </div>
              <div className="pt-2 text-[12px] font-bold text-[#111111] uppercase tracking-normal">
                State Autonomy Think-Tank
              </div>
            </div>

            <div className="p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#3d3633] pb-2">
                  <span className="text-[12px] font-extrabold text-[#C41A1F] uppercase tracking-normal">
                    SECTION III
                  </span>
                  <IconScale className="w-5 h-5 text-[#C41A1F]" />
                </div>
                <h2 className="font-kavivanar font-normal text-[26px] text-[#111111] leading-tight">
                  {language === 'ta' ? 'இலவச சட்ட உதவி & மக்கள் நலன்' : 'Citizen Access to Justice'}
                </h2>
                <p className="text-[16px] text-[#5B5348] leading-relaxed">
                  {language === 'ta'
                    ? 'அனைத்து மாவட்ட நீதிமன்றங்களிலும் எளிய மக்களுக்கு, உழைக்கும் மக்களுக்கு இலவச சட்ட உதவிகளை வழங்குதல் மற்றும் சட்ட விழிப்புணர்வு முகாம்களைத் தொடர்ச்சியாக நடத்துதல்.'
                    : 'Conducting pro-bono legal clinics in all district units, supporting indigent litigants, and ensuring that no citizen is denied justice for want of legal representation.'}
                </p>
              </div>
              <div className="pt-2 text-[12px] font-bold text-[#111111] uppercase tracking-normal">
                74 District Legal Clinics
              </div>
            </div>

          </div>
        </section>

        {/* 2. Visual Heritage Showcase: Two solid framed artwork blocks */}
        <section 
          ref={section2.ref}
          className={`fade-rise ${section2.revealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Banner 1: Campaign Banner */}
            <div className="border-2 border-[#111111] bg-[#111111] text-[#FAF8F5] flex flex-col justify-between overflow-hidden">
              <div className="relative w-full h-72 overflow-hidden bg-[#111111]">
                <img
                  src="/images/dmk-campaign-stalin.jpg"
                  alt="தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6 bg-[#111111] space-y-2 border-t-2 border-[#3d3633]">
                <h3 className="font-kavivanar font-normal text-[28px] text-white leading-snug">
                  தமிழ்நாட்டைத் தலைகுனிய விடமாட்டேன்!
                </h3>
                <p className="text-[15px] text-[#d8cfc2] leading-relaxed">
                  {language === 'ta'
                    ? 'கழகத் தலைவர் மாண்புமிகு முதலமைச்சர் மு.க. ஸ்டாலின் அவர்களின் வழிகாட்டலில் தமிழ்நாட்டின் உரிமைகளையும் தன்மானத்தையும் காக்கும் சட்டக்களம்.'
                    : 'Under Party President & Hon’ble Chief Minister M.K. Stalin, our legal cadre fiercely protects the constitutional rights and self-respect of Tamil Nadu.'}
                </p>
              </div>
            </div>

            {/* Banner 2: Four Leaders Artwork */}
            <div className="border-2 border-[#111111] bg-[#111111] text-[#FAF8F5] flex flex-col justify-between overflow-hidden">
              <div className="relative w-full h-72 overflow-hidden bg-[#111111]">
                <img
                  src="/images/dmk-four-leaders.jpg"
                  alt="கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்!"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6 bg-[#111111] space-y-2 border-t-2 border-[#3d3633]">
                <h3 className="font-kavivanar font-normal text-[26px] text-white leading-snug">
                  &ldquo;கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்!&rdquo;
                </h3>
                <p className="text-[15px] text-[#d8cfc2] leading-relaxed">
                  {language === 'ta'
                    ? 'தந்தை பெரியார், பேரறிஞர் அண்ணா, முத்தமிழறிஞர் கலைஞர் வழியில் சமூக நீதியையும் மாநில சுயாட்சியையும் நீதிமன்றங்களில் வென்றெடுப்போம்.'
                    : 'Continuing the sacred egalitarian mission of Periyar, Anna, Kalaignar, and Stalin in defending social justice across the halls of justice.'}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Constitutional Objectives Schedule */}
        <section 
          ref={section3.ref}
          className={`fade-rise ${section3.revealed ? 'revealed' : ''}`}
        >
          <div className="p-8 sm:p-10 bg-[#FAF8F5] border-2 border-[#111111]">
            <div className="border-b-2 border-[#111111] pb-3 mb-6 flex items-center justify-between">
              <h2 className="font-kavivanar font-normal text-[32px] text-[#111111]">
                {language === 'ta' ? 'அணியின் முதன்மைச் சட்ட நோக்கங்கள்' : 'Constitutional Objectives & Principles'}
              </h2>
              <span className="text-[13px] font-extrabold text-[#C41A1F] uppercase tracking-normal">
                SCHEDULE A
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[16px]">
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
                <div key={i} className="flex items-start gap-3 p-4 bg-[#f1ece2] border border-[#d7d0c3]">
                  <IconCheck className="w-5 h-5 text-[#C41A1F] shrink-0 mt-0.5" />
                  <span className="text-[#111111] leading-relaxed">{obj[language]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Historical Milestones Timeline */}
        <section 
          ref={section4.ref}
          className={`fade-rise ${section4.revealed ? 'revealed' : ''}`}
        >
          <div className="bg-[#FAF8F5] border-2 border-[#111111] p-6 sm:p-10 relative overflow-hidden">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-2 border-[#111111] mb-8">
              <div>
                <h2 className="font-kavivanar font-normal text-[clamp(34px,4.5vw,52px)] text-[#C41A1F] leading-none">
                  {language === 'ta' ? 'நமது வரலாற்றுப் பயணம்' : 'Our Journey'}
                </h2>
                <p className="text-[16px] text-[#5B5348] mt-2 font-medium">
                  {language === 'ta'
                    ? 'நூற்றாண்டு கால சட்டப் போராட்ட வரலாறு • 1921 முதல் 2026 வரை'
                    : 'Over a Century of Legal Milestones • From 1921 to 2026'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#5B5348] font-bold">
                  {language === 'ta'
                    ? `மைல்கல் ${selectedMilestoneIndex + 1} / ${HISTORICAL_MILESTONES.length}`
                    : `Milestone ${selectedMilestoneIndex + 1} of ${HISTORICAL_MILESTONES.length}`}
                </span>

                <button
                  type="button"
                  onClick={() => setShowFullIndex(!showFullIndex)}
                  className="min-h-[44px] px-4 py-2 text-[13px] font-extrabold uppercase bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer btn-lift"
                >
                  {showFullIndex
                    ? (language === 'ta' ? 'சுருக்கப் பார்வை' : 'Interactive View')
                    : (language === 'ta' ? 'அனைத்து மைல்கற்கள்' : 'View Full Index')}
                </button>
              </div>
            </div>

            {/* Timeline Track */}
            <div className="relative py-8 my-4 overflow-x-auto">
              <div className="min-w-[700px] relative px-6">
                
                {/* Background Line */}
                <div className="absolute top-[18px] left-8 right-8 h-[2px] bg-[#d7d0c3] z-0" />

                {/* Active Progress Line */}
                <div 
                  className="absolute top-[18px] left-8 h-[2px] bg-[#E31E24] z-0 transition-all duration-300" 
                  style={{ 
                    width: `calc(${(selectedMilestoneIndex / (HISTORICAL_MILESTONES.length - 1)) * 100}% * ((100% - 64px) / 100))` 
                  }} 
                />

                {/* Star Nodes */}
                <div className="flex items-center justify-between relative z-10">
                  {HISTORICAL_MILESTONES.map((m, idx) => {
                    const isSelected = selectedMilestoneIndex === idx;
                    return (
                      <button
                        key={m.year + idx}
                        type="button"
                        onClick={() => setSelectedMilestoneIndex(idx)}
                        className="group flex flex-col items-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#E31E24] cursor-pointer"
                        title={`${m.year}: ${m.title[language]}`}
                      >
                        <div className={`p-1.5 bg-[#FAF8F5] border-2 transition-transform duration-200 ${
                          isSelected ? 'border-[#E31E24] scale-125' : 'border-[#111111] group-hover:scale-110'
                        }`}>
                          <IconStar 
                            className={`w-5 h-5 ${
                              isSelected ? 'text-[#E31E24]' : 'text-[#5B5348] group-hover:text-[#E31E24]'
                            }`} 
                          />
                        </div>

                        <span className={`text-[14px] mt-2 font-helvetica font-bold ${
                          isSelected ? 'text-[#C41A1F]' : 'text-[#5B5348] group-hover:text-[#111111]'
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
            <div className="mt-8 bg-[#f1ece2] border-2 border-[#111111] p-6 sm:p-10 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3d3633] pb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-helvetica font-extrabold text-[44px] text-[#C41A1F] leading-none">
                      {currentMilestone.year}
                    </span>
                    <span className="text-[12px] font-extrabold uppercase px-3 py-1 bg-[#111111] text-white">
                      {currentMilestone.category}
                    </span>
                  </div>

                  <div className="text-[14px] text-[#5B5348] font-semibold">
                    {language === 'ta'
                      ? `காலவரிசை பதிவு • ${currentMilestone.year}`
                      : `Chronicle Entry • ${currentMilestone.year}`}
                  </div>
                </div>

                <h3 className="font-helvetica font-extrabold text-[28px] text-[#111111] leading-snug">
                  {currentMilestone.title[language]}
                </h3>

                <p className="text-[18px] text-[#3a322d] leading-relaxed max-w-4xl">
                  {currentMilestone.description[language]}
                </p>

                <div className="p-4 bg-white border-l-4 border-[#E31E24] border-y border-r border-[#111111] flex flex-col sm:flex-row sm:items-baseline gap-2 text-[15px] text-[#111111]">
                  <span className="font-extrabold uppercase text-[#C41A1F] shrink-0">
                    {language === 'ta' ? 'அரசமைப்பு முக்கியத்துவம்:' : 'Constitutional Significance:'}
                  </span>
                  <span className="italic">
                    {currentMilestone.significance[language]}
                  </span>
                </div>

                {/* Step Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#111111]">
                  <button
                    type="button"
                    onClick={() => setSelectedMilestoneIndex(prev => Math.max(0, prev - 1))}
                    disabled={selectedMilestoneIndex === 0}
                    className="min-h-[44px] px-5 py-2 bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[14px] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer btn-lift inline-flex items-center gap-2"
                  >
                    <IconChevronLeft className="w-4 h-4" />
                    <span>{language === 'ta' ? 'முந்தைய மைல்கல்' : 'Previous Milestone'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMilestoneIndex(prev => Math.min(HISTORICAL_MILESTONES.length - 1, prev + 1))}
                    disabled={selectedMilestoneIndex === HISTORICAL_MILESTONES.length - 1}
                    className="min-h-[44px] px-5 py-2 bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-extrabold text-[14px] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer btn-lift inline-flex items-center gap-2"
                  >
                    <span>{language === 'ta' ? 'அடுத்த மைல்கல்' : 'Next Milestone'}</span>
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Full Index */}
            {showFullIndex && (
              <div className="mt-12 pt-8 border-t-2 border-[#111111] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {HISTORICAL_MILESTONES.map((m, idx) => (
                    <div 
                      key={m.year + idx}
                      onClick={() => {
                        setSelectedMilestoneIndex(idx);
                        setShowFullIndex(false);
                      }}
                      className={`p-6 border-2 transition-colors cursor-pointer ${
                        selectedMilestoneIndex === idx
                          ? 'bg-[#f1ece2] border-[#E31E24]'
                          : 'bg-white border-[#111111] hover:bg-[#f1ece2]'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#3d3633] pb-2 mb-2">
                        <span className="font-helvetica font-extrabold text-[24px] text-[#C41A1F]">{m.year}</span>
                        <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 bg-[#111111] text-white">
                          {m.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-[#111111] text-[17px] mb-1 leading-snug">
                        {m.title[language]}
                      </h4>
                      <p className="text-[14px] text-[#5B5348] line-clamp-2">
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
    </div>
  );
}
