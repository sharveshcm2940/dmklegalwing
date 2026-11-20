import { 
  Leader, 
  DistrictInfo, 
  HistoricalMilestone, 
  IdeologyPillar, 
  EventItem, 
  LegalResource, 
  NewsItem,
  FlowchartOfficer,
  LegalDevelopmentItem,
  PressGalleryItem
} from '../types';

export const DMK_ORGANISATION_INFO = {
  name: {
    en: 'DMK Legal Wing (Dravida Munnetra Kazhagam Legal Wing)',
    ta: 'திமுக வழக்கறிஞர் அணி (திராவிட முன்னேற்றக் கழகம்)'
  },
  tagline: {
    en: 'Champions of Social Justice, Constitutional Values & Federal Autonomy in the Halls of Justice',
    ta: 'சமூக நீதி, அரசமைப்பு விழுமியங்கள் மற்றும் மாநில சுயாட்சியின் சட்டக் குரல்'
  },
  headquarters: {
    en: 'Anna Arivalayam, 367/369, Anna Salai, Teynampet, Chennai, Tamil Nadu 600018',
    ta: 'அண்ணா அறிவாலயம், 367/369, அண்ணா சாலை, தேனாம்பேட்டை, சென்னை, தமிழ்நாடு 600018'
  },
  highCourtOffice: {
    en: 'Advocates Association Chambers, Madras High Court Campus, Chennai 600104',
    ta: 'வழக்கறிஞர் சங்க வளாகம், சென்னை உயர் நீதிமன்ற வளாகம், சென்னை 600104'
  },
  phone: '+91 44 2434 4455 / +91 44 2534 1122',
  email: 'legalwing@dmk.org.in',
  establishedYear: '1971',
  barCountEstimated: '28,500+'
};

export const IDEOLOGY_PILLARS: IdeologyPillar[] = [
  {
    id: 'social-justice',
    number: '01',
    title: { en: 'Social Justice & Affirmative Action', ta: 'சமூக நீதியும் இடஒதுக்கீடும்' },
    subtitle: { en: 'Constitutional guarantee of representation for backward classes, SC, ST and minorities', ta: 'பிற்படுத்தப்பட்ட, ஒடுக்கப்பட்ட மக்களுக்கு அரசமைப்புச் சட்டப்படியான சம பிரதிநிதித்துவம்' },
    description: {
      en: 'The bedrock of the Dravidian movement. DMK Legal Wing has consistently protected Tamil Nadu’s historic 69% reservation in the Supreme Court of India, defending the Ninth Schedule shield and fighting against economic and administrative dilution of affirmative action.',
      ta: 'திராவிட இயக்கத்தின் அடித்தளம் சமூக நீதியாகும். தமிழ்நாட்டின் வரலாற்றுச் சிறப்புமிக்க 69% இடஒதுக்கீட்டை உச்ச நீதிமன்றத்தில் பாதுகாப்பதிலும், அரசமைப்புச் சட்டத்தின் 9-வது அட்டவணை பாதுகாப்பை உறுதி செய்வதிலும் திமுக வழக்கறிஞர் அணி முன்னணிப் பங்காற்றி வருகிறது.'
    },
    quote: {
      text: { 
        en: 'Rights are not gifts granted by rulers; they are inherent entitlements won through continuous democratic and constitutional struggle.', 
        ta: 'உரிமைகள் எவராலும் கொடுக்கப்படும் சலுகைகள் அல்ல; அவை இடைவிடாத ஜனநாயக, சட்டப் போராட்டங்களின் வழியே பெறப்படும் அடிப்படை விழுமியங்கள்.' 
      },
      author: { en: 'Thanthai Periyar E.V. Ramasamy', ta: 'தந்தை பெரியார்' },
      context: { en: 'First Provincial Self-Respect Conference, Chengalpattu, 1929', ta: 'முதல் சுயமரியாதை மாகாண மாநாடு, செங்கல்பட்டு, 1929' }
    },
    keyPrinciples: [
      { en: 'Protection of 69% reservation in educational institutions and public employment', ta: 'கல்வி மற்றும் அரசுப் பணிகளில் 69% இடஒதுக்கீட்டுப் பாதுகாப்பு' },
      { en: 'Elimination of structural caste discrimination through constitutional jurisprudence', ta: 'சட்டரீதியான அணுகுமுறைகள் மூலம் சாதிய படிநிலைகளை அகற்றுதல்' },
      { en: 'Representation of first-generation graduates in public services and judiciary', ta: 'நீதித்துறையிலும் அரசுப் பணிகளிலும் முதல் தலைமுறை பட்டதாரிகளுக்குப் பிரதிநிதித்துவம்' }
    ],
    legalRelevance: {
      en: 'Defended Tamil Nadu Act 45 of 1994 before Constitutional Benches of the Supreme Court in the landmark Indira Sawhney implementation petitions.',
      ta: 'இந்திரா சஹானி தீர்ப்புக்குப் பிந்தைய அமர்வுகளில் தமிழ்நாடு சட்டம் 45/1994-ஐ அரசமைப்பு அமர்வுகளில் உறுதிசெய்த சாதனை வரலாறு.'
    },
    color: '#E31E24'
  },
  {
    id: 'self-respect',
    number: '02',
    title: { en: 'Self-Respect & Human Dignity', ta: 'சுயமரியாதையும் மனித மாண்பும்' },
    subtitle: { en: 'Equality before law free from feudal oppression and religious hegemony', ta: 'சமூக ஆதிக்கமற்ற, மனித மாண்பை நிலைநாட்டும் சட்ட சமத்துவம்' },
    description: {
      en: 'Self-respect precedes political freedom. The Legal Wing legalised Self-Respect Marriages (Suyamariyathai Thirumanam) through Section 7A of the Hindu Marriage Act in 1967 under Arignar Anna, ending priestly hegemony and guaranteeing legal recognition to secular marriages.',
      ta: 'சுயமரியாதை என்பது அரசியல் விடுதலையை விட முதன்மையானது. 1967-ல் பேரறிஞர் அண்ணா ஆட்சியில் இந்து திருமணச் சட்டத்தில் பிரிவு 7-A சேர்த்து சுயமரியாதைத் திருமணங்களைச் சட்டபூர்வமாக்கியதில் வழக்கறிஞர்கள் பெருந்துணை புரிந்தனர்.'
    },
    quote: {
      text: { 
        en: 'A society without self-respect is a house without foundations. The law must defend human dignity above ritual dogma.', 
        ta: 'சுயமரியாதை இல்லாத சமூகம் அடித்தளமற்ற வீட்டைப் போன்றது. சடங்குகளை விட மனித மாண்பையே சட்டம் பாதுகாக்க வேண்டும்.' 
      },
      author: { en: 'Perarignar C.N. Annadurai', ta: 'பேரறிஞர் அண்ணா' },
      context: { en: 'Tamil Nadu Legislative Assembly Address on Legalizing Self-Respect Marriages, 1967', ta: 'சுயமரியாதைத் திருமணச் சட்ட முன்வடிவு உரை, தமிழ்நாடு சட்டமன்றம், 1967' }
    },
    keyPrinciples: [
      { en: 'Statutory recognition of self-respect, priestless marriages', ta: 'புரோகிதர் அற்ற சுயமரியாதைத் திருமணங்களின் சட்ட ஏற்பு' },
      { en: 'Gender equality and equal property rights for women (1989 TN Amendment by Kalaignar)', ta: 'பெண்களுக்குச் சொத்தில் சமஉரிமை வழங்கும் 1989 சட்டத் திருத்தம் (கலைஞர்)' },
      { en: 'Protection of individual autonomy against orthodox religious mandates', ta: 'மூடநம்பிக்கை மத ஆதிக்கங்களுக்கு எதிரான தனிநபர் உரிமைப் பாதுகாப்பு' }
    ],
    legalRelevance: {
      en: 'Pioneered statutory reforms recognizing inter-caste marriages and equal rights for all castes to become temple archakas.',
      ta: 'அனைத்து சாதியினரும் அர்ச்சகராகும் சட்டம் மற்றும் கலப்புத் திருமணங்களுக்கான சட்டப் பாதுகாப்புகளைத் தொடர்ந்து முன்னெடுத்தல்.'
    },
    color: '#1A1A1A'
  },
  {
    id: 'federalism',
    number: '03',
    title: { en: 'Federalism & State Autonomy', ta: 'கூட்டாட்சியும் மாநில சுயாட்சியும்' },
    subtitle: { en: 'True federal union of states with financial, administrative and legislative powers', ta: 'மத்தியில் கூட்டாட்சி, மாநிலத்தில் சுயாட்சி என்ற அரசியல் வழிகாட்டுதல்' },
    description: {
      en: 'The Indian Constitution envisages a Union of States. DMK Legal Wing stands as India’s fiercest defender of federal balance against central overreach, misuse of Article 356, appointment overreach by Governors, and financial centralization.',
      ta: 'இந்திய அரசியலமைப்பு மாநிலங்களின் ஒன்றியத்தை முன்மொழிகிறது. ஆளுநர்களின் சட்டவிரோதச் செயல்பாடுகள், பிரிவு 356 தவறாகப் பயன்படுத்தப்படுதல் மற்றும் நிதி ஒருமுகப்படுத்தலுக்கு எதிராக கூட்டாட்சித் தத்துவத்தை உச்ச நீதிமன்றத்தில் நிலைநாட்டுவதில் வழக்கறிஞர் அணி முன்நிற்கிறது.'
    },
    quote: {
      text: { 
        en: 'In the Centre a federal democracy, in the States true autonomy; that alone guarantees the enduring unity of this diverse subcontinent.', 
        ta: 'மத்தியில் கூட்டாட்சி, மாநிலத்தில் சுயாட்சி; அதுவே இந்த பன்முகத் துணைக் கண்டத்தின் நிலைத்த ஒருமைப்பாட்டை உறுதி செய்யும்.' 
      },
      author: { en: 'Muthamizharignar Kalaignar M. Karunanidhi', ta: 'முத்தமிழறிஞர் கலைஞர்' },
      context: { en: 'Rajamannar Committee Report Tabling, 1971', ta: 'ராஜமன்னார் குழு அறிக்கை சட்டசபை சமர்ப்பிப்பு, 1971' }
    },
    keyPrinciples: [
      { en: 'Implementation of recommendations of the historic Rajamannar Committee (1969-71)', ta: 'வரலாற்றுச் சிறப்புமிக்க ராஜமன்னார் குழுவின் கூட்டாட்சிப் பரிந்துரைகள்' },
      { en: 'Restraining gubernatorial overreach under Article 200 on State Assembly Bills', ta: 'சட்டமன்ற மசோதாக்களில் ஆளுநர்களின் காலவரையற்ற முடக்கத்திற்கு எதிரான சட்டப் போராட்டம்' },
      { en: 'Fair devolution of fiscal resources and opposition to unilateral tax surcharges', ta: 'நியாயமான நிதிப் பகிர்வு மற்றும் மத்திய நிதி ஆதிக்கத்திற்கு எதிரான நிலைப்பாடு' }
    ],
    legalRelevance: {
      en: 'Lead petitions before the Supreme Court challenging delays in Governor’s assent to Assembly bills, establishing strict constitutional timeframes.',
      ta: 'சட்டப்பேரவை நிறைவேற்றிய மசோதாக்களுக்கு ஒப்புதல் அளிக்காத ஆளுநர்களின் நடவடிக்கைக்கு எதிராக உச்சநீதிமன்றத்தில் பெறப்பட்ட வழிகாட்டு நெறிமுறைகள்.'
    },
    color: '#E31E24'
  },
  {
    id: 'rationalism',
    number: '04',
    title: { en: 'Rationalism & Scientific Temper', ta: 'பகுத்தறிவும் அறிவியல் மனப்பான்மையும்' },
    subtitle: { en: 'Upholding Article 51A(h) of the Constitution: inquiry, humanism and reform', ta: 'அரசமைப்பு உறுப்பு 51A(h) படி அறிவியல் மனப்பான்மை மற்றும் பகுத்தறிவை வளர்த்தல்' },
    description: {
      en: 'Article 51A(h) makes it the fundamental duty of every citizen to develop scientific temper, humanism, and the spirit of inquiry. The Legal Wing fights against the unconstitutional infusion of religious dogma into school curricula, judicial processes, and civil administration.',
      ta: 'அரசியலமைப்புச் சட்டத்தின் 51A(h) பிரிவு அறிவியல் மனப்பான்மை, மனிதநேயம், ஆய்வறிவு ஆகியவற்றை வளர்ப்பதை அடிப்படைக் கடமையாகக் குறிப்பிடுகிறது. மதவாத மற்றும் மூடநம்பிக்கைக் கருத்துகள் அரசு நிர்வாகத்திலும் கல்வி அமைப்புகளிலும் திணிக்கப்படுவதை சட்டரீதியாக முறியடிக்கிறது.'
    },
    quote: {
      text: { 
        en: 'Do not accept anything merely because it is ancient or spoken by authority. Test it on the touchstone of your own reason and common good.', 
        ta: 'எதையும் பழமையானது என்றோ, பெரியவர்கள் சொன்னார்கள் என்றோ அப்படியே ஏற்காதே; உனது பகுத்தறிவு கொண்டு ஆராய்ந்து சரி எனில் ஏற்றுக்கொள்.' 
      },
      author: { en: 'Thanthai Periyar E.V. Ramasamy', ta: 'தந்தை பெரியார்' },
      context: { en: 'Kudi Arasu Editorial, 1935', ta: 'குடி அரசு இதழ் தலையங்கம், 1935' }
    },
    keyPrinciples: [
      { en: 'Judicial defence of secular public spaces and modern scientific education', ta: 'மதச்சார்பற்ற பொதுவெளிகள் மற்றும் நவீன அறிவியல் கல்வியைப் பாதுகாத்தல்' },
      { en: 'Challenging regressive superstitious practices through Public Interest Litigations', ta: 'பிற்போக்குத்தனமான மூடநம்பிக்கைகளுக்கு எதிரான பொதுநல வழக்குகள்' },
      { en: 'Promoting human rights and democratic rationalism in bar associations', ta: 'வழக்கறிஞர் சங்கங்களில் மனித உரிமைகள் மற்றும் ஜனநாயகப் பகுத்தறிவை வளர்த்தல்' }
    ],
    legalRelevance: {
      en: 'Active interventions in PILs protecting scientific integrity and secular values in Tamil Nadu governance.',
      ta: 'தமிழ்நாடு அரசு நிர்வாகத்தில் அறிவியல்சார் அணுகுமுறைகளையும் மதச்சார்பின்மையையும் காக்கும் பொதுநல வழக்குகள்.'
    },
    color: '#1A1A1A'
  },
  {
    id: 'tamil-language',
    number: '05',
    title: { en: 'Tamil Language Rights in Courts', ta: 'நீதிமன்றங்களில் தமிழ் மொழி உரிமை' },
    subtitle: { en: 'Advocating Tamil as an official language of the Madras High Court under Article 348(2)', ta: 'உயர் நீதிமன்றத்தில் வழக்காடு மொழியாகத் தமிழ் இடம்பெற அரசமைப்புச் சட்டப்படியான போராட்டம்' },
    description: {
      en: 'Justice cannot be inaccessible to the common person who does not speak English. The Legal Wing steadfastly campaigns for the implementation of Article 348(2) to permit the use of Tamil in the Madras High Court, and produces authoritative Tamil legal translations of major statutes.',
      ta: 'ஆங்கிலம் தெரியாத சாமானிய மக்களுக்கு நீதி அன்னியப்பட்டு விடக்கூடாது. உயர் நீதிமன்றத்தில் தமிழ் வழக்காடு மொழியாக அங்கீகரிக்கப்பட வேண்டும் என்பதற்கான தொடர் சட்டப் போராட்டங்களை திமுக வழக்கறிஞர் அணி வழிநடத்துகிறது.'
    },
    quote: {
      text: { 
        en: 'The common man who approaches the temple of justice must hear his mother tongue spoken and understood in his own land.', 
        ta: 'நீதி கேட்டு வரும் சாமானிய மக்கள் தங்களின் தாய்மொழியில் வழக்காடுவதையும், தீர்ப்பு வழங்கப்படுவதையும் காண்பதே முழுமையான குடியரசு.' 
      },
      author: { en: 'Murasoli Maran', ta: 'முரசொலி மாறன்' },
      context: { en: 'Parliamentary Debates on Official Languages, 1986', ta: 'நாடாளுமன்ற அலுவல் மொழி விவாதங்கள், 1986' }
    },
    keyPrinciples: [
      { en: 'Constitutional demand under Article 348(2) for Tamil in the Madras High Court', ta: 'அரசமைப்பு உறுப்பு 348(2)-ன் கீழ் சென்னை உயர் நீதிமன்றத்தில் தமிழ்' },
      { en: 'Publication of high-standard Tamil translations of all Central and State enactments', ta: 'மத்திய, மாநிலச் சட்டங்களின் துல்லியமான தமிழ் மொழிபெயர்ப்புகள் வெளியீடு' },
      { en: 'Promotion of Tamil arguments and orders in all subordinate courts across the State', ta: 'மாநிலத்தின் அனைத்து சார்பு நீதிமன்றங்களிலும் தமிழ் பயன்பாட்டை ஊக்குவித்தல்' }
    ],
    legalRelevance: {
      en: 'Formal resolutions passed by Tamil Nadu Assembly and petitions submitted to the Chief Justice of India and the President.',
      ta: 'சட்டப்பேரவை தீர்மானங்கள் மற்றும் இந்திய உச்ச நீதிமன்றத் தலைமை நீதிபதியிடம் அளிக்கப்பட்டுள்ள தொடர் மனுக்கள்.'
    },
    color: '#E31E24'
  },
  {
    id: 'constitutional-democracy',
    number: '06',
    title: { en: 'Constitutional Democracy & Rule of Law', ta: 'அரசமைப்பு ஜனநாயகமும் சட்டத்தின் ஆட்சியும்' },
    subtitle: { en: 'Resisting authoritarianism, executive impunity and erosion of judicial independence', ta: 'சர்வாதிகாரப் போக்குகளை எதிர்த்து நீதித்துறை சுதந்திரத்தைக் காத்தல்' },
    description: {
      en: 'Dr. B.R. Ambedkar crafted the Indian Constitution with robust safeguards for liberty. DMK Legal Wing stood heroically during the Emergency of 1975, when hundreds of DMK leaders and lawyers were jailed under MISA, defending habeas corpus petitions across Tamil Nadu.',
      ta: 'டாக்டர் அம்பேத்கர் வழங்கிய அரசமைப்பு விழுமியங்களை காப்பதில் திமுக வழக்கறிஞர்கள் முன்னோடிகள். 1975 நெருக்கடி நிலை காலத்தில் மிசா சட்டத்தின் கீழ் சிறைவைக்கப்பட்ட தலைவர்களுக்காக ஆட்கொணர்வு மனுக்களைத் துணிவுடன் தாக்கல் செய்து போராடிய பாரம்பரியம் இது.'
    },
    quote: {
      text: { 
        en: 'The Constitution is not a mere lawyer’s document, it is a vehicle of life, and its spirit is always the spirit of age.', 
        ta: 'அரசமைப்புச் சட்டம் வெறும் வழக்கறிஞர்களுக்கான ஆவணம் மட்டுமல்ல; அது ஒரு நாட்டின் உயிரோட்டமான இயக்கம், அதன் ஆன்மா எப்போதுமே காலத்தின் குரல்.' 
      },
      author: { en: 'Dr. B.R. Ambedkar', ta: 'டாக்டர் பி.ஆர். அம்பேத்கர்' },
      context: { en: 'Constituent Assembly of India Debates, 1949', ta: 'இந்திய அரசமைப்பு நிர்ணய சபை உரைகள், 1949' }
    },
    keyPrinciples: [
      { en: 'Upholding the Basic Structure doctrine enunciated in Kesavananda Bharati', ta: 'கேசவானந்த பாரதி வழக்கின் அரசமைப்பு அடிப்படை கட்டமைப்பு கோட்பாட்டைக் காத்தல்' },
      { en: 'Safeguarding personal liberty against draconian preventive detention laws', ta: 'அடக்குமுறை தடுப்புக் காவல் சட்டங்களுக்கு எதிராக தனிநபர் சுதந்திரத்தைப் பாதுகாத்தல்' },
      { en: 'Free legal aid to workers, students, activists and victimized citizens', ta: 'தொழிலாளர்கள், மாணவர்கள், பாதிக்கப்பட்ட எளியோருக்கு இலவச சட்ட உதவி' }
    ],
    legalRelevance: {
      en: 'Historic legal defense of MISA detenus (1976) and recent challenges against misuse of central investigative agencies like ED, CBI, and IT.',
      ta: 'மிசா வழக்குகளில் சட்டப் பாதுகாப்பு மற்றும் மத்திய புலனாய்வு அமைப்புகளின் அரசியல் பழிவாங்கும் நடவடிக்கைகளுக்கு எதிரான சட்டப் போராட்டங்கள்.'
    },
    color: '#1A1A1A'
  }
];

