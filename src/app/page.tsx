'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { IDEOLOGY_PILLARS, DMK_ORGANISATION_INFO } from '@/data/content';
import { DmkHeroSlider } from '@/components/DmkHeroSlider';
import { 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink,
  Scale,
  Quote,
  CheckCircle2,
  BookOpen,
  Award,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { events } = useData();
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const upcomingEvents = events.slice(0, 2);
  const activePillar = IDEOLOGY_PILLARS[activePillarIndex] || IDEOLOGY_PILLARS[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-dmk-body">
      
      {/* 1. HERO SLIDER SECTION (Clean border, no card shadow) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-6 border-b border-neutral-300">
        <DmkHeroSlider />
      </section>

      {/* 2. OFFICIAL METRICS REGISTER (Prestigious Dravidian Movement Impact Strip) */}
      <section className="bg-[#111111] text-white border-y-2 border-[#E31E24] py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800 text-center">
            
            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'பதிவுபெற்ற வழக்கறிஞர்கள்' : 'REGISTERED ADVOCATES'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-white block my-1 tracking-tight">
                {DMK_ORGANISATION_INFO.barCountEstimated}
              </span>
              <span className="text-xs text-[#FFB703] font-dmk-body block">
                {language === 'ta' ? 'தமிழ்நாடு & புதுச்சேரி வழக்கறிஞர்கள் அரண்' : 'Tamil Nadu & Puducherry Legal Cadre'}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'அமைப்பு மாவட்டக் கட்டமைப்பு' : 'DISTRICT JURISDICTIONS'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-[#E31E24] block my-1 tracking-tight">
                74 / 74
              </span>
              <span className="text-xs text-neutral-300 font-dmk-body block">
                {language === 'ta' ? 'அனைத்து அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்' : 'Active Units in All 74 Party Districts'}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'வரலாற்றுப் பின்னணி' : 'CONSTITUTIONAL ADVOCACY'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-white block my-1 tracking-tight">
                50+ Years
              </span>
              <span className="text-xs text-[#FFB703] font-dmk-body block">
                {language === 'ta' ? '1971 முதல் தொடரும் மக்கள் சட்டப்பணி' : 'Continuous Jurisprudence Since 1971'}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-[11px] font-english font-bold uppercase text-neutral-400 tracking-widest block">
                {language === 'ta' ? 'சமூக நீதி அரண்' : 'AFFIRMATIVE ACTION SHIELD'}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-english text-[#E31E24] block my-1 tracking-tight">
                69% Quota
              </span>
              <span className="text-xs text-neutral-300 font-dmk-body block">
                {language === 'ta' ? '9-வது அட்டவணையில் அரசமைப்புப் பாதுகாப்பு' : 'Ninth Schedule Constitutional Protection'}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FRONT-PAGE EDITORIAL & FOUR MENTORS (Clean 2-Column Split, No Boxed Cards) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 border-b border-neutral-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Lead Editorial Column */}
          <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-neutral-300 pb-8 lg:pb-0">
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2.5">
              <span className="text-xs font-english font-bold text-[#E31E24] tracking-[0.2em] uppercase">
                {language === 'ta' ? 'தலைமை தலையங்கம்' : 'LEAD EDITORIAL DISPATCH'}
              </span>
              <span className="text-xs font-english font-bold text-neutral-500">
                CHENNAI — HIGH COURT DESK
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 font-dmk-headline leading-tight">
              {t.intro.title}
            </h2>

            <div className="broadsheet-dropcap text-sm sm:text-base text-neutral-800 leading-relaxed font-dmk-body space-y-4">
              <p>
                {t.intro.p1}
              </p>
              <p className="border-l-4 border-[#E31E24] pl-4 py-2 italic bg-[#FAF7F2] text-neutral-900 font-serif text-sm sm:text-base">
                {t.intro.p2}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
              <span className="text-xs font-english font-bold text-neutral-600 uppercase">
                {language === 'ta' ? 'அண்ணா அறிவாலயம் தலைமைப் பிரகடனம்' : 'SECRETARIAT OFFICIAL COMMUNIQUÉ'}
              </span>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E31E24] hover:text-black font-dmk-headline group"
              >
                <span>{t.intro.readMore}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right: Four Mentors Banner & Slogan */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-black border-2 border-neutral-900 shadow-xl group">
              <img
                src="/images/dmk-four-leaders.jpg"
                alt="கொள்கை தலைவர்கள்: பெரியார், அண்ணா, கலைஞர், ஸ்டாலின்"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-english font-bold uppercase tracking-widest px-2.5 py-1 bg-black/90 text-[#FFD166] border border-[#FFD166]/40">
                  {language === 'ta' ? 'கொள்கைப் பிரகடனம்' : 'IDEOLOGICAL DOCTRINE'}
                </span>
              </div>
            </div>

            <div className="p-5 bg-[#FAF7F2] border-l-4 border-[#E31E24] space-y-3">
              <p className="text-lg sm:text-xl font-dmk-slogan text-neutral-900 leading-snug">
                "கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!"
              </p>
              
              <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-xs font-english">
                <span className="text-neutral-800 font-bold">
                  பெரியார் • அண்ணா • கலைஞர் • ஸ்டாலின்
                </span>
                <Link
                  href="/ideology"
                  className="text-[#E31E24] hover:underline font-bold"
                >
                  {language === 'ta' ? 'கொள்கைப் பார்வை →' : 'Explore →'}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE SIX IDEOLOGICAL PILLARS (Authentic Human-Designed Broadsheet Spread) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 border-b border-neutral-300">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-[#E31E24]" />
              <span className="text-[11px] font-english font-bold uppercase tracking-[0.2em] text-[#E31E24]">
                {language === 'ta' ? 'அரசமைப்பு அடிப்படைக் கோட்பாடுகள்' : 'FOUNDATIONAL CONSTITUTIONAL DOCTRINES'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 font-dmk-headline tracking-tight uppercase leading-tight">
              {language === 'ta'
                ? 'திராவிட இயக்கத்தின் 6 முதன்மை அரசமைப்பு விழுமியங்கள்'
                : 'The Six Ideological Pillars'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif italic mt-1 max-w-2xl">
              {language === 'ta'
                ? 'நீதிமன்றங்களில் சமூக நீதி, மாநில சுயாட்சி மற்றும் அரசமைப்பு ஜனநாயகத்தைப் பாதுகாக்கும் அரை நூற்றாண்டு கால சட்டப்போர்.'
                : 'Five decades of constitutional defense before the Madras High Court and Supreme Court of India.'}
            </p>
          </div>

          <Link
            href="/ideology"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-[#E31E24] text-white text-xs font-english font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            <span>{language === 'ta' ? 'முழு கொள்கை ஆவணம்' : 'Explore Full Treatise'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Edition Sub-Header Band */}
        <div className="py-2.5 px-4 bg-[#FAF7F2] border-b border-neutral-300 flex items-center justify-between text-[11px] font-mono text-neutral-600">
          <span className="uppercase tracking-wider font-semibold">
            {language === 'ta' ? 'அத்தியாயம் • கொள்கை நெறிமுறைகள்' : 'SECTION • CONSTITUTIONAL JURISPRUDENCE'}
          </span>
          <span className="hidden sm:inline text-neutral-400">
            {language === 'ta' ? '1971 முதல் தொடரும் சட்டப் பாதுகாப்பு' : 'UNBROKEN ADVOCACY SINCE 1971'}
          </span>
          <span className="text-[#E31E24] font-bold uppercase tracking-wider">
            {language === 'ta' ? '6 முதன்மைக் கோட்பாடுகள்' : '6 CORE PILLARS'}
          </span>
        </div>

        {/* Continuous Broadsheet Grid (No Separate Boxy Cards - Authentic Shared Newspaper Hairlines) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-neutral-300 bg-[#FAF7F2]/40">
          {[
            {
              id: 'social-justice',
              num: '01',
              statute: { en: 'Article 15(4) & 16(4)', ta: 'உறுப்பு 15(4) & 16(4)' },
              milestone: {
                en: '69% Reservation • Ninth Schedule Shield',
                ta: '69% இடஒதுக்கீடு • 9-வது அட்டவணைப் பாதுகாப்பு'
              },
              title: { en: 'Social Justice & Affirmative Action', ta: 'சமூக நீதியும் இடஒதுக்கீடும்' },
              tamilSubtitle: 'சமூகநீதி • விகிதாசாரப் பிரதிநிதித்துவம்',
              desc: {
                en: 'The bedrock of the Dravidian movement. Protecting Tamil Nadu’s historic 69% reservation in the Supreme Court of India, defending the Ninth Schedule shield, and resisting economic and administrative dilution of affirmative action.',
                ta: 'திராவிட இயக்கத்தின் அடித்தளம் சமூக நீதியாகும். தமிழ்நாட்டின் வரலாற்றுச் சிறப்புமிக்க 69% இடஒதுக்கீட்டை உச்ச நீதிமன்றத்தில் பாதுகாப்பதிலும், 9-வது அட்டவணை பாதுகாப்பை உறுதி செய்வதிலும் முதன்மைப் பங்கு.'
              }
            },
            {
              id: 'self-respect',
              num: '02',
              statute: { en: 'Hindu Marriage Act • Sec 7A', ta: 'பிரிவு 7A • திருமணச் சட்டம்' },
              milestone: {
                en: '1967 Statutory Reform • Priestless Marriages',
                ta: '1967 சட்ட சீர்திருத்தம் • சுயமரியாதைத் திருமணம்'
              },
              title: { en: 'Self-Respect & Human Dignity', ta: 'சுயமரியாதையும் மனித மாண்பும்' },
              tamilSubtitle: 'சுயமரியாதை • சாதியற்ற சமத்துவ வாழ்வு',
              desc: {
                en: 'Self-respect precedes political freedom. Legalised priestless Self-Respect marriages under Arignar Anna in 1967, ending priestly hegemony, and pioneering equal property rights for women in 1989 under Kalaignar.',
                ta: 'சுயமரியாதை என்பது அரசியல் விடுதலையை விட முதன்மையானது. 1967-ல் பேரறிஞர் அண்ணா ஆட்சியில் சுயமரியாதைத் திருமணங்களைச் சட்டபூர்வமாக்கி, பெண்களுக்கு சொத்தில் சமஉரிமை பெற்றுத்தந்த சாதனை வரலாறு.'
              }
            },
            {
              id: 'federalism',
              num: '03',
              statute: { en: 'Article 356 & 200 • Rajamannar', ta: 'உறுப்பு 356 & 200 • சுயாட்சி' },
              milestone: {
                en: 'State Autonomy • Anti-Centralisation',
                ta: 'மாநில சுயாட்சி • அதிகாரக் குவிப்பு எதிர்ப்பு'
              },
              title: { en: 'Federalism & State Autonomy', ta: 'கூட்டாட்சியும் மாநில சுயாட்சியும்' },
              tamilSubtitle: 'மத்தியில் கூட்டாட்சி • மாநிலத்தில் சுயாட்சி',
              desc: {
                en: 'The Indian Constitution envisages a Union of States. Fiercely defending federal balance against central overreach, misuse of Article 356, appointment overreach by Governors, and fiscal centralization.',
                ta: 'மத்தியில் கூட்டாட்சி, மாநிலத்தில் சுயாட்சி. ஆளுநர்களின் சட்டவிரோத முடக்கங்கள், பிரிவு 356 தவறாகப் பயன்படுத்தப்படுதல் மற்றும் நிதி ஒருமுகப்படுத்தலுக்கு எதிரான சமரசமற்ற சட்டப் போராட்டம்.'
              }
            },
            {
              id: 'rationalism',
              num: '04',
              statute: { en: 'Article 51A(h) • Secularism', ta: 'உறுப்பு 51A(h) • பகுத்தறிவு' },
              milestone: {
                en: 'Scientific Temper • Secular Civic Space',
                ta: 'அறிவியல் மனப்பான்மை • மதசார்பற்ற பொதுவெளி'
              },
              title: { en: 'Rationalism & Scientific Temper', ta: 'பகுத்தறிவும் அறிவியல் மனப்பான்மையும்' },
              tamilSubtitle: 'பகுத்தறிவு • மதச்சார்பின்மை பாதுகாப்பு',
              desc: {
                en: 'Article 51A(h) makes it the fundamental duty of every citizen to develop scientific temper and humanism. Resisting unconstitutional religious dogma in school curricula, judicial processes, and civil administration.',
                ta: 'அரசியலமைப்புச் சட்டத்தின் 51A(h) பிரிவு அறிவியல் மனப்பான்மை மற்றும் ஆய்வறிவை அடிப்படைக் கடமையாகக் குறிப்பிடுகிறது. மதவாத மற்றும் மூடநம்பிக்கைக் கருத்துகள் அரசு நிர்வாகத்தில் திணிக்கப்படுவதை முறியடித்தல்.'
              }
            },
            {
              id: 'tamil-language',
              num: '05',
              statute: { en: 'Article 348(2) • Court Tamil', ta: 'உறுப்பு 348(2) • வழக்காடு மொழி' },
              milestone: {
                en: 'Vernacular Justice • High Court Official Language',
                ta: 'உயர் நீதிமன்றத்தில் தமிழ் • மக்கள் மொழி நீதி'
              },
              title: { en: 'Tamil Language Rights in Courts', ta: 'நீதிமன்றங்களில் தமிழ் மொழி உரிமை' },
              tamilSubtitle: 'தாய்மொழி உரிமை • உயர்நீதிமன்றத்தில் தமிழ்',
              desc: {
                en: 'Justice cannot be inaccessible to the common person who speaks Tamil. Steadfastly campaigning under Article 348(2) to permit the use of Tamil in the Madras High Court and producing authoritative vernacular statutes.',
                ta: 'ஆங்கிலம் தெரியாத சாமானிய மக்களுக்கு நீதி அன்னியப்பட்டு விடக்கூடாது. சென்னை உயர் நீதிமன்றத்தில் தமிழை வழக்காடு மொழியாக நடைமுறைப்படுத்த அரசமைப்புச் சட்டப்படியான தொடர் சட்டப் போராட்டம்.'
              }
            },
            {
              id: 'constitutional-democracy',
              num: '06',
              statute: { en: 'Basic Structure & Rule of Law', ta: 'அடிப்படை கட்டமைப்பு & ஜனநாயகம்' },
              milestone: {
                en: 'Emergency 1975 • MISA Habeas Corpus',
                ta: '1975 அவசரநிலை • ஆட்கொணர்வு சட்டப்போராட்டம்'
              },
              title: { en: 'Constitutional Democracy & Rule of Law', ta: 'அரசமைப்பு ஜனநாயகமும் சட்டத்தின் ஆட்சியும்' },
              tamilSubtitle: 'ஜனநாயக உரிமை • நீதித்துறை சுதந்திரம்',
              desc: {
                en: 'Rooted in Dr. B.R. Ambedkar’s constitutional safeguards. Standing heroically during the Emergency of 1975 defending habeas corpus petitions, civil liberties, and the foundational independence of the judiciary.',
                ta: 'அண்ணல் அம்பேத்கர் வகுத்தளித்த அரசமைப்பு விழுமியங்களின் வழியில், ஜனநாயக உரிமைகளையும் நீதித்துறை சுதந்திரத்தையும் பாதுகாக்க 1975 எமர்ஜென்சி காலம் முதல் நீதிமன்றங்களில் தொடரும் சட்ட அறப்படை.'
              }
            }
          ].map((pillar) => (
            <Link
              key={pillar.id}
              href={`/ideology#${pillar.id}`}
              className="group relative p-7 sm:p-9 border-r border-b border-neutral-300 hover:bg-white transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Numeral and Statute Banner */}
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-neutral-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black font-english text-[#E31E24] leading-none tracking-tight">
                      {pillar.num}
                    </span>
                    <span className="w-1.5 h-1.5 bg-[#E31E24] rounded-full inline-block group-hover:scale-125 transition-transform" />
                  </div>
                  
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 group-hover:bg-[#FAF7F2] group-hover:text-neutral-900 px-2.5 py-1 border border-neutral-200 transition-colors">
                    {pillar.statute[language]}
                  </span>
                </div>

                {/* Milestone Pill */}
                <div className="text-[11px] font-english font-bold uppercase tracking-wider text-[#E31E24] mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-3 bg-[#E31E24] inline-block shrink-0" />
                  <span className="truncate">{pillar.milestone[language]}</span>
                </div>

                {/* Primary Title */}
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-snug">
                  {pillar.title[language]}
                </h3>

                {/* Tamil Secondary Subtitle */}
                <span className="text-xs sm:text-sm font-semibold text-neutral-500 font-dmk-headline block mt-0.5 mb-3">
                  {pillar.tamilSubtitle}
                </span>

                {/* Engaging Description */}
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body">
                  {pillar.desc[language]}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-english font-bold text-neutral-900 group-hover:text-[#E31E24] uppercase tracking-wider transition-colors">
                <span>{language === 'ta' ? 'கொள்கை விளக்கம் படிக்க' : 'Read Doctrine'}</span>
                <ArrowRight className="w-4 h-4 text-[#E31E24] transition-transform group-hover:translate-x-1.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Authentic Historical Quote Band */}
        <div className="mt-10 border border-neutral-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#FAF7F2] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-[#E31E24] shrink-0 mt-0.5" />
            <div>
              <p className="font-serif italic text-base sm:text-lg text-neutral-900 leading-relaxed">
                {language === 'ta'
                  ? '"உரிமைகள் எவராலும் கொடுக்கப்படும் சலுகைகள் அல்ல; அவை இடைவிடாத ஜனநாயக, சட்டப் போராட்டங்களின் வழியே பெறப்படும் அடிப்படை விழுமியங்கள்."'
                  : '"Rights are not gifts granted by rulers; they are inherent entitlements won through continuous democratic and constitutional struggle."'}
              </p>
              <p className="text-xs font-english font-bold uppercase tracking-wider text-neutral-600 mt-2">
                — {language === 'ta' ? 'தந்தை பெரியார் (முதல் சுயமரியாதை மாகாண மாநாடு, 1929)' : 'Thanthai Periyar (First Provincial Self-Respect Conference, 1929)'}
              </p>
            </div>
          </div>

          <Link
            href="/about"
            className="shrink-0 text-xs font-english font-bold uppercase tracking-wider text-neutral-900 hover:text-[#E31E24] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>{language === 'ta' ? 'வரலாற்று மைல்கற்கள்' : '50+ Year Legal Archive'}</span>
            <ChevronRight className="w-4 h-4 text-[#E31E24]" />
          </Link>
        </div>

      </section>

      {/* 5. PHOTOJOURNALISM & FIELD DISPATCHES (Editorial Press Layout, No Bulky Cards) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-neutral-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b-2 border-neutral-900 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-[#E31E24] tracking-[0.2em] uppercase block mb-1">
              {t.activitiesPreview.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-dmk-headline">
              {t.activitiesPreview.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif italic mt-0.5">
              {t.activitiesPreview.subtitle}
            </p>
          </div>

          <Link
            href="/activities"
            className="text-xs font-english font-bold text-[#E31E24] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>{t.activitiesPreview.allActivities}</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* 2-Column Photojournalism Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-300">
          {upcomingEvents.map((evt, idx) => (
            <article
              key={evt.id}
              className={`flex flex-col sm:flex-row gap-5 pt-6 md:pt-0 ${idx > 0 ? 'md:pl-8' : ''} group`}
            >
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-neutral-900 shrink-0 border border-neutral-300">
                <img
                  src={evt.image}
                  alt={evt.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 text-[10px] font-english font-bold uppercase tracking-wider px-2.5 py-1 text-white shadow-md ${
                  evt.status === 'upcoming' ? 'bg-[#E31E24]' : 'bg-black'
                }`}>
                  {evt.status === 'upcoming'
                    ? language === 'ta' ? 'வரவிருக்கும் நிகழ்வு' : 'Upcoming'
                    : language === 'ta' ? 'நிறைவடைந்தது' : 'Concluded'}
                </span>
              </div>

              <div className="flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 font-english mb-1 border-b border-neutral-200 pb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E31E24]" />
                    <span className="font-semibold">{evt.date}</span>
                    <span>•</span>
                    <span className="font-bold text-neutral-900 uppercase">{evt.category}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] transition-colors leading-snug">
                    {evt.title[language]}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body mt-1">
                    {evt.description[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                  <span className="truncate max-w-[180px] font-english text-[11px] font-bold text-neutral-800">{evt.venue[language]}</span>
                  <Link
                    href="/activities"
                    className="text-[#E31E24] font-bold hover:underline font-dmk-headline"
                  >
                    {language === 'ta' ? 'முழு விவரம்' : 'Details'} &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. OFFICIAL ENROLLMENT NOTICE / ADVOCATE MEMBERSHIP PROCLAMATION (Mass & Stylish) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#111111] text-white p-8 sm:p-14 border-t-4 border-[#E31E24] relative overflow-hidden shadow-2xl">
          
          {/* Subtle Radiant Sunrise Background Glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#E31E24]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E31E24] text-white text-[11px] font-english font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'அதிகாரப்பூர்வ அழைப்பு • திமுக வழக்கறிஞர் அணி' : 'OFFICIAL MEMBERSHIP ENROLLMENT • DMK LEGAL WING'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-dmk-headline tracking-tight text-white leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-dmk-body max-w-3xl">
              {t.cta.desc}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/contact#register"
                className="px-8 py-3.5 bg-[#E31E24] hover:bg-white hover:text-black text-white text-xs sm:text-sm font-english font-bold uppercase tracking-wider transition-all border border-white font-dmk-headline shadow-lg"
              >
                {t.cta.button} &rarr;
              </Link>
              <Link
                href="/structure"
                className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-english font-bold uppercase tracking-wider transition-all border border-neutral-700 font-dmk-headline"
              >
                {language === 'ta' ? 'அமைப்புப் பட்டியல்' : 'View Hierarchy'}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
