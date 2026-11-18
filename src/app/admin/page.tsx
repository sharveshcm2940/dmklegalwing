'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { 
  Shield, 
  Lock, 
  Trash2, 
  Plus, 
  Calendar, 
  BookOpen, 
  LogOut 
} from 'lucide-react';

export default function AdminPage() {
  const { language } = useLanguage();
  const { 
    news, 
    addNews, 
    deleteNews, 
    events, 
    addEvent, 
    deleteEvent, 
    resources, 
    addResource, 
    deleteResource, 
    registrations, 
    updateRegistrationStatus, 
    enquiries, 
    updateEnquiryStatus 
  } = useData();

  // Authentication simulation
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminRole, setAdminRole] = useState<'super_admin' | 'content_admin' | 'legal_officer'>('super_admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'enquiries' | 'news' | 'events' | 'resources'>('overview');

  // Modal / Form states for adding items
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsTitleEn, setNewNewsTitleEn] = useState('');
  const [newNewsTitleTa, setNewNewsTitleTa] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'Press Release' | 'Statement' | 'Resolution' | 'Media'>('Press Release');
  const [newNewsSummaryEn, setNewNewsSummaryEn] = useState('');
  const [newNewsSummaryTa, setNewNewsSummaryTa] = useState('');
  const [newNewsContentEn, setNewNewsContentEn] = useState('');
  const [newNewsContentTa, setNewNewsContentTa] = useState('');

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'dmk1971' || adminPassword === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. (Hint: use "dmk1971" or "admin")');
    }
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitleEn.trim()) return;

    addNews({
      title: { en: newNewsTitleEn, ta: newNewsTitleTa || newNewsTitleEn },
      category: newNewsCategory,
      date: new Date().toISOString().split('T')[0],
      author: { en: 'DMK Legal Wing Secretariat', ta: 'திமுக வழக்கறிஞர் அணித் தலைமை' },
      summary: { en: newNewsSummaryEn, ta: newNewsSummaryTa || newNewsSummaryEn },
      content: { en: newNewsContentEn || newNewsSummaryEn, ta: newNewsContentTa || newNewsSummaryTa || newNewsSummaryEn },
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000',
      featured: false
    });

    setShowAddNewsModal(false);
    setNewNewsTitleEn('');
    setNewNewsTitleTa('');
    setNewNewsSummaryEn('');
    setNewNewsSummaryTa('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitleEn.trim()) return;

    addEvent({
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

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitleEn.trim()) return;

    addResource({
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 font-tamil-sans">
        <div className="bg-white border-2 border-[#E2DDD5] rounded-2xl max-w-md w-full p-8 shadow-sm">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 bg-[#FFF5F5] border border-[#E31E24] text-[#E31E24] rounded-xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#111111] font-tamil-serif">
              DMK Legal Wing Admin Access
            </h2>
            <p className="text-xs text-[#666666]">
              Authorized legal wing officers, secretariat administrators & editors only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C4] text-[#B81318] text-xs rounded">
                {authError}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-[#333333] block mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password (hint: dmk1971)"
                className="w-full bg-white border border-[#D5CEC4] rounded-md p-2 text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#E31E24]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#E31E24] hover:bg-[#B81318] text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Sign In to Secretariat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-tamil-sans">
      
      {/* Top Admin Bar with Role Switcher */}
      <div className="bg-white border border-[#E2DDD5] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E2DDD5] flex items-center justify-center text-[#E31E24]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#111111] font-tamil-serif">
                Legal Wing Management Portal
              </h1>
              <span className="text-[10px] font-mono bg-[#FFF5F5] text-[#B81318] px-2 py-0.5 rounded border border-[#F5C2C4] uppercase font-bold">
                {adminRole.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#666666]">
              Live State Secretariat Control System • Anna Arivalayam
            </p>
          </div>
        </div>

        {/* Role Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-lg border border-[#E2DDD5]">
            <span className="text-[#666666] px-2 font-medium">Role:</span>
            {(['super_admin', 'content_admin', 'legal_officer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAdminRole(r)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  adminRole === r ? 'bg-[#E31E24] text-white' : 'text-[#555555] hover:text-black'
                }`}
              >
                {r === 'super_admin' ? 'Super Admin' : r === 'content_admin' ? 'Content Admin' : 'Legal Desk'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE6DF] text-[#444444] border border-[#E2DDD5]"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E31E24]" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2DDD5] pb-2 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Overview & Analytics', count: null },
          { id: 'registrations', label: 'Advocate Registrations', count: registrations.length },
          { id: 'enquiries', label: 'Citizen Inquiries', count: enquiries.length },
          { id: 'news', label: 'Press Releases & News', count: news.length },
          { id: 'events', label: 'Events & Conferences', count: events.length },
          { id: 'resources', label: 'Legal Resources', count: resources.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#E31E24] text-white shadow-2xs'
                : 'bg-white text-[#555555] hover:text-black border border-[#E2DDD5]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="text-[10px] bg-black/10 px-1.5 py-0.2 rounded font-mono">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-[#E2DDD5] rounded-xl space-y-1 shadow-2xs">
              <span className="text-xs text-[#666666] uppercase font-mono font-bold">Enrolled Advocates</span>
              <span className="text-2xl font-bold text-[#111111] font-mono block">28,500+</span>
              <span className="text-[11px] text-emerald-600 font-medium">● 38 Districts Covered</span>
            </div>

            <div className="p-5 bg-white border border-[#E2DDD5] rounded-xl space-y-1 shadow-2xs">
              <span className="text-xs text-[#666666] uppercase font-mono font-bold">Pending Registrations</span>
              <span className="text-2xl font-bold text-[#E31E24] font-mono block">
                {registrations.filter((r) => r.status === 'pending').length}
              </span>
              <span className="text-[11px] text-[#666666]">Awaiting Bar Verification</span>
            </div>

            <div className="p-5 bg-white border border-[#E2DDD5] rounded-xl space-y-1 shadow-2xs">
              <span className="text-xs text-[#666666] uppercase font-mono font-bold">Active Inquiries</span>
              <span className="text-2xl font-bold text-[#111111] font-mono block">
                {enquiries.filter((e) => e.status === 'new').length}
              </span>
              <span className="text-[11px] text-[#666666]">Pro-Bono Legal Desks</span>
            </div>

            <div className="p-5 bg-white border border-[#E2DDD5] rounded-xl space-y-1 shadow-2xs">
              <span className="text-xs text-[#666666] uppercase font-mono font-bold">Published Resources</span>
              <span className="text-2xl font-bold text-[#111111] font-mono block">{resources.length}</span>
              <span className="text-[11px] text-[#666666]">Supreme Court & HC Dossiers</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#E2DDD5] rounded-xl shadow-2xs">
            <h3 className="text-base font-bold text-[#111111] font-tamil-serif mb-4">
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setShowAddNewsModal(true)}
                className="p-4 bg-[#FAF8F5] border border-[#E2DDD5] hover:border-[#E31E24] rounded-lg text-left transition-all group"
              >
                <Plus className="w-5 h-5 text-[#E31E24] mb-2" />
                <span className="text-xs font-bold text-[#111111] block group-hover:text-[#E31E24]">Publish New Press Release</span>
                <span className="text-[11px] text-[#666666] mt-0.5 block">
                  Add official statement or court resolution
                </span>
              </button>

              <button
                onClick={() => setShowAddEventModal(true)}
                className="p-4 bg-[#FAF8F5] border border-[#E2DDD5] hover:border-[#E31E24] rounded-lg text-left transition-all group"
              >
                <Calendar className="w-5 h-5 text-[#E31E24] mb-2" />
                <span className="text-xs font-bold text-[#111111] block group-hover:text-[#E31E24]">Schedule Legal Conference</span>
                <span className="text-[11px] text-[#666666] mt-0.5 block">
                  Create upcoming seminar or legal clinic
                </span>
              </button>

              <button
                onClick={() => setShowAddResourceModal(true)}
                className="p-4 bg-[#FAF8F5] border border-[#E2DDD5] hover:border-[#E31E24] rounded-lg text-left transition-all group"
              >
                <BookOpen className="w-5 h-5 text-[#E31E24] mb-2" />
                <span className="text-xs font-bold text-[#111111] block group-hover:text-[#E31E24]">Upload Legal Judgment</span>
                <span className="text-[11px] text-[#666666] mt-0.5 block">
                  Add Supreme Court or Madras HC dossier
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADVOCATE REGISTRATIONS REVIEW */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Advocate Membership Applications ({registrations.length})
            </h3>
            <span className="text-xs text-[#666666]">
              Bar Council verification & admission
            </span>
          </div>

          <div className="bg-white border border-[#E2DDD5] rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#333333]">
                <thead className="bg-[#FAF8F5] text-[#555555] uppercase font-mono border-b border-[#E2DDD5] text-[11px]">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Bar Council No.</th>
                    <th className="p-3.5">District</th>
                    <th className="p-3.5">Court</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF]">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#FAF8F5]">
                      <td className="p-3.5 font-bold text-[#111111]">{reg.fullName}</td>
                      <td className="p-3.5 font-mono text-[#B81318] font-bold">{reg.barCouncilNumber}</td>
                      <td className="p-3.5">{reg.district}</td>
                      <td className="p-3.5">{reg.courtOfPractice}</td>
                      <td className="p-3.5">
                        <div className="font-mono text-[11px] font-bold">{reg.mobileNumber}</div>
                        <div className="text-[#777777] text-[10px]">{reg.emailAddress}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          reg.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : reg.status === 'verified'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {reg.status !== 'approved' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                          >
                            Approve
                          </button>
                        )}
                        {reg.status === 'pending' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'verified')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
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
        </div>
      )}

      {/* TAB 3: CITIZEN LEGAL AID INQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Citizen Legal Aid Inquiries ({enquiries.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-5 bg-white border border-[#E2DDD5] rounded-xl space-y-3 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#E31E24]">{enq.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      enq.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {enq.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#111111] font-tamil-serif">{enq.subject}</h4>
                  <p className="text-xs text-[#444444] mt-1.5 leading-relaxed">{enq.message}</p>
                </div>

                <div className="pt-3 border-t border-[#EAE6DF] text-xs text-[#555555] flex items-center justify-between">
                  <div>
                    <span className="text-[#111111] font-bold block">{enq.name} ({enq.district})</span>
                    <span className="font-mono text-[11px]">{enq.phone}</span>
                  </div>

                  {enq.status !== 'resolved' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'resolved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NEWS & PRESS RELEASES MANAGER */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Published Press Releases ({news.length})
            </h3>
            <button
              onClick={() => setShowAddNewsModal(true)}
              className="px-4 py-2 bg-[#E31E24] hover:bg-[#B81318] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Press Release</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white border border-[#E2DDD5] rounded-xl flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#666666] font-mono mb-2">
                    <span className="text-[#E31E24] font-bold">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#111111] font-tamil-serif line-clamp-2 mb-2">
                    {item.title[language]}
                  </h4>
                  <p className="text-xs text-[#555555] line-clamp-3">
                    {item.summary[language]}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#EAE6DF] flex items-center justify-between text-xs">
                  <span className="text-[#777777] text-[11px]">Authorised</span>
                  <button
                    onClick={() => deleteNews(item.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete News"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EVENTS MANAGER */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Conferences & Events ({events.length})
            </h3>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 bg-[#E31E24] hover:bg-[#B81318] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 bg-white border border-[#E2DDD5] rounded-xl flex items-start justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#666666]">
                    <span className="text-[#E31E24] font-bold">{evt.category}</span>
                    <span>•</span>
                    <span>{evt.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#111111] font-tamil-serif">
                    {evt.title[language]}
                  </h4>
                  <p className="text-xs text-[#555555]">
                    {evt.venue[language]}
                  </p>
                </div>

                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RESOURCES MANAGER */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Constitutional & Legal Dossiers ({resources.length})
            </h3>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="px-4 py-2 bg-[#E31E24] hover:bg-[#B81318] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource Dossier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-5 bg-white border border-[#E2DDD5] rounded-xl flex items-start justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#E31E24] font-bold">
                    {res.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#111111] font-tamil-serif">
                    {res.title[language]}
                  </h4>
                  {res.citation && (
                    <span className="text-[11px] font-mono text-[#666666] block">
                      {res.citation}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => deleteResource(res.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEWS */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C5BEB3] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Publish New Press Release
            </h3>
            <form onSubmit={handleCreateNews} className="space-y-3 text-xs">
              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Headline (English) *</label>
                <input
                  type="text"
                  required
                  value={newNewsTitleEn}
                  onChange={(e) => setNewNewsTitleEn(e.target.value)}
                  placeholder="Supreme Court affirms State legislative supremacy..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                />
              </div>

              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Headline (Tamil)</label>
                <input
                  type="text"
                  value={newNewsTitleTa}
                  onChange={(e) => setNewNewsTitleTa(e.target.value)}
                  placeholder="உச்ச நீதிமன்றம் வரலாற்றுத் தீர்ப்பு..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                />
              </div>

              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Category</label>
                <select
                  value={newNewsCategory}
                  onChange={(e) => setNewNewsCategory(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                >
                  <option value="Press Release">Press Release</option>
                  <option value="Statement">Official Statement</option>
                  <option value="Resolution">Assembly Resolution</option>
                  <option value="Media">Media Coverage</option>
                </select>
              </div>

              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Summary (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={newNewsSummaryEn}
                  onChange={(e) => setNewNewsSummaryEn(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2 bg-[#FAF8F5] border border-[#E2DDD5] text-[#555555] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E31E24] hover:bg-[#B81318] text-white rounded font-bold uppercase"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C5BEB3] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Schedule New Conference / Event
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Event Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newEventTitleEn}
                  onChange={(e) => setNewEventTitleEn(e.target.value)}
                  placeholder="State Advocates Summit 2026..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#333333] block mb-1 font-semibold">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                  >
                    <option value="Conference">State Conference</option>
                    <option value="Seminar">Constitutional Seminar</option>
                    <option value="Legal Awareness">Pro-Bono Legal Clinic</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#333333] block mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Venue</label>
                <input
                  type="text"
                  value={newEventVenueEn}
                  onChange={(e) => setNewEventVenueEn(e.target.value)}
                  placeholder="Kalaignar Arangam, Anna Arivalayam, Chennai"
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-[#FAF8F5] border border-[#E2DDD5] text-[#555555] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E31E24] hover:bg-[#B81318] text-white rounded font-bold uppercase"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RESOURCE */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C5BEB3] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#111111] font-tamil-serif">
              Upload Legal Resource / Judgment
            </h3>
            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newResTitleEn}
                  onChange={(e) => setNewResTitleEn(e.target.value)}
                  placeholder="Supreme Court Ruling on Federal Quotas..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#333333] block mb-1 font-semibold">Category</label>
                  <select
                    value={newResCategory}
                    onChange={(e) => setNewResCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                  >
                    <option value="Supreme Court">Supreme Court of India</option>
                    <option value="High Court">Madras High Court</option>
                    <option value="Constitution">Constitutional Report</option>
                    <option value="Statute">State Statute</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#333333] block mb-1 font-semibold">Citation (Optional)</label>
                  <input
                    type="text"
                    value={newResCitation}
                    onChange={(e) => setNewResCitation(e.target.value)}
                    placeholder="AIR 2024 SC 1120"
                    className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#333333] block mb-1 font-semibold">Executive Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={newResSummaryEn}
                  onChange={(e) => setNewResSummaryEn(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CEC4] rounded p-2 text-[#111111]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 bg-[#FAF8F5] border border-[#E2DDD5] text-[#555555] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E31E24] hover:bg-[#B81318] text-white rounded font-bold uppercase"
                >
                  Upload Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
