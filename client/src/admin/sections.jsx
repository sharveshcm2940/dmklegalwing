import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, fileUrl } from '../api.js';
import Manager from './Manager.jsx';
import { adm, nowLocal, uploadFile } from './util.js';

const day = (v) => (v ? String(v).slice(0, 10) : '');
const yesNo = (v) => (v ? 'Yes' : 'No');
const short = (v) => (v && v.length > 65 ? v.slice(0, 65) + '…' : v);

const STATUS_OPTS = [
  ['draft', 'Draft'],
  ['in_review', 'In Review'],
  ['pending_confirmation', 'Pending Confirmation'],
  ['approved', 'Approved'],
  ['scheduled', 'Scheduled'],
  ['published', 'Published'],
  ['archived', 'Archived'],
  ['withdrawn', 'Withdrawn (Legal)'],
];

const ACTOR_OPTS = [
  ['wing', 'Legal Wing'],
  ['party', 'DMK Party'],
  ['stalin', 'M. K. Stalin (Personal)'],
  ['tn_govt_pre_2026', 'TN Govt (2021–2026)'],
  ['counsel', 'Wing Member as Counsel'],
];

const CAT_OPTS = [
  ['Legal aid and helplines', 'Legal aid and helplines'],
  ['Court interventions', 'Court interventions'],
  ['Protests and agitations', 'Protests and agitations'],
  ['Conferences and round-tables', 'Conferences and round-tables'],
  ['Representations and memoranda', 'Representations and memoranda'],
  ['Election and electoral-roll support', 'Election and electoral-roll support'],
  ['Advocate welfare and training', 'Advocate welfare and training'],
  ['Felicitations', 'Felicitations'],
  ['Statements', 'Statements'],
];

const isPub = (a) => a && (a.role === 'publisher' || a.role === 'super_admin');
const isSuper = (a) => a && a.role === 'super_admin';

export function NewsAdmin({ admin }) {
  return (
    <Manager
      title="News & Statements"
      endpoint="news"
      supportsTrash
      canDelete={isPub(admin)}
      isSuperAdmin={isSuper(admin)}
      defaults={{ status: 'draft', source_type: 'own_statement', actor: 'wing', published_at: nowLocal() }}
      columns={[
        { key: 'title', label: 'Headline (EN)', render: short },
        { key: 'actor', label: 'Actor' },
        { key: 'status', label: 'Status' },
        { key: 'legal_reviewed', label: 'Legal OK', render: yesNo },
        { key: 'published_at', label: 'Date', render: day },
      ]}
      fields={[
        { name: 'title', label: 'Headline (English)', type: 'text', required: true },
        { name: 'title_ta', label: 'Headline (Tamil)', type: 'text', help: 'Tamil field strongly recommended before publish.' },
        { name: 'slug', label: 'Short URL Slug (Latin/transliterated)', type: 'text', help: 'Keep Latin characters for clean WhatsApp sharing.' },
        { name: 'source_type', label: 'Source Type', type: 'select', options: [['own_statement', 'Own Statement'], ['press_release', 'Press Release'], ['external_coverage', 'External Coverage (Link-Out)']] },
        { name: 'actor', label: 'Who Acted', type: 'select', options: ACTOR_OPTS },
        { name: 'outlet_name', label: 'Outlet Name (if external coverage)', type: 'text' },
        { name: 'external_url', label: 'External URL (headline link-out only)', type: 'url' },
        { name: 'dateline', label: 'Dateline', type: 'text' },
        { name: 'district_tag', label: 'District Tag', type: 'text' },
        { name: 'summary', label: 'Summary (English)', type: 'textarea', rows: 2 },
        { name: 'summary_ta', label: 'Summary (Tamil)', type: 'textarea', rows: 2 },
        { name: 'body', label: 'Body (English)', type: 'textarea', rows: 8, required: true },
        { name: 'body_ta', label: 'Body (Tamil)', type: 'textarea', rows: 8 },
        { name: 'cover_image', label: 'Cover Image', type: 'image' },
        { name: 'pinned', label: 'Pin to top', type: 'checkbox' },
        { name: 'legal_reviewed', label: 'Legal review completed (required for non-wing / sensitive items)', type: 'checkbox' },
        { name: 'legal_reviewed_by', label: 'Legal Reviewer Name', type: 'text' },
        { name: 'status', label: 'Workflow Status', type: 'select', options: STATUS_OPTS },
        { name: 'published_at', label: 'Publish Date/Time', type: 'datetime' },
        { name: 'publish_at', label: 'Scheduled Start (optional)', type: 'datetime' },
        { name: 'unpublish_at', label: 'Scheduled End (optional)', type: 'datetime' },
      ]}
    />
  );
}

