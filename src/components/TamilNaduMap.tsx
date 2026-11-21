'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { DistrictInfo } from '../types';
import { 
  Building2, 
  Phone, 
  Mail, 
  Users, 
  Scale, 
  Search, 
  Filter, 
  ExternalLink,
  Eye, 
  Download, 
  MapPin, 
  X, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AdminDistrictMeta {
  id: string;
  name: { en: string; ta: string };
  pathD: string;
  center: [number, number];
  subDistrictIds: string[];
}

// Geographically positioned SVG polygons and centers for Tamil Nadu administrative districts
const TN_ADMIN_DISTRICTS: AdminDistrictMeta[] = [
  {
    id: 'tiruvannamalai',
    name: { en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை' },
    center: [280, 140],
    pathD: 'M 255,120 L 300,110 L 315,135 L 305,165 L 280,175 L 255,160 L 245,135 Z',
    subDistrictIds: ['thiruvannamalai-north', 'thiruvannamalai-south']
  },
  {
    id: 'chennai',
    name: { en: 'Chennai', ta: 'சென்னை' },
    center: [348, 82],
    pathD: 'M 342,75 L 356,76 L 358,90 L 344,89 Z',
    subDistrictIds: [
      'chennai-east',
      'chennai-north',
      'chennai-west',
      'chennai-north-east',
      'chennai-south',
      'chennai-south-west'
    ]
  },
  {
    id: 'thiruvallur',
    name: { en: 'Tiruvallur', ta: 'திருவள்ளூர்' },
    center: [325, 70],
    pathD: 'M 305,55 L 345,60 L 344,82 L 320,85 L 305,75 Z',
    subDistrictIds: ['thiruvallur-central', 'thiruvallur-east', 'thiruvallur-west']
  },
  {
    id: 'kancheepuram',
    name: { en: 'Kancheepuram', ta: 'காஞ்சிபுரம்' },
    center: [320, 105],
    pathD: 'M 305,95 L 335,92 L 340,115 L 315,122 L 300,110 Z',
    subDistrictIds: ['kancheepuram-north', 'kancheepuram-south']
  },
  {
    id: 'ranipet',
    name: { en: 'Ranipet', ta: 'ராணிப்பேட்டை' },
    center: [290, 88],
    pathD: 'M 275,80 L 305,78 L 305,96 L 278,98 Z',
    subDistrictIds: ['ranipet']
  },
  {
    id: 'vellore',
    name: { en: 'Vellore', ta: 'வேலூர்' },
    center: [265, 96],
    pathD: 'M 250,88 L 275,86 L 278,110 L 250,112 Z',
    subDistrictIds: ['vellore']
  },
  {
    id: 'thiruppathur',
    name: { en: 'Tirupathur', ta: 'திருப்பத்தூர்' },
    center: [240, 115],
    pathD: 'M 228,105 L 252,106 L 250,130 L 225,126 Z',
    subDistrictIds: ['thiruppathur']
  },
  {
    id: 'krishnagiri',
    name: { en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி' },
    center: [215, 105],
    pathD: 'M 195,90 L 230,92 L 228,125 L 195,115 Z',
    subDistrictIds: ['krishnagiri-east', 'krishnagiri-west']
  },
  {
    id: 'dharmapuri',
    name: { en: 'Dharmapuri', ta: 'தர்மபுரி' },
    center: [220, 140],
    pathD: 'M 200,125 L 238,126 L 240,158 L 202,155 Z',
    subDistrictIds: ['dharmapuri-east', 'dharmapuri-west']
  },
  {
    id: 'vilupuram',
    name: { en: 'Viluppuram', ta: 'விழுப்புரம்' },
    center: [295, 170],
    pathD: 'M 275,155 L 320,150 L 325,185 L 285,188 L 272,170 Z',
    subDistrictIds: ['vilupuram-north', 'vilupuram-south']
  },
  {
    id: 'kallakurichi',
    name: { en: 'Kallakurichi', ta: 'கள்ளக்குறிச்சி' },
    center: [255, 180],
    pathD: 'M 235,165 L 275,162 L 275,195 L 235,195 Z',
    subDistrictIds: ['kallakurichi-north', 'kallakurichi-south']
  },
  {
    id: 'cuddalore',
    name: { en: 'Cuddalore', ta: 'கடலூர்' },
    center: [310, 205],
    pathD: 'M 285,190 L 335,185 L 330,225 L 285,220 Z',
    subDistrictIds: ['cuddalore-east', 'cuddalore-west']
  },
  {
    id: 'salem',
    name: { en: 'Salem', ta: 'சேலம்' },
    center: [215, 180],
    pathD: 'M 195,160 L 238,160 L 240,205 L 195,200 Z',
    subDistrictIds: ['salem-central', 'salem-east', 'salem-west']
  },
  {
    id: 'namakkal',
    name: { en: 'Namakkal', ta: 'நாமக்கல்' },
    center: [215, 220],
    pathD: 'M 198,205 L 238,206 L 236,238 L 195,235 Z',
    subDistrictIds: ['namakkal-east', 'namakkal-west']
  },
  {
    id: 'erode',
    name: { en: 'Erode', ta: 'ஈரோடு' },
    center: [175, 195],
    pathD: 'M 155,175 L 195,178 L 195,215 L 150,210 Z',
    subDistrictIds: ['erode-north', 'erode-south']
  },
  {
    id: 'nilagiri',
    name: { en: 'Nilgiris', ta: 'நீலகிரி' },
    center: [125, 190],
    pathD: 'M 110,180 L 145,178 L 145,205 L 115,208 Z',
    subDistrictIds: ['nilagiri']
  },
  {
    id: 'covai',
    name: { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
    center: [140, 235],
    pathD: 'M 125,215 L 160,212 L 158,260 L 122,250 Z',
    subDistrictIds: ['covai-city', 'covai-north', 'covai-south']
  },
  {
    id: 'tiruppur',
    name: { en: 'Tiruppur', ta: 'திருப்பூர்' },
    center: [175, 238],
    pathD: 'M 160,220 L 195,218 L 192,260 L 158,258 Z',
    subDistrictIds: ['tiruppur-north', 'tiruppur-south']
  },
  {
    id: 'karur',
    name: { en: 'Karur', ta: 'கரூர்' },
    center: [215, 252],
    pathD: 'M 198,240 L 235,240 L 232,270 L 195,268 Z',
    subDistrictIds: ['karur']
  },
  {
    id: 'trichy',
    name: { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
    center: [255, 250],
    pathD: 'M 235,235 L 275,232 L 275,275 L 232,272 Z',
    subDistrictIds: ['trichy-north', 'trichy-south', 'trichy-central']
  },
  {
    id: 'perambalur',
    name: { en: 'Perambalur', ta: 'பெரம்பலூர்' },
    center: [260, 220],
    pathD: 'M 245,210 L 275,208 L 275,232 L 245,232 Z',
    subDistrictIds: ['perambalur']
  },
  {
    id: 'ariyalur',
    name: { en: 'Ariyalur', ta: 'அரியலூர்' },
    center: [285, 222],
    pathD: 'M 275,210 L 305,212 L 302,238 L 275,235 Z',
    subDistrictIds: ['ariyalur']
  },
  {
    id: 'mayiladuthurai',
    name: { en: 'Mayiladuthurai', ta: 'மயிலாடுதுறை' },
    center: [320, 235],
    pathD: 'M 308,225 L 335,225 L 332,248 L 308,245 Z',
    subDistrictIds: ['mayiladuthurai']
  },
  {
    id: 'thiruvarur',
    name: { en: 'Tiruvarur', ta: 'திருவாரூர்' },
    center: [315, 260],
    pathD: 'M 305,250 L 330,250 L 325,278 L 302,272 Z',
    subDistrictIds: ['thiruvarur']
  },
  {
    id: 'nagapattinam',
    name: { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' },
    center: [332, 275],
    pathD: 'M 325,260 L 340,260 L 338,295 L 322,290 Z',
    subDistrictIds: ['nagapattinam']
  },
  {
    id: 'thanjavur',
    name: { en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
    center: [290, 255],
    pathD: 'M 275,242 L 310,242 L 308,280 L 275,275 Z',
    subDistrictIds: ['thanjavur-central', 'thanjavur-north', 'thanjavur-south']
  },
  {
    id: 'pudukottai',
    name: { en: 'Pudukkottai', ta: 'புதுக்கோட்டை' },
    center: [275, 292],
    pathD: 'M 255,278 L 298,276 L 295,315 L 255,310 Z',
    subDistrictIds: ['pudukottai-north', 'pudukottai-south']
  },
  {
    id: 'dindugal',
    name: { en: 'Dindigul', ta: 'திண்டுக்கல்' },
    center: [195, 285],
    pathD: 'M 175,265 L 225,265 L 220,312 L 170,305 Z',
    subDistrictIds: ['dindugal-east', 'dindugal-west']
  },
  {
    id: 'theni',
    name: { en: 'Theni', ta: 'தேனி' },
    center: [165, 320],
    pathD: 'M 145,305 L 182,305 L 180,345 L 145,340 Z',
    subDistrictIds: ['theni-north', 'theni-south']
  },
  {
    id: 'madurai',
    name: { en: 'Madurai', ta: 'மதுரை' },
    center: [215, 330],
    pathD: 'M 195,312 L 240,312 L 238,355 L 192,350 Z',
    subDistrictIds: ['madurai-city', 'madurai-north', 'madurai-south']
  },
  {
    id: 'sivagangai',
    name: { en: 'Sivaganga', ta: 'சிவகங்கை' },
    center: [265, 332],
    pathD: 'M 242,318 L 290,315 L 285,355 L 240,352 Z',
    subDistrictIds: ['sivagangai']
  },
  {
    id: 'ramanathapuram',
    name: { en: 'Ramanathapuram', ta: 'ராமநாதபுரம்' },
    center: [280, 375],
    pathD: 'M 250,358 L 320,358 L 305,400 L 250,395 Z',
    subDistrictIds: ['ramanathapuram']
  },
  {
    id: 'virudhunagar',
    name: { en: 'Virudhunagar', ta: 'விருதுநகர்' },
    center: [195, 375],
    pathD: 'M 175,358 L 225,358 L 222,398 L 175,395 Z',
    subDistrictIds: ['virudhunagar-north', 'virudhunagar-south']
  },
  {
    id: 'thenkasi',
    name: { en: 'Tenkasi', ta: 'தென்காசி' },
    center: [165, 415],
    pathD: 'M 148,398 L 185,398 L 182,438 L 145,432 Z',
    subDistrictIds: ['thenkasi-north', 'thenkasi-south']
  },
  {
    id: 'thoothukudi',
    name: { en: 'Thoothukudi', ta: 'தூத்துக்குடி' },
    center: [225, 420],
    pathD: 'M 205,400 L 250,398 L 245,450 L 205,445 Z',
    subDistrictIds: ['thoothukudi-north', 'thoothukudi-south']
  },
  {
    id: 'tirunelveli',
    name: { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
    center: [185, 445],
    pathD: 'M 165,430 L 210,430 L 205,475 L 165,470 Z',
    subDistrictIds: ['tirunelveli-central', 'tirunelveli-east']
  },
  {
    id: 'kanniyakumari',
    name: { en: 'Kanniyakumari', ta: 'கன்னியாகுமரி' },
    center: [175, 485],
    pathD: 'M 160,472 L 195,472 L 188,505 L 160,500 Z',
    subDistrictIds: ['kanniyakumari-east', 'kanniyakumari-west']
  },
  {
    id: 'puducherry',
    name: { en: 'Puducherry & Karaikal', ta: 'புதுச்சேரி & காரைக்கால்' },
    center: [322, 172],
    pathD: 'M 320,165 L 330,165 L 330,178 L 320,178 Z',
    subDistrictIds: ['puducherry', 'karaikal']
  }
];

export const TamilNaduMap: React.FC = () => {
  const { language } = useLanguage();
  const { districts } = useData();

  // Default selection: Tiruvannamalai (matches user's reference mockup image!)
  const [selectedAdminId, setSelectedAdminId] = useState<string>('tiruvannamalai');
  const [hoveredAdminId, setHoveredAdminId] = useState<string | null>(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<DistrictInfo | null>(null);
  const [showFullDirectoryModal, setShowFullDirectoryModal] = useState<boolean>(false);
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>('All');

  // Find active admin district
  const activeAdminDistrict = useMemo(() => {
    return (
      TN_ADMIN_DISTRICTS.find((d) => d.id === selectedAdminId) ||
      TN_ADMIN_DISTRICTS[0]
    );
  }, [selectedAdminId]);

  // Retrieve matching party sub-districts for the selected administrative district
  const currentSubDistricts = useMemo(() => {
    return activeAdminDistrict.subDistrictIds
      .map((subId) => districts.find((d) => d.id === subId))
      .filter((d): d is DistrictInfo => Boolean(d));
  }, [activeAdminDistrict, districts]);

  // Filtered 74 districts for the directory modal
  const filtered74Districts = useMemo(() => {
    return districts.filter((d) => {
      const matchesZone = zoneFilter === 'All' || d.zone === zoneFilter;
      const q = directorySearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.name[language].toLowerCase().includes(q) ||
        d.organizer[language].toLowerCase().includes(q) ||
        d.contactPhone.includes(q) ||
        d.headquarters[language].toLowerCase().includes(q);
      return matchesZone && matchesSearch;
    });
  }, [districts, zoneFilter, directorySearch, language]);

  return (
    <div className="w-full bg-[#8A0005] text-white font-dmk-body relative overflow-hidden p-4 sm:p-8 lg:p-10 border-y-4 border-[#111111] shadow-2xl">
      
      {/* Background Graphic Watermark */}
      <div 
        className="absolute inset-0 opacity-10 bg-repeat pointer-events-none select-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 1. TOP HEADER BAR: "District Structure" + "View More ↗" Button (Matching Image 3) */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/20 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#FFD166] inline-block" />
            <span className="text-[11px] font-english font-bold uppercase tracking-[0.2em] text-[#FFD166]">
              {language === 'ta' ? 'அமைப்பு மாவட்டக் கட்டமைப்பு' : 'ORGANISATIONAL DIRECTORY'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-dmk-headline tracking-tight uppercase">
            {language === 'ta' ? 'மாவட்டக் கட்டமைப்பு' : 'District Structure'}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-dmk-body mt-1">
            {language === 'ta'
              ? 'தமிழ்நாட்டின் 38 வருவாய் மாவட்டங்களில் செயல்படும் 74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள்'
              : '74 Party Legal Wing Units across all jurisdictions of Tamil Nadu and Puducherry'}
          </p>
        </div>

        {/* "View More ↗" Yellow Pill Button (Exact match to Image 3) */}
        <button
          onClick={() => setShowFullDirectoryModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFD166] hover:bg-white text-neutral-900 text-xs sm:text-sm font-english font-black uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>{language === 'ta' ? 'அனைத்து 74 மாவட்டங்கள்' : 'View More'}</span>
          <span className="text-base leading-none">↗</span>
        </button>
      </div>

      {/* 2. MAIN 2-COLUMN SPLIT (Map & Inset on Left, Leader Banner & Units on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: TAMIL NADU MAP + ZOOMED INSET (7 cols)        */}
        {/* ========================================================== */}
        <div className="lg:col-span-7 bg-[#780004]/90 border border-white/30 p-5 sm:p-7 relative shadow-inner flex flex-col md:flex-row items-center gap-6">
          
          {/* Main Tamil Nadu Map SVG */}
          <div className="w-full md:w-3/5 aspect-[4/5] relative flex items-center justify-center">
            <svg
              viewBox="90 40 280 480"
              className="w-full h-full filter drop-shadow-lg"
            >
              {/* All Districts Paths */}
              {TN_ADMIN_DISTRICTS.map((dist) => {
                const isSelected = activeAdminDistrict.id === dist.id;
                const isHovered = hoveredAdminId === dist.id;

                return (
                  <path
                    key={dist.id}
                    d={dist.pathD}
                    onClick={() => setSelectedAdminId(dist.id)}
                    onMouseEnter={() => setHoveredAdminId(dist.id)}
                    onMouseLeave={() => setHoveredAdminId(null)}
                    fill={isSelected ? '#F59E0B' : isHovered ? '#FFD166' : '#FFFFFF'}
                    stroke="#8A0005"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-200 hover:scale-105 origin-center"
                  />
                );
              })}

              {/* District Labels */}
              {TN_ADMIN_DISTRICTS.map((dist) => {
                const isSelected = activeAdminDistrict.id === dist.id;
                return (
                  <text
                    key={`lbl-${dist.id}`}
                    x={dist.center[0]}
                    y={dist.center[1]}
                    textAnchor="middle"
                    fill={isSelected ? '#111111' : '#660000'}
                    fontSize="7"
                    fontWeight="bold"
                    className="pointer-events-none select-none font-english"
                  >
                    {dist.name.en.slice(0, 3).toUpperCase()}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Inset Box showing Zoomed District Outline (Matching Image 3) */}
          <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-4 bg-[#630003] border-2 border-white/40 shadow-xl">
            <span className="text-xs font-english font-bold uppercase tracking-wider text-[#FFD166] text-center mb-2">
              {activeAdminDistrict.name[language]}
            </span>
            
            {/* Zoomed SVG contour with sub-division lines */}
            <div className="w-40 h-40 relative flex items-center justify-center my-2">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Outer Zoomed Shape */}
                <polygon
                  points="20,15 75,10 90,45 80,85 45,95 15,75 10,40"
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                {/* Internal sub-district boundary lines */}
                <line x1="20" y1="15" x2="45" y2="95" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="10" y1="40" x2="80" y2="85" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="75" y1="10" x2="45" y2="50" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="mt-2 text-center text-[11px] text-white/90 font-english space-y-1">
              <span className="inline-block px-2.5 py-0.5 bg-[#FFD166] text-neutral-900 font-bold uppercase tracking-wider text-[10px]">
                {currentSubDistricts.length} {language === 'ta' ? 'அமைப்புப் பிரிவுகள்' : 'Party Units'}
              </span>
              <p className="text-white/70 text-[10px]">
                {language === 'ta' ? 'கள வழக்கறிஞர் பாதுகாப்பு நெட்வொர்க்' : 'Jurisdictional Legal Cadre'}
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: LEADER BANNER & SUB-DISTRICT CARDS (5 cols)  */}
        {/* ========================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Official DMK Leadership & Rising Sun Flag Banner (Matching Image 3 header) */}
          <div className="w-full bg-[#111111] border-2 border-white/30 overflow-hidden relative shadow-lg">
            
            {/* Top red/black dual-tone stripe */}
            <div className="h-1.5 w-full flex">
              <div className="w-1/2 bg-[#E31E24]" />
              <div className="w-1/2 bg-black" />
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              
              {/* Leader portrait + attribution */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FFD166] shrink-0 bg-neutral-900">
                  <img
                    src="/images/dmk-four-leaders.jpg"
                    alt="DMK Leadership"
                    className="w-full h-full object-cover object-right"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#FFD166] block">
                    {language === 'ta' ? 'மாநிலத் தலைமை வழிகாட்டல்' : 'STATE EXECUTIVE COMMAND'}
                  </span>
                  <h4 className="text-sm font-black text-white font-dmk-headline leading-tight">
                    {language === 'ta' ? 'மு.க. ஸ்டாலின்' : 'M.K. Stalin'}
                  </h4>
                  <p className="text-[10px] text-white/70 font-english">
                    {language === 'ta' ? 'கழகத் தலைவர் & முதலமைச்சர்' : 'DMK President & Chief Minister'}
                  </p>
                </div>
              </div>

              {/* DMK Flag with Rising Sun badge */}
              <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-r from-red-600 via-red-700 to-black border border-white/20 px-3">
                <span className="text-xs font-black tracking-wider text-white uppercase font-english">
                  DMK
                </span>
                <span className="text-[9px] text-[#FFD166] font-bold">
                  LEGAL WING
                </span>
              </div>

            </div>
          </div>

          {/* Sub-Districts List (Matching Image 3 white pill cards) */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {currentSubDistricts.map((sub, index) => (
              <div
                key={sub.id}
                className="bg-white text-neutral-900 p-3 sm:p-3.5 border border-neutral-300 shadow-sm flex items-center justify-between gap-3 hover:border-black transition-all group"
              >
                
                {/* Number badge & Sub-district Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 bg-[#E31E24] text-white rounded-full flex items-center justify-center text-xs font-english font-black shrink-0 shadow-xs">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-black font-dmk-headline text-neutral-900 group-hover:text-[#E31E24] transition-colors truncate">
                      {sub.name[language]}
                    </h5>
                    <p className="text-[11px] text-neutral-600 truncate font-dmk-body">
                      {sub.organizer[language]} • <span className="font-mono text-neutral-800">{sub.contactPhone}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons (Eye Icon + Phone/Call Icon) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  
                  {/* View Details modal button */}
                  <button
                    onClick={() => setSelectedSubDistrict(sub)}
                    className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                    title={language === 'ta' ? 'பொறுப்பாளர் விவரம்' : 'View Officer Dossier'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Direct Phone Call button */}
                  <a
                    href={`tel:${sub.contactPhone}`}
                    className="p-1.5 text-neutral-500 hover:text-[#E31E24] hover:bg-neutral-100 transition-colors"
                    title={`Call ${sub.contactPhone}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 3. SUB-DISTRICT DETAILS POPUP MODAL (When clicking Eye icon) */}
      {selectedSubDistrict && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-neutral-900 max-w-lg w-full border-2 border-neutral-900 p-6 sm:p-8 shadow-2xl relative font-dmk-body">
            
            {/* Header bar */}
            <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#E31E24] block mb-1">
                  OFFICIAL DISTRICT LEGAL DOSSIER
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 font-dmk-headline">
                  {selectedSubDistrict.name[language]}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubDistrict(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-white border border-neutral-300 space-y-1">
                <span className="text-[10px] font-english font-bold uppercase text-neutral-500 block">
                  {language === 'ta' ? 'மாவட்ட அமைப்பாளர்' : 'DISTRICT ORGANIZER'}
                </span>
                <p className="text-base font-bold text-neutral-900 font-dmk-headline">
                  {selectedSubDistrict.organizer[language]}
                </p>
                <p className="text-xs text-neutral-600 font-english">
                  Senior Trial Advocate • DMK Legal Wing
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-neutral-300">
                  <span className="text-[10px] font-english font-bold uppercase text-neutral-500 block mb-1">
                    {language === 'ta' ? 'தொலைபேசி' : 'PHONE CONTACT'}
                  </span>
                  <a
                    href={`tel:${selectedSubDistrict.contactPhone}`}
                    className="font-mono font-bold text-[#E31E24] hover:underline"
                  >
                    {selectedSubDistrict.contactPhone}
                  </a>
                </div>
                <div className="p-3 bg-white border border-neutral-300">
                  <span className="text-[10px] font-english font-bold uppercase text-neutral-500 block mb-1">
                    {language === 'ta' ? 'மண்டலம்' : 'PARTY ZONE'}
                  </span>
                  <span className="font-bold text-neutral-900">
                    {selectedSubDistrict.zone}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-neutral-300 space-y-1">
                <span className="text-[10px] font-english font-bold uppercase text-neutral-500 block">
                  {language === 'ta' ? 'நீதிமன்ற வளாகம்' : 'ATTACHED COURT COMPLEX'}
                </span>
                <p className="text-neutral-800 font-dmk-body">
                  {selectedSubDistrict.courtComplex[language]}
                </p>
              </div>

              <div className="p-3 bg-white border border-neutral-300 space-y-1">
                <span className="text-[10px] font-english font-bold uppercase text-neutral-500 block">
                  {language === 'ta' ? 'மாவட்ட தலைமையகம்' : 'HEADQUARTERS'}
                </span>
                <p className="text-neutral-800 font-dmk-body">
                  {selectedSubDistrict.headquarters[language]}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-300 flex items-center justify-between">
              <a
                href={`tel:${selectedSubDistrict.contactPhone}`}
                className="px-4 py-2 bg-[#E31E24] hover:bg-black text-white text-xs font-english font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'அழைக்க' : 'Direct Call'}</span>
              </a>

              <button
                onClick={() => setSelectedSubDistrict(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-english font-bold uppercase tracking-wider transition-colors"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. FULL 74 DISTRICT CADRE DIRECTORY MODAL (When clicking "View More ↗") */}
      {showFullDirectoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-neutral-900 max-w-5xl w-full max-h-[90vh] flex flex-col border-2 border-neutral-900 shadow-2xl relative font-dmk-body">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#111111] text-white flex items-center justify-between border-b-2 border-[#E31E24]">
              <div>
                <span className="text-[10px] font-english font-bold uppercase tracking-widest text-[#FFD166] block">
                  OFFICIAL CADRE GAZETTE • TAMIL NADU & PUDUCHERRY
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-dmk-headline">
                  {language === 'ta' ? '74 அமைப்பு மாவட்ட வழக்கறிஞர் அணிகள் முழுப் பட்டியல்' : 'Complete 74 District Legal Cadre Directory'}
                </h3>
              </div>
              <button
                onClick={() => setShowFullDirectoryModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-white border-b border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder={language === 'ta' ? 'மாவட்டம் அல்லது பொறுப்பாளர் தேடுக...' : 'Search district, organizer or phone...'}
                  className="w-full bg-[#FAF7F2] border border-neutral-300 pl-9 pr-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Zonal Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-english">
                {['All', 'Chennai', 'North', 'West', 'Central', 'South'].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoneFilter(z)}
                    className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border transition-colors ${
                      zoneFilter === z
                        ? 'bg-[#E31E24] text-white border-[#E31E24]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Table of 74 Districts (Matching Images 4-7) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F5]">
              <div className="border border-neutral-300 bg-white overflow-x-auto">
                <table className="w-full text-left text-xs font-dmk-body">
                  <thead className="bg-[#111111] text-white font-english text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-neutral-700 w-12 text-center">No.</th>
                      <th className="py-2.5 px-3 border-b border-neutral-700">District Unit</th>
                      <th className="py-2.5 px-3 border-b border-neutral-700">Organiser</th>
                      <th className="py-2.5 px-3 border-b border-neutral-700">Phone</th>
                      <th className="py-2.5 px-3 border-b border-neutral-700">Court Complex</th>
                      <th className="py-2.5 px-3 border-b border-neutral-700 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filtered74Districts.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-500">
                          {item.number || idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-neutral-900 font-dmk-headline">
                          {item.name[language]}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-neutral-800">
                          {item.organizer[language]}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#E31E24]">
                          <a href={`tel:${item.contactPhone}`} className="hover:underline">
                            {item.contactPhone}
                          </a>
                        </td>
                        <td className="py-2.5 px-3 text-neutral-600 truncate max-w-xs">
                          {item.courtComplex[language]}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedSubDistrict(item)}
                            className="p-1 hover:text-[#E31E24] text-neutral-500"
                            title="View Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-neutral-300 flex items-center justify-between text-xs font-english">
              <span className="text-neutral-600">
                Displaying <strong>{filtered74Districts.length}</strong> of <strong>74</strong> District Secretariats
              </span>
              <button
                onClick={() => setShowFullDirectoryModal(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-[#E31E24] text-white font-bold uppercase tracking-wider transition-colors"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
