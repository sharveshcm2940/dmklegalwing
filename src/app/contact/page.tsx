'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { DMK_ORGANISATION_INFO } from '@/data/content';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  UserPlus, 
  CheckCircle2, 
  Scale, 
  AlertCircle,
  FileCheck2,
  Send
} from 'lucide-react';

export default function ContactPage() {
  const { language, t } = useLanguage();
  const { registerAdvocate, submitEnquiry, districts } = useData();

  // Active form tab
  const [activeFormTab, setActiveFormTab] = useState<'register' | 'inquiry'>('register');

  // Advocate Registration Form State
  const [advFullName, setAdvFullName] = useState('');
  const [advBarNo, setAdvBarNo] = useState('');
  const [advEnrollYear, setAdvEnrollYear] = useState('');
  const [advDistrict, setAdvDistrict] = useState('Ariyalur');
  const [advCourt, setAdvCourt] = useState('');
  const [advMobile, setAdvMobile] = useState('');
  const [advEmail, setAdvEmail] = useState('');
  const [advAddress, setAdvAddress] = useState('');
  const [advSpecializations, setAdvSpecializations] = useState<string[]>(['Constitutional Law']);
  const [advFormSuccess, setAdvFormSuccess] = useState(false);
  const [advFormError, setAdvFormError] = useState('');
  const [advIsSubmitting, setAdvIsSubmitting] = useState(false);

  // Public Legal Aid Inquiry Form State
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqDistrict, setInqDistrict] = useState('Ariyalur');
  const [inqCategory, setInqCategory] = useState<'Legal Aid' | 'General Query' | 'High Court Wing' | 'Press / Media'>('Legal Aid');
  const [inqSubject, setInqSubject] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqFormSuccess, setInqFormSuccess] = useState(false);
  const [inqFormError, setInqFormError] = useState('');
  const [inqIsSubmitting, setInqIsSubmitting] = useState(false);

  const specializationOptions = [
    'Constitutional Law',
    'Criminal Jurisprudence',
    'Civil & Property Law',
    'Labour & Industrial Law',
    'Service & Employment Law',
    'Human Rights & PIL',
    'Women & Family Welfare'
  ];

  const toggleSpecialization = (spec: string) => {
    if (advSpecializations.includes(spec)) {
      setAdvSpecializations(advSpecializations.filter((s) => s !== spec));
    } else {
      setAdvSpecializations([...advSpecializations, spec]);
    }
  };

  const handleAdvocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdvFormError('');

    if (!advFullName.trim() || !advBarNo.trim() || !advMobile.trim() || !advEmail.trim()) {
      setAdvFormError(language === 'ta' ? 'அனைத்து முதன்மை விவரங்களையும் நிரப்பவும்' : 'Please fill all mandatory fields (Name, Bar No, Phone, Email)');
      return;
    }

    setAdvIsSubmitting(true);
    try {
      const ok = await registerAdvocate({
        fullName: advFullName,
        barCouncilNumber: advBarNo,
        yearOfEnrollment: advEnrollYear || '2024',
        district: advDistrict,
        courtOfPractice: advCourt || 'District & Sessions Court',
        mobileNumber: advMobile,
        emailAddress: advEmail,
        address: advAddress,
        areasOfSpecialization: advSpecializations
      });

      if (ok) {
        setAdvFormSuccess(true);
      } else {
        setAdvFormError(language === 'ta' ? 'விண்ணப்பத்தைப் பதிவு செய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Failed to submit registration. Please try again.');
      }
    } finally {
      setAdvIsSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInqFormError('');

    if (!inqName.trim() || !inqPhone.trim() || !inqMessage.trim()) {
      setInqFormError(language === 'ta' ? 'பெயர், தொலைபேசி மற்றும் கோரிக்கையை நிரப்பவும்' : 'Please fill name, contact phone and inquiry message');
      return;
    }

    setInqIsSubmitting(true);
    try {
      const ok = await submitEnquiry({
        name: inqName,
        phone: inqPhone,
        email: inqEmail || 'citizen@portal.dmk',
        district: inqDistrict,
        category: inqCategory,
        subject: inqSubject || 'Citizen Legal Assistance',
        message: inqMessage
      });

      if (ok) {
        setInqFormSuccess(true);
      } else {
        setInqFormError(language === 'ta' ? 'கோரிக்கையை அனுப்புவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Failed to send inquiry. Please try again.');
      }
    } finally {
      setInqIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-10 py-8 bg-[#FAF7F2] text-[#111111] font-dmk-body">
      
      {/* Broadsheet Masthead Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-y-2 border-neutral-900 p-6 sm:p-10 relative overflow-hidden">
          {/* Dual Party Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="w-1/2 bg-black" />
            <div className="w-1/2 bg-[#E31E24]" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-300 pb-5 mb-6 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#111111] text-white text-[11px] font-english uppercase px-3 py-1 tracking-widest font-bold">
                  {language === 'ta' ? 'தலைமைச் செயலகம்' : 'STATE SECRETARIAT'}
                </span>
                <span className="text-xs font-english text-[#C41A1F] font-bold">
                  ANNA ARIVALAYAM, CHENNAI
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#111111] font-dmk-headline tracking-tight uppercase leading-none">
                {language === 'ta'
                  ? 'தலைமைச் செயலகத் தொடர்பு & வழக்கறிஞர் சேர்க்கை'
                  : 'Secretariat Dispatch & Advocate Enrollment Desk'}
              </h1>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right font-english text-[11px] text-neutral-600">
              <p className="font-bold text-[#111111]">HEADQUARTERS REGISTRATION</p>
              <p>Anna Arivalayam, Chennai — 600 018</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-dmk-body">
                {language === 'ta'
                  ? 'வழக்கறிஞர்கள் திமுக வழக்கறிஞர் அணியில் தங்களை இணைத்துக்கொள்ளவும், எளிய பொதுமக்கள் மற்றும் போராளிகள் மாவட்ட ரீதியாக இலவச சட்ட உதவி பெறவும் இயங்கும் அதிகாரப்பூர்வ சட்டப் பதிவேடு.'
                  : 'Enroll as an official advocate member, establish liaison with district coordinators, or seek guidance from our pro-bono citizen legal assistance desks across all 38 districts.'}
              </p>
            </div>
            <div className="lg:col-span-4 bg-[#FAF7F2] border border-neutral-300 p-4">
              <div className="flex items-center justify-between font-english text-xs text-neutral-700 pb-2 border-b border-neutral-300">
                <span>COMMUNICATIONS DESK</span>
                <span className="font-bold text-[#C41A1F]">SECRETARIAT LIVE</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2 font-english">
                Operating under the Advocates Act 1961 and Bar Council protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Physical Offices Info, Right Interactive Forms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Addresses & Verified Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-neutral-300 pb-3">
              <span className="text-xs font-english font-bold text-[#C41A1F] uppercase tracking-wider block mb-1">
                {language === 'ta' ? 'அலுவலக முகவரிகள்' : 'OFFICIAL PREMISES REGISTER'}
              </span>
              <h2 className="text-2xl font-black text-[#111111] font-dmk-headline uppercase">
                {language === 'ta' ? 'தலைமைச் செயலகம் & அலுவலகங்கள்' : 'State Legal Headquarters'}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Anna Arivalayam Office */}
              <div className="p-5 bg-white border border-neutral-300 space-y-2">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#C41A1F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider font-dmk-headline">
                      {language === 'ta' ? 'தலைமைச் செயலகம் (அண்ணா அறிவாலயம்)' : 'Apex Secretariat (Anna Arivalayam)'}
                    </h4>
                    <p className="text-xs text-neutral-700 leading-relaxed mt-1 font-dmk-body">
                      {DMK_ORGANISATION_INFO.headquarters[language]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Madras High Court Chambers */}
              <div className="p-5 bg-white border border-neutral-300 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C41A1F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider font-dmk-headline">
                      {language === 'ta' ? 'சென்னை உயர் நீதிமன்ற வளாக அலுவலகம்' : 'Madras High Court Chambers'}
                    </h4>
                    <p className="text-xs text-neutral-700 leading-relaxed mt-1 font-dmk-body">
                      {DMK_ORGANISATION_INFO.highCourtOffice[language]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Numbers */}
            <div className="p-5 bg-white border border-neutral-300 space-y-3 text-xs">
              <h4 className="font-bold text-[#111111] uppercase tracking-wider text-xs border-b border-neutral-300 pb-2 font-english">
                {language === 'ta' ? 'அதிகாரப்பூர்வ தொலைபேசி & மின்னஞ்சல்' : 'VERIFIED DIRECT CONTACTS'}
              </h4>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C41A1F]" />
                <div>
                  <span className="text-[10px] text-neutral-600 block font-english">
                    {language === 'ta' ? 'தொலைபேசி' : 'PHONE DESPATCH'}
                  </span>
                  <span className="text-[#111111] font-english font-bold text-xs">{DMK_ORGANISATION_INFO.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C41A1F]" />
                <div>
                  <span className="text-[10px] text-neutral-600 block font-english">
                    {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'OFFICIAL SECRETARIAT EMAIL'}
                  </span>
                  <span className="text-[#111111] font-english font-bold text-xs">{DMK_ORGANISATION_INFO.email}</span>
                </div>
              </div>
            </div>

            {/* Regulatory Notice */}
            <div className="p-4 bg-[#FAF7F2] border border-neutral-300 text-xs text-neutral-800 space-y-1">
              <span className="font-english font-bold text-[#C41A1F] uppercase tracking-wider block text-[11px]">
                {language === 'ta' ? 'வழக்கறிஞர்கள் நெறிமுறை அறிவிப்பு' : 'BAR COUNCIL REGULATORY NOTICE'}
              </span>
              <p className="leading-relaxed font-dmk-body text-xs">
                {language === 'ta'
                  ? 'இந்த தளம் இந்திய பார் கவுன்சில் விதிகள் மற்றும் நெறிமுறைகளுக்கு உட்பட்டு சட்ட விழிப்புணர்வு, ஆலோசனை மற்றும் ஜனநாயக நோக்கங்களுக்காக மட்டுமே செயல்படுகிறது.'
                  : 'This platform functions in strict compliance with the Advocates Act 1961 and Bar Council of India guidelines for educational, organizational, and legal aid services.'}
              </p>
            </div>
          </div>

          {/* Right Column: Tabbed Dual Broadsheet Forms */}
          <div className="lg:col-span-7">
            <div id="register" className="bg-white border border-neutral-300 p-6 sm:p-8">
              
              {/* Form Tab Toggles */}
              <div className="flex border border-neutral-300 mb-6 bg-[#FAF7F2] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveFormTab('register');
                    setAdvFormSuccess(false);
                  }}
                  className={`flex-1 py-2 text-xs font-english font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    activeFormTab === 'register'
                      ? 'bg-[#E31E24] text-white'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'ta' ? 'வழக்கறிஞர் உறுப்பினர் பதிவு' : 'Advocate Enrollment'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFormTab('inquiry');
                    setInqFormSuccess(false);
                  }}
                  className={`flex-1 py-2 text-xs font-english font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    activeFormTab === 'inquiry'
                      ? 'bg-[#E31E24] text-white'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{language === 'ta' ? 'சட்ட உதவி கோரிக்கை' : 'Citizen Legal Aid'}</span>
                </button>
              </div>

              {/* TAB 1: ADVOCATE REGISTRATION FORM */}
              {activeFormTab === 'register' && (
                <div>
                  {advFormSuccess ? (
                    <div className="p-8 text-center space-y-3 bg-[#FAF7F2] border border-neutral-300">
                      <div className="w-12 h-12 bg-white border border-[#E31E24] text-[#C41A1F] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-[#111111] font-dmk-headline">
                        {t.forms.successTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-700 max-w-md mx-auto leading-relaxed font-dmk-body">
                        {t.forms.successDesc}
                      </p>
                      <button
                        onClick={() => {
                          setAdvFormSuccess(false);
                          setAdvFullName('');
                          setAdvBarNo('');
                          setAdvMobile('');
                          setAdvEmail('');
                        }}
                        className="px-5 py-2 bg-[#111111] hover:bg-[#E31E24] text-white text-xs font-english font-bold uppercase tracking-wider border border-neutral-900"
                      >
                        {language === 'ta' ? 'மற்றொரு பதிவு செய்ய' : 'Register Another Advocate'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAdvocateSubmit} className="space-y-4">
                      {advFormError && (
                        <div className="p-3 bg-red-50 border border-red-400 text-xs text-[#C41A1F] flex items-center gap-2 font-english font-bold">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{advFormError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.name} *
                          </label>
                          <input
                            type="text"
                            required
                            value={advFullName}
                            onChange={(e) => setAdvFullName(e.target.value)}
                            placeholder="Adv. K. Anbazhagan"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.barCouncilNo} *
                          </label>
                          <input
                            type="text"
                            required
                            value={advBarNo}
                            onChange={(e) => setAdvBarNo(e.target.value)}
                            placeholder="MS / 1234 / 2018"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.yearOfEnrollment}
                          </label>
                          <input
                            type="number"
                            min="1960"
                            max="2026"
                            value={advEnrollYear}
                            onChange={(e) => setAdvEnrollYear(e.target.value)}
                            placeholder="2018"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.district} *
                          </label>
                          <select
                            value={advDistrict}
                            onChange={(e) => setAdvDistrict(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          >
                            {districts.map((d) => (
                              <option key={d.id} value={d.name.en}>
                                {d.number ? `#${d.number} ` : ''}{d.name[language]} ({d.name.en})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.court}
                          </label>
                          <input
                            type="text"
                            value={advCourt}
                            onChange={(e) => setAdvCourt(e.target.value)}
                            placeholder="Madras High Court"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.phone} *
                          </label>
                          <input
                            type="tel"
                            required
                            value={advMobile}
                            onChange={(e) => setAdvMobile(e.target.value)}
                            placeholder="+91 98400 00000"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.email} *
                          </label>
                          <input
                            type="email"
                            required
                            value={advEmail}
                            onChange={(e) => setAdvEmail(e.target.value)}
                            placeholder="advocate@bar.in"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>
                      </div>

                      {/* Practice Specializations */}
                      <div>
                        <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1.5">
                          {t.forms.specialization}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {specializationOptions.map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => toggleSpecialization(opt)}
                              className={`text-[11px] font-english font-semibold px-2.5 py-1 border transition-all ${
                                advSpecializations.includes(opt)
                                  ? 'bg-[#E31E24] text-white border-neutral-900 font-bold'
                                  : 'bg-[#FAF7F2] text-neutral-800 border-neutral-300 hover:border-neutral-900'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                          {t.forms.address}
                        </label>
                        <textarea
                          rows={2}
                          value={advAddress}
                          onChange={(e) => setAdvAddress(e.target.value)}
                          placeholder="Chambers / Office Address"
                          className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={advIsSubmitting}
                          className="w-full py-3 bg-[#E31E24] hover:bg-neutral-900 disabled:bg-neutral-600 text-white border border-neutral-900 text-xs font-english font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>{advIsSubmitting ? (language === 'ta' ? 'பதிவு செய்யப்படுகிறது...' : 'Registering...') : t.forms.submit}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: CITIZEN LEGAL AID INQUIRY FORM */}
              {activeFormTab === 'inquiry' && (
                <div>
                  {inqFormSuccess ? (
                    <div className="p-8 text-center space-y-3 bg-[#FAF7F2] border border-neutral-300">
                      <div className="w-12 h-12 bg-white border border-[#E31E24] text-[#C41A1F] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-[#111111] font-dmk-headline">
                        {language === 'ta' ? 'கோரிக்கை பதிவு செய்யப்பட்டது' : 'Legal Inquiry Submitted'}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-700 max-w-md mx-auto leading-relaxed font-dmk-body">
                        {language === 'ta'
                          ? 'உங்கள் கோரிக்கை மாவட்ட வழக்கறிஞர் அணி அமைப்பாளருக்கு அனுப்பப்பட்டுள்ளது. விரைவில் ஆலோசனைகள் வழங்கப்படும்.'
                          : 'Your request has been routed to the respective District Legal Wing Coordinator. You will be contacted shortly.'}
                      </p>
                      <button
                        onClick={() => {
                          setInqFormSuccess(false);
                          setInqName('');
                          setInqPhone('');
                          setInqMessage('');
                        }}
                        className="px-5 py-2 bg-[#111111] hover:bg-[#E31E24] text-white text-xs font-english font-bold uppercase tracking-wider border border-neutral-900"
                      >
                        {language === 'ta' ? 'மற்றொரு கோரிக்கை அனுப்ப' : 'Submit Another Inquiry'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      {inqFormError && (
                        <div className="p-3 bg-red-50 border border-red-400 text-xs text-[#C41A1F] flex items-center gap-2 font-english font-bold">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{inqFormError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.name} *
                          </label>
                          <input
                            type="text"
                            required
                            value={inqName}
                            onChange={(e) => setInqName(e.target.value)}
                            placeholder="M. Muthukumar"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.phone} *
                          </label>
                          <input
                            type="tel"
                            required
                            value={inqPhone}
                            onChange={(e) => setInqPhone(e.target.value)}
                            placeholder="+91 94440 00000"
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.district} *
                          </label>
                          <select
                            value={inqDistrict}
                            onChange={(e) => setInqDistrict(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          >
                            {districts.map((d) => (
                              <option key={d.id} value={d.name.en}>
                                {d.number ? `#${d.number} ` : ''}{d.name[language]} ({d.name.en})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                            {t.forms.category}
                          </label>
                          <select
                            value={inqCategory}
                            onChange={(e) => setInqCategory(e.target.value as any)}
                            className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english focus:outline-none focus:bg-white focus:border-[#E31E24]"
                          >
                            <option value="Legal Aid">Free Legal Aid (இலவச சட்ட உதவி)</option>
                            <option value="General Query">General Inquiry (பொது வினவல்)</option>
                            <option value="High Court Wing">High Court Matter (உயர் நீதிமன்ற வழக்கு)</option>
                            <option value="Press / Media">Press / Media Inquiries (பத்திரிகை)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                          {t.forms.subject}
                        </label>
                        <input
                          type="text"
                          value={inqSubject}
                          onChange={(e) => setInqSubject(e.target.value)}
                          placeholder="Subject of inquiry"
                          className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-english font-bold text-neutral-800 uppercase block mb-1">
                          {t.forms.message} *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={inqMessage}
                          onChange={(e) => setInqMessage(e.target.value)}
                          placeholder="Please explain your legal grievance or inquiry..."
                          className="w-full bg-[#FAF7F2] border border-neutral-300 p-2 text-xs text-[#111111] font-english placeholder-neutral-500 focus:outline-none focus:bg-white focus:border-[#E31E24]"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={inqIsSubmitting}
                          className="w-full py-3 bg-[#E31E24] hover:bg-neutral-900 disabled:bg-neutral-600 text-white border border-neutral-900 text-xs font-english font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          <span>{inqIsSubmitting ? (language === 'ta' ? 'அனுப்பப்படுகிறது...' : 'Sending...') : t.forms.submitInquiry}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