export function ActivitiesAdmin({ admin }) {
  return (
    <Manager
      title="Activities (Actor-Tagged)"
      endpoint="activities"
      supportsTrash
      canDelete={isPub(admin)}
      isSuperAdmin={isSuper(admin)}
      defaults={{ status: 'draft', actor: 'wing', category: 'Court interventions' }}
      columns={[
        { key: 'title', label: 'Title', render: short },
        { key: 'actor', label: 'Actor' },
        { key: 'category', label: 'Category' },
        { key: 'event_date', label: 'Date', render: day },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'title', label: 'Title (English)', type: 'text', required: true },
        { name: 'title_ta', label: 'Title (Tamil)', type: 'text' },
        { name: 'actor', label: 'Who Acted (Mandatory)', type: 'select', options: ACTOR_OPTS },
        { name: 'category', label: 'Category', type: 'select', options: CAT_OPTS },
        { name: 'event_date', label: 'Start Date', type: 'date', required: true },
        { name: 'end_date', label: 'End Date (optional)', type: 'date' },
        { name: 'location', label: 'Place (English)', type: 'text' },
        { name: 'location_ta', label: 'Place (Tamil)', type: 'text' },
        { name: 'district_tag', label: 'Revenue District Tag', type: 'text' },
        { name: 'court_name', label: 'Court / Forum', type: 'text' },
        { name: 'case_number', label: 'Case / WP Number', type: 'text' },
        { name: 'case_stage', label: 'Stage / Outcome', type: 'text' },
        { name: 'sub_judice', label: 'Sub Judice (requires Legal Review before publishing)', type: 'checkbox' },
        { name: 'court_order_summary', label: 'Actual Court Order / Procedural Fact', type: 'textarea', rows: 3 },
        { name: 'party_allegations', label: 'Party Allegations / Position (separate from court order)', type: 'textarea', rows: 3 },
        { name: 'participants', label: 'Participants & Designations', type: 'text' },
        { name: 'description', label: 'Details (English)', type: 'textarea', rows: 5 },
        { name: 'description_ta', label: 'Details (Tamil)', type: 'textarea', rows: 5 },
        { name: 'source_note', label: 'Source Attribution & Date', type: 'text' },
        { name: 'legal_reviewed', label: 'Legal review completed', type: 'checkbox' },
        { name: 'legal_reviewed_by', label: 'Legal Reviewer Name', type: 'text' },
        { name: 'status', label: 'Workflow Status', type: 'select', options: STATUS_OPTS },
      ]}
    />
  );
}

