'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { IconCheck, IconChevronRight } from '@/components/Icons';

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

  const mainSection = useReveal();

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
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (!district && districts.length > 0) {
      setDistrict(districts[0].name.en);
    }
  }, [districts, district]);

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
      areasOfSpecialization,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore
    }
  }, [fullName, barCouncilNumber, yearOfEnrollment, district, courtOfPractice, mobileNumber, emailAddress, address, areasOfSpecialization]);

  const toggleSpecialization = (spec: string) => {
    if (areasOfSpecialization.includes(spec)) {
      if (areasOfSpecialization.length > 1) {
        setAreasOfSpecialization(areasOfSpecialization.filter((s) => s !== spec));
      }
    } else {
      setAreasOfSpecialization([...areasOfSpecialization, spec]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError(language === 'ta' ? 'முழுப் பெயரை உள்ளிடவும்.' : 'Full name is required.');
      return;
    }
    if (!barCouncilNumber.trim()) {
      setFormError(language === 'ta' ? 'பார் கவுன்சில் பதிவு எண்ணை உள்ளிடவும்.' : 'Bar Council enrolment number is required.');
      return;
    }
    if (!mobileNumber.trim()) {
      setFormError(language === 'ta' ? 'அலைபேசி எண்ணை உள்ளிடவும்.' : 'Mobile number is required.');
      return;
    }
    if (!emailAddress.trim()) {
      setFormError(language === 'ta' ? 'மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Email address is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        barCouncilNumber: barCouncilNumber.trim().toUpperCase(),
        yearOfEnrollment: yearOfEnrollment.trim() || new Date().getFullYear().toString(),
        district: district || (districts[0]?.name.en ?? 'Chennai'),
        courtOfPractice: courtOfPractice.trim() || 'District Court',
        mobileNumber: mobileNumber.trim(),
        emailAddress: emailAddress.trim(),
        address: address.trim(),
        areasOfSpecialization,
      };

      const res = await fetch('/api/enrol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        router.push(`/confirmation?id=${encodeURIComponent(data.trackingId)}&type=enrol`);
      } else {
        setFormError(data.error || (language === 'ta' ? 'விண்ணப்பத்தைச் சமர்ப்பிப்பதில் பிழை ஏற்பட்டது.' : 'Failed to submit registration.'));
      }
    } catch {
      setFormError(language === 'ta' ? 'சர்வர் இணைப்பு தோல்வியடைந்தது.' : 'Network connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'வழக்கறிஞர் உறுப்பினர் சேர்க்கை' : 'Advocate Membership Enrolment'}
        description={
          language === 'ta'
            ? 'திராவிட இயக்கத்தின் சட்டப் போர்ப்படையில் இணையுங்கள். பார் கவுன்சில் பதிவுபெற்ற வழக்கறிஞர்களுக்கான அதிகாரப்பூர்வ தளம்.'
            : 'Join the constitutional vanguard of the Dravidian movement. Official enrolment for Bar Council registered advocates.'
        }
      />

      <div className="max-w-[960px] mx-auto px-[clamp(20px,4vw,56px)] pt-12">
        
        <section 
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''}`}
        >
          {isDraftRestored && (
            <div className="p-4 bg-[#f1ece2] border-2 border-[#111111] mb-8 flex items-center justify-between text-[14px]">
              <span>
                {language === 'ta'
                  ? 'நீங்கள் முன்பு சேமித்த வரைவு விவரங்கள் மீட்டமைக்கப்பட்டுள்ளன.'
                  : 'Your previously saved application draft has been restored.'}
              </span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setIsDraftRestored(false);
                  setFullName('');
                  setBarCouncilNumber('');
                  setMobileNumber('');
                  setEmailAddress('');
                }}
                className="text-[#C41A1F] hover:underline font-bold cursor-pointer"
              >
                {language === 'ta' ? 'அழிக்க' : 'Discard Draft'}
              </button>
            </div>
          )}

          {formError && (
            <div className="p-4 bg-[#FCE8E8] border-2 border-[#C41A1F] text-[#C41A1F] font-bold text-[15px] mb-8">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#111111] p-8 sm:p-12 space-y-8">
            
            <div className="border-b-2 border-[#111111] pb-4">
              <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                {language === 'ta' ? 'படிவம் A-1' : 'FORM A-1'}
              </span>
              <h2 className="font-kavivanar font-normal text-[28px] text-[#111111]">
                {language === 'ta' ? 'உறுப்பினர் சேர்க்கை விண்ணப்பப் படிவம்' : 'Enrolment Application Form'}
              </h2>
            </div>

            {/* Grid 1: Name & Bar Council Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'முழுப் பெயர் (வழக்கறிஞர்)' : 'Full Name (Advocate)'} *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'ta' ? 'எ.கா. மு. க. அன்புச்செல்வன்' : 'e.g. M. K. Anbuselvan'}
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111]"
                />
              </div>

              <div>
                <label htmlFor="barCouncilNumber" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'பார் கவுன்சில் பதிவு எண்' : 'Bar Council Enrolment No.'} *
                </label>
                <input
                  id="barCouncilNumber"
                  type="text"
                  required
                  value={barCouncilNumber}
                  onChange={(e) => setBarCouncilNumber(e.target.value)}
                  placeholder="e.g. MS/1245/2012"
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111] font-mono"
                />
              </div>
            </div>

            {/* Grid 2: District & Court of Practice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="district" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'கழக அமைப்பு மாவட்டம்' : 'DMK Party District Unit'} *
                </label>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111] cursor-pointer"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.name.en}>
                      {d.name[language]} ({d.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="courtOfPractice" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'பயிற்சி செய்யும் நீதிமன்றம்' : 'Primary Court of Practice'} *
                </label>
                <input
                  id="courtOfPractice"
                  type="text"
                  value={courtOfPractice}
                  onChange={(e) => setCourtOfPractice(e.target.value)}
                  placeholder={language === 'ta' ? 'எ.கா. சென்னை உயர்நீதிமன்றம்' : 'e.g. Madras High Court'}
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111]"
                />
              </div>
            </div>

            {/* Grid 3: Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mobileNumber" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'அலைபேசி எண் (வாட்ஸ்அப்)' : 'Mobile Phone (WhatsApp)'} *
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="9876543210"
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111] font-mono"
                />
              </div>

              <div>
                <label htmlFor="emailAddress" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'} *
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="advocate@example.com"
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111]"
                />
              </div>
            </div>

            {/* Specialization Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="font-semibold text-[15px] text-[#111111] block">
                {language === 'ta' ? 'சட்டப் பயிற்சிப் பிரிவுகள் (தேர்ந்தெடுக்கவும்)' : 'Practice Specialisations (Select all that apply)'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALIZATIONS.map((spec) => {
                  const isChecked = areasOfSpecialization.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={`p-3 text-left border-2 flex items-center justify-between transition-colors cursor-pointer ${
                        isChecked 
                          ? 'border-[#E31E24] bg-[#f1ece2] text-[#111111] font-bold' 
                          : 'border-[#111111] bg-white text-[#5B5348]'
                      }`}
                    >
                      <span className="text-[14px]">{spec}</span>
                      {isChecked && <IconCheck className="w-4 h-4 text-[#C41A1F]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                {language === 'ta' ? 'வழக்கறிஞர் அலுவலக முகவரி' : 'Chambers / Office Address'}
              </label>
              <textarea
                id="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'ta' ? 'அலுவலக முகவரி...' : 'Enter chambers address...'}
                className="w-full bg-[#FAF8F5] border-2 border-[#111111] p-3 text-[15px] text-[#111111]"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[13px] text-[#5B5348]">
                {language === 'ta'
                  ? 'மனுவை சமர்ப்பித்தவுடன் உங்கள் மாவட்ட அமைப்பாளருக்கு தகவல் அனுப்பப்படும்.'
                  : 'Upon submission, your application will be routed to your district organiser.'}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center gap-2 cursor-pointer btn-lift disabled:opacity-50 shrink-0"
              >
                <span>{isSubmitting ? (language === 'ta' ? 'சமர்ப்பிக்கப்படுகிறது...' : 'Submitting...') : (language === 'ta' ? 'மனுவை சமர்ப்பிக்க' : 'Submit Enrolment')}</span>
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </section>

      </div>
    </div>
  );
}
