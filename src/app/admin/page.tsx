'use client';

import { PageTitleBand } from '@/components/PageTitleBand';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
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
import { 
  Shield, 
  Lock, 
  Trash2, 
  Plus, 
  Calendar, 
  LogOut,
  Star,
  Camera,
  ExternalLink,
  Eye,
  CheckCircle,
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
  X,
  FileText,
  Activity,
  Layers,
  Crop,
  Sliders,
  Check,
  Printer
} from 'lucide-react';

export type AdminRole = 'super_admin' | 'editorial' | 'legal_desk';

export default function AdminConsolePage() {
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
    updateEvent,
    deleteEvent, 
    resources, 
    addResource, 
    updateResource,
    deleteResource, 
    registrations, 
    updateRegistrationStatus, 
    enquiries, 
    updateEnquiryStatus,
    districts,
    updateDistrictPhonePrivacy,
    updateDistrictDetails,
    refreshAllData,
    isLoadingData
  } = useData();

  // ---------------------------------------------------------------------------
  // AUTHENTICATION & ROLE STATE (Server-Enforced)
  // ---------------------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticatedRole, setAuthenticatedRole] = useState<AdminRole>('super_admin');
  const [authenticatedUser, setAuthenticatedUser] = useState<string>('admin');
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Client-side view filter: ONLY changes what tabs/buttons are shown in UI
  const [viewRole, setViewRole] = useState<'all' | AdminRole>('all');

  // Login form state
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<AdminRole>('super_admin');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Global action status toast / error banner
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'news' | 'registrations' | 'enquiries' | 'districts' | 'gallery' | 'events' | 'resources' | 'audit'
  >('overview');

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Search & Filter states
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('all');
  const [newsStatusFilter, setNewsStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');

  const [regStatusFilter, setRegStatusFilter] = useState<'all' | 'pending' | 'verified' | 'approved' | 'rejected'>('all');
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [selectedRegDossier, setSelectedRegDossier] = useState<AdvocateRegistration | null>(null);

  const [enqCategoryFilter, setEnqCategoryFilter] = useState('all');
  const [enqStatusFilter, setEnqStatusFilter] = useState('all');
  const [enqSearchQuery, setEnqSearchQuery] = useState('');

  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [districtZoneFilter, setDistrictZoneFilter] = useState('All');
  const [editingDistrict, setEditingDistrict] = useState<DistrictInfo | null>(null);
  const [editPhonePublicly, setEditPhonePublicly] = useState<boolean>(true);
  const [editOrganizerEn, setEditOrganizerEn] = useState('');
  const [editOrganizerTa, setEditOrganizerTa] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCourtEn, setEditCourtEn] = useState('');
  const [editCourtTa, setEditCourtTa] = useState('');
  const [editHeadquartersEn, setEditHeadquartersEn] = useState('');
  const [editHeadquartersTa, setEditHeadquartersTa] = useState('');
  const [editMemberCount, setEditMemberCount] = useState<number>(150);
  const [editActiveCases, setEditActiveCases] = useState<number>(35);

  // ---------------------------------------------------------------------------
  // NEWS EDITOR MODAL STATE (Side-by-side, Draft/Scheduled/Published, Crop, Preview)
  // ---------------------------------------------------------------------------
  const [showNewsEditor, setShowNewsEditor] = useState(false);
  const [newsEditMode, setNewsEditMode] = useState<'create' | 'edit'>('create');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  // Editor Fields
  const [editorStatus, setEditorStatus] = useState<'Draft' | 'Scheduled' | 'Published'>('Published');
  const [editorPublishDate, setEditorPublishDate] = useState('2026-11-22');
  const [editorPublishTime, setEditorPublishTime] = useState('09:00');
  const [editorCategory, setEditorCategory] = useState<NewsItem['category']>('Press Release');
  const [editorIsLead, setEditorIsLead] = useState(false);
  const [editorImage, setEditorImage] = useState('/images/dmk-slider-official.jpg');
  const [editorCourt, setEditorCourt] = useState('');
  const [editorCaseNo, setEditorCaseNo] = useState('');

  // Side-by-side Bilingual Text Fields
  const [editorTitleEn, setEditorTitleEn] = useState('');
  const [editorTitleTa, setEditorTitleTa] = useState('');
  const [editorSummaryEn, setEditorSummaryEn] = useState('');
  const [editorSummaryTa, setEditorSummaryTa] = useState('');
  const [editorContentEn, setEditorContentEn] = useState('');
  const [editorContentTa, setEditorContentTa] = useState('');

  // Image Crop Settings
  const [editorCropPosition, setEditorCropPosition] = useState<'center' | 'top' | 'bottom' | 'custom'>('center');
  const [editorCropZoom, setEditorCropZoom] = useState<number>(1.0);
  const [activePreviewTab, setActivePreviewTab] = useState<'en' | 'ta'>('en');

  // Other Modals
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalTitleEn, setNewGalTitleEn] = useState('');
  const [newGalTitleTa, setNewGalTitleTa] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<PressGalleryItem['category']>('Press Conferences');
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
  const [newEventChiefGuestEn, setNewEventChiefGuestEn] = useState('');
  const [newEventChiefGuestTa, setNewEventChiefGuestTa] = useState('');
  const [newEventAttendees, setNewEventAttendees] = useState<number>(500);
  const [newEventReportPdf, setNewEventReportPdf] = useState('');

  // Event Editing
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editEventTitleEn, setEditEventTitleEn] = useState('');
  const [editEventTitleTa, setEditEventTitleTa] = useState('');
  const [editEventCategory, setEditEventCategory] = useState<EventItem['category']>('Conference');
  const [editEventDate, setEditEventDate] = useState('');
  const [editEventVenueEn, setEditEventVenueEn] = useState('');
  const [editEventVenueTa, setEditEventVenueTa] = useState('');
  const [editEventDescEn, setEditEventDescEn] = useState('');
  const [editEventDescTa, setEditEventDescTa] = useState('');
  const [editEventChiefGuestEn, setEditEventChiefGuestEn] = useState('');
  const [editEventChiefGuestTa, setEditEventChiefGuestTa] = useState('');
  const [editEventAttendees, setEditEventAttendees] = useState<number>(500);
  const [editEventReportPdf, setEditEventReportPdf] = useState('');

  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResTitleEn, setNewResTitleEn] = useState('');
  const [newResTitleTa, setNewResTitleTa] = useState('');
  const [newResCategory, setNewResCategory] = useState<LegalResource['category']>('Supreme Court');
  const [newResCitation, setNewResCitation] = useState('');
  const [newResCourt, setNewResCourt] = useState('');
  const [newResFileSize, setNewResFileSize] = useState('2.4 MB');
  const [newResDownloadUrl, setNewResDownloadUrl] = useState('/resources/sample.pdf');
  const [newResSummaryEn, setNewResSummaryEn] = useState('');
  const [newResSummaryTa, setNewResSummaryTa] = useState('');

  // Resource Editing
  const [editingResource, setEditingResource] = useState<LegalResource | null>(null);
  const [editResTitleEn, setEditResTitleEn] = useState('');
  const [editResTitleTa, setEditResTitleTa] = useState('');
  const [editResCategory, setEditResCategory] = useState<LegalResource['category']>('Supreme Court');
  const [editResCitation, setEditResCitation] = useState('');
  const [editResCourt, setEditResCourt] = useState('');
  const [editResFileSize, setEditResFileSize] = useState('2.4 MB');
  const [editResDownloadUrl, setEditResDownloadUrl] = useState('');
  const [editResSummaryEn, setEditResSummaryEn] = useState('');
  const [editResSummaryTa, setEditResSummaryTa] = useState('');

  // Digital Advocate Membership Credential Certificate
  const [credentialRegistration, setCredentialRegistration] = useState<AdvocateRegistration | null>(null);

  // ---------------------------------------------------------------------------
  // AUTHENTICATION CHECK ON MOUNT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            setAuthenticatedRole(data.role || 'super_admin');
            setAuthenticatedUser(data.user || 'admin');
          }
        }
      } catch (err) {
        console.warn('Session check fallback:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkAuthSession();
  }, []);

  // Fetch Audit Logs when Audit tab is activated
  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch('/api/audit');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setAuditLogs(data.logs);
        }
      }
    } catch (err) {
      console.error('Failed to fetch audit log:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit' && isAuthenticated) {
      fetchAuditLogs();
    }
  }, [activeTab, isAuthenticated]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 5000);
  };

  // CSV Export Helper Function
  const exportCsv = (filename: string, headers: string[], rows: (string | number | undefined | null)[][]) => {
    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', `Exported ${filename}.csv`);
  };

  // ---------------------------------------------------------------------------
  // LOGIN / LOGOUT HANDLERS
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: loginPassword,
          role: loginRole,
          username: `${loginRole}-operator`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthenticatedRole(data.role);
        setAuthenticatedUser(data.user);
        setViewRole(data.role);
        setLoginPassword('');
        refreshAllData();
      } else {
        setLoginError(data.error || 'Authentication rejected. Verify security passcode.');
      }
    } catch {
      setLoginError('Authentication server unreachable. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setIsAuthenticated(false);
    setAuthenticatedRole('super_admin');
    setViewRole('all');
    showToast('success', 'Logged out of administrative session.');
  };

  // ---------------------------------------------------------------------------
  // NEWS EDITOR ACTIONS
  // ---------------------------------------------------------------------------
  const openCreateNewsModal = () => {
    setNewsEditMode('create');
    setEditingNewsId(null);
    setEditorTitleEn('');
    setEditorTitleTa('');
    setEditorCategory('Press Release');
    setEditorSummaryEn('');
    setEditorSummaryTa('');
    setEditorContentEn('');
    setEditorContentTa('');
    setEditorCourt('');
    setEditorCaseNo('');
    setEditorIsLead(false);
    setEditorStatus('Published');
    setEditorPublishDate(new Date().toISOString().split('T')[0]);
    setEditorPublishTime('10:00');
    setEditorImage('/images/dmk-slider-official.jpg');
    setEditorCropPosition('center');
    setEditorCropZoom(1.0);
    setShowNewsEditor(true);
  };

  const openEditNewsModal = (item: NewsItem) => {
    setNewsEditMode('edit');
    setEditingNewsId(item.id);
    setEditorTitleEn(item.title.en);
    setEditorTitleTa(item.title.ta || item.title.en);
    setEditorCategory(item.category);
    setEditorSummaryEn(item.summary.en);
    setEditorSummaryTa(item.summary.ta || item.summary.en);
    setEditorContentEn(item.content.en);
    setEditorContentTa(item.content.ta || item.content.en);
    setEditorCourt(item.court || '');
    setEditorCaseNo(item.caseNumber || '');
    setEditorIsLead(Boolean(item.isLeadStory));
    setEditorStatus(item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() as any) : 'Published');
    setEditorPublishDate(item.publishDate || item.date || new Date().toISOString().split('T')[0]);
    setEditorPublishTime(item.publishTime || item.time || '10:00');
    setEditorImage(item.image || '/images/dmk-slider-official.jpg');
    setEditorCropPosition(item.imageCrop?.position || 'center');
    setEditorCropZoom(item.imageCrop?.zoom || 1.0);
    setShowNewsEditor(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitleEn.trim()) {
      showToast('error', 'English headline is required.');
      return;
    }

    const payload = {
      title: { en: editorTitleEn.trim(), ta: editorTitleTa.trim() || editorTitleEn.trim() },
      category: editorCategory,
      summary: { en: editorSummaryEn.trim(), ta: editorSummaryTa.trim() || editorSummaryEn.trim() },
      content: { en: editorContentEn.trim(), ta: editorContentTa.trim() || editorSummaryTa.trim() || editorContentEn.trim() },
      court: editorCourt.trim(),
      caseNumber: editorCaseNo.trim(),
      image: editorImage.trim() || '/images/dmk-slider-official.jpg',
      isLeadStory: editorIsLead,
      status: editorStatus,
      publishDate: editorPublishDate,
      publishTime: editorPublishTime,
      date: editorPublishDate,
      time: editorPublishTime,
      readTime: '3 min read',
      author: { en: 'DMK Legal Wing Secretariat', ta: 'திமுக வழக்கறிஞர் அணித் தலைமை' },
      issuingAuthority: { en: 'Apex Constitutional Panel, Anna Arivalayam', ta: 'அரசமைப்புச் சட்டப் பிரிவு, அண்ணா அறிவாலயம்' },
      imageCrop: {
        position: editorCropPosition,
        zoom: editorCropZoom
      }
    };

    try {
      if (newsEditMode === 'create') {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('success', `Created story: "${editorTitleEn.slice(0, 35)}..." (${editorStatus})`);
          setShowNewsEditor(false);
          refreshAllData();
        } else {
          showToast('error', data.error || 'Server rejected news creation. Check permissions.');
        }
      } else if (newsEditMode === 'edit' && editingNewsId) {
        const res = await fetch(`/api/news/${editingNewsId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('success', `Updated story: "${editorTitleEn.slice(0, 35)}..."`);
          setShowNewsEditor(false);
          refreshAllData();
        } else {
          showToast('error', data.error || 'Server rejected news update. Check permissions.');
        }
      }
    } catch {
      showToast('error', 'Network error communicating with API.');
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!confirm(`Confirm deletion of news story:\n"${title}"?`)) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Deleted news story: ${id}`);
        refreshAllData();
      } else {
        showToast('error', data.error || 'Server rejected deletion. Insufficient permissions.');
      }
    } catch {
      showToast('error', 'Network error contacting server.');
    }
  };

  const handleSetLeadStory = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setLeadStory' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Promoted ${id} to Lead Story`);
        refreshAllData();
      } else {
        showToast('error', data.error || 'Failed to promote lead story. Insufficient permissions.');
      }
    } catch {
      showToast('error', 'Network error contacting server.');
    }
  };

  // ---------------------------------------------------------------------------
  // REGISTRATIONS & ENQUIRIES ACTIONS (Legal Desk & Super Admin)
  // ---------------------------------------------------------------------------
  const handleUpdateRegStatus = async (id: string, newStatus: AdvocateRegistration['status']) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Registration ${id} set to '${newStatus}'`);
        refreshAllData();
        if (selectedRegDossier && selectedRegDossier.id === id) {
          setSelectedRegDossier({ ...selectedRegDossier, status: newStatus });
        }
      } else {
        showToast('error', data.error || `Server 403: Role '${authenticatedRole}' cannot modify registrations.`);
      }
    } catch {
      showToast('error', 'Network error contacting server.');
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm(`Confirm deletion of advocate registration ${id}?`)) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Deleted registration ${id}`);
        setSelectedRegDossier(null);
        refreshAllData();
      } else {
        showToast('error', data.error || `Server 403: Role '${authenticatedRole}' cannot delete registrations.`);
      }
    } catch {
      showToast('error', 'Network error contacting server.');
    }
  };

  const handleUpdateEnqStatus = async (id: string, newStatus: PublicEnquiry['status']) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Enquiry ${id} set to '${newStatus}'`);
        refreshAllData();
      } else {
        showToast('error', data.error || `Server 403: Role '${authenticatedRole}' cannot modify enquiries.`);
      }
    } catch {
      showToast('error', 'Network error contacting server.');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm(`Confirm deletion of grievance enquiry ${id}?`)) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Deleted enquiry ${id}`);
        refreshAllData();
      } else {
        showToast('error', data.error || `Server 403: Role '${authenticatedRole}' cannot delete enquiries.`);
      }
    } catch {
      showToast('error', 'Network error contacting server.');
    }
  };

  // ---------------------------------------------------------------------------
  // FULL DISTRICT CONTROLS ACTION (Super Admin only)
  // ---------------------------------------------------------------------------
  const handleSaveDistrict = async () => {
    if (!editingDistrict) return;
    try {
      const res = await fetch('/api/districts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDistrict.id,
          organizer: { en: editOrganizerEn.trim(), ta: editOrganizerTa.trim() || editOrganizerEn.trim() },
          contactPhone: editPhone.trim(),
          contactEmail: editEmail.trim(),
          headquarters: { en: editHeadquartersEn.trim() || editingDistrict.headquarters.en, ta: editHeadquartersTa.trim() || editingDistrict.headquarters.ta },
          courtComplex: { en: editCourtEn.trim() || editingDistrict.courtComplex.en, ta: editCourtTa.trim() || editingDistrict.courtComplex.ta },
          memberCount: Number(editMemberCount) || editingDistrict.memberCount,
          activeCasesAssisted: Number(editActiveCases) || editingDistrict.activeCasesAssisted,
          showPhonePublicly: editPhonePublicly
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Updated district record for ${editingDistrict.name.en}`);
        setEditingDistrict(null);
        refreshAllData();
      } else {
        showToast('error', data.error || `Server 403: Role '${authenticatedRole}' cannot modify districts.`);
      }
    } catch {
      showToast('error', 'Network error contacting server.');
    }
  };

  // ---------------------------------------------------------------------------
  // GALLERY, EVENTS, RESOURCES MUTATIONS
  // ---------------------------------------------------------------------------
  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitleEn.trim()) return;
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { en: newGalTitleEn, ta: newGalTitleTa || newGalTitleEn },
          category: newGalCategory,
          date: new Date().toISOString().split('T')[0],
          location: { en: newGalLocationEn || 'Chennai', ta: newGalLocationTa || 'சென்னை' },
          caption: { en: newGalCaptionEn, ta: newGalCaptionTa || newGalCaptionEn },
          imageUrl: newGalImage || '/images/dmk-press-meet.jpg'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Created gallery record');
        setShowAddGalleryModal(false);
        refreshAllData();
      } else {
        showToast('error', data.error || 'Server rejected gallery creation.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Confirm deletion of gallery photo?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Deleted gallery photo');
        refreshAllData();
      } else {
        showToast('error', data.error || 'Server rejected gallery deletion.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitleEn.trim()) return;
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { en: newEventTitleEn, ta: newEventTitleTa || newEventTitleEn },
          category: newEventCategory,
          date: newEventDate,
          venue: { en: newEventVenueEn || 'High Court Campus', ta: newEventVenueTa || 'உயர் நீதிமன்ற வளாகம்' },
          description: { en: newEventDescEn, ta: newEventDescTa || newEventDescEn },
          chiefGuest: newEventChiefGuestEn ? { en: newEventChiefGuestEn, ta: newEventChiefGuestTa || newEventChiefGuestEn } : undefined,
          attendeesCount: Number(newEventAttendees) || undefined,
          reportPdfUrl: newEventReportPdf.trim() || undefined,
          image: '/images/dmk-legal-conference.jpg',
          status: 'upcoming'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Created event record');
        setShowAddEventModal(false);
        refreshAllData();
      } else {
        showToast('error', data.error || 'Server rejected event creation.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleSaveEventEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { en: editEventTitleEn, ta: editEventTitleTa || editEventTitleEn },
          category: editEventCategory,
          date: editEventDate,
          venue: { en: editEventVenueEn, ta: editEventVenueTa || editEventVenueEn },
          description: { en: editEventDescEn, ta: editEventDescTa || editEventDescEn },
          chiefGuest: editEventChiefGuestEn ? { en: editEventChiefGuestEn, ta: editEventChiefGuestTa || editEventChiefGuestEn } : undefined,
          attendeesCount: Number(editEventAttendees) || undefined,
          reportPdfUrl: editEventReportPdf.trim() || undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Updated event: ${editEventTitleEn}`);
        setEditingEvent(null);
        refreshAllData();
      } else {
        showToast('error', data.error || 'Failed to update event.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Confirm deletion of event record?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Deleted event record');
        refreshAllData();
      } else {
        showToast('error', data.error || 'Server rejected event deletion.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitleEn.trim()) return;
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { en: newResTitleEn, ta: newResTitleTa || newResTitleEn },
          category: newResCategory,
          citation: newResCitation,
          court: newResCourt || 'Supreme Court of India',
          fileSize: newResFileSize || '2.4 MB',
          downloadUrl: newResDownloadUrl || '/resources/sample.pdf',
          summary: { en: newResSummaryEn, ta: newResSummaryTa || newResSummaryEn },
          keyHighlights: { en: ['Statutory provision analysis'], ta: ['சட்டப்பிரிவு ஆய்வு'] },
          date: new Date().toISOString().split('T')[0],
          isOfficial: true
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Created legal resource');
        setShowAddResourceModal(false);
        refreshAllData();
      } else {
        showToast('error', data.error || 'Server rejected resource creation.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleSaveResourceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    try {
      const res = await fetch(`/api/resources/${editingResource.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { en: editResTitleEn, ta: editResTitleTa || editResTitleEn },
          category: editResCategory,
          citation: editResCitation,
          court: editResCourt,
          fileSize: editResFileSize,
          downloadUrl: editResDownloadUrl,
          summary: { en: editResSummaryEn, ta: editResSummaryTa || editResSummaryEn }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Updated resource: ${editResTitleEn}`);
        setEditingResource(null);
        refreshAllData();
      } else {
        showToast('error', data.error || 'Failed to update resource.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Confirm deletion of legal resource dossier?')) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Deleted legal resource');
        refreshAllData();
      } else {
        showToast('error', data.error || 'Server rejected resource deletion.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  // ---------------------------------------------------------------------------
  // FILTERED DATA VIEWS
  // ---------------------------------------------------------------------------
  const filteredNews = news.filter((item) => {
    const matchesCat = newsCategoryFilter === 'all' || item.category === newsCategoryFilter;
    const matchesStatus = 
      newsStatusFilter === 'all' || 
      (item.status && item.status.toLowerCase() === newsStatusFilter.toLowerCase());
    const q = newsSearchQuery.toLowerCase();
    const matchesQ = 
      !q || 
      item.title.en.toLowerCase().includes(q) || 
      item.title.ta?.toLowerCase().includes(q) ||
      item.summary.en.toLowerCase().includes(q);
    return matchesCat && matchesStatus && matchesQ;
  });

  const filteredRegistrations = registrations.filter((r) => {
    const matchesStatus = regStatusFilter === 'all' || r.status === regStatusFilter;
    const q = regSearchQuery.toLowerCase();
    const matchesQ = 
      !q || 
      r.fullName.toLowerCase().includes(q) || 
      r.barCouncilNumber.toLowerCase().includes(q) || 
      r.district.toLowerCase().includes(q) ||
      r.mobileNumber.includes(q);
    return matchesStatus && matchesQ;
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesCat = enqCategoryFilter === 'all' || e.category === enqCategoryFilter;
    const matchesStatus = enqStatusFilter === 'all' || e.status === enqStatusFilter;
    const q = enqSearchQuery.toLowerCase();
    const matchesQ = 
      !q || 
      e.name.toLowerCase().includes(q) || 
      e.district.toLowerCase().includes(q) || 
      e.phone.includes(q) ||
      e.message.toLowerCase().includes(q);
    return matchesCat && matchesStatus && matchesQ;
  });

  const filteredDistricts = districts.filter((d) => {
    const matchesZone = districtZoneFilter === 'All' || d.zone === districtZoneFilter;
    const q = districtSearchQuery.toLowerCase();
    const matchesQ = 
      !q || 
      d.name.en.toLowerCase().includes(q) || 
      d.name.ta.toLowerCase().includes(q) || 
      d.organizer.en.toLowerCase().includes(q) ||
      d.contactPhone.includes(q);
    return matchesZone && matchesQ;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    const q = auditSearchQuery.toLowerCase();
    return (
      !q ||
      log.who.toLowerCase().includes(q) ||
      log.what.toLowerCase().includes(q) ||
      log.role.toLowerCase().includes(q)
    );
  });

  // ---------------------------------------------------------------------------
  // LOGIN SCREEN (PLAIN NEUTRAL WORK-TOOL)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated && !isCheckingAuth) {
    return (
      <div className="w-full bg-[#FAF8F5] pb-16">
        <PageTitleBand
          title={language === 'ta' ? 'நிர்வாக உள்நுழைவு' : 'Secretariat Admin Console'}
          description={
            language === 'ta'
              ? 'அங்கீகரிக்கப்பட்ட திமுக வழக்கறிஞர் அணி மேலாண்மை மற்றும் மனுக்கள் பரிசீலனை தளம்.'
              : 'Enter security passcode to authenticate your role session. Server strictly validates privileges on all mutations.'
          }
        />
      <div className="min-h-[60vh] flex items-center justify-center p-4 font-mono text-[#111111]">
        <div className="bg-white border-2 border-[#111111] max-w-md w-full p-8 rounded-[2px] shadow-sm space-y-6">
          
          <div className="border-b border-[#D8D3CB] pb-4">
            <span className="text-[11px] font-bold text-[#C41A1F] uppercase tracking-widest block mb-1">
              DMK LEGAL WING • STATE SECRETARIAT
            </span>
            <h1 className="text-xl font-black text-[#111111]">
              Administrative Work Console
            </h1>
            <p className="text-xs text-[#5B5348] mt-1 font-sans">
              Enter security passcode to authenticate your role session. Server strictly validates privileges on all mutations.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-[#FCE8E8] border border-[#C41A1F] text-[#C41A1F] text-xs font-sans font-bold flex items-center gap-2 rounded-[2px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5">
                Designated Role
              </label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as AdminRole)}
                className="w-full min-h-[44px] px-3 border border-[#D8D3CB] focus:border-[#111111] text-xs bg-[#FAF8F5] rounded-[2px] outline-none cursor-pointer"
              >
                <option value="super_admin">Super Admin (Apex Authority — Full Access)</option>
                <option value="editorial">Editorial Desk (News, Events, Gallery)</option>
                <option value="legal_desk">Legal Desk (Registrations & Enquiries)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5">
                Security Passcode
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter passcode (e.g. dmk1971)"
                className="w-full min-h-[44px] px-3 border border-[#D8D3CB] focus:border-[#111111] text-xs bg-[#FAF8F5] rounded-[2px] outline-none"
              />
              <span className="text-[11px] text-[#5B5348] font-sans block mt-1">
                Passcodes: <code className="font-mono text-[#111111]">dmk1971</code> (Master), <code className="font-mono text-[#111111]">editorial</code>, or <code className="font-mono text-[#111111]">legaldesk</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full min-h-[44px] bg-[#E31E24] hover:bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Console'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-[#5B5348] hover:text-[#111111] underline font-sans">
              &larr; Return to public portal
            </Link>
          </div>

        </div>
      </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN WORK-TOOL CONSOLE
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#111111] font-sans pb-16">
      <PageTitleBand
        title={language === 'ta' ? 'செயலக நிர்வாக தளம்' : 'Administration Work Console'}
        description={
          language === 'ta'
            ? 'அதிகாரப்பூர்வ திமுக வழக்கறிஞர் அணி மேலாண்மை, செய்திகள் மற்றும் மாவட்டங்கள் வழிகாட்டல்.'
            : 'Operational dashboard for dispatches, district units, legal resources, and advocate enrolment records.'
        }
      />
      
      {/* 1. COMPACT TOP UTILITY BAR */}
      <header className="bg-[#111111] text-white border-b border-neutral-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#E31E24] shrink-0" />
            <div className="font-mono">
              <span className="font-black text-white uppercase tracking-wider">DMK LEGAL WING</span>
              <span className="text-neutral-400 ml-2">Administration Console</span>
            </div>
            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-mono text-[10px] rounded-[2px] border border-neutral-700">
              v2.4
            </span>
          </div>

          {/* Authenticated Server Credentials & View Mode Filter */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Real Server Authenticated Role (Enforced) */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded-[2px]">
              <Lock className="w-3 h-3 text-[#E31E24]" />
              <span className="text-neutral-400">Server Role:</span>
              <span className="font-bold text-white uppercase">
                {authenticatedRole.replace('_', ' ')}
              </span>
            </div>

            {/* Role View Switcher: "The role switcher in the interface must only change what is shown; it must never grant permission." */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-neutral-400 mr-1 hidden sm:inline">View Mode:</span>
              {(['all', 'super_admin', 'editorial', 'legal_desk'] as const).map((r) => {
                const isSelected = viewRole === r;
                const label = 
                  r === 'all' ? 'All Modules' : 
                  r === 'super_admin' ? 'Super Admin' : 
                  r === 'editorial' ? 'Editorial' : 'Legal Desk';

                return (
                  <button
                    key={r}
                    onClick={() => setViewRole(r)}
                    className={`px-2 py-1 text-[11px] rounded-[2px] transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[#E31E24] text-white border-[#E31E24] font-bold'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                    }`}
                    title="Filter interface view (permissions strictly enforced by server)"
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-[2px] transition-colors cursor-pointer font-mono"
            >
              <LogOut className="w-3 h-3" />
              <span>Log out</span>
            </button>

          </div>

        </div>
      </header>

      {/* 2. NOTICE TOAST / SERVER FEEDBACK */}
      {actionNotice && (
        <div className={`px-4 sm:px-6 py-2.5 text-xs font-mono font-bold flex items-center justify-between border-b ${
          actionNotice.type === 'success'
            ? 'bg-green-50 border-green-300 text-green-900'
            : 'bg-[#FCE8E8] border-[#C41A1F] text-[#C41A1F]'
        }`}>
          <div className="max-w-[1500px] mx-auto w-full flex items-center justify-between">
            <span>{actionNotice.message}</span>
            <button onClick={() => setActionNotice(null)} className="p-1 hover:opacity-70 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. CONSOLE WORKSPACE */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white border-2 border-[#111111] p-1.5 rounded-[2px] flex items-center gap-1 overflow-x-auto scrollbar-thin shadow-xs">
          {[
            { id: 'overview', label: 'Overview', icon: Layers, allowed: ['all', 'super_admin', 'editorial', 'legal_desk'] },
            { id: 'news', label: `Newsroom (${news.length})`, icon: FileText, allowed: ['all', 'super_admin', 'editorial'] },
            { id: 'registrations', label: `Advocates (${registrations.length})`, icon: Scale, allowed: ['all', 'super_admin', 'legal_desk'] },
            { id: 'enquiries', label: `Citizen Grievances (${enquiries.length})`, icon: Mail, allowed: ['all', 'super_admin', 'legal_desk'] },
            { id: 'districts', label: `Districts (${districts.length})`, icon: Building2, allowed: ['all', 'super_admin'] },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: Camera, allowed: ['all', 'super_admin', 'editorial'] },
            { id: 'events', label: `Hearings (${events.length})`, icon: Calendar, allowed: ['all', 'super_admin', 'editorial'] },
            { id: 'resources', label: `Repository (${resources.length})`, icon: Database, allowed: ['all', 'super_admin'] },
            { id: 'audit', label: `Audit Log (${auditLogs.length})`, icon: Activity, allowed: ['all', 'super_admin', 'editorial', 'legal_desk'] }
          ].map((tab) => {
            // Apply view role filter
            if (viewRole !== 'all' && !tab.allowed.includes(viewRole)) {
              return null;
            }

            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[44px] px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 rounded-[2px] transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'text-[#5B5348] hover:text-[#111111] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E31E24]' : 'text-[#5B5348]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW METRICS & STATUS */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-[10px] uppercase text-[#5B5348] block mb-1">Total Stories</span>
                <span className="text-2xl font-black text-[#111111]">{news.length}</span>
                <span className="text-[10px] text-[#5B5348] block mt-1">
                  Published: {news.filter(n => !n.status || n.status.toLowerCase() === 'published').length}
                </span>
              </div>

              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-[10px] uppercase text-[#5B5348] block mb-1">Advocates</span>
                <span className="text-2xl font-black text-[#111111]">{registrations.length}</span>
                <span className="text-[10px] text-amber-700 block mt-1">
                  Pending: {registrations.filter(r => r.status === 'pending').length}
                </span>
              </div>

              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-[10px] uppercase text-[#5B5348] block mb-1">Grievances</span>
                <span className="text-2xl font-black text-[#111111]">{enquiries.length}</span>
                <span className="text-[10px] text-[#C41A1F] block mt-1">
                  New: {enquiries.filter(e => e.status === 'new').length}
                </span>
              </div>

              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-[10px] uppercase text-[#5B5348] block mb-1">Party Districts</span>
                <span className="text-2xl font-black text-[#111111]">{districts.length}</span>
                <span className="text-[10px] text-[#5B5348] block mt-1">74 Official Units</span>
              </div>

              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-[10px] uppercase text-[#5B5348] block mb-1">Court Hearings</span>
                <span className="text-2xl font-black text-[#111111]">{events.length}</span>
                <span className="text-[10px] text-[#5B5348] block mt-1">Docket records</span>
              </div>

              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px]">
                <span className="text-[10px] uppercase text-[#5B5348] block mb-1">Repository</span>
                <span className="text-2xl font-black text-[#111111]">{resources.length}</span>
                <span className="text-[10px] text-[#5B5348] block mt-1">Law volumes</span>
              </div>
            </div>

            {/* Role Privileges Matrix Callout */}
            <div className="bg-white border-2 border-[#111111] p-5 rounded-[2px] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-2">
                <span className="font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C41A1F]" />
                  Server Role Privileges & Enforced Boundaries
                </span>
                <span className="text-[11px] text-[#5B5348]">
                  Strict HTTP 401 & 403 Enforcement
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs pt-1">
                <div className={`p-3 border rounded-[2px] ${authenticatedRole === 'super_admin' ? 'border-[#E31E24] bg-[#FAF8F5]' : 'border-[#D8D3CB]'}`}>
                  <strong className="block font-mono font-bold text-[#111111] mb-1">Super Admin</strong>
                  <p className="text-[#5B5348]">Full access to all 14 API endpoints: news, gallery, events, districts privacy, resources, registrations, enquiries, and audit records.</p>
                </div>
                <div className={`p-3 border rounded-[2px] ${authenticatedRole === 'editorial' ? 'border-[#E31E24] bg-[#FAF8F5]' : 'border-[#D8D3CB]'}`}>
                  <strong className="block font-mono font-bold text-[#111111] mb-1">Editorial Desk</strong>
                  <p className="text-[#5B5348]">Authorized for news publication, image cropping, lead story promotion, press gallery curation, and court hearing dockets.</p>
                </div>
                <div className={`p-3 border rounded-[2px] ${authenticatedRole === 'legal_desk' ? 'border-[#E31E24] bg-[#FAF8F5]' : 'border-[#D8D3CB]'}`}>
                  <strong className="block font-mono font-bold text-[#111111] mb-1">Legal Desk</strong>
                  <p className="text-[#5B5348]">Authorized for advocate membership review, status promotion, and confidential citizen custody & grievance processing.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 2: NEWSROOM (Compact Table, Status, Side-by-side Editor) */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-[#5B5348] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newsSearchQuery}
                    onChange={(e) => setNewsSearchQuery(e.target.value)}
                    placeholder="Search stories..."
                    className="w-full pl-9 pr-3 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={newsStatusFilter}
                  onChange={(e) => setNewsStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>

                {/* Category Filter */}
                <select
                  value={newsCategoryFilter}
                  onChange={(e) => setNewsCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Press Release">Press Release</option>
                  <option value="Statement">Statement</option>
                  <option value="Court Watch">Court Watch</option>
                  <option value="Resolution">Resolution</option>
                  <option value="Gazette">Gazette</option>
                  <option value="Media">Media</option>
                </select>
              </div>

              <button
                onClick={openCreateNewsModal}
                className="min-h-[44px] px-5 py-2 bg-[#E31E24] hover:bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Compose Story</span>
              </button>

            </div>

            {/* Compact News Table */}
            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111111] text-white font-mono uppercase tracking-wider">
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Headline (EN / TA)</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Publish Date</th>
                      <th className="py-2.5 px-3">Lead Slot</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D3CB] font-sans">
                    {filteredNews.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#5B5348] font-mono">
                          No news stories matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredNews.map((item) => {
                        const status = item.status ? item.status.toLowerCase() : 'published';
                        const isScheduled = status === 'scheduled';
                        const isDraft = status === 'draft';

                        return (
                          <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                            {/* Status badge */}
                            <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-[2px] font-bold text-[10px] uppercase border ${
                                isDraft
                                  ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                                  : isScheduled
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-green-50 text-green-800 border-green-200'
                              }`}>
                                {item.status || 'Published'}
                              </span>
                            </td>

                            {/* Title (En & Ta) */}
                            <td className="py-2.5 px-3 max-w-md">
                              <span className="font-bold text-[#111111] block leading-snug">
                                {item.title.en}
                              </span>
                              {item.title.ta && item.title.ta !== item.title.en && (
                                <span className="text-[11px] text-[#5B5348] block mt-0.5 font-dmk-body">
                                  {item.title.ta}
                                </span>
                              )}
                            </td>

                            {/* Category */}
                            <td className="py-2.5 px-3 font-mono text-[#5B5348] whitespace-nowrap">
                              {item.category}
                            </td>

                            {/* Date */}
                            <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                              {item.publishDate || item.date}
                              {item.publishTime && (
                                <span className="text-[#5B5348] block text-[10px]">
                                  {item.publishTime}
                                </span>
                              )}
                            </td>

                            {/* Lead Story Indicator */}
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {item.isLeadStory ? (
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#C41A1F] bg-[#FCE8E8] px-2 py-0.5 border border-[#C41A1F] rounded-[2px]">
                                  <Star className="w-3 h-3 fill-[#C41A1F]" />
                                  Lead Hero
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetLeadStory(item.id)}
                                  className="text-[11px] text-[#5B5348] hover:text-[#111111] underline cursor-pointer font-mono"
                                  title="Promote to 60% lead story on homepage"
                                >
                                  Make Lead
                                </button>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditNewsModal(item)}
                                  className="px-2.5 py-1 text-xs text-[#111111] hover:text-[#C41A1F] underline cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteNews(item.id, item.title.en)}
                                  className="p-1.5 text-neutral-400 hover:text-[#C41A1F] cursor-pointer"
                                  title="Delete story"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 3: ADVOCATES REGISTRATION (Compact Table & Dossier) */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-[#5B5348] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regSearchQuery}
                    onChange={(e) => setRegSearchQuery(e.target.value)}
                    placeholder="Search name, bar no, district..."
                    className="w-full pl-9 pr-3 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none"
                  />
                </div>

                <select
                  value={regStatusFilter}
                  onChange={(e) => setRegStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none cursor-pointer"
                >
                  <option value="all">All Verification Stages</option>
                  <option value="pending">Pending Review</option>
                  <option value="verified">Verified</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#5B5348]">
                  Showing {filteredRegistrations.length} applications
                </span>
                <button
                  onClick={() => exportCsv(
                    'dmk-advocate-registrations',
                    ['Tracking ID', 'Full Name', 'Bar Council No', 'District', 'Court', 'Mobile', 'Email', 'Specialization', 'Status', 'Date'],
                    filteredRegistrations.map(r => [
                      r.id,
                      r.fullName,
                      r.barCouncilNumber,
                      r.district,
                      r.courtOfPractice,
                      r.mobileNumber,
                      r.emailAddress,
                      (r.areasOfSpecialization || []).join('; '),
                      r.status,
                      r.submittedAt
                    ])
                  )}
                  className="min-h-[44px] px-3 py-1.5 bg-white hover:bg-[#FAF8F5] text-[#111111] border border-[#111111] rounded-[2px] flex items-center gap-1.5 cursor-pointer font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111111] text-white font-mono uppercase tracking-wider">
                      <th className="py-2.5 px-3">Tracking ID</th>
                      <th className="py-2.5 px-3">Advocate Name</th>
                      <th className="py-2.5 px-3">Bar Council No</th>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D3CB] font-sans">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#5B5348] font-mono">
                          No advocate registrations match current criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#C41A1F] whitespace-nowrap">
                            {reg.id}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#111111] whitespace-nowrap">
                            {reg.fullName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#5B5348] whitespace-nowrap">
                            {reg.barCouncilNumber}
                          </td>
                          <td className="py-2.5 px-3 text-[#5B5348] whitespace-nowrap">
                            {reg.district}
                          </td>
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                            {reg.mobileNumber}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold uppercase border ${
                              reg.status === 'approved' ? 'bg-green-50 text-green-800 border-green-200' :
                              reg.status === 'verified' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              reg.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                              'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono">
                            <div className="flex items-center justify-end gap-2">
                              {reg.status === 'approved' && (
                                <button
                                  onClick={() => setCredentialRegistration(reg)}
                                  className="px-2 py-1 text-xs text-[#C41A1F] hover:text-[#111111] font-bold border border-[#C41A1F] hover:border-[#111111] rounded-[2px] cursor-pointer"
                                  title="View & Print Official Membership Card"
                                >
                                  ID Card
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedRegDossier(reg)}
                                className="px-2 py-1 text-xs text-[#111111] hover:text-[#C41A1F] underline cursor-pointer"
                              >
                                Review Dossier
                              </button>
                              <button
                                onClick={() => handleDeleteRegistration(reg.id)}
                                className="p-1 text-neutral-400 hover:text-[#C41A1F] cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 4: CITIZEN ENQUIRIES (Compact Table) */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-[#5B5348] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={enqSearchQuery}
                    onChange={(e) => setEnqSearchQuery(e.target.value)}
                    placeholder="Search citizen or query..."
                    className="w-full pl-9 pr-3 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none"
                  />
                </div>

                <select
                  value={enqStatusFilter}
                  onChange={(e) => setEnqStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewed">In Progress (Reviewed)</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#5B5348]">
                  Showing {filteredEnquiries.length} grievances
                </span>
                <button
                  onClick={() => exportCsv(
                    'dmk-citizen-grievances',
                    ['Tracking ID', 'Applicant Name', 'Category', 'District', 'Phone', 'Email', 'Subject', 'Message', 'Status', 'Date'],
                    filteredEnquiries.map(e => [
                      e.id,
                      e.name,
                      e.category,
                      e.district,
                      e.phone,
                      e.email || '',
                      e.subject,
                      e.message,
                      e.status,
                      e.submittedAt
                    ])
                  )}
                  className="min-h-[44px] px-3 py-1.5 bg-white hover:bg-[#FAF8F5] text-[#111111] border border-[#111111] rounded-[2px] flex items-center gap-1.5 cursor-pointer font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111111] text-white font-mono uppercase tracking-wider">
                      <th className="py-2.5 px-3">Tracking ID</th>
                      <th className="py-2.5 px-3">Applicant Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Matter Details</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D3CB] font-sans">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#5B5348] font-mono">
                          No citizen grievance enquiries match current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#C41A1F] whitespace-nowrap">
                            {enq.id}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#111111] whitespace-nowrap">
                            {enq.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                            {enq.phone}
                          </td>
                          <td className="py-2.5 px-3 text-[#5B5348] whitespace-nowrap">
                            {enq.district}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#5B5348] whitespace-nowrap">
                            {enq.category}
                          </td>
                          <td className="py-2.5 px-3 max-w-xs truncate">
                            <span className="font-bold text-[#111111]">{enq.subject}: </span>
                            <span className="text-[#5B5348]">{enq.message}</span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateEnqStatus(enq.id, e.target.value as any)}
                              className="px-2 py-1 text-[11px] font-mono font-bold rounded-[2px] border border-[#D8D3CB] bg-[#FAF8F5] outline-none cursor-pointer"
                            >
                              <option value="new">New</option>
                              <option value="reviewed">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono">
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-1 text-neutral-400 hover:text-[#C41A1F] cursor-pointer"
                              title="Delete enquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 5: DISTRICTS (Compact List, Phone Privacy Toggle) */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'districts' && (
          <div className="space-y-4">
            
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-[#5B5348] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={districtSearchQuery}
                    onChange={(e) => setDistrictSearchQuery(e.target.value)}
                    placeholder="Search district or organizer..."
                    className="w-full pl-9 pr-3 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none"
                  />
                </div>

                <select
                  value={districtZoneFilter}
                  onChange={(e) => setDistrictZoneFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none cursor-pointer"
                >
                  <option value="All">All Zones</option>
                  <option value="North">North Zone</option>
                  <option value="South">South Zone</option>
                  <option value="West">West Zone</option>
                  <option value="Central">Central Zone</option>
                  <option value="Chennai">Chennai Zone</option>
                </select>
              </div>

              <span className="text-xs text-[#5B5348]">
                {filteredDistricts.length} units listed
              </span>
            </div>

            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111111] text-white font-mono uppercase tracking-wider">
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Party District</th>
                      <th className="py-2.5 px-3">Zone</th>
                      <th className="py-2.5 px-3">Designated Organizer</th>
                      <th className="py-2.5 px-3">Phone Line</th>
                      <th className="py-2.5 px-3">Public Phone Visibility</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D3CB] font-sans">
                    {filteredDistricts.map((d) => {
                      const isPublic = d.showPhonePublicly !== false;
                      return (
                        <tr key={d.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[#5B5348]">
                            {d.number || d.id}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#111111]">
                            {d.name.en}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#5B5348]">
                            {d.zone}
                          </td>
                          <td className="py-2.5 px-3 text-[#111111]">
                            {d.organizer.en}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#5B5348]">
                            {d.contactPhone}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase border ${
                              isPublic 
                                ? 'bg-green-50 text-green-800 border-green-200' 
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {isPublic ? 'Publicly Visible' : 'State Secretariat Routing'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">
                            <button
                              onClick={() => {
                                setEditingDistrict(d);
                                setEditOrganizerEn(d.organizer?.en || '');
                                setEditOrganizerTa(d.organizer?.ta || d.organizer?.en || '');
                                setEditPhone(d.contactPhone || '');
                                setEditEmail(d.contactEmail || '');
                                setEditHeadquartersEn(d.headquarters?.en || '');
                                setEditHeadquartersTa(d.headquarters?.ta || d.headquarters?.en || '');
                                setEditCourtEn(d.courtComplex?.en || '');
                                setEditCourtTa(d.courtComplex?.ta || d.courtComplex?.en || '');
                                setEditMemberCount(d.memberCount ?? 150);
                                setEditActiveCases(d.activeCasesAssisted ?? 35);
                                setEditPhonePublicly(d.showPhonePublicly !== false);
                              }}
                              className="px-2.5 py-1 text-xs text-[#111111] hover:text-[#C41A1F] underline cursor-pointer"
                            >
                              Edit District
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 6: ACTIVITY AUDIT LOG (data/db/audit.json Viewer) */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search className="w-3.5 h-3.5 text-[#5B5348] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    placeholder="Search who or action..."
                    className="w-full pl-9 pr-3 py-1.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none"
                  />
                </div>

                <button
                  onClick={fetchAuditLogs}
                  disabled={auditLoading}
                  className="min-h-[44px] px-3.5 py-1 bg-white hover:bg-[#FAF8F5] text-[#111111] border border-[#111111] rounded-[2px] flex items-center gap-1.5 cursor-pointer font-bold text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Log</span>
                </button>

                <button
                  onClick={() => exportCsv(
                    'dmk-activity-audit-log',
                    ['Log ID', 'Timestamp', 'Operator', 'Role', 'Action Description'],
                    filteredAuditLogs.map(l => [
                      l.id,
                      l.when,
                      l.who,
                      l.role,
                      l.what
                    ])
                  )}
                  className="min-h-[44px] px-3.5 py-1 bg-white hover:bg-[#FAF8F5] text-[#111111] border border-[#111111] rounded-[2px] flex items-center gap-1.5 cursor-pointer font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="text-[#5B5348]">
                <span>Storage: </span>
                <code className="text-[#111111] font-bold">data/db/audit.json</code>
                <span className="ml-2">({filteredAuditLogs.length} entries)</span>
              </div>
            </div>

            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111111] text-white font-mono uppercase tracking-wider">
                      <th className="py-2.5 px-3">When (Timestamp)</th>
                      <th className="py-2.5 px-3">Who (Operator)</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">What (Action Description)</th>
                      <th className="py-2.5 px-3">Log ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D3CB] font-mono">
                    {filteredAuditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#5B5348]">
                          {auditLoading ? 'Reading atomic audit log records...' : 'No activity logs found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-2.5 px-3 whitespace-nowrap text-[#5B5348]">
                            {new Date(log.when).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#111111] whitespace-nowrap">
                            {log.who}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-[2px] text-[10px] uppercase font-bold border border-[#D8D3CB] bg-[#FAF8F5]">
                              {log.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-sans text-xs text-[#111111]">
                            {log.what}
                          </td>
                          <td className="py-2.5 px-3 text-[#5B5348] text-[10px] whitespace-nowrap">
                            {log.id}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 7: GALLERY / EVENTS / RESOURCES MODULES */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#111111]">Press Gallery ({gallery.length} photos)</span>
              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="min-h-[44px] px-4 py-2 bg-[#E31E24] hover:bg-[#111111] text-white font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>
            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#111111] text-white font-mono uppercase">
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D3CB]">
                  {gallery.map((g) => (
                    <tr key={g.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-2 px-3 font-bold">{g.title.en}</td>
                      <td className="py-2 px-3 font-mono">{g.category}</td>
                      <td className="py-2 px-3">{g.location.en}</td>
                      <td className="py-2 px-3 font-mono">{g.date}</td>
                      <td className="py-2 px-3 text-right">
                        <button onClick={() => handleDeleteGallery(g.id)} className="p-1 hover:text-[#C41A1F]">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#111111]">Court Hearings & Docket ({events.length} hearings)</span>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="min-h-[44px] px-4 py-2 bg-[#E31E24] hover:bg-[#111111] text-white font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hearing</span>
              </button>
            </div>
            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#111111] text-white font-mono uppercase">
                    <th className="py-2.5 px-3">Hearing / Event Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Court / Venue</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D3CB]">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-2 px-3 font-bold">{e.title.en}</td>
                      <td className="py-2 px-3 font-mono">{e.category}</td>
                      <td className="py-2 px-3">{e.venue.en}</td>
                      <td className="py-2 px-3 font-mono">{e.date}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingEvent(e);
                              setEditEventTitleEn(e.title?.en || '');
                              setEditEventTitleTa(e.title?.ta || e.title?.en || '');
                              setEditEventCategory(e.category);
                              setEditEventDate(e.date || '');
                              setEditEventVenueEn(e.venue?.en || '');
                              setEditEventVenueTa(e.venue?.ta || e.venue?.en || '');
                              setEditEventDescEn(e.description?.en || '');
                              setEditEventDescTa(e.description?.ta || e.description?.en || '');
                              setEditEventChiefGuestEn(e.chiefGuest?.en || '');
                              setEditEventChiefGuestTa(e.chiefGuest?.ta || e.chiefGuest?.en || '');
                              setEditEventAttendees(e.attendeesCount ?? 500);
                              setEditEventReportPdf(e.reportPdfUrl || '');
                            }}
                            className="px-2 py-1 text-xs text-[#111111] hover:text-[#C41A1F] underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteEvent(e.id)} className="p-1 hover:text-[#C41A1F]" title="Delete event">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="bg-white border-2 border-[#111111] p-4 rounded-[2px] flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#111111]">Legal Repository Compendiums ({resources.length} volumes)</span>
              <button
                onClick={() => setShowAddResourceModal(true)}
                className="min-h-[44px] px-4 py-2 bg-[#E31E24] hover:bg-[#111111] text-white font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Volume</span>
              </button>
            </div>
            <div className="bg-white border-2 border-[#111111] rounded-[2px] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#111111] text-white font-mono uppercase">
                    <th className="py-2.5 px-3">Volume Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Court / Authority</th>
                    <th className="py-2.5 px-3">File Size</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D3CB]">
                  {resources.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-2 px-3 font-bold">{r.title.en}</td>
                      <td className="py-2 px-3 font-mono">{r.category}</td>
                      <td className="py-2 px-3">{r.court || 'Constitutional Repository'}</td>
                      <td className="py-2 px-3 font-mono">{r.fileSize}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingResource(r);
                              setEditResTitleEn(r.title?.en || '');
                              setEditResTitleTa(r.title?.ta || r.title?.en || '');
                              setEditResCategory(r.category);
                              setEditResCitation(r.citation || '');
                              setEditResCourt(r.court || '');
                              setEditResFileSize(r.fileSize || '2.4 MB');
                              setEditResDownloadUrl(r.downloadUrl || '');
                              setEditResSummaryEn(r.summary?.en || '');
                              setEditResSummaryTa(r.summary?.ta || r.summary?.en || '');
                            }}
                            className="px-2 py-1 text-xs text-[#111111] hover:text-[#C41A1F] underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteResource(r.id)} className="p-1 hover:text-[#C41A1F]" title="Delete volume">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* --------------------------------------------------------------------- */}
      {/* ADVANCED NEWS EDITOR MODAL (Side-by-side, Status, Crop, Live Lead Preview) */}
      {/* --------------------------------------------------------------------- */}
      {showNewsEditor && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF8F5] border-2 border-[#111111] max-w-5xl w-full p-6 sm:p-8 rounded-[2px] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto font-sans space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#C41A1F] uppercase tracking-wider block">
                  NEWSROOM DISPATCH DESK • {newsEditMode === 'create' ? 'NEW PUBLICATION' : 'EDIT STORY'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                  {newsEditMode === 'create' ? 'Compose News Story & Set Publication Controls' : 'Edit Story & Layout Controls'}
                </h2>
              </div>
              <button
                onClick={() => setShowNewsEditor(false)}
                className="p-2 border border-[#111111] hover:bg-[#E31E24] hover:text-white rounded-[2px] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-6">
              
              {/* 1. Publication Status & Schedule Controls */}
              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px] space-y-4">
                <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider block">
                  1. Publication Status & Release Cadence
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Status Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#111111] block mb-1">
                      Publication Status
                    </label>
                    <select
                      value={editorStatus}
                      onChange={(e) => setEditorStatus(e.target.value as any)}
                      className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5] text-xs font-mono font-bold rounded-[2px] outline-none cursor-pointer"
                    >
                      <option value="Published">Published (Public immediately upon date)</option>
                      <option value="Scheduled">Scheduled (Auto-publish at release time)</option>
                      <option value="Draft">Draft (Internal editorial work only)</option>
                    </select>
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="text-xs font-bold text-[#111111] block mb-1">
                      Release Date
                    </label>
                    <input
                      type="date"
                      required
                      value={editorPublishDate}
                      onChange={(e) => setEditorPublishDate(e.target.value)}
                      className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5] text-xs font-mono rounded-[2px] outline-none"
                    />
                  </div>

                  {/* Publish Time */}
                  <div>
                    <label className="text-xs font-bold text-[#111111] block mb-1">
                      Release Time (IST)
                    </label>
                    <input
                      type="time"
                      value={editorPublishTime}
                      onChange={(e) => setEditorPublishTime(e.target.value)}
                      className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5] text-xs font-mono rounded-[2px] outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#D8D3CB]">
                  {/* Lead Hero Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={editorIsLead}
                      onChange={(e) => setEditorIsLead(e.target.checked)}
                      className="w-4 h-4 accent-[#E31E24]"
                    />
                    <span>Designate as Home Page Lead Story (60% hero position)</span>
                  </label>

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Category Tag:</span>
                    <select
                      value={editorCategory}
                      onChange={(e) => setEditorCategory(e.target.value as any)}
                      className="px-2 py-1 border border-[#D8D3CB] bg-[#FAF8F5] text-xs font-mono rounded-[2px] outline-none cursor-pointer"
                    >
                      <option value="Press Release">Press Release</option>
                      <option value="Statement">Statement</option>
                      <option value="Court Watch">Court Watch</option>
                      <option value="Resolution">Resolution</option>
                      <option value="Gazette">Gazette</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Side-by-Side Tamil and English Fields */}
              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px] space-y-4">
                <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-2">
                  <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
                    2. Bilingual Editorial Content (English & Tamil Side by Side)
                  </span>
                  <span className="text-[11px] text-[#5B5348]">Tamil fields render without uppercase or letter-spacing</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: English */}
                  <div className="space-y-4 border-r border-[#D8D3CB] md:pr-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#C41A1F] uppercase">
                      <span>English Text Version</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">Headline (English) *</label>
                      <input
                        type="text"
                        required
                        value={editorTitleEn}
                        onChange={(e) => setEditorTitleEn(e.target.value)}
                        placeholder="Supreme Court Upholds State Policy..."
                        className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none font-serif"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">Two-line Summary (English) *</label>
                      <textarea
                        rows={2}
                        value={editorSummaryEn}
                        onChange={(e) => setEditorSummaryEn(e.target.value)}
                        placeholder="Brief two-line summary of the legal statement or ruling..."
                        className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">Full Statement Content (English)</label>
                      <textarea
                        rows={6}
                        value={editorContentEn}
                        onChange={(e) => setEditorContentEn(e.target.value)}
                        placeholder="Complete paragraphs of the press dispatch..."
                        className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none leading-relaxed font-serif"
                      />
                    </div>
                  </div>

                  {/* Right Column: Tamil */}
                  <div className="space-y-4 md:pl-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#C41A1F] uppercase">
                      <span>தமிழ் பதிப்பு (Tamil Version)</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 font-dmk-body">தலைப்பு (தமிழ்)</label>
                      <input
                        type="text"
                        value={editorTitleTa}
                        onChange={(e) => setEditorTitleTa(e.target.value)}
                        placeholder="உச்ச நீதிமன்றத்தில் மாநில அரசின் சட்டப் போராட்டம் வெற்றி..."
                        className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none font-dmk-headline"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 font-dmk-body">இருவரிச் சுருக்கம் (தமிழ்)</label>
                      <textarea
                        rows={2}
                        value={editorSummaryTa}
                        onChange={(e) => setEditorSummaryTa(e.target.value)}
                        placeholder="அறிக்கை அல்லது தீர்ப்பின் இருவரிச் சுருக்கம்..."
                        className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none font-dmk-body"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 font-dmk-body">முழு அறிக்கை உரை (தமிழ்)</label>
                      <textarea
                        rows={6}
                        value={editorContentTa}
                        onChange={(e) => setEditorContentTa(e.target.value)}
                        placeholder="முழுமையான அறிக்கை பத்திகள்..."
                        className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none leading-relaxed font-dmk-body"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. Image Focal Crop & Positioning */}
              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px] space-y-4">
                <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider block">
                  3. Lead Story Picture & Image Crop Alignment
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="font-bold text-[#111111] block mb-1">Image Source Path / URL</label>
                      <input
                        type="text"
                        value={editorImage}
                        onChange={(e) => setEditorImage(e.target.value)}
                        className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5] text-xs rounded-[2px] outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#111111] block mb-1">Focal Crop Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['center', 'top', 'bottom'] as const).map((pos) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => setEditorCropPosition(pos)}
                            className={`min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase rounded-[2px] border cursor-pointer ${
                              editorCropPosition === pos
                                ? 'bg-[#E31E24] text-white border-[#E31E24]'
                                : 'bg-[#FAF8F5] text-[#111111] border-[#D8D3CB] hover:border-[#111111]'
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-[#111111]">Crop Zoom Level</label>
                        <span className="font-bold">{editorCropZoom}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="1.8"
                        step="0.05"
                        value={editorCropZoom}
                        onChange={(e) => setEditorCropZoom(parseFloat(e.target.value))}
                        className="w-full accent-[#E31E24]"
                      />
                    </div>
                  </div>

                  {/* Crop Aspect Preview Frame */}
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#5B5348] uppercase block mb-1">
                      Lead Slot 16:9 Aspect Crop Window
                    </span>
                    <div className="aspect-video w-full bg-neutral-900 border-2 border-[#111111] overflow-hidden rounded-[2px] relative flex items-center justify-center">
                      <img
                        src={editorImage}
                        alt="Crop target"
                        className="w-full h-full object-cover transition-all"
                        style={{
                          objectPosition: editorCropPosition,
                          transform: `scale(${editorCropZoom})`
                        }}
                      />
                      <div className="absolute inset-0 border border-white/40 pointer-events-none" />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-white font-mono text-[10px]">
                        {editorCropPosition} • {editorCropZoom}x
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 4. Live Lead Position Preview on Home Page */}
              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px] space-y-3">
                <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-2 font-mono text-xs">
                  <span className="font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#C41A1F]" />
                    Live Preview: How this Story Appears in Home Page Lead Position
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('en')}
                      className={`px-2 py-1 text-[11px] rounded-[2px] cursor-pointer ${
                        activePreviewTab === 'en' ? 'bg-[#111111] text-white font-bold' : 'text-[#5B5348]'
                      }`}
                    >
                      English Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('ta')}
                      className={`px-2 py-1 text-[11px] rounded-[2px] cursor-pointer ${
                        activePreviewTab === 'ta' ? 'bg-[#111111] text-white font-bold' : 'text-[#5B5348]'
                      }`}
                    >
                      Tamil Preview
                    </button>
                  </div>
                </div>

                {/* Simulated ~60% Lead Card Box */}
                <div className="bg-[#FAF8F5] border border-[#D8D3CB] p-6 rounded-[2px] max-w-xl mx-auto shadow-sm">
                  
                  {/* Photo with caption */}
                  <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900 mb-3 border border-[#D8D3CB]">
                    <img
                      src={editorImage}
                      alt="Lead story"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: editorCropPosition,
                        transform: `scale(${editorCropZoom})`
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C41A1F] border border-[#C41A1F] px-1.5 py-0.5">
                        {editorCategory}
                      </span>
                      <span className="text-[11px] font-mono text-[#5B5348]">
                        {editorPublishDate}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#111111] font-dmk-headline leading-snug">
                      {activePreviewTab === 'en' 
                        ? (editorTitleEn || 'Lead story headline preview will appear here...')
                        : (editorTitleTa || editorTitleEn || 'தலைப்பு முன்னோட்டம் இங்கே தோன்றும்...')}
                    </h3>

                    <p className="text-xs text-[#5B5348] line-clamp-2 leading-relaxed">
                      {activePreviewTab === 'en'
                        ? (editorSummaryEn || 'Two-line executive summary of the legal statement or ruling...')
                        : (editorSummaryTa || editorSummaryEn || 'அறிக்கையின் இருவரிச் சுருக்கம்...')}
                    </p>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-[#E31E24] underline flex items-center gap-1">
                        <span>{activePreviewTab === 'ta' ? 'முழு அறிக்கையைப் படிக்க' : 'Read the full statement'}</span>
                        <span>&rarr;</span>
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#D8D3CB] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowNewsEditor(false)}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#111111] border border-[#111111] rounded-[2px] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 bg-[#E31E24] hover:bg-[#111111] text-white font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {newsEditMode === 'create' ? `Publish / Commit (${editorStatus})` : 'Update Story'}
                  </span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* FULL DISTRICT EDITOR MODAL */}
      {/* --------------------------------------------------------------------- */}
      {editingDistrict && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF8F5] border-2 border-[#111111] max-w-2xl w-full p-6 sm:p-8 rounded-[2px] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto font-sans space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#C41A1F] uppercase tracking-wider block">
                  DISTRICT ADMINISTRATION DESK • UNIT {editingDistrict.number || editingDistrict.id}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-dmk-headline">
                  Edit District: {editingDistrict.name.en} ({editingDistrict.zone} Zone)
                </h2>
              </div>
              <button
                onClick={() => setEditingDistrict(null)}
                className="p-2 border border-[#111111] hover:bg-[#E31E24] hover:text-white rounded-[2px] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Organizer EN / TA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Designated Organizer (English) *
                  </label>
                  <input
                    type="text"
                    value={editOrganizerEn}
                    onChange={(e) => setEditOrganizerEn(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs rounded-[2px] outline-none"
                    placeholder="Adv. K. Saravanan"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Designated Organizer (Tamil)
                  </label>
                  <input
                    type="text"
                    value={editOrganizerTa}
                    onChange={(e) => setEditOrganizerTa(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs rounded-[2px] outline-none"
                    placeholder="வழக்கறிஞர் கே. சரவணன்"
                  />
                </div>
              </div>

              {/* Contact Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Telephone Line (e.g. 044-25341234 or +91 94440 12345)
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs font-mono rounded-[2px] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs font-mono rounded-[2px] outline-none"
                    placeholder="legal@dmk.org.in"
                  />
                </div>
              </div>

              {/* Headquarters EN / TA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Headquarters Office (English)
                  </label>
                  <input
                    type="text"
                    value={editHeadquartersEn}
                    onChange={(e) => setEditHeadquartersEn(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs rounded-[2px] outline-none"
                    placeholder="Anna Arivalayam, Chennai"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Headquarters Office (Tamil)
                  </label>
                  <input
                    type="text"
                    value={editHeadquartersTa}
                    onChange={(e) => setEditHeadquartersTa(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs rounded-[2px] outline-none"
                    placeholder="அண்ணா அறிவாலயம், சென்னை"
                  />
                </div>
              </div>

              {/* Court Complex EN / TA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Principal Court Complex (English)
                  </label>
                  <input
                    type="text"
                    value={editCourtEn}
                    onChange={(e) => setEditCourtEn(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs rounded-[2px] outline-none"
                    placeholder="Madras High Court Campus"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Principal Court Complex (Tamil)
                  </label>
                  <input
                    type="text"
                    value={editCourtTa}
                    onChange={(e) => setEditCourtTa(e.target.value)}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs rounded-[2px] outline-none"
                    placeholder="சென்னை உயர் நீதிமன்ற வளாகம்"
                  />
                </div>
              </div>

              {/* Members & Active Cases metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Registered Advocate Members
                  </label>
                  <input
                    type="number"
                    value={editMemberCount}
                    onChange={(e) => setEditMemberCount(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs font-mono rounded-[2px] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                    Active Cases Assisted
                  </label>
                  <input
                    type="number"
                    value={editActiveCases}
                    onChange={(e) => setEditActiveCases(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-white text-xs font-mono rounded-[2px] outline-none"
                  />
                </div>
              </div>

              {/* Phone Privacy Toggle */}
              <div className="p-4 bg-white border border-[#D8D3CB] rounded-[2px] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                  <input
                    type="checkbox"
                    checked={editPhonePublicly}
                    onChange={(e) => setEditPhonePublicly(e.target.checked)}
                    className="w-4 h-4 accent-[#E31E24]"
                  />
                  <span>Show telephone line publicly on /districts</span>
                </label>
                <p className="text-[11px] text-[#5B5348]">
                  When unchecked, the phone number is shielded from the public portal and replaced with &ldquo;Contact through the State Secretariat&rdquo;.
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-[#D8D3CB] flex justify-end gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setEditingDistrict(null)}
                className="min-h-[44px] px-5 py-2 border border-[#111111] bg-white text-[#111111] rounded-[2px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDistrict}
                className="min-h-[44px] px-6 py-2 bg-[#E31E24] hover:bg-[#111111] text-white font-bold uppercase rounded-[2px] cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save District Details</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* ADVOCATE REGISTRATION DOSSIER MODAL */}
      {/* --------------------------------------------------------------------- */}
      {selectedRegDossier && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border-2 border-[#111111] max-w-xl w-full p-6 rounded-[2px] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#C41A1F] uppercase block">
                  ADVOCATE MEMBERSHIP DOSSIER • {selectedRegDossier.id}
                </span>
                <h3 className="text-lg font-black text-[#111111] font-dmk-headline">
                  {selectedRegDossier.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRegDossier(null)}
                className="p-1.5 border border-[#111111] hover:bg-[#E31E24] hover:text-white rounded-[2px] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-white border border-[#D8D3CB]">
                <span className="text-[#5B5348] text-[10px] block">BAR COUNCIL NUMBER</span>
                <span className="font-bold text-[#111111]">{selectedRegDossier.barCouncilNumber}</span>
              </div>
              <div className="p-3 bg-white border border-[#D8D3CB]">
                <span className="text-[#5B5348] text-[10px] block">ENROLMENT YEAR</span>
                <span className="font-bold text-[#111111]">{selectedRegDossier.yearOfEnrollment}</span>
              </div>
              <div className="p-3 bg-white border border-[#D8D3CB]">
                <span className="text-[#5B5348] text-[10px] block">PARTY DISTRICT</span>
                <span className="font-bold text-[#111111]">{selectedRegDossier.district}</span>
              </div>
              <div className="p-3 bg-white border border-[#D8D3CB]">
                <span className="text-[#5B5348] text-[10px] block">PRIMARY COURT</span>
                <span className="font-bold text-[#111111]">{selectedRegDossier.courtOfPractice}</span>
              </div>
              <div className="p-3 bg-white border border-[#D8D3CB]">
                <span className="text-[#5B5348] text-[10px] block">MOBILE LINE</span>
                <span className="font-bold text-[#111111]">{selectedRegDossier.mobileNumber}</span>
              </div>
              <div className="p-3 bg-white border border-[#D8D3CB]">
                <span className="text-[#5B5348] text-[10px] block">EMAIL</span>
                <span className="font-bold text-[#111111] truncate block">{selectedRegDossier.emailAddress}</span>
              </div>
            </div>

            {selectedRegDossier.address && (
              <div className="p-3 bg-white border border-[#D8D3CB] text-xs">
                <span className="text-[#5B5348] text-[10px] font-mono block mb-0.5">RESIDENTIAL / CHAMBER ADDRESS</span>
                <p className="text-[#111111]">{selectedRegDossier.address}</p>
              </div>
            )}

            {/* Specializations */}
            {selectedRegDossier.areasOfSpecialization && (
              <div className="space-y-1.5 text-xs">
                <span className="text-[#5B5348] text-[10px] font-mono block">SPECIALIZATION DOMAINS</span>
                <div className="flex flex-wrap gap-1">
                  {selectedRegDossier.areasOfSpecialization.map((spec, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-[#D8D3CB] font-mono text-[10px]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Approved ID Card Link */}
            {selectedRegDossier.status === 'approved' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-[2px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-green-900 block">Advocate Membership Approved</span>
                  <span className="text-[11px] text-green-700">Official digital membership card is generated and verified.</span>
                </div>
                <button
                  onClick={() => setCredentialRegistration(selectedRegDossier)}
                  className="min-h-[44px] px-3.5 py-1.5 bg-[#111111] hover:bg-[#E31E24] text-white font-mono text-xs font-bold uppercase rounded-[2px] cursor-pointer flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>View ID Card</span>
                </button>
              </div>
            )}

            {/* Status Change Buttons (Legal Desk & Super Admin) */}
            <div className="pt-3 border-t border-[#D8D3CB] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="text-[#5B5348]">Update Verification Stage:</span>
              <div className="flex gap-1.5">
                {(['pending', 'verified', 'approved', 'rejected'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdateRegStatus(selectedRegDossier.id, s)}
                    className={`px-3 py-1 uppercase font-bold rounded-[2px] border cursor-pointer ${
                      selectedRegDossier.status === s
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#111111] border-[#D8D3CB]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SIMPLE CREATION MODALS FOR GALLERY, EVENTS, RESOURCES */}
      {/* --------------------------------------------------------------------- */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateGallery} className="bg-white border-2 border-[#111111] max-w-md w-full p-6 rounded-[2px] space-y-4 text-xs font-mono">
            <h3 className="font-bold text-sm text-[#111111] uppercase border-b pb-2">Add Press Gallery Photo</h3>
            <div>
              <label className="block mb-1 font-bold">Headline (English) *</label>
              <input required value={newGalTitleEn} onChange={(e) => setNewGalTitleEn(e.target.value)} className="w-full p-2 border border-[#D8D3CB] bg-[#FAF8F5]" />
            </div>
            <div>
              <label className="block mb-1 font-bold">Headline (Tamil)</label>
              <input value={newGalTitleTa} onChange={(e) => setNewGalTitleTa(e.target.value)} className="w-full p-2 border border-[#D8D3CB] bg-[#FAF8F5]" />
            </div>
            <div>
              <label className="block mb-1 font-bold">Image URL</label>
              <input value={newGalImage} onChange={(e) => setNewGalImage(e.target.value)} className="w-full p-2 border border-[#D8D3CB] bg-[#FAF8F5]" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddGalleryModal(false)} className="px-3 py-1.5 border">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-[#E31E24] text-white font-bold">Save</button>
            </div>
          </form>
        </div>
      )}

      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form onSubmit={handleCreateEvent} className="bg-white border-2 border-[#111111] max-w-2xl w-full p-6 sm:p-8 rounded-[2px] space-y-4 text-xs font-mono max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-3">
              <h3 className="font-bold text-base text-[#111111] uppercase">Add Court Hearing / Legal Conference</h3>
              <button type="button" onClick={() => setShowAddEventModal(false)} className="p-1 border border-[#111111]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Event Title (English) *</label>
                <input required value={newEventTitleEn} onChange={(e) => setNewEventTitleEn(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Event Title (Tamil)</label>
                <input value={newEventTitleTa} onChange={(e) => setNewEventTitleTa(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Category</label>
                <select value={newEventCategory} onChange={(e) => setNewEventCategory(e.target.value as any)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]">
                  <option value="Conference">State Legal Conference</option>
                  <option value="Legal Awareness">Legal Awareness Camp</option>
                  <option value="Seminar">Constitutional Law Seminar</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-bold">Event Date</label>
                <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Court / Venue (English)</label>
                <input value={newEventVenueEn} onChange={(e) => setNewEventVenueEn(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Court / Venue (Tamil)</label>
                <input value={newEventVenueTa} onChange={(e) => setNewEventVenueTa(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Chief Guest (English)</label>
                <input value={newEventChiefGuestEn} onChange={(e) => setNewEventChiefGuestEn(e.target.value)} placeholder="e.g. Senior Advocate N.R. Elango" className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Chief Guest (Tamil)</label>
                <input value={newEventChiefGuestTa} onChange={(e) => setNewEventChiefGuestTa(e.target.value)} placeholder="எ.கா. மூத்த வழக்கறிஞர் என்.ஆர். இளங்கோ" className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Expected / Registered Attendees</label>
                <input type="number" value={newEventAttendees} onChange={(e) => setNewEventAttendees(Number(e.target.value))} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Official Report PDF URL</label>
                <input value={newEventReportPdf} onChange={(e) => setNewEventReportPdf(e.target.value)} placeholder="/resources/event-report.pdf" className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold">Description / Agenda Summary (English)</label>
              <textarea rows={2} value={newEventDescEn} onChange={(e) => setNewEventDescEn(e.target.value)} className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5]" />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setShowAddEventModal(false)} className="min-h-[44px] px-4 py-2 border">Cancel</button>
              <button type="submit" className="min-h-[44px] px-6 py-2 bg-[#E31E24] text-white font-bold uppercase">Save Hearing</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form onSubmit={handleSaveEventEdit} className="bg-white border-2 border-[#111111] max-w-2xl w-full p-6 sm:p-8 rounded-[2px] space-y-4 text-xs font-mono max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-3">
              <h3 className="font-bold text-base text-[#111111] uppercase">Edit Hearing / Event: {editingEvent.id}</h3>
              <button type="button" onClick={() => setEditingEvent(null)} className="p-1 border border-[#111111]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Event Title (English) *</label>
                <input required value={editEventTitleEn} onChange={(e) => setEditEventTitleEn(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Event Title (Tamil)</label>
                <input value={editEventTitleTa} onChange={(e) => setEditEventTitleTa(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Category</label>
                <select value={editEventCategory} onChange={(e) => setEditEventCategory(e.target.value as any)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]">
                  <option value="Conference">State Legal Conference</option>
                  <option value="Legal Awareness">Legal Awareness Camp</option>
                  <option value="Seminar">Constitutional Law Seminar</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-bold">Event Date</label>
                <input type="date" value={editEventDate} onChange={(e) => setEditEventDate(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Court / Venue (English)</label>
                <input value={editEventVenueEn} onChange={(e) => setEditEventVenueEn(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Court / Venue (Tamil)</label>
                <input value={editEventVenueTa} onChange={(e) => setEditEventVenueTa(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Chief Guest (English)</label>
                <input value={editEventChiefGuestEn} onChange={(e) => setEditEventChiefGuestEn(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Chief Guest (Tamil)</label>
                <input value={editEventChiefGuestTa} onChange={(e) => setEditEventChiefGuestTa(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Attendees Count</label>
                <input type="number" value={editEventAttendees} onChange={(e) => setEditEventAttendees(Number(e.target.value))} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Official Report PDF URL</label>
                <input value={editEventReportPdf} onChange={(e) => setEditEventReportPdf(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold">Description / Agenda Summary (English)</label>
              <textarea rows={2} value={editEventDescEn} onChange={(e) => setEditEventDescEn(e.target.value)} className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5]" />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setEditingEvent(null)} className="min-h-[44px] px-4 py-2 border">Cancel</button>
              <button type="submit" className="min-h-[44px] px-6 py-2 bg-[#E31E24] text-white font-bold uppercase">Update Event</button>
            </div>
          </form>
        </div>
      )}

      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form onSubmit={handleCreateResource} className="bg-white border-2 border-[#111111] max-w-2xl w-full p-6 sm:p-8 rounded-[2px] space-y-4 text-xs font-mono max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-3">
              <h3 className="font-bold text-base text-[#111111] uppercase">Upload Legal Resource Compendium</h3>
              <button type="button" onClick={() => setShowAddResourceModal(false)} className="p-1 border border-[#111111]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Volume Title (English) *</label>
                <input required value={newResTitleEn} onChange={(e) => setNewResTitleEn(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Volume Title (Tamil)</label>
                <input value={newResTitleTa} onChange={(e) => setNewResTitleTa(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Category</label>
                <select value={newResCategory} onChange={(e) => setNewResCategory(e.target.value as any)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]">
                  <option value="Supreme Court">Supreme Court</option>
                  <option value="High Court">High Court</option>
                  <option value="Statutes">Statutes & Acts</option>
                  <option value="Election Law">Election Law</option>
                  <option value="Party Constitution">Party Constitution</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-bold">Citation / Docket</label>
                <input value={newResCitation} onChange={(e) => setNewResCitation(e.target.value)} placeholder="(2024) 4 SCC 120" className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-bold">Court / Authority</label>
                <input value={newResCourt} onChange={(e) => setNewResCourt(e.target.value)} placeholder="Supreme Court of India" className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">File Size</label>
                <input value={newResFileSize} onChange={(e) => setNewResFileSize(e.target.value)} placeholder="2.4 MB" className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Download URL</label>
                <input value={newResDownloadUrl} onChange={(e) => setNewResDownloadUrl(e.target.value)} placeholder="/resources/ruling.pdf" className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold">Summary (English)</label>
              <textarea rows={3} value={newResSummaryEn} onChange={(e) => setNewResSummaryEn(e.target.value)} className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5]" />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setShowAddResourceModal(false)} className="min-h-[44px] px-4 py-2 border">Cancel</button>
              <button type="submit" className="min-h-[44px] px-6 py-2 bg-[#E31E24] text-white font-bold uppercase">Save Volume</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT RESOURCE MODAL */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form onSubmit={handleSaveResourceEdit} className="bg-white border-2 border-[#111111] max-w-2xl w-full p-6 sm:p-8 rounded-[2px] space-y-4 text-xs font-mono max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-3">
              <h3 className="font-bold text-base text-[#111111] uppercase">Edit Legal Volume: {editingResource.id}</h3>
              <button type="button" onClick={() => setEditingResource(null)} className="p-1 border border-[#111111]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Volume Title (English) *</label>
                <input required value={editResTitleEn} onChange={(e) => setEditResTitleEn(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Volume Title (Tamil)</label>
                <input value={editResTitleTa} onChange={(e) => setEditResTitleTa(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Category</label>
                <select value={editResCategory} onChange={(e) => setEditResCategory(e.target.value as any)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]">
                  <option value="Supreme Court">Supreme Court</option>
                  <option value="High Court">High Court</option>
                  <option value="Statutes">Statutes & Acts</option>
                  <option value="Election Law">Election Law</option>
                  <option value="Party Constitution">Party Constitution</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-bold">Citation / Docket</label>
                <input value={editResCitation} onChange={(e) => setEditResCitation(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-bold">Court / Authority</label>
                <input value={editResCourt} onChange={(e) => setEditResCourt(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">File Size</label>
                <input value={editResFileSize} onChange={(e) => setEditResFileSize(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Download URL</label>
                <input value={editResDownloadUrl} onChange={(e) => setEditResDownloadUrl(e.target.value)} className="w-full min-h-[44px] px-3 border border-[#D8D3CB] bg-[#FAF8F5]" />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold">Summary (English)</label>
              <textarea rows={3} value={editResSummaryEn} onChange={(e) => setEditResSummaryEn(e.target.value)} className="w-full p-2.5 border border-[#D8D3CB] bg-[#FAF8F5]" />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setEditingResource(null)} className="min-h-[44px] px-4 py-2 border">Cancel</button>
              <button type="submit" className="min-h-[44px] px-6 py-2 bg-[#E31E24] text-white font-bold uppercase">Update Volume</button>
            </div>
          </form>
        </div>
      )}

      {/* DIGITAL ADVOCATE MEMBERSHIP CREDENTIAL CERTIFICATE / ID CARD MODAL */}
      {credentialRegistration && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF8F5] border-2 border-[#111111] max-w-xl w-full p-6 sm:p-8 rounded-[2px] shadow-2xl relative my-auto font-sans space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#D8D3CB] pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#C41A1F]" />
                <h3 className="font-bold text-sm sm:text-base text-[#111111] font-mono uppercase tracking-wider">
                  Official Advocate Credential
                </h3>
              </div>
              <button
                onClick={() => setCredentialRegistration(null)}
                className="p-1.5 border border-[#111111] hover:bg-[#E31E24] hover:text-white rounded-[2px] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Print Area / Official ID Card Box */}
            <div id="advocate-credential-card" className="bg-white border-2 border-[#111111] p-6 rounded-[2px] shadow-sm relative overflow-hidden space-y-4">
              
              {/* Top Banner with DMK Red Accent */}
              <div className="border-b-2 border-[#111111] pb-3 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#C41A1F] uppercase tracking-widest block">
                    திராவிட முன்னேற்றக் கழகம் சட்டப் பிரிவு
                  </span>
                  <h4 className="text-lg font-black text-[#111111] font-dmk-headline tracking-tight uppercase">
                    DMK Legal Wing Advocate Certificate
                  </h4>
                  <span className="text-[11px] text-[#5B5348] font-mono">
                    State Legal Secretariat • Anna Arivalayam, Chennai
                  </span>
                </div>
                <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center font-black font-dmk-headline text-lg rounded-[2px]">
                  திமுக
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="bg-[#FAF8F5] border border-[#D8D3CB] px-3 py-1.5 rounded-[2px] flex items-center justify-between font-mono text-[11px]">
                <span className="font-bold text-[#111111]">STATUS: VERIFIED ADVOCATE</span>
                <span className="text-green-800 font-bold bg-green-100 px-2 py-0.5 rounded-[2px]">
                  ACTIVE ENROLMENT
                </span>
              </div>

              {/* Advocate Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D3CB]">
                  <span className="text-[10px] font-mono text-[#5B5348] block">ADVOCATE NAME</span>
                  <span className="font-bold text-[#111111] text-sm block mt-0.5">{credentialRegistration.fullName}</span>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D3CB]">
                  <span className="text-[10px] font-mono text-[#5B5348] block">BAR COUNCIL REG NO</span>
                  <span className="font-mono font-bold text-[#C41A1F] text-sm block mt-0.5">{credentialRegistration.barCouncilNumber}</span>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D3CB]">
                  <span className="text-[10px] font-mono text-[#5B5348] block">PARTY DISTRICT</span>
                  <span className="font-bold text-[#111111] block mt-0.5">{credentialRegistration.district}</span>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D3CB]">
                  <span className="text-[10px] font-mono text-[#5B5348] block">COURT OF PRACTICE</span>
                  <span className="font-bold text-[#111111] block mt-0.5">{credentialRegistration.courtOfPractice}</span>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D3CB]">
                  <span className="text-[10px] font-mono text-[#5B5348] block">MEMBERSHIP ID</span>
                  <span className="font-mono font-bold text-[#111111] block mt-0.5">{credentialRegistration.id}</span>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D3CB]">
                  <span className="text-[10px] font-mono text-[#5B5348] block">ENROLMENT YEAR</span>
                  <span className="font-mono font-bold text-[#111111] block mt-0.5">{credentialRegistration.yearOfEnrollment}</span>
                </div>
              </div>

              {/* Authorization Footer */}
              <div className="border-t border-[#D8D3CB] pt-3 flex items-center justify-between text-[10px] font-mono text-[#5B5348]">
                <span>ISSUED UNDER THE AUTHORITY OF DMK LEGAL WING</span>
                <span className="font-bold text-[#111111]">CHENNAI, TAMIL NADU</span>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setCredentialRegistration(null)}
                className="min-h-[44px] px-5 py-2 border border-[#111111] bg-white text-[#111111] rounded-[2px] cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[44px] px-6 py-2 bg-[#111111] hover:bg-[#E31E24] text-white font-bold uppercase rounded-[2px] cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#E31E24]" />
                <span>Print Official Card</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
