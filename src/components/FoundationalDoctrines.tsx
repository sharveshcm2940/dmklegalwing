'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Play, 
  Pause, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  ShieldCheck, 
  Scale, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';

interface DoctrineItem {
  id: string;
  num: string;
  statute: { en: string; ta: string };
  milestone: { en: string; ta: string };
  title: { en: string; ta: string };
  tamilSubtitle: string;
  shortLabel: { en: string; ta: string };
  desc: { en: string; ta: string };
  landmarkCase: { en: string; ta: string };
  keyProvisions: { en: string[]; ta: string[] };
  quote: {
    text: { en: string; ta: string };
    author: { en: string; ta: string };
  };
}

const DOCTRINES: DoctrineItem[] = [
  {
    id: 'social-justice',
    num: '01',
    statute: { en: 'Article 15(4) & 16(4)', ta: 'அரசமைப்பு உறுப்பு 15(4) & 16(4)' },
    milestone: { en: '69% Reservation • Ninth Schedule Shield', ta: '69% இடஒதுக்கீடு • 9-வது அட்டவணைப் பாதுகாப்பு' },
    title: { en: 'Social Justice & Affirmative Action', ta: 'சமூக நீதியும் இடஒதுக்கீடும்' },
    tamilSubtitle: 'சமூகநீதி • விகிதாசாரப் பிரதிநிதித்துவம்',
    shortLabel: { en: 'Social Justice & Affirmative Action', ta: 'சமூக நீதி & இடஒதுக்கீடு' },
    desc: {
      en: 'The bedrock of the Dravidian movement. Protecting Tamil Nadu’s historic 69% reservation before the Supreme Court of India, defending the Ninth Schedule constitutional shield, and relentlessly resisting economic and administrative dilution of backward class representation.',
      ta: 'திராவிட இயக்கத்தின் அடித்தளக் கோட்பாடு சமூக நீதியாகும். தமிழ்நாட்டின் வரலாற்றுச் சிறப்புமிக்க 69% இடஒதுக்கீட்டை உச்ச நீதிமன்றத்தில் பாதுகாப்பதிலும், 9-வது அட்டவணை அரசமைப்பு அரணை நிலைநிறுத்துவதிலும் சமரசமற்ற சட்டப் போராட்டம்.'
    },
    landmarkCase: {
      en: 'S.V. Joshi v. State of TN (1994) & Ninth Schedule Insertion (76th Amendment)',
      ta: 'எஸ்.வி. ஜோஷி எதிர் தமிழ்நாடு அரசு (1994) & 76-வது அரசமைப்புத் திருத்தம்'
    },
    keyProvisions: {
      en: [
        'Defense of 69% affirmative action quotas in education & public service',
        'Inclusion of TN Act 45/1994 into Ninth Schedule of the Constitution',
        'OBC creamy-layer exclusion in constitutional appointments defense'
      ],
      ta: [
        'கல்வி மற்றும் அரசுப் பணிகளில் 69% இடஒதுக்கீடு சட்டப் பாதுகாப்பு',
        'தமிழ்நாடு சட்டம் 45/1994-ஐ அரசமைப்பின் 9-வது அட்டவணையில் சேர்த்தல்',
        'பிற்படுத்தப்பட்டோர் உரிமைகளை நீர்த்துப்போகச் செய்யும் முயற்சிகளுக்கு எதிர்ப்பு'
      ]
    },
    quote: {
      text: {
        en: 'Rights are not gifts handed down by rulers; they are inherent human entitlements won through continuous democratic and constitutional struggle.',
        ta: 'உரிமைகள் எவராலும் தூக்கித் தரப்படும் சலுகைகள் அல்ல; அவை இடைவிடாத சட்ட, ஜனநாயகப் போராட்டங்களால் பெறப்படும் அடிப்படை மாண்புகள்.'
      },
      author: {
        en: 'Thanthai Periyar (First Provincial Self-Respect Conference, 1929)',
        ta: 'தந்தை பெரியார் (முதல் சுயமரியாதை மாகாண மாநாடு, 1929)'
      }
    }
  },
  {
    id: 'self-respect',
    num: '02',
    statute: { en: 'Hindu Marriage Act • Section 7A', ta: 'இந்து திருமணச் சட்டம் • பிரிவு 7A' },
    milestone: { en: '1967 Statutory Reform • Priestless Marriages', ta: '1967 சட்ட சீர்திருத்தம் • சுயமரியாதைத் திருமணம்' },
    title: { en: 'Self-Respect & Human Dignity', ta: 'சுயமரியாதையும் மனித மாண்பும்' },
    tamilSubtitle: 'சுயமரியாதை • சாதியற்ற சமத்துவ வாழ்வு',
    shortLabel: { en: 'Self-Respect & Human Dignity', ta: 'சுயமரியாதை & மனித மாண்பு' },
    desc: {
      en: 'Self-respect precedes political independence. Legalised priestless Self-Respect marriages under Arignar Anna in 1967 through Section 7A, ending ritual orthodoxy, and pioneering equal coparcenary property rights for women in 1989 under Kalaignar Karunanidhi.',
      ta: 'சுயமரியாதை என்பது அரசியல் விடுதலையை விடவும் முதன்மையானது. 1967-ல் பேரறிஞர் அண்ணா ஆட்சியில் சுயமரியாதைத் திருமணங்களைச் சட்டபூர்வமாக்கி, 1989-ல் கலைஞர் ஆட்சியில் பெண்களுக்கு சொத்தில் சமஉரிமை பெற்றுத்தந்த சட்ட புரட்சி.'
    },
    landmarkCase: {
      en: 'S. Nagalingam v. Sivagami (2001) 7 SCC 487 • Upheld Section 7A validity',
      ta: 'எஸ். நாகலிங்கம் எதிர் சிவகாமி (2001) 7 SCC 487 • பிரிவு 7A செல்லும் என தீர்ப்பு'
    },
    keyProvisions: {
      en: [
        'Section 7A Hindu Marriage (Tamil Nadu Amendment) Act, 1967',
        'Equal coparcenary property rights for daughters (Tamil Nadu Act 1 of 1989)',
        'Eradication of caste discrimination in appointment of Archakas in temples'
      ],
      ta: [
        'இந்து திருமணச் சட்டத் திருத்தம் பிரிவு 7A (புரோகிதர் இல்லா திருமணச் சட்டம்)',
        'பெண்களுக்கு பரம்பரைச் சொத்தில் சமபங்கு உரிமைச் சட்டம் (1989)',
        'அனைத்து சாதியினரும் அர்ச்சகராகும் அரசமைப்புச் சட்டப்பூர்வ உரிமை'
      ]
    },
    quote: {
      text: {
        en: 'Self-respect must be the foundation of individual freedom. Without human dignity and casteless equality, sovereignty is hollow.',
        ta: 'சுயமரியாதையே தனிமனித விடுதலையின் அச்சாணி. சாதியற்ற சமத்துவமும் மனித மாண்பும் இல்லாத எந்தச் சுதந்திரமும் முழுமையற்றது.'
      },
      author: {
        en: 'Perarignar Anna (Legislative Assembly Declaration, 1967)',
        ta: 'பேரறிஞர் அண்ணா (சட்டமன்றப் பிரகடனம், 1967)'
      }
    }
  },
  {
    id: 'federalism',
    num: '03',
    statute: { en: 'Articles 1, 200, 356 & Rajamannar Committee', ta: 'உறுப்புகள் 1, 200, 356 & ராஜமன்னார் குழு' },
    milestone: { en: 'State Autonomy • Anti-Centralisation', ta: 'மாநில சுயாட்சி • அதிகாரக் குவிப்பு எதிர்ப்பு' },
    title: { en: 'Federalism & State Autonomy', ta: 'கூட்டாட்சியும் மாநில சுயாட்சியும்' },
    tamilSubtitle: 'மத்தியில் கூட்டாட்சி • மாநிலத்தில் சுயாட்சி',
    shortLabel: { en: 'Federalism & State Autonomy', ta: 'மாநில சுயாட்சி & கூட்டாட்சி' },
    desc: {
      en: 'The Indian Constitution envisions an indissoluble Union of sovereign States. Fiercely defending federal balance against central encroachment, curbing the misuse of Article 356 against elected state governments, challenging gubernatorial pocket vetoes under Article 200, and demanding complete fiscal and educational devolution.',
      ta: 'இந்திய அரசமைப்பு மாநிலங்களின் இறையாண்மைமிக்க கூட்டமைப்பை முன்னிறுத்துகிறது. மாநில சுயாட்சியைப் பாதுகாத்தல், பிரிவு 356 முறைகேட்டை எதிர்த்தல், ஆளுநர்களின் சட்டவிரோத மசோதா முடக்கங்களை உச்ச நீதிமன்றத்தில் முறியடித்தல்.'
    },
    landmarkCase: {
      en: 'State of Tamil Nadu v. Governor of Tamil Nadu (2023) & S.R. Bommai (1994)',
      ta: 'தமிழ்நாடு அரசு எதிர் ஆளுநர் வழக்கு (2023) & எஸ்.ஆர். பொம்மை தீர்ப்பு (1994)'
    },
    keyProvisions: {
      en: [
        'Rajamannar Committee Report (1969) on Centre-State Relations',
        'Constitutional challenge to Governor sitting indefinitely on legislative bills',
        'Restoration of State authority over Concurrent List subjects (Education, Taxation)'
      ],
      ta: [
        'மத்திய - மாநில உறவுகள் குறித்த வரலாற்றுச் சிறப்புமிக்க ராஜமன்னார் குழு அறிக்கை (1969)',
        'சட்டமன்ற மசோதாக்களைக் காலவரையறையின்றி முடக்கும் ஆளுநர் அதிகார வரம்பிற்கு எதிரான தீர்ப்பு',
        'பொதுப்பட்டியல் துறைகளில் (கல்வி, மருத்துவம்) மாநில உரிமைகளை மீட்டெடுத்தல்'
      ]
    },
    quote: {
      text: {
        en: 'Autonomy for States, Federalism at the Centre — this is the democratic breath of the subcontinent.',
        ta: 'மத்தியில் கூட்டாட்சி, மாநிலத்தில் சுயாட்சி — இதுவே இந்திய துணைக்கண்டத்தின் ஜனநாயக சுவாசம்.'
      },
      author: {
        en: 'Muthamizharignar Kalaignar M. Karunanidhi',
        ta: 'முத்தமிழறிஞர் கலைஞர் மு. கருணாநிதி'
      }
    }
  },
  {
    id: 'rationalism',
    num: '04',
    statute: { en: 'Article 51A(h) • Secularism & Scientific Temper', ta: 'அரசமைப்பு உறுப்பு 51A(h) • அறிவியல் மனப்பான்மை' },
    milestone: { en: 'Secular Civic Space • Anti-Superstition', ta: 'மதச்சார்பற்ற பொதுவெளி • மூடநம்பிக்கை எதிர்ப்பு' },
    title: { en: 'Rationalism & Scientific Temper', ta: 'பகுத்தறிவும் அறிவியல் மனப்பான்மையும்' },
    tamilSubtitle: 'பகுத்தறிவு • மதச்சார்பின்மை பாதுகாப்பு',
    shortLabel: { en: 'Rationalism & Scientific Temper', ta: 'பகுத்தறிவு & அறிவியல் பார்வை' },
    desc: {
      en: 'Article 51A(h) commands every Indian citizen to develop the scientific temper, humanism, and the spirit of inquiry and reform. Resisting unconstitutional religious dogma in public administration, judicial proceedings, and educational curricula while defending free speech.',
      ta: 'அரசியலமைப்புச் சட்டத்தின் 51A(h) பிரிவு அறிவியல் மனப்பான்மை, மனிதநேயம் மற்றும் சீர்திருத்த உணர்வை வளர்ப்பதை அடிப்படைக் கடமையாகக் குறிப்பிடுகிறது. மதவாத ஆதிக்கங்களை எதிர்த்து பகுத்தறிவு சிந்தனையைப் பாதுகாக்கும் அறப்பணி.'
    },
    landmarkCase: {
      en: 'Periyar Self-Respect Publications v. State of TN & Fundamental Duty 51A(h)',
      ta: 'பெரியார் சுயமரியாதைப் பிரசுரங்கள் வழக்கு & உறுப்பு 51A(h) மதச்சார்பற்ற தீர்ப்பு'
    },
    keyProvisions: {
      en: [
        'Fundamental Duty Article 51A(h) advocacy across lower & appellate courts',
        'Protection of secular textbooks, rational scientific curriculum in schools',
        'Legal action against hate speech, communal polarization, and superstition'
      ],
      ta: [
        'நீதிமன்றங்களில் உறுப்பு 51A(h) அடிப்படையிலான முற்போக்கு வாதங்கள்',
        'பள்ளிப் பாடப்புத்தகங்களில் மதவாதத் திணிப்பை முறியடித்து அறிவியல் கல்வியைப் பாதுகாத்தல்',
        'வெறுப்புப் பேச்சு மற்றும் மதவாத பிளவுவாதத்திற்கு எதிரான சட்ட நடவடிக்கைகள்'
      ]
    },
    quote: {
      text: {
        en: 'Think, question, research, and discard whatever does not satisfy reasoned inquiry.',
        ta: 'எதையும் பகுத்தறிவோடு சிந்தித்து, கேள்வி கேட்டு, உண்மையறிந்து ஏற்றிடுக.'
      },
      author: {
        en: 'Thanthai Periyar',
        ta: 'தந்தை பெரியார்'
      }
    }
  },
  {
    id: 'tamil-language',
    num: '05',
    statute: { en: 'Article 348(2) & Official Languages Act', ta: 'அரசமைப்பு உறுப்பு 348(2) • வழக்காடு மொழி' },
    milestone: { en: 'Vernacular Justice • Tamil in High Court', ta: 'உயர் நீதிமன்றத்தில் தமிழ் • மக்கள் மொழி நீதி' },
    title: { en: 'Tamil Language Rights in Courts', ta: 'நீதிமன்றங்களில் தமிழ் மொழி உரிமை' },
    tamilSubtitle: 'தாய்மொழி உரிமை • உயர்நீதிமன்றத்தில் தமிழ்',
    shortLabel: { en: 'Tamil Language Rights in Courts', ta: 'நீதிமன்றங்களில் தமிழ் உரிமை' },
    desc: {
      en: 'Justice cannot be alienated from the people who speak the vernacular. Campaigning resolutely under Article 348(2) for presidential consent to permit the Tamil language in proceedings and judgments of the Madras High Court, while advancing bilingual legal enactments.',
      ta: 'மக்களின் தாய்மொழியில் வழங்கப்படாத நீதி முழுமையானதாக இருக்க முடியாது. சென்னை உயர் நீதிமன்றத்தில் தமிழை வழக்காடு மொழியாக நடைமுறைப்படுத்த உறுப்பு 348(2)-இன் கீழ் குடியரசுத் தலைவரின் ஒப்புதல் கோரும் சட்ட இயக்கம்.'
    },
    landmarkCase: {
      en: 'Madras High Court Tamil Language Petitions & Subordinate Court Tamil Mandate',
      ta: 'சென்னை உயர் நீதிமன்ற தமிழ் வழக்காடு மொழி மனுக்கள் & கீழமை நீதிமன்ற தமிழ் ஆணை'
    },
    keyProvisions: {
      en: [
        'Resolution in Tamil Nadu Legislative Assembly for Court Tamil under Art 348(2)',
        'Mandatory Tamil pleadings and judgments across all District and Sessions Courts',
        'Publication of authentic Tamil translations of Central and State statutory codes'
      ],
      ta: [
        'சட்டமன்றத்தில் உயர் நீதிமன்றத்தில் தமிழ் வழக்காடு மொழியாக தீர்மானம்',
        'மாவட்ட மற்றும் அமர்வு நீதிமன்றங்களில் தமிழில் தீர்ப்புகள் வழங்குவதை உறுதி செய்தல்',
        'மத்திய மற்றும் மாநில சட்டத் தொகுப்புகளின் அதிகாரப்பூர்வ தமிழ் மொழிபெயர்ப்புகள்'
      ]
    },
    quote: {
      text: {
        en: 'Language is not merely a vehicle of speech; it is the sovereign soul of justice.',
        ta: 'மொழி என்பது வெறும் பேச்சுக்கருவி மட்டுமல்ல; அது நீதியின் இறையாண்மை வடிவம்.'
      },
      author: {
        en: 'Arignar Anna (Parliamentary Speech on Official Languages, 1963)',
        ta: 'பேரறிஞர் அண்ணா (நாடாளுமன்ற உரை, 1963)'
      }
    }
  },
  {
    id: 'constitutional-democracy',
    num: '06',
    statute: { en: 'Basic Structure Doctrine • Articles 32 & 226', ta: 'அடிப்படை கட்டமைப்பு • உறுப்புகள் 32 & 226' },
    milestone: { en: 'Emergency 1975 • MISA Habeas Corpus Defense', ta: '1975 அவசரநிலை • மிசா ஆட்கொணர்வு சட்டப்போர்' },
    title: { en: 'Constitutional Democracy & Rule of Law', ta: 'அரசமைப்பு ஜனநாயகமும் சட்டத்தின் ஆட்சியும்' },
    tamilSubtitle: 'ஜனநாயக உரிமை • நீதித்துறை சுதந்திரம்',
    shortLabel: { en: 'Constitutional Democracy & Rule ...', ta: 'ஜனநாயகம் & சட்டத்தின் ஆட்சி' },
    desc: {
      en: 'Rooted in Dr. B.R. Ambedkar’s constitutional vision. Standing heroic during the 1975 Emergency, filing historic Habeas Corpus petitions to protect arrested DMK leaders and citizens under MISA, defending judicial independence, and safeguarding the Basic Structure doctrine.',
      ta: 'அண்ணல் அம்பேத்கர் வகுத்தளித்த அரசமைப்பு விழுமியங்களின் வழியில், ஜனநாயக உரிமைகளையும் நீதித்துறை சுதந்திரத்தையும் பாதுகாக்க 1975 எமர்ஜென்சி காலம் முதல் நீதிமன்றங்களில் இடைவிடாது தொடரும் அறப்படை.'
    },
    landmarkCase: {
      en: 'MISA Habeas Corpus Petitions (Madras High Court, 1976) & ADM Jabalpur Resisted',
      ta: 'மிசா ஆட்கொணர்வு மனுக்கள் (சென்னை உயர் நீதிமன்றம், 1976)'
    },
    keyProvisions: {
      en: [
        'Defense of democratic dissent, press freedom, and civil liberties',
        'Resistance to arbitrary detentions and extra-constitutional overreach',
        'Defense of judicial independence as unalterable Basic Structure of the Constitution'
      ],
      ta: [
        'ஜனநாயகக் கருத்துரிமை, பத்திரிகை சுதந்திரம் மற்றும் குடிமக்கள் உரிமைகள் பாதுகாப்பு',
        'சட்டவிரோதக் கைதுகள் மற்றும் எதேச்சதிகாரத்திற்கு எதிரான ஆட்கொணர்வு மனுக்கள்',
        'நீதித்துறை சுதந்திரத்தை அரசமைப்பின் மாற்ற முடியாத அடிப்படைக் கட்டமைப்பாகக் காத்தல்'
      ]
    },
    quote: {
      text: {
        en: 'Constitutional morality is not a natural sentiment. It has to be cultivated.',
        ta: 'அரசமைப்பு ஒழுக்கம் என்பது தானாக முளைக்கும் உணர்வல்ல; அது விடாமுயற்சியோடு வளர்த்தெடுக்கப்பட வேண்டியது.'
      },
      author: {
        en: 'Dr. B.R. Ambedkar (Constituent Assembly Debates, 1948)',
        ta: 'புரட்சியாளர் அம்பேத்கர் (அரசமைப்பு நிர்ணய சபை, 1948)'
      }
    }
  }
];

