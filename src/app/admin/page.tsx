'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { AdvocateRegistration, PublicEnquiry, NewsItem, PressGalleryItem, EventItem, LegalResource, DistrictInfo } from '@/types';
import { 
  Shield, 
  Lock, 
  Trash2, 
  Plus, 
  Calendar, 
  BookOpen, 
  LogOut,
  Star,
  Camera,
  ExternalLink,
  Eye,
  CheckCircle,
  MapPin,
  Search,
  Filter,
  Download,
  Building2,
  Phone,
  Mail,
  AlertCircle,
  Scale,
  RefreshCw,
  Clock,
  Database,
  ArrowUpRight,
  X,
  FileText
} from 'lucide-react';

export default function AdminPage() {
  const { language } = useLanguage();
  const { 
    news, 
    addNews, 
    deleteNews, 
    setLeadStory,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    events, 
    addEvent, 
    deleteEvent, 
    resources, 
    addResource, 
    deleteResource, 
    registrations, 
    updateRegistrationStatus, 
    enquiries, 
    updateEnquiryStatus,
    districts,
    updateDistrictPhonePrivacy,
    refreshAllData,
    isLoadingData
  } = useData();

  // District Editor Privacy State
  const [editingDistrict, setEditingDistrict] = useState<DistrictInfo | null>(null);
  const [editPhonePublicly, setEditPhonePublicly] = useState<boolean>(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminRole, setAdminRole] = useState<'super_admin' | 'content_admin' | 'legal_officer'>('super_admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'registrations' | 'enquiries' | 'news' | 'districts' | 'gallery' | 'events' | 'resources'
  >('overview');

  // Filter & Search States
  const [regStatusFilter, setRegStatusFilter] = useState<'all' | 'pending' | 'verified' | 'approved' | 'rejected'>('all');
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [selectedRegDossier, setSelectedRegDossier] = useState<AdvocateRegistration | null>(null);

  const [enqCategoryFilter, setEnqCategoryFilter] = useState<string>('all');
  const [enqStatusFilter, setEnqStatusFilter] = useState<string>('all');
  const [enqSearchQuery, setEnqSearchQuery] = useState('');

  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>('all');

  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [districtZoneFilter, setDistrictZoneFilter] = useState('All');

  // Modals
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsTitleEn, setNewNewsTitleEn] = useState('');
  const [newNewsTitleTa, setNewNewsTitleTa] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'Press Release' | 'Statement' | 'Court Watch' | 'Resolution' | 'Gazette' | 'Media'>('Press Release');
  const [newNewsSummaryEn, setNewNewsSummaryEn] = useState('');
  const [newNewsSummaryTa, setNewNewsSummaryTa] = useState('');
  const [newNewsContentEn, setNewNewsContentEn] = useState('');
  const [newNewsContentTa, setNewNewsContentTa] = useState('');
  const [newNewsCourt, setNewNewsCourt] = useState('');
  const [newNewsCaseNo, setNewNewsCaseNo] = useState('');
  const [newNewsIsLead, setNewNewsIsLead] = useState(false);
  const [newNewsImage, setNewNewsImage] = useState('/images/dmk-slider-official.jpg');

  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalTitleEn, setNewGalTitleEn] = useState('');
  const [newGalTitleTa, setNewGalTitleTa] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<'Press Conferences' | 'Legal Wing Events' | 'Advocates Meetings' | 'Official Programmes' | 'Historical Archive'>('Press Conferences');
  const [newGalLocationEn, setNewGalLocationEn] = useState('');
  const [newGalLocationTa, setNewGalLocationTa] = useState('');
  const [newGalCaptionEn, setNewGalCaptionEn] = useState('');
  const [newGalCaptionTa, setNewGalCaptionTa] = useState('');
  const [newGalImage, setNewGalImage] = useState('/images/dmk-press-meet.jpg');

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitleEn, setNewEventTitleEn] = useState('');
  const [newEventTitleTa, setNewEventTitleTa] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Conference' | 'Legal Awareness' | 'Seminar'>('Conference');
  const [newEventDate, setNewEventDate] = useState('2026-12-20');
  const [newEventVenueEn, setNewEventVenueEn] = useState('');
  const [newEventVenueTa, setNewEventVenueTa] = useState('');
  const [newEventDescEn, setNewEventDescEn] = useState('');
  const [newEventDescTa, setNewEventDescTa] = useState('');

  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResTitleEn, setNewResTitleEn] = useState('');
  const [newResTitleTa, setNewResTitleTa] = useState('');
  const [newResCategory, setNewResCategory] = useState<'Supreme Court' | 'High Court' | 'Constitution' | 'Statute'>('Supreme Court');
  const [newResCitation, setNewResCitation] = useState('');
  const [newResSummaryEn, setNewResSummaryEn] = useState('');
  const [newResSummaryTa, setNewResSummaryTa] = useState('');

  // Authentication Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'dmk1971' || adminPassword === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. (Hint: use "dmk1971" or "admin")');
    }
  };

  // Form Submission Handlers
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitleEn.trim()) return;

    await addNews({
      title: { en: newNewsTitleEn, ta: newNewsTitleTa || newNewsTitleEn },
      category: newNewsCategory,
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM IST',
      readTime: '3 min read',
      author: { en: 'DMK Legal Wing Secretariat', ta: 'திமுக வழக்கறிஞர் அணித் தலைமை' },
      issuingAuthority: { en: 'Apex Constitutional Panel, Anna Arivalayam', ta: 'அரசமைப்புச் சட்டப் பிரிவு, அண்ணா அறிவாலயம்' },
      summary: { en: newNewsSummaryEn, ta: newNewsSummaryTa || newNewsSummaryEn },
      content: { en: newNewsContentEn || newNewsSummaryEn, ta: newNewsContentTa || newNewsSummaryTa || newNewsSummaryEn },
      image: newNewsImage,
      court: newNewsCourt || undefined,
      caseNumber: newNewsCaseNo || undefined,
      featured: newNewsIsLead,
      isLeadStory: newNewsIsLead,
      status: 'published'
    });

    setShowAddNewsModal(false);
    setNewNewsTitleEn('');
    setNewNewsTitleTa('');
    setNewNewsSummaryEn('');
    setNewNewsSummaryTa('');
    setNewNewsContentEn('');
    setNewNewsContentTa('');
    setNewNewsCourt('');
    setNewNewsCaseNo('');
    setNewNewsIsLead(false);
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitleEn.trim()) return;

    await addGalleryItem({
      title: { en: newGalTitleEn, ta: newGalTitleTa || newGalTitleEn },
      category: newGalCategory,
      date: new Date().toISOString().split('T')[0],
      location: { en: newGalLocationEn || 'Chennai, Tamil Nadu', ta: newGalLocationTa || 'சென்னை, தமிழ்நாடு' },
      image: newGalImage,
      caption: { en: newGalCaptionEn || newGalTitleEn, ta: newGalCaptionTa || newGalTitleTa || newGalTitleEn },
      photographer: 'State Press Bureau'
    });

    setShowAddGalleryModal(false);
    setNewGalTitleEn('');
    setNewGalTitleTa('');
    setNewGalLocationEn('');
    setNewGalLocationTa('');
    setNewGalCaptionEn('');
    setNewGalCaptionTa('');
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitleEn.trim()) return;

    await addEvent({
      title: { en: newEventTitleEn, ta: newEventTitleTa || newEventTitleEn },
      category: newEventCategory,
      date: newEventDate,
      time: '10:00 AM - 05:00 PM',
      venue: { en: newEventVenueEn || 'Anna Arivalayam, Chennai', ta: newEventVenueTa || 'அண்ணா அறிவாலயம், சென்னை' },
      status: 'upcoming',
      description: { en: newEventDescEn, ta: newEventDescTa || newEventDescEn },
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200'
    });

    setShowAddEventModal(false);
    setNewEventTitleEn('');
    setNewEventTitleTa('');
    setNewEventVenueEn('');
    setNewEventVenueTa('');
    setNewEventDescEn('');
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitleEn.trim()) return;

    await addResource({
      title: { en: newResTitleEn, ta: newResTitleTa || newResTitleEn },
      category: newResCategory,
      citation: newResCitation,
      summary: { en: newResSummaryEn, ta: newResSummaryTa || newResSummaryEn },
      keyHighlights: {
        en: ['Approved constitutional submission', 'Published by State Legal Secretariat'],
        ta: ['அங்கீகரிக்கப்பட்ட அரசமைப்பு ஆவணம்', 'மாநில சட்டச் செயலக வெளியீடு']
      },
      fileSize: '3.1 MB',
      downloadUrl: '#',
      date: new Date().toISOString().split('T')[0],
      isOfficial: true
    });

    setShowAddResourceModal(false);
    setNewResTitleEn('');
    setNewResTitleTa('');
    setNewResSummaryEn('');
  };

  // Filtered Lists
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesStatus = regStatusFilter === 'all' || reg.status === regStatusFilter;
    const query = regSearchQuery.toLowerCase();
    const matchesQuery = 
      !query ||
      reg.fullName.toLowerCase().includes(query) ||
      reg.barCouncilNumber.toLowerCase().includes(query) ||
      reg.district.toLowerCase().includes(query) ||
      reg.mobileNumber.toLowerCase().includes(query) ||
      reg.emailAddress.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesCategory = enqCategoryFilter === 'all' || enq.category === enqCategoryFilter;
    const matchesStatus = enqStatusFilter === 'all' || enq.status === enqStatusFilter;
    const query = enqSearchQuery.toLowerCase();
    const matchesQuery = 
      !query ||
      enq.name.toLowerCase().includes(query) ||
      enq.district.toLowerCase().includes(query) ||
      enq.subject.toLowerCase().includes(query) ||
      enq.phone.toLowerCase().includes(query);
    return matchesCategory && matchesStatus && matchesQuery;
  });

  const filteredNews = news.filter((item) => {
    const matchesCategory = newsCategoryFilter === 'all' || item.category === newsCategoryFilter;
    const query = newsSearchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      item.title.en.toLowerCase().includes(query) ||
      item.title.ta.toLowerCase().includes(query) ||
      item.summary.en.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const filteredDistricts = districts.filter((d) => {
    const matchesZone = districtZoneFilter === 'All' || d.zone === districtZoneFilter;
    const query = districtSearchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      d.name.en.toLowerCase().includes(query) ||
      d.name.ta.toLowerCase().includes(query) ||
      d.organizer.en.toLowerCase().includes(query) ||
      d.contactPhone.toLowerCase().includes(query);
    return matchesZone && matchesQuery;
  });

  // Export Data Dump
  const handleExportJson = () => {
    const dataDump = {
      exportTimestamp: new Date().toISOString(),
      counts: {
        registrations: registrations.length,
        enquiries: enquiries.length,
        news: news.length,
        events: events.length,
        resources: resources.length,
        districts: districts.length
      },
      registrations,
      enquiries,
      news,
      events,
      resources
    };
    const blob = new Blob([JSON.stringify(dataDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dmk-legal-wing-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // AUTHENTICATION LOGIN LOCK SCREEN (INSTITUTIONAL PARCHMENT)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-[#FAF8F5] flex items-center justify-center p-4 font-dmk-body">
        <div className="bg-white border-2 border-neutral-900 max-w-md w-full p-8 sm:p-10 relative shadow-2xl">
          {/* Dual Party Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/2 bg-black" />
            <div className="w-1/2 bg-[#E31E24]" />
          </div>

          <div className="text-center space-y-3 mb-8 pt-2">
            <div className="w-14 h-14 bg-black text-[#C41A1F] border-2 border-neutral-900 flex items-center justify-center mx-auto">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-english font-bold uppercase tracking-[0.25em] text-[#C41A1F] block">
                STATE LEGAL SECRETARIAT
              </span>
              <h2 className="text-2xl font-black text-neutral-950 font-dmk-headline tracking-tight uppercase mt-1">
                Command Access
              </h2>
            </div>
            <p className="text-xs text-neutral-600 font-dmk-body leading-relaxed">
              Authorized legal wing officers, secretariat controllers & bar registrars only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-[#E31E24] text-[#C41A1F] text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <div>
              <label className="text-[11px] font-english font-bold text-neutral-900 uppercase tracking-wider block mb-1">
                Security Passcode
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter passcode (hint: dmk1971)"
                className="w-full bg-[#FAF8F5] border border-neutral-400 p-2.5 text-xs text-neutral-950 font-english placeholder-neutral-500 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E31E24] hover:bg-black text-white text-xs font-english font-black uppercase tracking-widest transition-colors border border-black shadow-md cursor-pointer"
            >
              Sign In to Command Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-300 text-center text-[10px] text-neutral-500 font-mono">
            HEADQUARTERS: ANNA ARIVALAYAM • CHENNAI 600018
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN INSTITUTIONAL COMMAND CONSOLE
  // -------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-neutral-950 font-dmk-body">
      
      {/* 1. HIGH COMMAND APEX STRIP */}
      <header className="bg-[#111111] text-white border-b-2 border-[#E31E24]">
        {/* Dual Party Stripe */}
        <div className="h-1 flex">
          <div className="w-1/2 bg-black" />
          <div className="w-1/2 bg-[#E31E24]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Identity & Seal */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-neutral-900 border border-neutral-700 text-[#C41A1F] flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-english font-bold uppercase tracking-[0.25em] text-[#C41A1F]">
                  STATE LEGAL SECRETARIAT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase font-bold">
                  {adminRole.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-dmk-headline uppercase tracking-tight text-white leading-tight">
                Control Console & Database Hub
              </h1>
            </div>
          </div>

          {/* Telemetry & Action Strip */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-english">
            
            {/* Live Backend Connection Indicator */}
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-300 rounded-[2px]">
              <span className="w-2 h-2 rounded-[2px] bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono">
                {isLoadingData ? 'SYNCING API...' : 'LIVE BACKEND: CONNECTED'}
              </span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center border border-neutral-700 bg-neutral-900 p-0.5">
              {(['super_admin', 'content_admin', 'legal_officer'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAdminRole(r)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    adminRole === r ? 'bg-[#E31E24] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {r === 'super_admin' ? 'Super Admin' : r === 'content_admin' ? 'Editorial' : 'Legal Desk'}
                </button>
              ))}
            </div>

            {/* Manual Sync */}
            <button
              onClick={() => refreshAllData()}
              title="Refresh all records from backend"
              className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-[#C41A1F]' : ''}`} />
            </button>

            {/* Export JSON Backup */}
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C41A1F]" />
              <span>Export DB</span>
            </button>

            {/* Lock Console */}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E31E24] hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>

          </div>

        </div>
      </header>

      {/* 2. INSTITUTIONAL HORIZONTAL COMMAND TABS */}
      <nav className="bg-white border-b border-neutral-300 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'overview', label: '01. Telemetry & Overview', count: null },
            { id: 'registrations', label: '02. Advocate Cadre Applications', count: registrations.length },
            { id: 'enquiries', label: '03. Citizen Legal Desk', count: enquiries.length },
            { id: 'news', label: '04. Editorial Newsroom', count: news.length },
            { id: 'districts', label: '05. 74 District Cadre Directory', count: 74 },
            { id: 'resources', label: '06. Legal Dossiers & Archive', count: resources.length },
            { id: 'gallery', label: '07. Press Photojournalism', count: gallery.length },
            { id: 'events', label: '08. State Conferences', count: events.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 text-xs font-english font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#E31E24] text-[#C41A1F] bg-[#FAF8F5]'
                  : 'border-transparent text-neutral-600 hover:text-black hover:bg-neutral-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                  activeTab === tab.id
                    ? 'bg-[#E31E24] text-white'
                    : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* 3. MAIN WORKSPACE AREA */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ============================================================== */}
        {/* TAB 1: TELEMETRY & OVERVIEW                                    */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Stat Ledger Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-300 p-5 relative overflow-hidden">
                <span className="w-1.5 h-full bg-[#E31E24] absolute top-0 left-0" />
                <span className="text-[10px] font-english font-bold uppercase text-neutral-500 tracking-wider block">
                  REGISTERED ADVOCATES CADRE
                </span>
                <span className="text-3xl font-black text-neutral-900 font-english block my-1">
                  28,500+
                </span>
                <span className="text-[11px] text-emerald-700 font-bold font-english flex items-center gap-1">
                  <span>●</span> 74 Party Districts Mobilized
                </span>
              </div>

              <div className="bg-white border border-neutral-300 p-5 relative overflow-hidden rounded-[2px]">
                <span className="w-1.5 h-full bg-[#C41A1F] absolute top-0 left-0" />
                <span className="text-[10px] font-english font-bold uppercase text-neutral-500 tracking-wider block">
                  PENDING CADRE VERIFICATIONS
                </span>
                <span className="text-3xl font-black text-[#E31E24] font-english block my-1">
                  {registrations.filter((r) => r.status === 'pending').length}
                </span>
                <span className="text-[11px] text-neutral-600 font-english">
                  Awaiting Bar Council Review
                </span>
              </div>

              <div className="bg-white border border-neutral-300 p-5 relative overflow-hidden">
                <span className="w-1.5 h-full bg-neutral-900 absolute top-0 left-0" />
                <span className="text-[10px] font-english font-bold uppercase text-neutral-500 tracking-wider block">
                  CITIZEN GRIEVANCES INTAKE
                </span>
                <span className="text-3xl font-black text-neutral-900 font-english block my-1">
                  {enquiries.filter((e) => e.status === 'new').length}
                </span>
                <span className="text-[11px] text-neutral-600 font-english">
                  Active Legal Aid Dispatches
                </span>
              </div>

              <div className="bg-white border border-neutral-300 p-5 relative overflow-hidden">
                <span className="w-1.5 h-full bg-[#E31E24] absolute top-0 left-0" />
                <span className="text-[10px] font-english font-bold uppercase text-neutral-500 tracking-wider block">
                  PUBLISHED LEGAL DOSSIERS
                </span>
                <span className="text-3xl font-black text-neutral-900 font-english block my-1">
                  {resources.length}
                </span>
                <span className="text-[11px] text-neutral-600 font-english">
                  Supreme Court & Madras HC Judgments
                </span>
              </div>
            </div>

            {/* Split Screen: Quick Dispatches & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Fast Secretariat Actions */}
              <div className="lg:col-span-4 bg-white border border-neutral-300 p-6 space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#C41A1F] block">
                    FAST ACTIONS
                  </span>
                  <h3 className="text-lg font-black text-neutral-950 font-dmk-headline uppercase">
                    Publish & Dispatch
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => { setShowAddNewsModal(true); }}
                    className="w-full p-3.5 bg-[#FAF8F5] hover:bg-neutral-900 hover:text-white border border-neutral-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-[#C41A1F] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-bold font-english uppercase tracking-wider block">
                        Publish Press Statement
                      </span>
                      <span className="text-[11px] text-neutral-600 group-hover:text-neutral-300 block mt-0.5">
                        Add official press release, resolution, or court update
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowAddResourceModal(true); }}
                    className="w-full p-3.5 bg-[#FAF8F5] hover:bg-neutral-900 hover:text-white border border-neutral-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5 text-[#C41A1F] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-bold font-english uppercase tracking-wider block">
                        Upload Constitutional Judgment
                      </span>
                      <span className="text-[11px] text-neutral-600 group-hover:text-neutral-300 block mt-0.5">
                        Record Supreme Court or Madras High Court filing
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowAddEventModal(true); }}
                    className="w-full p-3.5 bg-[#FAF8F5] hover:bg-neutral-900 hover:text-white border border-neutral-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <Calendar className="w-5 h-5 text-[#C41A1F] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-bold font-english uppercase tracking-wider block">
                        Schedule State Conference
                      </span>
                      <span className="text-[11px] text-neutral-600 group-hover:text-neutral-300 block mt-0.5">
                        Announce advocate legal workshop or seminar
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowAddGalleryModal(true); }}
                    className="w-full p-3.5 bg-[#FAF8F5] hover:bg-neutral-900 hover:text-white border border-neutral-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-[#C41A1F] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-bold font-english uppercase tracking-wider block">
                        Archive Press Photography
                      </span>
                      <span className="text-[11px] text-neutral-600 group-hover:text-neutral-300 block mt-0.5">
                        Upload high-resolution event documentation
                      </span>
                    </div>
                  </button>
                </div>

                <div className="pt-3 border-t border-neutral-200">
                  <Link
                    href="/"
                    target="_blank"
                    className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-english font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span>View Live Public Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C41A1F]" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Database Health & Recent Feed */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Database Telemetry Table */}
                <div className="bg-white border border-neutral-300 p-6">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#C41A1F] block">
                        INFRASTRUCTURE
                      </span>
                      <h3 className="text-base font-black text-neutral-950 font-dmk-headline uppercase">
                        Server File Database Health
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      STORAGE: ATOMIC JSON
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#FAF8F5] border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono block">registrations.json</span>
                      <span className="text-base font-bold text-neutral-900 font-mono">{registrations.length} live records</span>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono block">enquiries.json</span>
                      <span className="text-base font-bold text-neutral-900 font-mono">{enquiries.length} live records</span>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono block">districts.json</span>
                      <span className="text-base font-bold text-[#C41A1F] font-mono">74 party units</span>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono block">news.json</span>
                      <span className="text-base font-bold text-neutral-900 font-mono">{news.length} items</span>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono block">events.json</span>
                      <span className="text-base font-bold text-neutral-900 font-mono">{events.length} events</span>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono block">resources.json</span>
                      <span className="text-base font-bold text-neutral-900 font-mono">{resources.length} filings</span>
                    </div>
                  </div>
                </div>

                {/* Recent Unverified Registrations Alert */}
                <div className="bg-white border border-neutral-300 p-6">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                    <h3 className="text-base font-black text-neutral-950 font-dmk-headline uppercase">
                      Recent Advocate Applications Queue
                    </h3>
                    <button
                      onClick={() => setActiveTab('registrations')}
                      className="text-xs font-english font-bold text-[#C41A1F] hover:underline"
                    >
                      View All ({registrations.length}) &rarr;
                    </button>
                  </div>

                  {registrations.length === 0 ? (
                    <div className="py-8 text-center bg-[#FAF8F5] border border-dashed border-neutral-300">
                      <CheckCircle className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-neutral-700">No pending advocate registrations</p>
                      <p className="text-[11px] text-neutral-500">Live submissions through `/contact#register` appear here instantly.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {registrations.slice(0, 3).map((reg) => (
                        <div
                          key={reg.id}
                          className="p-3 bg-[#FAF8F5] border border-neutral-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-neutral-900 block">{reg.fullName}</span>
                            <span className="text-neutral-500 font-mono text-[11px]">
                              {reg.barCouncilNumber} • {reg.district}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-[2px] ${
                            reg.status === 'approved' ? 'bg-[#111111] text-[#FAF8F5]' : 'bg-[#FAF8F5] text-[#111111] border border-[#5B5348]'
                          }`}>
                            {reg.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ADVOCATE CADRE APPLICATIONS                             */}
        {/* ============================================================== */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            
            {/* Header and Filter Controls */}
            <div className="bg-white border border-neutral-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-widest block">
                  LEGAL CADRE DIRECTORY
                </span>
                <h3 className="text-2xl font-black text-neutral-950 font-dmk-headline uppercase">
                  Advocate Membership Applications ({filteredRegistrations.length})
                </h3>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regSearchQuery}
                    onChange={(e) => setRegSearchQuery(e.target.value)}
                    placeholder="Search name, bar no, district..."
                    className="w-full bg-[#FAF8F5] border border-neutral-300 pl-8 pr-3 py-1.5 text-xs text-neutral-900 font-english placeholder-neutral-500 focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center border border-neutral-300 bg-[#FAF8F5] p-0.5 text-xs font-english">
                  {(['all', 'pending', 'verified', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setRegStatusFilter(st)}
                      className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                        regStatusFilter === st
                          ? 'bg-[#E31E24] text-white'
                          : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Applications Table */}
            {filteredRegistrations.length === 0 ? (
              <div className="p-16 text-center bg-white border border-neutral-300 space-y-2">
                <FileText className="w-10 h-10 text-neutral-400 mx-auto" />
                <h4 className="text-base font-bold text-neutral-900 font-dmk-headline uppercase">
                  No Advocate Applications Found
                </h4>
                <p className="text-xs text-neutral-600 max-w-md mx-auto font-dmk-body">
                  {regSearchQuery || regStatusFilter !== 'all'
                    ? 'No applications match your active search filter. Clear the search or status filter to see all records.'
                    : 'Applications submitted by advocates via the website enrollment form will appear in this verified queue.'}
                </p>
              </div>
            ) : (
              <div className="bg-white border border-neutral-300 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-800 font-dmk-body">
                    <thead className="bg-[#FAF8F5] text-neutral-700 uppercase font-english text-[11px] font-bold border-b border-neutral-300 tracking-wider">
                      <tr>
                        <th className="p-3.5">Ref / Date</th>
                        <th className="p-3.5">Advocate Name</th>
                        <th className="p-3.5">Bar Council Reg.</th>
                        <th className="p-3.5">District / Practice</th>
                        <th className="p-3.5">Contact Despatch</th>
                        <th className="p-3.5">Specializations</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="p-3.5 font-mono text-[11px] text-neutral-600">
                            <span className="block font-bold text-neutral-900">{reg.id.slice(0, 10)}</span>
                            <span>{new Date(reg.submittedAt).toLocaleDateString()}</span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-sm text-neutral-950 font-bold block">{reg.fullName}</strong>
                            <span className="text-[11px] text-neutral-500">Enrolled: {reg.yearOfEnrollment}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono text-xs font-bold text-[#C41A1F] bg-red-50 px-2 py-0.5 border border-red-200">
                              {reg.barCouncilNumber}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <strong className="block text-neutral-900 font-bold">{reg.district}</strong>
                            <span className="text-[11px] text-neutral-600">{reg.courtOfPractice}</span>
                          </td>
                          <td className="p-3.5 font-english">
                            <a href={`tel:${reg.mobileNumber}`} className="text-xs font-bold text-neutral-900 hover:text-[#C41A1F] block">
                              {reg.mobileNumber}
                            </a>
                            <a href={`mailto:${reg.emailAddress}`} className="text-[11px] text-neutral-600 hover:underline block truncate max-w-[160px]">
                              {reg.emailAddress}
                            </a>
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {reg.areasOfSpecialization?.map((spec, i) => (
                                <span key={i} className="text-[10px] bg-neutral-100 text-neutral-800 px-1.5 py-0.2 border border-neutral-300">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-[2px] ${
                              reg.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : reg.status === 'verified'
                                ? 'bg-[#FAF8F5] text-[#111111] border border-[#111111]'
                                : reg.status === 'rejected'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-[#FAF8F5] text-[#5B5348] border border-[#D8D3CB]'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => setSelectedRegDossier(reg)}
                              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded-[2px]"
                            >
                              Inspect
                            </button>
                            {reg.status !== 'approved' && (
                              <button
                                onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded-[2px]"
                              >
                                Approve
                              </button>
                            )}
                            {reg.status === 'pending' && (
                              <button
                                onClick={() => updateRegistrationStatus(reg.id, 'verified')}
                                className="px-2.5 py-1 bg-[#111111] hover:bg-[#E31E24] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded-[2px]"
                              >
                                Verify Bar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Dossier Detail Inspection Modal */}
            {selectedRegDossier && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-white border-2 border-neutral-900 max-w-lg w-full p-6 relative shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
                    <div>
                      <span className="text-[10px] font-english font-bold uppercase text-[#C41A1F] tracking-widest block">
                        ADVOCATE DOSSIER
                      </span>
                      <h4 className="text-xl font-black text-neutral-950 font-dmk-headline">
                        {selectedRegDossier.fullName}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedRegDossier(null)}
                      className="p-1 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF8F5] border border-neutral-200">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-bold">Bar Council No.</span>
                        <strong className="text-sm font-mono text-[#C41A1F]">{selectedRegDossier.barCouncilNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-bold">Enrollment Year</span>
                        <strong className="text-sm font-english">{selectedRegDossier.yearOfEnrollment}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-bold">District</span>
                        <strong className="text-sm">{selectedRegDossier.district}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-bold">Court Complex</span>
                        <strong className="text-sm">{selectedRegDossier.courtOfPractice}</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] border border-neutral-200 space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold">Direct Contact</span>
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span>Phone: {selectedRegDossier.mobileNumber}</span>
                        <span>Email: {selectedRegDossier.emailAddress}</span>
                      </div>
                      {selectedRegDossier.address && (
                        <p className="text-[11px] text-neutral-600 pt-1">
                          Chambers: {selectedRegDossier.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold mb-1">Areas of Practice</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRegDossier.areasOfSpecialization?.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                    <span className="text-xs font-mono">Status: <strong>{selectedRegDossier.status}</strong></span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateRegistrationStatus(selectedRegDossier.id, 'verified');
                          setSelectedRegDossier(null);
                        }}
                        className="px-3 py-1.5 bg-[#111111] hover:bg-[#E31E24] text-white text-xs font-bold uppercase tracking-wider rounded-[2px]"
                      >
                        Verify Bar
                      </button>
                      <button
                        onClick={() => {
                          updateRegistrationStatus(selectedRegDossier.id, 'approved');
                          setSelectedRegDossier(null);
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider"
                      >
                        Approve Cadre
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CITIZEN LEGAL AID INQUIRIES                             */}
        {/* ============================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-neutral-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-widest block">
                  PUBLIC DEFENSE DESK
                </span>
                <h3 className="text-2xl font-black text-neutral-950 font-dmk-headline uppercase">
                  Citizen Legal Grievance Inquiries ({filteredEnquiries.length})
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={enqSearchQuery}
                    onChange={(e) => setEnqSearchQuery(e.target.value)}
                    placeholder="Search citizen, district, subject..."
                    className="w-full bg-[#FAF8F5] border border-neutral-300 pl-8 pr-3 py-1.5 text-xs text-neutral-900 font-english placeholder-neutral-500 focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <select
                  value={enqCategoryFilter}
                  onChange={(e) => setEnqCategoryFilter(e.target.value)}
                  className="bg-[#FAF8F5] border border-neutral-300 px-3 py-1.5 text-xs font-english focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Legal Aid">Free Legal Aid</option>
                  <option value="General Query">General Inquiry</option>
                  <option value="High Court Wing">High Court Wing</option>
                  <option value="Press / Media">Press / Media</option>
                </select>
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="p-16 text-center bg-white border border-neutral-300 space-y-2">
                <Eye className="w-10 h-10 text-neutral-400 mx-auto" />
                <h4 className="text-base font-bold text-neutral-900 font-dmk-headline uppercase">
                  No Citizen Inquiries Recorded
                </h4>
                <p className="text-xs text-neutral-600 max-w-md mx-auto font-dmk-body">
                  Public grievance requests submitted via the `/contact#inquiry` pro-bono assistance desk will arrive here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEnquiries.map((enq) => (
                  <article
                    key={enq.id}
                    className="bg-white border border-neutral-300 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:border-black transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200 mb-2.5">
                        <span className="font-english font-bold uppercase tracking-wider text-[#C41A1F]">
                          {enq.category}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border rounded-[2px] ${
                          enq.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-[#FAF8F5] text-[#5B5348] border-[#D8D3CB]'
                        }`}>
                          {enq.status}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-neutral-950 font-dmk-headline">
                        {enq.subject}
                      </h4>
                      <p className="text-xs text-neutral-700 leading-relaxed font-dmk-body mt-2">
                        {enq.message}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <strong className="block text-neutral-900">{enq.name} ({enq.district})</strong>
                        <a href={`tel:${enq.phone}`} className="font-mono text-neutral-600 hover:text-[#C41A1F] font-bold">
                          {enq.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {enq.status !== 'resolved' && (
                          <button
                            onClick={() => updateEnquiryStatus(enq.id, 'resolved')}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded-[2px]"
                          >
                            Mark Resolved
                          </button>
                        )}
                        {enq.status === 'new' && (
                          <button
                            onClick={() => updateEnquiryStatus(enq.id, 'reviewed')}
                            className="px-3 py-1 bg-[#111111] hover:bg-[#E31E24] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded-[2px]"
                          >
                            Mark Reviewed
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: EDITORIAL NEWSROOM MANAGER                              */}
        {/* ============================================================== */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-neutral-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-widest block">
                  OFFICIAL PRESS BUREAU
                </span>
                <h3 className="text-2xl font-black text-neutral-950 font-dmk-headline uppercase">
                  Editorial Newsroom & Statements ({filteredNews.length})
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowAddNewsModal(true)}
                  className="px-4 py-2 bg-[#E31E24] hover:bg-black text-white text-xs font-english font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Story</span>
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white border border-neutral-300 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-800 font-dmk-body">
                  <thead className="bg-[#FAF8F5] text-neutral-700 uppercase font-english text-[11px] font-bold border-b border-neutral-300 tracking-wider">
                    <tr>
                      <th className="p-3.5">Headline & Summary</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Date Stamp</th>
                      <th className="p-3.5">Lead Story Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredNews.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-3.5 max-w-md">
                          <div className="flex items-center gap-2">
                            {(item.isLeadStory || item.featured) && (
                              <span className="px-2 py-0.2 bg-[#E31E24] text-white text-[9px] font-bold uppercase font-english">
                                LEAD
                              </span>
                            )}
                            <strong className="text-sm text-neutral-950 font-bold block">{item.title[language]}</strong>
                          </div>
                          <p className="text-[11px] text-neutral-600 line-clamp-2 mt-1">{item.summary[language]}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-neutral-600">
                          {item.date}
                        </td>
                        <td className="p-3.5">
                          {item.isLeadStory || item.featured ? (
                            <span className="text-xs font-bold text-[#C41A1F] flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>Active Front-Page Lead</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setLeadStory(item.id)}
                              className="text-[11px] font-english font-bold uppercase tracking-wider text-neutral-600 hover:text-[#C41A1F] hover:underline cursor-pointer"
                            >
                              Set as Front-Page Lead &rarr;
                            </button>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => deleteNews(item.id)}
                            className="p-1.5 text-neutral-500 hover:text-[#C41A1F] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: 74 DISTRICT CADRE DIRECTORY                            */}
        {/* ============================================================== */}
        {activeTab === 'districts' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-neutral-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-widest block">
                  GRASSROOTS UNITS
                </span>
                <h3 className="text-2xl font-black text-neutral-950 font-dmk-headline uppercase">
                  Official 74 District Legal Secretariats
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={districtSearchQuery}
                    onChange={(e) => setDistrictSearchQuery(e.target.value)}
                    placeholder="Search district, organizer, phone..."
                    className="w-full bg-[#FAF8F5] border border-neutral-300 pl-8 pr-3 py-1.5 text-xs text-neutral-900 font-english placeholder-neutral-500 focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="flex items-center border border-neutral-300 bg-[#FAF8F5] p-0.5 text-xs font-english">
                  {['All', 'Chennai', 'North', 'West', 'Central', 'South'].map((z) => (
                    <button
                      key={z}
                      onClick={() => setDistrictZoneFilter(z)}
                      className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                        districtZoneFilter === z ? 'bg-[#E31E24] text-white' : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-300 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-800 font-dmk-body">
                  <thead className="bg-[#FAF8F5] text-neutral-700 uppercase font-english text-[11px] font-bold border-b border-neutral-300 tracking-wider">
                    <tr>
                      <th className="p-3.5">No.</th>
                      <th className="p-3.5">District Unit</th>
                      <th className="p-3.5">Zone</th>
                      <th className="p-3.5">District Organizer</th>
                      <th className="p-3.5">Direct Contact</th>
                      <th className="p-3.5">Phone Privacy</th>
                      <th className="p-3.5">Court Complex</th>
                      <th className="p-3.5 text-right">Cadre Strength</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredDistricts.map((d) => (
                      <tr key={d.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#C41A1F]">
                          #{d.number || '-'}
                        </td>
                        <td className="p-3.5">
                          <strong className="text-sm font-bold text-neutral-950 block">{d.name[language]}</strong>
                          <span className="text-[11px] text-neutral-500">{d.headquarters[language]}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 border border-neutral-200">
                            {d.zone}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <strong className="text-xs font-bold text-neutral-900 block">{d.organizer[language]}</strong>
                          <span className="text-[10px] text-neutral-500">DMK Legal Wing In-Charge</span>
                        </td>
                        <td className="p-3.5 font-english">
                          <a href={`tel:${d.contactPhone}`} className="text-xs font-bold text-neutral-900 hover:text-[#C41A1F] block">
                            {d.contactPhone}
                          </a>
                          <span className="text-[10px] text-neutral-500 block truncate max-w-[150px]">{d.contactEmail}</span>
                        </td>
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => updateDistrictPhonePrivacy(d.id, d.showPhonePublicly === false ? true : false)}
                            className={`min-h-[44px] px-3 py-1.5 text-xs font-bold font-dmk-body rounded-[2px] transition-colors cursor-pointer border ${
                              d.showPhonePublicly !== false
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
                            }`}
                            title="Click to toggle phone privacy"
                          >
                            {d.showPhonePublicly !== false ? 'Public (Visible)' : 'Hidden (Private)'}
                          </button>
                        </td>
                        <td className="p-3.5 text-neutral-700 text-[11px] max-w-xs">
                          {d.courtComplex[language]}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-neutral-900">
                          {d.memberCount}+
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDistrict(d);
                              setEditPhonePublicly(d.showPhonePublicly !== false);
                            }}
                            className="min-h-[44px] px-3 py-1.5 text-xs font-dmk-body font-bold text-[#111111] hover:text-[#C41A1F] underline underline-offset-4 cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DISTRICT PRIVACY & DETAILS EDITOR MODAL */}
            {editingDistrict && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white max-w-lg w-full border-2 border-neutral-900 p-6 sm:p-8 shadow-2xl relative font-dmk-body rounded-[2px] space-y-6">
                  
                  <div className="flex items-start justify-between border-b border-neutral-300 pb-3">
                    <div>
                      <span className="text-[10px] font-english font-bold uppercase text-[#C41A1F] tracking-widest block">
                        DISTRICT CADRE EDITOR
                      </span>
                      <h3 className="text-xl font-black text-neutral-950 font-dmk-headline">
                        {editingDistrict.name.en} ({editingDistrict.name.ta})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingDistrict(null)}
                      className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs font-dmk-body text-neutral-800">
                    <div>
                      <span className="block text-neutral-500 text-[11px] mb-0.5">District Organizer</span>
                      <p className="font-bold text-sm text-neutral-900">
                        {editingDistrict.organizer.en} / {editingDistrict.organizer.ta}
                      </p>
                    </div>

                    <div>
                      <span className="block text-neutral-500 text-[11px] mb-0.5">Contact Phone</span>
                      <p className="font-mono font-bold text-sm text-neutral-900">
                        {editingDistrict.contactPhone}
                      </p>
                    </div>

                    {/* PRIVACY TOGGLE: showPhonePublicly */}
                    <div className="p-4 bg-[#FAF8F5] border border-neutral-300 rounded-[2px] space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editPhonePublicly}
                          onChange={(e) => setEditPhonePublicly(e.target.checked)}
                          className="w-4 h-4 accent-[#E31E24] cursor-pointer"
                        />
                        <span className="font-bold text-sm text-neutral-900">
                          Show Phone Publicly on Website
                        </span>
                      </label>
                      <p className="text-xs text-[#5B5348] pl-7 leading-relaxed">
                        When disabled (unchecked), the phone number is hidden from the public district directory and map, and <strong>&ldquo;Contact through the State Secretariat&rdquo;</strong> is shown instead.
                      </p>
                    </div>

                    <div className="text-[11px] text-neutral-500">
                      Zone: <strong>{editingDistrict.zone}</strong> • Court Complex: {editingDistrict.courtComplex.en}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-300 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingDistrict(null)}
                      className="min-h-[44px] px-4 py-2 text-xs font-bold font-dmk-body text-neutral-700 hover:text-black underline underline-offset-4 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await updateDistrictPhonePrivacy(editingDistrict.id, editPhonePublicly);
                        setEditingDistrict(null);
                      }}
                      className="min-h-[44px] px-6 py-2.5 bg-[#E31E24] hover:bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                    >
                      Save Privacy Setting
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: LEGAL RESOURCES & ARCHIVE                               */}
        {/* ============================================================== */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-300 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-widest block">
                  CONSTITUTIONAL JURISPRUDENCE
                </span>
                <h3 className="text-2xl font-black text-neutral-950 font-dmk-headline uppercase">
                  Published Legal Resources ({resources.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddResourceModal(true)}
                className="px-4 py-2 bg-[#E31E24] hover:bg-black text-white text-xs font-english font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Legal Resource</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div key={res.id} className="bg-white border border-neutral-300 p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-wider block">
                      {res.category} • {res.citation || 'Official Filing'}
                    </span>
                    <h4 className="text-base font-black text-neutral-950 font-dmk-headline mt-1">
                      {res.title[language]}
                    </h4>
                    <p className="text-xs text-neutral-700 mt-2 leading-relaxed font-dmk-body">
                      {res.summary[language]}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-500">{res.date} • {res.fileSize}</span>
                    <button
                      onClick={() => deleteResource(res.id)}
                      className="text-neutral-500 hover:text-[#C41A1F] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: PRESS PHOTOJOURNALISM GALLERY                           */}
        {/* ============================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-300 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-widest block">
                  PRESS ARCHIVE
                </span>
                <h3 className="text-2xl font-black text-neutral-950 font-dmk-headline uppercase">
                  Press Photography Gallery ({gallery.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2 bg-[#E31E24] hover:bg-black text-white text-xs font-english font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photograph</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div key={img.id} className="bg-white border border-neutral-300 overflow-hidden group">
                  <div className="h-48 overflow-hidden bg-neutral-900 relative">
                    <img src={img.image} alt={img.title.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-english uppercase px-2 py-0.5">
                      {img.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-black text-neutral-900 font-dmk-headline">
                      {img.title[language]}
                    </h4>
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {img.caption[language]}
                    </p>
                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-mono text-[10px]">{img.date}</span>
                      <button
                        onClick={() => deleteGalleryItem(img.id)}
                        className="text-neutral-500 hover:text-[#C41A1F] text-[11px] font-bold uppercase cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: EVENTS & CONFERENCES                                    */}
        {/* ============================================================== */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-300 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-english font-bold text-[#C41A1F] uppercase tracking-widest block">
                  ADVOCATE ADVANCEMENT
                </span>
                <h3 className="text-2xl font-black text-neutral-950 font-dmk-headline uppercase">
                  State Conferences & Seminars ({events.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="px-4 py-2 bg-[#E31E24] hover:bg-black text-white text-xs font-english font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Conference</span>
              </button>
            </div>

            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="bg-white border border-neutral-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-english font-bold uppercase text-[#C41A1F] bg-red-50 px-2 py-0.5 border border-red-200">
                        {evt.category}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">{evt.date} • {evt.time}</span>
                    </div>
                    <h4 className="text-base font-black text-neutral-900 font-dmk-headline">
                      {evt.title[language]}
                    </h4>
                    <p className="text-xs text-neutral-600 font-dmk-body">
                      {evt.venue[language]}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-[#C41A1F] border border-neutral-300 text-xs font-bold uppercase cursor-pointer"
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL: PUBLISH EDITORIAL STORY                                 */}
      {/* ============================================================== */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-neutral-900 max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
              <div>
                <span className="text-[10px] font-english font-bold uppercase text-[#C41A1F] tracking-widest block">
                  EDITORIAL DESK
                </span>
                <h4 className="text-xl font-black text-neutral-950 font-dmk-headline uppercase">
                  Publish Press Release / Statement
                </h4>
              </div>
              <button onClick={() => setShowAddNewsModal(false)} className="p-1 hover:bg-neutral-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-4 text-xs font-english">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Headline (English) *</label>
                  <input
                    type="text"
                    required
                    value={newNewsTitleEn}
                    onChange={(e) => setNewNewsTitleEn(e.target.value)}
                    placeholder="Enter prominent headline..."
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Headline (Tamil)</label>
                  <input
                    type="text"
                    value={newNewsTitleTa}
                    onChange={(e) => setNewNewsTitleTa(e.target.value)}
                    placeholder="தமிழில் தலைப்பு..."
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white font-tamil-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Category</label>
                  <select
                    value={newNewsCategory}
                    onChange={(e) => setNewNewsCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                  >
                    <option value="Press Release">Press Release</option>
                    <option value="Statement">Official Statement</option>
                    <option value="Court Watch">Court Watch</option>
                    <option value="Resolution">Resolution</option>
                    <option value="Gazette">Gazette</option>
                    <option value="Media">Media Report</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Court Name (Optional)</label>
                  <input
                    type="text"
                    value={newNewsCourt}
                    onChange={(e) => setNewNewsCourt(e.target.value)}
                    placeholder="e.g. Supreme Court of India"
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Case Number (Optional)</label>
                  <input
                    type="text"
                    value={newNewsCaseNo}
                    onChange={(e) => setNewNewsCaseNo(e.target.value)}
                    placeholder="e.g. WP (C) No. 1245/2026"
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Summary (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={newNewsSummaryEn}
                  onChange={(e) => setNewNewsSummaryEn(e.target.value)}
                  placeholder="Concise editorial summary..."
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Summary (Tamil)</label>
                <textarea
                  rows={2}
                  value={newNewsSummaryTa}
                  onChange={(e) => setNewNewsSummaryTa(e.target.value)}
                  placeholder="தமிழில் சுருக்கம்..."
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white font-tamil-sans"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Full Statement Content (English)</label>
                <textarea
                  rows={4}
                  value={newNewsContentEn}
                  onChange={(e) => setNewNewsContentEn(e.target.value)}
                  placeholder="Complete text of statement / resolution..."
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Image URL / Asset</label>
                <input
                  type="text"
                  value={newNewsImage}
                  onChange={(e) => setNewNewsImage(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200">
                <input
                  type="checkbox"
                  id="leadStoryCheck"
                  checked={newNewsIsLead}
                  onChange={(e) => setNewNewsIsLead(e.target.checked)}
                  className="w-4 h-4 text-[#C41A1F]"
                />
                <label htmlFor="leadStoryCheck" className="text-xs font-bold text-neutral-900 cursor-pointer">
                  Feature this story as the Front-Page Lead Story on the Newsroom
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E31E24] hover:bg-black text-white font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Publish Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: UPLOAD LEGAL RESOURCE                                   */}
      {/* ============================================================== */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-neutral-900 max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
              <h4 className="text-lg font-black text-neutral-950 font-dmk-headline uppercase">
                Upload Constitutional Judgment / Dossier
              </h4>
              <button onClick={() => setShowAddResourceModal(false)} className="p-1 hover:bg-neutral-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3.5 text-xs font-english">
              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Document Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newResTitleEn}
                  onChange={(e) => setNewResTitleEn(e.target.value)}
                  placeholder="e.g. 69% Reservation Ninth Schedule Compendium"
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Forum / Category</label>
                  <select
                    value={newResCategory}
                    onChange={(e) => setNewResCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                  >
                    <option value="Supreme Court">Supreme Court</option>
                    <option value="High Court">High Court</option>
                    <option value="Constitution">Constitution</option>
                    <option value="Statute">Statute</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Official Citation</label>
                  <input
                    type="text"
                    value={newResCitation}
                    onChange={(e) => setNewResCitation(e.target.value)}
                    placeholder="e.g. 1994 SCC (Cri) 45"
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Executive Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={newResSummaryEn}
                  onChange={(e) => setNewResSummaryEn(e.target.value)}
                  placeholder="Summary of constitutional significance..."
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E31E24] hover:bg-black text-white font-bold uppercase tracking-wider"
                >
                  Upload Filing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SCHEDULE STATE CONFERENCE                               */}
      {/* ============================================================== */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-neutral-900 max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
              <h4 className="text-lg font-black text-neutral-950 font-dmk-headline uppercase">
                Schedule State Legal Conference
              </h4>
              <button onClick={() => setShowAddEventModal(false)} className="p-1 hover:bg-neutral-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs font-english">
              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Conference Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitleEn}
                  onChange={(e) => setNewEventTitleEn(e.target.value)}
                  placeholder="e.g. State Plenary on Federalism & Judicial Autonomy"
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                  >
                    <option value="Conference">State Conference</option>
                    <option value="Seminar">Constitutional Seminar</option>
                    <option value="Legal Awareness">Advocate Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Venue / Complex</label>
                <input
                  type="text"
                  value={newEventVenueEn}
                  onChange={(e) => setNewEventVenueEn(e.target.value)}
                  placeholder="e.g. Kalaignar Arangam, Anna Arivalayam, Chennai"
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Agenda / Description</label>
                <textarea
                  rows={3}
                  value={newEventDescEn}
                  onChange={(e) => setNewEventDescEn(e.target.value)}
                  placeholder="Conference proceedings and legal discussion topics..."
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E31E24] hover:bg-black text-white font-bold uppercase tracking-wider"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ARCHIVE PRESS PHOTOGRAPH                                */}
      {/* ============================================================== */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-neutral-900 max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
              <h4 className="text-lg font-black text-neutral-950 font-dmk-headline uppercase">
                Archive Press Documentation Photo
              </h4>
              <button onClick={() => setShowAddGalleryModal(false)} className="p-1 hover:bg-neutral-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-3.5 text-xs font-english">
              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Photograph Event Title *</label>
                <input
                  type="text"
                  required
                  value={newGalTitleEn}
                  onChange={(e) => setNewGalTitleEn(e.target.value)}
                  placeholder="e.g. Legal Wing State Executive Briefing"
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Archive Album</label>
                  <select
                    value={newGalCategory}
                    onChange={(e) => setNewGalCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                  >
                    <option value="Press Conferences">Press Conferences</option>
                    <option value="Legal Wing Events">Legal Wing Events</option>
                    <option value="Advocates Meetings">Advocates Meetings</option>
                    <option value="Official Programmes">Official Programmes</option>
                    <option value="Historical Archive">Historical Archive</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-800 uppercase block mb-1">Location</label>
                  <input
                    type="text"
                    value={newGalLocationEn}
                    onChange={(e) => setNewGalLocationEn(e.target.value)}
                    placeholder="e.g. High Court Campus, Chennai"
                    className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={newGalImage}
                  onChange={(e) => setNewGalImage(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 uppercase block mb-1">Documentary Caption</label>
                <textarea
                  rows={2}
                  value={newGalCaptionEn}
                  onChange={(e) => setNewGalCaptionEn(e.target.value)}
                  placeholder="Official archival event description..."
                  className="w-full bg-[#FAF8F5] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E31E24] hover:bg-black text-white font-bold uppercase tracking-wider"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
