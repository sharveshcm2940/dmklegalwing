'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { LegalResource } from '@/types';
import { 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  X
} from 'lucide-react';

export default function ResourcesPage() {
  const { language } = useLanguage();
  const { resources } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = ['All', 'Supreme Court', 'High Court', 'Constitution', 'Statute', 'Legal Aid'];

  const filteredResources = resources.filter((r) => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch =
      r.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.citation && r.citation.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const faqs = [
    {
      q: {
        en: 'How does DMK Legal Wing protect the 69% reservation quota in Tamil Nadu?',
        ta: 'தமிழ்நாட்டின் 69% இடஒதுக்கீட்டை திமுக வழக்கறிஞர் அணி எவ்வாறு பாதுகாக்கிறது?'
      },
      a: {
        en: 'The 69% reservation is safeguarded under the Tamil Nadu Act 45 of 1994, placed under the Ninth Schedule of the Constitution through the 76th Amendment. Our legal team regularly files defense counters in the Supreme Court, citing quantifiable sociological data on backward classes to protect the quota against judicial ceiling challenges.',
        ta: 'தமிழ்நாட்டின் 69% இடஒதுக்கீடு 1994 சட்டம் 45 மூலம் இயற்றப்பட்டு, 76-வது அரசமைப்புத் திருத்தம் மூலம் 9-வது அட்டவணையில் இணைக்கப்பட்டுள்ளது. உச்ச நீதிமன்றத்தில் தொடுக்கப்படும் வழக்குகளுக்கு எதிராக பிற்படுத்தப்பட்டோர் ஆணையத்தின் முறையான புள்ளிவிவரங்களுடன் திமுக வழக்கறிஞர்கள் தொடர் சட்டப் பாதுகாப்பு அளித்து வருகின்றனர்.'
      }
    },
    {
      q: {
        en: 'Can citizens receive free legal aid from DMK Legal Wing coordinators?',
        ta: 'பொதுமக்கள் திமுக வழக்கறிஞர் அணியிடம் இருந்து இலவச சட்ட உதவி பெற முடியுமா?'
      },
      a: {
        en: 'Yes. Our district legal wing units operate pro-bono citizen clinics across all 38 districts of Tamil Nadu. Litigants from underprivileged backgrounds can contact their respective district legal wing organizer or submit an inquiry through this portal for counsel on civil rights, land disputes, and bail applications.',
        ta: 'ஆம். தமிழகத்தின் 38 மாவட்டங்களிலும் உள்ள நமது வழக்கறிஞர் அணி அமைப்புகள் எளிய மக்களுக்கு இலவச சட்ட ஆலோசனைகளை வழங்குகின்றன. இந்த இணையதளத்தில் உள்ள தொடர்பு படிவம் வழியாகவோ அல்லது மாவட்ட அமைப்பாளர் மூலமாகவோ இலவச சட்ட உதவியைப் பெறலாம்.'
      }
    },
    {
      q: {
        en: 'What is the constitutional significance of the Governor Assent judgment?',
        ta: 'சட்டமன்ற மசோதாக்கள் தொடர்பான உச்ச நீதிமன்ற ஆளுநர் அதிகார தீர்ப்பின் முக்கியத்துவம் என்ன?'
      },
      a: {
        en: 'The Supreme Court ruled under Article 200 that Governors cannot sit indefinitely on bills passed by elected state legislatures. If an Assembly re-passes a bill, the Governor must grant assent, eliminating unconstitutional pocket-vetoes and upholding federal democracy.',
        ta: 'அரசியலமைப்பு உறுப்பு 200-ன் படி மக்களால் தேர்ந்தெடுக்கப்பட்ட சட்டமன்றம் நிறைவேற்றும் மசோதாக்களை ஆளுநர்கள் காலவரையின்றி முடக்க முடியாது என உச்ச நீதிமன்றம் தெளிவுபடுத்தியுள்ளது. சட்டமன்றம் மீண்டும் நிறைவேற்றினால் ஒப்புதல் அளிப்பது கட்டாயமாகும்.'
      }
    },
    {
      q: {
        en: 'What are the requirements for an advocate to register with DMK Legal Wing?',
        ta: 'திமுக வழக்கறிஞர் அணியில் உறுப்பினராக இணைய வழக்கறிஞர்களுக்குத் தேவையான தகுதிகள் யாவை?'
      },
      a: {
        en: 'Any advocate enrolled with the Bar Council of Tamil Nadu & Puducherry who subscribes to social justice, constitutional democracy, and secularism may apply via our online Advocate Registration portal.',
        ta: 'தமிழ்நாடு & புதுச்சேரி பார் கவுன்சிலில் முறையாகப் பதிவுசெய்து, சமூக நீதி மற்றும் அரசமைப்பு ஜனநாயகக் கொள்கைகளில் நம்பிக்கையுள்ள எந்தவொரு வழக்கறிஞரும் இணையவழியில் விண்ணப்பித்து அணியில் இணையலாம்.'
      }
    }
  ];

  const handleDownload = (res: LegalResource) => {
    setDownloadSuccessToast(res.title[language]);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="w-full flex flex-col space-y-10 py-8 bg-[#FAF7F2] text-[#111111] font-dmk-body">
      
      {/* Law Journal Header Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border-b-2 border-neutral-900 pb-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#111111] text-white text-[10px] font-mono uppercase px-2 py-0.5 tracking-widest font-bold">
                  {language === 'ta' ? 'அரசமைப்பு & சட்ட ஆவணக் களஞ்சியம்' : 'MADRAS LAW & CONSTITUTIONAL JOURNAL'}
                </span>
                <span className="text-[11px] font-mono text-[#E31E24] font-bold">
                  REPORTS & DIGEST • SERIES VIII
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight uppercase leading-none">
                {language === 'ta'
                  ? 'சட்ட ஆவணங்கள், தீர்ப்புகள் & கையேடுகள்'
                  : 'Constitutional Reports, Judgments & Statutes'}
              </h1>
            </div>
            <div className="text-left md:text-right font-mono text-[11px] text-neutral-600">
              <p className="font-bold text-[#111111]">JURISPRUDENCE ARCHIVE</p>
              <p>Social Justice & State Autonomy Doctrines</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-dmk-body max-w-4xl">
            {language === 'ta'
              ? '69% இடஒதுக்கீடு அரசமைப்பு ஆவணங்கள், ராஜமன்னார் மாநில சுயாட்சி அறிக்கை, ஆளுநர் அதிகார வரம்புத் தீர்ப்புகள் மற்றும் மக்கள் சட்ட உதவி கையேடுகளின் அதிகாரப்பூர்வ சட்டப் பதிவேடு.'
              : 'Primary constitutional materials, landmark Supreme Court judgments, statutory defenses, and citizen advocacy digests curated for advocate research and democratic legal awareness.'}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white border-y border-neutral-300 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#E31E24]" />
              {language === 'ta' ? 'வகைப்பாடு:' : 'SERIES:'}
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === c
                    ? 'bg-[#E31E24] text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {c === 'All' ? (language === 'ta' ? 'அனைத்து ஆவணங்கள்' : 'All Series') : c}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'ஆவணம் அல்லது வழக்கு எண் தேடுக...' : 'Search dossier or citation...'}
              className="w-full bg-[#FAF7F2] border border-neutral-300 pl-9 pr-3 py-1.5 text-xs text-[#111111] font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E31E24]"
            />
          </div>

        </div>
      </section>

      {/* Download Alert Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white border-2 border-[#E31E24] px-5 py-3 shadow-md flex items-center gap-3 font-mono">
          <CheckCircle2 className="w-5 h-5 text-[#E31E24] shrink-0" />
          <div className="text-xs">
            <strong className="block font-bold text-white">
              {language === 'ta' ? 'ஆவணம் பதிவிறக்கம் தொடங்கப்பட்டது' : 'LEGAL DOSSIER DOWNLOAD INITIATED'}
            </strong>
            <span className="line-clamp-1 text-neutral-300">{downloadSuccessToast}</span>
          </div>
        </div>
      )}

      {/* Legal Resources Law Journal Grid (Clean Border, No Card Appearance) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <article
              key={res.id}
              className="bg-white border border-neutral-300 hover:border-neutral-900 p-6 flex flex-col justify-between transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 pb-2">
                  <span className="text-xs font-mono font-bold text-[#E31E24] bg-red-50 border border-red-200 px-2 py-0.5 uppercase">
                    {res.category}
                  </span>
                  {res.citation && (
                    <span className="text-[11px] font-mono font-bold text-neutral-700 bg-[#FAF7F2] px-2 py-0.5 border border-neutral-300">
                      CITATION: {res.citation}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline leading-tight group-hover:text-[#E31E24] transition-colors">
                  {res.title[language]}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-dmk-body">
                  {res.summary[language]}
                </p>

                {/* Key Legal Highlights Box */}
                <div className="p-3 bg-[#FAF7F2] border-l-2 border-[#E31E24] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-neutral-900 uppercase tracking-wider block">
                    {language === 'ta' ? 'முக்கிய சட்டக் கூறுகள்:' : 'JURISPRUDENCE RECORD:'}
                  </span>
                  <div className="space-y-1">
                    {res.keyHighlights[language].map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-800 font-dmk-body">
                        <span className="w-1.5 h-1.5 bg-[#E31E24] shrink-0 mt-1.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-600 font-bold">
                  PDF • {res.fileSize}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedResource(res)}
                    className="text-xs font-mono font-bold text-neutral-900 hover:text-[#E31E24] px-3 py-1 bg-[#FAF7F2] hover:bg-neutral-200 border border-neutral-300 transition-colors"
                  >
                    {language === 'ta' ? 'விளக்கம்' : 'Digest'}
                  </button>

                  <button
                    onClick={() => handleDownload(res)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#E31E24] hover:bg-[#111111] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'பதிவிறக்குக' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Frequently Asked Legal Questions Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="border-t-2 border-neutral-900 pt-8">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E31E24] uppercase tracking-widest mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'அடிக்கடி கேட்கப்படும் சட்டக் கேள்விகள்' : 'CONSTITUTIONAL & STATUTORY FAQ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline mb-6 uppercase">
            {language === 'ta' ? 'அரசமைப்பு & பொது சட்ட வினா-விடைகள்' : 'Constitutional Jurisprudence & Citizen Rights'}
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-neutral-300 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#111111] font-dmk-headline pr-4">
                      {faq.q[language]}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#E31E24] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-700 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-neutral-800 leading-relaxed border-t border-neutral-200 bg-[#FAF7F2] font-dmk-body">
                      {faq.a[language]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border-2 border-neutral-900 max-w-2xl w-full p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto font-dmk-body">
            
            <div className="w-full h-1 flex absolute top-0 left-0">
              <div className="w-1/2 bg-black" />
              <div className="w-1/2 bg-[#E31E24]" />
            </div>

            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-5 right-5 w-8 h-8 bg-white hover:bg-[#E31E24] hover:text-white text-neutral-900 border border-neutral-900 flex items-center justify-center font-bold text-sm transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 mt-2">
              <span className="text-xs font-mono font-bold text-[#E31E24] uppercase tracking-wider block">
                {selectedResource.category} • {selectedResource.court || 'Constitutional Repository'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-dmk-headline leading-tight">
                {selectedResource.title[language]}
              </h2>

              {selectedResource.citation && (
                <div className="p-2.5 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 font-bold">
                  CITATION: {selectedResource.citation}
                </div>
              )}

              <p className="text-sm text-neutral-800 leading-relaxed font-dmk-body">
                {selectedResource.summary[language]}
              </p>

              <div className="pt-2 space-y-2">
                <h4 className="font-mono text-xs font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-300 pb-1">
                  {language === 'ta' ? 'அரசமைப்பு அம்சங்கள்' : 'CONSTITUTIONAL DIGEST HIGHLIGHTS'}
                </h4>
                <div className="space-y-1.5">
                  {selectedResource.keyHighlights[language].map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-800 font-dmk-body">
                      <CheckCircle2 className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-300 flex items-center justify-between">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-4 py-2 bg-white hover:bg-neutral-200 border border-neutral-300 text-neutral-900 text-xs font-mono font-bold uppercase"
                >
                  {language === 'ta' ? 'மூடுக' : 'Close Digest'}
                </button>

                <button
                  onClick={() => {
                    handleDownload(selectedResource);
                    setSelectedResource(null);
                  }}
                  className="px-5 py-2 bg-[#E31E24] hover:bg-neutral-900 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'பதிவிறக்குக' : 'Download Complete Dossier'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
