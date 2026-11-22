'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/data/translations';
import { HISTORICAL_MILESTONES } from '@/data/content';
import { HistoricalMilestone } from '@/types';
import { PageTitleBand } from '@/components/PageTitleBand';

interface MentorItem {
  id: string;
  name: { en: string; ta: string };
  description: { en: string; ta: string };
  image: string;
}

const FOUR_MENTORS: MentorItem[] = [
  {
    id: 'periyar',
    name: {
      en: 'Thanthai Periyar E.V.R.',
      ta: 'தந்தை பெரியார் ஈ.வெ.ரா.'
    },
    description: {
      en: 'Father of the Self-Respect Movement & Rationalist Pioneer',
      ta: 'பகுத்தறிவுப் பகலவன் • சுயமரியாதை இயக்கத்தின் தந்தை'
    },
    image: '/images/mentors/periyar.jpg'
  },
  {
    id: 'anna',
    name: {
      en: 'Perarignar C.N. Annadurai',
      ta: 'பேரறிஞர் சி.என். அண்ணாதுரை'
    },
    description: {
      en: 'DMK Founder & Chief Minister who legalised Self-Respect Marriages',
      ta: 'கழக நிறுவனர் • சுயமரியாதைத் திருமண சட்ட வடிவம் தந்தவர்'
    },
    image: '/images/mentors/anna.jpg'
  },
  {
    id: 'kalaignar',
    name: {
      en: 'Muthamizharignar Kalaignar',
      ta: 'முத்தமிழறிஞர் கலைஞர்'
    },
    description: {
      en: 'Five-time Chief Minister & Architect of 69% Reservation Architecture',
      ta: 'முன்னாள் முதல்வர் • 69% இடஒதுக்கீடு & மாநில சுயாட்சியின் பாதுகாவலர்'
    },
    image: '/images/mentors/kalaignar.jpg'
  },
  {
    id: 'stalin',
    name: {
      en: 'Thalapathi M.K. Stalin',
      ta: 'தளபதி மு.க. ஸ்டாலின்'
    },
    description: {
      en: 'Party President & Hon’ble Chief Minister of Tamil Nadu',
      ta: 'கழகத் தலைவர் & மாண்புமிகு தமிழ்நாடு முதலமைச்சர்'
    },
    image: '/images/mentors/stalin.jpg'
  }
];

const ARCHIVE_ITEMS = [
  {
    id: 'res-self-respect-marriage',
    year: '1967',
    title: {
      en: 'Hindu Marriage (Tamil Nadu Amendment) Act 1967 (Section 7A): Statutory Guide',
      ta: 'இந்து திருமண (தமிழ்நாடு திருத்தச் சட்டம்) 1967 (பிரிவு 7A): சுயமரியாதைத் திருமண சட்ட வழிகாட்டி'
    },
    court: { en: 'Madras High Court / Assembly Act', ta: 'சென்னை உயர்நீதிமன்றம் / சட்டப்பேரவை' },
    link: '/resources#res-self-respect-marriage'
  },
  {
    id: 'res-rajamannar-autonomy',
    year: '1971',
    title: {
      en: 'Rajamannar Committee Report on Centre-State Relations: The Historic Autonomy Foundation',
      ta: 'மத்திய - மாநில உறவுகள் குறித்த ராஜமன்னார் குழு அறிக்கை (1971): வரலாற்று மாநில சுயாட்சி ஆவணம்'
    },
    court: { en: 'Constitutional Commission', ta: 'மாநில அரசமைப்பு ஆணையம்' },
    link: '/resources#res-rajamannar-autonomy'
  },
  {
    id: 'res-emergency-habeas-corpus',
    year: '1975',
    title: {
      en: 'Internal Emergency MISA Detentions: Madras High Court Habeas Corpus Petitions Compendium',
      ta: 'நெருக்கடி நிலை மிசா சிறைவாசம்: சென்னை உயர்நீதிமன்ற ஆட்கொணர்வு மனுக்கள் வரலாற்றுத் தொகுப்பு'
    },
    court: { en: 'Madras High Court Archives', ta: 'சென்னை உயர்நீதிமன்ற ஆவணக் காப்பகம்' },
    link: '/resources'
  },
  {
    id: 'res-69-reservation',
    year: '1994',
    title: {
      en: 'Tamil Nadu 69% Reservation Act (Act 45 of 1994) & Ninth Schedule Constitutional Compendium',
      ta: 'தமிழ்நாடு 69% இடஒதுக்கீட்டுச் சட்டம் (1994 சட்டம் 45) மற்றும் 9-வது அட்டவணை அரசமைப்புத் தொகுப்பு'
    },
    court: { en: 'Supreme Court of India', ta: 'இந்திய உச்ச நீதிமன்றம்' },
    link: '/resources#res-69-reservation'
  },
  {
    id: 'res-governor-assent',
    year: '2023',
    title: {
      en: 'Governor’s Constitutional Discretion under Article 200: Precedent Analysis & Submissions',
      ta: 'அரசமைப்பு உறுப்பு 200-ன் கீழ் ஆளுநரின் அதிகார வரம்பு: உச்ச நீதிமன்ற வாதங்கள் & தீர்ப்பு ஆய்வு'
    },
    court: { en: 'Supreme Court of India', ta: 'இந்திய உச்ச நீதிமன்றம்' },
    link: '/resources#res-governor-assent'
  },
  {
    id: 'res-legal-aid-handbook',
    year: '2024',
    title: {
      en: 'Citizen’s Guide to Free Legal Aid, Bail Jurisprudence & Fundamental Rights',
      ta: 'சாமானிய மக்களுக்கான இலவச சட்ட உதவி, பிணை உரிமைகள் & அடிப்படை உரிமைகள் கையேடு'
    },
    court: { en: 'DMK Legal Wing Secretariat', ta: 'திமுக வழக்கறிஞர் அணித் தலைமைச் செயலகம்' },
    link: '/resources#res-legal-aid-handbook'
  }
];

