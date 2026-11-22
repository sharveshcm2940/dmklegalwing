export interface MetricItem {
  id: string;
  figure: string;
  label: {
    en: string;
    ta: string;
  };
  subtext: {
    en: string;
    ta: string;
  };
  highlightRed?: boolean;
}

export interface SiteStats {
  asOfMonth: string; // e.g. "November 2026"
  asOf: {
    en: string; // "November 2026"
    ta: string; // "நவம்பர் 2026"
  };
  metrics: MetricItem[];
}

export const SITE_STATS: SiteStats = {
  asOfMonth: 'November 2026',
  asOf: {
    en: 'November 2026',
    ta: 'நவம்பர் 2026'
  },
  metrics: [
    {
      id: 'registered-advocates',
      figure: '28,500+',
      label: {
        en: 'REGISTERED ADVOCATES',
        ta: 'பதிவுபெற்ற வழக்கறிஞர்கள்'
      },
      subtext: {
        en: 'Tamil Nadu & Puducherry Legal Cadre',
        ta: 'தமிழ்நாடு & புதுச்சேரி வழக்கறிஞர்கள் அரண்'
      },
      highlightRed: false
    },
    {
      id: 'district-jurisdictions',
      figure: '74 / 74',
      label: {
        en: 'DISTRICT JURISDICTIONS',
        ta: 'அமைப்பு மாவட்டக் கட்டமைப்பு'
      },
      subtext: {
        en: 'Active Units in All 74 Party Districts',
        ta: 'அனைத்து அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்'
      },
      highlightRed: true
    },
    {
      id: 'constitutional-advocacy',
      figure: '50+ Years',
      label: {
        en: 'CONSTITUTIONAL ADVOCACY',
        ta: 'வரலாற்றுப் பின்னணி'
      },
      subtext: {
        en: 'Continuous Jurisprudence Since 1971',
        ta: '1971 முதல் தொடரும் மக்கள் சட்டப்பணி'
      },
      highlightRed: false
    },
    {
      id: 'affirmative-action',
      figure: '69% Quota',
      label: {
        en: 'AFFIRMATIVE ACTION SHIELD',
        ta: 'சமூக நீதி அரண்'
      },
      subtext: {
        en: 'Ninth Schedule Constitutional Protection',
        ta: '9-வது அட்டவணையில் அரசமைப்புப் பாதுகாப்பு'
      },
      highlightRed: true
    }
  ]
};

export default SITE_STATS;
