'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  UserPlus, 
  Scale, 
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

interface Slide {
  id: string;
  theme: 'gold-rally' | 'crimson-legal' | 'black-autonomy' | 'emerald-cadre';
  imageType: 'official-banner' | 'custom-render';
  bgGradient: string;
  bannerImage?: string;
  tagline: { en: string; ta: string };
  titlePrimary: { en: string; ta: string };
  titleSecondary: { en: string; ta: string };
  subtitle: { en: string; ta: string };
  ctaText: { en: string; ta: string };
  ctaLink: string;
  tickerText: { en: string; ta: string };
  tickerButton: { en: string; ta: string };
}

export const DmkHeroSlider: React.FC = () => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const slides: Slide[] = [
    {
      id: 'slide-campaign-stalin',
      theme: 'gold-rally',
      imageType: 'official-banner',
      bgGradient: 'from-[#FFB703] via-[#FCBF49] to-[#E85D04]',
      bannerImage: '/images/dmk-campaign-stalin.jpg',
      tagline: {
        en: 'OFFICIAL PLATFORM • DRAVIDA MUNNETRA KAZHAGAM',
        ta: 'அதிகாரப்பூர்வ தளம் • திராவிட முன்னேற்றக் கழகம்'
      },
      titlePrimary: {
        en: 'TAMIL NADU SHALL STAND PROUD!',
        ta: 'தமிழ்நாட்டை தலைகுனிய விடமாட்டேன்!'
      },
      titleSecondary: {
        en: 'DEFENDING SOCIAL JUSTICE IN EVERY COURT',
        ta: 'நீதிமன்றங்களில் சமூக நீதியை நிலைநாட்டுவோம்!'
      },
      subtitle: {
        en: 'Under the guidance of DMK President & Hon’ble Chief Minister M.K. Stalin, our legal cadre defends the constitutional rights and autonomy of Tamil Nadu.',
        ta: 'கழகத் தலைவர், மாண்புமிகு முதலமைச்சர் மு.க. ஸ்டாலின் அவர்களின் வழிகாட்டலில் சமூக நீதியையும் மாநில உரிமைகளையும் காக்கும் வழக்கறிஞர்களின் அறப்படை.'
      },
      ctaText: {
        en: 'Join Legal Wing',
        ta: 'அணியில் இணையுங்கள்'
      },
      ctaLink: '/contact#register',
      tickerText: {
        en: 'Tamil Nadu’s premier constitutional & trial advocates organisation — Defending State Rights.',
        ta: 'தமிழ்நாட்டிற்கு விடியல் பாய்ச்சும் உதயசூரியனின் சமூக நீதிப் போர்ப்படை — வழக்கறிஞர் அணி!'
      },
      tickerButton: {
        en: 'Join Today',
        ta: 'இங்கே இணையுங்கள்'
      }
    },
    {
      id: 'slide-four-mentors',
      theme: 'gold-rally',
      imageType: 'official-banner',
      bgGradient: 'from-[#2A1208] via-[#8C3A0F] to-[#140803]',
      bannerImage: '/images/dmk-four-leaders.jpg',
      tagline: {
        en: 'IDEOLOGICAL PILLARS • SOCIAL JUSTICE CRUSADE',
        ta: 'கொள்கை வழிகாட்டிகள் • சமூக நீதிப் பிரகடனம்'
      },
      titlePrimary: {
        en: 'FOLLOWING THE PATH OF OUR VISIONARY LEADERS!',
        ta: 'கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்!'
      },
      titleSecondary: {
        en: 'BUILDING AN EGALITARIAN SOCIETY FOR ALL!',
        ta: 'சமத்துவ சமுதாயம் படைப்போம்!'
      },
      subtitle: {
        en: 'Inspired by Thanthai Periyar, Perarignar Anna, Muthamizharignar Kalaignar, and Thalapathi M.K. Stalin — advancing social equality and federal autonomy.',
        ta: 'தந்தை பெரியார், பேரறிஞர் அண்ணா, முத்தமிழறிஞர் கலைஞர் மற்றும் மாண்புமிகு முதலமைச்சர் மு.க. ஸ்டாலின் ஆகியோரின் வழியில் சமூக சமத்துவக் குரல்.'
      },
      ctaText: {
        en: 'Our Ideology',
        ta: 'கொள்கை நெறிமுறைகள்'
      },
      ctaLink: '/ideology',
      tickerText: {
        en: 'Dravidian Constitutional Jurisprudence: Safeguarding Equality, Federalism, and Human Dignity.',
        ta: 'கொள்கை தலைவர்களின் வழியைப் பின்பற்றுவோம்! சமத்துவ சமுதாயம் படைப்போம்!'
      },
      tickerButton: {
        en: 'Explore Doctrine',
        ta: 'கொள்கை பார்வை'
      }
    },
    {
      id: 'slide-reservation',
      theme: 'crimson-legal',
      imageType: 'custom-render',
      bgGradient: 'from-[#9A1B1F] via-[#C8161C] to-[#141416]',
      tagline: {
        en: 'HISTORIC CONSTITUTIONAL VICTORY',
        ta: 'வரலாற்றுச் சிறப்புமிக்க அரசமைப்பு வெற்றி'
      },
      titlePrimary: {
        en: 'SAFEGUARDING 69% RESERVATION',
        ta: '69% இடஒதுக்கீடு எங்கள் உயிர்மூச்சு!'
      },
      titleSecondary: {
        en: 'THE NINTH SCHEDULE CONSTITUTIONAL SHIELD',
        ta: 'உச்ச நீதிமன்றத்தில் நிலைநிறுத்திய கழக வரலாறு!'
      },
      subtitle: {
        en: 'DMK Legal Wing defended Tamil Nadu Act 45 of 1994 before Constitutional Benches, securing affirmative action quotas for backward classes, SC, ST, and minorities.',
        ta: 'தமிழ்நாடு சட்டம் 45/1994-ஐ அரசமைப்பு அமர்வுகளில் உறுதி செய்து, பிற்படுத்தப்பட்ட, ஒடுக்கப்பட்ட மக்களின் கல்வி மற்றும் வேலைவாய்ப்பு உரிமைகளைப் பாதுகாத்த இயக்கம்.'
      },
      ctaText: {
        en: 'Read Case Dossier',
        ta: 'தீர்ப்பு ஆவணம் வாசிக்க'
      },
      ctaLink: '/resources',
      tickerText: {
        en: 'Complete compendium on Tamil Nadu 69% Reservation Act & Ninth Schedule filings available.',
        ta: 'தமிழ்நாடு 69% இடஒதுக்கீட்டுச் சட்டம் மற்றும் உச்சநீதிமன்ற வாதங்களின் முழுமையான தொகுப்பு.'
      },
      tickerButton: {
        en: 'View Dossier',
        ta: 'ஆவணம் பார்க்க'
      }
    },
    {
      id: 'slide-autonomy',
      theme: 'black-autonomy',
      imageType: 'custom-render',
      bgGradient: 'from-[#141416] via-[#2A181A] to-[#0A0A0A]',
      tagline: {
        en: 'SUPREME COURT PRECEDENT ON ARTICLE 200',
        ta: 'அரசமைப்பு உறுப்பு 200: உச்ச நீதிமன்றத் தீர்ப்பு'
      },
      titlePrimary: {
        en: 'FEDERALISM IN THE UNION,',
        ta: 'மத்தியில் கூட்டாட்சி, மாநிலத்தில் சுயாட்சி!'
      },
      titleSecondary: {
        en: 'TRUE AUTONOMY IN THE STATES!',
        ta: 'ஆளுநர் அதிகார அத்துமீறலுக்கு முற்றுப்புள்ளி!'
      },
      subtitle: {
        en: 'Supreme Court established that Governors cannot withhold assent to state bills indefinitely. Elected legislative sovereignty restored across the Republic.',
        ta: 'சட்டப்பேரவை நிறைவேற்றும் மசோதாக்களை ஆளுநர்கள் காலவரையின்றி முடக்க முடியாது என உச்சநீதிமன்றத்தில் பெறப்பட்ட வரலாற்றுத் தீர்ப்பு.'
      },
      ctaText: {
        en: 'Explore Ruling',
        ta: 'தீர்ப்பு விவரம்'
      },
      ctaLink: '/news',
      tickerText: {
        en: 'Supreme Court bench rules in favour of Tamil Nadu Legislature: Pocket vetoes declared unconstitutional.',
        ta: 'சட்டப்பேரவை நிறைவேற்றிய மசோதாக்களைக் கிடப்பில் போடும் ஆளுநரின் மறைமுக வீட்டோ அதிகாரம் ரத்து!'
      },
      tickerButton: {
        en: 'Read Report',
        ta: 'முழு செய்தி'
      }
    },
    {
      id: 'slide-cadre',
      theme: 'emerald-cadre',
      imageType: 'custom-render',
      bgGradient: 'from-[#B81318] via-[#E31E24] to-[#1C1C1E]',
      tagline: {
        en: 'STATE-WIDE ADVOCATE EMPOWERMENT',
        ta: 'மாநில அளவிலான வழக்கறிஞர்கள் கூட்டமைப்பு'
      },
      titlePrimary: {
        en: '28,500+ ENROLLED ADVOCATES',
        ta: '28,500+ வழக்கறிஞர்களின் உரிமை அரண்!'
      },
      titleSecondary: {
        en: 'MONTHLY STIPEND FOR JUNIOR LAWYERS',
        ta: 'இளம் வழக்கறிஞர்களுக்கு மாதாந்திர உதவித்தொகை!'
      },
      subtitle: {
        en: 'Pioneering monthly stipend assistance and junior advocate training programmes across all 38 districts of Tamil Nadu and the Madras High Court.',
        ta: 'தமிழ்நாட்டின் அனைத்து மாவட்டங்களிலும் இளம் வழக்கறிஞர்களுக்கு நிதி ஆதரவும், பயிற்சி முகாம்களும் வழங்கும் திராவிட மாடல் அரசு.'
      },
      ctaText: {
        en: 'Advocate Registration',
        ta: 'வழக்கறிஞர் பதிவு'
      },
      ctaLink: '/contact#register',
      tickerText: {
        en: 'Junior advocate enrollment drive active in all 38 district court complexes. Apply online.',
        ta: '38 மாவட்ட நீதிமன்ற வளாகங்களிலும் வழக்கறிஞர் உறுப்பினர் சேர்க்கை நடைபெறுகிறது. விண்ணப்பிக்கலாம்.'
      },
      tickerButton: {
        en: 'Apply Online',
        ta: 'விண்ணப்பிக்க'
      }
    }
  ];

  // Auto-play timer with progress trigger
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length;
        setProgressKey((k) => k + 1);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgressKey((k) => k + 1);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div 
      className="w-full relative overflow-hidden bg-[#FAF8F5] border-b-2 border-[#E2DDD5]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Visual Progress Bar on top of slider */}
      <div className="w-full h-1 bg-black/10 overflow-hidden">
        <div 
          key={progressKey}
          className={`h-full bg-[#E31E24] transition-all duration-[6000ms] ease-linear ${isPaused ? 'opacity-50' : 'w-full'}`}
          style={{ width: isPaused ? '100%' : '100%' }}
        />
      </div>

      {/* Main Slider Display Area */}
      <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] w-full flex items-center justify-center transition-all duration-500">
        
        {/* OFFICIAL DMK HERO BANNER ARTWORK (uploaded by user) */}
        {slide.imageType === 'official-banner' ? (
          <div className={`relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden ${
            slide.id === 'slide-four-mentors' ? 'bg-[#2A1208]' : 'bg-[#F9C300]'
          }`}>
            
            {/* The Official Banner Image */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <img
                src={slide.bannerImage}
                alt={slide.titlePrimary[language]}
                className="w-full h-full object-cover object-center filter saturate-105 transition-all duration-700 hover:scale-[1.01]"
              />
            </div>

            {/* Gradient shadow for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Interactive Quick Action Button at Bottom Left (leaving right slogan clear) */}
            <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 z-20 flex flex-wrap items-center gap-3 animate-in fade-in duration-500">
              <Link
                href={slide.ctaLink}
                className="px-6 py-2.5 bg-[#E31E24] hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border border-white shadow-xl transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-dmk-headline font-bold">{slide.ctaText[language]}</span>
              </Link>
              <span className="text-[11px] font-english text-white font-semibold bg-black/85 px-3 py-1.5 border border-white/20 backdrop-blur-xs">
                {language === 'ta' ? 'திமுக வழக்கறிஞர் அணித் தலைமை' : 'DMK Legal Wing Secretariat'}
              </span>
            </div>

          </div>
        ) : (
          /* SLIDES 2, 3, 4: OFFICIAL STYLED CAMPAIGN SLIDES */
          <div className={`relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center justify-center bg-gradient-to-r ${slide.bgGradient} text-white px-4 sm:px-8 lg:px-16 overflow-hidden`}>
            
            {/* Sunburst background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-12">
              
              {/* Left Column: Prestigious Emblem & Movement Seal */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center gap-6">
                
                {/* Central High-Impact Shield */}
                <div className="relative group">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 border-2 border-white/80 shadow-2xl flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src="/images/dmk-flag-sun.jpg"
                      alt="DMK Flag & Rising Sun"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Glowing background aura */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#E31E24] to-[#FFB703] opacity-40 blur-lg rounded-full pointer-events-none" />
                </div>

                {/* Slogan Banner */}
                <div className="text-center space-y-1">
                  <span className="px-3 py-1 bg-black/60 border border-white/20 text-[11px] font-english font-bold uppercase tracking-widest text-[#FFD166] inline-block">
                    {language === 'ta' ? 'அரசமைப்புச் சட்ட அரண்' : 'CONSTITUTIONAL CITADEL'}
                  </span>
                  <p className="text-xs text-white/80 font-english">
                    {language === 'ta' ? 'சென்னை உயர்நீதிமன்றம் & இந்திய உச்சநீதிமன்றம்' : 'Madras High Court & Supreme Court of India'}
                  </p>
                </div>

              </div>

              {/* Right Column: Hero Bold Typography in exact Anek Tamil / Mukta Malar font */}
              <div className="lg:col-span-7 space-y-5 text-left">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 border border-white/30 text-xs font-english font-bold tracking-widest uppercase">
                  <span className="w-2.5 h-2.5 bg-[#E31E24] rounded-full inline-block animate-pulse" />
                  <span>{slide.tagline[language]}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-dmk-headline tracking-tight leading-[1.08] text-white">
                    {slide.titlePrimary[language]}
                  </h2>
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-dmk-headline text-[#FFD166]">
                    {slide.titleSecondary[language]}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed font-dmk-body pt-1">
                  {slide.subtitle[language]}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaLink}
                    className="px-7 py-3.5 bg-[#E31E24] hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border border-white/40 shadow-lg transition-all duration-200"
                  >
                    <span>{slide.ctaText[language]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/structure"
                    className="px-7 py-3.5 bg-black/70 hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider border border-white/30 transition-all duration-200"
                  >
                    {language === 'ta' ? 'அமைப்பு விவரம்' : 'Organisation Chart'}
                  </Link>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Previous & Next Control Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-black/75 hover:bg-[#E31E24] text-white border border-white/40 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-black/75 hover:bg-[#E31E24] text-white border border-white/40 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Slide Dot Indicators + Play/Pause Control */}
        <div className="absolute bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/80 px-4 py-2 border border-white/20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 bg-[#E31E24]'
                  : 'w-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}

          <div className="h-3 w-[1px] bg-white/30 ml-1" />

          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* BOTTOM TICKER / CAMPAIGN ACTION BAR */}
      <div className="bg-[#0C0C0E] border-t border-neutral-800 text-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2.5 overflow-hidden text-center sm:text-left">
            <span className="w-2 h-2 bg-[#E31E24] shrink-0 hidden sm:inline-block" />
            <span className="font-dmk-body text-neutral-200 text-xs sm:text-sm font-semibold">
              {slide.tickerText[language]}
            </span>
          </div>

          <Link
            href={slide.ctaLink}
            className="shrink-0 px-4 py-1.5 bg-[#E31E24] hover:bg-neutral-900 text-white font-dmk-headline font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors"
          >
            {slide.tickerButton[language]} &rarr;
          </Link>

        </div>
      </div>

    </div>
  );
};