export const HISTORICAL_MILESTONES: HistoricalMilestone[] = [
  {
    year: '1921',
    title: { en: 'The Communal G.O. (First Affirmative Action in India)', ta: 'முதலாவது வகுப்புவாரி உரிமை அரசாணை (கம்யூனல் ஜி.ஓ.)' },
    description: { 
      en: 'Under the Justice Party government led by the Raja of Panagal, the historic Communal G.O. was passed in Madras Presidency, pioneering reservations in government appointments.', 
      ta: 'நீதிக்கட்சி ஆட்சியில் பனகல் அரசர் முன்னெடுப்பில் சென்னை மாகாணத்தில் முதன்முதலாக வகுப்புவாரி பிரதிநிதித்துவ அரசாணை பிறப்பிக்கப்பட்டு ஒடுக்கப்பட்ட மக்களுக்கு உரிமைகள் வழங்கப்பட்டன.' 
    },
    category: 'Reservation',
    significance: { en: 'Foundation of modern affirmative action in the subcontinent', ta: 'இந்தியத் துணைக் கண்டத்தில் இடஒதுக்கீட்டு வரலாற்றின் தொடக்கப்புள்ளி' }
  },
  {
    year: '1951',
    title: { en: 'First Constitutional Amendment (Article 15(4))', ta: 'முதலாவது அரசமைப்புச் சட்டத் திருத்தம் (உறுப்பு 15(4))' },
    description: { 
      en: 'When the Supreme Court struck down the Communal G.O. in Champakam Dorairajan, Thanthai Periyar and Arignar Anna led mass protests. Prime Minister Nehru introduced the First Constitutional Amendment adding Article 15(4).', 
      ta: 'செண்பகம் துரைராஜன் வழக்கில் கம்யூனல் ஜி.ஓ. ரத்து செய்யப்பட்டபோது பெரியாரும் அண்ணாவும் நடத்திய கிளர்ச்சியால் நேரு அரசமைப்பு முதல் திருத்தத்தைக் கொண்டுவந்து உறுப்பு 15(4)-ஐ இணைத்தார்.' 
    },
    category: 'Constitutional',
    significance: { en: 'Enabled States to make special provisions for Socially and Educationally Backward Classes', ta: 'பிற்படுத்தப்பட்ட வகுப்பினருக்கு சிறப்புச் சட்டங்கள் இயற்ற மாநிலங்களுக்கு அரசமைப்பு அங்கீகாரம்' }
  },
  {
    year: '1967',
    title: { en: 'Enactment of Self-Respect Marriage Act (Section 7A)', ta: 'சுயமரியாதைத் திருமண சட்டப்பூர்வ அங்கீகாரம் (பிரிவு 7A)' },
    description: { 
      en: 'Perarignar Anna assumed office as Chief Minister of Tamil Nadu and his first landmark legislation was legalizing priestless Self-Respect marriages retroactively.', 
      ta: 'பேரறிஞர் அண்ணா முதலமைச்சரானதும் நிறைவேற்றிய முதல் வரலாற்றுச் சட்டம் புரோகிதர் அற்ற சுயமரியாதைத் திருமணங்களைச் சட்டபூர்வமாக்கியதாகும்.' 
    },
    category: 'Legislation',
    significance: { en: 'Radical secular reform recognizing marriages based on mutual consent and declaration', ta: 'சடங்குகளற்ற, பரஸ்பர ஒப்புதல் அடிப்படையிலான திருமணங்களுக்குச் சட்ட அங்கீகாரம்' }
  },
  {
    year: '1971',
    title: { en: 'Formation of DMK Legal Wing & Rajamannar Committee', ta: 'திமுக வழக்கறிஞர் அணி உருவாக்கம் & ராஜமன்னார் குழு அறிக்கை' },
    description: { 
      en: 'Chief Minister Kalaignar Karunanidhi formally established the DMK Legal Wing to coordinate constitutional jurisprudence and commissioned the P.V. Rajamannar Committee on Centre-State Relations.', 
      ta: 'கலைஞர் மு. கருணாநிதி திமுக வழக்கறிஞர் அணியை முறைப்படுத்தி, மத்திய - மாநில அரசுகளின் உறவுகள் குறித்து ஆராய நீதிபதி பி.வி. ராஜமன்னார் குழுவை அமைத்தார்.' 
    },
    category: 'Movement',
    significance: { en: 'First comprehensive institutional study by any Indian state on restructuring federalism', ta: 'மாநில சுயாட்சி குறித்து ஒரு மாநில அரசால் அமைக்கப்பட்ட முதலாவது உயர் மட்டக் குழு' }
  },
  {
    year: '1975',
    title: { en: 'Emergency Defense & MISA Habeas Corpus Petitions', ta: 'எமர்ஜென்சி எதிர்ப்பு & மிசா ஆட்கொணர்வு சட்டப்போராட்டம்' },
    description: { 
      en: 'During the 1975 Internal Emergency, when democratic rights were suspended, DMK advocates filed over 100 habeas corpus petitions in the Madras High Court defending detained leaders and civil liberties.', 
      ta: '1975 அவசரநிலைப் பிரகடனத்தின் போது ஜனநாயக உரிமைகள் பறிக்கப்பட்ட சூழலில், கைது செய்யப்பட்ட தலைவர்களுக்காக சென்னை உயர் நீதிமன்றத்தில் நூற்றுக்கும் மேற்பட்ட ஆட்கொணர்வு மனுக்களைத் தாக்கல் செய்து திமுக வழக்கறிஞர்கள் போராடினர்.' 
    },
    category: 'Constitutional',
    significance: { en: 'Historic defense of fundamental rights and judicial review during constitutional crisis', ta: 'ஜனநாயக நெருக்கடி காலத்தில் மனித உரிமைகள் மற்றும் நீதிமன்ற மறுஆய்வு அதிகாரத்தைப் பாதுகாத்த வரலாற்றுப் பணி' }
  },
  {
    year: '1989',
    title: { en: 'Equal Property Rights for Women Act', ta: 'பெண்களுக்குச் சொத்தில் சம உரிமை வழங்கும் சட்டம்' },
    description: { 
      en: 'Kalaignar Karunanidhi enacted the Hindu Succession (Tamil Nadu Amendment) Act 1989, conferring equal coparcenary property rights to women—later adopted nationwide in 2005.', 
      ta: 'கலைஞர் தலைமையிலான திமுக அரசு பெண்களுக்குப் பூர்வீகச் சொத்தில் சமஉரிமை வழங்கும் தமிழ்நாடு திருத்தச் சட்டத்தை நிறைவேற்றியது; இது பின்னர் 2005-ல் மத்திய அரசால் தேசிய அளவில் ஏற்கப்பட்டது.' 
    },
    category: 'Legislation',
    significance: { en: 'Revolutionized gender rights in property law 16 years ahead of Central legislation', ta: 'மத்திய அரசு சட்டம் கொண்டுவருவதற்கு 16 ஆண்டுகளுக்கு முன்பே தமிழகத்தில் புரட்சி' }
  },
  {
    year: '1994',
    title: { en: '69% Reservation & Ninth Schedule Constitutional Shield', ta: '69% இடஒதுக்கீடு & 9-வது அட்டவணை அரசமைப்பு பாதுகாப்பு' },
    description: { 
      en: 'Tamil Nadu Act 45 of 1994 was passed and placed in the Ninth Schedule through the 76th Constitutional Amendment, defended through dozens of Supreme Court hearings by DMK legal stalwarts.', 
      ta: 'தமிழ்நாடு சட்டம் 45/1994 நிறைவேற்றப்பட்டு, 76-வது அரசமைப்புத் திருத்தம் மூலம் 9-வது அட்டவணையில் சேர்க்கப்பட்டு உச்ச நீதிமன்றத்தில் திமுக வழக்கறிஞர்களால் தொடர்ச்சியாகப் பாதுகாக்கப்பட்டது.' 
    },
    category: 'Reservation',
    significance: { en: 'Protected Tamil Nadu’s pioneering quota against the judicial 50% ceiling', ta: 'நீதிமன்றங்களின் 50% வரம்பை மீறி தமிழ்நாட்டின் 69% இடஒதுக்கீட்டை நிலைநிறுத்திய சாதனை' }
  },
  {
    year: '2006',
    title: { en: 'Archakas of All Castes Ordinance & Legislation', ta: 'அனைத்து சாதியினரும் அர்ச்சகர் ஆகும் வரலாற்றுச் சட்டம்' },
    description: { 
      en: 'Fulfilling the dream of Thanthai Periyar, Chief Minister Kalaignar Karunanidhi enacted legislation enabling qualified individuals from all communities to become temple priests, defended successfully in the courts.', 
      ta: 'பெரியாரின் நெஞ்சில் தைத்த முள்ளை அகற்றும் வகையில், தகுதியுள்ள அனைத்து சாதியினரும் கோயில் அர்ச்சகராகும் வரலாற்றுச் சட்டத்தை கலைஞர் அரசு நிறைவேற்றி நீதிமன்றங்களில் உறுதி செய்தது.' 
    },
    category: 'Legislation',
    significance: { en: 'Shattered caste-based priesthood monopolies through constitutional equality', ta: 'சமத்துவக் கோட்பாட்டின் மூலம் பிறப்பு அடிப்படையிலான பாகுபாடுகளைத் தகர்த்த சமூக நீதி மைல்கல்' }
  },
  {
    year: '2021',
    title: { en: '27% OBC Reservation in All-India Medical Quota', ta: 'அகில இந்திய மருத்துவ இடங்களில் ஓபிசி 27% இடஒதுக்கீட்டு வெற்றி' },
    description: { 
      en: 'DMK and Senior Advocate P. Wilson moved the Madras High Court and Supreme Court, securing 27% reservation for OBC candidates in All-India Quota medical seats, benefiting thousands of students annually.', 
      ta: 'அகில இந்திய மருத்துவ இடங்களில் ஓபிசி மாணவர்களுக்கு 27% இடஒதுக்கீடு பெற்றுத்தர திமுக மூத்த வழக்கறிஞர் பி. வில்சன் சென்னை உயர் நீதிமன்றம் மற்றும் உச்ச நீதிமன்றத்தில் போராடி வரலாற்றுத் தீர்ப்பு பெற்றார்.' 
    },
    category: 'Reservation',
    significance: { en: 'Secured thousands of medical seats for backward classes nationwide every year', ta: 'ஆண்டுதோறும் ஆயிரக்கணக்கான பிற்படுத்தப்பட்ட மாணவர்கள் மருத்துவம் பயிலும் உரிமையை உறுதி செய்த தீர்ப்பு' }
  },
  {
    year: '2024-2026',
    title: { en: 'Governor Inaction Precedent & NEET Legal Challenges', ta: 'மாநில உரிமைகள், ஆளுநர் அதிகார வரம்பு & நீட் தேர்வு சட்டப் போராட்டம்' },
    description: { 
      en: 'Under Chief Minister M.K. Stalin and Senior Advocate P. Wilson MP, DMK Legal Wing achieved landmark Supreme Court rulings mandating that Governors cannot pocket-veto state legislation, and continues the legal struggle against NEET.', 
      ta: 'முதலமைச்சர் மு.க. ஸ்டாலின் வழிகாட்டுதலில், மூத்த வழக்கறிஞர் பி. வில்சன் எம்பி உள்ளிட்டோர் முன்னெடுப்பில் ஆளுநர்கள் மசோதாக்களைக் காலவரையின்றி முடக்க முடியாது என்ற உச்சநீதிமன்ற வரலாற்றுத் தீர்ப்பு பெறப்பட்டது.' 
    },
    category: 'Constitutional',
    significance: { en: 'Redefined constitutional boundaries for State Assemblies across the Republic of India', ta: 'இந்திய ஒன்றியத்தின் அனைத்து மாநிலங்களின் சட்டப்பேரவை அதிகாரத்தையும் பாதுகாத்த தீர்ப்பு' }
  }
];

