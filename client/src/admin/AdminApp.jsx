import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { api } from '../api.js';
import {
  ActivitiesAdmin, AlbumPhotos, AuditAdmin, BearersAdmin, ChecklistAdmin,
  CountersAdmin, Dashboard, DistrictsAdmin, GalleryAdmin, MessagesAdmin,
  NewsAdmin, PagesAdmin, ResourcesAdmin, RevenueDistrictsAdmin, SecurityAdmin,
  SettingsAdmin, UsersAdmin,
} from './sections.jsx';

const BASE = import.meta.env.BASE_URL;

function Login({ onDone }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [totpStep, setTotpStep] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (totpStep) {
        const res = await api('/admin/login/totp', { method: 'POST', body: { totp_code: totpCode } });
        onDone(res.admin);
      } else {
        const res = await api('/admin/login', { method: 'POST', body: form });
        if (res.requires_totp) {
          setTotpStep(true);
        } else {
          onDone(res.admin);
        }
      }
    } catch (ex) { setError(ex.message); }
    setBusy(false);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <img src={`${BASE}logo.png`} alt="" width="72" height="64" />
        <h1>Admin sign in</h1>
        <p className="hint">DMK Legal Wing CMS (Governance & Verification)</p>
        {!totpStep ? (
          <>
            <label className="field"><span className="field-label">Email</span>
              <input type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="field"><span className="field-label">Password</span>
              <input type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          </>
        ) : (
          <label className="field"><span className="field-label">Authenticator 6-digit code</span>
            <input type="text" inputMode="numeric" autoComplete="one-time-code" required maxLength={6} value={totpCode} onChange={(e) => setTotpCode(e.target.value)} />
            <span className="hint">Enter the TOTP code from your authenticator app.</span>
          </label>
        )}
        {error ? <p className="form-msg form-error" role="alert">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : totpStep ? 'Verify 2FA' : 'Sign in'}</button>
        {totpStep ? <button type="button" className="link-btn" onClick={() => { setTotpStep(false); setTotpCode(''); }}>Back to password</button> : null}
        <p className="back"><Link to="/ta">Back to the website</Link></p>
      </form>
    </div>
  );
}

const MENU = [
  ['/admin', 'Dashboard', true, 'district_editor'],
  ['/admin/checklist', 'Pre-Launch Checklist (25)', false, 'district_editor'],
  ['/admin/news', 'News & Statements', false, 'district_editor'],
  ['/admin/activities', 'Activities (Actor Tagged)', false, 'district_editor'],
  ['/admin/resources', 'Legal Resources', false, 'editor'],
  ['/admin/gallery', 'Gallery & Compliance', false, 'district_editor'],
  ['/admin/bearers', 'Office Bearers', false, 'editor'],
  ['/admin/districts', 'Party Districts (110)', false, 'editor'],
  ['/admin/revenue-districts', 'Revenue Districts (38)', false, 'publisher'],
  ['/admin/counters', 'Dated Counters', false, 'publisher'],
  ['/admin/pages', 'Page Text', false, 'editor'],
  ['/admin/messages', 'Messages & DPDP Queue', false, 'editor'],
  ['/admin/settings', 'Settings & Election Mode', false, 'publisher'],
  ['/admin/audit', 'Immutable Audit Log', false, 'publisher'],
  ['/admin/users', 'Admin Users & Roles', false, 'super_admin'],
  ['/admin/security', '2FA & Password', false, 'district_editor'],
];

const RANK = { district_editor: 1, editor: 2, publisher: 3, super_admin: 4 };

function Shell({ admin, onLogout, onUpdateAdmin }) {
  const logout = async () => {
    try { await api('/admin/logout', { method: 'POST' }); } catch (e) { /* ignore */ }
    onLogout();
  };
  const visibleMenu = MENU.filter(([, , , minRole]) => (RANK[admin.role] || 0) >= (RANK[minRole] || 99));

  return (
    <div className="adm">
      <aside className="adm-side">
        <Link to="/admin" className="adm-brand"><img src={`${BASE}logo.png`} alt="" width="40" height="36" /><span>Legal Wing CMS</span></Link>
        <nav aria-label="Admin">
          <ul>
            {visibleMenu.map(([to, label, end]) => <li key={to}><NavLink to={to} end={!!end}>{label}</NavLink></li>)}
          </ul>
        </nav>
        <div className="adm-user">
          <strong>{admin.name}</strong>
          <span className="badge badge-muted">{admin.role}{admin.totp_enabled ? ' · 2FA On' : ''}</span>
          <Link to="/ta" target="_blank">View public site (TA)</Link>
          <button type="button" className="link-btn" onClick={logout}>Sign out</button>
        </div>
      </aside>
      <div className="adm-main">
        <Routes>
          <Route path="/" element={<Dashboard admin={admin} />} />
          <Route path="checklist" element={<ChecklistAdmin admin={admin} />} />
          <Route path="news" element={<NewsAdmin admin={admin} />} />
          <Route path="activities" element={<ActivitiesAdmin admin={admin} />} />
          <Route path="resources" element={<ResourcesAdmin admin={admin} />} />
          <Route path="gallery" element={<GalleryAdmin admin={admin} />} />
          <Route path="gallery/:id" element={<AlbumPhotos admin={admin} />} />
          <Route path="bearers" element={<BearersAdmin admin={admin} />} />
          <Route path="districts" element={<DistrictsAdmin admin={admin} />} />
          <Route path="revenue-districts" element={<RevenueDistrictsAdmin admin={admin} />} />
          <Route path="counters" element={<CountersAdmin admin={admin} />} />
          <Route path="pages" element={<PagesAdmin admin={admin} />} />
          <Route path="messages" element={<MessagesAdmin admin={admin} />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="audit" element={<AuditAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="security" element={<SecurityAdmin admin={admin} onUpdateAdmin={onUpdateAdmin} />} />
          <Route path="*" element={<p className="status">This admin page does not exist.</p>} />
        </Routes>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [admin, setAdmin] = useState(undefined);
  useEffect(() => {
    document.title = 'Admin CMS | DMK Legal Wing';
    api('/admin/me').then((d) => setAdmin(d.admin)).catch(() => setAdmin(null));
    const expired = () => setAdmin(null);
    window.addEventListener('lw-expired', expired);
    return () => window.removeEventListener('lw-expired', expired);
  }, []);
  if (admin === undefined) return <p className="status">Loading…</p>;
  if (!admin) return <Login onDone={setAdmin} />;
  return <Shell admin={admin} onLogout={() => setAdmin(null)} onUpdateAdmin={setAdmin} />;
}
