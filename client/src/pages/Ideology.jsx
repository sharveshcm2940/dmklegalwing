import { PageTitle, Reveal, VerificationBanner } from '../components.jsx';
import { useLang } from '../i18n.jsx';

const BLOCKS = [
  {
    num: '01',
    title_ta: 'திராவிட இயக்கம்',
    title_en: 'Dravidian Movement',
    anchor_ta: '1949 செப்டம்பர் 17 அன்று பெரியார் – அண்ணா மரபின் தொடர்ச்சியாக திமுக நிறுவப்பட்டது (Wikipedia: DMK).',
    anchor_en: 'Founded 17 September 1949 in the Periyar-to-Anna lineage (Wikipedia: DMK).',
    care_ta: 'கழகத்தின் முதன்மை விதிமுறைகள் மற்றும் 2024 தேர்தல் அறிக்கை முதன்மை ஆவணங்கள் இங்கே நேரடியாக இணைக்கப்படவில்லை.',
    care_en: 'Archival note: The party constitution and 2024 manifesto are the primary reference texts and await direct verification.',
  },
  {
    num: '02',
    title_ta: 'திராவிட மாடல்',
    title_en: 'Dravidian Model',
    anchor_ta: '25 செப்டம்பர் 2022 அன்று மு. க. ஸ்டாலின்: "எனது திராவிட மாடல் அரசின் மையக் கொள்கை மனிதநேயமும் சமூக நீதியுமே" (Outlook / PTI).',
    anchor_en: 'M. K. Stalin, 25 September 2022: "The central ideology of my Dravidian model of government is humanism and social justice" (Outlook / PTI).',
    care_ta: 'குறிப்பு: 2021–2026 கால திமுக ஆட்சியின் கொள்கைக் கூற்றாகப் பெயர் மற்றும் தேதியுடன் பதிவு செய்யப்படுகிறது.',
    care_en: 'Attributed directly by speaker and date as the stated philosophy of the 2021–2026 DMK administration.',
  },
  {
    num: '03',
    title_ta: 'சமூக நீதி & இட ஒதுக்கீடு',
    title_en: 'Social Justice & Reservation',
    anchor_ta: 'சட்டநாதன் ஆணையத்திற்குப் பின் திமுக ஆட்சியில் இட ஒதுக்கீடு 41%-லிருந்து 49% ஆக உயர்ந்தது; 1980-ல் அதிமுக ஆட்சியில் 68%; 1989-ல் திமுக ஆட்சியில் 20% MBC பிரிவு; 1990-ல் 69%; 1993 சட்டம் மற்றும் 9-வது அட்டவணைச் சேர்ப்பு அனைத்துக் கட்சி ஆதரவுடன் அதிமுக ஆட்சியில் நிறைவேற்றப்பட்டது (TNM).',
    anchor_en: 'Reservation rose from 41% to 49% under the DMK government after the Sattanathan Commission, to 68% in 1980 (AIADMK), the 20% MBC category in 1989 (DMK), and 69% in 1990; the 1993 Act and Ninth Schedule placement came under the AIADMK government with cross-party support (TNM).',
    care_ta: '1993 சட்டத்தைத் திமுக இயற்றியதாகக் கூறக்கூடாது; 9-வது அட்டவணை வழக்கின் தற்போதைய நிலை உறுதிப்படுத்தப்படவில்லை.',
    care_en: 'Care: Do not attribute enactment of the 1993 Act to the DMK. Current status of the Ninth Schedule challenge is unverified.',
  },
  {
    num: '04',
    title_ta: 'சுயமரியாதை இயக்கம் & பகுத்தறிவு',
    title_en: 'Self-Respect Movement & Rationalism',
    anchor_ta: 'அண்ணாதுரை ஆட்சியில் இந்து திருமணச் சட்டத்தில் பிரிவு 7-A சேர்க்கப்பட்டு சுயமரியாதைத் திருமணங்கள் சட்டப்பூர்வமாக்கப்பட்டன; 2015-ல் சென்னை உயர் நீதிமன்றம் அவற்றைச் சட்டவிரோதம் என அறிவிக்க மறுத்தது (TNM).',
    anchor_en: 'Priest-less Self-Respect marriages were legalised under Annadurai via Section 7-A of the Hindu Marriage Act; in 2015 the Madras High Court refused to declare them illegal (TNM).',
    care_ta: 'சட்ட ஆண்டு 1967 (Casemine) vs 1968 (TNM) என்ற வேறுபாடு தமிழ்நாடு அரசிதழில் சரிபார்க்கப்பட வேண்டும்.',
    care_en: 'Care: Secondary sources conflict between 1967 (Casemine) and 1968 (TNM); verify against the official gazette.',
  },
  {
    num: '05',
    title_ta: 'பெண்ணுரிமை',
    title_en: 'Women’s Rights',
    anchor_ta: '1989 இந்து வாரிசுரிமை (தமிழ்நாடு திருத்தச்) சட்டம் பெண்களுக்குச் சம சொத்துரிமை வழங்கியதாக திமுக மற்றும் முரசொலி முன்வைக்கும் உரிமைக் கூற்று (Deccan Herald; Wikipedia).',
    anchor_en: 'The 1989 Hindu Succession (Tamil Nadu Amendment) Act is presented by the DMK and Murasoli as a pioneering measure preceding the 2005 national amendment (Deccan Herald; Wikipedia).',
    care_ta: '2005 தேசியத் திருத்தத்திற்கு முன்னோடி என்பது கழகத்தின் கூற்றாக மட்டுமே குறிப்பிடப்படுகிறது; 1989 சட்ட நகல் அரசிதழில் சரிபார்க்கப்பட வேண்டும்.',
    care_en: 'Care: Framed strictly as the party’s stated claim; primary 1989 statutory text awaits gazette verification.',
  },
  {
    num: '06',
    title_ta: 'மாநில சுயாட்சி & கூட்டாட்சித் தத்துவம்',
    title_en: 'State Autonomy & Federalism',
    anchor_ta: 'இராஜமன்னார் குழு அறிக்கை (27 மே 1971); 16 ஏப்ரல் 1974 சட்டமன்றத் தீர்மானம் (TNM). ஆளுநர் மசோதா வழக்கில் 8 ஏப்ரல் 2025 உச்ச நீதிமன்றத் தீர்ப்பு (10 மசோதாக்கள் நிறுத்திவைப்பு சட்டவிரோதம்) மற்றும் 20 நவம்பர் 2025 குடியரசுத் தலைவர் பரிந்துரை 5-நீதிபதிகள் கருத்து (காலக்கெடு & தானியங்கி ஒப்புதல் நிராகரிப்பு) ஆகிய இரண்டும் இணைத்துப் பார்க்கப்பட வேண்டும் (SC Observer; LiveLaw).',
    anchor_en: 'Rajamannar Committee report (27 May 1971) and 16 April 1974 Assembly resolution (TNM). In 2025, the 8 April Supreme Court judgment (holding withholding of 10 Bills illegal) must be read alongside the 20 November 2025 five-judge Presidential Reference opinion that rejected judicially imposed timelines and deemed assent (SC Observer; LiveLaw).',
    care_ta: 'குறிப்பு: நவம்பர் 2026-ல் தற்போதைய TVK அரசு குரியன் ஜோசப் சுயாட்சிக் குழுவைக் கலைத்ததாக The Wire செய்தி வெளியிட்டுள்ளது.',
    care_en: 'Note: In November 2026, The Wire reported the TVK government’s move to disband the Kurian Joseph autonomy committee.',
  },
  {
    num: '07',
    title_ta: 'தமிழ்மொழி & இருமொழிக் கொள்கை',
    title_en: 'Tamil Language & Two-Language Policy',
    anchor_ta: '23 ஜனவரி 1968-ல் தமிழ்நாடு சட்டமன்றம் இருமொழிக் கொள்கையை ஏற்றது; 14 ஜனவரி 1969 முதல் "தமிழ்நாடு" பெயர் மாற்றம் நடைமுறைக்கு வந்தது (Deccan Herald; TNM).',
    anchor_en: 'The Assembly adopted the two-language policy on 23 January 1968; the renaming of Madras State to Tamil Nadu took effect on 14 January 1969 (Deccan Herald; TNM).',
    care_ta: 'இது கழகத்தின் அறிவிக்கப்பட்ட கொள்கை நிலைப்பாடாக வழங்கப்படுகிறது.',
    care_en: 'Presented as the party’s stated linguistic and federal policy position.',
  },
  {
    num: '08',
    title_ta: 'நீட் (NEET) & தொகுதி மறுசீரமைப்பு',
    title_en: 'NEET & Delimitation',
    anchor_ta: 'செப்டம்பர் 2021-ல் நீட் விலக்கு மசோதா நிறைவேற்றப்பட்டது; 15 நவம்பர் 2025-ல் அன்றைய மாநில அரசு உச்ச நீதிமன்றத்தை அணுகியது (Scroll). 22 மார்ச் 2025-ல் தொகுதி மறுசீரமைப்பு குறித்த கூட்டு நடவடிக்கைக் குழு கூட்டம் நடைபெற்றது (Scroll).',
    anchor_en: 'NEET exemption Bill passed in September 2021; the then-DMK state government moved the Supreme Court on 15 November 2025 (Scroll). A joint action committee on delimitation met on 22 March 2025 (Scroll).',
    care_ta: 'இவை முந்தைய மாநில அரசின் நடவடிக்கைகள்; சட்டத்துறையால் தனிப்பட்ட முறையில் தாக்கல் செய்யப்பட்ட மனுக்கள் அல்ல. முடிவு உறுதிப்படுத்தப்படவில்லை.',
    care_en: 'Care: These were actions of the 2021–2026 state government, not Legal Wing filings; final outcomes are unverified.',
  },
  {
    num: '09',
    title_ta: 'மதச்சார்பின்மை',
    title_en: 'Secularism',
    anchor_ta: 'திராவிட முன்னேற்றக் கழகத்தின் அடிப்படைக் கொள்கைகளில் ஒன்றாக மதச்சார்பின்மை குறிப்பிடப்படுகிறது (Wikipedia: DMK).',
    anchor_en: 'Secularism is listed among the DMK’s foundational principles (Wikipedia: DMK).',
    care_ta: 'கழக அரசியலமைப்பு ஆவணத்தில் முதன்மை மேற்கோள் சரிபார்க்கப்பட வேண்டும்.',
    care_en: 'Kept concise pending direct citation from the party constitution.',
  },
];