export const OFFICIAL_HIERARCHY_CHART: {
  president: FlowchartOfficer;
  secretary: FlowchartOfficer;
  jointSecretaries: FlowchartOfficer[];
  deputySecretaries: FlowchartOfficer[];
  headOfficeAdvocates: FlowchartOfficer[];
} = {
  president: {
    id: 'r-viduthalai',
    name: { en: 'R. Viduthalai', ta: 'ஆர். விடுதலை' },
    role: { en: 'Senior Advocate & Former Advocate General', ta: 'மூத்த வழக்கறிஞர் & முன்னாள் தலைமை வழக்கறிஞர்' },
    designation: { en: 'President', ta: 'தலைவர்' },
    district: { en: 'Chennai', ta: 'சென்னை' },
    branch: 'president',
    honorific: { en: 'Senior Advocate', ta: 'மூத்த வழக்கறிஞர்' },
    court: 'Supreme Court of India & Madras High Court',
    barCouncilNo: 'MS/318/1979',
    bio: {
      en: 'Distinguished Senior Advocate and former Advocate General of Tamil Nadu. Widely regarded for masterminding monumental social justice, 69% reservation protection, and federal autonomy jurisprudence before constitutional benches.',
      ta: 'தமிழ்நாட்டின் முன்னாள் தலைமை வழக்கறிஞர் (Advocate General) மற்றும் புகழ்பெற்ற மூத்த வழக்கறிஞர். அரசமைப்பு அமர்வுகளில் சமூக நீதி, 69% இடஒதுக்கீடு பாதுகாப்பு மற்றும் மாநில சுயாட்சிக்கான வழக்குகளை முன்நின்று நடத்திய பெருமைக்குரியவர்.'
    },
    isSenior: true
  },
  secretary: {
    id: 'n-r-elango',
    name: { en: 'N.R. Elango', ta: 'என்.ஆர். இளங்கோ' },
    role: { en: 'Senior Advocate & Member of Parliament (Rajya Sabha)', ta: 'மூத்த வழக்கறிஞர் & நாடாளுமன்ற உறுப்பினர் (மாநிலங்களவை)' },
    designation: { en: 'Secretary', ta: 'செயலாளர்' },
    district: { en: 'Chennai', ta: 'சென்னை' },
    branch: 'secretary',
    honorific: { en: 'Senior Advocate & M.P.', ta: 'மூத்த வழக்கறிஞர் & எம்.பி.' },
    court: 'Supreme Court of India & Madras High Court',
    barCouncilNo: 'MS/651/1985',
    bio: {
      en: 'Senior Advocate of four decades standing and Member of Parliament (Rajya Sabha). Stalwart voice defending constitutional democracy, civil liberties, and criminal justice reforms both on the floor of Parliament and in the highest courts.',
      ta: 'நாடாளுமன்ற மாநிலங்களவை உறுப்பினர் மற்றும் நான்கு தசாப்தங்களுக்கும் மேலான அனுபவம் கொண்ட மூத்த வழக்கறிஞர். மனித உரிமைப் பாதுகாப்பு, குற்றவியல் சட்டவியல் மற்றும் ஜனநாயக விழுமியங்களை நிலைநிறுத்துவதில் முன்னணிப் பங்காற்றுபவர்.'
    },
    isSenior: true
  },
  jointSecretaries: [
    {
      id: 'i-paranthaman',
      name: { en: 'I. Paranthaman', ta: 'ஐ. பரந்தாமன்' },
      role: { en: 'Member of Legislative Assembly (Egmore) & Advocate', ta: 'சட்டமன்ற உறுப்பினர் (எழும்பூர்) & வழக்கறிஞர்' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'joint_secretaries',
      court: 'Madras High Court & City Civil Courts',
      bio: {
        en: 'Member of the Tamil Nadu Legislative Assembly representing Egmore constituency. Seasoned trial advocate active in constitutional debate and cadre legal mobilization across the state.',
        ta: 'எழும்பூர் தொகுதி சட்டமன்ற உறுப்பினர் மற்றும் வழக்கறிஞர். சட்டமன்றத்திலும் நீதிமன்றங்களிலும் மக்கள் உரிமைகளுக்காகவும் திராவிடக் கொள்கைகளுக்காகவும் குரலெழுப்பும் களப்பணியாளர்.'
      }
    },
    {
      id: 'k-s-ravichandran',
      name: { en: 'K.S. Ravichandran', ta: 'கே.எஸ். ரவிச்சந்திரன்' },
      role: { en: 'Advocate, Madras High Court', ta: 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர்' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'joint_secretaries',
      court: 'Madras High Court',
      bio: {
        en: 'Advocate of the Madras High Court with deep experience in civil, criminal, and service jurisprudence, coordinating state-level legal support for party cadres.',
        ta: 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர். உரிமையியல், குற்றவியல் மற்றும் பணித்துறை வழக்குகளில் அனுபவம் வாய்ந்தவர்; கழகத் தோழர்களுக்கான சட்டப்பணிகளை முன்னெடுப்பவர்.'
      }
    },
    {
      id: 'n-maniraj',
      name: { en: 'N. Maniraj', ta: 'என். மணிராஜ்' },
      role: { en: 'Advocate & District Bar Leader', ta: 'வழக்கறிஞர் & மாவட்ட வழக்கறிஞர் சங்கத் தலைவர்' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Karur', ta: 'கரூர்' },
      branch: 'joint_secretaries',
      court: 'Karur District & Sessions Court',
      bio: {
        en: 'Leading counsel at Karur District Court, spearheading party legal wings across the Cauvery delta region and providing prompt legal aid to cadres.',
        ta: 'கரூர் மாவட்ட வழக்கறிஞர்; காவேரி டெல்டா மண்டல வழக்கறிஞர்களை ஒருங்கிணைத்து, கழகத் தோழர்களுக்கு உடனடி சட்டப் பாதுகாப்பு வழங்கி வருபவர்.'
      }
    },
    {
      id: 'k-m-dhandapani',
      name: { en: 'K.M. Dhandapani', ta: 'கே.எம். தண்டபாணி' },
      role: { en: 'Advocate, Coimbatore District Bar', ta: 'வழக்கறிஞர், கோவை மாவட்ட வழக்கறிஞர் சங்கம்' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
      branch: 'joint_secretaries',
      court: 'Coimbatore District Courts',
      bio: {
        en: 'Prominent advocate from Coimbatore leading Western Zone legal operations, labor court representations, and grassroots bar coordination.',
        ta: 'மேற்கு மண்டல வழக்கறிஞர்களை வழிநடத்தும் கோவை மாவட்ட வழக்கறிஞர்; தொழிலாளர் நல தீர்ப்பாயங்கள் மற்றும் உரிமையியல் வழக்குகளில் நீண்ட அனுபவம் கொண்டவர்.'
      }
    },
    {
      id: 'radhakrishnan',
      name: { en: 'Radhakrishnan', ta: 'இராதாகிருஷ்ணன்' },
      role: { en: 'Advocate, Erode District Bar', ta: 'வழக்கறிஞர், ஈரோடு மாவட்ட வழக்கறிஞர் சங்கம்' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Erode', ta: 'ஈரோடு' },
      branch: 'joint_secretaries',
      court: 'Erode District & Sessions Court',
      bio: {
        en: 'Senior advocate of the Erode Bar coordinating Legal Wing wings across Erode, Tiruppur, and Namakkal districts.',
        ta: 'ஈரோடு, திருப்பூர், நாமக்கல் மாவட்ட வழக்கறிஞர்களை ஒருங்கிணைத்து, கீழமை நீதிமன்றங்களில் சமூக நீதிக்கான பணிகளை முன்னெடுத்து வருபவர்.'
      }
    },
    {
      id: 'arul-mozhi',
      name: { en: 'Arul Mozhi', ta: 'அருள்மொழி' },
      role: { en: 'Advocate & Social Reform Jurist', ta: 'வழக்கறிஞர் & சமூக சீர்திருத்த சட்டவியலாளர்' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
      branch: 'joint_secretaries',
      court: 'Madras High Court & Coimbatore Courts',
      bio: {
        en: 'Champion of gender equality, self-respect principles, and civil liberties, representing key public interest litigation across Tamil Nadu.',
        ta: 'பெண்கள் உரிமை, சுயமரியாதைத் திருமண சட்டப் பாதுகாப்பு மற்றும் சமூக சமத்துவத்திற்கான வழக்குகளில் தீவிரமாக இயங்கும் மூத்த சட்டப் போராளி.'
      }
    },
    {
      id: 'r-thamaraiselvan',
      name: { en: 'R. Thamaraiselvan', ta: 'ஆர். தாமரைச்செல்வன்' },
      role: { en: 'Advocate & Former Member of Parliament (Dharmapuri)', ta: 'வழக்கறிஞர் & முன்னாள் நாடாளுமன்ற உறுப்பினர் (தர்மபுரி)' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Dharmapuri', ta: 'தர்மபுரி' },
      branch: 'joint_secretaries',
      court: 'Madras High Court & Dharmapuri Courts',
      bio: {
        en: 'Former Member of Parliament from Dharmapuri and senior trial advocate, coordinating legal defense networks across North-Western Tamil Nadu.',
        ta: 'தர்மபுரி முன்னாள் நாடாளுமன்ற உறுப்பினர் மற்றும் மூத்த வழக்கறிஞர்; வடக்கு-மேற்கு மாவட்டங்களில் கழக வழக்கறிஞர் அணியின் தூணாக விளங்குபவர்.'
      }
    },
    {
      id: 'j-pachaiyappan',
      name: { en: 'J. Pachaiyappan', ta: 'ஜெ. பச்சையப்பன்' },
      role: { en: 'Advocate, Madras High Court', ta: 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர்' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'joint_secretaries',
      court: 'Madras High Court',
      bio: {
        en: 'Experienced appellate lawyer at the Madras High Court, actively monitoring election law compliance and writ proceedings.',
        ta: 'சென்னை உயர் நீதிமன்றத்தில் மேல்முறையீடு மற்றும் தேர்தல் வழக்குகளைக் கையாளும் திறமையான வழக்கறிஞர்.'
      }
    },
    {
      id: 'surya-vetrikondan',
      name: { en: 'Surya Vetrikondan', ta: 'சூர்யா வெற்றிகொண்டான்' },
      role: { en: 'Advocate, Madras High Court & Ideology Wing', ta: 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர் & கொள்கை விளக்கப் பிரிவு' },
      designation: { en: 'Joint Secretary', ta: 'இணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'joint_secretaries',
      court: 'Madras High Court',
      bio: {
        en: 'Young and dynamic constitutional counsel carrying forward the ideological legacy of the Dravidian movement in judicial forums.',
        ta: 'திராவிட இயக்கத்தின் கொள்கை வழித்தோன்றலாக நீதிமன்றங்களிலும் மக்கள் மன்றங்களிலும் அரசமைப்பு விழுமியங்களை நிலைநாட்டும் இளம் வழக்கறிஞர்.'
      }
    }
  ],
  deputySecretaries: [
    {
      id: 'k-chandru',
      name: { en: 'K. Chandru', ta: 'கே. சந்துரு' },
      role: { en: 'Advocate, Madras High Court', ta: 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர்' },
      designation: { en: 'Deputy Secretary', ta: 'துணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'deputy_secretaries',
      court: 'Madras High Court',
      bio: {
        en: 'Active legal practitioner at Madras High Court focusing on administrative jurisprudence, fundamental rights, and cadre bail protections.',
        ta: 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர்; நிர்வாகச் சட்டம், அடிப்படை உரிமைகள் மற்றும் கழகத் தோழர்களுக்கான பிணைப் பணிகளை விரைவுபடுத்துபவர்.'
      }
    },
    {
      id: 'ragu',
      name: { en: 'Ragu', ta: 'ரகு' },
      role: { en: 'Advocate, High Court Bar Association', ta: 'உயர் நீதிமன்ற வழக்கறிஞர்' },
      designation: { en: 'Deputy Secretary', ta: 'துணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'deputy_secretaries',
      court: 'Madras High Court',
      bio: {
        en: 'Trusted litigation counsel handling metropolitan court operations and assisting state executive secretariat coordination.',
        ta: 'தலைநகர் சென்னை நீதிமன்றங்களில் கழகப் பணிகளையும் தலைமைச் செயலக நிர்வாகத் தொடர்புகளையும் கவனிக்கும் வழக்கறிஞர்.'
      }
    },
    {
      id: 'dr-g-chandrabose',
      name: { en: 'Dr. G. Chandrabose', ta: 'டாக்டர் ஜி. சந்திரபோஸ்' },
      role: { en: 'Advocate & Legal Academician', ta: 'வழக்கறிஞர் & சட்டத்துறை அறிஞர்' },
      designation: { en: 'Deputy Secretary', ta: 'துணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'deputy_secretaries',
      court: 'Madras High Court',
      bio: {
        en: 'Doctorate in Law and practicing advocate, spearheading legal seminars, research journals, and policy briefs for the Legal Wing.',
        ta: 'சட்டத்துறையில் முனைவர் பட்டம் பெற்ற வழக்கறிஞர்; சட்ட கருத்தரங்குகள், ஆய்வுக் கட்டுரைகள் மற்றும் பயிற்சி வகுப்புகளை ஒருங்கிணைப்பவர்.'
      }
    },
    {
      id: 'marudhu-ganesh',
      name: { en: 'Marudhu Ganesh', ta: 'மருது கணேஷ்' },
      role: { en: 'Advocate & Dedicated Cadre Leader', ta: 'வழக்கறிஞர் & கழக களப் போராளி' },
      designation: { en: 'Deputy Secretary', ta: 'துணைச் செயலாளர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'deputy_secretaries',
      court: 'Madras High Court & George Town Bar',
      bio: {
        en: 'Popular grassroots advocate and seasoned campaigner known for fearless legal defenses during mass democratic demonstrations.',
        ta: 'மக்களோடு மக்களாக நின்று ஜனநாயகப் போராட்டங்களில் சட்டப் பாதுகாப்பு வழங்கும் கள வழக்கறிஞர்.'
      }
    },
    {
      id: 'raja-mohamed',
      name: { en: 'Raja Mohamed', ta: 'ராஜா முகமது' },
      role: { en: 'Advocate, Tirunelveli District Bar', ta: 'வழக்கறிஞர், திருநெல்வேலி மாவட்ட நீதிமன்றம்' },
      designation: { en: 'Deputy Secretary', ta: 'துணைச் செயலாளர்' },
      district: { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
      branch: 'deputy_secretaries',
      court: 'Tirunelveli District Courts & Madurai Bench',
      bio: {
        en: 'Leading advocate from Tirunelveli bridging the Southern District Bars and strengthening minority and human rights litigation.',
        ta: 'தென்மாவட்ட வழக்கறிஞர்களை ஒருங்கிணைக்கும் நெல்லை வழக்கறிஞர்; சிறுபான்மையினர் மற்றும் விளிம்புநிலை மக்களின் சட்ட உரிமைகளுக்காகப் பாடுபடுபவர்.'
      }
    }
  ],
  headOfficeAdvocates: [
    {
      id: 'k-j-saravanan',
      name: { en: 'K.J. Saravanan', ta: 'கே.ஜே. சரவணன்' },
      role: { en: 'Head Office Advocate, Anna Arivalayam', ta: 'தலைமையக வழக்கறிஞர், அண்ணா அறிவாலயம்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'headoffice_advocates',
      court: 'Anna Arivalayam Secretariat & High Court',
      bio: {
        en: 'Head office counsel based at Anna Arivalayam, managing central documentation, statutory filings, and headquarters legal protocols.',
        ta: 'அண்ணா அறிவாலயத்தில் அமைந்த தலைமையகத்தில் தலைமைச் செயலக ஆவணங்கள் மற்றும் சட்டப் பணிகளைக் கவனிக்கும் வழக்கறிஞர்.'
      }
    },
    {
      id: 'v-kavi-ganesan',
      name: { en: 'V. Kavi Ganesan', ta: 'வி. கவி கணேசன்' },
      role: { en: 'Head Office Advocate, Anna Arivalayam', ta: 'தலைமையக வழக்கறிஞர், அண்ணா அறிவாலயம்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'headoffice_advocates',
      court: 'Madras High Court',
      bio: {
        en: 'Head office coordinator facilitating liaison between district legal units and the state high command.',
        ta: 'மாவட்ட அமைப்புகளுக்கும் கழகத் தலைமைக்கும் இடையிலான சட்டத் தொடர்புகளை ஒருங்கிணைக்கும் தலைமையக வழக்கறிஞர்.'
      }
    },
    {
      id: 'k-maraimalai',
      name: { en: 'K. Maraimalai', ta: 'கே. மறைமலை' },
      role: { en: 'Head Office Advocate & Delta Bar Liaison', ta: 'தலைமையக வழக்கறிஞர் & டெல்டா மண்டல பொறுப்பாளர்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' },
      branch: 'headoffice_advocates',
      court: 'Nagapattinam District Courts',
      bio: {
        en: 'Nagapattinam advocate serving on the central state panel, overseeing agrarian and coastal fishermen legal rights.',
        ta: 'நாகப்பட்டினம் மாவட்ட வழக்கறிஞர்; டெல்டா விவசாயிகள் மற்றும் மீனவ மக்களின் சட்டப் பாதுகாப்பில் முன்னிற்பவர்.'
      }
    },
    {
      id: 'suvai-suresh',
      name: { en: 'Suvai Suresh', ta: 'சுவை சுரேஷ்' },
      role: { en: 'Head Office Advocate & Northern Zone In-Charge', ta: 'தலைமையக வழக்கறிஞர் & வடக்கு மண்டல பொறுப்பாளர்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Villupuram', ta: 'விழுப்புரம்' },
      branch: 'headoffice_advocates',
      court: 'Villupuram District Courts',
      bio: {
        en: 'Villupuram advocate liaising northern district bars with the party headquarters, actively assisting rural legal aid camps.',
        ta: 'விழுப்புரம் மாவட்ட வழக்கறிஞர்; வடக்கு மண்டல கீழமை நீதிமன்ற வழக்குகளையும் தலைமையகப் பணிகளையும் இணைப்பவர்.'
      }
    },
    {
      id: 'manoj',
      name: { en: 'Manoj', ta: 'மனோஜ்' },
      role: { en: 'Head Office Advocate & Southern Coastal Bar Liaison', ta: 'தலைமையக வழக்கறிஞர் & தென் கடலோர மண்டல பொறுப்பாளர்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Thoothukudi', ta: 'தூத்துக்குடி' },
      branch: 'headoffice_advocates',
      court: 'Thoothukudi District Courts & Madurai Bench',
      bio: {
        en: 'Advocate from Thoothukudi coordinating maritime and environmental legal aid, providing active legal coverage in southern coastal bars.',
        ta: 'தூத்துக்குடி மாவட்ட வழக்கறிஞர்; தென் கடலோர மாவட்டங்களின் வழக்கறிஞர் பணிகளைத் தலைமையகத்துடன் ஒருங்கிணைப்பவர்.'
      }
    },
    {
      id: 'dinesh',
      name: { en: 'Dinesh', ta: 'தினேஷ்' },
      role: { en: 'Head Office Advocate & Coastal Delta Bar Liaison', ta: 'தலைமையக வழக்கறிஞர் & கடலோர டெல்டா பொறுப்பாளர்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' },
      branch: 'headoffice_advocates',
      court: 'Nagapattinam District Courts',
      bio: {
        en: 'Dedicated counsel from Nagapattinam coordinating grassroots dispute resolutions and defending worker grievances in district courts.',
        ta: 'நாகப்பட்டினம் வழக்கறிஞர்; கீழமை நீதிமன்றங்களில் எளிய மக்களுக்கான சட்ட உதவிகளையும் தலைமையக ஒருங்கிணைப்பையும் மேற்கொள்பவர்.'
      }
    },
    {
      id: 'm-s-p-veeramani',
      name: { en: 'M.S.P. Veeramani', ta: 'எம்.எஸ்.பி. வீரமணி' },
      role: { en: 'Head Office Advocate & Central Zone Coordinator', ta: 'தலைமையக வழக்கறிஞர் & மத்திய மண்டல ஒருங்கிணைப்பாளர்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Tiruchi', ta: 'திருச்சி' },
      branch: 'headoffice_advocates',
      court: 'Tiruchi District & Sessions Court',
      bio: {
        en: 'Senior practitioner at Tiruchirappalli District Court coordinating Central Tamil Nadu advocates and student bar forums.',
        ta: 'திருச்சி மாவட்ட வழக்கறிஞர்; மத்திய மண்டல வழக்கறிஞர்கள் மற்றும் சட்டக் கல்லூரி மாணவர் மன்றங்களை வழிநடத்துபவர்.'
      }
    },
    {
      id: 'minjur-suresh',
      name: { en: 'Minjur Suresh', ta: 'மீஞ்சூர் சுரேஷ்' },
      role: { en: 'Head Office Advocate & Northern Suburban Bar Liaison', ta: 'தலைமையக வழக்கறிஞர் & திருவள்ளூர் புறநகர் பொறுப்பாளர்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Chennai', ta: 'சென்னை' },
      branch: 'headoffice_advocates',
      court: 'Madras High Court & Ponneri Courts',
      bio: {
        en: 'Advocate representing Minjur and northern suburban courts, ensuring rapid legal aid intervention for public interest causes.',
        ta: 'மீஞ்சூர், பொன்னேரி மற்றும் திருவள்ளூர் பகுதிகளை உள்ளடக்கிய வடசென்னை புறநகர் நீதிமன்றப் பணிகளை ஒருங்கிணைக்கும் வழக்கறிஞர்.'
      }
    },
    {
      id: 'kalanidhi',
      name: { en: 'Kalanidhi', ta: 'கலாநிதி' },
      role: { en: 'Head Office Advocate & Madurai Bench Coordinator', ta: 'தலைமையக வழக்கறிஞர் & மதுரை கிளை ஒருங்கிணைப்பாளர்' },
      designation: { en: 'Head Office Advocate', ta: 'தலைமையக வழக்கறிஞர்' },
      district: { en: 'Madurai North', ta: 'மதுரை வடக்கு' },
      branch: 'headoffice_advocates',
      court: 'Madras High Court (Madurai Bench)',
      bio: {
        en: 'Madurai North counsel coordinating Madurai Bench legal interventions and public interest cases for the 13 southern districts.',
        ta: 'மதுரை வடக்கு வழக்கறிஞர்; சென்னை உயர் நீதிமன்ற மதுரை கிளையில் 13 தென்மாவட்டங்களுக்கான பொதுநல மற்றும் கட்சி வழக்குகளை ஒருங்கிணைப்பவர்.'
      }
    }
  ]
};

export const LEADERSHIP_PROFILES: Leader[] = [
  {
    id: 'r-viduthalai',
    name: { en: 'R. Viduthalai', ta: 'ஆர். விடுதலை' },
    role: { en: 'Senior Advocate & Former Advocate General of Tamil Nadu', ta: 'மூத்த வழக்கறிஞர் & முன்னாள் தலைமை வழக்கறிஞர்' },
    designation: { en: 'President, DMK Legal Wing', ta: 'தலைவர், திமுக வழக்கறிஞர் அணி' },
    level: 'state',
    barCouncilNo: 'MS/318/1979',
    practiceArea: { en: 'Constitutional Benches, Social Justice, Reservation Defense & Writs', ta: 'அரசமைப்பு அமர்வுகள், சமூக நீதி, இடஒதுக்கீட்டுப் பாதுகாப்பு & நீதிப்பேராணைகள்' },
    bio: {
      en: 'Senior Advocate and former Advocate General of Tamil Nadu. Foremost constitutional authority who has represented the state government and the Dravidian movement in epochal Supreme Court and High Court litigations protecting 69% reservation and state rights.',
      ta: 'தமிழ்நாட்டின் முன்னாள் அட்வகேட் ஜெனரல் மற்றும் மூத்த வழக்கறிஞர். சமூக நீதி, 69% இடஒதுக்கீடு பாதுகாப்பு மற்றும் மாநில சுயாட்சி தொடர்பான வரலாற்று சிறப்புமிக்க வழக்குகளை உச்ச நீதிமன்றத்தில் வாதாடிய பெருமைக்குரியவர்.'
    },
    image: '/images/dmk-flag-sun.jpg',
    email: 'viduthalai.office@dmk.org.in',
    phone: '+91 44 2434 4455',
    court: 'Supreme Court of India & Madras High Court',
    featured: true
  },
  {
    id: 'n-r-elango',
    name: { en: 'N.R. Elango', ta: 'என்.ஆர். இளங்கோ' },
    role: { en: 'Senior Advocate & Member of Parliament (Rajya Sabha)', ta: 'மூத்த வழக்கறிஞர் & நாடாளுமன்ற உறுப்பினர் (மாநிலங்களவை)' },
    designation: { en: 'Secretary, DMK Legal Wing', ta: 'செயலாளர், திமுக வழக்கறிஞர் அணி' },
    level: 'state',
    barCouncilNo: 'MS/651/1985',
    practiceArea: { en: 'Criminal Jurisprudence, Constitutional Writs & Corporate Governance', ta: 'குற்றவியல் சட்டவியல், அரசமைப்பு நீதிப்பேராணைகள் & நிறுவனச் சட்டம்' },
    bio: {
      en: 'Senior Advocate with four decades of trial and appellate experience, and Member of Parliament (Rajya Sabha). Stalwart voice defending civil liberties, criminal justice reforms, and federalism.',
      ta: 'நாடாளுமன்ற மாநிலங்களவை உறுப்பினர் மற்றும் நான்கு தசாப்தங்களுக்கும் மேலான அனுபவம் கொண்ட மூத்த வழக்கறிஞர். மனித உரிமைப் பாதுகாப்பு, குற்றவியல் சட்டவியல் மற்றும் ஜனநாயக விழுமியங்களை நிலைநிறுத்துவதில் முன்னணிப் பங்காற்றுபவர்.'
    },
    image: '/images/dmk-flag-sun.jpg',
    email: 'nrelango.office@dmk.org.in',
    phone: '+91 44 2811 3322',
    court: 'Supreme Court of India & Madras High Court',
    featured: true
  },
  {
    id: 'p-wilson',
    name: { en: 'P. Wilson', ta: 'பி. வில்சன்' },
    role: { en: 'Senior Advocate & Member of Parliament (Rajya Sabha)', ta: 'மூத்த வழக்கறிஞர் & நாடாளுமன்ற உறுப்பினர் (மாநிலங்களவை)' },
    designation: { en: 'Senior Advisory Counsel & MP', ta: 'மூத்த சட்ட ஆலோசகர் & நாடாளுமன்ற உறுப்பினர்' },
    level: 'advisory',
    barCouncilNo: 'MS/482/1989',
    practiceArea: { en: 'Constitutional, Administrative, Election & Appellate Law', ta: 'அரசமைப்புச் சட்டம், நிர்வாகவியல், தேர்தல் & மேல்முறையீட்டுச் சட்டம்' },
    bio: {
      en: 'Senior Advocate of the Madras High Court and Supreme Court of India. Former Additional Solicitor General of India and former Advocate General of Tamil Nadu. Has argued landmark constitutional cases including OBC reservations in All India Quota, 69% reservation defense, and federal challenges against Governor delays.',
      ta: 'உச்ச நீதிமன்ற மற்றும் சென்னை உயர் நீதிமன்ற மூத்த வழக்கறிஞர். இந்தியாவின் முன்னாள் கூடுதல் சொலிசிட்டர் ஜெனரல் மற்றும் தமிழ்நாட்டின் முன்னாள் அட்வகேட் ஜெனரல். அகில இந்திய மருத்துவ இடங்களில் ஓபிசி 27% இடஒதுக்கீடு, மாநில சுயாட்சி மற்றும் ஆளுநர் மசோதா முடக்கத்திற்கு எதிரான வரலாற்றுச் சிறப்புமிக்க வழக்குகளை நடத்தியவர்.'
    },
    image: '/images/dmk-flag-sun.jpg',
    email: 'pwilson.office@dmk.org.in',
    phone: '+91 44 2434 4455',
    court: 'Supreme Court of India & Madras High Court',
    featured: true
  },
  {
    id: 's-manoharan',
    name: { en: 'S. Manoharan', ta: 'எஸ். மனோகரன்' },
    role: { en: 'Advocate & State Additional Secretary', ta: 'வழக்கறிஞர் & மாநில கூடுதல் செயலாளர்' },
    designation: { en: 'State Additional Secretary, DMK Legal Wing', ta: 'மாநில கூடுதல் செயலாளர், வழக்கறிஞர் அணி' },
    level: 'state',
    barCouncilNo: 'MS/912/1993',
    practiceArea: { en: 'Service Law, Labour Tribunals & Civil Litigation', ta: 'பணித்துறை சட்டம், தொழிலாளர் தீர்ப்பாயம் & உரிமையியல் வழக்குகள்' },
    bio: {
      en: 'Has served in the DMK Legal Wing for over 30 years, coordinating grassroots advocate networks and defending union and public servant rights across Tamil Nadu.',
      ta: 'முப்பது ஆண்டுகளுக்கும் மேலாக திமுக வழக்கறிஞர் அணியில் களப்பணியாற்றி, அடித்தட்டு வழக்கறிஞர்களின் கட்டமைப்பு மற்றும் தொழிலாளர் உரிமைகளுக்காகப் பாடுபட்டு வருபவர்.'
    },
    image: '/images/dmk-flag-sun.jpg',
    email: 'manoharan.law@dmk.org.in',
    court: 'Madras High Court',
    featured: false
  },
  {
    id: 'k-s-arivazhagan',
    name: { en: 'K.S. Arivazhagan', ta: 'கே.எஸ். அறிவழகன்' },
    role: { en: 'Senior Advocate, Madurai Bench Coordinator', ta: 'மூத்த வழக்கறிஞர், மதுரை கிளை ஒருங்கிணைப்பாளர்' },
    designation: { en: 'State Joint Secretary (Madurai Bench Jurisdiction)', ta: 'மாநில இணைச் செயலாளர் (மதுரை உயர்நீதிமன்றக் கிளை)' },
    level: 'high_court',
    barCouncilNo: 'MS/784/1991',
    practiceArea: { en: 'Writ Petitions, Public Interest Litigations & Panchayati Raj Law', ta: 'நீதிப்பேராணைகள், பொதுநல வழக்குகள் & உள்ளாட்சி மன்ற சட்டங்கள்' },
    bio: {
      en: 'Oversees legal wing activities across the southern districts covering 13 district bars attached to the Madurai Bench of the Madras High Court.',
      ta: 'சென்னை உயர் நீதிமன்ற மதுரை கிளையின் ஆளுகைக்குட்பட்ட 13 தென் மாவட்ட வழக்கறிஞர்கள் மற்றும் சங்கங்களின் ஒருங்கிணைப்பாளராகச் செயல்படுகிறார்.'
    },
    image: '/images/dmk-flag-sun.jpg',
    email: 'arivazhagan.madurai@dmk.org.in',
    court: 'Madras High Court (Madurai Bench)',
    featured: true
  },
  {
    id: 'r-sudha',
    name: { en: 'Advocate R. Sudha', ta: 'வழக்கறிஞர் ஆர். சுதா' },
    role: { en: 'Coordinator, Women Advocates Forum', ta: 'ஒருங்கிணைப்பாளர், மகளிர் வழக்கறிஞர் பேரவை' },
    designation: { en: 'State Deputy Secretary, DMK Legal Wing', ta: 'மாநில துணைச் செயலாளர், வழக்கறிஞர் அணி' },
    level: 'state',
    barCouncilNo: 'MS/1120/1998',
    practiceArea: { en: 'Domestic Relations, POCSO, Women Rights & Constitutional Protection', ta: 'குடும்ப நலச் சட்டம், போக்சோ, பெண்கள் உரிமைகள் & அரசமைப்புப் பாதுகாப்பு' },
    bio: {
      en: 'Leads state-wide legal clinics empowering women lawyers and providing pro-bono defense for indigent women and domestic violence survivors.',
      ta: 'பெண் வழக்கறிஞர்களுக்கான சட்டப் பயிலரங்குகளை ஒருங்கிணைத்து, எளிய குடும்ப வன்முறையால் பாதிக்கப்பட்ட பெண்களுக்கு இலவச சட்ட உதவிகளை வழங்கி வருபவர்.'
    },
    image: '/images/dmk-flag-sun.jpg',
    email: 'sudha.womenlegal@dmk.org.in',
    court: 'Madras High Court & City Civil Courts',
    featured: true
  },
  {
    id: 'm-velmurugan',
    name: { en: 'M. Velmurugan', ta: 'மு. வேல்முருகன்' },
    role: { en: 'Senior Advocate & District Wing In-Charge', ta: 'மூத்த வழக்கறிஞர் & மாவட்ட அமைப்பாளர் ஒருங்கிணைப்பு' },
    designation: { en: 'State Deputy Secretary (Organisation & Training)', ta: 'மாநில துணைச் செயலாளர் (அமைப்பு & பயிற்சிகள்)' },
    level: 'state',
    barCouncilNo: 'MS/832/1995',
    practiceArea: { en: 'Land Laws, Tenancy Disputes & Environmental Jurisprudence', ta: 'நிலச் சட்டங்கள், குத்தகை வழக்குகள் & சுற்றுச்சூழல் சட்டவியல்' },
    bio: {
      en: 'Coordinates orientation programmes for junior advocates, preparing them for bar council activities, digital court procedures, and legal research.',
      ta: 'இளம் வழக்கறிஞர்களுக்கான நெறிமுறைப் பயிற்சி முகாம்கள், டிஜிட்டல் நீதிமன்ற வழிகாட்டுதல்கள் மற்றும் சட்ட ஆய்வுப் பட்டறைகளை ஒருங்கிணைப்பவர்.'
    },
    image: '/images/dmk-flag-sun.jpg',
    email: 'velmurugan.training@dmk.org.in',
    court: 'Madras High Court',
    featured: false
  }
];

export const TAMIL_NADU_DISTRICTS: DistrictInfo[] = [
  {
    id: 'chennai',
    name: { en: 'Chennai', ta: 'சென்னை' },
    headquarters: { en: 'Chennai', ta: 'சென்னை' },
    zone: 'Chennai',
    organizer: { en: 'Adv. S. Prabhakaran', ta: 'வழக்கறிஞர் எஸ். பிரபாகரன்' },
    jointOrganizers: [
      { en: 'Adv. K. Balaji (North)', ta: 'வழக்கறிஞர் கே. பாலாஜி (வடக்கு)' },
      { en: 'Adv. V. Selvam (South)', ta: 'வழக்கறிஞர் வி. செல்வம் (தெற்கு)' },
      { en: 'Adv. M. Anbarasu (Central)', ta: 'வழக்கறிஞர் மு. அன்பரசு (மத்திய)' }
    ],
    contactPhone: '+91 44 2534 8899',
    contactEmail: 'chennai.legal@dmk.org.in',
    courtComplex: { en: 'Madras High Court & City Civil Court Complex, Chennai 600104', ta: 'சென்னை உயர் நீதிமன்றம் & பெருநகர உரிமையியல் நீதிமன்ற வளாகம்' },
    memberCount: 4200,
    activeCasesAssisted: 310
  },
  {
    id: 'coimbatore',
    name: { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
    headquarters: { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
    zone: 'West',
    organizer: { en: 'Adv. R. Shanmugasundaram', ta: 'வழக்கறிஞர் ஆர். சண்முகசுந்தரம்' },
    jointOrganizers: [
      { en: 'Adv. P. Murugesan', ta: 'வழக்கறிஞர் பி. முருகேசன்' },
      { en: 'Adv. S. Kousalya', ta: 'வழக்கறிஞர் எஸ். கௌசல்யா' }
    ],
    contactPhone: '+91 422 230 4511',
    contactEmail: 'coimbatore.legal@dmk.org.in',
    courtComplex: { en: 'District & Principal Sessions Court Complex, Arts College Road, Coimbatore', ta: 'மாவட்ட & முதன்மை அமர்வு நீதிமன்ற வளாகம், கோவை' },
    memberCount: 1650,
    activeCasesAssisted: 142
  },
  {
    id: 'madurai',
    name: { en: 'Madurai', ta: 'மதுரை' },
    headquarters: { en: 'Madurai', ta: 'மதுரை' },
    zone: 'South',
    organizer: { en: 'Adv. T. Mohanraj', ta: 'வழக்கறிஞர் டி. மோகன்ராஜ்' },
    jointOrganizers: [
      { en: 'Adv. G. Muthuramalingam', ta: 'வழக்கறிஞர் ஜி. முத்துராமலிங்கம்' },
      { en: 'Adv. A. Fatima Mary', ta: 'வழக்கறிஞர் ஏ. பாத்திமா மேரி' }
    ],
    contactPhone: '+91 452 253 1188',
    contactEmail: 'madurai.legal@dmk.org.in',
    courtComplex: { en: 'Madras High Court Madurai Bench & District Combined Court Campus', ta: 'சென்னை உயர்நீதிமன்ற மதுரை கிளை & மாவட்ட நீதிமன்ற வளாகம்' },
    memberCount: 2400,
    activeCasesAssisted: 215
  },
  {
    id: 'tiruchirappalli',
    name: { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
    headquarters: { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
    zone: 'Central',
    organizer: { en: 'Adv. N. Karunakaran', ta: 'வழக்கறிஞர் என். கருணாகரன்' },
    jointOrganizers: [
      { en: 'Adv. V. Ravichandran', ta: 'வழக்கறிஞர் வி. ரவிச்சந்திரன்' },
      { en: 'Adv. K. Thamizhselvi', ta: 'வழக்கறிஞர் கே. தமிழ்ச்செல்வி' }
    ],
    contactPhone: '+91 431 241 5566',
    contactEmail: 'trichy.legal@dmk.org.in',
    courtComplex: { en: 'District & Sessions Court, Cantonment, Tiruchirappalli', ta: 'மாவட்ட & அமர்வு நீதிமன்ற வளாகம், கண்டோன்மென்ட், திருச்சி' },
    memberCount: 1350,
    activeCasesAssisted: 98
  },
  {
    id: 'salem',
    name: { en: 'Salem', ta: 'சேலம்' },
    headquarters: { en: 'Salem', ta: 'சேலம்' },
    zone: 'West',
    organizer: { en: 'Adv. P. Govindaraj', ta: 'வழக்கறிஞர் பி. கோவிந்தராஜ்' },
    jointOrganizers: [
      { en: 'Adv. C. Venkatesh', ta: 'வழக்கறிஞர் சி. வெங்கடேஷ்' },
      { en: 'Adv. M. Revathi', ta: 'வழக்கறிஞர் எம். ரேவதி' }
    ],
    contactPhone: '+91 427 245 3322',
    contactEmail: 'salem.legal@dmk.org.in',
    courtComplex: { en: 'Combined Court Buildings, Hasthampatti, Salem', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், அஸ்தம்பட்டி, சேலம்' },
    memberCount: 1120,
    activeCasesAssisted: 84
  },
  {
    id: 'tirunelveli',
    name: { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
    headquarters: { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
    zone: 'South',
    organizer: { en: 'Adv. M. Subramanian', ta: 'வழக்கறிஞர் எம். சுப்பிரமணியன்' },
    jointOrganizers: [
      { en: 'Adv. K. Essakkimuthu', ta: 'வழக்கறிஞர் கே. இசக்கிமுத்து' }
    ],
    contactPhone: '+91 462 250 1244',
    contactEmail: 'tirunelveli.legal@dmk.org.in',
    courtComplex: { en: 'District Court Complex, Palayamkottai, Tirunelveli', ta: 'மாவட்ட நீதிமன்ற வளாகம், பாளையங்கோட்டை' },
    memberCount: 940,
    activeCasesAssisted: 76
  },
  {
    id: 'thanjavur',
    name: { en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
    headquarters: { en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
    zone: 'Central',
    organizer: { en: 'Adv. K. Rajendran', ta: 'வழக்கறிஞர் கே. ராஜேந்திரன்' },
    jointOrganizers: [
      { en: 'Adv. S. Jayakumar', ta: 'வழக்கறிஞர் எஸ். ஜெயக்குமார்' }
    ],
    contactPhone: '+91 4362 278 190',
    contactEmail: 'thanjavur.legal@dmk.org.in',
    courtComplex: { en: 'Court Buildings, Court Road, Thanjavur', ta: 'நீதிமன்ற வளாகம், கோர்ட் ரோடு, தஞ்சாவூர்' },
    memberCount: 880,
    activeCasesAssisted: 65
  },
  {
    id: 'vellore',
    name: { en: 'Vellore', ta: 'வேலூர்' },
    headquarters: { en: 'Vellore', ta: 'வேலூர்' },
    zone: 'North',
    organizer: { en: 'Adv. D. Vijay Anand', ta: 'வழக்கறிஞர் டி. விஜய் ஆனந்த்' },
    jointOrganizers: [
      { en: 'Adv. A. Syed Mustafa', ta: 'வழக்கறிஞர் ஏ. சையத் முஸ்தபா' }
    ],
    contactPhone: '+91 416 222 3490',
    contactEmail: 'vellore.legal@dmk.org.in',
    courtComplex: { en: 'Combined Court Complex, Sathuvachari, Vellore', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், சத்துவாச்சாரி, வேலூர்' },
    memberCount: 760,
    activeCasesAssisted: 52
  },
  {
    id: 'kanchipuram',
    name: { en: 'Kanchipuram', ta: 'காஞ்சிபுரம்' },
    headquarters: { en: 'Kanchipuram', ta: 'காஞ்சிபுரம்' },
    zone: 'North',
    organizer: { en: 'Adv. T. Parthiban', ta: 'வழக்கறிஞர் டி. பார்த்திபன்' },
    jointOrganizers: [{ en: 'Adv. M. Sundar', ta: 'வழக்கறிஞர் எம். சுந்தர்' }],
    contactPhone: '+91 44 2722 4110',
    contactEmail: 'kanchi.legal@dmk.org.in',
    courtComplex: { en: 'District Court Complex, Collectorate Campus, Kanchipuram', ta: 'மாவட்ட நீதிமன்ற வளாகம், காஞ்சிபுரம்' },
    memberCount: 690,
    activeCasesAssisted: 48
  },
  {
    id: 'cuddalore',
    name: { en: 'Cuddalore', ta: 'கடலூர்' },
    headquarters: { en: 'Cuddalore', ta: 'கடலூர்' },
    zone: 'Central',
    organizer: { en: 'Adv. S. Elangovan', ta: 'வழக்கறிஞர் எஸ். இளங்கோவன்' },
    jointOrganizers: [{ en: 'Adv. R. Balaji', ta: 'வழக்கறிஞர் ஆர். பாலாஜி' }],
    contactPhone: '+91 4142 230 880',
    contactEmail: 'cuddalore.legal@dmk.org.in',
    courtComplex: { en: 'District & Sessions Court, Beach Road, Cuddalore', ta: 'மாவட்ட & அமர்வு நீதிமன்றம், பீச் ரோடு, கடலூர்' },
    memberCount: 710,
    activeCasesAssisted: 49
  },
  {
    id: 'erode',
    name: { en: 'Erode', ta: 'ஈரோடு' },
    headquarters: { en: 'Erode', ta: 'ஈரோடு' },
    zone: 'West',
    organizer: { en: 'Adv. C. Mani', ta: 'வழக்கறிஞர் சி. மணி' },
    jointOrganizers: [{ en: 'Adv. P. Selvaraj', ta: 'வழக்கறிஞர் பி. செல்வராஜ்' }],
    contactPhone: '+91 424 225 6112',
    contactEmail: 'erode.legal@dmk.org.in',
    courtComplex: { en: 'Combined Court Complex, Sampath Nagar, Erode', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், சம்பத் நகர், ஈரோடு' },
    memberCount: 680,
    activeCasesAssisted: 57
  },
  {
    id: 'kanniyakumari',
    name: { en: 'Kanniyakumari', ta: 'கன்னியாகுமரி' },
    headquarters: { en: 'Nagercoil', ta: 'நாகர்கோவில்' },
    zone: 'South',
    organizer: { en: 'Adv. J. Lawrence', ta: 'வழக்கறிஞர் ஜே. லாரன்ஸ்' },
    jointOrganizers: [{ en: 'Adv. M. Sasikumar', ta: 'வழக்கறிஞர் எம். சசிகுமார்' }],
    contactPhone: '+91 4652 232 505',
    contactEmail: 'kanyakumari.legal@dmk.org.in',
    courtComplex: { en: 'District Court Complex, Court Road, Nagercoil', ta: 'மாவட்ட நீதிமன்ற வளாகம், நாகர்கோவில்' },
    memberCount: 620,
    activeCasesAssisted: 45
  },
  {
    id: 'dindigul',
    name: { en: 'Dindigul', ta: 'திண்டுக்கல்' },
    headquarters: { en: 'Dindigul', ta: 'திண்டுக்கல்' },
    zone: 'South',
    organizer: { en: 'Adv. R. Chelladurai', ta: 'வழக்கறிஞர் ஆர். செல்லத்துரை' },
    jointOrganizers: [{ en: 'Adv. K. Karthik', ta: 'வழக்கறிஞர் கே. கார்த்திக்' }],
    contactPhone: '+91 451 242 7701',
    contactEmail: 'dindigul.legal@dmk.org.in',
    courtComplex: { en: 'Combined Court Complex, Dindigul 624001', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், திண்டுக்கல்' },
    memberCount: 590,
    activeCasesAssisted: 41
  },
  {
    id: 'dharmapuri',
    name: { en: 'Dharmapuri', ta: 'தருமபுரி' },
    headquarters: { en: 'Dharmapuri', ta: 'தருமபுரி' },
    zone: 'West',
    organizer: { en: 'Adv. S. Madhavan', ta: 'வழக்கறிஞர் எஸ். மாதவன்' },
    jointOrganizers: [{ en: 'Adv. T. Murugan', ta: 'வழக்கறிஞர் டி. முருகன்' }],
    contactPhone: '+91 4342 260 300',
    contactEmail: 'dharmapuri.legal@dmk.org.in',
    courtComplex: { en: 'District & Sessions Court, Collectorate Road, Dharmapuri', ta: 'மாவட்ட நீதிமன்ற வளாகம், தருமபுரி' },
    memberCount: 460,
    activeCasesAssisted: 34
  },
  {
    id: 'krishnagiri',
    name: { en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி' },
    headquarters: { en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி' },
    zone: 'West',
    organizer: { en: 'Adv. M. Shankar', ta: 'வழக்கறிஞர் எம். சங்கர்' },
    jointOrganizers: [{ en: 'Adv. P. Boopathy', ta: 'வழக்கறிஞர் பி. பூபதி' }],
    contactPhone: '+91 4343 234 110',
    contactEmail: 'krishnagiri.legal@dmk.org.in',
    courtComplex: { en: 'District Court Complex, Rayakottai Road, Krishnagiri', ta: 'மாவட்ட நீதிமன்ற வளாகம், ராயக்கோட்டை ரோடு, கிருஷ்ணகிரி' },
    memberCount: 510,
    activeCasesAssisted: 39
  },
  {
    id: 'thiruvallur',
    name: { en: 'Tiruvallur', ta: 'திருவள்ளூர்' },
    headquarters: { en: 'Tiruvallur', ta: 'திருவள்ளூர்' },
    zone: 'North',
    organizer: { en: 'Adv. K. Munusamy', ta: 'வழக்கறிஞர் கே. முனுசாமி' },
    jointOrganizers: [{ en: 'Adv. V. Gopinath', ta: 'வழக்கறிஞர் வி. கோபிநாத்' }],
    contactPhone: '+91 44 2766 5440',
    contactEmail: 'tiruvallur.legal@dmk.org.in',
    courtComplex: { en: 'Combined Court Buildings, Master Plan Complex, Tiruvallur', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், திருவள்ளூர்' },
    memberCount: 640,
    activeCasesAssisted: 51
  },
  {
    id: 'chengalpattu',
    name: { en: 'Chengalpattu', ta: 'செங்கல்பட்டு' },
    headquarters: { en: 'Chengalpattu', ta: 'செங்கல்பட்டு' },
    zone: 'North',
    organizer: { en: 'Adv. E. Devendran', ta: 'வழக்கறிஞர் இ. தேவேந்திரன்' },
    jointOrganizers: [{ en: 'Adv. G. Anandhan', ta: 'வழக்கறிஞர் ஜி. ஆனந்தன்' }],
    contactPhone: '+91 44 2742 8090',
    contactEmail: 'chengalpattu.legal@dmk.org.in',
    courtComplex: { en: 'District Court Complex, GST Road, Chengalpattu', ta: 'மாவட்ட நீதிமன்ற வளாகம், ஜி.எஸ்.டி. சாலை, செங்கல்பட்டு' },
    memberCount: 580,
    activeCasesAssisted: 44
  },
  {
    id: 'viluppuram',
    name: { en: 'Viluppuram', ta: 'விழுப்புரம்' },
    headquarters: { en: 'Viluppuram', ta: 'விழுப்புரம்' },
    zone: 'North',
    organizer: { en: 'Adv. N. Anbazhagan', ta: 'வழக்கறிஞர் என். அன்பழகன்' },
    jointOrganizers: [{ en: 'Adv. S. Ramasamy', ta: 'வழக்கறிஞர் எஸ். ராமசாமி' }],
    contactPhone: '+91 4146 222 170',
    contactEmail: 'viluppuram.legal@dmk.org.in',
    courtComplex: { en: 'Combined Court Complex, Master Plan Complex, Viluppuram', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், விழுப்புரம்' },
    memberCount: 520,
    activeCasesAssisted: 38
  },
  {
    id: 'namakkal',
    name: { en: 'Namakkal', ta: 'நாமக்கல்' },
    headquarters: { en: 'Namakkal', ta: 'நாமக்கல்' },
    zone: 'West',
    organizer: { en: 'Adv. K. Kandasamy', ta: 'வழக்கறிஞர் கே. கந்தசாமி' },
    jointOrganizers: [{ en: 'Adv. R. Sivakumar', ta: 'வழக்கறிஞர் ஆர். சிவகுமார்' }],
    contactPhone: '+91 4286 280 440',
    contactEmail: 'namakkal.legal@dmk.org.in',
    courtComplex: { en: 'District & Sessions Court, Mohanur Road, Namakkal', ta: 'மாவட்ட நீதிமன்ற வளாகம், மோகனூர் ரோடு, நாமக்கல்' },
    memberCount: 470,
    activeCasesAssisted: 33
  },
  {
    id: 'pudukkottai',
    name: { en: 'Pudukkottai', ta: 'புதுக்கோட்டை' },
    headquarters: { en: 'Pudukkottai', ta: 'புதுக்கோட்டை' },
    zone: 'Central',
    organizer: { en: 'Adv. M. Chidambaram', ta: 'வழக்கறிஞர் எம். சிதம்பரம்' },
    jointOrganizers: [{ en: 'Adv. A. Kasinathan', ta: 'வழக்கறிஞர் ஏ. காசிநாதன்' }],
    contactPhone: '+91 4322 221 680',
    contactEmail: 'pudukkottai.legal@dmk.org.in',
    courtComplex: { en: 'Combined Court Complex, Kalyanaramapuram, Pudukkottai', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், புதுக்கோட்டை' },
    memberCount: 440,
    activeCasesAssisted: 31
  },
  {
    id: 'ramanathapuram',
    name: { en: 'Ramanathapuram', ta: 'ராமநாதபுரம்' },
    headquarters: { en: 'Ramanathapuram', ta: 'ராமநாதபுரம்' },
    zone: 'South',
    organizer: { en: 'Adv. K. Syed Ibrahim', ta: 'வழக்கறிஞர் கே. சையத் இப்ராஹிம்' },
    jointOrganizers: [{ en: 'Adv. M. Packiaraj', ta: 'வழக்கறிஞர் எம். பாக்கியராஜ்' }],
    contactPhone: '+91 4567 220 540',
    contactEmail: 'ramnad.legal@dmk.org.in',
    courtComplex: { en: 'District & Sessions Court, Collectorate Complex, Ramanathapuram', ta: 'மாவட்ட & அமர்வு நீதிமன்ற வளாகம், ராமநாதபுரம்' },
    memberCount: 430,
    activeCasesAssisted: 29
  },
  {
    id: 'thoothukudi',
    name: { en: 'Thoothukudi', ta: 'தூத்துக்குடி' },
    headquarters: { en: 'Thoothukudi', ta: 'தூத்துக்குடி' },
    zone: 'South',
    organizer: { en: 'Adv. P. Jeyakumar', ta: 'வழக்கறிஞர் பி. ஜெயக்குமார்' },
    jointOrganizers: [{ en: 'Adv. S. Antony Raj', ta: 'வழக்கறிஞர் எஸ். அந்தோணி ராஜ்' }],
    contactPhone: '+91 461 232 4470',
    contactEmail: 'thoothukudi.legal@dmk.org.in',
    courtComplex: { en: 'District Court Complex, Palayamkottai Road, Thoothukudi', ta: 'மாவட்ட நீதிமன்ற வளாகம், பாளையங்கோட்டை சாலை, தூத்துக்குடி' },
    memberCount: 560,
    activeCasesAssisted: 42
  }
];

export const LEGAL_RESOURCES: LegalResource[] = [
  {
    id: 'res-69-reservation',
    title: { 
      en: 'Tamil Nadu 69% Reservation Act (Act 45 of 1994) & Ninth Schedule Constitutional Compendium', 
      ta: 'தமிழ்நாடு 69% இடஒதுக்கீட்டுச் சட்டம் (1994 சட்டம் 45) மற்றும் 9-வது அட்டவணை அரசமைப்புத் தொகுப்பு' 
    },
    category: 'Supreme Court',
    court: 'Supreme Court of India',
    citation: 'AIR 1994 SC 1802 / Writ Petition (Civil) 471 of 1994',
    summary: {
      en: 'Complete legal dossier containing the background, statement of objects and reasons, the 76th Constitutional Amendment, and Supreme Court affidavits filed by the State of Tamil Nadu upholding 69% reservation.',
      ta: 'தமிழ்நாட்டின் 69% இடஒதுக்கீட்டைப் பாதுகாக்கும் 76-வது அரசமைப்புத் திருத்தம், சட்ட முன்வடிவின் நோக்கங்கள் மற்றும் உச்ச நீதிமன்றத்தில் அரசு தாக்கல் செய்த மனுக்களின் முழுமையான சட்டத் தொகுப்பு.'
    },
    keyHighlights: {
      en: [
        'Protection under Article 31B and 31C of the Constitution of India',
        'Empirical backwardness data compiled by the Tamil Nadu Backward Classes Commission',
        'Affirmative defense of 50% relaxation based on quantifiable sociological metrics'
      ],
      ta: [
        'இந்திய அரசமைப்புச் சட்டம் உறுப்பு 31B மற்றும் 31C-ன் படியான சட்டப் பாதுகாப்பு',
        'தமிழ்நாடு பிற்படுத்தப்பட்டோர் ஆணையத்தின் முறையான புள்ளிவிவரத் தரவுகள்',
        'சமூகவியல் பின்னடைவின் அடிப்படையில் 50% வரம்பைத் தளர்த்துவதற்கான சட்ட வாதங்கள்'
      ]
    },
    fileSize: '4.8 MB',
    downloadUrl: '#',
    date: '2024-03-15',
    isOfficial: true
  },
  {
    id: 'res-governor-assent',
    title: { 
      en: 'Governor’s Constitutional Discretion under Article 200: Precedent Analysis & Submissions', 
      ta: 'அரசமைப்பு உறுப்பு 200-ன் கீழ் ஆளுநரின் அதிகார வரம்பு: உச்ச நீதிமன்ற வாதங்கள் & தீர்ப்பு ஆய்வு' 
    },
    category: 'Supreme Court',
    court: 'Supreme Court of India',
    citation: 'State of Tamil Nadu v. Governor of Tamil Nadu, 2023 INSC 1030',
    summary: {
      en: 'A comprehensive briefing paper on the constitutional limitation of Governors under Article 200, ruling that a Governor cannot withhold assent indefinitely or act as an appellate authority over an elected legislature.',
      ta: 'சட்டப்பேரவை நிறைவேற்றும் மசோதாக்களை ஆளுநர் காலவரையின்றி முடக்கி வைக்க முடியாது என்றும், அவர் மக்களால் தேர்ந்தெடுக்கப்பட்ட சட்டப்பேரவைக்கு மேலான அதிகார மையம் அல்ல என்றும் விளக்கும் விரிவான சட்டக் குறிப்பு.'
    },
    keyHighlights: {
      en: [
        'Proviso to Article 200 mandates assent upon re-adoption of the Bill by the Legislative Assembly',
        'Reaffirmation of the Parliamentary cabinet form of government as part of basic structure',
        'Elimination of pocket-veto concepts in State executive machinery'
      ],
      ta: [
        'சட்டமன்றம் மீண்டும் நிறைவேற்றி அனுப்பும் மசோதாக்களுக்கு ஒப்புதல் அளிப்பது கட்டாயம்',
        'அரசமைப்பின் அடிப்படைக் கட்டமைப்பான நாடாளுமன்ற ஜனநாயக நெறிமுறைகள் உறுதிப்படுத்தல்',
        'ஆளுநர்கள் மசோதாக்களைக் கிடப்பில் போடும் மறைமுக வீட்டோ அதிகாரம் ரத்து'
      ]
    },
    fileSize: '3.2 MB',
    downloadUrl: '#',
    date: '2023-11-20',
    isOfficial: true
  },
  {
    id: 'res-self-respect-marriage',
    title: { 
      en: 'Hindu Marriage (Tamil Nadu Amendment) Act 1967 (Section 7A): Statutory Guide', 
      ta: 'இந்து திருமண (தமிழ்நாடு திருத்தச் சட்டம்) 1967 (பிரிவு 7A): சுயமரியாதைத் திருமண சட்ட வழிகாட்டி' 
    },
    category: 'Statute',
    court: 'Madras High Court',
    citation: 'Madras Act XXI of 1967 (Section 7-A inserted)',
    summary: {
      en: 'An authoritative legal guide detailing the procedure, validity, and rights arising from Self-Respect marriages solemnized under Section 7-A without religious rites, priests, or ceremonies.',
      ta: 'மத சடங்குகள் அல்லது புரோகிதர்கள் இன்றி பரஸ்பர மாலை மாற்றிக்கொள்வதன் மூலம் நடைபெறும் சுயமரியாதைத் திருமணங்களின் சட்ட ஏற்பு மற்றும் பதிவு நடைமுறைகள் குறித்த முழுமையான வழிகாட்டி.'
    },
    keyHighlights: {
      en: [
        'Valid marriage solemnized by mutual exchange of rings, garlands, or spoken declarations',
        'Full inheritance and legitimate status for children born of such marriages',
        'Madras High Court rulings upholding freedom of solemnization without police intimidation'
      ],
      ta: [
        'மாலை, மோதிரம் மாற்றுதல் அல்லது உறுதிமொழிகள் மூலம் சுயமரியாதைத் திருமணம் சட்டபூர்வமானது',
        'இத்திருமணங்களில் பிறக்கும் குழந்தைகளுக்குச் சட்டப்படியான முழு வாரிசுரிமை',
        'காவல்துறை அல்லது சாதிய தலையீடுகளிலிருந்து பாதுகாப்பு வழங்கும் சென்னை உயர்நீதிமன்றத் தீர்ப்புகள்'
      ]
    },
    fileSize: '2.1 MB',
    downloadUrl: '#',
    date: '2024-01-10',
    isOfficial: true
  },
  {
    id: 'res-rajamannar-autonomy',
    title: { 
      en: 'Rajamannar Committee Report on Centre-State Relations (1971): The Historic Foundation', 
      ta: 'மத்திய - மாநில உறவுகள் குறித்த ராஜமன்னார் குழு அறிக்கை (1971): வரலாற்று ஆவணம்' 
    },
    category: 'Constitution',
    court: 'Constitutional Bench',
    summary: {
      en: 'The legendary report authored by former Chief Justice P.V. Rajamannar, commissioned by Kalaignar Karunanidhi. Proposed abolition of Article 356, financial devolution, and inter-state council activation.',
      ta: 'முன்னாள் தலைமை நீதிபதி பி.வி. ராஜமன்னார் தலைமையில் கலைஞர் அமைத்த வரலாற்றுச் சிறப்புமிக்க குழுவின் அறிக்கை. அரசமைப்புப் பிரிவு 356 ரத்து, நிதிப் பகிர்வு மற்றும் மாநில சுயாட்சி சீர்திருத்தங்கள் அடங்கிய ஆவணம்.'
    },
    keyHighlights: {
      en: [
        'Proposal to repeal Article 356 and curb dismissal of democratically elected state governments',
        'Devolution of Corporation Tax and Customs Duties into the Divisible Pool',
        'Transfer of Residuary Powers of legislation from Union to States'
      ],
      ta: [
        'தேர்ந்தெடுக்கப்பட்ட மாநில அரசுகளைக் கலைக்கும் உறுப்பு 356-ஐ நீக்கப் பரிந்துரை',
        'நிறுவன வரி மற்றும் சுங்க வரிகளை மாநிலங்களுக்கான பொது நிதிப் பகிர்வில் சேர்த்தல்',
        'எஞ்சிய சட்டமியற்றும் அதிகாரங்களை ஒன்றியத்திலிருந்து மாநிலங்களுக்கு மாற்றுதல்'
      ]
    },
    fileSize: '7.4 MB',
    downloadUrl: '#',
    date: '2023-09-12',
    isOfficial: true
  },
  {
    id: 'res-legal-aid-handbook',
    title: { 
      en: 'Citizen’s Guide to Free Legal Aid, Bail Jurisprudence & Fundamental Rights', 
      ta: 'சாமானிய மக்களுக்கான இலவச சட்ட உதவி, பிணை உரிமைகள் & அடிப்படை உரிமைகள் கையேடு' 
    },
    category: 'Legal Aid',
    summary: {
      en: 'Bilingual practical handbook published by DMK Legal Wing for young advocates and citizens explaining Article 21, Article 22, the right to bail, and Legal Services Authorities Act.',
      ta: 'அரசியலமைப்பு உறுப்பு 21, 22-ன் படியான கைது நடவடிக்கைகளுக்கு எதிரான பாதுகாப்பு, பிணை பெறுவதற்கான நடைமுறைகள் மற்றும் இலவச சட்ட உதவி மையங்களை அணுகும் வழிமுறைகள் குறித்த கையேடு.'
    },
    keyHighlights: {
      en: [
        'Arnesh Kumar guidelines regarding mandatory notice before arrest in offenses under 7 years',
        'Steps to seek pro-bono assistance through District Legal Services Authorities (DLSA)',
        'Checklist of constitutional rights during search, seizure, and interrogation'
      ],
      ta: [
        '7 ஆண்டுகளுக்குக் குறைவான தண்டனைக்குரிய வழக்குகளில் அர்னேஷ் குமார் வழிகாட்டு நெறிமுறைகள்',
        'மாவட்ட சட்டப் பணிகள் ஆணைக்குழு மூலம் இலவச வழக்கறிஞர் உதவி பெறும் நடைமுறை',
        'கைது மற்றும் விசாரணையின் போது பொதுமக்களுக்கு அரசமைப்புச் சட்டம் வழங்கும் உரிமைகள்'
      ]
    },
    fileSize: '1.9 MB',
    downloadUrl: '#',
    date: '2024-05-02',
    isOfficial: true
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'state-legal-conference-2026',
    title: { 
      en: 'Tamil Nadu State Advocates & Legal Wing Grand Conference 2026', 
      ta: 'தமிழ்நாடு மாநில வழக்கறிஞர்கள் மற்றும் வழக்கறிஞர் அணி பெரு மாநாடு 2026' 
    },
    category: 'Conference',
    date: '2026-12-14',
    time: '09:30 AM - 05:30 PM',
    venue: { 
      en: 'Kalaignar Arangam, Anna Arivalayam, Anna Salai, Teynampet, Chennai', 
      ta: 'கலைஞர் அரங்கம், அண்ணா அறிவாலயம், அண்ணா சாலை, சென்னை' 
    },
    status: 'upcoming',
    description: {
      en: 'A historic state-level gathering of over 5,000 advocates from across Tamil Nadu and Puducherry to deliberate on constitutional federalism, judicial appointments, safeguarding 69% reservation, and welfare schemes for junior lawyers.',
      ta: 'மாநில சுயாட்சி, அரசமைப்பு ஜனநாயகத்தைப் பாதுகாத்தல், 69% இடஒதுக்கீடு பாதுகாப்பு மற்றும் இளம் வழக்கறிஞர்களுக்கான நலத்திட்டங்கள் குறித்து விவாதிக்க தமிழகம் முழுவதும் இருந்து 5,000-க்கும் மேற்பட்ட வழக்கறிஞர்கள் பங்கேற்கும் மாநில மாநாடு.'
    },
    chiefGuest: { 
      en: 'Hon’ble Chief Minister of Tamil Nadu M.K. Stalin', 
      ta: 'மாண்புமிகு தமிழ்நாடு முதலமைச்சர் மு.க. ஸ்டாலின்' 
    },
    attendeesCount: 5000,
    image: '/images/dmk-slider-official.jpg'
  },
  {
    id: 'federalism-seminar-madurai',
    title: { 
      en: 'National Seminar on Federal Architecture and State Autonomy in 21st Century India', 
      ta: '21-ஆம் நூற்றாண்டு இந்தியாவில் கூட்டாட்சி அமைப்பும் மாநில சுயாட்சியும் - தேசியக் கருத்தரங்கம்' 
    },
    category: 'Seminar',
    date: '2026-10-08',
    time: '10:00 AM - 04:00 PM',
    venue: { 
      en: 'Madurai Bar Association Hall, High Court Campus, Madurai', 
      ta: 'வழக்கறிஞர் சங்க அரங்கம், உயர் நீதிமன்ற வளாகம், மதுரை' 
    },
    status: 'completed',
    description: {
      en: 'Distinguished jurists, retired Supreme Court and High Court judges, and Senior Advocates gathered to present empirical studies on fiscal federalism, Governors’ discretionary powers, and concurrent list dynamics.',
      ta: 'ஓய்வுபெற்ற நீதிபதிகள், மூத்த வழக்கறிஞர்கள் மற்றும் சட்ட அறிஞர்கள் பங்கேற்று நிதி கூட்டாட்சி, ஆளுநர் அதிகார வரம்புகள் மற்றும் மாநிலங்களின் சட்ட உரிமைகள் குறித்து விரிவாக ஆய்வு செய்த கருத்தரங்கம்.'
    },
    chiefGuest: { 
      en: 'Senior Advocate P. Wilson MP', 
      ta: 'மூத்த வழக்கறிஞர் பி. வில்சன் எம்பி' 
    },
    attendeesCount: 850,
    image: '/images/dmk-flag-sun.jpg'
  },
  {
    id: 'legal-awareness-camp-salem',
    title: { 
      en: 'State-Wide Pro-Bono Legal Clinic & Social Justice Awareness Drive', 
      ta: 'மாநில அளவிலான இலவச சட்ட உதவி முகாம் & சமூக நீதி விழிப்புணர்வுப் பேரவை' 
    },
    category: 'Legal Awareness',
    date: '2026-08-22',
    time: '09:00 AM - 03:00 PM',
    venue: { 
      en: 'Combined Court Grounds, Hasthampatti, Salem', 
      ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாக அரங்கம், அஸ்தம்பட்டி, சேலம்' 
    },
    status: 'completed',
    description: {
      en: 'Provided free legal counsel to over 600 citizens on land patta issues, consumer grievances, domestic welfare schemes, and civil liberties, staffed by 75 volunteer advocates.',
      ta: '75 தொண்டற வழக்கறிஞர்கள் பங்கேற்று பொதுமக்களுக்கு பட்டா மாறுதல், நுகர்வோர் உரிமைகள் மற்றும் குடும்ப நலச் சட்டங்கள் குறித்து இலவச சட்ட ஆலோசனைகளை வழங்கிய மக்கள் நல முகாம்.'
    },
    attendeesCount: 650,
    image: '/images/dmk-slider-official.jpg'
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-governor-ruling',
    title: { 
      en: 'Supreme Court Upholds Tamil Nadu Stand: Governors Cannot Delay Assent to Assembly Bills Indefinitely', 
      ta: 'உச்ச நீதிமன்றம் வரலாற்றுத் தீர்ப்பு: சட்டமன்ற மசோதாக்களுக்கு ஒப்புதல் அளிக்காமல் ஆளுநர்கள் காலவரையின்றி முடக்க முடியாது' 
    },
    category: 'Court Watch',
    date: '2026-11-18',
    time: '10:45 AM IST',
    readTime: '4 min read',
    author: { en: 'DMK Legal Wing Secretariat', ta: 'திமுக வழக்கறிஞர் அணித் தலைமைச் செயலகம்' },
    issuingAuthority: { en: 'Apex Constitutional Panel, Anna Arivalayam', ta: 'அரசமைப்புச் சட்டப் பிரிவு, அண்ணா அறிவாலயம்' },
    summary: {
      en: 'A decisive constitutional victory for Tamil Nadu as the Supreme Court laid down that state legislative sovereignty under Article 200 cannot be usurped by nominated governors.',
      ta: 'தமிழ்நாட்டின் அரசமைப்பு உரிமைப் போராட்டத்திற்கு கிடைத்த மாபெரும் வெற்றி; ஆளுநர்கள் சட்டமன்ற மசோதாக்களைக் கிடப்பில் போட முடியாது என உச்ச நீதிமன்றம் தெளிவுபடுத்தியுள்ளது.'
    },
    content: {
      en: 'The Supreme Court of India in its landmark judgment reaffirmed that the constitutional scheme relies fundamentally on elected democratic representatives. Senior Advocate P. Wilson representing the DMK Legal Wing argued that withholding bills passed by the Legislative Assembly is a direct blow to the basic structure of the Constitution and democratic federalism.\n\nThe Court explicitly reiterated that under Article 200, when a Bill is passed a second time by the State Legislative Assembly, the Governor has no constitutional option or pocket-veto power, but must grant assent. The Legal Wing hailed this judgment as a monumental safeguard for all federal states across the Indian Union.',
      ta: 'மக்களால் தேர்ந்தெடுக்கப்பட்ட சட்டப்பேரவை நிறைவேற்றும் மசோதாக்களை ஆளுநர்கள் காலம் தாழ்த்தாமல் நிறைவேற்ற வேண்டும் என்று உச்ச நீதிமன்றம் திட்டவட்டமாகத் தீர்ப்பளித்துள்ளது. திமுக வழக்கறிஞர் அணி சார்பில் மூத்த வழக்கறிஞர் பி. வில்சன் எம்பி முன்வைத்த வாதங்களை ஏற்று, அரசமைப்பின் அடிப்படைக் கட்டமைப்பான நாடாளுமன்ற ஜனநாயகத்தை நீதிமன்றம் உறுதி செய்துள்ளது.\n\nசட்டப்பேரவையில் இரண்டாவது முறை நிறைவேற்றப்படும் மசோதாக்களுக்கு ஆளுநர்கள் கட்டாயம் ஒப்புதல் அளிக்க வேண்டும் என்றும், காலவரையின்றி முடக்கி வைக்கும் அதிகாரம் ஆளுநர்களுக்கு இல்லை என்றும் அரசமைப்பு உறுப்பு 200-ன் கீழ் உச்சநீதிமன்றம் தெளிவுபடுத்தியுள்ளது.'
    },
    image: '/images/dmk-slider-official.jpg',
    photoCredit: 'DMK Legal Wing Press Bureau / Anna Arivalayam',
    caption: {
      en: 'DMK Legal Wing senior leadership address the press following the Supreme Court constitutional victory.',
      ta: 'உச்ச நீதிமன்ற வரலாற்று சிறப்புமிக்க தீர்ப்பைத் தொடர்ந்து வழக்கறிஞர் அணி மூத்த நிர்வாகிகள் செய்தியாளர் சந்திப்பு.'
    },
    court: 'Supreme Court of India',
    caseNumber: 'Writ Petition (Civil) No. 1102 of 2024',
    documentUrl: '#',
    status: 'published',
    featured: true
  },
  {
    id: 'news-neet-petition-update',
    title: { 
      en: 'Legal Wing Submits Comprehensive Written Arguments Against NEET in Supreme Court', 
      ta: 'நீட் தேர்வுக்கு எதிரான வழக்கில் உச்ச நீதிமன்றத்தில் திமுக வழக்கறிஞர் அணி விரிவான எழுத்துப்பூர்வ வாதங்கள் தாக்கல்' 
    },
    category: 'Press Release',
    date: '2026-11-12',
    time: '02:30 PM IST',
    readTime: '3 min read',
    author: { en: 'Senior Advocate P. Wilson Office', ta: 'மூத்த வழக்கறிஞர் பி. வில்சன் அலுவலகம்' },
    issuingAuthority: { en: 'Supreme Court Litigation Wing', ta: 'உச்ச நீதிமன்ற வழக்கறிஞர் பிரிவு' },
    summary: {
      en: 'Submissions highlighted empirical data from Justice A.K. Rajan Committee showing grave disparity and denial of medical education to rural and Tamil-medium students.',
      ta: 'நீதிபதி ஏ.கே. ராஜன் குழுவின் விரிவான புள்ளிவிவரங்களின் அடிப்படையில், நீட் தேர்வு கிராமப்புற மற்றும் தமிழ் வழி மாணவர்களின் மருத்துவக் கனவைச் சிதைப்பதை விளக்கும் வாதங்கள் சமர்ப்பிக்கப்பட்டன.'
    },
    content: {
      en: 'DMK Legal Wing filed extensive written submissions demonstrating that the single national exam discriminates against underprivileged rural students who cannot afford commercial coaching centers. The plea asserts that public health and university education are intrinsic federal concerns under the Constitution.\n\nThe submissions placed on record the comprehensive findings of the high-level Justice A.K. Rajan Committee, urging the Court to restore state legislative competence to determine admission procedures tailored to socio-economic realities.',
      ta: 'கோடிக்கணக்கில் செலவழித்து தனியார் பயிற்சி மையங்களுக்குச் செல்ல முடியாத ஏழை, எளிய மற்றும் அரசுப் பள்ளி மாணவர்களுக்கு நீட் தேர்வு இழைக்கும் அநீதிகளை விளக்கி உச்ச நீதிமன்றத்தில் ஆவணங்கள் சமர்ப்பிக்கப்பட்டுள்ளன.\n\nமருத்துவக் கல்வி சேர்க்கை மாநில அரசின் ஆளுகைக்குட்பட்டது என்பதை நிலைநாட்டவும், கிராமப்புற மாணவர்களின் சமூக நீதியைப் பாதுகாக்கவும் விரிவான சட்டக் காரணங்கள் நீதிமன்றத்தில் முன்வைக்கப்பட்டுள்ளன.'
    },
    image: '/images/dmk-flag-sun.jpg',
    photoCredit: 'Madras High Court Bureau',
    caption: {
      en: 'Official symbol of social justice and constitutional advocacy of the DMK Legal Wing.',
      ta: 'சமூக நீதி மற்றும் அரசமைப்பு உரிமைப் போராட்டங்களின் அதிகாரப்பூர்வ சின்னம்.'
    },
    court: 'Supreme Court of India',
    caseNumber: 'Original Suit No. 1 of 2023',
    documentUrl: '#',
    status: 'published',
    featured: false
  },
  {
    id: 'news-tamil-language-highcourt',
    title: { 
      en: 'Legal Wing Escalates Campaign for Tamil as Official Language in Madras High Court', 
      ta: 'சென்னை உயர் நீதிமன்றத்தில் வழக்காடு மொழியாகத் தமிழ்: வழக்கறிஞர் அணி சட்டப் போராட்டத்தை தீவிரப்படுத்துகிறது' 
    },
    category: 'Official Statements',
    date: '2026-11-04',
    time: '11:15 AM IST',
    readTime: '4 min read',
    author: { en: 'R. Viduthalai, President, Legal Wing', ta: 'ஆர். விடுதலை, தலைவர், வழக்கறிஞர் அணி' },
    issuingAuthority: { en: 'State Executive Council, DMK Legal Wing', ta: 'மாநில செயற்குழு, திமுக வழக்கறிஞர் அணி' },
    summary: {
      en: 'President R. Viduthalai affirmed that justice cannot remain alienated from the common citizens and urged the Union Government to grant consent under Article 348(2).',
      ta: 'மக்களுக்குத் தாய்மொழியில் நீதி கிடைப்பதே உண்மையான ஜனநாயக மாண்பு; அரசமைப்பு உறுப்பு 348(2)-ன் கீழ் ஒன்றிய அரசு ஒப்புதல் அளிக்க வேண்டும் என தலைவர் ஆர். விடுதலை வலியுறுத்தல்.'
    },
    content: {
      en: 'At a special consultation meet held at Chennai, Legal Wing President R. Viduthalai and Secretary N.R. Elango MP announced a coordinated legal and parliamentary initiative to enable Tamil as an official court language in the Madras High Court and its Madurai Bench.\n\nNoting that the Tamil Nadu Legislative Assembly had unanimously passed statutory resolutions to this effect, the leaders stressed that regional language courts have already been recognized in Rajasthan, UP, MP, and Bihar in Hindi, and denying the same status to classical Tamil is a violation of federal equality.',
      ta: 'சென்னை உயர் நீதிமன்றத்தில் வழக்காடு மொழியாக தமிழை அறிவிக்கக் கோரி தமிழ்நாடு சட்டமன்றம் ஒருமனதாக நிறைவேற்றிய தீர்மானத்திற்கு ஒன்றிய அரசு உடனே ஒப்புதல் அளிக்க வேண்டும்.\n\nஇந்தி பேசும் மாநிலங்களில் தாய்மொழி உயர் நீதிமன்றங்களில் அனுமதிக்கப்பட்டுள்ள நிலையில், செம்மொழியான தமிழுக்கு அனுமதி மறுப்பது கூட்டாட்சித் தத்துவத்திற்கு எதிரானது என்று கூட்டத்தில் தீர்மானம் நிறைவேற்றப்பட்டது.'
    },
    image: '/images/dmk-press-meet.jpg',
    photoCredit: 'DMK Press Bureau',
    caption: {
      en: 'Legal Wing President R. Viduthalai and Secretary N.R. Elango addressing the consultative council in Chennai.',
      ta: 'சென்னையில் நடைபெற்ற வழக்கறிஞர் அணி ஆலோசனைக் கூட்டத்தில் தலைவர் ஆர். விடுதலை மற்றும் செயலாளர் என்.ஆர். இளங்கோ உரை.'
    },
    court: 'Madras High Court & Supreme Court',
    documentUrl: '#',
    status: 'published',
    featured: false
  },
  {
    id: 'news-junior-advocates-stipend',
    title: { 
      en: 'State Government Junior Advocates Monthly Stipend Scheme Commended Across 120 Bar Associations', 
      ta: 'இளம் வழக்கறிஞர்களுக்கான மாதாந்திர உதவித்தொகை திட்டம்: 120-க்கும் மேற்பட்ட பார் அசோசியேஷன்கள் நெகிழ்ச்சி பாராட்டு' 
    },
    category: 'Statement',
    date: '2026-10-22',
    time: '04:00 PM IST',
    readTime: '3 min read',
    author: { en: 'All Tamil Nadu Advocates Association Federation', ta: 'தமிழ்நாடு வழக்கறிஞர்கள் சங்க கூட்டமைப்பு' },
    issuingAuthority: { en: 'Cadre Welfare Wing', ta: 'வழக்கறிஞர் நலப் பிரிவு' },
    summary: {
      en: 'The Dravidian model government’s monthly stipend scheme for junior advocates completing enrollment provides crucial financial security during initial years of legal practice.',
      ta: 'சட்டப் படிப்பை முடித்துப் புதிதாகப் பதிவு செய்யும் இளம் வழக்கறிஞர்களுக்குத் தமிழ்நாடு அரசு வழங்கி வரும் மாதாந்திர உதவித்தொகை திட்டம் அவர்களின் தன்னம்பிக்கையை உயர்த்தியுள்ளது.'
    },
    content: {
      en: 'The historic stipend scheme initiated under Chief Minister M.K. Stalin to support first-generation and economically underprivileged advocates during their first three years of practice has won praise from over 120 bar associations across Tamil Nadu.\n\nThe scheme disburses direct monthly assistance to enrolled advocates, enabling talented youth from rural, SC, ST, and OBC families to sustain trial practice without succumbing to immediate financial pressures.',
      ta: 'வழக்கறிஞர் தொழிலில் தொடக்கக் காலத்தில் இளம் மற்றும் முதல் தலைமுறை பட்டதாரி வழக்கறிஞர்கள் எதிர்கொள்ளும் நிதிச் சுமைகளைக் குறைக்கும் வகையில் முதல்வர் மு.க. ஸ்டாலின் செயல்படுத்தி வரும் திட்டத்திற்கு வழக்கறிஞர்கள் பெரும் வரவேற்பு தெரிவித்துள்ளனர்.\n\nஎளிய குடும்பங்களைச் சேர்ந்த இளைஞர்கள் சட்டத் தொழிலில் நிலைத்து நின்று சமூக நீதிக்காகப் போராட இத்திட்டம் பெருந்துணையாக உள்ளது.'
    },
    image: '/images/dmk-legal-conference.jpg',
    photoCredit: 'Advocates Association Archives',
    caption: {
      en: 'Junior advocates attending the professional empowerment conclave in Chennai.',
      ta: 'சென்னையில் நடைபெற்ற இளம் வழக்கறிஞர்கள் திறன் மேம்பாட்டு மாநாடு.'
    },
    court: 'Madras High Court & District Bars',
    documentUrl: '#',
    status: 'published',
    featured: false
  },
  {
    id: 'news-delimitation-resolution',
    title: { 
      en: 'State Executive Council Passes Unanimous Resolution Opposing Delimitation Threat to Southern Representation', 
      ta: 'தென்மாநிலங்களின் நாடாளுமன்ற பிரதிநிதித்துவத்தை குறைக்கும் தொகுதி மறுசீரமைப்புக்கு எதிராக வழக்கறிஞர் அணி ஒருமனதாக தீர்மானம்' 
    },
    category: 'Resolution',
    date: '2026-10-15',
    time: '01:20 PM IST',
    readTime: '5 min read',
    author: { en: 'N.R. Elango MP, State Secretary', ta: 'என்.ஆர். இளங்கோ எம்பி, மாநிலச் செயலாளர்' },
    issuingAuthority: { en: 'DMK Legal Wing State Executive', ta: 'திமுக வழக்கறிஞர் அணி மாநில செயற்குழு' },
    summary: {
      en: 'The resolution resolves that population-control performance cannot be weaponized to slash Tamil Nadu’s Lok Sabha share, vowing a constitutional challenge if equal representation is undermined.',
      ta: 'மக்கள்தொகைக் கட்டுப்பாட்டைச் சிறப்பாகச் செயல்படுத்தியதற்காக தமிழ்நாட்டின் நாடாளுமன்ற இடங்களைக் குறைப்பது கூட்டாட்சி விரோதம்; தேவைப்பட்டால் உச்சநீதிமன்றத்தில் வழக்கு தொடரப்படும் என எச்சரிக்கை.'
    },
    content: {
      en: 'The State Executive Council of the DMK Legal Wing, in an extraordinary meeting chaired by President R. Viduthalai and Secretary N.R. Elango MP, passed a unanimous resolution warning against any move to carry out delimitation on the raw basis of Census figures.\n\nThe council pointed out that penalizing progressive states for successfully implementing national population policies strikes at the core of federal democracy. The Legal Wing established a special research panel to draft comprehensive constitutional safeguards ensuring state representation remains inviolate.',
      ta: 'திமுக வழக்கறிஞர் அணி மாநில செயற்குழுவின் சிறப்பு கூட்டம் தலைவர் ஆர். விடுதலை மற்றும் செயலாளர் என்.ஆர். இளங்கோ தலைமையில் நடைபெற்றது. மக்கள்தொகை அடிப்படையில் நாடாளுமன்றத் தொகுதிகளை மறுசீரமைத்தால் தென்மாநிலங்களின் அரசியல் அதிகாரம் பறிபோகும் என்று கூட்டத்தில் சுட்டிக்காட்டப்பட்டது.\n\nமாநிலங்களின் சமத்துவ உரிமையைப் பாதுகாக்க சிறப்பு சட்டக் குழு அமைக்கப்பட்டு விரிவான சட்ட ஆய்வு மேற்கொள்ளப்பட்டு வருகிறது.'
    },
    image: '/images/dmk-campaign-stalin.jpg',
    photoCredit: 'DMK Information Wing',
    caption: {
      en: 'State Executive meeting in session at Anna Arivalayam.',
      ta: 'அண்ணா அறிவாலயத்தில் நடைபெற்ற வழக்கறிஞர் அணி மாநில செயற்குழுக் கூட்டம்.'
    },
    court: 'Supreme Court of India',
    documentUrl: '#',
    status: 'published',
    featured: false
  },
  {
    id: 'news-advocates-welfare-gazette',
    title: { 
      en: 'Gazette Extraordinary: Tamil Nadu Advocates Welfare Fund Enhanced to Rs. 10 Lakhs', 
      ta: 'சிறப்பு அரசிதழ் வெளியீடு: தமிழ்நாடு வழக்கறிஞர்கள் சேமநல நிதி ரூ. 10 லட்சமாக உயர்த்தி அரசிதழில் அதிகாரப்பூர்வ அறிவிப்பு' 
    },
    category: 'Gazette',
    date: '2026-09-29',
    time: '06:00 PM IST',
    readTime: '2 min read',
    author: { en: 'Law Department, Government of Tamil Nadu', ta: 'சட்டத்துறை, தமிழ்நாடு அரசு' },
    issuingAuthority: { en: 'Official Gazette Section', ta: 'அரசிதழ் வெளியீட்டுப் பிரிவு' },
    summary: {
      en: 'Statutory notification amending the Tamil Nadu Advocates Welfare Fund Act, substantially boosting financial security for deceased advocates’ kin.',
      ta: 'மறைந்த வழக்கறிஞர்களின் குடும்பத்தினருக்கு வழங்கப்படும் நிவாரண நிதி ரூ. 10 லட்சமாக உயர்த்தி சட்டத் திருத்த அரசிதழ் வெளியிடப்பட்டுள்ளது.'
    },
    content: {
      en: 'The Government of Tamil Nadu officially notified the amendment to the Tamil Nadu Advocates Welfare Fund Act, fulfilling a key commitment championed by the DMK Legal Wing. The death benefit provided to the bereaved families of practicing advocates has been raised from Rs. 7 lakhs to Rs. 10 lakhs.\n\nThe gazette notification marks a decisive step in fortifying social security for over 70,000 enrolled advocates practicing across High Court and District Court bars in the state.',
      ta: 'திமுக வழக்கறிஞர் அணியின் தொடர் கோரிக்கையை ஏற்று, வழக்கறிஞர்கள் சேமநல நிதி சட்டத் திருத்தத்தை தமிழ்நாடு அரசு அதிகாரப்பூர்வமாக அரசிதழில் வெளியிட்டுள்ளது.\n\nஇதன்மூலம் வழக்கறிஞர் ஒருவர் காலமானால் அவரது குடும்பத்திற்கு வழங்கப்படும் நிதி உதவி ரூ. 10 லட்சமாக உயர்த்தப்பட்டு நடைமுறைக்கு வந்துள்ளது.'
    },
    image: '/images/dmk-slider-official.jpg',
    photoCredit: 'Tamil Nadu Government Gazette',
    caption: {
      en: 'Official notification published in the Tamil Nadu Government Gazette.',
      ta: 'தமிழ்நாடு அரசு சிறப்பு அரசிதழில் வெளியான அதிகாரப்பூர்வ அறிவிப்பு.'
    },
    documentUrl: '#',
    status: 'published',
    featured: false
  }
];

export const LEGAL_DEVELOPMENTS_DATA: LegalDevelopmentItem[] = [
  {
    id: 'ld-001',
    caseTitle: {
      en: 'State of Tamil Nadu v. The Governor of Tamil Nadu & Anr.',
      ta: 'தமிழ்நாடு அரசு எதிர் தமிழக ஆளுநர் மற்றும் பிறர்'
    },
    caseNumber: 'Writ Petition (Civil) No. 1102 of 2024',
    court: 'Supreme Court of India',
    bench: 'Bench of Chief Justice of India & Justice J.B. Pardiwala',
    date: '2026-11-10',
    category: 'Federalism',
    counsel: {
      en: 'Senior Advocate P. Wilson & Legal Wing Apex Panel',
      ta: 'மூத்த வழக்கறிஞர் பி. வில்சன் & தலைமை சட்டக் குழு'
    },
    summary: {
      en: 'The Supreme Court ruled that Article 200 does not grant unbridled discretion to Governors to sit indefinitely on bills passed by elected state legislatures. Once re-passed, assent is mandatory.',
      ta: 'சட்டப்பேரவை நிறைவேற்றிய மசோதாக்களை ஆளுநர்கள் காலவரையின்றி முடக்க முடியாது; இரண்டாவது முறை நிறைவேற்றினால் கட்டாயம் ஒப்புதல் அளிக்க வேண்டும் என உச்ச நீதிமன்றம் தீர்ப்பளித்தது.'
    },
    significance: {
      en: 'Landmark constitutional precedent reaffirming parliamentary democracy and curbing gubernatorial overreach.',
      ta: 'மாநில சட்டமன்றங்களின் மக்களாட்சி இறையாண்மையை நிலைநாட்டிய உச்ச நீதிமன்ற வரலாற்றுத் தீர்ப்பு.'
    },
    orderLink: '#',
    statusTag: { en: 'Landmark Victory', ta: 'வரலாற்று வெற்றி' }
  },
  {
    id: 'ld-002',
    caseTitle: {
      en: 'DMK Legal Wing v. Union of India (NEET Invalidation Suit)',
      ta: 'திமுக வழக்கறிஞர் அணி எதிர் இந்திய ஒன்றியம் (நீட் எதிர்ப்பு வழக்கு)'
    },
    caseNumber: 'Original Suit No. 1 of 2023 / W.P. No. 432 of 2023',
    court: 'Constitutional Bench',
    bench: 'Constitution Bench (5 Judges)',
    date: '2026-10-28',
    category: 'Social Justice',
    counsel: {
      en: 'Senior Advocates N.R. Elango MP & Legal Secretariat',
      ta: 'மூத்த வழக்கறிஞர் என்.ஆர். இளங்கோ எம்பி & சட்டச் செயலகம்'
    },
    summary: {
      en: 'Submissions filed emphasizing Entry 6, List II (Public Health) and Entry 25, List III, asserting state prerogative to frame entrance rules to guarantee equal educational access to rural and Tamil-medium students.',
      ta: 'மருத்துவக் கல்வி சேர்க்கையில் மாநில உரிமை மற்றும் கிராமப்புற மாணவர்களின் சமவாய்ப்பைப் பாதுகாக்க விரிவான வாதங்கள் சமர்ப்பிக்கப்பட்டன.'
    },
    significance: {
      en: 'Core constitutional challenge to centralized commercialized exam regimes undermining state affirmative action.',
      ta: 'மத்திய அரசின் ஒற்றைத் தேர்வு முறைக்கு எதிரான கூட்டாட்சி மற்றும் சமூக நீதிப் போராட்டம்.'
    },
    orderLink: '#',
    statusTag: { en: 'Under Active Hearing', ta: 'விசாரணையில் உள்ளது' }
  },
  {
    id: 'ld-003',
    caseTitle: {
      en: 'Madras High Court Tamil Language Implementation Petition',
      ta: 'சென்னை உயர் நீதிமன்றத்தில் தமிழ் வழக்காடு மொழி கோரிக்கை வழக்கு'
    },
    caseNumber: 'Writ Petition No. 24810 of 2023',
    court: 'Madras High Court',
    bench: 'First Bench (Chief Justice & Senior Judge)',
    date: '2026-09-15',
    category: 'Constitutional',
    counsel: {
      en: 'Senior Advocate R. Viduthalai (President, Legal Wing)',
      ta: 'மூத்த வழக்கறிஞர் ஆர். விடுதலை (தலைவர், வழக்கறிஞர் அணி)'
    },
    summary: {
      en: 'Petition filed under Article 348(2) seeking presidential assent to declare Tamil as the official language of proceedings in the Madras High Court and Madurai Bench.',
      ta: 'அரசமைப்பு உறுப்பு 348(2)-ன் கீழ் சென்னை உயர் நீதிமன்றத்தில் வழக்காடு மொழியாக தமிழை அறிவிக்கக் கோரும் மனு.'
    },
    significance: {
      en: 'Democratizing access to justice so litigants understand courtroom proceedings in their native language.',
      ta: 'வழக்காடிகளுக்குத் தங்கள் தாய்மொழியில் நீதி கிடைக்கும் அடிப்படை ஜனநாயக உரிமை.'
    },
    orderLink: '#',
    statusTag: { en: 'Notice Issued', ta: 'நோட்டீஸ் அனுப்பப்பட்டது' }
  },
  {
    id: 'ld-004',
    caseTitle: {
      en: 'Defense of Tamil Nadu 69% Reservation (Act 45 of 1994)',
      ta: 'தமிழ்நாட்டின் 69% இடஒதுக்கீடு பாதுகாப்பு (சட்டம் 45/1994)'
    },
    caseNumber: 'Civil Appeal No. 4120 of 2020 & Connected Petitions',
    court: 'Supreme Court of India',
    bench: 'Constitution Bench',
    date: '2026-08-20',
    category: 'Social Justice',
    counsel: {
      en: 'Senior Advocates R. Viduthalai & P. Wilson',
      ta: 'மூத்த வழக்கறிஞர்கள் ஆர். விடுதலை & பி. வில்சன்'
    },
    summary: {
      en: 'Defending the constitutional validity of Tamil Nadu Act 45/1994 shielded under the Ninth Schedule against challenges seeking to impose artificial 50% ceilings.',
      ta: 'அரசமைப்பின் 9-வது அட்டவணையில் உள்ள தமிழ்நாட்டின் 69% இடஒதுக்கீட்டை எந்தவித நீர்த்துப்போதலும் இன்றி உச்ச நீதிமன்றத்தில் பாதுகாத்தல்.'
    },
    significance: {
      en: 'Safeguards affirmative action guarantees for Backward Classes, MBCs, SCs, and STs across the state.',
      ta: 'தமிழ்நாட்டின் பெரும்பான்மை ஒடுக்கப்பட்ட மக்களின் சமூக நீதியை நிலைநாட்டும் கவசம்.'
    },
    orderLink: '#',
    statusTag: { en: 'Shielded by 9th Schedule', ta: '9-வது அட்டவணை பாதுகாப்பு' }
  }
];

export const PRESS_GALLERY_DATA: PressGalleryItem[] = [
  {
    id: 'gal-001',
    title: {
      en: 'DMK Legal Wing State Conference at Kalaignar Arangam',
      ta: 'கலைஞர் அரங்கில் நடைபெற்ற திமுக வழக்கறிஞர் அணி மாநில மாநாடு'
    },
    category: 'Legal Wing Events',
    date: '2026-11-05',
    location: { en: 'Kalaignar Arangam, Chennai', ta: 'கலைஞர் அரங்கம், சென்னை' },
    image: '/images/dmk-slider-official.jpg',
    caption: {
      en: 'Over 3,000 advocates from all 38 districts gathered for the state plenary on constitutional federalism and judicial reforms.',
      ta: 'அரசமைப்பு கூட்டாட்சி மற்றும் நீதிமன்றச் சீர்திருத்தங்கள் குறித்து 38 மாவட்டங்களிலிருந்து 3,000-க்கும் மேற்பட்ட வழக்கறிஞர்கள் பங்கேற்பு.'
    },
    photographer: 'State Press Bureau'
  },
  {
    id: 'gal-002',
    title: {
      en: 'Press Meet on Supreme Court Governor Ruling',
      ta: 'ஆளுநர் வழக்கில் உச்சநீதிமன்றத் தீர்ப்பு குறித்த செய்தியாளர் சந்திப்பு'
    },
    category: 'Press Conferences',
    date: '2026-11-10',
    location: { en: 'Anna Arivalayam, Chennai', ta: 'அண்ணா அறிவாலயம், சென்னை' },
    image: '/images/dmk-press-meet.jpg',
    caption: {
      en: 'Legal Wing leadership briefing international and national media on the landmark Article 200 judgment.',
      ta: 'அரசமைப்பு உறுப்பு 200 தொடர்பான வரலாற்று தீர்ப்பு குறித்து தேசிய மற்றும் சர்வதேச ஊடகங்களுக்கு விளக்கம்.'
    },
    photographer: 'Press Secretariat'
  },
  {
    id: 'gal-003',
    title: {
      en: 'State Advocates Leadership Assembly at High Court',
      ta: 'சென்னை உயர் நீதிமன்றத்தில் மாநில வழக்கறிஞர் தலைமைப் பொறுப்பாளர்கள் கூட்டம்'
    },
    category: 'Advocates Meetings',
    date: '2026-10-18',
    location: { en: 'Advocates Association Hall, High Court Campus', ta: 'சென்னை உயர் நீதிமன்ற வழக்கறிஞர் சங்கம்' },
    image: '/images/dmk-legal-conference.jpg',
    caption: {
      en: 'High Court and Madurai Bench coordinating counsels deliberating on the junior advocate welfare charter.',
      ta: 'இளம் வழக்கறிஞர்கள் நலத் திட்டங்கள் மற்றும் நீதிமன்றப் பணிகள் குறித்த ஒருங்கிணைப்புக் கூட்டம்.'
    },
    photographer: 'Bar Council Media Wing'
  },
  {
    id: 'gal-004',
    title: {
      en: 'Dravidian Legal Movement Historical Roll of Honor',
      ta: 'திராவிட இயக்க சட்டப் போராளிகள் வரலாற்று ஆவணம்'
    },
    category: 'Historical Archive',
    date: '2026-09-17',
    location: { en: 'Headquarters Archives, Chennai', ta: 'கழகத் தலைமை ஆவணக் காப்பகம்' },
    image: '/images/dmk-four-leaders.jpg',
    caption: {
      en: 'The ideological stalwarts: Thanthai Periyar, Arignar Anna, Muthamizharignar Kalaignar, and Chief Minister M.K. Stalin.',
      ta: 'திராவிட இயக்கத்தின் தலைவர்கள்: தந்தை பெரியார், பேரறிஞர் அண்ணா, முத்தமிழறிஞர் கலைஞர், மற்றும் முதல்வர் மு.க. ஸ்டாலின்.'
    },
    photographer: 'DMK Central Archive'
  },
  {
    id: 'gal-005',
    title: {
      en: 'Mass Rally for Constitutional Democracy & Rights Defense',
      ta: 'ஜனநாயக உரிமைப் பாதுகாப்புப் பேரணி'
    },
    category: 'Official Programmes',
    date: '2026-08-14',
    location: { en: 'Madurai & Southern Districts', ta: 'மதுரை மற்றும் தென் மாவட்டங்கள்' },
    image: '/images/dmk-campaign-stalin.jpg',
    caption: {
      en: 'Advocates joining democratic rights mobilizations defending state autonomy across Tamil Nadu.',
      ta: 'மாநில சுயாட்சி மற்றும் சமூக நீதியைப் பாதுகாக்கும் மாபெரும் ஜனநாயகப் பேரணி.'
    },
    photographer: 'Field Media Unit'
  }
];
