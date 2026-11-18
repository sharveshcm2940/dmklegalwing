'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { IDEOLOGY_PILLARS, DMK_ORGANISATION_INFO } from '@/data/content';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  ChevronRight, 
  Quote, 
  ExternalLink,
  Award,
  Building2,
  MapPin,
  Shield,
  Clock,
  Scale,
  FileText,
  Flame,
  Gavel,
  Tablet,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { events, news } = useData();

  const latestNews = news.slice(0, 5);

  return (
    <div className="w-full bg-white text-[#111111] font-dmk-body">
      
      {/* ========================================================================= */}
      {/* MAIN NEW YORK MAGAZINE EDITORIAL GRID (EXACT SCREENSHOT LAYOUT) */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 border-b border-neutral-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 1: "THE LATEST NEWS" SIDEBAR                                     */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-neutral-300 pr-0 lg:pr-5 pb-6 lg:pb-0 space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-1.5">
              <span className="w-2.5 h-2.5 bg-[#E31E24]" />
              <h3 className="font-mono text-xs font-black uppercase tracking-widest text-neutral-900">
                {language === 'ta' ? 'அண்மைச் செய்திகள்' : 'THE LATEST NEWS'}
              </h3>
            </div>

              {/* Feed Item 1 */}
              <article className="space-y-1 pb-3.5 border-b border-neutral-200">
                <Link href="/news" className="group block">
                  <h4 className="font-dmk-headline text-sm font-bold text-neutral-900 group-hover:text-[#E31E24] leading-snug transition-colors">
                    {language === 'ta'
                      ? 'ஆளுநர் அதிகார வரம்பு: உச்ச நீதிமன்றம் முக்கிய உத்தரவு'
                      : 'Supreme Court Reiterates State Legislative Supremacy Under Article 200'}
                  </h4>
                </Link>
                <p className="text-xs text-neutral-600 leading-relaxed font-dmk-body">
                  {language === 'ta'
                    ? 'சட்டமன்ற மசோதாக்களை ஆளுநர்கள் காலவரையின்றி முடக்க முடியாது என அரசமைப்பு அமர்வு தீர்ப்பு.'
                    : 'Governors cannot indefinitely withhold assent on bills passed by elected state legislatures.'}
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block">12 MINS AGO</span>
              </article>

              {/* Feed Item 2 */}
              <article className="space-y-1 pb-3.5 border-b border-neutral-200">
                <Link href="/resources" className="group block">
                  <h4 className="font-dmk-headline text-sm font-bold text-neutral-900 group-hover:text-[#E31E24] leading-snug transition-colors">
                    {language === 'ta'
                      ? '69% இடஒதுக்கீடு பாதுகாப்பு: உச்ச நீதிமன்றத்தில் திமுக வழக்கறிஞர் அணி எதிர்மனு'
                      : '69% Reservation: Legal Wing Submits Sociological Data to Constitution Bench'}
                  </h4>
                </Link>
                <p className="text-xs text-neutral-600 leading-relaxed font-dmk-body">
                  {language === 'ta'
                    ? 'பிற்படுத்தப்பட்டோர் நல ஆணைய புள்ளிவிவரங்களுடன் கூடிய பாதுகாப்பு மனு சமர்ப்பிக்கப்பட்டது.'
                    : 'Ninth Schedule constitutional safeguard backed by comprehensive quantifiable empirical findings.'}
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block">45 MINS AGO</span>
              </article>

              {/* Feed Item 3 */}
              <article className="space-y-1 pb-3.5 border-b border-neutral-200">
                <Link href="/ideology" className="group block">
                  <h4 className="font-dmk-headline text-sm font-bold text-neutral-900 group-hover:text-[#E31E24] leading-snug transition-colors">
                    {language === 'ta'
                      ? 'ராஜமன்னார் குழுவின் மாநில சுயாட்சி பரிந்துரைகள் மறுபதிப்பு'
                      : 'Rajamannar Committee Report on State Autonomy Re-published'}
                  </h4>
                </Link>
                <p className="text-xs text-neutral-600 leading-relaxed font-dmk-body">
                  {language === 'ta'
                    ? 'நிதிப்பகிர்வு மற்றும் மாநிலங்களின் தன்னாட்சி உரிமைகளுக்கான அரசமைப்பு வழிகாட்டி.'
                    : 'A comprehensive constitutional blueprint for federal fiscal devolution and state powers.'}
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block">2 HOURS AGO</span>
              </article>

              {/* Feed Item 4 */}
              <article className="space-y-1 pb-3.5 border-b border-neutral-200">
                <Link href="/districts" className="group block">
                  <h4 className="font-dmk-headline text-sm font-bold text-neutral-900 group-hover:text-[#E31E24] leading-snug transition-colors">
                    {language === 'ta'
                      ? '38 மாவட்டங்களிலும் இலவச சட்ட உதவி முகாம்கள் தீவிரம்'
                      : '38 District Units Mobilize Pro-Bono Counsel for 12,000+ Litigants'}
                  </h4>
                </Link>
                <p className="text-xs text-neutral-600 leading-relaxed font-dmk-body">
                  {language === 'ta'
                    ? 'எளிய மக்களுக்கு மாவட்ட நீதிமன்றங்களில் இலவச ஆலோசனை வழங்கும் வழக்கறிஞர்கள்.'
                    : 'Grassroots trials defense and legal aid centers active across all subordinate sessions courts.'}
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block">4 HOURS AGO</span>
              </article>

              {/* Feed Item 5 */}
              <article className="space-y-1">
                <Link href="/leadership" className="group block">
                  <h4 className="font-dmk-headline text-sm font-bold text-neutral-900 group-hover:text-[#E31E24] leading-snug transition-colors">
                    {language === 'ta'
                      ? 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர் சங்க கருத்தரங்கம்'
                      : 'Madras High Court Bar Colloquium Discusses Tamil in Judiciary'}
                  </h4>
                </Link>
                <p className="text-xs text-neutral-600 leading-relaxed font-dmk-body">
                  {language === 'ta'
                    ? 'உயர் நீதிமன்றத்தில் தமிழ் அலுவல் மொழியாகப் பயன்பட தொடர் வலியுறுத்தல்.'
                    : 'Senior advocates reaffirm demand for Tamil as official proceedings language in High Court.'}
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block">YESTERDAY</span>
              </article>

              <div className="pt-2">
                <Link 
                  href="/news" 
                  className="font-mono text-xs font-bold text-[#E31E24] hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>{language === 'ta' ? 'அனைத்து செய்திகள்' : 'Browse News Archive'}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 2: CENTER FEATURE SPOTLIGHT & DUAL SUB-STORIES (CAMERON DIAZ)    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* The Big Vibrant Spotlight Box (Matching NYMag Gold Yellow Box) */}
            <div className="bg-[#F5B700] border-2 border-neutral-900 p-6 sm:p-8 shadow-[4px_4px_0px_#111111] relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left: Leader Portrait / Authentic Photo */}
                <div className="md:col-span-5 flex items-center justify-center">
                  <div className="relative w-44 h-56 sm:w-48 sm:h-64 border-2 border-neutral-900 bg-white p-1 shadow-[3px_3px_0px_#111111] overflow-hidden rotate-[-1deg] hover:rotate-0 transition-transform">
                    <img
                      src="/images/dmk-campaign-stalin.jpg"
                      alt="Thiru M.K. Stalin"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Right: Massive Editorial Headline & Deck */}
                <div className="md:col-span-7 space-y-3 text-neutral-900">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-black text-white font-mono text-[9px] font-bold uppercase tracking-widest">
                      {language === 'ta' ? 'சிறப்புக் கட்டுரை' : 'COVER STORY'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-black uppercase">
                      STATE AUTONOMY & CONSTITUTION
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 font-dmk-headline leading-[1.08] tracking-tight">
                    {language === 'ta'
                      ? 'தமிழ்நாட்டை தலைகுனிய விடமாட்டேன்!'
                      : 'Why Constitutional Democracy & Federalism Stand at a Crossroads'}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-900 font-serif leading-relaxed italic">
                    {language === 'ta'
                      ? 'மாநில சுயாட்சி, சமூக நீதி இடஒதுக்கீடு மற்றும் நாடாளுமன்ற ஜனநாயகத்தை சட்டத்தின் வழியே நிலைநாட்டும் வரலாற்றுப் போர்க்களம்.'
                      : 'The landmark legal battles defending Tamil Nadu’s legislative supremacy, affirmative action quotas, and federal rights against judicial and governor overreach.'}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-black/20 text-xs font-mono">
                    <span className="font-bold text-black">
                      {language === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமை' : 'By DMK Legal Wing Secretariat'}
                    </span>
                    <Link
                      href="/ideology"
                      className="font-bold text-black hover:text-[#E31E24] flex items-center gap-1 uppercase tracking-wider"
                    >
                      <span>{language === 'ta' ? 'முழு ஆய்வு' : 'Read Article'}</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Below the Yellow Feature: Two Editorial Columns (NYMag Sub-Feature Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-neutral-300">
              
              {/* Sub-Story 1: Circular Leader Avatar + Serif Story */}
              <article className="space-y-3 pr-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-neutral-300 pb-5 sm:pb-0">
                <div className="text-center sm:text-left">
                  <div className="w-20 h-20 mx-auto sm:mx-0 rounded-full border-2 border-neutral-900 overflow-hidden shadow-[2px_2px_0px_#111111] bg-white p-0.5 mb-2">
                    <img
                      src="/images/dmk-four-leaders.jpg"
                      alt="Ideological Leaders"
                      className="w-full h-full object-cover object-left"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E31E24] block">
                    — CONSTITUTIONAL ARCHIVE —
                  </span>
                  <Link href="/about" className="group">
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] leading-snug mt-1 transition-colors">
                      {language === 'ta'
                        ? 'சுயமரியாதை இயக்கத்தின் சட்டக் கட்டமைப்பு'
                        : 'How Lawyers Formed the Backbone of the Self-Respect Movement'}
                    </h3>
                  </Link>
                  <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body mt-1">
                    {language === 'ta'
                      ? 'நீதிக்கட்சி காலம் முதல் இன்றைய பொதுநல வழக்குகள் வரை சமத்துவத்தை நிறுவிய வழக்கறிஞர்கள்.'
                      : 'From the historic 1921 Communal GO to modern Supreme Court litigation: a century of progressive jurisprudence.'}
                  </p>
                  <span className="text-[11px] font-serif italic text-neutral-500 block mt-2">
                    By Senior Advocate P. Wilson
                  </span>
                </div>
              </article>

              {/* Sub-Story 2: Conference Photo + "First Person" Heading */}
              <article className="space-y-3">
                <div>
                  <div className="h-32 w-full border border-neutral-900 overflow-hidden shadow-[2px_2px_0px_#111111] mb-2 bg-neutral-900">
                    <img
                      src="/images/dmk-four-leaders.jpg"
                      alt="Courtroom Advocacy"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E31E24] block">
                    — FIRST PERSON —
                  </span>
                  <Link href="/resources" className="group">
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 font-dmk-headline group-hover:text-[#E31E24] leading-snug mt-1 transition-colors">
                      {language === 'ta'
                        ? 'அகில இந்திய மருத்துவ ஒதுக்கீட்டுப் போராட்டம்'
                        : 'Inside the Supreme Court Battle for All-India Medical Quotas'}
                    </h3>
                  </Link>
                  <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body mt-1">
                    {language === 'ta'
                      ? 'அகில இந்திய மருத்துவ இடங்களில் 27% பிற்படுத்தப்பட்டோர் இடஒதுக்கீடு பெற்ற சட்ட வாதங்கள்.'
                      : 'The pivotal hearings in the Madras High Court and Supreme Court that secured OBC medical seats.'}
                  </p>
                  <span className="text-[11px] font-serif italic text-neutral-500 block mt-2">
                    By N.R. Elango, Senior Advocate
                  </span>
                </div>
              </article>

            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 3: RIGHT SIDEBAR — POLICE/RECAPS & SUBSCRIBE TODAY BOX          */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-6 border-t lg:border-t-0 lg:border-l border-neutral-300 pl-0 lg:pl-5 pt-6 lg:pt-0">
            
            {/* Top Right Card: High Court / Photo Deck */}
            <article className="space-y-2 pb-5 border-b border-neutral-300">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 block text-center">
                — HIGH COURT BENCH —
              </span>
              <div className="h-36 w-full border border-neutral-900 overflow-hidden shadow-[2px_2px_0px_#111111] bg-neutral-900">
                <img
                  src="/images/dmk-campaign-stalin.jpg"
                  alt="Madras High Court Gathering"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <Link href="/activities" className="group block">
                <h4 className="font-dmk-headline text-base font-bold text-neutral-900 group-hover:text-[#E31E24] leading-snug transition-colors">
                  {language === 'ta'
                    ? 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர் மன்றக் கலந்தாய்வு'
                    : 'Advocates Gather at Madras High Court to Reaffirm Safeguards'}
                </h4>
              </Link>
              <p className="text-xs text-neutral-600 leading-relaxed font-dmk-body">
                {language === 'ta'
                  ? 'இளம் வழக்கறிஞர்களுக்கான உதவித்தொகை மற்றும் மாவட்ட நீதிமன்ற கட்டமைப்பு குறித்த ஆலோசனை.'
                  : 'Statewide council reviews advocate welfare stipends, digital research libraries, and court infrastructure.'}
              </p>
              <span className="text-[11px] font-serif italic text-neutral-500 block">
                By Special Legal Correspondent
              </span>
            </article>

            {/* Middle Right Card: Recaps / Bulleted Archive Items */}
            <div className="space-y-3 pb-5 border-b border-neutral-300">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E31E24] block text-center">
                — HISTORIC RECAPS —
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-neutral-900 uppercase block">ARTICLE 200:</span>
                  <Link href="/resources" className="text-neutral-700 hover:text-[#E31E24] font-medium leading-snug block">
                    The Leftovers: Supreme Court affirms elected assembly primacy over nominated offices.
                  </Link>
                </div>

                <div>
                  <span className="font-mono font-bold text-neutral-900 uppercase block">DRAVIDIAN LAW:</span>
                  <Link href="/ideology" className="text-neutral-700 hover:text-[#E31E24] font-medium leading-snug block">
                    True Blood: The 1971 founding charter of DMK Legal Wing under Kalaignar.
                  </Link>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-10 h-10 rounded-full border border-neutral-900 overflow-hidden shrink-0 bg-white p-0.5">
                    <img src="/images/dmk-flag-sun.jpg" alt="Icon" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-[10px] uppercase text-neutral-900 block">MADRAS LAW JOURNAL:</span>
                    <Link href="/resources" className="text-neutral-700 hover:text-[#E31E24] text-[11px] leading-tight block">
                      Special retrospective on social justice legislation.
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right Card: SUBSCRIBE TODAY / IPAD PROMO (Exact NYMag Tablet Widget) */}
            <div className="bg-[#FAF7F2] border-2 border-neutral-900 p-5 shadow-[3px_3px_0px_#111111] space-y-3">
              <div>
                <h4 className="font-dmk-headline text-lg font-black text-neutral-900 uppercase leading-none">
                  {language === 'ta' ? 'சட்ட அரசிதழ் சந்தா' : 'Subscribe Today'}
                </h4>
                <p className="text-xs text-neutral-700 font-serif italic mt-1 leading-snug">
                  {language === 'ta'
                    ? 'உயர் நீதிமன்றத் தீர்ப்புகள் மற்றும் சட்டக் கையேடுகளை உங்கள் கைப்பேசியில் பெற்றிடுக.'
                    : 'Get the latest issue, plus the best of DMK Legal Wing on all your devices.'}
                </p>
              </div>

              {/* Tablet & Magazine Graphic Illustration */}
              <div className="flex items-center justify-center py-2 bg-white border border-neutral-300">
                <div className="flex items-center gap-3">
                  {/* Mini Magazine Cover */}
                  <div className="w-16 h-20 bg-neutral-900 border-2 border-neutral-800 p-1 flex flex-col justify-between text-center text-white shadow-xs">
                    <span className="text-[7px] font-mono text-[#E31E24] font-bold">DMK GAZETTE</span>
                    <img src="/images/dmk-flag-sun.jpg" alt="Seal" className="w-6 h-6 mx-auto object-contain" />
                    <span className="text-[6px] font-mono text-neutral-400">DEC 2026</span>
                  </div>

                  {/* Tablet Graphic */}
                  <div className="w-14 h-18 bg-black rounded-md p-1 border-2 border-neutral-700 shadow-xs flex flex-col items-center justify-center">
                    <Tablet className="w-6 h-6 text-[#E31E24]" />
                    <span className="text-[6px] font-mono text-white mt-1">DIGITAL</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/contact#register"
                  className="block w-full py-2 bg-[#E31E24] hover:bg-neutral-900 text-white text-center font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  {language === 'ta' ? 'வழக்கறிஞர் சேர்க்கை' : 'Enroll as Advocate'}
                </Link>

                <Link
                  href="/resources"
                  className="block text-center font-mono text-[11px] text-neutral-700 hover:text-[#E31E24] font-bold uppercase"
                >
                  {language === 'ta' ? 'அரசிதழ் PDF பதிவிறக்குக →' : 'Download Gazette PDF →'}
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: EDITORIAL METRICS TAPE (NEWSPAPER STATISTICAL REGISTER)        */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F2] border-b border-neutral-300 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-300 text-center">
            
            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'பதிவுபெற்ற வழக்கறிஞர்கள்' : 'REGISTERED ADVOCATES'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-neutral-900 block mt-0.5">
                {DMK_ORGANISATION_INFO.barCountEstimated}
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">Active Bar Counsel</span>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'மாவட்டக் கட்டமைப்பு' : 'DISTRICT JURISDICTIONS'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#E31E24] block mt-0.5">
                38 / 38
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">Subordinate Courts</span>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'வரலாற்றுப் பின்னணி' : 'CONSTITUTIONAL ADVOCACY'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-neutral-900 block mt-0.5">
                5+ Decades
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">Estd. 1971 by Kalaignar</span>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider block">
                {language === 'ta' ? 'சமூக நீதி இடஒதுக்கீடு' : 'AFFIRMATIVE ACTION SHIELD'}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#E31E24] block mt-0.5">
                69% Quota
              </span>
              <span className="text-[11px] text-neutral-600 font-serif italic">Tamil Nadu Act 45 of 1994</span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE DRAVIDIAN JURISPRUDENCE MANIFESTO (FOUR MENTORS STRIP)     */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 border-b border-neutral-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#E31E24]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E31E24]">
                {language === 'ta' ? 'கொள்கை வழிகாட்டிகள்' : 'PHILOSOPHICAL PILLARS'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 font-dmk-headline tracking-tight uppercase">
              {language === 'ta' ? 'கொள்கைத் தலைவர்களின் வழியைப் பின்பற்றுவோம்!' : 'The Four Pillars of Dravidian Jurisprudence'}
            </h2>
          </div>
          <Link
            href="/ideology"
            className="font-mono text-xs font-bold text-[#E31E24] hover:underline uppercase tracking-wider mt-2 md:mt-0"
          >
            {language === 'ta' ? 'அனைத்து கொள்கைகளும் வாசிக்க →' : 'Read Ideology Manifesto →'}
          </Link>
        </div>

        {/* 4 Pillars Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {IDEOLOGY_PILLARS.slice(0, 4).map((pillar, idx) => (
            <div
              key={pillar.id}
              className="bg-white border-2 border-neutral-900 p-5 shadow-[3px_3px_0px_#111111] hover:shadow-[4px_4px_0px_#E31E24] transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="font-mono text-xs font-bold text-[#E31E24]">
                    § 0{idx + 1}
                  </span>
                  <Scale className="w-3.5 h-3.5 text-neutral-400" />
                </div>

                <h3 className="font-dmk-headline text-lg font-black text-neutral-900 leading-tight">
                  {pillar.title[language]}
                </h3>

                <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body">
                  {pillar.description[language]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500">
                Constitutional Safeguard
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CALL TO ACTION REGISTER DESK                                  */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="bg-[#111111] text-white border-4 border-neutral-900 p-8 sm:p-12 shadow-[6px_6px_0px_#E31E24] relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 bg-[#E31E24] text-white text-xs font-mono font-bold uppercase tracking-widest inline-block">
              {language === 'ta' ? 'அதிகாரப்பூர்வ அழைப்பு' : 'OFFICIAL MEMBERSHIP ENROLLMENT'}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black font-dmk-headline tracking-tight text-white leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-dmk-body">
              {t.cta.desc}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact#register"
                className="px-6 py-3 bg-[#E31E24] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors border-2 border-white shadow-xs font-dmk-headline"
              >
                {t.cta.button}
              </Link>
              <Link
                href="/structure"
                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors border-2 border-neutral-700 font-dmk-headline"
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
