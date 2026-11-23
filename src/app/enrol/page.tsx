'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';

const STORAGE_KEY = 'dmk_draft_enrol';

const EXPERIENCE_TIERS = [
  { id: 'Junior 0-5 years', en: 'Junior (0-5 years)', ta: 'இளநிலை (0-5 ஆண்டுகள்)' },
  { id: 'Mid 5-15 years', en: 'Mid (5-15 years)', ta: 'நடுத்தர நிலை (5-15 ஆண்டுகள்)' },
  { id: 'Senior 15+ years', en: 'Senior (15+ years)', ta: 'மூத்த நிலை (15+ ஆண்டுகள்)' }
];

const PRACTICE_DOMAINS = [
  { id: 'Constitutional Law', en: 'Constitutional Law', ta: 'அரசமைப்புச் சட்டம்' },
  { id: 'Criminal Jurisprudence', en: 'Criminal Jurisprudence', ta: 'குற்றவியல் சட்டம்' },
  { id: 'Civil & Property Law', en: 'Civil & Property Law', ta: 'உரிமையியல் & சொத்துரிமை சட்டம்' },
  { id: 'Labour & Industrial Law', en: 'Labour & Industrial Law', ta: 'தொழிலாளர் & தொழிற்சாலை சட்டம்' },
  { id: 'Human Rights & PIL', en: 'Human Rights & PIL', ta: 'மனித உரிமைகள் & பொதுநல வழக்குகள்' },
  { id: 'Service & Administrative Law', en: 'Service & Administrative Law', ta: 'பணி மற்றும் நிர்வாக சட்டம்' }
];

