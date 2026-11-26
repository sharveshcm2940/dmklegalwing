import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActorBadge, PageTitle, Reveal, Status, VerificationBanner } from '../components.jsx';
import { useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

function JurisdictionSvgMap({ seatFilter, onSelectSeat, lang }) {
  return (
    <div className="atlas-map-box" role="region" aria-label={lang === 'ta' ? 'தமிழ்நாடு உயர் நீதிமன்ற வரம்பு வரைபடம்' : 'Tamil Nadu High Court Jurisdiction Atlas'}>
      <span className="rail-kicker">{lang === 'ta' ? 'உயர் நீதிமன்ற வரம்பு வரைபடம்' : 'High Court Jurisdiction Atlas'}</span>
      <svg viewBox="0 0 360 420" className="tn-svg" aria-hidden="true">
        {/* Northern, Western & Central-North TN — Chennai Principal Seat */}
        <path
          d="M172,18 L244,24 L268,68 L256,128 L244,174 L248,208 L184,212 L134,198 L94,186 L64,158 L54,116 L88,82 L132,48 Z"
          className={`svg-zone ${seatFilter === 'Chennai' ? 'is-selected' : ''}`}
          onClick={() => onSelectSeat(seatFilter === 'Chennai' ? '' : 'Chennai')}
        />
        <text x="160" y="114" textAnchor="middle" className="svg-label">
          {lang === 'ta' ? 'சென்னை முதன்மை அமர்வு' : 'Chennai Principal Seat'}
        </text>
        <text x="160" y="132" textAnchor="middle" className="svg-sub">
          24 {lang === 'ta' ? 'வருவாய் மாவட்டங்கள்' : 'Revenue Districts'}
        </text>

        {/* Southern & Delta TN — Madurai Bench (since 24 July 2004) */}
        <path
          d="M94,188 L134,200 L184,214 L248,210 L254,238 L224,264 L228,308 L192,340 L162,386 L132,396 L114,352 L100,294 L76,244 Z"
          className={`svg-zone svg-zone-madurai ${seatFilter === 'Madurai' ? 'is-selected' : ''}`}
          onClick={() => onSelectSeat(seatFilter === 'Madurai' ? '' : 'Madurai')}
        />
        <text x="166" y="276" textAnchor="middle" className="svg-label">
          {lang === 'ta' ? 'மதுரை கிளை' : 'Madurai Bench'}
        </text>
        <text x="166" y="294" textAnchor="middle" className="svg-sub">
          14 {lang === 'ta' ? 'மாவட்டங்கள் (2004 முதல்)' : 'Districts (since 2004)'}
        </text>

        {/* Chennai, Madurai, Puducherry & Karaikal markers */}
        <circle cx="256" cy="54" r="5.5" fill="#fff" stroke="#111" strokeWidth="1.5" />
        <text x="268" y="58" className="svg-note">Chennai HC</text>

        <circle cx="164" cy="252" r="5" fill="#fff" stroke="#111" strokeWidth="1.5" />

        <circle cx="252" cy="144" r="5" className="svg-dot" />
        <text x="263" y="148" className="svg-note">Puducherry</text>

        <circle cx="253" cy="216" r="5" className="svg-dot" />
        <text x="264" y="220" className="svg-note">Karaikal</text>
      </svg>

      <div className="map-legend">
        <button type="button" className={seatFilter === '' ? 'chip on' : 'chip'} onClick={() => onSelectSeat('')}>
          {lang === 'ta' ? 'அனைத்தும் (38)' : 'All (38)'}
        </button>
        <button type="button" className={seatFilter === 'Chennai' ? 'chip on' : 'chip'} onClick={() => onSelectSeat('Chennai')}>
          {lang === 'ta' ? 'சென்னை (24)' : 'Chennai (24)'}
        </button>
        <button type="button" className={seatFilter === 'Madurai' ? 'chip on' : 'chip'} onClick={() => onSelectSeat('Madurai')}>
          {lang === 'ta' ? 'மதுரை (14)' : 'Madurai (14)'}
        </button>
      </div>
    </div>
  );
}

export default function Districts() {
  const { t, lang, lp } = useLang();
  const state = useFetch('/districts');
  const [tab, setTab] = useState('party');
  const [q, setQ] = useState('');
  const [seatFilter, setSeatFilter] = useState('');

  const partyItems = (state.data && state.data.party_districts) || [];
  const revItems = (state.data && state.data.revenue_districts) || [];
  const pendingCount = (state.data && state.data.pending_confirmation_count) || 0;
  const actsByDist = (state.data && state.data.activities_by_district) || {};

  const filteredParty = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return partyItems.filter((d) => {
      if (seatFilter && d.high_court_seat !== seatFilter) return false;
      if (!needle) return true;
      return `${d.name} ${d.name_ta} ${d.revenue_district_name} ${d.source_note}`.toLowerCase().includes(needle);
    });
  }, [partyItems, q, seatFilter]);

  const filteredRev = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return revItems.filter((r) => {
      if (seatFilter && r.high_court_seat !== seatFilter) return false;
      if (!needle) return true;
      return `${r.name_en} ${r.name_ta} ${r.region} ${r.high_court_seat}`.toLowerCase().includes(needle);
    });
  }, [revItems, q, seatFilter]);

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'மாவட்ட அமைப்புகள் & நீதிமன்ற வரம்பு' : 'Legal Atlas & Jurisdictions'}
        lead={lang === 'ta'
          ? '28 ஆகஸ்ட் 2026 அன்று கழக மாவட்டங்கள் 77-லிருந்து 110 ஆக மறுசீரமைக்கப்பட்டன. இவை தமிழ்நாட்டின் 38 வருவாய் மாவட்டங்கள் மற்றும் சென்னை / மதுரை உயர் நீதிமன்ற வரம்புகளுடன் இணைக்கப்படுகின்றன.'
          : 'Party organisational districts (restructured 77 → 110 on 28 Aug 2026) are modelled separately from Tamil Nadu’s 38 revenue districts and mapped to Madras High Court seats.'}
        meta={lang === 'ta' ? '38 வருவாய் மாவட்டங்கள் · 110 கழக மாவட்டங்கள்' : '38 Revenue Districts · 110 Party Units'}
      >
        {t('districts_title')}
      </PageTitle>

      <div className="wrap section">
        <VerificationBanner
          text={lang === 'ta'
            ? `முழுமையான 110 கழக மாவட்டங்களின் பெயர்ப்பட்டியல் (தமிழ்/ஆங்கிலம்), மாவட்ட அமைப்பாளர்கள் மற்றும் உள்ளூர் வழக்கறிஞர் சங்க விவரங்கள் சட்டத்துறையின் எழுத்துப்பூர்வ ஒப்புதலுக்குக் காத்திருக்கின்றன (${pendingCount} முந்தைய பதிவுகள் நிர்வாக வரிசையில் உள்ளன). மதுரை கிளையின் 14 மாவட்ட வரம்பு சென்னை உயர் நீதிமன்றத் தளத்தில் உறுதிப்படுத்தப்பட வேண்டும்.`
            : `The full 110-district roster and organiser contacts are awaiting official confirmation (${pendingCount} legacy entries are held in the Admin confirmation queue). The 14-district Madurai Bench list is sourced from secondary records and should be cross-checked against hcmadras.tn.gov.in.`}
        />

        <div className="atlas-grid">
          <JurisdictionSvgMap seatFilter={seatFilter} onSelectSeat={setSeatFilter} lang={lang} />

          <div>
            <Reveal className="restructure-ledger">
              <div className="restructure-stat">
                <strong>77 → 110</strong>
                <span>{lang === 'ta' ? '28 ஆகஸ்ட் 2026 கழக மாவட்ட மறுசீரமைப்பு (DT Next / DC)' : 'Party districts restructured 28 Aug 2026 (~1 per 2 constituencies)'}</span>
              </div>
              <div className="restructure-stat">
                <strong>11 → 18</strong>
                <span>{lang === 'ta' ? 'சென்னை (10), செங்கல்பட்டு (3), திருவள்ளூர் (3), காஞ்சிபுரம் (2)' : 'Chennai 10, Chengalpattu 3, Tiruvallur 3, Kancheepuram 2'}</span>
              </div>
              <div className="restructure-stat">
                <strong>38</strong>
                <span>{lang === 'ta' ? 'வருவாய் மாவட்டங்கள் (மயிலாடுதுறை டிச. 2020-ல் 38-வது)' : 'Revenue districts (Mayiladuthurai added Dec 2020)'}</span>
              </div>
            </Reveal>

            <div className="filter-bar">
              <div className="tab-strip">
                <button type="button" className={tab === 'party' ? 'tab-link on' : 'tab-link'} onClick={() => setTab('party')}>
                  {lang === 'ta' ? `மண்டல மையங்கள் (${filteredParty.length})` : `Verified Regional Hubs (${filteredParty.length})`}
                </button>
                <button type="button" className={tab === 'revenue' ? 'tab-link on' : 'tab-link'} onClick={() => setTab('revenue')}>
                  {lang === 'ta' ? `38 வருவாய் மாவட்டங்கள் (${filteredRev.length})` : `38 Revenue Districts (${filteredRev.length})`}
                </button>
              </div>
              <label className="search" style={{ marginBottom: 0 }}>
                <span className="sr-only">{t('search')}</span>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_district')} />
              </label>
            </div>

            <Status state={state}>
              {tab === 'party' ? (
                filteredParty.length === 0 ? <p className="status">{t('no_match')}</p> : (
                  <table className="district-table">
                    <thead>
                      <tr>
                        <th scope="col">{t('district')}</th>
                        <th scope="col">{lang === 'ta' ? 'நீதிமன்ற அமர்வு' : 'HC Seat'}</th>
                        <th scope="col">{lang === 'ta' ? 'விவரம் & செயல்பாடுகள்' : 'Verified Note & Activities'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParty.map((d) => {
                        const linked = actsByDist[d.revenue_district_name] || [];
                        return (
                          <tr key={d.id}>
                            <th scope="row">{lang === 'ta' ? (d.name_ta || d.name) : d.name}</th>
                            <td>
                              <span>{d.revenue_district_name || '—'}</span>
                              <br />
                              <span className={`stamp ${d.high_court_seat === 'Madurai' ? 'stamp-party' : 'stamp-wing'}`}>
                                {d.high_court_seat === 'Madurai'
                                  ? (lang === 'ta' ? 'மதுரை கிளை' : 'Madurai Bench')
                                  : (lang === 'ta' ? 'சென்னை முதன்மை அமர்வு' : 'Chennai Seat')}
                              </span>
                            </td>
                            <td>
                              <p style={{ marginBottom: linked.length ? 8 : 0 }}>{d.source_note}</p>
                              {linked.length > 0 && (
                                <ul className="mini-act-list">
                                  {linked.slice(0, 2).map((a) => (
                                    <li key={a.id}>
                                      <ActorBadge actor={a.actor} />{' '}
                                      <Link to={lp('/activities')}>{lang === 'ta' ? (a.title_ta || a.title) : a.title}</Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )
              ) : (
                filteredRev.length === 0 ? <p className="status">{t('no_match')}</p> : (
                  <table className="district-table">
                    <thead>
                      <tr>
                        <th scope="col">{lang === 'ta' ? 'வருவாய் மாவட்டம்' : 'Revenue District'}</th>
                        <th scope="col">{lang === 'ta' ? 'பகுதி' : 'Region'}</th>
                        <th scope="col">{lang === 'ta' ? 'உயர் நீதிமன்ற அமர்வு' : 'Madras High Court Seat'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRev.map((r) => (
                        <tr key={r.id}>
                          <th scope="row">
                            {lang === 'ta' ? `${r.name_ta} (${r.name_en})` : `${r.name_en} (${r.name_ta})`}
                          </th>
                          <td>{r.region}</td>
                          <td>
                            <span className={`stamp ${r.high_court_seat === 'Madurai' ? 'stamp-party' : 'stamp-wing'}`}>
                              {r.high_court_seat === 'Madurai'
                                ? (lang === 'ta' ? 'மதுரை கிளை' : 'Madurai Bench')
                                : (lang === 'ta' ? 'சென்னை முதன்மை அமர்வு' : 'Chennai Principal Seat')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </Status>
          </div>
        </div>
      </div>
    </>
  );
}
