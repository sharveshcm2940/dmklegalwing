'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { DMK_ORGANISATION_INFO } from '../data/content';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#141416] text-neutral-300 border-t-4 border-[#E31E24] relative overflow-hidden font-tamil-sans">
      
      {/* Top Banner with dual stripe */}
      <div className="w-full h-1 flex">
        <div className="w-1/2 bg-black" />
        <div className="w-1/2 bg-[#E31E24]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Profile with authentic DMK Flag & Rising Sun Emblem */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[2px] bg-white p-1 border border-neutral-700 shrink-0 flex items-center justify-center">
                <img
                  src="/images/dmk-flag-sun.jpg"
                  alt="DMK Flag & Rising Sun"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-bold tracking-widest text-[#C41A1F] uppercase block font-tamil-serif">
                  {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி' : 'DMK LEGAL WING'}
                </span>
                <span className="text-base font-tamil-serif font-bold text-white tracking-wide block">
                  {language === 'ta' ? 'திராவிட முன்னேற்றக் கழகம்' : 'Dravida Munnetra Kazhagam'}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Tamil Nadu, India • Estd. 1971
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md font-tamil-sans">
              {t.footer.desc}
            </p>

            {/* Core Ideological Maxim */}
            <div className="p-4 rounded-[2px] bg-black/60 border-l-4 border-[#E31E24] border-t border-r border-b border-neutral-800 text-xs">
              <span className="text-[#C41A1F] font-bold block mb-1 uppercase tracking-wider text-[11px]">
                {language === 'ta' ? 'கொள்கை முழக்கம்:' : 'Guiding Maxim:'}
              </span>
              <p className="italic text-neutral-200 font-tamil-serif text-sm">
                {language === 'ta'
                  ? '‘சமூக நீதியை காப்போம்! அரசமைப்பு விழுமியங்களை நிலைநிறுத்துவோம்! மாநிலத்தில் சுயாட்சி காண்போம்!’'
                  : '“Defend Social Justice, Protect Constitutional Values, Uphold State Autonomy.”'}
              </p>
            </div>

            {/* Official Headquarters */}
            <div className="space-y-3 pt-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#C41A1F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200 block">
                    {language === 'ta' ? 'கழகத் தலைமைச் செயலகம்:' : 'Party Headquarters:'}
                  </strong>
                  <span>{DMK_ORGANISATION_INFO.headquarters[language]}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C41A1F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200 block">
                    {language === 'ta' ? 'உயர் நீதிமன்ற அலுவலகம்:' : 'High Court Chambers:'}
                  </strong>
                  <span>{DMK_ORGANISATION_INFO.highCourtOffice[language]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2 font-tamil-serif">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: t.nav.home },
                { href: '/about', label: t.nav.about },
                { href: '/structure', label: t.nav.structure },
                { href: '/districts', label: t.nav.districts },
                { href: '/activities', label: t.nav.activities },
                { href: '/resources', label: language === 'ta' ? 'சட்ட ஆவணங்கள்' : 'Legal Resources' },
                { href: '/contact', label: t.nav.contact }
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 text-neutral-400"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C41A1F]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Core Ideological Principles */}
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2 font-tamil-serif">
              {t.footer.ideologyLinks}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/ideology#social-justice', label: language === 'ta' ? 'சமூக நீதி & இடஒதுக்கீடு' : 'Social Justice & 69% Quota' },
                { href: '/ideology#self-respect', label: language === 'ta' ? 'சுயமரியாதை இயக்கம் & சட்டங்கள்' : 'Self-Respect Marriage Act' },
                { href: '/ideology#federalism', label: language === 'ta' ? 'மாநில சுயாட்சி & கூட்டாட்சி' : 'Federalism & State Autonomy' },
                { href: '/ideology#tamil-language', label: language === 'ta' ? 'நீதிமன்றங்களில் தமிழ்' : 'Tamil in Madras High Court' },
                { href: '/resources', label: language === 'ta' ? 'ராஜமன்னார் குழு அறிக்கை' : 'Rajamannar Autonomy Report' },
                { href: '/resources', label: language === 'ta' ? 'ஆளுநர் அதிகார வரம்பு தீர்ப்பு' : 'Governor Assent Landmark Ruling' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 text-neutral-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-[2px] bg-[#E31E24]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Verification & Secretariat Links */}
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2 font-tamil-serif">
              {t.footer.contactInfo}
            </h3>
            <div className="space-y-3">
              <a 
                href={`tel:${DMK_ORGANISATION_INFO.phone}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C41A1F]" />
                <span className="font-mono">{DMK_ORGANISATION_INFO.phone}</span>
              </a>

              <a 
                href={`mailto:${DMK_ORGANISATION_INFO.email}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C41A1F]" />
                <span className="font-mono">{DMK_ORGANISATION_INFO.email}</span>
              </a>

              <div className="pt-2 border-t border-neutral-800">
                <Link
                  href="/contact#register"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#E31E24] hover:bg-[#C41A1F] text-white rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.nav.registerAdvocate}</span>
                </Link>
              </div>

              <div className="pt-1">
                <Link
                  href="/admin"
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>{language === 'ta' ? 'அங்கீகரிக்கப்பட்ட நிர்வாக போர்டல்' : 'Authorized Admin Portal'}</span>
                  <ExternalLink className="w-3 h-3 text-[#C41A1F]" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-4 font-tamil-sans">
          <p className="max-w-2xl text-center md:text-left leading-relaxed">
            {t.footer.disclaimer}
          </p>
          <div className="text-center md:text-right shrink-0">
            <p className="text-neutral-400 font-mono">
              {t.footer.copyright}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
