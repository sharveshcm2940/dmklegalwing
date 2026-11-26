import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActorBadge, PageTitle, Status, VerificationBanner } from '../components.jsx';
import { useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

function JurisdictionSvgMap({ seatFilter, onSelectSeat, lang }) {
  return (
    <div className="map-card" role="region" aria-label={lang === 'ta' ? 'தமிழ்நாடு உயர் நீதிமன்ற வரம்பு வரைபடம்' : 'Tamil Nadu High Court Jurisdiction Schematic'}>
      <svg viewBox="0 0 360 400" className="tn-svg" aria-hidden="true">
        {/* North / West / Central TN — Chennai Principal Seat */}
        <path
          d="M120,25 L265,30 L275,115 L235,175 L155,195 L85,180 L65,110 Z"
          className={`svg-zone ${seatFilter === 'Chennai' ? 'is-selected' : ''}`}
          onClick={() => onSelectSeat(seatFilter === 'Chennai' ? '' : 'Chennai')}
        />
        <text x="165" y="108" textAnchor="middle" className="svg-label">
          {lang === 'ta' ? 'சென்னை முதன்மை அமர்வு' : 'Chennai Principal Seat'}
        </text>
        <text x="165" y="128" textAnchor="middle" className="svg-sub">24 {lang === 'ta' ? 'வருவாய் மாவட்டங்கள்' : 'Revenue Districts'}</text>

        {/* South / Delta TN — Madurai Bench */}
        <path
          d="M85,182 L155,197 L235,177 L255,225 L205,295 L160,365 L110,335 L95,250 Z"
          className={`svg-zone svg-zone-madurai ${seatFilter === 'Madurai' ? 'is-selected' : ''}`}
          onClick={() => onSelectSeat(seatFilter === 'Madurai' ? '' : 'Madurai')}
        />
        <text x="165" y="255" textAnchor="middle" className="svg-label">
          {lang === 'ta' ? 'மதுரை கிளை' : 'Madurai Bench'}
        </text>
        <text x="165" y="275" textAnchor="middle" className="svg-sub">14 {lang === 'ta' ? 'மாவட்டங்கள் (24 ஜூலை 2004 முதல்)' : 'Districts (since 24 Jul 2004)'}</text>

        {/* Puducherry & Karaikal markers */}
        <circle cx="255" cy="145" r="7" className="svg-dot" />
        <text x="268" y="149" className="svg-note">Puducherry</text>
        <circle cx="255" cy="205" r="6" className="svg-dot" />
        <text x="266" y="209" className="svg-note">Karaikal</text>
      </svg>
      <div className="map-legend">
        <button type="button" className={seatFilter === '' ? 'chip on' : 'chip'} onClick={() => onSelectSeat('')}>
          {lang === 'ta' ? 'அனைத்தும் (38)' : 'All Seats (38)'}
        </button>
        <button type="button" className={seatFilter === 'Chennai' ? 'chip on' : 'chip'} onClick={() => onSelectSeat('Chennai')}>
          {lang === 'ta' ? 'சென்னை முதன்மை அமர்வு (24)' : 'Chennai Principal Seat (24)'}
        </button>
        <button type="button" className={seatFilter === 'Madurai' ? 'chip on' : 'chip'} onClick={() => onSelectSeat('Madurai')}>
          {lang === 'ta' ? 'மதுரை கிளை (14)' : 'Madurai Bench (14)'}
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
        eyebrow={lang === 'ta' ? 'இருவகை மாவட்ட அமைப்பு' : 'Party Units & Revenue Districts'}
        lead={lang === 'ta'
          ? '28 ஆகஸ்ட் 2026 அன்று கழக மாவட்டங்கள் 77-லிருந்து 110 ஆக மறுசீரமைக்கப்பட்டன. இவை தமிழ்நாட்டின் 38 வருவாய் மாவட்டங்கள் மற்றும் சென்னை / மதுரை உயர் நீதிமன்ற வரம்புகளுடன் இணைக்கப்படுகின்றன.'
          : 'The party’s organisational districts (restructured from 77 to 110 on 28 Aug 2026) are distinct from Tamil Nadu’s 38 revenue districts and mapped to Madras High Court seats.'}
      >
        {t('districts_title')}
      </PageTitle>

      <div className="wrap section">
        <VerificationBanner
          text={lang === 'ta'
            ? `முழுமையான 110 கழக மாவட்டங்களின் பெயர்ப்பட்டியல் (தமிழ்/ஆங்கிலம்), மாவட்ட அமைப்பாளர்கள் மற்றும் உள்ளூர் வழக்கறிஞர் சங்க விவரங்கள் சட்டத்துறையின் எழுத்துப்பூர்வ ஒப்புதலுக்குக் காத்திருக்கின்றன (${pendingCount} முந்தைய பதிவுகள் நிர்வாக வரிசையில் உள்ளன). மதுரை கிளையின் 14 மாவட்ட வரம்பு சென்னை உயர் நீதிமன்றத் தளத்தில் உறுதிப்படுத்தப்பட வேண்டும்.`
            : `The full 110-district roster and organiser contacts are awaiting official confirmation (${pendingCount} legacy entries are held in the Admin confirmation queue). The 14-district Madurai Bench list is sourced from secondary records and should be cross-checked against hcmadras.tn.gov.in.`}
        />

        <div className="district-layout">
          <JurisdictionSvgMap seatFilter={seatFilter} onSelectSeat={setSeatFilter} lang={lang} />
          <div className="district-summary-box">
            <h2>{lang === 'ta' ? '28 ஆகஸ்ட் 2026 மறுசீரமைப்புச் சுருக்கம்' : '28 August 2026 Restructuring Summary'}</h2>
            <ul>
              <li>{lang === 'ta' ? 'மொத்த கழக மாவட்டங்கள்: 77 → 110 (சுமார் 2 சட்டமன்றத் தொகுதிகளுக்கு 1)' : 'Total party districts: 77 → 110 (~1 per 2 Assembly constituencies)'}</li>
              <li>{lang === 'ta' ? 'மாநகரச் செயலாளர் பதவி நீக்கப்பட்டது (Deccan Chronicle; DT Next)' : 'City secretary post abolished (Deccan Chronicle; DT Next)'}</li>
              <li>{lang === 'ta' ? 'சென்னை–காஞ்சிபுரம்–திருவள்ளூர்–செங்கல்பட்டு: 11 → 18 (சென்னை 10, செங்கல்பட்டு 3, திருவள்ளூர் 3, காஞ்சிபுரம் 2)' : 'Chennai–Chengalpattu–Tiruvallur–Kancheepuram: 11 → 18 (Chennai 10, Chengalpattu 3, Tiruvallur 3, Kancheepuram 2)'}</li>
              <li>{lang === 'ta' ? 'மயிலாடுதுறை: டிசம்பர் 2020-ல் 38-வது வருவாய் மாவட்டமாகச் சேர்க்கப்பட்டது (DT Next)' : 'Mayiladuthurai: added as the 38th revenue district in Dec 2020 (DT Next)'}</li>
            </ul>
          </div>
        </div>

        <div className="toolbar-row">
          <div className="chips" style={{ marginBottom: 0 }}>
            <button type="button" className={tab === 'party' ? 'chip on' : 'chip'} onClick={() => setTab('party')}>
              {lang === 'ta' ? `சரிபார்க்கப்பட்ட மண்டல மையங்கள் (${filteredParty.length})` : `Verified Regional & Helpline Hubs (${filteredParty.length})`}
            </button>
            <button type="button" className={tab === 'revenue' ? 'chip on' : 'chip'} onClick={() => setTab('revenue')}>
              {lang === 'ta' ? `38 வருவாய் மாவட்டங்கள் & நீதிமன்ற வரம்பு (${filteredRev.length})` : `38 Revenue Districts & HC Seats (${filteredRev.length})`}
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
                    <th scope="col">{lang === 'ta' ? 'வருவாய் மாவட்டம் & நீதிமன்றம்' : 'Revenue District & HC Seat'}</th>
                    <th scope="col">{lang === 'ta' ? 'சரிபார்க்கப்பட்ட குறிப்பு & செயல்பாடுகள்' : 'Verified Note & Recent Activities'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParty.map((d) => {
                    const linked = actsByDist[d.revenue_district_name] || [];
                    return (
                      <tr key={d.id}>
                        <th scope="row" data-label={t('district')}>
                          {lang === 'ta' ? (d.name_ta || d.name) : d.name}
                        </th>
                        <td data-label="HC Seat">
                          <span>{d.revenue_district_name || '—'}</span>
                          <br />
                          <span className="badge badge-muted">
                            {d.high_court_seat === 'Madurai'
                              ? (lang === 'ta' ? 'மதுரை கிளை' : 'Madurai Bench')
                              : (lang === 'ta' ? 'சென்னை முதன்மை அமர்வு' : 'Chennai Principal Seat')}
                          </span>
                        </td>
                        <td data-label="Details">
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
                      <th scope="row" data-label="District">
                        {lang === 'ta' ? `${r.name_ta} (${r.name_en})` : `${r.name_en} (${r.name_ta})`}
                      </th>
                      <td data-label="Region">{r.region}</td>
                      <td data-label="HC Seat">
                        <span className={`badge ${r.high_court_seat === 'Madurai' ? 'badge-actor badge-party' : 'badge-actor badge-wing'}`}>
                          {r.high_court_seat === 'Madurai'
                            ? (lang === 'ta' ? 'மதுரை கிளை (Madurai Bench)' : 'Madurai Bench')
                            : (lang === 'ta' ? 'சென்னை முதன்மை அமர்வு (Chennai)' : 'Chennai Principal Seat')}
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
    </>
  );
}
