'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Scale, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'dmk_draft_enrol';

const SPECIALIZATIONS = [
  'Constitutional Law',
  'Criminal Jurisprudence',
  'Civil & Property Law',
  'Labour & Industrial Law',
  'Service & Employment Law',
  'Human Rights & PIL',
  'Women & Family Welfare'
];

export default function EnrolPage() {
  const { language } = useLanguage();
  const { districts } = useData();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [barCouncilNumber, setBarCouncilNumber] = useState('');
  const [yearOfEnrollment, setYearOfEnrollment] = useState('');
  const [district, setDistrict] = useState('');
  const [courtOfPractice, setCourtOfPractice] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [address, setAddress] = useState('');
  const [areasOfSpecialization, setAreasOfSpecialization] = useState<string[]>(['Constitutional Law']);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.fullName) setFullName(data.fullName);
        if (data.barCouncilNumber) setBarCouncilNumber(data.barCouncilNumber);
        if (data.yearOfEnrollment) setYearOfEnrollment(data.yearOfEnrollment);
        if (data.district) setDistrict(data.district);
        if (data.courtOfPractice) setCourtOfPractice(data.courtOfPractice);
        if (data.mobileNumber) setMobileNumber(data.mobileNumber);
        if (data.emailAddress) setEmailAddress(data.emailAddress);
        if (data.address) setAddress(data.address);
        if (Array.isArray(data.areasOfSpecialization) && data.areasOfSpecialization.length > 0) {
          setAreasOfSpecialization(data.areasOfSpecialization);
        }
        setIsDraftRestored(true);
      }
    } catch {
      // Local storage unreadable or unavailable
    }
  }, []);

  // Set default district if none selected
  useEffect(() => {
    if (!district && districts.length > 0) {
      setDistrict(districts[0].name.en);
    }
  }, [districts, district]);

  // Save draft whenever inputs change
  useEffect(() => {
    const draft = {
      fullName,
      barCouncilNumber,
      yearOfEnrollment,
      district,
      courtOfPractice,
      mobileNumber,
      emailAddress,
      address,
      areasOfSpecialization
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Local storage unavailable
    }
  }, [fullName, barCouncilNumber, yearOfEnrollment, district, courtOfPractice, mobileNumber, emailAddress, address, areasOfSpecialization]);

  const toggleSpecialization = (spec: string) => {
    if (areasOfSpecialization.includes(spec)) {
      setAreasOfSpecialization(areasOfSpecialization.filter((s) => s !== spec));
    } else {
      setAreasOfSpecialization([...areasOfSpecialization, spec]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError(language === 'ta' ? 'முழு பெயரை உள்ளிடவும்.' : 'Full name is required.');
      return;
    }
    if (!barCouncilNumber.trim()) {
      setFormError(language === 'ta' ? 'பார் கவுன்சில் பதிவெண்ணை உள்ளிடவும்.' : 'Bar Council enrollment number is required.');
      return;
    }
    if (!mobileNumber.trim()) {
      setFormError(language === 'ta' ? 'கைபேசி எண்ணை உள்ளிடவும்.' : 'Mobile number is required.');
      return;
    }
    if (!emailAddress.trim()) {
      setFormError(language === 'ta' ? 'மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Email address is required.');
      return;
    }
    if (!district) {
      setFormError(language === 'ta' ? 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.' : 'District selection is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          barCouncilNumber: barCouncilNumber.trim(),
          yearOfEnrollment: yearOfEnrollment.trim() || '2024',
          district: district.trim(),
          courtOfPractice: courtOfPractice.trim() || 'District & Sessions Court',
          mobileNumber: mobileNumber.trim(),
          emailAddress: emailAddress.trim(),
          address: address.trim(),
          areasOfSpecialization
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.registration?.id) {
        // Clear draft from localStorage
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}

        router.push(`/confirmation?type=enrol&id=${encodeURIComponent(data.registration.id)}`);
      } else {
        setFormError(
          data.error ||
            (language === 'ta'
              ? 'பதிவு செய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
              : 'Failed to submit registration. Please check fields and try again.')
        );
      }
    } catch {
      setFormError(
        language === 'ta'
          ? 'சர்வர் இணைப்பு தோல்வியடைந்தது. சிறிது நேரம் கழித்து முயற்சிக்கவும்.'
          : 'Server connection failed. Please try again shortly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] py-8 sm:py-12 text-[#111111]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#5B5348]">
          <Link href="/" className="hover:text-[#111111] underline">
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/contact" className="hover:text-[#111111] underline">
            {language === 'ta' ? 'தொடர்பு & உதவி' : 'Contact & Desk'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold">
            {language === 'ta' ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை' : 'Advocate Enrolment'}
          </span>
        </div>

        {/* Page Header */}
        <div className="border-b-2 border-[#111111] pb-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block" />
            <span className="text-xs font-dmk-body text-[#C41A1F] font-bold uppercase tracking-wider">
              {language === 'ta' ? 'அதிகாரப்பூர்வ சேர்க்கை படிவம்' : 'Official Enrolment Registry'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] font-dmk-headline">
            {language === 'ta' ? 'திமுக வழக்கறிஞர் அணி உறுப்பினர் சேர்க்கை' : 'Advocate Membership Enrolment'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5348] font-dmk-body mt-2 leading-relaxed">
            {language === 'ta'
              ? 'நீதிமன்றங்களில் சமூக நீதியையும் மாநில சுயாட்சியையும் காக்க திமுக வழக்கறிஞர் அணியில் தங்களை இணைத்துக்கொள்ளுங்கள்.'
              : 'Join the vanguard of advocates defending social justice, constitutional federalism, and human dignity across all tiers of judiciary.'}
          </p>
        </div>

        {/* Restored Draft Notice */}
        {isDraftRestored && (
          <div className="mb-6 p-3 bg-white border border-[#D8D3CB] flex items-center justify-between text-xs text-[#5B5348] rounded-[2px]">
            <span>
              {language === 'ta'
                ? 'முன்பு பூர்த்தி செய்த விவரங்கள் உங்கள் உலாவியில் இருந்து மீட்கப்பட்டுள்ளன.'
                : 'A saved draft from your previous session has been restored.'}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setFullName('');
                setBarCouncilNumber('');
                setYearOfEnrollment('');
                setCourtOfPractice('');
                setMobileNumber('');
                setEmailAddress('');
                setAddress('');
                setIsDraftRestored(false);
              }}
              className="text-[#C41A1F] hover:underline font-semibold ml-2 cursor-pointer"
            >
              {language === 'ta' ? 'படிவத்தை அழிக்கவும்' : 'Clear Draft'}
            </button>
          </div>
        )}

        {/* Error banner */}
        {formError && (
          <div className="mb-6 p-4 bg-[#FCE8E8] border-l-4 border-[#C41A1F] text-[#C41A1F] text-xs sm:text-sm font-semibold flex items-center gap-2 rounded-[2px]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Enrollment Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-[#111111] p-6 sm:p-10 rounded-[2px] shadow-xs space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'முழு பெயர் *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'ta' ? 'முழு பெயர்' : 'Adv. A. Senthil Nathan'}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none"
              />
            </div>

            {/* Bar Council Number */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'பார் கவுன்சில் பதிவெண் *' : 'Bar Council Number *'}
              </label>
              <input
                type="text"
                required
                value={barCouncilNumber}
                onChange={(e) => setBarCouncilNumber(e.target.value)}
                placeholder="MS / 1420 / 2012"
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none font-mono"
              />
            </div>

            {/* Year of Enrollment */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'சேர்க்கை ஆண்டு' : 'Year of Enrolment'}
              </label>
              <input
                type="number"
                min="1950"
                max="2030"
                value={yearOfEnrollment}
                onChange={(e) => setYearOfEnrollment(e.target.value)}
                placeholder="2012"
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none font-mono"
              />
            </div>

            {/* 74-District Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'கழக மாவட்டம் *' : 'Party District *'}
              </label>
              <select
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.name.en}>
                    {d.name[language]} ({d.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Court of Practice */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'பணிபுரியும் நீதிமன்றம்' : 'Primary Court of Practice'}
              </label>
              <input
                type="text"
                value={courtOfPractice}
                onChange={(e) => setCourtOfPractice(e.target.value)}
                placeholder={language === 'ta' ? 'சென்னை உயர் நீதிமன்றம்' : 'Madras High Court / District Court'}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'கைபேசி எண் *' : 'Mobile Number *'}
              </label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 98400 12345"
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none font-mono"
              />
            </div>

            {/* Email Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
              </label>
              <input
                type="email"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="advocate@example.com"
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none"
              />
            </div>

            {/* Chamber / Office Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'அலுவலக முகவரி' : 'Chamber / Residential Address'}
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'ta' ? 'அலுவலக எண், தெரு பெயர், அஞ்சல் குறியீடு...' : 'Chamber No., Street name, Pincode...'}
                className="w-full p-3.5 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none"
              />
            </div>

          </div>

          {/* Areas of Specialization */}
          <div className="pt-4 border-t border-[#D8D3CB]">
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
              {language === 'ta' ? 'சிறப்பு சட்டப் பிரிவுகள்' : 'Areas of Legal Specialization'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {SPECIALIZATIONS.map((spec) => {
                const selected = areasOfSpecialization.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialization(spec)}
                    className={`min-h-[44px] px-3.5 py-2 text-xs font-medium text-left border flex items-center justify-between rounded-[2px] transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#C41A1F] bg-[#FCE8E8] text-[#C41A1F] font-bold'
                        : 'border-[#D8D3CB] bg-[#FAF8F5] text-[#111111] hover:border-[#111111]'
                    }`}
                  >
                    <span>{spec}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-[#C41A1F] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-[#D8D3CB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#5B5348] font-dmk-body">
              {language === 'ta'
                ? 'விவரங்கள் மாநில தலைமையகத்தால் சரிபார்க்கப்பட்டு பதிவு அட்டை வழங்கப்படும்.'
                : 'Enrolment undergoes verification by the State Secretariat before issuance of identity credential.'}
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[44px] px-8 py-3 bg-[#E31E24] hover:bg-[#C41A1F] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>
                {isSubmitting
                  ? language === 'ta'
                    ? 'பதிவு செய்யப்படுகிறது...'
                    : 'Submitting...'
                  : language === 'ta'
                  ? 'விண்ணப்பத்தைச் சமர்ப்பிக்கவும்'
                  : 'Submit Advocate Enrolment'}
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </form>

        {/* Status Tracker Callout */}
        <div className="mt-8 p-4 bg-white border border-[#D8D3CB] flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[2px]">
          <div className="text-xs text-[#5B5348]">
            <span className="font-bold text-[#111111] block mb-0.5">
              {language === 'ta' ? 'ஏற்கனவே விண்ணப்பித்துவிட்டீர்களா?' : 'Already submitted your enrolment?'}
            </span>
            {language === 'ta'
              ? 'உங்கள் கண்காணிப்பு அடையாள எண்ணைக் (Tracking ID) கொண்டு நிலையை அறிந்து கொள்ளலாம்.'
              : 'Check the real-time review status using your unique application tracking ID.'}
          </div>
          <Link
            href="/track"
            className="min-h-[44px] px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#111111] hover:text-white border border-[#111111] text-xs font-bold uppercase tracking-wider text-[#111111] rounded-[2px] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>{language === 'ta' ? 'நிலையை அறிய' : 'Track Status'}</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
