import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from './api.js';

const dict = {
  ta: {
    org: 'திராவிட முன்னேற்றக் கழகம்',
    wing: 'சட்டத்துறை',
    official_badge: 'திமுக சட்டத்துறையின் அதிகாரப்பூர்வ தளம் (முன்-வெளியீட்டு சரிபார்ப்பு நிலை)',
    nav_home: 'முகப்பு',
    nav_about: 'பற்றி',
    nav_ideology: 'கொள்கைகள்',
    nav_organisation: 'அமைப்பு',
    nav_districts: 'மாவட்டங்கள்',
    nav_activities: 'செயல்பாடுகள்',
    nav_news: 'செய்திகள்',
    nav_resources: 'சட்ட ஆதாரங்கள்',
    nav_gallery: 'படத்தொகுப்பு',
    nav_contact: 'தொடர்பு & உதவி',
    menu: 'பட்டியல்',
    lang_switch: 'English',
    hero_line: 'கழகத்துக்காகவும் கழகத்தினரின் சட்ட உரிமைகளுக்காகவும் செயல்படும் வழக்கறிஞர்கள் அமைப்பு.',
    hero_cta1: 'சட்ட உதவி பெற',
    hero_cta2: 'சமீபத்திய செயல்பாடுகள்',
    mission_title: 'எங்கள் பணி',
    key_figures: 'தேதியிட்ட முக்கிய விவரங்கள்',
    as_of: 'நிலை தேதி',
    latest_news: 'சமீபத்திய செய்திகள்',
    all_news: 'அனைத்து செய்திகள்',
    read_more: 'முழுமையாகப் படிக்க',
    upcoming: 'முக்கிய செயல்பாடுகள் & நிகழ்வுகள்',
    all_activities: 'அனைத்து செயல்பாடுகள்',
    leadership: 'அமைப்பு & தலைமைப் பின்னணி',
    all_bearers: 'அமைப்பு விவரங்களைப் பார்க்க',
    resources_title: 'சட்ட ஆதாரங்கள்',
    resources_lead: 'அரசியலமைப்பு, நீதிமன்றத் தளங்கள், இலவச சட்ட உதவி எண்கள், RTI மற்றும் முக்கியத் தீர்ப்புகள்.',
    browse_resources: 'சட்ட ஆதாரங்களைப் பார்க்க',
    district_teaser_title: 'மாவட்ட அமைப்புகள் & உயர் நீதிமன்ற வரம்பு',
    districts_lead: 'தமிழ்நாடு 38 வருவாய் மாவட்டங்கள் (சென்னை முதன்மை அமர்வு & மதுரை கிளை) மற்றும் 28 ஆகஸ்ட் 2026-ல் 110 கழக மாவட்டங்களாக மறுசீரமைப்பு.',
    districts_link: 'மாவட்டப் பட்டியலைப் பார்க்க',
    gallery_teaser_title: 'படத்தொகுப்பு',
    all_gallery: 'படத்தொகுப்புக்குச் செல்ல',
    helpline_band_title: 'அவசரச் சட்ட உதவி & அதிகாரப்பூர்வ உதவி எண்கள்',
    helpline_band_note: 'கழக சட்ட உதவி மையத்தின் அதிகாரப்பூர்வ எண் சட்டத்துறை ஒப்புதலுக்குப் பின் வெளியிடப்படும். இலவச சட்ட உதவிக்கு கீழ்க்காணும் TNSLSA / NALSA அரசு உதவி எண்களைப் பயன்படுத்தலாம்:',
    organisation_title: 'உள் கட்டமைப்பு & நிர்வாகம்',
    districts_title: 'மாவட்டங்கள் & நீதிமன்ற வரம்பு',
    search: 'தேடு',
    search_district: 'மாவட்டம் அல்லது பகுதியைத் தேடுங்கள்',
    no_match: 'தேடலுக்குப் பொருத்தமானவை இல்லை.',
    district: 'மாவட்டம்',
    organiser: 'அமைப்பாளர்',
    phone: 'தொலைபேசி',
    activities_title: 'செயல்பாடுகள்',
    news_title: 'செய்திகள்',
    search_news: 'செய்திகளில் தேடுங்கள்',
    prev: 'முந்தைய',
    next: 'அடுத்து',
    page_of: 'பக்கம்',
    gallery_title: 'படத்தொகுப்பு',
    photos: 'படங்கள்',
    photo: 'படம்',
    back_gallery: 'படத்தொகுப்புக்குத் திரும்ப',
    resources_page: 'சட்ட ஆதாரங்கள்',
    all: 'அனைத்தும்',
    download: 'ஆவணத்தைப் பார்க்க',
    open_link: 'அதிகாரப்பூர்வ தளத்தைத் திறக்க',
    contact_title: 'தொடர்பு & சட்ட உதவி மையம்',
    contact_lead: 'சட்டத்துறைக்கு எழுதவும் அல்லது தரவு நீக்கம் / திருத்தக் கோரிக்கை அனுப்பவும்.',
    your_name: 'உங்கள் பெயர்',
    your_email: 'மின்னஞ்சல் (விருப்பம்)',
    your_phone: 'தொலைபேசி (விருப்பம்)',
    your_district: 'உங்கள் மாவட்டம் (விருப்பம்)',
    inquiry_type: 'கோரிக்கை வகை',
    your_message: 'உங்கள் செய்தி / விவரம்',
    send: 'சமர்ப்பிக்கவும்',
    sending: 'அனுப்பப்படுகிறது…',
    sent: 'உங்கள் கோரிக்கை பதிவு செய்யப்பட்டது.',
    reach_us: 'தலைமை அலுவலகம் & உதவி எண்கள்',
    empty_news: 'வெளியிடப்பட்ட செய்திகள் எதுவும் இல்லை.',
    empty_activities: 'செயல்பாடுகள் எதுவும் இல்லை.',
    empty_resources: 'சட்ட ஆதாரங்கள் எதுவும் இல்லை.',
    empty_gallery: 'சரிபார்க்கப்பட்ட படத்தொகுப்புகள் இன்னும் சேர்க்கப்படவில்லை.',
    loading: 'ஏற்றப்படுகிறது',
    failed: 'இந்தப் பகுதியை ஏற்ற முடியவில்லை.',
    retry: 'பக்கத்தை மீண்டும் ஏற்றிப் பாருங்கள்.',
    not_found: 'இந்தப் பக்கம் இல்லை.',
    go_home: 'முகப்புப் பக்கத்துக்குச் செல்ல',
    footer_text: 'திராவிட முன்னேற்றக் கழகத்தின் வழக்கறிஞர்கள் அமைப்பு.',
    admin: 'நிர்வாகி உள்நுழைவு',
    explore: 'பக்கங்கள்',
    legal_links: 'கொள்கைகள் & சட்ட அறிவிப்புகள்',
    last_updated: 'கடைசிப் புதுப்பிப்பு',
    content_owner: 'உள்ளடக்க உரிமையாளர்: திமுக சட்டத்துறை',
    privacy: 'தனியுரிமைக் கொள்கை (DPDP)',
    terms: 'பயன்பாட்டு விதிமுறைகள்',
    disclaimer: 'சட்ட மறுப்பு (BCI விதி 36)',
    accessibility: 'அணுகல் அறிக்கை (WCAG 2.1 AA)',
    copyright: 'பதிப்புரிமை & பட உரிமம்',
    takedown: 'படம் / செய்தி நீக்கக் கோரிக்கை',
    actor_wing: 'சட்டத்துறை (Wing)',
    actor_party: 'திமுக கழகம் (Party)',
    actor_stalin: 'மு. க. ஸ்டாலின் (தனிப்பட்ட மனு)',
    actor_tn_govt_pre_2026: 'தமிழ்நாடு அரசு (2021–2026)',
    actor_counsel: 'வழக்கறிஞராக சட்டத்துறை உறுப்பினர்',
    sub_judice_badge: 'நீதிமன்ற விசாரணையில் (Sub Judice)',
    election_mode_banner: 'தேர்தல் நடத்தை விதி (MCC) கண்காணிப்பு நிலை செயலில் உள்ளது — அனைத்துப் பதிவுகளும் சட்ட மறுஆய்வுக்குப் பிறகே வெளியிடப்படும்.',
  },
  en: {
    org: 'Dravida Munnetra Kazhagam',
    wing: 'Legal Wing',
    official_badge: 'Official Site of the DMK Legal Wing (Pre-Launch Verification Build)',
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_ideology: 'Ideologies',
    nav_organisation: 'Structure',
    nav_districts: 'Districts',
    nav_activities: 'Activities',
    nav_news: 'News',
    nav_resources: 'Legal Resources',
    nav_gallery: 'Gallery',
    nav_contact: 'Contact & Help',
    menu: 'Menu',
    lang_switch: 'தமிழ்',
    hero_line: 'Litigating for the party, organising district advocate networks, and supporting cadres.',
    hero_cta1: 'Legal Help',
    hero_cta2: 'Latest Activities',
    mission_title: 'Observed Mandate & Functions',
    key_figures: 'Dated Key Figures',
    as_of: 'As of',
    latest_news: 'Latest News',
    all_news: 'All news',
    read_more: 'Read full item',
    upcoming: 'Key Activities & Milestones',
    all_activities: 'All activities',
    leadership: 'Leadership & Organisational Context',
    all_bearers: 'View internal structure',
    resources_title: 'Legal Resources',
    resources_lead: 'Constitution, court portals, free legal aid helplines, online RTI, and landmark ruling summaries.',
    browse_resources: 'Browse legal resources',
    district_teaser_title: 'District Units & High Court Jurisdiction',
    districts_lead: '38 Tamil Nadu revenue districts mapped to Chennai & Madurai High Court seats, alongside the 28 Aug 2026 restructuring to 110 party districts.',
    districts_link: 'Explore districts & courts',
    gallery_teaser_title: 'Gallery',
    all_gallery: 'View gallery',
    helpline_band_title: 'Legal Helpdesk & Verified Statutory Helplines',
    helpline_band_note: 'Direct wing helpline numbers await written confirmation. For statutory free legal aid, contact TNSLSA / NALSA:',
    organisation_title: 'Internal Structure & Office Bearers',
    districts_title: 'Districts & High Court Jurisdiction',
    search: 'Search',
    search_district: 'Search district, court seat or region',
    no_match: 'No matching entries found.',
    district: 'District',
    organiser: 'Organiser',
    phone: 'Phone',
    activities_title: 'Activities',
    news_title: 'News & Statements',
    search_news: 'Search news',
    prev: 'Previous',
    next: 'Next',
    page_of: 'Page',
    gallery_title: 'Gallery',
    photos: 'items',
    photo: 'item',
    back_gallery: 'Back to gallery',
    resources_page: 'Legal Resources',
    all: 'All',
    download: 'Download PDF',
    open_link: 'Visit official link',
    contact_title: 'Contact & Helpdesk',
    contact_lead: 'Write to the Legal Wing, request intra-party cadre assistance, or submit a DPDP erasure / takedown request.',
    your_name: 'Your name',
    your_email: 'Email (optional)',
    your_phone: 'Phone (optional)',
    your_district: 'District (optional)',
    inquiry_type: 'Request type',
    your_message: 'Your message / details',
    send: 'Submit request',
    sending: 'Submitting…',
    sent: 'Your submission has been recorded.',
    reach_us: 'Office Address & Verified Helplines',
    empty_news: 'No news items have been published yet.',
    empty_activities: 'No activities found for these filters.',
    empty_resources: 'No resources found for these filters.',
    empty_gallery: 'No cleared gallery albums are published yet.',
    loading: 'Loading',
    failed: 'This section could not be loaded.',
    retry: 'Reload the page to try again.',
    not_found: 'This page does not exist.',
    go_home: 'Go to the home page',
    footer_text: 'The advocates’ wing of the Dravida Munnetra Kazhagam.',
    admin: 'Admin CMS',
    explore: 'Sections',
    legal_links: 'Compliance & Policies',
    last_updated: 'Last updated',
    content_owner: 'Content owner: DMK Legal Wing',
    privacy: 'Privacy Policy (DPDP)',
    terms: 'Terms of Use',
    disclaimer: 'Disclaimer (BCI Rule 36)',
    accessibility: 'Accessibility (WCAG 2.1 AA)',
    copyright: 'Copyright & Credits',
    takedown: 'Takedown & Corrections',
    actor_wing: 'Legal Wing',
    actor_party: 'DMK Party',
    actor_stalin: 'M. K. Stalin (Personal)',
    actor_tn_govt_pre_2026: 'TN Government (2021–2026)',
    actor_counsel: 'Wing Member as Counsel',
    sub_judice_badge: 'Sub Judice',
    election_mode_banner: 'Model Code of Conduct (Election Mode) active — mandatory legal review enforced prior to publishing.',
  },
};

