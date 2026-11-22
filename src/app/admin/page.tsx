'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { 
  AdvocateRegistration, 
  PublicEnquiry, 
  NewsItem, 
  PressGalleryItem, 
  EventItem, 
  LegalResource, 
  DistrictInfo,
  AuditLogItem 
} from '@/types';

export type AdminRole = 'super_admin' | 'editorial' | 'legal_desk';

export default function AdminConsolePage() {
  const { language } = useLanguage();

  // ---------------------------------------------------------------------------
  // AUTHENTICATION STATE (Server-Enforced via session cookies)
  // ---------------------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticatedRole, setAuthenticatedRole] = useState<AdminRole>('super_admin');
  const [authenticatedUser, setAuthenticatedUser] = useState<string>('admin');
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Client-side view filter: ONLY changes what domains are shown in the UI; never grants permissions
  const [viewRole, setViewRole] = useState<'all' | AdminRole>('all');

  // Login form state
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<AdminRole>('super_admin');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Domain (01 to 08 + 09 Activity Log)
  const [activeDomain, setActiveDomain] = useState<
    '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'
  >('01');

  // ---------------------------------------------------------------------------
  // HEARTBEAT / DATABASE STATUS
  // ---------------------------------------------------------------------------
  const [dbHealthy, setDbHealthy] = useState<boolean>(true);

  const checkHeartbeat = useCallback(async () => {
    try {
      const res = await fetch('/api/registrations');
      // Status 200, 401, or 403 indicates server and DB are online
      if (res.status === 200 || res.status === 401 || res.status === 403) {
        setDbHealthy(true);
      } else {
        setDbHealthy(false);
      }
    } catch {
      setDbHealthy(false);
    }
  }, []);

  useEffect(() => {
    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [checkHeartbeat]);

  // Check auth session on mount
  const checkAuth = useCallback(async () => {
    setIsCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.role) {
          setIsAuthenticated(true);
          setAuthenticatedRole(data.role);
          setAuthenticatedUser(data.user || `${data.role}-officer`);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword, role: loginRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthenticatedRole(data.role);
        setAuthenticatedUser(data.user);
        setLoginPassword('');
        fetchAllData();
      } else {
        setLoginError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setLoginError('Server error while authenticating.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setIsAuthenticated(false);
    setAuthenticatedUser('');
  };

  // ---------------------------------------------------------------------------
  // DATA COLLECTIONS & STATE
  // ---------------------------------------------------------------------------
  const [registrations, setRegistrations] = useState<AdvocateRegistration[]>([]);
  const [enquiries, setEnquiries] = useState<PublicEnquiry[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [districts, setDistricts] = useState<DistrictInfo[]>([]);
  const [resources, setResources] = useState<LegalResource[]>([]);
  const [gallery, setGallery] = useState<PressGalleryItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  const fetchAllData = useCallback(async () => {
    try {
      const [rReg, rEnq, rNews, rDist, rRes, rGal, rEvt, rAud] = await Promise.allSettled([
        fetch('/api/registrations').then((r) => r.json()),
        fetch('/api/enquiries').then((r) => r.json()),
        fetch('/api/news?admin=true').then((r) => r.json()),
        fetch('/api/districts').then((r) => r.json()),
        fetch('/api/resources').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/events').then((r) => r.json()),
        fetch('/api/audit').then((r) => r.json())
      ]);

      if (rReg.status === 'fulfilled' && rReg.value.success) setRegistrations(rReg.value.registrations || []);
      if (rEnq.status === 'fulfilled' && rEnq.value.success) setEnquiries(rEnq.value.enquiries || []);
      if (rNews.status === 'fulfilled' && rNews.value.success) setNews(rNews.value.news || []);
      if (rDist.status === 'fulfilled' && rDist.value.success) setDistricts(rDist.value.districts || []);
      if (rRes.status === 'fulfilled' && rRes.value.success) setResources(rRes.value.resources || []);
      if (rGal.status === 'fulfilled' && rGal.value.success) setGallery(rGal.value.gallery || []);
      if (rEvt.status === 'fulfilled' && rEvt.value.success) setEvents(rEvt.value.events || []);
      if (rAud.status === 'fulfilled' && rAud.value.success) setAuditLogs(rAud.value.logs || []);
    } catch (err) {
      console.error('Failed to load datasets:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // ---------------------------------------------------------------------------
  // DELETE CONFIRMATION & 8-SECOND UNDO BANNER
  // ---------------------------------------------------------------------------
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'registration' | 'enquiry' | 'news' | 'gallery' | 'event' | 'resource';
    id: string;
    recordName: string;
    rawItem?: any;
  } | null>(null);

  const [undoBanner, setUndoBanner] = useState<{
    recordName: string;
    type: string;
    rawItem: any;
    secondsLeft: number;
  } | null>(null);

  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerUndoBanner = (recordName: string, type: string, rawItem: any) => {
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    setUndoBanner({ recordName, type, rawItem, secondsLeft: 8 });

    undoTimerRef.current = setInterval(() => {
      setUndoBanner((prev) => {
        if (!prev || prev.secondsLeft <= 1) {
          if (undoTimerRef.current) clearInterval(undoTimerRef.current);
          return null;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
  };

  const handleExecuteDelete = async () => {
    if (!deleteDialog) return;
    const { type, id, recordName, rawItem } = deleteDialog;
    setDeleteDialog(null);

    let endpoint = '';
    if (type === 'registration') endpoint = `/api/registrations/${id}`;
    else if (type === 'enquiry') endpoint = `/api/enquiries/${id}`;
    else if (type === 'news') endpoint = `/api/news/${id}`;
    else if (type === 'gallery') endpoint = `/api/gallery/${id}`;
    else if (type === 'event') endpoint = `/api/events/${id}`;
    else if (type === 'resource') endpoint = `/api/resources/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        // Remove locally
        if (type === 'registration') setRegistrations((prev) => prev.filter((r) => r.id !== id));
        else if (type === 'enquiry') setEnquiries((prev) => prev.filter((e) => e.id !== id));
        else if (type === 'news') setNews((prev) => prev.filter((n) => n.id !== id));
        else if (type === 'gallery') setGallery((prev) => prev.filter((g) => g.id !== id));
        else if (type === 'event') setEvents((prev) => prev.filter((e) => e.id !== id));
        else if (type === 'resource') setResources((prev) => prev.filter((r) => r.id !== id));

        triggerUndoBanner(recordName, type, rawItem);
        // Refresh audit logs
        fetch('/api/audit').then((r) => r.json()).then((d) => {
          if (d.success) setAuditLogs(d.logs || []);
        });
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUndo = async () => {
    if (!undoBanner) return;
    const { type, rawItem } = undoBanner;
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    setUndoBanner(null);

    try {
      let endpoint = '';
      if (type === 'registration') endpoint = '/api/registrations';
      else if (type === 'enquiry') endpoint = '/api/enquiries';
      else if (type === 'news') endpoint = '/api/news';
      else if (type === 'gallery') endpoint = '/api/gallery';
      else if (type === 'event') endpoint = '/api/events';
      else if (type === 'resource') endpoint = '/api/resources';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawItem)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Undo failed:', err);
    }
  };

  // ---------------------------------------------------------------------------
  // SIDE PANEL STATE (Applications & Grievances)
  // ---------------------------------------------------------------------------
  const [selectedApp, setSelectedApp] = useState<AdvocateRegistration | null>(null);
  const [appNotes, setAppNotes] = useState<string>('');
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  const [selectedGrievance, setSelectedGrievance] = useState<PublicEnquiry | null>(null);
  const [grievanceNotes, setGrievanceNotes] = useState<string>('');
  const [isUpdatingGrievance, setIsUpdatingGrievance] = useState(false);

  const handleUpdateAppStatus = async (status: AdvocateRegistration['status']) => {
    if (!selectedApp) return;
    setIsUpdatingApp(true);
    try {
      const res = await fetch(`/api/registrations/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: appNotes })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === selectedApp.id ? { ...r, status, notes: appNotes } : r))
        );
        setSelectedApp({ ...selectedApp, status, notes: appNotes });
      }
    } catch {}
    setIsUpdatingApp(false);
  };

  const handleUpdateGrievanceStatus = async (status: PublicEnquiry['status']) => {
    if (!selectedGrievance) return;
    setIsUpdatingGrievance(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedGrievance.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: grievanceNotes })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedGrievance.id ? { ...e, status, notes: grievanceNotes } : e))
        );
        setSelectedGrievance({ ...selectedGrievance, status, notes: grievanceNotes });
      }
    } catch {}
    setIsUpdatingGrievance(false);
  };

  // ---------------------------------------------------------------------------
  // BULK SELECTION (Tables)
  // ---------------------------------------------------------------------------
  const [tickedAppIds, setTickedAppIds] = useState<string[]>([]);
  const [tickedGrievanceIds, setTickedGrievanceIds] = useState<string[]>([]);
  const [tickedNewsIds, setTickedNewsIds] = useState<string[]>([]);

  // ---------------------------------------------------------------------------
  // SEARCH & FILTER STATES
  // ---------------------------------------------------------------------------
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('All');

  const [grievanceSearch, setGrievanceSearch] = useState('');
  const [grievanceStatusFilter, setGrievanceStatusFilter] = useState<string>('All');

  const [newsSearch, setNewsSearch] = useState('');
  const [newsStatusFilter, setNewsStatusFilter] = useState<string>('All');

  const [districtSearch, setDistrictSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);
  const [districtForm, setDistrictForm] = useState<{
    organizerEn: string;
    organizerTa: string;
    contactPhone: string;
    courtComplexEn: string;
    courtComplexTa: string;
    showPhonePublicly: boolean;
  }>({
    organizerEn: '',
    organizerTa: '',
    contactPhone: '',
    courtComplexEn: '',
    courtComplexTa: '',
    showPhonePublicly: true
  });
  const [isSavingDistrict, setIsSavingDistrict] = useState(false);

  // ---------------------------------------------------------------------------
  // NEWS EDITOR STATE (Side-by-side Tamil/English, crop, lead preview)
  // ---------------------------------------------------------------------------
  const [newsEditMode, setNewsEditMode] = useState<'list' | 'editor'>('list');
  const [newsForm, setNewsForm] = useState<{
    id?: string;
    titleEn: string;
    titleTa: string;
    summaryEn: string;
    summaryTa: string;
    contentEn: string;
    contentTa: string;
    category: string;
    status: 'Draft' | 'Scheduled' | 'Published';
    publishDate: string;
    publishTime: string;
    isLeadStory: boolean;
    image: string;
    cropCoordinates: { x: number; y: number; width: number; height: number };
  }>({
    titleEn: '',
    titleTa: '',
    summaryEn: '',
    summaryTa: '',
    contentEn: '',
    contentTa: '',
    category: 'Press Release',
    status: 'Published',
    publishDate: '2026-11-22',
    publishTime: '09:00',
    isLeadStory: false,
    image: '/images/dmk-flag-sun.jpg',
    cropCoordinates: { x: 0, y: 0, width: 100, height: 56.25 }
  });
  const [isSavingNews, setIsSavingNews] = useState(false);

  const handleOpenNewsEditor = (item?: NewsItem) => {
    if (item) {
      setNewsForm({
        id: item.id,
        titleEn: item.title.en,
        titleTa: item.title.ta,
        summaryEn: item.summary.en,
        summaryTa: item.summary.ta,
        contentEn: item.content.en,
        contentTa: item.content.ta,
        category: item.category,
        status: (item as any).status || 'Published',
        publishDate: (item as any).publishDate || item.date || new Date().toISOString().split('T')[0],
        publishTime: (item as any).publishTime || item.time || '09:00',
        isLeadStory: Boolean(item.isLeadStory || item.featured),
        image: item.image || '/images/dmk-flag-sun.jpg',
        cropCoordinates: (item as any).cropCoordinates || { x: 0, y: 0, width: 100, height: 56.25 }
      });
    } else {
      setNewsForm({
        titleEn: '',
        titleTa: '',
        summaryEn: '',
        summaryTa: '',
        contentEn: '',
        contentTa: '',
        category: 'Press Release',
        status: 'Draft',
        publishDate: new Date().toISOString().split('T')[0],
        publishTime: '09:00',
        isLeadStory: false,
        image: '/images/dmk-flag-sun.jpg',
        cropCoordinates: { x: 0, y: 0, width: 100, height: 56.25 }
      });
    }
    setNewsEditMode('editor');
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNews(true);
    try {
      const payload: any = {
        title: { en: newsForm.titleEn.trim(), ta: newsForm.titleTa.trim() || newsForm.titleEn.trim() },
        summary: { en: newsForm.summaryEn.trim(), ta: newsForm.summaryTa.trim() || newsForm.summaryEn.trim() },
        content: { en: newsForm.contentEn.trim(), ta: newsForm.contentTa.trim() || newsForm.contentEn.trim() },
        category: newsForm.category,
        status: newsForm.status,
        publishDate: newsForm.publishDate,
        publishTime: newsForm.publishTime,
        date: newsForm.publishDate,
        time: newsForm.publishTime,
        isLeadStory: newsForm.isLeadStory,
        featured: newsForm.isLeadStory,
        image: newsForm.image,
        cropCoordinates: newsForm.cropCoordinates,
        author: { en: 'Press Bureau, DMK Legal Wing', ta: 'செய்திப் பிரிவு, திமுக வழக்கறிஞர் அணி' }
      };

      let res;
      if (newsForm.id) {
        res = await fetch(`/api/news/${newsForm.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setNewsEditMode('list');
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to save news:', err);
    }
    setIsSavingNews(false);
  };

  // ---------------------------------------------------------------------------
  // FILTERED LISTS
  // ---------------------------------------------------------------------------
  const filteredApps = useMemo(() => {
    const q = appSearch.toLowerCase().trim();
    return registrations.filter((r) => {
      const matchStatus = appStatusFilter === 'All' || r.status.toLowerCase() === appStatusFilter.toLowerCase();
      const matchSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.barCouncilNumber.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.mobileNumber.includes(q);
      return matchStatus && matchSearch;
    });
  }, [registrations, appSearch, appStatusFilter]);

  const filteredGrievances = useMemo(() => {
    const q = grievanceSearch.toLowerCase().trim();
    return enquiries.filter((e) => {
      const matchStatus =
        grievanceStatusFilter === 'All' ||
        (grievanceStatusFilter === 'New' && e.status === 'new') ||
        (grievanceStatusFilter === 'Under review' && e.status === 'reviewed') ||
        (grievanceStatusFilter === 'Resolved' && e.status === 'resolved');
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.district.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [enquiries, grievanceSearch, grievanceStatusFilter]);

  const filteredNews = useMemo(() => {
    const q = newsSearch.toLowerCase().trim();
    return news.filter((n) => {
      const itemStatus = (n as any).status || 'Published';
      const matchStatus = newsStatusFilter === 'All' || itemStatus.toLowerCase() === newsStatusFilter.toLowerCase();
      const matchSearch =
        !q ||
        n.title.en.toLowerCase().includes(q) ||
        n.title.ta.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [news, newsSearch, newsStatusFilter]);

  const filteredDistricts = useMemo(() => {
    const q = districtSearch.toLowerCase().trim();
    return districts.filter((d) => {
      return (
        !q ||
        d.name.en.toLowerCase().includes(q) ||
        d.name.ta.toLowerCase().includes(q) ||
        d.organizer.en.toLowerCase().includes(q) ||
        d.contactPhone.includes(q)
      );
    });
  }, [districts, districtSearch]);

  const sortedAuditLogs = useMemo(() => {
    return [...auditLogs].sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
  }, [auditLogs]);

  // ---------------------------------------------------------------------------
  // DOMAIN DEFINITIONS (01 to 08 + 09)
  // ---------------------------------------------------------------------------
  const DOMAINS = [
    { id: '01', title: 'Telemetry and overview', roleRequirement: 'all' },
    { id: '02', title: 'Advocate applications', roleRequirement: 'legal_desk' },
    { id: '03', title: 'Citizen legal desk', roleRequirement: 'legal_desk' },
    { id: '04', title: 'Editorial newsroom', roleRequirement: 'editorial' },
    { id: '05', title: '74 District registry', roleRequirement: 'super_admin' },
    { id: '06', title: 'Legal dossiers and vault', roleRequirement: 'super_admin' },
    { id: '07', title: 'Press photojournalism', roleRequirement: 'editorial' },
    { id: '08', title: 'State conferences', roleRequirement: 'editorial' },
    { id: '09', title: 'Activity log', roleRequirement: 'all' }
  ];

  // Role filter on visible domains
  const visibleDomains = useMemo(() => {
    if (viewRole === 'all') return DOMAINS;
    if (viewRole === 'super_admin') return DOMAINS;
    if (viewRole === 'editorial') {
      return DOMAINS.filter(
        (d) => d.id === '01' || d.id === '04' || d.id === '07' || d.id === '08' || d.id === '09'
      );
    }
    if (viewRole === 'legal_desk') {
      return DOMAINS.filter(
        (d) => d.id === '01' || d.id === '02' || d.id === '03' || d.id === '09'
      );
    }
    return DOMAINS;
  }, [viewRole, DOMAINS]);

  // ---------------------------------------------------------------------------
  // IF NOT AUTHENTICATED: CLEAN, SQUARE LOGIN SCREEN
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#FAF8F5] text-[#111111] font-catamaran flex items-center justify-center p-4">
        <div className="max-w-[420px] w-full bg-white border-2 border-[#111111] p-8 space-y-6">
          <div className="border-b-2 border-[#111111] pb-4">
            <span className="text-[12px] font-extrabold uppercase text-[#C41A1F] block">
              DMK LEGAL WING APEX
            </span>
            <h1 className="font-helvetica font-extrabold text-[24px] text-[#111111]">
              Administration Login
            </h1>
          </div>

          {loginError && (
            <div className="p-3 bg-[#f1ece2] border-l-4 border-[#C41A1F] text-[#C41A1F] text-[14px] font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[14px] font-extrabold text-[#111111]">
                Administrative Role
              </label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as AdminRole)}
                className="w-full h-[44px] px-3 bg-[#FAF8F5] border-2 border-[#111111] text-[15px] outline-none"
              >
                <option value="super_admin">Super Admin (All privileges)</option>
                <option value="editorial">Editorial (News, Gallery, Events)</option>
                <option value="legal_desk">Legal Desk (Registrations, Enquiries)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[14px] font-extrabold text-[#111111]">
                Master Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-[44px] px-3 bg-[#FAF8F5] border-2 border-[#111111] text-[15px] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-[44px] bg-[#E31E24] hover:bg-[#C41A1F] disabled:opacity-50 text-white font-extrabold text-[15px] transition-colors duration-150 cursor-pointer"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in to Console'}
            </button>
          </form>

          <div className="pt-2 border-t border-[#d7d0c3] text-[13px] text-[#5B5348] space-y-1">
            <p><strong>Credentials hint:</strong></p>
            <p>• Super Admin: <code className="font-mono">superadmin</code> or <code className="font-mono">dmk1971</code></p>
            <p>• Editorial: <code className="font-mono">editorial</code></p>
            <p>• Legal Desk: <code className="font-mono">legaldesk</code></p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED WORKSPACE LAYOUT
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#111111] font-catamaran text-[15px] flex">
      
      {/* 1. FIXED 240 PX INK SIDEBAR */}
      <aside className="w-[240px] bg-[#111111] text-[#FAF8F5] fixed left-0 top-0 bottom-0 z-30 flex flex-col justify-between border-r border-[#111111]">
        <div>
          {/* Sidebar Top: Logo / Brand */}
          <div className="p-4 border-b border-[#2d2724]">
            <Link href="/" className="block">
              <span className="text-[11px] font-extrabold uppercase text-[#ff8a85] tracking-normal block">
                திமுக வழக்கறிஞர் அணி
              </span>
              <span className="font-helvetica font-extrabold text-[16px] text-white block">
                Apex Administration
              </span>
            </Link>

            {/* Role Filter Switcher (View only - does not grant permissions) */}
            <div className="mt-3 pt-3 border-t border-[#2d2724]">
              <label className="text-[11px] font-extrabold uppercase text-[#8f857d] block mb-1">
                Domain Filter (View)
              </label>
              <select
                value={viewRole}
                onChange={(e) => setViewRole(e.target.value as any)}
                className="w-full h-[32px] px-2 bg-[#222222] border border-[#3d3633] text-[12px] text-white outline-none"
              >
                <option value="all">Show All Domains</option>
                <option value="super_admin">Super Admin View</option>
                <option value="editorial">Editorial View</option>
                <option value="legal_desk">Legal Desk View</option>
              </select>
            </div>
          </div>

          {/* 8 Numbered Domains (01 to 08 + 09) */}
          <nav className="py-2" aria-label="Admin domains">
            {visibleDomains.map((dom) => {
              const isActive = activeDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => {
                    setActiveDomain(dom.id as any);
                    if (dom.id === '04') setNewsEditMode('list');
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] font-extrabold flex items-center gap-3 transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E31E24] text-white'
                      : 'text-[#d7d0c3] hover:bg-[#222222] hover:text-white'
                  }`}
                >
                  <span className="font-helvetica font-extrabold text-[12px] opacity-80 shrink-0">
                    {dom.id}
                  </span>
                  <span className="truncate">{dom.title}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-[#2d2724] text-[12px] text-[#8f857d]">
          <span>Server Role: </span>
          <strong className="text-white uppercase">{authenticatedRole.replace('_', ' ')}</strong>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Left margin 240px) */}
      <div className="ml-[240px] flex-1 min-h-screen flex flex-col bg-[#FAF8F5]">
        
        {/* TOP BAR */}
        <header className="h-[56px] bg-white border-b-2 border-[#111111] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="font-helvetica font-extrabold text-[15px] text-[#111111]">
              {authenticatedUser}
            </span>
            <span className="text-[12px] border border-[#111111] px-2 py-0.5 font-extrabold uppercase">
              {authenticatedRole.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* 12 px square status marker with words "Database OK" or "Database error" */}
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 inline-block shrink-0 ${
                  dbHealthy ? 'bg-[#111111]' : 'bg-[#E31E24]'
                }`}
              />
              <span className="font-extrabold text-[13px] text-[#111111]">
                {dbHealthy ? 'Database OK' : 'Database error'}
              </span>
            </div>

            {/* Sign out link */}
            <button
              type="button"
              onClick={handleSignOut}
              className="text-[13px] font-extrabold text-[#C41A1F] hover:underline cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* 8-SECOND UNDO BANNER */}
        {undoBanner && (
          <div className="bg-[#111111] text-[#FAF8F5] px-6 py-3 border-b-2 border-[#E31E24] flex items-center justify-between">
            <span className="text-[14px]">
              Record <strong>&ldquo;{undoBanner.recordName}&rdquo;</strong> was deleted.
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleUndo}
                className="bg-[#E31E24] text-white px-3 py-1 font-extrabold text-[13px] hover:bg-[#C41A1F] transition-colors duration-150 cursor-pointer"
              >
                Undo ({undoBanner.secondsLeft}s)
              </button>
              <button
                type="button"
                onClick={() => setUndoBanner(null)}
                className="text-white hover:text-red-400 text-[13px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* WORKSPACE CONTENT BODY */}
        <main className="p-6 sm:p-8 flex-1">
          
          {/* ================================================================= */}
          {/* DOMAIN 01: Telemetry and Overview */}
          {/* ================================================================= */}
          {activeDomain === '01' && (
            <div className="space-y-6">
              <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                Telemetry and Overview
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-[#111111] p-4">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    Advocate Applications
                  </span>
                  <span className="font-helvetica font-extrabold text-[32px] text-[#111111]">
                    {registrations.length}
                  </span>
                </div>
                <div className="bg-white border-2 border-[#111111] p-4">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    Citizen Legal Inquiries
                  </span>
                  <span className="font-helvetica font-extrabold text-[32px] text-[#111111]">
                    {enquiries.length}
                  </span>
                </div>
                <div className="bg-white border-2 border-[#111111] p-4">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    Newsroom Dispatches
                  </span>
                  <span className="font-helvetica font-extrabold text-[32px] text-[#111111]">
                    {news.length}
                  </span>
                </div>
                <div className="bg-white border-2 border-[#111111] p-4">
                  <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                    74 District Units
                  </span>
                  <span className="font-helvetica font-extrabold text-[32px] text-[#111111]">
                    {districts.length}
                  </span>
                </div>
              </div>

              {/* Recent Activity snippet */}
              <div className="bg-white border-2 border-[#111111] p-6 space-y-4">
                <h2 className="font-helvetica font-extrabold text-[17px] text-[#111111] border-b border-[#d7d0c3] pb-2">
                  System Health & Authorization Boundaries
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
                  <div className="p-3 bg-[#f1ece2] border border-[#111111]">
                    <strong className="block text-[#111111]">Super Admin Role</strong>
                    <span className="text-[#5B5348]">Unrestricted root access across all 8 domains and configuration.</span>
                  </div>
                  <div className="p-3 bg-[#f1ece2] border border-[#111111]">
                    <strong className="block text-[#111111]">Editorial Role</strong>
                    <span className="text-[#5B5348]">Guarded: Newsroom, Press Photojournalism, State Conferences.</span>
                  </div>
                  <div className="p-3 bg-[#f1ece2] border border-[#111111]">
                    <strong className="block text-[#111111]">Legal Desk Role</strong>
                    <span className="text-[#5B5348]">Guarded: Advocate Applications, Citizen Legal Aid Grievances.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 02: Advocate Applications */}
          {/* ================================================================= */}
          {activeDomain === '02' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                  Advocate Enrolment Applications
                </h1>
                <span className="text-[13px] text-[#5B5348]">
                  Total: <strong>{filteredApps.length}</strong>
                </span>
              </div>

              {/* Column Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by name, bar number, district..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="h-[38px] px-3 bg-white border-2 border-[#111111] text-[14px] w-72 outline-none"
                />

                <div className="flex items-center gap-1 border border-[#111111] bg-white p-1">
                  {['All', 'Pending', 'Verified', 'Approved', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAppStatusFilter(st)}
                      className={`px-3 py-1 text-[13px] font-extrabold transition-colors duration-150 cursor-pointer ${
                        appStatusFilter === st
                          ? 'bg-[#111111] text-white'
                          : 'text-[#111111] hover:bg-[#f1ece2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {tickedAppIds.length > 0 && (
                <div className="bg-[#111111] text-white px-4 py-2 flex items-center justify-between text-[13px]">
                  <span>
                    <strong>{tickedAppIds.length}</strong> applications selected
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        for (const id of tickedAppIds) {
                          await fetch(`/api/registrations/${id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'approved' })
                          });
                        }
                        setTickedAppIds([]);
                        fetchAllData();
                      }}
                      className="px-2.5 py-1 bg-white text-[#111111] font-extrabold hover:bg-gray-200 cursor-pointer"
                    >
                      Bulk Approve
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        for (const id of tickedAppIds) {
                          await fetch(`/api/registrations/${id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'rejected' })
                          });
                        }
                        setTickedAppIds([]);
                        fetchAllData();
                      }}
                      className="px-2.5 py-1 bg-[#E31E24] text-white font-extrabold hover:bg-[#C41A1F] cursor-pointer"
                    >
                      Bulk Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setTickedAppIds([])}
                      className="text-gray-300 underline text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Table at 15px with 44px rows and sticky header */}
              <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                <table className="w-full text-left text-[15px] border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                      <th className="px-3 py-2 w-10">
                        <input
                          type="checkbox"
                          checked={tickedAppIds.length === filteredApps.length && filteredApps.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setTickedAppIds(filteredApps.map((a) => a.id));
                            else setTickedAppIds([]);
                          }}
                          className="w-4 h-4 rounded-none accent-[#E31E24] cursor-pointer"
                        />
                      </th>
                      <th className="px-3 py-2">Applicant</th>
                      <th className="px-3 py-2">Bar Number</th>
                      <th className="px-3 py-2">District</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-[#5B5348]">
                          No advocate enrolment applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((item) => {
                        const isTicked = tickedAppIds.includes(item.id);
                        return (
                          <tr
                            key={item.id}
                            className={`h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150 ${
                              selectedApp?.id === item.id ? 'bg-[#f1ece2]' : ''
                            }`}
                          >
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={isTicked}
                                onChange={(e) => {
                                  if (e.target.checked) setTickedAppIds([...tickedAppIds, item.id]);
                                  else setTickedAppIds(tickedAppIds.filter((x) => x !== item.id));
                                }}
                                className="w-4 h-4 rounded-none accent-[#E31E24] cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-2 font-helvetica font-extrabold text-[#111111]">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApp(item);
                                  setAppNotes((item as any).notes || '');
                                }}
                                className="hover:underline text-left cursor-pointer"
                              >
                                {item.fullName}
                              </button>
                            </td>
                            <td className="px-3 py-2 font-mono text-[14px]">{item.barCouncilNumber}</td>
                            <td className="px-3 py-2">{item.district}</td>
                            <td className="px-3 py-2">{item.mobileNumber}</td>
                            <td className="px-3 py-2">
                              <span className="border border-[#111111] px-2 py-0.5 text-[12px] font-bold uppercase rounded-none inline-block">
                                {item.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApp(item);
                                  setAppNotes((item as any).notes || '');
                                }}
                                className="text-[#111111] underline hover:no-underline hover:text-[#E31E24] font-bold mr-3 cursor-pointer"
                              >
                                Review
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteDialog({
                                    isOpen: true,
                                    type: 'registration',
                                    id: item.id,
                                    recordName: item.fullName,
                                    rawItem: item
                                  })
                                }
                                className="text-[#C41A1F] underline hover:no-underline font-bold cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 03: Citizen Legal Desk */}
          {/* ================================================================= */}
          {activeDomain === '03' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                  Citizen Legal Desk Inquiries
                </h1>
                <span className="text-[13px] text-[#5B5348]">
                  Total: <strong>{filteredGrievances.length}</strong>
                </span>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by petitioner, phone, category..."
                  value={grievanceSearch}
                  onChange={(e) => setGrievanceSearch(e.target.value)}
                  className="h-[38px] px-3 bg-white border-2 border-[#111111] text-[14px] w-72 outline-none"
                />

                <div className="flex items-center gap-1 border border-[#111111] bg-white p-1">
                  {['All', 'New', 'Under review', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setGrievanceStatusFilter(st)}
                      className={`px-3 py-1 text-[13px] font-extrabold transition-colors duration-150 cursor-pointer ${
                        grievanceStatusFilter === st
                          ? 'bg-[#111111] text-white'
                          : 'text-[#111111] hover:bg-[#f1ece2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table at 15px with 44px rows */}
              <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                <table className="w-full text-left text-[15px] border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                      <th className="px-3 py-2 w-10">
                        <input
                          type="checkbox"
                          checked={tickedGrievanceIds.length === filteredGrievances.length && filteredGrievances.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setTickedGrievanceIds(filteredGrievances.map((g) => g.id));
                            else setTickedGrievanceIds([]);
                          }}
                          className="w-4 h-4 rounded-none accent-[#E31E24] cursor-pointer"
                        />
                      </th>
                      <th className="px-3 py-2">Petitioner</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Subject</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrievances.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-[#5B5348]">
                          No citizen legal inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredGrievances.map((item) => (
                        <tr
                          key={item.id}
                          className={`h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150 ${
                            selectedGrievance?.id === item.id ? 'bg-[#f1ece2]' : ''
                          }`}
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={tickedGrievanceIds.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) setTickedGrievanceIds([...tickedGrievanceIds, item.id]);
                                else setTickedGrievanceIds(tickedGrievanceIds.filter((x) => x !== item.id));
                              }}
                              className="w-4 h-4 rounded-none accent-[#E31E24] cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 font-helvetica font-extrabold text-[#111111]">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedGrievance(item);
                                setGrievanceNotes((item as any).notes || '');
                              }}
                              className="hover:underline text-left cursor-pointer"
                            >
                              {item.name}
                            </button>
                          </td>
                          <td className="px-3 py-2">{item.phone}</td>
                          <td className="px-3 py-2">{item.category}</td>
                          <td className="px-3 py-2 truncate max-w-xs">{item.subject}</td>
                          <td className="px-3 py-2">
                            <span className="border border-[#111111] px-2 py-0.5 text-[12px] font-bold uppercase rounded-none inline-block">
                              {item.status === 'new' ? 'Pending' : item.status === 'reviewed' ? 'Under review' : 'Resolved'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedGrievance(item);
                                setGrievanceNotes((item as any).notes || '');
                              }}
                              className="text-[#111111] underline hover:no-underline hover:text-[#E31E24] font-bold mr-3 cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteDialog({
                                  isOpen: true,
                                  type: 'enquiry',
                                  id: item.id,
                                  recordName: `${item.name} (${item.category})`,
                                  rawItem: item
                                })
                              }
                              className="text-[#C41A1F] underline hover:no-underline font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 04: Editorial Newsroom (List & Editor) */}
          {/* ================================================================= */}
          {activeDomain === '04' && (
            <div className="space-y-6">
              {newsEditMode === 'list' ? (
                <>
                  <div className="flex items-center justify-between">
                    <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                      Editorial Newsroom
                    </h1>
                    <button
                      type="button"
                      onClick={() => handleOpenNewsEditor()}
                      className="h-[38px] px-4 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] transition-colors duration-150 cursor-pointer"
                    >
                      + Create Dispatch
                    </button>
                  </div>

                  {/* Filter & Search */}
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search articles by headline..."
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                      className="h-[38px] px-3 bg-white border-2 border-[#111111] text-[14px] w-72 outline-none"
                    />

                    <div className="flex items-center gap-1 border border-[#111111] bg-white p-1">
                      {['All', 'Published', 'Draft', 'Scheduled'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setNewsStatusFilter(st)}
                          className={`px-3 py-1 text-[13px] font-extrabold transition-colors duration-150 cursor-pointer ${
                            newsStatusFilter === st
                              ? 'bg-[#111111] text-white'
                              : 'text-[#111111] hover:bg-[#f1ece2]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* News Table at 15px with 44px rows */}
                  <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                    <table className="w-full text-left text-[15px] border-collapse">
                      <thead>
                        <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                          <th className="px-3 py-2">Headline</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Lead</th>
                          <th className="px-3 py-2">Publish Date</th>
                          <th className="px-3 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNews.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-[#5B5348]">
                              No newsroom articles found.
                            </td>
                          </tr>
                        ) : (
                          filteredNews.map((item) => {
                            const isLead = Boolean(item.isLeadStory || item.featured);
                            const st = (item as any).status || 'Published';
                            return (
                              <tr
                                key={item.id}
                                className="h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150"
                              >
                                <td className="px-3 py-2 font-helvetica font-extrabold text-[#111111] max-w-md truncate">
                                  {item.title.en}
                                </td>
                                <td className="px-3 py-2">{item.category}</td>
                                <td className="px-3 py-2">
                                  <span className="border border-[#111111] px-2 py-0.5 text-[12px] font-bold uppercase rounded-none inline-block">
                                    {st}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  {isLead ? (
                                    <span className="border border-[#E31E24] text-[#E31E24] px-2 py-0.5 text-[11px] font-extrabold uppercase">
                                      Lead
                                    </span>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  {(item as any).publishDate || item.date || '—'}
                                </td>
                                <td className="px-3 py-2 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenNewsEditor(item)}
                                    className="text-[#111111] underline hover:no-underline hover:text-[#E31E24] font-bold mr-3 cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteDialog({
                                        isOpen: true,
                                        type: 'news',
                                        id: item.id,
                                        recordName: item.title.en,
                                        rawItem: item
                                      })
                                    }
                                    className="text-[#C41A1F] underline hover:no-underline font-bold cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* NEWS EDITOR: Tamil and English fields side by side, type, status, publish date/time, lead toggle, crop box & live preview */
                <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
                    <h2 className="font-helvetica font-extrabold text-[20px] text-[#111111]">
                      {newsForm.id ? 'Edit Dispatch' : 'New Newsroom Dispatch'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setNewsEditMode('list')}
                      className="px-3 py-1 border border-[#111111] text-[13px] font-extrabold hover:bg-[#111111] hover:text-white cursor-pointer"
                    >
                      ← Back to list
                    </button>
                  </div>

                  <form onSubmit={handleSaveNews} className="space-y-6">
                    {/* Controls Strip: Type, Status, Date, Time, Lead Toggle */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-[#f1ece2] border border-[#111111]">
                      <div>
                        <label className="block text-[12px] font-extrabold uppercase text-[#111111] mb-1">
                          Category / Type
                        </label>
                        <select
                          value={newsForm.category}
                          onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                          className="w-full h-[36px] px-2 bg-white border border-[#111111] text-[13px] outline-none"
                        >
                          <option value="Press Release">Press Release</option>
                          <option value="Statement">Statement</option>
                          <option value="Resolution">Resolution</option>
                          <option value="Gazette">Gazette</option>
                          <option value="Court Watch">Court Watch</option>
                          <option value="Media">Media</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-extrabold uppercase text-[#111111] mb-1">
                          Publication Status
                        </label>
                        <select
                          value={newsForm.status}
                          onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                          className="w-full h-[36px] px-2 bg-white border border-[#111111] text-[13px] outline-none"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Published">Published</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-extrabold uppercase text-[#111111] mb-1">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          value={newsForm.publishDate}
                          onChange={(e) => setNewsForm({ ...newsForm, publishDate: e.target.value })}
                          className="w-full h-[36px] px-2 bg-white border border-[#111111] text-[13px] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-extrabold uppercase text-[#111111] mb-1">
                          Publish Time
                        </label>
                        <input
                          type="time"
                          value={newsForm.publishTime}
                          onChange={(e) => setNewsForm({ ...newsForm, publishTime: e.target.value })}
                          className="w-full h-[36px] px-2 bg-white border border-[#111111] text-[13px] outline-none"
                        />
                      </div>

                      <div className="flex flex-col justify-end">
                        <label className="flex items-center gap-2 h-[36px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newsForm.isLeadStory}
                            onChange={(e) => setNewsForm({ ...newsForm, isLeadStory: e.target.checked })}
                            className="w-4 h-4 rounded-none accent-[#E31E24]"
                          />
                          <span className="text-[13px] font-extrabold text-[#111111]">
                            Front-page Lead
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Side-by-Side Fields: English & Tamil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* English Column */}
                      <div className="space-y-4">
                        <span className="text-[13px] font-extrabold uppercase text-[#111111] block border-b border-[#111111] pb-1">
                          English Metadata & Content
                        </span>

                        <div className="space-y-1">
                          <label className="block text-[13px] font-extrabold">Headline (EN) *</label>
                          <input
                            type="text"
                            required
                            value={newsForm.titleEn}
                            onChange={(e) => setNewsForm({ ...newsForm, titleEn: e.target.value })}
                            className="w-full h-[40px] px-3 bg-[#FAF8F5] border border-[#111111] text-[15px] outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[13px] font-extrabold">Summary / Deck (EN)</label>
                          <textarea
                            rows={3}
                            value={newsForm.summaryEn}
                            onChange={(e) => setNewsForm({ ...newsForm, summaryEn: e.target.value })}
                            className="w-full p-2 bg-[#FAF8F5] border border-[#111111] text-[14px] outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[13px] font-extrabold">Full Body Text (EN)</label>
                          <textarea
                            rows={6}
                            value={newsForm.contentEn}
                            onChange={(e) => setNewsForm({ ...newsForm, contentEn: e.target.value })}
                            className="w-full p-2 bg-[#FAF8F5] border border-[#111111] text-[14px] outline-none font-catamaran"
                          />
                        </div>
                      </div>

                      {/* Tamil Column */}
                      <div className="space-y-4">
                        <span className="text-[13px] font-extrabold uppercase text-[#111111] block border-b border-[#111111] pb-1 font-kavivanar">
                          தமிழ் தலைப்பு & உள்ளடக்கம்
                        </span>

                        <div className="space-y-1">
                          <label className="block text-[13px] font-extrabold font-kavivanar">தலைப்பு (தமிழ்)</label>
                          <input
                            type="text"
                            value={newsForm.titleTa}
                            onChange={(e) => setNewsForm({ ...newsForm, titleTa: e.target.value })}
                            className="w-full h-[40px] px-3 bg-[#FAF8F5] border border-[#111111] text-[15px] outline-none font-kavivanar"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[13px] font-extrabold font-kavivanar">சுருக்க உரை (தமிழ்)</label>
                          <textarea
                            rows={3}
                            value={newsForm.summaryTa}
                            onChange={(e) => setNewsForm({ ...newsForm, summaryTa: e.target.value })}
                            className="w-full p-2 bg-[#FAF8F5] border border-[#111111] text-[14px] outline-none font-kavivanar"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[13px] font-extrabold font-kavivanar">முழு செய்தி உரை (தமிழ்)</label>
                          <textarea
                            rows={6}
                            value={newsForm.contentTa}
                            onChange={(e) => setNewsForm({ ...newsForm, contentTa: e.target.value })}
                            className="w-full p-2 bg-[#FAF8F5] border border-[#111111] text-[14px] outline-none font-kavivanar"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Image URL & Crop Box for Lead Picture */}
                    <div className="border-t-2 border-[#111111] pt-6 space-y-4">
                      <h3 className="font-helvetica font-extrabold text-[16px] text-[#111111]">
                        Lead Picture & Interactive Crop Box (16:9)
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-3">
                          <label className="block text-[13px] font-extrabold">Lead Image Path or URL</label>
                          <input
                            type="text"
                            value={newsForm.image}
                            onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                            className="w-full h-[38px] px-3 bg-[#FAF8F5] border border-[#111111] text-[14px] outline-none"
                          />

                          {/* Crop coordinate controls */}
                          <div className="p-3 bg-[#f1ece2] border border-[#111111] space-y-2 text-[13px]">
                            <span className="font-extrabold block">Crop Box Dimensions:</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-[#5B5348] block">Offset Y (%)</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={50}
                                  value={newsForm.cropCoordinates.y}
                                  onChange={(e) =>
                                    setNewsForm({
                                      ...newsForm,
                                      cropCoordinates: {
                                        ...newsForm.cropCoordinates,
                                        y: Number(e.target.value)
                                      }
                                    })
                                  }
                                  className="w-full h-[30px] px-2 bg-white border border-[#111111]"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-[#5B5348] block">Crop Height (%)</label>
                                <input
                                  type="number"
                                  min={30}
                                  max={100}
                                  value={newsForm.cropCoordinates.height}
                                  onChange={(e) =>
                                    setNewsForm({
                                      ...newsForm,
                                      cropCoordinates: {
                                        ...newsForm.cropCoordinates,
                                        height: Number(e.target.value)
                                      }
                                    })
                                  }
                                  className="w-full h-[30px] px-2 bg-white border border-[#111111]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visual Crop Box Preview */}
                        <div className="space-y-2">
                          <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
                            Crop Frame Indicator
                          </span>
                          <div className="relative border-2 border-[#111111] aspect-video bg-[#111111] overflow-hidden">
                            <img
                              src={newsForm.image}
                              alt="Lead Crop"
                              className="w-full h-full object-cover"
                              style={{
                                objectPosition: `50% ${newsForm.cropCoordinates.y}%`
                              }}
                            />
                            {/* Overlay frame */}
                            <div className="absolute inset-0 border-2 border-dashed border-[#E31E24] pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LIVE PREVIEW: Home Page Lead Position */}
                    <div className="border-t-2 border-[#111111] pt-6 space-y-3">
                      <span className="text-[12px] font-extrabold uppercase text-[#E31E24] block">
                        Live Preview: Home Page Lead Story Position
                      </span>
                      <div className="bg-[#FAF8F5] border-2 border-[#111111] p-6 max-w-xl space-y-3">
                        <div className="h-1.5 w-16 bg-[#E31E24]" />
                        <span className="text-[12px] font-extrabold uppercase text-[#C41A1F]">
                          [{newsForm.category}] • {newsForm.publishDate}
                        </span>
                        <h4 className="font-helvetica font-extrabold text-[22px] text-[#111111] leading-tight">
                          {newsForm.titleEn || 'Headline Preview in English'}
                        </h4>
                        <p className="text-[14px] text-[#333333] line-clamp-2">
                          {newsForm.summaryEn || 'Article summary and deck line preview...'}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t-2 border-[#111111] flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setNewsEditMode('list')}
                        className="px-5 py-2 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white font-extrabold text-[14px] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingNews}
                        className="px-6 py-2 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[14px] transition-colors duration-150 cursor-pointer"
                      >
                        {isSavingNews ? 'Saving...' : 'Save & Dispatch Article'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 05: 74 District Registry */}
          {/* ================================================================= */}
          {activeDomain === '05' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                  74 Organisational District Registry
                </h1>
                <span className="text-[13px] text-[#5B5348]">
                  Districts: <strong>{filteredDistricts.length} / 74</strong>
                </span>
              </div>

              {/* Search */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter districts by name, organiser, phone..."
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="h-[38px] px-3 bg-white border-2 border-[#111111] text-[14px] w-80 outline-none"
                />
              </div>

              {/* Table at 15px with 44px rows */}
              <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                <table className="w-full text-left text-[15px] border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                      <th className="px-3 py-2 w-12">No.</th>
                      <th className="px-3 py-2">District Name</th>
                      <th className="px-3 py-2">Organiser</th>
                      <th className="px-3 py-2">Contact Phone</th>
                      <th className="px-3 py-2">Court Complex</th>
                      <th className="px-3 py-2">Phone Public</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDistricts.map((d, idx) => {
                      const isPhonePublic = d.showPhonePublicly !== false;
                      return (
                        <tr
                          key={d.id}
                          className="h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150"
                        >
                          <td className="px-3 py-2 font-mono text-[13px]">{d.number || idx + 1}</td>
                          <td className="px-3 py-2 font-helvetica font-extrabold text-[#111111]">
                            {d.name.en}
                          </td>
                          <td className="px-3 py-2">{d.organizer.en}</td>
                          <td className="px-3 py-2">{d.contactPhone}</td>
                          <td className="px-3 py-2 truncate max-w-xs">{d.courtComplex.en}</td>
                          <td className="px-3 py-2">
                            <span className="border border-[#111111] px-2 py-0.5 text-[11px] font-bold uppercase rounded-none inline-block">
                              {isPhonePublic ? 'YES' : 'NO'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDistrict(d);
                                setDistrictForm({
                                  organizerEn: d.organizer.en,
                                  organizerTa: d.organizer.ta,
                                  contactPhone: d.contactPhone,
                                  courtComplexEn: d.courtComplex.en,
                                  courtComplexTa: d.courtComplex.ta,
                                  showPhonePublicly: d.showPhonePublicly !== false
                                });
                              }}
                              className="text-[#111111] underline hover:no-underline hover:text-[#E31E24] font-bold cursor-pointer"
                            >
                              Edit Unit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Edit District Modal */}
              {selectedDistrict && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-[#FAF8F5] border-2 border-[#111111] max-w-lg w-full p-6 space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
                      <h3 className="font-helvetica font-extrabold text-[18px]">
                        Edit District: {selectedDistrict.name.en}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSelectedDistrict(null)}
                        className="px-2 py-1 text-sm font-bold border border-[#111111] bg-white cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[13px] font-extrabold mb-1">Organiser (EN)</label>
                        <input
                          type="text"
                          value={districtForm.organizerEn}
                          onChange={(e) => setDistrictForm({ ...districtForm, organizerEn: e.target.value })}
                          className="w-full h-[36px] px-3 bg-white border border-[#111111]"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-extrabold mb-1">Organiser (TA)</label>
                        <input
                          type="text"
                          value={districtForm.organizerTa}
                          onChange={(e) => setDistrictForm({ ...districtForm, organizerTa: e.target.value })}
                          className="w-full h-[36px] px-3 bg-white border border-[#111111] font-kavivanar"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-extrabold mb-1">Contact Phone(s)</label>
                        <input
                          type="text"
                          value={districtForm.contactPhone}
                          onChange={(e) => setDistrictForm({ ...districtForm, contactPhone: e.target.value })}
                          className="w-full h-[36px] px-3 bg-white border border-[#111111]"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-extrabold mb-1">Court Complex Address</label>
                        <input
                          type="text"
                          value={districtForm.courtComplexEn}
                          onChange={(e) => setDistrictForm({ ...districtForm, courtComplexEn: e.target.value })}
                          className="w-full h-[36px] px-3 bg-white border border-[#111111]"
                        />
                      </div>

                      {/* "Show phone publicly" Checkbox */}
                      <label className="flex items-center gap-2 pt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={districtForm.showPhonePublicly}
                          onChange={(e) =>
                            setDistrictForm({ ...districtForm, showPhonePublicly: e.target.checked })
                          }
                          className="w-4 h-4 rounded-none accent-[#E31E24]"
                        />
                        <span className="text-[14px] font-extrabold text-[#111111]">
                          Show phone publicly (showPhonePublicly)
                        </span>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-[#d7d0c3] flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedDistrict(null)}
                        className="px-4 py-2 border border-[#111111] bg-white text-[13px] font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSavingDistrict}
                        onClick={async () => {
                          setIsSavingDistrict(true);
                          try {
                            const res = await fetch('/api/districts', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                id: selectedDistrict.id,
                                organizer: {
                                  en: districtForm.organizerEn.trim(),
                                  ta: districtForm.organizerTa.trim() || districtForm.organizerEn.trim()
                                },
                                contactPhone: districtForm.contactPhone.trim(),
                                courtComplex: {
                                  en: districtForm.courtComplexEn.trim(),
                                  ta: districtForm.courtComplexTa.trim() || districtForm.courtComplexEn.trim()
                                },
                                showPhonePublicly: districtForm.showPhonePublicly
                              })
                            });
                            if (res.ok) {
                              setSelectedDistrict(null);
                              fetchAllData();
                            }
                          } catch (err) {
                            console.error(err);
                          }
                          setIsSavingDistrict(false);
                        }}
                        className="px-5 py-2 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[13px]"
                      >
                        {isSavingDistrict ? 'Saving...' : 'Save Unit Record'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 06: Legal Dossiers and Vault */}
          {/* ================================================================= */}
          {activeDomain === '06' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                  Legal Dossiers & Vault
                </h1>
                <span className="text-[13px] text-[#5B5348]">
                  Total Records: <strong>{resources.length}</strong>
                </span>
              </div>

              <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                <table className="w-full text-left text-[15px] border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                      <th className="px-3 py-2">Document Title</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Court / Authority</th>
                      <th className="px-3 py-2">File Size</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((item) => (
                      <tr
                        key={item.id}
                        className="h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150"
                      >
                        <td className="px-3 py-2 font-helvetica font-extrabold text-[#111111]">
                          {item.title.en}
                        </td>
                        <td className="px-3 py-2">{item.category}</td>
                        <td className="px-3 py-2">{item.court || 'Constitutional Bench'}</td>
                        <td className="px-3 py-2">{item.fileSize}</td>
                        <td className="px-3 py-2">{item.date}</td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                type: 'resource',
                                id: item.id,
                                recordName: item.title.en,
                                rawItem: item
                              })
                            }
                            className="text-[#C41A1F] underline hover:no-underline font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 07: Press Photojournalism */}
          {/* ================================================================= */}
          {activeDomain === '07' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                  Press Photojournalism Wire
                </h1>
                <span className="text-[13px] text-[#5B5348]">
                  Total Photos: <strong>{gallery.length}</strong>
                </span>
              </div>

              <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                <table className="w-full text-left text-[15px] border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                      <th className="px-3 py-2">Image</th>
                      <th className="px-3 py-2">Caption</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gallery.map((item) => (
                      <tr
                        key={item.id}
                        className="h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150"
                      >
                        <td className="px-3 py-2">
                          <img
                            src={item.image}
                            alt=""
                            className="w-8 h-8 object-cover border border-[#111111]"
                          />
                        </td>
                        <td className="px-3 py-2 font-helvetica font-extrabold text-[#111111] max-w-sm truncate">
                          {item.caption.en}
                        </td>
                        <td className="px-3 py-2">{item.category}</td>
                        <td className="px-3 py-2">{item.date}</td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                type: 'gallery',
                                id: item.id,
                                recordName: item.caption.en,
                                rawItem: item
                              })
                            }
                            className="text-[#C41A1F] underline hover:no-underline font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 08: State Conferences */}
          {/* ================================================================= */}
          {activeDomain === '08' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                  State Conferences & Events
                </h1>
                <span className="text-[13px] text-[#5B5348]">
                  Total Events: <strong>{events.length}</strong>
                </span>
              </div>

              <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                <table className="w-full text-left text-[15px] border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                      <th className="px-3 py-2">Event Title</th>
                      <th className="px-3 py-2">Date & Time</th>
                      <th className="px-3 py-2">Venue</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((item) => (
                      <tr
                        key={item.id}
                        className="h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150"
                      >
                        <td className="px-3 py-2 font-helvetica font-extrabold text-[#111111] max-w-sm truncate">
                          {item.title.en}
                        </td>
                        <td className="px-3 py-2 font-mono text-[13px]">
                          {item.date} {item.time}
                        </td>
                        <td className="px-3 py-2 max-w-xs truncate">{item.venue.en}</td>
                        <td className="px-3 py-2">
                          <span className="border border-[#111111] px-2 py-0.5 text-[11px] font-bold uppercase rounded-none inline-block">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                type: 'event',
                                id: item.id,
                                recordName: item.title.en,
                                rawItem: item
                              })
                            }
                            className="text-[#C41A1F] underline hover:no-underline font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* DOMAIN 09: Activity Log (Newest First) */}
          {/* ================================================================= */}
          {activeDomain === '09' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-helvetica font-extrabold text-[22px] text-[#111111]">
                  System Activity Log
                </h1>
                <span className="text-[13px] text-[#5B5348]">
                  Total Events: <strong>{sortedAuditLogs.length}</strong>
                </span>
              </div>

              <div className="border-2 border-[#111111] bg-white overflow-x-auto">
                <table className="w-full text-left text-[15px] border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-[#111111] text-[#FAF8F5] font-extrabold text-[14px] h-[44px]">
                      <th className="px-3 py-2 w-48">Timestamp (When)</th>
                      <th className="px-3 py-2">User (Who)</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Action Executed (What)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAuditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-[#5B5348]">
                          No activity log events registered yet.
                        </td>
                      </tr>
                    ) : (
                      sortedAuditLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="h-[44px] min-h-[44px] border-b border-[#d7d0c3] hover:bg-[#f1ece2] transition-colors duration-150 text-[14px]"
                        >
                          <td className="px-3 py-2 font-mono text-[13px] whitespace-nowrap text-[#5B5348]">
                            {log.when}
                          </td>
                          <td className="px-3 py-2 font-bold text-[#111111]">{log.who}</td>
                          <td className="px-3 py-2 uppercase text-[12px] font-bold">
                            {log.role}
                          </td>
                          <td className="px-3 py-2 font-catamaran text-[#111111]">{log.what}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SIDE PANEL: Advocate Application Full Record & Review */}
      {/* ------------------------------------------------------------------- */}
      {selectedApp && (
        <aside
          aria-label="Advocate dossier review"
          className="w-[440px] bg-white border-l-2 border-[#111111] fixed right-0 top-0 bottom-0 z-40 p-6 overflow-y-auto space-y-6 shadow-none"
        >
          <div className="flex items-start justify-between border-b-2 border-[#111111] pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-[#C41A1F] block">
                Advocate Application
              </span>
              <h2 className="font-helvetica font-extrabold text-[20px] text-[#111111]">
                {selectedApp.fullName}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedApp(null)}
              className="p-1.5 border border-[#111111] text-xs font-bold hover:bg-[#111111] hover:text-white cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-3 text-[14px]">
            <div className="p-3 bg-[#FAF8F5] border border-[#d7d0c3]">
              <span className="text-xs text-[#5B5348] block">Bar Council Enrolment</span>
              <strong className="font-mono text-[15px]">{selectedApp.barCouncilNumber}</strong>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#d7d0c3]">
              <span className="text-xs text-[#5B5348] block">District & Practice</span>
              <strong>{selectedApp.district}</strong> — {selectedApp.courtOfPractice}
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#d7d0c3]">
              <span className="text-xs text-[#5B5348] block">Contact</span>
              <div>Phone: {selectedApp.mobileNumber}</div>
              <div>Email: {selectedApp.emailAddress}</div>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#d7d0c3]">
              <span className="text-xs text-[#5B5348] block">Specialisation</span>
              <span>{selectedApp.areasOfSpecialization?.join(', ')}</span>
            </div>
          </div>

          {/* Notes field */}
          <div className="space-y-1">
            <label className="block text-[13px] font-extrabold text-[#111111]">
              Internal Review Notes
            </label>
            <textarea
              rows={3}
              value={appNotes}
              onChange={(e) => setAppNotes(e.target.value)}
              placeholder="Record verification notes, Bar Council checks..."
              className="w-full p-2 bg-[#FAF8F5] border border-[#111111] text-[13px] outline-none"
            />
          </div>

          {/* Action buttons: Verify, Approve, Reject */}
          <div className="pt-2 border-t border-[#d7d0c3] space-y-2">
            <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
              Status Actions
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isUpdatingApp}
                onClick={() => handleUpdateAppStatus('verified')}
                className="py-2 px-1 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[13px] font-extrabold cursor-pointer transition-colors duration-150"
              >
                Verify
              </button>
              <button
                type="button"
                disabled={isUpdatingApp}
                onClick={() => handleUpdateAppStatus('approved')}
                className="py-2 px-1 bg-[#111111] hover:bg-black text-white text-[13px] font-extrabold cursor-pointer transition-colors duration-150"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={isUpdatingApp}
                onClick={() => handleUpdateAppStatus('rejected')}
                className="py-2 px-1 bg-[#E31E24] hover:bg-[#C41A1F] text-white text-[13px] font-extrabold cursor-pointer transition-colors duration-150"
              >
                Reject
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SIDE PANEL: Citizen Legal Grievance Full Record & Actions */}
      {/* ------------------------------------------------------------------- */}
      {selectedGrievance && (
        <aside
          aria-label="Citizen grievance review"
          className="w-[440px] bg-white border-l-2 border-[#111111] fixed right-0 top-0 bottom-0 z-40 p-6 overflow-y-auto space-y-6 shadow-none"
        >
          <div className="flex items-start justify-between border-b-2 border-[#111111] pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-[#C41A1F] block">
                Citizen Legal Grievance
              </span>
              <h2 className="font-helvetica font-extrabold text-[20px] text-[#111111]">
                {selectedGrievance.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedGrievance(null)}
              className="p-1.5 border border-[#111111] text-xs font-bold hover:bg-[#111111] hover:text-white cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-3 text-[14px]">
            <div className="p-3 bg-[#FAF8F5] border border-[#d7d0c3]">
              <span className="text-xs text-[#5B5348] block">Category & District</span>
              <strong>{selectedGrievance.category}</strong> — {selectedGrievance.district}
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#d7d0c3]">
              <span className="text-xs text-[#5B5348] block">Phone / Contact</span>
              <strong>{selectedGrievance.phone}</strong> {selectedGrievance.email && `• ${selectedGrievance.email}`}
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#d7d0c3] space-y-1">
              <span className="text-xs text-[#5B5348] block">Subject & Narrative</span>
              <strong className="block text-[14px]">{selectedGrievance.subject}</strong>
              <p className="text-[13px] text-[#333333] leading-relaxed whitespace-pre-wrap">
                {selectedGrievance.message}
              </p>
            </div>
          </div>

          {/* Notes field */}
          <div className="space-y-1">
            <label className="block text-[13px] font-extrabold text-[#111111]">
              Legal Desk Case Notes
            </label>
            <textarea
              rows={3}
              value={grievanceNotes}
              onChange={(e) => setGrievanceNotes(e.target.value)}
              placeholder="Record advocate assignment, police station liaison..."
              className="w-full p-2 bg-[#FAF8F5] border border-[#111111] text-[13px] outline-none"
            />
          </div>

          {/* Action buttons: Pending, Under review, Resolved */}
          <div className="pt-2 border-t border-[#d7d0c3] space-y-2">
            <span className="text-[12px] font-extrabold uppercase text-[#5B5348] block">
              Grievance Status
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isUpdatingGrievance}
                onClick={() => handleUpdateGrievanceStatus('new')}
                className="py-2 px-1 border-2 border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[13px] font-extrabold cursor-pointer transition-colors duration-150"
              >
                Pending
              </button>
              <button
                type="button"
                disabled={isUpdatingGrievance}
                onClick={() => handleUpdateGrievanceStatus('reviewed')}
                className="py-2 px-1 bg-[#E31E24] hover:bg-[#C41A1F] text-white text-[13px] font-extrabold cursor-pointer transition-colors duration-150"
              >
                Under review
              </button>
              <button
                type="button"
                disabled={isUpdatingGrievance}
                onClick={() => handleUpdateGrievanceStatus('resolved')}
                className="py-2 px-1 bg-[#111111] hover:bg-black text-white text-[13px] font-extrabold cursor-pointer transition-colors duration-150"
              >
                Resolved
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SQUARE DELETE CONFIRMATION DIALOG */}
      {/* ------------------------------------------------------------------- */}
      {deleteDialog?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border-4 border-[#111111] max-w-md w-full p-6 space-y-5 rounded-none shadow-none">
            <div className="border-b-2 border-[#111111] pb-2">
              <span className="text-[11px] font-extrabold uppercase text-[#C41A1F] block">
                Irreversible Action Warning
              </span>
              <h3 className="font-helvetica font-extrabold text-[20px] text-[#111111]">
                Confirm Record Deletion
              </h3>
            </div>

            <p className="text-[15px] text-[#111111] leading-relaxed">
              Are you sure you want to permanently delete the {deleteDialog.type} record:
              <br />
              <strong className="font-helvetica font-extrabold text-[16px] text-[#C41A1F] block mt-1">
                &ldquo;{deleteDialog.recordName}&rdquo;
              </strong>
            </p>

            <div className="pt-2 border-t border-[#d7d0c3] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="px-4 py-2 border-2 border-[#111111] bg-white text-[#111111] font-extrabold text-[13px] hover:bg-[#111111] hover:text-white cursor-pointer transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-5 py-2 bg-[#E31E24] hover:bg-[#C41A1F] text-white font-extrabold text-[13px] cursor-pointer transition-colors duration-150"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
