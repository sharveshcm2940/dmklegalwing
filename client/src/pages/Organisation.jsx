import { Fragment, useState } from 'react';
import { Monogram, PageTitle, Reveal, Status, VerificationBanner, telHref } from '../components.jsx';
import { fileUrl, useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

const GROUPS = [['head', 'group_head'], ['secretary', 'group_secretary'], ['joint', 'group_joint'], ['deputy', 'group_deputy'], ['hq', 'group_hq']];

const TIERS_2021 = [
  { apex: true, tier_ta: 'மாநிலத் தலைவர் (இருப்பின் உறுதிப்படுத்தல் தேவை)', tier_en: 'President (if post exists — confirm)', count: '1 · R. Viduthalai (as of Dec 2021)' },
  { apex: true, tier_ta: 'மாநிலச் செயலாளர்', tier_en: 'Secretary', count: '1 · N. R. Elango in DT Next 2024–2026 (confirm exact title)' },
  { tier_ta: 'இணைச் செயலாளர்கள்', tier_en: 'Joint Secretaries', count: '5 · As of Dec 2021 self-reported (Newslaundry)' },
  { tier_ta: 'துணைச் செயலாளர்கள்', tier_en: 'Deputy Secretaries', count: '4 · As of Dec 2021 self-reported (Newslaundry)' },
  { tier_ta: 'தலைமைக் கழக வழக்கறிஞர்கள்', tier_en: 'Headquarters Advocates', count: '10 · As of Dec 2021 self-reported (Newslaundry)' },
  { tier_ta: 'மாவட்ட அமைப்பாளர்கள்', tier_en: 'District Organisers', count: '72 (Dec 2021) · Party districts restructured to 110 in Aug 2026' },
];

export default function Organisation() {
  const { t, lang, pick } = useLang();
  const state = useFetch('/bearers');
  const [viewMode, setViewMode] = useState('tree');
  const items = (state.data && state.data.items) || [];
  const pendingCount = (state.data && state.data.pending_confirmation_count) || 0;

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'சட்டத்துறை கட்டமைப்பு' : 'Organisational Architecture'}
        lead={lang === 'ta'
          ? '2021-ஆம் ஆண்டு ஆவணப்படுத்தப்பட்ட கட்டமைப்பு, 2017–2026 சரிபார்க்கப்பட்ட தலைமைப் பின்னணி மற்றும் ஒப்புதல் பெற்ற நிர்வாகிகள்.'
          : 'Documented 2021 wing hierarchy, verified historical office-holders, and confirmed office contacts.'}
        meta={lang === 'ta' ? 'தனிநபர் சம்மதத்துடன் அலுவலகத் தொடர்பு மட்டும்' : 'Office Contacts Only · Consent Gated'}
      >
        {t('organisation_title')}
      </PageTitle>

      <div className="wrap section">
        <VerificationBanner
          text={lang === 'ta'
            ? 'தனிநபர் சம்மதம் மற்றும் சட்டத்துறைத் தலைமையின் எழுத்துப்பூர்வ ஒப்புதல் இல்லாமல் தனிப்பட்ட தொலைபேசி எண்கள், வீட்டு முகவரிகள் அல்லது உறுதிப்படுத்தப்படாத பதவிகள் இங்கே வெளியிடப்படுவதில்லை. (என். ஆர். இளங்கோவின் மாநிலங்களவைப் பதவிக்காலம் 2 ஏப்ரல் 2026 அன்று முடிவடைந்தது — Wikipedia.)'
            : 'No current office-bearer roster, phone number, or disputed title is published until confirmed in writing by the wing with individual consent. N. R. Elango’s Rajya Sabha term ended on 2 April 2026 (Wikipedia); he is never described as a sitting MP.'}
        />

        <section>
          <div className="section-head">
            <h2>{lang === 'ta' ? 'ஆவணப்படுத்தப்பட்ட கட்டமைப்பு (டிசம்பர் 2021 நிலை — உறுதிப்படுத்தப்பட வேண்டும்)' : 'Indicative Hierarchy (As of Dec 2021 — To Be Confirmed)'}</h2>
            <div className="tab-strip">
              <button type="button" className={viewMode === 'tree' ? 'tab-link on' : 'tab-link'} onClick={() => setViewMode('tree')}>
                {lang === 'ta' ? 'கட்டமைப்பு வரைபடம்' : 'Architectural Tree'}
              </button>
              <button type="button" className={viewMode === 'list' ? 'tab-link on' : 'tab-link'} onClick={() => setViewMode('list')}>
                {lang === 'ta' ? 'அணுகல் பட்டியல்' : 'Accessible List'}
              </button>
            </div>
          </div>

          {viewMode === 'tree' ? (
            <div className="hierarchy-canvas" role="region" aria-label="Organisational hierarchy">
              {TIERS_2021.map((tier, idx) => (
                <Fragment key={idx}>
                  {idx > 0 ? <div className="hierarchy-connector" aria-hidden="true" /> : null}
                  <Reveal delay={idx * 55} className={`hierarchy-tier ${tier.apex ? 'is-apex' : ''}`}>
                    <strong>0{idx + 1} · {lang === 'ta' ? tier.tier_ta : tier.tier_en}</strong>
                    <span>{tier.count}</span>
                  </Reveal>
                </Fragment>
              ))}
            </div>
          ) : (
            <ol className="chronicle-timeline">
              {TIERS_2021.map((tier, idx) => (
                <li key={idx} className="chronicle-item">
                  <span className="chronicle-dot" aria-hidden="true" />
                  <span className="chronicle-date">Tier 0{idx + 1}</span>
                  <h3>{lang === 'ta' ? tier.tier_ta : tier.tier_en}</h3>
                  <p>{tier.count}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="sub-section">
          <Reveal>
            <h2 className="h-sub">{lang === 'ta' ? 'சரிபார்க்கப்பட்ட வரலாற்று & 2026 குறிப்புகள்' : 'Verified Historical & 2026 Leadership Context'}</h2>
          </Reveal>
          <Reveal delay={80} className="broadsheet-three">
            <article className="broadsheet-col">
              <span className="broadsheet-num">I</span>
              <h3>N. R. Elango</h3>
              <p>
                {lang === 'ta'
                  ? 'DT Next செய்திகள் (ஜூலை 2024 – செப்டம்பர் 2026) இவரைச் சட்டத்துறை செயலாளர் எனக் குறிப்பிடுகின்றன; 17 ஜனவரி 2025 NIE செய்தி தலைவர் எனக் குறிப்பிடுகிறது. எழுத்துப்பூர்வ உறுதிப்படுத்தல் தேவை.'
                  : 'Named Legal Wing Secretary in DT Next (Jul 2024 – Sep 2026) and President in a 17 Jan 2025 NIE report. Exact current title awaits written wing confirmation.'}
              </p>
            </article>
            <article className="broadsheet-col">
              <span className="broadsheet-num">II</span>
              <h3>R. Viduthalai & R. Girirajan</h3>
              <p>
                {lang === 'ta'
                  ? 'ஆர். விடுதலை (முன்னாள் தலைமை அரசு வழக்கறிஞர்) டிசம்பர் 2021-ல் தலைவராகவும் ஜூலை 2024 கூட்டத்திலும் காணப்பட்டார். ஆர். கிரிராஜன் 2017–2021 காலத்தில் செயலாளராக இருந்தார்.'
                  : 'R. Viduthalai (former Advocate General) was President by Dec 2021 and attended a Jul 2024 wing meeting. R. Girirajan served as Secretary (2017–at least 2021). Current roles unverified.'}
              </p>
            </article>
            <article className="broadsheet-col">
              <span className="broadsheet-num">III</span>
              <h3>R. Shanmugasundaram</h3>
              <p>
                {lang === 'ta'
                  ? 'பிப்ரவரி 2017-ல் சட்டத்துறை தலைவராக இருந்து 5 பேர் கொண்ட இலவச சட்ட ஆலோசனைக் குழுவை அறிவித்தார் (DT Next).'
                  : 'Served as Legal Wing President in February 2017 when the five-member free-advice committee was announced (DT Next).'}
              </p>
            </article>
          </Reveal>
        </section>

        <section className="sub-section">
          <h2 className="h-sub">{lang === 'ta' ? 'உறுதிப்படுத்தப்பட்ட மாநில நிர்வாகிகள்' : 'Confirmed Office Bearers'}</h2>
          <Status state={state}>
            {items.length === 0 ? (
              <div className="notice-panel">
                <p>
                  {lang === 'ta'
                    ? `தற்போது ${pendingCount} வரலாற்றுப் பதிவுகள் நிர்வாகப் பட்டியலில் "ஒப்புதல் காத்திருப்பு" நிலையில் உள்ளன. சட்டத்துறையின் எழுத்துப்பூர்வ உறுதிப்படுத்தல் மற்றும் தனிநபர் சம்மதம் கிடைத்தவுடன் அதிகாரப்பூர்வ அலுவலகத் தொடர்பு விவரங்கள் இங்கே வெளியிடப்படும்.`
                    : `${pendingCount} historical roster entries are currently held in the Admin confirmation queue. Confirmed office-bearers with written wing sign-off and personal consent will appear here using office contacts only.`}
                </p>
              </div>
            ) : (
              GROUPS.map(([key, label]) => {
                const people = items.filter((b) => b.group_key === key);
                if (!people.length) return null;
                return (
                  <section key={key} className="bearer-group">
                    <h3>{t(label)}</h3>
                    <ul className="bearer-list">
                      {people.map((p) => (
                        <li key={p.id}>
                          {p.photo ? <img className="mini-photo" src={fileUrl(p.photo)} alt="" /> : <Monogram name={pick(p, 'name')} />}
                          <span className="bearer-name">{pick(p, 'name')}</span>
                          <span className="bearer-place">{pick(p, 'place')}</span>
                          {p.phone ? <a className="phone" href={telHref(p.phone)}>{p.phone}</a> : <span />}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })
            )}
          </Status>
        </section>

        <section className="sub-section">
          <h2 className="h-sub">{lang === 'ta' ? 'கழகத் தலைமைக் கட்டமைப்பு (பின்னணி)' : 'The Wing Within the Party'}</h2>
          <p className="prose">
            {lang === 'ta'
              ? 'மே 2026 சட்டமன்றத் தேர்தலுக்குப் பின் (59 இடங்கள்; எதிர்க்கட்சி), திமுக தலைவர் மு. க. ஸ்டாலின் மற்றும் சட்டமன்றக் கட்சித் தலைவர் உதயநிதி ஸ்டாலின் தலைமையில் கழகம் செயல்படுகிறது. பொதுச்செயலாளர் (துரைமுருகன் — ஆகஸ்ட் 2026 ஊகங்களைத் தொடர்ந்து தற்போதைய நிலை உறுதிப்படுத்தப்பட வேண்டும்), பொருளாளர் டி. ஆர். பாலு, நாடாளுமன்றக் குழுத் தலைவர் கனிமொழி ஆகியோர் குறித்த விவரங்கள் கழக உறுதிப்படுத்தலுக்கு உட்பட்டவை.'
              : 'In the post-May 2026 opposition era (59 Assembly seats), M. K. Stalin serves as DMK President and Udhayanidhi Stalin leads the DMK in the Assembly. Party context from Wikipedia lists Duraimurugan (General Secretary — November 2026 status awaiting confirmation after August speculation), T. R. Baalu (Treasurer), and Kanimozhi (Parliamentary Chairperson).'}
          </p>
        </section>
      </div>
    </>
  );
}
