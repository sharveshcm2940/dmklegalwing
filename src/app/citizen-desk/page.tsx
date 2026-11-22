'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { PageTitleBand } from '@/components/PageTitleBand';
import { useReveal } from '@/hooks/useReveal';
import { IconChevronRight } from '@/components/Icons';

const STORAGE_KEY = 'dmk_draft_citizen_desk';

export default function CitizenDeskPage() {
  const { language } = useLanguage();
  const { districts } = useData();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState<'Legal Aid' | 'General Query' | 'High Court Wing' | 'Press / Media'>('Legal Aid');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  const mainSection = useReveal();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.name) setName(data.name);
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
        if (data.district) setDistrict(data.district);
        if (data.category) setCategory(data.category);
        if (data.subject) setSubject(data.subject);
        if (data.message) setMessage(data.message);
        setIsDraftRestored(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (!district && districts.length > 0) {
      setDistrict(districts[0].name.en);
    }
  }, [districts, district]);

  useEffect(() => {
    const draft = { name, phone, email, district, category, subject, message };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore
    }
  }, [name, phone, email, district, category, subject, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError(language === 'ta' ? 'பெயரை உள்ளிடவும்.' : 'Name is required.');
      return;
    }
    if (!phone.trim()) {
      setFormError(language === 'ta' ? 'தொடர்பு தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Phone number is required.');
      return;
    }
    if (!message.trim()) {
      setFormError(language === 'ta' ? 'உங்கள் கோரிக்கை அல்லது புகாரை விரிவாக உள்ளிடவும்.' : 'Grievance description / message is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        district: district || (districts[0]?.name.en ?? 'Chennai'),
        category,
        subject: subject.trim() || 'General Public Legal Aid Request',
        message: message.trim(),
      };

      const res = await fetch('/api/citizen-desk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        router.push(`/confirmation?id=${encodeURIComponent(data.trackingId)}&type=citizen`);
      } else {
        setFormError(data.error || (language === 'ta' ? 'மனுவை சமர்ப்பிப்பதில் பிழை ஏற்பட்டது.' : 'Failed to submit grievance.'));
      }
    } catch {
      setFormError(language === 'ta' ? 'சர்வர் இணைப்பு தோல்வியடைந்தது.' : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-catamaran text-[17px] leading-[1.65] pb-24">
      
      {/* Universal Page Title Band */}
      <PageTitleBand
        title={language === 'ta' ? 'மக்கள் சட்ட உதவி மையம்' : 'Citizen Legal Grievance Portal'}
        description={
          language === 'ta'
            ? 'அடிப்படை மனித உரிமைகள் பாதுகாப்பு, காவல் தடுப்புக் காவல் உதவி மற்றும் மாவட்ட இலவச சட்ட உதவி.'
            : 'Official portal for citizen constitutional grievances, police custody defense, and pro-bono representation.'
        }
      />

      <div className="max-w-[960px] mx-auto px-[clamp(20px,4vw,56px)] pt-12 space-y-8">
        
        {/* MANDATORY BOXED NOTICE AT THE TOP */}
        <div className="border-4 border-[#E31E24] bg-[#111111] text-white p-5 sm:p-6 text-center font-bold text-[16px] sm:text-[18px]">
          If you or someone you know is in police custody, call [HELPLINE NUMBER] now.
        </div>

        <section 
          ref={mainSection.ref}
          className={`fade-rise ${mainSection.revealed ? 'revealed' : ''}`}
        >
          {isDraftRestored && (
            <div className="p-4 bg-[#f1ece2] border-2 border-[#111111] mb-8 flex items-center justify-between text-[14px]">
              <span>
                {language === 'ta'
                  ? 'நீங்கள் முன்பு சேமித்த வரைவு விவரங்கள் மீட்டமைக்கப்பட்டுள்ளன.'
                  : 'Your previously saved grievance draft has been restored.'}
              </span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setIsDraftRestored(false);
                  setName('');
                  setPhone('');
                  setEmail('');
                  setMessage('');
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
            
            <div className="border-b-2 border-[#111111] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block mb-1">
                  {language === 'ta' ? 'மனுப் படிவம்' : 'LEGAL AID PETITION'}
                </span>
                <h2 className="font-kavivanar font-normal text-[28px] text-[#111111]">
                  {language === 'ta' ? 'மக்கள் சட்ட உதவி விண்ணப்பம்' : 'Submit Legal Grievance Request'}
                </h2>
              </div>
              <Link 
                href="/track"
                className="text-[14px] font-extrabold text-[#C41A1F] hover:underline"
              >
                {language === 'ta' ? 'ஏற்கனவே உள்ள மனுவைக் கண்காணிக்க →' : 'Track Existing Grievance →'}
              </Link>
            </div>

            {/* Grid 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'உங்கள் பெயர்' : 'Petitioner Name'} *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'ta' ? 'எ.கா. க. பாண்டியன்' : 'e.g. K. Pandian'}
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111]"
                />
              </div>

              <div>
                <label htmlFor="phone" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'அலைபேசி எண் (தொடர்புக்கு)' : 'Mobile Phone Number'} *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111] font-mono"
                />
              </div>
            </div>

            {/* Grid 2: District & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="district" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'மாவட்டம்' : 'District'} *
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
                <label htmlFor="category" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                  {language === 'ta' ? 'கோரிக்கைப் பிரிவு' : 'Grievance Nature'} *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111] cursor-pointer"
                >
                  <option value="Legal Aid">{language === 'ta' ? 'இலவச சட்ட உதவி / காவல்துறை புகார்' : 'Legal Aid / Police Action'}</option>
                  <option value="General Query">{language === 'ta' ? 'பொது அரசமைப்பு வழிகாட்டல்' : 'Constitutional Guidance'}</option>
                  <option value="High Court Wing">{language === 'ta' ? 'உயர்நீதிமன்ற வழக்கு ஆதரவு' : 'High Court Legal Support'}</option>
                  <option value="Press / Media">{language === 'ta' ? 'பத்திரிகை & ஊடக வினவல்' : 'Press & Media Inquiry'}</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                {language === 'ta' ? 'கோரிக்கையின் தலைப்பு' : 'Subject of Petition'}
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={language === 'ta' ? 'சுருக்கமான தலைப்பு...' : 'Brief summary of the issue...'}
                className="w-full min-h-[44px] bg-[#FAF8F5] border-2 border-[#111111] px-4 text-[15px] text-[#111111]"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="font-semibold text-[15px] text-[#111111] mb-2 block">
                {language === 'ta' ? 'முழு விவரம் அல்லது புகார்' : 'Detailed Narrative & Grievance'} *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'ta' ? 'உங்கள் சட்டச் சிக்கல் மற்றும் தேவையான உதவி குறித்து விரிவாக எழுதவும்...' : 'Explain your legal predicament and the assistance required...'}
                className="w-full bg-[#FAF8F5] border-2 border-[#111111] p-3 text-[15px] text-[#111111]"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[13px] text-[#5B5348]">
                {language === 'ta'
                  ? 'மனுவை சமர்ப்பித்ததும் உங்கள் அலைபேசிக்கு கண்காணிப்பு எண் (Tracking ID) வழங்கப்படும்.'
                  : 'You will receive a unique tracking ID to monitor grievance assignment.'}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[48px] px-8 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[15px] inline-flex items-center justify-center gap-2 cursor-pointer btn-lift disabled:opacity-50 shrink-0"
              >
                <span>{isSubmitting ? (language === 'ta' ? 'சமர்ப்பிக்கப்படுகிறது...' : 'Submitting...') : (language === 'ta' ? 'மனுவை சமர்ப்பிக்க' : 'Submit Request')}</span>
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </section>

      </div>
    </div>
  );
}