const ICONS = [
  { name_ta: 'தந்தை பெரியார்', name_en: 'Periyar E. V. Ramasamy', dates: '17 Sep 1879 – 24 Dec 1973' },
  { name_ta: 'பேரறிஞர் அண்ணா', name_en: 'C. N. Annadurai', dates: '15 Sep 1909 – 3 Feb 1969' },
  { name_ta: 'கலைஞர் மு. கருணாநிதி', name_en: 'M. Karunanidhi', dates: '3 Jun 1924 – 7 Aug 2018' },
  { name_ta: 'மு. க. ஸ்டாலின்', name_en: 'M. K. Stalin', dates: 'Party President since 28 Aug 2018' },
];

export default function Ideology() {
  const { lang } = useLang();

  return (
    <>
      <PageTitle
        eyebrow={lang === 'ta' ? 'கழகத்தின் கொள்கை நிலைப்பாடுகள்' : 'Constitutional Folio'}
        lead={lang === 'ta'
          ? 'சரிபார்க்கப்பட்ட வரலாற்று நிகழ்வுகள், சட்ட மைல்கற்கள் மற்றும் கழகத்தின் அறிவிக்கப்பட்ட கொள்கைகளின் தொகுப்பு.'
          : 'Attributed party principles anchored to dated historical milestones and constitutional litigation records.'}
        meta={lang === 'ta' ? '9 கொள்கைத் தூண்கள் · சரிபார்க்கப்பட்ட மேற்கோள்கள்' : '9 Principle Pillars · Sourced & Attributed'}
      >
        {lang === 'ta' ? 'கொள்கைகள்' : 'Ideologies'}
      </PageTitle>

      {/* Monumental Slogan Proclamation Band */}
      <section className="proclamation-band" aria-label="Verified Slogans">
        <div className="wrap proclamation-grid">
          <Reveal className="proclamation-item">
            <span className="proclamation-eyebrow">{lang === 'ta' ? 'அண்ணாவின் கோட்பாடு' : 'Annadurai Principle'}</span>
            <strong className="proclamation-quote">கடமை · கண்ணியம் · கட்டுப்பாடு</strong>
            <span className="proclamation-sub">Duty, Dignity, Discipline (Kadamai, Kanniyam, Kattuppaadu)</span>
          </Reveal>
          <Reveal delay={100} className="proclamation-item">
            <span className="proclamation-eyebrow">{lang === 'ta' ? 'திருமந்திரம் — அண்ணாவின் முழக்கம்' : 'Annadurai Proclamation (Tirumantiram)'}</span>
            <strong className="proclamation-quote">ஒன்றே குலம் ஒருவனே தேவன்</strong>
            <span className="proclamation-sub">Wikipedia: C. N. Annadurai</span>
          </Reveal>
        </div>
      </section>

      <div className="wrap section">
        <VerificationBanner
          text={lang === 'ta'
            ? 'இப்பக்கத்தில் உள்ள தமிழ் தலைப்புகள் (T) மொழிச் சரிபார்ப்புக்கு உட்பட்டவை. ஆதாரமற்ற முழக்கங்கள் நீக்கப்பட்டுள்ளன; "கடமை, கண்ணியம், கட்டுப்பாடு" மற்றும் "ஒன்றே குலம் ஒருவனே தேவன்" ஆகியவை மட்டுமே இடம்பெற்றுள்ளன.'
            : 'All (T) Tamil headings are subject to Tamil proofreading. Unsourced slogans have been omitted; only verified slogans ("Duty, Dignity, Discipline" and "ஒன்றே குலம் ஒருவனே தேவன்") are included.'}
        />

        <div className="editorial-split">
          <aside className="sticky-rail">
            <span className="rail-kicker">{lang === 'ta' ? 'கொள்கை அட்டவணை' : 'Folio Index'}</span>
            <nav className="folio-index" aria-label="Ideology index">
              {BLOCKS.map((b) => (
                <a key={b.num} href={`#pillar-${b.num}`}>
                  <span className="folio-idx-num">{b.num}</span>
                  <span>{lang === 'ta' ? b.title_ta : b.title_en}</span>
                </a>
              ))}
            </nav>
          </aside>

          <div>
            <div className="folio-list">
              {BLOCKS.map((b, i) => (
                <Reveal key={b.num} as="article" id={`pillar-${b.num}`} delay={i * 35} className="folio-chapter">
                  <div className="folio-chapter-head">
                    <span className="folio-chapter-num">{b.num}</span>
                    <h3>{lang === 'ta' ? b.title_ta : b.title_en}</h3>
                  </div>
                  <p className="folio-anchor">{lang === 'ta' ? b.anchor_ta : b.anchor_en}</p>
                  <p className="folio-care">{lang === 'ta' ? b.care_ta : b.care_en}</p>
                </Reveal>
              ))}
            </div>

            <section className="sub-section">
              <Reveal>
                <h2 className="h-sub">{lang === 'ta' ? 'தலைவர்கள்' : 'Ideological Icons'}</h2>
                <p className="hint-text">
                  {lang === 'ta'
                    ? 'தேதிகள் Wikipedia பதிவுகளின் அடிப்படையில் வழங்கப்பட்டுள்ளன; முதன்மை வாழ்க்கை வரலாறு மற்றும் அரசிதழ் சரிபார்ப்பு பரிந்துரைக்கப்படுகிறது.'
                    : 'Dates rest on Wikipedia citations (note 3/4 Feb discrepancy on Annadurai’s death date) and should be cross-checked against official biographies.'}
                </p>
              </Reveal>
              <Reveal delay={80} className="icons-strip">
                {ICONS.map((ic) => (
                  <div key={ic.name_en} className="icon-plaque">
                    <h3>{lang === 'ta' ? ic.name_ta : ic.name_en}</h3>
                    <span>{ic.dates}</span>
                  </div>
                ))}
              </Reveal>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
