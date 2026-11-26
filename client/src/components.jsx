import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLang } from './i18n.jsx';
import { paragraphs } from './api.js';

const BASE = import.meta.env.BASE_URL;

const NAV = [
  ['/', 'nav_home'],
  ['/about', 'nav_about'],
  ['/ideology', 'nav_ideology'],
  ['/organisation', 'nav_organisation'],
  ['/districts', 'nav_districts'],
  ['/activities', 'nav_activities'],
  ['/news', 'nav_news'],
  ['/legal-resources', 'nav_resources'],
  ['/gallery', 'nav_gallery'],
  ['/contact', 'nav_contact'],
];

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ActorBadge({ actor }) {
  const { actorLabel } = useLang();
  if (!actor) return null;
  return <span className={`stamp stamp-actor stamp-${actor}`}>{actorLabel(actor)}</span>;
}

export function VerificationBanner({ text }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <aside className="colophon-bar" aria-label={lang === 'ta' ? 'ஆதார சரிபார்ப்புக் குறிப்பு' : 'Verification Ledger'}>
      <div className="colophon-head">
        <span className="colophon-mark" aria-hidden="true">§</span>
        <span className="colophon-label">
          {lang === 'ta' ? 'சரிபார்ப்பு & ஆதார நிலை' : 'Verification & Archival Ledger'}
        </span>
        <button
          type="button"
          className="colophon-toggle"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? (lang === 'ta' ? 'சுருக்குக' : 'Hide note') : (lang === 'ta' ? 'விவரம் காண்க' : 'Read verification note')}
        </button>
      </div>
      {open ? <p className="colophon-body">{text}</p> : null}
    </aside>
  );
}

export function Header() {
  const { t, lang, lp, setLang, settings } = useLang();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="site-header">
      <a className="skip" href="#main">{lang === 'ta' ? 'முதன்மை உள்ளடக்கத்திற்குச் செல்ல' : 'Skip to content'}</a>
      <div className="top-status-bar">
        <div className="wrap top-status-inner">
          <span>{t('official_badge')}</span>
          <span className="lang-pill">{lang === 'ta' ? 'தமிழ் · இயல்புநிலை' : 'English Edition'}</span>
        </div>
      </div>
      {settings && settings.election_mode && (
        <div className="election-banner" role="status">
          <div className="wrap">{t('election_mode_banner')}</div>
        </div>
      )}
      <div className="brand-row wrap">
        <Link to={lp('/')} className="brand" aria-label={`${t('org')} — ${t('wing')}`}>
          <img src={`${BASE}logo.png`} alt="" width="54" height="48" />
          <span className="brand-text">
            <span className="brand-org">{t('org')}</span>
            <span className="brand-wing">{t('wing')}</span>
          </span>
        </Link>
        <div className="head-tools">
          <button
            className="lang-btn"
            type="button"
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            aria-label={lang === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்ற'}
          >
            {t('lang_switch')}
          </button>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen(!open)}
          >
            {t('menu')}
          </button>
        </div>
      </div>
      <nav id="site-nav" className={`site-nav${open ? ' is-open' : ''}`} aria-label="Main">
        <ul className="wrap">
          {NAV.map(([to, key]) => (
            <li key={to}>
              <NavLink to={lp(to)} end={to === '/'}>{t(key)}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Footer() {
  const { t, lang, lp, settings } = useLang();
  const addr = settings
    ? (lang === 'ta' ? settings.wing_office_address_ta : settings.wing_office_address_en)
    : 'Anna Arivalayam, 367–369 Anna Salai, Teynampet, Chennai 600018';
  const email = (settings && settings.wing_official_email) || 'Pending wing confirmation';
  const lastUpdated = (settings && settings.last_updated_date) || '2026-11-26';

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img src={`${BASE}logo.png`} alt="" width="80" height="72" />
          <div>
            <p className="footer-title">{t('wing')}</p>
            <p>{t('org')}</p>
            <p className="footer-note">{t('footer_text')}</p>
            <p className="footer-meta">{addr}</p>
            <p className="footer-meta">Email: {email}</p>
            <p className="footer-meta">{t('content_owner')} · {t('last_updated')}: {lastUpdated}</p>
          </div>
        </div>
        <div className="footer-cols">
          <nav aria-label="Footer">
            <p className="footer-head">{t('explore')}</p>
            <ul>
              {NAV.slice(1).map(([to, key]) => (
                <li key={to}><Link to={lp(to)}>{t(key)}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Compliance">
            <p className="footer-head">{t('legal_links')}</p>
            <ul>
              <li><Link to={lp('/privacy')}>{t('privacy')}</Link></li>
              <li><Link to={lp('/terms')}>{t('terms')}</Link></li>
              <li><Link to={lp('/disclaimer')}>{t('disclaimer')}</Link></li>
              <li><Link to={lp('/accessibility')}>{t('accessibility')}</Link></li>
              <li><Link to={lp('/copyright')}>{t('copyright')}</Link></li>
              <li><Link to={lp('/takedown')}>{t('takedown')}</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>{t('official_badge')}</span>
        <span>{lang === 'ta' ? 'TNSLSA / NALSA இலவச சட்ட உதவி: 15100 | 1800 4252 441' : 'TNSLSA / NALSA Free Legal Aid: 15100 | 1800 4252 441'}</span>
        <Link to="/admin">{t('admin')}</Link>
      </div>
    </footer>
  );
}

export function Status({ state, children }) {
  const { t } = useLang();
  if (state.loading) return <p className="status" role="status">{t('loading')}…</p>;
  if (state.error) return <p className="status status-error" role="alert">{t('failed')} {t('retry')}</p>;
  return children;
}

export function PageTitle({ children, lead, eyebrow, meta }) {
  return (
    <header className="page-title">
      <div className="page-title-horizon" aria-hidden="true" />
      <div className="wrap page-title-inner">
        <div className="page-title-main">
          {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
          <h1>{children}</h1>
          {lead ? <p className="lead">{lead}</p> : null}
        </div>
        {meta ? <div className="page-title-meta">{meta}</div> : null}
      </div>
    </header>
  );
}

export function Paragraphs({ text }) {
  return paragraphs(text).map((p, i) => <p key={i}>{p}</p>);
}

export function Monogram({ name, size = 'md' }) {
  const ch = (name || '?').replace(/^(Dr\.?|டாக்டர்|N\.|R\.)\s*/i, '').trim().charAt(0).toUpperCase();
  return <span className={`mono mono-${size}`} aria-hidden="true">{ch}</span>;
}

export const telHref = (phone) => 'tel:+91' + (phone || '').split(/[,/]/)[0].replace(/\D/g, '').slice(-10);