export function ResourcesAdmin({ admin }) {
  return (
    <Manager
      title="Legal Resources"
      endpoint="resources"
      supportsTrash
      canDelete={isPub(admin)}
      isSuperAdmin={isSuper(admin)}
      defaults={{ category: 'Constitution & Statutes', language_badge: 'en', status: 'draft', source_verified: true }}
      columns={[
        { key: 'title', label: 'Title', render: short },
        { key: 'category', label: 'Category' },
        { key: 'language_badge', label: 'Language' },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'title', label: 'Title (English)', type: 'text', required: true },
        { name: 'title_ta', label: 'Title (Tamil)', type: 'text' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'resource_type', label: 'Resource Type', type: 'text' },
        { name: 'language_badge', label: 'Language Badge', type: 'select', options: [['ta', 'Tamil Only'], ['en', 'English Only'], ['both', 'Tamil & English'], ['en_with_ta_summary', 'English (+ Unofficial TA Summary)']] },
        { name: 'court_or_forum', label: 'Court / Forum', type: 'text' },
        { name: 'citation', label: 'Citation', type: 'text' },
        { name: 'bench', label: 'Bench', type: 'text' },
        { name: 'description', label: 'Neutral Summary (English)', type: 'textarea', rows: 4 },
        { name: 'description_ta', label: 'Neutral Summary (Tamil)', type: 'textarea', rows: 4 },
        { name: 'later_developments', label: 'Later Developments (English)', type: 'textarea', rows: 3 },
        { name: 'later_developments_ta', label: 'Later Developments (Tamil)', type: 'textarea', rows: 3 },
        { name: 'external_url', label: 'Official External URL', type: 'url' },
        { name: 'file_url', label: 'PDF Attachment', type: 'pdf' },
        { name: 'source_verified', label: 'Direct Link Checked & Verified', type: 'checkbox' },
        { name: 'last_reviewed', label: 'Last Reviewed Date', type: 'text' },
        { name: 'review_owner', label: 'Review Owner', type: 'text' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTS },
      ]}
    />
  );
}

