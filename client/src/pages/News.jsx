import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ActorBadge, JsonLd, PageTitle, Paragraphs, Status } from '../components.jsx';
import { fileUrl, useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

export function NewsItem({ n }) {
  const { lang, lp, pick, fmtDate } = useLang();
  return (
    <li className="news-item">
      {n.cover_image ? <img src={fileUrl(n.cover_image)} alt="" loading="lazy" /> : null}
      <div>
        <div className="meta-row">
          <time dateTime={n.published_at}>{fmtDate(n.published_at)}</time>
          <ActorBadge actor={n.actor} />
          {n.outlet_name ? <span className="badge badge-muted">{n.outlet_name}</span> : null}
        </div>
        <h3>
          {n.source_type === 'external_coverage' && n.external_url ? (
            <a href={n.external_url} target="_blank" rel="noopener noreferrer">
              {pick(n, 'title')} ↗
            </a>
          ) : (
            <Link to={lp(`/news/${n.id}`)}>{pick(n, 'title')}</Link>
          )}
        </h3>
        {pick(n, 'summary') ? <p>{pick(n, 'summary')}</p> : null}
        <p className="hint-text">
          {n.source_type === 'external_coverage'
            ? (lang === 'ta' ? 'வெளி செய்திச் சுருக்கம் (பதிப்புரிமை விதி)' : 'Press summary / link-out')
            : (lang === 'ta' ? 'சட்டத்துறை அறிவிப்பு / அறிக்கை' : 'Wing statement / release')}
        </p>
      </div>
    </li>
  );
}

export function NewsList() {
  const { t, lang, lp } = useLang();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [term, setTerm] = useState('');
  const [actor, setActor] = useState('');
  const state = useFetch(`/news?page=${page}&q=${encodeURIComponent(term)}&actor=${encodeURIComponent(actor)}`);
  const data = state.data;

  const submit = (e) => { e.preventDefault(); setPage(1); setTerm(q); };

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'ஆசிரியர் ஒப்புதலுடன் கூடிய பதிவுகள்' : 'Editorial Sign-Off & Corrections Policy'}
        lead={lang === 'ta'
          ? 'சட்டத்துறையின் அதிகாரப்பூர்வ அறிக்கைகள் மற்றும் சரிபார்க்கப்பட்ட செய்தி இணைப்புகள். பிழை திருத்தத்திற்குத் தொடர்பு கொள்ளவும்.'
          : 'Official wing statements and attributed press summaries. Third-party reporting links out by headline to respect copyright.'}
      >
        {t('news_title')}
      </PageTitle>
      <div className="wrap section">
        <div className="chips">
          {[['', 'All', 'அனைத்தும்'], ['wing', 'Legal Wing', 'சட்டத்துறை'], ['party', 'DMK Party', 'திமுக கழகம்'], ['stalin', 'M. K. Stalin', 'மு. க. ஸ்டாலின்']].map(([val, en, ta]) => (
            <button key={val} type="button" className={actor === val ? 'chip on' : 'chip'} onClick={() => { setActor(val); setPage(1); }}>
              {lang === 'ta' ? ta : en}
            </button>
          ))}
        </div>

        <form className="search" onSubmit={submit} role="search">
          <label className="sr-only" htmlFor="news-q">{t('search_news')}</label>
          <input id="news-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_news')} />
          <button className="btn btn-small" type="submit">{t('search')}</button>
        </form>

        <Status state={state}>
          {data && data.items.length === 0 ? <p className="status">{term ? t('no_match') : t('empty_news')}</p> : (
            <ul className="news-list">{data && data.items.map((n) => <NewsItem key={n.id} n={n} />)}</ul>
          )}
          {data && data.pages > 1 && (
            <nav className="pager" aria-label="Pages">
              <button className="btn btn-small btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t('prev')}</button>
              <span>{t('page_of')} {data.page} / {data.pages}</span>
              <button className="btn btn-small btn-ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>{t('next')}</button>
            </nav>
          )}
        </Status>

        <p className="hint-text" style={{ marginTop: 32 }}>
          {lang === 'ta' ? 'செய்தித் திருத்தம் அல்லது நீக்கக் கோரிக்கைக்கு: ' : 'Corrections or takedown requests: '}
          <Link to={lp('/takedown')}>{t('takedown')}</Link>
        </p>
      </div>
    </>
  );
}

export function NewsDetail() {
  const { id } = useParams();
  const { t, lang, lp, pick, fmtDate } = useLang();
  const state = useFetch(`/news/${encodeURIComponent(id)}`);
  const n = state.data;

  return (
    <Status state={state}>
      {n && n.withdrawn ? (
        <div className="wrap section article">
          <p className="back"><Link to={lp('/news')}>← {t('news_title')}</Link></p>
          <div className="notice-panel">
            <h1>{lang === 'ta' ? 'பதிவு திரும்பப் பெறப்பட்டது' : 'Item Withdrawn'}</h1>
            <p>{lang === 'ta' ? n.message_ta : n.message_en}</p>
          </div>
        </div>
      ) : n && (
        <article className="wrap section article">
          <JsonLd data={{
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: pick(n, 'title'),
            datePublished: n.published_at,
          }} />
          <p className="back"><Link to={lp('/news')}>← {t('news_title')}</Link></p>
          <div className="meta-row">
            <time dateTime={n.published_at}>{fmtDate(n.published_at)}</time>
            <ActorBadge actor={n.actor} />
            {n.dateline ? <span className="badge badge-muted">{n.dateline}</span> : null}
            {n.outlet_name ? <span className="badge badge-muted">{n.outlet_name}</span> : null}
          </div>
          <h1>{pick(n, 'title')}</h1>
          {n.cover_image ? <img className="article-img" src={fileUrl(n.cover_image)} alt="" /> : null}
          <div className="prose"><Paragraphs text={pick(n, 'body')} /></div>
          {n.external_url ? (
            <p style={{ marginTop: 24 }}>
              <a className="btn btn-small" href={n.external_url} target="_blank" rel="noopener noreferrer">
                {lang === 'ta' ? 'மூலச் செய்தியைப் படிக்க ↗' : 'Read original source ↗'}
              </a>
            </p>
          ) : null}
        </article>
      )}
    </Status>
  );
}
