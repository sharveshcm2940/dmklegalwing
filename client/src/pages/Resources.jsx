import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle, Status } from '../components.jsx';
import { fileUrl, useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

const LANG_BADGE_TEXT = {
  ta: { ta: 'தமிழ்', en: 'Tamil' },
  en: { ta: 'ஆங்கிலம்', en: 'English' },
  both: { ta: 'தமிழ் & English', en: 'Tamil & English' },
  en_with_ta_summary: { ta: 'English (அதிகாரப்பூர்வமற்ற தமிழ் சுருக்கம்)', en: 'English (+ Unofficial TA Summary)' },
};

const RIGHTS_FAQS = [
  {
    q_ta: 'கைது செய்யப்பட்டால் உள்ள அடிப்படை அரசியலமைப்பு உரிமைகள் என்ன?',
    q_en: 'What are the core constitutional safeguards on arrest (Article 22)?',
    a_ta: 'கைதுக்கான காரணங்கள் தெரிவிக்கப்பட வேண்டும்; விரும்பிய வழக்கறிஞரைக் கலந்தாலோசிக்கவும் சட்ட உதவி பெறவும் உரிமை உண்டு; பயண நேரம் தவிர்த்து 24 மணி நேரத்திற்குள் அருகிலுள்ள நீதிபதி முன் ஆஜர்படுத்தப்பட வேண்டும்.',
    a_en: 'Under Article 22 of the Constitution, an arrested person must be informed of the grounds of arrest, has the right to consult and be defended by a legal practitioner of their choice, and must be produced before a magistrate within 24 hours (excluding travel time).',
  },
  {
    q_ta: 'FIR நகல் மற்றும் இலவச சட்ட உதவி எவ்வாறு பெறுவது?',
    q_en: 'How can a citizen seek free statutory legal aid or an FIR copy?',
    a_ta: 'இலவச சட்ட உதவிக்கு NALSA தேசிய உதவி எண் 15100 அல்லது தமிழ்நாடு மாநில சட்டப் பணிகள் ஆணைக்குழு (TNSLSA) கட்டணமில்லா எண் 1800 4252 441-ஐத் தொடர்பு கொள்ளலாம்.',
    a_en: 'Statutory free legal aid under the Legal Services Authorities Act is accessible via NALSA helpline 15100 or TNSLSA toll-free 1800 4252 441 (044-25342441, tnslsa@gmail.com).',
  },
  {
    q_ta: 'இணையப் பதிவுகள் / வாக்காளர் பட்டியல் திருத்தத்திற்கு யாரை அணுகுவது?',
    q_en: 'Where should cadres direct cyber-post or electoral-roll inquiries?',
    a_ta: 'கழகத்தினர் மற்றும் ஆதரவாளர்கள் உள்-கட்சி சட்ட உதவிப் படிவம் (தொடர்பு & உதவி பக்கம்) வழியாகத் தங்கள் மாவட்ட விவரங்களை அனுப்பலாம். இது பொது வழக்கறிஞர் விளம்பரச் சேவை அல்ல.',
    a_en: 'DMK cadres and supporters may submit an intra-party helpdesk inquiry on the Contact page. This is internal party support and not a public advocate marketplace.',
  },
];

export default function Resources() {
  const { t, lang, lp, pick } = useLang();
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const state = useFetch(`/resources?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(q)}`);
  const items = (state.data && state.data.items) || [];
  const cats = (state.data && state.data.categories) || [];
  const [allCats, setAllCats] = useState([]);
  if (cats.length > allCats.length) setAllCats(cats);

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'சட்ட விழிப்புணர்வு & அதிகாரப்பூர்வ இணைப்புகள்' : 'Verified Official Portals & Case Summaries'}
        lead={t('resources_lead')}
      >
        {t('resources_page')}
      </PageTitle>

      <div className="wrap section">
        {/* BCI Rule 36 Mandatory Compliance Banner */}
        <div className="compliance-box" role="note">
          <h2>{lang === 'ta' ? 'சட்ட மறுப்பு & BCI விதி 36 இணக்கம்' : 'BCI Rule 36 Compliance & Legal Disclaimer'}</h2>
          <p>
            {lang === 'ta'
              ? 'இந்தப் பக்கத்தில் உள்ள தகவல்கள் பொது விழிப்புணர்வுக்காக மட்டுமே; இவை சட்ட ஆலோசனை அல்ல. இதை வாசிப்பதால் வழக்கறிஞர்–வாடிக்கையாளர் உறவு உருவாகாது. இந்திய வழக்கறிஞர் கழக விதி 36 (BCI Rule 36) விதிகளுக்கு இணங்க, இத்தளத்தில் "வழக்கறிஞரைத் தேடு" (Find an Advocate), கட்டணப் பட்டியல் அல்லது வெற்றி விகித விளம்பரங்கள் எதுவும் வழங்கப்படவில்லை.'
              : 'All content here is general legal information, not legal advice, and creates no advocate-client relationship. In strict compliance with Bar Council of India Rule 36, this site provides no searchable, categorised, or ranked public "find an advocate" directory, fee schedule, or success-rate claims.'}
          </p>
        </div>

        <div className="toolbar-row" style={{ marginTop: 24 }}>
          {allCats.length > 0 && (
            <div className="chips" style={{ marginBottom: 0 }} role="group" aria-label="Category">
              <button type="button" className={cat === '' ? 'chip on' : 'chip'} onClick={() => setCat('')}>{t('all')}</button>
              {allCats.map((c) => (
                <button type="button" key={c} className={cat === c ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          )}
          <label className="search" style={{ marginBottom: 0 }}>
            <span className="sr-only">{t('search')}</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === 'ta' ? 'சட்ட ஆதாரங்களில் தேடு' : 'Search resources'} />
          </label>
        </div>

        <Status state={state}>
          {items.length === 0 ? <p className="status">{t('empty_resources')}</p> : (
            <ul className="resource-list">
              {items.map((r) => {
                const badge = LANG_BADGE_TEXT[r.language_badge] || LANG_BADGE_TEXT.en;
                return (
                  <li key={r.id}>
                    <div className="resource-content">
                      <div className="meta-row">
                        <span className="badge badge-dark">{r.category}</span>
                        <span className="badge badge-muted">{lang === 'ta' ? badge.ta : badge.en}</span>
                        {!r.source_verified ? (
                          <span className="badge badge-warn">{lang === 'ta' ? 'இணைப்புச் சரிபார்ப்பு நிலுவை' : 'Link check pending'}</span>
                        ) : null}
                      </div>
                      <h3>{pick(r, 'title')}</h3>
                      {r.court_or_forum ? (
                        <p className="resource-meta">
                          <strong>{r.court_or_forum}</strong>
                          {r.citation ? ` · ${r.citation}` : ''}
                          {r.bench ? ` · ${r.bench}` : ''}
                        </p>
                      ) : null}
                      {pick(r, 'description') ? <p>{pick(r, 'description')}</p> : null}
                      {pick(r, 'later_developments') ? (
                        <div className="subjudice-box">
                          <strong>{lang === 'ta' ? 'பிற்கால மாற்றங்கள் / மேல் தீர்ப்பு:' : 'Later Developments:'}</strong>{' '}
                          {pick(r, 'later_developments')}
                        </div>
                      ) : null}
                      <p className="resource-meta">
                        {r.last_reviewed ? `${lang === 'ta' ? 'மறுஆய்வு தேதி:' : 'Last reviewed:'} ${r.last_reviewed}` : ''}
                      </p>
                    </div>
                    <div className="resource-actions">
                      {r.file_url ? (
                        <a className="btn btn-small" href={fileUrl(r.file_url)} target="_blank" rel="noopener noreferrer">{t('download')}</a>
                      ) : null}
                      {r.external_url ? (
                        <a className="btn btn-small btn-ghost" href={r.external_url} target="_blank" rel="noopener noreferrer">{t('open_link')} ↗</a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Status>

        <section className="sub-section">
          <h2 className="h-sub">{lang === 'ta' ? 'உங்கள் உரிமைகளை அறியுங்கள் (பொதுத் தகவல்)' : 'Know Your Rights — Quick Reference FAQs'}</h2>
          <div className="faq-list">
            {RIGHTS_FAQS.map((f, idx) => (
              <details key={idx} className="faq-item">
                <summary>{lang === 'ta' ? f.q_ta : f.q_en}</summary>
                <p>{lang === 'ta' ? f.a_ta : f.a_en}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: 20 }}>
            <Link className="btn" to={lp('/contact#helpdesk')}>
              {lang === 'ta' ? 'கழக சட்ட உதவிப் படிவத்தைத் திறக்க' : 'Open Intra-Party Helpdesk Request Form'}
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
