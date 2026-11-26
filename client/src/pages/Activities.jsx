import { useMemo, useState } from 'react';
import { ActorBadge, PageTitle, Status, VerificationBanner } from '../components.jsx';
import { fileUrl, useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

const ACTORS = [
  ['', 'All actors', 'அனைத்து தரப்பினர்'],
  ['wing', 'Legal Wing', 'சட்டத்துறை'],
  ['party', 'DMK Party', 'திமுக கழகம்'],
  ['stalin', 'M. K. Stalin (Personal)', 'மு. க. ஸ்டாலின் (தனிப்பட்ட)'],
  ['tn_govt_pre_2026', 'TN Govt (2021–2026)', 'தமிழ்நாடு அரசு (2021–2026)'],
  ['counsel', 'Wing Member as Counsel', 'வழக்கறிஞராக உறுப்பினர்'],
];

export function ActivityRow({ a }) {
  const { t, lang, pick, fmtDate } = useLang();
  return (
    <li className="activity">
      <time className="date-block" dateTime={a.event_date}>
        <span className="date-day">{fmtDate(a.event_date, { day: 'numeric' })}</span>
        <span className="date-month">{fmtDate(a.event_date, { month: 'short', year: 'numeric' })}</span>
      </time>
      <div className="activity-body">
        <div className="meta-row">
          <ActorBadge actor={a.actor} />
          <span className="badge badge-muted">{a.category}</span>
          {a.sub_judice ? <span className="badge badge-warn">{t('sub_judice_badge')}</span> : null}
        </div>
        <h3>{pick(a, 'title')}</h3>
        {pick(a, 'location') ? <p className="activity-place">{pick(a, 'location')}</p> : null}
        {a.court_name ? (
          <p className="activity-court">
            <strong>{a.court_name}</strong>
            {a.case_number ? ` · ${a.case_number}` : ''}
            {a.case_stage ? ` · ${a.case_stage}` : ''}
          </p>
        ) : null}
        {pick(a, 'description') ? <p>{pick(a, 'description')}</p> : null}
        {a.participants ? (
          <p className="hint-text"><strong>{lang === 'ta' ? 'பங்கேற்பு:' : 'Participants:'}</strong> {a.participants}</p>
        ) : null}
        {a.sub_judice && (a.court_order_summary || a.party_allegations) ? (
          <div className="subjudice-box">
            {a.court_order_summary ? (
              <p><strong>{lang === 'ta' ? 'நீதிமன்ற உத்தரவு / நிலை:' : 'Court Order / Procedural Fact:'}</strong> {a.court_order_summary}</p>
            ) : null}
            {a.party_allegations ? (
              <p><strong>{lang === 'ta' ? 'மனுதாரர் தரப்பு:' : 'Party Position (Untested Allegations):'}</strong> {a.party_allegations}</p>
            ) : null}
          </div>
        ) : null}
        {a.source_note ? <p className="source-line">{lang === 'ta' ? 'ஆதாரம்:' : 'Source:'} {a.source_note}</p> : null}
      </div>
      {a.cover_image ? <img className="activity-img" src={fileUrl(a.cover_image)} alt="" loading="lazy" /> : null}
    </li>
  );
}

export default function Activities() {
  const { t, lang } = useLang();
  const [actor, setActor] = useState('');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const state = useFetch(`/activities?actor=${encodeURIComponent(actor)}&category=${encodeURIComponent(category)}&q=${encodeURIComponent(q)}`);
  const items = (state.data && state.data.items) || [];
  const cats = (state.data && state.data.categories) || [];

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = useMemo(() => items.filter((a) => a.event_date >= today).reverse(), [items, today]);
  const past = useMemo(() => items.filter((a) => a.event_date < today), [items, today]);

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'பொறுப்பாளர் அடையாளத்துடன் (Who Acted)' : 'Dated Record Tagged by Actor'}
        lead={lang === 'ta'
          ? 'சட்டத்துறை மேற்கொண்ட பணிகள், திமுக கழகம் தாக்கல் செய்த மனுக்கள் மற்றும் மு. க. ஸ்டாலின் தனிப்பட்ட மனுக்கள் ஆகியவை தெளிவாகப் பிரித்துக் காட்டப்பட்டுள்ளன.'
          : 'Every activity is explicitly tagged by who acted—separating Legal Wing actions from DMK party filings, personal petitions, and pre-May 2026 state government suits.'}
      >
        {t('activities_title')}
      </PageTitle>

      <div className="wrap section">
        <VerificationBanner
          text={lang === 'ta'
            ? 'நிலுவையில் உள்ள வழக்குகளில் (Sub Judice), நீதிமன்றத்தின் உத்தரவுகளும் கழகத்தின் மனு வாதங்களும் தனித்தனியாகக் காட்டப்படுகின்றன. வழக்கு முடிவுகள் சட்டத்துறையால் உறுதிப்படுத்தப்படும் வரை நிலுவையில் உள்ளதாகக் குறிக்கப்படும்.'
            : 'For sub judice matters, actual court orders are recorded separately from party allegations. Outcomes of the Jul 2024 criminal-laws writ, Nov 2025 SIR petition, and any Kolathur appeal remain pending client confirmation.'}
        />

        <div className="filter-panel">
          <div className="chips" role="group" aria-label={lang === 'ta' ? 'யார் செயல்பட்டது' : 'Filter by actor'}>
            {ACTORS.map(([val, en, ta]) => (
              <button key={val} type="button" className={actor === val ? 'chip on' : 'chip'} onClick={() => setActor(val)}>
                {lang === 'ta' ? ta : en}
              </button>
            ))}
          </div>

          <div className="toolbar-row">
            <select
              className="select-input"
              aria-label={lang === 'ta' ? 'வகை' : 'Category'}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{lang === 'ta' ? 'அனைத்து வகைகளும்' : 'All categories'}</option>
              {cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="search" style={{ marginBottom: 0 }}>
              <span className="sr-only">{t('search')}</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={lang === 'ta' ? 'வழக்கு, இடம் அல்லது குறிச்சொல் தேடு' : 'Search activity, court or place'}
              />
            </label>
          </div>
        </div>

        <Status state={state}>
          {items.length === 0 ? <p className="status">{t('empty_activities')}</p> : (
            <>
              {upcoming.length > 0 && (
                <section>
                  <h2 className="h-sub">{lang === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming'}</h2>
                  <ul className="activity-list">{upcoming.map((a) => <ActivityRow key={a.id} a={a} />)}</ul>
                </section>
              )}
              {past.length > 0 && (
                <section>
                  <h2 className="h-sub">{lang === 'ta' ? 'ஆவணப்படுத்தப்பட்ட செயல்பாடுகள்' : 'Documented Record'}</h2>
                  <ul className="activity-list">{past.map((a) => <ActivityRow key={a.id} a={a} />)}</ul>
                </section>
              )}
            </>
          )}
        </Status>
      </div>
    </>
  );
}