interface DecadeGroup {
  id: string;
  labelEn: string;
  labelTa: string;
  milestones: HistoricalMilestone[];
}

function getDecadeGroups(milestones: HistoricalMilestone[]): DecadeGroup[] {
  const map = new Map<string, DecadeGroup>();

  milestones.forEach((m) => {
    const firstYear = parseInt(m.year.slice(0, 4), 10);
    const decadeStart = Math.floor(firstYear / 10) * 10;
    const id = `decade-${decadeStart}s`;

    if (!map.has(id)) {
      map.set(id, {
        id,
        labelEn: `${decadeStart}s`,
        labelTa: `${decadeStart}-கள்`,
        milestones: []
      });
    }

    map.get(id)!.milestones.push(m);
  });

  return Array.from(map.values());
}

/**
 * Individual milestone row in the elegant book-like catalogue layout.
 * Motion: only a gentle fade-in (opacity and a 12 px rise over 0.6 s) as each entry first appears.
 * Nothing moves on hover except the title turning #C41A1F.
 */
function TimelineMilestoneEntry({
  milestone,
  language
}: {
  milestone: HistoricalMilestone;
  language: 'ta' | 'en';
}) {
  const [inView, setInView] = useState(false);
  const entryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = entryRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={entryRef}
      className={`py-10 group transition-all duration-[600ms] ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {/* Year in Helvetica Now Display 800 at 20 px, in #C41A1F */}
      <span className="font-helvetica font-extrabold text-[20px] text-[#C41A1F] leading-none block mb-2 select-none">
        {milestone.year}
      </span>

      {/* Title in Helvetica Now Display 800 at 30 px (Kavivanar for Tamil) */}
      <h3
        className={`${
          language === 'ta' ? 'font-kavivanar' : 'font-helvetica font-extrabold'
        } text-[26px] md:text-[30px] text-[#111111] leading-snug group-hover:text-[#C41A1F] transition-colors duration-150 mb-3`}
      >
        {milestone.title[language]}
      </h3>

      {/* Text at 18 px, maximum 640 px wide (Catamaran, line height 1.75) */}
      <p className="font-catamaran text-[18px] leading-[1.75] text-[#111111] max-w-[640px]">
        {milestone.description[language]}
      </p>
    </article>
  );
}

export default function AboutPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  // Group existing historical milestones by decade
  const decadeGroups = useMemo(() => {
    return getDecadeGroups(HISTORICAL_MILESTONES);
  }, []);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[18px] leading-[1.75]">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'எங்களைப் பற்றி' : 'About the Legal Wing'}
        description={
          language === 'ta'
            ? 'நீதிமன்றங்களில் சமூக நீதியைப் பாதுகாத்து, மாநில சுயாட்சியை நிலைநிறுத்தும் ஐந்து தசாப்த கால சட்டப் போராட்டம்.'
            : 'Five decades of constitutional advocacy defending social justice, federalism, and the 69% reservation in the courts.'
        }
      />

      {/* 1. Introduction: Two columns on parchment */}
      <section className="bg-[#FAF8F5] py-16 md:py-24 border-b border-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left: Kavivanar title in #C41A1F */}
            <div className="lg:col-span-5">
              <h2 className="font-kavivanar font-normal text-[clamp(32px,4vw,48px)] leading-[1.2] text-[#C41A1F]">
                {language === 'ta'
                  ? 'அரசமைப்புப் போராட்டமும் சமூக நீதியும்: தொடரும் அறப்பணி'
                  : 'A Legacy of Constitutional Resistance & Social Justice'}
              </h2>
            </div>

            {/* Right: Existing introduction text at 20px with line height 1.75 (max 680px wide) */}
            <div className="lg:col-span-7 max-w-[680px] space-y-6 text-[20px] leading-[1.75] text-[#111111]">
              <p>
                {t.intro.p1}
              </p>
              <p>
                {t.intro.p2}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Redesigned Timeline: Elegant, Restrained Book-Like Layout */}
      <section
        id="timeline"
        aria-label={language === 'ta' ? 'அரசமைப்பு வரலாற்று மைல்கற்கள்' : 'Constitutional Milestones Timeline'}
        className="bg-[#FAF8F5] py-20 md:py-28 border-b border-[#111111]"
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          {/* Header */}
          <div className="mb-10">
            <h2 className="font-kavivanar font-normal text-[clamp(34px,4.5vw,52px)] text-[#111111] leading-none">
              {language === 'ta' ? 'அரை நூற்றாண்டு கால அரசமைப்பு வரலாற்று மைல்கற்கள்' : '50 Years of Constitutional Litigation & Milestones'}
            </h2>
            <p className="text-[18px] text-[#5B5348] mt-3">
              {language === 'ta'
                ? 'திராவிட இயக்கத்தின் வரலாற்றுச் சிறப்புமிக்க சட்டப் போராட்டங்கள் • 1921 முதல் 2026 வரை'
                : 'Defending affirmative action, minority rights, and state autonomy across Indian courts of record.'}
            </p>
          </div>

          {/* Small index at top: decades as plain text links separated by thin vertical rules */}
          <nav
            aria-label={language === 'ta' ? 'தசாப்தக் குறியீட்டு வரிசை' : 'Decades navigation index'}
            className="mb-14 border-b border-[#d7d0c3] pb-4"
          >
            <div className="flex flex-wrap items-center gap-y-2">
              {decadeGroups.map((group, index) => (
                <React.Fragment key={group.id}>
                  {index > 0 && (
                    <span
                      className="mx-3.5 h-3.5 w-px bg-[#d7d0c3] inline-block shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <a
                    href={`#${group.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(group.id);
                      if (el) {
                        const yOffset = -90;
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className={`${
                      language === 'ta' ? 'font-kavivanar text-[16px]' : 'font-helvetica font-extrabold text-[15px]'
                    } text-[#111111] hover:text-[#C41A1F] transition-colors duration-150 cursor-pointer`}
                  >
                    {language === 'ta' ? group.labelTa : group.labelEn}
                  </a>
                </React.Fragment>
              ))}
            </div>
          </nav>

          {/* Two-Column Decade Sections */}
          <div className="space-y-16 md:space-y-20">
            {decadeGroups.map((group) => (
              <div
                key={group.id}
                id={group.id}
                className="flex flex-col md:flex-row items-start gap-8 md:gap-14 border-t border-[#d7d0c3] first:border-t-0 scroll-mt-28"
              >
                {/* Left Column (about 200 px): Decade Label in Kavivanar 40 px, red. Sticky while entries scroll past */}
                <div className="w-full md:w-[200px] shrink-0 pt-8 md:pt-10 md:sticky md:top-24">
                  <h2 className="font-kavivanar text-[36px] md:text-[40px] text-[#C41A1F] leading-none m-0">
                    {language === 'ta' ? group.labelTa : group.labelEn}
                  </h2>
                </div>

                {/* Right Column: Entries with 1 px #d7d0c3 rule between them and 40 px space around each */}
                <div className="flex-1 w-full divide-y divide-[#d7d0c3]">
                  {group.milestones.map((milestone, idx) => (
                    <TimelineMilestoneEntry
                      key={milestone.year + idx}
                      milestone={milestone}
                      language={language}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. The Four Mentors: An ink band with four portrait frames in a row */}
      <section className="bg-[#111111] text-[#FAF8F5] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          <div className="mb-14 border-b border-[#3d3633] pb-6">
            <h2 className="font-kavivanar font-normal text-[clamp(34px,4.5vw,52px)] text-[#FAF8F5] leading-none">
              {language === 'ta' ? 'கொள்கை ஆசான்கள் & வழிகாட்டிகள்' : 'Our Ideological Mentors'}
            </h2>
            <p className="text-[17px] text-[#d8cfc2] mt-3">
              {language === 'ta'
                ? 'திராவிட இயக்கத்தின் தத்துவ அடித்தளத்தில் சமூக நீதிப் பாதையை வகுத்தளித்த வரலாற்றுத் தலைவர்கள்.'
                : 'The philosophical beacons whose lifelong struggle for social equality and federalism anchors our legal jurisprudence.'}
            </p>
          </div>

          {/* Four portrait frames in a row (3:4, 2px parchment border) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FOUR_MENTORS.map((mentor) => (
              <div key={mentor.id} className="group flex flex-col">
                {/* 3:4 portrait frame, 2px parchment border, lifts 6px on hover */}
                <div className="relative aspect-[3/4] border-2 border-[#FAF8F5] bg-[#1a1a1a] overflow-hidden transition-transform duration-250 ease-out group-hover:-translate-y-[6px]">
                  <img
                    src={mentor.image}
                    alt={mentor.name[language]}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* 6px red bar appears under it on hover */}
                <div className="w-full h-[6px] bg-[#E31E24] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Name: Helvetica Now Display 800, 22px */}
                <h3 className="font-helvetica font-extrabold text-[22px] text-[#FAF8F5] leading-snug mt-3">
                  {mentor.name[language]}
                </h3>

                {/* Existing one-line description */}
                <p className="text-[15px] text-[#d8cfc2] leading-relaxed mt-1">
                  {mentor.description[language]}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Archives: Ruled list (1px ink lines) with year, title and a "View" link (No cards) */}
      <section className="bg-[#FAF8F5] py-20 md:py-28 border-t border-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-kavivanar font-normal text-[clamp(32px,4vw,48px)] text-[#111111] leading-none">
                {language === 'ta' ? 'சட்ட ஆவணக் களஞ்சியம் & வரலாற்றுப் பதிவுகள்' : 'Constitutional Archives & Legal Repositories'}
              </h2>
              <p className="text-[17px] text-[#5B5348] mt-3">
                {language === 'ta'
                  ? 'அரசமைப்பு அமர்வுகளில் தாக்கல் செய்யப்பட்ட மனுக்கள், வரலாற்றுச் சட்ட அறிக்கைகள் மற்றும் ஆவணங்கள்.'
                  : 'Key constitutional dossiers, statutory guides, and historic committee reports preserved in the Party archives.'}
              </p>
            </div>

            <Link
              href="/resources"
              className="text-[#C41A1F] font-extrabold text-[15px] hover:underline shrink-0"
            >
              {language === 'ta' ? 'முழு ஆவணக் களஞ்சியம் →' : 'Browse All Resources →'}
            </Link>
          </div>

          {/* Ruled list (1px ink lines). Strictly no cards. */}
          <div className="border-t border-[#111111] divide-y divide-[#111111]">
            {ARCHIVE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#f1ece2] px-3 transition-colors duration-150"
              >
                <div className="flex items-start md:items-center gap-6">
                  {/* Year */}
                  <span className="font-helvetica font-extrabold text-[22px] text-[#111111] w-16 shrink-0 group-hover:text-[#E31E24] transition-colors">
                    {item.year}
                  </span>

                  {/* Title and court info */}
                  <div>
                    <h3 className="font-catamaran font-bold text-[18px] text-[#111111] leading-snug">
                      {item.title[language]}
                    </h3>
                    <span className="text-[13px] text-[#5B5348] mt-0.5 block">
                      {item.court[language]}
                    </span>
                  </div>
                </div>

                {/* View link */}
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-1.5 font-helvetica font-extrabold text-[15px] text-[#C41A1F] hover:text-[#E31E24] hover:underline shrink-0 md:self-center"
                >
                  <span>{language === 'ta' ? 'பார்வையிடுக' : 'View'}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
