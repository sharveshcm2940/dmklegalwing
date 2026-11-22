'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';

const STORAGE_KEY = 'dmk_draft_citizen_desk';

const GRIEVANCE_CATEGORIES = [
  { id: 'Land rights', en: 'Land rights', ta: 'நில உரிமைகள்' },
  { id: 'Police excesses', en: 'Police excesses', ta: 'காவல்துறை அத்துமீறல்' },
  { id: 'Civil rights', en: 'Civil rights', ta: 'குடிமை உரிமைகள்' },
  { id: 'Labor', en: 'Labor', ta: 'தொழிலாளர் நலன்' }
];

const URGENCY_LEVELS = [
  { id: 'Normal', en: 'Normal', ta: 'சாதாரண' },
  { id: 'High', en: 'High', ta: 'அவசரம்' },
  { id: 'Critical / Urgent Habeas Corpus', en: 'Critical / Urgent Habeas Corpus', ta: 'மிக அவசரம் / ஆட்கொணர்வு மனு' }
];

export default function CitizenDeskPage() {
  const { language } = useLanguage();
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Land rights');
  const [urgency, setUrgency] = useState('Normal');
  const [message, setMessage] = useState('');

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
        if (data.name) setName(data.name);
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
        if (data.address) setAddress(data.address);
        if (data.category) setCategory(data.category);
        if (data.urgency) setUrgency(data.urgency);
        if (data.message) setMessage(data.message);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save half-finished form in browser storage
  useEffect(() => {
    const draft = { name, phone, email, address, category, urgency, message };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore
    }
  }, [name, phone, email, address, category, urgency, message]);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = language === 'ta' ? 'பெயரை உள்ளிடவும்.' : 'Name is required.';
    }
    if (!phone.trim()) {
      errs.phone = language === 'ta' ? 'தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Phone number is required.';
    } else if (!/^\+?[\d\s-]{7,15}$/.test(phone.trim())) {
      errs.phone = language === 'ta' ? 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter a valid phone number.';
    }
    if (!message.trim()) {
      errs.message = language === 'ta' ? 'உங்கள் கோரிக்கை விவரத்தை உள்ளிடவும்.' : 'Grievance description is required.';
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
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        district: address.trim() || 'Chennai',
        subject: `${category} - ${urgency}`,
        message: `${address ? `Address: ${address.trim()}\n\n` : ''}${message.trim()}`,
        category
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.enquiry?.id) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        router.push(`/citizen-desk/done?id=${encodeURIComponent(data.enquiry.id)}`);
      } else {
        setErrors({
          form: data.error || (language === 'ta' ? 'மனுவை சமர்ப்பிப்பதில் பிழை ஏற்பட்டது.' : 'Failed to submit request.')
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
      {/* Title band: "Citizen legal desk" / "பொது மக்கள் சட்ட உதவி மையம்" */}
      <PageTitleBand
        title={language === 'ta' ? 'பொது மக்கள் சட்ட உதவி மையம்' : 'Citizen legal desk'}
        description={
          language === 'ta'
            ? 'சாமானிய மக்களுக்கான இலவச சட்ட ஆலோசனை, ஆட்கொணர்வு மனுக்கள் மற்றும் குடிமை உரிமைப் பாதுகாப்பு மையம்.'
            : 'Confidential pro-bono legal consultation, civil liberties defense and emergency habeas corpus assistance.'
        }
      />

      {/* The form in one 720 px column */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12 space-y-6">
        
        {/* 1. Boxed custody notice first: 2 px red border */}
        <div className="border-2 border-[#E31E24] bg-white p-5 text-[16px] font-bold text-[#111111] leading-relaxed">
          {language === 'ta'
            ? 'நீங்களோ அல்லது உங்களுக்குத் தெரிந்தவர்களோ காவல்துறை காவலில் வைக்கப்பட்டிருந்தால், உடனடியாக [HELPLINE NUMBER] என்ற எண்ணை அழைக்கவும்.'
            : 'If you or someone you know is in police custody, call [HELPLINE NUMBER] now.'}
        </div>

        {/* 2. One-line privacy notice */}
        <p className="text-[14px] text-[#5B5348] border-b border-[#d7d0c3] pb-4 leading-relaxed">
          {language === 'ta'
            ? 'திமுக வழக்கறிஞர் அணியால் உங்கள் மனுக்கள் மற்றும் விவரங்கள் முழுமையான சட்டப் பாதுகாப்புடன் இரகசியமாக வைக்கப்படும்.'
            : 'All submissions are treated with strict legal confidentiality by DMK Legal Wing advocates.'}
        </p>

        {/* 3. The Form */}
        <section
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''} bg-white border-2 border-[#111111] p-6 sm:p-10`}
        >
          {errors.form && (
            <div className="mb-6 p-4 bg-[#f1ece2] border-l-4 border-[#C41A1F] text-[#C41A1F] font-bold text-[15px]">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            
            {/* Petitioner Details */}
            <div className="space-y-5">
              <h2 className="text-[#111111] border-b-2 border-[#111111] pb-2">
                <span className={language === 'ta' ? 'font-kavivanar font-normal text-[26px] leading-[1.3]' : 'font-helvetica font-extrabold text-[22px]'}>
                  {language === 'ta' ? 'மனுதாரர் விவரங்கள்' : 'Petitioner details'}
                </span>
              </h2>

              {/* Name */}
              <div className="space-y-1">
                <label htmlFor="petitionerName" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'முழுப் பெயர்' : 'Full name'} <span className="text-[#C41A1F] font-bold">*</span>
                </label>
                <input
                  id="petitionerName"
                  type="text"
                  tabIndex={1}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder={language === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
                {errors.name && (
                  <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label htmlFor="petitionerPhone" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'தொலைபேசி எண்' : 'Phone number'} <span className="text-[#C41A1F] font-bold">*</span>
                </label>
                <input
                  id="petitionerPhone"
                  type="tel"
                  tabIndex={2}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="+91 98400 12345"
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
                {errors.phone && (
                  <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="petitionerEmail" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email address'}
                </label>
                <input
                  id="petitionerEmail"
                  type="email"
                  tabIndex={3}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label htmlFor="petitionerAddress" className="block text-[15px] font-bold text-[#111111] leading-normal">
                  {language === 'ta' ? 'முகவரி / மாவட்டம்' : 'Address / District'}
                </label>
                <input
                  id="petitionerAddress"
                  type="text"
                  tabIndex={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === 'ta' ? 'முகவரி, ஊர், மாவட்டம்' : 'Street address, town, district'}
                  className="w-full min-h-[48px] px-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Grievance Category */}
            <div className="space-y-3 pt-4 border-t-2 border-[#111111]">
              <label htmlFor="grievanceCategory" className="block text-[15px] font-bold text-[#111111] leading-normal">
                {language === 'ta' ? 'மனுவின் வகைப்பாடு' : 'Grievance category'}{' '}
                <span className="text-[#C41A1F] font-bold">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-stretch">
                {GRIEVANCE_CATEGORIES.map((cat, idx) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      tabIndex={5 + idx}
                      onClick={() => setCategory(cat.id)}
                      className={`h-full min-h-[52px] p-2.5 text-[14px] font-bold border-2 border-[#111111] cursor-pointer transition-colors flex items-center justify-center text-center leading-snug ${
                        isSelected
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#FAF8F5] hover:bg-[#f1ece2] text-[#111111]'
                      }`}
                    >
                      {language === 'ta' ? cat.ta : cat.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency: as three large square radio buttons */}
            <div className="space-y-3 pt-4 border-t-2 border-[#111111]">
              <span className="block text-[15px] font-bold text-[#111111] leading-normal">
                {language === 'ta' ? 'அவசர நிலை' : 'Urgency'}{' '}
                <span className="text-[#C41A1F] font-bold">*</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
                {URGENCY_LEVELS.map((lvl, idx) => {
                  const isSelected = urgency === lvl.id;
                  const isCritical = lvl.id.includes('Critical');
                  return (
                    <label
                      key={lvl.id}
                      className={`h-full min-h-[64px] p-3.5 border-2 border-[#111111] flex items-start gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? isCritical
                            ? 'bg-[#E31E24] text-white border-[#E31E24]'
                            : 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-[#FAF8F5] hover:bg-[#f1ece2] text-[#111111]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        tabIndex={9 + idx}
                        value={lvl.id}
                        checked={isSelected}
                        onChange={() => setUrgency(lvl.id)}
                        className="w-5 h-5 rounded-none accent-[#111111] cursor-pointer shrink-0 mt-0.5"
                      />
                      <span className="text-[14px] font-bold leading-snug">
                        {language === 'ta' ? lvl.ta : lvl.en}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 pt-4 border-t-2 border-[#111111]">
              <label htmlFor="grievanceMessage" className="block text-[15px] font-bold text-[#111111] leading-normal">
                {language === 'ta' ? 'கோரிக்கையின் முழு விவரம்' : 'Description of legal grievance'}{' '}
                <span className="text-[#C41A1F] font-bold">*</span>
              </label>
              <textarea
                id="grievanceMessage"
                rows={5}
                tabIndex={12}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                placeholder={
                  language === 'ta'
                    ? 'நிகழ்ந்த இடம், தேதி, சம்பந்தப்பட்ட நபர்கள் மற்றும் சட்ட ரீதியான கோரிக்கையை விரிவாக உள்ளிடவும்...'
                    : 'Detail the facts, parties involved, dates, police station / court involved, and relief sought...'
                }
                className="w-full p-4 bg-[#FAF8F5] border-2 border-[#111111] text-[16px] text-[#111111] leading-normal focus:bg-white outline-none font-catamaran"
              />
              {errors.message && (
                <p className="text-[14px] font-bold text-[#C41A1F] pt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit request button */}
            <div className="pt-4 border-t-2 border-[#111111]">
              <button
                type="submit"
                tabIndex={13}
                disabled={isSubmitting}
                className="w-full min-h-[52px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] disabled:opacity-50 text-white font-bold text-[16px] flex items-center justify-center text-center leading-normal cursor-pointer btn-lift transition-colors"
              >
                {isSubmitting
                  ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting request...')
                  : (language === 'ta' ? 'மனுவை சமர்ப்பிக்க' : 'Submit request')}
              </button>
            </div>

          </form>
        </section>
      </div>
    </div>
  );
}
