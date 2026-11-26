import { Link } from 'react-router-dom';
import { PageTitle, Paragraphs, Reveal, Status, VerificationBanner } from '../components.jsx';
import { useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

const TIMELINE = [
  {
    date: '17 Sep 1949',
    title_en: 'Founding of the Dravida Munnetra Kazhagam',
    title_ta: 'திராவிட முன்னேற்றக் கழகத்தின் தோற்றம்',
    text_en: 'C. N. Annadurai founded the DMK after leaving the Dravidar Kazhagam. Headquarters: Anna Arivalayam, 367–369 Anna Salai, Teynampet, Chennai 600018 (Wikipedia: DMK).',
    text_ta: 'திராவிடர் கழகத்திலிருந்து பிரிந்து பேரறிஞர் சி. என். அண்ணாதுரை 1949 செப்டம்பர் 17 அன்று திமுகவைத் தொடங்கினார். தலைமை அலுவலகம்: அண்ணா அறிவாலயம், 367–369 அண்ணா சாலை, தேனாம்பேட்டை, சென்னை 600018.',
  },
  {
    date: '27 Feb 2017',
    title_en: 'Five-member free legal advice committee for online-post cases',
    title_ta: 'இணையப் பதிவு வழக்குகளுக்கு 5 பேர் கொண்ட இலவச சட்ட ஆலோசனைக் குழு',
    text_en: 'Five-member committee constituted under N. R. Elango, announced by then-president R. Shanmugasundaram and then-secretary R. Girirajan (DT Next).',
    text_ta: 'அன்றைய சட்டத்துறைத் தலைவர் ஆர். சண்முகசுந்தரம் மற்றும் செயலாளர் ஆர். கிரிராஜன் அறிவிப்பில் என். ஆர். இளங்கோ தலைமையில் 5 பேர் குழு அமைக்கப்பட்டது (DT Next).',
  },
  {
    date: 'Aug 2018',
    title_en: 'Madras High Court urgent petition for Marina burial',
    title_ta: 'மெரினா அடக்க இடத்திற்கான சென்னை உயர் நீதிமன்ற அவசர மனு',
    text_en: 'Urgent High Court petition seeking burial space for Kalaignar M. Karunanidhi at Marina Beach, led by Senior Advocate P. Wilson (Newslaundry).',
    text_ta: 'கலைஞர் மு. கருணாநிதிக்கு மெரினாவில் அடக்க இடம் கோரி பி. வில்சன் தலைமையில் தாக்கல் செய்யப்பட்ட அவசர மனு (Newslaundry).',
  },
  {
    date: '16 Dec 2019',
    title_en: 'Ten-member legal panel for civic-poll candidates',
    title_ta: 'உள்ளாட்சித் தேர்தல் வேட்பாளர்களுக்கு 10 பேர் கொண்ட சட்டக் குழு',
    text_en: 'Ten-member advocate panel headed by N. R. Elango formed for local-body election candidates (DT Next).',
    text_ta: 'உள்ளாட்சித் தேர்தல் வேட்பாளர்களுக்கு உதவ என். ஆர். இளங்கோ தலைமையில் 10 பேர் குழு அமைக்கப்பட்டது (DT Next).',
  },
  {
    date: '2–6 Jul 2024',
    title_en: 'Protests & hunger strike against the three new criminal laws',
    title_ta: 'புதிய மூன்று குற்றவியல் சட்டங்களை எதிர்த்து ஆர்ப்பாட்டம் & உண்ணாவிரதம்',
    text_en: 'Legal Wing protests outside district courts (5 Jul), hunger strike at Egmore Rajarathinam Stadium (6 Jul), and condemnation conferences chaired by N. R. Elango (DT Next). (The 19 Jul 2024 Madras HC writ was filed by the DMK party via R. S. Bharathi.)',
    text_ta: 'ஜூலை 5 மாவட்ட நீதிமன்ற ஆர்ப்பாட்டம், ஜூலை 6 எழும்பூர் இராஜரத்தினம் அரங்கில் உண்ணாவிரதம் மற்றும் கண்டன மாநாடுகள் (DT Next). (ஜூலை 19 உயர் நீதிமன்ற வழக்கு திமுக சார்பில் ஆர். எஸ். பாரதி வழியாகத் தாக்கல் செய்யப்பட்டது.)',
  },
  {
    date: '17–18 Jan 2025',
    title_en: 'Third state-level Legal Wing conference',
    title_ta: 'மூன்றாவது மாநில அளவிலான சட்டத்துறை மாநாடு',
    text_en: 'Included a round-table on "One Nation, One Election" (Magzter / New Indian Express). Exact venue and resolutions await archival confirmation.',
    text_ta: '"ஒரே நாடு ஒரே தேர்தல்" வட்டமேசைக் கலந்துரையாடலுடன் நடைபெற்ற மூன்றாவது மாநில மாநாடு (Magzter / NIE). இடம் மற்றும் தீர்மானங்கள் உறுதிப்படுத்தப்பட வேண்டும்.',
  },
  {
    date: '4 Nov 2025',
    title_en: 'SIR electoral-roll helpline at Anna Arivalayam',
    title_ta: 'அண்ணா அறிவாலயத்தில் வாக்காளர் பட்டியல் சிறப்புத் திருத்த (SIR) உதவி மையம்',
    text_en: 'Electoral-roll revision assistance desk set up at Anna Arivalayam under N. R. Elango with zonal advocates (DT Next).',
    text_ta: 'என். ஆர். இளங்கோ மேற்பார்வையில் மண்டல வழக்கறிஞர்களுடன் அண்ணா அறிவாலயத்தில் அமைக்கப்பட்ட உதவி மையம் (DT Next).',
  },
  {
    date: '25 May 2026',
    title_en: 'Opposition-era cadre & social-media legal helpline',
    title_ta: 'கழகத்தினர் மற்றும் சமூக வலைத்தள ஆதரவாளர்களுக்கான சட்ட உதவி மையம்',
    text_en: 'Following the May 2026 Assembly election (results declared 4 May 2026; DMK 59 seats, serving in opposition), N. R. Elango and Organising Secretary R. S. Bharathi announced a cadre helpline covering 10 hubs across Tamil Nadu (DT Next).',
    text_ta: 'மே 2026 தேர்தலுக்குப் பின் எதிர்க்கட்சி நிலையில், என். ஆர். இளங்கோ மற்றும் அமைப்புச் செயலாளர் ஆர். எஸ். பாரதி ஆகியோரால் 10 மண்டலங்களில் அறிவிக்கப்பட்ட கழக சட்ட உதவி மையம் (DT Next).',
  },
];

export default function About() {
  const { lang, lp, pick } = useLang();
  const state = useFetch('/pages/about');

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'கழக வரலாறு & சட்டப் பணி' : 'Chronicle & Mandate'}
        lead={lang === 'ta'
          ? 'சரிபார்க்கப்பட்ட வரலாற்றுப் பதிவுகள், கழகத்தில் சட்டத்துறையின் பங்கு மற்றும் 1949–2026 காலவரிசை.'
          : 'Verified records of the wing’s functions, its place within the DMK, and sourced milestones from 1949 to 2026.'}
        meta={lang === 'ta' ? 'அண்ணா அறிவாலயம் · சென்னை 600018' : 'Anna Arivalayam · Chennai 600018'}
      >
        {state.data ? pick(state.data, 'title') : (lang === 'ta' ? 'சட்டத்துறை பற்றி' : 'About Us')}
      </PageTitle>

      <div className="wrap section">
        <VerificationBanner
          text={lang === 'ta'
            ? 'சட்டத்துறை தொடங்கப்பட்ட ஆண்டு, முதல் செயலாளர், அதிகாரப்பூர்வத் தமிழ்/ஆங்கிலப் பெயர் மற்றும் உறுப்பினர் தகுதி விதிகள் சட்டத்துறையின் எழுத்துப்பூர்வ ஒப்புதலுக்குப் பிறகே இங்கே சேர்க்கப்படும்.'
            : 'The wing’s exact formation year, founding secretary, official bilingual name, and formal membership eligibility rules are not verified in public press sources and are held for client sign-off.'}
        />

        <div className="editorial-split">
          <aside className="sticky-rail">
            <div className="rail-block">
              <span className="rail-kicker">{lang === 'ta' ? 'தலைமை அலுவலகம்' : 'Party Headquarters'}</span>
              <p className="hint-text" style={{ marginBottom: 0 }}>
                Anna Arivalayam, 367–369 Anna Salai, Teynampet, Chennai 600018
              </p>
            </div>
            <div className="rail-block">
              <span className="rail-kicker">{lang === 'ta' ? 'தற்போதைய அரசியல் நிலை' : 'Post-May 2026 Context'}</span>
              <p className="hint-text" style={{ marginBottom: 0 }}>
                {lang === 'ta'
                  ? 'மே 4, 2026 தேர்தல் முடிவுகளுக்குப் பின் 59 இடங்களுடன் எதிர்க்கட்சி. தலைவர்: மு. க. ஸ்டாலின்; சட்டமன்றத் தலைவர்: உதயநிதி ஸ்டாலின்.'
                  : 'Opposition party (59 Assembly seats; results 4 May 2026). Party President: M. K. Stalin; Assembly Leader: Udhayanidhi Stalin.'}
              </p>
            </div>
            <nav className="rail-nav" aria-label="Chapters">
              <span className="rail-kicker">{lang === 'ta' ? 'பிரிவுகள்' : 'Chapters'}</span>
              <a href="#who-we-are">{lang === 'ta' ? '01 · அறிமுகம்' : '01 · Who We Are'}</a>
              <a href="#functions">{lang === 'ta' ? '02 · மூன்று செயல்பாடுகள்' : '02 · Three Functions'}</a>
              <a href="#timeline">{lang === 'ta' ? '03 · காலவரிசை (1949–2026)' : '03 · Verified Timeline'}</a>
              <Link to={lp('/organisation')}>{lang === 'ta' ? '04 · உள் கட்டமைப்பு →' : '04 · Internal Structure →'}</Link>
            </nav>
          </aside>

          <div>
            <section id="who-we-are">
              <Status state={state}>
                {state.data && (
                  <Reveal className="prose dropcap">
                    <Paragraphs text={pick(state.data, 'body')} />
                  </Reveal>
                )}
              </Status>
            </section>

            <section id="functions" className="sub-section">
              <Reveal>
                <h2 className="h-sub">{lang === 'ta' ? 'மூன்று முக்கியச் செயல்பாடுகள்' : 'Three Core Observed Functions'}</h2>
                <p className="hint-text">
                  {lang === 'ta'
                    ? 'நீதிமன்றப் பதிவுகள் "சட்டத்துறை தலைமை ஏற்றது, உதவியது அல்லது ஆஜரானது" என்ற அடிப்படையில் வகைப்படுத்தப்படுகின்றன.'
                    : 'All litigation entries are framed accurately as matters the wing "led, assisted, or appeared in", distinct from party or personal filings.'}
                </p>
              </Reveal>
              <Reveal delay={90} className="broadsheet-three">
                <article className="broadsheet-col">
                  <span className="broadsheet-num">01</span>
                  <h3>{lang === 'ta' ? 'கழகத்திற்கான வழக்குகள்' : 'Party & Constitutional Litigation'}</h3>
                  <p>
                    {lang === 'ta'
                      ? 'தேர்தல், வாக்காளர் பட்டியல் மற்றும் பொதுநலன் தொடர்பான வழக்குகளில் கழகத்திற்குச் சட்டப் பிரதிநிதித்துவம் வழங்குதல்.'
                      : 'Representing or assisting in constitutional, electoral, and public-interest proceedings involving the party.'}
                  </p>
                </article>
                <article className="broadsheet-col">
                  <span className="broadsheet-num">02</span>
                  <h3>{lang === 'ta' ? 'கழகத்தினருக்குச் சட்ட உதவி' : 'Intra-Party Cadre Legal Aid'}</h3>
                  <p>
                    {lang === 'ta'
                      ? 'வழக்குகளை எதிர்கொள்ளும் கழகத் தொண்டர்கள் மற்றும் சமூக வலைத்தள ஆதரவாளர்களுக்கு ஆலோசனை மற்றும் உதவி மையங்கள்.'
                      : 'Coordinating free intra-party legal advice committees and helplines for cadres and supporters (2017, 2019, 2025, 2026).'}
                  </p>
                </article>
                <article className="broadsheet-col">
                  <span className="broadsheet-num">03</span>
                  <h3>{lang === 'ta' ? 'மாவட்ட வழக்கறிஞர் கட்டமைப்பு' : 'District Advocate Networks'}</h3>
                  <p>
                    {lang === 'ta'
                      ? 'மாவட்ட அமைப்பாளர்கள் மற்றும் மண்டல வழக்கறிஞர்கள் மூலம் மாநிலம் முழுவதும் சட்டப் பணிகளை ஒருங்கிணைத்தல்.'
                      : 'Organising advocates through district-level units aligned with Madras High Court (Chennai & Madurai Bench) jurisdictions.'}
                  </p>
                </article>
              </Reveal>
            </section>

            <section id="timeline" className="sub-section">
              <Reveal>
                <h2 className="h-sub">{lang === 'ta' ? 'சரிபார்க்கப்பட்ட காலவரிசை' : 'Verified Timeline (1949–2026)'}</h2>
              </Reveal>
              <ol className="chronicle-timeline">
                {TIMELINE.map((item, idx) => (
                  <Reveal key={idx} as="li" delay={idx * 45} className="chronicle-item">
                    <span className="chronicle-dot" aria-hidden="true" />
                    <span className="chronicle-date">{item.date}</span>
                    <h3>{lang === 'ta' ? item.title_ta : item.title_en}</h3>
                    <p>{lang === 'ta' ? item.text_ta : item.text_en}</p>
                  </Reveal>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