export function BearersAdmin({ admin }) {
  return (
    <Manager
      title="Office Bearers (Office Contacts & Consent Required)"
      endpoint="bearers"
      supportsTrash
      canDelete={isPub(admin)}
      isSuperAdmin={isSuper(admin)}
      intro="Compliance rule: Written consent is required before switching status to Published. Publish office contacts only — never residence addresses."
      defaults={{ group_key: 'joint', status: 'pending_confirmation', consent_obtained: false, sort_order: 100 }}
      columns={[
        { key: 'name_en', label: 'Name' },
        { key: 'role_en', label: 'Role', render: short },
        { key: 'consent_obtained', label: 'Consent', render: yesNo },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'group_key', label: 'Group', type: 'select', options: [['head', 'President'], ['secretary', 'Secretary'], ['joint', 'Joint Secretaries'], ['deputy', 'Deputy Secretaries'], ['hq', 'Headquarters Advocates']] },
        { name: 'name_en', label: 'Name (English)', type: 'text', required: true },
        { name: 'name_ta', label: 'Name (Tamil)', type: 'text', required: true },
        { name: 'role_en', label: 'Role (English)', type: 'text' },
        { name: 'role_ta', label: 'Role (Tamil)', type: 'text' },
        { name: 'place_en', label: 'Place (English)', type: 'text' },
        { name: 'place_ta', label: 'Place (Tamil)', type: 'text' },
        { name: 'office_email', label: 'Office Email (no personal email)', type: 'email' },
        { name: 'phone', label: 'Office Phone (no personal residence number)', type: 'text' },
        { name: 'bar_enrolment', label: 'Bar Enrolment (optional)', type: 'text' },
        { name: 'photo', label: 'Portrait Photo (requires consent)', type: 'image' },
        { name: 'consent_obtained', label: 'Written Consent Obtained for Publication', type: 'checkbox' },
        { name: 'confirmed_by_wing_on', label: 'Confirmed by Wing On', type: 'date' },
        { name: 'source_note', label: 'Verification / Conflict Note', type: 'text' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTS },
        { name: 'sort_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}

export function DistrictsAdmin({ admin }) {
  return (
    <Manager
      title="Party Organisational Districts (77 → 110 Restructuring)"
      endpoint="districts"
      supportsTrash
      canDelete={isPub(admin)}
      isSuperAdmin={isSuper(admin)}
      intro="Editable party district list linked to the 38 revenue districts. Legacy pre-2026 rows stay 'pending_confirmation' until confirmed."
      defaults={{ status: 'pending_confirmation', high_court_seat: 'Chennai', sort_order: 100 }}
      columns={[
        { key: 'name', label: 'Party District' },
        { key: 'revenue_district_name', label: 'Revenue District' },
        { key: 'high_court_seat', label: 'HC Seat' },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'name', label: 'Party District (English)', type: 'text', required: true },
        { name: 'name_ta', label: 'Party District (Tamil)', type: 'text' },
        { name: 'revenue_district_name', label: 'Linked Revenue District', type: 'text' },
        { name: 'high_court_seat', label: 'Madras HC Seat', type: 'select', options: [['Chennai', 'Chennai Principal Seat'], ['Madurai', 'Madurai Bench']] },
        { name: 'assembly_constituencies', label: 'Assembly Constituencies', type: 'text' },
        { name: 'organiser', label: 'Organiser Name (English)', type: 'text' },
        { name: 'organiser_ta', label: 'Organiser Name (Tamil)', type: 'text' },
        { name: 'deputies', label: 'Deputies', type: 'text' },
        { name: 'office_address', label: 'Party District Office Address', type: 'text' },
        { name: 'phone', label: 'Office Contact', type: 'text' },
        { name: 'principal_court', label: 'Principal Court & Complex', type: 'text' },
        { name: 'bar_associations', label: 'Local Bar Associations', type: 'text' },
        { name: 'confirmed_by_wing_on', label: 'Confirmed by Wing On', type: 'date' },
        { name: 'source_note', label: 'Source / Notes', type: 'text' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTS },
        { name: 'sort_order', label: 'Order', type: 'number' },
      ]}
    />
  );
}

export function RevenueDistrictsAdmin() {
  return (
    <Manager
      title="Tamil Nadu Revenue Districts (38)"
      endpoint="revenue_districts"
      canDelete={false}
      defaults={{ high_court_seat: 'Chennai', region: 'Tamil Nadu', sort_order: 50 }}
      columns={[
        { key: 'name_en', label: 'District (EN)' },
        { key: 'name_ta', label: 'District (TA)' },
        { key: 'high_court_seat', label: 'HC Seat' },
        { key: 'region', label: 'Region' },
      ]}
      fields={[
        { name: 'name_en', label: 'Name (English)', type: 'text', required: true },
        { name: 'name_ta', label: 'Name (Tamil)', type: 'text', required: true },
        { name: 'high_court_seat', label: 'High Court Seat', type: 'select', options: [['Chennai', 'Chennai Principal Seat'], ['Madurai', 'Madurai Bench']] },
        { name: 'region', label: 'Region', type: 'text' },
        { name: 'sort_order', label: 'Order', type: 'number' },
      ]}
    />
  );
}

export function CountersAdmin() {
  return (
    <Manager
      title="Dated Home Counters"
      endpoint="counters"
      intro="Every counter must carry an explicit 'as of' date and source attribution. Never publish case counts or win rates."
      defaults={{ status: 'published', sort_order: 10 }}
      columns={[
        { key: 'label_en', label: 'Label' },
        { key: 'value_text', label: 'Value' },
        { key: 'as_of_date', label: 'As Of Date' },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'key', label: 'Unique Key', type: 'text', required: true },
        { name: 'label_en', label: 'Label (English)', type: 'text', required: true },
        { name: 'label_ta', label: 'Label (Tamil)', type: 'text', required: true },
        { name: 'value_text', label: 'Display Value', type: 'text', required: true },
        { name: 'as_of_date', label: 'As Of Date (mandatory)', type: 'text', required: true },
        { name: 'source_note', label: 'Source Attribution', type: 'text' },
        { name: 'status', label: 'Status', type: 'select', options: [['published', 'Published'], ['pending_confirmation', 'Pending Confirmation']] },
        { name: 'sort_order', label: 'Order', type: 'number' },
      ]}
    />
  );
}

export function PagesAdmin() {
  return (
    <Manager
      title="Editable Page Text"
      endpoint="pages"
      canAdd={false}
      canDelete={false}
      columns={[{ key: 'key', label: 'Page' }, { key: 'title_en', label: 'Title' }, { key: 'body_en', label: 'Text', render: short }]}
      fields={[
        { name: 'title_en', label: 'Title (English)', type: 'text' },
        { name: 'title_ta', label: 'Title (Tamil)', type: 'text' },
        { name: 'body_en', label: 'Body (English)', type: 'textarea', rows: 10 },
        { name: 'body_ta', label: 'Body (Tamil)', type: 'textarea', rows: 10 },
      ]}
    />
  );
}

export function GalleryAdmin({ admin }) {
  return (
    <Manager
      title="Gallery Albums (Courtroom Photography Excluded)"
      endpoint="albums"
      supportsTrash
      canDelete={isPub(admin)}
      isSuperAdmin={isSuper(admin)}
      defaults={{ status: 'draft', category: 'Wing conferences' }}
      columns={[
        { key: 'title', label: 'Album' },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status' },
        { key: 'image_count', label: 'Cleared Media' },
      ]}
      fields={[
        { name: 'title', label: 'Title (English)', type: 'text', required: true },
        { name: 'title_ta', label: 'Title (Tamil)', type: 'text' },
        { name: 'category', label: 'Event Category', type: 'select', options: [['Wing conferences', 'Wing conferences'], ['Helplines', 'Helplines'], ['Court-related protests', 'Court-related protests (outside premises only)'], ['Memorial days', 'Memorial days'], ['Press meets', 'Press meets']] },
        { name: 'event_date', label: 'Event Date', type: 'date' },
        { name: 'place', label: 'Place', type: 'text' },
        { name: 'district_tag', label: 'District Tag', type: 'text' },
        { name: 'status', label: 'Visibility', type: 'select', options: [['draft', 'Draft'], ['published', 'Published'], ['embargo', 'Embargoed']] },
      ]}
      rowActions={(row) => <Link className="link-btn" to={`/admin/gallery/${row.id}`}>Media Compliance</Link>}
    />
  );
}

export function AlbumPhotos() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adm('/images?album_id=' + encodeURIComponent(id));
      const albRes = await adm('/albums');
      const found = albRes.items.find((a) => String(a.id) === String(id));
      setAlbum({ ...(found || { title: 'Album' }), images: res.items });
      setError('');
    } catch (e) { setError(e.message); }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const addPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setBusy(true); setError('');
    try {
      for (const f of files) {
        const url = await uploadFile(f, 'image');
        await adm('/images', {
          method: 'POST',
          body: {
            album_id: Number(id),
            image_url: url,
            licence_type: 'own',
            credit_line: 'DMK Legal Wing (verify assignment)',
            courtroom_check_passed: false,
          },
        });
      }
    } catch (ex) { setError(ex.message); }
    setBusy(false);
    load();
  };

  const updateMeta = async (img, patch) => {
    try {
      await adm(`/images/${img.id}`, { method: 'PUT', body: patch });
      load();
    } catch (ex) { setError(ex.message); }
  };

  const toggleTakedown = async (img) => {
    const next = img.takedown_status === 'hidden' ? 'none' : 'hidden';
    try {
      await adm(`/images/${img.id}/takedown`, { method: 'POST', body: { takedown_status: next } });
      load();
    } catch (ex) { setError(ex.message); }
  };

  return (
    <section>
      <p className="back"><Link to="/admin/gallery">All albums</Link></p>
      <div className="adm-head"><h1>{album ? album.title : 'Album'} — Media Compliance</h1></div>
      <p className="hint">Images appear publicly ONLY when “Non-courtroom check passed” is ticked, credit & licence are set, and Takedown is None.</p>
      <label className="field">
        <span className="field-label">Upload photos (max 10 MB each)</span>
        <input type="file" accept="image/*" multiple onChange={addPhotos} disabled={busy} />
      </label>
      {error ? <p className="form-msg form-error" role="alert">{error}</p> : null}
      <ul className="adm-photos">
        {album && album.images.map((img) => (
          <li key={img.id}>
            <img src={fileUrl(img.image_url)} alt="" />
            <input defaultValue={img.caption} placeholder="Caption (EN)" onBlur={(e) => e.target.value !== img.caption && updateMeta(img, { caption: e.target.value })} />
            <input defaultValue={img.credit_line} placeholder="Credit line" onBlur={(e) => e.target.value !== img.credit_line && updateMeta(img, { credit_line: e.target.value })} />
            <label className="check">
              <input type="checkbox" checked={!!img.courtroom_check_passed} onChange={(e) => updateMeta(img, { courtroom_check_passed: e.target.checked })} />
              <span>Non-courtroom check passed</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={!!img.people_consent} onChange={(e) => updateMeta(img, { people_consent: e.target.checked })} />
              <span>People consent / public event</span>
            </label>
            <div className="row-actions">
              <button type="button" className="link-btn" onClick={() => toggleTakedown(img)}>
                {img.takedown_status === 'hidden' ? 'Clear Takedown' : 'Instant Takedown'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MessagesAdmin({ admin }) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  const load = useCallback(async () => {
    try { const r = await adm('/messages'); setItems(r.items); setState({ loading: false, error: '' }); }
    catch (e) { setState({ loading: false, error: e.message }); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (m) => {
    try { await adm(`/messages/${m.id}`, { method: 'PUT', body: { is_read: !m.is_read } }); load(); }
    catch (e) { setState({ loading: false, error: e.message }); }
  };
  const erasePII = async (m) => {
    if (!window.confirm('Erase personal data (name, email, phone, message) under DPDP? Audit log is retained.')) return;
    try { await adm(`/messages/${m.id}/erase`, { method: 'POST' }); load(); }
    catch (e) { setState({ loading: false, error: e.message }); }
  };

  return (
    <section>
      <div className="adm-head"><h1>Messages, Helpdesk & DPDP Erasure Queue</h1></div>
      {state.loading ? <p className="status">Loading…</p> : state.error ? <p className="status status-error">{state.error}</p> : items.length === 0 ? <p className="status">No messages yet.</p> : (
        <ul className="msg-list">
          {items.map((m) => (
            <li key={m.id} className={m.is_read ? '' : 'unread'}>
              <div className="msg-top">
                <strong>#{m.id} · {m.name} ({m.inquiry_type})</strong>
                <span>{new Date(m.created_at).toLocaleString()} · Retain until: {m.retention_until || '—'}</span>
              </div>
              <p className="msg-contact">{[m.district, m.phone, m.email].filter(Boolean).join(' · ')} · DPDP Consent: {m.dpdp_consent ? 'Yes' : 'No'}</p>
              <p className="msg-body">{m.message}</p>
              <div className="row-actions">
                <button type="button" className="link-btn" onClick={() => toggle(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                {isPub(admin) && m.status !== 'erased' ? (
                  <button type="button" className="link-btn danger" onClick={() => erasePII(m)}>DPDP Erase PII</button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ChecklistAdmin({ admin }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const load = useCallback(async () => {
    try { const r = await adm('/checklist'); setItems(r.items); } catch (e) { setErr(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const saveItem = async (item, status, client_response) => {
    try {
      await adm(`/checklist/${item.id}`, { method: 'PUT', body: { status, client_response } });
      load();
    } catch (e) { setErr(e.message); }
  };

  return (
    <section>
      <div className="adm-head"><h1>Pre-Launch Client Checklist (25 Items)</h1></div>
      <p className="hint">Track written client confirmations before lifting pre-launch holds.</p>
      {err ? <p className="form-msg form-error">{err}</p> : null}
      <div className="table-scroll">
        <table className="adm-table">
          <thead><tr><th>#</th><th>Item</th><th>Why</th><th>Status</th><th>Client Sign-Off / Note</th></tr></thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td><strong>{it.item_no}</strong></td>
                <td>{it.title}</td>
                <td>{it.why}</td>
                <td>
                  <select
                    disabled={!isPub(admin)}
                    value={it.status}
                    onChange={(e) => saveItem(it, e.target.value, it.client_response)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="omitted">Omitted</option>
                  </select>
                </td>
                <td>
                  <input
                    disabled={!isPub(admin)}
                    defaultValue={it.client_response}
                    placeholder="Record written confirmation ref…"
                    onBlur={(e) => e.target.value !== it.client_response && saveItem(it, it.status, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SettingsAdmin() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => {
    const r = await adm('/settings');
    setItems(r.items);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (key, value) => {
    await adm(`/settings/${key}`, { method: 'PUT', body: { value } });
    setMsg(`Saved ${key}`);
    load();
  };

  return (
    <section>
      <div className="adm-head"><h1>Site Settings & Election Mode</h1></div>
      {msg ? <p className="notice">{msg}</p> : null}
      <div className="adm-form" style={{ maxWidth: 920 }}>
        {items.map((s) => (
          <div key={s.key} className="field">
            <span className="field-label">{s.key}</span>
            <span className="hint">{s.description}</span>
            {s.key === 'election_mode' || s.key === 'sir_helpline_confirmed' ? (
              <select value={s.value} onChange={(e) => save(s.key, e.target.value)}>
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
            ) : (
              <input defaultValue={s.value} onBlur={(e) => e.target.value !== s.value && save(s.key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function AuditAdmin() {
  const [items, setItems] = useState([]);
  useEffect(() => { adm('/audit').then((r) => setItems(r.items)).catch(() => {}); }, []);
  return (
    <section>
      <div className="adm-head"><h1>Immutable Audit Log (1-Year Retention)</h1></div>
      <div className="table-scroll">
        <table className="adm-table">
          <thead><tr><th>When (UTC)</th><th>Actor</th><th>Action</th><th>Resource</th><th>IP</th><th>Diff</th></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{String(a.created_at).slice(0, 19).replace('T', ' ')}</td>
                <td>{a.actor_email || 'public'} ({a.actor_role || 'visitor'})</td>
                <td><strong>{a.action}</strong></td>
                <td>{a.resource} #{a.resource_id}</td>
                <td>{a.ip_address}</td>
                <td className="hint">{short(a.after_json || a.before_json)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function UsersAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor', district_scope: '' });
  const [msg, setMsg] = useState('');
  const load = useCallback(() => adm('/users').then((r) => setItems(r.items)), []);
  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    try {
      await adm('/users', { method: 'POST', body: form });
      setForm({ name: '', email: '', password: '', role: 'editor', district_scope: '' });
      setMsg('Admin account created.');
      load();
    } catch (ex) { setMsg(ex.message); }
  };

  return (
    <section>
      <div className="adm-head"><h1>Admin Users & RBAC Roles</h1></div>
      {msg ? <p className="notice">{msg}</p> : null}
      <form className="adm-form" onSubmit={create}>
        <h2>Create Editor / Publisher</h2>
        <label className="field"><span className="field-label">Name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="field"><span className="field-label">Email</span><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="field"><span className="field-label">Password (min 10 chars)</span><input type="password" minLength={10} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label className="field"><span className="field-label">Role</span>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="district_editor">District Editor (scoped)</option>
            <option value="editor">Editor (draft/review only)</option>
            <option value="publisher">Publisher / Legal Reviewer</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </label>
        <label className="field"><span className="field-label">District Scope (for District Editors)</span><input value={form.district_scope} onChange={(e) => setForm({ ...form, district_scope: e.target.value })} /></label>
        <button className="btn" type="submit">Create user</button>
      </form>
      <div className="table-scroll">
        <table className="adm-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Scope</th><th>2FA</th><th>Active</th></tr></thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.district_scope || 'All'}</td>
                <td>{yesNo(u.totp_enabled)}</td><td>{yesNo(u.is_active)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SecurityAdmin({ admin, onUpdateAdmin }) {
  const [form, setForm] = useState({ current: '', new: '', again: '' });
  const [msg, setMsg] = useState({ ok: false, text: '' });
  const [setupData, setSetupData] = useState(null);
  const [totpCode, setTotpCode] = useState('');

  const submitPwd = async (e) => {
    e.preventDefault();
    if (form.new !== form.again) { setMsg({ ok: false, text: 'The two new passwords do not match.' }); return; }
    try {
      await adm('/password', { method: 'POST', body: { current: form.current, new: form.new } });
      setForm({ current: '', new: '', again: '' });
      setMsg({ ok: true, text: 'Password changed.' });
    } catch (ex) { setMsg({ ok: false, text: ex.message }); }
  };

  const start2FA = async () => {
    try { setSetupData(await adm('/2fa/setup', { method: 'POST' })); }
    catch (ex) { setMsg({ ok: false, text: ex.message }); }
  };

  const enable2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await adm('/2fa/enable', { method: 'POST', body: { code: totpCode } });
      onUpdateAdmin(res.admin);
      setSetupData(null); setTotpCode('');
      setMsg({ ok: true, text: 'TOTP Two-Factor Authentication enabled.' });
    } catch (ex) { setMsg({ ok: false, text: ex.message }); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <section>
      <div className="adm-head"><h1>Security: TOTP 2FA & Password</h1></div>
      {msg.text ? <p className={`form-msg ${msg.ok ? 'form-ok' : 'form-error'}`} role="status">{msg.text}</p> : null}

      <div className="adm-form">
        <h2>Two-Factor Authentication (TOTP)</h2>
        <p>Current status: <strong>{admin.totp_enabled ? 'Enabled' : 'Not enabled yet'}</strong></p>
        {!admin.totp_enabled && !setupData ? (
          <button type="button" className="btn" onClick={start2FA}>Set up Authenticator App (TOTP)</button>
        ) : null}
        {setupData ? (
          <form onSubmit={enable2FA} style={{ marginTop: 16 }}>
            <p className="hint">Add this secret key manually in Google Authenticator / 1Password / Aegis:</p>
            <p><code>{setupData.secret}</code></p>
            <p className="hint" style={{ wordBreak: 'break-all' }}>URI: {setupData.otpauth_uri}</p>
            <label className="field"><span className="field-label">Enter 6-digit code to activate</span>
              <input required maxLength={6} value={totpCode} onChange={(e) => setTotpCode(e.target.value)} /></label>
            <button type="submit" className="btn">Verify & Enable 2FA</button>
          </form>
        ) : null}
      </div>

      <form className="adm-form" onSubmit={submitPwd}>
        <h2>Change Password (min 10 characters)</h2>
        <label className="field"><span className="field-label">Current password</span><input type="password" required value={form.current} onChange={set('current')} /></label>
        <label className="field"><span className="field-label">New password</span><input type="password" minLength={10} required value={form.new} onChange={set('new')} /></label>
        <label className="field"><span className="field-label">New password again</span><input type="password" required value={form.again} onChange={set('again')} /></label>
        <div className="adm-actions"><button className="btn" type="submit">Update password</button></div>
      </form>
    </section>
  );
}

export function Dashboard({ admin }) {
  const [s, setS] = useState(null);
  useEffect(() => { adm('/stats').then(setS).catch(() => setS(null)); }, []);
  const rows = s ? [
    ['/admin/checklist', `Pre-launch confirmed (${s.checklist_confirmed}/${s.checklist_total})`, s.checklist_total - s.checklist_confirmed + ' left'],
    ['/admin/bearers', 'Bearers pending confirmation', s.pending_bearers],
    ['/admin/districts', 'Districts pending confirmation', s.pending_districts],
    ['/admin/news', 'News items', s.news],
    ['/admin/activities', 'Activities', s.activities],
    ['/admin/resources', 'Legal resources', s.resources],
    ['/admin/gallery', 'Gallery albums', s.albums],
    ['/admin/messages', 'Unread messages / requests', s.unread],
  ] : [];
  return (
    <section>
      <div className="adm-head"><h1>Dashboard ({admin.role})</h1></div>
      {s && s.election_mode ? <p className="form-msg form-error">Election Mode (MCC) is currently ON.</p> : null}
      <p>Verified public content is strictly separated from unconfirmed pre-launch items.</p>
      <ul className="dash-list">
        {rows.map(([to, label, n]) => <li key={to}><Link to={to}><span className="dash-n">{n}</span><span>{label}</span></Link></li>)}
      </ul>
    </section>
  );
}
