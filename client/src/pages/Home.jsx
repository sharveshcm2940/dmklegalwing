import { Link } from 'react-router-dom';
import { ActorBadge, JsonLd, Monogram, Paragraphs, Status, telHref } from '../components.jsx';
import { fileUrl, useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';
import { NewsItem } from './News.jsx';
import { ActivityRow } from './Activities.jsx';

function Hero() {
  const { t, lang, lp } = useLang();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-sky">
        <div className="sun-wrap" aria-hidden="true">
          <div className="sun-rays" />
          <div className="sun-disc" />
        </div>
        <div className="wrap hero-copy">
          <h1 id="hero-title">
            <span className="hero-ta">திமுக சட்டத்துறை</span>
            <span className="hero-en">DMK Legal Wing</span>
          </h1>
          <p className="hero-org">
            {lang === 'ta'
              ? 'திராவிட முன்னேற்றக் கழகம் · அண்ணா அறிவாலயம், சென்னை'
              : 'Dravida Munnetra Kazhagam · Anna Arivalayam, Chennai'}
          </p>
        </div>
      </div>
      <div className="hero-ground">
        <div className="wrap hero-actions">
          <p>{t('hero_line')}</p>
          <div>
            <Link className="btn btn-light" to={lp('/contact#helpdesk')}>{t('hero_cta1')}</Link>
            <Link className="btn btn-dark" to={lp('/activities')}>{t('hero_cta2')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t, lang, lp, pick, fmtDate } = useLang();
  const state = useFetch('/home');
  const d = state.data;
  const [first, ...rest] = (d && d.news) || [];
  const counters = (d && d.counters) || [];
  const bearers = (d && d.bearers) || [];
  const resources = (d && d.resources) || [];
  const gallery = (d && d.gallery) || [];

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: lang === 'ta' ? 'திமுக சட்டத்துறை' : 'DMK Legal Wing',
    alternateName: ['DMK Legal Wing', 'திமுக சட்டத்துறை'],
    parentOrganization: {
      '@type': 'PoliticalParty',
      name: 'Dravida Munnetra Kazhagam (DMK)',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Anna Arivalayam, 367-369 Anna Salai, Teynampet',
      addressLocality: 'Chennai',
      postalCode: '600018',
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <Hero />

      {d && d.intro && (
        <section className="wrap section intro">
          <div>
            <h2 className="eyebrow-h">{t('mission_title')}</h2>
            <div className="prose prose-large"><Paragraphs text={pick(d.intro, 'body')} /></div>
          </div>
          <div className="intro-side">
            <p className="intro-link">
              <strong>{d.revenue_district_count || 38}</strong>{' '}
              {lang === 'ta' ? 'வருவாய் மாவட்டங்கள்' : 'Revenue Districts'} · <strong>110</strong>{' '}
              {lang === 'ta' ? 'மறுசீரமைக்கப்பட்ட கழக மாவட்டங்கள் (28 ஆகஸ்ட் 2026)' : 'Restructured Party Districts (28 Aug 2026)'}
              <br />
              <Link to={lp('/districts')}>{t('districts_link')}</Link>
            </p>
          </div>
        </section>
      )}

      {counters.length > 0 && (
        <section className="counters-band" aria-labelledby="counters-heading">
          <div className="wrap section-sm">
            <div className="section-head">
              <h2 id="counters-heading">{t('key_figures')}</h2>
              <span className="hint-inline">
                {lang === 'ta'
                  ? 'வழக்கு எண்ணிக்கை அல்லது வெற்றி விகிதம் வெளியிடப்படுவதில்லை (BCI விதி 36)'
                  : 'No case counts or win-rate claims published (BCI Rule 36)'}
              </span>
            </div>
            <ul className="counter-grid">
              {counters.map((c) => (
                <li key={c.id} className="counter-card">
                  <span className="counter-val">{c.value_text}</span>
                  <span className="counter-label">{pick(c, 'label')}</span>
                  <span className="counter-meta">{t('as_of')}: {c.as_of_date}</span>
                  {c.source_note ? <span className="counter-src">{c.source_note}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="section-head">
          <h2>{t('latest_news')}</h2>
          <Link to={lp('/news')}>{t('all_news')}</Link>
        </div>
        <Status state={state}>
          {!first ? <p className="status">{t('empty_news')}</p> : (
            <div className="news-front">
              <article className="lead-story">
                {first.cover_image ? <img src={fileUrl(first.cover_image)} alt="" /> : null}
                <div className="meta-row">
                  <time dateTime={first.published_at}>{fmtDate(first.published_at)}</time>
                  <ActorBadge actor={first.actor} />
                  {first.outlet_name ? <span className="badge badge-muted">{first.outlet_name}</span> : null}
                </div>
                <h3><Link to={lp(`/news/${first.id}`)}>{pick(first, 'title')}</Link></h3>
                {pick(first, 'summary') ? <p>{pick(first, 'summary')}</p> : null}
              </article>
              {rest.length > 0 && (
                <ul className="news-list news-list-side">
                  {rest.map((n) => <NewsItem key={n.id} n={n} />)}
                </ul>
              )}
            </div>
          )}
        </Status>
      </section>

      {d && d.activities && d.activities.length > 0 && (
        <section className="gown">
          <div className="wrap section">
            <div className="section-head">
              <h2>{t('upcoming')}</h2>
              <Link to={lp('/activities')}>{t('all_activities')}</Link>
            </div>
            <ul className="activity-list on-dark">
              {d.activities.map((a) => <ActivityRow key={a.id} a={a} />)}
            </ul>
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="section-head">
          <h2>{t('leadership')}</h2>
          <Link to={lp('/organisation')}>{t('all_bearers')}</Link>
        </div>
        {bearers.length > 0 ? (
          <div className="featured-row">
            {bearers.slice(0, 4).map((p) => (
              <article className="featured" key={p.id}>
                {p.photo ? <img className="featured-photo" src={fileUrl(p.photo)} alt="" /> : <Monogram name={pick(p, 'name')} size="lg" />}
                <div>
                  <p className="featured-role">{pick(p, 'role')}</p>
                  <h3>{pick(p, 'name')}</h3>
                  {p.phone ? <a className="phone" href={telHref(p.phone)}>{p.phone}</a> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="notice-panel">
            <p>
              {lang === 'ta'
                ? 'தற்போதைய சட்டத்துறை தலைவர், செயலாளர் மற்றும் மாநில நிர்வாகிகளின் அதிகாரப்பூர்வப் பட்டியல் எழுத்துப்பூர்வ ஒப்புதல் மற்றும் தனிநபர் சம்மதத்திற்குப் பின் இங்கே வெளியிடப்படும். 2021-ஆம் ஆண்டுப் பதிவு செய்யப்பட்ட கட்டமைப்பை "அமைப்பு" பக்கத்தில் காணலாம்.'
                : 'Current office-bearer titles, rosters, and office contacts are held in the Admin verification queue pending written confirmation and individual consent. View the documented 2021 structure and dated 2017–2026 leadership context on the Structure page.'}
            </p>
            <Link className="btn btn-small" to={lp('/organisation')}>{t('all_bearers')}</Link>
          </div>
        )}
      </section>

      {resources.length > 0 && (
        <section className="resources-band">
          <div className="wrap section-sm">
            <div className="section-head">
              <h2>{t('resources_title')}</h2>
              <Link to={lp('/legal-resources')}>{t('browse_resources')}</Link>
            </div>
            <p className="resources-lead-on-red">{t('resources_lead')}</p>
            <ul className="resource-teaser-grid">
              {resources.map((r) => (
                <li key={r.id} className="resource-teaser-card">
                  <span className="badge badge-dark">{r.category}</span>
                  <h3>{pick(r, 'title')}</h3>
                  <p>{pick(r, 'description').slice(0, 150)}…</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="section-head">
          <h2>{t('district_teaser_title')}</h2>
          <Link to={lp('/districts')}>{t('districts_link')}</Link>
        </div>
        <div className="split-card">
          <div>
            <p className="prose">{t('districts_lead')}</p>
            <p className="hint-text">
              {lang === 'ta'
                ? 'சென்னை–காஞ்சிபுரம்–திருவள்ளூர்–செங்கல்பட்டு மண்டலம் 11-லிருந்து 18 அலகுகளாக உயர்த்தப்பட்டது (சென்னை 10, செங்கல்பட்டு 3, திருவள்ளூர் 3, காஞ்சிபுரம் 2).'
                : 'Chennai–Kancheepuram–Tiruvallur–Chengalpattu expanded from 11 to 18 units (Chennai 10, Chengalpattu 3, Tiruvallur 3, Kancheepuram 2).'}
            </p>
          </div>
          <div>
            <Link className="btn" to={lp('/districts')}>{t('districts_link')}</Link>
          </div>
        </div>
      </section>

      <section className="ash-band">
        <div className="wrap section-sm">
          <div className="section-head">
            <h2>{t('gallery_teaser_title')}</h2>
            <Link to={lp('/gallery')}>{t('all_gallery')}</Link>
          </div>
          {gallery.length > 0 ? (
            <ul className="photo-grid">
              {gallery.map((img) => (
                <li key={img.id}>
                  <img src={fileUrl(img.image_url)} alt={pick(img, 'alt_text') || pick(img, 'caption')} loading="lazy" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="notice-panel">
              {lang === 'ta'
                ? 'நீதிமன்ற அறைக்குள் எடுக்கப்பட்ட படங்கள் தவிர்க்கப்பட்டு, ஒப்புதல் மற்றும் உரிமம் சரிபார்க்கப்பட்ட மாநாடு / பொது நிகழ்வுப் படங்கள் மட்டுமே இங்கே பதிவேற்றப்படும்.'
                : 'Court-hall photography is strictly excluded. Verified conference, helpline, and memorial-event photographs with photographer licence and consent records will appear here once approved.'}
            </p>
          )}
        </div>
      </section>

      <section className="helpline-band" aria-labelledby="helpline-heading">
        <div className="wrap section-sm">
          <h2 id="helpline-heading">{t('helpline_band_title')}</h2>
          <p>{t('helpline_band_note')}</p>
          <ul className="helpline-grid">
            <li>
              <strong>NALSA National Helpline</strong>
              <span>15100</span>
            </li>
            <li>
              <strong>TNSLSA Toll-Free</strong>
              <span>1800 4252 441</span>
            </li>
            <li>
              <strong>TNSLSA Office (10am–6pm)</strong>
              <span>044-25342441 · tnslsa@gmail.com</span>
            </li>
            <li>
              <strong>High Court Legal Services</strong>
              <span>Chennai: 044-29550126 · Madurai: 0452-2433756</span>
            </li>
          </ul>
          <div className="helpline-actions">
            <Link className="btn btn-light" to={lp('/contact#helpdesk')}>{t('hero_cta1')}</Link>
            <Link className="btn btn-dark" to={lp('/legal-resources')}>{t('browse_resources')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
