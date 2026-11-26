import { Link } from 'react-router-dom';
import { PageTitle } from '../components.jsx';
import { useLang } from '../i18n.jsx';

const CONTENT = {
  privacy: {
    title_ta: 'தனியுரிமைக் கொள்கை (DPDP இணக்கம்)',
    title_en: 'Privacy Policy (DPDP Readiness)',
    body_ta: [
      'டிஜிட்டல் தனிநபர் தரவுப் பாதுகாப்புச் சட்டம் (DPDP) விதிகள் நவம்பர் 2025 நடுப்பகுதியில் அறிவிக்கப்பட்டு, முக்கியச் சரத்துக்கள் சுமார் மே 2027 நடுப்பகுதியில் நடைமுறைக்கு வருகின்றன. இத்தளம் தற்போதிலிருந்தே அந்தப் பாதுகாப்புகளைப் பின்பற்றுகிறது.',
      'தனி அறிவிப்பு & குறைந்தபட்சத் தரவு (விதி 3): தொடர்பு மற்றும் உதவிப் படிவங்களில் கோரிக்கையை நிறைவேற்றத் தேவையான குறைந்தபட்ச விவரங்கள் மட்டுமே பெறப்படுகின்றன.',
      'சேமிப்புக் கால அட்டவணை & 48 மணி நேர அறிவிப்பு (விதி 8): பெறப்படும் செய்திகள் அதிகபட்சம் 1 ஆண்டு வரை மட்டுமே சேமிக்கப்படும்; பயன் முடிந்த பின் அல்லது நீக்கக் கோரிக்கை வந்தால் 48 மணி நேர முன்னறிவிப்புடன் நீக்கப்படும்.',
      'தணிக்கைப் பதிவுகள் (Log Retention): பாதுகாப்புத் தணிக்கைப் பதிவுகள் குறைந்தது 1 ஆண்டு (மற்றும் CERT-In வழிகாட்டுதல்படி 180 நாட்கள்) பாதுகாக்கப்படுகின்றன.',
      'குழந்தைகள் மற்றும் மாற்றுத்திறனாளிகள் (விதிகள் 10–12): 18 வயதுக்குட்பட்டவர்களுக்குச் சட்டப்பூர்வப் பாதுகாவலரின் உறுதிப்படுத்தப்பட்ட சம்மதம் கட்டாயம்.',
    ],
    body_en: [
      'The Digital Personal Data Protection (DPDP) Rules were notified in mid-November 2025, with notice, consent, retention, and children’s duties taking effect around mid-May 2027. This platform builds those safeguards in from launch.',
      'Notice & Data Minimisation (Rule 3): Contact and cadre-helpdesk forms present a clear, standalone notice and collect only fields strictly necessary to process the request.',
      'Retention & Deletion (Rule 8): Submitted inquiries carry a 1-year retention schedule and are erased upon purpose completion or user erasure request (with 48 hours’ notice where applicable).',
      'Security & Log Retention (Rules 6–8 / CERT-In): Immutable audit logs are retained for at least 1 year; server telemetry is retained at least 180 days; incident reporting follows CERT-In 6-hour procedures.',
      'Children & Persons with Disabilities (Rules 10–12): Verifiable guardian consent is required for anyone under 18.',
    ],
  },
  terms: {
    title_ta: 'பயன்பாட்டு விதிமுறைகள்',
    title_en: 'Terms of Use',
    body_ta: [
      'இத்தளத்தில் உள்ள தகவல்கள் சரிபார்க்கப்பட்ட ஆதாரங்களின் அடிப்படையில் வெளியிடப்படுகின்றன. பொதுக் கருத்துகள் அல்லது பயனர் கோப்புப் பதிவேற்றங்கள் (User Uploads) இத்தளத்தில் அனுமதிக்கப்படுவதில்லை.',
      'தளத்தில் உள்ள அதிகாரப்பூர்வ இணைப்புகள் வெளி அரசு மற்றும் நீதிமன்றத் தளங்களுக்குச் செல்கின்றன; அவற்றின் உள்ளடக்கத்திற்கு அந்தந்த அமைப்புகளே பொறுப்பாகும்.',
    ],
    body_en: [
      'This site is operated as an informational and intra-party portal for the DMK Legal Wing. Public comments and public file uploads are disabled.',
      'External links direct visitors to official judicial, statutory, and legal-aid portals; primary gazette or court records govern in case of discrepancy.',
    ],
  },
  disclaimer: {
    title_ta: 'சட்ட மறுப்பு & BCI விதி 36 இணக்கம்',
    title_en: 'Legal Disclaimer & BCI Rule 36 Compliance',
    body_ta: [
      'இத்தளத்தில் வெளியிடப்படும் எந்தவொரு தகவலும் சட்ட ஆலோசனை (Legal Advice) ஆகாது; இதன் மூலம் வழக்கறிஞர்–வாடிக்கையாளர் உறவு எதுவும் ஏற்படாது.',
      'இந்திய வழக்கறிஞர் கழக விதி 36-க்கு இணங்க, இத்தளம் வழக்கறிஞர்களை விளம்பரப்படுத்தவோ, தரவரிசைப்படுத்தவோ, கட்டணம் அல்லது வெற்றி விகிதங்களை வெளியிடவோ இல்லை.',
      'வழக்குகள் மற்றும் கொள்கை நிலைப்பாடுகள் திமுகவின் அறிவிக்கப்பட்ட நிலைப்பாடுகளாகும்; நீதிமன்ற உத்தரவுகளை எப்போதும் அதிகாரப்பூர்வ நீதிமன்றத் தளங்களில் சரிபார்க்கவும்.',
    ],
    body_en: [
      'Nothing on this website constitutes legal advice, solicitation, or an advertisement, and viewing or submitting a form creates no advocate-client relationship.',
      'In compliance with Bar Council of India Rule 36, this site does not provide a searchable, ranked, or filterable public advocate directory, fee schedule, or case win-rate claims.',
      'Party litigation summaries represent the party’s stated position; visitors must verify statutory and judicial texts against official government gazettes and court portals.',
    ],
  },
  accessibility: {
    title_ta: 'அணுகல் அறிக்கை (WCAG 2.1 AA)',
    title_en: 'Accessibility Statement (WCAG 2.1 AA Target)',
    body_ta: [
      'இத்தளம் WCAG 2.1 AA தரநிலையை இலக்காகக் கொண்டு விசைப்பலகை வழிசெலுத்தல் (Keyboard navigation), Skip-to-content இணைப்பு, தெளிவான தமிழ் எழுத்துரு மற்றும் உயர் வண்ண மாறுபாட்டுடன் (High contrast) உருவாக்கப்பட்டுள்ளது.',
    ],
    body_en: [
      'This site targets WCAG 2.1 AA accessibility compliance, featuring semantic landmarks, skip-to-content links, keyboard-navigable menus and lightboxes, high-contrast black/crimson/ivory palettes, and readable Tamil typography without letter-spacing distortion.',
    ],
  },
  copyright: {
    title_ta: 'பதிப்புரிமை & பட உரிமம் (Copyright Act 1957)',
    title_en: 'Copyright & Media Credits',
    body_ta: [
      'இந்திய பதிப்புரிமைச் சட்டம் 1957-ன் கீழ், ஒளிப்படங்களின் உரிமை வெளியிடப்பட்ட ஆண்டைத் தொடர்ந்து 60 ஆண்டுகளுக்குப் பாதுகாக்கப்படுகிறது. செய்தி நிறுவனங்கள் (PTI, ANI, The Hindu, DT Next) எடுத்த படங்கள் எழுத்துப்பூர்வ உரிமமின்றி வெளியிடப்படுவதில்லை.',
      'இந்தியத் தேர்தல் ஆணையத்தால் (ECI) அங்கீகரிக்கப்பட்ட மாநிலக் கட்சிக்கென ஒதுக்கப்பட்ட கட்சிச் சின்னம் பொதுப் பதிவிறக்கமாக (Public download) வழங்கப்படவில்லை.',
    ],
    body_en: [
      'Under the Copyright Act, 1957, photographs carry a 60-year term from the start of the calendar year following first publication. Agency and newspaper photographs (PTI, ANI, The Hindu, DT Next) are never republished without a licence.',
      'Per Election Commission of India symbol reservation rules, the party emblem is not hosted as a public vector download without formal party media-wing authorisation.',
    ],
  },
  takedown: {
    title_ta: 'படம் / செய்தி நீக்கம் & திருத்தக் கோரிக்கை',
    title_en: 'Takedown, Erasure & Corrections Policy',
    body_ta: [
      'தவறான தகவல், பதிப்புரிமைப் புகார், தனிநபர் தரவு நீக்கம் (DPDP) அல்லது புகைப்பட நீக்கக் கோரிக்கை இருப்பின் கீழ்க்காணும் படிவத்தில் கோரிக்கை வகையைத் தேர்ந்தெடுத்து அனுப்பவும். மதிப்பாய்வு முடியும் வரை சம்பந்தப்பட்ட படம் உடனடியாக மறைக்கப்படும்.',
    ],
    body_en: [
      'If you wish to request a factual correction, report a copyright concern, seek removal of a photograph, or exercise your DPDP data-erasure right, please submit a request via the Contact & Helpdesk form selecting the appropriate request type. Flagged media items are hidden immediately pending review.',
    ],
  },
};

export default function UtilityPage({ pageKey }) {
  const { lang, lp } = useLang();
  const c = CONTENT[pageKey] || CONTENT.disclaimer;
  const paragraphs = lang === 'ta' ? c.body_ta : c.body_en;

  return (
    <>
      <PageTitle>{lang === 'ta' ? c.title_ta : c.title_en}</PageTitle>
      <div className="wrap section prose">
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <p style={{ marginTop: 28 }}>
          <Link className="btn" to={lp('/contact')}>
            {lang === 'ta' ? 'தொடர்பு / நீக்கக் கோரிக்கைப் படிவத்திற்குச் செல்ல' : 'Go to Contact / Request Form'}
          </Link>
        </p>
      </div>
    </>
  );
}