export default function EnrolPage() {
  const { language } = useLanguage();
  const { districts } = useData();
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [barCouncilNumber, setBarCouncilNumber] = useState('');
  const [practiceDomain, setPracticeDomain] = useState('Constitutional Law');
  const [experienceTier, setExperienceTier] = useState('Junior 0-5 years');
  const [district, setDistrict] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  // Error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainSection = useReveal();

  // Restore draft from browser storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.fullName) setFullName(data.fullName);
        if (data.tamilName) setTamilName(data.tamilName);
        if (data.barCouncilNumber) setBarCouncilNumber(data.barCouncilNumber);
        if (data.practiceDomain) setPracticeDomain(data.practiceDomain);
        if (data.experienceTier) setExperienceTier(data.experienceTier);
        if (data.district) setDistrict(data.district);
        if (data.mobileNumber) setMobileNumber(data.mobileNumber);
        if (data.emailAddress) setEmailAddress(data.emailAddress);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Set default district if none selected
  useEffect(() => {
    if (!district && districts.length > 0) {
      setDistrict(districts[0].name.en);
    }
  }, [districts, district]);

  // Save half-finished form in browser storage
  useEffect(() => {
    const draft = {
      fullName,
      tamilName,
      barCouncilNumber,
      practiceDomain,
      experienceTier,
      district,
      mobileNumber,
      emailAddress
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore
    }
  }, [fullName, tamilName, barCouncilNumber, practiceDomain, experienceTier, district, mobileNumber, emailAddress]);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errs.fullName = language === 'ta' ? 'முழுப் பெயரை உள்ளிடவும்.' : 'Full name is required.';
    }
    if (!barCouncilNumber.trim()) {
      errs.barCouncilNumber =
        language === 'ta'
          ? 'பார் கவுன்சில் பதிவு எண்ணை உள்ளிடவும் (எ.கா: MS/1234/2018).'
          : 'Bar Council enrolment number is required (e.g. MS/1234/2018).';
    }
    if (!district.trim()) {
      errs.district = language === 'ta' ? 'கழக அமைப்பு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.' : 'Party district unit is required.';
    }
    if (!mobileNumber.trim()) {
      errs.mobileNumber = language === 'ta' ? 'தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Phone number is required.';
    } else if (!/^\+?[\d\s-]{7,15}$/.test(mobileNumber.trim())) {
      errs.mobileNumber = language === 'ta' ? 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter a valid phone number.';
    }
    if (!emailAddress.trim()) {
      errs.emailAddress = language === 'ta' ? 'மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      errs.emailAddress = language === 'ta' ? 'சரியான மின்னஞ்சலை உள்ளிடவும்.' : 'Please enter a valid email address.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        barCouncilNumber: barCouncilNumber.trim(),
        mobileNumber: mobileNumber.trim(),
        emailAddress: emailAddress.trim(),
        district: district.trim(),
        courtOfPractice: experienceTier,
        yearOfEnrollment: new Date().getFullYear().toString(),
        address: tamilName.trim(),
        areasOfSpecialization: [practiceDomain.trim()]
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.registration?.id) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        router.push(`/confirmation?id=${encodeURIComponent(data.registration.id)}&type=enrol`);
      } else {
        setErrors({
          form: data.error || (language === 'ta' ? 'விண்ணப்பத்தைப் பதிவு செய்வதில் பிழை ஏற்பட்டது.' : 'Failed to submit enrolment.')
        });
        setIsSubmitting(false);
      }
    } catch {
      setErrors({
        form: language === 'ta' ? 'சர்வர் தொடர்பு பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Network error. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      {/* Title band: "Advocate enrolment" / "வழக்கறிஞர் உறுப்பினர் சேர்க்கை" */}
      <PageTitleBand
        title={language === 'ta' ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை' : 'Advocate enrolment'}
        description={
          language === 'ta'
            ? 'திமுக வழக்கறிஞர் அணியின் 74 அமைப்பு மாவட்டங்கள் மற்றும் நீதிமன்றப் பிரிவுகளில் இணைய அதிகாரப்பூர்வ விண்ணப்பம்.'
            : 'Official enrolment application for advocates joining the DMK Legal Wing across 74 party district units.'
        }
      />

      {/* The form in one 720 px column */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12">
        <section
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''} bg-white border-2 border-[#111111] p-6 sm:p-10`}
        >
          {errors.form && (
            <div className="mb-6 p-4 bg-[#f1ece2] border-l-4 border-[#C41A1F] text-[#C41A1F] font-bold text-[15px]">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-10">
            
            {/* Section 1: Identity */}
            <div className="border-t-[3px] border-[#111111] pt-6 space-y-6">
              <h2 className="text-[#111111] flex items-center gap-2">
                <span className="font-manrope font-extrabold text-[24px] text-[#C41A1F]">1.</span>
                <span className={language === 'ta' ? 'font-kavivanar font-normal text-[26px] leading-[1.3]' : 'font-manrope font-extrabold text-[24px]'}>
                  {language === 'ta' ? 'சுய விவரங்கள்' : 'Identity'}
                </span>
              </h2>

              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'முழுப் பெயர் (ஆங்கிலத்தில்) *' : 'Full name (as registered in Bar Council) *'}
                </label>
                <input
                  id="fullName"
                  type="text"
                  tabIndex={1}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder={language === 'ta' ? 'எ.கா: R. Viduthalai' : 'e.g. R. Viduthalai'}
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
                {errors.fullName && (
                  <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Tamil Name */}
              <div className="space-y-1">
                <label htmlFor="tamilName" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'பெயர் (தமிழில்)' : 'Tamil name'}
                </label>
                <input
                  id="tamilName"
                  type="text"
                  tabIndex={2}
                  value={tamilName}
                  onChange={(e) => setTamilName(e.target.value)}
                  placeholder={language === 'ta' ? 'எ.கா: இரா. விடுதலை' : 'e.g. இரா. விடுதலை'}
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Section 2: Practice */}
            <div className="border-t-[3px] border-[#111111] pt-6 space-y-6">
              <h2 className="text-[#111111] flex items-center gap-2">
                <span className="font-manrope font-extrabold text-[24px] text-[#C41A1F]">2.</span>
                <span className={language === 'ta' ? 'font-kavivanar font-normal text-[26px] leading-[1.3]' : 'font-manrope font-extrabold text-[24px]'}>
                  {language === 'ta' ? 'தொழில் விவரங்கள்' : 'Practice'}
                </span>
              </h2>

              {/* Bar Council enrolment number */}
              <div className="space-y-1">
                <label htmlFor="barCouncilNumber" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'பார் கவுன்சில் பதிவு எண் *' : 'Bar Council enrolment number *'}
                </label>
                <input
                  id="barCouncilNumber"
                  type="text"
                  tabIndex={3}
                  value={barCouncilNumber}
                  onChange={(e) => {
                    setBarCouncilNumber(e.target.value);
                    if (errors.barCouncilNumber) setErrors({ ...errors, barCouncilNumber: '' });
                  }}
                  placeholder="MS/1234/2018"
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] font-mono text-[#111111] leading-normal focus:bg-white outline-none"
                />
                <p className="text-[13px] text-[#5B5348] leading-normal">
                  {language === 'ta' ? 'உதாரண வடிவம்: MS/1234/2018' : 'Example format: MS/1234/2018'}
                </p>
                {errors.barCouncilNumber && (
                  <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.barCouncilNumber}</p>
                )}
              </div>

              {/* Practice domain */}
              <div className="space-y-1">
                <label htmlFor="practiceDomain" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'முதன்மை பயிற்சிப் பிரிவு *' : 'Practice domain *'}
                </label>
                <select
                  id="practiceDomain"
                  tabIndex={4}
                  value={practiceDomain}
                  onChange={(e) => setPracticeDomain(e.target.value)}
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none cursor-pointer"
                >
                  {PRACTICE_DOMAINS.map((dom) => (
                    <option key={dom.id} value={dom.id}>
                      {language === 'ta' ? dom.ta : dom.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience tier */}
              <div className="space-y-2">
                <span className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'அனுபவ அடுக்கு' : 'Experience tier'}{' '}
                  <span className="text-[#C41A1F] font-bold">*</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
                  {EXPERIENCE_TIERS.map((tier, idx) => {
                    const isSelected = experienceTier === tier.id;
                    return (
                      <label
                        key={tier.id}
                        className={`h-full min-h-[56px] px-3.5 py-3 border-2 border-[#111111] flex items-start gap-2.5 cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#111111] text-white' : 'bg-[#FAF8F5] hover:bg-[#f1ece2] text-[#111111]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="experienceTier"
                          tabIndex={5 + idx}
                          value={tier.id}
                          checked={isSelected}
                          onChange={() => setExperienceTier(tier.id)}
                          className="w-4 h-4 rounded-none accent-[#E31E24] cursor-pointer shrink-0 mt-1"
                        />
                        <span className="text-[14px] font-bold leading-snug">
                          {language === 'ta' ? tier.ta : tier.en}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Unit */}
            <div className="border-t-[3px] border-[#111111] pt-6 space-y-6">
              <h2 className="text-[#111111] flex items-center gap-2">
                <span className="font-manrope font-extrabold text-[24px] text-[#C41A1F]">3.</span>
                <span className={language === 'ta' ? 'font-kavivanar font-normal text-[26px] leading-[1.3]' : 'font-manrope font-extrabold text-[24px]'}>
                  {language === 'ta' ? 'அமைப்பு மாவட்டம்' : 'Unit'}
                </span>
              </h2>

              {/* Dropdown of all 74 party districts */}
              <div className="space-y-1">
                <label htmlFor="districtUnit" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? '74 கழக அமைப்பு மாவட்டம் *' : 'Party district unit (74 districts) *'}
                </label>
                <select
                  id="districtUnit"
                  tabIndex={8}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (errors.district) setErrors({ ...errors, district: '' });
                  }}
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none cursor-pointer"
                >
                  <option value="">
                    {language === 'ta' ? '-- அமைப்பு மாவட்டத்தைத் தேர்ந்தெடுக்கவும் --' : '-- Select party district unit --'}
                  </option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name.en}>
                      {language === 'ta' ? `${d.name.ta} (${d.zone || ''})` : `${d.name.en} (${d.zone || ''})`}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.district}</p>
                )}
              </div>
            </div>

            {/* Section 4: Contact */}
            <div className="border-t-[3px] border-[#111111] pt-6 space-y-6">
              <h2 className="text-[#111111] flex items-center gap-2">
                <span className="font-manrope font-extrabold text-[24px] text-[#C41A1F]">4.</span>
                <span className={language === 'ta' ? 'font-kavivanar font-normal text-[26px] leading-[1.3]' : 'font-manrope font-extrabold text-[24px]'}>
                  {language === 'ta' ? 'தொடர்பு விவரங்கள்' : 'Contact'}
                </span>
              </h2>

              {/* Phone */}
              <div className="space-y-1">
                <label htmlFor="mobileNumber" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'தொலைபேசி எண் *' : 'Phone number *'}
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  tabIndex={9}
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: '' });
                  }}
                  placeholder="+91 98400 12345"
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
                {errors.mobileNumber && (
                  <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="emailAddress" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'மின்னஞ்சல் முகவரி *' : 'Email address *'}
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  tabIndex={10}
                  value={emailAddress}
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                    if (errors.emailAddress) setErrors({ ...errors, emailAddress: '' });
                  }}
                  placeholder="advocate@example.com"
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
                {errors.emailAddress && (
                  <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.emailAddress}</p>
                )}
              </div>
            </div>

            {/* Submit enrolment button */}
            <div className="pt-4 border-t-2 border-[#111111]">
              <button
                type="submit"
                tabIndex={11}
                disabled={isSubmitting}
                className="w-full min-h-[52px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] disabled:opacity-50 text-white font-bold text-[16px] flex items-center justify-center text-center leading-normal cursor-pointer btn-lift transition-colors"
              >
                {isSubmitting
                  ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting enrolment...')
                  : (language === 'ta' ? 'சேர்க்கை மனுவை சமர்ப்பிக்க' : 'Submit enrolment')}
              </button>
            </div>

          </form>
        </section>
      </div>
    </div>
  );
}
