import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageTitle, Status, VerificationBanner } from '../components.jsx';
import { fileUrl, useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

const ON_THIS_DAY = [
  { date: '17 Sep', ta: 'திமுக தொடக்க நாள் (1949), தந்தை பெரியார் பிறந்த நாள் & தமிழ்நாடு சமூக நீதி நாள் (2021 முதல்) — DT Next', en: 'DMK Foundation Day (1949), Periyar Birth Anniversary & Social Justice Day in TN (since 2021) — DT Next' },
  { date: '15 Sep', ta: 'பேரறிஞர் அண்ணா பிறந்த நாள்', en: 'C. N. Annadurai Birth Anniversary' },
  { date: '07 Aug', ta: 'கலைஞர் மு. கருணாநிதி நினைவு நாள் அமைதிப் பேரணி (TNM)', en: 'Kalaignar M. Karunanidhi Memorial Peace March (TNM)' },
  { date: '26 Nov', ta: 'அரசியலமைப்பு நாள் (Constitution Day) — சட்டத்துறை அனுசரிப்பு உறுதிப்படுத்தப்பட வேண்டும்', en: 'Constitution Day (26 Nov) — wing observance pending confirmation' },
];

export function AlbumList() {
  const { t, lang, lp, pick } = useLang();
  const [cat, setCat] = useState('');
  const state = useFetch(`/albums?category=${encodeURIComponent(cat)}`);
  const items = (state.data && state.data.items) || [];

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'சரிபார்க்கப்பட்ட உரிமம் & சம்மதப் படங்கள்' : 'Cleared Event Archive'}
        lead={lang === 'ta'
          ? 'நீதிமன்ற அறைக்குள் எடுக்கப்பட்ட படங்கள் தவிர்க்கப்பட்டு, பதிப்புரிமை மற்றும் சம்மதம் உள்ள மாநாடு மற்றும் பொது நிகழ்வுப் படங்கள் மட்டுமே இங்கே வெளியிடப்படுகின்றன.'
          : 'Court-hall photography is strictly prohibited. Only verified conference, protest-outside-premises, helpline, and memorial photos with licence and consent records appear here.'}
      >
        {t('gallery_title')}
      </PageTitle>

      <div className="wrap section">
        <VerificationBanner
          text={lang === 'ta'
            ? 'புகைப்பட நீக்கக் கோரிக்கை (Takedown) அல்லது பதிப்புரிமைப் புகார்களுக்கு நீக்கக் கோரிக்கைப் பக்கத்தைப் பயன்படுத்தவும்.'
            : 'All photos require licence/credit attribution and consent clearance. Submit any takedown or privacy request via the Takedown page.'}
        />

        <section className="on-this-day" aria-label="Calendar anchors">
          <h2>{lang === 'ta' ? 'முக்கிய வரலாற்று நாட்கள் (On This Day)' : 'Verified Calendar Anchors'}</h2>
          <ul>
            {ON_THIS_DAY.map((d) => (
              <li key={d.date}>
                <strong>{d.date}</strong> — {lang === 'ta' ? d.ta : d.en}
              </li>
            ))}
          </ul>
        </section>

        <div className="chips" style={{ marginTop: 24 }}>
          {['', 'Wing conferences', 'Helplines', 'Court-related protests', 'Memorial days', 'Press meets'].map((c) => (
            <button key={c} type="button" className={cat === c ? 'chip on' : 'chip'} onClick={() => setCat(c)}>
              {c || t('all')}
            </button>
          ))}
        </div>

        <Status state={state}>
          {items.length === 0 ? (
            <div className="notice-panel">
              <p>{t('empty_gallery')}</p>
              <p className="hint-text">
                {lang === 'ta'
                  ? 'குறிப்பு: பத்திரிகை / செய்தி நிறுவனப் படங்கள் உரிமமின்றி மறுவெளியீடு செய்யப்படுவதில்லை.'
                  : 'Note: Newspaper/agency photos (PTI, ANI, The Hindu, DT Next) are never republished without a written licence.'}
              </p>
            </div>
          ) : (
            <ul className="album-grid">
              {items.map((a) => (
                <li key={a.id}>
                  <Link to={lp(`/gallery/${a.id}`)}>
                    {a.cover_image ? <img src={fileUrl(a.cover_image)} alt="" loading="lazy" /> : <span className="album-blank" />}
                    <span className="album-title">{pick(a, 'title')}</span>
                    <span className="album-count">
                      {a.image_count} {a.image_count === 1 ? t('photo') : t('photos')}
                      {a.category ? ` · ${a.category}` : ''}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Status>

        <p className="hint-text" style={{ marginTop: 28 }}>
          <Link to={lp('/takedown')}>{t('takedown')}</Link>
        </p>
      </div>
    </>
  );
}

export function AlbumView() {
  const { id } = useParams();
  const { t, lang, lp, pick } = useLang();
  const state = useFetch(`/albums/${encodeURIComponent(id)}`);
  const [open, setOpen] = useState(-1);
  const images = (state.data && state.data.images) || [];

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowRight') setOpen((i) => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setOpen((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  return (
    <>
      <PageTitle>{state.data ? pick(state.data, 'title') : t('gallery_title')}</PageTitle>
      <div className="wrap section">
        <p className="back"><Link to={lp('/gallery')}>← {t('back_gallery')}</Link></p>
        <Status state={state}>
          <ul className="photo-grid">
            {images.map((img, i) => (
              <li key={img.id}>
                <button type="button" onClick={() => setOpen(i)} aria-label={pick(img, 'caption') || `${t('photo')} ${i + 1}`}>
                  <img src={fileUrl(img.image_url)} alt={pick(img, 'alt_text') || pick(img, 'caption') || ''} loading="lazy" />
                  {img.credit_line ? <span className="photo-credit">Photo: {img.credit_line}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </Status>
      </div>
      {open >= 0 && images[open] && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(-1)}>
          <button type="button" className="lb-close" onClick={() => setOpen(-1)} aria-label="Close">×</button>
          {open > 0 && <button type="button" className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); setOpen(open - 1); }} aria-label={t('prev')}>‹</button>}
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={fileUrl(images[open].image_url)} alt={pick(images[open], 'alt_text') || pick(images[open], 'caption') || ''} />
            <figcaption>
              {pick(images[open], 'caption')}
              {images[open].date_taken ? ` · ${images[open].date_taken}` : ''}
              {images[open].credit_line ? ` · Photo: ${images[open].credit_line}` : ''}
              {images[open].licence_type ? ` (${images[open].licence_type})` : ''}
            </figcaption>
          </figure>
          {open < images.length - 1 && <button type="button" className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); setOpen(open + 1); }} aria-label={t('next')}>›</button>}
        </div>
      )}
    </>
  );
}
