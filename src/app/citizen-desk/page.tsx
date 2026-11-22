'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { PhoneCall, ShieldAlert, ArrowRight, AlertCircle, Lock } from 'lucide-react';

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

  // Restore draft on mount
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
      // Local storage unreadable
    }
  }, []);

  // Set default district
  useEffect(() => {
    if (!district && districts.length > 0) {
      setDistrict(districts[0].name.en);
    }
  }, [districts, district]);

  // Save draft on edit
  useEffect(() => {
    const draft = { name, phone, email, district, category, subject, message };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Local storage unavailable
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
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          district: district.trim() || 'Chennai',
          category,
          subject: subject.trim() || (language === 'ta' ? 'பொதுமக்கள் சட்ட உதவி' : 'Legal Grievance Request'),
          message: message.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.enquiry?.id) {
        // Clear draft from localStorage
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}

        router.push(`/confirmation?type=citizen-desk&id=${encodeURIComponent(data.enquiry.id)}`);
      } else {
        setFormError(
          data.error ||
            (language === 'ta'
              ? 'கோரிக்கையைப் பதிவு செய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
              : 'Failed to submit grievance. Please verify details and try again.')
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
            {language === 'ta' ? 'பொதுமக்கள் சட்ட உதவி மையம்' : 'Citizen Legal Desk'}
          </span>
        </div>

        {/* Emergency Custody Notice Banner */}
        <div className="mb-8 p-5 bg-[#FCE8E8] border-2 border-[#C41A1F] rounded-[2px] shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-[#C41A1F] text-white rounded-[2px] shrink-0 mt-0.5">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#C41A1F] uppercase tracking-wider block">
                {language === 'ta' ? 'அவசர சட்டப் பாதுகாப்பு அறிவிப்பு' : 'URGENT LEGAL AID NOTICE'}
              </span>
              <p className="text-sm sm:text-base font-black text-[#111111] leading-snug">
                {language === 'ta' ? (
                  <>
                    நீங்களோ அல்லது உங்களுக்குத் தெரிந்தவரோ காவல் துறையின் பிடியில் இருந்தால், உடனடியாக{' '}
                    <span className="bg-white px-2 py-0.5 border border-[#C41A1F] text-[#C41A1F] font-mono font-black rounded-[2px]">
                      [HELPLINE NUMBER]
                    </span>{' '}
                    என்ற எண்ணை அழைக்கவும்.
                  </>
                ) : (
                  <>
                    If you or someone you know is in police custody, call{' '}
                    <span className="bg-white px-2 py-0.5 border border-[#C41A1F] text-[#C41A1F] font-mono font-black rounded-[2px]">
                      [HELPLINE NUMBER]
                    </span>{' '}
                    now.
                  </>
                )}
              </p>
              <p className="text-xs text-[#5B5348] mt-1">
                {language === 'ta'
                  ? 'அரசமைப்பு உறுப்பு 22-ன் கீழ் கைது செய்யப்பட்ட ஒருவருக்கான சட்ட ஆலோசனை பெறும் உரிமை முழுமையாகப் பாதுகாக்கப்படும்.'
                  : 'Article 22 constitutional protections apply immediately upon detention. State Legal Wing advocates will be assigned.'}
              </p>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b-2 border-[#111111] pb-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#E31E24] inline-block" />
            <span className="text-xs font-dmk-body text-[#C41A1F] font-bold uppercase tracking-wider">
              {language === 'ta' ? 'மக்கள் சட்டக் குறைதீர்ப்புப் பிரிவு' : 'Citizen Legal Grievance Cell'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] font-dmk-headline">
            {language === 'ta' ? 'பொதுமக்கள் சட்ட உதவி & புகார் மையம்' : 'Citizen Legal Aid & Grievance Desk'}
          </h1>
          
          {/* Privacy Notice Under Heading */}
          <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#5B5348] font-dmk-body">
            <Lock className="w-4 h-4 text-[#C41A1F] shrink-0" />
            <span className="italic">
              {language === 'ta'
                ? 'அனைத்து விண்ணப்பங்களும் இரகசியமாக வைக்கப்பட்டு, திமுக சட்டத்துறை தலைமைச் செயலகத்தின் வழக்கறிஞர்களால் மட்டுமே பரிசீலிக்கப்படும்.'
                : 'All submissions are confidential and accessible solely to designated advocates of the DMK Legal Wing State Secretariat.'}
            </span>
          </div>
        </div>

        {/* Restored Draft Notice */}
        {isDraftRestored && (
          <div className="mb-6 p-3 bg-white border border-[#D8D3CB] flex items-center justify-between text-xs text-[#5B5348] rounded-[2px]">
            <span>
              {language === 'ta'
                ? 'முன்பு தட்டச்சு செய்த கோரிக்கை விவரங்கள் உங்கள் உலாவியில் இருந்து மீட்கப்பட்டுள்ளன.'
                : 'A saved draft from your previous session has been restored.'}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setName('');
                setPhone('');
                setEmail('');
                setSubject('');
                setMessage('');
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

        {/* Grievance Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-[#111111] p-6 sm:p-10 rounded-[2px] shadow-xs space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Citizen Name */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'உங்கள் பெயர் *' : 'Your Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ta' ? 'பெயர்' : 'Thiru / Tmt. S. Kumar'}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'கைபேசி எண் *' : 'Contact Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94440 54321"
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none font-mono"
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'மின்னஞ்சல் (தேவைப்பட்டால்)' : 'Email Address (Optional)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none"
              />
            </div>

            {/* 74-District Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'மாவட்டம் / பகுதி *' : 'District / Jurisdiction *'}
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

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'விண்ணப்ப வகை *' : 'Grievance Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none cursor-pointer"
              >
                <option value="Legal Aid">{language === 'ta' ? 'சட்ட உதவி (Legal Aid)' : 'Legal Aid'}</option>
                <option value="General Query">{language === 'ta' ? 'பொது வினவல் (General Query)' : 'General Query'}</option>
                <option value="High Court Wing">{language === 'ta' ? 'உயர் நீதிமன்ற வழக்கு (High Court Wing)' : 'High Court Wing'}</option>
                <option value="Press / Media">{language === 'ta' ? 'செய்தியாளர் பிரிவு (Press / Media)' : 'Press / Media'}</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'கோரிக்கையின் சுருக்கம் / பொருள்' : 'Matter Subject'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={language === 'ta' ? 'எ.கா. சொத்து விவகார சட்ட உதவி' : 'e.g. Legal defense assistance request'}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none"
              />
            </div>

            {/* Message Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                {language === 'ta' ? 'விவரமான கோரிக்கை / புகார் *' : 'Detailed Grievance Description *'}
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'உங்கள் வழக்கின் பின்னணி, தொடர்புடைய காவல் நிலையம் அல்லது நீதிமன்றம், மற்றும் தேவைப்படும் சட்ட உதவி குறித்து தெளிவாக எழுதவும்...'
                    : 'Provide comprehensive background, relevant station or court details, and the nature of legal assistance sought...'
                }
                className="w-full p-3.5 border border-[#D8D3CB] focus:border-[#111111] text-xs sm:text-sm bg-[#FAF8F5] rounded-[2px] outline-none leading-relaxed"
              />
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-[#D8D3CB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#5B5348] font-dmk-body">
              {language === 'ta'
                ? 'சமர்ப்பிக்கப்பட்ட மனுக்கள் மாநிலச் செயலக வழக்கறிஞர் குழுவால் நேரடியாகப் பரிசீலிக்கப்படும்.'
                : 'Submissions are reviewed by the State Secretariat Legal Team for assigned counsel routing.'}
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
                  ? 'மனுவைச் சமர்ப்பிக்கவும்'
                  : 'Submit Legal Grievance'}
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </form>

        {/* Status Tracker Callout */}
        <div className="mt-8 p-4 bg-white border border-[#D8D3CB] flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[2px]">
          <div className="text-xs text-[#5B5348]">
            <span className="font-bold text-[#111111] block mb-0.5">
              {language === 'ta' ? 'ஏற்கனவே மனு அளித்துவிட்டீர்களா?' : 'Already submitted a grievance?'}
            </span>
            {language === 'ta'
              ? 'உங்கள் மனுவின் பரிசீலனை நிலையை அறிய கண்காணிப்பு அடையாள எண்ணை உள்ளிடவும்.'
              : 'Check the real-time resolution status of your grievance with your Tracking ID.'}
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