const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  const urlLang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ta') ? 'ta' : null;
  const lang = urlLang || 'ta';

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lw_lang', lang);
      document.cookie = `lw_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) { /* storage blocked */ }

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', lang === 'ta' ? 'ta_IN' : 'en_IN');

    // Sync hreflang links
    const subPath = pathname.replace(/^\/(ta|en)/, '') || '';
    const origin = window.location.origin;
    const ensureLink = (rel, hreflang, href) => {
      const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (hreflang) el.hreflang = hreflang;
        document.head.appendChild(el);
      }
      el.href = href;
    };
    ensureLink('canonical', null, `${origin}/${lang}${subPath}`);
    ensureLink('alternate', 'ta', `${origin}/ta${subPath}`);
    ensureLink('alternate', 'en', `${origin}/en${subPath}`);
    ensureLink('alternate', 'x-default', `${origin}/ta${subPath}`);
  }, [lang, pathname]);

  useEffect(() => {
    api('/settings').then(setSettings).catch(() => {});
  }, []);

  const setLang = (nextLang) => {
    const clean = nextLang === 'en' ? 'en' : 'ta';
    const sub = pathname.replace(/^\/(ta|en)/, '') || '';
    navigate(`/${clean}${sub}${search}${hash}`);
  };

  const lp = (path) => {
    const clean = path.startsWith('/') ? path : `/${path}`;
    return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
  };

  const t = (key) => dict[lang][key] || dict.en[key] || key;
  const pick = (obj, field) => {
    if (!obj) return '';
    if (lang === 'ta') return obj[`${field}_ta`] || obj[`${field}_en`] || obj[field] || '';
    return obj[`${field}_en`] || obj[field] || obj[`${field}_ta`] || '';
  };

  const fmtDate = (value, opts) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', opts || { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const actorLabel = (actor) => t(`actor_${actor}`) || actor;

  return (
    <LangCtx.Provider value={{ lang, setLang, lp, t, pick, fmtDate, actorLabel, settings }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