const AUTO_ADVANCE_DURATION = 6000; // 6 seconds per doctrine

export const FoundationalDoctrines: React.FC = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(2); // default index 2 (Doctrine 03) matching screenshot
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalStepRef = useRef<NodeJS.Timeout | null>(null);

  const activeDoctrine = DOCTRINES[activeIndex];

  // Progress animation and auto advance
  useEffect(() => {
    if (!isAutoAdvancing) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const updateInterval = 50;

    intervalStepRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / AUTO_ADVANCE_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTO_ADVANCE_DURATION) {
        setActiveIndex((prev) => (prev + 1) % DOCTRINES.length);
        setProgress(0);
      }
    }, updateInterval);

    return () => {
      if (intervalStepRef.current) clearInterval(intervalStepRef.current);
    };
  }, [activeIndex, isAutoAdvancing]);

  const handleSelectDoctrine = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const toggleAutoAdvance = () => {
    setIsAutoAdvancing((prev) => !prev);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % DOCTRINES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + DOCTRINES.length) % DOCTRINES.length);
    setProgress(0);
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111111] font-dmk-body">
      
      {/* 1. TOP HEADER STRIP (Matching Image 1 Screenshot) */}
      <div className="border-t-2 border-neutral-900 pt-5 pb-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Brand Tag */}
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-[#E31E24] inline-block shrink-0" />
          <h2 className="text-xs sm:text-sm font-english font-black uppercase tracking-[0.2em] text-[#111111]">
            {language === 'ta' ? 'அரசமைப்பு அடிப்படைக் கோட்பாடுகள்' : 'SIX FOUNDATIONAL DOCTRINES'}
          </h2>
        </div>

        {/* Right: Auto-Advancing Status & Doctrine Counter */}
        <div className="flex items-center gap-4 text-xs font-english">
          <button
            onClick={toggleAutoAdvance}
            className="flex items-center gap-1.5 text-neutral-700 hover:text-[#E31E24] transition-colors font-semibold uppercase tracking-wider"
            title={isAutoAdvancing ? 'Pause Auto-Advancement' : 'Resume Auto-Advancement'}
          >
            {isAutoAdvancing ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#E31E24]" />
                <span className="text-[11px] tracking-widest text-[#E31E24] font-bold">
                  {language === 'ta' ? 'தானியங்கி இயக்கம்' : 'AUTO-ADVANCING'}
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-[11px] tracking-widest text-neutral-600 font-bold">
                  {language === 'ta' ? 'நிறுத்தப்பட்டுள்ளது' : 'PAUSED'}
                </span>
              </>
            )}
          </button>

          <span className="text-neutral-400 font-bold">•</span>

          <span className="text-xs font-english font-black tracking-widest text-[#E31E24] uppercase">
            {language === 'ta' 
              ? `கோட்பாடு 0${activeIndex + 1} / 06` 
              : `DOCTRINE 0${activeIndex + 1} OF 06`}
          </span>
        </div>
      </div>

      {/* 2. SIX SEGMENTED PROGRESS BARS & LABELS (Exact match to Image 1) */}
      <div className="pt-2 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {DOCTRINES.map((item, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectDoctrine(idx)}
                className="text-left group cursor-pointer focus:outline-none flex flex-col justify-start"
              >
                {/* Horizontal Progress Bar Segment */}
                <div className="w-full h-1 bg-neutral-200 relative overflow-hidden mb-2 rounded-none">
                  {isCompleted && (
                    <div className="w-full h-full bg-[#E31E24]" />
                  )}
                  {isActive && (
                    <div
                      className="h-full bg-[#E31E24] transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>

                {/* Number & Label */}
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span
                    className={`text-xs font-english font-black shrink-0 transition-colors ${
                      isActive ? 'text-[#E31E24]' : 'text-neutral-500 group-hover:text-neutral-900'
                    }`}
                  >
                    {item.num}
                  </span>
                  <span
                    className={`text-xs font-english truncate tracking-tight transition-colors ${
                      isActive
                        ? 'font-black text-neutral-900'
                        : 'font-medium text-neutral-600 group-hover:text-neutral-900'
                    }`}
                  >
                    {item.shortLabel[language]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE DOCTRINE SPOTLIGHT STAGE (Asymmetrical Broadsheet Composition) */}
      <div className="border border-neutral-300 bg-white p-6 sm:p-10 shadow-xs relative overflow-hidden">
        
        {/* Subtle Watermark Scales in Background */}
        <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
          <Scale className="w-72 h-72 text-neutral-900" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Column: Big Numeral, Statutes, Headlines & Manifesto (7 cols) */}
          <div className="lg:col-span-7 space-y-5 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-8 lg:pb-0">
            
            {/* Top metadata tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl font-black font-english text-[#E31E24] tracking-tight leading-none">
                {activeDoctrine.num}
              </span>
              <span className="text-neutral-300">/</span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800 bg-[#FAF7F2] px-3 py-1 border border-neutral-300">
                {activeDoctrine.statute[language]}
              </span>
              <span className="text-[11px] font-english font-bold uppercase tracking-wider text-[#E31E24] border-l-2 border-[#E31E24] pl-2">
                {activeDoctrine.milestone[language]}
              </span>
            </div>

            {/* Bilingual Doctrine Title */}
            <div>
              <h3 className="text-2xl sm:text-4xl font-black text-neutral-900 font-dmk-headline leading-tight">
                {activeDoctrine.title[language]}
              </h3>
              <p className="text-sm sm:text-base font-semibold text-neutral-500 font-dmk-headline mt-1">
                {activeDoctrine.tamilSubtitle}
              </p>
            </div>

            {/* Comprehensive Editorial Narrative */}
            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-dmk-body">
              {activeDoctrine.desc[language]}
            </p>

            {/* Historic Quotation Block */}
            <div className="bg-[#FAF7F2] border-l-4 border-[#E31E24] p-4 sm:p-5 space-y-2">
              <div className="flex items-start gap-3">
                <Quote className="w-6 h-6 text-[#E31E24] shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif italic text-sm sm:text-base text-neutral-900 leading-relaxed">
                    "{activeDoctrine.quote.text[language]}"
                  </p>
                  <p className="text-[11px] font-english font-bold uppercase tracking-wider text-neutral-600 mt-2">
                    — {activeDoctrine.quote.author[language]}
                  </p>
                </div>
              </div>
            </div>

            {/* Read full treatise link */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
              <Link
                href={`/ideology#${activeDoctrine.id}`}
                className="inline-flex items-center gap-2 text-xs font-english font-bold uppercase tracking-wider text-[#E31E24] hover:text-black transition-colors group"
              >
                <span>{language === 'ta' ? 'முழு கோட்பாட்டு ஆவணம் படிக்க' : 'READ FULL DOCTRINE TREATISE'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </Link>

              <span className="text-xs font-english text-neutral-500">
                DMK LEGAL ACADEMY
              </span>
            </div>

          </div>

          {/* Right Column: Key Safeguards, Landmark Precedent & Tactical Navigation (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
            
            {/* Landmark Case Banner */}
            <div className="border border-neutral-300 p-4 bg-[#FAF7F2]">
              <div className="flex items-center gap-1.5 text-[11px] font-english font-bold uppercase tracking-wider text-[#E31E24] mb-1.5">
                <Scale className="w-3.5 h-3.5 text-[#E31E24]" />
                <span>{language === 'ta' ? 'முதன்மையான உச்ச நீதிமன்றத் தீர்ப்பு' : 'LANDMARK CONSTITUTIONAL PRECEDENT'}</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 font-dmk-headline leading-snug">
                {activeDoctrine.landmarkCase[language]}
              </h4>
            </div>

            {/* Constitutional Safeguards List */}
            <div className="space-y-3">
              <h5 className="text-xs font-english font-bold uppercase tracking-widest text-neutral-600 border-b border-neutral-200 pb-1.5">
                {language === 'ta' ? 'அரசமைப்புப் பாதுகாப்பு மைல்கற்கள்' : 'CONSTITUTIONAL SAFEGUARDS & REFORMS'}
              </h5>
              
              <ul className="space-y-2.5">
                {activeDoctrine.keyProvisions[language].map((prov, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 font-dmk-body">
                    <CheckCircle2 className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                    <span className="leading-snug">{prov}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Controls: Tactile Prev / Next / Pause Buttons */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="px-3 py-2 border border-neutral-300 hover:border-neutral-900 hover:bg-[#FAF7F2] text-neutral-800 text-xs font-english font-bold flex items-center gap-1 transition-all"
                  aria-label="Previous Doctrine"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{language === 'ta' ? 'முந்தையது' : 'Prev'}</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-3 py-2 border border-neutral-300 hover:border-neutral-900 hover:bg-[#FAF7F2] text-neutral-800 text-xs font-english font-bold flex items-center gap-1 transition-all"
                  aria-label="Next Doctrine"
                >
                  <span>{language === 'ta' ? 'அடுத்தது' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] font-mono text-neutral-500">
                {activeIndex + 1} / {DOCTRINES.length}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
