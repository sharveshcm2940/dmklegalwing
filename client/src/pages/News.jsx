import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ActorBadge, JsonLd, PageTitle, Paragraphs, Reveal, Status } from '../components.jsx';
import { fileUrl, useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

export function NewsItem({ n }) {
  const { lang, lp, pick, fmtDate } = useLang();
  return (
    <Reveal as="li" className="news-item">
      {n.cover_image ? <img src={fileUrl(n.cover_image)} alt="" loading="lazy" /> : null}
      <div>
        <div className="meta-row">
          <time dateTime={n.published_at}>{fmtDate(n.published_at)}</time>
          <ActorBadge actor={n.actor} />
          {n.outlet_name ? <span className="stamp">{n.outlet_name}</span> : null}
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
        <p className="hint-text" style={{ marginBottom: 0 }}>
          {n.source_type === 'external_coverage'
            ? (lang === 'ta' ? 'வெளி செய்திச் சுருக்கம் (பதிப்புரிமை விதி)' : 'Press summary / external link-out')
            : (lang === 'ta' ? 'சட்டத்துறை அறிவிப்பு / அறிக்கை' : 'Wing statement / release')}
        </p>
      </div>
    </Reveal>
  );
}

export function NewsList() {
  const { t, lang, lp, pick, fmtDate } = useLang();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [term, setTerm] = useState('');
  const [actor, setActor] = useState('');
  const state = useFetch(`/news?page=${page}&q=${encodeURIComponent(term)}&actor=${encodeURIComponent(actor)}`);
  const data = state.data;
  const items = (data && data.items) || [];
  const [lead, ...rest] = page === 1 && !term && !actor ? items : [null, ...items];

  const submit = (e) => { e.preventDefault(); setPage(1); setTerm(q); };

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'சட்டத்துறை செய்தி அறை' : 'Legal Pressroom & Releases'}
        lead={lang === 'ta'
          ? 'சட்டத்துறையின் அதிகாரப்பூர்வ அறிக்கைகள் மற்றும் சரிபார்க்கப்பட்ட செய்தி இணைப்புகள். பிழை திருத்தத்திற்குத் தொடர்பு கொள்ளவும்.'
          : 'Official wing statements and attributed press summaries. Third-party reporting links out by headline to respect copyright.'}
        meta={lang === 'ta' ? 'ஆசிரியர் ஒப்புதல் & திருத்தக் கொள்கை' : 'Editorial Sign-Off · Corrections Policy'}
      >
        {t('news_title')}
      </PageTitle>

      <div className="wrap section">
        <div className="filter-bar">
          <div className="tab-strip">
            {[['', 'All', 'அனைத்தும்'], ['wing', 'Legal Wing', 'சட்டத்துறை'], ['party', 'DMK Party', 'திமுக கழகம்'], ['stalin', 'M. K. Stalin', 'மு. க. ஸ்டாலின்']].map(([val, en, ta]) => (
              <button key={val} type="button" className={actor === val ? 'tab-link on' : 'tab-link'} onClick={() => { setActor(val); setPage(1); }}>
                {lang === 'ta' ? ta : en}
              </button>
            ))}
          </div>

          <form className="search" style={{ marginBottom: 0 }} onSubmit={submit} role="search">
            <label className="sr-only" htmlFor="news-q">{t('search_news')}</label>
            <input id="news-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_news')} />
            <button className="btn btn-small" type="submit">{t('search')}</button>
          </form>
        </div>

        <Status state={state}>
          {items.length === 0 ? <p className="status">{term ? t('no_match') : t('empty_news')}</p> : (
            lead ? (
              <div className="news-front">
                <Reveal as="article" className="lead-story">
                  {lead.cover_image ? <img src={fileUrl(lead.cover_image)} alt="" /> : null}
                  <div className="meta-row">
                    <time dateTime={lead.published_at}>{fmtDate(lead.published_at)}</time>
                    <ActorBadge actor={lead.actor} />
                    {lead.outlet_name ? <span className="stamp">{lead.outlet_name}</span> : null}
                  </div>
                  <h2><Link to={lp(`/news/${lead.id}`)}>{pick(lead, 'title')}</Link></h2>
                  {pick(lead, 'summary') ? <p className="prose" style={{ marginTop: 10 }}>{pick(lead, 'summary')}</p> : null}
                  <Link className="btn btn-small" to={lp(`/news/${lead.id}`)}>{t('read_more')}</Link>
                </Reveal>
                <ul className="news-list">{rest.map((n) => <NewsItem key={n.id} n={n} />)}</ul>
              </div>
            ) : (
              <ul className="news-list" style={{ maxWidth: 860 }}>{items.map((n) => <NewsItem key={n.id} n={n} />)}</ul>
            )
          )}

          {data && data.pages > 1 && (
            <nav className="pager" aria-label="Pages">
              <button className="btn btn-small btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t('prev')}</button>
              <span>{t('page_of')} {data.page} / {data.pages}</span>
              <button className="btn btn-small btn-ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>{t('next')}</button>
            </nav>
          )}
        </Status>

        <aside className="compliance-colophon">
          <h2>{lang === 'ta' ? 'செய்தித் திருத்தம் & நீக்கக் கொள்கை' : 'Corrections & Editorial Accountability'}</h2>
          <p>
            {lang === 'ta' ? 'செய்தித் திருத்தம் அல்லது நீக்கக் கோரிக்கைக்கு: ' : 'To request a factual correction or withdrawal: '}
            <Link to={lp('/takedown')}>{t('takedown')}</Link>
          </p>
        </aside>
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
            {n.dateline ? <span className="stamp">{n.dateline}</span> : null}
            {n.outlet_name ? <span className="stamp">{n.outlet_name}</span> : null}
          </div>
          <h1>{pick(n, 'title')}</h1>
          {n.cover_image ? <img className="article-img" src={fileUrl(n.cover_image)} alt="" /> : null}
          <div className="prose dropcap"><Paragraphs text={pick(n, 'body')} /></div>
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
