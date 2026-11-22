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
      figure: '3,500+',
      label: {
        en: 'Registered advocates',
        ta: 'பதிவுபெற்ற வழக்கறிஞர்கள்'
      },
      subtext: {
        en: 'Active Legal Cadre in Courts',
        ta: 'நீதிமன்றங்களில் செயல்படும் வழக்கறிஞர்கள்'
      },
      highlightRed: false
    },
    {
      id: 'district-jurisdictions',
      figure: '74',
      label: {
        en: 'District units',
        ta: 'அமைப்பு மாவட்டங்கள்'
      },
      subtext: {
        en: 'Units in All 74 Party Districts',
        ta: 'அனைத்து அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்'
      },
      highlightRed: true
    },
    {
      id: 'constitutional-advocacy',
      figure: '50+',
      label: {
        en: 'Years of jurisprudence',
        ta: 'ஆண்டுகள் மக்கள் சட்டப்பணி'
      },
      subtext: {
        en: 'Defending Dravidian Ideology Since 1971',
        ta: '1971 முதல் தொடரும் மக்கள் சட்டப்பணி'
      },
      highlightRed: false
    },
    {
      id: 'affirmative-action',
      figure: '69%',
      label: {
        en: 'Reservation defended',
        ta: 'சமூக நீதி இடஒதுக்கீடு அரண்'
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
